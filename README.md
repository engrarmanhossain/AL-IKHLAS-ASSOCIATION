# AL-IKHLAS ASSOCIATION (আল-ইখলাস অ্যাসোসিয়েশন)
## Real-Time Financial &amp; Contribution Intelligence Dashboard

A modern, responsive, real-time executive dashboard built for **AL-IKHLAS ASSOCIATION**. Connected directly to your private Google Spreadsheet via Google Apps Script Web App API with secure token authentication, Multi-Role Access Control, and Extra Deposit Tracking.

---

### 🌟 Key New Features

1. **💰 Extra Deposit Separation**:
   - Accurately detects and separates **Regular Share Capital** (৳ 2,000 / Share) from **Extra Deposits** (Surplus Savings).
   - **Regular Share Capital**: ৳ 2,90,000 across 145 active association shares (121 records).
   - **Extra Deposits**: ৳ 34,000 (18 records across all 10 members).
   - **Grand Total**: ৳ 3,24,000.
   - Dedicated filter: View *All Deposits*, *Regular Shares Only*, or *Extra Deposits Only*.
   - Stacked monthly growth and member ranking charts comparing regular capital vs extra deposits.

2. **🔐 Role-Based Access Control &amp; Authentication**:
   - **Default Admin Account**:
     - **Email / Login**: `armanhossain.eee.info@gmail.com`
     - **Password**: `arman2026**`
     - **Role**: **President (Executive Super Admin)**
   - Pre-configured Association Roles:
     - **President** (Arman Hossain) — Super admin with full authority over users, roles, and financials.
     - **Accountant** (Faisal Mahmud) — Financial admin with approval authority and ledger management.
     - **Secretary** (Zafrul Monir) — Records and administrative management.
     - **Cashier** (Ikhtiar Uddin) — Payment verification and receipt issuance.
     - **General Members** — Secure statement viewing, filtered transactions, and receipt printing.

3. **👤 Member Dashboard &amp; Personal Statement Privacy**:
   - General members see **only** the aggregate Executive Financial Overview (KPIs and association monthly trends) and **their own personal records**.
   - Members cannot view other members' personal cards or contribution totals.
   - Dedicated **My Profile &amp; Statement** tab with:
     - Personal profile card with contact and membership status.
     - 4 financial cards: Regular Share Capital, Extra Deposits, Grand Total Paid, and Clearance Health.
     - Chronological deposit ledger with official print and Excel export options.

4. **✏️ Profile Editing &amp; Strict Password Governance**:
   - **Members**: Can edit their **Full Name** and **Contact Phone Number**.
   - **Password Security**: Members **cannot** change passwords. The password field is completely excluded from the member edit modal.
   - **Admin Only**: Only the **President / Super Admin (Arman Hossain)** has administrative authority to set, change, or reset passwords.

5. **📸 Profile Picture Upload &amp; Custom Avatars**:
   - **Everyone (Members &amp; Admin)** can upload, change, and remove their own **profile picture** directly from their device.
   - **Smart In-Browser Canvas Cropping**: Automatic center-square cropping and high-quality compression keeps images crisp while staying lightweight in browser storage.
   - **Pervasive Display**: Custom avatars appear in the navigation bar, personal profile card, admin directory cards, user management table, and transaction logs (falls back to colored dynamic initials if no photo is uploaded).

6. **👥 User &amp; Role Management Portal (Admin)**:
   - Super admin portal to add new members, assign executive roles (President, Accountant, Secretary, Cashier, Member).
   - Admin password change &amp; credential reset capabilities.

7. **⚡ Real-Time Live Sync &amp; Bridge Diagnostics**:
   - Auto-refreshes every 30 seconds directly from your Google Apps Script endpoint with cache-busting (`_t` timestamp + `cache: no-store`).
   - Syncs fresh records immediately upon member or admin sign-in.
   - Admin Bridge Portal with real-time connection diagnostics (pings endpoint, detects sheet tab name, row count, and latest transaction).
   - Upgraded Multi-Sheet Google Apps Script with automatic sheet &amp; tab detection and combiner (supporting `gid=1874744243`, `gid=1208245608`, `gid=313675577`, and `gid=1702656514`).
   - Instant 0ms cached loading via `localStorage`.

---

### 🚀 How to Run Locally

Double-click:
```
Start-Dashboard.bat
```
Or open [index.html](file:///c:/Users/arman/Downloads/AL-IKHLAS%20ASSOCIATION/index.html) in your browser.

---

### 🌐 Live GitHub Repository &amp; Pages

- **GitHub Repository**: [https://github.com/engrarmanhossain/AL-IKHLAS-ASSOCIATION](https://github.com/engrarmanhossain/AL-IKHLAS-ASSOCIATION)
- **Live Website**: [https://engrarmanhossain.github.io/AL-IKHLAS-ASSOCIATION/](https://engrarmanhossain.github.io/AL-IKHLAS-ASSOCIATION/)
