export default class Courier {
  constructor(id, x, y, vehicle = "walker") {
    this.id = id;
    this.x = x;
    this.y = y;
    this.vehicle = vehicle; // walker | bicycle | car
    this.maxWeight = { walker: 5, bicycle: 15, car: 50 }[vehicle];
    this.status = "idle";
    this.currentOrderId = null;
  }

  assignOrder(orderId) {
    this.status = "delivering";
    this.currentOrderId = orderId;
  }

  completeOrder() {
    this.status = "idle";
    this.currentOrderId = null;
  }

  updateLocation(x, y) {
    this.x = x;
    this.y = y;
  }
}
