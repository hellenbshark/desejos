import { NextResponse } from "next/server";
import db from "@/lib/db";

// GET - Buscar perfil do usuário
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

    // Primeiro, verificar se o usuário existe
    const [userRows] = await db.execute(
      'SELECT id, name, email FROM users WHERE id = ?',
      [user_id]
    );

    if (!(userRows as any[])[0]) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Buscar ou criar perfil
    const [profileRows] = await db.execute(
      `SELECT * FROM user_profile WHERE user_id = ?`,
      [user_id]
    );

    let profile = (profileRows as any[])[0];

    if (!profile) {
      // Criar perfil se não existir
      await db.execute(
        `INSERT INTO user_profile (user_id) VALUES (?)`,
        [user_id]
      );

      const [newProfile] = await db.execute(
        `SELECT * FROM user_profile WHERE user_id = ?`,
        [user_id]
      );
      profile = (newProfile as any[])[0];
    }

    // Combinar dados do usuário com o perfil
    const userData = (userRows as any[])[0];
    const completeProfile = {
      ...profile,
      user_name: userData.name,
      email: userData.email
    };

    return NextResponse.json(completeProfile);

  } catch (error: any) {
    console.error('Erro detalhado ao buscar perfil:', error);
    return NextResponse.json(
      { 
        error: "Erro ao buscar perfil",
        details: error.message,
        sqlMessage: error.sqlMessage
      },
      { status: 500 }
    );
  }
}

// PATCH - Atualizar perfil
export async function PATCH(request: Request) {
  try {
    const { user_id, avatar_url, bio, preferences } = await request.json();

    // Verificar se o perfil existe
    const [checkProfile] = await db.execute(
      'SELECT user_id FROM user_profile WHERE user_id = ?',
      [user_id]
    );

    if (!(checkProfile as any[])[0]) {
      // Se não existir, criar um novo
      await db.execute(
        'INSERT INTO user_profile (user_id) VALUES (?)',
        [user_id]
      );
    }

    // Atualizar o perfil
    await db.execute(
      `UPDATE user_profile 
       SET 
         avatar_url = ?,
         bio = ?,
         preferences = ?,
         updated_at = CURRENT_TIMESTAMP
       WHERE user_id = ?`,
      [
        avatar_url || null,
        bio || null,
        preferences ? JSON.stringify(preferences) : null,
        user_id
      ]
    );

    // Buscar dados atualizados
    const [rows] = await db.execute(
      `SELECT 
        up.user_id,
        up.avatar_url,
        up.bio,
        up.preferences,
        up.created_at,
        up.updated_at,
        u.name as user_name,
        u.email
       FROM user_profile up
       JOIN users u ON up.user_id = u.id
       WHERE up.user_id = ?`,
      [user_id]
    );

    return NextResponse.json({ 
      message: "Perfil atualizado com sucesso",
      profile: rows[0]
    });

  } catch (error: any) {
    console.error('Erro detalhado ao atualizar perfil:', error);
    return NextResponse.json(
      { 
        error: "Erro ao atualizar perfil",
        details: error.message,
        sqlMessage: error.sqlMessage
      },
      { status: 500 }
    );
  }
} 