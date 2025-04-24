// getRecommendations.mjs
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";             
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"; 

// 1. Crear cliente DynamoDB y su DocumentClient
const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);

export const handler = async (event) => {
  console.info(`Invoked getRecommendations at ${new Date().toISOString()}`);

  const userId = event.requestContext?.authorizer?.claims?.sub;
  if (!userId) {
    return { statusCode: 401, body: JSON.stringify({ message: 'Unauthorized' }) };
  }

  try {
    // 2. Ejecutar Query usando Command
    const result = await docClient.send(new QueryCommand({
      TableName: process.env.RECS_TABLE,
      KeyConditionExpression: 'userId = :u',
      ExpressionAttributeValues: { ':u': userId }
    }));
    const items = Array.isArray(result.Items) ? result.Items : [];
    return { statusCode: 200, body: JSON.stringify({ recommendations: items }) };
  } catch (err) {
    console.error('DynamoDB v3 Query error:', err);
    return { statusCode: 500, body: JSON.stringify({ message: 'Error fetching recommendations.' }) };
  }
};
