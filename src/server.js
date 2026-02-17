import express from "express";
import { couriers } from "./data.js";
import { assignCourier } from "./services/assignCourier.js";

const app = express();
app.use(express.json());
app.use(express.static("public"));

/*
app.post("/couriers", (req, res) => {
  const { id, x, y } = req.body;

  couriers.push({
    id,
    status: "Free",
    x,
    y,
  });

  res.json({ message: "Courier added", couriers });
});

app.post("/order", (req, res) => {
  const result = assignCourier(couriers, req.body);
  res.json(result);
});*/

app.post("/couriers", (req, res) => {
  const { id, x, y, vehicle = "walker" } = req.body;
  const maxWeight = { walker: 5, bicycle: 15, car: 50 }[vehicle] ?? 5;

  couriers.push({ id, status: "Free", x, y, vehicle, maxWeight });
  res.json({ message: "Courier added", couriers });
});

app.post("/order", (req, res) => {
  const result = assignCourier(couriers, req.body); // req.body тепер має weight
  res.json(result);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
