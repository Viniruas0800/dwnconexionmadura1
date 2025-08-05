"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import RouletteWheel from "./roulette-wheel"
import ConfettiExplosion from "./confetti-explosion"
import VictoryMessage from "./victory-message"

interface CreditsDiscountPopupProps {
  isOpen: boolean
  onClose: () => void
  onApplyDiscount: () => void
  onBalanceReset?: () => void
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}

const popupVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25, duration: 0.4 },
  },
  exit: { opacity: 0, scale: 0.9, y: 10, transition: { duration: 0.3 } },
}

const iconVariants = {
  hidden: { scale: 0, opacity: 0, rotate: -180 },
  visible: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 400, damping: 20, delay: 0.2 },
  },
}

const StarIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16 2L20.944 11.056L31 16L20.944 20.944L16 30L11.056 20.944L1 16L11.056 11.056L16 2Z"
      fill="#10B981"
      stroke="#10B981"
      strokeWidth="1"
      strokeLinejoin="round"
    />
  </svg>
)

export default function CreditsDiscountPopup({
  isOpen,
  onClose,
  onApplyDiscount,
  onBalanceReset,
}: CreditsDiscountPopupProps) {
  const [currentBalance, setCurrentBalance] = useState(0.0) // Not used for calculation anymore, but kept for potential future use
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPopupContentVisible, setIsPopupContentVisible] = useState(true)
  const [isRouletteVisible, setIsRouletteVisible] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showVictoryMessage, setShowVictoryMessage] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsPopupContentVisible(true)
      setIsRouletteVisible(false)
      setShowConfetti(false)
      setShowVictoryMessage(false)
      setIsProcessing(false)
      // Balance loading can be kept if needed for other display purposes,
      // but it's not directly used in the discount calculation anymore.
      try {
        const savedBalance = localStorage.getItem("mainPageBalance")
        if (savedBalance !== null) {
          setCurrentBalance(Number.parseFloat(savedBalance))
        }
      } catch (error) {
        console.error("Error loading balance from localStorage:", error)
      }
    }
  }, [isOpen])

  const handleStartRoulette = () => {
    setIsProcessing(true)
    setIsPopupContentVisible(false)
    setTimeout(() => {
      setIsRouletteVisible(true)
    }, 300)
  }

  const handleRouletteSpinComplete = () => {
    setIsRouletteVisible(false)
    setShowConfetti(true)
    // Victory message will be shown after confetti has had a moment
    setTimeout(() => {
      setShowVictoryMessage(true)
    }, 500) // Delay victory message slightly for confetti to start
  }

  const handleVictoryMessageComplete = () => {
    setShowVictoryMessage(false)
    setShowConfetti(false) // Ensure confetti is also cleared

    // Reset balance to 0
    setCurrentBalance(0) // Visually reset if displayed anywhere
    try {
      localStorage.setItem("mainPageBalance", "0.00")
    } catch (error) {
      console.error("Error updating balance in localStorage:", error)
    }
    if (onBalanceReset) {
      onBalanceReset()
    }

    onApplyDiscount() // Scroll page

    setTimeout(() => {
      onClose() // Close backdrop and reset popup
      setIsProcessing(false)
    }, 300) // Allow scroll to start
  }

  const handleConfettiAnimationEnd = () => {
    // Confetti is self-terminating, but we can hide the component if needed
    // For now, it will just finish its animation.
    // If VictoryMessage is already visible, no action needed here.
    // If not, this could be a trigger, but VictoryMessage is triggered by roulette complete.
  }

  if (!isOpen && !isRouletteVisible && !showConfetti && !showVictoryMessage) return null

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[300] p-4"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <AnimatePresence>
              {isPopupContentVisible && (
                <motion.div
                  variants={popupVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="relative bg-[#1A1A1A] rounded-2xl shadow-2xl w-full max-w-sm border border-green-500/20 overflow-hidden"
                  style={{
                    boxShadow: "0 0 10px rgba(16, 185, 129, 0.08), 0 10px 40px rgba(0, 0, 0, 0.4)",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/4 via-transparent to-green-500/4 rounded-2xl pointer-events-none" />
                  <div className="relative z-10 p-6 pt-8 text-center">
                    <motion.div
                      variants={iconVariants}
                      className="mx-auto mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-green-500/8 relative"
                      style={{ boxShadow: "0 0 8px rgba(16, 185, 129, 0.1)" }}
                    >
                      <div className="absolute inset-0 bg-green-500/8 rounded-full blur-md" />
                      <div className="relative z-10">
                        <StarIcon />
                      </div>
                    </motion.div>
                    <motion.h2
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                      className="text-2xl sm:text-3xl font-bold text-white mb-6"
                    >
                      Aviso Importante
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.3 }}
                      className="text-neutral-200 text-base sm:text-lg leading-relaxed mb-4 px-1"
                    >
                      ¿La plata está justa? ¿O tal vez todavía no descubriste el verdadero poder de{" "}
                      <span className="font-semibold text-white">Conexión Madura PRO</span>?
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.3 }}
                      className="text-neutral-200 text-base sm:text-lg leading-relaxed mb-4 px-1"
                    >
                      Bueno, esto es lo que tengo para decirte:
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.3 }}
                      className="text-neutral-200 text-base sm:text-lg leading-relaxed mb-8 px-1"
                    >
                      Te voy a dar la oportunidad de probar suerte en la ruleta y tener la posibilidad de ganar un
                      descuento aún mayor.
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.3 }}
                    >
                      <Button
                        onClick={handleStartRoulette}
                        disabled={isProcessing}
                        className="w-full font-bold text-base py-4 h-auto rounded-xl text-white
                                   bg-gradient-to-r from-green-500 to-green-600
                                   hover:from-green-600 hover:to-green-700
                                   focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1A1A1A] focus:ring-green-500
                                   shadow-lg hover:shadow-green-500/20
                                   transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-97
                                   disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        style={{
                          boxShadow: "0 4px 15px rgba(16, 185, 129, 0.15), 0 0 8px rgba(16, 185, 129, 0.06)",
                        }}
                      >
                        {isProcessing ? "PROCESANDO..." : "GIRAR RULETA"}
                      </Button>
                    </motion.div>
                  </div>
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(16, 185, 129, 0.06) 0%, transparent 50%, rgba(16, 185, 129, 0.06) 100%)",
                      padding: "1px",
                      mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      maskComposite: "xor",
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* These components are rendered conditionally but don't need their own backdrop */}
      {isRouletteVisible && <RouletteWheel onSpinComplete={handleRouletteSpinComplete} targetSegmentIndex={9} />}
      <ConfettiExplosion isActive={showConfetti} onAnimationEnd={handleConfettiAnimationEnd} />
      <VictoryMessage isVisible={showVictoryMessage} onAnimationComplete={handleVictoryMessageComplete} />
    </>
  )
}
