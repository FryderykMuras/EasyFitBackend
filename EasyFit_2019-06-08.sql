# ************************************************************
# Sequel Pro SQL dump
# Version 5438
#
# https://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 8.0.16)
# Database: EasyFit
# Generation Time: 2019-06-08 13:18:32 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table ComplexMeals
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ComplexMeals`;

CREATE TABLE `ComplexMeals` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `ComplexMeals` WRITE;
/*!40000 ALTER TABLE `ComplexMeals` DISABLE KEYS */;

INSERT INTO `ComplexMeals` (`ID`, `NAME`)
VALUES
	(1,'Kanapka z masłem orzechowym i dżemem'),
	(4,'aaa'),
	(5,'undefined'),
	(6,'aaadf'),
	(7,'test111'),
	(8,'test111');

/*!40000 ALTER TABLE `ComplexMeals` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table ComplexMealsIngredients
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ComplexMealsIngredients`;

CREATE TABLE `ComplexMealsIngredients` (
  `COMPLEXMEAL_ID` bigint(20) NOT NULL,
  `SIMPLEPRODUCT_ID` bigint(20) NOT NULL,
  `QUANTITY` double NOT NULL,
  PRIMARY KEY (`COMPLEXMEAL_ID`,`SIMPLEPRODUCT_ID`),
  KEY `ComplexMealsIngredients_fk1` (`SIMPLEPRODUCT_ID`),
  CONSTRAINT `ComplexMealsIngredients_fk0` FOREIGN KEY (`COMPLEXMEAL_ID`) REFERENCES `complexmeals` (`ID`),
  CONSTRAINT `ComplexMealsIngredients_fk1` FOREIGN KEY (`SIMPLEPRODUCT_ID`) REFERENCES `simpleproducts` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `ComplexMealsIngredients` WRITE;
/*!40000 ALTER TABLE `ComplexMealsIngredients` DISABLE KEYS */;

INSERT INTO `ComplexMealsIngredients` (`COMPLEXMEAL_ID`, `SIMPLEPRODUCT_ID`, `QUANTITY`)
VALUES
	(1,1,80),
	(1,2,30),
	(1,3,30),
	(4,1,20),
	(4,3,50),
	(6,1,35),
	(6,3,555);

/*!40000 ALTER TABLE `ComplexMealsIngredients` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table EatenMeals
# ------------------------------------------------------------

DROP TABLE IF EXISTS `EatenMeals`;

CREATE TABLE `EatenMeals` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `SIMPLEPRODUCT_ID` bigint(20) NOT NULL,
  `QUANTITY` double NOT NULL,
  `DATE` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `USER_ID` bigint(20) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `EatenMeals_fk0` (`SIMPLEPRODUCT_ID`),
  KEY `EatenMeals_fk1` (`USER_ID`),
  CONSTRAINT `EatenMeals_fk0` FOREIGN KEY (`SIMPLEPRODUCT_ID`) REFERENCES `simpleproducts` (`ID`),
  CONSTRAINT `EatenMeals_fk1` FOREIGN KEY (`USER_ID`) REFERENCES `users` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `EatenMeals` WRITE;
/*!40000 ALTER TABLE `EatenMeals` DISABLE KEYS */;

INSERT INTO `EatenMeals` (`ID`, `SIMPLEPRODUCT_ID`, `QUANTITY`, `DATE`, `USER_ID`)
VALUES
	(1,1,80,'2019-06-03 20:07:44',1),
	(2,2,30,'2019-06-03 20:07:44',1),
	(3,3,20,'2019-06-03 20:07:44',1),
	(4,1,25,'2019-06-03 22:27:17',1),
	(5,1,22,'2019-06-08 13:25:01',1),
	(6,1,22,'2019-06-08 13:25:43',1),
	(7,2,22,'2019-06-08 13:46:22',2),
	(8,4,287,'2019-06-08 13:46:32',2),
	(9,2,223,'2019-06-08 15:16:43',8);

/*!40000 ALTER TABLE `EatenMeals` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table SimpleProducts
# ------------------------------------------------------------

DROP TABLE IF EXISTS `SimpleProducts`;

CREATE TABLE `SimpleProducts` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(255) NOT NULL,
  `KCAL` double NOT NULL,
  `PROTEINS` double NOT NULL,
  `FATS` double NOT NULL,
  `CARBOHYDRATES` double NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `SimpleProducts` WRITE;
/*!40000 ALTER TABLE `SimpleProducts` DISABLE KEYS */;

INSERT INTO `SimpleProducts` (`ID`, `NAME`, `KCAL`, `PROTEINS`, `FATS`, `CARBOHYDRATES`)
VALUES
	(1,'Chleb Tostowy',306,8.9,4.7,56.7),
	(2,'Dżem Porzeczkowy',130,0.9,0.2,28.3),
	(3,'Masło Orzechowe',695,13,67,10),
	(4,'rhdh',6,6,9,6),
	(5,'aaass',66,9,9,9),
	(6,'test111',200,50,12,44);

/*!40000 ALTER TABLE `SimpleProducts` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table Users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Users`;

CREATE TABLE `Users` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `EMAIL` varchar(255) NOT NULL,
  `PASSWORDHASH` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;

INSERT INTO `Users` (`ID`, `EMAIL`, `PASSWORDHASH`)
VALUES
	(1,'ea@example.com','hash'),
	(2,'ea1@example.com','password'),
	(3,'ea2@example.com','hash'),
	(5,'ea3@example.com','hash'),
	(6,'ea4@example.com','hash'),
	(7,'ea5@example.com','hash'),
	(8,'ea10@example.com','11');

/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
