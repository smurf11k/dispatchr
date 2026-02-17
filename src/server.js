import express from "express";
import { couriers } from "./data.js";
import { assignCourier } from "./services/assignCourier.js";

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.get("/couriers", (req, res) => {
  res.json({ couriers });
});

app.post("/couriers", (req, res) => {
  const { id, x, y, vehicle = "walker" } = req.body;
  const maxWeight = { walker: 5, bicycle: 15, car: 50 }[vehicle] ?? 5;

  couriers.push({ id, status: "Free", x, y, vehicle, maxWeight });
  res.json({ message: "Courier added", couriers });
});

app.post("/order", (req, res) => {
  const result = assignCourier(couriers, req.body);
  res.json(result);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

/* init */

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  const { default: fetch } = await import("node-fetch");

  const couriers = [
    { id: 1, x: 10, y: 15, vehicle: "walker" },
    { id: 2, x: 35, y: 60, vehicle: "bicycle" },
    { id: 3, x: 70, y: 20, vehicle: "car" },
    { id: 4, x: 85, y: 75, vehicle: "bicycle" },
    { id: 5, x: 50, y: 50, vehicle: "car" },
  ];

  for (const c of couriers) {
    await fetch(`http://localhost:${PORT}/couriers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(c),
    });
  }

  console.log("✅ Кур'єрів ініціалізовано");
});
