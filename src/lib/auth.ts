import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import prisma from '../../lib/prisma';
import { Lucia } from 'lucia';
import { RoleUser } from '@prisma/client';

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  expires: false,
  attributes: {
    secure: process.env.NODE_ENV === 'production',
  },
  getUserAttributes: (attributes) => {
    return {
      name: attributes.name,
      role: attributes.role,
      email: attributes.email,
    };
  },
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      name: string;
      email: string;
      role: RoleUser;
      passport: string | null;
    };
  }
}
