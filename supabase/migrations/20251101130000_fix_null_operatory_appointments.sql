-- Update existing appointments with NULL operatory_id to assign them to Operatory 1
UPDATE appointments
SET operatory_id = (SELECT id FROM operatories WHERE operatory_number = 1 LIMIT 1)
WHERE operatory_id IS NULL;
