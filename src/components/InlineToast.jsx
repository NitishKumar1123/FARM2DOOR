import React, { useEffect } from 'react'

export default function InlineToast({ message, type = 'info', open = true, duration = 1800, onClose }) {
  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => onClose && onClose(), duration)
    return () => clearTimeout(t)
  }, [open, duration, onClose])

  if (!open || !message) return null

  return (
    <div className={`inline-toast inline-toast-${type}`} role="status">
      {message}
    </div>
  )
}
