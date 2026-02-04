import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Phone, Clock, CheckCircle2, ArrowLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getServiceBySlug, services } from '@/data/services';
import { getCityBySlug, getTopCities } from '@/data/cities';
import { generateMockedCentres } from '@/lib/content-engine';
import { Breadcrumbs } from '@/components/Breadcrumbs';

// Generate static params for top cities only
export async function generateStaticParams() {
    const topCities = getTopCities(10);
    const params: { service: string; city: string; slug: string }[] = [];

    for (const service of services) {
        for (const city of topCities) {
            const centres = generateMockedCentres(service, city);
            for (const centre of centres) {
                params.push({
                    service: service.slug,
                    city: city.slug,
                    slug: centre.slug,
                });
            }
        }
    }

    return params;
}

export const dynamicParams = true;
export const revalidate = 604800;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ service: string; city: string; slug: string }>;
}): Promise<Metadata> {
    const resolvedParams = await params;
    const service = getServiceBySlug(resolvedParams.service);
    const city = getCityBySlug(resolvedParams.city);

    if (!service || !city) {
        return { title: 'Centre non trouvé' };
    }

    // Find the centre
    const centres = generateMockedCentres(service, city);
    const centre = centres.find(c => c.slug === resolvedParams.slug);

    if (!centre) {
        return { title: 'Centre non trouvé' };
    }

    return {
        title: `${centre.name} - ${service.name} à ${city.name} | BeautyBeauté`,
        description: `Découvrez ${centre.name}, spécialisé en ${service.name.toLowerCase()} à ${city.name}. Avis clients, tarifs et prise de rendez-vous.`,
    };
}

export default async function CentreProfilePage({
    params,
}: {
    params: Promise<{ service: string; city: string; slug: string }>;
}) {
    const resolvedParams = await params;
    const service = getServiceBySlug(resolvedParams.service);
    const city = getCityBySlug(resolvedParams.city);

    if (!service || !city) {
        notFound();
    }

    // Find the centre
    const centres = generateMockedCentres(service, city);
    const centre = centres.find(c => c.slug === resolvedParams.slug);

    if (!centre) {
        notFound();
    }

    // Get other centres for "similar" section
    const otherCentres = centres.filter(c => c.slug !== centre.slug).slice(0, 3);

    return (
        <div className="bg-background min-h-screen">
            {/* Hero Header */}
            <section className="relative pt-28 pb-12 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-background" />
                    <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-primary/15 rounded-full blur-[100px] opacity-60" />
                </div>

                <div className="container relative z-10">
                    <Breadcrumbs />

                    {/* Back link */}
                    <Link
                        href={`/${service.slug}/${city.slug}`}
                        className="inline-flex items-center text-zinc-400 hover:text-white transition-colors mb-6"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Retour aux résultats
                    </Link>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Info */}
                        <div className="lg:col-span-2">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    {centre.verified && (
                                        <Badge className="mb-3 bg-primary/20 text-primary border-primary/30">
                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                            Vérifié BeautyBeauté
                                        </Badge>
                                    )}
                                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                                        {centre.name}
                                    </h1>
                                </div>
                                <Button variant="outline" size="icon" className="rounded-full border-white/10 text-zinc-400 hover:text-white">
                                    <Share2 className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="flex items-center space-x-1 bg-yellow-500/10 px-3 py-1.5 rounded-full">
                                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                    <span className="text-white font-bold">{centre.rating}</span>
                                    <span className="text-zinc-400">({centre.reviewCount} avis)</span>
                                </div>
                                <span className="text-zinc-500">•</span>
                                <span className="text-zinc-400">{service.name}</span>
                            </div>

                            {/* Address */}
                            <div className="flex items-start space-x-3 text-zinc-300">
                                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                                <span>{centre.address}</span>
                            </div>
                        </div>

                        {/* Image */}
                        <div className="relative h-64 lg:h-auto rounded-3xl overflow-hidden">
                            <Image
                                src={centre.imageUrl}
                                alt={centre.name}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="container py-12">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* About */}
                        <div className="glass p-8 rounded-3xl border border-white/5">
                            <h2 className="text-2xl font-bold text-white mb-4">À propos</h2>
                            <p className="text-zinc-300 leading-relaxed">
                                {centre.name} est un établissement spécialisé en {service.name.toLowerCase()}
                                situé à {city.name}. Notre équipe de professionnels qualifiés vous accueille
                                dans un cadre moderne et chaleureux pour vous offrir des soins de qualité.
                            </p>
                            <p className="text-zinc-300 leading-relaxed mt-4">
                                Nous utilisons les dernières technologies et techniques pour garantir des
                                résultats optimaux tout en assurant votre confort et votre sécurité.
                            </p>
                        </div>

                        {/* Services */}
                        <div className="glass p-8 rounded-3xl border border-white/5">
                            <h2 className="text-2xl font-bold text-white mb-4">Services proposés</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {[service.name, 'Consultation personnalisée', 'Suivi post-traitement', 'Bilan gratuit'].map((s, i) => (
                                    <div key={i} className="flex items-center space-x-2 text-zinc-300">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        <span>{s}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reviews section - only show for real listings */}
                        {centre.isReal && centre.reviewsPerScore && (
                            <div className="glass p-8 rounded-3xl border border-white/5">
                                <h2 className="text-2xl font-bold text-white mb-4">Avis Google</h2>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="text-4xl font-bold text-white">{centre.rating}</div>
                                    <div>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-5 w-5 ${i < Math.round(centre.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-600'}`}
                                                />
                                            ))}
                                        </div>
                                        <div className="text-zinc-400 text-sm">{centre.reviewCount} avis</div>
                                    </div>
                                </div>

                                {/* Review distribution bars */}
                                <div className="space-y-2">
                                    {[5, 4, 3, 2, 1].map((score) => {
                                        const count = centre.reviewsPerScore?.[String(score)] || 0;
                                        const percentage = centre.reviewCount > 0 ? (count / centre.reviewCount) * 100 : 0;
                                        return (
                                            <div key={score} className="flex items-center gap-3">
                                                <span className="text-sm text-zinc-400 w-4">{score}</span>
                                                <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-yellow-400 rounded-full transition-all"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm text-zinc-500 w-8 text-right">{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {centre.reviewsLink && (
                                    <a
                                        href={centre.reviewsLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 mt-6 text-primary hover:text-primary/80 transition-colors"
                                    >
                                        Voir tous les avis sur Google Maps
                                        <ArrowLeft className="h-4 w-4 rotate-180" />
                                    </a>
                                )}
                            </div>
                        )}

                        {/* For mock listings - show a call to action instead */}
                        {!centre.isReal && (
                            <div className="glass p-8 rounded-3xl border border-white/5">
                                <h2 className="text-2xl font-bold text-white mb-4">Avis clients</h2>
                                <p className="text-zinc-400">
                                    Aucun avis vérifié disponible pour le moment. Contactez directement ce professionnel pour plus d&apos;informations.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Contact Card */}
                        <div className="glass-card p-6 rounded-3xl border border-white/5 sticky top-32">
                            <h3 className="text-xl font-bold text-white mb-6">Prendre rendez-vous</h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center space-x-3 text-zinc-300">
                                    <Clock className="h-5 w-5 text-primary" />
                                    <span>Lun-Sam: 9h-19h</span>
                                </div>
                                <div className="flex items-center space-x-3 text-zinc-300">
                                    <Phone className="h-5 w-5 text-primary" />
                                    <span>{centre.phone || '01 XX XX XX XX'}</span>
                                </div>
                            </div>

                            <Button className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold h-12">
                                Demander un devis
                            </Button>
                            <Button variant="outline" className="w-full mt-3 rounded-xl border-white/10 text-white hover:bg-white/10 h-12">
                                Appeler maintenant
                            </Button>
                        </div>

                        {/* Other centres */}
                        {otherCentres.length > 0 && (
                            <div className="glass-card p-6 rounded-3xl border border-white/5">
                                <h3 className="text-lg font-bold text-white mb-4">Autres centres à {city.name}</h3>
                                <div className="space-y-3">
                                    {otherCentres.map((other) => (
                                        <Link
                                            key={other.id}
                                            href={`/${service.slug}/${city.slug}/${other.slug}`}
                                            className="block p-3 rounded-xl hover:bg-white/5 transition-colors"
                                        >
                                            <div className="font-medium text-white text-sm">{other.name}</div>
                                            <div className="flex items-center text-xs text-zinc-400 mt-1">
                                                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                                                {other.rating} ({other.reviewCount} avis)
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
