async function loadSiteContent() {
  const response = await fetch("/api/site-content");
  if (!response.ok) {
    throw new Error("Unable to load site content.");
  }

  return response.json();
}

function renderServices(services) {
  const container = document.getElementById("service-grid");
  container.innerHTML = services
    .map(
      (service) => `
        <article class="service-card">
          <p class="eyebrow">Service</p>
          <h3>${service.title}</h3>
          <p>${service.description}</p>
        </article>
      `
    )
    .join("");
}

function renderStats(stats) {
  const container = document.getElementById("stat-grid");
  container.innerHTML = stats
    .map(
      (stat) => `
        <div class="stat-item">
          <strong>${stat.value}</strong>
          <span>${stat.label}</span>
        </div>
      `
    )
    .join("");
}

function renderProcess(process) {
  const container = document.getElementById("process-list");
  container.innerHTML = process
    .map(
      (step, index) => `
        <article class="process-item">
          <span class="process-item__number">0${index + 1}</span>
          <h3>Step ${index + 1}</h3>
          <p>${step}</p>
        </article>
      `
    )
    .join("");
}

function renderContact(contact) {
  const container = document.getElementById("contact-details");
  container.innerHTML = `
    <li><strong>Email:</strong> ${contact.email}</li>
    <li><strong>Phone:</strong> ${contact.phone}</li>
    <li><strong>Location:</strong> ${contact.location}</li>
  `;
}

function applyContent(content) {
  document.title = `${content.company} | Interior Design Studio`;
  document.getElementById("hero-eyebrow").textContent = content.hero.eyebrow;
  document.getElementById("hero-title").textContent = content.hero.title;
  document.getElementById("hero-description").textContent = content.hero.description;
  document.getElementById("about-title").textContent = content.about.title;
  document.getElementById("about-paragraph-1").textContent = content.about.paragraphs[0];
  document.getElementById("about-paragraph-2").textContent = content.about.paragraphs[1];

  renderServices(content.services);
  renderStats(content.stats);
  renderProcess(content.process);
  renderContact(content.contact);
}

async function submitContactForm(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const status = document.getElementById("form-status");
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  status.textContent = "Sending your enquiry...";
  status.className = "form-status";

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Unable to submit the form.");
    }

    status.textContent = result.message;
    status.className = "form-status is-success";
    form.reset();
  } catch (error) {
    status.textContent = error.message;
    status.className = "form-status is-error";
  }
}

async function init() {
  try {
    const content = await loadSiteContent();
    applyContent(content);
  } catch (error) {
    document.getElementById("hero-description").textContent =
      "We are preparing the studio profile. Please try again shortly.";
  }

  document.getElementById("contact-form").addEventListener("submit", submitContactForm);
}

init();
