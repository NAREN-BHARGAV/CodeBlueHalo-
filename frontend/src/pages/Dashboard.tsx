import { useState } from 'react';
import { RoomStatusGrid } from '@/components/dashboard/RoomStatusGrid';
import { SensorLiveChart } from '@/components/dashboard/SensorLiveChart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, FileText, CheckCircle2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export function Dashboard() {
    const [alertState, setAlertState] = useState<'active' | 'acknowledged' | 'escalated'>('active');
    const [aiReport, setAiReport] = useState<string | null>(null);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const handleExport = () => {
        // Generate mock logs for the CSV export on the dashboard
        const pastLogs = Array.from({ length: 15 }).map((_, i) => {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const m = months[Math.floor(Math.random() * months.length)];
            return {
                id: `LOG-${5000 - i}`,
                date: `${m} ${Math.floor(Math.random() * 28 + 1)}, 2026`,
                type: ['Fall Detected', 'Prolonged Stillness', 'Behavioral Drift', 'VOC Spike'][Math.floor(Math.random() * 4)],
                room: ['A-101', 'B-204', 'C-305', 'L-401'][Math.floor(Math.random() * 4)],
                severity: Math.random() > 0.8 ? 'destructive' : 'warning'
            };
        });

        const headers = ['Log_ID', 'Date', 'Type', 'Room', 'Severity'];
        const csvContent = [headers.join(','), ...pastLogs.map(l => `${l.id},${l.date},${l.type},${l.room},${l.severity}`)].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `codebluehalo_dashboard_export_${new Date().getTime()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Dashboard Logs Exported to CSV");
    };

    const handleGlobalOverride = async () => {
        toast.loading("Executing Global Override & Dispatching Contact Alert...", { id: "go" });
        try {
            // Try to override via backend
            await fetch("http://localhost:8000/api/v1/override", { method: "POST" });

            // Simultaneously send the email to the contact
            const res = await fetch('http://localhost:8000/api/v1/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    target: 'codyrohith007@gmail.com',
                    message: 'GLOBAL OVERRIDE TRIGGERED. ALL EMERGENCY PROTOCOLS ACTIVATED ACROSS ALL SENSORS. WARDENS DISPATCHED.'
                })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.status === 'activation_required') {
                    toast.warning('One-Time Email Activation Required ⚠️', {
                        id: 'go',
                        duration: 8000,
                        description: 'Global Override engaged locally. Check codyrohith007@gmail.com and Activate FormSubmit to receive future emails!'
                    });
                } else {
                    toast.error("Global Override Engaged", { id: "go", description: "Email successfully dispatched to Contact: codyrohith007@gmail.com." });
                }
            } else {
                throw new Error("API Failure");
            }
        } catch (err) {
            toast.error("Global Override Engaged (Local Mode)", { id: "go", description: "Backend unreachable. Triggering local emergency fallback." });
        }
    };

    return (
        <div className="space-y-6 lg:space-y-8 animate-in fade-in zoom-in-95 duration-500">

            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Command Center</h1>
                    <p className="text-muted-foreground mt-1">Multi-threat ambient intelligence overview.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2" onClick={() => { setAlertState('active'); setAiReport(null); }}>
                        <AlertCircle className="w-4 h-4" />
                        Reset Demo
                    </Button>
                    <Button variant="outline" className="gap-2" onClick={handleExport}>
                        <FileText className="w-4 h-4" />
                        Export Log
                    </Button>
                    <Button className="gap-2 bg-destructive hover:bg-destructive/90 transition-all shadow-[0_0_15px_rgba(239,68,68,0.5)]" onClick={handleGlobalOverride}>
                        <AlertCircle className="w-4 h-4" />
                        Global Override
                    </Button>
                </div>
            </div>

            {/* Primary Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <RoomStatusGrid />
                <SensorLiveChart />
            </div>

            {/* SHAP Explainability & Alert Action Center Mock */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Active Alert Center */}
                <Card className={`col-span-1 lg:col-span-2 shadow-sm relative overflow-hidden transition-all duration-500 ${alertState === 'active' ? 'border-destructive/20 border-l-4 border-l-destructive shadow-[0_0_15px_rgba(239,68,68,0.2)]' : alertState === 'escalated' ? 'border-l-4 border-l-primary shadow-[0_0_15px_rgba(37,99,235,0.2)]' : 'border-l-4 border-l-success'}`}>
                    <CardHeader>
                        <CardTitle className={`flex items-center gap-2 ${alertState === 'active' ? 'text-destructive' : alertState === 'escalated' ? 'text-primary' : 'text-success'}`}>
                            {alertState === 'active' ? <AlertCircle className="w-5 h-5 animate-pulse" /> : <CheckCircle2 className="w-5 h-5" />}
                            {alertState === 'active' ? 'Active Incident: Room B-204' : alertState === 'acknowledged' ? 'Resolved: Room B-204' : 'Escalated: Room B-204'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className={`${alertState === 'active' ? 'bg-destructive/5 border-destructive/10' : 'bg-muted/50 border-border'} p-4 rounded-lg flex justify-between items-center sm:items-start flex-col sm:flex-row gap-4 border transition-colors`}>
                                <div>
                                    <h4 className="font-semibold text-lg">{alertState === 'active' ? 'Probable Fall Detected' : 'Incident Handled'}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">Confidence: 91.2% | Time: 14:03:22 Local</p>
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0 flex-wrap">
                                    <Button
                                        variant="outline"
                                        className="flex-1 sm:flex-auto border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10 shadow-[0_0_10px_rgba(79,70,229,0.1)] gap-2"
                                        onClick={async () => {
                                            setIsGeneratingAI(true);
                                            toast.loading("Warden AI Copilot analyzing sensor telemetry...", { id: "ai" });
                                            try {
                                                const res = await fetch("http://localhost:8000/api/v1/ml/generate-report");
                                                if (res.ok) {
                                                    const data = await res.json();
                                                    toast.success("AI Analysis Complete", { id: "ai" });
                                                    setAiReport(data.report);
                                                }
                                            } catch (err) {
                                                toast.error("AI Core Offline", { id: "ai" });
                                            } finally {
                                                setIsGeneratingAI(false);
                                            }
                                        }}
                                        disabled={isGeneratingAI}
                                    >
                                        <Sparkles className={`w-4 h-4 ${isGeneratingAI ? 'animate-spin' : ''}`} />
                                        {isGeneratingAI ? 'Thinking...' : 'AI Copilot Insight'}
                                    </Button>

                                    {alertState === 'active' ? (
                                        <>
                                            <Button variant="secondary" className="flex-1 sm:flex-auto" onClick={() => { setAlertState('acknowledged'); setAiReport(null); toast.info("Incident Acknowledged. Wardens notified."); }}>Acknowledge</Button>
                                            <Button variant="destructive" className="flex-1 sm:flex-auto gap-2" onClick={async () => {
                                                setAlertState('escalated');
                                                toast.loading("Dispatching Emergency Emails...", { id: 'esc' });
                                                try {
                                                    await fetch('http://localhost:8000/api/v1/email/send', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ target: 'codyrohith007@gmail.com', message: 'DASHBOARD ESCALATION: Room B-204 (Probable Fall). Immediate Wardren Response Required.' })
                                                    });
                                                    toast.error("Escalated to Level 2. Emails Dispatched to all Wardens.", { id: 'esc' });
                                                } catch (err) {
                                                    toast.error("Escalated locally. Mail Gateway offline.", { id: 'esc' });
                                                }
                                            }}>
                                                Escalate
                                            </Button>
                                        </>
                                    ) : (
                                        <Button variant="outline" className="flex-1 sm:flex-auto" disabled>Archived</Button>
                                    )}
                                </div>
                            </div>

                            {/* GenAI Report Injection */}
                            {aiReport && (
                                <div className="mt-4 p-4 border border-indigo-500/30 bg-indigo-950/20 rounded-lg animate-in fade-in slide-in-from-top-4 duration-500">
                                    <h4 className="flex items-center gap-2 font-bold text-indigo-400 mb-3 border-b border-indigo-500/20 pb-2">
                                        <Sparkles className="w-4 h-4" /> CodeBlueHalo LLM Synthesis
                                    </h4>
                                    <div className="text-sm text-gray-300 space-y-3 prose prose-invert max-w-none prose-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: aiReport.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>').replace(/\*(.*?)\*/g, '<em class="text-indigo-200">$1</em>') }} />
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* SHAP Explanation */}
                <Card className="col-span-1 shadow-sm border-border">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            SHAP Explainability
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <p className="text-xs text-muted-foreground mb-4">Why was this classified as a fall?</p>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Thermal mass vertical drop</span>
                                    <span className="text-destructive font-mono">+0.54</span>
                                </div>
                                <div className="w-full h-1.5 bg-secondary/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-destructive w-[85%]" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>PIR burst → silence variance</span>
                                    <span className="text-destructive font-mono">+0.31</span>
                                </div>
                                <div className="w-full h-1.5 bg-secondary/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-destructive w-[60%]" />
                                </div>
                            </div>

                            <div className="space-y-2 pt-2 border-t border-border mt-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Ambient Room Humidity</span>
                                    <span className="text-success font-mono">0.00</span>
                                </div>
                            </div>

                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
