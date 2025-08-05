"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface RouletteWheelProps {
  onSpinComplete: () => void
}

export default function RouletteWheel({ onSpinComplete }: RouletteWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)

  const segments = [
    { value: "70%", color: "black", textColor: "gold" },
    { value: "80%", color: "gold", textColor: "black" },
    { value: "10%", color: "black", textColor: "gold" },
    { value: "12%", color: "gold", textColor: "black" },
    { value: "5%", color: "black", textColor: "gold" },
    { value: "8%", color: "gold", textColor: "black" },
    { value: "4%", color: "black", textColor: "gold" },
    { value: "2%", color: "gold", textColor: "black" },
    { value: "25%", color: "black", textColor: "gold" },
    { value: "30%", color: "gold", textColor: "black" },
  ]

  const segmentAngle = 360 / segments.length

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSpinning(true)

      const targetSegmentIndex = 0 // "70%" is at index 0
      const baseRotations = 6
      const totalRotation = baseRotations * 360

      // Correction offset to center the segment visually
      const offset = segmentAngle / 2 - 1 // <- adjusted by 1 degree back

      const finalRotation = totalRotation + (360 - targetSegmentIndex * segmentAngle) - offset

      setRotation(finalRotation)

      setTimeout(() => {
        setIsSpinning(false)
        onSpinComplete()
      }, 3000)
    }, 300)

    return () => clearTimeout(timer)
  }, [onSpinComplete, segments])

  const getSegmentPath = (index: number) => {
    const startAngle = index * segmentAngle
    const endAngle = (index + 1) * segmentAngle
    const r = 100

    const startRad = ((startAngle - 90) * Math.PI) / 180
    const endRad = ((endAngle - 90) * Math.PI) / 180

    const x1 = 100 + r * Math.cos(startRad)
    const y1 = 100 + r * Math.sin(startRad)
    const x2 = 100 + r * Math.cos(endRad)
    const y2 = 100 + r * Math.sin(endRad)

    return `M100,100 L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`
  }

  const getTextPosition = (index: number) => {
    const angle = index * segmentAngle + segmentAngle / 2
    const r = 70
    const rad = ((angle - 90) * Math.PI) / 180
    return {
      x: 100 + r * Math.cos(rad),
      y: 100 + r * Math.sin(rad),
      rotation: angle,
    }
  }

  const goldColor = "#FFD700"
  const blackColor = "#1A1A1A"

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[400] p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-8">¡Girando la Ruleta!</h2>

        <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px]">
          <div className="w-full h-full rounded-full p-2 bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 shadow-2xl">
            <motion.div
              className="w-full h-full rounded-full bg-neutral-800 shadow-2xl"
              animate={{ rotate: rotation }}
              transition={{
                duration: 3,
                ease: "easeOut",
              }}
            >
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {segments.map((segment, i) => (
                  <g key={i}>
                    <path d={getSegmentPath(i)} fill={segment.color === "gold" ? goldColor : blackColor} />
                    <text
                      x={getTextPosition(i).x}
                      y={getTextPosition(i).y}
                      transform={`rotate(${getTextPosition(i).rotation}, ${getTextPosition(i).x}, ${getTextPosition(i).y}) rotate(${-getTextPosition(i).rotation + (segmentAngle / 2 > 90 && segmentAngle / 2 < 270 ? 180 : 0)}, ${getTextPosition(i).x}, ${getTextPosition(i).y})`}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="12"
                      fontWeight="bold"
                      fill={segment.textColor === "gold" ? goldColor : blackColor}
                    >
                      {segment.value}
                    </text>
                  </g>
                ))}
                {[...Array(10)].map((_, i) => {
                  const angle = i * 36 + 18
                  const rOuter = 98
                  const rInner = 92
                  const rad = ((angle - 90) * Math.PI) / 180
                  const x1 = 100 + rOuter * Math.cos(rad)
                  const y1 = 100 + rOuter * Math.sin(rad)
                  const angleOffset = 1.5
                  const x2 = 100 + rInner * Math.cos(((angle - angleOffset - 90) * Math.PI) / 180)
                  const y2 = 100 + rInner * Math.sin(((angle - angleOffset - 90) * Math.PI) / 180)
                  const x3 = 100 + rInner * Math.cos(((angle + angleOffset - 90) * Math.PI) / 180)
                  const y3 = 100 + rInner * Math.sin(((angle + angleOffset - 90) * Math.PI) / 180)
                  return (
                    <polygon key={`triangle-${i}`} points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`} fill={goldColor} />
                  )
                })}
              </svg>
            </motion.div>
          </div>

          {/* Center glowing circle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-yellow-300 via-amber-500 to-yellow-600 shadow-inner border-2 border-yellow-200"></div>
          </div>

          {/* Pointer */}
          <div
            className="absolute top-[calc(2%)] left-1/2 -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: "18px solid transparent",
              borderRight: "18px solid transparent",
              borderTop: "28px solid white",
              filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.5))",
            }}
          />
        </div>

        <p className="text-white mt-8 text-lg">{isSpinning ? "Girando..." : "Preparando..."}</p>
      </div>
    </div>
  )
}
