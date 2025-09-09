import { LayoutDashboard, Package, MapPin, FileText, Settings, Users, QrCode, Calendar } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigation = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Data Inventaris",
    url: "/inventory",
    icon: Package,
  },
  {
    title: "Kegiatan",
    url: "/kegiatan",
    icon: Calendar,
  },
  {
    title: "Lokasi & Unit",
    url: "/locations",
    icon: MapPin,
  },
  {
    title: "QR Code Scanner",
    url: "/scanner",
    icon: QrCode,
  },
  {
    title: "Laporan",
    url: "/reports",
    icon: FileText,
  },
  {
    title: "Pengaturan",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-sidebar border-r border-sidebar-border">
        <div className="p-4 border-b border-sidebar-border">
          {!collapsed && (
            <div>
              <h2 className="text-lg font-semibold text-sidebar-foreground">
                Inventaris Digital
              </h2>
              <p className="text-sm text-sidebar-foreground/60">
                UPT BKN Gorontalo
              </p>
            </div>
          )}
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 px-4 py-2 text-xs font-medium uppercase tracking-wider">
            Menu Utama
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu className="space-y-1">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="nav-item">
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={({ isActive }) =>
                        isActive 
                          ? "nav-item active flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-primary-foreground bg-sidebar-primary"
                          : "nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <span className="text-sm font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <div className="mt-auto p-4 border-t border-sidebar-border">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-sidebar-foreground">Admin</p>
                <p className="text-xs text-sidebar-foreground/60">Administrator</p>
              </div>
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}