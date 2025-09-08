import { useState } from "react";
import { Plus, Edit, Trash2, MapPin, Building, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Locations = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    building: "",
    floor: "",
    capacity: "",
    responsible: "",
    description: "",
  });

  // Mock data for locations
  const locations = [
    {
      id: 1,
      name: "Ruang IT",
      building: "Gedung Utama", 
      floor: "Lantai 2",
      capacity: 10,
      responsible: "Ahmad Rizki",
      itemCount: 15,
      description: "Ruang khusus untuk tim IT dan server",
      status: "active"
    },
    {
      id: 2,
      name: "Ruang Kepala",
      building: "Gedung Utama",
      floor: "Lantai 3", 
      capacity: 5,
      responsible: "Siti Nurhaliza",
      itemCount: 8,
      description: "Ruang kerja kepala kantor",
      status: "active"
    },
    {
      id: 3,
      name: "Ruang Admin",
      building: "Gedung Utama",
      floor: "Lantai 1",
      capacity: 20,
      responsible: "Budi Santoso", 
      itemCount: 32,
      description: "Ruang kerja administrasi umum",
      status: "active"
    },
    {
      id: 4,
      name: "Ruang Rapat Besar",
      building: "Gedung Utama",
      floor: "Lantai 1",
      capacity: 50,
      responsible: "Maya Sari",
      itemCount: 12,
      description: "Ruang rapat untuk acara besar",
      status: "maintenance"
    },
    {
      id: 5,
      name: "Gudang Penyimpanan",
      building: "Gedang Annex", 
      floor: "Lantai Basement",
      capacity: 100,
      responsible: "Joni Iskandar",
      itemCount: 78,
      description: "Gudang untuk penyimpanan barang tidak aktif",
      status: "active"
    }
  ];

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.responsible.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Lokasi berhasil ditambahkan",
      description: `${formData.name} telah ditambahkan ke daftar lokasi`,
    });
    setIsDialogOpen(false);
    setFormData({
      name: "",
      building: "",
      floor: "",
      capacity: "",
      responsible: "",
      description: "",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Aktif";
      case "maintenance":
        return "Pemeliharaan";
      case "inactive":
        return "Tidak Aktif";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lokasi & Unit</h1>
          <p className="text-muted-foreground">
            Kelola dan organisir lokasi penyimpanan inventaris
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Lokasi
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Lokasi Baru</DialogTitle>
              <DialogDescription>
                Buat lokasi/ruangan baru untuk inventaris
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Ruangan *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Contoh: Ruang IT"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="building">Gedung</Label>
                  <Input
                    id="building"
                    value={formData.building}
                    onChange={(e) => setFormData(prev => ({ ...prev, building: e.target.value }))}
                    placeholder="Contoh: Gedung Utama"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="floor">Lantai</Label>
                  <Input
                    id="floor"
                    value={formData.floor}
                    onChange={(e) => setFormData(prev => ({ ...prev, floor: e.target.value }))}
                    placeholder="Contoh: Lantai 2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Kapasitas</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                    placeholder="Jumlah orang"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsible">Penanggung Jawab</Label>
                <Input
                  id="responsible"
                  value={formData.responsible}
                  onChange={(e) => setFormData(prev => ({ ...prev, responsible: e.target.value }))}
                  placeholder="Nama penanggung jawab"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Deskripsi ruangan atau fungsinya"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="btn-primary">
                  Tambah Lokasi
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="card-dashboard">
        <CardContent className="pt-6">
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari lokasi, gedung, atau penanggung jawab..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Location Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLocations.map((location) => (
          <Card key={location.id} className="card-dashboard group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{location.name}</CardTitle>
                </div>
                <Badge className={getStatusColor(location.status)}>
                  {getStatusText(location.status)}
                </Badge>
              </div>
              <CardDescription>
                {location.building} • {location.floor}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Kapasitas</p>
                  <p className="font-medium flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {location.capacity} orang
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Item</p>
                  <p className="font-medium">{location.itemCount} item</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <p className="text-muted-foreground text-sm">Penanggung Jawab</p>
                  <p className="font-medium">{location.responsible}</p>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {location.description}
                </p>
              </div>

              <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Trash2 className="h-3 w-3 mr-1" />
                  Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLocations.length === 0 && (
        <Card className="card-dashboard">
          <CardContent className="text-center py-12">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Tidak ada lokasi ditemukan</h3>
            <p className="text-muted-foreground mb-4">
              Mulai dengan menambahkan lokasi/ruangan baru
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Lokasi Pertama
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Locations;