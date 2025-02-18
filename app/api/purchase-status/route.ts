import { NextResponse } from "next/server";
import db from "@/lib/db";

// Listar todos os status
export async function GET() {
  try {
    const query = `
      SELECT * FROM purchase_status 
      ORDER BY name
    `;

    const [statuses] = await db.execute<any[]>(query);
    return NextResponse.json(statuses);

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar status" },
      { status: 500 }
    );
  }
}

// Criar novo status
export async function POST(request: Request) {
  try {
    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO purchase_status (name, description) 
      VALUES (?, ?)
    `;

    const [result] = await db.execute(query, [name, description]);
    
    return NextResponse.json({ 
      message: 'Status criado com sucesso',
      status: result 
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao criar status" },
      { status: 500 }
    );
  }
}

// Atualizar status
export async function PUT(request: Request) {
  try {
    const { id, name, description } = await request.json();

    if (!id || !name) {
      return NextResponse.json(
        { error: "ID e nome são obrigatórios" },
        { status: 400 }
      );
    }

    const query = `
      UPDATE purchase_status 
      SET name = ?, description = ?
      WHERE id = ?
    `;

    await db.execute(query, [name, description, id]);
    
    return NextResponse.json({ 
      message: 'Status atualizado com sucesso'
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar status" },
      { status: 500 }
    );
  }
}

// Deletar status
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "ID é necessário" },
        { status: 400 }
      );
    }

    // Verificar se o status está em uso
    const [rows] = await db.execute<any[]>(
      "SELECT COUNT(*) as count FROM wishlist_items WHERE status_id = ?",
      [id]
    );

    if (rows[0].count > 0) {
      return NextResponse.json(
        { error: "Este status não pode ser excluído pois está sendo usado em itens da wishlist" },
        { status: 400 }
      );
    }

    // Se não estiver em uso, deletar
    await db.execute("DELETE FROM purchase_status WHERE id = ?", [id]);
    
    return NextResponse.json({
      success: true,
      message: "Status excluído com sucesso"
    });

  } catch (error) {
    console.error('Erro ao deletar status:', error);
    return NextResponse.json(
      { error: "Erro ao excluir status" },
      { status: 500 }
    );
  }
} 