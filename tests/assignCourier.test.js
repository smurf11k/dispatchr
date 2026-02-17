import { assignCourier } from "../src/services/assignCourier.js";

describe("assignCourier", () => {
  test("assigns closest free courier", () => {
    const couriers = [
      { id: 1, status: "Free", x: 10, y: 10, maxWeight: 5 },
      { id: 2, status: "Free", x: 50, y: 50, maxWeight: 5 },
    ];

    const order = {
      id: 101,
      restaurant: { x: 12, y: 9 },
      weight: 3,
    };

    const result = assignCourier(couriers, order);

    expect(result.status).toBe("Assigned");
    expect(result.courierId).toBe(1);
    expect(couriers[0].status).toBe("Busy");
  });

  test("returns no couriers available", () => {
    const couriers = [{ id: 1, status: "Busy", x: 10, y: 10, maxWeight: 5 }];

    const order = {
      id: 102,
      restaurant: { x: 5, y: 5 },
      weight: 3,
    };

    const result = assignCourier(couriers, order);

    expect(result.status).toBe("No couriers available");
  });

  test("returns no couriers available if weight exceeds maxWeight", () => {
    const couriers = [{ id: 1, status: "Free", x: 10, y: 10, maxWeight: 5 }];
    const order = { id: 103, restaurant: { x: 10, y: 10 }, weight: 10 };
    const result = assignCourier(couriers, order);
    expect(result.status).toBe("No couriers available");
  });

  test("assigns courier with appropriate vehicle", () => {
    const couriers = [
      { id: 1, status: "Free", x: 10, y: 10, maxWeight: 5 },
      { id: 2, status: "Free", x: 20, y: 20, maxWeight: 15 },
    ];
    const order = { id: 104, restaurant: { x: 10, y: 10 }, weight: 10 };
    const result = assignCourier(couriers, order);
    expect(result.courierId).toBe(2);
  });
});
