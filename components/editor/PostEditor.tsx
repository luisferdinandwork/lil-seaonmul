/* eslint-disable @typescript-eslint/no-explicit-any */
// components/editor/PostEditor.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Save, ArrowLeft, Tag, Clock, User, Globe,
  EyeOff, X, Plus, Loader2, CheckCircle, AlertCircle,
  ChevronDown,
} from "lucide-react";
import ImageUploader from "./ImageUploader";
import TiptapEditor from "./TiptapEditor";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Author { id: string; name: string; avatar?: string; }

export interface PostEditorProps { slug?: string; }

interface PostForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  tags: string[];
  authorId: string;
  readTime: string;
  published: boolean;
}

const EMPTY: PostForm = {
  title: "", slug: "", excerpt: "", content: "",
  featuredImage: "", tags: [], authorId: "",
  readTime: "5 min read", published: false,
};

function slugify(s: string) {
  return s.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PostEditor({ slug }: PostEditorProps) {
  const isEditing = !!slug;
  const router = useRouter();

  const [form, setForm] = useState<PostForm>(EMPTY);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditing);
  const [slugManual, setSlugManual] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const tagRef = useRef<HTMLInputElement>(null);

  const field = <K extends keyof PostForm>(k: K, v: PostForm[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Load authors ─────────────────────────────────────────────────────────────

  useEffect(() => {
    fetch("/api/authors")
      .then(r => r.json())
      .then(d => Array.isArray(d) && setAuthors(d))
      .catch(() => {});
  }, []);

  // ── Load post ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isEditing) return;
    fetch(`/api/posts/${slug}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => {
        const p = d.post ?? d;
        setForm({
          title:         p.title         ?? "",
          slug:          p.slug          ?? "",
          excerpt:       p.excerpt       ?? "",
          content:       p.content       ?? "",
          featuredImage: p.featuredImage ?? "",
          tags:          p.tags          ?? [],
          authorId:      p.authorId      ?? p.author?.id ?? "",
          readTime:      p.readTime      ?? "5 min read",
          published:     p.published     ?? false,
        });
        setSlugManual(true);
      })
      .catch(() => showToast("Failed to load post", false))
      .finally(() => setLoading(false));
  }, [slug, isEditing]);

  // ── Helpers ───────────────────────────────────────────────────────────────────

  const onTitleChange = (v: string) => {
    field("title", v);
    if (!slugManual) field("slug", slugify(v));
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (!t || form.tags.includes(t)) { setTagInput(""); return; }
    field("tags", [...form.tags, t]);
    setTagInput("");
    tagRef.current?.focus();
  };

  const wordCount = form.content
    .replace(/<[^>]*>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  const estRead = Math.max(1, Math.ceil(wordCount / 200));

  // ── Save ──────────────────────────────────────────────────────────────────────

  const save = async (publishOverride?: boolean) => {
    if (!form.title.trim())   return showToast("Title is required", false);
    if (!form.slug.trim())    return showToast("Slug is required", false);
    if (!form.content.trim() || form.content === "<p></p>")
      return showToast("Content is required", false);
    if (!form.authorId)       return showToast("Select an author", false);

    setSaving(true);
    try {
      const payload = { ...form, published: publishOverride ?? form.published };
      const res = await fetch(
        isEditing ? `/api/posts/${slug}` : "/api/posts",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Save failed");
      }
      const saved = await res.json();
      showToast(isEditing ? "Post updated ✓" : "Post created ✓");
      if (!isEditing) router.push(`/dashboard/posts/${saved.slug ?? form.slug}/edit`);
      else if (publishOverride !== undefined) field("published", publishOverride);
    } catch (err: any) {
      showToast(err.message ?? "Save failed", false);
    } finally {
      setSaving(false);
    }
  };

  // ── Loading ───────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-pink-300 animate-spin" />
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-stone-50 font-sans">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 pl-4 pr-3 py-3 rounded-2xl shadow-lg text-sm font-medium border pointer-events-none animate-in slide-in-from-top-2 fade-in duration-300 ${
          toast.ok
            ? "bg-white text-emerald-700 border-emerald-100"
            : "bg-white text-red-600 border-red-100"
        }`}>
          {toast.ok
            ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            : <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
          {toast.msg}
        </div>
      )}

      {/* ── Top bar ── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-stone-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="max-w-screen-xl mx-auto px-5 h-14 flex items-center gap-3">
          <button type="button" onClick={() => router.push("/dashboard/posts")}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors flex-shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </button>

          <span className="text-sm font-semibold text-stone-700 truncate min-w-0 flex-1">
            {isEditing ? (form.title || slug) : "New post"}
          </span>

          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 transition-colors ${
            form.published 
              ? "bg-pink-50 text-pink-600 border border-pink-100" 
              : "bg-stone-50 text-stone-500 border border-stone-100"
          }`}>
            {form.published ? "PUBLISHED" : "DRAFT"}
          </span>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button type="button" onClick={() => save(false)} disabled={saving}
              className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 hover:border-stone-300 transition-all duration-150 disabled:opacity-50">
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Draft</span>
            </button>
            <button type="button" onClick={() => save(true)} disabled={saving}
              className="flex items-center gap-1.5 text-xs px-4 py-1.5 rounded-lg bg-pink-500 hover:bg-pink-600 text-white transition-all duration-150 disabled:opacity-50 shadow-sm shadow-pink-200">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
              {form.published ? "Update" : "Publish"}
            </button>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="max-w-screen-xl mx-auto px-5 py-6 flex gap-6 items-start">

        {/* ── Left: canvas ── */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Title + slug */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <textarea
              value={form.title}
              onChange={e => onTitleChange(e.target.value)}
              placeholder="Post title…"
              rows={2}
              className="w-full px-7 pt-6 pb-3 text-3xl font-bold text-stone-900 placeholder:text-stone-200 bg-transparent outline-none resize-none leading-tight"
            />
            <div className="px-7 pb-5 flex items-center gap-2 border-t border-stone-50">
              <span className="text-xs text-stone-300 flex-shrink-0">/blog/</span>
              <input type="text" value={form.slug}
                onChange={e => { setSlugManual(true); field("slug", slugify(e.target.value)); }}
                className="flex-1 text-xs text-stone-500 font-mono bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-200 min-w-0 transition-all" />
            </div>
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm px-7 py-5">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Excerpt</p>
            <textarea value={form.excerpt}
              onChange={e => field("excerpt", e.target.value)}
              placeholder="A short summary shown in listings…"
              rows={2}
              className="w-full text-sm text-stone-600 placeholder:text-stone-300 bg-transparent outline-none resize-none leading-relaxed" />
          </div>

          {/* ── WYSIWYG Editor ── */}
          <div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 px-1">Content</p>
            <TiptapEditor
              value={form.content}
              onChange={v => field("content", v)}
              placeholder="Start writing your post… select text to see formatting options, or use the toolbar above."
              minHeight={520}
            />
            <p className="text-[10px] text-stone-400 mt-1.5 px-1 text-right">
              ~{estRead} min read · {wordCount} words
            </p>
          </div>
        </div>

        {/* ── Right: sidebar ── */}
        <aside className="w-64 xl:w-72 flex-shrink-0 space-y-3">

          {/* Publish */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 space-y-2">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">Publish</p>
            <button type="button" onClick={() => save(true)} disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold transition-all duration-150 disabled:opacity-50 shadow-sm shadow-pink-200">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
              {form.published ? "Update & Publish" : "Publish Now"}
            </button>
            <button type="button" onClick={() => save(false)} disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-pink-200 text-pink-600 text-xs font-medium hover:bg-pink-50 transition-all duration-150 disabled:opacity-50">
              <Save className="w-3.5 h-3.5" />
              Save as Draft
            </button>
            {form.published && (
              <button type="button" onClick={() => save(false)} disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-stone-500 text-xs font-medium hover:bg-stone-50 transition-colors">
                <EyeOff className="w-3.5 h-3.5" />
                Unpublish
              </button>
            )}
          </div>

          {/* Author */}
          <Panel label="Author" icon={User}>
            <div className="relative">
              <select value={form.authorId} onChange={e => field("authorId", e.target.value)}
                className="w-full appearance-none text-xs text-stone-700 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 pr-8 outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-200 cursor-pointer transition-all">
                <option value="">Select author…</option>
                {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
            </div>
          </Panel>

          {/* Featured image */}
          <Panel label="Featured Image">
            <ImageUploader
              value={form.featuredImage}
              onChange={v => field("featuredImage", v)}
              aspectRatio="video"
              hint="Recommended: 1200 × 630 px"
            />
          </Panel>

          {/* Tags */}
          <Panel label="Tags" icon={Tag}>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {form.tags.map(t => (
                  <span key={t} className="inline-flex items-center gap-1 text-[11px] bg-pink-50 text-pink-600 border border-pink-100 px-2.5 py-1 rounded-full">
                    {t}
                    <button type="button"
                      onClick={() => field("tags", form.tags.filter(x => x !== t))}
                      className="hover:text-pink-800 transition-colors ml-0.5">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-1.5">
              <input ref={tagRef} type="text" value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); }
                  if (e.key === "Backspace" && !tagInput && form.tags.length)
                    field("tags", form.tags.slice(0, -1));
                }}
                placeholder="Add tag…"
                className="flex-1 text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-200 placeholder:text-stone-300 transition-all" />
              <button type="button" onClick={addTag}
                className="p-2 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-500 hover:text-pink-600 border border-pink-100 transition-all flex-shrink-0">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[10px] text-stone-400 mt-1.5">Enter or comma to add</p>
          </Panel>

          {/* Read time */}
          <Panel label="Read Time" icon={Clock}>
            <input type="text" value={form.readTime}
              onChange={e => field("readTime", e.target.value)}
              placeholder="5 min read"
              className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-200 placeholder:text-stone-300 transition-all" />
            <p className="text-[10px] text-stone-400 mt-1.5">Estimated: ~{estRead} min</p>
          </Panel>

        </aside>
      </div>
    </div>
  );
}

// ── Panel wrapper ─────────────────────────────────────────────────────────────

function Panel({ label, icon: Icon, children }: {
  label: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
      <div className="flex items-center gap-1.5 mb-3">
        {Icon && <Icon className="w-3.5 h-3.5 text-pink-400" />}
        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{label}</p>
      </div>
      {children}
    </div>
  );
}