"use client"

import { useState } from "react"
import Upsell1Screen from "./upsell1-screen"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<
    "home" | "login" | "registration" | "profile-setup" | "welcome" | "discover" | "chat" | "upsell1"
  >("upsell1")

  const handleNavigate = (
    screen: "home" | "login" | "registration" | "profile-setup" | "welcome" | "discover" | "chat" | "upsell1",
    chatId?: string,
  ) => {
    setCurrentScreen(screen)
  }

  return (
    <div className="min-h-screen">
      <Upsell1Screen onNavigate={handleNavigate} />
    </div>
  )
}
