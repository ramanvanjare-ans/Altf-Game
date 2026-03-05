import { Copy, RefreshCcw, ExternalLink, Loader2, Sparkles } from "lucide-react";



export function DomainCard({
  domain,
  onCopy,
  onRegenerateOne,
  isChecking,
  availabilityError,
}) {
  const a = availabilityError ? "unknown" : domain.availability;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="truncate text-base font-semibold text-slate-900">
              {domain.name}
            </div>

            {/* Availability badge */}
            <div
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium shrink-0",
                availabilityColor(a)
              )}
            >
              {isChecking ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Checking…
                </>
              ) : availabilityError ? (
                "Unable, check availability"
              ) : (
                availabilityLabel(a)
              )}
            </div>

            {/* Style badge */}
            <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-700">
              <Sparkles className="h-3.5 w-3.5" />
              {styleLabel(domain.style)}
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="rounded-md bg-slate-50 px-2 py-1">
              SLD: {domain.sld}
            </span>
            <span className="rounded-md bg-slate-50 px-2 py-1">
              TLD: {domain.tld}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            onClick={() => onCopy(domain.name)}
            title="Copy domain"
          >
            <Copy className="h-4 w-4" />
          </button>

          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            onClick={() => onRegenerateOne(domain.id)}
            title="Refresh / regenerate"
          >
            <RefreshCcw className="h-4 w-4" />
          </button>

          <a
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            href={`https://www.google.com/search?q=${encodeURIComponent(
              domain.name + " domain"
            )}`}
            target="_blank"
            rel="noreferrer"
            title="Search"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      {domain.priceHint ? (
        <div className="mt-3 text-xs text-slate-500">
          {domain.priceHint}
        </div>
      ) : null}
    </div>
  );
}
