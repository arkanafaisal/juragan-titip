// Lokasi: src/hooks/use-sidebar.tsx
import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { storageGet, storageSet } from "@/lib/storage"
// Catatan: Pastikan kamu sudah punya STORAGE_KEYS di "@/lib/constants"
import { STORAGE_KEYS } from "@/lib/constants" 

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
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return storageGet<boolean>(STORAGE_KEYS.SIDEBAR_STATE) ?? false
  })

  const toggle = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev
      storageSet(STORAGE_KEYS.SIDEBAR_STATE, next)
      return next
    })
  }, [])

  const collapse = useCallback(() => {
    setIsCollapsed(true)
    storageSet(STORAGE_KEYS.SIDEBAR_STATE, true)
  }, [])

  const expand = useCallback(() => {
    setIsCollapsed(false)
    storageSet(STORAGE_KEYS.SIDEBAR_STATE, false)
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