-- LS WEB - Database Schema for Supabase
-- Run this SQL in your Supabase SQL editor to create the required tables

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_requests table
CREATE TABLE IF NOT EXISTS public.contact_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    project_type VARCHAR(100) NOT NULL,
    budget VARCHAR(100),
    timeline VARCHAR(100),
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_requests_created_at ON public.contact_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_requests_status ON public.contact_requests(status);
CREATE INDEX IF NOT EXISTS idx_contact_requests_project_type ON public.contact_requests(project_type);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for users table (only for authenticated admin users)
CREATE POLICY "Users can view their own data" ON public.users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Admin can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text AND role = 'admin'
        )
    );

-- Create policies for contact_requests table (admin only)
CREATE POLICY "Admin can view all contact requests" ON public.contact_requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text AND role = 'admin'
        )
    );

CREATE POLICY "Anyone can insert contact requests" ON public.contact_requests
    FOR INSERT WITH CHECK (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

GRANT SELECT, INSERT ON public.contact_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_requests TO authenticated;

GRANT SELECT, INSERT ON public.users TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO authenticated;

-- Insert default admin user (password: admin123)
-- Note: The password hash is for 'admin123' using bcrypt
INSERT INTO public.users (id, email, password_hash, role, created_at)
VALUES (
    gen_random_uuid(),
    'admin@lsweb.com',
    '$2a$10$rZ.yLPEaY6eQBwHtWEGm3.YN8NL6FnczFq8R3Bqy0zHzK5nR8a6SK', -- admin123
    'admin',
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Verify tables were created successfully
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'contact_requests');

-- Show the structure of created tables
\d public.users;
\d public.contact_requests;