/* ==========================================
   LUNA IA
   PARTE 1 — INTERFACE
========================================== */


/* ==========================================
   ELEMENTOS
========================================== */

const sidebar =
    document.getElementById("sidebar");

const sidebarOverlay =
    document.getElementById("sidebarOverlay");

const openSidebar =
    document.getElementById("openSidebar");

const closeSidebar =
    document.getElementById("closeSidebar");

const newChat =
    document.getElementById("newChat");

const welcome =
    document.getElementById("welcome");

const messages =
    document.getElementById("messages");

const messageInput =
    document.getElementById("messageInput");

const sendButton =
    document.getElementById("sendButton");

const voiceButton =
    document.getElementById("voiceButton");

const thinking =
    document.getElementById("thinking");

const moreButton =
    document.getElementById("moreButton");

const morePopup =
    document.getElementById("morePopup");

const clearChat =
    document.getElementById("clearChat");

const aboutLuna =
    document.getElementById("aboutLuna");

const studyButton =
    document.getElementById("studyButton");

const studyModal =
    document.getElementById("studyModal");

const closeStudy =
    document.getElementById("closeStudy");


/* ==========================================
   ESTADO
========================================== */

let conversa = [];

let gravando = false;


/* ==========================================
   MENU LATERAL
========================================== */

openSidebar.addEventListener(
    "click",
    () => {

        sidebar.classList.add("open");

        sidebarOverlay.classList.add("show");

    }
);


closeSidebar.addEventListener(
    "click",
    fecharSidebar
);


sidebarOverlay.addEventListener(
    "click",
    fecharSidebar
);


function fecharSidebar() {

    sidebar.classList.remove("open");

    sidebarOverlay.classList.remove("show");

}


/* ==========================================
   NOVA CONVERSA
========================================== */

newChat.addEventListener(
    "click",
    novaConversa
);


function novaConversa() {

    conversa = [];

    messages.innerHTML = "";

    welcome.style.display = "flex";

    thinking.classList.remove("show");

    messageInput.value = "";

    fecharSidebar();

    messageInput.focus();

}


/* ==========================================
   ENVIO
========================================== */

sendButton.addEventListener(
    "click",
    enviarMensagem
);


messageInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            enviarMensagem();

        }

    }
);


async function enviarMensagem() {

    const texto =
        messageInput.value.trim();


    if (!texto) {
        return;
    }


    adicionarMensagem(
        "user",
        texto
    );


    messageInput.value = "";

    ajustarTextarea();


    /* --------------------------------
       IMPORTANTE

       Na Parte 2 essa função será
       substituída pela conexão real
       com o servidor da Luna.
    -------------------------------- */

    await respostaLocal(texto);

}


/* ==========================================
   ADICIONAR MENSAGEM
========================================== */

function adicionarMensagem(
    tipo,
    texto
) {

    welcome.style.display = "none";


    conversa.push({

        tipo,
        texto,

        horario:
            new Date().toLocaleTimeString(
                "pt-BR",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            )

    });


    const message =
        document.createElement("div");


    message.className =
        `message ${tipo === "user" ? "user" : "ai"}`;


    const avatar =
        document.createElement("div");


    avatar.className =
        "message-avatar";


    avatar.textContent =
        tipo === "user"
            ? "K"
            : "☾";


    const content =
        document.createElement("div");


    content.className =
        "message-content";


    content.innerHTML =
        formatarTexto(texto);


    message.appendChild(avatar);

    message.appendChild(content);


    messages.appendChild(message);


    rolarParaBaixo();

}


/* ==========================================
   FORMATAÇÃO
========================================== */

function formatarTexto(texto) {

    return texto

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        )

        .replace(
            /\n/g,
            "<br>"
        );

}


/* ==========================================
   SCROLL
========================================== */

function rolarParaBaixo() {

    const area =
        document.getElementById("chatArea");


    setTimeout(
        () => {

            area.scrollTo({

                top:
                    area.scrollHeight,

                behavior:
                    "smooth"

            });

        },
        50
    );

}


/* ==========================================
   LUNA TEMPORÁRIA
========================================== */

async function respostaLocal(texto) {

    thinking.classList.add("show");

    rolarParaBaixo();


    await esperar(900);


    thinking.classList.remove("show");


    let resposta;


    const mensagem =
        texto.toLowerCase();


    if (
        mensagem.includes("oi") ||
        mensagem.includes("olá") ||
        mensagem.includes("ola")
    ) {

        resposta =
            "Oi! 💜 Que bom conversar com você. Eu sou a Luna. Como você está?";

    }

    else if (
        mensagem.includes("quem é você") ||
        mensagem.includes("quem e voce")
    ) {

        resposta =
            "Eu sou a Luna, uma IA criada para conversar, ajudar, aprender com o contexto da conversa e também te ajudar com estudos, ideias e várias outras coisas.";

    }

    else if (
        mensagem.includes("estudar")
    ) {

        resposta =
            "Claro! 📚 Posso te ajudar a entender a matéria, resolver exercícios, revisar conteúdo ou montar uma explicação passo a passo.";

    }

    else {

        resposta =
            "Entendi. 💜 Quero conversar com você sobre isso. Na próxima parte vou estar conectada ao cérebro de IA de verdade, em vez dessas respostas temporárias.";

    }


    adicionarMensagem(
        "ai",
        resposta
    );

}


/* ==========================================
   ESPERAR
========================================== */

function esperar(ms) {

    return new Promise(
        resolve =>
            setTimeout(resolve, ms)
    );

}


/* ==========================================
   TEXTAREA AUTOMÁTICO
========================================== */

messageInput.addEventListener(
    "input",
    ajustarTextarea
);


function ajustarTextarea() {

    messageInput.style.height =
        "auto";


    messageInput.style.height =
        Math.min(
            messageInput.scrollHeight,
            150
        ) + "px";

}


/* ==========================================
   CARDS INICIAIS
========================================== */

document
    .querySelectorAll(".quick-card")
    .forEach(card => {

        card.addEventListener(
            "click",
            () => {

                const texto =
                    card.dataset.message;

                messageInput.value =
                    texto;

                ajustarTextarea();

                enviarMensagem();

            }
        );

    });


/* ==========================================
   MICROFONE
========================================== */

voiceButton.addEventListener(
    "click",
    iniciarVoz
);


function iniciarVoz() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        alert(
            "O reconhecimento de voz não está disponível neste navegador."
        );

        return;

    }


    if (gravando) {
        return;
    }


    const recognition =
        new SpeechRecognition();


    recognition.lang =
        "pt-BR";


    recognition.interimResults =
        false;


    recognition.continuous =
        false;


    gravando = true;

    voiceButton.textContent =
        "🔴";


    recognition.start();


    recognition.onresult =
        function(event) {

            const texto =
                event.results[0][0].transcript;


            messageInput.value =
                texto;


            ajustarTextarea();

        };


    recognition.onerror =
        function() {

            gravando = false;

            voiceButton.textContent =
                "🎙";

        };


    recognition.onend =
        function() {

            gravando = false;

            voiceButton.textContent =
                "🎙";

        };

}


/* ==========================================
   MENU ⋮
========================================== */

moreButton.addEventListener(
    "click",
    function(event) {

        event.stopPropagation();

        morePopup.classList.toggle("show");

    }
);


document.addEventListener(
    "click",
    function(event) {

        if (
            !morePopup.contains(event.target) &&
            event.target !== moreButton
        ) {

            morePopup.classList.remove(
                "show"
            );

        }

    }
);


/* ==========================================
   LIMPAR CONVERSA
========================================== */

clearChat.addEventListener(
    "click",
    function() {

        novaConversa();

        morePopup.classList.remove(
            "show"
        );

    }
);


/* ==========================================
   SOBRE A LUNA
========================================== */

aboutLuna.addEventListener(
    "click",
    function() {

        morePopup.classList.remove(
            "show"
        );


        alert(
            "🌙 Luna IA\n\n" +
            "Uma inteligência artificial criada " +
            "para conversar, aprender, estudar, " +
            "criar ideias e ajudar no dia a dia."
        );

    }
);


/* ==========================================
   ESTUDOS
========================================== */

studyButton.addEventListener(
    "click",
    () => {

        studyModal.classList.add(
            "show"
        );

        fecharSidebar();

    }
);


closeStudy.addEventListener(
    "click",
    fecharEstudos
);


studyModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target === studyModal
        ) {

            fecharEstudos();

        }

    }
);


function fecharEstudos() {

    studyModal.classList.remove(
        "show"
    );

}


/* ==========================================
   MATÉRIAS
========================================== */

document
    .querySelectorAll(".subjects button")
    .forEach(button => {

        button.addEventListener(
            "click",
            function() {

                const materia =
                    this.dataset.subject;


                fecharEstudos();


                messageInput.value =
                    `Quero estudar ${materia}.`;


                ajustarTextarea();


                enviarMensagem();

            }
        );

    });


/* ==========================================
   INÍCIO
========================================== */

messageInput.focus();