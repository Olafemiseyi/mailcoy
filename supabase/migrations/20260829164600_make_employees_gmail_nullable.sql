-- Migration: Make employees.personal_gmail and company_email nullable
ALTER TABLE employees ALTER COLUMN personal_gmail DROP NOT NULL;
ALTER TABLE employees ALTER COLUMN personal_gmail SET DEFAULT '';
ALTER TABLE employees ALTER COLUMN company_email DROP NOT NULL;
ALTER TABLE employees ALTER COLUMN company_email SET DEFAULT '';
