import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Phone, Mail, ShieldAlert, BadgeInfo, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Profile() {
    return (
        <div className="space-y-6 lg:space-y-8 animate-in fade-in zoom-in-95 duration-500 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Warden Profile</h1>
                    <p className="text-muted-foreground mt-1">Manage your administrative details and subscription plans.</p>
                </div>
                <Button variant="outline" className="gap-2">
                    <User className="w-4 h-4" /> Edit Profile
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 shadow-sm border-border bg-card/50 backdrop-blur-sm">
                    <CardHeader className="text-center pb-2">
                        <div className="w-24 h-24 bg-primary/20 text-primary mx-auto rounded-full flex items-center justify-center text-4xl font-bold mb-4">
                            W
                        </div>
                        <CardTitle className="text-2xl">Cody Rohith</CardTitle>
                        <p className="text-muted-foreground text-sm uppercase tracking-wider mt-1">Senior Warden</p>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="flex items-center gap-3">
                            <BadgeInfo className="w-4 h-4 text-muted-foreground" />
                            <span>ID: <strong className="text-foreground">WRDN-7892X</strong></span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span>codyrohith007@gmail.com</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>+91 98765 43210</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <ShieldAlert className="w-4 h-4 text-success" />
                            <span className="text-success font-medium">Clearance: Level 4</span>
                        </div>
                    </CardContent>
                </Card>

                <div className="md:col-span-2 space-y-6">
                    <Card className="shadow-sm border-border bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <CalendarDays className="w-5 h-5 text-primary" /> Active Plan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 border border-border rounded-lg bg-black/20">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h3 className="font-bold text-xl text-primary">Enterprise Sentinel Plan</h3>
                                        <p className="text-sm text-muted-foreground">Unlimited Zones & AI Analytics</p>
                                    </div>
                                    <BadgeInfo className="w-8 h-8 text-primary opacity-50" />
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Status</span>
                                        <span className="text-success font-semibold px-2 py-0.5 bg-success/10 rounded">Active</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Billing Cycle</span>
                                        <span className="font-mono">Annually</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Next Renewal</span>
                                        <span className="font-mono">Dec 31, 2026</span>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <Button className="w-full sm:w-auto" variant="secondary">Manage Subscription</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-border bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Recent Administrative Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center text-sm p-3 border border-white/5 bg-white/[0.02] rounded-lg">
                                <div>
                                    <p className="font-semibold">Initiated Global Override</p>
                                    <p className="text-xs text-muted-foreground text-destructive">Emergency Protocol Triggered</p>
                                </div>
                                <span className="opacity-70 text-xs">Today, 12:20 PM</span>
                            </div>
                            <div className="flex justify-between items-center text-sm p-3 border border-white/5 bg-white/[0.02] rounded-lg">
                                <div>
                                    <p className="font-semibold">Modified Alert Sensitivity</p>
                                    <p className="text-xs text-muted-foreground">Adjusted to 'High'</p>
                                </div>
                                <span className="opacity-70 text-xs">Yesterday, 04:30 PM</span>
                            </div>
                            <div className="flex justify-between items-center text-sm p-3 border border-white/5 bg-white/[0.02] rounded-lg">
                                <div>
                                    <p className="font-semibold">Acknowledged Incident</p>
                                    <p className="text-xs text-muted-foreground">Room B-204 (Fall Detected)</p>
                                </div>
                                <span className="opacity-70 text-xs">Feb 20, 11:15 AM</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
