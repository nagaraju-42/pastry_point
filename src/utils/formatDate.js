import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns'

/**
 * Returns a human-friendly date string
 * "Today 3:45 PM" | "Yesterday 11:00 AM" | "12 Jan, 9:00 AM"
 */
export function formatOrderDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)

  if (isToday(date))     return 'Today ' + format(date, 'h:mm a')
  if (isYesterday(date)) return 'Yesterday ' + format(date, 'h:mm a')
  return format(date, 'd MMM, h:mm a')
}

/**
 * "2 minutes ago", "1 hour ago", etc.
 */
export function timeAgo(dateString) {
  if (!dateString) return ''
  return formatDistanceToNow(new Date(dateString), { addSuffix: true })
}

/**
 * Full date for receipts: "15 January 2024, 3:45 PM"
 */
export function formatReceiptDate(dateString) {
  if (!dateString) return ''
  return format(new Date(dateString), 'd MMMM yyyy, h:mm a')
}
