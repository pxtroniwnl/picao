'use client'

import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Splash } from '../screens/Splash'
import { Onboarding } from '../screens/Onboarding'
import { Welcome } from '../screens/Welcome'
import { Login } from '../screens/Login'
import { Register } from '../screens/Register'
import { Home } from '../screens/Home'
import { MisPartidos } from '../screens/MisPartidos'
import { Perfil } from '../screens/Perfil'
import { Detalle } from '../screens/Detalle'
import { Pago } from '../screens/Pago'
import { Confirmado } from '../screens/Confirmado'
import { Chat } from '../screens/Chat'
import { Notificaciones } from '../screens/Notificaciones'
import { CrearPicao } from '../screens/CrearPicao'
import { BottomNav } from '../components/Shared'
import { Picao, MOCK_PICAOS } from '../data/picaos'

type ScreenState =
  | 'splash'
  | 'onboarding'
  | 'welcome'
  | 'login'
  | 'register'
  | 'home'
  | 'mis-partidos'
  | 'perfil'
  | 'detalle'
  | 'pago'
  | 'confirmado'
  | 'chat'
  | 'notificaciones'
  | 'crear'

export default function Page() {
  const [history, setHistory] = useState<ScreenState[]>(['splash'])
  const [activeTab, setActiveTab] = useState<'home' | 'mis-partidos' | 'perfil'>('home')
  const [selectedPicao, setSelectedPicao] = useState<Picao | null>(MOCK_PICAOS[0])
  const [created, setCreated] = useState<Picao[]>(MOCK_PICAOS.filter((p) => p.createdByMe))
  const [pendingPicao, setPendingPicao] = useState<Picao | null>(null)
  const participo = MOCK_PICAOS.filter((p) => p.joined)
  const historial = MOCK_PICAOS.filter((p) => p.status === 'jugado')

  const currentScreen = history[history.length - 1]
  const push = (screen: ScreenState) => setHistory([...history, screen])
  const pop = () => {
    if (history.length > 1) setHistory(history.slice(0, -1))
  }
  const resetTo = (screen: ScreenState) => setHistory([screen])
  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'home' | 'mis-partidos' | 'perfil')
    resetTo(tab as ScreenState)
  }
  const openChat = (p: Picao) => {
    setSelectedPicao(p)
    push('chat')
  }
  const startCreatedPayment = (p: Picao) => {
    setPendingPicao(p)
    setSelectedPicao(p)
    push('pago')
  }
  const handlePaid = () => {
    if (pendingPicao) {
      setCreated((prev) => [pendingPicao, ...prev])
      setPendingPicao(null)
    }
    push('confirmado')
  }
  const toggleVisibility = (id: string) =>
    setCreated((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, visibility: p.visibility === 'privado' ? 'publico' : 'privado' }
          : p,
      ),
    )
  const isTabScreen = ['home', 'mis-partidos', 'perfil'].includes(currentScreen)

  return (
    <main className="flex min-h-[100dvh] w-full justify-center bg-black">
      <div className="relative h-[100dvh] w-full max-w-[430px] overflow-hidden bg-carbon">
        <AnimatePresence mode="wait">
          {currentScreen === 'splash' && (
            <motion.div key="splash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full absolute inset-0">
              <Splash onComplete={() => resetTo('onboarding')} />
            </motion.div>
          )}
          {currentScreen === 'onboarding' && (
            <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full absolute inset-0">
              <Onboarding onComplete={() => resetTo('welcome')} />
            </motion.div>
          )}
          {currentScreen === 'welcome' && (
            <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full absolute inset-0">
              <Welcome onRegister={() => push('register')} onLogin={() => push('login')} />
            </motion.div>
          )}
          {currentScreen === 'login' && (
            <motion.div key="login" initial={{ x: 390 }} animate={{ x: 0 }} exit={{ x: 390 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="h-full absolute inset-0 z-30">
              <Login onBack={pop} onComplete={() => resetTo('home')} />
            </motion.div>
          )}
          {currentScreen === 'register' && (
            <motion.div key="register" initial={{ x: 390 }} animate={{ x: 0 }} exit={{ x: 390 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="h-full absolute inset-0 z-30">
              <Register onBack={pop} onComplete={() => resetTo('home')} />
            </motion.div>
          )}

          {currentScreen === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full absolute inset-0">
              <Home
                onSelectPicao={(p) => {
                  setSelectedPicao(p)
                  push('detalle')
                }}
                onNotifications={() => push('notificaciones')}
                onCrear={() => push('crear')}
              />
            </motion.div>
          )}
          {currentScreen === 'mis-partidos' && (
            <motion.div key="mis-partidos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full absolute inset-0">
              <MisPartidos
                created={created}
                participo={participo}
                historial={historial}
                onToggleVisibility={toggleVisibility}
                onChat={openChat}
                onSelectPicao={(p) => {
                  setSelectedPicao(p)
                  push('detalle')
                }}
              />
            </motion.div>
          )}
          {currentScreen === 'perfil' && (
            <motion.div key="perfil" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full absolute inset-0">
              <Perfil />
            </motion.div>
          )}

          {currentScreen === 'detalle' && selectedPicao && (
            <motion.div key="detalle" initial={{ x: 390 }} animate={{ x: 0 }} exit={{ x: 390 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="h-full absolute inset-0 z-30">
              <Detalle picao={selectedPicao} onBack={pop} onJoin={() => push('pago')} onChat={() => push('chat')} />
            </motion.div>
          )}
          {currentScreen === 'pago' && selectedPicao && (
            <motion.div key="pago" initial={{ x: 390 }} animate={{ x: 0 }} exit={{ x: 390 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="h-full absolute inset-0 z-30">
              <Pago picao={selectedPicao} onBack={pop} onPay={handlePaid} />
            </motion.div>
          )}
          {currentScreen === 'confirmado' && selectedPicao && (
            <motion.div key="confirmado" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="h-full absolute inset-0 z-30">
              <Confirmado picao={selectedPicao} onChat={() => push('chat')} onHome={() => { setActiveTab('mis-partidos'); resetTo('mis-partidos') }} />
            </motion.div>
          )}
          {currentScreen === 'chat' && selectedPicao && (
            <motion.div key="chat" initial={{ x: 390 }} animate={{ x: 0 }} exit={{ x: 390 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="h-full absolute inset-0 z-30">
              <Chat picao={selectedPicao} onBack={pop} />
            </motion.div>
          )}
          {currentScreen === 'notificaciones' && (
            <motion.div key="notificaciones" initial={{ x: 390 }} animate={{ x: 0 }} exit={{ x: 390 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="h-full absolute inset-0 z-30">
              <Notificaciones onBack={pop} />
            </motion.div>
          )}
          {currentScreen === 'crear' && (
            <motion.div key="crear" initial={{ y: 390 }} animate={{ y: 0 }} exit={{ y: 390 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="h-full absolute inset-0 z-30">
              <CrearPicao onBack={pop} onComplete={startCreatedPayment} />
            </motion.div>
          )}
        </AnimatePresence>

        {isTabScreen && <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />}
      </div>
    </main>
  )
}
