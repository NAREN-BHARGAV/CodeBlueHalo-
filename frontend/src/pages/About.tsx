import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Info, ShieldCheck, Zap } from 'lucide-react';

export function About() {
    return (
        <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            <div className="text-center space-y-2 mt-8">
                <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    CodeBlueHalo.AI v2.0
                </h1>
                <p className="text-xl text-muted-foreground">Next-Generation Non-Contact Campus Emergency Sentinel</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                <Card className="bg-card/40 backdrop-blur-md border border-primary/20 hover:border-primary/50 transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="w-6 h-6 text-success" />
                            Privacy by Design
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground leading-relaxed">
                        <p>
                            Halo respects privacy structurally. No cameras. No microphones.
                            Instead, we use Temporal Convolutional Network Autoencoders (TCN-AE) on multi-modal telemetry like PIR & DHT. Raw data never leaves the edge node.
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-card/40 backdrop-blur-md border border-secondary/20 hover:border-secondary/50 transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="w-6 h-6 text-secondary" />
                            Seven-Problem Framework
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground leading-relaxed">
                        <p>
                            We moved beyond just fall detection. v2.0 introduces environmental hazard sensing,
                            abnormal stillness detection, behavioral drift, and structural occupancy tracking — all
                            coordinated through a single ESP32-S3 hub.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-card/40 backdrop-blur-md mt-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Info className="w-5 h-5 text-primary" />
                        AI Explainability
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground leading-relaxed space-y-4">
                    <p>
                        Traditional systems offer black-box alerts. CodeBlueHalo integrates DeepExplainer SHAP
                        (SHapley Additive exPlanations). When our Attention-CNN-BiLSTM model classifies a threat,
                        you get immediate, visual feature attribution.
                    </p>
                    <p>
                        You not only know <strong>when</strong> something happened, you know <strong>why</strong> the AI believes it happened.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
