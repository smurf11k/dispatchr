[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Changelog](https://img.shields.io/badge/changelog-updates-blue)](./CHANGELOG.md)

# Dispatchr

A delivery dispatch simulation system that assigns orders to couriers based on proximity, capacity, and fairness rules, featuring queue management, time-based execution, and a simple web UI.

---

# Overview

Dispatchr is a simulation of a last-mile delivery system, modeling how orders are assigned to couriers in a dynamic environment.

The project evolves from a core dispatch algorithm into a more realistic system with constraints, fairness logic, and time-based behavior.

---

# Features
- Distance-based assignment using Manhattan distance
- Capacity constraints based on courier vehicle type
- Queue system for unassigned orders
- Fairness logic (load balancing between couriers)
- Time-based simulation of deliveries
- Unit tests with Jest
- Basic web UI for interacting with the system

---

# Core Concepts

## Courier

- Position (x, y)
- Status: idle / busy
- Vehicle type (walker, bicycle, car)
- Capacity (max weight)
- Completed orders tracking

## Order

- Pickup & dropoff coordinates
- Weight
- Status: pending / assigned / completed / queued

## Dispatch Logic

- Filters available couriers
- Calculates Manhattan distance
- Applies capacity constraints
- Uses fairness rules when distances are similar
- Falls back to queue when assignment is not possible

---

## Simulation Behavior
- Orders are assigned to the closest valid courier
- If no courier is available → order is queued
- When a courier becomes free → queue is reprocessed
- Deliveries complete automatically via time-based simulation

---

## Tech Stack
- Node.js
- JavaScript
- Jest (testing)
- Basic HTML/CSS/JS (UI)

---

# Getting Started

```bash
npm install
npm start
```

Run tests:

```bash
npm test
```

## Notes

- The project started as a hackathon-style prototype and evolved into a more complete simulation.
- Focus is on dispatch logic and system behavior rather than production-ready infrastructure.
