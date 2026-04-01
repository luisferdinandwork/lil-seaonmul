/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/home-cms/page.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type CmsType = "hero" | "gallery" | "shop"

const API_MAP: Record<CmsType, string> = {
  hero: "/api/home/hero-slides",
  gallery: "/api/home/gallery",
  shop: "/api/home/shop-categories",
}

const INITIAL_FORM = {
  label: "",
  image: "",
  shopeeUrl: "",
  sortOrder: 0,
  active: true,
  alt: "",
  sub: "",
  badge: "",
  badgeVariant: "trending",
}

export default function HomeCmsPage() {
  const [type, setType] = useState<CmsType>("hero")
  const [data, setData] = useState<Record<string, any>[]>([])
  const [loading, setLoading] = useState(true)
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState(INITIAL_FORM)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(API_MAP[type])
      const json = await res.json()
      setData(Array.isArray(json) ? json : [])
    } catch {
      toast.error("Gagal memuat data")
      setData([])
    } finally {
      setLoading(false)
    }
  }, [type])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const openCreateDialog = () => {
    setEditingId(null)
    setFormData(INITIAL_FORM)
    setIsDialogOpen(true)
  }

  const openEditDialog = (item: Record<string, any>) => {
    setEditingId(item.id)
    setFormData({
      label: item.label || "",
      image: item.image || "",
      shopeeUrl: item.shopeeUrl || "",
      sortOrder: item.sortOrder || 0,
      active: item.active ?? true,
      alt: item.alt || "",
      sub: item.sub || "",
      badge: item.badge || "",
      badgeVariant: item.badgeVariant || "trending",
    })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Filter payload agar tidak mengirim field kosong yang tidak dibutuhkan schema
      let payload: Record<string, any>
      if (type === "hero") {
        const { alt, sub, badge, badgeVariant, ...rest } = formData
        payload = rest
      } else if (type === "gallery") {
        const { sub, badge, badgeVariant, ...rest } = formData
        payload = rest
      } else {
        const { alt, ...rest } = formData
        payload = rest
      }

      const url = editingId ? `${API_MAP[type]}/${editingId}` : API_MAP[type]
      const method = editingId ? "PUT" : "POST"
      
      const token = localStorage.getItem("auth_token")
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Gagal menyimpan")
      
      toast.success(editingId ? "Berhasil diperbarui" : "Berhasil ditambahkan")
      setIsDialogOpen(false)
      fetchData()
    } catch {
      toast.error("Terjadi kesalahan saat menyimpan")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus item ini?")) return

    try {
      const token = localStorage.getItem("auth_token")
      const res = await fetch(`${API_MAP[type]}/${id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })

      if (!res.ok) throw new Error("Gagal menghapus")
      
      toast.success("Berhasil dihapus")
      fetchData()
    } catch {
      toast.error("Gagal menghapus item")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Home CMS</h1>
          <p className="text-muted-foreground">Kelola konten yang muncul di halaman utama.</p>
        </div>
      </div>

      <Tabs value={type} onValueChange={(v: string) => setType(v as CmsType)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hero">Hero Slides</TabsTrigger>
          <TabsTrigger value="gallery">Galeri</TabsTrigger>
          <TabsTrigger value="shop">Kategori Toko</TabsTrigger>
        </TabsList>

        {/* Render list untuk semua tab */}
        {[["hero"], ["gallery"], ["shop"]].map(([tab]) => (
          <TabsContent key={tab} value={tab} className="mt-6">
            <div className="flex justify-end mb-4">
              <Button onClick={openCreateDialog} size="sm">
                <Plus className="mr-2 h-4 w-4" /> Tambah Baru
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : data.length === 0 ? (
              <div className="text-center py-12 border border-dashed rounded-lg">
                <p className="text-muted-foreground">Belum ada data.</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Preview</TableHead>
                      <TableHead>Detail</TableHead>
                      <TableHead className="w-[100px] text-center">Urutan</TableHead>
                      <TableHead className="w-[80px] text-center">Status</TableHead>
                      <TableHead className="w-[100px] text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="w-12 h-12 rounded-md overflow-hidden bg-muted relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.image} alt="" className="object-cover w-full h-full" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-sm">{item.label || item.alt}</p>
                          {item.sub && <p className="text-xs text-muted-foreground">{item.sub}</p>}
                          {item.badge && <Badge variant="outline" className="mt-1 text-[10px]">{item.badge}</Badge>}
                        </TableCell>
                        <TableCell className="text-center text-sm">{item.sortOrder}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={item.active ? "default" : "secondary"} className="text-[10px]">
                            {item.active ? "Aktif" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(item)}>
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

      {/* Dialog Form Universal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit" : "Tambah"}{" "}
              {type === "hero" ? "Hero Slide" : type === "gallery" ? "Galeri" : "Kategori Toko"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Fields untuk Hero & Gallery & Shop */}
            {(type === "hero" || type === "shop") && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="label" className="text-right">Label</Label>
                <Input id="label" value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })} className="col-span-3" />
              </div>
            )}

            {/* Fields khusus Gallery */}
            {type === "gallery" && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="label" className="text-right">Label</Label>
                  <Input id="label" value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="alt" className="text-right">Alt Text</Label>
                  <Input id="alt" value={formData.alt} onChange={(e) => setFormData({ ...formData, alt: e.target.value })} className="col-span-3" />
                </div>
              </>
            )}

            {/* Fields khusus Shop */}
            {type === "shop" && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sub" className="text-right">Sub-text</Label>
                  <Input id="sub" value={formData.sub} onChange={(e) => setFormData({ ...formData, sub: e.target.value })} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="badge" className="text-right">Badge Text</Label>
                  <Input id="badge" value={formData.badge} onChange={(e) => setFormData({ ...formData, badge: e.target.value })} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="badgeVariant" className="text-right">Tipe Badge</Label>
                  <div className="col-span-3">
                    <Select value={formData.badgeVariant} onValueChange={(val) => setFormData({ ...formData, badgeVariant: val })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="trending">Trending</SelectItem>
                        <SelectItem value="bestseller">Bestseller</SelectItem>
                        <SelectItem value="new">Baru</SelectItem>
                        <SelectItem value="popular">Populer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {/* Shared Fields */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">URL Gambar</Label>
              <Input id="image" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="col-span-3" placeholder="https://res.cloudinary.com/..." />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="shopee" className="text-right">URL Shopee</Label>
              <Input id="shopee" value={formData.shopeeUrl} onChange={(e) => setFormData({ ...formData, shopeeUrl: e.target.value })} className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sort" className="text-right">Urutan</Label>
              <Input id="sort" type="number" value={formData.sortOrder} onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })} className="col-span-3" />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label htmlFor="active" className="cursor-pointer">Status Aktif</Label>
                <p className="text-xs text-muted-foreground">Jika nonaktif, tidak akan tampil di website</p>
              </div>
              <Switch id="active" checked={formData.active} onCheckedChange={(val) => setFormData({ ...formData, active: val })} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingId ? "Simpan Perubahan" : "Tambah"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}