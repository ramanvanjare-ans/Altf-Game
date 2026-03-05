"use client"
import React, { useState } from "react"
import { Check, Zap, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"

function AllBrand({ data }) {
  const [open, setOpen] = useState(false)

  // Check if data has tags array
  const hasVerified = data?.tags?.includes("Verified")
  const hasFlashSale = data?.tags?.includes("Flash Sale")

  return (
    <div className="rounded-lg sm:rounded-xl border border-gray-200 shadow-sm hover:shadow-md overflow-hidden bg-white mb-3 sm:mb-4 transition-shadow duration-300">
      
      {/* TOP CONTENT */}
      <div className="p-4 sm:p-5 md:p-6 flex flex-col sm:flex-row justify-between gap-4 sm:gap-5 md:gap-6">
        
        {/* LEFT TEXT */}
        <div className="flex-1 space-y-2 sm:space-y-2.5 md:space-y-3">
          <h3 className="font-semibold text-base sm:text-lg md:text-xl text-gray-900 leading-tight">
            {data.heading}
          </h3>

          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2 sm:line-clamp-none">
            {data.description}
          </p>

          <div className="flex items-center flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm pt-1">
            {hasVerified && (
              <span className="flex items-center gap-1 sm:gap-1.5 text-green-600 font-medium">
                <Check size={16} className="sm:w-[18px] sm:h-[18px]" strokeWidth={2.5} /> 
                Verified
              </span>
            )}

            {hasVerified && hasFlashSale && (
              <span className="text-gray-300 hidden sm:inline">|</span>
            )}

            {hasFlashSale && (
              <span className="flex items-center gap-1 sm:gap-1.5 text-yellow-500 font-medium">
                <Zap size={16} className="sm:w-[18px] sm:h-[18px]" fill="currentColor" /> 
                Flash Sale
              </span>
            )}
          </div>
        </div>

        {/* RIGHT LOGO */}
        <div className="flex-shrink-0 flex sm:block justify-center sm:justify-start">
          <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 
                         flex items-center justify-center 
                         rounded-full border-2 border-gray-200 bg-white shadow-sm">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-700 text-center px-2">
              {data.brand || "LOGO"}
            </span>
          </div>
        </div>
      </div>

      {/* ACTION BAR - Yellow Background */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-400 
                     px-4 sm:px-5 md:px-6 
                     py-3 sm:py-3.5 md:py-4 
                     flex flex-col sm:flex-row 
                     justify-between items-stretch sm:items-center 
                     gap-3 sm:gap-4 
                     border-t-2 sm:border-t-4 border-dotted border-white/30">
        <Link href={data.websiteLink || "#"} target="_blank" className="w-full sm:w-auto">
          <button className="w-full sm:w-auto bg-gray-900 text-white 
                           px-5 sm:px-6 
                           py-2 sm:py-2.5 
                           rounded-md text-xs sm:text-sm font-semibold 
                           hover:bg-gray-800 active:bg-gray-700
                           transition-colors">
            Grab Deal
          </button>
        </Link>

        <button
          onClick={() => setOpen(!open)}
          className="w-full sm:w-auto flex items-center justify-center sm:justify-start 
                     gap-1.5 sm:gap-2 
                     text-xs sm:text-sm font-semibold text-gray-900 
                     hover:underline"
        >
          View Details 
          {open ? (
            <ChevronUp size={16} className="sm:w-[18px] sm:h-[18px]" />
          ) : (
            <ChevronDown size={16} className="sm:w-[18px] sm:h-[18px]" />
          )}
        </button>
      </div>

      {/* EXPAND DETAILS */}
      {open && data.viewDetail && (
        <div className="bg-white px-4 sm:px-5 md:px-6 py-4 sm:py-4.5 md:py-5 border-t border-gray-200">
          <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm text-gray-700">
            {data.viewDetail.discount && (
              <li className="flex items-start gap-2 sm:gap-3">
                <span className="text-gray-900 font-medium mt-0.5 flex-shrink-0">•</span>
                <span className="leading-relaxed">{data.viewDetail.discount}</span>
              </li>
            )}
            {data.viewDetail.more && (
              <li className="flex items-start gap-2 sm:gap-3">
                <span className="text-gray-900 font-medium mt-0.5 flex-shrink-0">•</span>
                <span className="leading-relaxed">{data.viewDetail.more}</span>
              </li>
            )}
            {data.viewDetail.redem && (
              <li className="flex items-start gap-2 sm:gap-3">
                <span className="text-gray-900 font-medium mt-0.5 flex-shrink-0">•</span>
                <span className="leading-relaxed">{data.viewDetail.redem}</span>
              </li>
            )}
            {data.viewDetail.offer && (
              <li className="flex items-start gap-2 sm:gap-3">
                <span className="text-gray-900 font-medium mt-0.5 flex-shrink-0">•</span>
                <span className="leading-relaxed">{data.viewDetail.offer}</span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default AllBrand 