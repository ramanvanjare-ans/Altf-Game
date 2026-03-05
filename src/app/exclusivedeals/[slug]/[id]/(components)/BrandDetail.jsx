"use client"
import React, { useState } from "react"
import data from "../../../(data)/db.json"
import { usePathname } from "next/navigation"
import AllBrand from "./AllBrand"
import { Menu, X } from "lucide-react"
import Link from "next/link"

function BrandDetail({ id }) {
  const pathname = usePathname()
  const slug = pathname.split("/").filter(Boolean)

  const backSlug = slug[1]

  const category = data.categories.find(cat => cat.slug === slug[1])
  const brand = category?.brands.find(b => b.brandName === id)

  const coupons = brand?.offers?.coupons || []
  const deals = brand?.offers?.deals || []

  const totalOffers = coupons.length + deals.length

  const [activeTab, setActiveTab] = useState("all")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div>
      {/* HEADER */}
      <h1 className="bg-amber-400 py-3 sm:py-4 md:py-5 text-center capitalize 
                     text-lg sm:text-xl md:text-2xl font-semibold px-4">
        {id} Coupon Codes & Deals
      </h1>

      {/* BREADCRUMB */}
      <div className="max-w-7xl mx-auto text-xs sm:text-sm text-gray-400 my-3 sm:my-4 px-4 sm:px-6">
        
      <Link className="text-gray-600"  href={`/exclusivedeals/${backSlug}`} >{`Home / Stores / ${id}`}</Link>
      </div>

      {/* Mobile Sidebar Toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4 lg:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          <span className="text-sm font-medium">
            {sidebarOpen ? "Close Store Info" : "View Store Info"}
          </span>
        </button>
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 sm:gap-5 md:gap-6 px-4 sm:px-6 pb-8">
        
        {/* LEFT SIDE */}
        <div className={`
          ${sidebarOpen ? 'block' : 'hidden'} lg:block
          w-full lg:w-[30%] 
          space-y-4 sm:space-y-5 md:space-y-6
        `}>
          
          {/* STORE CARD */}
          <div className="rounded-lg sm:rounded-xl shadow-md border overflow-hidden">
            <div className="bg-black text-white p-4 sm:p-5 md:p-6 text-center">
              <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 
                            mx-auto mb-2 sm:mb-3 
                            flex items-center justify-center 
                            rounded-full border-2 bg-white 
                            text-black text-xs sm:text-sm md:text-base font-bold">
                {brand?.brandName?.slice(0, 2).toUpperCase()}
              </div>
              <h3 className="font-semibold text-sm sm:text-base md:text-lg">
                {brand?.brandName}
              </h3>
            </div>

            <div className="p-4 sm:p-5 text-xs sm:text-sm text-gray-600">
              <p className="font-semibold mb-2 text-sm sm:text-base">
                More About This Store
              </p>
              <div className="border-b mb-2 sm:mb-3" />
              <p className="leading-relaxed">{brand?.about}</p>
            </div>
          </div>

          {/* RELATED STORES */}
          <div className="rounded-lg sm:rounded-xl shadow-md border p-3 sm:p-4">
            <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
              Related Stores
            </h4>
            <div className="text-xs sm:text-sm text-gray-500">Coming soon…</div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-[70%]">
          
          {/* TABS */}
          <div className="flex gap-4 sm:gap-6 md:gap-8 border-b mb-4 sm:mb-5 overflow-x-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-2 whitespace-nowrap text-sm sm:text-base transition-colors ${
                activeTab === "all"
                  ? "border-b-2 border-amber-400 font-semibold text-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All ({totalOffers})
            </button>

            <button
              onClick={() => setActiveTab("coupon")}
              className={`pb-2 whitespace-nowrap text-sm sm:text-base transition-colors ${
                activeTab === "coupon"
                  ? "border-b-2 border-amber-400 font-semibold text-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Coupons ({coupons.length})
            </button>

            <button
              onClick={() => setActiveTab("deal")}
              className={`pb-2 whitespace-nowrap text-sm sm:text-base transition-colors ${
                activeTab === "deal"
                  ? "border-b-2 border-amber-400 font-semibold text-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Deals ({deals.length})
            </button>
          </div>

          {/* CONTENT */}
          <div className="space-y-3 sm:space-y-4">
            {activeTab === "all" &&
              [...coupons, ...deals].map((item, i) => (
                <AllBrand key={i} data={item} />
              ))}

            {activeTab === "coupon" &&
              coupons.map((item, i) => (
                <AllBrand key={i} data={item} />
              ))}

            {activeTab === "deal" &&
              deals.map((item, i) => (
                <AllBrand key={i} data={item} />
              ))}

            {/* Empty State */}
            {((activeTab === "all" && totalOffers === 0) ||
              (activeTab === "coupon" && coupons.length === 0) ||
              (activeTab === "deal" && deals.length === 0)) && (
              <div className="text-center py-12">
                <p className="text-sm sm:text-base text-gray-500">
                  No {activeTab === "all" ? "offers" : activeTab + "s"} available at the moment
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default BrandDetail