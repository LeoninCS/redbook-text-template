import { OUTPUT_SIZE } from "./renderer.js";

export const EXPORT_SCALES = [1, 2, 3];

export function parsePageRange(input, pageCount) {
  const trimmed = String(input || "").trim();
  if (!trimmed) return Array.from({ length: pageCount }, (_, index) => index + 1);

  const pages = new Set();
  for (const part of trimmed.split(",")) {
    const token = part.trim();
    const rangeMatch = token.match(/^(\d+)\s*-\s*(\d+)$/);
    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);
      const min = Math.min(start, end);
      const max = Math.max(start, end);
      for (let page = min; page <= max; page += 1) {
        if (page >= 1 && page <= pageCount) pages.add(page);
      }
      continue;
    }

    const page = Number(token);
    if (Number.isInteger(page) && page >= 1 && page <= pageCount) pages.add(page);
  }

  return [...pages].sort((a, b) => a - b);
}

export function buildExportFilename(templateId, pageNumber, extension) {
  const pageLabel = String(pageNumber).padStart(2, "0");
  return `redbook-template-${templateId}-${pageLabel}.${extension}`;
}

export function buildExportSummary(input, pageCount, scale = 2, size = OUTPUT_SIZE) {
  const pages = parsePageRange(input, pageCount);
  const normalizedScale = Math.max(1, Math.min(3, Number(scale) || 2));
  const width = size.width * normalizedScale;
  const height = size.height * normalizedScale;
  const isValid = pages.length > 0;

  return {
    pages,
    pageCount,
    selectedCount: pages.length,
    scale: normalizedScale,
    width,
    height,
    isValid,
    message: isValid
      ? `将导出 ${pages.length} / ${pageCount} 页，${normalizedScale}x，${width} x ${height} px。`
      : "页码范围为空，请输入如 1-3,5。",
  };
}

function crc32(bytes) {
  let crc = -1;
  for (const byte of bytes) {
    crc ^= byte;
    for (let index = 0; index < 8; index += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ -1) >>> 0;
}

function writeUint16(bytes, value) {
  bytes.push(value & 0xff, (value >>> 8) & 0xff);
}

function writeUint32(bytes, value) {
  bytes.push(value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff);
}

function writeBytes(bytes, values) {
  bytes.push(...values);
}

export function createZipBlob(files) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralDirectory = [];
  let offset = 0;

  for (const file of files) {
    const nameBytes = encoder.encode(file.name);
    const content = file.bytes;
    const checksum = crc32(content);
    const localHeader = [];
    writeUint32(localHeader, 0x04034b50);
    writeUint16(localHeader, 20);
    writeUint16(localHeader, 0);
    writeUint16(localHeader, 0);
    writeUint16(localHeader, 0);
    writeUint16(localHeader, 0);
    writeUint32(localHeader, checksum);
    writeUint32(localHeader, content.length);
    writeUint32(localHeader, content.length);
    writeUint16(localHeader, nameBytes.length);
    writeUint16(localHeader, 0);
    writeBytes(localHeader, nameBytes);
    writeBytes(localHeader, content);
    localParts.push(new Uint8Array(localHeader));

    const centralHeader = [];
    writeUint32(centralHeader, 0x02014b50);
    writeUint16(centralHeader, 20);
    writeUint16(centralHeader, 20);
    writeUint16(centralHeader, 0);
    writeUint16(centralHeader, 0);
    writeUint16(centralHeader, 0);
    writeUint16(centralHeader, 0);
    writeUint32(centralHeader, checksum);
    writeUint32(centralHeader, content.length);
    writeUint32(centralHeader, content.length);
    writeUint16(centralHeader, nameBytes.length);
    writeUint16(centralHeader, 0);
    writeUint16(centralHeader, 0);
    writeUint16(centralHeader, 0);
    writeUint16(centralHeader, 0);
    writeUint32(centralHeader, 0);
    writeUint32(centralHeader, offset);
    writeBytes(centralHeader, nameBytes);
    centralDirectory.push(new Uint8Array(centralHeader));
    offset += localHeader.length;
  }

  const centralSize = centralDirectory.reduce((total, item) => total + item.length, 0);
  const end = [];
  writeUint32(end, 0x06054b50);
  writeUint16(end, 0);
  writeUint16(end, 0);
  writeUint16(end, files.length);
  writeUint16(end, files.length);
  writeUint32(end, centralSize);
  writeUint32(end, offset);
  writeUint16(end, 0);

  return new Blob([...localParts, ...centralDirectory, new Uint8Array(end)], { type: "application/zip" });
}

function dataUrlToBytes(dataUrl) {
  const base64 = String(dataUrl).split(",")[1] || "";
  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
}

function dataUrlMimeType(dataUrl) {
  return String(dataUrl).match(/^data:([^;,]+)/)?.[1] || "";
}

function escapePdfText(text) {
  return String(text).replace(/[\\()]/g, "\\$&");
}

export function createPdfBlob(imageDataUrls, size = OUTPUT_SIZE) {
  const encoder = new TextEncoder();
  const objects = [];

  function addObject(content) {
    objects.push(Array.isArray(content) ? content : [content]);
    return objects.length;
  }

  function encodePart(part) {
    return typeof part === "string" ? encoder.encode(part) : part;
  }

  const pageRefs = [];
  const pagesRef = 2;
  addObject("<< /Type /Catalog /Pages 2 0 R >>");
  addObject("");

  imageDataUrls.forEach((dataUrl, index) => {
    const mimeType = dataUrlMimeType(dataUrl);
    if (mimeType !== "image/jpeg") {
      throw new Error(`PDF export supports image/jpeg data URLs, received ${mimeType || "unknown"}.`);
    }
    const imageBytes = dataUrlToBytes(dataUrl);
    const imageRef = addObject([
      `<< /Type /XObject /Subtype /Image /Width ${size.width} /Height ${size.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBytes.length} >>\nstream\n`,
      imageBytes,
      "\nendstream",
    ]);
    const content = `q\n${size.width} 0 0 ${size.height} 0 0 cm\n/Im${index + 1} Do\nQ\n`;
    const contentRef = addObject(`<< /Length ${content.length} >>\nstream\n${content}endstream`);
    const pageRef = addObject(`<< /Type /Page /Parent ${pagesRef} 0 R /MediaBox [0 0 ${size.width} ${size.height}] /Resources << /XObject << /Im${index + 1} ${imageRef} 0 R >> >> /Contents ${contentRef} 0 R >>`);
    pageRefs.push(pageRef);
  });

  objects[pagesRef - 1] = [`<< /Type /Pages /Kids [${pageRefs.map((ref) => `${ref} 0 R`).join(" ")}] /Count ${pageRefs.length} >>`];

  const chunks = [encoder.encode("%PDF-1.4\n")];
  const offsets = [0];
  let position = chunks[0].length;
  objects.forEach((object, index) => {
    offsets.push(position);
    const objectChunks = [
      encoder.encode(`${index + 1} 0 obj\n`),
      ...object.map(encodePart),
      encoder.encode("\nendobj\n"),
    ];
    chunks.push(...objectChunks);
    position += objectChunks.reduce((total, chunk) => total + chunk.length, 0);
  });

  const xrefOffset = position;
  const xref = [
    `xref\n0 ${objects.length + 1}\n`,
    "0000000000 65535 f \n",
    ...offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`),
    `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info << /Producer (${escapePdfText("Redbook Text Template")}) >> >>\nstartxref\n${xrefOffset}\n%%EOF`,
  ].join("");
  chunks.push(encoder.encode(xref));

  return new Blob(chunks, { type: "application/pdf" });
}
