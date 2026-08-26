import Spinner from '../Spinner'
import logoMono from '@/assets/monochrome.png'

interface LoadingStateProps {
  message?: string
  fullPage?: boolean
}

export default function LoadingState({
  message = 'Loading…',
  fullPage = false,
}: LoadingStateProps) {
  return (
    <div
      className={[
        'flex flex-col items-center justify-center gap-3',
        fullPage ? 'min-h-screen' : 'min-h-[200px]',
      ].join(' ')}
      role="status"
      aria-label={message}
    >
      {fullPage && (
        <img
          src={logoMono}
          alt=""
          aria-hidden="true"
          className="w-20 h-20 object-contain mb-1 animate-pulse"
        />
      )}
      <Spinner size="lg" />
      <p className="text-sm text-[#757575]">{message}</p>
    </div>
  )
}
