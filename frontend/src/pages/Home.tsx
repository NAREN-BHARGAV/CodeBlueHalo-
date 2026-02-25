import { Activity, Users, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';

export function Home() {
    const navigate = useNavigate();

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/30 relative">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 rounded-[100%] blur-[120px] opacity-50 pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-secondary/10 rounded-[100%] blur-[100px] opacity-40 pointer-events-none mix-blend-screen" />

            {/* Navbar Placeholder for Landing */}
            <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                        <span className="font-bold text-xl tracking-tight">CodeBlueHalo<span className="text-primary">.AI</span></span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="text-muted-foreground hover:text-white" onClick={() => navigate('/about')}>About</Button>
                        <Button variant="default" className="bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-primary/50" onClick={() => navigate('/login')}>
                            Sign In
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 pt-32 pb-20">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8"
                >
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-muted-foreground backdrop-blur-sm">
                        <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                        v2.0 Hackathon Final Edition Live
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.1]">
                        Non-Contact <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                            Campus Safety Intelligence.
                        </span>
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                        Continuous environmental telemetry, zero-blindspot privacy architecture,
                        and edge-based AI models working together to predict and prevent crisis events.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                        <Button size="lg" className="w-full sm:w-auto h-14 px-8 bg-white text-black hover:bg-gray-100 font-semibold text-base rounded-full group transition-all" onClick={() => navigate('/login')}>
                            Enter Dashboard
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-full border-white/10 hover:bg-white/5 font-semibold text-base" onClick={() => navigate('/about')}>
                            How it works
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.7 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32"
                >
                    {[
                        { icon: Activity, title: "Edge Analytics", desc: "TCN Autoencoders process raw sensor data locally, minimizing latency and bandwidth." },
                        { icon: Lock, title: "Privacy First", desc: "No cameras, no microphones. We detect presence and anomalies through spatial telemetry mapping." },
                        { icon: Users, title: "Federated Learning", desc: "Aggregate anomaly models across campus without ever pooling raw identifiable room data." }
                    ].map((feature, i) => (
                        <div key={i} className="p-8 rounded-3xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] transition-colors group">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <feature.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </motion.div>
            </main>
        </div>
    );
}
