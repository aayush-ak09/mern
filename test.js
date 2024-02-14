const fs = require('fs');

function updateData(file, email, name) {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    // Parse the JSON data
    let jsonData;
    try {
      jsonData = data.split('\n').map(JSON.parse);
    } catch (parseError) {
      console.error('Error parsing JSON data:', parseError);
      return;
    }

    for (const user of jsonData) {
      if (user.Email === email) {
        user.Username = name;
        user.Password = 'Aayush@123';
      }
    }

    const updatedJsonStrings = jsonData.map(JSON.stringify);

    const updatedFileData = updatedJsonStrings.join('\n');
    fs.writeFile(file, updatedFileData, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error(writeErr);
      } else {
        console.log('File updated successfully.');
      }
    });
  });
}

const file = 'instructor.txt';
const email = 'aayush1220158@jmit.ac.in';
const name = 'Dhinchaksdfsdgdsf';

updateData(file, email, name);
