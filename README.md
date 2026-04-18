# 🌿 Green Home India — eCommerce Store

A modern, zero-cost eCommerce website for CCTV accessories, networking equipment, and electronics. Built with React + Vite + Tailwind CSS, powered by Google Sheets as the backend.

---

## ⚡ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite 5 |
| Styling | Tailwind CSS 3 |
| Backend | Google Apps Script |
| Database | Google Sheets |
| Hosting | Cloudflare Pages (free) |
| Notifications | Twilio WhatsApp API |
| Cart Storage | localStorage |

---

## 🗂️ Project Structure

```
green-home-india/
├── public/
│   ├── favicon.svg
│   └── _redirects          ← Cloudflare SPA routing fix
├── src/
│   ├── main.jsx             ← App entry point
│   ├── App.jsx              ← Router + providers
│   ├── index.css            ← Tailwind + custom styles
│   ├── data/
│   │   └── products.json    ← 62 products (fallback / seed data)
│   ├── context/
│   │   └── CartContext.jsx  ← Cart state + localStorage sync
│   ├── hooks/
│   │   └── useProducts.js   ← Data fetching hook
│   ├── utils/
│   │   └── api.js           ← Google Apps Script API layer
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   └── ScrollToTop.jsx
│   └── pages/
│       ├── Home.jsx         ← Product grid + search + filter
│       ├── ProductDetail.jsx
│       ├── Cart.jsx
│       ├── Checkout.jsx
│       └── OrderSuccess.jsx
├── google-apps-script/
│   └── Code.gs              ← Full backend (deploy to Apps Script)
├── .env.example
├── .github/workflows/deploy.yml
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 🚀 Setup Guide (Step by Step)

### Step 1 — Google Sheets Setup

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet.
2. Rename it to: **Green Home India**
3. Go to **Extensions → Apps Script**
4. Delete the default code and paste the contents of `google-apps-script/Code.gs`
5. Save the project (Ctrl+S), name it "GHI Backend"
6. Click **Run → `setupSheets`** (authorize when prompted)
   - This creates two sheets: **Products** and **Orders**
7. In the **Products** sheet, paste your product data starting from Row 2:
   - Use `src/data/products.json` as source
   - Columns: `ID | Name | Category | Price | MRP | Image | Description | Stock | Brand | Status`

### Step 2 — Deploy Google Apps Script

1. In Apps Script editor, click **Deploy → New Deployment**
2. Select type: **Web App**
3. Settings:
   - Description: `GHI API v1`
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy** → copy the web app URL
5. It looks like: `https://script.google.com/macros/s/AKfycb.../exec`

### Step 3 — Configure Frontend

```bash
# 1. Clone / download the project
cd green-home-india

# 2. Copy environment file
cp .env.example .env

# 3. Edit .env and paste your Apps Script URL
# VITE_API_URL=https://script.google.com/macros/s/YOUR_ID/exec

# 4. Install dependencies
npm install

# 5. Run locally
npm run dev
```

### Step 4 — Twilio WhatsApp Setup

1. Sign up free at [twilio.com](https://www.twilio.com/try-twilio)
2. In the Console, note your:
   - **Account SID** (starts with `AC`)
   - **Auth Token**
3. Go to **Messaging → Try it out → Send a WhatsApp message**
4. From the **owner's phone**, send the join command to `+14155238886`
5. In `google-apps-script/Code.gs`, update the CONFIG block:
   ```javascript
   TWILIO_ACCOUNT_SID: "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
   TWILIO_AUTH_TOKEN: "your_auth_token",
   TWILIO_WHATSAPP_FROM: "whatsapp:+14155238886",
   OWNER_WHATSAPP: "whatsapp:+91XXXXXXXXXX",
   ```
6. Re-deploy the Apps Script (New Deployment or Manage Deployments → update)

> **For production:** Apply for a [Twilio WhatsApp sender](https://www.twilio.com/whatsapp) to get a dedicated number.

### Step 5 — Deploy to Cloudflare Pages (Free)

#### Option A: GitHub + Auto Deploy
```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/green-home-india.git
git push -u origin main
```

Then in Cloudflare Dashboard:
1. Go to **Pages → Create a project → Connect to Git**
2. Select your repository
3. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Environment variables:
   - `VITE_API_URL` = your Apps Script URL
5. Click **Save and Deploy**

#### Option B: Direct Upload
```bash
npm run build
# Upload the /dist folder at dash.cloudflare.com/pages
```

### Step 6 — Custom Domain (Optional)

In Cloudflare Pages → Your project → **Custom domains**:
1. Enter your domain (e.g., `shop.greenhomeindia.in`)
2. Add the CNAME record shown in Cloudflare DNS
3. SSL is automatic and free

---

## 📊 Google Sheets Column Reference

### Products Sheet
| Column | Type | Example |
|--------|------|---------|
| ID | Text | P001 |
| Name | Text | BNC Connector |
| Category | Text | Connectors & Jointers |
| Price | Number | 25 |
| MRP | Number | 49 |
| Image | URL | https://cdn.store.link/... |
| Description | Text | Standard BNC connector... |
| Stock | Number | 500 |
| Brand | Text | GREEN HOME INDIA |
| Status | Text | Active / Out of Stock |

### Orders Sheet (auto-filled)
| Column | Type |
|--------|------|
| Order ID | GHI-1234567890 |
| Timestamp | Date/Time |
| Customer Name | Text |
| Phone | Number |
| Address | Text |
| Items | Text (pipe-separated) |
| Subtotal | Number |
| Delivery | Number |
| Total | Number |
| Status | Pending / Dispatched / Delivered |

---

## 🛒 Features

- **62 products** across 12 categories, extracted from original store
- **Search** by name, category, brand, description
- **Category filter** with product counts
- **Add to cart** with quantity controls
- **localStorage** persistence — cart survives page refresh
- **Stock management** — auto-deducts on order, shows "Out of Stock"
- **COD checkout** with name, phone, address, delivery charge
- **Order ID** generated using timestamp format `GHI-XXXXXXXXXX`
- **WhatsApp notification** to owner on every new order
- **Fully responsive** — mobile-first design
- **Skeleton loading** — no layout shift during data fetch
- **Zero cost** — no servers, no databases, no paid services

---

## 🔧 Updating Products

Simply edit the **Products** Google Sheet:
- Change price → reflected on site immediately
- Set stock to 0 → product shows "Out of Stock"
- Add new row → new product appears on site
- Change Status to "Out of Stock" → product disabled

No code changes or redeployment needed.

---

## 📞 Support

For any setup issues, contact the developer or refer to:
- [Google Apps Script docs](https://developers.google.com/apps-script)
- [Cloudflare Pages docs](https://developers.cloudflare.com/pages)
- [Twilio WhatsApp docs](https://www.twilio.com/docs/whatsapp)
