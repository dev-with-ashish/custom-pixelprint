const SCROLL_ANIMATION_TRIGGER_CLASSNAME = "m-scroll-trigger";
const SCROLL_ANIMATION_OFFSCREEN_CLASSNAME = "m-scroll-trigger--offscreen";
const SCROLL_ANIMATION_CANCEL_CLASSNAME = "m-scroll-trigger--cancel";

// Check if the device is likely low-end.
function isLowEndDevice() {
  return navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
}

// Updates the element’s visibility while minimizing unnecessary DOM changes.
function updateElementVisibility(element, isVisible) {
  if (isVisible) {
    if (element.classList.contains(SCROLL_ANIMATION_OFFSCREEN_CLASSNAME)) {
      element.classList.remove(SCROLL_ANIMATION_OFFSCREEN_CLASSNAME);
    }
  } else {
    if (!element.classList.contains(SCROLL_ANIMATION_OFFSCREEN_CLASSNAME)) {
      element.classList.add(SCROLL_ANIMATION_OFFSCREEN_CLASSNAME);
    }
    element.classList.remove(SCROLL_ANIMATION_CANCEL_CLASSNAME);
  }
}

// Attaches mobile change listeners globally (only once) to remove trigger classes on mobile.
function attachMobileChangeListeners() {
  if (!window.mobileChangeListenersAttached) {
    const removeTriggerClassGlobal = () => {
      const sidebars = document.getElementsByClassName("m-sidebar");
      Array.from(sidebars).forEach(el =>
        el.classList.remove(SCROLL_ANIMATION_TRIGGER_CLASSNAME)
      );
    };
    document.addEventListener("matchMobile", removeTriggerClassGlobal);
    document.addEventListener("unmatchMobile", removeTriggerClassGlobal);
    window.mobileChangeListenersAttached = true;
  }
}

// IntersectionObserver callback wrapped in requestAnimationFrame to batch DOM updates.
function onIntersection(entries, observer) {
  requestAnimationFrame(() => {
    entries.forEach((entry, index) => {
      const { isIntersecting, target } = entry;
      updateElementVisibility(target, isIntersecting);

      if (isIntersecting) {
        if (target.hasAttribute("data-cascade")) {
          // Update the CSS custom property for animation order.
          target.style.setProperty("--animation-order", index);
        }
        observer.unobserve(target);
      }
    });
  });
}

// Create the IntersectionObserver with a slight offset.
const observer = new IntersectionObserver(onIntersection, {
  rootMargin: "0px 0px -50px 0px",
});

// Initializes the scroll animation trigger on elements.
// If prefers-reduced-motion is enabled, animations are disabled.
function initializeScrollAnimationTrigger(rootEl = document, isDesignModeEvent = false) {
  const elements = rootEl.getElementsByClassName(SCROLL_ANIMATION_TRIGGER_CLASSNAME);
  if (elements.length === 0 || isDesignModeEvent) return;

  // Disable animations if the user prefers reduced motion.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    Array.from(elements).forEach(element => {
      element.classList.remove(SCROLL_ANIMATION_OFFSCREEN_CLASSNAME);
      element.classList.remove(SCROLL_ANIMATION_TRIGGER_CLASSNAME);
    });
    return;
  }

  Array.from(elements).forEach((element) => observer.observe(element));
  attachMobileChangeListeners();
}

// Fallback for low‑end devices: if IntersectionObserver callbacks are delayed,
// remove offscreen classes after a short delay to avoid initial flickering.
function lowEndFallback() {
  const elements = document.getElementsByClassName(SCROLL_ANIMATION_TRIGGER_CLASSNAME);
  Array.from(elements).forEach((element) => {
    element.classList.remove(SCROLL_ANIMATION_OFFSCREEN_CLASSNAME);
  });
}

// Initialize when the DOM content is loaded.
document.addEventListener("DOMContentLoaded", () => {
  initializeScrollAnimationTrigger();

  // If the device is low-end, schedule a fallback to remove offscreen classes
  // after 500ms. Adjust the delay if needed.
  if (isLowEndDevice()) {
    setTimeout(lowEndFallback, 500);
  }
});

// For Shopify design mode to reinitialize animations on section changes.
if (Shopify.designMode) {
  const reinitialize = (event) => initializeScrollAnimationTrigger(event.target, true);
  document.addEventListener("shopify:section:load", reinitialize);
  document.addEventListener("shopify:section:reorder", () => initializeScrollAnimationTrigger(document, true));
}
