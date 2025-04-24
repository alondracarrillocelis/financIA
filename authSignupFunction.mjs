import {
    CognitoIdentityProviderClient,
    SignUpCommand
  } from "@aws-sdk/client-cognito-identity-provider";
  
  const client = new CognitoIdentityProviderClient({ region: "us-east-1" });
  
  export const handler = async (event) => {
    try {
      const {
        name,
        email,
        password,
        birthdate,
        gender,
        family_name,
        address,
        picture
      } = JSON.parse(event.body);

        // Validar los campos obligatorios
      const command = new SignUpCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [
          { Name: "email", Value: email },
          { Name: "name", Value: name },
          { Name: "family_name", Value: family_name },
          { Name: "birthdate", Value: birthdate },
          { Name: "gender", Value: gender },
          { Name: "address", Value: address },
          { Name: "picture", Value: picture }
        ]
      });
    //   1) Validar el evento de entrada
  
      const response = await client.send(command);
  
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Usuario registrado correctamente",
          userConfirmed: response.UserConfirmed,
          userSub: response.UserSub
        })
      };
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Error al registrar usuario",
          error: error.message
        })
      };
    }
  };
  