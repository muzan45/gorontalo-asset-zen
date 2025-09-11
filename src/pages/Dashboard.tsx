import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { Package, MapPin, AlertTriangle, CheckCircle, Clock, Plus } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { inventoryAPI, eventsAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/dashboard-hero.jpg";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch dashboard stats
  const { data: inventoryStats, isLoading: statsLoading } = useQuery({
    queryKey: ['inventory-stats'],
    queryFn: () => inventoryAPI.getStats(),
  });

  // Get recent activities (mock for now)
  const recentActivities = [
    {
      id: 1,
      action: "Menambahkan item baru",
      item: "Komputer Desktop Dell OptiPlex 7090",
      user: user?.fullName || "Admin BKN",
      time: "2 jam yang lalu",
      type: "add" as const,
    },
    {
      id: 2,
      action: "Mengubah kondisi item",
      item: "Printer Canon iP2870",
      user: "Staff IT",
      time: "4 jam yang lalu",
      type: "update" as const,
    },
    {
      id: 3,
      action: "Memindahkan lokasi",
      item: "Meja Kerja Kayu - MK001",
      user: user?.fullName || "Admin BKN",
      time: "6 jam yang lalu",
      type: "move" as const,
    },
  ];

  const statsData = [
    {
      title: "Total Inventaris",
      value: inventoryStats?.data?.totalItems?.toString() || "0",
      icon: Package,
      trend: { value: 12, label: "dari bulan lalu" },
      color: "blue" as const,
    },
    {
      title: "Kondisi Baik", 
      value: inventoryStats?.data?.conditionStats?.find((s: any) => s.condition === 'Baik')?.count?.toString() || "0",
      icon: CheckCircle,
      trend: { value: 8, label: "dari bulan lalu" },
      color: "green" as const,
    },
    {
      title: "Perlu Perbaikan",
      value: inventoryStats?.data?.conditionStats?.find((s: any) => s.condition === 'Rusak Ringan')?.count?.toString() || "0",
      icon: AlertTriangle,
      trend: { value: -5, label: "dari bulan lalu" },
      color: "yellow" as const,
    },
    {
      title: "Lokasi Aktif",
      value: "34",
      icon: MapPin,
      trend: { value: 2, label: "lokasi baru" },
      color: "blue" as const,
    },
  ];

  const getActionColor = (type: string) => {
    switch (type) {
      case "add":
        return "bg-green-100 text-green-800";
      case "update":
        return "bg-blue-100 text-blue-800";
      case "move":
        return "bg-yellow-100 text-yellow-800";
      case "scan":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div 
        className="relative h-48 rounded-xl overflow-hidden bg-gradient-dashboard"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60" />
        <div className="relative h-full flex items-center justify-between p-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Selamat Datang di Sistem Inventaris Digital
            </h1>
            <p className="text-white/90 text-lg">
              UPT BKN Gorontalo - Kelola sarana dan prasarana dengan mudah dan efisien
            </p>
          </div>
          <div className="hidden md:flex gap-3">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => navigate('/inventory/add')}
            >
              <Plus className="mr-2 h-5 w-5" />
              Tambah Item
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            color={stat.color}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2 card-dashboard">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Aktivitas Terbaru
            </CardTitle>
            <CardDescription>
              Pantau semua aktivitas inventaris secara real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <Badge className={getActionColor(activity.type)}>
                    {activity.action}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{activity.item}</p>
                    <p className="text-xs text-muted-foreground">
                      oleh {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="card-dashboard">
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>
              Fitur yang sering digunakan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/inventory/add')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Item
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;