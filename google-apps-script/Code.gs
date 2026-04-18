// ============================================================
// GREEN HOME INDIA - Google Apps Script Backend
// Deploy as Web App: Execute as "Me", Access "Anyone"
// ============================================================

// ---- CONFIGURATION ----
const CONFIG = {
  PRODUCTS_SHEET: "Products",
  ORDERS_SHEET: "Orders",
  
  // Twilio credentials - replace with your actual values
  TWILIO_ACCOUNT_SID: "YOUR_TWILIO_ACCOUNT_SID",
  TWILIO_AUTH_TOKEN: "YOUR_TWILIO_AUTH_TOKEN",
  TWILIO_WHATSAPP_FROM: "whatsapp:+14155238886", // Twilio sandbox number
  OWNER_WHATSAPP: "whatsapp:+91XXXXXXXXXX",      // Owner's WhatsApp number with country code
};

// ---- CORS HEADERS ----
function setCorsHeaders(output) {
  return output
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}

// ---- MAIN ENTRY POINTS ----
function doGet(e) {
  try {
    const action = e.parameter.action || "products";
    
    if (action === "products") {
      return setCorsHeaders(
        ContentService.createTextOutput(
          JSON.stringify(getProducts())
        )
      );
    }
    
    if (action === "product") {
      const id = e.parameter.id;
      return setCorsHeaders(
        ContentService.createTextOutput(
          JSON.stringify(getProductById(id))
        )
      );
    }
    
    return setCorsHeaders(
      ContentService.createTextOutput(
        JSON.stringify({ error: "Unknown action" })
      )
    );
  } catch (err) {
    return setCorsHeaders(
      ContentService.createTextOutput(
        JSON.stringify({ error: err.message })
      )
    );
  }
}

function doPost(e) {
  try {
    // Handle preflight
    if (!e.postData) {
      return setCorsHeaders(
        ContentService.createTextOutput(JSON.stringify({ ok: true }))
      );
    }
    
    const body = JSON.parse(e.postData.contents);
    const action = body.action || "order";
    
    if (action === "order") {
      const result = placeOrder(body);
      return setCorsHeaders(
        ContentService.createTextOutput(JSON.stringify(result))
      );
    }
    
    return setCorsHeaders(
      ContentService.createTextOutput(
        JSON.stringify({ error: "Unknown action" })
      )
    );
  } catch (err) {
    return setCorsHeaders(
      ContentService.createTextOutput(
        JSON.stringify({ error: err.message })
      )
    );
  }
}

// Handle OPTIONS preflight
function doOptions(e) {
  return setCorsHeaders(
    ContentService.createTextOutput("")
  );
}

// ---- GET ALL PRODUCTS ----
function getProducts() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName(CONFIG.PRODUCTS_SHEET);
  
  if (!sheet) throw new Error("Products sheet not found");
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const products = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0]) continue; // skip empty rows
    
    const product = {};
    headers.forEach((header, idx) => {
      product[header.toLowerCase().replace(/ /g, "_")] = row[idx];
    });
    products.push(product);
  }
  
  return { success: true, products };
}

// ---- GET PRODUCT BY ID ----
function getProductById(id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName(CONFIG.PRODUCTS_SHEET);
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      const product = {};
      headers.forEach((header, idx) => {
        product[header.toLowerCase().replace(/ /g, "_")] = data[i][idx];
      });
      return { success: true, product };
    }
  }
  
  return { success: false, error: "Product not found" };
}

// ---- PLACE ORDER ----
function placeOrder(body) {
  const { customer, items, subtotal, delivery, total } = body;
  
  // Validate required fields
  if (!customer || !customer.name || !customer.phone || !customer.address) {
    return { success: false, error: "Missing customer details" };
  }
  if (!items || items.length === 0) {
    return { success: false, error: "Cart is empty" };
  }
  
  // Generate order ID
  const orderId = "GHI-" + new Date().getTime();
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const productsSheet = ss.getSheetByName(CONFIG.PRODUCTS_SHEET);
  const ordersSheet = ss.getSheetByName(CONFIG.ORDERS_SHEET);
  
  // ---- Update stock for each item ----
  const productData = productsSheet.getDataRange().getValues();
  const headers = productData[0];
  const idCol = headers.indexOf("ID");
  const stockCol = headers.indexOf("Stock");
  
  const stockErrors = [];
  
  for (const item of items) {
    let found = false;
    for (let r = 1; r < productData.length; r++) {
      if (String(productData[r][idCol]) === String(item.id)) {
        found = true;
        const currentStock = Number(productData[r][stockCol]);
        if (currentStock < item.qty) {
          stockErrors.push(`${item.name}: only ${currentStock} in stock`);
        }
        break;
      }
    }
    if (!found) {
      stockErrors.push(`Product ${item.id} not found`);
    }
  }
  
  if (stockErrors.length > 0) {
    return { success: false, error: stockErrors.join("; ") };
  }
  
  // Deduct stock
  for (const item of items) {
    for (let r = 1; r < productData.length; r++) {
      if (String(productData[r][idCol]) === String(item.id)) {
        const currentStock = Number(productData[r][stockCol]);
        const newStock = currentStock - item.qty;
        // Row index is r+1 (1-based), col is stockCol+1 (1-based)
        productsSheet.getRange(r + 1, stockCol + 1).setValue(newStock);
        
        // Mark out of stock if needed
        const statusCol = headers.indexOf("Status");
        if (statusCol !== -1 && newStock <= 0) {
          productsSheet.getRange(r + 1, statusCol + 1).setValue("Out of Stock");
        }
        break;
      }
    }
  }
  
  // ---- Save order to Orders sheet ----
  const timestamp = new Date();
  const itemsText = items
    .map(i => `${i.name} x${i.qty} @₹${i.price}`)
    .join(" | ");
  
  ordersSheet.appendRow([
    orderId,
    timestamp,
    customer.name,
    customer.phone,
    customer.address,
    itemsText,
    subtotal,
    delivery,
    total,
    "Pending"
  ]);
  
  // ---- Send WhatsApp notification ----
  try {
    sendWhatsAppNotification(orderId, customer, items, total);
  } catch (err) {
    // Don't fail the order if WhatsApp fails
    Logger.log("WhatsApp error: " + err.message);
  }
  
  return {
    success: true,
    orderId,
    message: "Order placed successfully!"
  };
}

// ---- TWILIO WHATSAPP NOTIFICATION ----
function sendWhatsAppNotification(orderId, customer, items, total) {
  const itemsList = items
    .map(i => `• ${i.name} x${i.qty} = ₹${i.price * i.qty}`)
    .join("\n");
  
  const message =
    `🛍️ *NEW ORDER - GREEN HOME INDIA*\n\n` +
    `*Order ID:* ${orderId}\n` +
    `*Name:* ${customer.name}\n` +
    `*Phone:* ${customer.phone}\n` +
    `*Address:* ${customer.address}\n\n` +
    `*Items:*\n${itemsList}\n\n` +
    `*Total:* ₹${total}\n\n` +
    `_Please process this order._`;
  
  const url = `https://api.twilio.com/2010-04-01/Accounts/${CONFIG.TWILIO_ACCOUNT_SID}/Messages.json`;
  
  const payload = {
    From: CONFIG.TWILIO_WHATSAPP_FROM,
    To: CONFIG.OWNER_WHATSAPP,
    Body: message,
  };
  
  const options = {
    method: "post",
    payload: payload,
    headers: {
      Authorization:
        "Basic " +
        Utilities.base64Encode(
          CONFIG.TWILIO_ACCOUNT_SID + ":" + CONFIG.TWILIO_AUTH_TOKEN
        ),
    },
    muteHttpExceptions: true,
  };
  
  const response = UrlFetchApp.fetch(url, options);
  const responseCode = response.getResponseCode();
  
  if (responseCode !== 201) {
    throw new Error(
      "Twilio error " + responseCode + ": " + response.getContentText()
    );
  }
  
  Logger.log("WhatsApp sent: " + response.getContentText());
}

// ---- SETUP FUNCTION (run once to initialize sheets) ----
function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // ---- Products Sheet ----
  let productsSheet = ss.getSheetByName(CONFIG.PRODUCTS_SHEET);
  if (!productsSheet) {
    productsSheet = ss.insertSheet(CONFIG.PRODUCTS_SHEET);
  }
  
  // Set headers
  const productHeaders = [
    "ID", "Name", "Category", "Price", "MRP",
    "Image", "Description", "Stock", "Brand", "Status"
  ];
  productsSheet.getRange(1, 1, 1, productHeaders.length).setValues([productHeaders]);
  
  // Format header row
  productsSheet.getRange(1, 1, 1, productHeaders.length)
    .setBackground("#1a472a")
    .setFontColor("#ffffff")
    .setFontWeight("bold");
  
  productsSheet.setFrozenRows(1);
  
  // ---- Orders Sheet ----
  let ordersSheet = ss.getSheetByName(CONFIG.ORDERS_SHEET);
  if (!ordersSheet) {
    ordersSheet = ss.insertSheet(CONFIG.ORDERS_SHEET);
  }
  
  const orderHeaders = [
    "Order ID", "Timestamp", "Customer Name", "Phone",
    "Address", "Items", "Subtotal", "Delivery", "Total", "Status"
  ];
  ordersSheet.getRange(1, 1, 1, orderHeaders.length).setValues([orderHeaders]);
  
  ordersSheet.getRange(1, 1, 1, orderHeaders.length)
    .setBackground("#1a472a")
    .setFontColor("#ffffff")
    .setFontWeight("bold");
  
  ordersSheet.setFrozenRows(1);
  
  Logger.log("Sheets initialized successfully!");
  SpreadsheetApp.getUi().alert("✅ Sheets created! Now paste the product data into the Products sheet.");
}
