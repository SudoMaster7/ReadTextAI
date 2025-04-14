import os
import time
import logging
import asyncio
from flask import Flask, request, jsonify, send_from_directory, render_template
import edge_tts

app = Flask(__name__)

# Configurações de log
logging.basicConfig(level=logging.INFO, filename='app.log',
                    format='%(asctime)s - %(levelname)s - %(message)s')

# Diretório para salvar os arquivos de áudio
AUDIO_DIR = os.path.join(os.getcwd(), 'audios')
os.makedirs(AUDIO_DIR, exist_ok=True)

# Configurações de voz
# Lista de vozes disponíveis
VOICES = {
    "pt-BR-ThalitaMultilingualNeural": "Microsoft ThalitaMultilingual Online (Natural)",
    "pt-BR-AntonioNeural": "Microsoft Antonio Online (Natural)",
    "pt-BR-FranciscaNeural": "Microsoft Francisca Online (Natural)"
}
# Voz padrão
VOICE = "pt-BR-ThalitaMultilingualNeural"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/synthesize', methods=['POST'])
def synthesize():
    try:
        data = request.get_json()
        texto = data.get("text")
        if not texto:
            return jsonify({"error": "Nenhum texto enviado"}), 400

        # Nome do arquivo
        timestamp = int(time.time())
        filename = f"audio_{timestamp}.mp3"
        file_path = os.path.join(AUDIO_DIR, filename)

        logging.info(f"Iniciando síntese com edge-tts para o texto: {texto[:30]}...")

        # Executa a síntese de forma assíncrona
        asyncio.run(gerar_audio_edge_tts(texto, file_path))

        logging.info(f"Áudio gerado com sucesso: {filename}")
        return jsonify({
            "message": "Áudio gerado com sucesso",
            "filename": filename,
            "download_url": f"/download/{filename}"
        }), 200

    except Exception as e:
        logging.exception("Erro durante a síntese de áudio")
        return jsonify({"error": "Erro interno", "details": str(e)}), 500

async def gerar_audio_edge_tts(texto, caminho_saida):
    communicate = edge_tts.Communicate(texto, VOICE)
    await communicate.save(caminho_saida)

@app.route('/download/<filename>', methods=['GET'])
def download(filename):
    try:
        return send_from_directory(AUDIO_DIR, filename, as_attachment=True)
    except Exception as e:
        logging.exception("Erro no download do áudio")
        return jsonify({"error": "Arquivo não encontrado", "details": str(e)}), 404

def gerar_relatorio_simples(log_file='app.log'):
    with open(log_file, 'r') as f:
        linhas = f.readlines()
    total_requisicoes = sum(1 for linha in linhas if "Iniciando síntese" in linha)
    total_erros = sum(1 for linha in linhas if "Erro" in linha)
    print("Resumo do Sistema")
    print("------------------")
    print(f"Total de requisições: {total_requisicoes}")
    print(f"Total de erros: {total_erros}")
    print("------------------")
    print("Relatório gerado com sucesso!")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
    gerar_relatorio_simples()
