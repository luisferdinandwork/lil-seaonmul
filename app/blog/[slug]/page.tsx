import BlogDetailPage from '@/sections/blog/BlogDetailPage';

export default function BlogPost({ params }: { params: { slug: string } }) {
  return <BlogDetailPage params={params} />;
}