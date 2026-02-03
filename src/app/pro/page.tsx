import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Star, Users, TrendingUp, Shield } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Espace Professionnel | BeautyBeauté',
    description: 'Référencez votre centre de médecine esthétique sur BeautyBeauté et gagnez en visibilité.',
};

const features = [
    {
        icon: Users,
        title: 'Visibilité maximale',
        description: 'Atteignez des milliers de clients potentiels chaque mois à la recherche de soins esthétiques dans votre ville.',
    },
    {
        icon: Star,
        title: 'Avis vérifiés',
        description: 'Collectez et affichez des avis authentiques de vos clients pour renforcer votre crédibilité.',
    },
    {
        icon: TrendingUp,
        title: 'Statistiques détaillées',
        description: 'Suivez vos performances avec un tableau de bord complet : vues, clics, demandes de contact.',
    },
    {
        icon: Shield,
        title: 'Badge Vérifié',
        description: 'Obtenez le badge "Vérifié BeautyBeauté" et inspirez confiance à vos futurs clients.',
    },
];

export default function ProPage() {
    return (
        <div className="bg-background min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] opacity-60" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-indigo-600/10 rounded-full blur-[100px] opacity-50" />
                </div>

                <div className="container relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                        Développez votre activité
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
                        Rejoignez la première plateforme dédiée à la médecine esthétique en France
                        et touchez des milliers de clients potentiels.
                    </p>
                    <Button size="lg" className="h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl shadow-primary/20">
                        Référencer mon centre
                    </Button>
                </div>
            </section>

            {/* Features Section */}
            <section className="container py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Pourquoi BeautyBeauté ?
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        Des outils professionnels pour développer votre activité et fidéliser vos clients.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="glass-card p-8 rounded-3xl border border-white/5 hover:border-primary/30 transition-all duration-300 group">
                            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/30 transition-colors">
                                <feature.icon className="h-7 w-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pricing Section */}
            <section className="container py-20">
                <div className="glass-card p-12 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-purple-500/10 max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Offre de lancement</h2>
                    <p className="text-zinc-300 mb-8 max-w-xl mx-auto">
                        Profitez de notre offre spéciale pour les premiers professionnels inscrits.
                    </p>

                    <div className="space-y-4 mb-8">
                        {['Profil premium avec photos', 'Badge vérifié', 'Position mise en avant', 'Statistiques détaillées', 'Support prioritaire'].map((feature, i) => (
                            <div key={i} className="flex items-center justify-center space-x-3 text-zinc-200">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>

                    <Button size="lg" className="h-14 px-12 rounded-full bg-white text-black hover:bg-zinc-100 font-bold text-lg shadow-xl">
                        Nous contacter
                    </Button>
                    <p className="mt-4 text-sm text-zinc-500">
                        Ou écrivez-nous à : pro@beautybeaute.fr
                    </p>
                </div>
            </section>
        </div>
    );
}
