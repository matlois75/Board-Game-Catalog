const fs = require('fs');

const envVars = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_DATABASE_URL',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID',
  'FIREBASE_MEASUREMENT_ID',
  'DEEPL_API_KEY',
  'ADMIN_PASSWORD'
];

let content = fs.readFileSync('scripts.js', 'utf8');

envVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    const regex = new RegExp(`'${varName}'`, 'g');
    content = content.replace(regex, `'${value}'`);
  } else {
    console.warn(`Warning: Environment variable ${varName} is not set.`);
  }
});

fs.writeFileSync('scripts.js', content, 'utf8');

console.log('Environment variables replaced successfully.');