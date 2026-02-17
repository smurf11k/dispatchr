let courierList = [];
let assignments = [];
let restaurants = [];
let queuedOrders = [];

const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  draw();
}
window.addEventListener("resize", resize);
setTimeout(resize, 50);

function toCanvas(x, y) {
  const pad = 44;
  return [
    pad + (x / 100) * (canvas.width - pad * 2),
    pad + ((100 - y) / 100) * (canvas.height - pad * 2),
  ];
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    const gx = 44 + t * (canvas.width - 88);
    const gy = 44 + t * (canvas.height - 88);
    ctx.strokeStyle = i % 5 === 0 ? "#252840" : "#1a1d2e";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(gx, 44);
    ctx.lineTo(gx, canvas.height - 44);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(44, gy);
    ctx.lineTo(canvas.width - 44, gy);
    ctx.stroke();
  }

  ctx.fillStyle = "#3d4466";
  ctx.font = "10px system-ui";
  ctx.textAlign = "center";
  for (let i = 0; i <= 10; i++) {
    const val = i * 10;
    const gx = 44 + (i / 10) * (canvas.width - 88);
    const gy = 44 + ((100 - val) / 100) * (canvas.height - 88);
    ctx.fillText(val, gx, canvas.height - 26);
    ctx.textAlign = "right";
    ctx.fillText(val, 36, gy + 4);
    ctx.textAlign = "center";
  }

  for (const a of assignments) {
    const courier = courierList.find((c) => c.id === a.courierId);
    if (!courier) continue;
    const [cx, cy] = toCanvas(courier.x, courier.y);
    const [ox, oy] = toCanvas(a.orderX, a.orderY);
    ctx.save();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "#6c63ff66";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(ox, oy);
    ctx.stroke();
    ctx.restore();
  }

  for (const r of restaurants) {
    const [rx, ry] = toCanvas(r.x, r.y);
    ctx.save();
    ctx.fillStyle = "#e05a5a";
    ctx.shadowColor = "#e05a5a";
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(rx, ry, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = "#94a3b8";
    ctx.font = "9px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`R${r.id}`, rx, ry + 20);
  }

  for (const c of courierList) {
    const [px, py] = toCanvas(c.x, c.y);
    const color = c.status === "Free" ? "#22c55e" : "#f59e0b";
    ctx.save();
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(px, py, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = "#0f1117";
    ctx.font = "bold 10px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(c.id, px, py + 4);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px system-ui";
    ctx.fillText(`(${c.x},${c.y})`, px, py - 17);
  }
}

function refreshQueueList() {
  const el = document.getElementById("queueList");
  if (!queuedOrders.length) {
    el.innerHTML =
      '<div style="font-size:12px;color:#3d4466;">Queue is empty.</div>';
    return;
  }

  el.innerHTML = queuedOrders
    .map(
      (o, idx) => `
          <div class="courier-item">
            <div class="courier-dot dot-busy"></div>
            <div class="courier-info">
              <div class="courier-name">Order #${o.id}</div>
              <div class="courier-coords">Queue #${idx + 1} • ${o.weight}kg • (${o.restaurant.x}, ${o.restaurant.y})</div>
            </div>
            <span class="badge badge-busy">Queued</span>
          </div>`,
    )
    .join("");
}

function refreshRestaurantSelect() {
  const select = document.getElementById("orderRestaurant");

  if (!restaurants.length) {
    select.innerHTML = "<option value=''>No restaurants</option>";
    return;
  }

  select.innerHTML = restaurants
    .map((r) => `<option value="${r.id}">${r.name} (${r.x}, ${r.y})</option>`)
    .join("");
}

function applyState(state) {
  courierList = (state.couriers ?? []).map((c) => ({ ...c }));
  restaurants = (state.restaurants ?? []).map((r) => ({ ...r }));
  queuedOrders = (state.queue ?? []).map((o) => ({ ...o }));
  assignments = (state.assignments ?? []).map((a) => ({
    courierId: a.courierId,
    orderX: a.restaurant.x,
    orderY: a.restaurant.y,
    orderId: a.orderId,
  }));

  refreshCourierList();
  refreshQueueList();
  refreshRestaurantSelect();
  draw();
}

function refreshCourierList() {
  const el = document.getElementById("courierList");
  if (!courierList.length) {
    el.innerHTML =
      '<div style="font-size:12px;color:#3d4466;">No couriers yet.</div>';
    return;
  }
  el.innerHTML = courierList
    .map(
      (c) => `
          <div class="courier-item">
            <div class="courier-dot ${c.status === "Free" ? "dot-free" : "dot-busy"}"></div>
            <div class="courier-info">
              <div class="courier-name">Courier #${c.id}</div>
              <div class="courier-coords">(${c.x}, ${c.y})</div>
            </div>
            <span class="badge ${c.status === "Free" ? "badge-free" : "badge-busy"}">${c.status}</span>
          </div>`,
    )
    .join("");
}

function log(tag, cls, msg) {
  const el = document.getElementById("logEntries");
  const e = document.createElement("div");
  e.className = "log-entry";
  e.innerHTML = `<span class="tag ${cls}">[${tag}]</span> ${msg} <span style="color:#3d4466;float:right">${new Date().toLocaleTimeString()}</span>`;
  el.prepend(e);
}

async function addCourier() {
  const x = Number(document.getElementById("courierX").value);
  const y = Number(document.getElementById("courierY").value);
  const vehicle = document.getElementById("courierVehicle").value;
  if (!Number.isFinite(x) || !Number.isFinite(y)) return;

  try {
    const res = await fetch("/couriers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x, y, vehicle }),
    });
    const data = await res.json();
    if (!res.ok) {
      log("ERROR", "tag-err", data.error ?? "Failed to add courier");
      return;
    }

    await loadInitialState();
    log(
      "COURIER",
      "tag-ok",
      `#${data.courier.id} (${vehicle}) додано на (${x}, ${y})`,
    );
    ["courierX", "courierY"].forEach(
      (i) => (document.getElementById(i).value = ""),
    );
  } catch (e) {
    log("ERROR", "tag-err", e.message);
  }
}

async function createOrder() {
  const restaurantId = Number(document.getElementById("orderRestaurant").value);
  const weight = Number(document.getElementById("orderWeight").value);
  if (!Number.isFinite(weight) || weight <= 0) return;

  try {
    const res = await fetch("/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantId, weight }),
    });
    const data = await res.json();
    if (!res.ok) {
      log("ERROR", "tag-err", data.error ?? "Failed to create order");
      return;
    }

    if (data.status === "Assigned") {
      await loadInitialState();
      log(
        "ORDER",
        "tag-ok",
        `#${data.orderId} (${weight}кг) → Кур'єр #${data.courierId} [${data.vehicle}] (dist: ${data.distance}, ETA: ${Math.round((data.etaMs ?? 0) / 1000)}s)`,
      );
    } else {
      await loadInitialState();
      log(
        "ORDER",
        "tag-err",
        `Order #${data.orderId} queued at position ${data.position}`,
      );
    }
    ["orderWeight"].forEach((i) => (document.getElementById(i).value = ""));
  } catch (e) {
    log("ERROR", "tag-err", e.message);
  }
}

async function loadInitialState() {
  try {
    const res = await fetch("/state");
    const data = await res.json();
    applyState(data);
  } catch (e) {
    log("ERROR", "tag-err", e.message);
  }
}

loadInitialState();
setInterval(loadInitialState, 1500);
