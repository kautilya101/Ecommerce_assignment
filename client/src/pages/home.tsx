import { useEffect, useState } from "react";
import FilterSidebar from "../components/filterSidebar";
import ProductCard from "../components/productCard";
import { mockProducts } from "../../data";
import { Loader2, Search } from "lucide-react";
import type { IProduct } from "../interfaces";


const Home = () => {
  
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    priceRange: [0, 300],
    category: 'All'
  });


  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/products/`,{
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
          }
        });
        const data = await response.json();
        
        setProducts(data.results);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);



  const filteredProducts = products?.filter((product: IProduct) => {
    const matchesSearch = product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         product.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
    
    return matchesSearch && matchesPrice;
  });

  if(!loading && products.length === 0) {
    return (
      (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No products found</h3>
        </div>
      )
    )
  }
  return (
    loading ? 
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 text-gray-400 mx-auto mb-4" /> 
      </div>
      : (
      <div className="flex min-h-screen bg-gray-50">
      <FilterSidebar 
        filters={filters} 
        onFiltersChange={setFilters}
        products={products}
      />
      
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Our Products</h2>
          <p className="text-gray-600">
            Showing {filteredProducts.length} products
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredProducts.length > 0 && filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>)
  );
};

export default Home;