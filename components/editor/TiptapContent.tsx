// components/editor/TiptapContent.tsx
// Renders HTML from Tiptap with the same .tiptap-content styles used in global CSS.
// Use this wherever you display saved post content.
"use client";

interface TiptapContentProps {
  html: string;
  className?: string;
}

export default function TiptapContent({ html, className = "" }: TiptapContentProps) {
  if (!html) return null;

  return (
    <div
      className={`tiptap-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}