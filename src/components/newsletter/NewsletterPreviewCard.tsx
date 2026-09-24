'use client';

interface NewsletterPreviewCardProps {
  subject: string;
  previewHtml: string;
}

export function NewsletterPreviewCard({ subject, previewHtml }: NewsletterPreviewCardProps) {
  return (
    <div className="rounded-xl border border-border bg-slate-100 dark:bg-slate-900/50 p-4 min-h-full">
      <div className="max-w-2xl mx-auto bg-white text-slate-800 rounded-xl shadow-md border border-slate-200 overflow-hidden text-sm">
        {/* Preview Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div>
            <h4 className="font-bold text-slate-900 text-base">Ismail Josim</h4>
            <p className="text-xs text-slate-500">Weekly Tech & Dev Newsletter</p>
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Newsletter
          </span>
        </div>

        {/* Preview Subject */}
        {subject && (
          <div className="px-5 pt-4 pb-1">
            <p className="font-bold text-slate-900 text-lg">{subject}</p>
          </div>
        )}

        {/* Preview Body rendered via iframe srcdoc for clean CSS isolation */}
        <div className="p-5 space-y-3">
          <iframe
            srcDoc={previewHtml}
            title="Email Preview"
            className="w-full h-112.5 border-0 rounded"
          />
        </div>

        {/* Preview Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500">
          <p>You received this email because you subscribed on ismailjosim.com.</p>
          <p className="text-[11px] text-slate-400 mt-1 underline">Unsubscribe</p>
        </div>
      </div>
    </div>
  );
}
