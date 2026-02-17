import { assignCourier } from "../src/services/assignCourier.js";

describe("assignCourier", () => {
  test("assigns closest free courier", () => {
    const couriers = [
      {
        id: 1,
        status: "Free",
        x: 10,
        y: 10,
        maxWeight: 5,
        completedOrdersToday: 0,
      },
      {
        id: 2,
        status: "Free",
        x: 50,
        y: 50,
        maxWeight: 5,
        completedOrdersToday: 0,
      },
    ];
    const order = { id: 101, restaurant: { x: 12, y: 9 }, weight: 3 };
    const result = assignCourier(couriers, order);
    expect(result.status).toBe("Assigned");
    expect(result.courierId).toBe(1);
    expect(couriers[0].status).toBe("Busy");
  });

  test("returns no couriers available", () => {
    const couriers = [
      {
        id: 1,
        status: "Busy",
        x: 10,
        y: 10,
        maxWeight: 5,
        completedOrdersToday: 0,
      },
    ];
    const order = { id: 102, restaurant: { x: 5, y: 5 }, weight: 3 };
    expect(assignCourier(couriers, order).status).toBe("Queued");
  });

  test("returns queued if weight exceeds maxWeight", () => {
    const couriers = [
      {
        id: 1,
        status: "Free",
        x: 10,
        y: 10,
        maxWeight: 5,
        completedOrdersToday: 0,
      },
    ];
    const order = { id: 103, restaurant: { x: 10, y: 10 }, weight: 10 };
    expect(assignCourier(couriers, order).status).toBe("Queued");
  });

  test("assigns courier with appropriate vehicle", () => {
    const couriers = [
      {
        id: 1,
        status: "Free",
        x: 10,
        y: 10,
        maxWeight: 5,
        completedOrdersToday: 0,
      },
      {
        id: 2,
        status: "Free",
        x: 20,
        y: 20,
        maxWeight: 15,
        completedOrdersToday: 0,
      },
    ];
    const order = { id: 104, restaurant: { x: 10, y: 10 }, weight: 10 };
    expect(assignCourier(couriers, order).courierId).toBe(2);
  });

  test("prefers courier with fewer completed orders when distance is similar", () => {
    const couriers = [
      {
        id: 1,
        status: "Free",
        x: 10,
        y: 10,
        maxWeight: 15,
        completedOrdersToday: 5,
      },
      {
        id: 2,
        status: "Free",
        x: 10,
        y: 11,
        maxWeight: 15,
        completedOrdersToday: 1,
      },
    ];
    const order = { id: 105, restaurant: { x: 10, y: 10 }, weight: 5 };
    const result = assignCourier(couriers, order);
    expect(result.courierId).toBe(2);
  });

  test("prefers closer courier when distance difference is >= 1", () => {
    const couriers = [
      {
        id: 1,
        status: "Free",
        x: 10,
        y: 10,
        maxWeight: 15,
        completedOrdersToday: 0,
      },
      {
        id: 2,
        status: "Free",
        x: 15,
        y: 15,
        maxWeight: 15,
        completedOrdersToday: 0,
      },
    ];
    const order = { id: 106, restaurant: { x: 10, y: 10 }, weight: 5 };
    expect(assignCourier(couriers, order).courierId).toBe(1);
  });
});
