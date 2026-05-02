#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const https = require('https');

const projectId = 'prj_eyHPDPH1t586T7pWpg9uezgeuBTE';
const credentialsPath = path.join(__dirname, 'service-account-key.json');

// Read service account credentials
const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

// Get Vercel token from environment
const token = process.env.VERCEL_TOKEN;
if (!token) {
  console.error('Error: VERCEL_TOKEN environment variable not set');
  console.log('Getting token from vercel CLI...');

  const { execSync } = require('child_process');
  try {
    // Try to get token from vercel CLI
    const output = execSync('vercel login --token', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    console.log(output);
  } catch (e) {
    console.error('Could not get token automatically');
    process.exit(1);
  }
}

function setEnvironmentVariable(name, value) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      key: name,
      value: value,
      type: 'plain',
      target: ['production', 'preview']
    });

    const options = {
      hostname: 'api.vercel.com',
      path: `/v10/projects/${projectId}/env`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Authorization': `Bearer ${token}`
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        console.log(`[${res.statusCode}] ${name}: ${res.statusCode === 201 ? 'Success' : 'Failed'}`);
        if (res.statusCode !== 201) {
          console.log(responseData);
        }
        resolve(res.statusCode === 201);
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('Setting GOOGLE_CREDENTIALS environment variable...');

  const credentialsStr = JSON.stringify(credentials);
  const success = await setEnvironmentVariable('GOOGLE_CREDENTIALS', credentialsStr);

  if (success) {
    console.log('\n✅ Environment variable set successfully!');
    console.log('Redeploying project...');

    // Trigger redeploy
    const { execSync } = require('child_process');
    try {
      execSync('vercel redeploy', { cwd: __dirname, stdio: 'inherit' });
    } catch (e) {
      console.log('Note: Manual redeploy may be needed');
    }
  } else {
    console.error('\n❌ Failed to set environment variable');
    process.exit(1);
  }
}

main().catch(console.error);
