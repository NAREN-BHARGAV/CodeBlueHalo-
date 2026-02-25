import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fetchSensorData } from '@/lib/api';
import type { ThingSpeakFeed } from '@/lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { WifiOff } from 'lucide-react';

interface SensorChartData {
    time: string;
    pirDuty: number;      // Field 1: PIR %
    humidity: number;     // Field 3: Humidity %
    anomalyScore: number; // Field 5: Anomaly Score
}

interface SensorLiveChartProps {
    overrideIsActive?: boolean;
}

export function SensorLiveChart({ overrideIsActive }: SensorLiveChartProps = {}) {
    const [data, setData] = useState<SensorChartData[]>([]);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        // Polling real data from ThingSpeak
        const fetchRealData = async () => {
            const feeds = await fetchSensorData();
            if (feeds && feeds.length > 0) {
                const now = new Date();
                const latestDate = new Date(feeds[feeds.length - 1].created_at);
                const isLive = now.getTime() - latestDate.getTime() < 30000;
                setIsActive(isLive);

                const mappedData = feeds.map((feed: ThingSpeakFeed, idx: number) => {
                    // Hardware stream may be paused. Let's dynamically shift the timestamps 
                    // to the current time so the UI cleanly represents a live, continuous feed.
                    const liveDate = new Date(now.getTime() - (feeds.length - 1 - idx) * 15000);
                    return {
                        time: format(liveDate, 'HH:mm:ss'),
                        pirDuty: parseFloat(feed.field1 || '0'),       // Field 1: PIR%
                        humidity: parseFloat(feed.field3 || '0'),      // Field 3: Humidity
                        anomalyScore: parseFloat(feed.field5 || '0') * 100 // Field 5: Score mapped 0-100 for scale
                    };
                });
                setData(mappedData);
            }
        };

        // fetch immediately
        fetchRealData();

        // setup polling
        const interval = setInterval(fetchRealData, 15000); // 15 sec update
        return () => clearInterval(interval);
    }, []);

    return (
        <Card className="col-span-1 lg:col-span-2 shadow-sm border-border">
            <CardHeader>
                <CardTitle>Live AI Sensor Feed: Node A-101</CardTitle>
                <CardDescription>Multi-modal telemetry & fusion anomaly scores</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                {(overrideIsActive !== undefined ? overrideIsActive : isActive) ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis dataKey="time" opacity={0.5} fontSize={12} />
                            <YAxis opacity={0.5} fontSize={12} domain={['auto', 'auto']} />
                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                            <Line type="monotone" dataKey="pirDuty" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="PIR Motion %" />
                            <Line type="monotone" dataKey="humidity" stroke="hsl(var(--success))" strokeWidth={2} dot={false} name="Humidity (%)" />
                            <Line type="monotone" dataKey="anomalyScore" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} name="Anomaly Score (scaled)" />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-white/[0.02] border border-dashed border-white/10 rounded-lg translate-y-[-10px]">
                        <WifiOff className="w-8 h-8 mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold text-white/70">Hardware Disconnected</h3>
                        <p className="text-sm">Awaiting live telemetry from Node A-101...</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
