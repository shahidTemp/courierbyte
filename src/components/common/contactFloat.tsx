// @ts-nocheck
import { MessageCircle } from 'lucide-react'

const ContactFloat = () => {
  const whatsappNumber = '+8803774635546'
  // Remove the '+' for the wa.me link URL format
  const cleanNumber = whatsappNumber.replace('+', '')

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <a
        href={`https://wa.me/${cleanNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-white shadow-xl shadow-secondary/25 transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  )
}

export default ContactFloat
