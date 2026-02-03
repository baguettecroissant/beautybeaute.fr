import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Building2, TrendingUp, Navigation } from 'lucide-react';
import { getTopCities, cities } from '@/data/cities';
import { Hero } from '@/components/Hero';

export const metadata: Metadata = {
    title: 'Annuaire des Villes - Médecine Esthétique en France | BeautyBeauté',
    description: 'Trouvez un centre de médecine esthétique près de chez vous. Annuaire complet des 35 000 villes de France. Épilation laser, cryolipolyse, injections.',
};

export default function CitiesIndexPage() {
    const topCities = getTopCities(100);

    // Group cities by department for better structure
    const departments = Array.from(new Set(cities.map(c => c.department_name))).sort();

    // Get top 20 biggest cities for hero
    const heroCities = topCities.slice(0, 8);

    return (
        <div className="bg-background min-h-screen">
            <Hero
                title="Médecine Esthétique en France"
                description="Trouvez les meilleurs centres dans plus de 35 000 villes. Sélectionnez votre ville pour découvrir les soins disponibles."
                stats={[
                    { value: '35 000+', label: 'Villes' },
                    { value: '100%', label: 'Couverture' },
                    { value: '24/7', label: 'Réservation' },
                ]}
                showSearch={true}
            />

            {/* Top Cities Grid */}
            <section className="container py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Les plus grandes villes
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        Accès rapide aux principales métropoles françaises.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {topCities.map((city) => (
                        <Link
                            key={city.slug}
                            href={`/ville/${city.slug}`}
                            className="group"
                        >
                            <div className="p-4 rounded-xl glass border border-white/5 hover:border-primary/50 hover:bg-white/10 transition-all duration-300 flex items-center space-x-3">
                                <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                                    <MapPin className="h-4 w-4 text-zinc-400 group-hover:text-primary transition-colors" />
                                </div>
                                <div className="overflow-hidden">
                                    <div className="font-medium text-white truncate group-hover:text-primary transition-colors">
                                        {city.name}
                                    </div>
                                    <div className="text-xs text-zinc-500 truncate">
                                        {city.department_name} ({city.department_code})
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Departments List - SEO Internal Linking Powerhouse */}
            <section className="container py-16 border-t border-white/5">
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <Navigation className="h-6 w-6 text-primary mr-3" />
                        Rechercher par département
                    </h2>
                    <div className="p-8 rounded-3xl glass border border-white/5">
                        <div className="flex flex-wrap gap-3">
                            {departments.map((dept) => (
                                <span
                                    key={dept}
                                    className="px-4 py-2 rounded-lg bg-white/5 text-zinc-400 text-sm hover:text-white hover:bg-white/10 transition-colors cursor-default"
                                    title={`Centres esthétiques ${dept}`}
                                >
                                    {dept}
                                </span>
                            ))}
                        </div>
                        <p className="mt-6 text-sm text-zinc-500 italic">
                            * Sélectionnez une ville ci-dessus pour naviguer.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
