-- Create operatories table
CREATE TABLE operatories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  operatory_number INTEGER NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add operatory_id to appointments table
ALTER TABLE appointments ADD COLUMN operatory_id UUID REFERENCES operatories(id) ON DELETE SET NULL;

-- Create index for operatory_id
CREATE INDEX idx_appointments_operatory_id ON appointments(operatory_id);

-- Create trigger to update operatories updated_at
CREATE TRIGGER update_operatories_updated_at
  BEFORE UPDATE ON operatories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE operatories ENABLE ROW LEVEL SECURITY;

-- Create policies for operatories
CREATE POLICY "Allow all operations on operatories for authenticated users"
  ON operatories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow read access for anon users on operatories"
  ON operatories FOR SELECT
  TO anon
  USING (true);

-- Insert default operatories
INSERT INTO operatories (name, operatory_number) VALUES
  ('Operatory 1', 1),
  ('Operatory 2', 2),
  ('Operatory 3', 3),
  ('Operatory 4', 4);
