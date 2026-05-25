import { useState, useCallback } from "react"
import { storageGet, storageSet } from "@/lib/storage"
import { STORAGE_KEYS } from "@/lib/constants"

export function useSidebar() {
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

  return { isCollapsed, toggle, collapse, expand }
}
