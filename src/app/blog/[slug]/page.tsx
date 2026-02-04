import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts, getPostBySlug, getRelatedPosts, categories } from '@/data/blog-posts';
import { Clock, ChevronRight, User, Calendar, ArrowLeft } from 'lucide-react';

interface BlogArticlePageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        return {
            title: 'Article non trouvé',
        };
    }

    return {
        title: post.title,
        description: post.metaDescription,
        keywords: post.keywords,
        authors: [{ name: post.author.name }],
        openGraph: {
            title: post.title,
            description: post.metaDescription,
            type: 'article',
            publishedTime: post.publishedAt,
            authors: [post.author.name],
            images: [{ url: post.imageUrl, width: 1200, height: 630 }],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.metaDescription,
            images: [post.imageUrl],
        },
    };
}

// Simple markdown to HTML converter for blog content
function renderMarkdown(content: string): string {
    return content
        // Headers
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-white mt-8 mb-4">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-white mt-10 mb-4">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-white mt-12 mb-6">$1</h1>')
        // Bold and italic
        .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
        // Blockquotes
        .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary pl-4 my-4 text-zinc-300 italic">$1</blockquote>')
        // Horizontal rules
        .replace(/^---$/gim, '<hr class="my-8 border-zinc-800" />')
        // Lists
        .replace(/^\d+\. (.*$)/gim, '<li class="ml-6 list-decimal text-zinc-300 mb-2">$1</li>')
        .replace(/^- (.*$)/gim, '<li class="ml-6 list-disc text-zinc-300 mb-2">$1</li>')
        // Tables (basic support)
        .replace(/\|(.+)\|/g, (match) => {
            const cells = match.split('|').filter(c => c.trim());
            if (cells.every(c => c.trim().match(/^-+$/))) {
                return ''; // Skip separator row
            }
            const isHeader = match.includes('---');
            const cellTag = 'td';
            const cellsHtml = cells.map(c =>
                `<${cellTag} class="px-4 py-2 border border-zinc-800">${c.trim()}</${cellTag}>`
            ).join('');
            return `<tr class="bg-zinc-900/50">${cellsHtml}</tr>`;
        })
        // Emoji-like symbols
        .replace(/✅/g, '<span class="text-green-400">✅</span>')
        .replace(/❌/g, '<span class="text-red-400">❌</span>')
        .replace(/⚠️/g, '<span class="text-yellow-400">⚠️</span>')
        .replace(/⭐/g, '<span class="text-yellow-400">⭐</span>')
        // Paragraphs
        .split('\n\n')
        .map(p => {
            if (p.startsWith('<h') || p.startsWith('<blockquote') || p.startsWith('<li') || p.startsWith('<hr') || p.startsWith('<tr')) {
                return p;
            }
            if (p.trim()) {
                return `<p class="text-zinc-300 leading-relaxed mb-4">${p.replace(/\n/g, '<br/>')}</p>`;
            }
            return '';
        })
        .join('\n');
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const relatedPosts = getRelatedPosts(slug, 3);
    const categoryName = categories.find(c => c.id === post.category)?.name || post.category;

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
                        <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-white line-clamp-1">{post.title}</span>
                    </nav>

                    {/* Back link */}
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Retour au blog
                    </Link>

                    {/* Article Header */}
                    <div className="max-w-4xl">
                        <span className="inline-block text-xs px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary mb-4">
                            {categoryName}
                        </span>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-white mb-6">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>{post.author.name}</span>
                                <span className="text-zinc-600">•</span>
                                <span className="text-zinc-500">{post.author.role}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{post.readTime} min de lecture</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Image */}
            <section className="container mx-auto px-4 -mt-8 mb-12">
                <div className="relative h-64 md:h-96 lg:h-[500px] rounded-3xl overflow-hidden max-w-5xl mx-auto">
                    <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
            </section>

            {/* Article Content */}
            <section className="container mx-auto px-4 pb-16">
                <div className="max-w-3xl mx-auto">
                    <div
                        className="prose prose-invert prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
                    />
                </div>
            </section>

            {/* Related Articles */}
            {relatedPosts.length > 0 && (
                <section className="container mx-auto px-4 pb-20">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl font-bold text-white mb-8">Articles similaires</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedPosts.map((relatedPost) => (
                                <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`} className="group">
                                    <article className="glass-card rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300">
                                        <div className="relative h-32 overflow-hidden">
                                            <Image
                                                src={relatedPost.imageUrl}
                                                alt={relatedPost.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-white group-hover:text-primary transition-colors line-clamp-2 text-sm">
                                                {relatedPost.title}
                                            </h3>
                                            <div className="flex items-center gap-1 text-xs text-zinc-500 mt-2">
                                                <Clock className="h-3 w-3" />
                                                <span>{relatedPost.readTime} min</span>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="container mx-auto px-4 pb-20">
                <div className="glass p-8 md:p-12 rounded-3xl border border-white/5 text-center max-w-4xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        Prêt(e) à passer à l&apos;action ?
                    </h2>
                    <p className="text-zinc-400 mb-6">
                        Trouvez les meilleurs professionnels près de chez vous.
                    </p>
                    <Link
                        href={`/${post.category === 'conseils' ? 'epilation-laser' : post.category.replace('hydrafacial', 'soin-hydrafacial').replace('cryolipolyse', 'cryolipolyse-minceur').replace('injections', 'injections-esthetique')}`}
                        className="inline-block px-8 py-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold transition-colors"
                    >
                        Trouver un centre
                    </Link>
                </div>
            </section>
        </div>
    );
}
