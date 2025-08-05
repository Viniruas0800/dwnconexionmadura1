"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Trophy, Sparkles } from "lucide-react"
import { useRef } from "react"

interface VictoryMessageProps {
  isVisible: boolean
  onAnimationComplete: () => void
}

export default function VictoryMessage({ isVisible, onAnimationComplete }: VictoryMessageProps) {
  const hasBeenShown = useRef(false)
  const isProcessing = useRef(false)

  // Previne múltiplas execuções e garante scroll ao pricing
  const handleAnimationComplete = () => {
    if (isProcessing.current) return
    isProcessing.current = true
    hasBeenShown.current = true

    // Scroll suave para a seção de preços
    const pricingSection = document.querySelector("#pricing")
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth" })
    }

    onAnimationComplete()
  }

  // Impede re-render se o popup já foi exibido uma vez
  if (!isVisible || hasBeenShown.current) return null

  // Previne propagação de cliques fora do popup
  const preventCloseOnOutsideClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[600] p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.stopPropagation()} // desativa clique fora
        >
          <motion.div
            className="rounded-2xl p-8 text-center max-w-md w-full border-2 border-green-500/50 shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #0a0d15 0%, #101624 25%, #1a2238 50%, #101624 75%, #0a0d15 100%)",
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={preventCloseOnOutsideClick}
          >
            <motion.div
              className="flex justify-center mb-6"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <Trophy className="w-16 h-16 text-yellow-400" />
            </motion.div>

            <motion.h2
              className="text-3xl font-bold text-white mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              ¡Felicidades!
            </motion.h2>

            <motion.div
              className="flex items-center justify-center gap-2 mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <span className="text-4xl font-bold text-green-400">70% OFF</span>
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </motion.div>

            <motion.p
              className="text-green-200 mb-8 text-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              ¡Has ganado el descuento máximo! Tu suerte está de tu lado hoy.
            </motion.p>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
              <Button
                onClick={handleAnimationComplete}
                disabled={isProcessing.current}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 text-lg rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ¡RECLAMAR MI DESCUENTO!
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
