-- ─────────────────────────────────────────────────────────────────────────────
-- Halleyx DB Schema
-- ─────────────────────────────────────────────────────────────────────────────

CREATE DATABASE IF NOT EXISTS halleyx_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE halleyx_db;

-- ── Customer Orders ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customer_orders (
  id             INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  first_name     VARCHAR(100)     NOT NULL,
  last_name      VARCHAR(100)     NOT NULL,
  customer_name  VARCHAR(200)     NOT NULL,
  email          VARCHAR(255)     NOT NULL,
  phone          VARCHAR(50)      NOT NULL,
  street_address VARCHAR(255)     NOT NULL,
  city           VARCHAR(100)     NOT NULL,
  state          VARCHAR(100)     NOT NULL,
  postal_code    VARCHAR(20)      NOT NULL,
  country        VARCHAR(100)     NOT NULL,
  product        VARCHAR(200)     NOT NULL,
  quantity       SMALLINT         NOT NULL DEFAULT 1,
  unit_price     DECIMAL(10,2)    NOT NULL DEFAULT 0.00,
  total_amount   DECIMAL(10,2)    NOT NULL DEFAULT 0.00,
  status         ENUM('Pending','In progress','Completed') NOT NULL DEFAULT 'Pending',
  created_by     VARCHAR(200)     NOT NULL,
  order_date     DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_status     (status),
  INDEX idx_order_date (order_date),
  INDEX idx_product    (product),
  INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Dashboard Layouts ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dashboard_layouts (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  layout_key  VARCHAR(50)   NOT NULL UNIQUE,
  widgets     LONGTEXT      NOT NULL,
  layout_data LONGTEXT      NOT NULL,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Seed Data (26 sample orders) ─────────────────────────────────────────────
INSERT IGNORE INTO customer_orders
  (id,first_name,last_name,customer_name,email,phone,street_address,city,state,postal_code,country,product,quantity,unit_price,total_amount,status,created_by,order_date)
VALUES
  (1,'Alice','Johnson','Alice Johnson','alice.j@example.com','+1 512-555-0101','123 Oak Street','Austin','TX','78701','United States','Fiber Internet 1 Gbps',1,89.99,89.99,'Completed','Mr. Michael Harris','2025-08-10 09:00:00'),
  (2,'Bob','Smith','Bob Smith','bob.smith@example.com','+1 206-555-0102','456 Pine Avenue','Seattle','WA','98101','United States','5G Unlimited Mobile Plan',2,49.99,99.98,'Pending','Mr. Ryan Cooper','2025-08-15 11:30:00'),
  (3,'Carol','White','Carol White','carol.w@example.com','+1 416-555-0103','789 Elm Road','Toronto','ON','M5V 2T6','Canada','Business Internet 500 Mbps',1,149.99,149.99,'In progress','Ms. Olivia Carter','2025-09-01 14:00:00'),
  (4,'David','Lee','David Lee','david.lee@example.com','+65 9123-4567','21 Orchard Road','Singapore','SG','238820','Singapore','VoIP Corporate Package',3,79.99,239.97,'Completed','Mr. Lucas Martin','2025-09-05 08:45:00'),
  (5,'Eva','Chen','Eva Chen','eva.chen@example.com','+61 2-5550-0105','654 Cedar Lane','Sydney','NSW','2000','Australia','Fiber Internet 300 Mbps',1,59.99,59.99,'Pending','Mr. Michael Harris','2025-09-12 16:20:00'),
  (6,'Frank','Brown','Frank Brown','frank.b@example.com','+1 604-555-0106','321 Maple Drive','Vancouver','BC','V6B 1A1','Canada','Fiber Internet 1 Gbps',2,89.99,179.98,'Completed','Mr. Ryan Cooper','2025-09-20 10:00:00'),
  (7,'Grace','Kim','Grace Kim','grace.kim@example.com','+852 9876-5432','88 Queen Road','Hong Kong','HK','000000','Hong Kong','5G Unlimited Mobile Plan',4,49.99,199.96,'In progress','Ms. Olivia Carter','2025-10-01 13:00:00'),
  (8,'Henry','Davis','Henry Davis','henry.d@example.com','+1 303-555-0108','99 Broadway','Denver','CO','80203','United States','Business Internet 500 Mbps',1,149.99,149.99,'Pending','Mr. Lucas Martin','2025-10-10 09:30:00'),
  (9,'Isla','Wilson','Isla Wilson','isla.w@example.com','+1 512-555-0109','11 Sunset Blvd','Austin','TX','78702','United States','VoIP Corporate Package',2,79.99,159.98,'Completed','Mr. Michael Harris','2025-10-18 11:00:00'),
  (10,'James','Taylor','James Taylor','james.t@example.com','+1 415-555-0110','55 Market Street','San Francisco','CA','94105','United States','Fiber Internet 300 Mbps',1,59.99,59.99,'Pending','Mr. Ryan Cooper','2025-10-25 14:45:00'),
  (11,'Karen','Martinez','Karen Martinez','karen.m@example.com','+1 212-555-0111','200 Park Avenue','New York','NY','10166','United States','Fiber Internet 1 Gbps',3,89.99,269.97,'In progress','Ms. Olivia Carter','2025-11-02 08:00:00'),
  (12,'Liam','Anderson','Liam Anderson','liam.a@example.com','+61 3-5550-0112','77 Collins Street','Melbourne','VIC','3000','Australia','5G Unlimited Mobile Plan',2,49.99,99.98,'Completed','Mr. Lucas Martin','2025-11-10 12:30:00'),
  (13,'Mia','Thompson','Mia Thompson','mia.t@example.com','+65 8123-9999','14 Marina Bay','Singapore','SG','018983','Singapore','Business Internet 500 Mbps',2,149.99,299.98,'Pending','Mr. Michael Harris','2025-11-18 10:15:00'),
  (14,'Noah','Garcia','Noah Garcia','noah.g@example.com','+1 713-555-0114','500 Texas Ave','Houston','TX','77002','United States','VoIP Corporate Package',1,79.99,79.99,'Completed','Mr. Ryan Cooper','2025-11-25 15:00:00'),
  (15,'Olivia','Robinson','Olivia Robinson','olivia.r@example.com','+852 6543-2109','30 Harbour Road','Hong Kong','HK','000000','Hong Kong','Fiber Internet 1 Gbps',1,89.99,89.99,'In progress','Ms. Olivia Carter','2025-12-03 09:00:00'),
  (16,'Peter','Clark','Peter Clark','peter.c@example.com','+1 604-555-0116','88 Robson Street','Vancouver','BC','V6B 2B3','Canada','Fiber Internet 300 Mbps',3,59.99,179.97,'Pending','Mr. Lucas Martin','2025-12-10 11:30:00'),
  (17,'Quinn','Lewis','Quinn Lewis','quinn.l@example.com','+1 312-555-0117','233 Michigan Ave','Chicago','IL','60601','United States','5G Unlimited Mobile Plan',5,49.99,249.95,'Completed','Mr. Michael Harris','2025-12-18 14:00:00'),
  (18,'Rachel','Walker','Rachel Walker','rachel.w@example.com','+61 7-5550-0118','42 Queen Street','Brisbane','QLD','4000','Australia','Business Internet 500 Mbps',1,149.99,149.99,'Pending','Mr. Ryan Cooper','2026-01-05 09:00:00'),
  (19,'Samuel','Hall','Samuel Hall','samuel.h@example.com','+1 604-555-0119','900 Burrard Street','Vancouver','BC','V6Z 2J8','Canada','VoIP Corporate Package',4,79.99,319.96,'In progress','Ms. Olivia Carter','2026-01-15 13:45:00'),
  (20,'Tina','Young','Tina Young','tina.y@example.com','+65 9876-1234','7 Raffles Quay','Singapore','SG','048580','Singapore','Fiber Internet 1 Gbps',2,89.99,179.98,'Completed','Mr. Lucas Martin','2026-01-28 10:30:00'),
  (21,'Umar','Allen','Umar Allen','umar.a@example.com','+1 416-555-0121','150 King Street West','Toronto','ON','M5H 1J9','Canada','5G Unlimited Mobile Plan',3,49.99,149.97,'Pending','Mr. Michael Harris','2026-02-05 08:30:00'),
  (22,'Vera','Scott','Vera Scott','vera.s@example.com','+1 212-555-0122','350 Fifth Avenue','New York','NY','10118','United States','Business Internet 500 Mbps',1,149.99,149.99,'Completed','Mr. Ryan Cooper','2026-02-12 11:00:00'),
  (23,'Will','Adams','Will Adams','will.a@example.com','+61 2-5550-0123','10 Bridge Street','Sydney','NSW','2000','Australia','Fiber Internet 300 Mbps',2,59.99,119.98,'In progress','Ms. Olivia Carter','2026-02-20 15:30:00'),
  (24,'Xena','Baker','Xena Baker','xena.b@example.com','+852 5555-7890','22 Pedder Street','Hong Kong','HK','000000','Hong Kong','VoIP Corporate Package',2,79.99,159.98,'Pending','Mr. Lucas Martin','2026-03-01 09:15:00'),
  (25,'Yusuf','Carter','Yusuf Carter','yusuf.c@example.com','+1 512-555-0125','750 Lamar Blvd','Austin','TX','78703','United States','Fiber Internet 1 Gbps',1,89.99,89.99,'Completed','Mr. Michael Harris','2026-03-08 10:00:00'),
  (26,'Zoe','Mitchell','Zoe Mitchell','zoe.m@example.com','+1 604-555-0126','1055 Dunsmuir Street','Vancouver','BC','V7X 1K8','Canada','Business Internet 500 Mbps',3,149.99,449.97,'In progress','Mr. Ryan Cooper','2026-03-12 14:00:00');
