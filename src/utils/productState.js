function parseStockValue(stock) {
  if (stock === undefined || stock === null || stock === "") {
    return 0;
  }

  const parsed = Number(stock);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function normalizeProduct(product) {
  const stock = parseStockValue(product?.stock);
  const rawStatus = String(product?.status || "").trim().toLowerCase();
  const isOutOfStock = stock <= 0;

  let status = product?.status || "Active";

  if (isOutOfStock) {
    status = "Inactive";
  } else if (!rawStatus || rawStatus === "inactive" || rawStatus === "out of stock") {
    status = "Active";
  }

  return {
    ...product,
    stock,
    status,
    isOutOfStock,
  };
}
