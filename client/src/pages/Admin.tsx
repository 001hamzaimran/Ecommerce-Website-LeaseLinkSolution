import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PackagePlus, Tags, ShieldCheck, LogOut } from "lucide-react";
import CategoryManager from "@/components/admin/CategoryManager";
import ProductManager from "@/components/admin/ProductManager";

const ADMIN_KEY = "&xBPIJS.8+lBQ2o@";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("adminKey") === ADMIN_KEY
  );
  const [inputKey, setInputKey] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey === ADMIN_KEY) {
      localStorage.setItem("adminKey", ADMIN_KEY);
      setIsAuthenticated(true);
      toast.success("Access Granted! Welcome Admin.");
    } else {
      toast.error("Invalid API Key. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminKey");
    setIsAuthenticated(false);
    toast.info("Logged out successfully.");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-slate-50/50">
        <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-primary animate-in fade-in zoom-in duration-300">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Admin Portal</CardTitle>
            <CardDescription>Please enter your secure API Key to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="••••••••••••••••"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  className="bg-white border-slate-200 text-center text-lg tracking-widest"
                  required
                />
              </div>
              <Button type="submit" className="w-full h-11 text-base font-semibold group font-body">
                Verify Identity
                <ShieldCheck className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 animate-in fade-in duration-500 font-body">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 border-b pb-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 font-display">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage your store inventory and categories.</p>
        </div>
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
        >
          <LogOut className="mr-2 w-4 h-4" />
          Logout
        </Button>
      </div>

      <Tabs defaultValue="products" className="space-y-8">
        <TabsList className="bg-slate-100 p-1 rounded-xl w-fit">
          <TabsTrigger value="products" className="rounded-lg px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <PackagePlus className="w-4 h-4 mr-2" />
            Products
          </TabsTrigger>
          <TabsTrigger value="categories" className="rounded-lg px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Tags className="w-4 h-4 mr-2" />
            Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="animate-in slide-in-from-left-4 duration-300">
          <ProductManager />
        </TabsContent>

        <TabsContent value="categories" className="animate-in slide-in-from-left-4 duration-300">
          <CategoryManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
