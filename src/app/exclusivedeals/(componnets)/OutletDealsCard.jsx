
"use client"

import React, { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import data from "../(data)/db.json"
import Link from "next/link"

function OutletDealsCard() {
  const bestDealCategories = useMemo(
    () => data.categories.slice(0, 8),
    []
  )

  const selectedBrands = useMemo(() => {
    return bestDealCategories
      .map((category) => category.brands?.[0])
      .filter(Boolean)
  }, [bestDealCategories])

  const [index, setIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  /* ---------- Detect Mobile ---------- */
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  /* ---------- Auto Scroll (Mobile only) ---------- */
  useEffect(() => {
    if (!isMobile || !selectedBrands.length) return

    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev >= selectedBrands.length - 1) return 0
        return prev + 1
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [isMobile, selectedBrands.length])

  return (
    <div className="mt-10" >
      <h1 className="text-center text-xl sm:text-2xl md:text-3xl font-semibold  mb-8 md:mb-20 lg:mb-20  px-4">
        Best Deals, Coupons & Discounts – Save Big with My Exclusive Deals
      </h1>

      {/* MOBILE → SLIDER */}
      {isMobile ? (
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${index * 100}%)`,
            }}
          >
            {selectedBrands.map((item, i) => (
              <div key={i} className="min-w-full flex justify-center">
                <Card brand={item} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* DESKTOP / TABLET → GRID */
        <div className="flex flex-wrap justify-between gap-6">
          {selectedBrands.map((item, i) => (
            <Card key={i} brand={item} />
          ))}
        </div>
      )}
    </div>
  )
}

export default OutletDealsCard


function Card({ brand }) {
  return (
    <div className="w-72 mb-20">
    <div className="relative w-full h-70">

      {/* SVG BACKGROUND */}
      <svg
        viewBox="0 0 412 412"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <path
          d="M412 258C412 280.091 394.091 298 372 298H345C322.909 298 305 315.909 305 338V372C305 394.091 287.091 412 265 412H40C17.9086 412 0 394.091 0 372V40C0 17.9086 17.9086 0 40 0H372C394.091 0 412 17.9086 412 40V258Z"
          fill="#FBD153"
        />
      </svg>

      {/* CONTENT */}
      <div className="relative z-10 h-full flex flex-col justify-between">

        {/* TOP SECTION */}
        <div className="flex items-center h-18 bg-[#8A7A4A] rounded-t-2xl px-3">
          <div className=" w-1/2 mb-14 h-full">
            <Image
              src={brand.img}
              alt={brand.brandName}
              width={100}
              height={100}
              className="object-cover   rounded-tl-2xl"
            />
          </div>
          <div className="w-1/2 text-xl text-white font-bold text-center">
            Up to 80%
          </div>
        </div>

        {/* MIDDLE CONTENT */}
        <div className="px-4 py-4 flex-1">
          <h2 className="text-lg font-bold text-gray-800">
            Coupon on {brand.brandName}
          </h2>
          <p className="text-sm text-gray-700 mt-2 line-clamp-2">
            {brand.about}
          </p>
        </div>

        {/* BOTTOM SECTION */}
        <div className="flex items-center justify-between px-3 pb-3">
          <div className="bg-white px-4 py-2 rounded-lg shadow text-sm font-semibold">
            {brand.brandName}
          </div>

          <Link
            href={brand.website}
            target="_blank"
            className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center text-xl hover:scale-110 transition"
          >
            →
          </Link>
        </div>

      </div>
    </div>
  </div>
  );
}







