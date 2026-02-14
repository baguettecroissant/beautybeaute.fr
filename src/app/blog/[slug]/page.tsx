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

// ─── Inline Markdown Renderer ────────────────────────────────────────────────
function renderInline(text: string): string {
    return text
        // Bold + italic
        .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
        // Italic
        .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
        // Emojis
        .replace(/✅/g, '<span class="text-green-400">✅</span>')
        .replace(/❌/g, '<span class="text-red-400">❌</span>')
        .replace(/⚠️/g, '<span class="text-yellow-400">⚠️</span>')
        .replace(/⭐/g, '<span class="text-yellow-400">⭐</span>');
}

// ─── Block-level Markdown Renderer (2-pass) ──────────────────────────────────
function renderMarkdown(content: string): string {
    const lines = content.split('\n');
    const htmlBlocks: string[] = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];
        const trimmed = line.trim();

        // ── Skip empty lines ──
        if (trimmed === '') {
            i++;
            continue;
        }

        // ── Headings ──
        if (trimmed.startsWith('### ')) {
            htmlBlocks.push(`<h3 class="text-xl font-bold text-white mt-8 mb-4">${renderInline(trimmed.slice(4))}</h3>`);
            i++;
            continue;
        }
        if (trimmed.startsWith('## ')) {
            htmlBlocks.push(`<h2 class="text-2xl font-bold text-white mt-10 mb-4">${renderInline(trimmed.slice(3))}</h2>`);
            i++;
            continue;
        }
        if (trimmed.startsWith('# ')) {
            htmlBlocks.push(`<h1 class="text-3xl font-bold text-white mt-12 mb-6">${renderInline(trimmed.slice(2))}</h1>`);
            i++;
            continue;
        }

        // ── Horizontal rule ──
        if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
            htmlBlocks.push('<hr class="my-8 border-zinc-800" />');
            i++;
            continue;
        }

        // ── Table block ──
        if (trimmed.includes('|') && trimmed.startsWith('|')) {
            const tableLines: string[] = [];
            while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
                tableLines.push(lines[i].trim());
                i++;
            }
            if (tableLines.length >= 2) {
                htmlBlocks.push(renderTable(tableLines));
            }
            continue;
        }

        // ── Blockquote block (group consecutive > lines) ──
        if (trimmed.startsWith('> ') || trimmed === '>') {
            const bqLines: string[] = [];
            while (i < lines.length && (lines[i].trim().startsWith('> ') || lines[i].trim() === '>')) {
                bqLines.push(lines[i].trim().replace(/^>\s?/, ''));
                i++;
            }
            const bqContent = bqLines.map(l => renderInline(l)).join('<br/>');
            htmlBlocks.push(`<blockquote class="border-l-4 border-primary pl-4 my-6 py-3 text-zinc-300 italic bg-zinc-900/30 rounded-r-lg">${bqContent}</blockquote>`);
            continue;
        }

        // ── Ordered list block ──
        if (/^\d+\.\s/.test(trimmed)) {
            const listItems: string[] = [];
            while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
                listItems.push(renderInline(lines[i].trim().replace(/^\d+\.\s/, '')));
                i++;
            }
            const lis = listItems.map(li => `<li class="text-zinc-300 mb-2">${li}</li>`).join('');
            htmlBlocks.push(`<ol class="list-decimal ml-6 my-4 space-y-1">${lis}</ol>`);
            continue;
        }

        // ── Unordered list block (-, *, •) ──
        if (/^[-*•]\s/.test(trimmed)) {
            const listItems: string[] = [];
            while (i < lines.length && /^[-*•]\s/.test(lines[i].trim())) {
                listItems.push(renderInline(lines[i].trim().replace(/^[-*•]\s/, '')));
                i++;
            }
            const lis = listItems.map(li => `<li class="text-zinc-300 mb-2">${li}</li>`).join('');
            htmlBlocks.push(`<ul class="list-disc ml-6 my-4 space-y-1">${lis}</ul>`);
            continue;
        }

        // ── Paragraph (default) ──
        // Collect consecutive non-special lines into a single paragraph
        const paraLines: string[] = [];
        while (i < lines.length) {
            const pLine = lines[i].trim();
            if (pLine === '' ||
                pLine.startsWith('#') ||
                pLine.startsWith('>') ||
                pLine.startsWith('|') ||
                pLine === '---' || pLine === '***' || pLine === '___' ||
                /^\d+\.\s/.test(pLine) ||
                /^[-*•]\s/.test(pLine)) {
                break;
            }
            paraLines.push(pLine);
            i++;
        }
        if (paraLines.length > 0) {
            const paraContent = paraLines.map(l => renderInline(l)).join('<br/>');
            htmlBlocks.push(`<p class="text-zinc-300 leading-relaxed mb-4">${paraContent}</p>`);
        }
    }

    return htmlBlocks.join('\n');
}

// ─── Table Renderer ──────────────────────────────────────────────────────────
function renderTable(tableLines: string[]): string {
    // Parse cells from a row line like "| cell1 | cell2 | cell3 |"
    const parseCells = (line: string): string[] => {
        return line.split('|').slice(1, -1).map(c => c.trim());
    };

    // Detect separator row (e.g. |---|:---:|---:|)
    const isSeparator = (line: string): boolean => {
        const cells = parseCells(line);
        return cells.every(c => /^:?-+:?$/.test(c));
    };

    // Find separator row index
    let separatorIdx = -1;
    for (let j = 0; j < tableLines.length; j++) {
        if (isSeparator(tableLines[j])) {
            separatorIdx = j;
            break;
        }
    }

    let thead = '';
    let tbodyRows: string[] = [];

    if (separatorIdx >= 0) {
        // Everything before separator is header
        const headerLines = tableLines.slice(0, separatorIdx);
        const bodyLines = tableLines.slice(separatorIdx + 1);

        const headerRowsHtml = headerLines.map(hl => {
            const cells = parseCells(hl);
            const ths = cells.map(c => `<th class="px-4 py-3 text-left text-sm font-semibold text-white bg-zinc-800/80 border-b border-zinc-700">${renderInline(c)}</th>`).join('');
            return `<tr>${ths}</tr>`;
        }).join('');
        thead = `<thead>${headerRowsHtml}</thead>`;

        tbodyRows = bodyLines.filter(bl => !isSeparator(bl));
    } else {
        // No separator found: treat all as body
        tbodyRows = tableLines;
    }

    const tbodyHtml = tbodyRows.map((row, idx) => {
        const cells = parseCells(row);
        const bgClass = idx % 2 === 0 ? 'bg-zinc-900/50' : 'bg-zinc-900/30';
        const tds = cells.map(c => `<td class="px-4 py-3 text-sm text-zinc-300 border-b border-zinc-800/50">${renderInline(c)}</td>`).join('');
        return `<tr class="${bgClass} hover:bg-zinc-800/50 transition-colors">${tds}</tr>`;
    }).join('');
    const tbody = `<tbody>${tbodyHtml}</tbody>`;

    return `<div class="overflow-x-auto my-6 rounded-xl border border-zinc-800"><table class="w-full border-collapse text-left">${thead}${tbody}</table></div>`;
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const relatedPosts = getRelatedPosts(slug, 3);
    const categoryName = categories.find(c => c.id === post.category)?.name || post.category;

    // JSON-LD structured data for Article
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.metaDescription,
        image: post.imageUrl,
        datePublished: post.publishedAt,
        ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
        author: {
            '@type': 'Person',
            name: post.author.name,
            jobTitle: post.author.role,
        },
        publisher: {
            '@type': 'Organization',
            name: 'BeautyBeauté',
            url: 'https://www.beautybeaute.fr',
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://www.beautybeaute.fr/blog/${post.slug}`,
        },
        keywords: post.keywords.join(', '),
        wordCount: post.content.split(/\s+/).length,
        timeRequired: `PT${post.readTime}M`,
    };

    return (
        <div className="min-h-screen bg-black">
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(109,40,217,0.15),transparent_50%)]" />

                <div className="container mx-auto px-4 relative z-10">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-8" aria-label="Fil d'Ariane">
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
                                <time dateTime={post.publishedAt}>
                                    {new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </time>
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

            {/* Article Content — semantic <article> wrapper */}
            <article className="container mx-auto px-4 pb-16">
                <div className="max-w-3xl mx-auto">
                    <div
                        className="prose prose-invert prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
                    />
                </div>
            </article>

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
