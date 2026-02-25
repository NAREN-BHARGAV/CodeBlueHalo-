import { useState, useEffect } from 'react';
import { Activity, ShieldAlert, ShieldCheck, ThermometerSnowflake, WifiOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { fetchSensorData } from '@/lib/api';

export function RoomStatusGrid() {
    const [liveNodeStatus, setLiveNodeStatus] = useState({ state: 'healthy', event: 'All Clear' });

    useEffect(() => {
        const pollStatus = async () => {
            const feeds = await fetchSensorData();
            if (feeds && feeds.length > 0) {
                const latest = feeds[feeds.length - 1]; // last chronologically
                const threatLvl = parseInt(latest.field6 || '0', 10);
                const eClass = parseInt(latest.field8 || '0', 10);

                let state = 'healthy';
                let event = 'All Clear';

                const now = new Date();
                const latestDate = new Date(latest.created_at);
                const isLive = now.getTime() - latestDate.getTime() < 300000;

                if (!isLive) {
                    state = 'inactive';
                    event = 'Hardware Offline';
                } else {
                    // Map EmClass to Event String
                    switch (eClass) {
                        case 1: event = 'Probable Fall'; break;
                        case 2: event = 'Post-Fall / Floor'; break;
                        case 3: event = 'Abnormal Stillness'; break;
                        case 4: event = 'Thermal Anomaly (Fire)'; break;
                        case 5: event = 'Occupancy Anomaly'; break;
                        case 6: event = 'Sensor Fault'; break;
                        default: event = threatLvl > 0 ? 'Elevated Threat' : 'All Clear'; break;
                    }

                    // Map Threat Level to UI state
                    if (threatLvl === 1) state = 'warning';   // Watch
                    if (threatLvl === 2) state = 'danger';    // Alert
                    if (threatLvl === 3) state = 'emergency'; // Emergency
                }

                setLiveNodeStatus({ state, event });
            }
        };

        pollStatus();
        const int = setInterval(pollStatus, 15000);
        return () => clearInterval(int);
    }, []);

    const rooms = [
        { id: 'A-101 (Live Node)', status: liveNodeStatus.state, event: liveNodeStatus.event },
        { id: 'A-102', status: 'healthy', event: 'All Clear' },
        { id: 'B-204', status: 'emergency', event: 'Probable Fall [MOCKED]' },
        { id: 'C-305', status: 'warning', event: 'Behavioral Drift [MOCKED]' },
        { id: 'C-306', status: 'healthy', event: 'All Clear' },
        { id: 'L-401', status: 'danger', event: 'VOC Spike [MOCKED]' },
    ];

    return (
        <Card className="col-span-1 lg:col-span-1 border-border bg-card shadow-sm">
            <CardHeader className="pb-4">
                <CardTitle className="flex justify-between items-center text-lg">
                    Live Floor Plan Grid
                    <Badge variant="outline" className="font-normal text-muted-foreground">
                        Zone 1 (Hostels & Labs)
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {rooms.map((room) => (
                        <div
                            key={room.id}
                            className={cn(
                                "p-4 rounded-xl border flex flex-col justify-between h-28 transition-all duration-200 cursor-pointer hover:shadow-md",
                                room.status === 'healthy' && "bg-background border-border hover:border-success/50",
                                room.status === 'emergency' && "bg-destructive/10 border-destructive shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse",
                                room.status === 'warning' && "bg-warning/10 border-warning",
                                room.status === 'danger' && "bg-orange-500/10 border-orange-500",
                                room.status === 'inactive' && "bg-muted/30 border-dashed border-muted-foreground/30 opacity-70 cursor-not-allowed"
                            )}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-sm">{room.id}</span>
                                {room.status === 'healthy' && <ShieldCheck className="w-4 h-4 text-success" />}
                                {room.status === 'emergency' && <Activity className="w-5 h-5 text-destructive animate-bounce" />}
                                {room.status === 'warning' && <ShieldAlert className="w-4 h-4 text-warning" />}
                                {room.status === 'danger' && <ThermometerSnowflake className="w-4 h-4 text-orange-500 animate-pulse" />}
                                {room.status === 'inactive' && <WifiOff className="w-4 h-4 text-muted-foreground" />}
                            </div>
                            <div className="text-xs">
                                <span className={cn(
                                    "font-medium",
                                    room.status === 'healthy' ? "text-muted-foreground" : "text-foreground"
                                )}>
                                    {room.event}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
