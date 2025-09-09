import { useState } from "react";
import { Calendar, Plus, Search, Clock, MapPin, Users, Package, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const Kegiatan = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data for events/kegiatan
  const events = [
    {
      id: 1,
      name: "Ujian CAT CPNS 2024",
      type: "ujian",
      date: "2024-03-15",
      endDate: "2024-03-17",
      status: "active",
      location: "Lab Komputer 1",
      responsible: "Dr. Ahmad Ridwan",
      participants: 150,
      itemsAssigned: 45,
      description: "Ujian Computer Assisted Test untuk CPNS periode 2024"
    },
    {
      id: 2,
      name: "Pelatihan Sistem Informasi",
      type: "pelatihan",
      date: "2024-03-20",
      endDate: "2024-03-22",
      status: "scheduled",
      location: "Ruang Seminar",
      responsible: "Ir. Siti Nurhaliza",
      participants: 30,
      itemsAssigned: 12,
      description: "Pelatihan penggunaan sistem informasi kepegawaian"
    },
    {
      id: 3,
      name: "Workshop Digital Transformation",
      type: "workshop",
      date: "2024-02-28",
      endDate: "2024-02-28",
      status: "completed",
      location: "Aula Utama",
      responsible: "Prof. Budi Santoso",
      participants: 80,
      itemsAssigned: 25,
      description: "Workshop transformasi digital untuk aparatur sipil negara"
    },
    {
      id: 4,
      name: "Rapat Koordinasi Bulanan",
      type: "rapat",
      date: "2024-03-10",
      endDate: "2024-03-10",
      status: "completed",
      location: "Ruang Rapat Besar",
      responsible: "Drs. Made Wirawan",
      participants: 25,
      itemsAssigned: 8,
      description: "Rapat koordinasi rutin bulanan semua unit kerja"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Berlangsung';
      case 'scheduled': return 'Terjadwal';
      case 'completed': return 'Selesai';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ujian':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pelatihan':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'workshop':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'rapat':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.responsible.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (eventId: number) => {
    toast({
      title: "Edit Kegiatan",
      description: `Mengedit kegiatan ID: ${eventId}`,
    });
  };

  const handleDelete = (eventId: number) => {
    toast({
      title: "Hapus Kegiatan",
      description: "Kegiatan berhasil dihapus",
      variant: "destructive"
    });
  };

  const handleViewDetails = (eventId: number) => {
    toast({
      title: "Detail Kegiatan",
      description: `Melihat detail kegiatan ID: ${eventId}`,
    });
  };

  const handleAssignItems = (eventId: number) => {
    toast({
      title: "Assign Inventaris",
      description: `Mengelola inventaris untuk kegiatan ID: ${eventId}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manajemen Kegiatan</h1>
          <p className="text-muted-foreground">
            Kelola kegiatan, ujian, pelatihan, dan workshop beserta inventaris yang digunakan
          </p>
        </div>
        <Button className="btn-primary">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Kegiatan
        </Button>
      </div>

      {/* Filters */}
      <Card className="card-dashboard">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan nama kegiatan, penanggung jawab, atau lokasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="active">Berlangsung</SelectItem>
                <SelectItem value="scheduled">Terjadwal</SelectItem>
                <SelectItem value="completed">Selesai</SelectItem>
                <SelectItem value="cancelled">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="card-dashboard hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg leading-tight">{event.name}</CardTitle>
                  <div className="flex gap-2">
                    <Badge className={`text-xs ${getTypeColor(event.type)}`}>
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </Badge>
                    <Badge className={`text-xs ${getStatusColor(event.status)}`}>
                      {getStatusText(event.status)}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <div className="h-4 w-4 flex items-center justify-center">⋯</div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(event.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Lihat Detail
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAssignItems(event.id)}>
                      <Package className="mr-2 h-4 w-4" />
                      Kelola Inventaris
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(event.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(event.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                {event.description}
              </CardDescription>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    {new Date(event.date).toLocaleDateString('id-ID')} 
                    {event.date !== event.endDate && ` - ${new Date(event.endDate).toLocaleDateString('id-ID')}`}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{event.participants} peserta</span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span>{event.itemsAssigned} item inventaris</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  <strong>Penanggung Jawab:</strong> {event.responsible}
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleAssignItems(event.id)}
                >
                  <Package className="mr-1 h-3 w-3" />
                  Inventaris
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleViewDetails(event.id)}
                >
                  <Eye className="mr-1 h-3 w-3" />
                  Detail
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <Card className="card-dashboard">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Tidak ada kegiatan ditemukan</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || statusFilter !== "all" 
                ? "Coba ubah filter pencarian atau buat kegiatan baru" 
                : "Belum ada kegiatan yang terdaftar. Mulai dengan menambahkan kegiatan baru."}
            </p>
            <Button className="btn-primary">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Kegiatan Pertama
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Kegiatan;