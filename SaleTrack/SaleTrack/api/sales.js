export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Se não tem DATABASE_URL, usa dados temporários
  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'Configure DATABASE_URL' });
  }

  try {
    // Conectar no banco
    const { Client } = require('pg');
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    await client.connect();

    // Criar tabela se não existir
    await client.query(`
      CREATE TABLE IF NOT EXISTS vendas (
        id SERIAL PRIMARY KEY,
        usuario TEXT NOT NULL,
        quantidade INTEGER NOT NULL,
        valor DECIMAL(10,2) NOT NULL,
        data TIMESTAMP DEFAULT NOW()
      )
    `);

    // GET - Buscar vendas
    if (req.method === 'GET') {
      const result = await client.query('SELECT * FROM vendas ORDER BY data DESC');
      await client.end();
      return res.json(result.rows);
    }

    // POST - Criar venda
    if (req.method === 'POST') {
      const { usuario, quantidade, valor } = req.body;
      
      if (!usuario || !quantidade || !valor) {
        await client.end();
        return res.status(400).json({ error: 'Preencha todos os campos' });
      }

      const result = await client.query(
        'INSERT INTO vendas (usuario, quantidade, valor) VALUES ($1, $2, $3) RETURNING *',
        [usuario, parseInt(quantidade), parseFloat(valor)]
      );
      
      await client.end();
      return res.json(result.rows[0]);
    }

    // DELETE - Remover venda
    if (req.method === 'DELETE') {
      const { id } = req.query;
      
      await client.query('DELETE FROM vendas WHERE id = $1', [id]);
      await client.end();
      return res.json({ success: true });
    }

    await client.end();
    return res.status(405).json({ error: 'Método não permitido' });

  } catch (error) {
    console.error('Erro:', error);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
}