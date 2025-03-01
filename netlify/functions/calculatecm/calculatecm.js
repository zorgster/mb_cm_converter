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

exports.handler = async (event, context) => {
  try {
    const { chromosome, start, end, parent } = JSON.parse(event.body);

    if (!chromosome || !start || !end || !parent) {
      throw new Error('Missing required fields');
    }

    if (start == end) {
      throw new Error('The segment has zero length');
    }

    if (start > end) {
      throw new Error('The Start is after the End');
    }

    const mapFile = parent === 'mat' ? 'maps.mat.tsv' : 'maps.pat.tsv';
    const mapData = loadMapFile(mapFile);
    
    const cM = calculateCM(chromosome, parseInt(start), parseInt(end), mapData);
  
    // Example calculation, you might have your own logic
    const geneticDistance = (end - start) * 0.01; // Example calculation

      return {
          statusCode: 200,
          body: JSON.stringify({ cM: geneticDistance }),
      };
    } catch (error) {
      console.error('Error in Handler:', error);
      return {
          statusCode: 500,
          body: JSON.stringify({ error: error.message }),
      };
    };
};
