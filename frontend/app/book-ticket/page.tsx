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

interface TicketInput {
  kodeTicket: string;
  qty: string;
}

interface BookedItem {
  kodeTicket: string;
  namaTicket: string;
  qty: number;
  price: number;
  subTotal: number;
}

interface CategoryBooking {
  categoryName: string;
  tickets: BookedItem[];
  categoryTotal: number;
}

interface BookTicketResponse {
  bookedTicketId: number;
  bookedDate: string;
  categories: CategoryBooking[];
  grandTotal: number;
}

export default function BookTicketPage() {
  const [tickets, setTickets] = useState<TicketInput[]>([
    { kodeTicket: "", qty: "" },
  ]);
  const [result, setResult] = useState<BookTicketResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addRow = () => {
    setTickets([...tickets, { kodeTicket: "", qty: "" }]);
  };

  const removeRow = (index: number) => {
    if (tickets.length <= 1) return;
    setTickets(tickets.filter((_, i) => i !== index));
  };

  const updateRow = (
    index: number,
    field: keyof TicketInput,
    value: string,
  ) => {
    const updated = [...tickets];
    updated[index][field] = value;
    setTickets(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const body = {
        tickets: tickets.map((t) => ({
          kodeTicket: t.kodeTicket,
          qty: parseInt(t.qty) || 0,
        })),
      };

      const response = await fetchApi<BookTicketResponse>("/book-ticket", {
        method: "POST",
        body: JSON.stringify(body),
      });

      setResult(response);
      setTickets([{ kodeTicket: "", qty: "" }]);
    } catch (err: unknown) {
      const error = err as { title?: string; detail?: string };
      setError(error.detail || error.title || "Gagal melakukan booking.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTickets([{ kodeTicket: "", qty: "" }]);
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Book Ticket</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Tiket yang ingin di-booking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tickets.map((ticket, index) => (
              <div key={index} className="flex gap-3 items-end">
                <div className="space-y-1 flex-1">
                  {index === 0 && <Label>Kode Tiket</Label>}
                  <Input
                    placeholder="e.g. C001"
                    value={ticket.kodeTicket}
                    onChange={(e) =>
                      updateRow(index, "kodeTicket", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1 w-28">
                  {index === 0 && <Label>Qty</Label>}
                  <Input
                    type="number"
                    placeholder="1"
                    value={ticket.qty}
                    onChange={(e) => updateRow(index, "qty", e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeRow(index)}
                  disabled={tickets.length <= 1}
                  className="shrink-0"
                >
                  Hapus
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={addRow}>
              + Tambah Tiket
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Memproses..." : "Book Sekarang"}
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Reset
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

      {result && (
        <div className="space-y-4">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <p className="text-green-700 font-medium">Booking berhasil!</p>
              <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                <div>
                  <p className="text-neutral-500">Booking ID</p>
                  <p className="font-medium">{result.bookedTicketId}</p>
                </div>
                <div>
                  <p className="text-neutral-500">Tanggal Booking</p>
                  <p className="font-medium">
                    {new Date(result.bookedDate).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {result.categories.map((category) => (
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
                  Rp {result.grandTotal.toLocaleString("id-ID")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
