-- Active: 1728390304427@@127.0.0.1@5432@ch_four
CREATE TABLE IF NOT EXISTS customers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

ALTER TABLE customers ADD COLUMN deleted_at TIMESTAMP;

DROP TABLE customers;

CREATE INDEX idx_customers_name_address ON customers(name, address);