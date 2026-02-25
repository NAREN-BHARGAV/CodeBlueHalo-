import { Bell, Menu, ShieldAlert, Search, X, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Navbar() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotif, setShowNotif] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const q = searchQuery.toLowerCase();
            if (q.includes('ale')) navigate('/alerts');
            else if (q.includes('dash')) navigate('/dashboard');
            else if (q.includes('sen')) navigate('/sensors');
            else navigate('/analysis');
        }
    };

    return (
        <header className="h-16 border-b bg-background flex items-center justify-between px-6 sticky top-0 z-50">
            <div className="flex items-center gap-4 flex-1">
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="w-5 h-5" />
                </Button>
                <div className="hidden md:flex relative w-96 max-w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search for rooms, sensors, or alerts... (e.g. 'ale')"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        className="w-full bg-accent/50 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4 relative">
                <div className="flex items-center gap-2 text-sm text-muted-foreground px-3 py-1 bg-accent rounded-full">
                    <ShieldAlert className="w-4 h-4 text-success" />
                    <span>System Healthy</span>
                </div>

                {/* Notifications */}
                <div className="relative">
                    <Button variant="ghost" size="icon" onClick={() => setShowNotif(!showNotif)}>
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
                    </Button>
                    {showNotif && (
                        <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                            <div className="flex justify-between items-center p-3 border-b">
                                <span className="font-semibold text-sm">Notifications</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowNotif(false)}><X className="w-4 h-4" /></Button>
                            </div>
                            <div className="p-3 text-sm text-muted-foreground hover:bg-white/5 cursor-pointer" onClick={() => navigate('/alerts')}>
                                🔴 Code Blue in C-305
                            </div>
                            <div className="p-3 text-sm text-muted-foreground hover:bg-white/5 border-t border-white/10 cursor-pointer" onClick={() => navigate('/alerts')}>
                                🟡 Behavioral Drift A-102
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div className="relative">
                    <div
                        onClick={() => setShowProfile(!showProfile)}
                        className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-sm font-semibold cursor-pointer hover:bg-secondary/80 transition-colors"
                    >
                        W
                    </div>
                    {showProfile && (
                        <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden py-1 text-sm">
                            <div className="p-3 border-b border-border/50 text-muted-foreground">Warden Admin</div>
                            <div className="p-2 hover:bg-accent cursor-pointer flex items-center gap-2" onClick={() => { setShowProfile(false); navigate('/profile'); }}><User className="w-4 h-4" /> Profile</div>
                            <div className="p-2 hover:bg-accent cursor-pointer flex items-center gap-2" onClick={() => { setShowProfile(false); navigate('/settings'); }}><Settings className="w-4 h-4" /> Settings</div>
                            <div className="p-2 hover:bg-destructive/20 text-destructive cursor-pointer flex items-center gap-2" onClick={() => { setShowProfile(false); navigate('/'); }}><LogOut className="w-4 h-4" /> Sign Out</div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
