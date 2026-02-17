import { manhattanDistance } from "../utils/distance.js";

export function assignCourier(couriers, order) {
  const freeCouriers = couriers.filter((c) => c.status === "Free");

  if (freeCouriers.length === 0) {
    return { status: "No couriers available" };
  }

  let closestCourier = null;
  let minDistance = Infinity;

  for (const courier of freeCouriers) {
    const distance = manhattanDistance(
      courier.x,
      courier.y,
      order.restaurant.x,
      order.restaurant.y,
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestCourier = courier;
    }
  }

  closestCourier.status = "Busy";

  return {
    status: "Assigned",
    orderId: order.id,
    courierId: closestCourier.id,
    distance: minDistance,
  };
}
