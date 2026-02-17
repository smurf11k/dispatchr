import Courier from "./models/Courier.js";
import Order from "./models/Order.js";
import DispatchSystem from "./services/DispatchSystem.js";

const system = new DispatchSystem();

system.addCourier(new Courier(1, 10, 10));
system.addCourier(new Courier(2, 50, 50));

const order = new Order(101, { x: 12, y: 9 }, { x: 80, y: 80 });

system.createOrder(order);

console.log(system);
