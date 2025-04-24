// getTransactions.mjs
import { Pool } from 'pg';

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT = '5432'
} = process.env;

// Pool global para reutilizar conexiones entre invocaciones
const pool = new Pool({
  host:     DB_HOST,
  user:     DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port:     parseInt(DB_PORT, 10),
  // ssl: { rejectUnauthorized: false } // descomenta si usas SSL
});

export const handler = async (event) => {
  console.info(`Invoked getTransactions at ${new Date().toISOString()}`);
  let client;

  try {
    // 1) Extraer userId de Cognito (REST v1 o HTTP API v2)
    const auth   = event.requestContext?.authorizer;
    const claims = auth?.claims ?? auth?.jwt?.claims;
    const userId = claims?.sub;
    if (!userId) {
      console.warn('Unauthorized: userId missing', auth);
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Unauthorized: userId missing.' })
      };
    }

    // 2) Obtener cliente del pool
    client = await pool.connect();

    // 3) Ejecutar SELECT
    const queryText = `
      SELECT
        txn_id   AS "txnId",
        amount,
        category,
        txn_date AS "txnDate",
        created_at AS "createdAt"
      FROM transactions
      WHERE user_id = $1
      ORDER BY txn_date DESC
    `;
    const { rows } = await client.query(queryText, [userId]);

    // 4) Responder con los registros
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactions: rows })
    };

  } catch (err) {
    console.error('Error fetching transactions:', {
      name:    err.name,
      message: err.message,
      stack:   err.stack
    });
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Failed to fetch transactions.' })
    };

  } finally {
    if (client) client.release();
  }
};
