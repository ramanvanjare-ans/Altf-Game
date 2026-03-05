"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import data from "../(data)/db.json"

const Feedback = () => {
  const feedback = data.feedback
  const [index, setIndex] = useState(0)
  const [visibleCards, setVisibleCards] = useState(3)

  // Responsive cards count
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

  const next = () => {
    if (index + visibleCards < feedback.length) {
      setIndex(index + 1)
    }
  }

  const prev = () => {
    if (index > 0) {
      setIndex(index - 1)
    }
  }

  return (
    <section className=" bg-(--background) text-(--foreground) my-12  md:my-20">
      {/* Header */}
      <div className="flex flex-col  sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
        <div className="mx-3" >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            What Our Users Say
          </h2>
          <p className="text-(--muted-foreground) mt-2 text-sm sm:text-base">
            Don’t take our word for it. Trust our customers
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-3 self-start mx-3  sm:self-auto">
          <button
            onClick={prev}
            disabled={index === 0}
            className="w-9 cursor-pointer h-9 sm:w-10 sm:h-10 rounded-full border
                       flex items-center justify-center
                       hover:bg-gray-100 transition disabled:opacity-40"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={next}
            disabled={index + visibleCards >= feedback.length}
            className="w-9 h-9 cursor-pointer sm:w-10 sm:h-10 rounded-full border
                       flex items-center justify-center
                       hover:bg-gray-100 transition disabled:opacity-40"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${index * (100 / visibleCards)}%)`,
          }}
        >
          {feedback.map((item) => (
            <div
              key={item.id}
              className="px-2  sm:px-3"
              style={{ minWidth: `${100 / visibleCards}%` }}
            >
              <div className="bg-white rounded-2xl p-6 sm:p-7 lg:p-8
                              border border-gray-200 shadow-sm hover:shadow-lg transition h-full">
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        i < item.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {/* User */}
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                  />
                  <h4 className="text-base text-(--muted-foreground) sm:text-lg font-semibold">
                    {item.name}
                  </h4>
                </div>

                {/* Message */}
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {item.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Feedback
