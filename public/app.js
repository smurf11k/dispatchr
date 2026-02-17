async function addCourier() {
  const id = Number(document.getElementById("courierId").value);
  const x = Number(document.getElementById("courierX").value);
  const y = Number(document.getElementById("courierY").value);

  const res = await fetch("/couriers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, x, y }),
  });

  const data = await res.json();
  document.getElementById("result").textContent = JSON.stringify(data, null, 2);
}

async function createOrder() {
  const id = Number(document.getElementById("orderId").value);
  const x = Number(document.getElementById("restX").value);
  const y = Number(document.getElementById("restY").value);

  const res = await fetch("/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id,
      restaurant: { x, y },
    }),
  });

  const data = await res.json();
  document.getElementById("result").textContent = JSON.stringify(data, null, 2);
}
