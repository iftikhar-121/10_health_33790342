const bcrypt = require('bcrypt');

async function run() {
  const password = process.argv[2];
  if (!password) {
    console.error('Usage: node scripts/gen_hash.js <password>');
    process.exit(1);
  }
  const hash = await bcrypt.hash(password, 10);
  console.log('Password:', password);
  console.log('Bcrypt hash:', hash);
}

run();
