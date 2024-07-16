import db from "../db/DbModel.js";

const initDatabase = async () => {
  try {
    // Create inventory table
    await db.query(`
      CREATE TABLE IF NOT EXISTS inventory (
        product_id int NOT NULL AUTO_INCREMENT,
        product_name varchar(255) NOT NULL,
        category varchar(255) NOT NULL,
        price float NOT NULL,
        quantity float NOT NULL,
        total_amount float NOT NULL,
        created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        updated_date timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        img varchar(255) DEFAULT NULL,
        team_id int DEFAULT NULL,
        user_id int DEFAULT NULL,
        PRIMARY KEY (product_id),
        KEY fk_team (team_id),
        KEY fk_user (user_id),
        CONSTRAINT fk_team FOREIGN KEY (team_id) REFERENCES team (id),
        CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
    // console.log('inventory table created');

    // Create menu table
    await db.query(`
      CREATE TABLE IF NOT EXISTS menu (
        id int NOT NULL AUTO_INCREMENT,
        label varchar(255) DEFAULT NULL,
        icon varchar(255) DEFAULT NULL,
        route varchar(255) DEFAULT NULL,
        parent_id int DEFAULT NULL,
        created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        updated_date timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY menu_ibfk_1 (parent_id),
        CONSTRAINT menu_ibfk_1 FOREIGN KEY (parent_id) REFERENCES menu (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
    // console.log('menu table created');

    // Create roles table
    await db.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id int NOT NULL AUTO_INCREMENT,
        name varchar(50) NOT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
    // console.log('roles table created');

    // Create team table
    await db.query(`
      CREATE TABLE IF NOT EXISTS team (
        id int NOT NULL AUTO_INCREMENT,
        name varchar(255) NOT NULL,
        description text,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
    // console.log('team table created');

    // Create team_members table
    await db.query(`
      CREATE TABLE IF NOT EXISTS team_members (
        id int NOT NULL AUTO_INCREMENT,
        team_id int NOT NULL,
        user_id int NOT NULL,
        role_id int NOT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY team_id (team_id, user_id),
        UNIQUE KEY unique_team_member (user_id, role_id, team_id),
        KEY role_id (role_id),
        CONSTRAINT team_members_ibfk_1 FOREIGN KEY (team_id) REFERENCES team (id) ON DELETE CASCADE,
        CONSTRAINT team_members_ibfk_2 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        CONSTRAINT team_members_ibfk_3 FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
    // console.log('team_members table created');

    // Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id int NOT NULL AUTO_INCREMENT,
        name varchar(255) NOT NULL,
        email varchar(255) NOT NULL,
        password varchar(255) NOT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY email (email),
        UNIQUE KEY password (password)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
    // console.log('users table created');

    // Insert initial data
    const [menuRows] = await db.query('SELECT COUNT(*) AS count FROM menu');
    if (menuRows[0].count === 0) {
      const insertMenuData = `
        INSERT INTO menu (id, label, icon, route, parent_id, created_date, updated_date) VALUES
        (1, 'Item List', 'UnorderedListOutlined', '/', NULL, '2024-04-12 13:09:56', '2024-04-12 13:09:56'),
        (2, 'Stock In', 'ArrowUpOutlined', '/StockIn', NULL, '2024-04-12 13:09:56', '2024-04-29 05:12:00'),
        (3, 'Stock Out', 'ArrowDownOutlined', '/stockout', NULL, '2024-04-12 13:09:56', '2024-04-12 13:09:56'),
        (4, 'Adjust', 'CarryOutOutlined', NULL, NULL, '2024-04-12 13:09:56', '2024-04-12 13:09:56'),
        (5, 'Transaction', 'MoneyCollectOutlined', NULL, NULL, '2024-04-12 13:09:56', '2024-04-12 13:09:56'),
        (6, 'Purchase & Sales', 'CarryOutOutlined', NULL, NULL, '2024-04-12 13:09:56', '2024-04-12 13:09:56'),
        (7, 'Bundles', NULL, NULL, 6, '2024-04-12 13:09:56', '2024-04-12 13:09:56'),
        (8, 'Purchases', NULL, NULL, 6, '2024-04-12 13:09:56', '2024-04-12 13:09:56'),
        (9, 'Sales', NULL, NULL, 6, '2024-04-12 13:09:56', '2024-04-12 13:09:56'),
        (10, 'Sales Analysis', NULL, NULL, 6, '2024-04-12 13:09:56', '2024-04-12 13:09:56'),
        (11, 'Print Barcode', 'CarryOutOutlined', NULL, NULL, '2024-04-12 13:09:56', '2024-04-12 13:09:56'),
        (12, 'Item', NULL, NULL, 11, '2024-04-12 13:09:56', '2024-04-12 13:09:56'),
        (13, 'Bundle', NULL, NULL, 11, '2024-04-12 13:09:56', '2024-04-12 13:09:56'),
        (14, 'Other Features', 'CarryOutOutlined', NULL, NULL, '2024-04-12 13:09:56', '2024-04-12 13:09:56'),
        (15, 'Low Stock Alert', NULL, NULL, 14, '2024-04-12 13:09:56', '2024-04-12 13:09:56'),
        (16, 'Past Quantity', NULL, NULL, 14, '2024-04-12 13:09:56', '2024-04-12 13:09:56'),
        (17, 'Inventory Link', NULL, NULL, 14, '2024-04-12 13:09:56', '2024-04-12 13:09:56'),
        (18, 'Inventory Count', NULL, NULL, 14, '2024-04-12 13:09:56', '2024-04-12 13:09:56'),
        (19, 'Reports', 'CarryOutOutlined', NULL, NULL, '2024-04-12 13:09:56', '2024-04-12 13:09:56'),
        (20, 'Summary', NULL, NULL, 19, '2024-04-12 13:09:56', '2024-04-12 13:09:56'),
        (21, 'Dashboard', NULL, NULL, 19, '2024-04-12 13:09:56', '2024-04-12 13:09:56'),
        (22, 'Analytics', NULL, NULL, 19, '2024-04-12 13:09:56', '2024-04-12 13:09:56'),
        (23, 'Data Center', 'CarryOutOutlined', NULL, NULL, '2024-04-12 13:09:56', '2024-04-12 13:09:56'),
        (24, 'Export Data', NULL, NULL, 23, '2024-04-12 13:09:56', '2024-04-12 13:09:56'),
        (25, 'Import Data', NULL, NULL, 23, '2024-04-12 13:09:56', '2024-04-12 13:09:56'),
        (26, 'Settings', 'CarryOutOutlined', NULL, NULL, '2024-04-12 13:09:56', '2024-04-12 13:09:56'),
        (27, 'User Management', NULL, NULL, 26, '2024-04-12 13:09:56', '2024-04-12 13:09:56'),
        (28, 'Customer Management', NULL, NULL, 26, '2024-04-12 13:09:56', '2024-04-12 13:09:56'),
        (29, 'Vendor Management', NULL, NULL, 26, '2024-04-12 13:09:56', '2024-04-12 13:09:56');
      `;
      await db.query(insertMenuData);
      console.log('Initial data inserted into menu table');
    }
  } catch (error) {
    console.error('Error during database initialization:', error);
  }
};

export default initDatabase;

