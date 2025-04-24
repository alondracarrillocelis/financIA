// index.mjs
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

// Conexion al cliente de DynamoDB
const client = new DynamoDBClient({ region: "us-east-1" });
const db = DynamoDBDocumentClient.from(client);
const TABLE = process.env.QUESTIONS_TABLE;

// Handler para obtener preguntas de onboarding
// Este handler escanea la tabla de preguntas y devuelve todas las preguntas disponibles
export const handler = async (event) => {
  console.info(`Invoked getOnboardingQuestions at ${new Date().toISOString()}`);

  try {
    // 1) Validar el evento de entrada
    const result = await db.send(new ScanCommand({ TableName: TABLE }));
    // 2) Manejar el resultado de la consulta
    const items = Array.isArray(result.Items) ? result.Items : [];
    console.info(`Successfully retrieved ${items.length} questions`);
    
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questions: items })
    };
  } catch (error) {
    console.error(`Error scanning table ${TABLE}:`, {
      errorMessage: error.message,
      stack: error.stack
    });

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "No se pudieron obtener las preguntas de onboarding." })
    };
  }
};