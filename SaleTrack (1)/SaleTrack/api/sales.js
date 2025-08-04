// API Serverless para Vercel
const { Pool } = require('@neondatabase/serverless');

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

// Criar tabelas se não existirem
async function createTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sales (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        usuario VARCHAR(255) NOT NULL,
        quantidade INTEGER NOT NULL,
        valor DECIMAL(10,2) NOT NULL,
        data TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
  }
}

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await createTables();

  if (req.method === 'GET') {
    try {
      const { usuario, data } = req.query;
      let query = 'SELECT * FROM sales';
      let params = [];
      
      if (usuario) {
        query += ' WHERE usuario = $1';
        params.push(usuario);
      }
      
      if (data && !usuario) {
        query += ' WHERE DATE(data) = $1';
        params.push(data);
      } else if (data && usuario) {
        query += ' AND DATE(data) = $2';
        params.push(data);
      }
      
      query += ' ORDER BY data DESC';
      
      const result = await pool.query(query, params);
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error('Erro ao buscar vendas:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { usuario, quantidade, valor } = req.body;
      
      if (!usuario || !quantidade || !valor) {
        return res.status(400).json({ error: 'Dados obrigatórios: usuario, quantidade, valor' });
      }

      const result = await pool.query(
        'INSERT INTO sales (usuario, quantidade, valor) VALUES ($1, $2, $3) RETURNING *',
        [usuario, parseInt(quantidade), parseFloat(valor)]
      );
      
      return res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao criar venda:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'ID obrigatório' });
      }

      const result = await pool.query('DELETE FROM sales WHERE id = $1', [id]);
      
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Venda não encontrada' });
      }
      
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Erro ao deletar venda:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}