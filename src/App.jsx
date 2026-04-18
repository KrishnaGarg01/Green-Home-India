import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import RouteLoader from "./components/RouteLoader.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";

function AppLayout() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("page-enter");
  const [routeLoading, setRouteLoading] = useState(true);

  useEffect(() => {
    const loaderTimer = window.setTimeout(() => {
      setRouteLoading(false);
    }, 2000);

    return () => window.clearTimeout(loaderTimer);
  }, []);

  useEffect(() => {
    if (location.pathname === displayLocation.pathname) {
      setTransitionStage("page-enter");
      return undefined;
    }

    setTransitionStage("page-exit");

    const swapTimer = window.setTimeout(() => {
      setDisplayLocation(location);
      setTransitionStage("page-enter");
    }, 180);

    return () => {
      window.clearTimeout(swapTimer);
    };
  }, [location, displayLocation.pathname]);

  return (
    <>
      <ScrollToTop />
      <RouteLoader active={routeLoading} />
      <div className="app-shell flex min-h-screen flex-col">
        <Navbar />
        <main className={`flex-1 ${transitionStage}`}>
          <Routes location={displayLocation}>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppLayout />
      </CartProvider>
    </BrowserRouter>
  );
}
