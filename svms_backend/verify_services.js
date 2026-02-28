import { getAllAddressData } from "./src/services/addressService.js";
import { getUsers } from "./src/services/userService.js";
const fs = require('fs');

async function verify() {
  const result = [];
  try {
    result.push("Starting service verification...");
    
    const addressData = await getAllAddressData();
    result.push(`Address Hierarchy fetched: ${addressData.length} counties found.`);
    if (addressData.length > 0) {
        result.push(`First county: ${addressData[0].name}, Districts: ${addressData[0].districts ? addressData[0].districts.length : 0}`);
    }

    const allUsers = await getUsers();
    const citizens = allUsers.filter(u => u.role === 'citizen');
    result.push(`Total users: ${allUsers.length}`);
    result.push(`Citizens: ${citizens.length}`);
    
    if (citizens.length > 0) {
        const c = citizens[0];
        result.push(`Sample citizen: ${c.firstname} ${c.lastname}, County: ${c.county ? c.county.name : 'NULL'}`);
    }

    result.push("Service verification passed.");
  } catch (error) {
    result.push(`SERVICE ERROR: ${error.message}`);
    result.push(error.stack);
  } finally {
    fs.writeFileSync('verify_services_out.txt', result.join('\n'));
    process.exit(0);
  }
}

verify();
