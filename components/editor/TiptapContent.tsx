// components/editor/TiptapContent.tsx
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