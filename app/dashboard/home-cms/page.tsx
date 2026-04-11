/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/home-cms/page.tsx
"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { toast } from "sonner"
import { Loader2, Plus, Pencil, Trash2, Upload, X, ImageIcon, AlertCircle } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { useAuth } from "@/app/auth-context"

// ─── Types ────────────────────────────────────────────────────────────────────

type CmsType = "hero" | "gallery" | "shop"

const API_MAP: Record<CmsType, string> = {
  hero:    "/api/home/hero-slides",
  gallery: "/api/home/gallery",
  shop:    "/api/home/shop-categories",
}

const TAB_LABELS: Record<CmsType, string> = {
  hero:    "Hero Slide",
  gallery: "Galeri",
  shop:    "Kategori Toko",
}

const INITIAL_FORM = {
  label: "", shopeeUrl: "", sortOrder: 0, active: true,
  alt: "", sub: "", badge: "", badgeVariant: "trending",
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({
  label, required, hint, children,
}: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline gap-1">
        <Label className="text-sm font-medium">{label}</Label>
        {required && <span className="text-destructive text-xs">*</span>}
      </div>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

// ─── Image upload ─────────────────────────────────────────────────────────────

function ImageUploadField({
  currentImageUrl, file, onFileChange, onClear,
}: {
  currentImageUrl: string; file: File | null
  onFileChange: (f: File) => void; onClear: () => void
}) {
  const inputRef   = useRef<HTMLInputElement>(null)
  const previewSrc = file ? URL.createObjectURL(file) : currentImageUrl || null

  return (
    <div className="space-y-2">
      {previewSrc ? (
        <div className="relative w-full h-44 rounded-xl overflow-hidden border border-border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewSrc} alt="Preview" className="w-full h-full object-cover" />
          <button type="button" onClick={onClear}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/55 text-white flex items-center justify-center hover:bg-black/75 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={() => inputRef.current?.click()}
            className="absolute inset-0 flex items-end justify-center pb-3 opacity-0 hover:opacity-100 transition-opacity">
            <span className="text-[11px] font-semibold text-white bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
              Ganti gambar
            </span>
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()}
          className="w-full h-44 rounded-xl border-2 border-dashed border-border bg-muted/40 flex flex-col items-center justify-center gap-2.5 hover:border-primary/50 hover:bg-primary/5 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Klik untuk upload</p>
            <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG, WebP · Maks. 5 MB</p>
          </div>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden"
        onChange={e => {
          const f = e.target.files?.[0]
          if (!f) return
          if (f.size > 5 * 1024 * 1024) { toast.error("Ukuran gambar maksimal 5 MB"); return }
          onFileChange(f); e.target.value = ""
        }}
      />
      {file && (
        <p className="text-xs text-muted-foreground truncate">
          <span className="font-medium">{file.name}</span> · {(file.size / 1024).toFixed(0)} KB
        </p>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function HomeCmsPage() {
  // ✅ Read token directly from localStorage using the key set by auth-context
  const { user } = useAuth()

  const getAuthHeaders = useCallback((): Record<string, string> => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
    return token ? { Authorization: `Bearer ${token}` } : {}
  }, [])

  const [type, setType]       = useState<CmsType>("hero")
  const [data, setData]       = useState<Record<string, any>[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const [isDialogOpen, setIsDialogOpen]       = useState(false)
  const [editingId, setEditingId]             = useState<string | null>(null)
  const [editingImageUrl, setEditingImageUrl] = useState("")
  const [isSaving, setIsSaving]               = useState(false)
  const [formData, setFormData]               = useState(INITIAL_FORM)
  const [imageFile, setImageFile]             = useState<File | null>(null)

  const set = (key: keyof typeof INITIAL_FORM, val: any) =>
    setFormData(prev => ({ ...prev, [key]: val }))

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchData = useCallback(async () => {
    setLoading(true)
    setFetchError(null)
    try {
      const res = await fetch(`${API_MAP[type]}?all=true`, {
        headers: getAuthHeaders(),
      })

      const json = await res.json()

      if (!res.ok) {
        const msg = json?.error ?? `HTTP ${res.status}`
        setFetchError(msg)
        setData([])
        if (res.status === 401) toast.error("Sesi habis, silakan login ulang")
        return
      }

      if (!Array.isArray(json)) {
        console.error("API did not return an array:", json)
        setFetchError("Format data tidak valid dari server")
        setData([])
        return
      }

      setData(json)
    } catch (err) {
      console.error("fetchData error:", err)
      setFetchError("Gagal menghubungi server")
      setData([])
    } finally {
      setLoading(false)
    }
  }, [type, getAuthHeaders])

  useEffect(() => { fetchData() }, [fetchData])

  // ── Dialog ─────────────────────────────────────────────────────────────────

  const openCreate = () => {
    setEditingId(null); setEditingImageUrl("")
    setFormData(INITIAL_FORM); setImageFile(null); setIsDialogOpen(true)
  }

  const openEdit = (item: Record<string, any>) => {
    setEditingId(item.id); setEditingImageUrl(item.image ?? ""); setImageFile(null)
    setFormData({
      label: item.label ?? "", shopeeUrl: item.shopeeUrl ?? "",
      sortOrder: item.sortOrder ?? 0, active: item.active ?? true,
      alt: item.alt ?? "", sub: item.sub ?? "",
      badge: item.badge ?? "", badgeVariant: item.badgeVariant ?? "trending",
    })
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false); setImageFile(null); setEditingImageUrl("")
  }

  // ── Save ───────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    // Image required only on create
    if (!editingId && !imageFile) { toast.error("Pilih gambar terlebih dahulu"); return }
    if (!formData.label.trim())   { toast.error("Label wajib diisi"); return }

    // ✅ shopeeUrl is required for hero and shop, optional for gallery
    if (type !== "gallery" && !formData.shopeeUrl.trim()) {
      toast.error("URL Shopee wajib diisi"); return
    }
    if (type === "gallery" && !formData.alt.trim())  { toast.error("Alt text wajib diisi"); return }
    if (type === "shop" && !formData.sub.trim())     { toast.error("Sub-text wajib diisi"); return }
    if (type === "shop" && !formData.badge.trim())   { toast.error("Badge wajib diisi"); return }

    setIsSaving(true)
    try {
      const form = new FormData()
      if (imageFile) form.append("image", imageFile)
      form.append("label",     formData.label)
      form.append("shopeeUrl", formData.shopeeUrl)
      form.append("sortOrder", String(formData.sortOrder))
      form.append("active",    String(formData.active))
      if (type === "gallery") form.append("alt", formData.alt)
      if (type === "shop") {
        form.append("sub",          formData.sub)
        form.append("badge",        formData.badge)
        form.append("badgeVariant", formData.badgeVariant)
      }

      const url    = editingId ? `${API_MAP[type]}/${editingId}` : API_MAP[type]
      const method = editingId ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        // ✅ Auth header from localStorage — no Content-Type so browser sets multipart boundary
        headers: getAuthHeaders(),
        body: form,
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result?.error ?? "Gagal menyimpan")

      toast.success(editingId ? "Berhasil diperbarui" : "Berhasil ditambahkan")
      closeDialog()
      fetchData()
    } catch (err: any) {
      toast.error(err.message ?? "Terjadi kesalahan")
    } finally {
      setIsSaving(false)
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus item ini?")) return
    try {
      const res = await fetch(`${API_MAP[type]}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })
      if (!res.ok) throw new Error()
      toast.success("Berhasil dihapus"); fetchData()
    } catch {
      toast.error("Gagal menghapus item")
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Home CMS</h1>
        <p className="text-muted-foreground text-sm mt-1">Kelola konten yang muncul di halaman utama.</p>
      </div>

      <Tabs value={type} onValueChange={v => { setType(v as CmsType) }}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hero">Hero Slides</TabsTrigger>
          <TabsTrigger value="gallery">Galeri</TabsTrigger>
          <TabsTrigger value="shop">Kategori Toko</TabsTrigger>
        </TabsList>

        {(["hero", "gallery", "shop"] as CmsType[]).map(tab => (
          <TabsContent key={tab} value={tab} className="mt-6">
            <div className="flex justify-end mb-4">
              <Button onClick={openCreate} size="sm">
                <Plus className="mr-2 h-4 w-4" /> Tambah {TAB_LABELS[tab]}
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : fetchError ? (
              <div className="flex flex-col items-center py-12 gap-3 border border-destructive/30 bg-destructive/5 rounded-xl">
                <AlertCircle className="w-7 h-7 text-destructive" />
                <div className="text-center">
                  <p className="text-sm font-medium text-destructive">Gagal memuat data</p>
                  <p className="text-xs text-muted-foreground mt-1">{fetchError}</p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchData}>Coba lagi</Button>
              </div>
            ) : data.length === 0 ? (
              <div className="text-center py-12 border border-dashed rounded-xl">
                <ImageIcon className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Belum ada data.</p>
                <Button variant="ghost" size="sm" onClick={openCreate} className="mt-3">
                  <Plus className="mr-1.5 h-3.5 w-3.5" /> Tambah pertama
                </Button>
              </div>
            ) : (
              <div className="border rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[72px]">Gambar</TableHead>
                      <TableHead>Detail</TableHead>
                      <TableHead className="w-[90px] text-center">Urutan</TableHead>
                      <TableHead className="w-[80px] text-center">Status</TableHead>
                      <TableHead className="w-[90px] text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            {item.image
                              // eslint-disable-next-line @next/next/no-img-element
                              ? <img src={item.image} alt="" className="object-cover w-full h-full" />
                              : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-4 h-4 text-muted-foreground/40" /></div>
                            }
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-sm">{item.label || item.alt}</p>
                          {item.sub   && <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>}
                          {item.badge && <Badge variant="outline" className="mt-1 text-[10px] h-4">{item.badge}</Badge>}
                          {item.shopeeUrl && (
                            <a href={item.shopeeUrl} target="_blank" rel="noopener noreferrer"
                              className="block text-[10px] text-primary/70 hover:text-primary truncate max-w-[200px] mt-0.5 transition-colors">
                              {item.shopeeUrl}
                            </a>
                          )}
                        </TableCell>
                        <TableCell className="text-center text-sm tabular-nums">{item.sortOrder}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={item.active ? "default" : "secondary"} className="text-[10px] h-4">
                            {item.active ? "Aktif" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(item.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* ── Dialog ───────────────────────────────────────────────────────────── */}
      <Dialog open={isDialogOpen} onOpenChange={open => { if (!open) closeDialog() }}>
        <DialogContent className="w-full sm:max-w-[480px] max-h-[92vh] p-0 flex flex-col gap-0 overflow-hidden">

          <DialogHeader className="flex-shrink-0 px-6 pt-5 pb-4 border-b border-border">
            <DialogTitle className="text-base">
              {editingId ? "Edit" : "Tambah"} {TAB_LABELS[type]}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            <Field label="Gambar" required={!editingId}
              hint={editingId ? "Kosongkan jika tidak ingin mengganti gambar" : undefined}>
              <ImageUploadField
                currentImageUrl={editingImageUrl}
                file={imageFile}
                onFileChange={setImageFile}
                onClear={() => setImageFile(null)}
              />
            </Field>

            <div className="border-t border-border" />

            <Field label="Label" required>
              <Input value={formData.label} onChange={e => set("label", e.target.value)}
                placeholder={type === "hero" ? "cth. Gantungan Kunci" : type === "gallery" ? "cth. Kotak Hadiah" : "cth. Set Hampers"} />
            </Field>

            {type === "gallery" && (
              <Field label="Alt Text" required hint="Deskripsi singkat untuk aksesibilitas layar">
                <Input value={formData.alt} onChange={e => set("alt", e.target.value)}
                  placeholder="cth. Kotak hadiah pastel dengan pita" />
              </Field>
            )}

            {type === "shop" && (
              <>
                <Field label="Sub-text" required>
                  <Input value={formData.sub} onChange={e => set("sub", e.target.value)} placeholder="cth. Custom sesuka hati" />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Teks Badge" required>
                    <Input value={formData.badge} onChange={e => set("badge", e.target.value)} placeholder="cth. Terlaris" />
                  </Field>
                  <Field label="Tipe Badge">
                    <Select value={formData.badgeVariant} onValueChange={v => set("badgeVariant", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="trending">Trending</SelectItem>
                        <SelectItem value="bestseller">Bestseller</SelectItem>
                        <SelectItem value="new">Baru</SelectItem>
                        <SelectItem value="popular">Populer</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              </>
            )}

            {/* ✅ shopeeUrl shown for all types — required for hero & shop, optional for gallery */}
            <Field
              label="URL Shopee"
              required={type !== "gallery"}
              hint={type === "gallery" ? "Opsional" : undefined}
            >
              <Input value={formData.shopeeUrl} onChange={e => set("shopeeUrl", e.target.value)}
                placeholder="https://shopee.co.id/..." />
            </Field>

            <div className="border-t border-border" />

            <div className="grid grid-cols-2 gap-3">
              <Field label="Urutan" hint="0 = paling atas">
                <Input type="number" min={0} value={formData.sortOrder}
                  onChange={e => set("sortOrder", parseInt(e.target.value) || 0)} />
              </Field>
              <Field label="Status">
                <div className="flex items-center justify-between h-10 px-3 rounded-xl border border-input bg-background">
                  <span className="text-sm text-foreground">{formData.active ? "Aktif" : "Draft"}</span>
                  <Switch checked={formData.active} onCheckedChange={v => set("active", v)} />
                </div>
              </Field>
            </div>
          </div>

          <DialogFooter className="flex-shrink-0 px-6 py-4 border-t border-border gap-2 sm:gap-2">
            <Button variant="outline" onClick={closeDialog} disabled={isSaving} className="flex-1 sm:flex-none">Batal</Button>
            <Button onClick={handleSave} disabled={isSaving} className="flex-1 sm:flex-none">
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingId ? "Simpan Perubahan" : "Tambah"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}