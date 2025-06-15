import React, { useState } from 'react'
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Loader2, Plus, Star } from 'lucide-react';
import { Button } from './ui/button';
import type { IProduct } from '../interfaces';
import { useCart } from '../context/cartContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }: { product: IProduct }) => {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    await addToCart(product);
    setLoading(false);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Card 
      className="group hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="aspect-square relative overflow-hidden rounded-t-lg">
        <img
          src={product.image_url || ""}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        {product.inventory_count < 10 && (
          <Badge className="absolute top-2 right-2 bg-red-500">
            Low Stock
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between lg:flex-row flex-col">
          <span className="text-2xl font-bold text-orange-600">${product.price}</span>
          <Button 
            onClick={handleAddToCart}
            disabled={loading || product.inventory_count === 0}
            size="sm"
            className="cursor-pointer"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1" />
                {product.inventory_count === 0 ? "Out of Stock" : "Add to Cart"}
              </  >
            )}
          </Button>
        </div>
        <div className="flex items-center mt-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-500">4.5 (120 reviews)</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;