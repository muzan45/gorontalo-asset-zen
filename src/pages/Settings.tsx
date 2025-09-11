import { useState } from "react";
import { Settings as SettingsIcon, Users, Database, Shield, Bell, Download, Upload, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    autoBackup: true,
    emailNotifications: true,
    systemAlerts: true,
    maintenanceReminders: true,
    
  });

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Administrator",
      email: "admin@bkn.go.id",
      role: "Admin",
      status: "active",
      lastLogin: "2024-01-15 09:30"
    },
    {
      id: 2,
      name: "Staff IT",
      email: "it@bkn.go.id", 
      role: "Staff",
      status: "active",
      lastLogin: "2024-01-14 16:45"
    },
    {
      id: 3,
      name: "Staff Admin",
      email: "staff@bkn.go.id",
      role: "Staff", 
      status: "inactive",
      lastLogin: "2024-01-10 08:20"
    }
  ]);

  const backupHistory = [
    {
      id: 1,
      name: "backup_2024_01_15_093045.sql",
      date: "2024-01-15 09:30:45",
      size: "2.4 MB",
      type: "Manual"
    },
    {
      id: 2,
      name: "backup_2024_01_14_000000.sql", 
      date: "2024-01-14 00:00:00",
      size: "2.3 MB",
      type: "Otomatis"
    },
    {
      id: 3,
      name: "backup_2024_01_13_000000.sql",
      date: "2024-01-13 00:00:00", 
      size: "2.2 MB",
      type: "Otomatis"
    }
  ];

  const handleSaveSettings = () => {
    toast({
      title: "Pengaturan tersimpan",
      description: "Semua perubahan pengaturan telah disimpan",
    });
  };

  const handleBackupNow = () => {
    toast({
      title: "Backup dimulai",
      description: "Proses backup database sedang berjalan...",
    });
    
    // Simulate backup process
    setTimeout(() => {
      toast({
        title: "Backup selesai!",
        description: "Database berhasil di-backup dan disimpan",
      });
    }, 3000);
  };

  const handleRestoreDatabase = () => {
    toast({
      title: "Restore dimulai", 
      description: "Proses restore database sedang berjalan...",
    });
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    toast({
      title: "User dihapus",
      description: "User telah berhasil dihapus dari sistem",
    });
  };

  const getStatusColor = (status: string) => {
    return status === "active" 
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Pengaturan</h1>
        <p className="text-muted-foreground">
          Kelola pengaturan sistem, user, dan backup database
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Umum
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Backup
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Keamanan
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card className="card-dashboard">
            <CardHeader>
              <CardTitle>Pengaturan Umum</CardTitle>
              <CardDescription>
                Konfigurasi dasar sistem inventaris
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Backup Otomatis</Label>
                    <p className="text-sm text-muted-foreground">
                      Backup database secara otomatis setiap hari
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, autoBackup: checked }))
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifikasi Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Kirim notifikasi penting via email
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alert Sistem</Label>
                    <p className="text-sm text-muted-foreground">
                      Tampilkan peringatan sistem
                    </p>
                  </div>
                  <Switch
                    checked={settings.systemAlerts}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, systemAlerts: checked }))
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Pengingat Pemeliharaan</Label>
                    <p className="text-sm text-muted-foreground">
                      Ingatkan untuk item yang perlu pemeliharaan
                    </p>
                  </div>
                  <Switch
                    checked={settings.maintenanceReminders}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, maintenanceReminders: checked }))
                    }
                  />
                </div>
                
              </div>
              
              <Button onClick={handleSaveSettings} className="btn-primary">
                <Save className="mr-2 h-4 w-4" />
                Simpan Pengaturan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Management */}
        <TabsContent value="users" className="space-y-6">
          <Card className="card-dashboard">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Manajemen User</CardTitle>
                  <CardDescription>
                    Kelola akses user ke sistem
                  </CardDescription>
                </div>
                <Button className="btn-primary">
                  <Users className="mr-2 h-4 w-4" />
                  Tambah User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <h4 className="font-medium">{user.name}</h4>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Login terakhir: {user.lastLogin}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{user.role}</Badge>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status === "active" ? "Aktif" : "Tidak Aktif"}
                      </Badge>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus user {user.name}? 
                              Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup & Restore */}
        <TabsContent value="backup" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-dashboard">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Backup Database
                </CardTitle>
                <CardDescription>
                  Buat backup manual atau atur backup otomatis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleBackupNow} className="w-full btn-primary" size="lg">
                  <Download className="mr-2 h-5 w-5" />
                  Backup Sekarang
                </Button>
                
                <div className="space-y-2">
                  <Label>Upload Restore File</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload file backup (.sql)
                    </p>
                    <Input
                      type="file"
                      accept=".sql"
                      className="hidden"
                      id="backup-upload"
                    />
                    <Label htmlFor="backup-upload" asChild>
                      <Button variant="outline" size="sm">
                        Pilih File
                      </Button>
                    </Label>
                  </div>
                </div>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      Restore Database
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Restore Database</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin restore database? 
                        Semua data saat ini akan diganti dengan data backup.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction onClick={handleRestoreDatabase}>
                        Restore
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
            
            <Card className="card-dashboard">
              <CardHeader>
                <CardTitle>Riwayat Backup</CardTitle>
                <CardDescription>
                  File backup yang tersedia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {backupHistory.map((backup) => (
                    <div key={backup.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{backup.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {backup.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {backup.size}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(backup.date).toLocaleString('id-ID')}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <Card className="card-dashboard">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Keamanan Sistem
              </CardTitle>
              <CardDescription>
                Pengaturan keamanan dan audit log
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (menit)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    defaultValue="30"
                    placeholder="30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-policy">Minimum Panjang Password</Label>
                  <Input
                    id="password-policy"
                    type="number"
                    defaultValue="8"
                    placeholder="8"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Force HTTPS</Label>
                    <p className="text-sm text-muted-foreground">
                      Paksa semua koneksi menggunakan HTTPS
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Audit Log</Label>
                    <p className="text-sm text-muted-foreground">
                      Catat semua aktivitas user
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Login Attempts Limit</Label>
                    <p className="text-sm text-muted-foreground">
                      Batasi percobaan login yang gagal
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <Button className="btn-primary">
                <Save className="mr-2 h-4 w-4" />
                Simpan Pengaturan Keamanan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;