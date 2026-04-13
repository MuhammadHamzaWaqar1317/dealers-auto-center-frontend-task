# DAC Frontend Task

A React-based web application built as part of the Front End Developer hiring process at **Dealers Auto Center**.

The app consists of two pages:

- **Product Listing** — E-commerce style listing page using FakeStore API with search, filter, sort, and Redux RTK Query
- **Registration Form** — User input form with full validation

---

## Tech Stack

- React
- Redux Toolkit + RTK Query
- React Router
- Vite

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/MuhammadHamzaWaqar1317/dealers-auto-center-frontend-task.git
cd dac-frontend-task
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

### 4. Open in browser

http://localhost:8080

---

## Features

### Page 1 — Product Listing

- Fetches data from [FakeStore API](https://fakestoreapi.com)
- Search by product name (debounced)
- Filter by category
- Sort by name or price
- Loading skeletons and error handling
- Redux RTK Query for API layer

### Page 2 — Registration Form

- Full Name, Email, Phone Number, Password fields
- Inline validation with error messages
- Success screen on valid submission

---

## Folder Structure

src/
├── components/
├── pages/
├── store/
│ ├── apiSlice.js
│ └── productSlice.js
├── App.jsx
└── main.jsx

---

## Submission

Submitted as part of the hiring task for the **Front End Developer – React JS** role at Dealers Auto Center.
