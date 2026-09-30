const http = require("http");
const fs = require("fs");
const path = require("path");

const {
    responderComIA
} = require("./ai");

const {
    adicionarMensagem,
    obterHistorico,
    limparMemoria
} = require("./memory");

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon"
};


/* =========================================
   RESPOSTA JSON
========================================= */

function enviarJSON(res, status, dados) {

    const corpo = JSON.stringify(dados);

    res.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS"
    });

    res.end(corpo);
}


/* =========================================
   LER BODY
========================================= */

function lerBody(req) {

    return new Promise((resolve, reject) => {

        let dados = "";

        req.on("data", parte => {

            dados += parte;

            if (dados.length > 1_000_000) {

                reject(
                    new Error("Mensagem muito grande.")
                );

                req.destroy();

            }

        });

        req.on("end", () => {

            try {

                resolve(
                    dados
                        ? JSON.parse(dados)
                        : {}
                );

            } catch {

                reject(
                    new Error("JSON inválido.")
                );

            }

        });

        req.on("error", reject);

    });

}


/* =========================================
   SERVIR ARQUIVOS
========================================= */

function servirArquivo(req, res) {

    let urlPath =
        decodeURIComponent(
            req.url.split("?")[0]
        );

    if (urlPath === "/") {

        urlPath = "/index.html";

    }

    const arquivo =
        path.join(
            __dirname,
            urlPath
        );

    const pastaBase =
        path.resolve(__dirname);

    const arquivoSeguro =
        path.resolve(arquivo);


    if (
        !arquivoSeguro.startsWith(
            pastaBase + path.sep
        )
    ) {

        res.writeHead(403);
        res.end("Acesso negado.");
        return;

    }


    fs.readFile(
        arquivoSeguro,
        (erro, conteudo) => {

            if (erro) {

                res.writeHead(404);
                res.end("Arquivo não encontrado.");
                return;

            }

            const extensao =
                path.extname(arquivoSeguro)
                    .toLowerCase();


            const tipo =
                MIME_TYPES[extensao] ||
                "application/octet-stream";


            res.writeHead(200, {
                "Content-Type": tipo
            });

            res.end(conteudo);

        }
    );

}


/* =========================================
   SERVIDOR
========================================= */

const server =
    http.createServer(
        async (req, res) => {

            /* CORS */

            res.setHeader(
                "Access-Control-Allow-Origin",
                "*"
            );

            if (req.method === "OPTIONS") {

                res.writeHead(204, {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS"
                });

                res.end();

                return;

            }


            /* ==============================
               CHAT
            ============================== */

            if (
                req.method === "POST" &&
                req.url === "/api/chat"
            ) {

                try {

                    const body =
                        await lerBody(req);


                    const mensagem =
                        typeof body.message === "string"
                            ? body.message.trim()
                            : "";


                    if (!mensagem) {

                        enviarJSON(
                            res,
                            400,
                            {
                                success: false,
                                error: "Mensagem vazia."
                            }
                        );

                        return;

                    }


                    /* Guarda mensagem */

                    adicionarMensagem(
                        "user",
                        mensagem
                    );


                    /* Histórico */

                    const historico =
                        obterHistorico();


                    /* IA */

                    const resposta =
                        await responderComIA(
                            historico
                        );


                    /* Guarda resposta */

                    adicionarMensagem(
                        "assistant",
                        resposta
                    );


                    enviarJSON(
                        res,
                        200,
                        {
                            success: true,
                            message: resposta
                        }
                    );

                } catch (erro) {

                    console.error(
                        "Erro no chat:",
                        erro
                    );


                    enviarJSON(
                        res,
                        500,
                        {
                            success: false,
                            error:
                                "A Luna não conseguiu responder agora."
                        }
                    );

                }

                return;

            }


            /* ==============================
               LIMPAR MEMÓRIA
            ============================== */

            if (
                req.method === "DELETE" &&
                req.url === "/api/memory"
            ) {

                limparMemoria();


                enviarJSON(
                    res,
                    200,
                    {
                        success: true
                    }
                );

                return;

            }


            /* ==============================
               STATUS
            ============================== */

            if (
                req.method === "GET" &&
                req.url === "/api/status"
            ) {

                enviarJSON(
                    res,
                    200,
                    {
                        success: true,
                        luna: "online"
                    }
                );

                return;

            }


            /* ==============================
               SITE
            ============================== */

            if (req.method === "GET") {

                servirArquivo(
                    req,
                    res
                );

                return;

            }


            res.writeHead(404);
            res.end("Não encontrado.");

        }
    );


server.listen(
    PORT,
    () => {

        console.log(
            `🌙 Luna rodando em http://localhost:${PORT}`
        );

    }
);