import { manhattanDistance } from "../utils/distance.js";

export function assignCourier(couriers, order) {
  const eligible = couriers.filter(
    (c) => c.status === "Free" && c.maxWeight >= order.weight,
  );

  if (eligible.length === 0) {
    return { status: "No couriers available" };
  }

  let closest = null;
  let minDist = Infinity;

  for (const courier of eligible) {
    const d = manhattanDistance(
      courier.x,
      courier.y,
      order.restaurant.x,
      order.restaurant.y,
    );

    if (d < minDist) {
      minDist = d;
      closest = courier;
    }
  }

  closest.status = "Busy";

  return {
    status: "Assigned",
    orderId: order.id,
    courierId: closest.id,
    vehicle: closest.vehicle,
    distance: minDist,
  };
}
