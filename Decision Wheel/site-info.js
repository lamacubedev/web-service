const infoElements = {
  trigger: document.querySelector("#infoMenuButton"),
  drawer: document.querySelector("#infoDrawer"),
  overlay: document.querySelector("#infoOverlay"),
  close: document.querySelector("#infoCloseButton"),
};

function openInfoDrawer() {
  if (!infoElements.drawer) return;
  infoElements.overlay.hidden = false;
  infoElements.drawer.hidden = false;
  requestAnimationFrame(() => {
    infoElements.overlay.classList.add("is-open");
    infoElements.drawer.classList.add("is-open");
  });
  infoElements.trigger?.setAttribute("aria-expanded", "true");
  document.body.classList.add("info-lock");
  infoElements.close?.focus();
}

function closeInfoDrawer() {
  if (!infoElements.drawer) return;
  infoElements.overlay.classList.remove("is-open");
  infoElements.drawer.classList.remove("is-open");
  infoElements.trigger?.setAttribute("aria-expanded", "false");
  document.body.classList.remove("info-lock");
  window.setTimeout(() => {
    infoElements.overlay.hidden = true;
    infoElements.drawer.hidden = true;
  }, 200);
}

infoElements.trigger?.addEventListener("click", () => {
  if (infoElements.drawer.classList.contains("is-open")) closeInfoDrawer();
  else openInfoDrawer();
});
infoElements.close?.addEventListener("click", closeInfoDrawer);
infoElements.overlay?.addEventListener("click", closeInfoDrawer);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeInfoDrawer();
});

const contactForm = document.querySelector("#contactForm");
contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const config = window.MENU_RUSH_CONTACT || {};
  const data = new FormData(contactForm);
  const submitButton = contactForm.querySelector("button[type='submit']");
  const status = document.querySelector("#contactStatus");

  if (!config.endpoint || !config.serviceId) {
    status.textContent = "문의 접수 기능이 아직 설정되지 않았습니다.";
    status.dataset.state = "error";
    return;
  }

  submitButton.disabled = true;
  status.textContent = "문의를 접수하고 있습니다.";
  status.dataset.state = "loading";
  try {
    const response = await fetch(config.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceId: config.serviceId,
        serviceName: config.serviceName || document.title,
        pageUrl: window.location.href,
        category: data.get("category"),
        name: data.get("name"),
        email: data.get("email"),
        subject: data.get("subject"),
        message: data.get("message"),
        website: data.get("website"),
      }),
    });
    if (!response.ok) throw new Error(`Contact request failed: ${response.status}`);
    contactForm.reset();
    status.textContent = "문의가 접수되었습니다. 확인 후 답변드리겠습니다.";
    status.dataset.state = "success";
  } catch (error) {
    console.warn("Contact submission failed.", error);
    status.textContent = "문의 접수에 실패했습니다. 잠시 후 다시 시도해 주세요.";
    status.dataset.state = "error";
  } finally {
    submitButton.disabled = false;
  }
});
