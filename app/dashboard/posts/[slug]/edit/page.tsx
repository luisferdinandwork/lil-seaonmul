// app/dashboard/posts/[slug]/edit/page.tsx
"use client";

import { use } from "react";
import PostEditor from "@/components/editor/PostEditor";

export default function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return <PostEditor slug={slug} />;
}