"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface ConfettiExplosionProps {
  isActive: boolean
  onAnimationEnd: () => void
}

export default function ConfettiExplosion({ isActive, onAnimationEnd }: ConfettiExplosionProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; delay: number }>>(
    [],
  )

  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        color: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7", "#dda0dd"][Math.floor(Math.random() * 6)],
        delay: Math.random() * 0.5,
      }))
      setParticles(newParticles)

      const timer = setTimeout(() => {
        onAnimationEnd()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isActive, onAnimationEnd])

  if (!isActive) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[500]">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: particle.color,
            left: particle.x,
            top: particle.y,
          }}
          initial={{ scale: 0, y: 0 }}
          animate={{
            scale: [0, 1, 0],
            y: [0, -200, 400],
            x: [0, Math.random() * 200 - 100],
            rotate: [0, 360],
          }}
          transition={{
            duration: 3,
            delay: particle.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}
