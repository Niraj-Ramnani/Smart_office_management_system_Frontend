import { useState } from 'react'

export function useConfirmDialog<T = number>() {
  const [confirmTarget, setConfirmTarget] = useState<T | null>(null)

  const openConfirm = (target: T) => setConfirmTarget(target)
  const closeConfirm = () => setConfirmTarget(null)

  return {
    confirmTarget,
    setConfirmTarget,
    isOpen: confirmTarget !== null,
    openConfirm,
    closeConfirm,
  }
}
