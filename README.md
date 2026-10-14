# AL-IKHLAS ASSOCIATION (আল-ইখলাস অ্যাসোসিয়েশন)
## Real-Time Financial &amp; Contribution Intelligence Dashboard

A modern, responsive, real-time executive dashboard built for **AL-IKHLAS ASSOCIATION**. Connected securely to your private Google Spreadsheet via Google Apps Script Web App API with token authentication.

---

### 🌟 Key Features

1. **⚡ Real-Time Live Sync Engine**:
   - Fetches live updates directly from your Google Sheet endpoint.
   - Live status indicator: `🟢 Live Synced` with last sync timestamp.
   - Configurable auto-refresh (15s, 30s, 1m, 5m, or Paused).
   - Instant "Refresh" button.
   - Offline &amp; instant-load cache using `localStorage`.

2. **📊 Executive KPI Metrics**:
   - **Total Funds Collected**: Aggregate total in Bangladeshi Taka (৳ BDT) with Received vs Pending breakdown.
   - **Total Active Shares**: Real-time count of total member shares (৳ 2,000 / Share).
   - **Registered Members**: Total active participating members.
   - **Deposit Transactions**: Total recorded payment slips.
   - **Collection Performance Rate**: Percentage of verified received payments.

3. **📈 Visual Analytics &amp; Charts (Chart.js)**:
   - **Monthly Collection &amp; Growth Trend**: Bar chart of received vs pending contributions per month, alongside a cumulative fund progression line.
   - **Share Ratio by Member**: Interactive doughnut chart showing percentage ownership of association shares.
   - **Total Contribution Ranking**: Horizontal bar chart comparing cumulative contributions by member.
   - **Deposit Instruments &amp; Methods**: Breakdown of Deposit Slip Books vs Bank/Digital Transfers.

4. **👥 Member Directory &amp; Statements**:
   - Member profile cards with individual totals, shares, deposit count, and payment status badges.
   - One-click **WhatsApp Direct Chat** and **Phone Dialer**.
   - **Official Member Statement &amp; Receipt Modal**:
     - View complete deposit history for any member.
     - Formatted for print/PDF with official association letterhead, signature lines for President, Cashier, and Member.

5. **📋 Interactive Transaction Ledger**:
   - Search across Member Name, Phone Number, Member ID, TRX ID, and Date.
   - Filter by specific Member, Month Period, or Status (Received / Pending).
   - Clickable column sorting (Date, Name, Amount, Shares, Status).
   - Pagination controls (15, 25, 50, 100, or All records per page).
   - One-click copy for Transaction Reference / Slip numbers.
   - **Export to Excel (.xlsx / .csv)** powered by SheetJS.
   - **Official Print / PDF Report**: Clean print styling hiding navigation buttons for meetings.

6. **🎨 Customization &amp; Design**:
   - Emerald Green &amp; Gold palette honoring Islamic aesthetic tradition.
   - Dark Mode / Light Mode toggle with persistence.
   - Fully responsive for mobile phones, tablets, laptops, and smart TVs.

---

### 🚀 How to Run the Dashboard

#### Method 1: Double-Click Launcher (Easiest)
Simply double-click the included file:
```
Start-Dashboard.bat
```
This automatically starts the local server and opens the dashboard in your default browser at `http://localhost:8080`.

#### Method 2: Direct Browser Open
Double-click `index.html` to open it directly in Google Chrome, Microsoft Edge, or Firefox.

#### Method 3: Python Server (Command Line)
```bash
python server.py
```

---

### 🌐 How to Host Online for Free (For All Members to Access)

Because the dashboard is built with pure client-side web technologies and talks securely to your Google Apps Script endpoint, you can host it 100% free on:

#### Option A: GitHub Pages
1. Push this folder to a GitHub repository.
2. In your repo, go to **Settings > Pages**.
3. Under "Branch", select `main` and `/ (root)`, then click **Save**.
4. Your dashboard will be live at `https://your-username.github.io/your-repo-name/`.

#### Option B: Netlify or Vercel
1. Drag and drop the folder into [Netlify Drop](https://app.netlify.com/drop).
2. Get an instant live HTTPS link in under 10 seconds!

---

### ⚙️ Google Apps Script Endpoint Configuration

- **Web App URL**: `https://script.google.com/macros/s/AKfycbz1GPChdZgMZgcpRU2xEGdy3hJs06LgkvX1ITtoOj4JYRwZ4Xl5XM0KpaV9J2Kbuq5X/exec`
- **Authentication Token**: `AlIkhlasSecure2024!`

To change or update your endpoint or token at any time, click the **"Config"** button in the dashboard top navigation bar.

---

### 📁 Project Structure

```
AL-IKHLAS ASSOCIATION/
├── index.html            # Main dashboard user interface & modals
├── app.js                # Real-time data sync, metrics, charts & filters
├── styles.css            # Custom theme styles, animations & print layout
├── server.py             # Optional local Python web server
├── Start-Dashboard.bat   # Windows 1-click launcher
└── README.md             # Documentation & instructions
```
