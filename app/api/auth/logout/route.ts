import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function POST() {
  // Remove o cookie de sessão
  cookies().delete('session');
  
  return NextResponse.json({ success: true });
}
