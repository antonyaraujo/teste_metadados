import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

let sheetsClient;

function getSheetsClient() {
  if (sheetsClient) return sheetsClient;

  sheetsClient = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    SCOPES
  );

  return sheetsClient;
}

export const handler = async function (event, context) {
  const sheetsAuth = getSheetsClient();
  const sheets = google.sheets({ version: "v4", auth: sheetsAuth });

  const params = event.queryStringParameters || {};

  const recipientId = params.id || "desconhecido";
  const ip = event.headers["x-forwarded-for"]?.split(",")[0] || "desconhecido";
  const userAgent = event.headers["user-agent"] || "desconhecido";
  const language = event.headers["accept-language"] || "desconhecido";
  const platform = params.platform || "desconhecido";
  const screen = params.screen || "desconhecido";
  const timezone = params.timezone || "desconhecido";
  const timestamp = new Date().toISOString();

  const sheetId = process.env.GOOGLE_SHEET_ID;

  const values = [
    [
      timestamp,
      recipientId,
      ip,
      userAgent,
      language,
      platform,
      screen,
      timezone,
    ],
  ];

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "A1:H1",
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    });
  } catch (error) {
    console.error("Erro ao salvar no Google Sheets:", error);
  }

  const destinos = {
    OI1: "https://docs.google.com/document/d/1hPmEIZIt45-Qw5EaB7RSUykdZjXWTa3Jo2T8Crohxg8/edit?usp=sharing",
    OI2: "https://docs.google.com/document/d/1hPmEIZIt45-Qw5EaB7RSUykdZjXWTa3Jo2T8Crohxg8/edit?usp=sharing",
    OI3: "https://docs.google.com/document/d/1hPmEIZIt45-Qw5EaB7RSUykdZjXWTa3Jo2T8Crohxg8/edit?usp=sharing",
  };

  const destino = destinos[recipientId] || "https://google.com";

  return {
    statusCode: 302,
    headers: {
      Location: destino,
      "Cache-Control": "no-cache",
    },
  };
};
