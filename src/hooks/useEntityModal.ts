import { useState } from 'react'

export function useEntityModal<T = unknown>() {
  const [isOpen, setIsOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<T | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const openCreate = (onOpen?: () => void) => {
    setEditingItem(null)
    setFormError(null)
    onOpen?.()
    setIsOpen(true)
  }

  const openEdit = (item: T, onOpen?: (item: T) => void) => {
    setEditingItem(item)
    setFormError(null)
    onOpen?.(item)
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
    setEditingItem(null)
    setFormError(null)
  }

  return {
    isOpen,
    setIsOpen,
    editingItem,
    setEditingItem,
    formError,
    setFormError,
    openCreate,
    openEdit,
    close,
  }
}
