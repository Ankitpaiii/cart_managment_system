# Design Document – Online Shopping System

This document describes the **visual design, UI/UX principles, and technical architecture** of the Online Shopping System. The design is **inspired by modern collection-style layouts** (clean, elegant, minimal, image-forward) similar to high-quality Awwwards e‑commerce experiences, while remaining **simple, understandable, and implementable** for an academic team project.

The goal is to deliver:

* A **premium-looking frontend** with modern UI/UX
* A **clear component-driven design**
* A **straightforward technical architecture** aligned with the approved tech stack

---

## 1. Design Philosophy

### 1.1 Visual Tone

* Minimal and elegant
* Focus on product imagery
* Clean spacing and grid-based layouts
* Subtle animations instead of flashy effects

### 1.2 UX Principles

* Clarity over complexity
* Fewer clicks to reach products
* Consistent interactions across pages
* Predictable navigation

---

## 2. Layout Structure

### 2.1 Global Layout

* Sticky header
* Content-centered layout with generous margins
* Footer with secondary navigation

**Layout Pattern:**

```
Header
│
Main Content (Grid / Detail / Forms)
│
Footer
```

---

## 3. Color Palette

The color system is neutral-first with a single accent color.

* **Primary Background:** Off-white / very light gray
* **Primary Text:** Near-black / charcoal
* **Secondary Text:** Muted gray
* **Accent Color:** Deep blue or muted purple (used sparingly)
* **Success / Error:** Soft green / soft red

Purpose:

* Keeps attention on products
* Maintains a premium and calm aesthetic

---

## 4. Typography

### 4.1 Font Selection

* **Primary Font:** Modern sans-serif (e.g., Inter / SF-style)
* **Headings:** Semi-bold or bold
* **Body Text:** Regular

### 4.2 Typography Hierarchy

* H1: Page titles (Collection, Product Name)
* H2: Section headers
* Body: Descriptions, labels
* Small text: Metadata (price details, SKU, category)

---

## 5. Core UI Components

### 5.1 Header

* Logo (left)
* Navigation links (center or right)
* Cart icon with item count
* Login / profile icon

Behavior:

* Sticky on scroll
* Minimal shadow or border

---

### 5.2 Product Collection Grid

* Responsive grid (2–4 columns depending on screen)
* Large product images
* Minimal product info:

  * Name
  * Price

**Hover Interaction:**

* Image scale-up (subtle)
* Reveal “Add to Cart” button

---

### 5.3 Filters & Sorting

* Category filter (sidebar or dropdown)
* Price sort (low → high, high → low)
* Clean UI with minimal controls

Design Rule:

* Filters should never overpower product visuals

---

### 5.4 Product Detail View

* Large image gallery
* Product name, price, description
* Category label
* Quantity selector
* Add to Cart button

Layout prioritizes **visual clarity** and **purchase intent**.

---

### 5.5 Cart & Checkout

* Slide-over cart or dedicated page
* Clear price breakdown
* Simple checkout form
* Minimal distractions

---

## 6. Animation & Interaction Design

Animations are **subtle and functional**, not decorative.

* Page transitions (fade / slide)
* Button hover transitions
* Cart add confirmation

Tools:

* Framer Motion

Rule:

* Animations should guide attention, not delay actions

---

## 7. Frontend Architecture

### 7.1 Component Structure

```
components/
 ├─ Header
 ├─ ProductCard
 ├─ ProductGrid
 ├─ Filters
 ├─ Cart
 └─ CheckoutForm
```

* Components are reusable
* UI logic separated from data fetching

---

### 7.2 State Management

* **Global State (Zustand):**

  * Cart
  * Auth state

* **Server State (TanStack Query):**

  * Products
  * Categories
  * Orders

---

## 8. Data Flow & API Integration

### 8.1 Data Flow Overview

```
UI Component
   ↓
TanStack Query
   ↓
REST API (Express)
   ↓
Prisma ORM
   ↓
PostgreSQL
```

---

### 8.2 API Usage Examples

* Product Grid → `GET /products`
* Category Filter → `GET /categories`
* Add to Cart → Local state
* Checkout → `POST /orders`
* Payment → `POST /payments`

---

## 9. Backend Design Overview

### 9.1 Backend Responsibilities

* Authentication
* Business logic
* Data validation
* Database interaction

### 9.2 Design Principles

* Thin controllers
* Clear separation of routes, services, and models
* RESTful endpoints

---

## 10. Security & Performance Considerations

### Security

* JWT-based authentication
* Password hashing
* Input validation

### Performance

* Pagination for product lists
* Caching with TanStack Query
* Optimized images

---

## 11. Responsiveness & Accessibility

* Mobile-first design
* Keyboard-accessible components
* Sufficient color contrast
* Responsive grid adjustments

---

## 12. Summary

This design document provides:

* A **premium UI/UX direction** inspired by modern collection-based layouts
* A **clear component and architecture plan**
* A **balanced approach** between aesthetics and simplicity

The design is suitable for:

* Academic DBMS / Web projects
* Team-based development
* Portfolio-quality submissions

---

End of Document
