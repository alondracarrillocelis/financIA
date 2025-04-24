// index.mjs (listBudgets)
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const ddbClient = new DynamoDBClient({});
const db        = DynamoDBDocumentClient.from(ddbClient);

export const handler = async (event) => {
  console.info("Event recibido:", JSON.stringify(event));

//   1) Validar el evento de entrada
  const authorizer = event.requestContext?.authorizer;
  const claims     = authorizer?.claims ?? authorizer?.jwt?.claims;
  const userId     = claims?.sub;
//   2) Obtener el userId del autorizer (Cognito)
  if (!userId) {
    return {
      statusCode: 401,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Unauthorized: userId missing." })
    };
  }

  try {
    const result = await db.send(new QueryCommand({
      TableName: process.env.BUDGETS_TABLE,
      KeyConditionExpression: "userId = :u",
      ExpressionAttributeValues: { ":u": userId }
    }));
    console.info(`Presupuestos encontrados: ${result.Items?.length}`);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ budgets: result.Items ?? [] })
    };
  } catch (error) {
    console.error("Error al consultar DynamoDB:", {
      table:   process.env.BUDGETS_TABLE,
      userId,
      name:    error.name,
      message: error.message,
      stack:   error.stack
    });
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Error fetching budgets." })
    };
  }
};
