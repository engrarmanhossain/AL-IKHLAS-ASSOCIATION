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

3. **✅ Payment Approval &amp; Pending Management**:
   - **Pending Approvals Queue**: Dedicated queue in the Admin tab for 1-click approvals.
   - **Interactive Ledger Approvals**: Presidents and Accountants can approve pending payments or toggle status directly from the main transaction table.
   - **Record New Deposits**: Admins can record incoming share capital or extra deposits directly into the system.

4. **👥 User &amp; Role Management Portal**:
   - Add new members with assigned roles.
   - Change existing user roles (e.g. promote member to Accountant or President).
   - Remove/deactivate accounts.
   - Persistent role and user storage.

5. **⚡ Real-Time Live Sync**:
   - Auto-refreshes every 30 seconds directly from your Google Apps Script endpoint.
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
