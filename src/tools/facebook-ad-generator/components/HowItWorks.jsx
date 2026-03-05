"use-client";
import React from "react";
import { BookOpen } from "lucide-react";

const HowItWorks = () => {
  return (
    <section
      //   id="how-it-works"
      className="bg-(--card) p-6 rounded-2xl shadow-xl my-10 pt-16 border border-(--border) "
    >
      <h2 className="text-3xl font-extrabold text-(--foreground) mb-8 flex items-center">
        <BookOpen size={28} className="text-(--primary) mr-3" />
        How It Works
      </h2>

      <div className="space-y-8">
        {/* STEP 1 */}
        <div className="flex items-start space-x-4">
          <div
            className={`shrink-0 flex items-center justify-center w-12 h-12 
                          rounded-full bg-(--muted) border-4 border-(--border) 
                          text-(--primary) font-bold text-xl`}
          >
            1
          </div>

          <div>
            <h3 className="text-xl font-semibold text-(--card-foreground) mb-1">
              Define Your Product
            </h3>
            <p className="text-(--muted-foreground)">
              Enter detailed information about your product or service. Include
              key features, benefits, and target audience for the best results.
            </p>
          </div>
        </div>

        {/* STEP 2 */}
        <div className="flex items-start space-x-4">
          <div
            className={`shrink-0 flex items-center justify-center w-12 h-12 
                          rounded-full bg-(--muted) border-4 border-(--border) 
                          text-(--primary) font-bold text-xl`}
          >
            2
          </div>

          <div>
            <h3 className="text-xl font-semibold text-(--card-foreground) mb-1">
              Select an Ad Tone
            </h3>
            <p className="text-(--muted-foreground)">
              Choose a tone such as &apos;Urgent (FOMO)&apos;,
              &apos;Playful&apos;, or &apos;Professional&apos;. This guides the
              AI to craft the perfect message.
            </p>
          </div>
        </div>

        {/* STEP 3 */}
        <div className="flex items-start space-x-4">
          <div
            className={`shrink-0 flex items-center justify-center w-12 h-12 
                          rounded-full bg-(--muted) border-4 border-(--border) 
                          text-(--primary) font-bold text-xl`}
          >
            3
          </div>

          <div>
            <h3 className="text-xl font-semibold text-(--card-foreground) mb-1">
              Generate & Copy
            </h3>
            <p className="text-(--muted-foreground)">
              Click &apos;Generate Ad Copy&apos;. The tool uses the API to
              instantly produce a persuasive Primary Text and three powerful
              Headlines ready to copy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
