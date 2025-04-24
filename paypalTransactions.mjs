const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const BASE_URL = "https://api-m.sandbox.paypal.com";

export const handler = async () => {
  try {
    // 1. Obtener token de PayPal
    const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

    const tokenRes = await fetch(`${BASE_URL}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials"
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) throw new Error(`Token error: ${JSON.stringify(tokenData)}`);

    const accessToken = tokenData.access_token;

    // 2. Fechas fijas para prueba (puedes hacerlas dinámicas después si gustas)
    const startDate = "2024-04-01T00:00:00-07:00";
    const endDate = "2024-04-24T23:59:59-07:00";

    const transactionsRes = await fetch(
      `${BASE_URL}/v1/reporting/transactions?start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}&fields=all&page_size=100&page=1`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    const transactionsData = await transactionsRes.json();
    if (!transactionsRes.ok) throw new Error(JSON.stringify(transactionsData));

    return {
      statusCode: 200,
      body: JSON.stringify(transactionsData)
    };

  } catch (error) {
    console.error("❌ Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error al obtener transacciones",
        error: error.message
      })
    };
  }
};
