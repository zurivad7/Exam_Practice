import fs from 'node:fs/promises';
import pdf from 'pdf-parse';
import { normalizeText } from './normalize';

export interface ParsedPage {
  pageNumber: number;
  rawText: string;
}

const maybeRunOCR = async (filePath: string): Promise<ParsedPage[]> => {
  if (process.env.ENABLE_OCR !== 'true') return [];
  const pageLimit = Number(process.env.OCR_PAGE_LIMIT ?? '5');
  return [
    {
      pageNumber: 1,
      rawText: `[OCR placeholder] OCR extraction not implemented. Configure Tesseract pipeline. pageLimit=${pageLimit} source=${filePath}`
    }
  ];
};

export const parsePdfWithPages = async (filePath: string): Promise<ParsedPage[]> => {
  const buffer = await fs.readFile(filePath);
  const pages: ParsedPage[] = [];

  await pdf(buffer, {
    pagerender: async (pageData) => {
      const text = await pageData.getTextContent();
      const rendered = text.items.map((item: { str: string }) => item.str).join(' ');
      pages.push({
        pageNumber: pageData.pageIndex + 1,
        rawText: normalizeText(rendered)
      });
      return rendered;
    }
  });

  if (pages.length === 0) {
    return maybeRunOCR(filePath);
  }

  return pages;
};
