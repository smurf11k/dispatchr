export default class Courier {
  constructor(id, x, y, vehicle = "walker") {
    this.id = id;
    this.x = x;
    this.y = y;
    this.vehicle = vehicle;
    this.maxWeight = { walker: 5, bicycle: 15, car: 50 }[vehicle] ?? 5;
    this.status = "idle";
    this.currentOrderId = null;
    this.completedOrdersToday = 0;
  }

  assignOrder(orderId) {
    this.status = "delivering";
    this.currentOrderId = orderId;
  }

  completeOrder() {
    this.status = "idle";
    this.currentOrderId = null;
    this.completedOrdersToday++;
  }

  updateLocation(x, y) {
    this.x = x;
    this.y = y;
  }
}
