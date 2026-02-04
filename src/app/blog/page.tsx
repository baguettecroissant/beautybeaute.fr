import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts, categories, BlogPost } from '@/data/blog-posts';
import { Clock, ChevronRight, User } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Blog - Conseils & Guides Médecine Esthétique',
    description: 'Découvrez nos articles experts sur l\'épilation laser, la cryolipolyse, l\'hydrafacial et les injections esthétiques. Conseils, prix et avis.',
    keywords: ['blog médecine esthétique', 'conseils beauté', 'épilation laser guide', 'cryolipolyse avis', 'hydrafacial prix'],
    openGraph: {
        title: 'Blog BeautyBeauté - Conseils Médecine Esthétique',
        description: 'Articles experts sur les soins esthétiques en France',
        type: 'website',
    },
};

function ArticleCard({ post }: { post: BlogPost }) {
    return (
        <Link href={`/blog/${post.slug}`} className="group">
            <article className="glass-card rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(109,40,217,0.3)] h-full flex flex-col">
                <div className="relative h-48 overflow-hidden">
                    <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <span className="absolute bottom-3 left-3 text-xs px-2 py-1 rounded-md bg-primary/20 border border-primary/30 text-primary capitalize">
                        {categories.find(c => c.id === post.category)?.name || post.category}
                    </span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                    <h2 className="font-heading text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-2 mb-2">
                        {post.title}
                    </h2>
                    <p className="text-zinc-400 text-sm line-clamp-2 mb-4 flex-1">
                        {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                        <div className="flex items-center gap-2">
                            <User className="h-3 w-3" />
                            <span>{post.author.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{post.readTime} min</span>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}

export default function BlogPage() {
    const posts = getAllPosts();

    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section */}
            <section className="relative pt-32 pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(109,40,217,0.15),transparent_50%)]" />

                <div className="container mx-auto px-4 relative z-10">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
                        <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-white">Blog</span>
                    </nav>

                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4">
                            Le Magazine{' '}
                            <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                                BeautyBeauté
                            </span>
                        </h1>
                        <p className="text-lg text-zinc-400">
                            Conseils d&apos;experts, guides complets et actualités sur la médecine esthétique en France
                        </p>
                    </div>
                </div>
            </section>

            {/* Articles Grid */}
            <section className="container mx-auto px-4 pb-20">
                {posts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-zinc-400">Aucun article disponible pour le moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <ArticleCard key={post.slug} post={post} />
                        ))}
                    </div>
                )}
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 pb-20">
                <div className="glass p-8 md:p-12 rounded-3xl border border-white/5 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        Trouvez votre professionnel
                    </h2>
                    <p className="text-zinc-400 mb-6 max-w-2xl mx-auto">
                        Consultez notre annuaire pour trouver les meilleurs centres de médecine esthétique près de chez vous.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/epilation-laser"
                            className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium transition-colors"
                        >
                            Épilation Laser
                        </Link>
                        <Link
                            href="/cryolipolyse-minceur"
                            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                        >
                            Cryolipolyse
                        </Link>
                        <Link
                            href="/soin-hydrafacial"
                            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                        >
                            Hydrafacial
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
