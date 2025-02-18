import { NextResponse } from "next/server";
import db from "@/lib/db";

// Criar item(s)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Verifica se é um único item ou array de itens
    const items = Array.isArray(body) ? body : [body];
    console.log('Dados recebidos:', items);

    // Validar itens
    for (const item of items) {
      if (!item.title || !item.category_id || !item.user_id) {
        return NextResponse.json(
          { error: "Título, categoria e usuário são obrigatórios" },
          { status: 400 }
        );
      }
    }

    // Query para inserção em massa
    const placeholders = items.map(() => '(?, ?, ?, ?, ?, ?, ?, ?)').join(', ');
    const query = `
      INSERT INTO wishlist_items (
        title, description, price, category_id, 
        priority, image_url, user_id, purchase_status_id
      ) VALUES ${placeholders}
    `;

    // Preparar valores para inserção em massa
    const values = items.flatMap(item => [
      item.title,
      item.description || null,
      item.price || null,
      item.category_id,
      item.priority || 'medium',
      item.image_url || null,
      item.user_id,
      item.purchase_status_id || 1
    ]);

    // Executar inserção em massa
    const [result] = await db.execute(query, values);
    
    return NextResponse.json({ 
      message: `${items.length} item(s) adicionado(s) com sucesso`,
      result,
      insertedIds: (result as any).insertId 
        ? Array.from({ length: items.length }, (_, i) => (result as any).insertId + i)
        : []
    });

  } catch (error) {
    console.error('Erro ao criar item(s):', error);
    return NextResponse.json(
      { error: "Erro ao criar item(s)" },
      { status: 500 }
    );
  }
}

// Buscar itens
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const search = searchParams.get('search')?.trim();

    if (!user_id) {
      return NextResponse.json(
        { error: "ID do usuário é necessário" },
        { status: 400 }
      );
    }

    let query = `
      SELECT 
        wi.*,
        c.name as category_name,
        c.icon as category_icon,
        ps.name as status_name,
        u.name as purchased_by_name
      FROM wishlist_items wi
      LEFT JOIN categories c ON wi.category_id = c.id
      LEFT JOIN purchase_status ps ON wi.purchase_status_id = ps.id
      LEFT JOIN users u ON wi.purchased_by = u.id
      WHERE wi.user_id = ?
    `;

    const queryParams = [user_id];

    if (search) {
      // Busca por palavras-chave separadas
      const keywords = search.split(' ').filter(Boolean);
      const searchConditions = keywords.map(() => 
        `(LOWER(wi.title) LIKE LOWER(?) OR LOWER(wi.description) LIKE LOWER(?))`
      ).join(' AND ');
      
      query += ` AND (${searchConditions})`;
      
      // Adiciona cada palavra-chave duas vezes (para título e descrição)
      keywords.forEach(keyword => {
        queryParams.push(`%${keyword}%`, `%${keyword}%`);
      });
    }

    query += ` ORDER BY 
      CASE WHEN ps.name = 'Comprado' THEN 1 ELSE 0 END,
      wi.created_at DESC
    `;

    const [items] = await db.execute<any[]>(query, queryParams);
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
