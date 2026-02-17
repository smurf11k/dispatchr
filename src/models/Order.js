export default class Order {
  constructor(id, pickup, dropoff, weight = 1) {
    this.id = id;
    this.pickup = pickup;
    this.dropoff = dropoff;
    this.weight = weight;
    this.status = "pending";
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
