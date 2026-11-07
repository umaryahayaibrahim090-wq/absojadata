import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { checkAccessVtuAccount } from '@/lib/accessvtu';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
  }
  if (user.role !== 'admin') {
    return NextResponse.json({ message: 'Administrator access required.' }, { status: 403 });
  }

  try {
    const result = await checkAccessVtuAccount();
    return NextResponse.json(result, { status: result.ok ? 200 : 502 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Provider connection failed.';
    const notConfigured = message.includes('not configured');
    return NextResponse.json(
      { ok: false, message: notConfigured ? message : 'Could not reach AccessVTU. Check the server configuration and try again.' },
      { status: notConfigured ? 503 : 502 },
    );
  }
}
