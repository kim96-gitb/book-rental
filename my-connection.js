const mysql = require("mysql2");
const db_config = require("./config/db-config.json");
//커넥션 풀 (connection pool)을 만든다
// 이유 , 풀이 알아서 커넥션 연결을 컨트롤한다.

const pool = mysql.createPool({
  host: db_config.MYSQL_HOST,
  user: db_config.MYSQL_USER,
  database: db_config.DB_NAME,
  password: db_config.DB_PASSWORD,
  waitForConnetions: true,
  connectionLimit: 10,
});
//await 으로 사용하기 위해 , 프라미스로 저장.
const connection = pool.promise();

module.exports = connection;
