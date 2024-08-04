// Function to display messages
function displayMessage(message) {
    const messageElement = document.getElementById('message');
    messageElement.innerText = message;
}

// Event to register a user through API form submission
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
        if (status !== 200) {
            throw new Error(body.message || 'An error occurred');
        }
        displayMessage(body.message);
    })
    .catch(error => {
        displayMessage(error.message);
    });
});

// Event to login user through API form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if(response.ok) {
            displayMessage(data.message);
        } else {
            throw new Error(data.message || 'An error occurred');
        }
    } catch (error) {
        displayMessage(result.message);
    }
});

// Event to logout current user through API
document.getElementById('logoutButton').addEventListener('click', async () => {
    try {
        const response = await fetch('/api/logout', {
            method: 'POST'
        });

        const data = await response.json();
        if (response.ok) {
            displayMessage(data.message);
        } else {
            throw new Error(data.message || 'An error occured');
        }
    } catch (error) {
        displayMessage(error.message);
    }
});

// TODO: These 'Network response was not ok' error messages overwrite the more specific messages returned from server.js APIs

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
        .then(response => response.json().then(data => ({ status: response.status, body: data }))) 
        .then(({ status, body }) => {
            if (status !== 201) {
                throw new Error(body.message || 'An error occurred');
            }
            greetMessage.textContent = body.message;
            fetchGreetings();
        })
        .catch(error => {
            greetMessage.textContent = 'An error occurred: ' + error.message;
        });
    });

    function fetchGreetings() {
        fetch('/api/greetings')
            .then(response => response.json().then(data => ({ status: response.status, body: data })))
            .then(({ status, body }) => {
                if (status !== 200) {
                    throw new Error(body.message || 'An error occurred');
                }
                greetList.innerHTML = '';
                body.forEach(greeting => {
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