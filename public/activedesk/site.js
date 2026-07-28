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
    returnUrl: "https://kodekenobi.github.io/activedesk/dashboard.html",
    cancelUrl: "https://kodekenobi.github.io/activedesk/",
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
  const macButton = document.getElementById("downloadMacBtn");
  if (macButton && macButton.tagName === "BUTTON") {
    macButton.addEventListener("click", () => showMacInstallModal());
  }

  const winBtn = document.getElementById("downloadWinBtn");
  if (winBtn && winBtn.tagName === "A") {
    const valid = /^https:\/\//.test(SITE_CONFIG.downloads.win || "");
    winBtn.href = valid ? SITE_CONFIG.downloads.win : "#";
  }

  const modalDownloadBtn = document.getElementById("modalDownloadBtn");
  if (modalDownloadBtn && modalDownloadBtn.tagName === "A") {
    const valid = /^https:\/\//.test(SITE_CONFIG.downloads.mac || "");
    modalDownloadBtn.href = valid ? SITE_CONFIG.downloads.mac : "#";
  }
}

function showMacInstallModal() {
  const modal = document.getElementById("macInstallModal");
  if (modal) {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }
}

function closeMacInstallModal() {
  const modal = document.getElementById("macInstallModal");
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

function setupMacInstallModal() {
  const modal = document.getElementById("macInstallModal");
  const closeBtn = document.getElementById("modalCloseBtn");
  const modalClose = document.querySelector(".modal-close");
  const copyBtn = document.querySelector(".copy-btn");
  const fullCommand = "chmod +x ~/Downloads/install-activedesk.command && ~/Downloads/install-activedesk.command";

  // Close button handlers
  if (closeBtn) {
    closeBtn.addEventListener("click", closeMacInstallModal);
  }
  if (modalClose) {
    modalClose.addEventListener("click", closeMacInstallModal);
  }

  // Click outside modal to close
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeMacInstallModal();
      }
    });
  }

  // Copy command button
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(fullCommand).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "Copied";
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2000);
      });
    });
  }
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

function initInlineLicenseSwap() {
  const licenseSlot = document.querySelector(".inline-license-slot");
  const heroCard = document.querySelector(".hero-card");
  if (!licenseSlot || !heroCard) return;

  const defaultText = licenseSlot.dataset.defaultText || "license key";
  const activeText = licenseSlot.dataset.activeText || defaultText;

  function syncActiveKeyScale() {
    const previousText = licenseSlot.textContent || defaultText;
    const wasActive = licenseSlot.classList.contains("key-active");

    licenseSlot.classList.remove("key-active", "key-switching");

    licenseSlot.textContent = defaultText;
    const defaultWidth = licenseSlot.getBoundingClientRect().width;

    licenseSlot.textContent = activeText;
    const activeWidth = licenseSlot.getBoundingClientRect().width;

    const scale = activeWidth > 0 ? defaultWidth / activeWidth : 1;
    licenseSlot.style.setProperty("--license-key-scale", String(scale));

    licenseSlot.textContent = previousText;
    licenseSlot.classList.toggle("key-active", wasActive);
  }

  function setLicenseState(isActive) {
    const alreadyActive = licenseSlot.classList.contains("key-active");
    if (alreadyActive === isActive) return;

    licenseSlot.classList.add("key-switching");
    window.setTimeout(() => {
      licenseSlot.classList.toggle("key-active", isActive);
      licenseSlot.classList.remove("key-switching");
    }, 110);
  }

  function updateInlineLicenseState() {
    const rect = heroCard.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportCenter = viewportHeight / 2;
    const cardCenter = (rect.top + rect.bottom) / 2;
    const isInViewport = rect.bottom > 0 && rect.top < viewportHeight;
    const isNearCenter = Math.abs(cardCenter - viewportCenter) <= 120;

    setLicenseState(isInViewport && isNearCenter);
  }

  window.addEventListener("scroll", updateInlineLicenseState, { passive: true });
  window.addEventListener("resize", () => {
    syncActiveKeyScale();
    updateInlineLicenseState();
  });
  syncActiveKeyScale();
  updateInlineLicenseState();
}

function initPriceStampAnimation() {
  const priceCards = document.querySelectorAll(".price-card");
  if (!priceCards.length) return;

  priceCards.forEach((card) => {
    card.dataset.priceCentered = "false";
  });

  function playPriceStamp(card) {
    const price = card.querySelector(".price");
    if (!price) return;

    price.classList.remove("price-stamp-active");
    void price.offsetWidth;
    price.classList.add("price-stamp-active");
  }

  function updatePriceCardState() {
    const viewportCenter = window.innerHeight / 2;
    const tolerance = 130;

    priceCards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = (rect.top + rect.bottom) / 2;
      const isInViewport = rect.bottom > 0 && rect.top < window.innerHeight;
      const isNearCenter = Math.abs(cardCenter - viewportCenter) <= tolerance;

      if (isInViewport && isNearCenter) {
        card.classList.add("price-center-active");
        if (card.dataset.priceCentered !== "true") {
          card.dataset.priceCentered = "true";
          playPriceStamp(card);
        }
      } else {
        card.classList.remove("price-center-active");
        card.dataset.priceCentered = "false";
        const price = card.querySelector(".price");
        if (price) {
          price.classList.remove("price-stamp-active");
        }
      }
    });
  }

  window.addEventListener("scroll", updatePriceCardState, { passive: true });
  window.addEventListener("resize", updatePriceCardState);
  updatePriceCardState();
}

function initFaqHeadingLift() {
  const faqHeading = document.querySelector("#faq .fade-scroll");
  if (!faqHeading) return;

  faqHeading.classList.add("faq-heading-lift");

  function updateFaqHeadingState() {
    const rect = faqHeading.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportCenter = viewportHeight / 2;
    const headingCenter = (rect.top + rect.bottom) / 2;
    const isInViewport = rect.bottom > 0 && rect.top < viewportHeight;
    const isNearCenter = Math.abs(headingCenter - viewportCenter) <= 150;

    faqHeading.classList.toggle("paper-lift-active", isInViewport && isNearCenter);
  }

  window.addEventListener("scroll", updateFaqHeadingState, { passive: true });
  window.addEventListener("resize", updateFaqHeadingState);
  updateFaqHeadingState();
}

function initStepCardSpotlightSweep() {
  const stepCards = document.querySelectorAll(".steps-grid .step-card");
  if (!stepCards.length) return;

  stepCards.forEach((card) => {
    card.dataset.spotlightCentered = "false";
  });

  function triggerSpotlight(card) {
    card.classList.remove("spotlight-on");
    void card.offsetWidth;
    card.classList.add("spotlight-on");
  }

  function updateSpotlightState() {
    const viewportCenter = window.innerHeight / 2;
    const tolerance = 140;

    stepCards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = (rect.top + rect.bottom) / 2;
      const isInViewport = rect.bottom > 0 && rect.top < window.innerHeight;
      const isNearCenter = Math.abs(cardCenter - viewportCenter) <= tolerance;
      const shouldTrigger = isInViewport && isNearCenter;

      if (shouldTrigger) {
        if (card.dataset.spotlightCentered !== "true") {
          card.dataset.spotlightCentered = "true";
          triggerSpotlight(card);
        }
      } else {
        card.dataset.spotlightCentered = "false";
        card.classList.remove("spotlight-on");
      }
    });
  }

  window.addEventListener("scroll", updateSpotlightState, { passive: true });
  window.addEventListener("resize", updateSpotlightState);
  updateSpotlightState();
}

function initFaqAccordion() {
  const toggles = document.querySelectorAll(".faq-toggle");
  if (!toggles.length) return;

  function splitIntoInkLines(text) {
    const sentenceParts = text
      .split(/(?<=[.!?])\s+/)
      .map((part) => part.trim())
      .filter(Boolean);

    if (sentenceParts.length > 1) return sentenceParts;

    const words = text.split(/\s+/).filter(Boolean);
    const chunks = [];
    for (let i = 0; i < words.length; i += 6) {
      chunks.push(words.slice(i, i + 6).join(" "));
    }
    return chunks;
  }

  function setupInkReveal(panel) {
    const paragraph = panel.querySelector("p");
    if (!paragraph || paragraph.dataset.inkReady === "true") return;

    const originalText = paragraph.textContent.trim();
    const lines = splitIntoInkLines(originalText);
    if (!lines.length) return;

    paragraph.textContent = "";

    lines.forEach((line, index) => {
      const lineWrap = document.createElement("span");
      lineWrap.className = "faq-ink-line";

      const lineText = document.createElement("span");
      lineText.className = "faq-ink-text";
      lineText.style.setProperty("--ink-delay", `${index * 90}ms`);
      lineText.textContent = line;

      lineWrap.appendChild(lineText);
      paragraph.appendChild(lineWrap);
    });

    paragraph.dataset.inkReady = "true";
  }

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const item = toggle.closest(".faq-item");
      if (!item) return;

      const panel = item.querySelector(".faq-panel");
      if (panel) {
        setupInkReveal(panel);
      }

      const isOpen = item.classList.contains("open");
      item.classList.toggle("open", !isOpen);
      toggle.setAttribute("aria-expanded", String(!isOpen));

      if (!panel) return;

      if (!isOpen) {
        panel.classList.remove("ink-reveal");
        void panel.offsetWidth;
        panel.classList.add("ink-reveal");
      } else {
        panel.classList.remove("ink-reveal");
      }
    });
  });
}

updateDownloadLinks();
setupMacInstallModal();
initScrollFadeAnimation();
initMobileMenu();
initDownloadButtonGlow();
initInlineLicenseSwap();
initPriceStampAnimation();
initFaqHeadingLift();
initStepCardSpotlightSweep();
initFaqAccordion();
bindPurchaseButtons();