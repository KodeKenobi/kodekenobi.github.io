const SITE_CONFIG = {
  payfastMode: "live", // set to "sandbox" when testing
  downloads: {
    mac: "https://github.com/KodeKenobi/ActiveDesk/releases/download/v1.0.5/install-activedesk.command",
    win: "https://github.com/KodeKenobi/ActiveDesk/releases/download/v1.0.5/ActiveDesk.Setup.1.0.5.exe",
  },
  supportEmail: "kodekenobi@gmail.com",
  payfast: {
    receiverByMode: {
      live: "23594634",
      // sandbox: "10043520",
    },
    returnUrl: "https://kodekenobi.github.io/ActiveDesk/dashboard.html",
    cancelUrl: "https://kodekenobi.github.io/ActiveDesk/",
    notifyUrl: "https://nibzfmjwisfdmwublvyu.supabase.co/functions/v1/payfast-webhook",
  },
  plans: {
    lifetime: {
      usdAmount: 10,
      itemName: "ActiveDesk Lifetime License",
    },
    weekly: {
      usdAmount: 2,
      itemName: "ActiveDesk Weekly License",
    },
    monthly: {
      usdAmount: 5,
      itemName: "ActiveDesk Monthly License",
    },
  },
};

const PAYFAST_PROCESS_URLS = {
  live: "https://payment.payfast.io/eng/process",
  // sandbox: "https://sandbox.payfast.co.za/eng/process",
};

const CHECKOUT_EMAIL_CACHE_KEY = "activedesk_site_checkout_email";

const EXCHANGE_RATE_CACHE_KEY = "activedesk_site_usd_to_zar_rate";
const EXCHANGE_RATE_CACHE_DURATION = 60 * 60 * 1000;
const EXCHANGE_RATE_APIS = [
  {
    url: "https://api.exchangerate-api.com/v4/latest/USD",
    extractRate: (data) => data?.rates?.ZAR || null,
  },
  {
    url: "https://open.er-api.com/v6/latest/USD",
    extractRate: (data) => data?.rates?.ZAR || null,
  },
];

function updateDownloadLinks() {
  const downloadTargets = [
    {
      id: "downloadMacBtn",
      url: SITE_CONFIG.downloads.mac,
      fallbackText: "Set macOS release URL",
    },
    {
      id: "downloadMacBtnSecondary",
      url: SITE_CONFIG.downloads.mac,
      fallbackText: "Set macOS release URL",
    },
    {
      id: "downloadWinBtn",
      url: SITE_CONFIG.downloads.win,
      fallbackText: "Set Windows release URL",
    },
    {
      id: "downloadWinBtnSecondary",
      url: SITE_CONFIG.downloads.win,
      fallbackText: "Set Windows release URL",
    },
  ];

  downloadTargets.forEach((target) => {
    const link = document.getElementById(target.id);
    if (!link) return;

    const valid = /^https:\/\//.test(target.url || "");
    link.href = valid ? target.url : "#";
    if (!valid) {
      link.textContent = target.fallbackText;
    }
  });
}

async function fetchRateFromApi(api) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(api.url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) return null;
    const data = await response.json();
    return api.extractRate(data);
  } catch {
    return null;
  }
}

async function getUsdToZarRate() {
  const cached = localStorage.getItem(EXCHANGE_RATE_CACHE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < EXCHANGE_RATE_CACHE_DURATION) {
        return parsed.rate;
      }
    } catch {
      /* ignore */
    }
  }

  for (const api of EXCHANGE_RATE_APIS) {
    const rate = await fetchRateFromApi(api);
    if (rate) {
      localStorage.setItem(EXCHANGE_RATE_CACHE_KEY, JSON.stringify({ rate, timestamp: Date.now() }));
      return rate;
    }
  }

  return 18.5;
}

function setPayStatus(message) {
  const status = document.getElementById("payStatus");
  if (status) {
    status.textContent = message;
  }
}

function isValidEmailAddress(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "");
}

function getCheckoutEmail() {
  const cached = (localStorage.getItem(CHECKOUT_EMAIL_CACHE_KEY) || "").trim().toLowerCase();
  const promptValue = typeof window.prompt === "function"
    ? window.prompt("Enter the email used for this purchase (needed to recover your license):", cached)
    : cached;
  const email = (promptValue || "").trim().toLowerCase();
  if (!isValidEmailAddress(email)) return null;
  localStorage.setItem(CHECKOUT_EMAIL_CACHE_KEY, email);
  return email;
}

function createPaymentReference(planId) {
  const suffix = Math.random().toString(36).slice(2, 8);
  return `AD-${planId}-${Date.now()}-${suffix}`;
}

async function openCheckout(planId, button) {
  const plan = SITE_CONFIG.plans[planId];
  if (!plan) return;

  const originalLabel = button.textContent;
  button.disabled = true;
  button.textContent = "Opening...";
  setPayStatus("Preparing checkout...");

  try {
    const rate = await getUsdToZarRate();
    const zarAmount = plan.usdAmount * rate;
    const checkoutEmail = getCheckoutEmail();
    if (!checkoutEmail) {
      setPayStatus("Please enter a valid purchase email before checkout.");
      return;
    }

    const returnParams = new URLSearchParams({
      plan: planId,
      email: checkoutEmail,
    });

    const fullReturnUrl = `${SITE_CONFIG.payfast.returnUrl}?${returnParams.toString()}`;

    const mode = SITE_CONFIG.payfastMode === "sandbox" ? "sandbox" : "live";
    const receiver = SITE_CONFIG.payfast.receiverByMode?.[mode] || SITE_CONFIG.payfast.receiverByMode.live;
    const paymentRef = createPaymentReference(planId);
    const params = new URLSearchParams({
      cmd: "_paynow",
      receiver,
      m_payment_id: paymentRef,
      return_url: fullReturnUrl,
      cancel_url: SITE_CONFIG.payfast.cancelUrl,
      notify_url: SITE_CONFIG.payfast.notifyUrl,
      amount: zarAmount.toFixed(2),
      item_name: plan.itemName,
      custom_str1: checkoutEmail,
      custom_str2: planId,
    });

    const processUrl = PAYFAST_PROCESS_URLS[mode];
    window.location.href = `${processUrl}?${params.toString()}`;

    setPayStatus("Redirecting to payment...");
  } catch {
    setPayStatus("Could not open checkout right now. Please try again.");
  } finally {
    button.disabled = false;
    button.textContent = originalLabel;
  }
}

function bindPurchaseButtons() {
  document.querySelectorAll(".buy-btn").forEach((button) => {
    button.addEventListener("click", () => void openCheckout(button.dataset.plan, button));
  });
}

function initScrollFadeAnimation() {
  // Select all elements with animation classes
  const fadeElements = document.querySelectorAll(".fade-scroll, .slide-in-left, .slide-in-right, .drop-in-down, .faq-item, .faq-item-left, .faq-item-right");
  
  fadeElements.forEach((element) => {
    element.dataset.animating = "false";
  });
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const isAnimating = entry.target.dataset.animating === "true";
      if (isAnimating) return;
      
      if (entry.isIntersecting && !entry.target.classList.contains("visible")) {
        entry.target.dataset.animating = "true";
        entry.target.classList.remove("hidden");
        entry.target.classList.add("visible");
        
        setTimeout(() => {
          entry.target.dataset.animating = "false";
        }, 700);
      } else if (!entry.isIntersecting && entry.target.classList.contains("visible")) {
        entry.target.dataset.animating = "true";
        entry.target.classList.remove("visible");
        entry.target.classList.add("hidden");
        
        setTimeout(() => {
          entry.target.dataset.animating = "false";
        }, 700);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: "50px 0px 50px 0px",
  });
  
  fadeElements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      element.classList.add("visible");
    }
    observer.observe(element);
  });
}

function initMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  
  if (!mobileMenuBtn || !mobileMenu) return;

  function setMenuState(isOpen) {
    mobileMenuBtn.classList.toggle("active", isOpen);
    mobileMenu.classList.toggle("active", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
  }
  
  mobileMenuBtn.addEventListener("click", () => {
    const isOpen = !mobileMenu.classList.contains("active");
    setMenuState(isOpen);
  });
  
  // Close menu when clicking on a link
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setMenuState(false);
    });
  });
}

function initDownloadButtonGlow() {
  const downloadButtons = document.querySelectorAll(".btn-download");
  const statusHeading = document.querySelector(".status-heading");
  const glowElements = [...downloadButtons];
  if (statusHeading) glowElements.push(statusHeading);
  
  function updateGlowState() {
    glowElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;
      
      // Calculate element center
      const elementCenter = (rect.top + rect.bottom) / 2;
      
      // Only glow when element center is within ±80px of viewport center
      const tolerance = 80;
      const isNearCenter = Math.abs(elementCenter - viewportCenter) <= tolerance;
      
      // Check if element is visible in viewport
      const isInViewport = rect.bottom > 0 && rect.top < viewportHeight;
      
      if (isInViewport && isNearCenter) {
        element.classList.add("glow-active");
      } else {
        element.classList.remove("glow-active");
      }
    });
  }
  
  // Check on scroll
  window.addEventListener("scroll", updateGlowState, { passive: true });
  
  // Initial check
  updateGlowState();
}

updateDownloadLinks();
initScrollFadeAnimation();
initMobileMenu();
initDownloadButtonGlow();
bindPurchaseButtons();