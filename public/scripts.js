// Function to display messages
function displayMessage(message) {
    const messageElement = document.getElementById('message');
    messageElement.innerText = message;
}

// Function to toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.nextElementSibling;

    if (input.type === 'password') {
        input.type = 'text';
        toggle.textContent = 'Hide';
    } else {
        input.type = 'password';
        toggle.textContent = 'Show';
    }
}

// Event to register a user through API form submission
document.addEventListener("DOMContentLoaded", function() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(registerForm);
            const data = {
                username: formData.get('username'),
                password: formData.get('password')
            };
        
            fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
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
    }
});

document.addEventListener("DOMContentLoaded", function() {
    // Event to login user through API form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
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
                if (response.ok) {
                    displayMessage(data.message);
                } else {
                    throw new Error(data.message || 'An error occurred');
                }
            } catch (error) {
                displayMessage(error.message);
            }
        });
    }

    // Event to logout current user through API
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/logout', {
                    method: 'POST'
                });

                const data = await response.json();
                if (response.ok) {
                    displayMessage(data.message);
                } else {
                    throw new Error(data.message || 'An error occurred');
                }
            } catch (error) {
                displayMessage(error.message);
            }
        });
    }
});

/* OLD

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
        displayMessage(error.message);
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
*/

// Handle greet form
document.addEventListener('DOMContentLoaded', function () {
    const greetForm = document.getElementById('greetForm');
    const greetInput = document.getElementById('greetInput');
    const greetMessage = document.getElementById('greetMessage');
    const greetList = document.getElementById('greetList');

    if (greetForm) {
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
    }
});