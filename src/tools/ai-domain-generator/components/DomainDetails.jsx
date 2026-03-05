export function DomainDetailsPanel({ details }) {
  if (!details) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-semibold text-slate-900">
          Domain Details
        </div>
        <div className="mt-2 text-sm text-slate-500">
          Select a domain card to see length, keywords, brand score, and similar
          suggestions.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-sm font-semibold text-slate-900">
            Domain Details
          </div>
          <div className="mt-1 text-base font-semibold text-slate-900">
            {details.domain}
          </div>
        </div>

        {/* Length badge */}
        <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
          Length: {details.length}
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Keyword breakdown
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {details.keywordBreakdown.map((k) => (
              <div
                key={k}
                className="inline-flex rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700"
              >
                {k}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Brand score
          </div>
          <div className="mt-2 flex items-center gap-3">
            <div className="h-2 w-full rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-slate-900"
                style={{ width: `${details.brandScore}%` }}
              />
            </div>
            <div className="w-12 text-right text-sm font-semibold text-slate-900">
              {details.brandScore}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Similar suggestions
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {details.similar.map((s) => (
            <div
              key={s}
              className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
