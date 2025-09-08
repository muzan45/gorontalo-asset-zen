import { useState } from "react";
import { Plus, Search, Filter, Download, QrCode, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for inventory items
  const inventoryItems = [
    {
      id: "INV001",
      name: "Komputer Desktop Dell OptiPlex 7090",
      category: "Elektronik",
      condition: "Baik",
      location: "Ruang IT - Lantai 2",
      responsible: "Ahmad Rizki",
      acquisitionDate: "2023-01-15",
      quantity: 1,
    },
    {
      id: "INV002",
      name: "Meja Kerja Kayu - Executive",
      category: "Furniture",
      condition: "Baik",
      location: "Ruang Kepala - Lantai 3",
      responsible: "Siti Nurhaliza",
      acquisitionDate: "2023-02-20",
      quantity: 1,
    },
    {
      id: "INV003",
      name: "Printer Canon iP2870",
      category: "Elektronik",
      condition: "Perbaikan",
      location: "Ruang Admin - Lantai 1",
      responsible: "Budi Santoso",
      acquisitionDate: "2022-11-10",
      quantity: 1,
    },
    {
      id: "INV004",
      name: "Kursi Kantor Ergonomis",
      category: "Furniture",
      condition: "Baik",
      location: "Ruang Staff - Lantai 2",
      responsible: "Maya Sari",
      acquisitionDate: "2023-03-05",
      quantity: 8,
    },
    {
      id: "INV005",
      name: "AC Split 1.5 PK Daikin",
      category: "Elektronik",
      condition: "Rusak",
      location: "Ruang Rapat - Lantai 1",
      responsible: "Joni Iskandar",
      acquisitionDate: "2022-06-15",
      quantity: 2,
    },
  ];

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "baik":
        return "bg-green-100 text-green-800 border-green-200";
      case "perbaikan":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rusak":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.responsible.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Data Inventaris</h1>
          <p className="text-muted-foreground">
            Kelola dan pantau semua aset sarana dan prasarana
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
            <Button className="btn-primary" size="sm" onClick={() => window.location.href = '/inventory/add'}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Item
            </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="card-dashboard">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari item inventaris..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <QrCode className="mr-2 h-4 w-4" />
                Scan QR
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card className="card-dashboard">
        <CardHeader>
          <CardTitle>Daftar Inventaris</CardTitle>
          <CardDescription>
            Total {filteredItems.length} item ditemukan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Kode Item</TableHead>
                  <TableHead>Nama Item</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Kondisi</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Penanggung Jawab</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="text-muted-foreground">
                        Tidak ada data inventaris yang ditemukan
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {item.id}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Diperoleh: {new Date(item.acquisitionDate).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getConditionColor(item.condition)}>
                          {item.condition}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{item.location}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{item.responsible}</p>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-medium">{item.quantity}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              •••
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Item
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <QrCode className="mr-2 h-4 w-4" />
                              Generate QR
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;