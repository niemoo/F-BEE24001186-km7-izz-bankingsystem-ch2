-- Active: 1728390304427@@127.0.0.1@5432@ch_four
CREATE TYPE account_type AS ENUM ('savings', 'checking', 'investment');

CREATE TABLE IF NOT EXISTS accounts (
    id BIGSERIAL PRIMARY KEY,
    id_customer INT NOT NULL REFERENCES customers(id),
    type account_type NOT NULL,
    balance DECIMAL(20, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

ALTER TABLE accounts ADD COLUMN deleted_at TIMESTAMP;

DROP TABLE accounts;

CREATE INDEX idx_accounts_customer_type_balance ON accounts(id_customer, type, balance);