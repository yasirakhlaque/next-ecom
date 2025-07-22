import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      console.log('Missing fields:', { name: !!name, email: !!email, password: !!password });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (password.length < 6) {
      console.log('Password too short');
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    console.log('Checking if user exists...');
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('User already exists');
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    console.log('Hashing password...');
    const hashedPassword = await hash(password, 12);

    console.log('Creating user...');
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'CUSTOMER'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    console.log('User created successfully:', user);

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}