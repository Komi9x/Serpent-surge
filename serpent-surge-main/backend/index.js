// Database credentials - environment variables
const db = mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'MeMyselfandI_1928',
    database: process.env.MYSQL_DATABASE || 'snake_game',
    port: '3306',
});