import Link from 'next/link';
import { prisma } from '@/lib/db';

export default async function DocumentsPage() {
  const documents = await prisma.document.findMany({ orderBy: { uploadedAt: 'desc' } });

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="mb-3 text-xl font-semibold">Upload PDF</h2>
        <form action="/api/documents/upload" method="post" encType="multipart/form-data" className="space-y-2">
          <input type="file" name="pdf" accept="application/pdf" className="block w-full text-sm" required />
          <button className="btn" type="submit">Upload</button>
        </form>
      </div>
      <div className="card">
        <h2 className="mb-3 text-xl font-semibold">Documents</h2>
        <div className="space-y-2">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
              <Link href={`/documents/${doc.id}`} className="font-medium text-indigo-700">{doc.name}</Link>
              <form action={`/api/documents/${doc.id}/delete`} method="post">
                <button className="btn-secondary" type="submit">Delete</button>
              </form>
            </div>
          ))}
          {documents.length === 0 ? <p className="text-sm text-slate-500">No documents uploaded yet.</p> : null}
        </div>
      </div>
    </div>
  );
}
