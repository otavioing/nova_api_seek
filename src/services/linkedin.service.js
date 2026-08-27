const AppError = require("../utils/AppError");

const ehLinkedIn = url => {
    const hostname = new URL(url).hostname.toLowerCase();
    return hostname === "linkedin.com" || hostname.endsWith(".linkedin.com");
};

const obterMetadados = async (url) => {

    let urlValida;

    try {
        urlValida = new URL(url);
    } catch (error) {
        throw new AppError("Informe um link válido do LinkedIn.", 422);
    }

    if (!ehLinkedIn(urlValida)) {
        throw new AppError("O link da vaga deve pertencer ao LinkedIn.", 422);
    }

    try {
        const resposta = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0"
            },
            signal: AbortSignal.timeout(8000)
        });

        if (!resposta.ok) {
            throw new AppError(
                "O link da vaga não está disponível no momento.",
                422
            );
        }

        const html = await resposta.text();
        const extrair = (regex) => {
            const resultado = html.match(regex);
            return resultado ? resultado[1].trim() : null;
        };

        return {
            titulo: extrair(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i) ||
                extrair(/<title[^>]*>([^<]*)<\/title>/i),
            descricao: extrair(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i) ||
                extrair(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)
        };
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError(
            "Não foi possível verificar a disponibilidade do link da vaga.",
            422
        );
    }
};

module.exports = {
    obterMetadados
};
