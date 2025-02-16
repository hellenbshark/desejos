import { NextResponse } from "next/server";
import pool from "@/lib/db";

// Obter todos os itens da wishlist
export async function GET() {
  try {
    const [items]: [any[], any] = await pool.execute(
      `SELECT w.*, 
              c.name as category_name, 
              c.icon as category_icon,
              ps.name as status_name,
              u.name as purchased_by_name
       FROM wishlist_items w 
       JOIN categories c ON w.category_id = c.id 
       JOIN purchase_status ps ON w.purchase_status_id = ps.id
       LEFT JOIN users u ON w.purchased_by = u.id
       ORDER BY w.created_at DESC`
    );

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching wishlist items:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Adicionar novo item à wishlist
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { 
      title, 
      description, 
      price, 
      category_id, 
      priority,
      url, 
      image_url 
    } = data;

    // Obter o ID do status "Não Comprado"
    const [notPurchasedStatus]: [any[], any] = await pool.execute(
      'SELECT id FROM purchase_status WHERE name = ?',
      ['Não Comprado']
    );
    const purchaseStatusId = (notPurchasedStatus[0] as any)[0].id;

    const [result]: [any[], any] = await pool.execute(
      `INSERT INTO wishlist_items 
       (category_id, purchase_status_id, title, description, 
        price, priority, url, image_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [category_id, purchaseStatusId, title, description, 
       price, priority, url, image_url]
    );

    const [items]: [any[], any] = await pool.execute(
      `SELECT w.*, 
              c.name as category_name, 
              c.icon as category_icon,
              ps.name as status_name
       FROM wishlist_items w 
       JOIN categories c ON w.category_id = c.id 
       JOIN purchase_status ps ON w.purchase_status_id = ps.id
       WHERE w.id = ?`,
      [(result[0] as any).insertId]
    );

    return NextResponse.json(items[0]);
  } catch (error) {
    console.error("Error adding wishlist item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
