import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export type AuthPayload = {
  userId: string;
  email: string;
  role: string;
};

const secret = process.env.JWT_SECRET || 'absojadata-development-secret';

export function signToken(payload: AuthPayload) {
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, secret) as AuthPayload;
  } catch {
    return null;
  }
}

export async function getAuthUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: {
      wallet: true,
    },
  });

  if (!user) return null;

  return user;
}

export function sanitizeUser(user: any) {
  const { passwordHash, ...rest } = user;
  return rest;
}
