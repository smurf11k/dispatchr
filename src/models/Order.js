export default class Order {
  constructor(id, pickup, dropoff) {
    this.id = id;
    this.pickup = pickup; // { x, y }
    this.dropoff = dropoff; // { x, y }
    this.status = "pending"; // pending | assigned | completed
    this.assignedCourierId = null;
  }

  assignCourier(courierId) {
    this.status = "assigned";
    this.assignedCourierId = courierId;
  }

  complete() {
    this.status = "completed";
  }
}
