const fs = require('fs');
require('@babel/register')({
  presets: ['@babel/preset-env']
});

const { getCitizen } = require('./src/controllers/userController.js');

const res = {
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(data) {
    fs.writeFileSync('mock_out.txt', 'STATUS: ' + this.statusCode + '\nDATA: ' + JSON.stringify(data, null, 2));
    console.log("Mock completed");
  }
};

const req = {};

(async () => {
  try {
    await getCitizen(req, res);
  } catch(e) {
    fs.writeFileSync('mock_out.txt', 'UNCAUGHT ERROR: ' + e.message + '\n' + e.stack);
  }
})();
