CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    salary NUMERIC(10, 2) NOT NULL,
    hired_at DATE NOT NULL
);

INSERT INTO employees (name, position, salary, hired_at) VALUES
    ('Alice Johnson', 'Software Engineer', 95000.00, '2021-03-15'),
    ('Bob Smith', 'Product Manager', 110000.00, '2020-07-01'),
    ('Carol White', 'QA Engineer', 80000.00, '2022-01-10'),
    ('David Brown', 'DevOps Engineer', 100000.00, '2019-11-20'),
    ('Eva Green', 'UI/UX Designer', 85000.00, '2023-05-05');
