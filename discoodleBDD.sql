-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : Dim 16 mai 2021 à 15:35
-- Version du serveur :  5.7.31
-- Version de PHP : 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `discoodle`
--

-- --------------------------------------------------------

--
-- Structure de la table `articles`
--

DROP TABLE IF EXISTS `articles`;
CREATE TABLE IF NOT EXISTS `articles` (
  `nom` varchar(600) NOT NULL,
  `contenu` varchar(6000) NOT NULL,
  `auteur` varchar(200) NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `idarticle` int(11) NOT NULL AUTO_INCREMENT,
  `type` int(1) NOT NULL,
  PRIMARY KEY (`idarticle`)
) ENGINE=MyISAM AUTO_INCREMENT=41 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `articles`
--

INSERT INTO `articles` (`nom`, `contenu`, `auteur`, `date`, `idarticle`, `type`) VALUES
('Voyage de ski', 'La billetterie pour le voyage de ski va bientôt ouvrir  ', 'student', '2021-05-16 17:28:03', 39, 0),
('La cantine a du nouveau', 'Les repas sont maintenant à 1 euro!!!!', 'student', '2021-05-16 17:28:39', 40, 1);

-- --------------------------------------------------------

--
-- Structure de la table `classes`
--

DROP TABLE IF EXISTS `classes`;
CREATE TABLE IF NOT EXISTS `classes` (
  `id_classe` int(11) NOT NULL AUTO_INCREMENT,
  `libelle_classe` varchar(255) NOT NULL,
  `id_user` int(11) NOT NULL,
  PRIMARY KEY (`id_classe`),
  KEY `fk_classes_users` (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `classes`
--

INSERT INTO `classes` (`id_classe`, `libelle_classe`, `id_user`) VALUES
(1, 'L1 info', 2),
(2, 'L2 info', 2);

-- --------------------------------------------------------

--
-- Structure de la table `cours`
--

DROP TABLE IF EXISTS `cours`;
CREATE TABLE IF NOT EXISTS `cours` (
  `id_cours` int(11) NOT NULL AUTO_INCREMENT,
  `libelle_cours` varchar(255) NOT NULL,
  `id_classe` int(11) NOT NULL,
  PRIMARY KEY (`id_cours`),
  KEY `fk_cours_classes` (`id_classe`),
  KEY `libelle_cours` (`libelle_cours`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `cours`
--

INSERT INTO `cours` (`id_cours`, `libelle_cours`, `id_classe`) VALUES
(1, 'Mathematique', 1),
(2, 'Programmation ', 1),
(3, 'Programmation orienté objet', 2),
(4, 'Outil logique', 2);

-- --------------------------------------------------------

--
-- Structure de la table `img`
--

DROP TABLE IF EXISTS `img`;
CREATE TABLE IF NOT EXISTS `img` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `message` varchar(2000) NOT NULL,
  `userid` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `type` int(11) NOT NULL COMMENT '0 message, 1 image, 2 fichier',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `message_log`
--

DROP TABLE IF EXISTS `message_log`;
CREATE TABLE IF NOT EXISTS `message_log` (
  `username` varchar(50) NOT NULL,
  `message` varchar(10000) NOT NULL,
  `id` varchar(255) NOT NULL DEFAULT 'edqdqwdwq',
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `channel` varchar(5000) NOT NULL DEFAULT '0',
  `user_id` varchar(256) NOT NULL DEFAULT '1',
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `message_log`
--

INSERT INTO `message_log` (`username`, `message`, `id`, `date`, `channel`, `user_id`) VALUES
('teacher', 'Bonjour !!', 'XCoMtRjD6t6jZd35AABr', '2021-05-16 15:13:26', 'chatMathematique0', '2'),
('teacher', '<h1>Introduction au mathématique : ', 'XCoMtRjD6t6jZd35AABr', '2021-05-16 15:13:55', 'Introduction0', '2'),
('teacher', '<h3>Programme de l\'année:</h3> ', 'XCoMtRjD6t6jZd35AABr', '2021-05-16 15:14:36', 'Introduction0', '2'),
('student2', 'Salut ', 'YOcdDMqU3rBNb72IAABB', '2021-05-16 15:21:31', 'chatMathematique0', '12'),
('student', 'Bonjour monsieur', 'nolJ6dWTenbq1IQbAABN', '2021-05-16 15:22:41', 'chatMathematique0', '1'),
('teacher', 'Continuité sur un intervalle, théorème des valeurs intermédiaires Calculs de dérivées Fonctions sinus et cosinus Fonction exponentielle Fonction logarithme népérien Intégration', 'otqogQDj8P6_HLTAAABZ', '2021-05-16 15:24:08', 'Introduction0', '2'),
('teacher', '<h1>Géométrie L1', 'otqogQDj8P6_HLTAAABZ', '2021-05-16 15:24:55', 'Géométrie 0', '2'),
('student2', 'Bonjour monsieur ', 'i-BV8b0U68UdJowmAABX', '2021-05-16 15:31:22', 'chatProgrammation 0', '12'),
('student2', 'je suis la pour le cours ', 'i-BV8b0U68UdJowmAABX', '2021-05-16 15:31:29', 'chatProgrammation 0', '12'),
('teacher', '<h1>Premier cours de java', 'rFYm0z_6ywCuKIMeAABx', '2021-05-16 15:33:04', 'IP1-java0', '2');

-- --------------------------------------------------------

--
-- Structure de la table `modules`
--

DROP TABLE IF EXISTS `modules`;
CREATE TABLE IF NOT EXISTS `modules` (
  `id_module` int(11) NOT NULL AUTO_INCREMENT,
  `libelle_module` varchar(255) NOT NULL,
  `id_cours` int(11) NOT NULL,
  PRIMARY KEY (`id_module`),
  KEY `fk_modules_cours` (`id_cours`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `modules`
--

INSERT INTO `modules` (`id_module`, `libelle_module`, `id_cours`) VALUES
(1, 'Introduction', 1),
(2, 'Géométrie ', 1),
(16, 'Introduction', 3),
(17, 'Java', 3),
(18, 'C++', 3),
(19, 'IP1-java', 2);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id_user` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `usertype` int(11) NOT NULL DEFAULT '0',
  `class` int(11) NOT NULL,
  `profile_picture` varchar(256) NOT NULL DEFAULT './img/3461541.png',
  PRIMARY KEY (`id_user`),
  KEY `profile_picture` (`profile_picture`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id_user`, `username`, `password`, `email`, `usertype`, `class`, `profile_picture`) VALUES
(1, 'student', '$2b$10$17Pqk.MNgl9GFKYYxFKUT.CabGy91RlBWPLufQAI3F6ODKuwIFNGS', 'student@student.com', 0, 1, './img/3461541.png'),
(2, 'teacher', '$2b$10$4vw3EeCthGRF1wqXnG2iXO8fBhsyqIHamKd2qTsGiGbRFk6X3F5NO', 'teacher@teacher.com', 1, 0, './img/3461541.png'),
(11, 'admin', '$2b$10$GkDau2A4nrxAhjaPvM62p.NoQ68Z62n8fX7zss1gIMdospq1piIWq', 'admin@admin.com', 2, 0, './img/3461541.png'),
(12, 'student2', '$2b$10$3UcU./PUjAoCU0FC7CutKuigleNngvBTdb2b5bwNPqPhg1tmCiKya', 'student2@student.com', 0, 1, './img/1412506.jpg');

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `classes`
--
ALTER TABLE `classes`
  ADD CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`);

--
-- Contraintes pour la table `cours`
--
ALTER TABLE `cours`
  ADD CONSTRAINT `cours_ibfk_1` FOREIGN KEY (`id_classe`) REFERENCES `classes` (`id_classe`);

--
-- Contraintes pour la table `modules`
--
ALTER TABLE `modules`
  ADD CONSTRAINT `modules_ibfk_1` FOREIGN KEY (`id_cours`) REFERENCES `cours` (`id_cours`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
