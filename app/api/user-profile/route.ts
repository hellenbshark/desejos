import { NextResponse } from "next/server";
import db from "@/lib/db";

// Buscar perfil
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
      return NextResponse.json(
        { error: "ID do usuário é necessário" },
        { status: 400 }
      );
    }

    const query = `
      SELECT u.*, up.avatar_url, up.bio, up.birth_date
      FROM users u
      LEFT JOIN user_profile up ON u.id = up.user_id
      WHERE u.id = ?
    `;

    const [profile] = await db.execute<any[]>(query, [user_id]);
    return NextResponse.json(profile[0]);

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar perfil" },
      { status: 500 }
    );
  }
}

// Atualizar perfil
export async function PUT(request: Request) {
  try {
    const { user_id, avatar_url, bio, birth_date } = await request.json();

    const query = `
      INSERT INTO user_profile (user_id, avatar_url, bio, birth_date)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        avatar_url = VALUES(avatar_url),
        bio = VALUES(bio),
        birth_date = VALUES(birth_date)
    `;

    await db.execute(query, [user_id, avatar_url, bio, birth_date]);
    
    return NextResponse.json({ 
      message: 'Perfil atualizado com sucesso' 
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar perfil" },
      { status: 500 }
    );
  }
} 