/**
 * AL-IKHLAS ASSOCIATION - Real-Time Dashboard Engine
 * Multi-Role Access Control (President, Accountant, Member)
 * Real-Time Google Spreadsheet Bridge & Extra Deposit Separation
 */

// Global Configuration
const CONFIG = {
  DEFAULT_API_URL: 'https://script.google.com/macros/s/AKfycbz1GPChdZgMZgcpRU2xEGdy3hJs06LgkvX1ITtoOj4JYRwZ4Xl5XM0KpaV9J2Kbuq5X/exec',
  DEFAULT_TOKEN: 'AlIkhlasSecure2024!',
  STORAGE_KEY_SETTINGS: 'al_ikhlas_settings_v1',
  STORAGE_KEY_CACHE: 'al_ikhlas_data_cache_v1',
  STORAGE_KEY_AUTH: 'al_ikhlas_current_user_v2',
  STORAGE_KEY_USERS: 'al_ikhlas_users_list_v2',
  STORAGE_KEY_OVERRIDES: 'al_ikhlas_status_overrides_v2',
  STORAGE_KEY_NEW_TXS: 'al_ikhlas_custom_txs_v2',
  STORAGE_KEY_LOGO: 'al_ikhlas_association_logo_v1',
  STORAGE_KEY_SCHEDULE: 'al_ikhlas_share_schedule_v1',
  STORAGE_KEY_BANK: 'al_ikhlas_bank_details_v1',
};

// 11-Year Official Financial Year Share & Extra Schedule (2025-2026 to 2035-2036)
const DEFAULT_SHARE_SCHEDULE = [
  { year: '2025-2026', shareValue: 2000.00, extraPerShare: 5000.00, notes: 'Initial Term Capital' },
  { year: '2026-2027', shareValue: '', extraPerShare: '', notes: '' },
  { year: '2027-2028', shareValue: '', extraPerShare: '', notes: '' },
  { year: '2028-2029', shareValue: '', extraPerShare: '', notes: '' },
  { year: '2029-2030', shareValue: '', extraPerShare: '', notes: '' },
  { year: '2030-2031', shareValue: '', extraPerShare: '', notes: '' },
  { year: '2031-2032', shareValue: '', extraPerShare: '', notes: '' },
  { year: '2032-2033', shareValue: '', extraPerShare: '', notes: '' },
  { year: '2033-2034', shareValue: '', extraPerShare: '', notes: '' },
  { year: '2034-2035', shareValue: '', extraPerShare: '', notes: '' },
  { year: '2035-2036', shareValue: '', extraPerShare: '', notes: '' }
];

// Official Association Mutual Trust Bank PLC (MTB) Details
const DEFAULT_BANK_DETAILS = {
  bankName: 'Mutual Trust Bank PLC',
  shortName: 'MTB',
  accountName: 'AL-IKHLAS ASSOCIATION',
  accountNumber: '999101000351',
  routingNumber: '145260123',
  branch: 'Dhanmondi Branch, Dhaka',
  accountType: 'Current / Association Account',
  swiftCode: 'MTBLBDDH',
  instructions: 'Deposits can be made via MTB Branch Slips, BEFTN, NPSB, RTGS, or Internet Banking. Please mention your Full Name & Month in deposit remarks.',
  liquidBalance: 20562.41,
  updatedAt: '15 Oct 2026',
  updatedBy: 'Admin / President'
};

// Official Bank Debited List & Balance After Ledger (Synced with Google Sheet gid=1208245608)
const DEFAULT_BANK_LEDGER = [
  {
    dateFormatted: '20-Oct-2025',
    date: new Date('2025-10-20'),
    cause: 'Account maintenance',
    type: 'Debit',
    amount: 172.50,
    rest: 24327.50,
    balanceAfter: 24327.50,
    message: 'Assalamu Alaikum.Your A/C 999***0351 has been debited by BDT 172.50 on 20-OCT-25, 03:33:04 PM.Available balance BDT 24,327.50. MTB Hotline 16219'
  },
  {
    dateFormatted: '31-Dec-2025',
    date: new Date('2025-12-31'),
    cause: 'Account maintenance',
    type: 'Debit',
    amount: 11.33,
    rest: 72391.68,
    balanceAfter: 72391.68,
    message: 'Assalamu Alaikum.Your A/C 999***0351 has been debited by BDT 11.33 on 31-DEC-25, 08:00:39 PM.Available balance BDT 72,391.68. MTB Hotline 16219'
  },
  {
    dateFormatted: '31-Dec-2025',
    date: new Date('2025-12-31'),
    cause: 'Interest (Maybe)',
    type: 'Credit',
    amount: 75.51,
    rest: 72403.01,
    balanceAfter: 72403.01,
    message: 'Assalamu Alaikum.Your A/C 999***0351 has been credited by BDT 75.51 on 31-DEC-25, 08:00:39 PM.Available balance BDT 72,403.01. MTB Hotline 16219'
  },
  {
    dateFormatted: '31-Dec-2025',
    date: new Date('2025-12-31'),
    cause: 'Account maintenance',
    type: 'Debit',
    amount: 200.00,
    rest: 72191.68,
    balanceAfter: 72191.68,
    message: 'Assalamu Alaikum.Your A/C 999***0351 has been debited by BDT 200.00 on 31-DEC-25, 08:20:36 PM.Available balance BDT 72,191.68. MTB Hotline 16219'
  },
  {
    dateFormatted: '31-Dec-2025',
    date: new Date('2025-12-31'),
    cause: 'Account maintenance',
    type: 'Debit',
    amount: 30.00,
    rest: 72161.68,
    balanceAfter: 72161.68,
    message: 'Assalamu Alaikum.Your A/C 999***0351 has been debited by BDT 30.00 on 31-DEC-25, 08:20:36 PM.Available balance BDT 72,161.68. MTB Hotline 16219'
  },
  {
    dateFormatted: '01-Jul-2026',
    date: new Date('2026-07-01'),
    cause: 'Interest (Maybe)',
    type: 'Credit',
    amount: 811.92,
    rest: 214973.60,
    balanceAfter: 214973.60,
    message: 'Assalamu Alaikum. Your A/C 999***0351 has been credited by BDT 811.92 on 01-JUL-26, 07:46:06 AM.Available balance BDT 214,973.60. MTB Hotline 16219'
  },
  {
    dateFormatted: '01-Jul-2026',
    date: new Date('2026-07-01'),
    cause: 'Account maintenance',
    type: 'Debit',
    amount: 81.19,
    rest: 214892.41,
    balanceAfter: 214892.41,
    message: 'Assalamu Alaikum.Your A/C 999***0351 has been debited by BDT 81.19 on 01-JUL-26, 07:46:06 AM.Available balance BDT 214,892.41. MTB Hotline 16219'
  },
  {
    dateFormatted: '01-Jul-2026',
    date: new Date('2026-07-01'),
    cause: 'Account maintenance',
    type: 'Debit',
    amount: 200.00,
    rest: 214692.41,
    balanceAfter: 214692.41,
    message: 'Assalamu Alaikum.Your A/C 999***0351 has been debited by BDT 200.00 on 01-JUL-26, 08:21:58 AM.Available balance BDT 214,692.41. MTB Hotline 16219'
  },
  {
    dateFormatted: '01-Jul-2026',
    date: new Date('2026-07-01'),
    cause: 'Account maintenance',
    type: 'Debit',
    amount: 30.00,
    rest: 214662.41,
    balanceAfter: 214662.41,
    message: 'Assalamu Alaikum.Your A/C 999***0351 has been debited by BDT 30.00 on 01-JUL-26, 08:21:58 AM.Available balance BDT 214,662.41. MTB Hotline 16219'
  },
  {
    dateFormatted: '27-Jul-2026',
    date: new Date('2026-07-27'),
    cause: 'withdraw for investment',
    type: 'Withdraw',
    amount: 250000.00,
    rest: 662.41,
    balanceAfter: 662.41,
    message: 'Assalamu Alaikum.Your A/C 999101****351 has been debited by BDT 250,000.00 on 27-JUL-26, 02:17:44 PM.Available balance BDT 662.41. MTB Hotline 16219'
  },
  {
    dateFormatted: '27-Jul-2026',
    date: new Date('2026-07-27'),
    cause: 'Service Charge',
    type: 'Debit',
    amount: 100.00,
    rest: 562.41,
    balanceAfter: 562.41,
    message: 'Assalamu Alaikum.Your A/C 999101****351 has been debited by BDT 100.00 on 27-JUL-26, 02:17:44 PM.Available balance BDT 562.41. MTB Hotline 16219'
  },
  {
    dateFormatted: '07-Sep-2026',
    date: new Date('2026-09-07'),
    cause: 'withdraw for investment',
    type: 'Withdraw',
    amount: 50000.00,
    rest: 562.41,
    balanceAfter: 562.41,
    message: 'Assalamu Alaikum.Your A/C 999101****351 has been debited by BDT 50,000.00 on 07-SEP-26, 06:42:21 PM.Available balance BDT 562.41. MTB Hotline 16219'
  }
];

// Initial Default Users & Roles
const DEFAULT_USERS = [
  {
    id: 'u1',
    name: 'Arman Hossain',
    sheetName: 'Arman Hossain',
    email: 'armanhossain.eee.info@gmail.com',
    password: 'arman2026**',
    phone: '01724472229',
    role: 'President', // Super Admin
    avatar: null,
    nid: '19921234567890123',
    nomineeName: 'Designated Nominee',
    nomineeNid: '19951234567890124',
    nomineeRelation: 'Spouse',
    membershipFrom: '2025-2026',
    membershipTo: '2035-2036',
    assignedShares: 15,
  },
  {
    id: 'u2',
    name: 'Faisal mahmud',
    sheetName: 'Faisal mahmud',
    email: 'faisal@alikhlas.org',
    password: 'member2026',
    phone: '01628435701',
    role: 'Accountant', // Financial Admin
    avatar: null,
    nid: '19932678901234567',
    nomineeName: 'Designated Nominee',
    nomineeNid: '19962678901234568',
    nomineeRelation: 'Mother',
    membershipFrom: '2025-2026',
    membershipTo: '2035-2036',
    assignedShares: 15,
  },
  {
    id: 'u3',
    name: 'Zafrul monir',
    sheetName: 'Zafrul monir',
    email: 'zafrul@alikhlas.org',
    password: 'member2026',
    phone: '01846329066',
    role: 'Secretary',
    avatar: null,
    nid: '19913456789012345',
    nomineeName: 'Designated Nominee',
    nomineeNid: '19943456789012346',
    nomineeRelation: 'Spouse',
    membershipFrom: '2025-2026',
    membershipTo: '2035-2036',
    assignedShares: 15,
  },
  {
    id: 'u4',
    name: 'Ikhtiar Uddin',
    sheetName: 'Ikhtiar Uddin',
    email: 'ikhtiar@alikhlas.org',
    password: 'member2026',
    phone: '01600102219',
    role: 'Cashier',
    avatar: null,
    nid: '19904567890123456',
    nomineeName: 'Designated Nominee',
    nomineeNid: '19934567890123457',
    nomineeRelation: 'Brother',
    membershipFrom: '2025-2026',
    membershipTo: '2035-2036',
    assignedShares: 15,
  },
  {
    id: 'u5',
    name: 'Mosheur Rahman',
    sheetName: 'Mosheur Rahman',
    email: 'mosheur@alikhlas.org',
    password: 'member2026',
    phone: '01882812309',
    role: 'Member',
    avatar: null,
    nid: '19945678901234567',
    nomineeName: 'Designated Nominee',
    nomineeNid: '19975678901234568',
    nomineeRelation: 'Father',
    membershipFrom: '2025-2026',
    membershipTo: '2035-2036',
    assignedShares: 15,
  },
  {
    id: 'u6',
    name: 'Imam Hossan Masum',
    sheetName: 'Imam Hossan Masum',
    email: 'imam@alikhlas.org',
    password: 'member2026',
    phone: '01616780307',
    role: 'Member',
    avatar: null,
    nid: '19926789012345678',
    nomineeName: 'Designated Nominee',
    nomineeNid: '19956789012345679',
    nomineeRelation: 'Mother',
    membershipFrom: '2025-2026',
    membershipTo: '2035-2036',
    assignedShares: 15,
  },
  {
    id: 'u7',
    name: 'Soleman Hossen',
    sheetName: 'Soleman Hossen',
    email: 'soleman@alikhlas.org',
    password: 'member2026',
    phone: '01864996234',
    role: 'Member',
    avatar: null,
    nid: '19937890123456789',
    nomineeName: 'Designated Nominee',
    nomineeNid: '19967890123456780',
    nomineeRelation: 'Spouse',
    membershipFrom: '2025-2026',
    membershipTo: '2035-2036',
    assignedShares: 15,
  },
  {
    id: 'u8',
    name: 'Tanvir Hasan',
    sheetName: 'Tanvir Hasan',
    email: 'tanvir@alikhlas.org',
    password: 'member2026',
    phone: '01571771318',
    role: 'Member',
    avatar: null,
    nid: '19958901234567890',
    nomineeName: 'Designated Nominee',
    nomineeNid: '19988901234567891',
    nomineeRelation: 'Father',
    membershipFrom: '2025-2026',
    membershipTo: '2035-2036',
    assignedShares: 15,
  },
  {
    id: 'u9',
    name: 'Md Mamun',
    sheetName: 'Md Mamun',
    email: 'mamun@alikhlas.org',
    password: 'member2026',
    phone: '01712327821',
    role: 'Member',
    avatar: null,
    nid: '19919012345678901',
    nomineeName: 'Designated Nominee',
    nomineeNid: '19949012345678902',
    nomineeRelation: 'Spouse',
    membershipFrom: '2025-2026',
    membershipTo: '2035-2036',
    assignedShares: 15,
  },
  {
    id: 'u10',
    name: 'Tarek',
    sheetName: 'Tarek',
    email: 'tarek@alikhlas.org',
    password: 'member2026',
    phone: '01845834641',
    role: 'Member',
    avatar: null,
    nid: '19940123456789012',
    nomineeName: 'Designated Nominee',
    nomineeNid: '19970123456789013',
    nomineeRelation: 'Brother',
    membershipFrom: '2025-2026',
    membershipTo: '2035-2036',
    assignedShares: 15,
  }
];

// Global State
let state = {
  currentUser: null,
  users: [],
  statusOverrides: {},
  customTransactions: [],
  rawRows: [],
  transactions: [],
  membersMap: new Map(),
  filteredTransactions: [],
  charts: {},
  sort: { field: 'depositDate', direction: 'desc' },
  pagination: { page: 1, pageSize: 25 },
  filters: { search: '', member: '', type: '', month: '', status: '' },
  autoRefreshTimer: null,
  autoRefreshIntervalMs: 30000,
  isFetching: false,
  lastUpdated: null,
  associationLogo: null,
  shareSchedule: [],
  bankDetails: { ...DEFAULT_BANK_DETAILS },
  adminSubView: 'directory', // 'directory' | 'profile'
  treasury: {
    totalDeposited: 324000,
    totalWithdrawn: 300000,
    totalDebited: 825.02,
    totalCredited: 887.43,
    bankBalance: 20562.41,
    bankName: 'Mutual Trust Bank PLC',
    bankAccount: '999101****351',
    investment: {
      name: 'M/S MONOARA DAIRY FARM',
      owner: 'Ikhtiar Uddin',
      phone: '+8801600102219',
      amount: 300000,
      tranches: '৳2,50,000 (27/07/2026) + ৳50,000 (07/09/2026)',
      duration: '1 Year',
      terms: 'Depend On Profit',
      status: 'Active'
    },
    bankDebits: JSON.parse(JSON.stringify(DEFAULT_BANK_LEDGER))
  }
};

// Helper: Format Currency (BDT / ৳) rounded for overview cards
function formatCurrency(amount) {
  if (isNaN(amount) || amount === null) return '৳ 0';
  return '৳ ' + Math.round(amount).toLocaleString('en-IN');
}

// Helper: Format Currency with exact 2 decimal places for banking balances
function formatDecimalCurrency(amount) {
  if (amount === undefined || amount === null || amount === '' || isNaN(amount)) return '৳ 0.00';
  const num = parseFloat(amount);
  return '৳ ' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Helper: Format Date
function formatDate(dateObj) {
  if (!dateObj || !(dateObj instanceof Date) || isNaN(dateObj)) return 'N/A';
  return dateObj.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

// Helper: Member Initials
function getInitials(name) {
  if (!name) return 'AI';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

// Helper: String to Color
function stringToColor(str) {
  const colors = [
    '#059669', '#0d9488', '#0284c7', '#4f46e5',
    '#7c3aed', '#c026d3', '#db2777', '#ea580c',
    '#d97706', '#16a34a'
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

// Toast Notifications
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-msg');
  const iconEl = document.getElementById('toast-icon');

  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  if (type === 'error') {
    iconEl.className = 'fa-solid fa-circle-exclamation text-rose-400 text-sm';
  } else if (type === 'info') {
    iconEl.className = 'fa-solid fa-circle-info text-blue-400 text-sm';
  } else {
    iconEl.className = 'fa-solid fa-circle-check text-emerald-400 text-sm';
  }

  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 3500);
}

// Application Initialization
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initUsersAndAuth();
  loadSavedOverrides();
  setupEventListeners();
  populateApiSettingsForm();

  // Load cached data for instant startup
  const cached = localStorage.getItem(CONFIG.STORAGE_KEY_CACHE);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.data) {
        processRawData(parsed.data, false);
      }
    } catch (e) {
      console.warn('Cache error:', e);
    }
  }

  // Fetch live fresh data from Apps Script
  fetchLiveData();
  setupAutoRefresh();
});

// View Switcher (Login Opening Page vs Main Dashboard)
function showView(viewName) {
  const loginView = document.getElementById('view-login');
  const dashboardView = document.getElementById('view-dashboard');
  if (!loginView || !dashboardView) return;

  if (viewName === 'login') {
    loginView.classList.remove('hidden');
    dashboardView.classList.add('hidden');
    document.getElementById('login-error')?.classList.add('hidden');
  } else {
    loginView.classList.add('hidden');
    dashboardView.classList.remove('hidden');
    renderAuthHeader();
    updateDashboardForRole();
    renderCharts();
    applyFiltersAndRenderTable();
    renderPendingQueue();
  }
}

function togglePasswordVisibility() {
  const pwdInput = document.getElementById('login-password');
  const txt = document.getElementById('pwd-toggle-text');
  if (!pwdInput) return;
  if (pwdInput.type === 'password') {
    pwdInput.type = 'text';
    if (txt) txt.textContent = 'Hide';
  } else {
    pwdInput.type = 'password';
    if (txt) txt.textContent = 'Show';
  }
}

// Helper: Render User Avatar (Custom Uploaded Photo or Dynamic Initials)
function renderUserAvatar(user, sizeClass = 'w-8 h-8 rounded-xl', textClass = 'text-xs') {
  if (user && user.avatar) {
    return `<img src="${user.avatar}" class="${sizeClass} object-cover border border-emerald-500/40 shrink-0 shadow-sm" alt="${user.name}">`;
  }
  const name = user ? user.name : 'AI';
  const bg = stringToColor(name);
  const initials = getInitials(name);
  return `<div class="${sizeClass} flex items-center justify-center text-white font-extrabold ${textClass} shrink-0 shadow-sm" style="background-color: ${bg}">${initials}</div>`;
}

// Helper: Compress and Square-Crop Uploaded Image via HTML5 Canvas
function compressImage(file, maxSize = 256, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const width = img.width;
        const height = img.height;

        // Center square crop
        const minDim = Math.min(width, height);
        const startX = (width - minDim) / 2;
        const startY = (height - minDim) / 2;

        canvas.width = maxSize;
        canvas.height = maxSize;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, maxSize, maxSize);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

// ============================================================================
// ASSOCIATION LOGO & OFFICIAL BRANDING ENGINE
// ============================================================================

function applyAssociationLogo() {
  const navLogo = document.getElementById('navbar-logo-container');
  const loginTopLogo = document.getElementById('login-top-logo');
  const loginCenterLogo = document.getElementById('login-center-logo');
  const statementLogo = document.getElementById('statement-logo-container');
  const adminPreview = document.getElementById('admin-logo-preview');
  const btnReset = document.getElementById('btn-remove-logo');

  if (state.associationLogo) {
    const imgHtml = `<img src="${state.associationLogo}" class="w-full h-full object-cover rounded-2xl" alt="Al-Ikhlas Association Logo">`;
    if (navLogo) navLogo.innerHTML = imgHtml;
    if (loginTopLogo) loginTopLogo.innerHTML = imgHtml;
    if (loginCenterLogo) loginCenterLogo.innerHTML = `<img src="${state.associationLogo}" class="w-full h-full object-cover rounded-3xl" alt="Al-Ikhlas Association Logo">`;
    if (statementLogo) statementLogo.innerHTML = imgHtml;
    if (adminPreview) adminPreview.innerHTML = imgHtml;
    if (btnReset) btnReset.classList.remove('hidden');
  } else {
    if (navLogo) navLogo.innerHTML = '<i class="fa-solid fa-kaaba text-lg text-gold-400"></i>';
    if (loginTopLogo) loginTopLogo.innerHTML = '<i class="fa-solid fa-kaaba text-2xl text-gold-400"></i>';
    if (loginCenterLogo) loginCenterLogo.innerHTML = '<i class="fa-solid fa-kaaba text-3xl text-gold-400"></i>';
    if (statementLogo) statementLogo.innerHTML = '<i class="fa-solid fa-kaaba text-xl text-gold-400"></i>';
    if (adminPreview) adminPreview.innerHTML = '<i class="fa-solid fa-kaaba text-3xl text-gold-400"></i>';
    if (btnReset) btnReset.classList.add('hidden');
  }
}

function initLogo() {
  const storedLogo = localStorage.getItem(CONFIG.STORAGE_KEY_LOGO);
  if (storedLogo) {
    state.associationLogo = storedLogo;
  }
  applyAssociationLogo();
}

async function handleLogoUpload(e) {
  if (!isAdmin()) {
    showToast('Only the President can update the Association Logo.', 'error');
    return;
  }
  const file = e.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showToast('Please select a valid image file (PNG, JPG, WebP)', 'error');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    showToast('Logo file size exceeds 5MB limit', 'error');
    return;
  }

  try {
    showToast('Optimizing and applying Association Logo...', 'info');
    const compressed = await compressImage(file, 256, 0.90);
    state.associationLogo = compressed;
    localStorage.setItem(CONFIG.STORAGE_KEY_LOGO, compressed);
    applyAssociationLogo();
    showToast('Association Logo updated globally!', 'success');
  } catch (err) {
    console.error('Logo upload error:', err);
    showToast('Failed to process logo image.', 'error');
  }
}

function handleRemoveLogo() {
  if (!isAdmin()) {
    showToast('Only the President can reset the Association Logo.', 'error');
    return;
  }
  if (confirm('Reset official Association Logo back to default Kaaba emblem?')) {
    state.associationLogo = null;
    localStorage.removeItem(CONFIG.STORAGE_KEY_LOGO);
    const input = document.getElementById('admin-logo-input');
    if (input) input.value = '';
    applyAssociationLogo();
    showToast('Logo reset to default emblem.', 'info');
  }
}

// ============================================================================
// OFFICIAL ASSOCIATION BANK ACCOUNT ENGINE (MUTUAL TRUST BANK PLC)
// ============================================================================

function initBankDetails() {
  const stored = localStorage.getItem(CONFIG.STORAGE_KEY_BANK);
  if (stored) {
    try {
      state.bankDetails = Object.assign({}, DEFAULT_BANK_DETAILS, JSON.parse(stored));
    } catch (e) {
      state.bankDetails = { ...DEFAULT_BANK_DETAILS };
    }
  } else {
    state.bankDetails = { ...DEFAULT_BANK_DETAILS };
  }
}

function openBankDetailsModal() {
  initBankDetails();
  renderBankDetailsModalContent();
  const modal = document.getElementById('modal-bank-details');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    modal.scrollTop = 0;
  }
}

function closeBankDetailsModal() {
  const modal = document.getElementById('modal-bank-details');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function renderBankDetailsModalContent() {
  const viewContainer = document.getElementById('bank-details-view-mode');
  const footerContainer = document.getElementById('bank-details-modal-footer');
  const editForm = document.getElementById('bank-details-edit-form');
  if (!viewContainer) return;

  if (editForm) editForm.classList.add('hidden');
  viewContainer.classList.remove('hidden');

  const b = state.bankDetails || DEFAULT_BANK_DETAILS;
  const currentBalance = state.treasury?.bankBalance || b.liquidBalance || 20562.41;
  const canEdit = canEditBankDetails();

  viewContainer.innerHTML = `
    <!-- Top Branded MTB Bank Card -->
    <div class="p-5 sm:p-6 rounded-2xl bg-gradient-to-tr from-emerald-900 via-brand-900 to-emerald-800 text-white shadow-xl relative overflow-hidden border border-emerald-500/30">
      <div class="absolute -right-8 -top-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
      <div class="flex items-center justify-between pb-3 border-b border-emerald-600/40 mb-4">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-white text-emerald-800 flex items-center justify-center font-black text-sm shadow">
            MTB
          </div>
          <div>
            <div class="text-xs uppercase tracking-wider text-emerald-200 font-bold leading-tight">${b.bankName}</div>
            <div class="text-[10px] text-emerald-300 font-mono">${b.branch}</div>
          </div>
        </div>
        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 live-pulse"></span>
          <span>Verified Account</span>
        </span>
      </div>

      <div class="space-y-3">
        <div>
          <span class="text-[10px] uppercase font-bold text-emerald-300/80 tracking-wider block">Account Title</span>
          <div class="text-base sm:text-lg font-black tracking-tight text-white mt-0.5">${b.accountName}</div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-emerald-600/30">
          <div>
            <span class="text-[10px] uppercase font-bold text-emerald-300/80 tracking-wider block">Account Number</span>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-base sm:text-lg font-black font-mono tracking-widest text-gold-300">${b.accountNumber}</span>
              <button type="button" onclick="copyToClipboard('${b.accountNumber}')" class="px-2 py-0.5 rounded-md bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold transition flex items-center gap-1" title="Copy Account Number">
                <i class="fa-regular fa-copy text-[10px]"></i> Copy
              </button>
            </div>
          </div>

          <div>
            <span class="text-[10px] uppercase font-bold text-emerald-300/80 tracking-wider block">Routing Number</span>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-base font-black font-mono tracking-wider text-white">${b.routingNumber}</span>
              <button type="button" onclick="copyToClipboard('${b.routingNumber}')" class="px-2 py-0.5 rounded-md bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold transition flex items-center gap-1" title="Copy Routing Number">
                <i class="fa-regular fa-copy text-[10px]"></i> Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Secondary Banking Details & Metadata Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
      <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
        <span class="text-[10px] uppercase font-bold text-slate-400 block">Account Type</span>
        <span class="font-bold text-slate-800 dark:text-slate-100 block mt-0.5 truncate">${b.accountType}</span>
      </div>
      <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
        <span class="text-[10px] uppercase font-bold text-slate-400 block">SWIFT Code</span>
        <span class="font-mono font-bold text-slate-800 dark:text-slate-100 block mt-0.5">${b.swiftCode || 'MTBLBDDH'}</span>
      </div>
      <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 col-span-2 sm:col-span-1">
        <span class="text-[10px] uppercase font-bold text-slate-400 block">Current Liquid Balance</span>
        <span class="font-extrabold text-emerald-600 dark:text-emerald-400 block mt-0.5">${formatCurrency(currentBalance)}</span>
      </div>
    </div>

    <!-- Deposit Instructions Notice -->
    <div class="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 flex items-start gap-3">
      <div class="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5 text-xs">
        <i class="fa-solid fa-circle-info"></i>
      </div>
      <div class="text-xs">
        <div class="font-bold text-amber-900 dark:text-amber-200">Deposit &amp; Transfer Guidelines</div>
        <p class="text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed">
          ${b.instructions || 'Deposits can be made via MTB Branch Slips, BEFTN, NPSB, RTGS, or Internet Banking. Please mention your Full Name & Month in deposit remarks.'}
        </p>
      </div>
    </div>

    <!-- Official Ledger Verification Badge -->
    <div class="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
      <span class="flex items-center gap-1">
        <i class="fa-solid fa-shield-halved text-emerald-600"></i>
        <span>Bank A/C Verified &amp; Audited</span>
      </span>
      <span>Updated by: <strong class="text-slate-600 dark:text-slate-300">${b.updatedBy || 'Admin'}</strong></span>
    </div>
  `;

  if (footerContainer) {
    if (canEdit) {
      footerContainer.innerHTML = `
        <button type="button" onclick="closeBankDetailsModal()" class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition flex items-center gap-1.5 shadow-sm">
          <i class="fa-solid fa-xmark text-xs"></i>
          <span>Close</span>
        </button>
        <button type="button" onclick="toggleBankDetailsEditMode(true)" class="px-4 py-2 rounded-xl text-xs font-bold bg-brand-700 hover:bg-brand-800 text-white transition flex items-center gap-1.5 shadow-sm">
          <i class="fa-solid fa-user-pen text-xs"></i>
          <span>Edit Bank Details</span>
        </button>
      `;
    } else {
      footerContainer.innerHTML = `
        <button type="button" onclick="closeBankDetailsModal()" class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition flex items-center gap-1.5 shadow-sm">
          <i class="fa-solid fa-xmark text-xs"></i>
          <span>Close</span>
        </button>
        <div class="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
          <i class="fa-solid fa-lock text-amber-500"></i>
          <span>Editing restricted to President &amp; Accountant</span>
        </div>
      `;
    }
  }
}

function toggleBankDetailsEditMode(isEditing) {
  if (isEditing && !canEditBankDetails()) {
    showToast('Permission denied. Only President & Accountant can edit bank details.', 'error');
    return;
  }

  const viewContainer = document.getElementById('bank-details-view-mode');
  const editForm = document.getElementById('bank-details-edit-form');
  const footerContainer = document.getElementById('bank-details-modal-footer');

  if (isEditing) {
    if (viewContainer) viewContainer.classList.add('hidden');
    if (editForm) {
      editForm.classList.remove('hidden');
      const b = state.bankDetails || DEFAULT_BANK_DETAILS;
      document.getElementById('bank-form-bank-name').value = b.bankName || '';
      document.getElementById('bank-form-account-name').value = b.accountName || '';
      document.getElementById('bank-form-account-number').value = b.accountNumber || '';
      document.getElementById('bank-form-routing-number').value = b.routingNumber || '';
      document.getElementById('bank-form-branch').value = b.branch || '';
      document.getElementById('bank-form-account-type').value = b.accountType || '';
      document.getElementById('bank-form-swift').value = b.swiftCode || '';
      document.getElementById('bank-form-instructions').value = b.instructions || '';
    }
    if (footerContainer) {
      footerContainer.innerHTML = `
        <button type="button" onclick="toggleBankDetailsEditMode(false)" class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition">
          Back to View Mode
        </button>
        <span class="text-xs text-slate-400 font-medium">Review &amp; click "Save Bank Details" above</span>
      `;
    }
  } else {
    renderBankDetailsModalContent();
  }
}

function handleSaveBankDetails(e) {
  if (e) e.preventDefault();
  if (!canEditBankDetails()) {
    showToast('Permission denied. Only President & Accountant can edit bank details.', 'error');
    return;
  }

  const bankName = document.getElementById('bank-form-bank-name').value.trim();
  const accountName = document.getElementById('bank-form-account-name').value.trim();
  const accountNumber = document.getElementById('bank-form-account-number').value.trim();
  const routingNumber = document.getElementById('bank-form-routing-number').value.trim();
  const branch = document.getElementById('bank-form-branch').value.trim();
  const accountType = document.getElementById('bank-form-account-type').value.trim();
  const swiftCode = document.getElementById('bank-form-swift').value.trim();
  const instructions = document.getElementById('bank-form-instructions').value.trim();

  state.bankDetails = {
    ...state.bankDetails,
    bankName: bankName || DEFAULT_BANK_DETAILS.bankName,
    accountName: accountName || DEFAULT_BANK_DETAILS.accountName,
    accountNumber: accountNumber || DEFAULT_BANK_DETAILS.accountNumber,
    routingNumber: routingNumber || DEFAULT_BANK_DETAILS.routingNumber,
    branch: branch || DEFAULT_BANK_DETAILS.branch,
    accountType: accountType || DEFAULT_BANK_DETAILS.accountType,
    swiftCode: swiftCode || DEFAULT_BANK_DETAILS.swiftCode,
    instructions: instructions || DEFAULT_BANK_DETAILS.instructions,
    updatedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    updatedBy: state.currentUser ? `${state.currentUser.name} (${state.currentUser.role})` : 'President'
  };

  localStorage.setItem(CONFIG.STORAGE_KEY_BANK, JSON.stringify(state.bankDetails));
  toggleBankDetailsEditMode(false);
  renderTreasuryCards();
  if (!isAdmin() || state.adminSubView === 'profile') {
    renderMemberPersonalView();
  }
  showToast('Bank details updated successfully.', 'success');
}

// ============================================================================
// 11-YEAR FINANCIAL YEAR SHARE & EXTRA SCHEDULE ENGINE (2025–2036)
// ============================================================================

function initShareSchedule() {
  const stored = localStorage.getItem(CONFIG.STORAGE_KEY_SCHEDULE);
  if (stored) {
    try {
      state.shareSchedule = JSON.parse(stored);
      if (!Array.isArray(state.shareSchedule) || state.shareSchedule.length === 0) {
        state.shareSchedule = JSON.parse(JSON.stringify(DEFAULT_SHARE_SCHEDULE));
      }
    } catch (e) {
      state.shareSchedule = JSON.parse(JSON.stringify(DEFAULT_SHARE_SCHEDULE));
    }
  } else {
    state.shareSchedule = JSON.parse(JSON.stringify(DEFAULT_SHARE_SCHEDULE));
  }
}

function openShareScheduleModal() {
  initShareSchedule();
  renderShareScheduleModalContent(false);
  const modal = document.getElementById('modal-share-schedule');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    modal.scrollTop = 0;
  }
}

function closeShareScheduleModal() {
  const modal = document.getElementById('modal-share-schedule');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function renderShareScheduleModalContent(isEditing = false) {
  const container = document.getElementById('share-schedule-container');
  const footerContainer = document.getElementById('share-schedule-modal-footer');
  if (!container) return;

  const schedule = state.shareSchedule && state.shareSchedule.length > 0 ? state.shareSchedule : DEFAULT_SHARE_SCHEDULE;
  const canEdit = canEditShareSchedule();

  if (isEditing && canEdit) {
    // EDIT MODE TABLE FOR ADMIN & ACCOUNTANT
    let rowsHtml = schedule.map((row, idx) => `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
        <td class="py-2.5 px-3 font-bold text-slate-800 dark:text-slate-200">
          <input type="text" value="${row.year}" id="sched-year-${idx}" class="w-full bg-white dark:bg-slate-800 text-xs rounded-lg px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-brand-500">
        </td>
        <td class="py-2.5 px-3">
          <input type="number" step="0.01" value="${row.shareValue !== '' && row.shareValue !== null ? row.shareValue : ''}" placeholder="e.g. 2000.00" id="sched-val-${idx}" class="w-full bg-white dark:bg-slate-800 text-xs rounded-lg px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 text-right font-extrabold text-emerald-700 dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-brand-500">
        </td>
        <td class="py-2.5 px-3">
          <input type="number" step="0.01" value="${row.extraPerShare !== '' && row.extraPerShare !== null ? row.extraPerShare : ''}" placeholder="e.g. 5000.00" id="sched-extra-${idx}" class="w-full bg-white dark:bg-slate-800 text-xs rounded-lg px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 text-right font-extrabold text-purple-700 dark:text-purple-400 focus:outline-none focus:ring-2 focus:ring-brand-500">
        </td>
      </tr>
    `).join('');

    container.innerHTML = `
      <form id="share-schedule-edit-form" onsubmit="handleSaveShareSchedule(event)" class="space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-700 dark:text-slate-300">
            <i class="fa-solid fa-pen-to-square text-amber-600 mr-1"></i> Edit Financial Year Schedule Values
          </span>
          <button type="button" onclick="resetShareScheduleToDefault()" class="text-xs text-rose-500 hover:underline font-semibold flex items-center gap-1">
            <i class="fa-solid fa-rotate-left text-[10px]"></i> Reset to Defaults
          </button>
        </div>

        <div class="border-2 border-slate-900 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
          <table class="w-full text-left text-xs whitespace-nowrap">
            <thead class="bg-slate-100 dark:bg-slate-800 border-b-2 border-slate-900 dark:border-slate-700 font-black text-slate-900 dark:text-white uppercase text-[11px]">
              <tr>
                <th class="py-3 px-3 w-1/3">Financial Year</th>
                <th class="py-3 px-3 w-1/3 text-right">Share Value (৳)</th>
                <th class="py-3 px-3 w-1/3 text-right">Extra Amount Per Share (৳)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
              ${rowsHtml}
            </tbody>
          </table>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2">
          <button type="button" onclick="renderShareScheduleModalContent(false)" class="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition">
            Cancel
          </button>
          <button type="submit" class="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shadow-md transition flex items-center gap-1.5">
            <i class="fa-solid fa-floppy-disk text-xs"></i>
            <span>Save Schedule</span>
          </button>
        </div>
      </form>
    `;

    if (footerContainer) {
      footerContainer.innerHTML = `
        <button type="button" onclick="closeShareScheduleModal()" class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition">
          Close
        </button>
        <span class="text-xs text-slate-400 font-medium">Click "Save Schedule" above when done</span>
      `;
    }

  } else {
    // VIEW MODE: EXACT REPLICA OF USER ATTACHED IMAGE TABLE
    let rowsHtml = schedule.map((row) => {
      const formattedShareVal = (row.shareValue !== '' && row.shareValue !== null && !isNaN(row.shareValue)) ?
        Number(row.shareValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';
      const formattedExtraVal = (row.extraPerShare !== '' && row.extraPerShare !== null && !isNaN(row.extraPerShare)) ?
        Number(row.extraPerShare).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';

      return `
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
          <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white border-r border-slate-900 dark:border-slate-700 text-center">
            ${row.year}
          </td>
          <td class="py-2.5 px-4 font-black text-center border-r border-slate-900 dark:border-slate-700 text-slate-900 dark:text-slate-100">
            ${formattedShareVal ? formattedShareVal : '&nbsp;'}
          </td>
          <td class="py-2.5 px-4 font-black text-center text-slate-900 dark:text-slate-100">
            ${formattedExtraVal ? formattedExtraVal : '&nbsp;'}
          </td>
        </tr>
      `;
    }).join('');

    container.innerHTML = `
      <div class="space-y-3">
        <!-- Replicated High-Contrast Table as in User Uploaded Photo -->
        <div class="border-[2px] border-slate-900 dark:border-slate-600 rounded-xl overflow-hidden shadow-md">
          <table class="w-full text-center text-xs border-collapse">
            <thead class="bg-slate-50 dark:bg-slate-800/90 border-b-[2px] border-slate-900 dark:border-slate-600">
              <tr>
                <th class="py-3 px-4 font-extrabold text-slate-900 dark:text-white border-r border-slate-900 dark:border-slate-600 text-center uppercase tracking-wider text-xs">
                  Financial Year
                </th>
                <th class="py-3 px-4 font-extrabold text-slate-900 dark:text-white border-r border-slate-900 dark:border-slate-600 text-center uppercase tracking-wider text-xs">
                  Share Value
                </th>
                <th class="py-3 px-4 font-extrabold text-slate-900 dark:text-white text-center uppercase tracking-wider text-xs">
                  Extra Amount Per Share
                </th>
              </tr>
            </thead>
            <tbody class="divide-y border-t border-slate-900 dark:border-slate-700 divide-slate-900 dark:divide-slate-700">
              ${rowsHtml}
            </tbody>
          </table>
        </div>

        <div class="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-calendar-check text-amber-600"></i>
            <span>Current Active Financial Year: <strong>2025–2026</strong> (Share Value: ৳2,000.00 • Extra: ৳5,000.00)</span>
          </div>
          <span class="text-[10px] font-bold uppercase tracking-wider bg-amber-200/60 dark:bg-amber-900/80 px-2 py-0.5 rounded">
            11-Year Schedule
          </span>
        </div>
      </div>
    `;

    if (footerContainer) {
      if (canEdit) {
        footerContainer.innerHTML = `
          <button type="button" onclick="closeShareScheduleModal()" class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition flex items-center gap-1.5 shadow-sm">
            <i class="fa-solid fa-xmark text-xs"></i>
            <span>Close</span>
          </button>
          <button type="button" onclick="renderShareScheduleModalContent(true)" class="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition flex items-center gap-1.5 shadow-sm">
            <i class="fa-solid fa-pen-to-square text-xs"></i>
            <span>Edit Schedule Values</span>
          </button>
        `;
      } else {
        footerContainer.innerHTML = `
          <button type="button" onclick="closeShareScheduleModal()" class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition flex items-center gap-1.5 shadow-sm">
            <i class="fa-solid fa-xmark text-xs"></i>
            <span>Close</span>
          </button>
          <div class="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
            <i class="fa-solid fa-lock text-amber-500"></i>
            <span>Schedule editing restricted to President &amp; Accountant</span>
          </div>
        `;
      }
    }
  }
}

function handleSaveShareSchedule(e) {
  if (e) e.preventDefault();
  if (!canEditShareSchedule()) {
    showToast('Permission denied. Admin/Accountant only.', 'error');
    return;
  }

  const schedule = state.shareSchedule && state.shareSchedule.length > 0 ? state.shareSchedule : DEFAULT_SHARE_SCHEDULE;
  const updated = schedule.map((row, idx) => {
    const yearEl = document.getElementById(`sched-year-${idx}`);
    const valEl = document.getElementById(`sched-val-${idx}`);
    const extraEl = document.getElementById(`sched-extra-${idx}`);

    const yearVal = yearEl ? yearEl.value.trim() : row.year;
    const shareVal = valEl && valEl.value !== '' ? parseFloat(valEl.value) : '';
    const extraVal = extraEl && extraEl.value !== '' ? parseFloat(extraEl.value) : '';

    return {
      year: yearVal || row.year,
      shareValue: isNaN(shareVal) ? '' : shareVal,
      extraPerShare: isNaN(extraVal) ? '' : extraVal,
      notes: row.notes || ''
    };
  });

  state.shareSchedule = updated;
  localStorage.setItem(CONFIG.STORAGE_KEY_SCHEDULE, JSON.stringify(updated));
  renderShareScheduleModalContent(false);
  if (!isAdmin() || state.adminSubView === 'profile') {
    renderMemberPersonalView();
  }
  showToast('Financial Year Share Schedule updated successfully.', 'success');
}

function resetShareScheduleToDefault() {
  if (!canEditShareSchedule()) {
    showToast('Permission denied. Admin/Accountant only.', 'error');
    return;
  }
  if (confirm('Reset 11-Year Schedule back to default values?')) {
    state.shareSchedule = JSON.parse(JSON.stringify(DEFAULT_SHARE_SCHEDULE));
    localStorage.removeItem(CONFIG.STORAGE_KEY_SCHEDULE);
    renderShareScheduleModalContent(true);
    showToast('Schedule reset to default roadmap.', 'info');
  }
}

// User & Auth Engine
function initUsersAndAuth() {
  // Load official Association Logo, Bank Details, and Share Schedule
  initLogo();
  initBankDetails();
  initShareSchedule();

  // Load users from storage or use defaults
  const storedUsers = localStorage.getItem(CONFIG.STORAGE_KEY_USERS);
  if (storedUsers) {
    try {
      state.users = JSON.parse(storedUsers);
      // Ensure all users have sheetName, avatar, nid, nominee, membershipFrom, membershipTo, assignedShares
      state.users.forEach(u => {
        const def = DEFAULT_USERS.find(d => d.id === u.id || d.email.toLowerCase() === u.email.toLowerCase());
        if (!u.sheetName) {
          u.sheetName = def ? def.sheetName : u.name;
        }
        if (typeof u.avatar === 'undefined') u.avatar = def ? def.avatar : null;
        if (typeof u.nid === 'undefined' || !u.nid) u.nid = def ? def.nid : '';
        if (typeof u.nomineeName === 'undefined' || !u.nomineeName) u.nomineeName = def ? def.nomineeName : '';
        if (typeof u.nomineeNid === 'undefined' || !u.nomineeNid) u.nomineeNid = def ? def.nomineeNid : '';
        if (typeof u.nomineeRelation === 'undefined' || !u.nomineeRelation) u.nomineeRelation = def ? def.nomineeRelation : '';
        if (typeof u.membershipFrom === 'undefined' || !u.membershipFrom) u.membershipFrom = def ? def.membershipFrom : '2025-2026';
        if (typeof u.membershipTo === 'undefined' || !u.membershipTo) u.membershipTo = def ? def.membershipTo : '2035-2036';
        if (typeof u.assignedShares === 'undefined' || !u.assignedShares) u.assignedShares = def ? def.assignedShares : 15;
      });
      localStorage.setItem(CONFIG.STORAGE_KEY_USERS, JSON.stringify(state.users));
    } catch (e) {
      state.users = [...DEFAULT_USERS];
      localStorage.setItem(CONFIG.STORAGE_KEY_USERS, JSON.stringify(state.users));
    }
  } else {
    state.users = [...DEFAULT_USERS];
    localStorage.setItem(CONFIG.STORAGE_KEY_USERS, JSON.stringify(state.users));
  }

  // Check current session: If no session, Login Page IS THE OPENING PAGE
  const storedAuth = localStorage.getItem(CONFIG.STORAGE_KEY_AUTH);
  if (storedAuth) {
    try {
      state.currentUser = JSON.parse(storedAuth);
      const matched = state.users.find(u => u.id === state.currentUser.id || u.email.toLowerCase() === state.currentUser.email.toLowerCase());
      if (matched) {
        state.currentUser.sheetName = matched.sheetName || state.currentUser.name;
        state.currentUser.avatar = matched.avatar || null;
        state.currentUser.nid = matched.nid || '';
        state.currentUser.nomineeName = matched.nomineeName || '';
        state.currentUser.nomineeNid = matched.nomineeNid || '';
        state.currentUser.nomineeRelation = matched.nomineeRelation || '';
        state.currentUser.membershipFrom = matched.membershipFrom || '2025-2026';
        state.currentUser.membershipTo = matched.membershipTo || '2035-2036';
        state.currentUser.assignedShares = matched.assignedShares || 15;
      }
      showView('dashboard');
      if (!isAdmin()) {
        switchTab('members');
      }
    } catch (e) {
      state.currentUser = null;
      showView('login');
    }
  } else {
    state.currentUser = null;
    showView('login'); // Opening page is LOGIN!
  }

  renderAuthHeader();
  updateDashboardForRole();
  renderAdminUsersTable();
}

// Security Check: Is logged-in user the President / Super Admin?
function isAdmin() {
  if (!state.currentUser) return false;
  return state.currentUser.role === 'President' || state.currentUser.email.toLowerCase() === 'armanhossain.eee.info@gmail.com';
}

function canManageUsers() {
  return isAdmin();
}

function canApprovePayments() {
  if (!state.currentUser) return false;
  return ['President', 'Accountant', 'Cashier'].includes(state.currentUser.role);
}

function canEditBankDetails() {
  if (!state.currentUser) return false;
  return isAdmin() || state.currentUser.role === 'Accountant';
}

function canEditShareSchedule() {
  if (!state.currentUser) return false;
  return isAdmin() || state.currentUser.role === 'Accountant';
}

// Subview switcher for Admin (Directory vs Personal Profile & Statement)
function setAdminSubView(view) {
  state.adminSubView = view;
  const adminDirView = document.getElementById('admin-directory-view');
  const memberPersonalView = document.getElementById('member-personal-view');
  const btnDir = document.getElementById('btn-subview-directory');
  const btnProf = document.getElementById('btn-subview-profile');

  if (view === 'profile') {
    if (adminDirView) adminDirView.classList.add('hidden');
    if (memberPersonalView) memberPersonalView.classList.remove('hidden');
    if (btnProf) {
      btnProf.className = 'px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 shadow-sm';
    }
    if (btnDir) {
      btnDir.className = 'px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white';
    }
    renderMemberPersonalView();
  } else {
    // 'directory'
    if (memberPersonalView) memberPersonalView.classList.add('hidden');
    if (adminDirView) adminDirView.classList.remove('hidden');
    if (btnDir) {
      btnDir.className = 'px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 shadow-sm';
    }
    if (btnProf) {
      btnProf.className = 'px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white';
    }
    renderMembersGrid();
  }
}

function openAdminMyProfile() {
  switchTab('members');
  setAdminSubView('profile');
}

// Helper: Match current user with member statement data in spreadsheet
function getMemberDataForUser(user) {
  if (!user) return null;
  const userLower = (user.name || '').trim().toLowerCase();
  const sheetLower = (user.sheetName || '').trim().toLowerCase();
  const phoneClean = (user.phone || '').replace(/[^0-9]/g, '');

  // 1. Check sheetName match
  if (sheetLower) {
    for (const [name, m] of state.membersMap.entries()) {
      if (name.toLowerCase() === sheetLower) return m;
    }
  }

  // 2. Check full name match
  if (userLower) {
    for (const [name, m] of state.membersMap.entries()) {
      if (name.toLowerCase() === userLower) return m;
    }
  }

  // 3. Check phone match
  if (phoneClean && phoneClean.length >= 7) {
    for (const [name, m] of state.membersMap.entries()) {
      const mPhone = (m.phone || '').replace(/[^0-9]/g, '');
      if (mPhone && (mPhone.endsWith(phoneClean) || phoneClean.endsWith(mPhone))) {
        return m;
      }
    }
  }

  // 4. Check first & last word match
  if (userLower) {
    const partsUser = userLower.split(/\s+/);
    for (const [name, m] of state.membersMap.entries()) {
      const partsM = name.toLowerCase().split(/\s+/);
      if (partsUser[0] === partsM[0] && partsUser[partsUser.length - 1] === partsM[partsM.length - 1]) {
        return m;
      }
    }
  }

  // Fallback safe dummy object
  return {
    name: user.name,
    id: user.id || 'Member',
    phone: user.phone || '',
    totalAmount: 0,
    regularAmount: 0,
    extraAmount: 0,
    receivedAmount: 0,
    pendingAmount: 0,
    totalShares: 0,
    regularCount: 0,
    extraCount: 0,
    depositCount: 0,
    transactions: [],
  };
}

// Update UI Layout Based on Admin vs General Member Role
function updateDashboardForRole() {
  const isSuperAdmin = isAdmin();
  const adminBanner = document.getElementById('admin-banner');
  const adminTabBtn = document.getElementById('tab-btn-admin-panel');
  const adminSubNav = document.getElementById('admin-subview-nav');
  const chartRankingCard = document.getElementById('chart-card-ranking');
  const tabTitleAnalytics = document.getElementById('tab-title-analytics');
  const tabTitleMembers = document.getElementById('tab-title-members');
  const tabIconMembers = document.getElementById('tab-icon-members');

  if (isSuperAdmin) {
    // Admin Mode (President: Arman Hossain)
    if (tabTitleAnalytics) tabTitleAnalytics.textContent = 'Financial Analytics & Trends';
    if (tabTitleMembers) tabTitleMembers.textContent = 'Member Directory & Statements';
    if (tabIconMembers) tabIconMembers.className = 'fa-solid fa-id-card-clip';
    
    if (adminTabBtn) adminTabBtn.classList.remove('hidden');
    if (adminBanner) adminBanner.classList.remove('hidden');
    if (adminSubNav) adminSubNav.classList.remove('hidden');
    if (chartRankingCard) chartRankingCard.classList.remove('hidden');
    
    setAdminSubView(state.adminSubView || 'directory');
    renderPendingQueue();
    renderAdminUsersTable();
  } else {
    // Member Dashboard Mode (General Members)
    // Constraint: Only overall summary + his details + edit profile (NO password change option)
    if (tabTitleAnalytics) tabTitleAnalytics.textContent = 'Association Overview & Trends';
    if (tabTitleMembers) tabTitleMembers.textContent = 'My Profile & Statement';
    if (tabIconMembers) tabIconMembers.className = 'fa-solid fa-user-shield';
    
    if (adminTabBtn) adminTabBtn.classList.add('hidden');
    if (adminBanner) adminBanner.classList.add('hidden');
    if (adminSubNav) adminSubNav.classList.add('hidden');

    const adminDirView = document.getElementById('admin-directory-view');
    const memberPersonalView = document.getElementById('member-personal-view');
    if (adminDirView) adminDirView.classList.add('hidden');
    if (memberPersonalView) memberPersonalView.classList.remove('hidden');
    if (chartRankingCard) chartRankingCard.classList.add('hidden'); // Privacy: Hide other members ranking
    
    renderMemberPersonalView();
  }
}

function renderAuthHeader() {
  const container = document.getElementById('auth-header-container');
  const adminBanner = document.getElementById('admin-banner');
  const adminRoleBadge = document.getElementById('admin-banner-role');

  if (!container) return;

  if (state.currentUser) {
    const isPresident = isAdmin();
    const isAccountant = state.currentUser.role === 'Accountant';
    const roleColor = isPresident ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 
                      isAccountant ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' : 
                      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';

    container.innerHTML = `
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-2 cursor-pointer" onclick="openMemberProfileModal()" title="Click to edit profile &amp; change picture">
          ${renderUserAvatar(state.currentUser, 'w-8 h-8 rounded-xl', 'text-xs')}
          <div class="hidden sm:block text-left">
            <div class="text-xs font-bold text-slate-800 dark:text-slate-100 leading-none truncate max-w-[120px]">
              ${state.currentUser.name}
            </div>
            <span class="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold ${roleColor}">
              ${state.currentUser.role}
            </span>
          </div>
        </div>
        <button onclick="handleLogout()" title="Logout to Sign In Screen" class="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-bold transition flex items-center gap-1">
          <i class="fa-solid fa-arrow-right-from-bracket text-xs"></i>
          <span class="hidden md:inline">Logout</span>
        </button>
      </div>
    `;

    if (adminBanner) {
      if (isPresident) {
        adminBanner.classList.remove('hidden');
        if (adminRoleBadge) adminRoleBadge.textContent = state.currentUser.role;
      } else {
        adminBanner.classList.add('hidden');
      }
    }
  } else {
    container.innerHTML = `
      <button onclick="showView('login')" class="px-3 py-1.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm">
        <i class="fa-solid fa-right-to-bracket text-xs"></i>
        <span>Sign In</span>
      </button>
    `;
    if (adminBanner) adminBanner.classList.add('hidden');
  }
}

function openLoginModal() {
  showView('login');
}

function closeLoginModal() {
  if (state.currentUser) showView('dashboard');
}

function quickFillAdminLogin() {
  document.getElementById('login-email').value = 'armanhossain.eee.info@gmail.com';
  document.getElementById('login-password').value = 'arman2026**';
  handleLoginSubmit();
}

function handleLoginSubmit(e) {
  if (e) e.preventDefault();
  const emailInput = document.getElementById('login-email').value.trim().toLowerCase();
  const passInput = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');

  const user = state.users.find(u => 
    (u.email.toLowerCase() === emailInput || u.name.toLowerCase() === emailInput) && 
    u.password === passInput
  );

  if (user) {
    state.currentUser = user;
    if (!state.currentUser.sheetName) {
      state.currentUser.sheetName = user.sheetName || user.name;
    }
    localStorage.setItem(CONFIG.STORAGE_KEY_AUTH, JSON.stringify(user));
    showView('dashboard');
    updateDashboardForRole();
    if (!isAdmin()) {
      switchTab('members'); // Land directly on personal profile & statement!
    } else {
      switchTab('analytics');
    }
    showToast(`Welcome, ${user.name}! (${user.role})`, 'success');
    fetchLiveData();
  } else {
    if (errorEl) {
      errorEl.textContent = 'Invalid credentials. Please verify your email and password.';
      errorEl.classList.remove('hidden');
    }
  }
}

function handleLogout() {
  state.currentUser = null;
  localStorage.removeItem(CONFIG.STORAGE_KEY_AUTH);
  showView('login');
  renderAuthHeader();
  showToast('Logged out. Please sign in to continue.', 'info');
}

// RENDER MEMBER PERSONAL VIEW: HIS DETAILS, STATEMENT & EDIT PROFILE BUTTON
function renderMemberPersonalView() {
  const container = document.getElementById('member-personal-view');
  if (!container || !state.currentUser) return;

  const memberData = getMemberDataForUser(state.currentUser);
  const avatarBg = stringToColor(state.currentUser.name);
  const hasPending = memberData.pendingAmount > 0;

  let cleanPhone = (state.currentUser.phone || memberData.phone || '').replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) cleanPhone = '88' + cleanPhone;

  const roleBadge = state.currentUser.role || 'Member';
  const roleBadgeClass = roleBadge === 'President' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                         roleBadge === 'Accountant' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                         'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';

  let transactionsHtml = '';
  if (memberData.transactions && memberData.transactions.length > 0) {
    transactionsHtml = memberData.transactions.map((tx) => {
      const typeBadge = tx.isExtra ? 
        '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800"><i class="fa-solid fa-coins mr-1 text-[9px]"></i>Extra Deposit</span>' :
        '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"><i class="fa-solid fa-layer-group mr-1 text-[9px]"></i>Regular Share</span>';

      const statusBadge = tx.status === 'Received' ?
        '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"><i class="fa-solid fa-circle-check mr-1 text-[9px]"></i>Received</span>' :
        '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"><i class="fa-solid fa-clock mr-1 text-[9px]"></i>Pending</span>';

      return `
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <td class="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">${tx.dateFormatted}</td>
          <td class="py-3 px-4 text-center">${typeBadge}</td>
          <td class="py-3 px-4 font-mono text-xs text-slate-600 dark:text-slate-400">
            <div class="flex items-center gap-1.5">
              <span>${tx.trxId}</span>
              <button onclick="copyToClipboard('${tx.trxId.replace(/'/g, "\\'")}')" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 no-print" title="Copy Reference">
                <i class="fa-regular fa-copy text-[10px]"></i>
              </button>
            </div>
          </td>
          <td class="py-3 px-4 text-center font-bold text-slate-800 dark:text-slate-200">${tx.isExtra ? '-' : tx.shares}</td>
          <td class="py-3 px-4 text-right font-black ${tx.isExtra ? 'text-purple-700 dark:text-purple-400' : 'text-emerald-700 dark:text-emerald-400'} text-sm">
            ${formatCurrency(tx.amount)}
          </td>
          <td class="py-3 px-4 text-center">${statusBadge}</td>
        </tr>
      `;
    }).join('');
  } else {
    transactionsHtml = `
      <tr>
        <td colspan="6" class="py-10 text-center text-slate-400">
          <i class="fa-solid fa-folder-open text-3xl mb-2 block text-slate-300 dark:text-slate-600"></i>
          <span>No deposit slips recorded yet for your account.</span>
        </td>
      </tr>
    `;
  }

  container.innerHTML = `
    <!-- 1. PERSONAL PROFILE HEADER CARD -->
    <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
      <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-600 via-emerald-500 to-gold-500"></div>
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div class="relative group shrink-0">
            ${renderUserAvatar(state.currentUser, 'w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-lg border-2 border-emerald-500/30', 'text-xl sm:text-2xl')}
            <button onclick="openMemberProfileModal()" class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brand-700 hover:bg-brand-600 text-white text-[10px] flex items-center justify-center shadow transition" title="Change Profile Picture">
              <i class="fa-solid fa-camera"></i>
            </button>
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                ${state.currentUser.name}
              </h3>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold ${roleBadgeClass}">
                ${roleBadge}
              </span>
              <span class="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                ${memberData.id || 'Member'}
              </span>
            </div>
            
            <div class="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
              <div class="flex items-center gap-1.5">
                <i class="fa-solid fa-envelope text-brand-600"></i>
                <span class="font-mono">${state.currentUser.email}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fa-solid fa-phone text-brand-600"></i>
                <span class="font-mono">${state.currentUser.phone || 'No phone set'}</span>
              </div>
              ${cleanPhone ? `
                <div class="flex items-center gap-1">
                  <a href="https://wa.me/${cleanPhone}" target="_blank" class="text-emerald-600 hover:underline flex items-center gap-1 font-semibold">
                    <i class="fa-brands fa-whatsapp"></i> WhatsApp
                  </a>
                </div>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- ACTION BUTTONS: EDIT PROFILE (NO PASSWORD CHANGE) & EXPORTS -->
        <div class="flex flex-wrap items-center gap-2.5">
          <button onclick="openMemberProfileModal()" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-700 to-brand-600 hover:from-brand-600 hover:to-brand-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-brand-700/20">
            <i class="fa-solid fa-user-pen text-xs"></i>
            <span>Edit Profile</span>
          </button>
          <button onclick="printMemberStatement()" class="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 border border-slate-200 dark:border-slate-700">
            <i class="fa-solid fa-print text-xs"></i>
            <span>Print Statement</span>
          </button>
          <button onclick="exportMyStatementExcel()" class="px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold transition flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800">
            <i class="fa-solid fa-file-excel text-xs"></i>
            <span>Export Excel</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 1B. NATIONAL IDENTITY (NID) & NOMINEE DETAILS CARD -->
    <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <div class="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm">
            <i class="fa-solid fa-id-card"></i>
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-900 dark:text-white">National Identity (NID) &amp; Nominee Details</h4>
            <p class="text-[11px] text-slate-400">Official identification and designated association beneficiary records</p>
          </div>
        </div>
        <button onclick="openMemberProfileModal()" class="text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 flex items-center gap-1">
          <i class="fa-solid fa-pen-to-square"></i>
          <span>Update</span>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Own NID Card -->
        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0 text-base">
            <i class="fa-solid fa-address-card"></i>
          </div>
          <div class="flex-1 min-w-0">
            <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">My National ID (Own NID)</span>
            <div class="text-base font-extrabold font-mono text-slate-900 dark:text-white mt-0.5">
              ${state.currentUser.nid || '<span class="text-slate-400 font-sans text-xs font-normal italic">Not set — click "Edit Profile" to add</span>'}
            </div>
            <span class="text-[11px] text-emerald-600 font-semibold block mt-1">
              <i class="fa-solid fa-circle-check text-[10px] mr-1"></i>Verified Association Member
            </span>
          </div>
        </div>

        <!-- Nominee Information Card -->
        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 text-base">
            <i class="fa-solid fa-user-shield"></i>
          </div>
          <div class="flex-1 min-w-0">
            <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Designated Nominee</span>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-sm font-extrabold text-slate-900 dark:text-white">
                ${state.currentUser.nomineeName || '<span class="text-slate-400 text-xs font-normal italic">No nominee added</span>'}
              </span>
              ${state.currentUser.nomineeRelation ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">${state.currentUser.nomineeRelation}</span>` : ''}
            </div>
            <div class="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
              ${state.currentUser.nomineeNid ? `Nominee NID: <span class="font-bold text-slate-700 dark:text-slate-300">${state.currentUser.nomineeNid}</span>` : '<span class="text-slate-400 italic text-[11px]">Nominee NID not recorded</span>'}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 1C. MEMBERSHIP FINANCIAL YEAR TENURE, SUBSCRIBED SHARES, BANK DETAILS & SCHEDULE CARDS -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Card A: Membership Tenure & Shares -->
      <div class="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm">
                <i class="fa-solid fa-calendar-check"></i>
              </div>
              <span class="text-xs font-bold text-slate-800 dark:text-slate-200">Membership Tenure</span>
            </div>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">11-Year Term</span>
          </div>
          <div class="mt-3">
            <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Financial Years</span>
            <div class="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
              ${state.currentUser.membershipFrom || '2025-2026'} → ${state.currentUser.membershipTo || '2035-2036'}
            </div>
            <div class="mt-2 text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Subscribed Capital:</span>
              <strong class="text-brand-700 dark:text-brand-400 font-extrabold">${state.currentUser.assignedShares || 15} Subscribed Shares</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Card B: Official MTB Bank Account Card -->
      <div class="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm">
                <i class="fa-solid fa-building-columns"></i>
              </div>
              <span class="text-xs font-bold text-slate-800 dark:text-slate-200">Bank Details</span>
            </div>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">MTB</span>
          </div>
          <div class="mt-3">
            <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Mutual Trust Bank PLC</span>
            <div class="text-base font-mono font-black text-emerald-700 dark:text-emerald-400 mt-0.5 flex items-center gap-2">
              <span>${state.bankDetails.accountNumber}</span>
              <button type="button" onclick="copyToClipboard('${state.bankDetails.accountNumber}')" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs" title="Copy Account Number">
                <i class="fa-regular fa-copy"></i>
              </button>
            </div>
            <div class="mt-2 text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Routing: <strong class="font-mono text-slate-700 dark:text-slate-300">${state.bankDetails.routingNumber}</strong></span>
              <button type="button" onclick="openBankDetailsModal()" class="text-emerald-600 hover:underline font-bold text-[11px] flex items-center gap-1">
                <span>View Full Info</span>
                <i class="fa-solid fa-arrow-right text-[10px]"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Card C: Financial Year Share & Extra Schedule Card -->
      <div class="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center text-sm">
                <i class="fa-solid fa-calendar-days"></i>
              </div>
              <span class="text-xs font-bold text-slate-800 dark:text-slate-200">FY Share Schedule</span>
            </div>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">2025–2036</span>
          </div>
          <div class="mt-3">
            <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">FY 2025–2026 Rates</span>
            <div class="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center justify-between">
              <span>Share: <strong class="text-emerald-600">৳2,000</strong></span>
              <span>Extra: <strong class="text-purple-600">৳5,000</strong></span>
            </div>
            <div class="mt-2 text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>11-Year Roadmap</span>
              <button type="button" onclick="openShareScheduleModal()" class="text-amber-600 hover:underline font-bold text-[11px] flex items-center gap-1">
                <span>View Schedule</span>
                <i class="fa-solid fa-arrow-right text-[10px]"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. FOUR FINANCIAL SUMMARY CARDS FOR THIS MEMBER -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      <!-- Card 1: Regular Share Capital -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-emerald-500 transition-all">
        <div class="absolute -right-3 -top-3 w-14 h-14 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <i class="fa-solid fa-layer-group text-xl opacity-70"></i>
        </div>
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">My Regular Capital</p>
        <div class="flex items-baseline gap-1 mt-2">
          <span class="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400">${formatCurrency(memberData.regularAmount)}</span>
        </div>
        <div class="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span><strong>${memberData.totalShares} Shares</strong> (@ ৳2,000)</span>
          <span>${memberData.regularCount} Slips</span>
        </div>
      </div>

      <!-- Card 2: Extra Deposits -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-purple-200 dark:border-purple-900/60 shadow-sm relative overflow-hidden group hover:border-purple-500 transition-all">
        <div class="absolute -right-3 -top-3 w-14 h-14 bg-purple-50 dark:bg-purple-950/40 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400">
          <i class="fa-solid fa-coins text-xl opacity-70"></i>
        </div>
        <div class="flex items-center justify-between">
          <p class="text-xs font-semibold uppercase tracking-wider text-purple-800 dark:text-purple-300">My Extra Deposits</p>
          <span class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">Surplus</span>
        </div>
        <div class="flex items-baseline gap-1 mt-2">
          <span class="text-2xl sm:text-3xl font-black text-purple-700 dark:text-purple-300">${formatCurrency(memberData.extraAmount)}</span>
        </div>
        <div class="mt-3 flex items-center justify-between text-xs text-purple-700 dark:text-purple-300 pt-2 border-t border-purple-100 dark:border-purple-900/40">
          <span><strong>${memberData.extraCount} Extra Slips</strong></span>
          <span>Separated</span>
        </div>
      </div>

      <!-- Card 3: Grand Total Paid -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-brand-500 transition-all">
        <div class="absolute -right-3 -top-3 w-14 h-14 bg-brand-50 dark:bg-brand-950/40 rounded-full flex items-center justify-center text-brand-600 dark:text-brand-400">
          <i class="fa-solid fa-wallet text-xl opacity-70"></i>
        </div>
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Grand Total Paid</p>
        <div class="flex items-baseline gap-1 mt-2">
          <span class="text-2xl sm:text-3xl font-black text-brand-900 dark:text-brand-300">${formatCurrency(memberData.totalAmount)}</span>
        </div>
        <div class="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span>Deposits: <strong>${memberData.depositCount} Total</strong></span>
          <span class="text-emerald-600 font-bold">Verified</span>
        </div>
      </div>

      <!-- Card 4: Clearance & Dues Status -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-emerald-500 transition-all">
        <div class="absolute -right-3 -top-3 w-14 h-14 ${hasPending ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600' : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600'} rounded-full flex items-center justify-center">
          <i class="fa-solid ${hasPending ? 'fa-clock' : 'fa-circle-check'} text-xl opacity-70"></i>
        </div>
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Account Health</p>
        <div class="flex items-baseline gap-1 mt-2">
          <span class="text-2xl sm:text-3xl font-black ${hasPending ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}">
            ${hasPending ? 'Dues Pending' : '100% Cleared'}
          </span>
        </div>
        <div class="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          ${hasPending ? `<span class="text-amber-600 font-bold">Pending: ${formatCurrency(memberData.pendingAmount)}</span>` : '<span class="text-emerald-600 font-medium">✓ Zero Pending Dues</span>'}
          <span class="text-slate-400 text-[10px]">Master Sheet Synced</span>
        </div>
      </div>

    </div>

    <!-- 3. PERSONAL STATEMENT LEDGER TABLE -->
    <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="fa-solid fa-receipt text-brand-600"></i>
            My Deposit History &amp; Contribution Ledger
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Chronological record of all share capital and extra deposits credited to your account
          </p>
        </div>
        <div class="flex items-center gap-2">
          <span class="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            ${memberData.transactions ? memberData.transactions.length : 0} Records Found
          </span>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs whitespace-nowrap">
          <thead class="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
            <tr>
              <th class="py-3 px-4">Date</th>
              <th class="py-3 px-4 text-center">Deposit Type</th>
              <th class="py-3 px-4">TRX ID / Slip Reference</th>
              <th class="py-3 px-4 text-center">Shares</th>
              <th class="py-3 px-4 text-right">Amount (BDT)</th>
              <th class="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            ${transactionsHtml}
          </tbody>
          <tfoot class="bg-slate-50 dark:bg-slate-800/50 font-bold text-xs text-slate-700 dark:text-slate-300 border-t-2 border-slate-200 dark:border-slate-700">
            <tr>
              <td class="py-3 px-4" colspan="3">Grand Total Contributed</td>
              <td class="py-3 px-4 text-center text-brand-700 dark:text-brand-400 font-extrabold">${memberData.totalShares} Shares</td>
              <td class="py-3 px-4 text-right text-brand-700 dark:text-brand-400 text-sm font-black">${formatCurrency(memberData.totalAmount)}</td>
              <td class="py-3 px-4 text-center text-emerald-600 font-bold">100% Verified</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  `;
}

// Member Self-Edit Modal with Photo Upload & Security Controls
let tempProfileAvatar = null;

function openMemberProfileModal() {
  if (!state.currentUser) return;
  const nameInput = document.getElementById('member-profile-name');
  const phoneInput = document.getElementById('member-profile-phone');
  const emailInput = document.getElementById('member-profile-email');
  const fileInput = document.getElementById('member-profile-photo-input');
  const nidInput = document.getElementById('member-profile-nid');
  const nomineeNameInput = document.getElementById('member-profile-nominee-name');
  const nomineeRelationInput = document.getElementById('member-profile-nominee-relation');
  const nomineeNidInput = document.getElementById('member-profile-nominee-nid');
  const modal = document.getElementById('modal-member-profile');

  if (fileInput) fileInput.value = '';
  if (nameInput) nameInput.value = state.currentUser.name || '';
  if (phoneInput) phoneInput.value = state.currentUser.phone || '';
  if (emailInput) emailInput.value = state.currentUser.email || '';
  if (nidInput) nidInput.value = state.currentUser.nid || '';
  if (nomineeNameInput) nomineeNameInput.value = state.currentUser.nomineeName || '';
  if (nomineeRelationInput) nomineeRelationInput.value = state.currentUser.nomineeRelation || '';
  if (nomineeNidInput) nomineeNidInput.value = state.currentUser.nomineeNid || '';

  const tenureDisplay = document.getElementById('member-profile-tenure-display');
  const sharesDisplay = document.getElementById('member-profile-shares-display');
  if (tenureDisplay) {
    tenureDisplay.textContent = `${state.currentUser.membershipFrom || '2025-2026'} → ${state.currentUser.membershipTo || '2035-2036'}`;
  }
  if (sharesDisplay) {
    sharesDisplay.textContent = `${state.currentUser.assignedShares || 15} Shares`;
  }

  tempProfileAvatar = state.currentUser.avatar || null;
  updateModalAvatarPreview();

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    modal.scrollTop = 0;
    const formScrollArea = modal.querySelector('.overflow-y-auto');
    if (formScrollArea) formScrollArea.scrollTop = 0;
  }
}

function updateModalAvatarPreview() {
  const preview = document.getElementById('member-profile-avatar-preview');
  const btnRemove = document.getElementById('btn-remove-photo');
  if (!preview) return;

  if (tempProfileAvatar) {
    preview.innerHTML = `<img src="${tempProfileAvatar}" class="w-full h-full object-cover rounded-2xl" alt="Preview">`;
    if (btnRemove) btnRemove.classList.remove('hidden');
  } else {
    const curName = (document.getElementById('member-profile-name')?.value || state.currentUser?.name || 'AI');
    preview.style.backgroundColor = stringToColor(curName);
    preview.innerHTML = `<span>${getInitials(curName)}</span>`;
    if (btnRemove) btnRemove.classList.add('hidden');
  }
}

async function handleProfilePhotoSelected(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showToast('Please select a valid image file (JPG, PNG, WebP)', 'error');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    showToast('Image size exceeds 5MB limit', 'error');
    return;
  }

  try {
    showToast('Processing photo...', 'info');
    const compressed = await compressImage(file, 256, 0.85);
    tempProfileAvatar = compressed;
    updateModalAvatarPreview();
    showToast('Photo uploaded! Click "Save Changes" to apply.', 'success');
  } catch (err) {
    console.error('Photo processing failed:', err);
    showToast('Could not process photo. Please choose another image.', 'error');
  }
}

function handleRemoveProfilePhoto() {
  tempProfileAvatar = '';
  const fileInput = document.getElementById('member-profile-photo-input');
  if (fileInput) fileInput.value = '';
  updateModalAvatarPreview();
  showToast('Photo removed. Default initials will be used.', 'info');
}

function closeMemberProfileModal() {
  const modal = document.getElementById('modal-member-profile');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function handleMemberProfileSubmit(e) {
  if (e) e.preventDefault();
  if (!state.currentUser) return;

  const newName = document.getElementById('member-profile-name').value.trim();
  const newPhone = document.getElementById('member-profile-phone').value.trim();
  const newNid = document.getElementById('member-profile-nid')?.value.trim() || '';
  const newNomineeName = document.getElementById('member-profile-nominee-name')?.value.trim() || '';
  const newNomineeRelation = document.getElementById('member-profile-nominee-relation')?.value || '';
  const newNomineeNid = document.getElementById('member-profile-nominee-nid')?.value.trim() || '';

  if (!newName) {
    showToast('Name cannot be empty', 'error');
    return;
  }

  // Update in state.currentUser (Password remains unchanged!)
  state.currentUser.name = newName;
  state.currentUser.phone = newPhone;
  state.currentUser.nid = newNid;
  state.currentUser.nomineeName = newNomineeName;
  state.currentUser.nomineeRelation = newNomineeRelation;
  state.currentUser.nomineeNid = newNomineeNid;
  if (tempProfileAvatar !== null) {
    state.currentUser.avatar = tempProfileAvatar ? tempProfileAvatar : null;
  }

  // Update matching user in state.users list
  const userIdx = state.users.findIndex(u => u.id === state.currentUser.id || u.email.toLowerCase() === state.currentUser.email.toLowerCase());
  if (userIdx !== -1) {
    state.users[userIdx].name = newName;
    state.users[userIdx].phone = newPhone;
    state.users[userIdx].nid = newNid;
    state.users[userIdx].nomineeName = newNomineeName;
    state.users[userIdx].nomineeRelation = newNomineeRelation;
    state.users[userIdx].nomineeNid = newNomineeNid;
    if (tempProfileAvatar !== null) {
      state.users[userIdx].avatar = tempProfileAvatar ? tempProfileAvatar : null;
    }
  }

  // Persist to storage
  localStorage.setItem(CONFIG.STORAGE_KEY_USERS, JSON.stringify(state.users));
  localStorage.setItem(CONFIG.STORAGE_KEY_AUTH, JSON.stringify(state.currentUser));

  // Re-render UI
  renderAuthHeader();
  if (isAdmin()) {
    renderMembersGrid();
    renderAdminUsersTable();
  } else {
    renderMemberPersonalView();
  }
  closeMemberProfileModal();

  showToast('Profile, NID, and nominee details updated successfully!', 'success');
}

function printMemberStatement() {
  if (!state.currentUser) return;
  const targetName = state.currentUser.sheetName || state.currentUser.name;
  openMemberStatement(targetName);
}

function exportMyStatementExcel() {
  if (!state.currentUser) return;
  const memberData = getMemberDataForUser(state.currentUser);
  if (!memberData || !memberData.transactions || memberData.transactions.length === 0) {
    showToast('No statement records to export', 'error');
    return;
  }

  const exportData = memberData.transactions.map(tx => ({
    'Date': tx.dateFormatted,
    'Member Name': state.currentUser.name,
    'Member ID': memberData.id,
    'Deposit Type': tx.isExtra ? 'Extra Deposit' : 'Regular Share Capital',
    'Amount (BDT)': tx.amount,
    'Number of Share': tx.isExtra ? 'N/A' : tx.shares,
    'TRX. ID / Reference': tx.trxId,
    'Status': tx.status,
    'Month': tx.monthLabel,
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'My_Statement');
  XLSX.writeFile(wb, `Al_Ikhlas_Statement_${state.currentUser.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  showToast('Exported your personal statement to Excel!', 'success');
}

// User & Role Management Table in Admin Tab
function renderAdminUsersTable() {
  const tbody = document.getElementById('admin-users-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  state.users.forEach(u => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors';

    const isPresident = u.role === 'President';
    const isAccountant = u.role === 'Accountant';
    const roleBadge = isPresident ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                      isAccountant ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';

    tr.innerHTML = `
      <td class="py-3 px-4 font-bold text-slate-900 dark:text-white">
        <div class="flex items-center gap-2.5">
          ${renderUserAvatar(u, 'w-8 h-8 rounded-xl', 'text-xs')}
          <div>
            <div class="font-bold text-slate-900 dark:text-white leading-tight">${u.name}</div>
            <span class="text-[10px] text-slate-400 font-mono">${u.id}</span>
          </div>
        </div>
      </td>
      <td class="py-3 px-4">
        <div class="font-mono text-xs text-slate-700 dark:text-slate-300">${u.email}</div>
        <div class="font-mono text-[11px] text-slate-400">${u.phone || '-'}</div>
      </td>
      <td class="py-3 px-4">
        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${roleBadge}">
          ${u.role}
        </span>
        <div class="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
          <i class="fa-solid fa-calendar-range text-[9px]"></i>
          <span>${u.membershipFrom || '2025-2026'} - ${u.membershipTo || '2035-2036'}</span>
        </div>
        <div class="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">
          ${u.assignedShares || 15} Shares Subscribed
        </div>
      </td>
      <td class="py-3 px-4 font-mono text-xs text-slate-700 dark:text-slate-300">
        ${u.nid ? `<span class="font-bold text-slate-800 dark:text-slate-100">${u.nid}</span>` : '<span class="text-slate-400 italic font-sans text-xs">Not set</span>'}
      </td>
      <td class="py-3 px-4">
        <div class="text-xs font-semibold text-slate-800 dark:text-slate-200">
          ${u.nomineeName ? `<span>${u.nomineeName}</span> ${u.nomineeRelation ? `<span class="text-[10px] font-normal px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">(${u.nomineeRelation})</span>` : ''}` : '<span class="text-slate-400 italic font-sans font-normal text-xs">None recorded</span>'}
        </div>
        ${u.nomineeNid ? `<div class="font-mono text-[10px] text-slate-400">NID: ${u.nomineeNid}</div>` : ''}
      </td>
      <td class="py-3 px-4 text-center">
        <div class="flex items-center justify-center gap-1.5">
          <button onclick="openAddUserModal('${u.id}')" class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 transition flex items-center gap-1" title="Edit Member, Photo & Role">
            <i class="fa-solid fa-user-pen text-[11px]"></i> Edit
          </button>
          ${!isPresident ? `
            <button onclick="deleteUser('${u.id}')" class="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition" title="Delete User">
              <i class="fa-solid fa-trash-can text-xs"></i>
            </button>
          ` : ''}
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Admin Photo Management for Any Member
let tempAdminUserAvatar = null;

function updateAdminUserAvatarPreview() {
  const preview = document.getElementById('admin-user-avatar-preview');
  const btnRemove = document.getElementById('btn-admin-remove-photo');
  if (!preview) return;

  if (tempAdminUserAvatar) {
    preview.innerHTML = `<img src="${tempAdminUserAvatar}" class="w-full h-full object-cover rounded-2xl" alt="Preview">`;
    if (btnRemove) btnRemove.classList.remove('hidden');
  } else {
    const curName = (document.getElementById('form-user-name')?.value || 'AI');
    preview.style.backgroundColor = stringToColor(curName);
    preview.innerHTML = `<span>${getInitials(curName)}</span>`;
    if (btnRemove) btnRemove.classList.add('hidden');
  }
}

async function handleAdminUserPhotoSelected(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showToast('Please select a valid image file (JPG, PNG, WebP)', 'error');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    showToast('Image size exceeds 5MB limit', 'error');
    return;
  }

  try {
    showToast('Processing photo...', 'info');
    const compressed = await compressImage(file, 256, 0.85);
    tempAdminUserAvatar = compressed;
    updateAdminUserAvatarPreview();
    showToast('Photo uploaded! Save changes to apply.', 'success');
  } catch (err) {
    console.error('Photo processing failed:', err);
    showToast('Failed to process image', 'error');
  }
}

function handleAdminRemoveUserPhoto() {
  tempAdminUserAvatar = '';
  const fileInput = document.getElementById('admin-user-photo-input');
  if (fileInput) fileInput.value = '';
  updateAdminUserAvatarPreview();
  showToast('Member photo removed. Default initials will be used.', 'info');
}

function openAddUserModal(userId = null) {
  if (!canManageUsers()) {
    showToast('Only the President can add or edit users.', 'error');
    return;
  }

  const modal = document.getElementById('modal-user');
  const title = document.getElementById('modal-user-title');
  const form = document.getElementById('user-form');
  form.reset();

  const photoInput = document.getElementById('admin-user-photo-input');
  if (photoInput) photoInput.value = '';

  const mFromEl = document.getElementById('form-user-membership-from');
  const mToEl = document.getElementById('form-user-membership-to');
  const sharesEl = document.getElementById('form-user-shares');

  if (userId) {
    const user = state.users.find(u => u.id === userId);
    if (user) {
      title.textContent = `Edit Member & Role: ${user.name}`;
      document.getElementById('form-user-id').value = user.id;
      document.getElementById('form-user-name').value = user.name;
      document.getElementById('form-user-email').value = user.email;
      document.getElementById('form-user-phone').value = user.phone || '';
      document.getElementById('form-user-role').value = user.role;
      document.getElementById('form-user-password').value = user.password || '';
      document.getElementById('form-user-nid').value = user.nid || '';
      document.getElementById('form-user-nominee-name').value = user.nomineeName || '';
      document.getElementById('form-user-nominee-relation').value = user.nomineeRelation || '';
      document.getElementById('form-user-nominee-nid').value = user.nomineeNid || '';
      if (mFromEl) mFromEl.value = user.membershipFrom || '2025-2026';
      if (mToEl) mToEl.value = user.membershipTo || '2035-2036';
      if (sharesEl) sharesEl.value = user.assignedShares || 15;
      tempAdminUserAvatar = user.avatar || null;
    }
  } else {
    title.textContent = 'Add New User / Member';
    document.getElementById('form-user-id').value = '';
    document.getElementById('form-user-nid').value = '';
    document.getElementById('form-user-nominee-name').value = '';
    document.getElementById('form-user-nominee-relation').value = '';
    document.getElementById('form-user-nominee-nid').value = '';
    if (mFromEl) mFromEl.value = '2025-2026';
    if (mToEl) mToEl.value = '2035-2036';
    if (sharesEl) sharesEl.value = 15;
    tempAdminUserAvatar = null;
  }

  updateAdminUserAvatarPreview();

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  modal.scrollTop = 0;
  const formScrollArea = modal.querySelector('.overflow-y-auto');
  if (formScrollArea) formScrollArea.scrollTop = 0;
}

function closeUserModal() {
  document.getElementById('modal-user').classList.add('hidden');
  document.getElementById('modal-user').classList.remove('flex');
}

function editUserRole(userId) {
  openAddUserModal(userId);
}

function deleteUser(userId) {
  if (!canManageUsers()) {
    showToast('Only the President can remove users.', 'error');
    return;
  }

  const user = state.users.find(u => u.id === userId);
  if (!user) return;

  if (confirm(`Are you sure you want to remove user "${user.name}"?`)) {
    state.users = state.users.filter(u => u.id !== userId);
    localStorage.setItem(CONFIG.STORAGE_KEY_USERS, JSON.stringify(state.users));
    renderAdminUsersTable();
    showToast(`User ${user.name} removed.`, 'info');
  }
}

function handleUserSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('form-user-id').value;
  const name = document.getElementById('form-user-name').value.trim();
  const email = document.getElementById('form-user-email').value.trim().toLowerCase();
  const phone = document.getElementById('form-user-phone').value.trim();
  const role = document.getElementById('form-user-role').value;
  const pass = document.getElementById('form-user-password').value.trim() || 'member2026';
  const nid = document.getElementById('form-user-nid').value.trim();
  const nomineeName = document.getElementById('form-user-nominee-name').value.trim();
  const nomineeRelation = document.getElementById('form-user-nominee-relation').value;
  const nomineeNid = document.getElementById('form-user-nominee-nid').value.trim();
  const membershipFrom = document.getElementById('form-user-membership-from')?.value || '2025-2026';
  const membershipTo = document.getElementById('form-user-membership-to')?.value || '2035-2036';
  const assignedShares = parseInt(document.getElementById('form-user-shares')?.value || '15', 10);

  if (id) {
    // Update existing
    const u = state.users.find(x => x.id === id);
    if (u) {
      u.name = name;
      u.email = email;
      u.phone = phone;
      u.role = role;
      u.nid = nid;
      u.nomineeName = nomineeName;
      u.nomineeRelation = nomineeRelation;
      u.nomineeNid = nomineeNid;
      u.membershipFrom = membershipFrom;
      u.membershipTo = membershipTo;
      u.assignedShares = assignedShares;
      if (tempAdminUserAvatar !== null) {
        u.avatar = tempAdminUserAvatar ? tempAdminUserAvatar : null;
      }
      if (pass) u.password = pass;

      // Sync state.currentUser if currently logged in user was edited
      if (state.currentUser && (state.currentUser.id === u.id || state.currentUser.email.toLowerCase() === u.email.toLowerCase())) {
        state.currentUser.name = u.name;
        state.currentUser.phone = u.phone;
        state.currentUser.role = u.role;
        state.currentUser.avatar = u.avatar;
        state.currentUser.nid = u.nid;
        state.currentUser.nomineeName = u.nomineeName;
        state.currentUser.nomineeRelation = u.nomineeRelation;
        state.currentUser.nomineeNid = u.nomineeNid;
        state.currentUser.membershipFrom = u.membershipFrom;
        state.currentUser.membershipTo = u.membershipTo;
        state.currentUser.assignedShares = u.assignedShares;
        localStorage.setItem(CONFIG.STORAGE_KEY_AUTH, JSON.stringify(state.currentUser));
      }
    }
  } else {
    // Add new user
    state.users.push({
      id: 'u_' + Date.now(),
      name,
      email,
      phone,
      role,
      password: pass,
      avatar: tempAdminUserAvatar || null,
      nid,
      nomineeName,
      nomineeRelation,
      nomineeNid,
      membershipFrom,
      membershipTo,
      assignedShares
    });
  }

  localStorage.setItem(CONFIG.STORAGE_KEY_USERS, JSON.stringify(state.users));
  renderAdminUsersTable();
  renderMembersGrid();
  renderAuthHeader();
  closeUserModal();
  showToast(`Saved member profile, photo & role for "${name}"!`, 'success');
}

// Payment Status Overrides & Approval Actions
function loadSavedOverrides() {
  try {
    localStorage.removeItem(CONFIG.STORAGE_KEY_OVERRIDES);
    state.statusOverrides = {};
    state.customTransactions = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY_NEW_TXS)) || [];
  } catch (e) {
    state.statusOverrides = {};
    state.customTransactions = [];
  }
}

function saveOverrides() {
  state.statusOverrides = {};
  localStorage.setItem(CONFIG.STORAGE_KEY_NEW_TXS, JSON.stringify(state.customTransactions));
}

function togglePaymentApproval(uniqueId, newStatus) {
  if (!canApprovePayments()) {
    showToast('Permission denied. Only President or Accountant can approve payments.', 'error');
    openLoginModal();
    return;
  }

  // Update override
  state.statusOverrides[uniqueId] = newStatus;
  saveOverrides();

  // Update transaction object in memory
  const tx = state.transactions.find(t => t.uniqueId === uniqueId);
  if (tx) {
    tx.status = newStatus;
  }

  // Recalculate KPIs and re-render
  updateKPIs();
  renderPendingQueue();
  applyFiltersAndRenderTable();
  renderCharts();

  showToast(`Payment marked as "${newStatus}"!`, 'success');
}

// Pending Approval Queue Table (Section removed per request)
function renderPendingQueue() {}

// Add Transaction Modal Logic
function openAddTransactionModal() {
  const modal = document.getElementById('modal-add-tx');
  const select = document.getElementById('form-tx-member');
  if (!modal || !select) {
    showToast('Direct manual transaction entry is disabled.', 'info');
    return;
  }

  if (!canApprovePayments()) {
    showToast('Only President or Accountant can record deposits.', 'error');
    openLoginModal();
    return;
  }

  select.innerHTML = '';
  const sortedNames = Array.from(state.membersMap.keys()).sort();
  sortedNames.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });

  const dateEl = document.getElementById('form-tx-date');
  const sharesEl = document.getElementById('form-tx-shares');
  const amtEl = document.getElementById('form-tx-amount');
  const trxEl = document.getElementById('form-tx-trx');
  if (dateEl) dateEl.value = new Date().toISOString().slice(0, 10);
  if (sharesEl) sharesEl.value = 1;
  if (amtEl) amtEl.value = 2000;
  if (trxEl) trxEl.value = 'Deposit Slip Book';

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeAddTransactionModal() {
  const modal = document.getElementById('modal-add-tx');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function handleFormTxTypeChange() {
  const type = document.getElementById('form-tx-type').value;
  const sharesContainer = document.getElementById('form-tx-shares-container');
  const amtInput = document.getElementById('form-tx-amount');

  if (type === 'extra') {
    sharesContainer.classList.add('opacity-40', 'pointer-events-none');
    amtInput.value = 1000;
  } else {
    sharesContainer.classList.remove('opacity-40', 'pointer-events-none');
    amtInput.value = parseInt(document.getElementById('form-tx-shares').value || 1, 10) * 2000;
  }
}

function updateCalculatedAmount() {
  const type = document.getElementById('form-tx-type').value;
  if (type === 'regular') {
    const sh = parseInt(document.getElementById('form-tx-shares').value || 1, 10);
    document.getElementById('form-tx-amount').value = sh * 2000;
  }
}

function handleAddTxSubmit(e) {
  e.preventDefault();
  const dateStr = document.getElementById('form-tx-date').value;
  const name = document.getElementById('form-tx-member').value;
  const type = document.getElementById('form-tx-type').value;
  const shares = type === 'extra' ? 0 : parseInt(document.getElementById('form-tx-shares').value || 1, 10);
  const amount = parseFloat(document.getElementById('form-tx-amount').value);
  const status = document.getElementById('form-tx-status').value;
  const trxId = document.getElementById('form-tx-trx').value.trim();

  const depDate = new Date(dateStr);
  const monthLabel = depDate.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });

  const newTx = {
    uniqueId: 'custom_' + Date.now(),
    depositDate: depDate,
    dateFormatted: formatDate(depDate),
    name: name,
    id: name.split(' ')[0] + '_Custom',
    phone: state.membersMap.get(name)?.phone || '',
    amount: amount,
    shares: shares,
    isExtra: type === 'extra',
    trxId: trxId,
    status: status,
    monthLabel: monthLabel,
  };

  state.customTransactions.push(newTx);
  saveOverrides();

  // Re-process raw data with custom tx included
  state.transactions.unshift(newTx);
  updateKPIs();
  renderPendingQueue();
  applyFiltersAndRenderTable();
  renderCharts();
  renderMembersGrid();

  closeAddTransactionModal();
  showToast(`Recorded new deposit for ${name} (${formatCurrency(amount)})!`, 'success');
}

// ============================================================================
// GOOGLE SPREADSHEET REAL-TIME BRIDGE, DIAGNOSTICS & SETTINGS ENGINE
// ============================================================================

const UPGRADED_APPS_SCRIPT_CODE = `function doGet(e) {
  // 1. Authenticate with secret token
  const SECRET_TOKEN = "AlIkhlasSecure2024!";
  const token = (e && e.parameter && e.parameter.token) ? e.parameter.token : "";
  
  if (token !== SECRET_TOKEN) {
    return ContentService.createTextOutput(JSON.stringify({ 
      error: "Unauthorized: Invalid or missing token" 
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const allSheets = ss.getSheets();

  // 2. Target Sheet GIDs for AL-IKHLAS ASSOCIATION (all member deposit tabs)
  const TARGET_GIDS = [1702656514, 1874744243, 1208245608, 313675577];

  // If a single gid is specifically requested via ?gid=...
  if (e && e.parameter && e.parameter.gid) {
    const singleGid = parseInt(e.parameter.gid, 10);
    const target = allSheets.find(s => s.getSheetId() === singleGid);
    if (target) {
      const data = target.getDataRange().getValues();
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        sheetName: target.getName(),
        sheetId: target.getSheetId(),
        totalRows: data.length,
        data: data
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // 3. Multi-Sheet Combiner: Collect all requested tabs
  const sheetsToRead = [];
  const processedGids = new Set();

  for (const gid of TARGET_GIDS) {
    const s = allSheets.find(sheet => sheet.getSheetId() === gid);
    if (s && !processedGids.has(gid)) {
      sheetsToRead.push(s);
      processedGids.add(gid);
    }
  }

  // Also include any other sheet with transaction headers if not already added
  for (const s of allSheets) {
    const gid = s.getSheetId();
    if (!processedGids.has(gid) && s.getLastRow() > 1) {
      const headerRow = s.getRange(1, 1, 1, Math.min(s.getLastColumn() || 1, 15)).getValues()[0];
      const headerStr = headerRow.join(" ").toLowerCase();
      if (headerStr.includes("deposit") || (headerStr.includes("amount") && headerStr.includes("share"))) {
        sheetsToRead.push(s);
        processedGids.add(gid);
      }
    }
  }

  if (sheetsToRead.length === 0) {
    sheetsToRead.push(ss.getActiveSheet());
  }

  // 4. Read and combine rows across all sheets with dynamic header mapping
  const combinedData = [];
  const sheetSummaries = [];
  let masterHeaders = null;

  sheetsToRead.forEach(s => {
    const values = s.getDataRange().getValues();
    if (!values || values.length <= 1) return;

    const sName = s.getName();
    const sGid = s.getSheetId();
    sheetSummaries.push({
      name: sName,
      gid: sGid,
      rowCount: values.length - 1
    });

    if (!masterHeaders) {
      masterHeaders = [
        "Timestamp",
        "Deposit Date",
        "Name",
        "ID",
        "Contact Number",
        "Amount",
        "TRX. ID",
        "Number of Share",
        "Email Address",
        "Status",
        "Month",
        "Source Sheet",
        "Source GID"
      ];
      combinedData.push(masterHeaders);
    }

    const curHeaders = values[0];
    const colMap = buildColumnMap(curHeaders);

    for (let r = 1; r < values.length; r++) {
      const row = values[r];
      if (!row || row.length === 0) continue;

      const rawName = colMap.name !== -1 ? (row[colMap.name] || "").toString().trim() : "";
      const rawAmt = colMap.amount !== -1 ? parseFloat(row[colMap.amount]) : 0;
      if (!rawName && (isNaN(rawAmt) || rawAmt === 0)) continue;

      const mappedRow = [
        colMap.timestamp !== -1 ? row[colMap.timestamp] : "",
        colMap.depositDate !== -1 ? row[colMap.depositDate] : "",
        rawName,
        colMap.id !== -1 ? row[colMap.id] : "",
        colMap.phone !== -1 ? row[colMap.phone] : "",
        !isNaN(rawAmt) ? rawAmt : 0,
        colMap.trxId !== -1 ? row[colMap.trxId] : "Deposit Slip",
        colMap.shares !== -1 ? row[colMap.shares] : 1,
        colMap.email !== -1 ? row[colMap.email] : "",
        colMap.status !== -1 ? row[colMap.status] : "Received",
        colMap.month !== -1 ? row[colMap.month] : "",
        sName,
        sGid
      ];

      combinedData.push(mappedRow);
    }
  });

  const responsePayload = {
    status: "success",
    timestamp: new Date().toISOString(),
    isMultiSheet: true,
    sheets: sheetSummaries,
    totalRecords: combinedData.length - 1,
    data: combinedData
  };

  return ContentService.createTextOutput(JSON.stringify(responsePayload))
    .setMimeType(ContentService.MimeType.JSON);
}

function buildColumnMap(headers) {
  const map = {
    timestamp: -1,
    depositDate: -1,
    name: -1,
    id: -1,
    phone: -1,
    amount: -1,
    trxId: -1,
    shares: -1,
    email: -1,
    status: -1,
    month: -1
  };

  if (!headers || !Array.isArray(headers)) return map;

  headers.forEach((h, idx) => {
    const str = (h || "").toString().toLowerCase().trim();
    if (str.includes("timestamp")) map.timestamp = idx;
    else if (str.includes("deposit date") || (str.includes("date") && !str.includes("update"))) map.depositDate = idx;
    else if (str.includes("name") || str.includes("member")) map.name = idx;
    else if (str === "id" || str.includes("member id")) map.id = idx;
    else if (str.includes("cause")) map.id = idx;
    else if (str.includes("phone") || str.includes("contact") || str.includes("mobile")) map.phone = idx;
    else if (str.includes("credit") || str.includes("debit") || str.includes("type")) map.phone = idx;
    else if (str.includes("debited amount") || str.includes("amount") || str.includes("taka") || str.includes("bdt")) map.amount = idx;
    else if (str.includes("balance") || str.includes("rest") || str.includes("after")) map.trxId = idx;
    else if (str.includes("trx") || str.includes("transaction") || str.includes("slip") || str.includes("reference")) map.trxId = idx;
    else if (str.includes("message") || str.includes("sms") || str.includes("notice")) map.shares = idx;
    else if (str.includes("share") || str.includes("number of share")) map.shares = idx;
    else if (str.includes("email")) map.email = idx;
    else if (str.includes("status")) map.status = idx;
    else if (str.includes("month")) map.month = idx;
  });

  return map;
}`;

function getApiUrl() {
  try {
    const saved = localStorage.getItem(CONFIG.STORAGE_KEY_SETTINGS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.apiUrl && parsed.apiUrl.trim()) return parsed.apiUrl.trim();
    }
  } catch (e) {}
  return CONFIG.DEFAULT_API_URL;
}

function getToken() {
  try {
    const saved = localStorage.getItem(CONFIG.STORAGE_KEY_SETTINGS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.token && parsed.token.trim()) return parsed.token.trim();
    }
  } catch (e) {}
  return CONFIG.DEFAULT_TOKEN;
}

function populateApiSettingsForm() {
  const urlInput = document.getElementById('setting-api-url');
  const tokenInput = document.getElementById('setting-api-token');
  const codeBlock = document.getElementById('apps-script-code-block');

  if (urlInput) urlInput.value = getApiUrl();
  if (tokenInput) tokenInput.value = getToken();
  if (codeBlock) codeBlock.textContent = UPGRADED_APPS_SCRIPT_CODE;
}

function handleSaveApiSettings(e) {
  if (e) e.preventDefault();
  const urlInput = document.getElementById('setting-api-url');
  const tokenInput = document.getElementById('setting-api-token');
  if (!urlInput || !tokenInput) return;

  const apiUrl = urlInput.value.trim();
  const token = tokenInput.value.trim();

  if (!apiUrl || !apiUrl.startsWith('http')) {
    showToast('Please enter a valid Google Apps Script Web App URL', 'error');
    return;
  }

  const settings = { apiUrl, token: token || CONFIG.DEFAULT_TOKEN };
  localStorage.setItem(CONFIG.STORAGE_KEY_SETTINGS, JSON.stringify(settings));

  showToast('Spreadsheet bridge settings saved! Syncing live data...', 'success');
  fetchLiveData(true);
}

function resetApiSettingsToDefault() {
  localStorage.removeItem(CONFIG.STORAGE_KEY_SETTINGS);
  populateApiSettingsForm();
  showToast('Reset to default Google Apps Script endpoint.', 'info');
  fetchLiveData(true);
}

function copyAppsScriptCode() {
  copyToClipboard(UPGRADED_APPS_SCRIPT_CODE);
}

function updateDiagnosticDisplay(isSuccess, data, errorMessage = '') {
  const statusEl = document.getElementById('diag-bridge-status');
  const dotEl = document.getElementById('diag-status-dot');
  const sheetEl = document.getElementById('diag-sheet-name');
  const countEl = document.getElementById('diag-record-count');
  const lastSyncEl = document.getElementById('diag-last-sync');

  if (isSuccess && data) {
    if (statusEl) statusEl.textContent = 'Live Connected';
    if (dotEl) {
      dotEl.classList.remove('bg-rose-500');
      dotEl.classList.add('bg-emerald-500');
    }
    if (sheetEl) sheetEl.textContent = data.sheetName || state.sheetName || 'Sheet1';
    if (countEl) countEl.textContent = `${data.data.length - 1} Deposits`;
    if (lastSyncEl) lastSyncEl.textContent = state.lastUpdated ? state.lastUpdated.toLocaleTimeString() : 'Just now';
  } else {
    if (statusEl) statusEl.textContent = 'Sync Offline';
    if (dotEl) {
      dotEl.classList.remove('bg-emerald-500');
      dotEl.classList.add('bg-rose-500');
    }
    if (countEl) countEl.textContent = `${state.transactions ? state.transactions.length : 0} Cached`;
  }
}

async function testSpreadsheetConnection() {
  const resultBox = document.getElementById('diag-result-box');
  const btn = event?.currentTarget;
  if (btn) btn.disabled = true;

  if (resultBox) {
    resultBox.classList.remove('hidden');
    resultBox.innerHTML = `
      <div class="flex items-center gap-2 text-amber-400">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <span>Pinging Google Spreadsheet API &amp; fetching live rows...</span>
      </div>
    `;
  }

  const apiUrl = getApiUrl();
  const token = getToken();
  const startTime = Date.now();
  const testUrl = `${apiUrl}?token=${encodeURIComponent(token)}&_t=${startTime}`;

  try {
    const res = await fetch(testUrl, {
      method: 'GET',
      cache: 'no-store'
    });

    const elapsed = Date.now() - startTime;
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

    const data = await res.json();
    if (data.error) throw new Error(data.error);
    if (!data.data || !Array.isArray(data.data)) throw new Error('Invalid payload: missing data array');

    const totalRows = data.data.length;
    const latestRow = data.data[totalRows - 1] || [];
    const detectedSheet = data.sheetName || 'Active Sheet';

    state.sheetName = detectedSheet;
    processRawData(data.data, false);
    state.lastUpdated = new Date();
    updateSyncTimeBadge();
    updateDiagnosticDisplay(true, data);

    if (resultBox) {
      resultBox.innerHTML = `
        <div class="text-emerald-400 font-bold flex items-center gap-2">
          <i class="fa-solid fa-circle-check"></i>
          <span>Connection Test SUCCESSFUL (HTTP 200 OK • ${elapsed}ms)</span>
        </div>
        <div class="text-slate-300 text-[11px] grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800">
          <div><strong class="text-slate-400">Sheet Tabs:</strong> <span class="text-white">${data.isMultiSheet && data.sheets ? `${data.sheets.length} Tabs Combined` : detectedSheet}</span></div>
          <div><strong class="text-slate-400">Total Rows in Sheet:</strong> <span class="text-white">${totalRows} (${totalRows - 1} deposits)</span></div>
          <div><strong class="text-slate-400">Last Synced At:</strong> <span class="text-white">${new Date().toLocaleTimeString()}</span></div>
          <div><strong class="text-slate-400">API Endpoint:</strong> <span class="text-white truncate block">${apiUrl.slice(0, 45)}...</span></div>
        </div>
        ${data.isMultiSheet && data.sheets && data.sheets.length > 0 ? `
          <div class="mt-2 pt-2 border-t border-slate-800 text-[11px]">
            <div class="text-slate-400 font-bold mb-1">Tabs Combined (${data.sheets.length}):</div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-emerald-300">
              ${data.sheets.map(s => `<div>• <strong>${s.name}</strong> (GID: ${s.gid}): <span class="text-slate-300">${s.rowCount} rows</span></div>`).join('')}
            </div>
          </div>
        ` : ''}
        <div class="mt-2 pt-2 border-t border-slate-800 text-[11px]">
          <div class="text-slate-400 font-bold mb-1">Most Recent Row in Spreadsheet:</div>
          <div class="bg-slate-950 p-2 rounded text-emerald-300 truncate">
            ${latestRow[1] || latestRow[0]} • ${latestRow[2] || 'Name'} • ৳${(latestRow[5] || 0).toLocaleString()} • ${latestRow[6] || 'TRX'} • ${latestRow[7] || 'Regular'}
          </div>
        </div>
      `;
    }
    showToast(`Test successful! Loaded ${totalRows - 1} live records from "${detectedSheet}".`, 'success');
  } catch (err) {
    console.error('Test connection error:', err);
    updateDiagnosticDisplay(false, null, err.message);
    if (resultBox) {
      resultBox.innerHTML = `
        <div class="text-rose-400 font-bold flex items-center gap-2">
          <i class="fa-solid fa-circle-xmark"></i>
          <span>Connection Test FAILED: ${err.message}</span>
        </div>
        <div class="text-slate-400 text-[11px] mt-2">
          Troubleshooting Checklist:
          <ul class="list-disc ml-5 mt-1 space-y-1 text-slate-300">
            <li>Verify Google Apps Script is deployed with "Who has access: Anyone".</li>
            <li>Ensure your Secret Access Token matches the one in your script.</li>
            <li>If you recently updated your script, ensure you selected <strong>"New version"</strong> in Manage Deployments.</li>
          </ul>
        </div>
      `;
    }
    showToast(`Test connection failed: ${err.message}`, 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
}

// Fetch Live Fresh Data from Google Apps Script with Cache-Busting
async function fetchLiveData(isManual = false) {
  if (state.isFetching) return;
  state.isFetching = true;

  const refreshIcon = document.getElementById('refresh-icon');
  const syncStatus = document.getElementById('sync-status-text');
  const indicator = document.querySelector('.live-pulse');
  if (refreshIcon) refreshIcon.classList.add('fa-spin');
  if (syncStatus) syncStatus.textContent = 'Syncing...';

  const apiUrl = getApiUrl();
  const token = getToken();
  // Cache busting: pass timestamp _t and use cache: 'no-store'
  const fullUrl = `${apiUrl}?token=${encodeURIComponent(token)}&_t=${Date.now()}`;
  const debitSheetUrl = `${apiUrl}?token=${encodeURIComponent(token)}&gid=1208245608&_t=${Date.now()}`;

  try {
    const [response, debitResponse] = await Promise.all([
      fetch(fullUrl, { method: 'GET', cache: 'no-store' }),
      fetch(debitSheetUrl, { method: 'GET', cache: 'no-store' }).catch(() => null)
    ]);

    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    const result = await response.json();
    if (result.error) throw new Error(result.error);
    if (!result.data || !Array.isArray(result.data)) throw new Error('Invalid data payload');

    if (result.sheetName) {
      state.sheetName = result.sheetName;
    }

    // Cache to localStorage
    localStorage.setItem(CONFIG.STORAGE_KEY_CACHE, JSON.stringify(result));

    // Process & Render primary transactions
    processRawData(result.data, true);

    // If dedicated debited sheet returned pristine rows, process them directly with authentic Balance After
    if (debitResponse && debitResponse.ok) {
      try {
        const debitResult = await debitResponse.json();
        if (debitResult && debitResult.data && Array.isArray(debitResult.data) && debitResult.data.length > 1) {
          processDebitedSheetData(debitResult.data);
        }
      } catch (debitErr) {
        console.warn('Debited list sheet parse error:', debitErr);
      }
    }

    state.lastUpdated = new Date();
    updateSyncTimeBadge();
    updateDiagnosticDisplay(true, result);

    if (indicator) {
      indicator.classList.remove('bg-rose-500');
      indicator.classList.add('bg-emerald-500');
    }

    if (isManual) {
      showToast(`Data live synced! ${result.data.length - 1} records updated from Google Sheet.`, 'success');
    }

  } catch (error) {
    console.error('Fetch error:', error);
    if (syncStatus) syncStatus.textContent = 'Sync Offline';
    if (indicator) {
      indicator.classList.remove('bg-emerald-500');
      indicator.classList.add('bg-rose-500');
    }
    updateDiagnosticDisplay(false, null, error.message);
    if (isManual) {
      showToast(`Sync failed: ${error.message}. Please check connection.`, 'error');
    }
  } finally {
    state.isFetching = false;
    if (refreshIcon) refreshIcon.classList.remove('fa-spin');
  }
}

// Process exact Debited List (gid 1208245608) with authentic 'Balance After'
function processDebitedSheetData(rows) {
  if (!rows || rows.length <= 1) return;
  const headerRow = rows[0] || [];
  const colMap = {
    date: -1,
    amount: -1,
    cause: -1,
    type: -1,
    balanceAfter: -1,
    message: -1
  };

  headerRow.forEach((h, idx) => {
    const s = (h || '').toString().toLowerCase().trim();
    if (s.includes('date')) colMap.date = idx;
    else if (s.includes('debited amount') || s.includes('amount')) colMap.amount = idx;
    else if (s.includes('cause')) colMap.cause = idx;
    else if (s.includes('credit') || s.includes('debit') || s.includes('type')) colMap.type = idx;
    else if (s.includes('balance') || s.includes('rest') || s.includes('after')) colMap.balanceAfter = idx;
    else if (s.includes('message') || s.includes('sms') || s.includes('notice')) colMap.message = idx;
  });

  if (colMap.date === -1) colMap.date = 0;
  if (colMap.amount === -1) colMap.amount = 1;
  if (colMap.cause === -1) colMap.cause = 2;
  if (colMap.type === -1) colMap.type = 3;
  if (colMap.balanceAfter === -1) colMap.balanceAfter = 4;
  if (colMap.message === -1) colMap.message = 5;

  const parsedDebits = [];
  let totalDeb = 0;
  let totalCred = 0;
  let totalWith = 0;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const rawDate = row[colMap.date];
    const d = rawDate ? new Date(rawDate) : null;
    const amt = parseFloat(row[colMap.amount]) || 0;
    const cause = (row[colMap.cause] || '').toString().trim() || 'Account maintenance';
    const type = (row[colMap.type] || '').toString().trim() || (amt >= 50000 ? 'Withdraw' : 'Debit');
    const rawBal = row[colMap.balanceAfter];
    const balAfter = (rawBal !== undefined && rawBal !== null && rawBal !== '' && !isNaN(parseFloat(rawBal))) ? parseFloat(rawBal) : 0;
    const msg = (row[colMap.message] || '').toString().trim();

    const isCredit = type.toLowerCase() === 'credit' || cause.toLowerCase().includes('interest');
    const isWithdraw = type.toLowerCase() === 'withdraw' || cause.toLowerCase().includes('withdraw') || amt >= 50000;

    if (isCredit) {
      totalCred += amt;
    } else if (isWithdraw) {
      totalWith += amt;
    } else {
      totalDeb += amt;
    }

    parsedDebits.push({
      date: d,
      dateFormatted: formatDate(d),
      amount: amt,
      cause: cause,
      type: isCredit ? 'Credit' : (isWithdraw ? 'Withdraw' : 'Debit'),
      rest: balAfter,
      balanceAfter: balAfter,
      message: msg
    });
  }

  if (parsedDebits.length > 0) {
    state.treasury.bankDebits = parsedDebits;
    if (totalDeb > 0) state.treasury.totalDebited = totalDeb;
    if (totalCred > 0) state.treasury.totalCredited = totalCred;
    if (totalWith > 0) state.treasury.totalWithdrawn = totalWith;
    renderTreasuryCards();
    renderBankLedgerTable();
  }
}

function updateSyncTimeBadge() {
  const timeEl = document.getElementById('last-sync-time');
  const syncStatus = document.getElementById('sync-status-text');
  const recordCount = state.transactions ? state.transactions.length : 0;
  if (syncStatus) syncStatus.textContent = `Live Synced (${recordCount})`;
  if (timeEl && state.lastUpdated) {
    timeEl.textContent = state.lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  const printDate = document.getElementById('print-date-display');
  if (printDate) {
    printDate.textContent = 'Generated on: ' + new Date().toLocaleString('en-GB');
  }
}

function setupAutoRefresh() {
  if (state.autoRefreshTimer) {
    clearInterval(state.autoRefreshTimer);
    state.autoRefreshTimer = null;
  }
  if (state.autoRefreshIntervalMs > 0) {
    state.autoRefreshTimer = setInterval(() => {
      fetchLiveData();
    }, state.autoRefreshIntervalMs);
  }
}

// Data Processing Engine (Separating Regular Shares vs Extra Deposits)
function processRawData(rows, triggerToast = false) {
  if (!rows || rows.length <= 1) return;

  state.rawRows = rows;
  const headers = rows[0] || [];
  const colIndex = {
    timestamp: 0,
    depositDate: 1,
    name: 2,
    id: 3,
    phone: 4,
    amount: 5,
    trxId: 6,
    shares: 7,
    email: 8,
    status: 9,
    month: 10,
    sourceSheet: 11,
    sourceGid: 12
  };

  headers.forEach((h, idx) => {
    const str = (h || '').toString().toLowerCase().trim();
    if (str.includes('timestamp')) colIndex.timestamp = idx;
    else if (str.includes('deposit date') || str.includes('date')) colIndex.depositDate = idx;
    else if (str.includes('name') || str.includes('member')) colIndex.name = idx;
    else if (str === 'id' || str.includes('member id')) colIndex.id = idx;
    else if (str.includes('phone') || str.includes('contact') || str.includes('mobile')) colIndex.phone = idx;
    else if (str.includes('amount') || str.includes('taka') || str.includes('bdt')) colIndex.amount = idx;
    else if (str.includes('trx') || str.includes('transaction') || str.includes('slip') || str.includes('reference')) colIndex.trxId = idx;
    else if (str.includes('share') || str.includes('number of share')) colIndex.shares = idx;
    else if (str.includes('email')) colIndex.email = idx;
    else if (str.includes('status')) colIndex.status = idx;
    else if (str.includes('month')) colIndex.month = idx;
    else if (str.includes('source sheet')) colIndex.sourceSheet = idx;
    else if (str.includes('source gid')) colIndex.sourceGid = idx;
  });

  const parsedTransactions = [];
  const members = new Map();
  const bankDebits = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const srcGid = (row[colIndex.sourceGid] || '').toString().trim();
    const srcSheet = (row[colIndex.sourceSheet] || '').toString().trim().toLowerCase();
    const rawName = (row[colIndex.name] || '').toString().trim();
    const rawNameUpper = rawName.toUpperCase();

    // 1. Process Bank Debited List (gid 1208245608 or sheet includes 'debit')
    if (srcGid === '1208245608' || srcSheet.includes('debit')) {
      let debitDate = null;
      if (row[colIndex.depositDate]) {
        debitDate = new Date(row[colIndex.depositDate]);
      }
      const debitAmt = parseFloat(row[colIndex.amount]) || 0;
      const rawCause = row[colIndex.id] || row[3];
      const rawType = row[colIndex.phone] || row[4];
      const rawRest = row[colIndex.trxId] || row[6];
      const rawMsg = row[colIndex.shares] || row[7];

      const fallbackEntry = DEFAULT_BANK_LEDGER[bankDebits.length] || DEFAULT_BANK_LEDGER.find(d => Math.abs(d.amount - debitAmt) < 0.01);

      const cause = (rawCause && rawCause !== 'Deposit Slip' && String(rawCause).trim()) ? String(rawCause).trim() : (fallbackEntry?.cause || 'Account maintenance');
      const type = (rawType && rawType !== 'Deposit Slip' && String(rawType).trim()) ? String(rawType).trim() : (fallbackEntry?.type || (debitAmt >= 50000 ? 'Withdraw' : 'Debit'));
      let rest = (rawRest !== undefined && rawRest !== null && !isNaN(parseFloat(rawRest))) ? parseFloat(rawRest) : (fallbackEntry?.balanceAfter || fallbackEntry?.rest || 0);
      const msg = (rawMsg && rawMsg !== '1' && typeof rawMsg === 'string' && rawMsg.trim()) ? rawMsg.trim() : (fallbackEntry?.message || '');

      bankDebits.push({
        date: debitDate,
        dateFormatted: formatDate(debitDate),
        amount: debitAmt,
        cause: cause,
        type: type,
        rest: rest,
        balanceAfter: rest,
        message: msg
      });
      continue;
    }

    // 2. Process Investment Sheet (gid 313675577 or sheet includes 'invest')
    if (srcGid === '313675577' || srcSheet.includes('invest')) {
      continue;
    }

    // 3. Process Summary Sheet (gid 1874744243 or sheet includes 'summary')
    // Extract executive rollup values without double-counting as transactions
    if (srcGid === '1874744243' || srcSheet.includes('summary') || rawNameUpper === 'TOTAL' || rawNameUpper.includes('FIRST DEPOSIT') || rawNameUpper.includes('FRIST DEPOSIT')) {
      if (row[6] && !isNaN(parseFloat(row[6]))) {
        const val = parseFloat(row[6]);
        if (val > 100000) state.treasury.totalDeposited = val;
        else if (val > 20000 && val < 50000) state.treasury.bankBalance = val;
      }
      if (row[8] && !isNaN(parseFloat(row[8]))) {
        const val = parseFloat(row[8]);
        if (val >= 250000) state.treasury.totalWithdrawn = val;
      }
      continue;
    }

    // 4. Regular Member Deposit Transactions (From Form Responses 1)
    if (!rawName) continue;

    const rawAmt = parseFloat(row[colIndex.amount]);
    const amount = isNaN(rawAmt) ? 0 : rawAmt;

    // Detect Extra Deposit: Check Column 7, Column 6, or Column 10
    const col7Str = (row[colIndex.shares] || '').toString().toLowerCase().trim();
    const col6Str = (row[colIndex.trxId] || '').toString().toLowerCase().trim();
    const col10Str = (row[colIndex.month] || '').toString().toLowerCase().trim();

    const isExtra = col7Str.includes('extra') || col6Str.includes('extra') || col10Str.includes('extra');

    let shares = 0;
    if (!isExtra) {
      const rawShares = parseFloat(row[colIndex.shares]);
      shares = isNaN(rawShares) ? 1 : rawShares;
    }

    // Parse Deposit Date
    let depDate = null;
    const rawDepDate = row[colIndex.depositDate];
    if (rawDepDate) {
      depDate = new Date(rawDepDate);
      if (isNaN(depDate.getTime())) {
        depDate = new Date(row[colIndex.timestamp]);
      }
    } else {
      depDate = new Date(row[colIndex.timestamp]);
    }

    // Unique Identifier for this row
    const uniqueId = `row_${i}_${srcGid}_${rawName}_${amount}_${depDate ? depDate.getTime() : i}`;

    // Status strictly parsed from spreadsheet
    let rawStatus = (row[colIndex.status] || 'Received').toString().trim();
    let status = rawStatus.toLowerCase().includes('pending') ? 'Pending' : 'Received';

    // Phone
    const phone = (row[colIndex.phone] || '').toString().trim();
    const trxId = (row[colIndex.trxId] || 'Deposit Slip Book').toString().trim();

    // Month Label
    let monthLabel = 'Unknown';
    if (depDate && !isNaN(depDate.getTime())) {
      monthLabel = depDate.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
    }

    const tx = {
      uniqueId: uniqueId,
      rowIndex: i,
      timestamp: row[colIndex.timestamp],
      depositDate: depDate,
      dateFormatted: formatDate(depDate),
      name: rawName,
      id: (row[colIndex.id] || '').toString().trim(),
      phone: phone,
      amount: amount,
      shares: shares,
      isExtra: isExtra,
      trxId: trxId,
      email: (row[colIndex.email] || '').toString().trim(),
      status: status,
      monthLabel: monthLabel,
      sourceSheet: srcSheet,
      sourceGid: srcGid
    };

    parsedTransactions.push(tx);

    // Member Aggregation
    if (!members.has(rawName)) {
      members.set(rawName, {
        name: rawName,
        id: tx.id,
        phone: phone,
        totalAmount: 0,
        regularAmount: 0,
        extraAmount: 0,
        receivedAmount: 0,
        pendingAmount: 0,
        totalShares: 0,
        regularCount: 0,
        extraCount: 0,
        depositCount: 0,
        transactions: [],
      });
    }

    const m = members.get(rawName);
    m.totalAmount += amount;
    if (isExtra) {
      m.extraAmount += amount;
      m.extraCount += 1;
    } else {
      m.regularAmount += amount;
      m.totalShares += shares;
      m.regularCount += 1;
    }

    if (status === 'Received') {
      m.receivedAmount += amount;
    } else {
      m.pendingAmount += amount;
    }
    m.depositCount += 1;
    if (phone && !m.phone) m.phone = phone;
    m.transactions.push(tx);
  }

  if (bankDebits.length > 0) {
    state.treasury.bankDebits = bankDebits;
  }

  // Prepend custom transactions added via admin panel
  state.customTransactions.forEach(ctx => {
    parsedTransactions.unshift(ctx);
    if (members.has(ctx.name)) {
      const m = members.get(ctx.name);
      m.totalAmount += ctx.amount;
      if (ctx.isExtra) {
        m.extraAmount += ctx.amount;
        m.extraCount++;
      } else {
        m.regularAmount += ctx.amount;
        m.totalShares += ctx.shares;
        m.regularCount++;
      }
      if (ctx.status === 'Received') m.receivedAmount += ctx.amount;
      else m.pendingAmount += ctx.amount;
      m.depositCount++;
      m.transactions.unshift(ctx);
    }
  });

  // Sort chronologically descending
  parsedTransactions.sort((a, b) => (b.depositDate || 0) - (a.depositDate || 0));

  state.transactions = parsedTransactions;
  state.membersMap = members;

  populateFilterDropdowns();
  updateKPIs();
  renderTreasuryCards();
  renderBankLedgerTable();
  renderCharts();
  renderMembersGrid();
  renderPendingQueue();
  applyFiltersAndRenderTable();
  updateDashboardForRole();
}

// KPI Calculation Engine
function updateKPIs() {
  let totalAmount = 0;
  let regularAmount = 0;
  let extraAmount = 0;
  let receivedAmount = 0;
  let pendingAmount = 0;
  let totalShares = 0;
  let extraCount = 0;
  let receivedCount = 0;
  let pendingCount = 0;

  state.transactions.forEach(tx => {
    totalAmount += tx.amount;
    if (tx.isExtra) {
      extraAmount += tx.amount;
      extraCount++;
    } else {
      regularAmount += tx.amount;
      totalShares += tx.shares;
    }

    if (tx.status === 'Received') {
      receivedAmount += tx.amount;
      receivedCount++;
    } else {
      pendingAmount += tx.amount;
      pendingCount++;
    }
  });

  const memberCount = state.membersMap.size;
  const avgMember = memberCount > 0 ? (totalAmount / memberCount) : 0;
  const collectionRate = totalAmount > 0 ? ((receivedAmount / totalAmount) * 100).toFixed(1) : 100;

  // DOM Elements Update
  document.getElementById('kpi-total-amount').textContent = formatCurrency(totalAmount);
  document.getElementById('kpi-received-amount').textContent = formatCurrency(receivedAmount);
  document.getElementById('kpi-pending-amount').textContent = formatCurrency(pendingAmount);

  document.getElementById('kpi-regular-amount').textContent = formatCurrency(regularAmount);
  document.getElementById('kpi-total-shares').textContent = totalShares;

  document.getElementById('kpi-extra-amount').textContent = formatCurrency(extraAmount);
  document.getElementById('kpi-extra-count').textContent = `${extraCount} tx`;

  document.getElementById('kpi-total-members').textContent = memberCount;
  document.getElementById('kpi-avg-member').textContent = formatCurrency(avgMember);

  document.getElementById('kpi-collection-rate').textContent = `${collectionRate}%`;
  document.getElementById('kpi-received-count').textContent = `${receivedCount} Approved`;

  const pendingCountEl = document.getElementById('kpi-pending-count');
  if (pendingCountEl) {
    if (pendingCount > 0) {
      pendingCountEl.className = 'text-amber-600 dark:text-amber-400 font-bold';
      pendingCountEl.textContent = `${pendingCount} Pending`;
    } else {
      pendingCountEl.className = 'text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1';
      pendingCountEl.innerHTML = '<i class="fa-solid fa-circle-check text-[10px]"></i> 0 Pending';
    }
  }

  const pendingAmtEl = document.getElementById('kpi-pending-amount');
  if (pendingAmtEl) {
    pendingAmtEl.textContent = formatCurrency(pendingAmount);
    if (pendingAmount === 0) {
      pendingAmtEl.className = 'text-emerald-600 dark:text-emerald-400 font-bold text-xs';
    } else {
      pendingAmtEl.className = 'text-amber-600 dark:text-amber-400 font-bold text-xs';
    }
  }

  const ledgerTab = document.getElementById('ledger-tab-count');
  if (ledgerTab) ledgerTab.textContent = state.transactions.length;
}

// Treasury & Bank Balance Renderers (Tabs: Summary, Debited List, Investment)
function renderTreasuryCards() {
  const bankEl = document.getElementById('treasury-bank-balance');
  const investEl = document.getElementById('treasury-invest-amount');
  const debitedEl = document.getElementById('treasury-debited-amount');
  const creditedEl = document.getElementById('treasury-credited-amount');

  if (bankEl) bankEl.textContent = formatCurrency(state.treasury.bankBalance);
  if (investEl) investEl.textContent = formatCurrency(state.treasury.totalWithdrawn);
  if (debitedEl) debitedEl.textContent = formatDecimalCurrency(state.treasury.totalDebited || 825.02);
  if (creditedEl) creditedEl.textContent = '+' + formatDecimalCurrency(state.treasury.totalCredited || 887.43);
}

function renderBankLedgerTable() {
  const tbody = document.getElementById('bank-ledger-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const balEl = document.getElementById('bank-ledger-modal-balance');
  const invEl = document.getElementById('bank-ledger-modal-invest');
  const feeEl = document.getElementById('bank-ledger-modal-fees');
  const intEl = document.getElementById('bank-ledger-modal-interest');

  if (balEl) balEl.textContent = formatDecimalCurrency(state.treasury.bankBalance || 20562.41);
  if (invEl) invEl.textContent = formatDecimalCurrency(state.treasury.totalWithdrawn || 300000.00);
  if (feeEl) feeEl.textContent = formatDecimalCurrency(state.treasury.totalDebited || 825.02);
  if (intEl) intEl.textContent = '+' + formatDecimalCurrency(state.treasury.totalCredited || 887.43);

  const entries = (state.treasury.bankDebits && state.treasury.bankDebits.length > 0)
    ? state.treasury.bankDebits
    : DEFAULT_BANK_LEDGER;

  entries.forEach(item => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors';
    const isCredit = item.type === 'Credit' || (item.cause && item.cause.toLowerCase().includes('interest'));
    const isWithdraw = item.type === 'Withdraw' || item.amount >= 50000;
    const badgeClass = isCredit ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                       isWithdraw ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                       'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';

    const balAfter = (item.balanceAfter !== undefined && item.balanceAfter !== null && item.balanceAfter !== '')
      ? item.balanceAfter
      : item.rest;

    tr.innerHTML = `
      <td class="py-2.5 px-3 text-slate-800 dark:text-slate-200 font-semibold">${item.dateFormatted || '-'}</td>
      <td class="py-2.5 px-3 text-slate-700 dark:text-slate-300 font-medium">${item.cause || 'Maintenance'}</td>
      <td class="py-2.5 px-3 text-center">
        <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${badgeClass}">${item.type || 'Debit'}</span>
      </td>
      <td class="py-2.5 px-3 text-right font-bold ${isCredit ? 'text-emerald-600' : isWithdraw ? 'text-blue-600' : 'text-rose-600'}">
        ${isCredit ? '+' : '-'}${formatDecimalCurrency(item.amount)}
      </td>
      <td class="py-2.5 px-3 text-right font-black text-slate-900 dark:text-slate-100 bg-amber-50/50 dark:bg-amber-950/20">${formatDecimalCurrency(balAfter)}</td>
      <td class="py-2.5 px-3 text-[10px] text-slate-500 dark:text-slate-400 font-sans truncate max-w-xs" title="${item.message || ''}">${item.message || '-'}</td>
    `;
    tbody.appendChild(tr);
  });
}

function openBankLedgerModal() {
  renderBankLedgerTable();
  const m = document.getElementById('modal-bank-ledger');
  if (m) {
    m.classList.remove('hidden');
    m.classList.add('flex');
  }
}

function closeBankLedgerModal() {
  const m = document.getElementById('modal-bank-ledger');
  if (m) {
    m.classList.add('hidden');
    m.classList.remove('flex');
  }
}

function openInvestmentModal() {
  const m = document.getElementById('modal-investment');
  if (m) {
    m.classList.remove('hidden');
    m.classList.add('flex');
  }
}

function closeInvestmentModal() {
  const m = document.getElementById('modal-investment');
  if (m) {
    m.classList.add('hidden');
    m.classList.remove('flex');
  }
}

// Populate Filters
function populateFilterDropdowns() {
  const memberSelect = document.getElementById('ledger-filter-member');
  const monthSelect = document.getElementById('ledger-filter-month');
  if (!memberSelect || !monthSelect) return;

  const curMember = memberSelect.value;
  const curMonth = monthSelect.value;

  // Members
  memberSelect.innerHTML = '<option value="">All Members</option>';
  Array.from(state.membersMap.keys()).sort().forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    if (name === curMember) opt.selected = true;
    memberSelect.appendChild(opt);
  });

  // Months
  monthSelect.innerHTML = '<option value="">All Months</option>';
  const uniqueMonths = new Set();
  state.transactions.forEach(tx => {
    if (tx.monthLabel && tx.monthLabel !== 'Unknown') uniqueMonths.add(tx.monthLabel);
  });
  Array.from(uniqueMonths).forEach(m => {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m;
    if (m === curMonth) opt.selected = true;
    monthSelect.appendChild(opt);
  });
}

// Charts Engine (Chart.js)
function renderCharts() {
  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#334155' : '#f1f5f9';

  // 1. Monthly Stacked Bar (Regular Shares vs Extra Deposits)
  const monthlyDataMap = new Map();
  state.transactions.forEach(tx => {
    const m = tx.monthLabel;
    if (m === 'Unknown') return;
    if (!monthlyDataMap.has(m)) {
      monthlyDataMap.set(m, { regular: 0, extra: 0, total: 0 });
    }
    const cur = monthlyDataMap.get(m);
    if (tx.isExtra) {
      cur.extra += tx.amount;
    } else {
      cur.regular += tx.amount;
    }
    cur.total += tx.amount;
  });

  const months = Array.from(monthlyDataMap.keys());
  const regularMonthly = months.map(m => monthlyDataMap.get(m).regular);
  const extraMonthly = months.map(m => monthlyDataMap.get(m).extra);

  let cum = 0;
  const cumulativeData = months.map(m => {
    cum += monthlyDataMap.get(m).total;
    return cum;
  });

  if (state.charts.monthly) state.charts.monthly.destroy();
  const ctxMonthly = document.getElementById('chart-monthly-trend')?.getContext('2d');
  if (ctxMonthly) {
    state.charts.monthly = new Chart(ctxMonthly, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            type: 'line',
            label: 'Cumulative Total (৳)',
            data: cumulativeData,
            borderColor: '#f59e0b',
            borderWidth: 3,
            tension: 0.35,
            fill: false,
            yAxisID: 'y1',
            pointRadius: 4,
            pointBackgroundColor: '#f59e0b',
          },
          {
            type: 'bar',
            label: 'Regular Share Capital (৳)',
            data: regularMonthly,
            backgroundColor: '#047857',
            borderRadius: 6,
            stack: 'combined',
            yAxisID: 'y',
          },
          {
            type: 'bar',
            label: 'Extra Deposits (৳)',
            data: extraMonthly,
            backgroundColor: '#8b5cf6',
            borderRadius: 6,
            stack: 'combined',
            yAxisID: 'y',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'top',
            labels: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 11, weight: 'bold' } }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ৳ ${ctx.raw.toLocaleString('en-IN')}`
            }
          }
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 10 } }
          },
          y: {
            position: 'left',
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              callback: val => '৳' + (val / 1000) + 'k',
              font: { family: 'Plus Jakarta Sans', size: 10 }
            }
          },
          y1: {
            position: 'right',
            grid: { drawOnChartArea: false },
            ticks: {
              color: '#f59e0b',
              callback: val => '৳' + (val / 1000) + 'k',
              font: { family: 'Plus Jakarta Sans', size: 10 }
            }
          }
        }
      }
    });
  }

  // 2. Member Shares Pie
  const sortedMembersByShares = Array.from(state.membersMap.values()).sort((a, b) => b.totalShares - a.totalShares);
  const shareLabels = sortedMembersByShares.map(m => m.name);
  const shareCounts = sortedMembersByShares.map(m => m.totalShares);
  const shareColors = sortedMembersByShares.map(m => stringToColor(m.name));

  if (state.charts.shares) state.charts.shares.destroy();
  const ctxShares = document.getElementById('chart-shares-pie')?.getContext('2d');
  if (ctxShares) {
    state.charts.shares = new Chart(ctxShares, {
      type: 'doughnut',
      data: {
        labels: shareLabels,
        datasets: [{
          data: shareCounts,
          backgroundColor: shareColors,
          borderWidth: 2,
          borderColor: isDark ? '#0f172a' : '#ffffff',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { boxWidth: 12, color: textColor, font: { family: 'Plus Jakarta Sans', size: 10 } }
          },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.label}: ${ctx.raw} Shares (${((ctx.raw / 145) * 100).toFixed(1)}%)`
            }
          }
        },
        cutout: '65%'
      }
    });
  }

  // 3. Member Ranking Stacked Bar: Regular Capital vs Extra Deposit
  const sortedMembersByTotal = Array.from(state.membersMap.values()).sort((a, b) => b.totalAmount - a.totalAmount);
  const rankLabels = sortedMembersByTotal.map(m => m.name);
  const rankReg = sortedMembersByTotal.map(m => m.regularAmount);
  const rankExtra = sortedMembersByTotal.map(m => m.extraAmount);

  if (state.charts.ranking) state.charts.ranking.destroy();
  const ctxRanking = document.getElementById('chart-member-ranking')?.getContext('2d');
  if (ctxRanking) {
    state.charts.ranking = new Chart(ctxRanking, {
      type: 'bar',
      data: {
        labels: rankLabels,
        datasets: [
          {
            label: 'Regular Share Capital (৳)',
            data: rankReg,
            backgroundColor: '#047857',
            borderRadius: 6,
          },
          {
            label: 'Extra Deposit (৳)',
            data: rankExtra,
            backgroundColor: '#8b5cf6',
            borderRadius: 6,
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 10 } }
          },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.dataset.label}: ৳ ${ctx.raw.toLocaleString('en-IN')}`
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              callback: val => '৳' + (val / 1000) + 'k',
              font: { family: 'Plus Jakarta Sans', size: 10 }
            }
          },
          y: {
            stacked: true,
            grid: { display: false },
            ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' } }
          }
        }
      }
    });
  }

  // 4. Instruments / Payment Channels
  const instrumentMap = new Map();
  state.transactions.forEach(tx => {
    let key = tx.trxId;
    if (key.toLowerCase().includes('slip')) {
      key = 'Deposit Slip Book';
    } else if (key.length > 10 || key.toLowerCase().includes('bank') || key.toLowerCase().includes('transfer')) {
      key = 'Bank / Online TRX';
    } else {
      key = 'Other / Reference';
    }
    instrumentMap.set(key, (instrumentMap.get(key) || 0) + 1);
  });

  if (state.charts.instruments) state.charts.instruments.destroy();
  const ctxInst = document.getElementById('chart-instruments')?.getContext('2d');
  if (ctxInst) {
    state.charts.instruments = new Chart(ctxInst, {
      type: 'pie',
      data: {
        labels: Array.from(instrumentMap.keys()),
        datasets: [{
          data: Array.from(instrumentMap.values()),
          backgroundColor: ['#0d9488', '#3b82f6', '#f59e0b', '#8b5cf6'],
          borderWidth: 2,
          borderColor: isDark ? '#0f172a' : '#ffffff',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 11 } }
          }
        }
      }
    });
  }
}

// Render Member Grid Cards
function renderMembersGrid() {
  const container = document.getElementById('members-grid');
  const searchInput = document.getElementById('member-search-input');
  const query = (searchInput?.value || '').toLowerCase().trim();

  if (!container) return;
  container.innerHTML = '';

  const membersList = Array.from(state.membersMap.values()).filter(m => {
    if (!query) return true;
    return m.name.toLowerCase().includes(query) || (m.phone && m.phone.includes(query)) || (m.id && m.id.toLowerCase().includes(query));
  });

  membersList.sort((a, b) => b.totalAmount - a.totalAmount);
  document.getElementById('member-count-badge').textContent = `Showing ${membersList.length} Members`;

  membersList.forEach((m, idx) => {
    const card = document.createElement('div');
    card.className = 'bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-brand-500/50 transition-all flex flex-col justify-between';

    const avatarBg = stringToColor(m.name);
    const hasPending = m.pendingAmount > 0;

    let cleanPhone = m.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = '88' + cleanPhone;

    // Check user role from state.users
    const assignedUser = state.users.find(u => 
      (u.sheetName && u.sheetName.toLowerCase() === m.name.toLowerCase()) ||
      u.name.toLowerCase() === m.name.toLowerCase()
    );
    const roleBadge = assignedUser ? assignedUser.role : 'Member';
    const userNid = assignedUser ? assignedUser.nid : '';
    const userNominee = assignedUser ? assignedUser.nomineeName : '';
    const userNomineeRel = assignedUser ? assignedUser.nomineeRelation : '';
    const userTenure = `${assignedUser?.membershipFrom || '2025-2026'} → ${assignedUser?.membershipTo || '2035-2036'}`;
    const userShares = assignedUser?.assignedShares || 15;

    card.innerHTML = `
      <div>
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            ${renderUserAvatar(assignedUser || { name: m.name }, 'w-12 h-12 rounded-2xl shadow-md', 'text-sm')}
            <div>
              <div class="flex items-center gap-1.5">
                <h4 class="font-bold text-base text-slate-900 dark:text-white leading-tight">
                  ${m.name}
                </h4>
              </div>
              <div class="flex items-center gap-1.5 mt-0.5">
                <span class="text-xs font-mono text-slate-400">${m.id || 'Member #' + (idx + 1)}</span>
                <span class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">${roleBadge}</span>
              </div>
            </div>
          </div>
          
          <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${hasPending ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'}">
            ${hasPending ? 'Dues Pending' : 'Paid Up'}
          </span>
        </div>

        <!-- Financial Breakdown Cards: Regular vs Extra -->
        <div class="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div class="bg-emerald-50/50 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
            <span class="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400 block">Regular Capital</span>
            <span class="text-sm font-extrabold text-emerald-700 dark:text-emerald-300">${formatCurrency(m.regularAmount)}</span>
            <span class="text-[10px] text-emerald-600 block">${m.totalShares} Shares</span>
          </div>
          <div class="bg-purple-50/50 dark:bg-purple-950/20 p-2.5 rounded-xl border border-purple-100 dark:border-purple-900/30">
            <span class="text-[10px] uppercase font-bold text-purple-800 dark:text-purple-400 block">Extra Deposit</span>
            <span class="text-sm font-extrabold text-purple-700 dark:text-purple-300">${formatCurrency(m.extraAmount)}</span>
            <span class="text-[10px] text-purple-600 block">${m.extraCount} Deposits</span>
          </div>
        </div>

        <div class="flex items-center justify-between text-xs text-slate-500 mt-3 px-1">
          <span>Grand Total: <strong class="text-slate-900 dark:text-white font-black">${formatCurrency(m.totalAmount)}</strong></span>
          ${hasPending ? `<span class="text-rose-500 font-bold">Pending: ${formatCurrency(m.pendingAmount)}</span>` : '<span class="text-emerald-600 font-medium">✓ 100% Cleared</span>'}
        </div>

        <!-- Identification, Nominee & Membership Tenure Badges -->
        <div class="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
          <div class="flex items-center justify-between">
            <span class="text-slate-400 flex items-center gap-1"><i class="fa-solid fa-id-card text-[10px]"></i> Own NID:</span>
            <span class="font-mono font-semibold text-slate-700 dark:text-slate-300">${userNid || '<span class="text-slate-400 font-normal italic">Not set</span>'}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-400 flex items-center gap-1"><i class="fa-solid fa-user-shield text-[10px]"></i> Nominee:</span>
            <span class="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[150px]">${userNominee ? `${userNominee} ${userNomineeRel ? '(' + userNomineeRel + ')' : ''}` : '<span class="text-slate-400 font-normal italic">None</span>'}</span>
          </div>
          <div class="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60">
            <span class="text-slate-400 flex items-center gap-1"><i class="fa-solid fa-calendar-check text-[10px] text-emerald-600"></i> Tenure:</span>
            <span class="font-semibold text-slate-700 dark:text-slate-300">${userTenure}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-400 flex items-center gap-1"><i class="fa-solid fa-layer-group text-[10px] text-amber-600"></i> Subscribed:</span>
            <span class="font-extrabold text-brand-700 dark:text-brand-300">${userShares} Shares</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
        ${cleanPhone ? `
          <a href="https://wa.me/${cleanPhone}" target="_blank" title="WhatsApp Message" class="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold flex items-center justify-center transition">
            <i class="fa-brands fa-whatsapp text-sm"></i>
          </a>
          <a href="tel:${m.phone}" title="Call Member" class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center justify-center transition">
            <i class="fa-solid fa-phone text-xs"></i>
          </a>
        ` : ''}

        ${isAdmin() && assignedUser ? `
          <button onclick="openAddUserModal('${assignedUser.id}')" title="Admin: Edit Member Photo, NID &amp; Role" class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center justify-center transition">
            <i class="fa-solid fa-user-pen text-xs"></i>
          </button>
        ` : ''}

        <button onclick="openMemberStatement('${m.name.replace(/'/g, "\\'")}')" class="flex-1 py-2 px-3 rounded-xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/50 dark:hover:bg-brand-900/60 text-brand-800 dark:text-brand-300 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-brand-200 dark:border-brand-800">
          <i class="fa-solid fa-file-invoice text-xs"></i>
          <span>View Statement</span>
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

// Open Member Statement Modal
function openMemberStatement(memberName) {
  let member = state.membersMap.get(memberName);
  if (!member) {
    member = getMemberDataForUser({ name: memberName });
  }
  if (!member) return;

  // Match user record for NID & Nominee info
  const assignedUser = state.users.find(u => 
    (u.sheetName && u.sheetName.toLowerCase() === member.name.toLowerCase()) ||
    u.name.toLowerCase() === member.name.toLowerCase()
  );

  document.getElementById('modal-member-name').textContent = member.name;
  document.getElementById('modal-member-id').textContent = member.id || 'N/A';
  document.getElementById('modal-member-regular').textContent = formatCurrency(member.regularAmount);
  document.getElementById('modal-member-shares').textContent = `${member.totalShares} Shares (৳2k/sh)`;
  document.getElementById('modal-member-extra').textContent = formatCurrency(member.extraAmount);
  document.getElementById('modal-member-extra-count').textContent = `${member.extraCount} Extra Slips`;
  document.getElementById('modal-member-total').textContent = formatCurrency(member.totalAmount);
  document.getElementById('modal-member-status').textContent = member.pendingAmount > 0 ? `Pending: ${formatCurrency(member.pendingAmount)}` : 'Cleared';

  // NID & Nominee fields
  const nidEl = document.getElementById('modal-member-nid');
  const nomineeEl = document.getElementById('modal-member-nominee');
  const tenureEl = document.getElementById('modal-member-tenure');
  const subscribedSharesEl = document.getElementById('modal-member-subscribed-shares');

  if (nidEl) {
    nidEl.textContent = (assignedUser && assignedUser.nid) ? assignedUser.nid : 'Not Recorded';
  }
  if (nomineeEl) {
    if (assignedUser && assignedUser.nomineeName) {
      const rel = assignedUser.nomineeRelation ? ` (${assignedUser.nomineeRelation})` : '';
      const nNid = assignedUser.nomineeNid ? ` • NID: ${assignedUser.nomineeNid}` : '';
      nomineeEl.textContent = `${assignedUser.nomineeName}${rel}${nNid}`;
    } else {
      nomineeEl.textContent = 'None Recorded';
    }
  }
  if (tenureEl) {
    const fromYear = assignedUser && assignedUser.membershipFrom ? assignedUser.membershipFrom : '2025-2026';
    const toYear = assignedUser && assignedUser.membershipTo ? assignedUser.membershipTo : '2035-2036';
    tenureEl.textContent = `${fromYear} to ${toYear}`;
  }
  if (subscribedSharesEl) {
    const sh = assignedUser && assignedUser.assignedShares ? assignedUser.assignedShares : 15;
    subscribedSharesEl.textContent = `${sh} Shares`;
  }

  const tbody = document.getElementById('modal-statement-body');
  tbody.innerHTML = '';

  member.transactions.forEach(tx => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 dark:hover:bg-slate-800/50';

    const typeBadge = tx.isExtra ? 
      '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">Extra Deposit</span>' :
      '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Regular Share</span>';

    tr.innerHTML = `
      <td class="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300">${tx.dateFormatted}</td>
      <td class="py-2.5 px-3 text-center">${typeBadge}</td>
      <td class="py-2.5 px-3 font-mono text-[11px] text-slate-500">${tx.trxId}</td>
      <td class="py-2.5 px-3 text-center font-bold text-slate-700 dark:text-slate-300">${tx.isExtra ? '-' : tx.shares}</td>
      <td class="py-2.5 px-3 text-right font-extrabold text-brand-700 dark:text-brand-400">${formatCurrency(tx.amount)}</td>
      <td class="py-2.5 px-3 text-center">
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${tx.status === 'Received' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'}">
          ${tx.status}
        </span>
      </td>
    `;
    tbody.appendChild(tr);
  });

  const modal = document.getElementById('modal-statement');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeStatementModal() {
  document.getElementById('modal-statement').classList.add('hidden');
  document.getElementById('modal-statement').classList.remove('flex');
}

// Table Filtering, Sorting & Pagination
function applyFiltersAndRenderTable() {
  const search = state.filters.search.toLowerCase().trim();
  const selMember = state.filters.member;
  const selType = state.filters.type;
  const selMonth = state.filters.month;
  const selStatus = state.filters.status;

  let filtered = state.transactions.filter(tx => {
    if (search) {
      const match = tx.name.toLowerCase().includes(search) ||
                    tx.id.toLowerCase().includes(search) ||
                    tx.trxId.toLowerCase().includes(search) ||
                    tx.phone.includes(search) ||
                    tx.dateFormatted.toLowerCase().includes(search);
      if (!match) return false;
    }
    if (selMember && tx.name !== selMember) return false;
    if (selType === 'regular' && tx.isExtra) return false;
    if (selType === 'extra' && !tx.isExtra) return false;
    if (selMonth && tx.monthLabel !== selMonth) return false;
    if (selStatus && tx.status !== selStatus) return false;
    return true;
  });

  // Sorting
  filtered.sort((a, b) => {
    let valA = a[state.sort.field];
    let valB = b[state.sort.field];

    if (state.sort.field === 'depositDate') {
      valA = a.depositDate ? a.depositDate.getTime() : 0;
      valB = b.depositDate ? b.depositDate.getTime() : 0;
    }

    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return state.sort.direction === 'asc' ? -1 : 1;
    if (valA > valB) return state.sort.direction === 'asc' ? 1 : -1;
    return 0;
  });

  state.filteredTransactions = filtered;

  // Update Summary Indicators for Filtered Data
  let filteredTotalAmount = 0;
  let filteredRegularAmount = 0;
  let filteredExtraAmount = 0;

  filtered.forEach(tx => {
    filteredTotalAmount += tx.amount;
    if (tx.isExtra) filteredExtraAmount += tx.amount;
    else filteredRegularAmount += tx.amount;
  });

  const totalEl = document.getElementById('filtered-total-amount');
  if (totalEl) {
    totalEl.textContent = formatCurrency(filteredTotalAmount);
    document.getElementById('filtered-regular-amount').textContent = formatCurrency(filteredRegularAmount);
    document.getElementById('filtered-extra-amount').textContent = formatCurrency(filteredExtraAmount);
    document.getElementById('filtered-row-count').textContent = filtered.length;
    renderTablePage();
  }
}

function renderTablePage() {
  const tbody = document.getElementById('ledger-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  const total = state.filteredTransactions.length;
  const pageSize = state.pagination.pageSize;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (state.pagination.page > totalPages) state.pagination.page = totalPages;

  const startIdx = (state.pagination.page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const pageRows = state.filteredTransactions.slice(startIdx, endIdx);

  if (pageRows.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="py-8 text-center text-slate-400">
          <i class="fa-solid fa-folder-open text-2xl mb-2 block"></i>
          No transactions match your search or filter criteria.
        </td>
      </tr>
    `;
    renderPagination(0, 0, 0, 1);
    return;
  }

  const canApprove = canApprovePayments();

  pageRows.forEach(tx => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors';

    const isExtra = tx.isExtra;
    const typeBadge = isExtra ? 
      '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800"><i class="fa-solid fa-coins mr-1 text-[9px]"></i>Extra Deposit</span>' :
      `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"><i class="fa-solid fa-layer-group mr-1 text-[9px]"></i>Share Capital</span>`;

    const statusBadge = tx.status === 'Received' ? 
      '<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Received</span>' :
      '<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Pending</span>';

    // Status action button for admin
    let adminStatusToggle = statusBadge;
    if (canApprove) {
      if (tx.status === 'Pending') {
        adminStatusToggle = `
          <button onclick="togglePaymentApproval('${tx.uniqueId}', 'Received')" title="Click to Approve & Mark Received" class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 hover:bg-emerald-600 hover:text-white text-amber-800 transition flex items-center gap-1 mx-auto shadow-sm">
            <span>Pending</span>
            <i class="fa-solid fa-circle-check text-xs"></i>
          </button>
        `;
      } else {
        adminStatusToggle = `
          <button onclick="togglePaymentApproval('${tx.uniqueId}', 'Pending')" title="Click to mark back as Pending" class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 hover:bg-amber-100 hover:text-amber-800 text-emerald-800 transition flex items-center gap-1 mx-auto">
            <span>Received</span>
            <i class="fa-solid fa-check text-[10px]"></i>
          </button>
        `;
      }
    }

    const txUser = state.users.find(u => u.name.toLowerCase() === tx.name.toLowerCase() || (u.sheetName && u.sheetName.toLowerCase() === tx.name.toLowerCase()));

    tr.innerHTML = `
      <td class="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
        ${tx.dateFormatted}
      </td>
      <td class="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
        ${renderUserAvatar(txUser || { name: tx.name }, 'w-6 h-6 rounded-full', 'text-[10px]')}
        <span>${tx.name}</span>
      </td>
      <td class="py-3 px-4 text-center">
        ${typeBadge}
      </td>
      <td class="py-3 px-4 text-right font-black ${isExtra ? 'text-purple-700 dark:text-purple-400' : 'text-brand-700 dark:text-brand-400'} text-sm">
        ${formatCurrency(tx.amount)}
      </td>
      <td class="py-3 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
        ${isExtra ? '<span class="text-slate-400">-</span>' : tx.shares}
      </td>
      <td class="py-3 px-4">
        <div class="flex items-center gap-1.5 font-mono text-[11px] text-slate-500 dark:text-slate-400 max-w-xs truncate" title="${tx.trxId}">
          <span class="truncate">${tx.trxId}</span>
          <button onclick="copyToClipboard('${tx.trxId.replace(/'/g, "\\'")}')" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 no-print" title="Copy Reference">
            <i class="fa-regular fa-copy text-[10px]"></i>
          </button>
        </div>
      </td>
      <td class="py-3 px-4 text-center">
        ${adminStatusToggle}
      </td>
      <td class="py-3 px-4 text-center no-print">
        <button onclick="openMemberStatement('${tx.name.replace(/'/g, "\\'")}')" class="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-brand-700 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-950/60 transition">
          <i class="fa-solid fa-receipt mr-1"></i> Statement
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  renderPagination(startIdx + 1, endIdx, total, totalPages);
}

function renderPagination(start, end, total, totalPages) {
  const infoEl = document.getElementById('pagination-info');
  const btnsEl = document.getElementById('pagination-buttons');
  if (!infoEl || !btnsEl) return;

  infoEl.textContent = total > 0 ? `Showing ${start} to ${end} of ${total} records` : 'No records';
  btnsEl.innerHTML = '';

  if (totalPages <= 1) return;

  const prevBtn = document.createElement('button');
  prevBtn.disabled = state.pagination.page === 1;
  prevBtn.className = `p-1.5 px-2.5 rounded-lg border text-xs ${state.pagination.page === 1 ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'}`;
  prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
  prevBtn.onclick = () => {
    if (state.pagination.page > 1) {
      state.pagination.page--;
      renderTablePage();
    }
  };
  btnsEl.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= state.pagination.page - 1 && i <= state.pagination.page + 1)) {
      const pageBtn = document.createElement('button');
      pageBtn.className = `px-2.5 py-1 rounded-lg text-xs font-semibold ${i === state.pagination.page ? 'bg-brand-700 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`;
      pageBtn.textContent = i;
      pageBtn.onclick = () => {
        state.pagination.page = i;
        renderTablePage();
      };
      btnsEl.appendChild(pageBtn);
    } else if (i === state.pagination.page - 2 || i === state.pagination.page + 2) {
      const dots = document.createElement('span');
      dots.className = 'px-1 text-slate-400';
      dots.textContent = '...';
      btnsEl.appendChild(dots);
    }
  }

  const nextBtn = document.createElement('button');
  nextBtn.disabled = state.pagination.page === totalPages;
  nextBtn.className = `p-1.5 px-2.5 rounded-lg border text-xs ${state.pagination.page === totalPages ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'}`;
  nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
  nextBtn.onclick = () => {
    if (state.pagination.page < totalPages) {
      state.pagination.page++;
      renderTablePage();
    }
  };
  btnsEl.appendChild(nextBtn);
}

function handleSort(field) {
  if (state.sort.field === field) {
    state.sort.direction = state.sort.direction === 'asc' ? 'desc' : 'asc';
  } else {
    state.sort.field = field;
    state.sort.direction = 'desc';
  }
  applyFiltersAndRenderTable();
}

function filterByPending() {}

// Event Listeners Setup
function setupEventListeners() {
  document.getElementById('btn-refresh')?.addEventListener('click', () => {
    fetchLiveData(true);
  });

  document.getElementById('auto-refresh-select')?.addEventListener('change', (e) => {
    state.autoRefreshIntervalMs = parseInt(e.target.value, 10);
    setupAutoRefresh();
    if (state.autoRefreshIntervalMs > 0) {
      showToast(`Auto sync set to ${e.target.value / 1000}s`, 'info');
    } else {
      showToast('Auto sync paused', 'info');
    }
  });

  document.getElementById('btn-toggle-theme')?.addEventListener('click', toggleTheme);

  // Search & Filters
  const searchInput = document.getElementById('ledger-search-input');
  searchInput?.addEventListener('input', (e) => {
    state.filters.search = e.target.value;
    state.pagination.page = 1;
    applyFiltersAndRenderTable();
  });

  document.getElementById('ledger-filter-member')?.addEventListener('change', (e) => {
    state.filters.member = e.target.value;
    state.pagination.page = 1;
    applyFiltersAndRenderTable();
  });

  document.getElementById('ledger-filter-type')?.addEventListener('change', (e) => {
    state.filters.type = e.target.value;
    state.pagination.page = 1;
    applyFiltersAndRenderTable();
  });

  document.getElementById('ledger-filter-month')?.addEventListener('change', (e) => {
    state.filters.month = e.target.value;
    state.pagination.page = 1;
    applyFiltersAndRenderTable();
  });

  document.getElementById('ledger-filter-status')?.addEventListener('change', (e) => {
    state.filters.status = e.target.value;
    state.pagination.page = 1;
    applyFiltersAndRenderTable();
  });

  document.getElementById('ledger-page-size')?.addEventListener('change', (e) => {
    state.pagination.pageSize = parseInt(e.target.value, 10);
    state.pagination.page = 1;
    renderTablePage();
  });

  document.getElementById('btn-reset-filters')?.addEventListener('click', () => {
    state.filters = { search: '', member: '', type: '', month: '', status: '' };
    if (document.getElementById('ledger-search-input')) document.getElementById('ledger-search-input').value = '';
    if (document.getElementById('ledger-filter-member')) document.getElementById('ledger-filter-member').value = '';
    if (document.getElementById('ledger-filter-type')) document.getElementById('ledger-filter-type').value = '';
    if (document.getElementById('ledger-filter-month')) document.getElementById('ledger-filter-month').value = '';
    if (document.getElementById('ledger-filter-status')) document.getElementById('ledger-filter-status').value = '';
    state.pagination.page = 1;
    applyFiltersAndRenderTable();
    showToast('Filters reset', 'info');
  });

  document.getElementById('member-search-input')?.addEventListener('input', () => {
    renderMembersGrid();
  });

  document.getElementById('btn-export-csv')?.addEventListener('click', exportLedgerCSV);
}

// Switch Tabs
function switchTab(tabName) {
  // Access control guard: Only President / Super Admin can access admin-panel
  if (tabName === 'admin-panel' && !isAdmin()) {
    showToast('Access restricted to President / Admin.', 'error');
    switchTab('members');
    return;
  }

  const tabs = ['analytics', 'members', 'admin-panel'];
  tabs.forEach(t => {
    const pane = document.getElementById(`tab-content-${t}`);
    const btn = document.getElementById(`tab-btn-${t}`);
    if (t === tabName) {
      pane?.classList.remove('hidden');
      btn?.classList.remove('border-transparent', 'text-slate-500', 'dark:text-slate-400');
      btn?.classList.add('border-brand-700', 'text-brand-700', 'dark:text-brand-400', 'dark:border-brand-400');
    } else {
      pane?.classList.add('hidden');
      btn?.classList.remove('border-brand-700', 'text-brand-700', 'dark:text-brand-400', 'dark:border-brand-400');
      btn?.classList.add('border-transparent', 'text-slate-500', 'dark:text-slate-400');
    }
  });

  if (tabName === 'analytics') {
    Object.values(state.charts).forEach(c => c.resize());
  } else if (tabName === 'admin-panel') {
    renderPendingQueue();
    renderAdminUsersTable();
    populateApiSettingsForm();
  } else if (tabName === 'members') {
    if (isAdmin()) {
      setAdminSubView(state.adminSubView || 'directory');
    } else {
      renderMemberPersonalView();
    }
  }
}

// Theme Management
function initTheme() {
  const saved = localStorage.getItem('al_ikhlas_theme');
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    updateThemeIcon(true);
  } else {
    document.documentElement.classList.remove('dark');
    updateThemeIcon(false);
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('al_ikhlas_theme', isDark ? 'dark' : 'light');
  updateThemeIcon(isDark);
  renderCharts();
}

function updateThemeIcon(isDark) {
  const icon = document.getElementById('theme-icon');
  if (!icon) return;
  if (isDark) {
    icon.className = 'fa-solid fa-sun text-gold-400';
  } else {
    icon.className = 'fa-solid fa-moon';
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied to clipboard: ' + text);
  }).catch(() => {
    showToast('Failed to copy', 'error');
  });
}

// Export Transactions
function exportLedgerCSV() {
  if (!state.filteredTransactions || state.filteredTransactions.length === 0) {
    showToast('No records to export', 'error');
    return;
  }

  const exportData = state.filteredTransactions.map(tx => ({
    'Deposit Date': tx.dateFormatted,
    'Member Name': tx.name,
    'Member ID': tx.id,
    'Deposit Type': tx.isExtra ? 'Extra Deposit' : 'Regular Share Capital',
    'Amount (BDT)': tx.amount,
    'Number of Share': tx.isExtra ? 'N/A' : tx.shares,
    'TRX. ID / Reference': tx.trxId,
    'Status': tx.status,
    'Month': tx.monthLabel,
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
  XLSX.writeFile(wb, `Al_Ikhlas_Ledger_${new Date().toISOString().slice(0, 10)}.xlsx`);
  showToast('Exported ledger to Excel!', 'success');
}

// Export Members Summary
function exportMembersList() {
  const membersList = Array.from(state.membersMap.values()).map(m => ({
    'Member Name': m.name,
    'Member ID': m.id,
    'Contact Phone': m.phone,
    'Regular Capital (BDT)': m.regularAmount,
    'Total Shares': m.totalShares,
    'Extra Deposits (BDT)': m.extraAmount,
    'Grand Total (BDT)': m.totalAmount,
    'Total Deposits Count': m.depositCount,
    'Pending Dues (BDT)': m.pendingAmount,
    'Status': m.pendingAmount > 0 ? 'Pending Dues' : 'Cleared',
  }));

  const ws = XLSX.utils.json_to_sheet(membersList);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Members_Financial_Summary');
  XLSX.writeFile(wb, `Al_Ikhlas_Members_Summary_${new Date().toISOString().slice(0, 10)}.xlsx`);
  showToast('Exported members summary to Excel!', 'success');
}

// Global Window Handler Registrations
window.handleLogoUpload = handleLogoUpload;
window.handleRemoveLogo = handleRemoveLogo;
window.handleAdminUserPhotoSelected = handleAdminUserPhotoSelected;
window.handleAdminRemoveUserPhoto = handleAdminRemoveUserPhoto;
window.openAddUserModal = openAddUserModal;
window.closeUserModal = closeUserModal;
window.handleUserSubmit = handleUserSubmit;
window.openMemberProfileModal = openMemberProfileModal;
window.closeMemberProfileModal = closeMemberProfileModal;
window.handleMemberProfileSubmit = handleMemberProfileSubmit;
window.handleProfilePhotoSelected = handleProfilePhotoSelected;
window.handleRemoveProfilePhoto = handleRemoveProfilePhoto;
window.openMemberStatement = openMemberStatement;
window.closeStatementModal = closeStatementModal;
window.printMemberStatement = printMemberStatement;
window.exportMyStatementExcel = exportMyStatementExcel;
window.exportMembersList = exportMembersList;
window.exportLedgerCSV = exportLedgerCSV;
window.quickFillAdminLogin = quickFillAdminLogin;
window.handleLoginSubmit = handleLoginSubmit;
window.handleLogout = handleLogout;
window.togglePasswordVisibility = togglePasswordVisibility;
window.switchTab = switchTab;
window.toggleTheme = toggleTheme;
window.copyToClipboard = copyToClipboard;
window.openBankDetailsModal = openBankDetailsModal;
window.closeBankDetailsModal = closeBankDetailsModal;
window.toggleBankDetailsEditMode = toggleBankDetailsEditMode;
window.handleSaveBankDetails = handleSaveBankDetails;
window.openShareScheduleModal = openShareScheduleModal;
window.closeShareScheduleModal = closeShareScheduleModal;
window.renderShareScheduleModalContent = renderShareScheduleModalContent;
window.handleSaveShareSchedule = handleSaveShareSchedule;
window.resetShareScheduleToDefault = resetShareScheduleToDefault;
window.setAdminSubView = setAdminSubView;
window.openAdminMyProfile = openAdminMyProfile;
