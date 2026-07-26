# 🏦 Ledgerline Banking System

A secure, ledger-based backend banking application built with **Node.js**, **Express.js**, and **MongoDB** — implementing authentication, account management, idempotent transactions, and email notifications.

Designed to simulate real-world banking workflows following REST API principles and backend best practices.

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=flat&logo=JSON%20web%20tokens)

---

## 📑 Table of Contents

- [Features](#-features)
- [Postman documentation](#-api-documentation-on-postman)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Security](#-security-features)
- [Key Concepts](#-key-concepts-implemented)
- [Author](#-author)

---

## 🚀 Features

### 🔐 Authentication
- User registration & login
- JWT-based authentication
- Password hashing with bcrypt
- Cookie-based session handling
- Protected routes via middleware

### 👤 Account Management
- Create bank accounts
- Retrieve account details
- Live balance calculation from ledger entries
- Account ownership verification

### 💸 Transaction System
- Fund transfers between accounts
- Idempotent transactions using unique idempotency keys
- Atomic operations via MongoDB sessions
- Automatic transaction status management
- Balance validation before debit
- Account status validation

### 📒 Double-Entry Ledger
Every transaction generates a matched pair of entries:
- **Debit** ledger entry
- **Credit** ledger entry

This guarantees accurate balance computation and full auditability.

### 📧 Email Notifications
- Welcome email on registration
- Transaction confirmation emails
- HTML templates via Nodemailer

---

## 📘 API Documentation on Postman

Full request/response examples, sample payloads, and try-it-out functionality are available via Postman:

| Collection | Description | Link |
|------------|-------------|------|
| Authentication API | Register & login endpoints | [View Docs](https://documenter.getpostman.com/view/48282940/2sBY4HTitr) |
| Accounts API | Account creation & balance retrieval | [View Docs](https://documenter.getpostman.com/view/48282940/2sBY4HTitq) |
| Transactions API | Fund transfers & initial deposits | [View Docs](https://documenter.getpostman.com/view/48282940/2sBY4HTitt) |

---

## 🛠 Tech Stack

| Technology     | Purpose                  |
|----------------|---------------------------|
| Node.js        | Runtime                   |
| Express.js     | Backend framework         |
| MongoDB Atlas  | Database                  |
| Mongoose       | ODM                       |
| JWT            | Authentication            |
| bcrypt         | Password hashing          |
| Nodemailer     | Email service             |
| Cookie Parser  | Cookie handling           |
| Dotenv         | Environment variable mgmt |

---

## 📂 Project Structure

```
backend/
│
├── src/
│   ├── config/         # DB connection, app config
│   ├── controllers/    # Route logic
│   ├── middlewares/    # Auth, validation, error handling
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API route definitions
│   ├── services/       # Business logic (email, ledger, etc.)
│   └── utils/          # Helper functions
│
├── server.js
├── package.json
└── .env.example
```

---

## 🔑 API Endpoints

### Authentication

| Method | Endpoint                 | Description           |
|--------|--------------------------|----------------------|
| POST   | `/api/auth/register`     | Register a new user  |
| POST   | `/api/auth/login`        | Log in a user        |
| POST   | `/api/auth/logout`       | Log out a user       |
### Accounts

| Method | Endpoint                            | Description                     |
|--------|-------------------------------------|---------------------------------|
| POST   | `/api/account/create`               | Create a new bank account       |
| GET    | `/api/account/`                     | Get all accounts linked to user |
| GET    | `/api/account/balance/:accountId`   | Get live account balance        |

### Transactions

| Method | Endpoint                              | Description                                                     |
|--------|------------------------------------------|--------------------------------------------------------------|
| POST   | `/api/transaction/system/initial-funds`  | Deposit initial funds using system account                   |
| POST   | `/api/transaction/`                | Create a fund transfer                                       |

---

## 🔒 Security Features

- JWT authentication
- Protected routes via middleware
- Password hashing (bcrypt)
- Cookie-based authentication
- Input validation
- Idempotent transactions
- Ownership validation on accounts
- Atomic MongoDB transactions
- Double-entry accounting for auditability

---

## 💡 Key Concepts Implemented

- REST API design
- MVC architecture
- MongoDB aggregation pipeline
- Mongoose schema methods
- Transactions & sessions
- Object references (`ref` / `ObjectId`)
- Ledger-based accounting
- Email service integration
- Environment-based configuration

---


## 👨‍💻 Author

**Sarvam Taneja**

- GitHub: [@Sarvamtaneja](https://github.com/Sarvamtaneja)
- LinkedIn: [sarvam-taneja](https://www.linkedin.com/in/sarvam-taneja/)

---

⭐ If you found this project useful, consider giving it a star!
