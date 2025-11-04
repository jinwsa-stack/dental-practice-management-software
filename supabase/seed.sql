-- Seed data for dentists
INSERT INTO dentists (first_name, last_name, email, phone, specialty) VALUES
  ('Sarah', 'Johnson', 'sarah.johnson@dentalclinic.com', '555-0101', 'General Dentistry'),
  ('Michael', 'Chen', 'michael.chen@dentalclinic.com', '555-0102', 'Orthodontics'),
  ('Emily', 'Rodriguez', 'emily.rodriguez@dentalclinic.com', '555-0103', 'Pediatric Dentistry');

-- Seed data for patients
INSERT INTO patients (first_name, last_name, email, phone, date_of_birth, address) VALUES
  ('John', 'Doe', 'john.doe@email.com', '555-1001', '1985-06-15', '123 Main St, City, State 12345'),
  ('Jane', 'Smith', 'jane.smith@email.com', '555-1002', '1990-03-22', '456 Oak Ave, City, State 12345'),
  ('Robert', 'Williams', 'robert.williams@email.com', '555-1003', '1978-11-08', '789 Pine Rd, City, State 12345'),
  ('Maria', 'Garcia', 'maria.garcia@email.com', '555-1004', '1995-09-30', '321 Elm St, City, State 12345'),
  ('David', 'Brown', 'david.brown@email.com', '555-1005', '1982-01-17', '654 Maple Dr, City, State 12345');

-- Seed data for dentist schedules (Monday to Friday, 9 AM to 5 PM)
INSERT INTO dentist_schedules (dentist_id, day_of_week, start_time, end_time, is_available)
SELECT
  d.id,
  dow,
  '09:00',
  '17:00',
  true
FROM dentists d
CROSS JOIN generate_series(1, 5) AS dow;
