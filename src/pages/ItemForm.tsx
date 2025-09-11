import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ItemForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    specification: "",
    brand: "",
    model: "",
    quantity: 1,
    condition: "",
    location: "",
    acquisitionDate: "",
    responsibleStaff: "",
    price: "",
    notes: "",
  });

  const [files, setFiles] = useState<File[]>([]);

  const categories = [
    "Elektronik", "Furniture", "Kendaraan", "Alat Tulis", "Peralatan IT", "Lainnya"
  ];

  const conditions = ["Baik", "Perbaikan", "Rusak"];
  
  const locations = [
    "Ruang IT - Lantai 2",
    "Ruang Kepala - Lantai 3", 
    "Ruang Admin - Lantai 1",
    "Ruang Staff - Lantai 2",
    "Ruang Rapat - Lantai 1",
    "Gudang - Lantai Basement"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: isEdit ? "Item berhasil diperbarui" : "Item berhasil ditambahkan",
        description: `${formData.name} telah ${isEdit ? 'diperbarui' : 'ditambahkan'} ke inventaris`,
      });
      navigate("/inventory");
    }, 1000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/inventory")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isEdit ? "Edit Item" : "Tambah Item Baru"}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? "Perbarui informasi item inventaris" : "Tambahkan item baru ke inventaris"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="card-dashboard">
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
              <CardDescription>
                Masukkan informasi dasar item inventaris
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Item *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Masukkan nama item"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Merek</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                    placeholder="Masukkan merek"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model/Tipe</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                    placeholder="Masukkan model/tipe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specification">Spesifikasi</Label>
                <Textarea
                  id="specification"
                  value={formData.specification}
                  onChange={(e) => setFormData(prev => ({ ...prev, specification: e.target.value }))}
                  placeholder="Masukkan spesifikasi detail (ukuran, kapasitas, dll)"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Status & Location */}
          <Card className="card-dashboard">
            <CardHeader>
              <CardTitle>Status & Lokasi</CardTitle>
              <CardDescription>
                Tentukan status dan lokasi item
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Jumlah *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition">Kondisi *</Label>
                  <Select value={formData.condition} onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kondisi" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Harga Perolehan</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Lokasi *</Label>
                  <Select value={formData.location} onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih lokasi" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responsibleStaff">Penanggung Jawab</Label>
                  <Input
                    id="responsibleStaff"
                    value={formData.responsibleStaff}
                    onChange={(e) => setFormData(prev => ({ ...prev, responsibleStaff: e.target.value }))}
                    placeholder="Nama penanggung jawab"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="acquisitionDate">Tanggal Perolehan</Label>
                <Input
                  id="acquisitionDate"
                  type="date"
                  value={formData.acquisitionDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, acquisitionDate: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Catatan</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Catatan tambahan (opsional)"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* File Upload */}
          <Card className="card-dashboard">
            <CardHeader>
              <CardTitle>Foto & Dokumen</CardTitle>
              <CardDescription>
                Upload foto dan dokumen pendukung
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drop files here or click to upload
                </p>
                <Input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Label htmlFor="file-upload" asChild>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Pilih File
                  </Button>
                </Label>
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <Label>File yang diupload:</Label>
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm truncate">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>


          {/* Action Buttons */}
          <div className="space-y-3">
            <Button type="submit" className="w-full btn-primary" size="lg">
              <Save className="h-4 w-4 mr-2" />
              {isEdit ? "Simpan Perubahan" : "Tambah Item"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate("/inventory")}
            >
              Batal
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ItemForm;