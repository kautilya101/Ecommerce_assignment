import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import { AuthProvider, useAuth } from "./context/authContext";
import { CartProvider } from "./context/cartContext";
import Home from "./pages/home";
import LoginPage from "./pages/login";
import ProductDetail from "./pages/product-detail";
import Orders from "./pages/orders";

const AppContent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />;
  }
  
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} onLogout={logout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/orders/:id" element={<Orders />} />
        </Routes>
      </div>
    </CartProvider>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;