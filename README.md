# Test Case Bank Account

## Description

This project implements a banking system to manage user accounts, transactions, and balances. It supports basic operations such as account creation, deposits, withdrawals, balance checks, and transfer through a RESTful API.

## Prerequisites

Before running the project, make sure the following requirements are met:

- **Node.js**: Ensure you have Node.js installed on your system.
- **Database**: You should have a PostgreSQL database available for the project to connect to.

## Setup Instructions

### 1. Clone the Repository

Clone this repository to your local machine by running the following command:

```bash
git clone https://github.com/niemoo/F-BEE24001186-km7-izz-bankingsystem-ch2.git
```

### 2. Setup Project

- Rename `.env.sample` to `.env` and fill the `DATABASE_URL` using url based

```bash
postgresql://<user>:<password>@<host>:<port>/<database>?schema=public
```

- Run the following command to install all necessary Node.js dependencies:

```bash
npm install
```

## How To Run

- **Run the Server:** Start the Node.JS development server by executing:

```bash
npm run start
```

## How To Test

- **Test the API:** Start testing the API by executing:

```bash
npm run test
```

## Flowchart Banking System

![image](./assets/Flowchart_Banking%20System_Izzan%20Abdul%20Aziz.png)

## ERD Banking System

![image](./assets/ERD_Banking%20System_Izzan%20Abdul%20Aziz.png)
