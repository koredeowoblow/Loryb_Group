import React from 'react'
import { Activity } from 'lucide-react'

export function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-surface-base">
      <div className="relative flex flex-col items-center">
        {/* The background logo (faded out) */}
        <div className="relative h-20 w-auto opacity-20">
          <img src="/logo.png" alt="Loading" className="h-full w-auto object-contain" />
        </div>
        
        {/* The foreground logo (fills up) */}
        <div className="absolute top-0 left-0 h-20 w-auto overflow-hidden animate-logo-fill">
          <img src="/logo.png" alt="" aria-hidden="true" className="h-full w-auto object-contain" />
        </div>

        <div className="mt-4 flex items-center text-primary font-semibold tracking-wide">
          <Activity className="mr-2 h-4 w-4 animate-pulse" />
          LOADING...
        </div>
      </div>
    </div>
  )
}
