import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, X, ListTree } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiFetch } from "@/utils/api";

const CategoryManager = () => {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);

  // Subcategory management state
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [newSubName, setNewSubName] = useState("");

  // Fetch Categories
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await apiFetch(`${import.meta.env.VITE_API_URL}/categories`);
      return res;
    }
  });

  // Fetch Subcategories
  const { data: allSubcategories = [] } = useQuery({
    queryKey: ['subcategories'],
    queryFn: async () => {
      const res = await apiFetch(`${import.meta.env.VITE_API_URL}/subcategories`);
      return res;
    }
  });

  // Category Mutations
  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await apiFetch(`${import.meta.env.VITE_API_URL}/categories`, { method: 'POST', body: formData });
      return res;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); toast.success("Category created!"); resetForm(); }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string, formData: FormData }) => {
      const res = await apiFetch(`${import.meta.env.VITE_API_URL}/categories/${id}`, { method: 'PUT', body: formData });
      return res;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); toast.success("Category updated!"); resetForm(); }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await apiFetch(`${import.meta.env.VITE_API_URL}/categories/${id}`, { method: 'DELETE' }); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); toast.success("Category deleted"); }
  });

  // Subcategory Mutations
  const createSubMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiFetch(`${import.meta.env.VITE_API_URL}/subcategories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
      toast.success("Subcategory added!");
      setNewSubName("");
    }
  });

  const deleteSubMutation = useMutation({
    mutationFn: async (id: string) => { await apiFetch(`${import.meta.env.VITE_API_URL}/subcategories/${id}`, { method: 'DELETE' }); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['subcategories'] }); toast.success("Subcategory deleted"); }
  });

  const resetForm = () => {
    setName("");
    setImage(null);
    setIsAdding(false);
    setEditingCategory(null);
  };

  const startEdit = (cat: any) => {
    setEditingCategory(cat);
    setName(cat.name);
    setIsAdding(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    if (image) formData.append('image', image);

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory._id, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) return <Loader2 className="w-8 h-8 animate-spin mx-auto" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Categories ({categories.length})</h2>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="rounded-full">
            <Plus className="w-4 h-4 mr-2" /> Add Category
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">{editingCategory ? 'Edit' : 'Add'} Category</CardTitle>
            <Button variant="ghost" size="icon" onClick={resetForm}><X className="w-4 h-4" /></Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2 w-full">
                <label className="text-xs font-medium uppercase text-muted-foreground">Category Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. IT Equipment" required />
              </div>
              <div className="flex-1 space-y-2 w-full">
                <label className="text-xs font-medium uppercase text-muted-foreground">Image</label>
                <Input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} accept="image/*" required={!editingCategory} />
              </div>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingCategory ? 'Update' : 'Save'} Category
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50 font-body">
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Subcategories</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="font-body">
            {categories.map((cat: any) => (
              <TableRow key={cat._id}>
                <TableCell>
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{cat.name}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="rounded-full h-8" onClick={() => setSelectedCategory(cat)}>
                        <ListTree className="w-3 h-3 mr-2" />
                        {allSubcategories.filter((s: any) => (s.parentCategory?._id || s.parentCategory) === cat._id).length} Subcategories
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Manage Subcategories: {cat.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="flex gap-2">
                          <Input 
                            placeholder="New Subcategory name" 
                            value={newSubName} 
                            onChange={(e) => setNewSubName(e.target.value)} 
                          />
                          <Button onClick={() => createSubMutation.mutate({ name: newSubName, parentCategory: cat._id })}>Add</Button>
                        </div>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                          {allSubcategories
                            .filter((s: any) => (s.parentCategory?._id || s.parentCategory) === cat._id)
                            .map((sub: any) => (
                              <div key={sub._id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg group">
                                <span className="text-sm font-medium">{sub.name}</span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => deleteSubMutation.mutate(sub._id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => startEdit(cat)}><Pencil className="w-3 h-3" /></Button>
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600" onClick={() => deleteMutation.mutate(cat._id)}><Trash2 className="w-3 h-3" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CategoryManager;
