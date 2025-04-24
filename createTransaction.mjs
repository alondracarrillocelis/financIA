// createTransaction.mjs
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { randomUUID } from "crypto";

const ddbClient = new DynamoDBClient({});
const db        = DynamoDBDocumentClient.from(ddbClient);
const ebClient  = new EventBridgeClient({});

export const handler = async (event) => {
  console.info("Event recibido:", JSON.stringify(event));

  // 1) Extraer userId de Cognito
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

  // 2) Parsear y validar body
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
    // Validar que amount, category y txnDate estén presentes
  const { amount, category, txnDate } = payload;
  if (typeof amount !== "number" || !category || !txnDate) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Bad Request: amount (number), category and txnDate are required."
      })
    };
  }

  // 3) Construir el item
  const txnId     = randomUUID();
  const createdAt = new Date().toISOString();
  const item      = { userId, txnId, amount, category, txnDate, createdAt };

  // 4) Guardar en DynamoDB
  try {
    await db.send(new PutCommand({
      TableName: process.env.TXNS_TABLE,
      Item:      item
    }));
    console.info(`Transaction ${txnId} saved for user ${userId}`);
  } catch (err) {
    console.error("DynamoDB PutCommand error:", {
      table:   process.env.TXNS_TABLE,
      item,
      name:    err.name,
      message: err.message,
      stack:   err.stack
    });
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Error saving transaction." })
    };
  }
  // 5) Emitir evento a EventBridge
  try {
    await ebClient.send(new PutEventsCommand({
      Entries: [
        {
          Source:      "app.finance",
          DetailType:  "NewTransaction",
          Detail:      JSON.stringify(item)
        }
      ]
    }));
    console.info(`EventBridge event emitted for txn ${txnId}`);
  } catch (err) {
    console.error("EventBridge PutEventsCommand error:", {
      entry:   item,
      name:    err.name,
      message: err.message
    });
    // La transacción ya quedó guardada, pero avisamos del fallo
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Transaction saved but failed to emit event." })
    };
  }

  // 6) Respuesta exitosa
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item)
  };
};
