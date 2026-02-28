const { spawn } = require('child_process');
const fs = require('fs');

const out = fs.openSync('./out.txt', 'a');
const err = fs.openSync('./err.txt', 'a');

const subprocess = spawn('npx', ['babel-node', './src/index.js'], {
  detached: true,
  stdio: [ 'ignore', out, err ],
  cwd: 'c:/Users/user/Documents/Final Year Project/New folder (2)/SVMS/svms_backend',
  env: { ...process.env, NODE_ENV: 'development' }
});

subprocess.unref();
console.log('Server started in background, PID:', subprocess.pid);
process.exit(0);
