import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, Thermometer, Droplets, WifiOff } from 'lucide-react';
import { SensorLiveChart } from "@/components/dashboard/SensorLiveChart";
import { fetchSensorData } from '@/lib/api';

export function Sensors() {
    const [isHardwareActive, setIsHardwareActive] = useState(false);

    useEffect(() => {
        const checkHardware = async () => {
            const feeds = await fetchSensorData();
            if (feeds && feeds.length > 0) {
                const now = new Date();
                const latestDate = new Date(feeds[feeds.length - 1].created_at);
                // Tightened hardware timeout to 30 seconds for immediate UI feedback when device is disconnected
                const isLive = now.getTime() - latestDate.getTime() < 30000;
                setIsHardwareActive(isLive);
            }
        };

        checkHardware();
        const interval = setInterval(checkHardware, 15000);
        return () => clearInterval(interval);
    }, []);

    const sensorConfigs = [
        { name: "PIR Motion HC-SR501", icon: Activity, config: "10Hz Sampling" },
        { name: "DHT22 Thermal", icon: Thermometer, config: "1Hz Sampling" },
        { name: "DHT22 Humidity", icon: Droplets, config: "1Hz Sampling" }
    ];

    return (
        <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Sensor Array Metrics</h1>
                <p className="text-muted-foreground mt-1">Detailed telemetry for environmental condition anomalies.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {sensorConfigs.map((sensor, idx) => (
                    <Card key={idx} className={`bg-card/50 backdrop-blur-sm transition-colors ${!isHardwareActive ? 'border-dashed border-white/20 opacity-70' : 'border-primary/10 hover:border-primary/30'}`}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex justify-between items-center text-muted-foreground">
                                {sensor.name}
                                {!isHardwareActive ? <WifiOff className="w-4 h-4 text-muted-foreground" /> : <sensor.icon className="w-4 h-4 text-primary" />}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${!isHardwareActive ? 'text-destructive' : 'text-success'}`}>
                                {!isHardwareActive ? 'Inactive' : 'Active'}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{!isHardwareActive ? 'Hardware Offline' : sensor.config}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6">
                <SensorLiveChart overrideIsActive={isHardwareActive} />
            </div>

        </div>
    );
}
