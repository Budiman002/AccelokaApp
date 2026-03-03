# AccelokaApp - Ticket Booking System

Sistem pemesanan tiket untuk berbagai kategori event, terdiri dari REST API backend dan web UI frontend.

## Tech Stack

**Backend:** ASP.NET Core (.NET 10), PostgreSQL, MediatR (CQRS), FluentValidation, Serilog

**Frontend:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui

## Cara Menjalankan

### Backend

1. Pastikan .NET SDK dan PostgreSQL sudah terinstall
2. Buat database `acceloka` di PostgreSQL
3. Update connection string di `backend/Acceloka.API/appsettings.json`
4. Jalankan:

```bash
cd backend/Acceloka.API
dotnet ef database update
dotnet run
```

Backend berjalan di `https://localhost:7039`

### Frontend

1. Pastikan Node.js sudah terinstall
2. Jalankan:

```bash
cd frontend
npm install
npm run dev
```

Frontend berjalan di `http://localhost:3000`

## Halaman Frontend

| Halaman           | Endpoint API                                   | Deskripsi                       |
| ----------------- | ---------------------------------------------- | ------------------------------- |
| Available Tickets | GET /api/v1/get-available-ticket               | Lihat dan filter tiket tersedia |
| Book Ticket       | POST /api/v1/book-ticket                       | Booking tiket baru              |
| Booked Detail     | GET /api/v1/get-booked-ticket/{id}             | Lihat detail booking            |
| Revoke Ticket     | DELETE /api/v1/revoke-ticket/{id}/{code}/{qty} | Batalkan tiket                  |
| Edit Booking      | PUT /api/v1/edit-booked-ticket/{id}            | Ubah jumlah tiket               |

## Author

Arif Budiman

## Documentation

[Documentation - Exam Project AccelokaApp](https://shy-fascinator-732.notion.site/Documentation-Exam-Project-2-Frontend-313d097ad30d81ef8351eaf20e000335)
