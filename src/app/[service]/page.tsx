import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getServiceBySlug, services } from '@/data/services';
import { getTopCities, cities } from '@/data/cities';
import { Hero } from '@/components/Hero';

// Generate static params for all services
export async function generateStaticParams() {
    return services.map((service) => ({
        service: service.slug,
    }));
}

export const dynamicParams = true;
export const revalidate = 604800;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ service: string }>;
}): Promise<Metadata> {
    const resolvedParams = await params;
    const service = getServiceBySlug(resolvedParams.service);

    if (!service) {
        return { title: 'Service non trouvé' };
    }

    return {
        title: `${service.name} - Les meilleurs centres en France | BeautyBeauté`,
        description: `Trouvez les meilleurs spécialistes en ${service.name.toLowerCase()} près de chez vous. Comparatif, prix, avis et rendez-vous en ligne.`,
    };
}

export default async function ServicePage({
    params,
}: {
    params: Promise<{ service: string }>;
}) {
    const resolvedParams = await params;
    const service = getServiceBySlug(resolvedParams.service);

    if (!service) {
        notFound();
    }

    const topCities = getTopCities(20);

    return (
        <div className="bg-background min-h-screen">
            <Hero
                title={`Les meilleurs centres de ${service.name}`}
                description={`Découvrez notre sélection des meilleurs praticiens en ${service.name.toLowerCase()} partout en France. Avis vérifiés, tarifs et prise de rendez-vous.`}
                stats={[
                    { value: '500+', label: 'Centres' },
                    { value: '4.9/5', label: 'Satisfaction' },
                    { value: '24/7', label: 'Réservation' },
                ]}
            />

            <section className="container py-20 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Choisissez votre ville
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        Trouvez un spécialiste en {service.name.toLowerCase()} dans les plus grandes villes de France.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {topCities.map((city) => (
                        <Link
                            key={city.slug}
                            href={`/${service.slug}/${city.slug}`}
                            className="group"
                        >
                            <div className="glass-card p-6 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-primary/50">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-primary/20 rounded-lg text-primary">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <span className="text-lg font-medium text-white group-hover:text-primary transition-colors">
                                        {city.name}
                                    </span>
                                </div>
                                <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transform duration-300" />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* SEO Content Section */}
            <section className="container py-16">
                <div className="glass p-8 md:p-12 rounded-3xl border border-white/5">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <Sparkles className="h-6 w-6 text-primary mr-3" />
                        Tout savoir sur la {service.name.toLowerCase()}
                    </h2>
                    <div className="prose prose-invert max-w-none text-zinc-300">
                        <p>
                            {service.description} La {service.name.toLowerCase()} est une technique de plus en plus plébiscitée
                            pour ses résultats efficaces et durables. Que vous cherchiez à améliorer votre silhouette,
                            lisser votre peau ou rajeunir votre visage, nos spécialistes référencés saurent vous conseiller.
                        </p>
                        <p className="mt-4">
                            BeautyBeauté sélectionne rigoureusement les praticiens selon des critères stricts de qualité,
                            d'hygiène et de satisfaction client. Consultez les avis détaillés pour faire votre choix en
                            toute confiance.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
