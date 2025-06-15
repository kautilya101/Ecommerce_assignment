import { Loader2, Minus, Plus, ShoppingCart, X } from "lucide-react";
import { SheetHeader, SheetTitle } from "../components/ui/sheet";
import { Button } from "../components/ui/button";
import { useCart } from "../context/cartContext";
import { useState } from "react";


const CartSidebar = () => {
  const { cartItems, updateQuantity, removeFromCart, checkout } = useCart();
  const [loading, setLoading] = useState(false);
  const handleOrderCheckout = async() => {
    try{
      setLoading(true);
      const response = await checkout();
      setLoading(false);
      if(response.success){
        window.location.href = response.data.payment_url;
      }
    }catch(error){
      console.error('Failed to checkout:', error);
    }finally{
      setLoading(false);
    }
  }

  const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  if (cartItems.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <SheetHeader>
        <SheetTitle>Your Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</SheetTitle>
      </SheetHeader>
      
      <div className="flex-1 overflow-y-auto py-4">
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
              <img
                src={item?.product.image_url}
                alt={item?.product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-medium text-sm">{item?.product.name}</h4>
                <p className="text-orange-600 font-semibold">${item?.product.price}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                    disabled={loading}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                    {item.quantity}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={loading}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFromCart(item.id)}
                    disabled={loading}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-2xl font-bold text-orange-600">${total.toFixed(2)}</span>
        </div>
        <Button className="w-full cursor-pointer" size="lg" onClick={handleOrderCheckout} disabled={loading}>
          {loading ? 
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> 
            <span>Processing...</span>
          </div>
          : 'Proceed to Checkout'}
        </Button>
      </div>
    </div>
  );
};

export default CartSidebar;