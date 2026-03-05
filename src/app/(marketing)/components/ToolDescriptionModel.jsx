"use client";

import { useEffect } from "react";

const ToolDescriptionModel = ({ isOpen, onClose, app }) => {

  useEffect(() => {
  if (isOpen) {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow || "";
    };
  }
}, [isOpen]);
if (!isOpen || !app) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Modal */}
      <div
        className="
          relative w-full
          max-w-[95%] sm:max-w-[540px] md:max-w-[680px] lg:max-w-[760px]
          bg-(--background) rounded-3xl shadow-xl
          max-h-[92vh]
          overflow-y-auto hide-scrollbar
          animate-modal
        "
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="sticky top-3 ml-auto mr-3 mt-3 block rounded-full p-2 text-gray-400 hover:bg-gray-100 z-10"
        >
          ✕
        </button>

        {/* Image */}
        <div className="px-3 sm:px-5 md:px-6 pt-1">
         
          <div
            className="
              w-full 
              h-[150px] sm:h-[180px] md:h-[210px]
              overflow-hidden rounded-xl bg-gray-100
            "
          >
            <img
              src={app.image}
              alt={app.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div
          className="
            px-4 sm:px-6 md:px-8 lg:px-10
            pt-4 sm:pt-6
            pb-8
            space-y-6
          "
        >
          {/* Title */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-[#F3F6FB]">
              <span className="text-[#2D68C4] text-base sm:text-xl">
                {app.icon}
              </span>
            </div>

            <div>
              <h2
                className="text-[#2D68C4] font-bold tracking-[0.5px]"
                style={{              
                  fontSize: "clamp(1.25rem, 3.5vw, 1.85rem)",
                }}
              >
                {app.name}
              </h2>

              <p
                className="text-[#6B7280]"
                style={{         
                  fontSize: "clamp(0.9rem, 2.6vw, 1.05rem)",
                }}
              >
                {app.subtitle}
              </p>
            </div>
          </div>

          <hr className="border-[#E5E7EB]" />

          {/* Description */}
          <p
            className="text-[#6B7280]"
            style={{
              fontSize: "clamp(1rem, 2.8vw, 1.1rem)", 
              lineHeight: "1.75",
            }}
          >
            {app.description}
          </p>

          {/* How It Works */}
          {app.steps?.length > 0 && (
            <div className="space-y-3">
              <h3
                className="font-semibold text-[#6B7280]"
                style={{
               
                  fontSize: "clamp(1.05rem, 2.8vw, 1.15rem)", 
                }}
              >
                🛠 How It Works
              </h3>

              <ol
                className="list-decimal pl-5 space-y-2 text-[#6B7280]"
                style={{
                  
                  fontSize: "clamp(0.95rem, 2.6vw, 1.05rem)",
                }}
              >
                {app.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          {/* What You’ll Get */}
          {app.whatYouGet?.length > 0 && (
            <div className="space-y-3">
              <h3
                className="font-semibold text-[#6B7280]"
                style={{
            
                  fontSize: "clamp(1.05rem, 2.8vw, 1.15rem)",
                }}
              >
                🎯 What You’ll Get
              </h3>

              <ol
                className="list-decimal pl-5 space-y-2 text-[#6B7280]"
                style={{
             
                  fontSize: "clamp(0.95rem, 2.6vw, 1.05rem)",
                }}
              >
                {app.whatYouGet.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>
            </div>
          )}

          {/* CTA */}
          <div className="flex justify-center pt-4 sm:pt-6">
            <button
              className="
                px-10 sm:px-14 py-2.5 sm:py-3
                rounded-md
                bg-[#2D68C4]
                 text-white
                border border-[#9BA2AE]/60
                shadow-[0_1px_8.2px_rgba(157,163,175,0.25)]
                hover:scale-[1.03]
                transition
              "
              style={{
                fontFamily: "Bricolage Grotesque",
                fontWeight: 600,
                 fontSize: "1.05rem",
                letterSpacing: "0.5px",
                lineHeight: "1.5rem",
              }}
            >
              Try Now
            </button>
          </div>
        </div>
      </div>

      {/* Animation + scrollbar hide */}
      <style>{`
        @keyframes modal {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-modal {
          animation: modal 0.25s ease-out;
        }

        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ToolDescriptionModel;
