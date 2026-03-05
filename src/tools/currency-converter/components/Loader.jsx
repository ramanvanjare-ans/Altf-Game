"use client";

const Loader = () => (
  <div className="py-4 text-center">
    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-pink-400"></div>

    <p className="mt-2 text-(--muted-foreground)">Fetching rates...</p>
  </div>
);

export default Loader;
