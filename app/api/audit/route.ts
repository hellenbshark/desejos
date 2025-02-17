import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const table = searchParams.get('table') || 'categories';
    
    const query = `
      SELECT * FROM audit_log 
      WHERE table_name = ? 
      ORDER BY created_at DESC
    `;

    const [logs] = await db.execute(query, [table]);
    return NextResponse.json(logs);
    
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar logs de auditoria" },
      { status: 500 }
    );
  }
} 