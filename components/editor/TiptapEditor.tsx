/* eslint-disable @typescript-eslint/no-explicit-any */
// components/editor/TiptapEditor.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus, Link2, Unlink, ImagePlus, Loader2,
  Undo, Redo,
} from "lucide-react";

interface TiptapEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export default function TiptapEditor({
  value,
  onChange,
  placeholder = "Start writing your post…",
  minHeight = 520,
}: TiptapEditorProps) {
  const [uploading, setUploading] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      TiptapImage.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: { class: "rounded-xl my-4 max-w-full mx-auto block" },
      }),
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-blue-500 underline cursor-pointer" },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "ProseMirror outline-none focus:outline-none",
        style: `min-height: ${minHeight}px; padding: 2rem;`,
      },
    },
    immediatelyRender: false,
  });

  // Sync external value changes (e.g. loading from API)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    // Only set if meaningfully different to avoid cursor jumps
    if (value && value !== current && value !== "<p></p>") {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // ── Image upload ────────────────────────────────────────────────────────────

  const uploadImage = async (file: File) => {
    if (!editor) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res  = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      editor.chain().focus().setImage({ src: data.url, alt: file.name.replace(/\.[^.]+$/, "") }).run();
    } catch (err: any) {
      alert(err.message ?? "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ── Link helpers ────────────────────────────────────────────────────────────

  const applyLink = () => {
    if (!editor) return;
    const url = linkUrl.trim();
    if (url) {
      editor.chain().focus().setLink({ href: url.startsWith("http") ? url : `https://${url}` }).run();
    }
    setLinkUrl("");
    setShowLinkInput(false);
  };

  if (!editor) return null;

  // ── Toolbar button helper ───────────────────────────────────────────────────

  const Btn = ({
    onClick, active = false, disabled = false, title, children,
  }: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded-md transition-all ${
        active
          ? "bg-stone-800 text-white"
          : "text-stone-500 hover:text-stone-900 hover:bg-stone-200"
      } disabled:opacity-30`}
    >
      {children}
    </button>
  );

  const Sep = () => <span className="w-px h-4 bg-stone-200 mx-1 flex-shrink-0 self-center" />;

  return (
    <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white">
      {/* ── Toolbar ── */}
      <div className="flex items-center gap-0.5 px-3 py-2.5 border-b border-stone-100 bg-stone-50/60 flex-wrap select-none tiptap-toolbar">

        {/* History */}
        <Btn onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()} title="Undo">
          <Undo className="w-3.5 h-3.5" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()} title="Redo">
          <Redo className="w-3.5 h-3.5" />
        </Btn>

        <Sep />

        {/* Headings */}
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })} title="Heading 1">
          <Heading1 className="w-3.5 h-3.5" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })} title="Heading 2">
          <Heading2 className="w-3.5 h-3.5" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })} title="Heading 3">
          <Heading3 className="w-3.5 h-3.5" />
        </Btn>

        <Sep />

        {/* Inline marks */}
        <Btn onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")} title="Bold">
          <Bold className="w-3.5 h-3.5" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")} title="Italic">
          <Italic className="w-3.5 h-3.5" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")} title="Strikethrough">
          <Strikethrough className="w-3.5 h-3.5" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")} title="Inline code">
          <Code className="w-3.5 h-3.5" />
        </Btn>

        <Sep />

        {/* Lists */}
        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")} title="Bullet list">
          <List className="w-3.5 h-3.5" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")} title="Numbered list">
          <ListOrdered className="w-3.5 h-3.5" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")} title="Blockquote">
          <Quote className="w-3.5 h-3.5" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal rule">
          <Minus className="w-3.5 h-3.5" />
        </Btn>

        <Sep />

        {/* Link */}
        <div className="relative">
          <Btn onClick={() => {
            if (editor.isActive("link")) {
              editor.chain().focus().unsetLink().run();
            } else {
              setShowLinkInput(v => !v);
              setTimeout(() => linkRef.current?.focus(), 50);
            }
          }} active={editor.isActive("link")} title="Link">
            {editor.isActive("link") ? <Unlink className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
          </Btn>
          {showLinkInput && (
            <div className="absolute top-full left-0 mt-1 z-20 bg-white border border-stone-200 rounded-xl shadow-lg p-2 flex gap-1.5 min-w-[240px]">
              <input
                ref={linkRef}
                type="url"
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") applyLink(); if (e.key === "Escape") setShowLinkInput(false); }}
                placeholder="https://..."
                className="flex-1 text-xs px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:ring-2 focus:ring-stone-300"
              />
              <button type="button" onClick={applyLink}
                className="text-xs px-2.5 py-1.5 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-medium">
                Add
              </button>
            </div>
          )}
        </div>

        {/* Image */}
        <button
          type="button"
          onMouseDown={e => { e.preventDefault(); fileRef.current?.click(); }}
          disabled={uploading}
          title="Insert image"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-all text-xs font-medium disabled:opacity-40"
        >
          {uploading
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <ImagePlus className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{uploading ? "Uploading…" : "Image"}</span>
        </button>

        {/* Word count */}
        <span className="ml-auto text-[10px] text-stone-400 pr-1 flex-shrink-0">
          {editor.storage.characterCount?.words?.() ??
            editor.getText().split(/\s+/).filter(Boolean).length} words
        </span>
      </div>

      {/* ── Editor content ── */}
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={async e => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f?.type.startsWith("image/")) await uploadImage(f);
        }}
      >
        <EditorContent editor={editor} />
      </div>

      {/* ── Footer ── */}
      <div className="px-6 py-2.5 border-t border-stone-50 flex items-center justify-between text-[10px] text-stone-400 bg-stone-50/40">
        <span>Click toolbar buttons to format · Drag &amp; drop images</span>
        <span>{editor.getText().length} chars</span>
      </div>

      {/* Hidden file input */}
      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={async e => {
          const f = e.target.files?.[0];
          if (f) await uploadImage(f);
          e.target.value = "";
        }} />
    </div>
  );
}