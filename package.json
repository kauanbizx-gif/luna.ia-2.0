/* =========================================
   MEMÓRIA DA LUNA
========================================= */

let memoria = [];


/* =========================================
   LIMITE
========================================= */

const LIMITE_MENSAGENS = 40;


/* =========================================
   ADICIONAR
========================================= */

function adicionarMensagem(
    role,
    content
) {

    memoria.push({

        role: role,

        content: content,

        timestamp:
            new Date().toISOString()

    });


    /* Mantém somente as últimas mensagens */

    if (
        memoria.length >
        LIMITE_MENSAGENS
    ) {

        memoria =
            memoria.slice(
                -LIMITE_MENSAGENS
            );

    }

}


/* =========================================
   OBTER
========================================= */

function obterHistorico() {

    return memoria.map(
        mensagem => ({

            role:
                mensagem.role,

            content:
                mensagem.content

        })
    );

}


/* =========================================
   LIMPAR
========================================= */

function limparMemoria() {

    memoria = [];

}


/* =========================================
   TAMANHO
========================================= */

function quantidadeMensagens() {

    return memoria.length;

}


/* =========================================
   EXPORTAR
========================================= */

module.exports = {

    adicionarMensagem,

    obterHistorico,

    limparMemoria,

    quantidadeMensagens

};