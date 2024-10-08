CREATE OR REPLACE PROCEDURE deposit(
    account INT,
    amount DECIMAL
)
LANGUAGE plpgsql
AS $$
DECLARE
    current_balance DECIMAL;
BEGIN
    SELECT balance INTO current_balance
    FROM accounts
    WHERE id = account;

    IF current_balance IS NULL THEN
        RAISE EXCEPTION 'Account % does not exist', account;
    END IF;

    INSERT INTO transactions (id_account, amount, type)
    VALUES (account, amount, 'deposit');

    UPDATE accounts
    SET balance = balance + amount
    WHERE id = account;
END $$;

CREATE OR REPLACE PROCEDURE withdraw(
    account INT,
    amount DECIMAL
)
LANGUAGE plpgsql
AS $$
DECLARE
    current_balance DECIMAL;
BEGIN
    SELECT balance INTO current_balance
    FROM accounts
    WHERE id = account;

    IF current_balance IS NULL THEN
        RAISE EXCEPTION 'Account % does not exist', account;
    ELSIF current_balance < amount THEN
        RAISE EXCEPTION 'Insufficient balance for account %', account;
    END IF;

    INSERT INTO transactions (id_account, amount, type)
    VALUES (account, amount, 'withdrawal');

    UPDATE accounts
    SET balance = balance - amount
    WHERE id = account;
END $$;

call deposit(1, 1000);

call withdraw(1, 1000);

WITH selected_account AS (
    SELECT c.name, a.balance
    FROM customers c
    JOIN accounts a ON c.id = a.id_customer
    WHERE a.id = 1
)
SELECT * FROM selected_account;
