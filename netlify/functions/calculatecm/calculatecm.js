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
      return {
        statusCode: 400,
        body: JSON.stringify({ 
            error: "Missing required fields", 
            details: "Ensure chromosome, start, end, and parent are provided." 
        }),
      };
    }

    if (start == end) {
      return {
        statusCode: 422,
        body: JSON.stringify({ 
            error: "The segment has zero length", 
            details: "Start value should not be the same as End" 
        }),
      };
    }

    if (parseInt(start) > parseInt(end)) {
      return {
        statusCode: 422,
        body: JSON.stringify({ 
            error: "The Start is after the End", 
            details: "Start should be lower than End" 
        }),
      };
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
    }
};
