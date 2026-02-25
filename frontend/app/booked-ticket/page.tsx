"use client";

import { useState } from "react";
import { fetchApi } from "@/lib/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TicketDetail {
  kodeTicket: string;
  namaTicket: string;
  qty: number;
  price: number;
  subTotal: number;
}

interface CategoryGroup {
  categoryName: string;
  tickets: TicketDetail[];
  categoryTotal: number;
}

interface BookedTicketDetailResponse {
  bookedTicketId: number;
  bookedDate: string;
  categories: CategoryGroup[];
  grandTotal: number;
}

export default function BookedTicketPage() {
  const [bookedTicketId, setBookedTicketId] = useState("");
  const [data, setData] = useState<BookedTicketDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!bookedTicketId) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await fetchApi<BookedTicketDetailResponse>(
        `/get-booked-ticket/${bookedTicketId}`,
      );
      setData(result);
    } catch (err: unknown) {
      const error = err as { title?: string; detail?: string };
      setError(error.detail || error.title || "Data booking tidak ditemukan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Booked Ticket Detail</h1>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3 items-end">
            <div className="space-y-1 flex-1 max-w-xs">
              <Label htmlFor="bookedTicketId">Booking ID</Label>
              <Input
                id="bookedTicketId"
                type="number"
                placeholder="Masukkan Booking ID"
                value={bookedTicketId}
                onChange={(e) => setBookedTicketId(e.target.value)}
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={loading || !bookedTicketId}
            >
              {loading ? "Mencari..." : "Cari"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {data && (
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-neutral-500">Booking ID</p>
                  <p className="font-medium">{data.bookedTicketId}</p>
                </div>
                <div>
                  <p className="text-neutral-500">Tanggal Booking</p>
                  <p className="font-medium">
                    {new Date(data.bookedDate).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {data.categories.map((category) => (
            <Card key={category.categoryName}>
              <CardHeader>
                <CardTitle className="text-base">
                  {category.categoryName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kode</TableHead>
                      <TableHead>Nama Tiket</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Harga</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {category.tickets.map((ticket) => (
                      <TableRow key={ticket.kodeTicket}>
                        <TableCell className="font-mono">
                          {ticket.kodeTicket}
                        </TableCell>
                        <TableCell>{ticket.namaTicket}</TableCell>
                        <TableCell className="text-right">
                          {ticket.qty}
                        </TableCell>
                        <TableCell className="text-right">
                          Rp {ticket.price.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="text-right">
                          Rp {ticket.subTotal.toLocaleString("id-ID")}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={4} className="text-right font-medium">
                        Total Kategori
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        Rp {category.categoryTotal.toLocaleString("id-ID")}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}

          <Card className="bg-neutral-50">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <p className="font-semibold">Grand Total</p>
                <p className="text-xl font-semibold">
                  Rp {data.grandTotal.toLocaleString("id-ID")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
