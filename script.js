const $ = (s) => document.querySelector(s);

const auth = $("#auth");
const msg = $("#msg");

// ===============================
// SCROLL REVEAL
// ===============================
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => {
  observer.observe(el);
});

// ===============================
// AUTH MODAL
// ===============================
$("#loginOpen").onclick = () => {
  auth.classList.add("show");
};

$("#close").onclick = () => {
  auth.classList.remove("show");
};

// Close when clicking outside modal
auth.addEventListener("click", (e) => {
  if (e.target === auth) {
    auth.classList.remove("show");
  }
});

// ===============================
// API HELPER
// ===============================
async function api(url, options = {}) {
  const response = await fetch(url, {
    credentials: "same-origin",
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

function json(method, body) {
  return {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

// ===============================
// HOSTING LIST
// ===============================
function showHosts(list) {
  const dashboard = document.getElementById("dashboard");

  if (!dashboard) return;

  const old = document.getElementById("liveHosts");

  if (old) {
    old.remove();
  }

  const wrapper = document.createElement("div");

  wrapper.id = "liveHosts";
  wrapper.className = "section";

  wrapper.innerHTML = `
    <p class="eyebrow">LIVE ACCOUNT</p>

    <h2>
      YOUR <span>HOSTINGS.</span>
    </h2>

    <div id="hostCards"></div>
  `;

  dashboard.parentNode.insertBefore(
    wrapper,
    dashboard.nextSibling
  );

  const cards = wrapper.querySelector("#hostCards");

  if (!list.length) {
    cards.innerHTML = `
      <div class="glass">
        No hosting yet.
        Create your first server below.
      </div>
    `;

    return;
  }

  cards.innerHTML = list
    .map(
      (host) => `
        <article
          class="glass"
          style="
            margin:12px 0;
            display:flex;
            justify-content:space-between;
            gap:15px;
            align-items:center;
          "
        >

          <div>
            <b>${escapeHTML(host.name)}</b>

            <span
              style="
                color:${
                  host.status === "ONLINE"
                    ? "#55d77a"
                    : "#777"
                };
              "
            >
              ● ${escapeHTML(host.status)}
            </span>

            <p>
              ${escapeHTML(host.runtime)}
              ·
              ${escapeHTML(host.ram)}
              RAM
              ·
              ${escapeHTML(host.storage)}
            </p>
          </div>

          <div>
            <button onclick="act(${host.id}, 'start')">
              START
            </button>

            <button onclick="act(${host.id}, 'restart')">
              RESTART
            </button>

            <button onclick="act(${host.id}, 'stop')">
              STOP
            </button>
          </div>

        </article>
      `
    )
    .join("");
}

// ===============================
// SECURITY HELPER
// ===============================
function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ===============================
// LOAD HOSTINGS
// ===============================
async function load() {
  try {
    const data = await api("/api/hosts");

    showHosts(data.hosts || []);
  } catch (error) {
    console.log("Not logged in:", error.message);
  }
}

// ===============================
// SERVER ACTIONS
// ===============================
window.act = async function (id, action) {
  try {
    await api(`/api/hosts/${id}/${action}`, {
      method: "POST",
    });

    await load();
  } catch (error) {
    alert(error.message);
  }
};

// ===============================
// LOGIN
// ===============================
$("#login").onclick = async () => {
  const username = $("#user").value.trim();
  const password = $("#pass").value;

  if (!username || !password) {
    msg.textContent = "Username and password required.";
    return;
  }

  try {
    const data = await api(
      "/api/login",
      json("POST", {
        username,
        password,
      })
    );

    msg.textContent = `Welcome ${data.username}`;

    auth.classList.remove("show");

    await load();
  } catch (error) {
    msg.textContent = error.message;
  }
};

// ===============================
// REGISTER
// ===============================
$("#register").onclick = async () => {
  const username = $("#user").value.trim();
  const password = $("#pass").value;

  if (!username || !password) {
    msg.textContent = "Username and password required.";
    return;
  }

  try {
    await api(
      "/api/register",
      json("POST", {
        username,
        password,
      })
    );

    msg.textContent =
      "Account created. Login now.";
  } catch (error) {
    msg.textContent = error.message;
  }
};

// ===============================
// CREATE HOSTING
// ===============================
$("#createForm").onsubmit = async (event) => {
  event.preventDefault();

  const name = $("#name").value.trim();
  const runtime = $("#runtime").value;
  const ram = $("#ram").value;
  const storage = $("#storage").value;

  if (!name) {
    alert("Project name required.");
    return;
  }

  try {
    await api(
      "/api/hosts",
      json("POST", {
        name,
        runtime,
        ram,
        storage,
      })
    );

    $("#name").value = "";

    await load();

    location.hash = "dashboard";
  } catch (error) {
    alert(error.message);
  }
};

// ===============================
// PLAN BUTTONS
// ===============================
document
  .querySelectorAll(".pricing button")
  .forEach((button) => {
    button.onclick = () => {
      $("#loginOpen").click();
    };
  });

// ===============================
// INITIAL LOAD
// ===============================
load();
