const Pool = require("pg").Pool;

const pool = new Pool({
  user: "mffflqdb",
  password: "YmOxz6VEjbkyjXc19fFv6naj55G9scoM",
  host: "rogue.db.elephantsql.com",
  port: 5432,
  database: "mffflqdb"
});

module.exports = pool;