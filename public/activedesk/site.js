const SITE_CONFIG = {
  downloads: {
    mac: "https://github.com/KodeKenobi/ActiveDesk/releases/download/v1.0.1/ActiveDesk-1.0.0-arm64.dmg",
    win: "https://github.com/KodeKenobi/ActiveDesk/releases/download/v1.0.1/ActiveDesk.Setup.1.0.0.exe",
  },
  supportEmail: "kodekenobi@gmail.com",
  payfast: {
    receiver: "23594634",
    returnUrl: "https://kodekenobi.github.io/activedesk/dashboard.html",
    cancelUrl: "https://kodekenobi.github.io/activedesk/",
    notifyUrl: "https://kodekenobi.github.io/activedesk/dashboard.html",
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

async function openCheckout(planId, button) {
  const plan = SITE_CONFIG.plans[planId];
  if (!plan) return;

  const originalLabel = button.textContent;
  button.disabled = true;
  button.textContent = "Opening...";
  setPayStatus("Preparing checkout...");

  try {
    // Prompt for email (user will enter it for license key)
    const email = prompt("Enter your email for the license key:");
    if (!email) {
      setPayStatus("Checkout cancelled.");
      return;
    }

    const rate = await getUsdToZarRate();
    
    // Use your PayFast "Pay Now" link here
    // You can find this in PayFast dashboard under "Generate Pay Now Options"
    const payNowLink = `https://www.payfast.co.za/pay/${SITE_CONFIG.payfast.receiver}`; // Replace with your actual Pay Now link
    
    // Append return URL with email and plan as parameters
    const returnParams = new URLSearchParams({
      email,
      plan: planId,
    });
    
    const fullReturnUrl = `${SITE_CONFIG.payfast.returnUrl}?${returnParams.toString()}`;
    
    // For now, direct to PayFast (you'll need to update the Pay Now link in PayFast settings)
    // This opens the default Pay Now link - you should use the specific one from your PayFast account
    window.location.href = payNowLink;
    
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
  const fadeElements = document.querySelectorAll(".fade-scroll");
  
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

updateDownloadLinks();
initScrollFadeAnimation();
bindPurchaseButtons();