const http = require('http');
const fs = require('fs').promises;

// Define the countStudents function
const countStudents = (dataPath) => new Promise((resolve, reject) => {
  fs.readFile(dataPath, 'utf-8')
    .then((data) => {
      if (!data) {
        reject(new Error('Cannot load the database'));
        return;
      }

      const fileLines = data
        .toString('utf-8')
        .trim()
        .split('\n');
      const studentGroups = {};
      const dbFieldNames = fileLines[0].split(',');
      const studentPropNames = dbFieldNames
        .slice(0, dbFieldNames.length - 1);

      for (const line of fileLines.slice(1)) {
        const studentRecord = line.split(',');
        const studentPropValues = studentRecord
          .slice(0, studentRecord.length - 1);
        const field = studentRecord[studentRecord.length - 1];
        if (!Object.keys(studentGroups).includes(field)) {
          studentGroups[field] = [];
        }
        const studentEntries = studentPropNames
          .map((propName, idx) => [propName, studentPropValues[idx]]);
        studentGroups[field].push(Object.fromEntries(studentEntries));
      }

      const totalStudents = Object
        .values(studentGroups)
        .reduce((pre, cur) => (pre || []).length + cur.length);

      let result = `Number of students: ${totalStudents}`;
      for (const [field, group] of Object.entries(studentGroups)) {
        const studentNames = group.map((student) => student.firstname).join(', ');
        result += `\nNumber of students in ${field}: ${group.length}. List: ${studentNames}`;
      }

      resolve(result);
    })
    .catch(() => {
      reject(new Error('Cannot load the database'));
    });
});

// Create the HTTP server
const app = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'text/plain');

  if (req.url === '/') {
    res.statusCode = 200;
    res.end('Hello ALX!');
  } else if (req.url === '/students') {
    try {
      const database = process.argv[2];
      if (!database) {
        throw new Error('Database file not provided');
      }

      // Use the countStudents function to process the database
      const studentData = await countStudents(database);
      res.statusCode = 200;
      res.end(`This is the list of our students\n${studentData}`);
    } catch (error) {
      res.statusCode = 500;
      res.end(`This is the list of our students\n${error.message}`);
    }
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

// Start the server
app.listen(1245, () => {
  console.log('Server is running on port 1245');
});

module.exports = app;
