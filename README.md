# ReadTextAI
Com certeza! Com base no seu código HTML e na proposta do projeto, aqui está um exemplo de `README.md` completo e organizado, em português, pronto para colocar no seu repositório GitHub:

---

## 🧠 SUDO Intelligence – Assistente Pessoal com ElevenLabs

Este projeto é uma aplicação web que utiliza a API da **ElevenLabs** para converter texto em áudio e também gravar, organizar e reproduzir áudios personalizados. A interface é amigável, responsiva e conta com uma biblioteca multimídia embutida para gerenciamento dos áudios gerados ou enviados pelo usuário.

---

### 🚀 Funcionalidades

- ✅ **Conversão de texto para áudio** usando ElevenLabs API  
- ✅ **Gravação de áudio diretamente no navegador**  
- ✅ **Player de áudio integrado** com controle fixo  
- ✅ **Histórico de áudios gerados e gravados**  
- ✅ **Upload de arquivos de áudio** por categorias: músicas, audiobooks e outros  
- ✅ **Modo claro e escuro**  
- ✅ **Interface responsiva** com Bootstrap 5 e ícones modernos do Bootstrap Icons

---

### 🛠️ Tecnologias Utilizadas

- 🔹 HTML5, CSS3 e JavaScript  
- 🔹 [Bootstrap 5](https://getbootstrap.com/) + Bootstrap Icons  
- 🔹 [Flask (Python)](https://flask.palletsprojects.com/) para backend  
- 🔹 ElevenLabs API (TTS)  
- 🔹 Manipulação de arquivos via JavaScript no navegador  

---

### 📂 Estrutura de Pastas (sugestão)

```
ReadAudioIA/
├── static/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   ├── img/
│   │   ├── yB.gif
│   │   └── bobdance.gif
├── templates/
│   └── index.html
├── app.py
├── .gitignore
└── README.md
```

---

### ⚙️ Como Rodar Localmente

1. Clone o repositório:

```bash
git clone https://github.com/SudoMaster7/ReadTextAI.git
cd ReadTextAI
```

2. Crie e ative um ambiente virtual:

```bash
python -m venv venv
venv\Scripts\activate  # Windows
# ou
source venv/bin/activate  # Linux/Mac
```

3. Instale as dependências:

```bash
pip install -r requirements.txt
```

4. Configure sua chave da **API ElevenLabs** no `.env`:

```env
ELEVEN_API_KEY=sua-chave-aqui
```

5. Execute o servidor:

```bash
python app.py
```

Acesse [http://localhost:5000](http://localhost:5000) no navegador.

---

### 🔐 .gitignore sugerido

```bash
__pycache__/
.env
*.pyc
node_modules/
*.log
```

---

### 📌 To-Do / Futuras Melhorias

- [ ] Login e autenticação de usuários  
- [ ] Suporte a múltiplos idiomas  
- [ ] Integração com banco de dados  
- [ ] Compartilhamento de áudios

---

### 👨‍💻 Autor

Feito com 💻 por **SudoMaster7**  
GitHub: [github.com/SudoMaster7](https://github.com/SudoMaster7)

---

Se quiser, posso gerar esse arquivo e te mandar pronto pra copiar e colar. Quer também um ícone bonito com banner estilo capa de GitHub?
