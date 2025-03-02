document.addEventListener('DOMContentLoaded', () => {
    const chromosomeSelect = document.getElementById('chromosome');
    for (let i = 1; i <= 22; i++) {
        const option = document.createElement('option');
        option.value = `chr${i}`;
        option.textContent = `chr${i}`;
        chromosomeSelect.appendChild(option);
    }

    document.getElementById('calculator-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const chromosome = document.getElementById('chromosome').value;
        const start = document.getElementById('start').value;
        const end = document.getElementById('end').value;
        const parent = document.getElementById('parent').value;

        try {
            const response = await fetch('https://mb-cm-converter.netlify.app/.netlify/functions/calculatecm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ chromosome, start, end, parent }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`${errorData.error}: ${errorData.details}`); // Combine custom error fields
                //                 throw new Error(errorData.error || "Unknown error");
            }

            const result = await response.json();
            if (!result.cM) {
                throw new Error('Invalid response from server');
            }

            document.getElementById('result').textContent = `The calculated genetic distance is ${result.cM} cM`;
        } catch (error) {
            console.error('Error:', error.message);
            document.getElementById('result').textContent = `Error: ${error.message}`;
        }
    });
});
