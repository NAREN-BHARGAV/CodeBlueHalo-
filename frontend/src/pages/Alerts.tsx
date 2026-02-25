import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Clock, ShieldAlert, BadgeInfo, Download, X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function Alerts() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [acknowledged, setAcknowledged] = useState<Record<string, boolean>>({});
    const [modalOpen, setModalOpen] = useState(false);
    const [filterMonth, setFilterMonth] = useState('All');
    const navigate = useNavigate();

    const alertsList = [
        { id: "AL-192", room: "B-204", type: "Probable Fall", confidence: "91.2%", time: "14:03", severity: "destructive" },
        { id: "AL-191", room: "C-305", type: "Behavioral Drift", confidence: "75.0%", time: "09:12", severity: "warning" },
        { id: "AL-190", room: "L-401", type: "VOC Spike", confidence: "88.4%", time: "YESTERDAY", severity: "destructive" },
        { id: "AL-189", room: "A-102", type: "Abnormal Stillness", confidence: "64.1%", time: "YESTERDAY", severity: "default" },
    ];

    const pastLogs = Array.from({ length: 50 }).map((_, i) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const m = months[Math.floor(Math.random() * months.length)];
        return {
            id: `LOG-${5000 - i}`,
            date: `${m} ${Math.floor(Math.random() * 28 + 1)}, 2026`,
            month: m,
            type: ['Fall Detected', 'Prolonged Stillness', 'Behavioral Drift', 'VOC Spike', 'Thermal Anomaly'][Math.floor(Math.random() * 5)],
            room: ['A-101', 'B-204', 'C-305', 'L-401'][Math.floor(Math.random() * 4)],
            severity: Math.random() > 0.8 ? 'destructive' : 'warning'
        };
    });

    const filteredLogs = filterMonth === 'All' ? pastLogs : pastLogs.filter(l => l.month === filterMonth);

    useEffect(() => {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
            const ctx = new AudioContext();
            audioRef.current = {
                play: () => {
                    if (ctx.state === 'suspended') ctx.resume();
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(880, ctx.currentTime);

                    gain.gain.setValueAtTime(0, ctx.currentTime);
                    gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.5);
                }
            } as any;
        }

        const hasActiveCritical = alertsList.some(a => a.severity === 'destructive');
        if (hasActiveCritical) {
            setTimeout(() => {
                if (audioRef.current) {
                    try { audioRef.current.play(); } catch (e) { }
                }
            }, 1000);
        }
    }, []);

    const handleEscalate = async (alert: any) => {
        if (alert.severity === 'destructive' && audioRef.current) {
            try { audioRef.current.play(); } catch (e) { }
        }

        toast.info(`Flagging ${alert.id} for manual Warden review.`, {
            description: 'Escalation protocol initiated. Dispatching emergency emails...'
        });
        setAcknowledged(prev => ({ ...prev, [alert.id]: true }));

        try {
            const res = await fetch('http://localhost:8000/api/v1/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    target: 'codyrohith007@gmail.com',
                    message: `EMERGENCY ESCALATION: Incident ${alert.id} in Room ${alert.room}. Type: ${alert.type}. Immediate Warden response requested.`
                })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.status === 'activation_required') {
                    toast.warning('One-Time Activation Required for New Wardens ⚠️', {
                        id: alert.id,
                        duration: 10000,
                        description: `Check inboxes/spam for FormSubmit activation links: ${data.message}`
                    });
                } else {
                    toast.success('Emergency Emails Dispatched', {
                        id: alert.id,
                        description: `Alert ${alert.id} has been successfully routed to all registered wardens.`
                    });
                }
            } else {
                throw new Error('API down');
            }
        } catch (e) {
            toast.error('Failed to dispatch emergency emails', {
                id: alert.id,
                description: 'The backend email gateway could not be reached.'
            });
        }
    }

    const handleExport = () => {
        const headers = ['Log_ID', 'Date', 'Month', 'Type', 'Room', 'Severity'];
        const csvContent = [headers.join(','), ...pastLogs.map(l => `${l.id},${l.date},${l.month},${l.type},${l.room},${l.severity}`)].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `codebluehalo_alerts_export_${new Date().getTime()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Alert Logs Exported to CSV");
    };

    return (
        <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-left gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Alert Center</h1>
                    <p className="text-muted-foreground mt-1">Review, escalate, or resolve system anomalies.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" onClick={() => setModalOpen(true)}>
                        <BadgeInfo className="w-4 h-4" />
                        Filter Logs
                    </Button>
                    <Button variant="outline" className="gap-2" onClick={handleExport}>
                        <Download className="w-4 h-4" />
                        Export
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {alertsList.map((alert, idx) => (
                    <Card key={idx} className={`bg-card/50 backdrop-blur-sm transition-all hover:bg-muted/50 border-l-4 ${alert.severity === 'destructive' && !acknowledged[alert.id] ? 'border-l-destructive shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse' : alert.severity === 'destructive' ? 'border-l-destructive' : alert.severity === 'warning' ? 'border-l-warning' : 'border-l-primary'}`}>
                        <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full ${alert.severity === 'destructive' ? 'bg-destructive/10' : alert.severity === 'warning' ? 'bg-warning/10' : 'bg-primary/10'}`}>
                                    {alert.severity === 'destructive' ? <AlertCircle className="w-6 h-6 text-destructive" /> : <ShieldAlert className="w-6 h-6 text-warning" />}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                        {alert.type}
                                        <Badge variant={alert.severity as any} className="ml-2 px-1 py-0! shadow-xs text-[10px]">{alert.room}</Badge>
                                    </h3>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {alert.time}</span>
                                        <span>•</span>
                                        <span>Confidence: {alert.confidence}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                                <Button variant="outline" size="sm" className="flex-1 md:flex-auto" onClick={() => navigate('/person-logs')}>Review Evidence</Button>
                                <Button
                                    disabled={acknowledged[alert.id]}
                                    variant={alert.severity === 'destructive' && !acknowledged[alert.id] ? 'destructive' : 'default'}
                                    size="sm"
                                    className="flex-1 md:flex-auto"
                                    onClick={() => handleEscalate(alert)}
                                >
                                    {acknowledged[alert.id] ? 'Escalated' : 'Escalate'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <Card className="w-full max-w-3xl bg-card border border-border shadow-2xl max-h-[85vh] flex flex-col">
                        <div className="flex justify-between items-center p-6 border-b border-border">
                            <h2 className="text-xl font-bold">Past Incident Logs</h2>
                            <Button variant="ghost" size="icon" onClick={() => setModalOpen(false)}><X className="w-5 h-5" /></Button>
                        </div>
                        <div className="p-4 border-b border-white/5 flex gap-4 items-center bg-black/20">
                            <span className="text-sm text-muted-foreground">Filter by Month:</span>
                            <select
                                value={filterMonth}
                                onChange={(e) => setFilterMonth(e.target.value)}
                                className="bg-black/50 border border-white/20 rounded px-3 py-1.5 text-sm focus:outline-none"
                            >
                                <option>All</option>
                                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                                    <option key={m}>{m}</option>
                                ))}
                            </select>
                            <span className="text-sm text-muted-foreground ml-auto">Showing {filteredLogs.length} results</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {filteredLogs.map(log => (
                                <div key={log.id} className="flex justify-between items-center p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04]">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${log.severity === 'destructive' ? 'bg-destructive' : 'bg-warning'}`}></div>
                                        <div>
                                            <div className="font-semibold text-sm">{log.type}</div>
                                            <div className="text-xs text-muted-foreground">{log.id} • Room {log.room}</div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">{log.date}</div>
                                </div>
                            ))}
                            {filteredLogs.length === 0 && <div className="text-center p-8 text-muted-foreground">No logs found for this month.</div>}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
