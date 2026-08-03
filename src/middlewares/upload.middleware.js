const multer = require("multer");
const path = require("path");
const fs = require("fs");

const criarStorage = (pasta) => {

    const destino = path.join(
        __dirname,
        "../../uploads",
        pasta
    );

    if (!fs.existsSync(destino)) {
        fs.mkdirSync(destino, { recursive: true });
    }

    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, destino);
        },

        filename: (req, file, cb) => {

            const extensao = path.extname(file.originalname);

            const nomeArquivo =
                Date.now() +
                "-" +
                Math.round(Math.random() * 1e9) +
                extensao;

            cb(null, nomeArquivo);
        }
    });
};

const fileFilter = (req, file, cb) => {

    const tiposPermitidos = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (tiposPermitidos.includes(file.mimetype)) {
        return cb(null, true);
    }

    cb(new Error("Formato de imagem inválido."));
};

const uploadPerfil = multer({
    storage: criarStorage("perfil"),
    fileFilter
});

const uploadBanner = multer({
    storage: criarStorage("banner"),
    fileFilter
});

module.exports = {
    uploadPerfil,
    uploadBanner
};