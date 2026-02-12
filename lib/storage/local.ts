import fs from 'node:fs/promises';
import path from 'node:path';

const uploadDir = process.env.UPLOAD_DIR ?? './data/uploads';

export const ensureUploadDir = async () => {
  await fs.mkdir(uploadDir, { recursive: true });
};

export const saveUpload = async (fileName: string, bytes: Buffer) => {
  await ensureUploadDir();
  const safeName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const absolutePath = path.join(uploadDir, safeName);
  await fs.writeFile(absolutePath, bytes);
  return absolutePath;
};

export const deleteUpload = async (absolutePath: string) => {
  await fs.rm(absolutePath, { force: true });
};
