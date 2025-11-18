// app/blog/[slug]/page.tsx
import BlogDetailPage from '@/sections/blog/BlogDetailPage';

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  // Await the params before passing them to the client component
  const { slug } = await params;
  
  return <BlogDetailPage slug={slug} />;
}