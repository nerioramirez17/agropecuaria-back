CREATE DATABASE `Agropecuaria`; 
CREATE TABLE `Agropecuaria`.`usuario`(
    id INT NOT NULL,
    nombre_usuario VARCHAR(255),
    nombre VARCHAR(255),
    apellido VARCHAR(255),
    contrasenia VARCHAR(255),
    email VARCHAR(255),
PRIMARY KEY (`id`));