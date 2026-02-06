import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { ListingCard } from '@/components/ListingCard';
import { InternalLinking } from '@/components/InternalLinking';
import { FAQSection } from '@/components/FAQSection';
import { ListingJsonLd } from '@/components/ListingJsonLd';
import { getServiceBySlug, services } from '@/data/services';
import { getCityBySlug, getTopCities, cities } from '@/data/cities';
import { generateContent, generateFAQ, generateMockedCentres } from '@/lib/content-engine';
import { getNearbyCities } from '@/lib/geo-utils';

// ISR Configuration
// Only pre-build Top 20 cities x 4 services = 80 pages
export async function generateStaticParams() {
    const topCities = getTopCities(20);
    const params: { service: string; city: string }[] = [];

    for (const service of services) {
        for (const city of topCities) {
            params.push({
                service: service.slug,
                city: city.slug,
            });
        }
    }

    return params;
}

// Allow dynamic params - other pages render on-demand
export const dynamicParams = true;

// Revalidate every week
export const revalidate = 604800;

// Dynamic metadata
export async function generateMetadata({
    params,
}: {
    params: Promise<{ service: string; city: string }>;
}): Promise<Metadata> {
    const resolvedParams = await params;
    const service = getServiceBySlug(resolvedParams.service);
    const city = getCityBySlug(resolvedParams.city);

    if (!service || !city) {
        return {
            title: 'Page non trouvée',
        };
    }

    const content = generateContent(service, city);

    return {
        title: content.metaTitle,
        description: content.metaDescription,
        openGraph: {
            title: content.metaTitle,
            description: content.metaDescription,
            type: 'website',
            locale: 'fr_FR',
        },
        alternates: {
            canonical: `https://beautybeaute.fr/${service.slug}/${city.slug}`,
        },
    };
}

export default async function ServiceCityPage({
    params,
}: {
    params: Promise<{ service: string; city: string }>;
}) {
    const resolvedParams = await params;
    const service = getServiceBySlug(resolvedParams.service);
    const city = getCityBySlug(resolvedParams.city);

    if (!service || !city) {
        notFound();
    }

    // Generate content
    const content = generateContent(service, city);
    const faqs = generateFAQ(service, city);
    const centres = generateMockedCentres(service, city);
    const nearbyCities = getNearbyCities(city, cities, 10);

    return (
        <div className="bg-background min-h-screen">
            {/* Hero Section */}
            <Hero
                title={content.h1}
                description={content.introduction.substring(0, 160) + "..."}
                stats={[
                    { value: '4.8/5', label: 'Satisfaction' },
                    { value: centres.length.toString(), label: 'Centres' },
                    { value: '100%', label: 'Vérifiés' }
                ]}
            />

            {/* Main Content */}
            <div className="container py-12 relative z-10">
                <ListingJsonLd listings={centres} city={city} service={service} />
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Left Column - Content */}
                    <div className="lg:col-span-2 space-y-16">
                        {/* Introduction */}
                        <section className="glass p-8 rounded-3xl border border-white/5">
                            <h2 className="text-2xl font-bold text-white mb-4">À propos</h2>
                            <p className="text-lg text-zinc-300 leading-relaxed">
                                {content.introduction}
                            </p>
                        </section>

                        {/* Listings */}
                        <section>
                            <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-400">
                                    Les meilleurs centres
                                </span>
                            </h2>
                            <div className="space-y-6">
                                {centres.map((centre, index) => (
                                    <ListingCard
                                        key={centre.id}
                                        id={centre.id}
                                        name={centre.name}
                                        rating={centre.rating}
                                        reviewCount={centre.reviewCount}
                                        address={centre.address}
                                        city={city.name}
                                        citySlug={city.slug}
                                        imageUrl={centre.imageUrl}
                                        slug={centre.slug}
                                        serviceSlug={service.slug}
                                        serviceName={service.name}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* Why Choose City */}
                        <section className="glass-card p-8 rounded-3xl border border-white/5">
                            <h2 className="text-2xl font-bold text-white mb-4">
                                Pourquoi choisir {city.name} ?
                            </h2>
                            <p className="text-zinc-400 leading-relaxed">
                                {content.whyChooseCity}
                            </p>
                        </section>

                        {/* FAQ */}
                        <FAQSection faqs={faqs} service={service} city={city} />
                    </div>

                    {/* Right Column - Sidebar */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-32">
                            <InternalLinking
                                currentService={service}
                                currentCity={city}
                                nearbyCities={nearbyCities}
                            />
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
