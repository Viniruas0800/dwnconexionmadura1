"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface RouletteWheelProps {
  onSpinComplete: () => void
  targetSegmentIndex: number
}

export default function RouletteWheel({ onSpinComplete, targetSegmentIndex }: RouletteWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)

  const segments = [
    { label: "5%", color: "#ef4444" },
    { label: "10%", color: "#f97316" },
    { label: "15%", color: "#eab308" },
    { label: "20%", color: "#22c55e" },
    { label: "25%", color: "#06b6d4" },
    { label: "30%", color: "#3b82f6" },
    { label: "35%", color: "#8b5cf6" },
    { label: "40%", color: "#ec4899" },
    { label: "45%", color: "#f59e0b" },
    { label: "50%", color: "#10b981" },
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSpinning(true)
      const segmentAngle = 360 / segments.length
      const targetAngle = targetSegmentIndex * segmentAngle
      const spins = 5 * 360 // 5 full rotations
      const finalRotation = spins + (360 - targetAngle)
      setRotation(finalRotation)

      setTimeout(() => {
        setIsSpinning(false)
        onSpinComplete()
      }, 3000)
    }, 500)

    return () => clearTimeout(timer)
  }, [targetSegmentIndex, onSpinComplete, segments.length])

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[400] p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-8">¡Girando la Ruleta!</h2>

        <div className="relative w-80 h-80 mx-auto">
          <motion.div
            className="w-full h-full rounded-full border-4 border-white shadow-2xl"
            animate={{ rotate: rotation }}
            transition={{ duration: 3, ease: "easeOut" }}
            style={{
              background: `conic-gradient(${segments
                .map(
                  (segment, index) =>
                    `${segment.color} ${(index * 360) / segments.length}deg ${((index + 1) * 360) / segments.length}deg`,
                )
                .join(", ")})`,
            }}
          >
            {segments.map((segment, index) => {
              const angle = (index * 360) / segments.length
              return (
                <div
                  key={index}
                  className="absolute w-full h-full flex items-center justify-center text-white font-bold text-lg"
                  style={{
                    transform: `rotate(${angle + 18}deg)`,
                    transformOrigin: "center",
                  }}
                >
                  <span
                    className="absolute"
                    style={{
                      top: "20px",
                      transform: "translateX(-50%)",
                    }}
                  >
                    {segment.label}
                  </span>
                </div>
              )
            })}
          </motion.div>

          {/* Pointer */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
          </div>
        </div>

        <p className="text-white mt-8 text-lg">{isSpinning ? "Girando..." : "Preparando..."}</p>
      </div>
    </div>
  )
}
