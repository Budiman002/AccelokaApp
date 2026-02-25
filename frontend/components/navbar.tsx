"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/available-tickets", label: "Available Tickets" },
  { href: "/book-ticket", label: "Book Ticket" },
  { href: "/booked-ticket", label: "Booked Detail" },
  { href: "/revoke-ticket", label: "Revoke Ticket" },
  { href: "/edit-booking", label: "Edit Booking" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center h-14 gap-8">
          <Link href="/" className="font-semibold text-lg">
            Acceloka
          </Link>
          <div className="flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded text-sm ${
                  pathname === item.href
                    ? "bg-neutral-100 font-medium"
                    : "text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
