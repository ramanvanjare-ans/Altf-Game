import { Search, Code, Image as ImageIcon, CheckCircle } from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="max-w-8xl mx-auto px-4 py-10 text-(--foreground)">
      <h1 className="text-3xl font-bold text-center mb-8">How It Works</h1>

      {/* 3 Step Process */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* STEP 1 */}
        <div
          className="
            bg-(--card) 
            text-(--foreground)
            p-6 rounded-xl shadow 
            hover:shadow-lg transition
            border border-(--border)
          "
        >
          <Search className="w-10 h-10 text-(--primary) mb-3" />
          <h3 className="text-xl font-semibold mb-2">1. Enter HTTP Code</h3>
          <p className="text-(--muted-foreground)">
            Type any HTTP status code like 200, 404, 500 in the search box.
          </p>
        </div>

        {/* STEP 2 */}
        <div
          className="
            bg-(--card) 
            text-(--foreground)
            p-6 rounded-xl shadow 
            hover:shadow-lg transition
            border border-(--border)
          "
        >
          <Code className="w-10 h-10 text-green-500 mb-3" />
          <h3 className="text-xl font-semibold mb-2">
            2. We Fetch Explanation
          </h3>
          <p className="text-(--muted-foreground)">
            We pull structured data + category + examples from our dataset.
          </p>
        </div>

        {/* STEP 3 */}
        <div
          className="
            bg-(--card) 
            text-(--foreground)
            p-6 rounded-xl shadow 
            hover:shadow-lg transition
            border border-(--border)
          "
        >
          <ImageIcon className="w-10 h-10 text-purple-500 mb-3" />
          <h3 className="text-xl font-semibold mb-2">3. Show HTTP Cat Image</h3>
          <p className="text-(--muted-foreground)">
            The tool loads image from <b>HTTP Cats API</b> automatically.
          </p>
        </div>
      </div>

      {/* FINAL TOUCH */}
      <div
        className="
          flex items-center gap-3 mt-10
          bg-(--muted)
          p-5 rounded-xl
          border border-(--border)
          text-(--foreground)
        "
      >
        <CheckCircle className="w-8 h-8 text-(--primary)" />
        <p className="text-lg">
          That’s it! A clean and simple way to understand any HTTP status code.
        </p>
      </div>
    </div>
  );
}
