import { useState } from "react";
import { QrCode, Scan, Camera, Upload, Search, Package, MapPin, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const Scanner = () => {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [scannedItem, setScannedItem] = useState<any>(null);

  // Mock scanned item data
  const mockScannedData = {
    id: "INV001",
    name: "Komputer Desktop Dell OptiPlex 7090",
    category: "Elektronik",
    condition: "Baik",
    location: "Ruang IT - Lantai 2",
    responsible: "Ahmad Rizki",
    acquisitionDate: "2023-01-15",
    lastScanned: new Date().toISOString(),
    specifications: {
      brand: "Dell",
      model: "OptiPlex 7090",
      processor: "Intel Core i5-11500",
      memory: "8GB DDR4",
      storage: "256GB SSD"
    }
  };

  const handleStartScan = () => {
    setIsScanning(true);
    
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      setScannedItem(mockScannedData);
      toast({
        title: "QR Code berhasil dipindai!",
        description: `Item ${mockScannedData.name} ditemukan`,
      });
    }, 2000);
  };

  const handleManualSearch = () => {
    if (!manualCode.trim()) return;
    
    setScannedItem(mockScannedData);
    toast({
      title: "Item ditemukan!",
      description: `Item dengan kode ${manualCode} berhasil ditemukan`,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate QR code reading from image
      setTimeout(() => {
        setScannedItem(mockScannedData);
        toast({
          title: "QR Code berhasil dibaca!",
          description: `Item ${mockScannedData.name} ditemukan dari gambar`,
        });
      }, 1000);
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">QR Code Scanner</h1>
        <p className="text-muted-foreground">
          Pindai QR Code untuk melihat detail dan melacak inventaris
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scanner Section */}
        <div className="space-y-6">
          {/* Camera Scanner */}
          <Card className="card-dashboard">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Kamera Scanner
              </CardTitle>
              <CardDescription>
                Gunakan kamera untuk memindai QR Code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                {isScanning ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-pulse">
                      <QrCode className="h-16 w-16 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">Memindai QR Code...</p>
                    <div className="absolute inset-4 border-2 border-primary rounded-lg animate-pulse"></div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <QrCode className="h-16 w-16 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Tekan tombol untuk mulai memindai</p>
                  </div>
                )}
              </div>
              
              <Button 
                className="w-full btn-primary" 
                size="lg"
                onClick={handleStartScan}
                disabled={isScanning}
              >
                <Scan className="mr-2 h-5 w-5" />
                {isScanning ? "Memindai..." : "Mulai Pindai"}
              </Button>
            </CardContent>
          </Card>

          {/* Manual Input */}
          <Card className="card-dashboard">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Input Manual
              </CardTitle>
              <CardDescription>
                Masukkan kode item secara manual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Masukkan kode item (contoh: INV001)"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
                />
                <Button variant="outline" onClick={handleManualSearch}>
                  Cari
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upload Image */}
          <Card className="card-dashboard">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Gambar
              </CardTitle>
              <CardDescription>
                Upload foto QR Code untuk dipindai
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Pilih atau drop gambar QR Code
                </p>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="qr-upload"
                />
                <label htmlFor="qr-upload">
                  <Button variant="outline" size="sm" asChild>
                    <span>Pilih Gambar</span>
                  </Button>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Result Section */}
        <div>
          {scannedItem ? (
            <Card className="card-dashboard">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Detail Item
                </CardTitle>
                <CardDescription>
                  Informasi lengkap item yang dipindai
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold">{scannedItem.name}</h3>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {scannedItem.id}
                      </code>
                    </div>
                    <Badge className={getConditionColor(scannedItem.condition)}>
                      {scannedItem.condition}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Kategori</p>
                      <p className="font-medium">{scannedItem.category}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tanggal Perolehan</p>
                      <p className="font-medium">
                        {new Date(scannedItem.acquisitionDate).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Location & Responsible */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground text-sm">Lokasi</p>
                      <p className="font-medium">{scannedItem.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground text-sm">Penanggung Jawab</p>
                      <p className="font-medium">{scannedItem.responsible}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground text-sm">Terakhir Dipindai</p>
                      <p className="font-medium">
                        {new Date(scannedItem.lastScanned).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Specifications */}
                <div>
                  <h4 className="font-semibold mb-3">Spesifikasi</h4>
                  <div className="space-y-2 text-sm">
                    {Object.entries(scannedItem.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <span className="font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Actions */}
                <div className="space-y-2">
                  <Button className="w-full btn-primary">
                    <Package className="mr-2 h-4 w-4" />
                    Lihat Detail Lengkap
                  </Button>
                  <Button variant="outline" className="w-full">
                    Update Kondisi
                  </Button>
                  <Button variant="outline" className="w-full">
                    Pindah Lokasi
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="card-dashboard">
              <CardContent className="text-center py-12">
                <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Belum ada item dipindai</h3>
                <p className="text-muted-foreground">
                  Gunakan kamera, input manual, atau upload gambar untuk memindai QR Code
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scanner;