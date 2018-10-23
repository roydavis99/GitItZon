CREATE DATABASE IF NOT EXISTS bamizon;

USE bamizon;
DROP TABLE IF EXISTS Product;
CREATE TABLE IF NOT EXISTS Product(
	uuid VARCHAR(36) NOT NULL PRIMARY KEY,
    ProductCode VARCHAR(50) NOT NULL , 
	ProductName VARCHAR(100)  NOT NULL,
	DepartmentName VARCHAR(100)  NOT NULL,
	Description VARCHAR(500),
    Price DECIMAL(10,2)  NOT NULL,
    StockQuantity INTEGER NOT NULL,
    
    LastModDateTime timestamp(6) NOT NULL,
	CreateDateTime timestamp(6) NOT NULL
    
);

ALTER TABLE Product ADD INDEX Product(ProductCode, DepartmentName, LastModDateTime, CreateDateTime);

-- DROP trigger before_insert_Movie;
-- DROP TRIGGER before_Update_Movie;
DELIMITER ;;
CREATE TRIGGER before_insert_Product
BEFORE INSERT ON Product 
FOR EACH ROW
BEGIN
	SET new.uuid = uuid();
    SET new.CreateDateTime = current_timestamp(6);
    SET new.LastModDateTime = new.CreateDateTime;
END;

CREATE TRIGGER before_Update_Product
BEFORE UPDATE ON Product
FOR EACH ROW
BEGIN
	SET new.CreateDateTime = old.CreateDateTime;
	SET new.LastModDateTime = current_timestamp(6);
END;
;;

