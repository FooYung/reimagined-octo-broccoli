const priceFormatter = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

export function formatPrice(pence: number): string {
  return priceFormatter.format(pence / 100);
}
