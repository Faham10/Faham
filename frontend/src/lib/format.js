export function formatPrice(price) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    maximumFractionDigits: 0
  }).format(price);
}

export function formatMileage(mileage) {
  return `${new Intl.NumberFormat("en-MY").format(mileage)} km`;
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-MY", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(date));
}
