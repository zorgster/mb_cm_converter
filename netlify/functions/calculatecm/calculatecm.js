const path = require('path');

function loadMapFile(filename) {
//  const filePath = path.join(__dirname, filename);
//  const fileContent = fs.readFileSync(filePath, 'utf8');
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

    // Determine the correct TSV file path
    const filePath = path.resolve(__dirname, `./maps.${parent}.tsv`);

    // Read the TSV file
    const fs = require('fs').promises;
    const fileContent = await fs.readFile(filePath, 'utf-8');

    // Parse the TSV content, skipping comment lines and filtering by chromosome
    const rows = fileContent
        .split('\n')
        .filter(line => {
            if (line.trim() === '' || line.startsWith('#')) {
                return false; // Skip empty or comment lines
            }

            const [chr, pos, cmPerMb] = line.split('\t');
            if (chr != chromosome) {
              return false;
            }

            const intervalPos = parseInt(pos, 10);
    
            // Define interval boundaries
            const intervalStart = intervalPos - 499999;
            const intervalEnd = intervalPos + 500000;
    
            // Check if intervals overlap
            return (
                intervalEnd > start &&      // Interval end > start
                intervalStart <= end        // Interval start <= end
            );
        })
        .map(line => {
            const [chr, pos, cmPerMb] = line.split('\t');
            const intervalPos = parseInt(pos, 10);
    
            // Define interval boundaries
            const intervalStart = intervalPos - 499999;
            const intervalEnd = intervalPos + 500000;
    
            // Calculate overlap
            const overlapStart = Math.max(intervalStart, start);
            const overlapEnd = Math.min(intervalEnd, end);
            const overlapBases = Math.max(0, overlapEnd - overlapStart + 1);
    
            // Ignore negligible overlaps (e.g., 1 base)
            if (overlapBases <= 2) {
                return 0; // Ignore this interval by contributing zero to the total
            }
    
            // Calculate cM contribution for valid overlaps
            return overlapBases / 1_000_000 * parseFloat(cmPerMb);
        })
        .filter(cm => cm > 0); // Exclude rows that contribute 0 to the total
    
    // Sum the total cM
    const totalCM = rows.reduce((acc, cm) => acc + cm, 0);

    // const cM = calculateCM(chromosome, parseInt(start), parseInt(end), rows);
  
    // Example calculation, you might have your own logic
    // const geneticDistance = (end - start) * 0.01; // Example calculation

      return {
          statusCode: 200,
          body: JSON.stringify({ cM: totalCM }),
      };
    } catch (error) {
      console.error('Error in Handler:', error);
      return {
          statusCode: 500,
          body: JSON.stringify({ error: error.message }),
      };
    }
};
