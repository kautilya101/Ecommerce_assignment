import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import type { IProduct } from '../interfaces';
import { Button } from '../components/ui/button';
import { useCart } from '../context/cartContext';
import { Plus } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/products/${id}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Product not found</h3>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square relative overflow-hidden rounded-lg">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-2xl font-bold text-orange-600">${product.price}</p>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600">{product.description}</p>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Availability:</span>
              <span className={`text-sm font-medium ${product.inventory_count > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.inventory_count > 0 ? `In Stock (${product.inventory_count} available)` : 'Out of Stock'}
              </span>
            </div>

            <Button
              onClick={() => addToCart(product)}
              disabled={product.inventory_count === 0}
              className="w-full md:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
