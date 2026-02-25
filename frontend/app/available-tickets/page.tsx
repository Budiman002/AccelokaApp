"use client";

import { useState } from "react";
import { fetchApi } from "@/lib/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Ticket {
  id: number;
  code: string;
  name: string;
  category: string;
  eventDate: string;
  price: number;
  quota: number;
}

interface AvailableTicketsResponse {
  tickets: Ticket[];
  totalCount: number;
  currentPage: number | null;
  totalPages: number | null;
}

export default function AvailableTicketsPage() {
  const [filters, setFilters] = useState({
    namaKategori: "",
    kodeTicket: "",
    namaTicket: "",
    harga: "",
    tanggalEventMin: "",
    tanggalEventMax: "",
  });

  const [data, setData] = useState<AvailableTicketsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (filters.namaKategori)
        params.append("namaKategori", filters.namaKategori);
      if (filters.kodeTicket) params.append("kodeTicket", filters.kodeTicket);
      if (filters.namaTicket) params.append("namaTicket", filters.namaTicket);
      if (filters.harga) params.append("harga", filters.harga);
      if (filters.tanggalEventMin)
        params.append("tanggalEventMin", filters.tanggalEventMin);
      if (filters.tanggalEventMax)
        params.append("tanggalEventMax", filters.tanggalEventMax);

      const queryString = params.toString();
      const endpoint = `/get-available-ticket${queryString ? `?${queryString}` : ""}`;

      const result = await fetchApi<AvailableTicketsResponse>(endpoint);
      setData(result);
    } catch (err: unknown) {
      const error = err as { title?: string; detail?: string };
      setError(
        error.detail || error.title || "Terjadi kesalahan saat mengambil data.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFilters({
      namaKategori: "",
      kodeTicket: "",
      namaTicket: "",
      harga: "",
      tanggalEventMin: "",
      tanggalEventMax: "",
    });
    setData(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Available Tickets</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label htmlFor="namaKategori">Kategori</Label>
              <Input
                id="namaKategori"
                placeholder="e.g. Bioskop"
                value={filters.namaKategori}
                onChange={(e) =>
                  setFilters({ ...filters, namaKategori: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="kodeTicket">Kode Tiket</Label>
              <Input
                id="kodeTicket"
                placeholder="e.g. C001"
                value={filters.kodeTicket}
                onChange={(e) =>
                  setFilters({ ...filters, kodeTicket: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="namaTicket">Nama Tiket</Label>
              <Input
                id="namaTicket"
                placeholder="e.g. Avatar"
                value={filters.namaTicket}
                onChange={(e) =>
                  setFilters({ ...filters, namaTicket: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="harga">Harga</Label>
              <Input
                id="harga"
                type="number"
                placeholder="e.g. 50000"
                value={filters.harga}
                onChange={(e) =>
                  setFilters({ ...filters, harga: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="tanggalMin">Tanggal Event (Dari)</Label>
              <Input
                id="tanggalMin"
                type="date"
                value={filters.tanggalEventMin}
                onChange={(e) =>
                  setFilters({ ...filters, tanggalEventMin: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="tanggalMax">Tanggal Event (Sampai)</Label>
              <Input
                id="tanggalMax"
                type="date"
                value={filters.tanggalEventMax}
                onChange={(e) =>
                  setFilters({ ...filters, tanggalEventMax: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? "Mencari..." : "Cari"}
            </Button>
            <Button variant="outline" onClick={handleClear}>
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

      {data && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Hasil ({data.totalCount} tiket ditemukan)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.tickets.length === 0 ? (
              <p className="text-neutral-500 text-sm">
                Tidak ada tiket yang ditemukan.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Tanggal Event</TableHead>
                    <TableHead className="text-right">Harga</TableHead>
                    <TableHead className="text-right">Quota</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-mono">{ticket.code}</TableCell>
                      <TableCell>{ticket.name}</TableCell>
                      <TableCell>{ticket.category}</TableCell>
                      <TableCell>
                        {new Date(ticket.eventDate).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        Rp {ticket.price.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="text-right">
                        {ticket.quota}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
