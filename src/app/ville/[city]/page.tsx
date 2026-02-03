import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MapPin, Zap, Snowflake, Droplets, Syringe, Sparkles, Building2 } from 'lucide-react';
import { getCityBySlug, getTopCities, cities } from '@/data/cities';
import { getNearbyCities, formatDistance } from '@/lib/geo-utils';
import { services } from '@/data/services';
import { Hero } from '@/components/Hero';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Zap,
    Snowflake,
    Droplets,
    Syringe,
};

// Generate static params for top cities
export async function generateStaticParams() {
    const topCities = getTopCities(50);
    return topCities.map((city) => ({
        city: city.slug,
    }));
}

export const dynamicParams = true;
export const revalidate = 604800;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ city: string }>;
}): Promise<Metadata> {
    const resolvedParams = await params;
    const city = getCityBySlug(resolvedParams.city);

    if (!city) {
        return { title: 'Ville non trouvée' };
    }

    return {
        title: `Médecine Esthétique à ${city.name} - Tous les Soins | BeautyBeauté`,
        description: `Découvrez tous les soins de médecine esthétique disponibles à ${city.name}. Épilation laser, cryolipolyse, hydrafacial, injections. Comparez les meilleurs centres.`,
    };
}

export default async function CityPage({
    params,
}: {
    params: Promise<{ city: string }>;
}) {
    const resolvedParams = await params;
    const city = getCityBySlug(resolvedParams.city);

    if (!city) {
        notFound();
    }

    return (
        <div className="bg-background min-h-screen">
            <Hero
                title={`Médecine esthétique à ${city.name}`}
                description={`Trouvez les meilleurs centres de soins esthétiques à ${city.name}. Comparez les avis, prix et prenez rendez-vous en ligne.`}
                stats={[
                    { value: '50+', label: 'Centres' },
                    { value: '4.8/5', label: 'Satisfaction' },
                    { value: city.department_code, label: 'Département' },
                ]}
                showSearch={false}
            />

            {/* Services Section */}
            <section className="container py-20 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Choisissez votre soin à {city.name}
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        Découvrez notre sélection des meilleurs praticiens pour chaque type de soin esthétique.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {services.map((service) => {
                        const Icon = iconMap[service.icon] || Sparkles;
                        return (
                            <Link
                                key={service.id}
                                href={`/${service.slug}/${city.slug}`}
                                className="group"
                            >
                                <div className="glass-card p-8 rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:bg-white/10 hover:border-primary/30 relative overflow-hidden h-full">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Icon className="h-24 w-24 text-primary rotate-12 transform group-hover:scale-110 transition-transform duration-700" />
                                    </div>

                                    <div className="relative z-10 flex items-start justify-between">
                                        <div>
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-shadow duration-500">
                                                <Icon className="h-7 w-7 text-white group-hover:text-primary transition-colors duration-300" />
                                            </div>

                                            <h3 className="font-heading text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                                                {service.name}
                                            </h3>
                                            <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-200 transition-colors">
                                                {service.description.substring(0, 100)}...
                                            </p>
                                        </div>

                                        <div className="opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                            <ArrowRight className="h-6 w-6 text-primary" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* City Info Section */}
            <section className="container py-16">
                <div className="glass p-8 md:p-12 rounded-3xl border border-white/5 max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <Building2 className="h-6 w-6 text-primary mr-3" />
                        Médecine esthétique à {city.name}
                    </h2>
                    <div className="prose prose-invert max-w-none text-zinc-300">
                        <p>
                            {city.name} ({city.zip}), située dans le département {city.department_code},
                            compte parmi les villes françaises où la médecine esthétique est en plein essor.
                            Avec une population de {city.population.toLocaleString('fr-FR')} habitants,
                            la ville dispose de nombreux centres spécialisés offrant des soins de qualité.
                        </p>
                        <p className="mt-4">
                            Que vous recherchiez une épilation laser définitive, un traitement de cryolipolyse
                            pour affiner votre silhouette, un soin hydrafacial pour sublimer votre peau,
                            ou des injections esthétiques pour rajeunir votre visage, BeautyBeauté vous aide
                            à trouver le praticien idéal à {city.name}.
                        </p>
                    </div>
                </div>
            </section>

            {/* Nearby Cities - Internal Mesh */}
            <section className="container py-16">
                <div className="text-center mb-12">
                    <h2 className="text-2xl font-bold text-white mb-4">Villes à proximité de {city.name}</h2>
                    <p className="text-zinc-400">Trouvez également des centres dans les villes voisines</p>
                </div>
                <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                    {getNearbyCities(city, cities, 12).map((nearbyCity) => (
                        <Link
                            key={nearbyCity.slug}
                            href={`/ville/${nearbyCity.slug}`}
                            className="group"
                        >
                            <div className="px-5 py-2 rounded-full glass border border-white/5 hover:border-primary/50 hover:bg-white/10 transition-all duration-300 flex items-center space-x-2">
                                <MapPin className="h-3 w-3 text-zinc-500 group-hover:text-primary transition-colors" />
                                <span className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">
                                    {nearbyCity.name}
                                </span>
                                <span className="text-xs text-zinc-600 group-hover:text-zinc-400">
                                    ({formatDistance(nearbyCity.distance)})
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BreadcrumbList',
                        itemListElement: [
                            {
                                '@type': 'ListItem',
                                position: 1,
                                name: 'Accueil',
                                item: 'https://beautybeaute.fr',
                            },
                            {
                                '@type': 'ListItem',
                                position: 2,
                                name: 'Villes',
                                item: 'https://beautybeaute.fr/ville',
                            },
                            {
                                '@type': 'ListItem',
                                position: 3,
                                name: city.name,
                                item: `https://beautybeaute.fr/ville/${city.slug}`,
                            },
                        ],
                    }),
                }}
            />
        </div>
    );
}
