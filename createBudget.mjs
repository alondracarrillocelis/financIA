
// createBudget.mjs
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

const ddbClient = new DynamoDBClient({});
const db        = DynamoDBDocumentClient.from(ddbClient);

export const handler = async (event) => {
  console.info("Event recibido:", JSON.stringify(event));

  // 1) Extraer userId de Cognito (claims v1 o v2)
  const authorizer = event.requestContext?.authorizer;
  const claims     = authorizer?.claims ?? authorizer?.jwt?.claims;
  const userId     = claims?.sub;
  if (!userId) {
    console.warn("Unauthorized: userId missing", authorizer);
    return {
      statusCode: 401,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Unauthorized: userId missing." })
    };
  }

  // 2) Parsear y validar el body
  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Invalid JSON in request body." })
    };
  }
  const { amount, periodStart, periodEnd } = payload;
  if (typeof amount !== "number" || !periodStart || !periodEnd) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Bad Request: amount (number), periodStart and periodEnd are required."
      })
    };
  }

  // 3) Preparar el item y guardarlo
  const budgetId = randomUUID();
  const item     = { userId, budgetId, amount, periodStart, periodEnd, status: "ACTIVE" };

  try {
    await db.send(new PutCommand({
      TableName: process.env.BUDGETS_TABLE,
      Item:      item
    }));
    console.info(`Budget ${budgetId} created for user ${userId}`);
    return {
      statusCode: 201,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item)
    };
  } catch (err) {
    console.error("Error al escribir en la tabla Budgets:", {
      table:     process.env.BUDGETS_TABLE,
      item,
      name:      err.name,
      message:   err.message,
      stack:     err.stack
    });
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Failed to create budget." })
    };
  }

};
