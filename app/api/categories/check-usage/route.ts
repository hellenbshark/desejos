import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
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
      "SELECT EXISTS(SELECT 1 FROM wishlist_items WHERE category_id = ?) as inUse",
      [id]
    );

    return NextResponse.json({
      inUse: rows[0].inUse === 1
    });

  } catch (error) {
    console.error('Erro ao verificar uso da categoria:', error);
    return NextResponse.json(
      { error: "Erro ao verificar uso da categoria" },
      { status: 500 }
    );
  }
} 