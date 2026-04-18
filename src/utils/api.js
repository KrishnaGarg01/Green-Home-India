// ============================================================
// API utility - connects React frontend to Google Apps Script
// ============================================================

const API_URL = import.meta.env.VITE_API_URL || "";

// Fallback: use local products JSON when no API URL is configured
const USE_LOCAL_DATA = !API_URL;

// ---- GET REQUEST ----
async function get(params = {}) {
  const url = new URL(API_URL);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString()); // ✅ no headers

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ---- POST REQUEST ----
async function post(body = {}) {
  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(body), // ✅ no headers
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ---- Public API functions ----

export async function fetchProducts() {
  if (USE_LOCAL_DATA) {
    const mod = await import("../data/products.json");
    return { success: true, products: mod.default };
  }

  return get({ action: "products" });
}

export async function fetchProduct(id) {
  if (USE_LOCAL_DATA) {
    const mod = await import("../data/products.json");
    const product = mod.default.find((p) => p.id === id);
    return product
      ? { success: true, product }
      : { success: false, error: "Not found" };
  }

  return get({ action: "product", id });
}

export async function placeOrder(orderData) {
  if (USE_LOCAL_DATA) {
    console.log("Order (local mode):", orderData);
    return {
      success: true,
      orderId: "GHI-" + Date.now(),
      message: "Order placed successfully! (Demo mode)",
    };
  }

  return post({ action: "order", ...orderData });
}