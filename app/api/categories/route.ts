import { NextResponse } from "next/server";
import pool from "@/lib/db";

// Obter todas as categorias
export async function GET() {
  try {
    const [categories] = await pool.execute(
      'SELECT id, name, description, icon FROM categories ORDER BY name'
    );
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Adicionar uma nova categoria
export async function POST(request: Request) {
  try {
    const { name, description, icon } = await request.json();

    const [result] = await pool.execute(
      'INSERT INTO categories (name, description, icon) VALUES (?, ?, ?)',
      [name, description, icon]
    );

    return NextResponse.json({ 
      id: (result as any).insertId,
      name,
      description,
      icon
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
