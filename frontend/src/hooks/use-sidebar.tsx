// Lokasi: src/hooks/use-sidebar.tsx
import { createContext, useContext, useState, useCallback } from "react"
import type { ReactNode } from 'react'

// 1. Definisikan tipe Context
interface SidebarContextType {
  isCollapsed: boolean
  toggle: () => void
  collapse: () => void
  expand: () => void
}

// 2. Buat Context
const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

// 3. Buat Provider Component
export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggle = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev
      return next
    })
  }, [])

  const collapse = useCallback(() => {
    setIsCollapsed(true)
  }, [])

  const expand = useCallback(() => {
    setIsCollapsed(false)
  }, [])

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggle, collapse, expand }}>
      {children}
    </SidebarContext.Provider>
  )
}

// 4. Hook untuk digunakan di komponen
export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}