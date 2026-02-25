import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export function Login() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate network delay for effect
        setTimeout(() => {
            setIsLoading(false);
            if (email === 'admin' || email.includes('@')) {
                toast.success('Authentication successful', {
                    description: 'Welcome back to CodeBlueHalo Sentinel.',
                });
                navigate('/dashboard');
            } else {
                toast.error('Authentication failed', {
                    description: 'Invalid credentials provided.',
                });
            }
        }, 800);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center items-center relative overflow-hidden p-4">
            {/* Background elements */}
            <div className="absolute top-1/4 -left-64 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />

            <Button
                variant="ghost"
                className="absolute top-8 left-8 text-muted-foreground hover:text-white z-50 rounded-full"
                onClick={() => navigate('/')}
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Button>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                <div className="bg-card/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-primary/20">
                            <ShieldCheck className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">System Login</h2>
                        <p className="text-sm text-muted-foreground text-center">
                            Enter your credentials to access the central monitoring dashboard.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-300 ml-1">Admin Email / ID</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                                    placeholder="admin@campus.edu"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-sm font-medium text-gray-300">Password</label>
                                <a href="#" className="text-xs text-primary hover:underline">Forgot?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 mt-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-base shadow-[0_0_20px_rgba(37,99,235,0.2)]"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authenticate"}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-xs text-muted-foreground">
                        <p>Authorized personnel only. All access is logged.</p>
                        <p className="mt-1">CodeBlueHalo.AI v2.0 Hackathon Build</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
