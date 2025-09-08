import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Lock, User, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // For demo purposes, navigate to dashboard
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-dashboard p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-xl mb-4">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Inventaris Digital
          </h1>
          <p className="text-muted-foreground">
            UPT BKN Gorontalo
          </p>
        </div>

        {/* Login Card */}
        <Card className="card-glass">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Masuk ke Sistem</CardTitle>
            <CardDescription>
              Masukkan kredensial Anda untuk mengakses sistem inventaris
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Masukkan username"
                    value={credentials.username}
                    onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <Label htmlFor="remember" className="text-sm">
                    Ingat saya
                  </Label>
                </div>
                <Button variant="link" className="p-0 h-auto text-sm">
                  Lupa password?
                </Button>
              </div>

              <Button 
                type="submit" 
                className="w-full btn-primary" 
                size="lg"
                disabled={loading}
              >
                {loading ? "Memproses..." : "Masuk"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="text-xs text-center text-muted-foreground">
                <p>Sistem Inventaris Sarana dan Prasarana Digital</p>
                <p className="mt-1">UPT BKN Gorontalo © 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="mt-4 card-glass">
          <CardContent className="pt-6">
            <p className="text-xs font-medium text-muted-foreground mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><strong>Admin:</strong> admin / admin123</p>
              <p><strong>Staff:</strong> staff / staff123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;