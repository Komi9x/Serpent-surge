// This function gets the top scores from the database, and inserts them into a table

async function getTopScores() {
    try {
        const response = await fetch('/top-scores');
        const topScores = await response.json();
        const tableBody = document.querySelector('#scoreTable tbody');

        tableBody.innerHTML = '';

        topScores.forEach((score, index) => {
            const row = document.createElement('tr');

            const positionCell = document.createElement('td');
            positionCell.textContent = index + 1;
            row.appendChild(positionCell);

            const nameCell = document.createElement('td');
            nameCell.className = 'mid-scr';
            nameCell.textContent = score.name;
            row.appendChild(nameCell);

            const scoreCell = document.createElement('td');
            scoreCell.className = 'right-scr';
            scoreCell.textContent = score.score;
            row.appendChild(scoreCell);

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching top scores:', error);
    }
}

getTopScores();
