-- Seed data to populate customers table
DO $$
DECLARE
    names TEXT[] := ARRAY['Joko', 'Deni', 'Linto', 'Budi', 'Ayu', 'Siti', 'Rina', 'Eko', 'Adi', 'Nina'];
    random_name TEXT;
BEGIN
    FOR i IN 1..100 LOOP
        random_name := names[FLOOR(random() * array_length(names, 1) + 1)];
        
        INSERT INTO customers (name, address, phone_number, updated_at)
        VALUES (
            random_name || ' ' || i,
            'Address ' || i || ', Street No. ' || i,
            '081234567' || LPAD(i::text, 3, '0'),
            CURRENT_TIMESTAMP
        );
    END LOOP;
END $$;

-- Seed data to populate accounts table
DO $$
DECLARE
    account_types account_type[] := ARRAY['savings', 'checking', 'investment'];
    random_type account_type;
    random_customer_id INT;
    random_balance NUMERIC(20, 2);
BEGIN
    FOR i IN 1..100 LOOP
        random_type := account_types[FLOOR(random() * array_length(account_types, 1) + 1)];
        
        SELECT id INTO random_customer_id
        FROM customers
        ORDER BY random()
        LIMIT 1;
        
        random_balance := (random() * 10000)::NUMERIC(20, 2);
        
        INSERT INTO accounts (id_customer, type, balance, updated_at)
        VALUES (
            random_customer_id,
            random_type,
            random_balance,
            CURRENT_TIMESTAMP
        );
    END LOOP;
END $$;


