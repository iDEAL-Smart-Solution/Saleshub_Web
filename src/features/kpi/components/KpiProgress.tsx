import { formatPercent } from '@/utils/formatters'

interface Props { value: number; label?: string }

export default function KpiProgress({ value, label = 'KPI progress' }: Props) {
  const bounded = Math.min(100, Math.max(0, value))
  return (
    <div>
      <div className="mb-1 flex justify-between gap-3 text-sm"><span className="text-[#757575]">{label}</span><span className="font-semibold text-[#212121]">{formatPercent(value)}</span></div>
      <div className="h-2 overflow-hidden rounded-full bg-[#E3F2FD]" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={bounded}>
        <div className="h-full rounded-full bg-[#1565C0] transition-all" style={{ width: `${bounded}%` }} />
      </div>
    </div>
  )
}
