const fs = require('fs');
const path = 'c:\\Users\\user\\Documents\\Final Year Project\\New folder (2)\\SVMS\\svms_backend\\dist';
try {
  if (fs.existsSync(path)) {
    fs.rmSync(path, { recursive: true, force: true });
    console.log('Successfully deleted ' + path);
  } else {
    console.log('Directory does not exist');
  }
} catch (err) {
  console.error('Error deleting directory:', err.message);
}
