-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 26/08/2026 às 02:22
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `seek`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `categorias_posts`
--

CREATE TABLE `categorias_posts` (
  `id` int(10) UNSIGNED NOT NULL,
  `nome` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `categorias_posts`
--

INSERT INTO `categorias_posts` (`id`, `nome`) VALUES
(2, 'Desenho'),
(6, 'Design'),
(4, 'Ensaio Fotográfico'),
(7, 'erthj'),
(3, 'ferro'),
(1, 'Foto'),
(5, 'Pintura Digital');

-- --------------------------------------------------------

--
-- Estrutura para tabela `categorias_vagas`
--

CREATE TABLE `categorias_vagas` (
  `id` int(10) UNSIGNED NOT NULL,
  `nome` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `comentarios`
--

CREATE TABLE `comentarios` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `id_post` int(10) UNSIGNED NOT NULL,
  `comentario` text NOT NULL,
  `data_comentario` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `comentarios`
--

INSERT INTO `comentarios` (`id`, `id_usuario`, `id_post`, `comentario`, `data_comentario`) VALUES
(1, 1, 3, 'primeiro comentario', '2026-07-15 18:42:21'),
(2, 1, 3, 'primeiro comentario', '2026-08-15 19:46:15');

-- --------------------------------------------------------

--
-- Estrutura para tabela `conversas`
--

CREATE TABLE `conversas` (
  `id` int(10) UNSIGNED NOT NULL,
  `data_criacao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `conversas`
--

INSERT INTO `conversas` (`id`, `data_criacao`) VALUES
(1, '2026-08-03 20:27:07');

-- --------------------------------------------------------

--
-- Estrutura para tabela `conversa_participantes`
--

CREATE TABLE `conversa_participantes` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_conversa` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `conversa_participantes`
--

INSERT INTO `conversa_participantes` (`id`, `id_conversa`, `id_usuario`) VALUES
(2, 1, 1),
(1, 1, 3);

-- --------------------------------------------------------

--
-- Estrutura para tabela `denuncias`
--

CREATE TABLE `denuncias` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `tipo` enum('POST','COMENTARIO','USUARIO','VAGA','MENSAGEM') NOT NULL,
  `id_referencia` int(10) UNSIGNED NOT NULL,
  `motivo` varchar(255) NOT NULL,
  `descricao` text DEFAULT NULL,
  `status` enum('PENDENTE','EM_ANALISE','RESOLVIDA','REJEITADA') DEFAULT 'PENDENTE',
  `data_denuncia` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `historico_pesquisas`
--

CREATE TABLE `historico_pesquisas` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `termo_pesquisa` varchar(255) NOT NULL,
  `data_pesquisa` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `likes_posts`
--

CREATE TABLE `likes_posts` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `id_post` int(10) UNSIGNED NOT NULL,
  `data_curtida` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `mensagens`
--

CREATE TABLE `mensagens` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_conversa` int(10) UNSIGNED NOT NULL,
  `id_remetente` int(10) UNSIGNED NOT NULL,
  `mensagem` text NOT NULL,
  `data_envio` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `mensagens`
--

INSERT INTO `mensagens` (`id`, `id_conversa`, `id_remetente`, `mensagem`, `data_envio`) VALUES
(1, 1, 3, 'Primeira mensagem da nova api', '2026-08-03 20:33:22');

-- --------------------------------------------------------

--
-- Estrutura para tabela `notificacoes`
--

CREATE TABLE `notificacoes` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `tipo` enum('CURTIDA_POST','COMENTARIO_POST','RESPOSTA_COMENTARIO','MENSAGEM_PRIVADA','NOVO_SEGUIDOR') NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `mensagem` text NOT NULL,
  `lida` tinyint(1) DEFAULT 0,
  `data_criacao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `notificacoes`
--

INSERT INTO `notificacoes` (`id`, `id_usuario`, `tipo`, `titulo`, `mensagem`, `lida`, `data_criacao`) VALUES
(2, 2, 'NOVO_SEGUIDOR', 'Você tem um novo seguidor!', 'Um usuário começou a seguir você.', 1, '2026-07-20 18:30:24'),
(3, 3, 'NOVO_SEGUIDOR', 'Você tem um novo seguidor!', 'Um usuário começou a seguir você.', 0, '2026-08-15 19:55:16');

-- --------------------------------------------------------

--
-- Estrutura para tabela `perfis_empresa`
--

CREATE TABLE `perfis_empresa` (
  `id` int(10) UNSIGNED NOT NULL,
  `usuario_id` int(10) UNSIGNED NOT NULL,
  `razao_social` varchar(255) NOT NULL,
  `nome_fantasia` varchar(255) DEFAULT NULL,
  `telefone_comercial` varchar(20) DEFAULT NULL,
  `categoria_negocio` varchar(100) DEFAULT NULL,
  `numero_funcionarios` int(11) DEFAULT NULL,
  `endereco_completo` varchar(255) DEFAULT NULL,
  `descricao` text DEFAULT NULL,
  `site` varchar(255) DEFAULT NULL,
  `data_atualizacao` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `perfis_empresa`
--

INSERT INTO `perfis_empresa` (`id`, `usuario_id`, `razao_social`, `nome_fantasia`, `telefone_comercial`, `categoria_negocio`, `numero_funcionarios`, `endereco_completo`, `descricao`, `site`, `data_atualizacao`) VALUES
(1, 4, 'Empresa LTDA', 'Empresa', '11999999999', 'Tecnologia', 10, 'Rua A, 100', 'Descrição da empresa', 'https://empresa.com', '2026-08-22 14:10:20');

-- --------------------------------------------------------

--
-- Estrutura para tabela `perfis_pessoa_fisica`
--

CREATE TABLE `perfis_pessoa_fisica` (
  `id` int(10) UNSIGNED NOT NULL,
  `usuario_id` int(10) UNSIGNED NOT NULL,
  `nome_usuario` varchar(100) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `cidade` varchar(100) DEFAULT NULL,
  `estado` varchar(100) DEFAULT NULL,
  `sobre` text DEFAULT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `github` varchar(255) DEFAULT NULL,
  `curriculo` varchar(255) DEFAULT NULL,
  `data_atualizacao` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `perfis_pessoa_fisica`
--

INSERT INTO `perfis_pessoa_fisica` (`id`, `usuario_id`, `nome_usuario`, `telefone`, `cidade`, `estado`, `sobre`, `linkedin`, `github`, `curriculo`, `data_atualizacao`) VALUES
(1, 1, 'Nome público', '11999999999', 'São Paulo', 'SP', 'Sobre mim', 'https://linkedin.com/in/usuario', 'https://github.com/usuario', 'https://site.com/curriculo.pdf', '2026-08-22 14:07:16'),
(2, 7, 'Nome público', '11999999999', 'São Paulo', 'SP', 'Sobre mim', 'https://linkedin.com/in/usuario', 'https://github.com/usuario', 'https://site.com/curriculo.pdf', '2026-08-22 14:09:12');

-- --------------------------------------------------------

--
-- Estrutura para tabela `posts`
--

CREATE TABLE `posts` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descricao` text NOT NULL,
  `capa` varchar(255) DEFAULT NULL,
  `data_criacao` timestamp NOT NULL DEFAULT current_timestamp(),
  `data_atualizacao` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` enum('ATIVO','OCULTO','EXCLUIDO') NOT NULL DEFAULT 'ATIVO',
  `conteudo_18` tinyint(1) NOT NULL DEFAULT 0,
  `permissao_comentarios` enum('NINGUEM','SEGUIDORES','TODOS') NOT NULL DEFAULT 'TODOS'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `posts`
--

INSERT INTO `posts` (`id`, `id_usuario`, `titulo`, `descricao`, `capa`, `data_criacao`, `data_atualizacao`, `status`, `conteudo_18`, `permissao_comentarios`) VALUES
(1, 1, 'Titulo primeiro post da api nova ', 'Descrição primeiro post da api nova ', NULL, '2026-06-14 19:43:43', '2026-06-14 19:43:43', 'ATIVO', 0, 'TODOS'),
(2, 1, 'Titulo primeiro post da api nova ', 'Descrição primeiro post da api nova ', NULL, '2026-07-15 18:23:19', '2026-07-15 18:23:19', 'ATIVO', 0, 'TODOS'),
(3, 2, 'Titulo primeiro post da api nova ', 'Descrição primeiro post da api nova ', '/uploads/posts/1784139819816-589080689.jpg', '2026-07-15 18:23:39', '2026-08-19 13:47:15', 'ATIVO', 0, 'TODOS'),
(4, 1, 'Titulo primeiro post da api nova ', 'Descrição primeiro post da api nova ', '/uploads/posts/1787348649562-143968288.jpeg', '2026-08-21 21:44:09', '2026-08-21 21:44:09', 'ATIVO', 0, 'TODOS'),
(5, 1, 'Titulo primeiro post da api nova ', 'Descrição primeiro post da api nova ', '/uploads/posts/1787349002122-248895620.jpeg', '2026-08-21 21:50:02', '2026-08-21 21:50:02', 'OCULTO', 0, 'TODOS'),
(6, 1, 'Titulo primeiro post da api nova ', 'Descrição primeiro post da api nova ', '/uploads/posts/1787349504278-701911721.jpeg', '2026-08-21 21:58:24', '2026-08-21 21:58:24', 'OCULTO', 0, 'TODOS'),
(7, 1, 'Titulo primeiro post da api nova ', 'Descrição primeiro post da api nova ', '/uploads/posts/1787349548498-18203386.jpeg', '2026-08-21 21:59:08', '2026-08-21 21:59:08', 'OCULTO', 0, 'TODOS'),
(8, 1, 'Titulo primeiro post da api nova ', 'Descrição primeiro post da api nova ', '/uploads/posts/1787349763478-590028058.jpeg', '2026-08-21 22:02:43', '2026-08-21 22:02:43', 'OCULTO', 0, 'NINGUEM'),
(9, 1, 'teste de criação de post pelo front', 'teste de criação de post pelo front', '/uploads/posts/1787351353807-949754987.jpg', '2026-08-21 22:29:13', '2026-08-21 22:29:13', 'OCULTO', 0, 'SEGUIDORES'),
(10, 1, 'bnjk', 'jkl', '/uploads/posts/1787351442961-346056577.jpg', '2026-08-21 22:30:42', '2026-08-21 22:30:42', 'OCULTO', 0, 'SEGUIDORES'),
(11, 1, 'eq2eq', 'eqqe', '/uploads/posts/1787351626311-378631509.jpg', '2026-08-21 22:33:46', '2026-08-21 22:33:46', 'OCULTO', 0, 'SEGUIDORES'),
(12, 1, 'eq2eq', 'eqqe', '/uploads/posts/1787351662535-342303787.jpg', '2026-08-21 22:34:22', '2026-08-21 22:34:22', 'OCULTO', 0, 'SEGUIDORES'),
(13, 1, 'bn,', 'ghjk', '/uploads/posts/1787352166139-403933220.jpg', '2026-08-21 22:42:46', '2026-08-21 22:43:41', 'ATIVO', 0, 'SEGUIDORES');

-- --------------------------------------------------------

--
-- Estrutura para tabela `posts_categorias_rel`
--

CREATE TABLE `posts_categorias_rel` (
  `id_post` int(10) UNSIGNED NOT NULL,
  `id_categoria` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `posts_categorias_rel`
--

INSERT INTO `posts_categorias_rel` (`id_post`, `id_categoria`) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 2),
(3, 1),
(3, 2),
(4, 1),
(4, 2),
(5, 1),
(5, 2),
(6, 1),
(6, 2),
(7, 1),
(7, 2),
(8, 1),
(8, 2),
(9, 3),
(10, 4),
(11, 5),
(12, 5),
(13, 1),
(13, 4),
(13, 6),
(13, 7);

-- --------------------------------------------------------

--
-- Estrutura para tabela `posts_colaboradores_rel`
--

CREATE TABLE `posts_colaboradores_rel` (
  `id_post` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `posts_colaboradores_rel`
--

INSERT INTO `posts_colaboradores_rel` (`id_post`, `id_usuario`) VALUES
(8, 4),
(9, 4),
(12, 3);

-- --------------------------------------------------------

--
-- Estrutura para tabela `posts_imagens`
--

CREATE TABLE `posts_imagens` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_post` int(10) UNSIGNED NOT NULL,
  `caminho_imagem` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `posts_imagens`
--

INSERT INTO `posts_imagens` (`id`, `id_post`, `caminho_imagem`) VALUES
(1, 1, '/uploads/posts/1781466222947-613556619.png'),
(2, 1, '/uploads/posts/1781466222947-823026366.png'),
(3, 2, '/uploads/posts/1784139799620-953974127.png'),
(4, 2, '/uploads/posts/1784139799622-207816212.png'),
(5, 3, '/uploads/posts/1784139819816-346844268.png'),
(6, 3, '/uploads/posts/1784139819817-667745280.png'),
(7, 4, '/uploads/posts/1787348649555-560395489.jpeg'),
(8, 4, '/uploads/posts/1787348649568-486700039.jpeg'),
(9, 5, '/uploads/posts/1787349002119-992292816.jpeg'),
(10, 5, '/uploads/posts/1787349002124-827346810.jpeg'),
(11, 6, '/uploads/posts/1787349504275-131915629.jpeg'),
(12, 6, '/uploads/posts/1787349504280-931089459.jpeg'),
(13, 7, '/uploads/posts/1787349548496-984295088.jpeg'),
(14, 7, '/uploads/posts/1787349548501-688507713.jpeg'),
(15, 8, '/uploads/posts/1787349763471-549092295.jpeg'),
(16, 8, '/uploads/posts/1787349763482-61526785.jpeg'),
(17, 9, '/uploads/posts/1787351353806-993169166.jpg'),
(18, 10, '/uploads/posts/1787351442961-360784092.jpg'),
(19, 11, '/uploads/posts/1787351626311-461047464.jpg'),
(20, 12, '/uploads/posts/1787351662535-493740607.jpg'),
(21, 13, '/uploads/posts/1787352166138-252932001.jpg');

-- --------------------------------------------------------

--
-- Estrutura para tabela `posts_salvos`
--

CREATE TABLE `posts_salvos` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `id_post` int(10) UNSIGNED NOT NULL,
  `data_salvo` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `preferencias_notificacoes`
--

CREATE TABLE `preferencias_notificacoes` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `nome_configuracao` varchar(100) NOT NULL,
  `status` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `preferencias_notificacoes`
--

INSERT INTO `preferencias_notificacoes` (`id`, `id_usuario`, `nome_configuracao`, `status`) VALUES
(1, 2, 'email_like_post', 0),
(2, 2, 'email_login', 0),
(3, 3, 'email_login', 0),
(5, 4, 'email_comentarios', 0);

-- --------------------------------------------------------

--
-- Estrutura para tabela `preferencias_privacidade`
--

CREATE TABLE `preferencias_privacidade` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `nome_configuracao` varchar(100) NOT NULL,
  `status` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `respostas_comentarios`
--

CREATE TABLE `respostas_comentarios` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_comentario` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `resposta` text NOT NULL,
  `data_resposta` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `respostas_comentarios`
--

INSERT INTO `respostas_comentarios` (`id`, `id_comentario`, `id_usuario`, `resposta`, `data_resposta`) VALUES
(1, 1, 1, 'primeira resposta', '2026-07-15 18:44:01'),
(2, 1, 1, 'primeira resposta', '2026-08-15 19:46:43');

-- --------------------------------------------------------

--
-- Estrutura para tabela `seguidores`
--

CREATE TABLE `seguidores` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_seguidor` int(10) UNSIGNED NOT NULL,
  `id_seguido` int(10) UNSIGNED NOT NULL,
  `data_seguimento` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `seguidores`
--

INSERT INTO `seguidores` (`id`, `id_seguidor`, `id_seguido`, `data_seguimento`) VALUES
(9, 1, 3, '2026-08-15 19:55:16');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(10) UNSIGNED NOT NULL,
  `tipo_usuario` enum('PF','EMPRESA') NOT NULL,
  `nome` varchar(150) NOT NULL,
  `email` varchar(191) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `conta_verificada` tinyint(1) NOT NULL DEFAULT 0,
  `codigo_verificacao` varchar(6) DEFAULT NULL,
  `expiracao_codigo` timestamp NULL DEFAULT NULL,
  `banido` tinyint(1) NOT NULL DEFAULT 0,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `banner_perfil` varchar(255) DEFAULT NULL,
  `cnpj` varchar(14) DEFAULT NULL,
  `data_criacao` timestamp NOT NULL DEFAULT current_timestamp(),
  `cadastro_completo` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `tipo_usuario`, `nome`, `email`, `senha`, `conta_verificada`, `codigo_verificacao`, `expiracao_codigo`, `banido`, `foto_perfil`, `banner_perfil`, `cnpj`, `data_criacao`, `cadastro_completo`) VALUES
(1, 'PF', 'Otávio Domingues', 'otavio@gmail.com', '$2b$10$jwO5Au26ZAqA.7K9rdYQkew3wSSGCD4C/wc3OISBwjJtE8AcI9WOO', 1, NULL, NULL, 0, '/uploads/perfil/1787407017155-848918929.png', '/uploads/banner/1787407013724-978912022.png', NULL, '2026-06-13 19:13:04', 1),
(2, 'PF', 'Otávio Domingues 2', 'otavio2@gmail.com', '$2b$10$S.p7JiTlahu910fQWgjX0O1OZ8Zf8zDKsnDPy/vpDnC.PdYBnLQVe', 1, NULL, NULL, 0, NULL, NULL, NULL, '2026-07-20 17:56:51', 0),
(3, 'PF', 'Otávio Domingues 2', 'otaviodominguessilva@gmail.com', '$2b$10$.B4GFcIgqFJkt8YsHO/vweSO8qVMbow1ssjq5W1L6lH1kFon.kME6', 1, NULL, NULL, 0, NULL, NULL, NULL, '2026-07-30 21:18:50', 0),
(4, 'EMPRESA', 'Otávio Domingues 2', 'tectonicroom356@gmail.com', '$2b$10$jwO5Au26ZAqA.7K9rdYQkew3wSSGCD4C/wc3OISBwjJtE8AcI9WOO', 1, NULL, NULL, 0, NULL, NULL, '123456', '2026-08-15 13:19:37', 0),
(5, 'PF', 'teste criação front', 'fortnite909099@gmail.com', '$2b$10$5MHP3LlZNk3QLhmvhg7LOexQwrFjkX5jNHgDDZ/Lj1wYdg.EFyTHe', 1, NULL, NULL, 0, NULL, NULL, NULL, '2026-08-15 13:29:15', 0),
(6, 'PF', 'caca', 'gustavodomingues21406@gmail.com', '$2b$10$5m9wFoDTd20ON3l1fdLiluWbEpqMzwO72/SSpbkRonNkHoOoDlsm6', 1, NULL, NULL, 0, NULL, NULL, NULL, '2026-08-15 13:39:54', 0),
(7, 'PF', 'wdaesfdg', 'otaviodominguessilvagemas@gmail.com', '$2b$10$jwO5Au26ZAqA.7K9rdYQkew3wSSGCD4C/wc3OISBwjJtE8AcI9WOO', 1, NULL, NULL, 0, NULL, NULL, NULL, '2026-08-15 13:44:19', 0);

-- --------------------------------------------------------

--
-- Estrutura para tabela `vagas`
--

CREATE TABLE `vagas` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_empresa` int(10) UNSIGNED NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descricao` text NOT NULL,
  `link_linkedin` varchar(255) DEFAULT NULL,
  `data_criacao` timestamp NOT NULL DEFAULT current_timestamp(),
  `data_atualizacao` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` enum('ABERTA','FECHADA','PAUSADA') NOT NULL DEFAULT 'ABERTA'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Acionadores `vagas`
--
DELIMITER $$
CREATE TRIGGER `tg_vagas_valida_empresa` BEFORE INSERT ON `vagas` FOR EACH ROW BEGIN
    DECLARE v_tipo VARCHAR(10);
    
    SELECT tipo_usuario INTO v_tipo 
    FROM usuarios 
    WHERE id = NEW.id_empresa;
    
    IF v_tipo <> 'EMPRESA' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Operação negada: Apenas contas do tipo EMPRESA podem publicar vagas.';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `vagas_categorias_rel`
--

CREATE TABLE `vagas_categorias_rel` (
  `id_vaga` int(10) UNSIGNED NOT NULL,
  `id_categoria` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `vagas_favoritas`
--

CREATE TABLE `vagas_favoritas` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `id_vaga` int(10) UNSIGNED NOT NULL,
  `data_favorito` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `categorias_posts`
--
ALTER TABLE `categorias_posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_categorias_posts_nome` (`nome`);

--
-- Índices de tabela `categorias_vagas`
--
ALTER TABLE `categorias_vagas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_categorias_vagas_nome` (`nome`);

--
-- Índices de tabela `comentarios`
--
ALTER TABLE `comentarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_comentarios_usuarios` (`id_usuario`),
  ADD KEY `idx_comentarios_post` (`id_post`);

--
-- Índices de tabela `conversas`
--
ALTER TABLE `conversas`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `conversa_participantes`
--
ALTER TABLE `conversa_participantes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_conversa_usuario` (`id_conversa`,`id_usuario`),
  ADD KEY `idx_participantes_usuario` (`id_usuario`);

--
-- Índices de tabela `denuncias`
--
ALTER TABLE `denuncias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_denuncias_usuario` (`id_usuario`),
  ADD KEY `idx_denuncias_tipo` (`tipo`),
  ADD KEY `idx_denuncias_referencia` (`id_referencia`),
  ADD KEY `idx_denuncias_status` (`status`);

--
-- Índices de tabela `historico_pesquisas`
--
ALTER TABLE `historico_pesquisas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_historico_usuario` (`id_usuario`),
  ADD KEY `idx_historico_termo` (`termo_pesquisa`);

--
-- Índices de tabela `likes_posts`
--
ALTER TABLE `likes_posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_usuario_post_like` (`id_usuario`,`id_post`),
  ADD KEY `idx_likes_post` (`id_post`);

--
-- Índices de tabela `mensagens`
--
ALTER TABLE `mensagens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_mensagens_usuarios` (`id_remetente`),
  ADD KEY `idx_mensagens_conversa_tempo` (`id_conversa`,`data_envio`);

--
-- Índices de tabela `notificacoes`
--
ALTER TABLE `notificacoes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_notificacoes_usuario_lida` (`id_usuario`,`lida`);

--
-- Índices de tabela `perfis_empresa`
--
ALTER TABLE `perfis_empresa`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_perfis_empresa_usuario` (`usuario_id`);

--
-- Índices de tabela `perfis_pessoa_fisica`
--
ALTER TABLE `perfis_pessoa_fisica`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_perfis_pf_usuario` (`usuario_id`);

--
-- Índices de tabela `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_posts_usuario` (`id_usuario`),
  ADD KEY `idx_posts_data` (`data_criacao`);

--
-- Índices de tabela `posts_categorias_rel`
--
ALTER TABLE `posts_categorias_rel`
  ADD PRIMARY KEY (`id_post`,`id_categoria`),
  ADD KEY `fk_rel_categorias_posts` (`id_categoria`);

--
-- Índices de tabela `posts_colaboradores_rel`
--
ALTER TABLE `posts_colaboradores_rel`
  ADD PRIMARY KEY (`id_post`,`id_usuario`),
  ADD KEY `fk_posts_colaboradores_usuario` (`id_usuario`);

--
-- Índices de tabela `posts_imagens`
--
ALTER TABLE `posts_imagens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_imagens_post` (`id_post`);

--
-- Índices de tabela `posts_salvos`
--
ALTER TABLE `posts_salvos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_post_salvo` (`id_usuario`,`id_post`),
  ADD KEY `fk_posts_salvos_post` (`id_post`);

--
-- Índices de tabela `preferencias_notificacoes`
--
ALTER TABLE `preferencias_notificacoes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_usuario_config_notif` (`id_usuario`,`nome_configuracao`);

--
-- Índices de tabela `preferencias_privacidade`
--
ALTER TABLE `preferencias_privacidade`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_usuario_config_priv` (`id_usuario`,`nome_configuracao`);

--
-- Índices de tabela `respostas_comentarios`
--
ALTER TABLE `respostas_comentarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_respostas_usuarios` (`id_usuario`),
  ADD KEY `idx_respostas_comentario` (`id_comentario`);

--
-- Índices de tabela `seguidores`
--
ALTER TABLE `seguidores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_seguimento` (`id_seguidor`,`id_seguido`),
  ADD KEY `fk_seguido` (`id_seguido`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_usuarios_email` (`email`),
  ADD UNIQUE KEY `uq_usuarios_cnpj` (`cnpj`),
  ADD KEY `idx_usuarios_tipo` (`tipo_usuario`);

--
-- Índices de tabela `vagas`
--
ALTER TABLE `vagas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_vagas_empresa` (`id_empresa`);

--
-- Índices de tabela `vagas_categorias_rel`
--
ALTER TABLE `vagas_categorias_rel`
  ADD PRIMARY KEY (`id_vaga`,`id_categoria`),
  ADD KEY `fk_rel_categorias_vagas` (`id_categoria`);

--
-- Índices de tabela `vagas_favoritas`
--
ALTER TABLE `vagas_favoritas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_vaga_favorita` (`id_usuario`,`id_vaga`),
  ADD KEY `fk_vagas_favoritas_vaga` (`id_vaga`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `categorias_posts`
--
ALTER TABLE `categorias_posts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `categorias_vagas`
--
ALTER TABLE `categorias_vagas`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `comentarios`
--
ALTER TABLE `comentarios`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `conversas`
--
ALTER TABLE `conversas`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `conversa_participantes`
--
ALTER TABLE `conversa_participantes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `denuncias`
--
ALTER TABLE `denuncias`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `historico_pesquisas`
--
ALTER TABLE `historico_pesquisas`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `likes_posts`
--
ALTER TABLE `likes_posts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `mensagens`
--
ALTER TABLE `mensagens`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `notificacoes`
--
ALTER TABLE `notificacoes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `perfis_empresa`
--
ALTER TABLE `perfis_empresa`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `perfis_pessoa_fisica`
--
ALTER TABLE `perfis_pessoa_fisica`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de tabela `posts_imagens`
--
ALTER TABLE `posts_imagens`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de tabela `posts_salvos`
--
ALTER TABLE `posts_salvos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `preferencias_notificacoes`
--
ALTER TABLE `preferencias_notificacoes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `preferencias_privacidade`
--
ALTER TABLE `preferencias_privacidade`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `respostas_comentarios`
--
ALTER TABLE `respostas_comentarios`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `seguidores`
--
ALTER TABLE `seguidores`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `vagas`
--
ALTER TABLE `vagas`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `vagas_favoritas`
--
ALTER TABLE `vagas_favoritas`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `comentarios`
--
ALTER TABLE `comentarios`
  ADD CONSTRAINT `fk_comentarios_posts` FOREIGN KEY (`id_post`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_comentarios_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `conversa_participantes`
--
ALTER TABLE `conversa_participantes`
  ADD CONSTRAINT `fk_part_conversas` FOREIGN KEY (`id_conversa`) REFERENCES `conversas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_part_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `denuncias`
--
ALTER TABLE `denuncias`
  ADD CONSTRAINT `fk_denuncias_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `historico_pesquisas`
--
ALTER TABLE `historico_pesquisas`
  ADD CONSTRAINT `fk_historico_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `likes_posts`
--
ALTER TABLE `likes_posts`
  ADD CONSTRAINT `fk_likes_posts` FOREIGN KEY (`id_post`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_likes_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `mensagens`
--
ALTER TABLE `mensagens`
  ADD CONSTRAINT `fk_mensagens_conversas` FOREIGN KEY (`id_conversa`) REFERENCES `conversas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_mensagens_usuarios` FOREIGN KEY (`id_remetente`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `notificacoes`
--
ALTER TABLE `notificacoes`
  ADD CONSTRAINT `fk_notificacoes_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `perfis_empresa`
--
ALTER TABLE `perfis_empresa`
  ADD CONSTRAINT `fk_perfis_empresa_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `perfis_pessoa_fisica`
--
ALTER TABLE `perfis_pessoa_fisica`
  ADD CONSTRAINT `fk_perfis_pf_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `fk_posts_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `posts_categorias_rel`
--
ALTER TABLE `posts_categorias_rel`
  ADD CONSTRAINT `fk_rel_categorias_posts` FOREIGN KEY (`id_categoria`) REFERENCES `categorias_posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_rel_posts` FOREIGN KEY (`id_post`) REFERENCES `posts` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `posts_colaboradores_rel`
--
ALTER TABLE `posts_colaboradores_rel`
  ADD CONSTRAINT `fk_posts_colaboradores_post` FOREIGN KEY (`id_post`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_posts_colaboradores_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `posts_imagens`
--
ALTER TABLE `posts_imagens`
  ADD CONSTRAINT `fk_imagens_posts` FOREIGN KEY (`id_post`) REFERENCES `posts` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `posts_salvos`
--
ALTER TABLE `posts_salvos`
  ADD CONSTRAINT `fk_posts_salvos_post` FOREIGN KEY (`id_post`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_posts_salvos_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `preferencias_notificacoes`
--
ALTER TABLE `preferencias_notificacoes`
  ADD CONSTRAINT `fk_pref_notif_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `preferencias_privacidade`
--
ALTER TABLE `preferencias_privacidade`
  ADD CONSTRAINT `fk_pref_priv_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `respostas_comentarios`
--
ALTER TABLE `respostas_comentarios`
  ADD CONSTRAINT `fk_respostas_comentário` FOREIGN KEY (`id_comentario`) REFERENCES `comentarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_respostas_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `seguidores`
--
ALTER TABLE `seguidores`
  ADD CONSTRAINT `fk_seguido` FOREIGN KEY (`id_seguido`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_seguidor` FOREIGN KEY (`id_seguidor`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `vagas`
--
ALTER TABLE `vagas`
  ADD CONSTRAINT `fk_vagas_usuarios` FOREIGN KEY (`id_empresa`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `vagas_categorias_rel`
--
ALTER TABLE `vagas_categorias_rel`
  ADD CONSTRAINT `fk_rel_categorias_vagas` FOREIGN KEY (`id_categoria`) REFERENCES `categorias_vagas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_rel_vagas` FOREIGN KEY (`id_vaga`) REFERENCES `vagas` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `vagas_favoritas`
--
ALTER TABLE `vagas_favoritas`
  ADD CONSTRAINT `fk_vagas_favoritas_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_vagas_favoritas_vaga` FOREIGN KEY (`id_vaga`) REFERENCES `vagas` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
