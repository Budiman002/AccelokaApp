// API Endpoints
export const API_ENDPOINTS = {
  GET_AVAILABLE_TICKETS: "/get-available-ticket",
  BOOK_TICKET: "/book-ticket",
  GET_BOOKED_TICKET: "/get-booked-ticket",
  REVOKE_TICKET: "/revoke-ticket",
  EDIT_BOOKED_TICKET: "/edit-booked-ticket",
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Koneksi ke server gagal. Cek internet Anda.",
  GENERIC_ERROR: "Terjadi kesalahan. Silakan coba lagi.",
  BOOKING_FAILED: "Booking gagal. Periksa kembali data yang diinput.",
  NOT_FOUND: "Data tidak ditemukan.",
} as const;
