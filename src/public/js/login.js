console.log("Bienvenido")

async function postLogin(email, password) {
    const response = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.status === "success") {
        localStorage.setItem("token", data.token);
    }
    if (data.respuesta === "admin") {
        window.location.href = "/realtime";
    } else if (data.respuesta === "premium") {
        window.location.href = "/realtime";
    } else if (data.respuesta === "ok") {
        window.location.href = "/products";
    } else {
        alert("Datos incorrectos");
    }
}


const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    postLogin(email, password);
});

document.getElementById("signup").addEventListener("click", function () {
    window.location.href = `/signup`;
});