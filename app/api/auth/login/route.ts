import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const query = `
      SELECT id, name, email 
      FROM users 
      WHERE email = ? AND password = ?
    `;

    const [users] = await db.execute<any[]>(query, [email, password]);
    const user = users[0];

    if (!user) {
      return NextResponse.json(
        { error: "Email ou senha inválidos" },
        { status: 401 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao fazer login" },
      { status: 500 }
    );
  }
}
