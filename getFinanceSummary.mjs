// getFinanceSummary.mjs
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const ddbClient = new DynamoDBClient({});
const db        = DynamoDBDocumentClient.from(ddbClient);

export const handler = async (event) => {
  console.info("Event recibido:", JSON.stringify(event));

  // 1) Extraer userId de Cognito (REST API v1 o HTTP API v2)
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

  // 2) Query a tabla de transacciones
  let txnsItems;
  try {
    const txns = await db.send(new QueryCommand({
      TableName:                process.env.TXNS_TABLE,
      KeyConditionExpression:   "userId = :u",
      ExpressionAttributeValues:{ ":u": userId }
    }));
    txnsItems = Array.isArray(txns.Items) ? txns.Items : [];
    console.info(`Retrieved ${txnsItems.length} transactions for user ${userId}`);
  } catch (err) {
    console.error("Error querying Transactions table:", {
      table: process.env.TXNS_TABLE,
      userId,
      name:    err.name,
      message: err.message
    });
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Error fetching transactions." })
    };
  }

  // 3) Query a tabla de budgets
  let budgetsItems;
  try {
    const budgets = await db.send(new QueryCommand({
      TableName:                process.env.BUDGETS_TABLE,
      KeyConditionExpression:   "userId = :u",
      ExpressionAttributeValues:{ ":u": userId }
    }));
    budgetsItems = Array.isArray(budgets.Items) ? budgets.Items : [];
    console.info(`Retrieved ${budgetsItems.length} budgets for user ${userId}`);
  } catch (err) {
    console.error("Error querying Budgets table:", {
      table: process.env.BUDGETS_TABLE,
      userId,
      name:    err.name,
      message: err.message
    });
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Error fetching budgets." })
    };
  }

  // 4) Responder con el resumen consolidado
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      txns:    txnsItems,
      budgets: budgetsItems
    })
  };
};
