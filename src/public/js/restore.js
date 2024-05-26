console.log("Bienvenido")

const restoreForm = document.getElementById("restore-form");

restoreForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById("current-password").value;
    const newPassword = document.getElementById("new-password").value;

    console.log(currentPassword)
    console.log(newPassword)

    try {
        const response = await fetch("/resetpassword", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ currentPassword, newPassword }),
        });

        const data = await response.json();
        console.log(data)
        if (data.status === "success") {
            alert("Contraseña actualizada correctamente");
            window.location.href = "/login";
        } else {
            alert("Error al restablecer la contraseña");
        }
    } catch (error) {
        console.error("Error al enviar la solicitud:", error);
        alert("Error al enviar la solicitud");
    }
});
