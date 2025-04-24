import { Pool } from 'pg';

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT = '5432'
} = process.env;

const pool = new Pool({
  host:     DB_HOST,
  user:     DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port:     parseInt(DB_PORT, 10),
});

export const handler = async (event) => {
  console.info(`Invoked saveResponses at ${new Date().toISOString()}`);

  let client;
  try {
    const body = JSON.parse(event.body);
    const { sessionId, responses } = body;

    if (!sessionId || !Array.isArray(responses)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'sessionId and responses are required.' })
      };
    }

    // Tomamos un cliente del pool
    client = await pool.connect();
    //envolver en transacción para mayor atomicidad
    await client.query('BEGIN');

    const insertText = `
      INSERT INTO onboarding_responses
        (session_id, question_id, answer, created_at)
      VALUES
        ($1, $2, $3, NOW())
    `;

    for (const { questionId, answer } of responses) {
      await client.query(insertText, [sessionId, questionId, answer]);
    }

    await client.query('COMMIT');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Responses saved successfully.' })
    };

  } catch (err) {
    if (client) {
      try { await client.query('ROLLBACK'); } catch (_) {}
    }
    console.error('Error saving responses:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Failed to save responses.' })
    };

  } finally {
    // Devolvemos el cliente al pool
    if (client) client.release();
  }
};
