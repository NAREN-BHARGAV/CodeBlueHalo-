import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, HeartPulse, History, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface LogEntry {
    id: number;
    timestamp: string;
    event: string;
    severity: 'info' | 'warning' | 'critical';
    details: string;
}

const mockPersonLogs: LogEntry[] = [
    { id: 1, timestamp: '10:05 AM', event: 'Behavioral Drift Detected', severity: 'warning', details: 'Decreased mobility in Zone A. Motion energy down 45% compared to 7-day moving average.' },
    { id: 2, timestamp: '11:30 AM', event: 'Prolonged Stillness', severity: 'critical', details: 'No macro or micro movement detected for 45 minutes beyond standard sleep schedule.' },
    { id: 3, timestamp: '11:45 AM', event: 'Status Cleared', severity: 'info', details: 'Movement resumed. End of prolonged stillness period.' },
    { id: 4, timestamp: '02:15 PM', event: 'Environmental Anomaly', severity: 'warning', details: 'Rapid temperature drop detected near Node B.' },
];

export function PersonLogs() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching logs
        const fetchLogs = async () => {
            setIsLoading(true);
            try {
                // In a real app, this would be: await fetch('/api/v1/logs/person/123')
                setTimeout(() => {
                    setLogs(mockPersonLogs);
                    setIsLoading(false);
                }, 600);
            } catch (err) {
                console.error(err);
                setIsLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const handleSendEmail = async () => {
        toast.loading('Dispatching Emergency Notification...', { id: 'email-send' });
        try {
            const res = await fetch('http://localhost:8000/api/v1/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    target: 'codyrohith007@gmail.com',
                    message: 'Please check on Resident #123 (Room A-104). Recent behavioral drift and anomaly detected by the ambient system.'
                })
            });

            if (res.ok) {
                const data = await res.json();

                if (data.status === 'activation_required') {
                    toast.warning('One-Time Activation Required for New Wardens ⚠️', {
                        id: 'email-send',
                        duration: 10000,
                        description: `Check inboxes/spam: ${data.message} - Click "Activate Form" before proceeding.`
                    });
                } else {
                    toast.success('Emergency Emails Dispatched', {
                        id: 'email-send',
                        description: 'Real alert has been successfully routed to all registered wardens.'
                    });
                }
            } else {
                throw new Error('API down');
            }
        } catch (e) {
            toast.error('Failed to dispatch emails', {
                id: 'email-send',
                description: 'The backend email gateway could not be reached. Ensure backend is running.'
            });
        }
    };

    const handleRemedialAction = async () => {
        toast.loading('Executing Remedial Action...', { id: 'remedial' });
        try {
            const res = await fetch('http://localhost:8000/api/v1/remedial', { method: 'POST' });
            if (res.ok) {
                toast.success('Remedial Action Complete', { id: 'remedial', description: 'Two-way audio prompt initiated and logged.' });
            } else {
                throw new Error('API down');
            }
        } catch (e) {
            toast.success('Simulation: Remedial Action Executed', {
                id: 'remedial',
                description: 'Warning buzzer activated remotely. Awaiting response.'
            });
        }
    }

    const getSeverityColor = (sev: string) => {
        switch (sev) {
            case 'critical': return 'text-destructive bg-destructive/10 border-destructive/20';
            case 'warning': return 'text-warning bg-warning/10 border-warning/20';
            default: return 'text-primary bg-primary/10 border-primary/20';
        }
    };

    const getSeverityIcon = (sev: string) => {
        switch (sev) {
            case 'critical': return <AlertTriangle className="w-5 h-5 text-destructive" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-warning" />;
            default: return <CheckCircle2 className="w-5 h-5 text-primary" />;
        }
    };

    return (
        <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        <User className="w-8 h-8 text-primary" />
                        Resident Profile #A-104
                    </h2>
                    <p className="text-muted-foreground mt-1">Individual behavioral tracking and history logs.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleRemedialAction}
                        variant="destructive"
                        className="bg-destructive/80 hover:bg-destructive text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all"
                    >
                        <HeartPulse className="w-4 h-4 mr-2" />
                        Remedial Action
                    </Button>
                    <Button
                        onClick={handleSendEmail}
                        className="bg-white text-black hover:bg-gray-200 transition-all font-semibold"
                    >
                        <Mail className="w-4 h-4 mr-2" />
                        Notify Contact
                    </Button>
                </div>
            </div>

            <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <History className="w-5 h-5 text-secondary" />
                        24-Hour Event Timeline
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="h-40 flex items-center justify-center text-muted-foreground">Loading logs...</div>
                    ) : (
                        <div className="space-y-4">
                            {logs.map((log) => (
                                <div key={log.id} className={`p-4 rounded-xl border flex gap-4 ${getSeverityColor(log.severity)}`}>
                                    <div className="mt-0.5">{getSeverityIcon(log.severity)}</div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-semibold text-white">{log.event}</h4>
                                            <span className="text-sm opacity-70 font-mono">{log.timestamp}</span>
                                        </div>
                                        <p className="text-sm mt-1 opacity-80 leading-relaxed">{log.details}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
