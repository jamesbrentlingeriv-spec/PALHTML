import { Link } from 'react-router-dom'

export default function BackButton() {
  return (
    <Link
      to="/"
      className="fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-black/70 text-white text-xl hover:bg-black/90 hover:scale-110 transition-all shadow-lg"
      title="Back to Home"
    >
      ←
    </Link>
  )
}
