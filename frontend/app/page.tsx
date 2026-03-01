import Link from "next/link";
// import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const features = [
  {
    title: "Available Tickets",
    description:
      "Lihat daftar tiket yang tersedia dengan filter dan pencarian.",
    href: "/available-tickets",
  },
  {
    title: "Book Ticket",
    description: "Booking tiket baru dengan memilih kode tiket dan jumlah.",
    href: "/book-ticket",
  },
  {
    title: "Booked Detail",
    description: "Lihat detail booking berdasarkan Booking ID.",
    href: "/booked-ticket",
  },
  {
    title: "Revoke Ticket",
    description: "Batalkan tiket dari booking yang sudah ada.",
    href: "/revoke-ticket",
  },
  {
    title: "Edit Booking",
    description: "Ubah jumlah tiket pada booking yang sudah ada.",
    href: "/edit-booking",
  },
];

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Acceloka Ticket Booking</h1>
        <p className="text-muted-foreground">
          Sistem pemesanan tiket untuk berbagai kategori event. Pilih menu di
          bawah untuk mulai.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => (
          <Link key={feature.href} href={feature.href}>
            <Card className="h-full hover:border-foreground/30 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
