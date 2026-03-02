//just found a better way untuk clean code pakai helper functions untuk formatting Biar ga repetitive di tiap page
// Format ke Rupiah
export function formatCurrency(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

// Format tanggal Indonesia
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Format tanggal + jam
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Validasi input quantity
export function validateQuantity(qty: string | number): boolean {
  const num = typeof qty === "string" ? parseInt(qty) : qty;
  return !isNaN(num) && num > 0;
}
