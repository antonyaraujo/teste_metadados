exports.handler = async function (event, context) {
  // Pega o ID da query string
  const recipientId = event.queryStringParameters?.id || "desconhecido";

  // Cabeçalhos
  const headers = event.headers || {};

  // User-Agent
  const userAgent = headers["user-agent"] || "desconhecido";

  // IP (Netlify usa vários headers)
  const ip =
    headers["client-ip"] ||
    headers["x-forwarded-for"]?.split(",")[0].trim() ||
    event.requestContext?.identity?.sourceIp || // fallback
    "desconhecido";

  // Idioma do navegador
  const language = headers["accept-language"] || "desconhecido";

  // Dados extras enviados via query params (screen, platform, timezone)
  // Por segurança, pode passar esses dados pelo link, ex:
  // https://site.netlify.app/.netlify/functions/track?id=OI1&platform=Windows&screen=1920x1080&timezone=America/Sao_Paulo

  const platform = event.queryStringParameters?.platform || "desconhecido";
  const screen = event.queryStringParameters?.screen || "desconhecido";
  const timezone = event.queryStringParameters?.timezone || "desconhecido";

  const timestamp = new Date().toISOString();

  // Log no console (pode trocar para integração com DB/API)
  console.log(`--- Novo clique capturado ---`);
  console.log(`Timestamp: ${timestamp}`);
  console.log(`ID: ${recipientId}`);
  console.log(`IP: ${ip}`);
  console.log(`User-Agent: ${userAgent}`);
  console.log(`Idioma: ${language}`);
  console.log(`Plataforma: ${platform}`);
  console.log(`Resolução: ${screen}`);
  console.log(`Fuso horário: ${timezone}`);
  console.log(`-----------------------------`);

  // Mapear IDs para URLs reais
  const destinos = {
    OI1: "https://drive.google.com/file/d/abc123/view",
    OI2: "https://drive.google.com/file/d/def456/view",
    OI3: "https://drive.google.com/file/d/ghi789/view",
  };

  const destino = destinos[recipientId] || "https://google.com";

  // Retorna redirecionamento HTTP 302
  return {
    statusCode: 302,
    headers: {
      Location: destino,
      "Cache-Control": "no-cache",
    },
  };
};
