import { NextResponse } from "next/server";
import db from "@/lib/db";

// Listar categorias
export async function GET() {
  try {
    const [categories] = await db.execute<any[]>(
      "SELECT * FROM categories ORDER BY name"
    );
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return NextResponse.json(
      { error: "Erro ao buscar categorias" },
      { status: 500 }
    );
  }
}

// Criar nova categoria
export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se já existe uma categoria com este nome
    const [existing] = await db.execute<any[]>(
      "SELECT id FROM categories WHERE LOWER(name) = LOWER(?)",
      [name]
    );

    if ((existing as any[]).length > 0) {
      return NextResponse.json(
        { error: "Já existe uma categoria com este nome" },
        { status: 400 }
      );
    }

    // Se não existir, criar a nova categoria
    const [result] = await db.execute(
      "INSERT INTO categories (name) VALUES (?)",
      [name]
    );

    return NextResponse.json({ 
      success: true,
      message: "Categoria criada com sucesso",
      id: (result as any).insertId 
    });

  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    return NextResponse.json(
      { error: "Erro ao criar categoria" },
      { status: 500 }
    );
  }
}

// Atualizar categoria
export async function PUT(request: Request) {
  try {
    const { id, name } = await request.json();

    if (!id || !name) {
      return NextResponse.json(
        { error: "ID e nome são obrigatórios" },
        { status: 400 }
      );
    }

    await db.execute(
      "UPDATE categories SET name = ? WHERE id = ?",
      [name, id]
    );

    return NextResponse.json({ 
      message: "Categoria atualizada com sucesso" 
    });

  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    return NextResponse.json(
      { error: "Erro ao atualizar categoria" },
      { status: 500 }
    );
  }
}

// Deletar categoria
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

    // Verificar se a categoria está em uso
    const [rows] = await db.execute<any[]>(
      "SELECT COUNT(*) as count FROM wishlist_items WHERE category_id = ?",
      [id]
    );

    if (rows[0].count > 0) {
      return NextResponse.json(
        { error: "Esta categoria não pode ser excluída pois está sendo usada em itens da wishlist" },
        { status: 400 }
      );
    }

    // Se não estiver em uso, deletar
    await db.execute("DELETE FROM categories WHERE id = ?", [id]);
    
    return NextResponse.json({
      success: true,
      message: "Categoria excluída com sucesso"
    });

  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    return NextResponse.json(
      { error: "Erro ao excluir categoria" },
      { status: 500 }
    );
  }
}

// Obter uma categoria por ID
export async function GET_BY_ID(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID da categoria é obrigatório' },
        { status: 400 }
      );
    }

    const query = `
      SELECT * FROM categories 
      WHERE id = ?
    `;

    const [category] = await db.execute(query, [id]);
    
    if (!category) {
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);

  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar categoria' },
      { status: 500 }
    );
  }
}
