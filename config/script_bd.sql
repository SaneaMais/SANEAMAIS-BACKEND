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
-- Table `bzudsbddxmqodnzmzk08`.`tipo_usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bzudsbddxmqodnzmzk08`.`tipo_usuario` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `tipo_usuario` VARCHAR(45) NOT NULL,
  `descricao_usuario` VARCHAR(255) NOT NULL,
  `status_usuario` INT NOT NULL,
  PRIMARY KEY (`id_usuario`))
ENGINE = InnoDB
AUTO_INCREMENT = 9
DEFAULT CHARACTER SET = utf8;
 
 
-- -----------------------------------------------------
-- Table `bzudsbddxmqodnzmzk08`.`USUARIOS`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bzudsbddxmqodnzmzk08`.`USUARIOS` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `nome_usuario` VARCHAR(45) NULL DEFAULT NULL,
  `data_nasc_usuario` DATE NULL DEFAULT NULL,
  `foto_usuario` LONGBLOB NULL DEFAULT NULL,
  `cidade_usuario` VARCHAR(45) NOT NULL,
  `uf_usuario` CHAR(30) NULL DEFAULT NULL,
  `email_usuario` VARCHAR(150) NOT NULL,
  `senha_usuario` VARCHAR(512) NOT NULL,
  `user_usuario` VARCHAR(45) NULL DEFAULT NULL,
  `telefone_usuario` CHAR(11) NULL DEFAULT NULL,
  `tipo_usuario_id` INT NULL DEFAULT NULL,
  `bio` VARCHAR(255) NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE INDEX `idUSUARIOS_UNIQUE` (`id_usuario` ASC) VISIBLE,
  UNIQUE INDEX `email_usuario_UNIQUE` (`email_usuario` ASC) VISIBLE,
  UNIQUE INDEX `user_usuario_UNIQUE` (`user_usuario` ASC) VISIBLE,
  UNIQUE INDEX `telefone_usuario_UNIQUE` (`telefone_usuario` ASC) VISIBLE,
  INDEX `fk_tipo_usuario` (`tipo_usuario_id` ASC) VISIBLE,
  CONSTRAINT `fk_tipo_usuario`
    FOREIGN KEY (`tipo_usuario_id`)
    REFERENCES `bzudsbddxmqodnzmzk08`.`tipo_usuario` (`id_usuario`))
ENGINE = InnoDB
AUTO_INCREMENT = 12
DEFAULT CHARACTER SET = utf8;
 
 
-- -----------------------------------------------------
-- Table `bzudsbddxmqodnzmzk08`.`POSTS`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bzudsbddxmqodnzmzk08`.`POSTS` (
  `id_POSTS` INT NOT NULL AUTO_INCREMENT,
  `comentarios_posts` VARCHAR(255) NULL DEFAULT NULL,
  `img_posts` LONGBLOB NULL DEFAULT NULL,
  `USUARIOS_id_usuario1` INT NOT NULL,
  `endereco_posts` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id_POSTS`),
  UNIQUE INDEX `idPOSTS_UNIQUE` (`id_POSTS` ASC) VISIBLE,
  INDEX `fk_POSTS_USUARIOS1_idx1` (`USUARIOS_id_usuario1` ASC) VISIBLE,
  CONSTRAINT `fk_POSTS_USUARIOS1`
    FOREIGN KEY (`USUARIOS_id_usuario1`)
    REFERENCES `bzudsbddxmqodnzmzk08`.`USUARIOS` (`id_usuario`))
ENGINE = InnoDB
AUTO_INCREMENT = 17
DEFAULT CHARACTER SET = utf8;
 
 
-- -----------------------------------------------------
-- Table `bzudsbddxmqodnzmzk08`.`COMENTARIOS`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bzudsbddxmqodnzmzk08`.`COMENTARIOS` (
  `id_COMENTARIOS` INT NOT NULL AUTO_INCREMENT,
  `COMENTARIO` VARCHAR(255) NOT NULL,
  `USUARIOS_id_usuario` INT NOT NULL,
  `POSTS_id_POSTS` INT NOT NULL,
  `data` DATETIME NULL,
  PRIMARY KEY (`id_COMENTARIOS`),
  UNIQUE INDEX `id_POSTS_UNIQUE` (`COMENTARIO` ASC) VISIBLE,
  INDEX `fk_COMENTARIOS_USUARIOS1_idx` (`USUARIOS_id_usuario` ASC) VISIBLE,
  INDEX `fk_COMENTARIOS_POSTS1_idx` (`POSTS_id_POSTS` ASC) VISIBLE,
  CONSTRAINT `fk_COMENTARIOS_USUARIOS1`
    FOREIGN KEY (`USUARIOS_id_usuario`)
    REFERENCES `bzudsbddxmqodnzmzk08`.`USUARIOS` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_COMENTARIOS_POSTS1`
    FOREIGN KEY (`POSTS_id_POSTS`)
    REFERENCES `bzudsbddxmqodnzmzk08`.`POSTS` (`id_POSTS`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;
 
 
-- -----------------------------------------------------
-- Table `bzudsbddxmqodnzmzk08`.`DENUNCIA DE POSTAGENS`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bzudsbddxmqodnzmzk08`.`DENUNCIA DE POSTAGENS` (
  `id_DENUNCIA` INT NOT NULL,
  `data_denun` DATE NULL DEFAULT NULL,
  `denuncia` VARCHAR(200) NULL DEFAULT NULL,
  `POSTS_id_POSTS` INT NOT NULL,
  `USUARIOS_id_usuario` INT NOT NULL,
  PRIMARY KEY (`id_DENUNCIA`),
  UNIQUE INDEX `idDENUNCIA DE POSTAGENS_UNIQUE` (`id_DENUNCIA` ASC) VISIBLE,
  INDEX `fk_DENUNCIA DE POSTAGENS_POSTS1_idx1` (`POSTS_id_POSTS` ASC) VISIBLE,
  INDEX `fk_DENUNCIA DE POSTAGENS_USUARIOS1_idx1` (`USUARIOS_id_usuario` ASC) VISIBLE,
  CONSTRAINT `fk_DENUNCIA DE POSTAGENS_POSTS1`
    FOREIGN KEY (`POSTS_id_POSTS`)
    REFERENCES `bzudsbddxmqodnzmzk08`.`POSTS` (`id_POSTS`),
  CONSTRAINT `fk_DENUNCIA DE POSTAGENS_USUARIOS1`
    FOREIGN KEY (`USUARIOS_id_usuario`)
    REFERENCES `bzudsbddxmqodnzmzk08`.`USUARIOS` (`id_usuario`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;
 
 
-- -----------------------------------------------------
-- Table `bzudsbddxmqodnzmzk08`.`INSTITUICOES`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bzudsbddxmqodnzmzk08`.`INSTITUICOES` (
  `id_INSTITUICOES` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `cnpj_instituicao` VARCHAR(45) NULL DEFAULT NULL,
  `razao_social_instituicao` VARCHAR(255) NULL DEFAULT NULL,
  `logo_instituicao` BLOB NULL DEFAULT NULL,
  `USUARIOS_id_usuario` INT NOT NULL,
  PRIMARY KEY (`id_INSTITUICOES`),
  INDEX `fk_INSTITUICOES_USUARIOS1_idx` (`USUARIOS_id_usuario` ASC) VISIBLE,
  CONSTRAINT `fk_INSTITUICOES_USUARIOS1`
    FOREIGN KEY (`USUARIOS_id_usuario`)
    REFERENCES `bzudsbddxmqodnzmzk08`.`USUARIOS` (`id_usuario`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8;
 
 
-- -----------------------------------------------------
-- Table `bzudsbddxmqodnzmzk08`.`respostas_usu`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bzudsbddxmqodnzmzk08`.`respostas_usu` (
  `id_respostas` INT NOT NULL,
  `resposta` VARCHAR(255) NOT NULL,
  `data` DATETIME NULL DEFAULT NULL,
  `USUARIOS_id_usuario` INT NOT NULL,
  `POSTS_id_POSTS` INT NOT NULL,
  PRIMARY KEY (`id_respostas`),
  INDEX `fk_respostas_COMENTARIOS1_idx` (`resposta` ASC) VISIBLE,
  INDEX `fk_respostas_usu_USUARIOS1_idx1` (`USUARIOS_id_usuario` ASC) VISIBLE,
  INDEX `fk_respostas_usu_POSTS1_idx` (`POSTS_id_POSTS` ASC) VISIBLE,
  CONSTRAINT `fk_respostas_usu_POSTS1`
    FOREIGN KEY (`POSTS_id_POSTS`)
    REFERENCES `bzudsbddxmqodnzmzk08`.`POSTS` (`id_POSTS`),
  CONSTRAINT `fk_respostas_usu_USUARIOS1`
    FOREIGN KEY (`USUARIOS_id_usuario`)
    REFERENCES `bzudsbddxmqodnzmzk08`.`USUARIOS` (`id_usuario`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;
 
 
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;