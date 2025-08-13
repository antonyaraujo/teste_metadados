from flask import Flask, request, redirect, render_template_string
from datetime import datetime

app = Flask(__name__)

# 🔹 Mapeamento de IDs para links reais
DESTINOS = {
    "OI1": "https://drive.google.com/file/d/abc123/view",
    "OI2": "https://drive.google.com/file/d/def456/view",
    "OI3": "https://drive.google.com/file/d/ghi789/view"
}

# HTML temporário que captura dados via JavaScript
HTML_CAPTURE = """
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Carregando...</title>
<script>
async function sendData() {
    const data = {
        recipient_id: "{{ recipient_id }}",
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screen: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    await fetch('/log', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    // Redireciona para rota segura
    window.location.href = "/redirect/{{ recipient_id }}";
}
sendData();
</script>
</head>
<body>
Redirecionando...
</body>
</html>
"""

@app.route("/track")
def track_click():
    recipient_id = request.args.get("id", "desconhecido")
    return render_template_string(HTML_CAPTURE, recipient_id=recipient_id)

@app.route("/log", methods=["POST"])
def log_data():
    data = request.get_json()
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    ip_address = request.remote_addr
    with open("click_log.txt", "a", encoding="utf-8") as f:
        f.write(f"{timestamp} | IP: {ip_address} | Dados: {data}\n")
    return "", 204

@app.route("/redirect/<recipient_id>")
def redirect_final(recipient_id):
    destino = DESTINOS.get(recipient_id, "https://google.com")
    return redirect(destino)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
