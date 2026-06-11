const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://neondb_owner:npg_Gx07SkLINMvP@ep-little-feather-apap9nzv.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require'
});

async function check() {
  await client.connect();
  const res = await client.query('SELECT id, email, role FROM users');
  console.table(res.rows);
  await client.end();
}

check().catch(console.error);
