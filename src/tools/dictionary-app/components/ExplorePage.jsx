

import { Search } from 'lucide-react'
import React from 'react'

export default function ExplorePage() {
  return (
     <div className="bg-
     (--background) text-(--foreground) backdrop-blur-xl rounded-md shadow-xl p-12 text-center border border-(--border) animate-in fade-in slide-in-from-bottom duration-700">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                  <Search className="w-12 h-12 text-indigo-600" />
                </div>
                <h3 className="subheading  mb-5">
                  Ready to Explore?
                </h3>
                <p className="description">
                  Type any word in the search bar above to discover its meaning,<br/> pronunciation, and usage instantly!
                </p>
              </div>
  )
}


