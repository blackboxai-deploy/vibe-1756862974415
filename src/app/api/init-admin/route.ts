import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const adminEmail = 'admin@lsweb.com';
    const adminPassword = 'admin123';
    
    // Check if admin already exists
    const { data: existingAdmin } = await supabase
      .from('users')
      .select('*')
      .eq('email', adminEmail)
      .single();

    if (existingAdmin) {
      return NextResponse.json({
        success: true,
        message: 'Admin user already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

    // Create admin user
    const { error } = await supabase
      .from('users')
      .insert([
        {
          id: crypto.randomUUID(),
          email: adminEmail,
          password_hash: passwordHash,
          role: 'admin',
          created_at: new Date().toISOString(),
        }
      ]);

    if (error) {
      console.error('Failed to create admin:', error);
      return NextResponse.json({
        success: false,
        message: 'Failed to create admin user'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully'
    });

  } catch (error) {
    console.error('Init admin error:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}