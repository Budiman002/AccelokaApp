"use client";

import { useState } from "react";
import { fetchApi } from "@/lib/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RevokeTicketResponse {
  kodeTicket: string;
  namaTicket: string;
  namaKategori: string;
  sisaQuantity: number;
}

export default function RevokeTicketPage() {
  const [form, setForm] = useState({
    bookedTicketId: "",
    ticketCode: "",
    quantity: "",
  });
  const [result, setResult] = useState<RevokeTicketResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRevoke = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setShowConfirm(false);

    try {
      const response = await fetchApi<RevokeTicketResponse>(
        `/revoke-ticket/${form.bookedTicketId}/${form.ticketCode}/${form.quantity}`,
        { method: "DELETE" },
      );
      setResult(response);
      setForm({ bookedTicketId: "", ticketCode: "", quantity: "" });
    } catch (err: unknown) {
      const error = err as { title?: string; detail?: string };
      setError(error.detail || error.title || "Gagal melakukan revoke tiket.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!form.bookedTicketId || !form.ticketCode || !form.quantity) return;
    setShowConfirm(true);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Revoke Ticket</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Data Tiket yang ingin di-revoke
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label htmlFor="bookedTicketId">Booking ID</Label>
              <Input
                id="bookedTicketId"
                type="number"
                placeholder="e.g. 1"
                value={form.bookedTicketId}
                onChange={(e) =>
                  setForm({ ...form, bookedTicketId: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ticketCode">Kode Tiket</Label>
              <Input
                id="ticketCode"
                placeholder="e.g. C001"
                value={form.ticketCode}
                onChange={(e) =>
                  setForm({ ...form, ticketCode: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="e.g. 1"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="destructive"
              onClick={handleSubmit}
              disabled={
                loading ||
                !form.bookedTicketId ||
                !form.ticketCode ||
                !form.quantity
              }
            >
              Revoke Tiket
            </Button>
          </div>
        </CardContent>
      </Card>

      {showConfirm && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <p className="text-sm text-amber-800 mb-3">
              Yakin ingin revoke tiket{" "}
              <span className="font-medium">{form.ticketCode}</span> sebanyak{" "}
              <span className="font-medium">{form.quantity}</span> dari Booking
              ID <span className="font-medium">{form.bookedTicketId}</span>?
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="destructive"
                onClick={handleRevoke}
                disabled={loading}
              >
                {loading ? "Memproses..." : "Ya, Revoke"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowConfirm(false)}
              >
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <p className="text-green-700 font-medium mb-3">
              Tiket berhasil di-revoke!
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-neutral-500">Kode Tiket</p>
                <p className="font-medium font-mono">{result.kodeTicket}</p>
              </div>
              <div>
                <p className="text-neutral-500">Nama Tiket</p>
                <p className="font-medium">{result.namaTicket}</p>
              </div>
              <div>
                <p className="text-neutral-500">Kategori</p>
                <p className="font-medium">{result.namaKategori}</p>
              </div>
              <div>
                <p className="text-neutral-500">Sisa Quantity</p>
                <p className="font-medium">{result.sisaQuantity}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
