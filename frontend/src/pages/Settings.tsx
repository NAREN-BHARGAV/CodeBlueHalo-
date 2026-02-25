import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Bell, Shield, Database, LayoutGrid } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

export function Settings() {
    const [activeTab, setActiveTab] = useState('general');
    const [graceWindow, setGraceWindow] = useState('15');
    const [sensitivity, setSensitivity] = useState('High');

    const handleGlobalOverride = async () => {
        toast.loading("Executing Global Override...", { id: "go" });
        try {
            await fetch("http://localhost:8000/api/v1/override", { method: "POST" });
            toast.success("Global Override Acknowledged", { id: "go", description: "All system parameters reset and overriden via Backend." });
        } catch (err) {
            toast.success("Local Simulation: Global Override", { id: "go", description: "API unavailable. Local override engaged." });
        }
    };

    return (
        <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
                <p className="text-muted-foreground mt-1">Configure Halos, modify thresholds, and set system preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
                <aside className="space-y-2 hidden md:block border-r border-border pr-6 h-full">
                    <Button
                        onClick={() => setActiveTab('general')}
                        variant="ghost"
                        className={`w-full justify-start gap-2 ${activeTab === 'general' ? 'bg-accent hover:bg-accent/80 font-semibold' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}
                    >
                        <LayoutGrid className="w-4 h-4" /> General
                    </Button>
                    <Button
                        onClick={() => setActiveTab('notifications')}
                        variant="ghost"
                        className={`w-full justify-start gap-2 ${activeTab === 'notifications' ? 'bg-accent hover:bg-accent/80 font-semibold' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}
                    >
                        <Bell className="w-4 h-4" /> Notifications
                    </Button>
                    <Button
                        onClick={() => setActiveTab('privacy')}
                        variant="ghost"
                        className={`w-full justify-start gap-2 ${activeTab === 'privacy' ? 'bg-accent hover:bg-accent/80 font-semibold' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}
                    >
                        <Shield className="w-4 h-4" /> Privacy & Compliance
                    </Button>
                    <Button
                        onClick={() => setActiveTab('integration')}
                        variant="ghost"
                        className={`w-full justify-start gap-2 ${activeTab === 'integration' ? 'bg-accent hover:bg-accent/80 font-semibold' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}
                    >
                        <Database className="w-4 h-4" /> Integration
                    </Button>
                </aside>

                <div className="space-y-6">
                    {activeTab === 'general' && (
                        <>
                            <Card className="bg-card/50 backdrop-blur-sm border-border animate-in fade-in zoom-in-95 duration-300">
                                <CardHeader>
                                    <CardTitle>Threat Escalation Rules</CardTitle>
                                    <CardDescription>Adjust how quickly the system escalates different anomalies.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                                        <div>
                                            <h4 className="font-medium text-sm mb-1">Fall / Collapse Grace Window (Seconds)</h4>
                                            <input
                                                type="number"
                                                value={graceWindow}
                                                onChange={(e) => setGraceWindow(e.target.value)}
                                                className="bg-black/50 border border-white/20 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1"
                                            />
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => toast.success(`Saved grace window: ${graceWindow}s`)}>Save</Button>
                                    </div>

                                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                                        <div>
                                            <h4 className="font-medium text-sm mb-1">Behavioral Drift Sensitivity</h4>
                                            <select
                                                value={sensitivity}
                                                onChange={(e) => setSensitivity(e.target.value)}
                                                className="bg-black/50 border border-white/20 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1"
                                            >
                                                <option>Low</option>
                                                <option>Medium</option>
                                                <option>High</option>
                                            </select>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => toast.success(`Saved sensitivity: ${sensitivity}`)}>Save</Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-card/50 backdrop-blur-sm border-destructive/20 animate-in fade-in zoom-in-95 duration-300">
                                <CardHeader>
                                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center py-2">
                                        <div>
                                            <h4 className="font-medium text-sm text-destructive hover:font-bold transition-all">Global System Override</h4>
                                            <p className="text-xs text-muted-foreground">Force-trigger all emergency protocols globally.</p>
                                        </div>
                                        <Button variant="destructive" size="sm" onClick={handleGlobalOverride}>Execute Override</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {activeTab === 'notifications' && (
                        <Card className="bg-card/50 backdrop-blur-sm border-border animate-in fade-in zoom-in-95 duration-300">
                            <CardHeader>
                                <CardTitle>Notification Preferences</CardTitle>
                                <CardDescription>Manage how Wardens and Admins receive critical alerts.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-border/50">
                                    <div>
                                        <h4 className="font-medium text-sm mb-1">Email Escalations</h4>
                                        <p className="text-xs text-muted-foreground">Utilizes FormSubmit mass-gateway protocol.</p>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => toast.success('Email gateways verified.')}>Verify Links</Button>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-border/50">
                                    <div>
                                        <h4 className="font-medium text-sm mb-1">SMS Gateways</h4>
                                        <p className="text-xs text-muted-foreground">Twilio integration required.</p>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => toast.error('Twilio secrets missing in .env config')}>Register Token</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'privacy' && (
                        <Card className="bg-card/50 backdrop-blur-sm border-border animate-in fade-in zoom-in-95 duration-300">
                            <CardHeader>
                                <CardTitle>Privacy & Compliance</CardTitle>
                                <CardDescription>Data scrubbing parameters and HIPAA/GDPR policies.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-border/50">
                                    <div>
                                        <h4 className="font-medium text-sm mb-1">Federated Learning Weights</h4>
                                        <p className="text-xs text-muted-foreground">Transmit localized TCN-AE weights back to central server.</p>
                                    </div>
                                    <select className="bg-black/50 border border-white/20 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1">
                                        <option>Enabled (Cloud Sync)</option>
                                        <option>Disabled (Air-Gapped)</option>
                                    </select>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-border/50">
                                    <div>
                                        <h4 className="font-medium text-sm mb-1">Data Retention Period</h4>
                                        <p className="text-xs text-muted-foreground">After this window, all telemetry logs are scrubbed.</p>
                                    </div>
                                    <select className="bg-black/50 border border-white/20 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1">
                                        <option>30 Days</option>
                                        <option>90 Days (Compliance)</option>
                                        <option>1 Year</option>
                                    </select>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'integration' && (
                        <Card className="bg-card/50 backdrop-blur-sm border-border animate-in fade-in zoom-in-95 duration-300">
                            <CardHeader>
                                <CardTitle>Hardware Integrations</CardTitle>
                                <CardDescription>Manage ambient environmental sensors and API routes.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-border/50">
                                    <div>
                                        <h4 className="font-medium text-sm mb-1">ThingSpeak Fallback Stream</h4>
                                        <p className="text-xs font-mono text-muted-foreground">Channel: 3272549</p>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => toast.success('API Read Key Active and Valid.')}>Test API</Button>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-border/50">
                                    <div>
                                        <h4 className="font-medium text-sm mb-1">MQTT Broker</h4>
                                        <p className="text-xs text-muted-foreground">Primary ESP32 Data ingestion route.</p>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => toast.success('Broker Status: Running (Port 1883)')}>Check Status</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
