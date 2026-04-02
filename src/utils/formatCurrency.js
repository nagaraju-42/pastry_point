/**
 * Format a number as Indian Rupee currency
 * e.g. 299 → "₹299.00"  |  1500 → "₹1,500.00"
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '₹0.00'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount)
}

/**
 * Short currency without decimals for UI display
 * e.g. 299 → "₹299"
 */
export function formatCurrencyShort(amount) {
  if (amount === null || amount === undefined) return '₹0'
  return '₹' + Number(amount).toLocaleString('en-IN')
}
