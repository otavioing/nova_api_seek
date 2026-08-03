const multer = require("multer");
const path = require("path");
const fs = require("fs");

const destino = path.join(
    __dirname,
    "../../uploads/posts"
);

if (!fs.existsSync(destino)) {
    fs.mkdirSync(destino, {
        recursive: true
    });
}

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, destino);
    },

    filename: (req, file, cb) => {

        const extensao = path.extname(
            file.originalname
        );

        cb(
            null,
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            extensao
        );
    }
});

const uploadPost = multer({

    storage,

    limits: {
        files: 11
    },

    fileFilter: (req, file, cb) => {

        const permitidos = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (permitidos.includes(file.mimetype)) {
            return cb(null, true);
        }

        cb(
            new Error(
                "Formato de imagem inválido."
            )
        );
    }
});

module.exports = uploadPost;
