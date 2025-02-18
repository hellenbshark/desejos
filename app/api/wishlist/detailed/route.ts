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

    // Consulta detalhada com INNER JOIN, LEFT JOIN e subqueries
    const query = `
      SELECT 
        wi.*,
        c.name as category_name,
        c.icon as category_icon,
        ps.name as status_name,
        u.name as purchased_by_name,
        (
          SELECT COUNT(*)
          FROM item_notes n
          WHERE n.item_id = wi.id
        ) as notes_count,
        (
          SELECT MAX(created_at)
          FROM item_notes n
          WHERE n.item_id = wi.id
        ) as last_note_date,
        (
          SELECT GROUP_CONCAT(DISTINCT c2.name)
          FROM wishlist_items wi2
          INNER JOIN categories c2 ON wi2.category_id = c2.id
          WHERE wi2.user_id = wi.user_id
          AND wi2.purchase_status_id = wi.purchase_status_id
        ) as related_categories
      FROM wishlist_items wi
      INNER JOIN categories c ON wi.category_id = c.id
      INNER JOIN purchase_status ps ON wi.purchase_status_id = ps.id
      LEFT JOIN users u ON wi.purchased_by = u.id
      WHERE wi.user_id = ?
      ORDER BY 
        CASE WHEN ps.name = 'Comprado' THEN 1 ELSE 0 END,
        wi.created_at DESC
    `;

    const [items] = await db.execute(query, [user_id]);
    return NextResponse.json(items);

  } catch (error) {
    console.error('Erro ao buscar itens detalhados:', error);
    return NextResponse.json(
      { error: "Erro ao buscar itens" },
      { status: 500 }
    );
  }
} 