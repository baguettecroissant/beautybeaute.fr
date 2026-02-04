import Link from 'next/link';
import { Star, MapPin, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface ListingCardProps {
    id: string;
    name: string;
    rating: number;
    reviewCount: number;
    address: string;
    city: string;
    citySlug: string;
    imageUrl: string;
    slug: string;
    serviceSlug: string;
    serviceName?: string;
}

export function ListingCard({
    name,
    rating,
    reviewCount,
    address,
    city,
    citySlug,
    imageUrl,
    slug,
    serviceSlug,
    serviceName,
}: ListingCardProps) {
    return (
        <div className="group glass-card rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(109,40,217,0.3)]">
            <div className="flex flex-col md:flex-row h-full">
                {/* Image Section - now smaller and sleek on desktop */}
                <div className="relative h-48 md:h-auto md:w-1/3 overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent md:bg-gradient-to-r" />
                    <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                        <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-white text-xs font-bold">{rating}</span>
                        <span className="text-zinc-400 text-xs">({reviewCount})</span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            <div>
                                <Badge variant="outline" className="mb-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                                    Vérifié
                                </Badge>
                                <h3 className="font-heading text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
                                    {name}
                                </h3>
                            </div>
                            {/* External Link Icon */}
                            <div className="text-zinc-600 group-hover:text-primary transition-colors">
                                <ArrowUpRight className="h-5 w-5" />
                            </div>
                        </div>

                        <div className="flex items-center text-zinc-400 mt-2 text-sm">
                            <MapPin className="h-4 w-4 mr-1 text-zinc-500" />
                            <span className="line-clamp-1">{address || city}</span>
                        </div>

                        {serviceName && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                <span className="text-xs px-2 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary">
                                    {serviceName}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex items-center justify-end">
                        <Link href={`/${serviceSlug}/${citySlug}/${slug}`} className="w-full md:w-auto">
                            <Button className="w-full rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold shadow-lg shadow-white/5 hover:shadow-white/20 transition-all">
                                Voir le profil
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

