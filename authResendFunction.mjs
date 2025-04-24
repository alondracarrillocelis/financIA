import {
    CognitoIdentityProviderClient,
    ResendConfirmationCodeCommand
  } from "@aws-sdk/client-cognito-identity-provider";
  
  const client = new CognitoIdentityProviderClient({ region: "us-east-1" });
  
  export const handler = async (event) => {
    try {
      const { email } = JSON.parse(event.body);
  
      const command = new ResendConfirmationCodeCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email
      });
  
      await client.send(command);
  
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Código de verificación reenviado correctamente"
        })
      };
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Error al reenviar código",
          error: error.message
        })
      };
    }
  };
  