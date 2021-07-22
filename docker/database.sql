DROP DATABASE IF EXISTS testDatabase;

CREATE DATABASE testDatabase;

use testDatabase;

CREATE TABLE todos(
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `text` VARCHAR (255) NULL,
    `status` ENUM('active', 'complete', 'deleted') NOT NULL
);
