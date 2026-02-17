import { manhattanDistance } from "../utils/distance.js";

export default class DispatchSystem {
  constructor() {
    this.couriers = [];
    this.orders = [];
    this.queue = [];
  }

  addCourier(courier) {
    this.couriers.push(courier);
  }

  createOrder(order) {
    this.orders.push(order);
    const assigned = this.assignOrder(order);
    if (!assigned) this.queue.push(order);
    return assigned;
  }

  assignOrder(order) {
    const eligible = this.couriers.filter(
      (c) => c.status === "idle" && c.maxWeight >= (order.weight ?? 0),
    );

    if (eligible.length === 0) return null;

    let best = null;
    let bestDist = Infinity;

    for (const courier of eligible) {
      const d = manhattanDistance(
        courier.x,
        courier.y,
        order.pickup.x,
        order.pickup.y,
      );

      if (best === null) {
        best = courier;
        bestDist = d;
        continue;
      }

      const diff = Math.abs(d - bestDist);
      if (diff < 1) {
        if (courier.completedOrdersToday < best.completedOrdersToday) {
          best = courier;
          bestDist = d;
        }
      } else if (d < bestDist) {
        best = courier;
        bestDist = d;
      }
    }

    if (best) {
      best.assignOrder(order.id);
      order.assignCourier(best.id);
    }

    return best;
  }

  completeOrder(orderId) {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return;

    const courier = this.couriers.find((c) => c.id === order.assignedCourierId);
    if (courier) courier.completeOrder();

    order.complete();

    if (this.queue.length > 0) {
      const next = this.queue.shift();
      this.assignOrder(next);
    }
  }
}
