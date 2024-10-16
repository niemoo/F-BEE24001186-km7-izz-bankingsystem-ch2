CREATE TYPE transaction_type AS ENUM('deposit', 'withdrawal', 'transfer');

CREATE TABLE IF NOT EXISTS transactions (
    id BIGSERIAL PRIMARY KEY,
    id_account INT NOT NULL REFERENCES accounts(id),
    amount DECIMAL(20, 2) NOT NULL,
    type transaction_type NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

ALTER TABLE transactions ADD COLUMN deleted_at TIMESTAMP;

DROP TABLE transactions;