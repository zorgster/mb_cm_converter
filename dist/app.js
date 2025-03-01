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
            const response = await fetch(`https://mb-cm-converter.netlify.app/.netlify/functions/calculatecm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ chromosome, start, end, parent }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            if (!result.cM) {
                throw new Error('Invalid response from server');
            }

            document.getElementById('result').textContent = `The calculated genetic distance is ${result.cM} cM`;
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('result').textContent = 'An error occurred while calculating.';
        }
    });
});
