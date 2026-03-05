"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import data from "../(data)/db.json"
import Link from "next/link"

function PopularSales() {
  const items = data.popularSales
  const [index, setIndex] = useState(0)
  const [visibleCards, setVisibleCards] = useState(3)

  /* ---------- Responsive cards count ---------- */
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth

      if (width < 640) setVisibleCards(1)        // Mobile
      else if (width < 1024) setVisibleCards(2)  // Tablet
      else setVisibleCards(3)                    // Desktop
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  /* ---------- Controls (same as Feedback) ---------- */
  const next = () => {
    if (index + visibleCards < items.length) {
      setIndex(index + 1)
    }
  }

  const prev = () => {
    if (index > 0) {
      setIndex(index - 1)
    }
  }


  useEffect(() => {
    if (!items.length) return
  
    const interval = setInterval(() => {
      setIndex((prev) => {
        // last possible slide index
        const maxIndex = items.length - visibleCards
  
        // reset to start → infinite loop
        if (prev >= maxIndex) {
          return 0
        }
  
        return prev + 1
      })
    }, 3000) // change speed if needed
  
    return () => clearInterval(interval)
  }, [items.length, visibleCards])




  return (
    <section className="md:my-20 my-12 overflow-hidden">
      {/* Header */}
      <div className="flex md:justify-between justify-center items-center mb-8">
        <h1 className="md:text-3xl text-2xl font-bold ">
          POPULAR SALES ONLINE
        </h1>

        {/* Arrows */}
        <div className="md:flex hidden gap-3">
          <button
            onClick={prev}
            disabled={index === 0}
            className="w-10 h-10 flex items-center justify-center
                       rounded-full border
                       hover:bg-black hover:text-white transition
                       disabled:opacity-40"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={next}
            disabled={index + visibleCards >= items.length}
            className="w-10 h-10 flex items-center justify-center
                       rounded-full border
                       hover:bg-black hover:text-white transition
                       disabled:opacity-40"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Slider */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${index * (100 / visibleCards)}%)`,
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              style={{ minWidth: `${100 / visibleCards}%` }}
              className="px-2"
            >
              <Link href={`exclusivedeals/${item.slug}`}>
                <div className="h-48 md:h-56 rounded-2xl overflow-hidden relative cursor-pointer">
                  <Image
                    src={item.img}
                    fill
                    alt="popular-sale"
                    className="object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PopularSales
