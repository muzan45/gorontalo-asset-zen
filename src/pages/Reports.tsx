import { useState } from "react";
import { FileText, Download, Calendar, Filter, BarChart3, PieChart, TrendingUp, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const Reports = () => {
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [dateRange, setDateRange] = useState({
    from: new Date(2024, 0, 1),
    to: new Date()
  });

  const reportTypes = [
    {
      id: "inventory-summary",
      name: "Ringkasan Inventaris",
      description: "Laporan lengkap semua item inventaris",
      icon: Package,
      format: ["PDF", "Excel"]
    },
    {
      id: "kegiatan-summary",
      name: "Ringkasan Kegiatan",
      description: "Laporan semua kegiatan, ujian, dan pelatihan",
      icon: Calendar,
      format: ["PDF", "Excel"]
    },
    {
      id: "kegiatan-inventory",
      name: "Laporan Inventaris per Kegiatan",
      description: "Item inventaris yang digunakan dalam setiap kegiatan",
      icon: Calendar,
      format: ["PDF", "Excel"]
    },
    {
      id: "condition-report",
      name: "Laporan Kondisi",
      description: "Status kondisi semua item (baik/rusak/perbaikan)",
      icon: BarChart3,
      format: ["PDF", "Excel"]
    },
    {
      id: "location-report",
      name: "Laporan per Lokasi",
      description: "Distribusi inventaris berdasarkan lokasi",
      icon: PieChart,
      format: ["PDF", "Excel"]
    },
    {
      id: "acquisition-report",
      name: "Laporan Perolehan",
      description: "Item yang diperoleh dalam periode tertentu",
      icon: TrendingUp,
      format: ["PDF", "Excel"]
    },
    {
      id: "maintenance-report",
      name: "Laporan Pemeliharaan",
      description: "Item yang memerlukan perbaikan atau pemeliharaan",
      icon: FileText,
      format: ["PDF", "Excel"]
    }
  ];

  const quickStats = [
    {
      title: "Total Inventaris",
      value: "1,247",
      change: "+12%",
      trend: "up"
    },
    {
      title: "Total Kegiatan",
      value: "43",
      change: "+7",
      trend: "up"
    },
    {
      title: "Kegiatan Aktif",
      value: "8",
      change: "+3",
      trend: "up"
    },
    {
      title: "Kondisi Baik",
      value: "1,089",
      change: "+8%", 
      trend: "up"
    }
  ];

  const recentReports = [
    {
      id: 1,
      name: "Laporan Inventaris Bulanan - Januari 2024",
      type: "inventory-summary",
      generatedAt: "2024-01-31",
      generatedBy: "Admin BKN",
      size: "2.4 MB"
    },
    {
      id: 2,
      name: "Laporan Kegiatan Ujian CAT - Februari 2024",
      type: "kegiatan-inventory",
      generatedAt: "2024-02-15",
      generatedBy: "Staff IT",
      size: "1.2 MB"
    },
    {
      id: 3,
      name: "Ringkasan Kegiatan Q1 2024",
      type: "kegiatan-summary",
      generatedAt: "2024-03-01",
      generatedBy: "Admin BKN",
      size: "1.8 MB"
    },
    {
      id: 4,
      name: "Laporan Kondisi Item - Q4 2023",
      type: "condition-report", 
      generatedAt: "2023-12-31",
      generatedBy: "Staff IT",
      size: "1.8 MB"
    },
    {
      id: 5,
      name: "Distribusi per Lokasi - Desember 2023",
      type: "location-report",
      generatedAt: "2023-12-20",
      generatedBy: "Admin BKN", 
      size: "3.1 MB"
    }
  ];

  const handleGenerateReport = (format: string) => {
    if (!selectedReport) {
      toast({
        title: "Pilih jenis laporan",
        description: "Silakan pilih jenis laporan yang ingin dibuat",
        variant: "destructive"
      });
      return;
    }

    const reportName = reportTypes.find(r => r.id === selectedReport)?.name;
    
    // Simulate report generation
    setTimeout(() => {
      toast({
        title: "Laporan berhasil dibuat!",
        description: `${reportName} (${format}) sedang diunduh...`,
      });
    }, 1500);
  };

  const handleDownloadReport = (reportId: number) => {
    const report = recentReports.find(r => r.id === reportId);
    toast({
      title: "Mengunduh laporan",
      description: `${report?.name} sedang diunduh...`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Laporan</h1>
        <p className="text-muted-foreground">
          Buat dan kelola laporan inventaris sarana dan prasarana
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="card-dashboard">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={`text-xs flex items-center gap-1 ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className={`h-3 w-3 ${
                      stat.trend === 'down' ? 'rotate-180' : ''
                    }`} />
                    {stat.change}
                  </p>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Generator */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="card-dashboard">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Buat Laporan Baru
              </CardTitle>
              <CardDescription>
                Pilih jenis laporan dan parameter untuk membuat laporan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Report Type Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Jenis Laporan</label>
                <div className="grid grid-cols-1 gap-3">
                  {reportTypes.map((report) => {
                    const IconComponent = report.icon;
                    return (
                      <div
                        key={report.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedReport === report.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedReport(report.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{report.name}</h4>
                            <p className="text-sm text-muted-foreground">{report.description}</p>
                            <div className="flex gap-2 mt-2">
                              {report.format.map((format) => (
                                <Badge key={format} variant="secondary" className="text-xs">
                                  {format}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Filter Berdasarkan</label>
                  <Select value={filterBy} onValueChange={setFilterBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Item</SelectItem>
                      <SelectItem value="category">Kategori</SelectItem>
                      <SelectItem value="location">Lokasi</SelectItem>
                      <SelectItem value="condition">Kondisi</SelectItem>
                      <SelectItem value="responsible">Penanggung Jawab</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Periode Tanggal</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      value={dateRange.from.toISOString().split('T')[0]}
                      onChange={(e) => setDateRange(prev => ({ 
                        ...prev, 
                        from: new Date(e.target.value) 
                      }))}
                    />
                    <Input
                      type="date"
                      value={dateRange.to.toISOString().split('T')[0]}
                      onChange={(e) => setDateRange(prev => ({ 
                        ...prev, 
                        to: new Date(e.target.value) 
                      }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Generate Buttons */}
              <div className="flex gap-3">
                <Button 
                  className="btn-primary flex-1"
                  onClick={() => handleGenerateReport('PDF')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Generate PDF
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleGenerateReport('Excel')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Generate Excel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <div>
          <Card className="card-dashboard">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Laporan Terbaru
              </CardTitle>
              <CardDescription>
                Riwayat laporan yang telah dibuat
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentReports.map((report) => (
                <div key={report.id} className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm leading-tight">{report.name}</h4>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Dibuat: {new Date(report.generatedAt).toLocaleDateString('id-ID')}</p>
                      <p>Oleh: {report.generatedBy}</p>
                      <p>Ukuran: {report.size}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleDownloadReport(report.id)}
                    >
                      <Download className="mr-2 h-3 w-3" />
                      Unduh
                    </Button>
                  </div>
                </div>
              ))}
              
              {recentReports.length === 0 && (
                <div className="text-center py-6">
                  <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Belum ada laporan yang dibuat
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;