import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';

import Header from './components/Header';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import AuthPage from './pages/AuthPage';
import AccountPage from './pages/AccountPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import FavoritesPage from './pages/FavoritesPage';
import PromosPage from './pages/PromosPage';
import ReturnsPage from './pages/ReturnsPage';
import ProductPage from './pages/ProductPage';
import AccessibilityPanel from './components/AccessibilityPanel';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <Router>
            <a href="#main-content" className="skip-link">Перейти к основному содержимому</a>
            <AccessibilityPanel />
            <Header />
            <main id="main-content" role="main">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/tracking/:orderId" element={<TrackingPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/promos" element={<PromosPage />} />
                <Route path="/returns" element={<ReturnsPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </main>
            <Footer />
          </Router>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}
export default App;