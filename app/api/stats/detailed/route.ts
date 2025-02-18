import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const sort_by = searchParams.get('sort_by') || 'total_items';
    const order = searchParams.get('order') || 'DESC';

    if (!user_id) {
      return NextResponse.json(
        { error: "ID do usuário é necessário" },
        { status: 400 }
      );
    }

    // Consulta com GROUP BY, HAVING e ordenação dinâmica
    const query = `
      SELECT 
        c.name as category_name,
        c.id as category_id,
        COUNT(*) as total_items,
        SUM(CASE WHEN ps.name = 'Comprado' THEN 1 ELSE 0 END) as purchased_items,
        COUNT(*) - SUM(CASE WHEN ps.name = 'Comprado' THEN 1 ELSE 0 END) as pending_items,
        CAST(AVG(NULLIF(wi.price, 0)) AS DECIMAL(10,2)) as avg_price,
        CAST(SUM(wi.price) AS DECIMAL(10,2)) as total_price,
        MAX(wi.created_at) as last_item_date,
        
        -- Subconsulta com ALL
        (
          SELECT COUNT(*)
          FROM wishlist_items wi2
          WHERE wi2.category_id = c.id
          AND wi2.price > ALL (
            SELECT price
            FROM wishlist_items wi3
            WHERE wi3.category_id != c.id
            AND wi3.user_id = ?
            AND wi3.price IS NOT NULL
          )
        ) as premium_items
      FROM wishlist_items wi
      JOIN categories c ON wi.category_id = c.id
      JOIN purchase_status ps ON wi.purchase_status_id = ps.id
      WHERE wi.user_id = ?
      GROUP BY c.id, c.name
      HAVING COUNT(*) > 0
        AND (
          CAST(AVG(NULLIF(wi.price, 0)) AS DECIMAL(10,2)) > 50
          OR COUNT(*) >= 2
        )
      ORDER BY 
        CASE 
          WHEN ? = 'avg_price' THEN CAST(AVG(NULLIF(wi.price, 0)) AS DECIMAL(10,2))
          WHEN ? = 'total_price' THEN CAST(SUM(wi.price) AS DECIMAL(10,2))
          WHEN ? = 'total_items' THEN COUNT(*)
          WHEN ? = 'purchased_items' THEN SUM(CASE WHEN ps.name = 'Comprado' THEN 1 ELSE 0 END)
          ELSE COUNT(*)
        END ${order === 'ASC' ? 'ASC' : 'DESC'}
    `;

    const [stats] = await db.execute(query, [
      user_id, 
      user_id, 
      sort_by, sort_by, sort_by, sort_by
    ]);
    
    return NextResponse.json(stats);

  } catch (error) {
    console.error('Erro ao buscar estatísticas detalhadas:', error);
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas" },
      { status: 500 }
    );
  }
} 