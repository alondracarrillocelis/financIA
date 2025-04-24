// createOnboardingSession.mjs
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { SageMakerRuntimeClient, InvokeEndpointCommand } from "@aws-sdk/client-sagemaker-runtime";
import { randomUUID } from "crypto";

// Configuración de clientes de DynamoDB y SageMaker
const dbClient = new DynamoDBClient({ region: "us-east-1" });
const db = DynamoDBDocumentClient.from(dbClient);
const sagemaker = new SageMakerRuntimeClient({ region: "us-east-1" });

export const handler = async (event) => {
  console.info(`Invoking createOnboardingSession at ${new Date().toISOString()}`);

  // 1. Validar body
  let body;
  try {
    body = JSON.parse(event.body);
    /// Validación de nombre y respuestas
    if (!body.name || !Array.isArray(body.answers)) {
      console.warn("Invalid input:", event.body);
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Invalid request payload: name and answers are required." })
      };
    }
  } catch (err) {
    console.error("Error parsing request body:", err);
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Malformed JSON in request body." })
    };
  }

// Crear un ID de sesión único y la fecha de creación
  const sessionId = randomUUID();
  const createdAt = new Date().toISOString();
  const initialItem = {
    sessionId,
    name: body.name,
    answers: body.answers,
    createdAt
  };

  // 2. Insertar sesión inicial en DynamoDB
  try {
    await db.send(new PutCommand({
      TableName: process.env.SESSIONS_TABLE,
      Item: initialItem
    }));
    console.info(`Session ${sessionId} created in ${process.env.SESSIONS_TABLE}`);
  } catch (err) {
    console.error("Error writing to DynamoDB:", { item: initialItem, error: err });
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Error creating session." })
    };
  }

  // 3. Invocar SageMaker (convertir answers a CSV plano)
  let preProposal;
  try {
    const csvBody = [
      body.answers.map(answer => answer.value).join(',')
    ].join('\n');

    console.info("CSV sent to SageMaker:", csvBody);

    const smResponse = await sagemaker.send(new InvokeEndpointCommand({
      EndpointName: process.env.SAGEMAKER_ENDPOINT,
      Body: csvBody,
      ContentType: 'text/csv'
    }));

    preProposal = JSON.parse(Buffer.from(smResponse.Body).toString("utf-8"));
    console.info(`SageMaker response for session ${sessionId}:`, preProposal);
  } catch (err) {
    console.error("Error invoking SageMaker endpoint:", err);
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Error generating pre-proposal." })
    };
  }

  // 4. Actualizar sesión con preProposal
  try {
    await db.send(new UpdateCommand({
      TableName: process.env.SESSIONS_TABLE,
      Key: { sessionId },
      UpdateExpression: "SET preProposal = :pp",
      ExpressionAttributeValues: {
        ":pp": preProposal
      }
    }));
    console.info(`Session ${sessionId} updated with preProposal.`);
  } catch (err) {
    console.error("Error updating session in DynamoDB:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Error saving pre-proposal." })
    };
  }

  // 5. Responder con éxito
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, preProposal })
  };
};
