import { NextResponse } from "next/server";
import db from "@/lib/db";

// Listar todos os status
export async function GET() {
  try {
    const [statuses] = await db.execute<any[]>(
      "SELECT * FROM purchase_status ORDER BY name"
    );
    return NextResponse.json(statuses);
  } catch (error) {
    console.error('Erro ao buscar status:', error);
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

    const [result] = await db.execute(
      "INSERT INTO purchase_status (name, description) VALUES (?, ?)",
      [name, description]
    );

    return NextResponse.json({ 
      success: true,
      message: "Status criado com sucesso",
      id: (result as any).insertId 
    });

  } catch (error) {
    console.error('Erro ao criar status:', error);
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

    await db.execute(
      "UPDATE purchase_status SET name = ?, description = ? WHERE id = ?",
      [name, description, id]
    );

    return NextResponse.json({ 
      success: true,
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

    await db.execute(
      "DELETE FROM purchase_status WHERE id = ?",
      [id]
    );

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