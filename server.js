const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

const usuarioRoutes = require("./src/routes/usuarios.routes");
const postRoutes = require("./src/routes/post.routes");
const authRoutes = require("./src/routes/auth.routes");
const seguidoresRoutes = require("./src/routes/seguidores.routes");
const notificacoesRoutes = require("./src/routes/notificacoes.routes");
const preferenciasNotificacoes = require("./src/routes/preferenciasNotificacoes.routes");
const mensagemRoutes = require("./src/routes/mensagens.routes");

const errorHandler = require("./src/middlewares/errorHandler");

dotenv.config();

const app = express();

app.use(express.json());
app.use("/uploads",express.static(path.join(__dirname, "uploads")));

app.use("/usuarios", usuarioRoutes);
app.use("/posts", postRoutes);
app.use("/auth", authRoutes);
app.use("/seguidores", seguidoresRoutes);
app.use("/notificacoes", notificacoesRoutes);
app.use("/preferencias-notificacoes", preferenciasNotificacoes);
app.use("/mensagens", mensagemRoutes);

app.use(errorHandler);

app.listen(
    process.env.APP_PORT,
    () => {
        console.log(
            `Servidor rodando na porta ${process.env.APP_PORT}`
        );
    }
);

