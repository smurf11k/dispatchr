export default class Courier {
  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.status = "idle"; // idle | delivering
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
