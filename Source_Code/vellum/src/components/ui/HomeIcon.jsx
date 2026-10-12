import { Link } from 'react-router-dom'

export default function HomeIcon({ className = '' }) {
  return (
    <Link
      to="/"
      aria-label="Go to homepage"
      title="Go to homepage"
      className={`w-9 h-9 rounded-full bg-white/[0.05] border border-white/12 hover:border-brass/40 hover:bg-white/[0.08] flex items-center justify-center transition-colors shrink-0 ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M3 11L12 4L21 11"
          stroke="#D9B569"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 9.5V19C5 19.5523 5.44772 20 6 20H9.5V15C9.5 14.4477 9.94772 14 10.5 14H13.5C14.0523 14 14.5 14.4477 14.5 15V20H18C18.5523 20 19 19.5523 19 19V9.5"
          stroke="#D9B569"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  )
}
