import Tesseract from 'tesseract.js';

export interface OcrResult {
  text: string;
  confidence: number;
}

export async function extractTextFromImage(imageDataUrl: string): Promise<OcrResult> {
  const { data } = await Tesseract.recognize(imageDataUrl, 'eng');
  return { text: data.text || '', confidence: data.confidence ?? 0 };
}

interface PdfDocument {
  getPage(pageNumber: number): Promise<PdfPage>;
}

interface PdfPage {
  getViewport(options: { scale: number }): PdfViewport;
  render(options: { canvasContext: CanvasRenderingContext2D; viewport: PdfViewport }): { promise: Promise<void> };
}

interface PdfViewport {
  width: number;
  height: number;
}

export async function renderPdfPageToImageDataUrl(pdf: PdfDocument, pageNumber: number, scale = 2): Promise<string> {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas 2D context not available');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await page.render({ canvasContext: context, viewport }).promise;
  const dataUrl = canvas.toDataURL('image/png');
  return dataUrl;
}


