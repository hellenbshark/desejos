import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { item_id, status_id, user_id, purchase_price, purchased_by, notes } = await request.json();

    // Atualiza o status do item
    if (status_id === 2) { // Status "Comprado"
      await db.execute(
        `UPDATE wishlist_items 
         SET purchase_status_id = ?,
             purchased_by = ?,
             purchase_price = ?,
             purchase_date = CURRENT_TIMESTAMP
         WHERE id = ? AND user_id = ?`,
        [status_id, purchased_by, purchase_price, item_id, user_id]
      );
    } else { // Status "Não Comprado" ou outros
      await db.execute(
        `UPDATE wishlist_items 
         SET purchase_status_id = ?,
             purchased_by = NULL,
             purchase_price = NULL,
             purchase_date = NULL
         WHERE id = ? AND user_id = ?`,
        [status_id, item_id, user_id]
      );
    }

    // Busca informações do item para o histórico
    const [itemInfo] = await db.execute(
      `SELECT title FROM wishlist_items WHERE id = ?`,
      [item_id]
    );
    const item = (itemInfo as any[])[0];

    // Registra no histórico independente do status
    await db.execute(
      `INSERT INTO purchase_history 
       (item_id, status_id, user_id, purchase_price, purchased_by, purchase_date, notes)
       VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)`,
      [
        item_id, 
        status_id, 
        user_id, 
        status_id === 2 ? purchase_price : null,
        status_id === 2 ? purchased_by : null,
        status_id === 2 
          ? `Item "${item.title}" marcado como comprado` 
          : `Item "${item.title}" marcado como não comprado`
      ]
    );

    return NextResponse.json({ 
      message: "Status atualizado com sucesso" 
    });

  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    return NextResponse.json(
      { error: "Erro ao atualizar status" },
      { status: 500 }
    );
  }
} 