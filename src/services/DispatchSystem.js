import { manhattanDistance } from "../utils/distance.js";

export default class DispatchSystem {
  constructor() {
    this.couriers = [];
    this.orders = [];
  }

  addCourier(courier) {
    this.couriers.push(courier);
  }

  createOrder(order) {
    this.orders.push(order);
    this.assignOrder(order);
  }

  assignOrder(order) {
    const availableCouriers = this.couriers.filter(
      (courier) => courier.status === "idle",
    );

    if (availableCouriers.length === 0) {
      return null;
    }

    let closestCourier = null;
    let minDistance = Infinity;

    for (const courier of availableCouriers) {
      const distance = manhattanDistance(
        courier.x,
        courier.y,
        order.pickup.x,
        order.pickup.y,
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestCourier = courier;
      }
    }

    if (closestCourier) {
      closestCourier.assignOrder(order.id);
      order.assignCourier(closestCourier.id);
    }

    return closestCourier;
  }

  completeOrder(orderId) {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return;

    const courier = this.couriers.find((c) => c.id === order.assignedCourierId);

    if (courier) {
      courier.completeOrder();
    }

    order.complete();
  }
}
