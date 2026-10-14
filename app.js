/**
 * AL-IKHLAS ASSOCIATION - Real-Time Dashboard Engine
 * Connects directly to Google Apps Script Web App Endpoint
 */

// Global Configuration
const CONFIG = {
  DEFAULT_API_URL: 'https://script.google.com/macros/s/AKfycbz1GPChdZgMZgcpRU2xEGdy3hJs06LgkvX1ITtoOj4JYRwZ4Xl5XM0KpaV9J2Kbuq5X/exec',
  DEFAULT_TOKEN: 'AlIkhlasSecure2024!',
  STORAGE_KEY_SETTINGS: 'al_ikhlas_settings_v1',
  STORAGE_KEY_CACHE: 'al_ikhlas_data_cache_v1',
};

// Global State
let state = {
  rawRows: [],
  transactions: [],
  membersMap: new Map(),
  filteredTransactions: [],
  charts: {},
  sort: { field: 'depositDate', direction: 'desc' },
  pagination: { page: 1, pageSize: 25 },
  filters: { search: '', member: '', month: '', status: '' },
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

// Helper: Get Clean Member Avatar Initials
function getInitials(name) {
  if (!name) return 'AI';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

// Helper: Generate Deterministic Color from String
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

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadSavedSettings();
  setupEventListeners();
  
  // Try loading cached data for instant render
  const cached = localStorage.getItem(CONFIG.STORAGE_KEY_CACHE);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.data) {
        processRawData(parsed.data, false);
      }
    } catch (e) {
      console.warn('Failed parsing cached data:', e);
    }
  }

  // Fetch live fresh data immediately
  fetchLiveData();
  setupAutoRefresh();
});

// Settings Management
function getSettings() {
  const saved = localStorage.getItem(CONFIG.STORAGE_KEY_SETTINGS);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {}
  }
  return {
    apiUrl: CONFIG.DEFAULT_API_URL,
    token: CONFIG.DEFAULT_TOKEN,
  };
}

function loadSavedSettings() {
  const s = getSettings();
  const urlInput = document.getElementById('setting-api-url');
  const tokenInput = document.getElementById('setting-api-token');
  if (urlInput) urlInput.value = s.apiUrl || CONFIG.DEFAULT_API_URL;
  if (tokenInput) tokenInput.value = s.token || CONFIG.DEFAULT_TOKEN;
}

function saveSettings() {
  const url = document.getElementById('setting-api-url').value.trim();
  const token = document.getElementById('setting-api-token').value.trim();

  if (!url) {
    alert('Please provide a valid Apps Script URL');
    return;
  }

  localStorage.setItem(CONFIG.STORAGE_KEY_SETTINGS, JSON.stringify({ apiUrl: url, token }));
  closeSettingsModal();
  showToast('Settings saved. Fetching data...', 'info');
  fetchLiveData();
}

function closeSettingsModal() {
  document.getElementById('modal-settings').classList.add('hidden');
  document.getElementById('modal-settings').classList.remove('flex');
}

function openSettingsModal() {
  loadSavedSettings();
  document.getElementById('settings-status-box').classList.add('hidden');
  document.getElementById('modal-settings').classList.remove('hidden');
  document.getElementById('modal-settings').classList.add('flex');
}

async function testConnection() {
  const url = document.getElementById('setting-api-url').value.trim();
  const token = document.getElementById('setting-api-token').value.trim();
  const box = document.getElementById('settings-status-box');
  const btn = document.getElementById('btn-test-conn');

  box.classList.remove('hidden', 'bg-rose-50', 'text-rose-700', 'bg-emerald-50', 'text-emerald-700');
  box.classList.add('bg-slate-100', 'text-slate-700');
  box.textContent = 'Testing connection...';
  btn.disabled = true;

  try {
    const fullUrl = `${url}?token=${encodeURIComponent(token)}`;
    const res = await fetch(fullUrl);
    const json = await res.json();

    if (json.error) {
      box.className = 'p-3 rounded-xl text-xs bg-rose-50 text-rose-700 border border-rose-200';
      box.textContent = 'Authentication Failed: ' + json.error;
    } else if (json.data && Array.isArray(json.data)) {
      box.className = 'p-3 rounded-xl text-xs bg-emerald-50 text-emerald-700 border border-emerald-200';
      box.textContent = `Connection Successful! Found ${json.data.length - 1} records.`;
    } else {
      box.className = 'p-3 rounded-xl text-xs bg-amber-50 text-amber-700 border border-amber-200';
      box.textContent = 'Unexpected response structure: ' + JSON.stringify(json).slice(0, 100);
    }
  } catch (err) {
    box.className = 'p-3 rounded-xl text-xs bg-rose-50 text-rose-700 border border-rose-200';
    box.textContent = 'Network Error: ' + err.message;
  } finally {
    btn.disabled = false;
  }
}

// Fetch Live Data from Google Apps Script
async function fetchLiveData() {
  if (state.isFetching) return;
  state.isFetching = true;

  const refreshIcon = document.getElementById('refresh-icon');
  const syncStatus = document.getElementById('sync-status-text');
  if (refreshIcon) refreshIcon.classList.add('fa-spin');
  if (syncStatus) syncStatus.textContent = 'Syncing...';

  const settings = getSettings();
  const fullUrl = `${settings.apiUrl}?token=${encodeURIComponent(settings.token)}`;

  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const result = await response.json();
    if (result.error) {
      throw new Error(result.error);
    }

    if (!result.data || !Array.isArray(result.data)) {
      throw new Error('Invalid data payload received');
    }

    // Cache to localStorage
    localStorage.setItem(CONFIG.STORAGE_KEY_CACHE, JSON.stringify(result));

    // Process & Render
    processRawData(result.data, true);

    state.lastUpdated = new Date();
    updateSyncTimeBadge();
    showToast('Data synced in real time!', 'success');

  } catch (error) {
    console.error('Fetch error:', error);
    if (syncStatus) syncStatus.textContent = 'Sync Offline';
    const indicator = document.querySelector('.live-pulse');
    if (indicator) {
      indicator.classList.remove('bg-emerald-500');
      indicator.classList.add('bg-rose-500');
    }
    showToast('Sync error: ' + error.message, 'error');
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

// Setup Auto Refresh Interval
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

// Data Processing Engine
function processRawData(rows, triggerToast = false) {
  if (!rows || rows.length <= 1) return;

  state.rawRows = rows;
  const headers = rows[0];

  // Map header indexes
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

    // Clean amounts and shares
    const rawAmt = parseFloat(row[colIndex.amount]);
    const amount = isNaN(rawAmt) ? 0 : rawAmt;

    const rawShares = parseFloat(row[colIndex.shares]);
    const shares = isNaN(rawShares) ? 1 : rawShares;

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

    // Status
    const rawStatus = (row[colIndex.status] || 'Received').toString().trim();
    const status = rawStatus.toLowerCase().includes('pending') ? 'Pending' : 'Received';

    // Phone
    const phone = (row[colIndex.phone] || '').toString().trim();

    // TRX ID
    const trxId = (row[colIndex.trxId] || 'Deposit Slip Book').toString().trim();

    // Month display label
    let monthLabel = 'Unknown';
    if (depDate && !isNaN(depDate.getTime())) {
      monthLabel = depDate.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
    }

    const tx = {
      rowIndex: i,
      timestamp: row[colIndex.timestamp],
      depositDate: depDate,
      dateFormatted: formatDate(depDate),
      name: rawName,
      id: (row[colIndex.id] || '').toString().trim(),
      phone: phone,
      amount: amount,
      shares: shares,
      trxId: trxId,
      email: (row[colIndex.email] || '').toString().trim(),
      status: status,
      monthLabel: monthLabel,
    };

    parsedTransactions.push(tx);

    // Group by Member
    if (!members.has(rawName)) {
      members.set(rawName, {
        name: rawName,
        id: tx.id,
        phone: phone,
        totalAmount: 0,
        receivedAmount: 0,
        pendingAmount: 0,
        totalShares: 0,
        depositCount: 0,
        transactions: [],
      });
    }

    const m = members.get(rawName);
    m.totalAmount += amount;
    if (status === 'Received') {
      m.receivedAmount += amount;
    } else {
      m.pendingAmount += amount;
    }
    m.totalShares += shares;
    m.depositCount += 1;
    if (phone && !m.phone) m.phone = phone;
    m.transactions.push(tx);
  }

  // Sort transactions by date descending by default
  parsedTransactions.sort((a, b) => (b.depositDate || 0) - (a.depositDate || 0));

  state.transactions = parsedTransactions;
  state.membersMap = members;

  // Populate Filter Dropdowns
  populateFilterDropdowns();

  // Update KPI Cards
  updateKPIs();

  // Render Charts
  renderCharts();

  // Render Members Directory
  renderMembersGrid();

  // Apply Current Filters & Render Table
  applyFiltersAndRenderTable();
}

// Update Top KPI Cards
function updateKPIs() {
  let totalAmount = 0;
  let receivedAmount = 0;
  let pendingAmount = 0;
  let totalShares = 0;
  let receivedCount = 0;
  let pendingCount = 0;

  state.transactions.forEach(tx => {
    totalAmount += tx.amount;
    totalShares += tx.shares;
    if (tx.status === 'Received') {
      receivedAmount += tx.amount;
      receivedCount++;
    } else {
      pendingAmount += tx.amount;
      pendingCount++;
    }
  });

  const memberCount = state.membersMap.size;
  const avgShares = memberCount > 0 ? (totalShares / memberCount).toFixed(1) : 0;
  const avgTx = memberCount > 0 ? (state.transactions.length / memberCount).toFixed(0) : 0;
  const collectionRate = totalAmount > 0 ? ((receivedAmount / totalAmount) * 100).toFixed(1) : 100;

  // DOM Updates
  document.getElementById('kpi-total-amount').textContent = formatCurrency(totalAmount);
  document.getElementById('kpi-received-amount').textContent = `Received: ${formatCurrency(receivedAmount)}`;
  document.getElementById('kpi-pending-amount').textContent = `Pending: ${formatCurrency(pendingAmount)}`;

  document.getElementById('kpi-total-shares').textContent = totalShares;
  document.getElementById('kpi-avg-shares').textContent = avgShares;

  document.getElementById('kpi-total-members').textContent = memberCount;
  document.getElementById('kpi-total-transactions').textContent = state.transactions.length;
  document.getElementById('kpi-avg-tx').textContent = avgTx;

  document.getElementById('kpi-collection-rate').textContent = `${collectionRate}%`;
  document.getElementById('kpi-received-count').textContent = `${receivedCount} Received`;
  document.getElementById('kpi-pending-count').textContent = `${pendingCount} Pending`;

  document.getElementById('ledger-tab-count').textContent = state.transactions.length;
}

// Populate Member & Month Filter Dropdowns
function populateFilterDropdowns() {
  const memberSelect = document.getElementById('ledger-filter-member');
  const monthSelect = document.getElementById('ledger-filter-month');

  // Preserve existing selections if any
  const curMember = memberSelect.value;
  const curMonth = monthSelect.value;

  // Members
  memberSelect.innerHTML = '<option value="">All Members</option>';
  const sortedMemberNames = Array.from(state.membersMap.keys()).sort();
  sortedMemberNames.forEach(name => {
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
    if (tx.monthLabel && tx.monthLabel !== 'Unknown') {
      uniqueMonths.add(tx.monthLabel);
    }
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

  // 1. Monthly Collection Trend
  const monthlyDataMap = new Map();
  state.transactions.forEach(tx => {
    const m = tx.monthLabel;
    if (m === 'Unknown') return;
    if (!monthlyDataMap.has(m)) {
      monthlyDataMap.set(m, { received: 0, pending: 0, total: 0 });
    }
    const cur = monthlyDataMap.get(m);
    if (tx.status === 'Received') {
      cur.received += tx.amount;
    } else {
      cur.pending += tx.amount;
    }
    cur.total += tx.amount;
  });

  const months = Array.from(monthlyDataMap.keys());
  const receivedData = months.map(m => monthlyDataMap.get(m).received);
  const pendingData = months.map(m => monthlyDataMap.get(m).pending);

  // Calculate Cumulative Line
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
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderWidth: 3,
            tension: 0.35,
            fill: false,
            yAxisID: 'y1',
            pointRadius: 4,
            pointBackgroundColor: '#f59e0b',
          },
          {
            type: 'bar',
            label: 'Received (৳)',
            data: receivedData,
            backgroundColor: '#059669',
            borderRadius: 6,
            stack: 'combined',
            yAxisID: 'y',
          },
          {
            type: 'bar',
            label: 'Pending (৳)',
            data: pendingData,
            backgroundColor: '#f87171',
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

  // 2. Member Shares Pie / Doughnut
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
            labels: {
              boxWidth: 12,
              color: textColor,
              font: { family: 'Plus Jakarta Sans', size: 10 }
            }
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

  // 3. Member Ranking Horizontal Bar Chart
  const sortedMembersByAmount = Array.from(state.membersMap.values()).sort((a, b) => b.totalAmount - a.totalAmount);
  const rankingLabels = sortedMembersByAmount.map(m => m.name);
  const rankingAmounts = sortedMembersByAmount.map(m => m.totalAmount);

  if (state.charts.ranking) state.charts.ranking.destroy();
  const ctxRanking = document.getElementById('chart-member-ranking')?.getContext('2d');
  if (ctxRanking) {
    state.charts.ranking = new Chart(ctxRanking, {
      type: 'bar',
      data: {
        labels: rankingLabels,
        datasets: [{
          label: 'Total Contributed (৳)',
          data: rankingAmounts,
          backgroundColor: '#047857',
          borderRadius: 6,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ` Contribution: ৳ ${ctx.raw.toLocaleString('en-IN')}`
            }
          }
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              callback: val => '৳' + (val / 1000) + 'k',
              font: { family: 'Plus Jakarta Sans', size: 10 }
            }
          },
          y: {
            grid: { display: false },
            ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' } }
          }
        }
      }
    });
  }

  // 4. Instruments / Payment Methods Breakdown
  const instrumentMap = new Map();
  state.transactions.forEach(tx => {
    let key = tx.trxId;
    if (key.toLowerCase().includes('slip')) {
      key = 'Deposit Slip Book';
    } else if (key.length > 10) {
      key = 'Bank / Online TRX';
    } else {
      key = 'Cash / Other';
    }
    instrumentMap.set(key, (instrumentMap.get(key) || 0) + 1);
  });

  const instLabels = Array.from(instrumentMap.keys());
  const instCounts = Array.from(instrumentMap.values());

  if (state.charts.instruments) state.charts.instruments.destroy();
  const ctxInst = document.getElementById('chart-instruments')?.getContext('2d');
  if (ctxInst) {
    state.charts.instruments = new Chart(ctxInst, {
      type: 'pie',
      data: {
        labels: instLabels,
        datasets: [{
          data: instCounts,
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
          },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.label}: ${ctx.raw} transactions`
            }
          }
        }
      }
    });
  }
}

// Render Member Cards Grid
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

  // Sort by total amount descending
  membersList.sort((a, b) => b.totalAmount - a.totalAmount);

  document.getElementById('member-count-badge').textContent = `Showing ${membersList.length} Members`;

  membersList.forEach((m, idx) => {
    const card = document.createElement('div');
    card.className = 'bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-brand-500/50 transition-all flex flex-col justify-between';

    const avatarBg = stringToColor(m.name);
    const hasPending = m.pendingAmount > 0;

    // Clean phone for whatsapp
    let cleanPhone = m.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '88' + cleanPhone;
    }

    card.innerHTML = `
      <div>
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-sm shadow-md" style="background-color: ${avatarBg}">
              ${getInitials(m.name)}
            </div>
            <div>
              <h4 class="font-bold text-base text-slate-900 dark:text-white leading-tight">
                ${m.name}
              </h4>
              <span class="text-xs font-mono text-slate-400 block">${m.id || 'Member #' + (idx + 1)}</span>
            </div>
          </div>
          
          <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${hasPending ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'}">
            ${hasPending ? 'Dues Pending' : 'Paid Up'}
          </span>
        </div>

        <!-- Member Stats Cards -->
        <div class="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div class="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
            <span class="text-[10px] uppercase font-bold text-slate-400 block">Total Deposited</span>
            <span class="text-sm font-extrabold text-brand-700 dark:text-brand-400">${formatCurrency(m.totalAmount)}</span>
          </div>
          <div class="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
            <span class="text-[10px] uppercase font-bold text-slate-400 block">Total Shares</span>
            <span class="text-sm font-extrabold text-gold-600 dark:text-gold-400">${m.totalShares} Shares</span>
          </div>
        </div>

        <div class="flex items-center justify-between text-xs text-slate-500 mt-3 px-1">
          <span>Deposits: <strong>${m.depositCount} times</strong></span>
          ${hasPending ? `<span class="text-rose-500 font-semibold">Pending: ${formatCurrency(m.pendingAmount)}</span>` : '<span class="text-emerald-600 font-medium">✓ 100% Cleared</span>'}
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2 mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
        ${cleanPhone ? `
          <a href="https://wa.me/${cleanPhone}" target="_blank" title="Send WhatsApp Message" class="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold flex items-center justify-center transition">
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
  document.getElementById('modal-member-phone').textContent = member.phone || 'N/A';
  document.getElementById('modal-member-total').textContent = formatCurrency(member.totalAmount);
  document.getElementById('modal-member-shares').textContent = `${member.totalShares} Shares • ${member.depositCount} Deposits`;

  const tbody = document.getElementById('modal-statement-body');
  tbody.innerHTML = '';

  member.transactions.forEach(tx => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 dark:hover:bg-slate-800/50';
    tr.innerHTML = `
      <td class="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300">${tx.dateFormatted}</td>
      <td class="py-2.5 px-3 font-mono text-[11px] text-slate-500">${tx.trxId}</td>
      <td class="py-2.5 px-3 text-center font-bold text-slate-700 dark:text-slate-300">${tx.shares}</td>
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
  const modal = document.getElementById('modal-statement');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

// Table Filtering, Sorting & Pagination
function applyFiltersAndRenderTable() {
  const search = state.filters.search.toLowerCase().trim();
  const selMember = state.filters.member;
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
  let filteredTotalShares = 0;
  filtered.forEach(tx => {
    filteredTotalAmount += tx.amount;
    filteredTotalShares += tx.shares;
  });

  document.getElementById('filtered-total-amount').textContent = formatCurrency(filteredTotalAmount);
  document.getElementById('filtered-total-shares').textContent = filteredTotalShares;
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

  if (state.pagination.page > totalPages) {
    state.pagination.page = totalPages;
  }

  const startIdx = (state.pagination.page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const pageRows = state.filteredTransactions.slice(startIdx, endIdx);

  if (pageRows.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class="py-8 text-center text-slate-400">
          <i class="fa-solid fa-folder-open text-2xl mb-2 block"></i>
          No transactions match your search or filter criteria.
        </td>
      </tr>
    `;
    renderPagination(0, 0, 0, 1);
    return;
  }

  pageRows.forEach(tx => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors';

    let cleanPhone = tx.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = '88' + cleanPhone;

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
      <td class="py-3 px-4 font-mono text-[11px] text-slate-500">${tx.id || '-'}</td>
      <td class="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
        ${tx.phone ? `
          <a href="tel:${tx.phone}" class="hover:underline">${tx.phone}</a>
        ` : '-'}
      </td>
      <td class="py-3 px-4 text-right font-black text-brand-700 dark:text-brand-400 text-sm">
        ${formatCurrency(tx.amount)}
      </td>
      <td class="py-3 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
        ${tx.shares}
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
        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${tx.status === 'Received' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}">
          ${tx.status}
        </span>
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

  // Previous Button
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

  // Page Numbers
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

  // Next Button
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

// Event Listeners Setup
function setupEventListeners() {
  // Refresh button
  document.getElementById('btn-refresh')?.addEventListener('click', () => {
    fetchLiveData();
  });

  // Settings modal open
  document.getElementById('btn-open-settings')?.addEventListener('click', openSettingsModal);

  // Auto-refresh interval change
  document.getElementById('auto-refresh-select')?.addEventListener('change', (e) => {
    state.autoRefreshIntervalMs = parseInt(e.target.value, 10);
    setupAutoRefresh();
    if (state.autoRefreshIntervalMs > 0) {
      showToast(`Auto sync set to ${e.target.value / 1000}s`, 'info');
    } else {
      showToast('Auto sync paused', 'info');
    }
  });

  // Theme toggle
  document.getElementById('btn-toggle-theme')?.addEventListener('click', toggleTheme);

  // Ledger Filter Inputs
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
    state.filters = { search: '', member: '', month: '', status: '' };
    document.getElementById('ledger-search-input').value = '';
    document.getElementById('ledger-filter-member').value = '';
    document.getElementById('ledger-filter-month').value = '';
    document.getElementById('ledger-filter-status').value = '';
    state.pagination.page = 1;
    applyFiltersAndRenderTable();
    showToast('Filters reset', 'info');
  });

  // Member Search Input
  document.getElementById('member-search-input')?.addEventListener('input', () => {
    renderMembersGrid();
  });

  // Export CSV
  document.getElementById('btn-export-csv')?.addEventListener('click', exportLedgerCSV);
}

// Switch View Tabs
function switchTab(tabName) {
  const tabs = ['analytics', 'members', 'ledger'];
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

  // Resize charts when returning to analytics tab
  if (tabName === 'analytics') {
    Object.values(state.charts).forEach(c => c.resize());
  }
}

// Dark / Light Theme
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
  renderCharts(); // Re-render charts with dark/light colors
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

// Copy to Clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied to clipboard: ' + text);
  }).catch(() => {
    showToast('Failed to copy', 'error');
  });
}

// Export Transactions to CSV / Excel
function exportLedgerCSV() {
  if (!state.filteredTransactions || state.filteredTransactions.length === 0) {
    showToast('No records to export', 'error');
    return;
  }

  const exportData = state.filteredTransactions.map(tx => ({
    'Deposit Date': tx.dateFormatted,
    'Member Name': tx.name,
    'Member ID': tx.id,
    'Contact Number': tx.phone,
    'Amount (BDT)': tx.amount,
    'Number of Share': tx.shares,
    'TRX. ID / Reference': tx.trxId,
    'Status': tx.status,
    'Month': tx.monthLabel,
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
  XLSX.writeFile(wb, `Al_Ikhlas_Ledger_${new Date().toISOString().slice(0, 10)}.xlsx`);
  showToast('Exported transaction ledger to Excel!', 'success');
}

// Export Members Summary to Excel
function exportMembersList() {
  const membersList = Array.from(state.membersMap.values()).map(m => ({
    'Member Name': m.name,
    'Member ID': m.id,
    'Contact Phone': m.phone,
    'Total Deposited (BDT)': m.totalAmount,
    'Received Amount (BDT)': m.receivedAmount,
    'Pending Amount (BDT)': m.pendingAmount,
    'Total Shares': m.totalShares,
    'Total Transactions': m.depositCount,
    'Status': m.pendingAmount > 0 ? 'Pending Dues' : 'Cleared',
  }));

  const ws = XLSX.utils.json_to_sheet(membersList);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Members');
  XLSX.writeFile(wb, `Al_Ikhlas_Members_Summary_${new Date().toISOString().slice(0, 10)}.xlsx`);
  showToast('Exported members summary to Excel!', 'success');
}
