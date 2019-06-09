# ************************************************************
# Sequel Pro SQL dump
# Version 5438
#
# https://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 8.0.16)
# Database: EasyFit
# Generation Time: 2019-06-09 22:32:15 +0000
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



# Dump of table Goals
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Goals`;

CREATE TABLE `Goals` (
  `ID` bigint(11) unsigned NOT NULL AUTO_INCREMENT,
  `KCAL` double DEFAULT NULL,
  `CARBOHYDRATES` int(11) DEFAULT NULL,
  `PROTEINS` int(11) DEFAULT NULL,
  `FATS` int(11) DEFAULT NULL,
  `USER_ID` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `USER_ID` (`USER_ID`),
  CONSTRAINT `goals_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `users` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# Dump of table Notifications
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Notifications`;

CREATE TABLE `Notifications` (
  `ID` bigint(11) unsigned NOT NULL AUTO_INCREMENT,
  `USER_ID` bigint(20) DEFAULT NULL,
  `TIME` varchar(8) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `USER_ID` (`USER_ID`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `users` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



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



# Dump of table Users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Users`;

CREATE TABLE `Users` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `EMAIL` varchar(255) NOT NULL,
  `PASSWORDHASH` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
