import os
import time
import logging
import requests
from flask import Flask, request, jsonify, send_from_directory, render_template

app = Flask(__name__)

# Configurações de log
logging.basicConfig(level=logging.INFO, filename='app.log', 
                    format='%(asctime)s - %(levelname)s - %(message)s')

# Chave da API do ElevenLabs e configuração dos endpoints
ELEVENLABS_API_KEY = 'sk_a8f24b9a8848ec92f7e0b8bf18ebbdcc5c8c65103321cf96'  # Substitua pela sua chave
ELEVENLABS_VOICE_ID = 'T5cu6IU92Krx4mh43osx'  # Substitua pelo voice_id desejado
ELEVENLABS_URL = f'https://api.elevenlabs.io/v1/text-to-speech/9BWtsMINqrJLrRacOk9x'

# Diretório para salvar os arquivos de áudio
AUDIO_DIR = os.path.join(os.getcwd(), 'audios')
os.makedirs(AUDIO_DIR, exist_ok=True)

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

        payload = {
            "text": texto,
            # Adicione outros parâmetros, se necessário (por exemplo, "voice_settings")
        }
        headers = {
            "Accept": "audio/mpeg",
            "xi-api-key": ELEVENLABS_API_KEY,
            "Content-Type": "application/json"
        }
        logging.info(f"Iniciando síntese para o texto: {texto[:30]}...")
        response = requests.post(ELEVENLABS_URL, headers=headers, json=payload)

        if response.status_code == 200:
            # Salva o arquivo com base no timestamp
            timestamp = int(time.time())
            filename = f"audio_{timestamp}.mp3"
            file_path = os.path.join(AUDIO_DIR, filename)
            with open(file_path, "wb") as f:
                f.write(response.content)
            logging.info(f"Áudio gerado com sucesso: {filename}")
            return jsonify({
                "message": "Áudio gerado com sucesso",
                "filename": filename,
                "download_url": f"/download/{filename}"
            }), 200
        else:
            logging.error(f"Erro na síntese: {response.status_code} - {response.text}")
            return jsonify({
                "error": "Erro na síntese de áudio",
                "status": response.status_code,
                "details": response.text
            }), response.status_code
    except Exception as e:
        logging.exception("Erro durante a síntese de áudio")
        return jsonify({"error": "Erro interno", "details": str(e)}), 500

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
