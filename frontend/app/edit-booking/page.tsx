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
  ticketCode: string;
  newQuantity: string;
}

interface EditedTicket {
  kodeTicket: string;
  namaTicket: string;
  namaKategori: string;
  sisaQuantity: number;
}

interface EditBookedTicketResponse {
  editedTickets: EditedTicket[];
}

export default function EditBookingPage() {
  const [bookedTicketId, setBookedTicketId] = useState("");
  const [tickets, setTickets] = useState<TicketInput[]>([
    { ticketCode: "", newQuantity: "" },
  ]);
  const [result, setResult] = useState<EditBookedTicketResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addRow = () => {
    setTickets([...tickets, { ticketCode: "", newQuantity: "" }]);
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
    if (!bookedTicketId) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const body = {
        tickets: tickets.map((t) => ({
          ticketCode: t.ticketCode,
          newQuantity: parseInt(t.newQuantity) || 0,
        })),
      };

      const response = await fetchApi<EditBookedTicketResponse>(
        `/edit-booked-ticket/${bookedTicketId}`,
        {
          method: "PUT",
          body: JSON.stringify(body),
        },
      );
      setResult(response);
    } catch (err: unknown) {
      const error = err as { title?: string; detail?: string };
      setError(error.detail || error.title || "Gagal mengedit booking.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBookedTicketId("");
    setTickets([{ ticketCode: "", newQuantity: "" }]);
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit Booking</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Edit Data Booking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-1 max-w-xs">
              <Label htmlFor="bookedTicketId">Booking ID</Label>
              <Input
                id="bookedTicketId"
                type="number"
                placeholder="Masukkan Booking ID"
                value={bookedTicketId}
                onChange={(e) => setBookedTicketId(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label>Tiket yang ingin diubah</Label>
              {tickets.map((ticket, index) => (
                <div key={index} className="flex gap-3 items-end">
                  <div className="space-y-1 flex-1">
                    {index === 0 && (
                      <Label className="text-xs text-neutral-500">
                        Kode Tiket
                      </Label>
                    )}
                    <Input
                      placeholder="e.g. C001"
                      value={ticket.ticketCode}
                      onChange={(e) =>
                        updateRow(index, "ticketCode", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1 w-32">
                    {index === 0 && (
                      <Label className="text-xs text-neutral-500">
                        Qty Baru
                      </Label>
                    )}
                    <Input
                      type="number"
                      placeholder="1"
                      value={ticket.newQuantity}
                      onChange={(e) =>
                        updateRow(index, "newQuantity", e.target.value)
                      }
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
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={addRow}>
              + Tambah Tiket
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || !bookedTicketId}
            >
              {loading ? "Memproses..." : "Simpan Perubahan"}
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
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-base text-green-700">
              Booking berhasil diubah!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama Tiket</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead className="text-right">Sisa Qty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.editedTickets.map((ticket) => (
                  <TableRow key={ticket.kodeTicket}>
                    <TableCell className="font-mono">
                      {ticket.kodeTicket}
                    </TableCell>
                    <TableCell>{ticket.namaTicket}</TableCell>
                    <TableCell>{ticket.namaKategori}</TableCell>
                    <TableCell className="text-right">
                      {ticket.sisaQuantity}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
