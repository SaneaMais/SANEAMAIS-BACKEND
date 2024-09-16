-- MySQL Workbench Forward Engineering
 
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
 
-- -----------------------------------------------------
-- Schema bzudsbddxmqodnzmzk08
-- -----------------------------------------------------
 
-- -----------------------------------------------------
-- Schema bzudsbddxmqodnzmzk08
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `bzudsbddxmqodnzmzk08` DEFAULT CHARACTER SET utf8 ;
USE `bzudsbddxmqodnzmzk08` ;
 
-- -----------------------------------------------------
-- Table `bzudsbddxmqodnzmzk08`.`USUARIOS`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `bzudsbddxmqodnzmzk08`.`USUARIOS` ;
 
CREATE TABLE IF NOT EXISTS `bzudsbddxmqodnzmzk08`.`USUARIOS` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `nome_usuario` VARCHAR(45) NOT NULL,
  `data_nasc_usuario` DATE NOT NULL,
  `foto_usuario` VARCHAR(45) BINARY NULL,
  `cidade_usuario` VARCHAR(45) NOT NULL,
  `logradouro_usuario` VARCHAR(45) NULL,
  `bairro_usuario` VARCHAR(45) NULL,
  `uf_usuario` CHAR(30) NULL,
  `email_usuario` VARCHAR(150) NOT NULL,
  `senha_usuario` VARCHAR(512) NOT NULL,
  `user_usuario` VARCHAR(45) NOT NULL,
  `telefone_usuario` CHAR(11) NULL,
  
  PRIMARY KEY (`id_usuario`),
  UNIQUE INDEX `idUSUARIOS_UNIQUE` (`id_usuario` ASC) VISIBLE,
  UNIQUE INDEX `email_usuario_UNIQUE` (`email_usuario` ASC) VISIBLE,
  UNIQUE INDEX `senha_usuario_UNIQUE` (`senha_usuario` ASC) VISIBLE,
  UNIQUE INDEX `user_usuario_UNIQUE` (`user_usuario` ASC) VISIBLE,
  UNIQUE INDEX `telefone_usuario_UNIQUE` (`telefone_usuario` ASC) VISIBLE)
ENGINE = InnoDB;

INSERT INTO bzudsbddxmqodnzmzk08.USUARIOS(id_usuario, nome_usuario,cidade_usuario, data_nasc_usuario, email_usuario, senha_usuario, tipo_usuario_id, user_usuario) 
VALUES (1, 'adm',  'Barueri','2006-04-06','admin@adm.com', '$2a$12$J1piFIoOATeGAlIOPW0HSuo.pWb/tBJabaoyNNMkxwgrLAG70MYFK', 3, 'adm');

 
 
-- -----------------------------------------------------
-- Table `bzudsbddxmqodnzmzk08`.`POSTS`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `bzudsbddxmqodnzmzk08`.`POSTS` ;
 
CREATE TABLE IF NOT EXISTS `bzudsbddxmqodnzmzk08`.`POSTS` (
  `id_POSTS` INT NOT NULL AUTO_INCREMENT,
  `comentarios_posts` VARCHAR(200) NULL,
  `img_posts` BLOB NULL,
  `USUARIOS_id_usuario` INT NOT NULL,
  `titulo` VARCHAR(60) NULL,
  PRIMARY KEY (`id_POSTS`),
  UNIQUE INDEX `idPOSTS_UNIQUE` (`id_POSTS` ASC) VISIBLE,
  INDEX `fk_POSTS_USUARIOS1_idx` (`USUARIOS_id_usuario` ASC) VISIBLE)
ENGINE = InnoDB;
 
 
-- -----------------------------------------------------
-- Table `bzudsbddxmqodnzmzk08`.`INSTITUICOES`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `bzudsbddxmqodnzmzk08`.`INSTITUICOES` ;
 
CREATE TABLE IF NOT EXISTS `bzudsbddxmqodnzmzk08`.`INSTITUICOES` (
  `id_INSTITUICOES` INT UNSIGNED NOT NULL,
  `celular_instituicao` CHAR(20) NULL,
  `email_instituicao` VARCHAR(70) NULL,
  `cnpj_instituicao` VARCHAR(45) NULL,
  `razao_social_instituicao` INT NULL,
  `logo_instituicao` BLOB NULL,
  `cidade_instituicao` VARCHAR(45) NOT NULL,
  `logradouro_instituicao` VARCHAR(45) NULL,
  `bairro_instituicao` VARCHAR(45) NULL,
  `uf_instituicao` CHAR(30) NULL,
  PRIMARY KEY (`id_INSTITUICOES`))
ENGINE = InnoDB;
 
 
-- -----------------------------------------------------
-- Table `bzudsbddxmqodnzmzk08`.`COMENTARIOS`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `bzudsbddxmqodnzmzk08`.`COMENTARIOS` ;
 
CREATE TABLE IF NOT EXISTS `bzudsbddxmqodnzmzk08`.`COMENTARIOS` (
  `id_COMENTARIOS` INT NOT NULL,
  `comentarios_posts` VARCHAR(300) NULL,
  `comentarios_usuarios` VARCHAR(300) NULL,
  `comentarios_instituicoes` VARCHAR(300) NULL,
  `POSTS_id_POSTS` INT NOT NULL,
  `INSTITUICOES_id_INSTITUICOES` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id_COMENTARIOS`),
  UNIQUE INDEX `idCOMENTARIOS_UNIQUE` (`id_COMENTARIOS` ASC) VISIBLE,
  INDEX `fk_COMENTARIOS_POSTS1_idx` (`POSTS_id_POSTS` ASC) VISIBLE,
  INDEX `fk_COMENTARIOS_INSTITUICOES1_idx` (`INSTITUICOES_id_INSTITUICOES` ASC) VISIBLE)
ENGINE = InnoDB;
 
 
-- -----------------------------------------------------
-- Table `bzudsbddxmqodnzmzk08`.`DENUNCIA DE POSTAGENS`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `bzudsbddxmqodnzmzk08`.`DENUNCIA DE POSTAGENS` ;
 
CREATE TABLE IF NOT EXISTS `bzudsbddxmqodnzmzk08`.`DENUNCIA DE POSTAGENS` (
  `id_DENUNCIA_DE_POSTAGENS` INT NOT NULL,
  `data_denun` DATE NULL,
  `denuncia` VARCHAR(200) NULL,
  `USUARIOS_id_usuario` INT NOT NULL,
  `POSTS_id_POSTS` INT NOT NULL,
  PRIMARY KEY (`id_DENUNCIA_DE_POSTAGENS`, `POSTS_id_POSTS`),
  UNIQUE INDEX `idDENUNCIA DE POSTAGENS_UNIQUE` (`id_DENUNCIA_DE_POSTAGENS` ASC) VISIBLE,
  INDEX `fk_DENUNCIA DE POSTAGENS_USUARIOS1_idx` (`USUARIOS_id_usuario` ASC) VISIBLE,
  INDEX `fk_DENUNCIA DE POSTAGENS_POSTS1_idx` (`POSTS_id_POSTS` ASC) VISIBLE)
ENGINE = InnoDB;
 
 
-- -----------------------------------------------------
-- Table `bzudsbddxmqodnzmzk08`.`ADM`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `bzudsbddxmqodnzmzk08`.`ADM` ;
 
CREATE TABLE IF NOT EXISTS `bzudsbddxmqodnzmzk08`.`ADM` (
  `id_adm` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id_adm`))
ENGINE = InnoDB;
 
 
-- -----------------------------------------------------
-- Table `bzudsbddxmqodnzmzk08`.`respostas_inst`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `bzudsbddxmqodnzmzk08`.`respostas_inst` ;
 
CREATE TABLE IF NOT EXISTS `bzudsbddxmqodnzmzk08`.`respostas_inst` (
  `id_respostas` INT NOT NULL,
  `COMENTARIOS_id_COMENTARIOS` INT NOT NULL,
  `data` DATETIME NULL,
  `respostascol` VARCHAR(45) NULL,
  `INSTITUICOES_id_INSTITUICOES` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id_respostas`),
  INDEX `fk_respostas_COMENTARIOS1_idx` (`COMENTARIOS_id_COMENTARIOS` ASC) VISIBLE,
  INDEX `fk_respostas_inst_INSTITUICOES1_idx` (`INSTITUICOES_id_INSTITUICOES` ASC) VISIBLE)
ENGINE = InnoDB;
 
 
-- -----------------------------------------------------
-- Table `bzudsbddxmqodnzmzk08`.`respostas_usu`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `bzudsbddxmqodnzmzk08`.`respostas_usu` ;
 
CREATE TABLE IF NOT EXISTS `bzudsbddxmqodnzmzk08`.`respostas_usu` (
  `id_respostas` INT NOT NULL,
  `COMENTARIOS_id_COMENTARIOS` INT NOT NULL,
  `data` DATETIME NULL,
  `respostascol` VARCHAR(45) NULL,
  `USUARIOS_id_usuario` INT NOT NULL,
  PRIMARY KEY (`id_respostas`),
  INDEX `fk_respostas_COMENTARIOS1_idx` (`COMENTARIOS_id_COMENTARIOS` ASC) VISIBLE,
  INDEX `fk_respostas_usu_USUARIOS1_idx` (`USUARIOS_id_usuario` ASC) VISIBLE)
ENGINE = InnoDB;
 
 
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;