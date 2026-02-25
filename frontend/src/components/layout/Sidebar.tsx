import { Shield, Home, Activity, Bell, Settings, Info, BarChart2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function Sidebar() {
    const links = [
        { to: "/dashboard", icon: Home, label: "Dashboard" },
        { to: "/analysis", icon: BarChart2, label: "Analysis" },
        { to: "/sensors", icon: Activity, label: "Sensors" },
        { to: "/person-logs", icon: Shield, label: "Tracking" },
        { to: "/alerts", icon: Bell, label: "Alerts" },
        { to: "/settings", icon: Settings, label: "Settings" },
        { to: "/about", icon: Info, label: "About" }
    ];

    return (
        <div className="w-64 border-r bg-card/80 backdrop-blur-md hidden md:flex flex-col relative z-20">
            <div className="p-6 border-b border-border/50 flex items-center space-x-3">
                <Shield className="w-8 h-8 text-primary drop-shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">CodeBlue<span className="text-primary">Halo</span></span>
            </div>
            <div className="p-4 space-y-2 flex-1">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground",
                                isActive ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground"
                            )
                        }
                    >
                        <link.icon className="w-5 h-5" />
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </div>
            <div className="p-4 border-t border-border/50 text-sm text-center space-y-3">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
                    </span>
                    <span className="text-xs font-medium text-success">Backend Online</span>
                </div>
                <div className="bg-primary/10 text-primary border border-primary/20 rounded-md px-2 py-1 text-xs font-semibold animate-pulse">
                    🏆 Hack-O-Hertz '26
                </div>
                <div className="text-muted-foreground text-xs font-mono">
                    Build: v2.0-rc1
                </div>
            </div>
        </div>
    );
}
