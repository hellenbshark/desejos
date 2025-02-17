import { NextResponse } from "next/server";
import db from "@/lib/db";

// Criar item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Dados recebidos:', body); // Debug

    const {
      title,
      description,
      price,
      category_id,
      priority,
      image_url,
      user_id,
      purchase_status_id
    } = body;

    const query = `
      INSERT INTO wishlist_items (
        title, description, price, category_id, 
        priority, image_url, user_id, purchase_status_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      title,
      description || null,
      price || null,
      category_id,
      priority || 'medium',
      image_url || null,
      user_id,
      purchase_status_id || 1
    ];

    const [result] = await db.execute(query, values);
    console.log('Resultado da inserção:', result); // Debug
    
    return NextResponse.json({ 
      message: "Item adicionado com sucesso",
      result 
    });

  } catch (error) {
    console.error('Erro ao criar item:', error);
    return NextResponse.json(
      { error: "Erro ao criar item" },
      { status: 500 }
    );
  }
}

// Buscar itens
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    console.log('Buscando itens para user_id:', user_id);

    if (!user_id) {
      return NextResponse.json(
        { error: "ID do usuário é necessário" },
        { status: 400 }
      );
    }

    const query = `
      SELECT 
        wi.*,
        c.name as category_name,
        ps.name as status_name
      FROM wishlist_items wi
      LEFT JOIN categories c ON wi.category_id = c.id
      LEFT JOIN purchase_status ps ON wi.purchase_status_id = ps.id
      WHERE wi.user_id = ?
      ORDER BY wi.created_at DESC
    `;

    const [items] = await db.execute<any[]>(query, [user_id]);
    console.log('Itens encontrados:', items);

    return NextResponse.json(items);

  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    return NextResponse.json(
      { error: "Erro ao buscar itens" },
      { status: 500 }
    );
  }
}

// Atualizar item
export async function PUT(request: Request) {
  try {
    const { 
      id,
      user_id,
      category_id, 
      purchase_status_id, 
      title, 
      description, 
      price, 
      priority, 
      url, 
      image_url 
    } = await request.json();

    const query = `
      UPDATE wishlist_items 
      SET category_id = ?,
          purchase_status_id = ?,
          title = ?,
          description = ?,
          price = ?,
          priority = ?,
          url = ?,
          image_url = ?
      WHERE id = ? AND user_id = ?
    `;

    await db.execute(query, [
      category_id, purchase_status_id, title,
      description, price, priority, url, image_url,
      id, user_id
    ]);
    
    return NextResponse.json({ 
      message: 'Item atualizado com sucesso' 
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar item" },
      { status: 500 }
    );
  }
}

// Marcar como comprado
export async function PATCH(request: Request) {
  try {
    const { id, purchase_price, purchased_by } = await request.json();

    const query = `
      UPDATE wishlist_items 
      SET purchase_status_id = (SELECT id FROM purchase_status WHERE name = 'Comprado'),
          purchase_date = CURRENT_DATE,
          purchase_price = ?,
          purchased_by = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await db.execute(query, [purchase_price, purchased_by, id]);
    
    return NextResponse.json({ 
      message: 'Item marcado como comprado' 
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao marcar item como comprado" },
      { status: 500 }
    );
  }
}

// Deletar item
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const user_id = searchParams.get('user_id');

    if (!id || !user_id) {
      return NextResponse.json(
        { error: "ID do item e ID do usuário são necessários" },
        { status: 400 }
      );
    }

    const query = `
      DELETE FROM wishlist_items 
      WHERE id = ? AND user_id = ?
    `;

    await db.execute(query, [id, user_id]);
    
    return NextResponse.json({ 
      message: 'Item deletado com sucesso' 
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao deletar item" },
      { status: 500 }
    );
  }
}
