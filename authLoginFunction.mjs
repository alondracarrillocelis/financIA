import {
    CognitoIdentityProviderClient,
    InitiateAuthCommand
  } from "@aws-sdk/client-cognito-identity-provider";
  import {
    CloudWatchClient,
    PutMetricDataCommand
  } from "@aws-sdk/client-cloudwatch";
  
  const cognitoClient = new CognitoIdentityProviderClient({ region: "us-east-1" });
  const cloudwatchClient = new CloudWatchClient({ region: "us-east-1" });
  
  export const handler = async (event) => {
    const sourceIp =
      event?.requestContext?.identity?.sourceIp ||
      event?.headers?.["x-forwarded-for"]?.split(",")[0]?.trim() ||
      "unknown";
  
    // Enviar métrica personalizada a CloudWatch
    await cloudwatchClient.send(
      new PutMetricDataCommand({
        Namespace: "LoginAttempts",
        MetricData: [
          {
            MetricName: "AttemptsPerIP",
            Dimensions: [{ Name: "IP", Value: sourceIp }],
            Unit: "Count",
            Value: 1
          }
        ]
      })
    );
  
    try {
      const { email, password } = JSON.parse(event.body);
  
      const command = new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: process.env.COGNITO_CLIENT_ID,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password
        }
      });
  
      const response = await cognitoClient.send(command);
  
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Login exitoso",
          accessToken: response.AuthenticationResult.AccessToken,
          idToken: response.AuthenticationResult.IdToken,
          refreshToken: response.AuthenticationResult.RefreshToken
        })
      };
    } catch (error) {
      let message = "Error de autenticación";
  
      if (error.name === "UserNotConfirmedException") {
        message = "El usuario aún no ha confirmado su cuenta. Por favor revisa tu correo.";
      } else if (error.name === "NotAuthorizedException") {
        message = "Correo o contraseña incorrectos.";
      } else if (error.name === "UserNotFoundException") {
        message = "El usuario no existe.";
      }
  
      return {
        statusCode: 401,
        body: JSON.stringify({ message, error: error.message })
      };
    }
  };