// Classe para gerenciar a biblioteca de áudios
class AudioLibrary {
    constructor() {
        this.libraryKey = 'audioLibrary';
        this.init();
    }

    init() {
        this.renderLibrary();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Botão para limpar a biblioteca
        document.getElementById('clear-library').addEventListener('click', () => {
            if (confirm('Tem certeza que deseja apagar TODOS os áudios gravados?')) {
                this.clearLibrary();
            }
        });
    }

    getLibrary() {
        return JSON.parse(localStorage.getItem(this.libraryKey)) || [];
    }

    saveToLibrary(audioData) {
        const library = this.getLibrary();
        library.unshift(audioData);
        localStorage.setItem(this.libraryKey, JSON.stringify(library));
        this.renderLibrary();
    }

    removeFromLibrary(audioUrl) {
        const library = this.getLibrary().filter(item => item.url !== audioUrl);
        localStorage.setItem(this.libraryKey, JSON.stringify(library));
        this.renderLibrary();
    }

    clearLibrary() {
        localStorage.removeItem(this.libraryKey);
        this.renderLibrary();
    }

    renderLibrary() {
        const library = this.getLibrary();
        const container = document.getElementById('audio-library');
        const emptyMsg = document.getElementById('empty-library');

        // Limpa o container
        container.innerHTML = '';
        
        if (library.length === 0) {
            // Mostra mensagem de biblioteca vazia
            emptyMsg.style.display = 'block';
            container.appendChild(emptyMsg);
        } else {
            // Esconde mensagem de vazio
            emptyMsg.style.display = 'none';
            
            // Adiciona cada áudio à lista
            library.forEach((audio, index) => {
                const audioElement = this.createAudioElement(audio, index);
                container.appendChild(audioElement);
            });
        }
    }

    createAudioElement(audio, index) {
        const element = document.createElement('div');
        element.className = 'list-group-item audio-item d-flex justify-content-between align-items-center';
        element.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="bi bi-music-note-beamed me-3"></i>
                <div>
                    <h6 class="mb-0">Gravação ${index + 1}</h6>
                    <small class="text-muted">${new Date(audio.date).toLocaleString()}</small>
                </div>
            </div>
            <div>
                <button class="btn btn-sm btn-outline-primary play-btn me-2">
                    <i class="bi bi-play"></i> Ouvir
                </button>
                <button class="btn btn-sm btn-outline-danger delete-btn">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;

        // Adiciona eventos
        element.querySelector('.play-btn').addEventListener('click', () => {
            const player = document.getElementById('main-player');
            player.src = audio.url;
            player.play();
        });

        element.querySelector('.delete-btn').addEventListener('click', () => {
            if (confirm('Tem certeza que deseja remover este áudio?')) {
                this.removeFromLibrary(audio.url);
            }
        });

        return element;
    }
}

// Dark Mode
document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    const navbar = document.querySelector('.navbar');
    const mainCard = document.getElementById('main-card');

    // Verificar preferência salva
    if (localStorage.getItem('darkMode') === 'enabled') {
        enableDarkMode();
    }

    darkModeToggle.addEventListener('click', toggleDarkMode);

    function toggleDarkMode() {
        if (body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    }

    function enableDarkMode() {
        body.classList.add('dark-mode');
        navbar.classList.add('navbar-dark', 'bg-dark');
        navbar.classList.remove('bg-primary');
        
        if (mainCard) mainCard.classList.add('bg-dark', 'text-white');
        
        darkModeToggle.innerHTML = '<i class="bi bi-sun"></i> Modo Claro';
        localStorage.setItem('darkMode', 'enabled');
    }

    function disableDarkMode() {
        body.classList.remove('dark-mode');
        navbar.classList.remove('navbar-dark', 'bg-dark');
        navbar.classList.add('bg-primary');
        
        if (mainCard) mainCard.classList.remove('bg-dark', 'text-white');
        
        darkModeToggle.innerHTML = '<i class="bi bi-moon"></i> Modo Escuro';
        localStorage.setItem('darkMode', 'disabled');
    }
});

// Gravação de Áudio
let mediaRecorder;
let audioChunks = [];

document.getElementById('record-btn').addEventListener('click', async function() {
    try {
        if (!mediaRecorder || mediaRecorder.state === 'inactive') {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                
                // Salva na biblioteca
                window.audioLibrary.saveToLibrary({
                    url: audioUrl,
                    date: new Date().toISOString()
                });
                
                audioChunks = [];
            };

            mediaRecorder.start();
            this.innerHTML = '<i class="bi bi-stop-circle"></i> Parar Gravação';
            this.classList.remove('btn-warning');
            this.classList.add('btn-danger');
        } else {
            mediaRecorder.stop();
            this.innerHTML = '<i class="bi bi-mic"></i> Gravar Áudio';
            this.classList.remove('btn-danger');
            this.classList.add('btn-warning');
        }
    } catch (err) {
        console.error('Erro na gravação:', err);
        alert('Erro ao acessar o microfone!');
    }
});

// Síntese de Texto para Voz
document.getElementById("synthesize-btn").addEventListener("click", function () {
    const text = document.getElementById("text-input").value;
    if (!text.trim()) {
        alert("Por favor, insira um texto.");
        return;
    }

    fetch('/synthesize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({text: text})
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(`Erro: ${data.error}`);
        } else {
            const player = document.getElementById('main-player');
            player.src = data.download_url;
            player.play();
            
            // Adiciona à biblioteca
            window.audioLibrary.saveToLibrary({
                url: data.download_url,
                date: new Date().toISOString(),
                type: 'síntese'
            });
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao sintetizar o áudio!');
    });
});

// Inicializa a biblioteca quando a página carrega
window.addEventListener('load', () => {
    window.audioLibrary = new AudioLibrary();
});