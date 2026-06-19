# Project Context: Frontend

## Tech Stack Overview
- **Core**: React v19, TypeScript, Vite
- **Routing**: React Router v7
- **Styling & UI**: Tailwind CSS v4, Radix UI Primitives, Lucide React (Shadcn UI architecture)
- **Local Data Storage**: Dexie (IndexedDB)
- **Data Viz & Maps**: Recharts, Leaflet (React-Leaflet)
- **Utilities**: date-fns (waktu), exceljs & file-saver (export file), sonner (toast notification)

## Pages & Features

Based on the `frontend/src/pages` directory structure, here is the list of main pages and their functionalities:

### 1. Dashboard
* **Dashboard** (`/dashboard`):
  - **Features**: Displays business metrics overview, quick navigation to start a journey, and opens invoice details.
  - **Data Displayed**: 7-day revenue margin, total visits chart, today's visit history (store name, amount, debt status).

### 2. Journey
* **Journey** (`/journey`):
  - **Features**: Interactive maps with GPS auto-detection for routing, swipeable store carousel, quick "Open Maps" and "Visit" actions.
  - **Data Displayed**: Map markers, store distance from user, active debt, consigned asset value, days since last visit.

### 3. Products
* **Product List** (`/products`):
  - **Features**: Search by name, filtering (category, stock level, archive status), pagination, archive confirmation, navigate to details.
  - **Data Displayed**: Product name, category, warehouse stock, returned stock, and pricing details.
* **Product Detail** (`/products/:id`):
  - **Features**: Correct warehouse stock, add new stock, process returned goods, restore archived products, navigate to edit form.
  - **Data Displayed**: Identity, pricing (cost, wholesale, retail), warehouse stock, returned stock, 30-day activity logs (restock, consigned, correction, return, disposal).
* **Product Form** (`/products/new`, `/products/:id/edit`):
  - **Features**: Create new product, update existing product, archive product.
  - **Data Inputs**: Name, category, description, cost price, wholesale price, retail price.

### 4. Stores
* **Store List** (`/stores`):
  - **Features**: Search by name, filtering (category, operational status, overdue visits, sort by date, archive status), pagination, quick "Open Maps" and "Visit" actions on cards.
  - **Data Displayed**: Store name, status (debt/paid), last visit date, outstanding debt, active consigned items value, address.
* **Store Detail** (`/stores/:id`):
  - **Features**: Start a store visit, open in Google Maps, navigate to edit form, restore archived store, toggle tabs (consigned items vs invoice history), and open invoice details modal.
  - **Data Displayed**: Contact info, address, map location, total debt, total asset value, active consigned products list, 10 latest visit invoices.
* **Store Form** (`/stores/new`, `/stores/:id/edit`):
  - **Features**: Create or edit store, auto-detect GPS location, validation for duplicate name/phone, archive store.
  - **Data Inputs**: Store name, owner/PIC name, phone, category, address, notes, latitude, longitude.
* **Store Visit** (`/stores/:id/visit`):
  - **Features**: 3-step visit wizard (Opname -> Restock -> Checkout), duplicate visit validation warning, auto-calculates debts and remaining items.
  - **Data Inputs**: Sold quantity, returned/damaged quantity, newly restocked items/quantities, amount paid.

### 5. Finance
* **Finance Page** (`/finance`):
  - **Features**: Financial reporting with 3 tabs (Income, Receivables, Assets), interactive area chart, navigate to store details, and show invoice modals.
  - **Data Displayed**: 30-day margin summary, total receivables, total active assets, list of 30-day cash payments, list of store debts, and list of store asset values.

### 6. Settings
* **Settings Page** (`/settings`):
  - **Features**: Configure product/store settings (stock thresholds, overdue limits, dynamic category labels), and offline data management (backup/restore JSON, reset settings, wipe entire database).
  - **Data Displayed**: Accordion inputs for settings, backup/restore action buttons, and strict confirmation modals for wiping the database (requires typing exact phrase to confirm).

### 7. Misc
* **Not Found** (`/*`):
  - **Features**: Fallback 404 page for unmatched routes.

---

# Project Context: Mobile (React Native)

## Tech Stack Overview
- **Core**: React Native, Expo (Expo Router for file-based routing)
- **Styling**: NativeWind v4 (Tailwind CSS for React Native)
- **UI Components**: Custom UI primitives (built from scratch, 1:1 with Web Shadcn UI), Lucide React Native for icons
- **State Management**: TanStack Query (server state & API caching) and Zustand (global client state)
- **Forms & Validation**: React Hook Form with Zod schema validation
- **Local Data Storage**: Expo SQLite + Drizzle ORM (relational data) and MMKV (fast key-value store)

## Pages & Features

### 1. Dashboard
* **Dashboard** (`/`):
  - **Features**: Displays greeting, alerts for overdue stores and critical stock (out of stock/low stock), navigation to  journey, visit trends chart, and recent visit history. Quick navigation to store details, product details, and visit invoice.
  - **Data Displayed**: Overdue stores list (name, relative last visit date), critical stock list (name, stock status/quantity), 7-day total visits chart, 7-day recent history (time, store name, restocked items summary).

### 2. Products
* **Product List** (`/product-list`):
  - **Features**: Search by name, filtering (category, stock level, archive status), infinite scrolling, navigate to details.
  - **Data Displayed**: Product name, product description, category, warehouse stock, and returned stock via `ItemCard`.
* **Product Detail** (`/product-detail`):
  - **Features**: Correct warehouse stock, add new stock, process returned goods, restore archived products, navigate to edit form.
  - **Data Displayed**: Identity, pricing (cost, wholesale, retail), warehouse stock, returned stock, activity logs (filter by: Consigned, Pull Return, Process Return, Restock, Dispose, Correction).
* **Product Form** (`/product-form`):
  - **Features**: Create new product, update existing product, archive product.
  - **Data Inputs**: Name, category, description, cost price, wholesale price, retail price.

### 3. Stores
* **Store List** (`/store-list`):
  - **Features**: Search by name, filtering (category, status, overdue, sort, archive), infinite scrolling, quick "Open Maps" and "Visit" actions on cards.
  - **Data Displayed**: Store name, store owner, contact info, status (debt/paid), last visit date, outstanding debt, active consigned items value, address via `ItemCard`.
* **Store Detail** (`/store-detail`):
  - **Features**: Start a store visit, open in maps, navigate to edit form, toggle tabs (consigned items vs invoice history).
  - **Data Displayed**: Contact info, address, total debt, total asset value, active consigned products list, latest visit invoices history.
* **Store Form** (`/store-form`):
  - **Features**: Create new store, update existing store, auto-detect location via interactive map picker.
  - **Data Inputs**: Store name, owner/PIC name, phone, category, address, notes, latitude, longitude.
* **Store Visit** (`/store-visit`):
  - **Features**: 3-step visit wizard (Opname -> Restock -> Checkout), auto-calculates debts and remaining items, prevents checkout if no items.
  - **Data Inputs**: Sold quantity, returned/damaged quantity, newly restocked items/quantities, amount paid.
* **Visit Invoice** (`/visit-invoice`):
  - **Features**: View visit receipt, mock print to bluetooth printer, send receipt via WhatsApp to store or own number.
  - **Data Displayed**: Business name, invoice number, date, store name, sold items details, subtotal, old debt, total bill, paid amount, remaining debt, active consigned stock.

### 4. Journey
* **Journey** (`/journey`):
  - **Features**: Full-screen interactive map with dynamic GPS tracking to view all overdue stores, interactive markers with bottom sheet details, and quick "Open Maps" and "Visit" actions.
  - **Data Displayed**: Map markers, calculated distance from user, store name, days since last visit, address, active debt, and consigned asset value.

### 5. Settings
* **Settings** (`/settings`):
  - **Features**: App preferences configuration, database management (Export to Excel, Import from Excel, Reset), and typed confirmation for destructive actions.
  - **Data Inputs**: Low stock threshold, overdue days limit, custom category labels (product & store).

### 6. Finance
* **Finance** (`/finance`):
  - **Features**: 3-tab navigation (Income, Receivables, Assets), custom date range picker and presets (7d, 1m, 3m) for income, margin area chart (`react-native-gifted-charts`), aggregated summaries, and quick navigation to invoices or store details.
  - **Data Displayed**: Total margin, total active debt, total consigned assets, store counts, and list views of cash payments, active bills, and consigned items.
