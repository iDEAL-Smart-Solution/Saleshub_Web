import { Outlet } from 'react-router-dom'
import logo from '@/assets/LOGO.png'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* ── Left panel – branding ── */}
      <div
        className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col items-center justify-center
          bg-[#1565C0] px-12 py-16 relative overflow-hidden"
        aria-hidden="true"
      >
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[36rem] h-[36rem] rounded-full bg-white/[0.03]" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-md gap-8">
          <img
            src={logo}
            alt="iDEAL SalesHub"
            className="w-44 object-contain drop-shadow-lg"
          />
          <div>
            <h1 className="text-3xl font-bold text-white leading-tight">
              iDEAL SalesHub
            </h1>
            <p className="text-[#BBDEFB] mt-3 text-base leading-relaxed">
              Marketing &amp; sales management — built for clarity, performance
              and growth.
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full mt-4">
            {[
              { label: 'Track sales in real time' },
              { label: 'Monitor KPI progress and carry-forward' },
              { label: 'Manage commissions automatically' },
            ].map(({ label }) => (
              <div key={label} className="flex items-center gap-3 text-left">
                <span className="w-2 h-2 rounded-full bg-white shrink-0" />
                <span className="text-sm text-[#E3F2FD]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel – form ── */}
      <main
        className="flex-1 flex flex-col items-center justify-center
          bg-white px-6 py-12 sm:px-10 lg:px-16"
      >
        {/* Mobile logo */}
        <div className="lg:hidden mb-8 flex flex-col items-center gap-3">
          <img
            src={logo}
            alt="iDEAL SalesHub"
            className="w-24 object-contain"
          />
          <p className="text-sm font-medium text-[#1565C0]">iDEAL SalesHub</p>
        </div>

        <div className="w-full max-w-md">
          <Outlet />
        </div>

        <footer className="mt-12 text-center text-xs text-[#9E9E9E]">
          &copy; {new Date().getFullYear()} iDEAL. All rights reserved.
        </footer>
      </main>
    </div>
  )
}
