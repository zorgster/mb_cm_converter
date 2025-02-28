const fs = require('fs');
const path = require('path');

function loadMapFile(filename) {
  const filePath = path.join(__dirname, filename);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  // Parse the TSV file content and return as an object
  // Implementation depends on your TSV structure
}

function calculateCM(chr, start, end, mapData) {
  // Implement your cM calculation logic here
  // Use the mapData and segment information to calculate cM
}

exports.handler = async (event) => {
  const { chromosome, start, end, parent } = JSON.parse(event.body);
  
  const mapFile = parent === 'mat' ? 'maps.mat.tsv' : 'maps.pat.tsv';
  const mapData = loadMapFile(mapFile);
  
//  const cM = calculateCM(chromosome, parseInt(start), parseInt(end), mapData);
  try {
    const { chromosome, start, end, parent } = JSON.parse(event.body);

    // Example calculation, you might have your own logic
    const geneticDistance = (end - start) * 0.01; // Example calculation

      return {
          statusCode: 200,
          body: JSON.stringify({ cM: geneticDistance }),
      };
    } catch (error) {
      return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Internal Server Error' }),
      };
    };
}};
