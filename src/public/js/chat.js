const socket = io();
let user = "";

Swal.fire({
    title: "Inicia sesion!",
    text: "Ingresa tu nombre de usuario",
    input: "text",
    confirmButtonText: "Cool",
    allowOutsideClick: false,
    inputValidator: (value) => {
        if (!value) {
            return "Debe ingresar un nombre de usuario";
        }
    },
}).then((result) => {
    if (result.value) {
        user = result.value;

        socket.emit("new-user", { user: user, id: socket.id });
    }
});

socket.on("new-user-connected", (data) => {
    if (data.id !== socket.id)
        Swal.fire({
            text: `${data.user} se ha conectado al chat`,
            toast: true,
            position: "top-end",
        });
});

let chatBox = document.getElementById("chatBox");

chatBox.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        socket.emit("message", {
            user,
            message: chatBox.value,
        });
        chatBox.value = "";
    }
});

socket.on("messageLogs", (data) => {
    let log = document.getElementById("messageLogs");
    let message = "";

    data.forEach((elem) => {
        message += `
            <div class="chat-message">
                <div class="message-bubble">
                    <div class="message-sender">${elem.user}</div>
                    <p>${elem.message}</p>
                    <span class="message-date">${elem.date}</span>
                </div>
            </div>
        `;
    });

    log.innerHTML = message;
});

function firstLoad() {
    fetch("/chat")
        .then((res) => res.json())
        .then((data) => {
            let log = document.getElementById("messageLogs");
            let message = "";

            data.forEach((elem) => {
                message += `
                    <div class="chat-message">
                        <div class="message-bubble">
                            <div class="message-sender">${elem.user}</div>
                            <p>${elem.message}</p>
                            <span class="message-date">${elem.date}</span>
                        </div>
                    </div>
                `;
            });

            log.innerHTML = message;
        });
}

firstLoad();