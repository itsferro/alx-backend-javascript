const express = require('express');
const fs = require('fs').promises;

const app = express();
const port = 1245;

// Function to count students from a CSV file
async function countStudents(path) {
  try {
    const data = await fs.readFile(path, 'utf8');
    const lines = data.split('\n').filter((line) => line.trim() !== '');
    const students = lines.slice(1); // Skip header line

    const fields = {};
    students.forEach((student) => {
      const [firstname, , , field] = student.split(',');
      if (!fields[field]) {
        fields[field] = [];
      }
      fields[field].push(firstname);
    });

    let result = `Number of students: ${students.length}\n`;
    for (const [field, names] of Object.entries(fields)) {
      result += `Number of students in ${field}: ${names.length}. List: ${names.join(', ')}\n`;
    }

    return result.trim();
  } catch (error) {
    throw new Error('Cannot load the database');
  }
}

// Route for the root path
app.get('/', (req, res) => {
  res.send('Hello ALX!');
});

// Route for the /students path
app.get('/students', async (req, res) => {
  const databasePath = process.argv[2];
  if (!databasePath) {
    res.status(500).send('Database file not provided');
    return;
  }

  try {
    const studentData = await countStudents(databasePath);
    res.send(`This is the list of our students\n${studentData}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

module.exports = app;
