/**
 * STACKLY — MODERN EXPENSE TRACKING & PERSONAL FINANCE PLATFORM
 * Core Application Engine, Reactive Local Store, Canvas Visualizations, Form Validation
 */

// ==========================================
// 1. STACKLY DATA STORE (Local Storage Reactivity)
// ==========================================
const StacklyStore = (function () {
  const STORAGE_KEY_TX = 'stackly_transactions';
  const STORAGE_KEY_BUDGET = 'stackly_budget';
  const STORAGE_KEY_GOALS = 'stackly_goals';

  const defaultTransactions = [
    { id: 'tx-1', name: 'Fresh Market Groceries', category: 'Food & Dining', amount: 142.50, date: '2026-09-01', method: 'Debit Card', type: 'expense', notes: 'Weekly grocery restock' },
    { id: 'tx-2', name: 'Monthly Salary Deposit', category: 'Income', amount: 5200.00, date: '2026-09-01', method: 'Bank Transfer', type: 'income', notes: 'Tech Corp direct deposit' },
    { id: 'tx-3', name: 'City Metro Transit Pass', category: 'Transportation', amount: 85.00, date: '2026-08-30', method: 'Digital Wallet', type: 'expense', notes: 'Monthly commuter card' },
    { id: 'tx-4', name: 'Apartment Fiber Internet', category: 'Utilities', amount: 79.99, date: '2026-08-28', method: 'Credit Card', type: 'expense', notes: 'High-speed fiber bill' },
    { id: 'tx-5', name: 'Freelance UI/UX Project', category: 'Income', amount: 1450.00, date: '2026-08-26', method: 'Bank Transfer', type: 'income', notes: 'Fintech design sprint' },
    { id: 'tx-6', name: 'Autumn Wardrobe Shopping', category: 'Shopping', amount: 215.40, date: '2026-08-25', method: 'Credit Card', type: 'expense', notes: 'Department store' },
    { id: 'tx-7', name: 'Cinema & Weekend Dining', category: 'Entertainment', amount: 94.20, date: '2026-08-24', method: 'Digital Wallet', type: 'expense', notes: 'Dinner and movie night' },
    { id: 'tx-8', name: 'Health & Pharmacy Meds', category: 'Healthcare', amount: 65.00, date: '2026-08-22', method: 'Debit Card', type: 'expense', notes: 'Vitamins & prescription' },
    { id: 'tx-9', name: 'Cloud Architecture Course', category: 'Education', amount: 129.00, date: '2026-08-20', method: 'Credit Card', type: 'expense', notes: 'Certification prep' },
    { id: 'tx-10', name: 'Weekend Mountain Trip Fuel', category: 'Travel', amount: 185.00, date: '2026-08-18', method: 'Credit Card', type: 'expense', notes: 'Highway tolls and gas' }
  ];

  const defaultBudget = {
    monthlyBudget: 4500,
    categories: {
      'Food & Dining': 650,
      'Transportation': 350,
      'Shopping': 450,
      'Utilities': 500,
      'Entertainment': 300,
      'Healthcare': 250,
      'Education': 300,
      'Travel': 500
    }
  };

  const defaultGoals = [
    { id: 'goal-1', name: 'Emergency Safety Fund', target: 15000, current: 12000, date: '2026-12-31', badge: 'High Priority' },
    { id: 'goal-2', name: 'Alpine Ski Vacation', target: 4000, current: 3200, date: '2026-11-15', badge: 'Travel' },
    { id: 'goal-3', name: 'Next-Gen M-Series Laptop', target: 2500, current: 2100, date: '2026-10-01', badge: 'Equipment' },
    { id: 'goal-4', name: 'Executive Master Program', target: 8000, current: 4600, date: '2027-03-30', badge: 'Education' },
    { id: 'goal-5', name: 'Home Renovation Reserve', target: 20000, current: 14200, date: '2027-06-15', badge: 'Property' },
    { id: 'goal-6', name: 'Electric Vehicle Downpayment', target: 10000, current: 6500, date: '2027-01-20', badge: 'Vehicle' }
  ];

  function getStored(key, fallback) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function setStored(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  return {
    getTransactions: function () {
      return getStored(STORAGE_KEY_TX, defaultTransactions);
    },
    addTransaction: function (tx) {
      const list = this.getTransactions();
      tx.id = 'tx-' + Date.now();
      list.unshift(tx);
      setStored(STORAGE_KEY_TX, list);
      return tx;
    },
    deleteTransaction: function (id) {
      let list = this.getTransactions();
      list = list.filter(item => item.id !== id);
      setStored(STORAGE_KEY_TX, list);
    },
    getBudget: function () {
      return getStored(STORAGE_KEY_BUDGET, defaultBudget);
    },
    setBudget: function (newBudget) {
      setStored(STORAGE_KEY_BUDGET, newBudget);
    },
    getGoals: function () {
      return getStored(STORAGE_KEY_GOALS, defaultGoals);
    },
    depositGoal: function (goalId, amount) {
      const goals = this.getGoals();
      const target = goals.find(g => g.id === goalId);
      if (target) {
        target.current = Math.min(target.target, target.current + Number(amount));
        setStored(STORAGE_KEY_GOALS, goals);
      }
      return target;
    },
    addGoal: function (goal) {
      const goals = this.getGoals();
      goal.id = 'goal-' + Date.now();
      goals.push(goal);
      setStored(STORAGE_KEY_GOALS, goals);
      return goal;
    },
    calculateSummary: function () {
      const txs = this.getTransactions();
      let totalIncome = 0;
      let totalExpenses = 0;
      const categorySpent = {};

      txs.forEach(t => {
        const amt = parseFloat(t.amount) || 0;
        if (t.type === 'income') {
          totalIncome += amt;
        } else {
          totalExpenses += amt;
          categorySpent[t.category] = (categorySpent[t.category] || 0) + amt;
        }
      });

      const budget = this.getBudget();
      const monthlyBudget = budget.monthlyBudget || 4500;
      const budgetUsedPct = Math.min(100, Math.round((totalExpenses / monthlyBudget) * 100));
      const remainingBudget = Math.max(0, monthlyBudget - totalExpenses);
      const totalBalance = 14250.00 + (totalIncome - totalExpenses);
      const netSavings = Math.max(0, totalIncome - totalExpenses);

      return {
        totalBalance,
        totalIncome,
        totalExpenses,
        netSavings,
        monthlyBudget,
        remainingBudget,
        budgetUsedPct,
        categorySpent
      };
    }
  };
})();

// ==========================================
// 1.5. PAGE PRELOADER FADE-OUT (2 Seconds Display)
// ==========================================
(function initPreloader() {
  function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader && !preloader.classList.contains('fade-out')) {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 400);
    }
  }

  // Preloader displays for exactly 2 seconds (2000ms) before smooth fade-out
  setTimeout(hidePreloader, 2000);
})();

// ==========================================
// 2. STICKY NAVBAR & MOBILE NAVIGATION
// ==========================================
function initNavbar() {
  const header = document.querySelector('.site-header');
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileBackdrop = document.querySelector('.mobile-nav-backdrop');
  const navLinks = document.querySelectorAll('.mobile-nav-link, .nav-link');

  // Sticky shadow effect on scroll
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Hamburger drawer toggle
  function openMobileMenu() {
    if (hamburgerBtn) hamburgerBtn.classList.add('active');
    if (mobileDrawer) mobileDrawer.classList.add('open');
    if (mobileBackdrop) mobileBackdrop.classList.add('open');
    document.documentElement.classList.add('menu-locked');
    document.body.classList.add('menu-locked');
  }

  function closeMobileMenu() {
    if (hamburgerBtn) hamburgerBtn.classList.remove('active');
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (mobileBackdrop) mobileBackdrop.classList.remove('open');
    document.documentElement.classList.remove('menu-locked');
    document.body.classList.remove('menu-locked');
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (mobileDrawer && mobileDrawer.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeMobileMenu);
    mobileBackdrop.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, { passive: false });
  }

  const drawerCloseBtn = document.querySelector('.mobile-drawer-close');
  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMobileMenu();
    });
  }

  const drawerSearch = document.querySelector('.mobile-drawer-search');
  if (drawerSearch) {
    drawerSearch.addEventListener('input', () => {
      const q = drawerSearch.value.toLowerCase().trim();
      document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.style.display = link.textContent.toLowerCase().includes(q) ? 'flex' : 'none';
      });
    });
  }

  // Close on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
      closeDashboardDrawer();
    }
  });
}

// ==========================================
// 3. DASHBOARD MOBILE DRAWER
// ==========================================
function initDashboardSidebar() {
  const toggleBtn = document.getElementById('dashboardSidebarToggle');
  const sidebar = document.querySelector('.dashboard-sidebar');
  const backdrop = document.querySelector('.dashboard-drawer-backdrop');
  const closeBtn = document.querySelector('.sidebar-close-btn');
  const sidebarLinks = document.querySelectorAll('.dash-nav-item');

  function openDashboardDrawer() {
    if (sidebar) sidebar.classList.add('drawer-open');
    if (backdrop) backdrop.classList.add('show');
    document.documentElement.classList.add('menu-locked');
    document.body.classList.add('menu-locked');
  }

  window.closeDashboardDrawer = function () {
    if (sidebar) sidebar.classList.remove('drawer-open');
    if (backdrop) backdrop.classList.remove('show');
    document.documentElement.classList.remove('menu-locked');
    document.body.classList.remove('menu-locked');
  };

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openDashboardDrawer();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDashboardDrawer);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeDashboardDrawer);
    backdrop.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, { passive: false });
  }

  sidebarLinks.forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 992) {
        closeDashboardDrawer();
      }
    });
  });
}

// ==========================================
// 4. INTERACTIVE CHART ENGINE (HTML5 Canvas)
// ==========================================
function initIncomeExpenseChart(canvasId, period = 'monthly') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const parent = canvas.parentElement;
  const parentW = parent ? parent.clientWidth : 300;
  const parentH = parent ? parent.clientHeight : 260;
  const dpr = window.devicePixelRatio || 1;

  const w = parentW || 300;
  const h = parentH || 260;

  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.width = w * dpr;
  canvas.height = h * dpr;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  // Demo datasets based on period
  let labels = [];
  let incomeData = [];
  let expenseData = [];

  if (period === 'weekly') {
    labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    incomeData = [400, 650, 200, 1100, 300, 950, 800];
    expenseData = [250, 310, 180, 420, 290, 520, 380];
  } else if (period === 'yearly') {
    labels = ['2021', '2022', '2023', '2024', '2025', '2026'];
    incomeData = [48000, 56000, 64000, 72000, 81000, 92000];
    expenseData = [36000, 41000, 45000, 51000, 58000, 64000];
  } else {
    // Monthly default
    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    incomeData = [5100, 5400, 5200, 5800, 6100, 5900, 6400, 6650, 6200];
    expenseData = [3200, 3400, 3100, 3800, 3600, 3950, 4100, 4240, 3240];
  }

  // Clear canvas
  ctx.clearRect(0, 0, w, h);

  const paddingLeft = w < 360 ? 40 : 55;
  const paddingRight = 15;
  const paddingTop = 25;
  const paddingBottom = 40;

  const chartW = w - paddingLeft - paddingRight;
  const chartH = h - paddingTop - paddingBottom;

  const maxVal = Math.max(...incomeData, ...expenseData) * 1.2;

  // Grid lines
  ctx.strokeStyle = '#f1f5f9';
  ctx.lineWidth = 1;
  const gridSteps = 4;
  for (let i = 0; i <= gridSteps; i++) {
    const y = paddingTop + (chartH / gridSteps) * i;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(w - paddingRight, y);
    ctx.stroke();

    // Axis labels
    const valLabel = Math.round(maxVal - (maxVal / gridSteps) * i);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('$' + (valLabel >= 1000 ? (valLabel / 1000).toFixed(1) + 'k' : valLabel), paddingLeft - 6, y + 4);
  }

  // Draw dual bars for each point
  const barGroupWidth = chartW / labels.length;
  const barWidth = Math.max(4, Math.min(22, (barGroupWidth - 10) / 2));

  labels.forEach((label, idx) => {
    const groupCenterX = paddingLeft + (idx * barGroupWidth) + (barGroupWidth / 2);

    // Income Bar (Green)
    const incH = (incomeData[idx] / maxVal) * chartH;
    const incX = groupCenterX - barWidth - 2;
    const incY = paddingTop + chartH - incH;

    ctx.fillStyle = '#10b981';
    roundRect(ctx, incX, incY, barWidth, incH, 4);

    // Expense Bar (Amber)
    const expH = (expenseData[idx] / maxVal) * chartH;
    const expX = groupCenterX + 2;
    const expY = paddingTop + chartH - expH;

    ctx.fillStyle = '#f59e0b';
    roundRect(ctx, expX, expY, barWidth, expH, 4);

    // X-axis label
    ctx.fillStyle = '#64748b';
    ctx.font = (w < 360 ? '10px' : '11px') + ' Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, groupCenterX, h - 15);
  });
}

function roundRect(ctx, x, y, width, height, radius) {
  if (height <= 0) return;
  if (width < 2 * radius) radius = width / 2;
  if (height < 2 * radius) radius = height / 2;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
  ctx.fill();
}

// Category Breakdown Canvas Donut
function initCategoryDonut(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const parent = canvas.parentElement;
  const parentW = parent ? parent.clientWidth : 280;
  const parentH = parent ? parent.clientHeight : 240;
  const dpr = window.devicePixelRatio || 1;

  const w = parentW || 280;
  const h = parentH || 240;

  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.width = w * dpr;
  canvas.height = h * dpr;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const cx = w / 2;
  const cy = h / 2;
  const outerRadius = Math.max(30, Math.min(cx, cy) - 18);
  const innerRadius = outerRadius * 0.6;

  const categories = [
    { name: 'Food & Dining', pct: 0.28, color: '#f97316' },
    { name: 'Transportation', pct: 0.16, color: '#0284c7' },
    { name: 'Shopping', pct: 0.14, color: '#8b5cf6' },
    { name: 'Utilities', pct: 0.18, color: '#ef4444' },
    { name: 'Entertainment', pct: 0.10, color: '#ec4899' },
    { name: 'Other', pct: 0.14, color: '#10b981' }
  ];

  let currentAngle = -0.5 * Math.PI;

  categories.forEach(item => {
    const sliceAngle = item.pct * 2 * Math.PI;
    ctx.beginPath();
    ctx.arc(cx, cy, outerRadius, currentAngle, currentAngle + sliceAngle);
    ctx.arc(cx, cy, innerRadius, currentAngle + sliceAngle, currentAngle, true);
    ctx.closePath();
    ctx.fillStyle = item.color;
    ctx.fill();
    currentAngle += sliceAngle;
  });

  // Center text
  ctx.fillStyle = '#0f172a';
  const fontSize = Math.max(13, Math.min(18, Math.floor(w / 16)));
  ctx.font = 'bold ' + fontSize + 'px Plus Jakarta Sans, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('$3,240', cx, cy + 2);
  ctx.fillStyle = '#64748b';
  ctx.font = '10px Inter, sans-serif';
  ctx.fillText('Total Expenses', cx, cy + fontSize);
}

// ==========================================
// 5. PERIOD BUTTON TOGGLES
// ==========================================
function initPeriodToggles() {
  const periodBtns = document.querySelectorAll('.period-btn');
  periodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      periodBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const period = btn.dataset.period || 'monthly';
      initIncomeExpenseChart('incomeExpenseChart', period);

      // Update comparison metrics
      const incEl = document.getElementById('compAvgIncome');
      const expEl = document.getElementById('compAvgExpense');
      const remEl = document.getElementById('compAvgRemaining');
      const rateEl = document.getElementById('compSavingsRate');

      if (period === 'weekly') {
        if (incEl) incEl.textContent = '$4,400';
        if (expEl) expEl.textContent = '$2,350';
        if (remEl) remEl.textContent = '$2,050';
        if (rateEl) rateEl.textContent = '46.5%';
      } else if (period === 'yearly') {
        if (incEl) incEl.textContent = '$92,000';
        if (expEl) expEl.textContent = '$64,000';
        if (remEl) remEl.textContent = '$28,000';
        if (rateEl) rateEl.textContent = '30.4%';
      } else {
        if (incEl) incEl.textContent = '$6,200';
        if (expEl) expEl.textContent = '$3,240';
        if (remEl) remEl.textContent = '$2,960';
        if (rateEl) rateEl.textContent = '47.7%';
      }
    });
  });
}

// ==========================================
// 6. FORM VALIDATION ENGINE
// ==========================================
function validateField(input) {
  const name = input.name;
  const val = input.value.trim();
  let isValid = true;
  let message = '';

  const parent = input.closest('.form-group') || input.parentElement;
  let feedback = parent.querySelector('.form-feedback');

  if (!feedback) {
    feedback = document.createElement('span');
    feedback.className = 'form-feedback';
    parent.appendChild(feedback);
  }

  // Specific rules
  if (input.required && val === '') {
    isValid = false;
    message = 'This field is required.';
  } else if (name === 'expenseName' || name === 'incomeSource' || name === 'fullName' || name === 'goalName') {
    // Letters & spaces only, reject numbers & arbitrary symbols
    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    if (!nameRegex.test(val)) {
      isValid = false;
      message = 'Please enter letters and spaces only (2-50 characters, no numbers).';
    }
  } else if (name === 'amount' || name === 'targetAmount' || name === 'monthlyBudget') {
    // Numbers only, > 0, no negative values
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0 || !/^\d+(\.\d{1,2})?$/.test(val)) {
      isValid = false;
      message = 'Please enter a valid positive numeric amount (e.g. 120 or 49.99).';
    }
  } else if (input.type === 'email' || name === 'email') {
    // Email regex RFC standard
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      isValid = false;
      message = 'Please enter a valid email address (e.g. user@example.com).';
    }
  } else if (name === 'mobile' || name === 'phone') {
    // Numbers and standard phone characters
    if (val !== '' && !/^[0-9+\-\s()]{7,20}$/.test(val)) {
      isValid = false;
      message = 'Please enter a valid mobile number (e.g. 10 digits).';
    }
  } else if (input.type === 'date' || name === 'date' || name === 'targetDate') {
    if (val === '') {
      isValid = false;
      message = 'Please select a valid date.';
    }
  } else if (name === 'password') {
    if (val.length < 8 || !/\d/.test(val) || !/[a-zA-Z]/.test(val)) {
      isValid = false;
      message = 'Password must be at least 8 characters and include letters & numbers.';
    }
  } else if (name === 'confirmPassword') {
    const pwdInput = document.querySelector('input[name="password"]');
    if (pwdInput && val !== pwdInput.value) {
      isValid = false;
      message = 'Passwords do not match.';
    }
  } else if (input.type === 'checkbox' && input.required && !input.checked) {
    isValid = false;
    message = 'You must accept the terms to continue.';
  }

  if (!isValid) {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    feedback.className = 'form-feedback feedback-invalid';
    feedback.textContent = message;
  } else {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    feedback.textContent = '';
  }

  return isValid;
}

function attachFormValidation(formSelector, onSuccess) {
  const form = document.querySelector(formSelector);
  if (!form) return;

  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('is-invalid')) {
        validateField(input);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let allValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) {
        allValid = false;
      }
    });

    if (allValid) {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      onSuccess(data, form);
    } else {
      showToast('Please fix errors in highlighted fields.', 'error');
    }
  });
}

// Password toggle helper
function initPasswordToggles() {
  const toggles = document.querySelectorAll('.password-toggle-btn');
  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input');
      if (input) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        btn.innerHTML = isPassword ? '👁️' : '🔒';
      }
    });
  });
}

// ==========================================
// 7. TOAST NOTIFICATION SYSTEM
// ==========================================
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-notification-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-notification-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
    <div>${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ==========================================
// 8. TESTIMONIAL CAROUSEL SLIDER
// ==========================================
function initTestimonialSlider() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  const dotsContainer = document.querySelector('.slider-dots');

  if (!slides.length) return;

  let currentIdx = 0;

  // Build dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Slide ${idx + 1}`);
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });
  }

  function goToSlide(idx) {
    slides[currentIdx].classList.remove('active');
    const dots = document.querySelectorAll('.slider-dot');
    if (dots[currentIdx]) dots[currentIdx].classList.remove('active');

    currentIdx = (idx + slides.length) % slides.length;

    slides[currentIdx].classList.add('active');
    if (dots[currentIdx]) dots[currentIdx].classList.add('active');
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => goToSlide(currentIdx + 1));
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', () => goToSlide(currentIdx - 1));
  }

  // Auto-slide every 6 seconds
  setInterval(() => {
    goToSlide(currentIdx + 1);
  }, 6000);
}

// ==========================================
// 9. FAQ ACCORDION
// ==========================================
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(other => other.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

// ==========================================
// 10. STATISTICS NUMBER COUNTER
// ==========================================
function initNumberCounters() {
  const counterElements = document.querySelectorAll('.counter-anim');
  if (!counterElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target')) || 0;
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const isDecimal = el.getAttribute('data-decimal') === 'true';

        let count = 0;
        const duration = 1800;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out curve
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentVal = target * easeOut;

          el.textContent = prefix + (isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal).toLocaleString()) + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = prefix + (isDecimal ? target.toFixed(1) : target.toLocaleString()) + suffix;
          }
        }

        requestAnimationFrame(updateCounter);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  counterElements.forEach(el => observer.observe(el));
}

// ==========================================
// 11. TRANSACTION FILTERING & RENDERING
// ==========================================
function renderTransactionRows(txList, targetTbodyId) {
  const tbody = document.getElementById(targetTbodyId);
  if (!tbody) return;

  if (txList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2rem; color: #94a3b8;">No transactions found matching criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = txList.map(tx => `
    <tr>
      <td style="font-weight:600; color:#0f172a;">${tx.date}</td>
      <td>
        <div style="font-weight:700; color:#0f172a;">${tx.name}</div>
        <div style="font-size:0.78rem; color:#64748b;">${tx.notes || '—'}</div>
      </td>
      <td><span class="section-pill" style="margin-bottom:0; font-size:0.75rem;">${tx.category}</span></td>
      <td>${tx.method}</td>
      <td>
        <span class="tx-type-tag ${tx.type === 'expense' ? 'type-expense' : 'type-income'}">
          ${tx.type === 'expense' ? '− Expense' : '+ Income'}
        </span>
      </td>
      <td class="tx-amount ${tx.type === 'expense' ? 'negative' : 'positive'}">
        ${tx.type === 'expense' ? '−$' : '+$'}${parseFloat(tx.amount).toFixed(2)}
      </td>
    </tr>
  `).join('');
}

function initTransactionFilters() {
  const pills = document.querySelectorAll('.tx-pill-btn');
  const searchInput = document.getElementById('txSearchInput');
  const sortSelect = document.getElementById('txSortSelect');

  let activeType = 'all';

  function applyFilters() {
    let list = StacklyStore.getTransactions();

    if (activeType !== 'all') {
      list = list.filter(item => item.type === activeType);
    }

    if (searchInput && searchInput.value.trim() !== '') {
      const q = searchInput.value.toLowerCase().trim();
      list = list.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.notes && item.notes.toLowerCase().includes(q))
      );
    }

    if (sortSelect) {
      const val = sortSelect.value;
      if (val === 'date-desc') {
        list.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else if (val === 'date-asc') {
        list.sort((a, b) => new Date(a.date) - new Date(b.date));
      } else if (val === 'amount-desc') {
        list.sort((a, b) => b.amount - a.amount);
      } else if (val === 'amount-asc') {
        list.sort((a, b) => a.amount - b.amount);
      }
    }

    renderTransactionRows(list, 'recentTxBody');
    renderTransactionRows(list, 'expensesTxBody');
  }

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeType = pill.dataset.filter || 'all';
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }
  if (sortSelect) {
    sortSelect.addEventListener('change', applyFilters);
  }

  applyFilters();
}

// ==========================================
// 12. SAVINGS GOALS DEPOSIT MODAL
// ==========================================
function initSavingsGoalActions() {
  const depositBtns = document.querySelectorAll('.btn-deposit-goal');
  const modal = document.getElementById('depositModal');
  const closeBtn = document.getElementById('closeDepositModal');
  const goalIdInput = document.getElementById('modalGoalId');
  const goalNameTitle = document.getElementById('modalGoalTitle');

  depositBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.goalId;
      const name = btn.dataset.goalName;
      if (goalIdInput) goalIdInput.value = id;
      if (goalNameTitle) goalNameTitle.textContent = `Deposit to ${name}`;
      if (modal) modal.classList.add('show');
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('show'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('show');
    });
  }

  attachFormValidation('#depositGoalForm', (data, form) => {
    const goalId = data.goalId;
    const amount = parseFloat(data.amount);
    StacklyStore.depositGoal(goalId, amount);

    // Also record as savings transaction
    StacklyStore.addTransaction({
      name: `Deposit: ${data.goalTitle || 'Savings Goal'}`,
      category: 'Savings',
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      method: 'Bank Transfer',
      type: 'expense',
      notes: 'Transferred to dedicated savings goal'
    });

    showToast(`Successfully deposited $${amount.toFixed(2)} to savings goal!`, 'success');
    if (modal) modal.classList.remove('show');
    form.reset();
    setTimeout(() => window.location.reload(), 1200);
  });
}

// ==========================================
// 12.5. REAL-TIME INPUT SANITIZATION & 404 BUTTON ROUTING
// ==========================================
function initRealtimeFormSanitization() {
  document.addEventListener('input', (e) => {
    const target = e.target;
    if (!target) return;

    // Sanitize Name inputs: allow letters & spaces only (strip numbers)
    if (
      target.classList.contains('input-name') ||
      target.name === 'fullName' ||
      target.name === 'name' ||
      target.id === 'regFullName' ||
      target.id === 'contact-name'
    ) {
      if (/[0-9]/.test(target.value)) {
        target.value = target.value.replace(/[0-9]/g, '');
        if (typeof showToast === 'function') {
          showToast('Name fields allow letters and spaces only (numbers are blocked).', 'warning');
        }
      }
    }

    // Sanitize Phone inputs: allow digits and phone symbols only (strip letters)
    if (
      target.classList.contains('input-phone') ||
      target.name === 'mobile' ||
      target.name === 'phone' ||
      target.id === 'regMobile' ||
      target.id === 'contact-mobile' ||
      target.type === 'tel'
    ) {
      if (/[a-zA-Z]/.test(target.value)) {
        target.value = target.value.replace(/[a-zA-Z]/g, '');
        if (typeof showToast === 'function') {
          showToast('Phone fields allow digits only (letters are blocked).', 'warning');
        }
      }
    }
  });
}

// Smart Go Back / Home navigation function for 404 page
function goBackOrHome() {
  if (document.referrer && document.referrer !== window.location.href && !document.referrer.includes('404.html')) {
    window.history.back();
  } else {
    window.location.href = 'index.html';
  }
}

function init404ActionButtons() {
  // Do NOT run 404 redirect interceptor on 404.html itself
  if (window.location.pathname.endsWith('404.html')) return;

  document.addEventListener('click', (e) => {
    const target = e.target;
    const btn = target.closest('button, .btn, .btn-action, .btn-primary, .btn-secondary, .btn-emerald, .btn-outline, .btn-footer-accent, .btn-footer-dark, .action-btn, .category-footer-link, a[href]');
    if (!btn) return;

    const href = btn.getAttribute('href') || '';

    // Exclude menu toggles and password toggles
    if (
      btn.classList.contains('hamburger-btn') ||
      btn.classList.contains('password-toggle-btn') ||
      btn.classList.contains('sidebar-close-btn') ||
      btn.classList.contains('mobile-drawer-close') ||
      btn.classList.contains('btn-error-back') ||
      btn.classList.contains('btn-error-home') ||
      btn.closest('.error-page-container') ||
      btn.id === 'dashboardSidebarToggle' ||
      btn.id === 'closeDashboardSidebar'
    ) {
      return;
    }

    // Handle dashboard views (user-*.html & admin-*.html)
    const isDashboardPage = window.location.pathname.includes('user-') || window.location.pathname.includes('admin-');
    if (isDashboardPage) {
      // Allow navigation on sidebar items
      if (btn.closest('.dashboard-sidebar')) {
        return;
      }
      // ALL inner buttons and links inside dashboard views redirect to 404.html
      e.preventDefault();
      window.location.href = '404.html';
      return;
    }

    // Exclude login.html, register.html, and auth form submits on public auth pages
    if (
      href.includes('login.html') ||
      href.includes('register.html') ||
      btn.closest('#loginForm') ||
      btn.closest('#registerForm') ||
      btn.id === 'fillDemoCreds'
    ) {
      return;
    }

    // Redirect all generic action buttons on public pages to 404.html
    if (btn.matches('button, .btn, .btn-action, .btn-primary, .btn-secondary, .btn-emerald, .btn-outline, .btn-footer-accent, .btn-footer-dark, .action-btn, .category-footer-link')) {
      e.preventDefault();
      window.location.href = '404.html';
    }
  });
}

// ==========================================
// 13. DOM INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initDashboardSidebar();
  initIncomeExpenseChart('incomeExpenseChart', 'monthly');
  initCategoryDonut('categoryDonutChart');
  initPeriodToggles();
  initPasswordToggles();
  initTestimonialSlider();
  initFaqAccordion();
  initNumberCounters();
  initTransactionFilters();
  initSavingsGoalActions();
  initRealtimeFormSanitization();
  init404ActionButtons();

  // Handle Add Expense Form on add-expense.html
  attachFormValidation('#addExpenseForm', (data, form) => {
    StacklyStore.addTransaction({
      name: data.expenseName,
      category: data.category,
      amount: parseFloat(data.amount),
      date: data.date,
      method: data.paymentMethod,
      type: 'expense',
      notes: data.notes || ''
    });
    showToast(`Expense "$${parseFloat(data.amount).toFixed(2)}" added successfully!`, 'success');
    form.reset();
    setTimeout(() => {
      window.location.href = 'expenses.html';
    }, 1200);
  });

  // Handle Add Income Form on income.html
  attachFormValidation('#addIncomeForm', (data, form) => {
    StacklyStore.addTransaction({
      name: data.incomeSource,
      category: 'Income',
      amount: parseFloat(data.amount),
      date: data.date,
      method: data.incomeType,
      type: 'income',
      notes: data.notes || ''
    });
    showToast(`Income "$${parseFloat(data.amount).toFixed(2)}" logged successfully!`, 'success');
    form.reset();
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  });

  // Handle Login Form with Workspace Role Selection
  attachFormValidation('#loginForm', (data) => {
    const roleSelect = document.getElementById('loginRole');
    const destination = roleSelect ? roleSelect.value : 'user-dashboard.html';
    const roleName = destination.includes('admin') ? 'Administrator' : 'User';
    showToast(`Welcome back, ${data.email.split('@')[0]}! Redirecting to ${roleName} Console...`, 'success');
    setTimeout(() => {
      window.location.href = destination;
    }, 1000);
  });

  // Handle Registration Form
  attachFormValidation('#registerForm', (data) => {
    showToast(`Account successfully created for ${data.fullName}! Loading your workspace...`, 'success');
    setTimeout(() => {
      window.location.href = 'user-dashboard.html';
    }, 1200);
  });

  // Handle Contact Form
  attachFormValidation('#contactForm', (data, form) => {
    showToast('Thank you! Your message has been received. Our finance support team will respond within 24 hours.', 'success');
    form.reset();
  });

  // Set Budget Modal on budget.html
  attachFormValidation('#setBudgetForm', (data, form) => {
    const newMonthly = parseFloat(data.monthlyBudget);
    const b = StacklyStore.getBudget();
    b.monthlyBudget = newMonthly;
    StacklyStore.setBudget(b);
    showToast(`Monthly budget updated to $${newMonthly.toLocaleString()}!`, 'success');
    const modal = document.getElementById('setBudgetModal');
    if (modal) modal.classList.remove('show');
    setTimeout(() => window.location.reload(), 1000);
  });

  // Responsive Chart Redraw on Viewport Resize / Orientation Change
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (document.getElementById('incomeExpenseChart')) {
        initIncomeExpenseChart('incomeExpenseChart');
      }
      if (document.getElementById('categoryDonutChart')) {
        initCategoryDonutChart('categoryDonutChart');
      }
    }, 150);
  });
});

