import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
      return NextResponse.json(
        { error: "ID do usuário é necessário" },
        { status: 400 }
      );
    }

    const query = `
      SELECT 
        COUNT(*) as total_items,
        SUM(CASE WHEN ps.name = 'Não Comprado' THEN 1 ELSE 0 END) as wanted_items,
        SUM(CASE WHEN ps.name = 'Comprado' THEN 1 ELSE 0 END) as purchased_items,
        SUM(CASE WHEN ps.name = 'Não Comprado' THEN price ELSE 0 END) as total_wanted_price,
        SUM(CASE WHEN ps.name = 'Comprado' THEN purchase_price ELSE 0 END) as total_spent
      FROM wishlist_items wi
      JOIN purchase_status ps ON wi.purchase_status_id = ps.id
      WHERE wi.user_id = ?
    `;

    const [stats] = await db.execute<any[]>(query, [user_id]);
    return NextResponse.json(stats[0]);

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas" },
      { status: 500 }
    );
  }
} 