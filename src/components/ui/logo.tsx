import * as React from "react"

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      viewBox="0 0 200 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      {...props}
    >
      {/* Top Text "Study" */}
      <text 
        x="20" 
        y="45" 
        fontFamily="sans-serif" 
        fontSize="52" 
        fontWeight="900" 
        fill="#82cc28"
        letterSpacing="-0.02em"
      >
        Study
      </text>

      {/* Top Book (Blue outline) */}
      <rect 
        x="22" 
        y="52" 
        width="65" 
        height="14" 
        rx="7" 
        stroke="#359cfb" 
        strokeWidth="4" 
        fill="white" 
      />

      {/* Bottom Book (Green outline) */}
      <rect 
        x="22" 
        y="72" 
        width="65" 
        height="14" 
        rx="7" 
        stroke="#82cc28" 
        strokeWidth="4" 
        fill="white" 
      />

      {/* Bottom Text "Hub" */}
      <text 
        x="95" 
        y="84" 
        fontFamily="sans-serif" 
        fontSize="48" 
        fontWeight="900" 
        fill="#359cfb"
        letterSpacing="-0.02em"
      >
        Hub
      </text>
    </svg>
  )
}
