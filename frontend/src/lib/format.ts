const priceFormatter = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

export function formatPrice(pence: number): string {
  return priceFormatter.format(pence / 100);
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate));
}
