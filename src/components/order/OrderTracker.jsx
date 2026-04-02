import { CheckCircle2, Circle, Clock, ChefHat, Bell, Bike } from 'lucide-react'
import { STATUS_STEP } from '../../constants/orderStatus.js'

const STEPS = [
  { label: 'Order Placed',  icon: Clock },
  { label: 'Confirmed',     icon: CheckCircle2 },
  { label: 'Preparing',     icon: ChefHat },
  { label: 'Ready',         icon: Bell },
  { label: 'Delivered',     icon: Bike },
]

export default function OrderTracker({ status }) {
  const currentStep = STATUS_STEP[status] ?? 0
  const cancelled = status === 'CANCELLED'

  if (cancelled) {
    return (
      <div className="flex items-center justify-center gap-2 py-4 text-red-500">
        <Circle size={20} />
        <span className="font-medium">Order Cancelled</span>
      </div>
    )
  }

  return (
    <div className="relative flex items-center justify-between w-full py-4 px-2">
      {/* connector line */}
      <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-200 -translate-y-1/2 z-0 rounded-full">
        <div
          className="h-full bg-bakery-green rounded-full transition-all duration-700"
          style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
        />
      </div>

      {STEPS.map((step, i) => {
        const Icon = step.icon
        const done = i < currentStep
        const active = i === currentStep
        return (
          <div key={step.label} className="relative z-10 flex flex-col items-center gap-1.5 w-14">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300
              ${done   ? 'bg-bakery-green text-white shadow-md'   : ''}
              ${active ? 'bg-bakery-green text-white shadow-lg ring-4 ring-green-200 scale-110' : ''}
              ${!done && !active ? 'bg-white border-2 border-gray-200 text-gray-400' : ''}`}
            >
              <Icon size={17} />
            </div>
            <span className={`text-[10px] text-center leading-tight font-medium
              ${active ? 'text-bakery-green' : done ? 'text-gray-600' : 'text-gray-400'}`}>
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
