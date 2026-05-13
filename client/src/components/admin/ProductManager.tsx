import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, X, Upload } from "lucide-react";
import { apiFetch } from "@/utils/api";

const ProductManager = () => {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    subCategory: "",
    imageLink: "",
    featured: false,
    isNew: false,
    imagesLinks: "",
    variants: [{ name: "", values: "" }] 
  });
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([]);

  // Fetch Products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await apiFetch(`${import.meta.env.VITE_API_URL}/products`);
      return res;
    }
  });

  // Fetch Categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await apiFetch(`${import.meta.env.VITE_API_URL}/categories`);
      return res;
    }
  });

  // Fetch Subcategories filtered by category
  const { data: subcategories = [] } = useQuery({
    queryKey: ['subcategories', formData.category],
    queryFn: async () => {
      if (!formData.category) return [];
      const res = await apiFetch(`${import.meta.env.VITE_API_URL}/subcategories?categoryId=${formData.category}`);
      return res;
    },
    enabled: !!formData.category
  });

  // Reset subcategory when category changes
  useEffect(() => {
    if (!editingProduct) {
       setFormData(prev => ({ ...prev, subCategory: "" }));
    }
  }, [formData.category]);

  const saveMutation = useMutation({
    mutationFn: async ({ id, data }: { id?: string, data: FormData }) => {
      const url = id ? `${import.meta.env.VITE_API_URL}/products/${id}` : `${import.meta.env.VITE_API_URL}/products`;
      const method = id ? 'PUT' : 'POST';
      const res = await apiFetch(url, { method, body: data });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(editingProduct ? "Product updated!" : "Product created!");
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await apiFetch(`${import.meta.env.VITE_API_URL}/products/${id}`, { method: 'DELETE' }); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['products'] }); toast.success("Product deleted"); }
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      category: "",
      subCategory: "",
      imageLink: "",
      featured: false,
      isNew: false,
      imagesLinks: "",
      variants: [{ name: "", values: "" }]
    });
    setMainImageFile(null);
    setGalleryImageFiles([]);
    setIsAdding(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'imageLink') {
        if (!mainImageFile) data.append('image', value as string);
      } else if (key === 'variants') {
        const processed = (value as any[]).filter(v => v.name && v.values);
        data.append('variants', JSON.stringify(processed));
      } else if (key === 'imagesLinks') {
        const links = (value as string).split(',').map(l => l.trim()).filter(Boolean);
        links.forEach(link => data.append('images', link));
      } else if (key === 'sizes' || key === 'colors') {
        const val = (value as string).split(',').map((s: string) => s.trim()).filter(Boolean);
        data.append(key, JSON.stringify(val));
      } else {
        data.append(key, value as string);
      }
    });

    if (mainImageFile) data.append('image', mainImageFile);
    galleryImageFiles.forEach(file => data.append('images', file));

    saveMutation.mutate({ id: editingProduct?._id, data });
  };

  const startEdit = (p: any) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      description: p.description,
      price: p.price.toString(),
      originalPrice: p.originalPrice?.toString() || "",
      category: p.category?._id || p.category || "",
      subCategory: p.subCategory?._id || p.subCategory || "",
      imageLink: p.image || "",
      featured: p.featured || false,
      isNew: p.isNew || false,
      imagesLinks: Array.isArray(p.images) ? p.images.filter((img: any) => typeof img === 'string').join(', ') : '',
      variants: Array.isArray(p.variants) && p.variants.length > 0 
        ? p.variants.filter(Boolean).map((v: any) => ({ name: v.name, values: Array.isArray(v.values) ? v.values.join(', ') : v.values })) 
        : [{ name: "", values: "" }]
    });
    setIsAdding(true);
  };

  if (isLoading) return <Loader2 className="w-8 h-8 animate-spin mx-auto" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Products ({products.length})</h2>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="rounded-full">
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="border-primary/20 bg-slate-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-xl">{editingProduct ? 'Edit' : 'Add'} Product</CardTitle>
            <Button variant="ghost" size="icon" onClick={resetForm}><X className="w-4 h-4" /></Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium uppercase text-muted-foreground">Product Name</label>
                  <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium uppercase text-muted-foreground">Description</label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required className="h-24" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium uppercase text-muted-foreground">Price ($)</label>
                    <Input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium uppercase text-muted-foreground">Original Price ($)</label>
                    <Input type="number" value={formData.originalPrice} onChange={(e) => setFormData({...formData, originalPrice: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-muted-foreground">Category <span className="text-red-500">*</span></label>
                    <Select value={formData.category} onValueChange={(val) => setFormData({...formData, category: val})}>
                      <SelectTrigger className={!formData.category ? "border-amber-200" : ""}>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.filter(Boolean).map((c: any) => (
                          <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-muted-foreground">Sub Category <span className="text-red-500">*</span></label>
                    <Select value={formData.subCategory} onValueChange={(val) => setFormData({...formData, subCategory: val})} disabled={!formData.category || subcategories.length === 0}>
                      <SelectTrigger className={(!formData.subCategory && formData.category) ? "border-amber-200" : ""}>
                        <SelectValue placeholder={formData.category && subcategories.length === 0 ? "No Subs Found" : "Select Sub"} />
                      </SelectTrigger>
                      <SelectContent>
                        {subcategories?.filter(Boolean).map((s: any) => (
                          <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.category && subcategories.length === 0 && (
                      <p className="text-[10px] text-red-500 font-bold mt-1">⚠️ Create a subcategory for this category first.</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase text-muted-foreground">Product Image (Main)</label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input 
                        placeholder="Paste image link" 
                        value={formData.imageLink} 
                        onChange={(e) => setFormData({...formData, imageLink: e.target.value})}
                        disabled={!!mainImageFile}
                      />
                    </div>
                    <div className="shrink-0">
                      <Input type="file" id="prod-img" className="hidden" onChange={(e) => setMainImageFile(e.target.files?.[0] || null)} />
                      <Button type="button" variant="outline" onClick={() => document.getElementById('prod-img')?.click()}>
                        {mainImageFile ? <X className="w-4 h-4 text-red-500" /> : <Upload className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase text-muted-foreground">Gallery Images (Secondary)</label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input 
                        placeholder="Paste gallery links (comma separated)" 
                        value={formData.imagesLinks} 
                        onChange={(e) => setFormData({...formData, imagesLinks: e.target.value})}
                      />
                    </div>
                    <div className="shrink-0">
                      <Input type="file" id="gal-img" className="hidden" multiple onChange={(e) => setGalleryImageFiles(Array.from(e.target.files || []))} />
                      <Button type="button" variant="outline" onClick={() => document.getElementById('gal-img')?.click()}>
                        {galleryImageFiles.length > 0 ? <span className="text-xs font-bold text-primary">{galleryImageFiles.length} Selected</span> : <Plus className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  {galleryImageFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {galleryImageFiles.map((f, i) => (
                        <div key={i} className="relative w-10 h-10 rounded overflow-hidden border">
                          <img src={URL.createObjectURL(f)} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setGalleryImageFiles(galleryImageFiles.filter((_, idx) => idx !== i))} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl">
                            <X className="w-2 h-2" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({...formData, featured: e.target.checked})} className="rounded border-slate-300 text-primary focus:ring-primary" />
                    <span className="text-sm font-medium">Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isNew} onChange={(e) => setFormData({...formData, isNew: e.target.checked})} className="rounded border-slate-300 text-primary focus:ring-primary" />
                    <span className="text-sm font-medium">New Arrival</span>
                  </label>
                </div>

                <div className="space-y-4 pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Product Variants</label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setFormData({...formData, variants: [...formData.variants, { name: "", values: "" }]})}
                      className="h-8 rounded-full text-[10px] font-black uppercase tracking-widest"
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add Variant
                    </Button>
                  </div>
                  
                  {formData.variants.map((v, i) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="md:col-span-4 space-y-1">
                        <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Variant Name</label>
                        <Input 
                          placeholder="e.g. Size, Material" 
                          value={v.name} 
                          onChange={(e) => {
                            const newVariants = [...formData.variants];
                            newVariants[i].name = e.target.value;
                            setFormData({...formData, variants: newVariants});
                          }}
                        />
                      </div>
                      <div className="md:col-span-7 space-y-1">
                        <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Values (comma separated)</label>
                        <Input 
                          placeholder="e.g. Small, Medium, Large" 
                          value={v.values} 
                          onChange={(e) => {
                            const newVariants = [...formData.variants];
                            newVariants[i].values = e.target.value;
                            setFormData({...formData, variants: newVariants});
                          }}
                        />
                      </div>
                      <div className="md:col-span-1">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setFormData({...formData, variants: formData.variants.filter((_, idx) => idx !== i)})}
                          className="text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 pt-4 border-t">
                {/* Validation Helper */}
                {(() => {
                  const isMissingFields = !formData.name || !formData.description || !formData.price || !formData.category || !formData.subCategory || (!formData.imageLink && !mainImageFile);
                  const isSubMissing = formData.category && subcategories.length === 0;
                  
                  return (
                    <Button 
                      type="submit" 
                      className="w-full h-14 rounded-2xl" 
                      disabled={saveMutation.isPending || isMissingFields || isSubMissing}
                    >
                      {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isSubMissing 
                        ? "⚠️ Category has no subcategories" 
                        : isMissingFields 
                          ? "⌛ Please select Category & Subcategory to save" 
                          : (editingProduct ? 'Update Product' : 'Save Product')}
                    </Button>
                  );
                })()}
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="border rounded-xl overflow-hidden bg-white shadow-sm font-body">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category/Sub</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p: any) => (
              <TableRow key={p._id}>
                <TableCell>
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-slate-900">{p.name}</div>
                  {p.featured && <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full uppercase font-bold">Featured</span>}
                </TableCell>
                <TableCell className="text-slate-500 text-xs">
                  <div>{p.category && typeof p.category === 'object' ? p.category.name : 'No Cat'}</div>
                  <div className="opacity-70 italic">{p.subCategory && typeof p.subCategory === 'object' ? p.subCategory.name : 'No Sub'}</div>
                </TableCell>
                <TableCell className="font-semibold">${p.price}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => startEdit(p)}><Pencil className="w-3 h-3" /></Button>
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600" onClick={() => deleteMutation.mutate(p._id)}><Trash2 className="w-3 h-3" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductManager;
