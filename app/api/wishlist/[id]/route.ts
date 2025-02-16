import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";

// Atualizar um item da wishlist
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { 
      title, 
      description, 
      price, 
      category_id, 
      priority,
      url, 
      image_url,
      mark_as_purchased,
      purchase_price 
    } = data;

    let updateFields = [];
    let updateValues = [];

    // Campos básicos
    updateFields.push(
      'title = ?',
      'description = ?',
      'price = ?',
      'category_id = ?',
      'priority = ?',
      'url = ?',
      'image_url = ?'
    );
    updateValues.push(
      title,
      description,
      price,
      category_id,
      priority,
      url,
      image_url
    );

    // Se estiver marcando como comprado
    if (mark_as_purchased) {
      const [purchasedStatus] = await pool.execute(
        'SELECT id FROM purchase_status WHERE name = ?',
        ['Comprado']
      );
      const purchaseStatusId = (purchasedStatus as any)[0].id;

      updateFields.push(
        'purchase_status_id = ?',
        'purchase_date = CURRENT_DATE',
        'purchase_price = ?',
        'purchased_by = ?'
      );
      updateValues.push(purchaseStatusId, purchase_price, session.user.id);
    }

    await pool.execute(
      `UPDATE wishlist_items 
       SET ${updateFields.join(', ')} 
       WHERE id = ? AND user_id = ?`,
      [...updateValues, params.id, session.user.id]
    );

    const [items] = await pool.execute(
      `SELECT w.*, 
              c.name as category_name, 
              c.icon as category_icon,
              ps.name as status_name,
              u.name as purchased_by_name
       FROM wishlist_items w 
       JOIN categories c ON w.category_id = c.id 
       JOIN purchase_status ps ON w.purchase_status_id = ps.id
       LEFT JOIN users u ON w.purchased_by = u.id
       WHERE w.id = ? AND w.user_id = ?`,
      [params.id, session.user.id]
    );

    if (!items || (items as any[]).length === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(items[0]);
  } catch (error) {
    console.error("Error updating wishlist item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Deletar um item da wishlist
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [result] = await pool.execute(
      'DELETE FROM wishlist_items WHERE id = ? AND user_id = ?',
      [params.id, session.user.id]
    );

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting wishlist item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
