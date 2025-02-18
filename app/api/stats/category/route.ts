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

    // Consulta com GROUP BY e funções de agregação
    const query = `
      SELECT 
        c.name as category_name,
        COUNT(*) as total_items,
        SUM(CASE WHEN ps.name = 'Comprado' THEN 1 ELSE 0 END) as purchased_items,
        COUNT(*) - SUM(CASE WHEN ps.name = 'Comprado' THEN 1 ELSE 0 END) as pending_items,
        CAST(AVG(NULLIF(wi.price, 0)) AS DECIMAL(10,2)) as avg_price,
        CAST(SUM(wi.price) AS DECIMAL(10,2)) as total_price,
        MAX(wi.created_at) as last_item_date
      FROM wishlist_items wi
      JOIN categories c ON wi.category_id = c.id
      JOIN purchase_status ps ON wi.purchase_status_id = ps.id
      WHERE wi.user_id = ?
      GROUP BY c.id, c.name
      ORDER BY total_items DESC
    `;

    const [stats] = await db.execute(query, [user_id]);
    return NextResponse.json(stats);

  } catch (error) {
    console.error('Erro ao buscar estatísticas por categoria:', error);
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas" },
      { status: 500 }
    );
  }
} 