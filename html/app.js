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
            const response = await fetch('/functions/calculate-cm.js', {
                method: 'POST',
                body: JSON.stringify({ chromosome, start, end, parent }),
            });
            const result = await response.json();
            document.getElementById('result').textContent = `The calculated genetic distance is ${result.cM.toFixed(4)} cM`;
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('result').textContent = 'An error occurred while calculating.';
        }
    });
});
