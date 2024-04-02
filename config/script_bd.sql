CREATE DATABASE  IF NOT EXISTS `lista-tarefas`;
USE `lista-tarefas`;

DROP TABLE IF EXISTS `tarefas`;


CREATE TABLE `tarefas` (
  `id_tarefa` int NOT NULL AUTO_INCREMENT,
  `nome_tarefa` varchar(45) NOT NULL,
  `prazo_tarefa` date NOT NULL,
  `situacao_tarefa` int NOT NULL DEFAULT '1',
  `status_tarefa` int DEFAULT '1',
  PRIMARY KEY (`id_tarefa`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `tarefas` WRITE;
/*!40000 ALTER TABLE `tarefas` DISABLE KEYS */;
INSERT INTO `tarefas` VALUES (1,'Formatar PC do Cliente 1','2022-06-25',1,1),(2,'Instalar Antivirus no PC do Cliente 2','2022-06-20',1,1),(3,'Formatar PC do Cliente 2','2022-06-28',1,1),(4,'Instalar Antivirus no PC do Cliente 2','2022-06-22',1,1);
/*!40000 ALTER TABLE `tarefas` ENABLE KEYS */;
UNLOCK TABLES;
