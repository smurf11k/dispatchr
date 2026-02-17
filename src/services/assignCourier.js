import { manhattanDistance } from "../utils/distance.js";

export function assignCourier(couriers, order) {
  const eligible = couriers.filter(
    (c) => c.status === "Free" && c.maxWeight >= order.weight,
  );

  if (eligible.length === 0) {
    return { status: "Queued" };
  }

  let best = null;
  let bestDist = Infinity;

  for (const courier of eligible) {
    const d = manhattanDistance(
      courier.x,
      courier.y,
      order.restaurant.x,
      order.restaurant.y,
    );

    if (best === null) {
      best = courier;
      bestDist = d;
      continue;
    }

    const diff = Math.abs(d - bestDist);

    if (diff <= 1) {
      if (courier.completedOrdersToday < best.completedOrdersToday) {
        best = courier;
        bestDist = d;
      }
    } else if (d < bestDist) {
      best = courier;
      bestDist = d;
    }
  }

  best.status = "Busy";

  return {
    status: "Assigned",
    orderId: order.id,
    courierId: best.id,
    vehicle: best.vehicle,
    distance: bestDist,
  };
}
