import { NextResponse } from "next/server";
import db from "@/lib/db";

// Criar nota
export async function POST(request: Request) {
  try {
    const { user_id, item_id, note } = await request.json();

    const query = `
      INSERT INTO item_notes (user_id, item_id, note) 
      VALUES (?, ?, ?)
    `;

    const result = await db.execute(query, [user_id, item_id, note]);
    
    return NextResponse.json({ 
      message: 'Nota criada com sucesso',
      note: result 
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao criar nota" },
      { status: 500 }
    );
  }
}

// Buscar notas de um item
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const item_id = searchParams.get('item_id');
    const user_id = searchParams.get('user_id');

    let query;
    let params;

    if (item_id) {
      query = `
        SELECT n.*, u.name as user_name
        FROM item_notes n
        JOIN users u ON n.user_id = u.id
        WHERE n.item_id = ?
        ORDER BY n.created_at DESC
      `;
      params = [item_id];
    } else if (user_id) {
      query = `
        SELECT n.*, wi.title as item_title
        FROM item_notes n
        JOIN wishlist_items wi ON n.item_id = wi.id
        WHERE n.user_id = ?
        ORDER BY n.created_at DESC
      `;
      params = [user_id];
    } else {
      return NextResponse.json(
        { error: "Item ID ou User ID é necessário" },
        { status: 400 }
      );
    }

    const [notes] = await db.execute(query, params);
    return NextResponse.json(notes);

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar notas" },
      { status: 500 }
    );
  }
}

// Atualizar nota
export async function PUT(request: Request) {
  try {
    const { id, user_id, note } = await request.json();

    const query = `
      UPDATE item_notes 
      SET note = ?
      WHERE id = ? AND user_id = ?
    `;

    await db.execute(query, [note, id, user_id]);
    
    return NextResponse.json({ 
      message: 'Nota atualizada com sucesso' 
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar nota" },
      { status: 500 }
    );
  }
}

// Deletar nota
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const user_id = searchParams.get('user_id');

    if (!id || !user_id) {
      return NextResponse.json(
        { error: "ID da nota e ID do usuário são necessários" },
        { status: 400 }
      );
    }

    const query = `
      DELETE FROM item_notes 
      WHERE id = ? AND user_id = ?
    `;

    await db.execute(query, [id, user_id]);
    
    return NextResponse.json({ 
      message: 'Nota deletada com sucesso' 
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao deletar nota" },
      { status: 500 }
    );
  }
} 