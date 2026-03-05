import { ExternalLink, Sparkles, Star } from "lucide-react";
export const AppCard = ({ app, short }) => {
  return (
    <div className=" bg-(--card) group p-5 border-2 border-(--border) rounded-2xl hover:border-blue-400 hover:shadow-2xl transition-all  transform hover:-translate-y-1">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-(--foreground) mb-1 truncate group-hover:text-blue-600 transition-colors">
            {app.title}
          </h3>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-(--muted-foreground)">App Store</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-(--foreground) mb-4 leading-relaxed line-clamp-3">
        {short(app.snippet)}
      </p>
      <a
        href={app.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 gap-1.5 group-hover:gap-2.5 transition-all"
      >
        View in App Store
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
};
