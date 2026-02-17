import express from "express";
import { couriers } from "./data.js";
import { assignCourier } from "./services/assignCourier.js";

const app = express();
app.use(express.json());
app.use(express.static("public"));

export const orderQueue = [];
export const restaurants = [];
export const activeAssignments = [];

const ASSIGNMENT_DURATION_MS = 12000;
let nextCourierId = 1;
let nextOrderId = 1;

function vehicleMaxWeight(vehicle) {
  return { walker: 5, bicycle: 15, car: 50 }[vehicle] ?? 5;
}

function addCourierInternal({ x, y, vehicle = "walker" }) {
  const courier = {
    id: nextCourierId++,
    status: "Free",
    x,
    y,
    vehicle,
    maxWeight: vehicleMaxWeight(vehicle),
    completedOrdersToday: 0,
  };
  couriers.push(courier);
  return courier;
}

function addRestaurantInternal({ name, x, y }) {
  const restaurant = { id: restaurants.length + 1, name, x, y };
  restaurants.push(restaurant);
  return restaurant;
}

function scheduleAssignmentCompletion(orderId, courierId) {
  setTimeout(() => {
    completeAssignment(courierId, orderId);
  }, ASSIGNMENT_DURATION_MS);
}

function processQueue() {
  let assignedSomething = true;

  while (assignedSomething) {
    assignedSomething = false;

    for (let i = 0; i < orderQueue.length; i++) {
      const order = orderQueue[i];
      const result = assignCourier(couriers, order);

      if (result.status === "Assigned") {
        orderQueue.splice(i, 1);
        activeAssignments.push({
          orderId: order.id,
          courierId: result.courierId,
          restaurant: order.restaurant,
          weight: order.weight,
          assignedAt: Date.now(),
          etaMs: ASSIGNMENT_DURATION_MS,
        });
        scheduleAssignmentCompletion(order.id, result.courierId);
        assignedSomething = true;
        break;
      }
    }
  }
}

function completeAssignment(courierId, orderId = null) {
  const courier = couriers.find((c) => c.id === courierId);
  if (!courier) return { status: "NotFound" };

  const idx = activeAssignments.findIndex(
    (a) =>
      a.courierId === courierId && (orderId === null || a.orderId === orderId),
  );

  if (idx !== -1) {
    activeAssignments.splice(idx, 1);
  }

  courier.status = "Free";
  courier.completedOrdersToday = (courier.completedOrdersToday ?? 0) + 1;
  processQueue();

  return {
    status: "Completed",
    courierId: courier.id,
    queueLeft: orderQueue.length,
  };
}

function buildOrder({ restaurant, restaurantId, weight }) {
  let selectedRestaurant = restaurant;

  if (!selectedRestaurant && restaurantId) {
    const found = restaurants.find((r) => r.id === restaurantId);
    if (found) {
      selectedRestaurant = { x: found.x, y: found.y };
    }
  }

  return {
    id: nextOrderId++,
    restaurant: selectedRestaurant,
    weight,
  };
}

function dispatchOrder(order) {
  const result = assignCourier(couriers, order);

  if (result.status === "Queued") {
    orderQueue.push(order);
    return {
      status: "Queued",
      orderId: order.id,
      position: orderQueue.length,
    };
  }

  activeAssignments.push({
    orderId: order.id,
    courierId: result.courierId,
    restaurant: order.restaurant,
    weight: order.weight,
    assignedAt: Date.now(),
    etaMs: ASSIGNMENT_DURATION_MS,
  });
  scheduleAssignmentCompletion(order.id, result.courierId);

  return {
    ...result,
    etaMs: ASSIGNMENT_DURATION_MS,
  };
}

function seedInitialData() {
  const initialCouriers = [
    { x: 10, y: 15, vehicle: "walker" },
    { x: 35, y: 60, vehicle: "bicycle" },
    { x: 70, y: 20, vehicle: "car" },
    { x: 85, y: 75, vehicle: "bicycle" },
    { x: 50, y: 50, vehicle: "car" },
  ];

  const initialRestaurants = [
    { name: "Downtown Grill", x: 12, y: 18 },
    { name: "Nori House", x: 42, y: 63 },
    { name: "Pasta Corner", x: 66, y: 22 },
    { name: "Burger Forge", x: 78, y: 71 },
    { name: "Green Bowl", x: 52, y: 48 },
  ];

  initialCouriers.forEach(addCourierInternal);
  initialRestaurants.forEach(addRestaurantInternal);

  const initialOrders = [
    { restaurantId: 1, weight: 3.5 },
    { restaurantId: 2, weight: 6 },
    { restaurantId: 3, weight: 14 },
    { restaurantId: 4, weight: 10 },
    { restaurantId: 5, weight: 20 },
    { restaurantId: 1, weight: 2.5 },
    { restaurantId: 2, weight: 8 },
    { restaurantId: 3, weight: 4 },
  ];

  initialOrders.forEach((seedOrder) => {
    const order = buildOrder(seedOrder);
    if (order.restaurant) {
      dispatchOrder(order);
    }
  });
}

app.get("/couriers", (req, res) => {
  res.json({ couriers });
});

app.get("/restaurants", (req, res) => {
  res.json({ restaurants });
});

app.get("/state", (req, res) => {
  res.json({
    couriers,
    restaurants,
    queue: orderQueue,
    assignments: activeAssignments,
    nextCourierId,
    nextOrderId,
  });
});

app.post("/couriers", (req, res) => {
  const { x, y, vehicle = "walker" } = req.body;

  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return res.status(400).json({ error: "x and y must be numbers" });
  }

  const courier = addCourierInternal({ x, y, vehicle });
  processQueue();
  res.json({ message: "Courier added", courier, couriers });
});

app.post("/order", (req, res) => {
  const { restaurant, restaurantId, weight } = req.body;

  if (!Number.isFinite(weight) || weight <= 0) {
    return res.status(400).json({ error: "weight must be a positive number" });
  }

  const order = buildOrder({ restaurant, restaurantId, weight });

  if (!order.restaurant) {
    return res.status(400).json({
      error: "restaurant is required: provide restaurantId or restaurant {x,y}",
    });
  }

  const result = dispatchOrder(order);
  res.json(result);
});

app.post("/complete", (req, res) => {
  const { courierId } = req.body;
  if (!Number.isFinite(courierId)) {
    return res.status(400).json({ error: "courierId must be a number" });
  }

  const result = completeAssignment(courierId);
  if (result.status === "NotFound") {
    return res.status(404).json({ error: "Courier not found" });
  }

  res.json(result);
});

/* init */

seedInitialData();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(
    `✅ Seeded: ${couriers.length} couriers, ${restaurants.length} restaurants, ${activeAssignments.length} active assignments, ${orderQueue.length} queued`,
  );
});
