// Function to display messages
function displayMessage(message) {
    const messageElement = document.getElementById('message');
    messageElement.innerText = message;
}

// Event to register a user through API form submission
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    displayMessage(result.message);
});

// Event to login user through API form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    displayMessage(result.message);
});

// Event to logout current user through API
document.getElementById('logoutButton').addEventListener('click', async () => {
    const response = await fetch('/api/logout', {
        method: 'POST'
    });

    const result = await response.json();
    displayMessage(result.message);
});

document.addEventListener('DOMContentLoaded', function () {
    const greetForm = document.getElementById('greetForm');
    const greetInput = document.getElementById('greetInput');
    const greetMessage = document.getElementById('greetMessage');
    const greetList = document.getElementById('greetList');

    greetForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const name = greetInput.value;

        fetch('/api/greet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        })
        .then(response => {
            if(!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            greetMessage.textContent = data.message;
            fetchGreetings();
        })
        .catch(error => {
            greetMessage.textContent = 'An error occurred: ' + error.message;
        });
    });

    function fetchGreetings() {
        fetch('/api/greetings')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                greetList.innerHTML = '';
                data.forEach(greeting => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${greeting.name}: ${greeting.message}`;
                    greetList.appendChild(listItem);
                });
            })
            .catch(error => {
                greetList.innerHTML = '<li>An error occurred while fetching greetings: ' + error.message + '</li>';
            });
    }

    // Initial fetch of greetings
    fetchGreetings();
});