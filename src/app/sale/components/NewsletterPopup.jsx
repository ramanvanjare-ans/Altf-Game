"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Mail, Sparkles } from "lucide-react";

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

//  useEffect(() => {
//   if (typeof window === "undefined") return;

//   const lastSeen = localStorage.getItem("newsletterPopupSeen");
//   const sevenDays =  7 * 24 * 60 * 60 * 1000; // Popup shows again after 7 days

//   if (!lastSeen || Date.now() - Number(lastSeen) > sevenDays) {
//     const timer = setTimeout(() => {
//       setIsOpen(true);
//     }, 5000);

//     return () => clearTimeout(timer);
//   }
// }, []);

useEffect(() => {
  const timer = setTimeout(() => {
    setIsOpen(true);
  }, 5000); // opens after 5 second

  return () => clearTimeout(timer);
}, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("newsletterPopupSeen", Date.now().toString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
 

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);
     setEmail("");
localStorage.setItem("newsletterPopupSeen", Date.now().toString());

    // Close after success
    setTimeout(() => {
      setIsOpen(false);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="newsletter-title"
            aria-describedby="newsletter-description"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg mx-4"
          >
            <div className="bg-(--card) rounded-3xl shadow-2xl overflow-hidden border border-(--border)">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-(--background) border border-(--border) flex items-center justify-center text-(--muted-foreground) hover:text-(--foreground) hover:scale-110 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              {!isSuccess ? (
                <>
                  {/* Header with Animation */}
                  <div className="relative bg-linear-to-br from-(--primary) to-(--primary)/60 p-8 text-center overflow-hidden">
                    {/* Animated Background Elements */}
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl"
                    />
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -90, 0],
                      }}
                      transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"
                    />

                    {/* Icon */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-4 relative z-10"
                    >
                      <Gift className="w-10 h-10 text-white" />
                    </motion.div>

                    {/* Title */}
                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl font-bold text-white mb-3 relative z-10"
                    >
                      Get Upto 20% Off!
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-white/90 text-lg relative z-10"
                    >
                      Subscribe & save on your first order
                    </motion.p>
                  </div>

                  {/* Form */}
                  <div className="p-8">
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-(--primary)/10 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-(--primary)" />
                        </div>
                        <p className="text-(--foreground) text-sm">
                          Exclusive early access to flash sales
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-(--primary)/10 flex items-center justify-center">
                          <Mail className="w-5 h-5 text-(--primary)" />
                        </div>
                        <p className="text-(--foreground) text-sm">
                          Weekly deals delivered to your inbox
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-(--primary)/10 flex items-center justify-center">
                          <Gift className="w-5 h-5 text-(--primary)" />
                        </div>
                        <p className="text-(--foreground) text-sm">
                          Birthday month special offers
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          required
                          className="w-full px-5 py-4 rounded-xl bg-(--background) border border-(--border) text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--primary) transition"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full px-6 py-4 bg-(--primary) text-(--primary-foreground) font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            />
                            <span>Subscribing...</span>
                          </>
                        ) : (
                          <>
                            <Gift className="w-5 h-5" />
                            <span>Claim My 20% Discount</span>
                          </>
                        )}
                      </button>
                    </form>

                    <p className="text-xs text-(--muted-foreground) text-center mt-4">
                      Unsubscribe anytime. We respect your privacy.
                    </p>
                  </div>
                </>
              ) : (
                // Success State
                <div className="p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-6"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <svg
                        className="w-10 h-10 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </motion.div>
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-bold text-(--foreground) mb-3"
                  >
                    You're In! 🎉
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-(--muted-foreground)"
                  >
                    Check your inbox for your exclusive 20% discount code
                  </motion.p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}