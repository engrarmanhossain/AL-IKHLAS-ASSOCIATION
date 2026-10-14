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
};

// Initial Default Users & Roles
const DEFAULT_USERS = [
  {
    id: 'u1',
    name: 'Arman Hossain',
    email: 'armanhossain.eee.info@gmail.com',
    password: 'arman2026**',
    phone: '01724472229',
    role: 'President', // Super Admin
  },
  {
    id: 'u2',
    name: 'Faisal mahmud',
    email: 'faisal@alikhlas.org',
    password: 'member2026',
    phone: '01628435701',
    role: 'Accountant', // Financial Admin
  },
  {
    id: 'u3',
    name: 'Zafrul monir',
    email: 'zafrul@alikhlas.org',
    password: 'member2026',
    phone: '01846329066',
    role: 'Secretary',
  },
  {
    id: 'u4',
    name: 'Ikhtiar Uddin',
    email: 'ikhtiar@alikhlas.org',
    password: 'member2026',
    phone: '01600102219',
    role: 'Cashier',
  },
  {
    id: 'u5',
    name: 'Mosheur Rahman',
    email: 'mosheur@alikhlas.org',
    password: 'member2026',
    phone: '01882812309',
    role: 'Member',
  },
  {
    id: 'u6',
    name: 'Imam Hossan Masum',
    email: 'imam@alikhlas.org',
    password: 'member2026',
    phone: '01616780307',
    role: 'Member',
  },
  {
    id: 'u7',
    name: 'Soleman Hossen',
    email: 'soleman@alikhlas.org',
    password: 'member2026',
    phone: '01864996234',
    role: 'Member',
  },
  {
    id: 'u8',
    name: 'Tanvir Hasan',
    email: 'tanvir@alikhlas.org',
    password: 'member2026',
    phone: '01571771318',
    role: 'Member',
  },
  {
    id: 'u9',
    name: 'Md Mamun',
    email: 'mamun@alikhlas.org',
    password: 'member2026',
    phone: '01712327821',
    role: 'Member',
  },
  {
    id: 'u10',
    name: 'Tarek',
    email: 'tarek@alikhlas.org',
    password: 'member2026',
    phone: '01845834641',
    role: 'Member',
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
};

// Helper: Format Currency (BDT / ৳)
function formatCurrency(amount) {
  if (isNaN(amount) || amount === null) return '৳0';
  return '৳ ' + Math.round(amount).toLocaleString('en-IN');
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

// User & Auth Engine
function initUsersAndAuth() {
  // Load users from storage or use defaults
  const storedUsers = localStorage.getItem(CONFIG.STORAGE_KEY_USERS);
  if (storedUsers) {
    try {
      state.users = JSON.parse(storedUsers);
    } catch (e) {
      state.users = [...DEFAULT_USERS];
    }
  } else {
    state.users = [...DEFAULT_USERS];
    localStorage.setItem(CONFIG.STORAGE_KEY_USERS, JSON.stringify(state.users));
  }

  // Check current session
  const storedAuth = localStorage.getItem(CONFIG.STORAGE_KEY_AUTH);
  if (storedAuth) {
    try {
      state.currentUser = JSON.parse(storedAuth);
    } catch (e) {
      state.currentUser = null;
    }
  } else {
    // Default to auto-login as President for seamless administrative convenience
    state.currentUser = state.users[0]; // Arman Hossain (President)
    localStorage.setItem(CONFIG.STORAGE_KEY_AUTH, JSON.stringify(state.currentUser));
  }

  renderAuthHeader();
  renderAdminUsersTable();
}

function canManageUsers() {
  if (!state.currentUser) return false;
  return state.currentUser.role === 'President' || state.currentUser.email === 'armanhossain.eee.info@gmail.com';
}

function canApprovePayments() {
  if (!state.currentUser) return false;
  return ['President', 'Accountant', 'Cashier'].includes(state.currentUser.role);
}

function renderAuthHeader() {
  const container = document.getElementById('auth-header-container');
  const adminBanner = document.getElementById('admin-banner');
  const adminRoleBadge = document.getElementById('admin-banner-role');

  if (!container) return;

  if (state.currentUser) {
    const isPresident = state.currentUser.role === 'President';
    const isAccountant = state.currentUser.role === 'Accountant';
    const roleColor = isPresident ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 
                      isAccountant ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' : 
                      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';

    container.innerHTML = `
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1.5 cursor-pointer" onclick="openLoginModal()" title="Switch Account">
          <div class="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs" style="background-color: ${stringToColor(state.currentUser.name)}">
            ${getInitials(state.currentUser.name)}
          </div>
          <div class="hidden sm:block text-left">
            <div class="text-xs font-bold text-slate-800 dark:text-slate-100 leading-none truncate max-w-[120px]">
              ${state.currentUser.name}
            </div>
            <span class="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold ${roleColor}">
              ${state.currentUser.role}
            </span>
          </div>
        </div>
        <button onclick="handleLogout()" title="Logout" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
          <i class="fa-solid fa-arrow-right-from-bracket text-xs"></i>
        </button>
      </div>
    `;

    if (adminBanner) {
      if (canApprovePayments()) {
        adminBanner.classList.remove('hidden');
        if (adminRoleBadge) adminRoleBadge.textContent = state.currentUser.role;
      } else {
        adminBanner.classList.add('hidden');
      }
    }
  } else {
    container.innerHTML = `
      <button onclick="openLoginModal()" class="px-3 py-1.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm">
        <i class="fa-solid fa-right-to-bracket text-xs"></i>
        <span>Sign In</span>
      </button>
    `;
    if (adminBanner) adminBanner.classList.add('hidden');
  }
}

function openLoginModal() {
  document.getElementById('login-error')?.classList.add('hidden');
  document.getElementById('modal-login')?.classList.remove('hidden');
  document.getElementById('modal-login')?.classList.add('flex');
}

function closeLoginModal() {
  document.getElementById('modal-login')?.classList.add('hidden');
  document.getElementById('modal-login')?.classList.remove('flex');
}

function quickFillAdminLogin() {
  document.getElementById('login-email').value = 'armanhossain.eee.info@gmail.com';
  document.getElementById('login-password').value = 'arman2026**';
}

function handleLoginSubmit(e) {
  e.preventDefault();
  const emailInput = document.getElementById('login-email').value.trim().toLowerCase();
  const passInput = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');

  const user = state.users.find(u => 
    (u.email.toLowerCase() === emailInput || u.name.toLowerCase() === emailInput) && 
    u.password === passInput
  );

  if (user) {
    state.currentUser = user;
    localStorage.setItem(CONFIG.STORAGE_KEY_AUTH, JSON.stringify(user));
    renderAuthHeader();
    closeLoginModal();
    showToast(`Welcome back, ${user.name}! (${user.role})`, 'success');
    renderTablePage();
    renderPendingQueue();
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
  renderAuthHeader();
  renderTablePage();
  renderPendingQueue();
  showToast('Logged out successfully.', 'info');
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

    const permissionsText = isPresident ? 'Full Executive Admin' :
                            isAccountant ? 'Financial & Approval Access' :
                            u.role === 'Cashier' ? 'Cashier & Deposit Entry' : 'Statement & Directory Viewer';

    tr.innerHTML = `
      <td class="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <span class="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-bold" style="background-color: ${stringToColor(u.name)}">
          ${getInitials(u.name)}
        </span>
        <span>${u.name}</span>
      </td>
      <td class="py-3 px-4 font-mono text-slate-600 dark:text-slate-400 text-xs">${u.email}</td>
      <td class="py-3 px-4 font-mono text-slate-600 dark:text-slate-400 text-xs">${u.phone || '-'}</td>
      <td class="py-3 px-4">
        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${roleBadge}">
          ${u.role}
        </span>
      </td>
      <td class="py-3 px-4 text-center text-xs text-slate-500">${permissionsText}</td>
      <td class="py-3 px-4 text-center">
        <div class="flex items-center justify-center gap-1.5">
          <button onclick="editUserRole('${u.id}')" class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition">
            <i class="fa-solid fa-pen-to-square mr-1"></i> Edit Role
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

function openAddUserModal(userId = null) {
  if (!canManageUsers()) {
    showToast('Only the President can add or edit users.', 'error');
    return;
  }

  const modal = document.getElementById('modal-user');
  const title = document.getElementById('modal-user-title');
  const form = document.getElementById('user-form');
  form.reset();

  if (userId) {
    const user = state.users.find(u => u.id === userId);
    if (user) {
      title.textContent = `Edit Role: ${user.name}`;
      document.getElementById('form-user-id').value = user.id;
      document.getElementById('form-user-name').value = user.name;
      document.getElementById('form-user-email').value = user.email;
      document.getElementById('form-user-phone').value = user.phone || '';
      document.getElementById('form-user-role').value = user.role;
      document.getElementById('form-user-password').value = user.password || '';
    }
  } else {
    title.textContent = 'Add New User / Member';
    document.getElementById('form-user-id').value = '';
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
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

  if (id) {
    // Update existing
    const u = state.users.find(x => x.id === id);
    if (u) {
      u.name = name;
      u.email = email;
      u.phone = phone;
      u.role = role;
      if (pass) u.password = pass;
    }
  } else {
    // Add new user
    state.users.push({
      id: 'u_' + Date.now(),
      name,
      email,
      phone,
      role,
      password: pass
    });
  }

  localStorage.setItem(CONFIG.STORAGE_KEY_USERS, JSON.stringify(state.users));
  renderAdminUsersTable();
  closeUserModal();
  showToast(`User ${name} updated with role: ${role}!`, 'success');
}

// Payment Status Overrides & Approval Actions
function loadSavedOverrides() {
  try {
    state.statusOverrides = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY_OVERRIDES)) || {};
    state.customTransactions = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY_NEW_TXS)) || [];
  } catch (e) {
    state.statusOverrides = {};
    state.customTransactions = [];
  }
}

function saveOverrides() {
  localStorage.setItem(CONFIG.STORAGE_KEY_OVERRIDES, JSON.stringify(state.statusOverrides));
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

// Pending Approval Queue Table
function renderPendingQueue() {
  const tbody = document.getElementById('admin-pending-tbody');
  const badge = document.getElementById('admin-pending-counter-badge');
  const adminBadgeNav = document.getElementById('admin-badge-count');

  if (!tbody) return;
  tbody.innerHTML = '';

  const pendingList = state.transactions.filter(t => t.status === 'Pending');

  if (badge) badge.textContent = `${pendingList.length} Pending Approval`;
  if (adminBadgeNav) adminBadgeNav.textContent = `${pendingList.length} Pending`;

  if (pendingList.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-6 text-center text-emerald-600 font-semibold">
          <i class="fa-solid fa-circle-check text-xl mb-1 block"></i>
          All deposits are cleared and approved! No pending payments in the queue.
        </td>
      </tr>
    `;
    return;
  }

  pendingList.forEach(tx => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 dark:hover:bg-slate-800/50';

    const isExtra = tx.isExtra;
    const typeBadge = isExtra ? 
      '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">Extra Deposit</span>' :
      `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Share (${tx.shares})</span>`;

    tr.innerHTML = `
      <td class="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300">${tx.dateFormatted}</td>
      <td class="py-2.5 px-3 font-bold text-slate-900 dark:text-white">${tx.name}</td>
      <td class="py-2.5 px-3 text-center">${typeBadge}</td>
      <td class="py-2.5 px-3 font-mono text-[11px] text-slate-500">${tx.trxId}</td>
      <td class="py-2.5 px-3 text-right font-black text-brand-700 dark:text-brand-400">${formatCurrency(tx.amount)}</td>
      <td class="py-2.5 px-3 text-center">
        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
          Pending
        </span>
      </td>
      <td class="py-2.5 px-3 text-center">
        <button onclick="togglePaymentApproval('${tx.uniqueId}', 'Received')" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm flex items-center gap-1 mx-auto">
          <i class="fa-solid fa-check text-xs"></i> Approve &amp; Mark Received
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Add Transaction Modal Logic
function openAddTransactionModal() {
  if (!canApprovePayments()) {
    showToast('Only President or Accountant can record deposits.', 'error');
    openLoginModal();
    return;
  }

  const select = document.getElementById('form-tx-member');
  select.innerHTML = '';
  const sortedNames = Array.from(state.membersMap.keys()).sort();
  sortedNames.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });

  document.getElementById('form-tx-date').value = new Date().toISOString().slice(0, 10);
  document.getElementById('form-tx-shares').value = 1;
  document.getElementById('form-tx-amount').value = 2000;
  document.getElementById('form-tx-trx').value = 'Deposit Slip Book';

  document.getElementById('modal-add-tx').classList.remove('hidden');
  document.getElementById('modal-add-tx').classList.add('flex');
}

function closeAddTransactionModal() {
  document.getElementById('modal-add-tx').classList.add('hidden');
  document.getElementById('modal-add-tx').classList.remove('flex');
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

// Fetch Live Data from Google Apps Script
async function fetchLiveData() {
  if (state.isFetching) return;
  state.isFetching = true;

  const refreshIcon = document.getElementById('refresh-icon');
  const syncStatus = document.getElementById('sync-status-text');
  if (refreshIcon) refreshIcon.classList.add('fa-spin');
  if (syncStatus) syncStatus.textContent = 'Syncing...';

  const fullUrl = `${CONFIG.DEFAULT_API_URL}?token=${encodeURIComponent(CONFIG.DEFAULT_TOKEN)}`;

  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    const result = await response.json();
    if (result.error) throw new Error(result.error);
    if (!result.data || !Array.isArray(result.data)) throw new Error('Invalid data payload');

    // Cache to localStorage
    localStorage.setItem(CONFIG.STORAGE_KEY_CACHE, JSON.stringify(result));

    // Process & Render
    processRawData(result.data, true);

    state.lastUpdated = new Date();
    updateSyncTimeBadge();
    showToast('Data live synced directly from spreadsheet!', 'success');

  } catch (error) {
    console.error('Fetch error:', error);
    if (syncStatus) syncStatus.textContent = 'Sync Offline';
    const indicator = document.querySelector('.live-pulse');
    if (indicator) {
      indicator.classList.remove('bg-emerald-500');
      indicator.classList.add('bg-rose-500');
    }
  } finally {
    state.isFetching = false;
    if (refreshIcon) refreshIcon.classList.remove('fa-spin');
  }
}

function updateSyncTimeBadge() {
  const timeEl = document.getElementById('last-sync-time');
  const syncStatus = document.getElementById('sync-status-text');
  if (syncStatus) syncStatus.textContent = 'Live Synced';
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
  };

  const parsedTransactions = [];
  const members = new Map();

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const rawName = (row[colIndex.name] || '').toString().trim();
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
    const uniqueId = `row_${i}_${rawName}_${amount}`;

    // Apply Admin status override if any exists
    let status = (row[colIndex.status] || 'Received').toString().trim();
    status = status.toLowerCase().includes('pending') ? 'Pending' : 'Received';

    if (state.statusOverrides[uniqueId]) {
      status = state.statusOverrides[uniqueId];
    }

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
  renderCharts();
  renderMembersGrid();
  renderPendingQueue();
  applyFiltersAndRenderTable();
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
  document.getElementById('kpi-pending-count').textContent = `${pendingCount} Pending`;

  document.getElementById('ledger-tab-count').textContent = state.transactions.length;
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
    const assignedUser = state.users.find(u => u.name.toLowerCase() === m.name.toLowerCase());
    const roleBadge = assignedUser ? assignedUser.role : 'Member';

    card.innerHTML = `
      <div>
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-sm shadow-md" style="background-color: ${avatarBg}">
              ${getInitials(m.name)}
            </div>
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
  const member = state.membersMap.get(memberName);
  if (!member) return;

  document.getElementById('modal-member-name').textContent = member.name;
  document.getElementById('modal-member-id').textContent = member.id || 'N/A';
  document.getElementById('modal-member-regular').textContent = formatCurrency(member.regularAmount);
  document.getElementById('modal-member-shares').textContent = `${member.totalShares} Shares (৳2k/sh)`;
  document.getElementById('modal-member-extra').textContent = formatCurrency(member.extraAmount);
  document.getElementById('modal-member-extra-count').textContent = `${member.extraCount} Extra Slips`;
  document.getElementById('modal-member-total').textContent = formatCurrency(member.totalAmount);
  document.getElementById('modal-member-status').textContent = member.pendingAmount > 0 ? `Pending: ${formatCurrency(member.pendingAmount)}` : 'Cleared';

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

  document.getElementById('filtered-total-amount').textContent = formatCurrency(filteredTotalAmount);
  document.getElementById('filtered-regular-amount').textContent = formatCurrency(filteredRegularAmount);
  document.getElementById('filtered-extra-amount').textContent = formatCurrency(filteredExtraAmount);
  document.getElementById('filtered-row-count').textContent = filtered.length;

  renderTablePage();
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

  const isAdmin = canApprovePayments();

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
    if (isAdmin) {
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

    tr.innerHTML = `
      <td class="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
        ${tx.dateFormatted}
      </td>
      <td class="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <span class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold shrink-0" style="background-color: ${stringToColor(tx.name)}">
          ${getInitials(tx.name)}
        </span>
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

function filterByPending() {
  switchTab('ledger');
  document.getElementById('ledger-filter-status').value = 'Pending';
  state.filters.status = 'Pending';
  state.pagination.page = 1;
  applyFiltersAndRenderTable();
}

// Event Listeners Setup
function setupEventListeners() {
  document.getElementById('btn-refresh')?.addEventListener('click', () => {
    fetchLiveData();
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
    document.getElementById('ledger-search-input').value = '';
    document.getElementById('ledger-filter-member').value = '';
    document.getElementById('ledger-filter-type').value = '';
    document.getElementById('ledger-filter-month').value = '';
    document.getElementById('ledger-filter-status').value = '';
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
  const tabs = ['analytics', 'members', 'ledger', 'admin-panel'];
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
