import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Verificar se email já existe
    const [existingUsers] = await db.execute<any[]>(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 400 }
      );
    }

    // Criar novo usuário
    const query = `
      INSERT INTO users (name, email, password) 
      VALUES (?, ?, ?)
    `;

    const [result] = await db.execute(query, [name, email, password]);
    
    return NextResponse.json({ 
      message: "Conta criada com sucesso"
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao criar conta" },
      { status: 500 }
    );
  }
}
