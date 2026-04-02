import { STATUS_LABELS, STATUS_COLORS } from '../../constants/orderStatus.js'

export default function OrderStatusBadge({ status }) {
  const label = STATUS_LABELS[status] || status
  const colorClass = STATUS_COLORS[status] || 'badge-gray'
  return <span className={colorClass}>{label}</span>
}
