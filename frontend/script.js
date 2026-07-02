const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const registerErrorMessage = document.getElementById("registerErrorMessage");
const registerSuccessMessage = document.getElementById("registerSuccessMessage");
const loginErrorMessage = document.getElementById("loginErrorMessage");
const loginSuccessMessage = document.getElementById("loginSuccessMessage");
const welcomeState = document.getElementById("welcomeState");
const logoutButton = document.getElementById("logoutButton");

document.querySelectorAll('.toggle-password').forEach((button) => {
    button.addEventListener('click', function () {
        const targetId = this.getAttribute('data-target');
        const input = document.getElementById(targetId);
        const isPassword = input.type === 'password';

        input.type = isPassword ? 'text' : 'password';
        this.textContent = isPassword ? 'Hide' : 'Show';
    });
});

registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    let surname = document.getElementById("surname").value.trim();
    let otherNames = document.getElementById("otherNames").value.trim();
    let name = `${surname} ${otherNames}`.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let phone = document.getElementById("phone").value.trim();
    let message = "";

    registerErrorMessage.textContent = "";
    registerSuccessMessage.textContent = "";

    if (!name || !email || !password || !confirmPassword || !phone) {
        message = "All fields are required.";
    } else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
        message = "Please enter a valid email address.";
    } else if (password.length < 8) {
        message = "Password must be at least 8 characters.";
    } else if (password !== confirmPassword) {
        message = "Passwords do not match.";
    } else if (!/^\d{10,15}$/.test(phone)) {
        message = "Phone number must be 10-15 digits.";
    }

    if (message) {
        registerErrorMessage.textContent = message;
    } else {
        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, phone })
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || "Registration failed");
            }
            registerSuccessMessage.textContent = result.message || "Registration successful!";
            registerForm.reset();
        } catch (error) {
            registerErrorMessage.textContent = error.message || "Unable to complete registration. Please try again.";
        }
    }
});

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    let email = document.getElementById("loginEmail").value.trim();
    let password = document.getElementById("loginPassword").value;

    loginErrorMessage.textContent = "";
    loginSuccessMessage.textContent = "";

    if (!email || !password) {
        loginErrorMessage.textContent = "Please enter both email and password.";
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || "Login failed");
        }
        loginSuccessMessage.textContent = result.message || "Login successful!";
        loginForm.reset();
        welcomeState.classList.remove("hidden");
    } catch (error) {
        loginErrorMessage.textContent = error.message || "Unable to log in. Please try again.";
    }
});

logoutButton.addEventListener("click", function () {
    welcomeState.classList.add("hidden");
    loginSuccessMessage.textContent = "";
    loginErrorMessage.textContent = "";
});
