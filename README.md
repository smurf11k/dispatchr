# Dispatchr

## Stage 0 — Core Dispatch Engine

### ✅ Що зроблено

- Реалізовано координатну сітку міста (0–100 по X та Y)
- Створено модель `Courier`
  - id
  - координати (x, y)
  - статус: `idle | delivering`
  - активне замовлення
- Створено модель `Order`
  - id
  - pickup координати
  - dropoff координати
  - статус: `pending | assigned | completed`
- Реалізовано `DispatchSystem`
  - зберігання даних в памʼяті
  - автоматичне призначення замовлення
- Алгоритм розподілу:
  - використовується Manhattan distance
  - замовлення призначається найближчому вільному курʼєру

Формула відстані:

|x1 - x2| + |y1 - y2|

---

### ▶ Мінімальна перевірка

1. Додати курʼєрів:

```js
system.addCourier(new Courier(1, 10, 10));
system.addCourier(new Courier(2, 50, 50));
```

2. Створити замовлення:

```js
const order = new Order(101, { x: 12, y: 9 }, { x: 80, y: 80 });
system.createOrder(order);
```

3. Запуск:

```
node src/index.js
```

### ✔ Очікуваний результат

- Замовлення отримує статус `assigned`
- Найближчий курʼєр змінює статус на `delivering`
- Вивід у консолі показує оновлений стан системи

```
DispatchSystem {
  couriers: [
    Courier {
      id: 1,
      x: 10,
      y: 10,
      status: 'delivering',
      currentOrderId: 101
    },
    Courier {
      id: 2,
      x: 50,
      y: 50,
      status: 'idle',
      currentOrderId: null
    }
  ],
  orders: [
    Order {
      id: 101,
      pickup: [Object],
      dropoff: [Object],
      status: 'assigned',
      assignedCourierId: 1
    }
  ]
}
```

---

Stage 0 завершено. Логіка ядра працює.
