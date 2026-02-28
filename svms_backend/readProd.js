const fs = require('fs');
try {
  const status = fs.readFileSync('prod_mig_status.txt', 'utf16le');
  fs.writeFileSync('prod_mig_out.txt', "STATUS:\n" + status);
  const err = fs.readFileSync('prod_mig_err.txt', 'utf16le');
  fs.appendFileSync('prod_mig_out.txt', "\nERROR:\n" + err);
} catch(e) {}
