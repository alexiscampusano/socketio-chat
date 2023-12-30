/* selectors */
const usernameElement = document.querySelector(".username");
const chatMessage = document.querySelector(".chatMessage");
const inputMessage = document.getElementById("inputMessage");
const btnMessage = document.getElementById("btnMessage");
const typing = document.querySelector(".typing");

/* variables */
const socket = io();
let nameUser = "";

/* functions */
const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
};

const setUsername = () => {
    const promptUsername = () => {
        Swal.fire({
            title: "Enter your name",
            input: "text",
            inputAttributes: {
                autocapitalize: "on",
            },
            showCancelButton: false,
            confirmButtonText: "Send",
        }).then((result) => {
            if (result.value && result.value.trim() !== "") {
                usernameElement.textContent = result.value;
                nameUser = result.value;
                socket.emit("userConnection", {
                    user: result.value,
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Invalid Name",
                    text: "Please enter a valid name.",
                }).then(promptUsername);
            }
        });
    };
    promptUsername();
};


const renderMessages = (data) => {
    return data
        .map((message) => {
            if (message.info === "connection") {
                return `<p class="connection">${message.message}</p>`;
            } else if (message.info === "message") {
                return `
                    <div class="${message.name === nameUser ? "messageUser" : "otherUser"
                    }">
                        <h5>${message.name} - ${getCurrentTime()}</h5>
                        <p>${message.message}</p>
                    </div>
                `;
            }
        })
        .join("");
};

const scrollToBottom = () => {
    chatMessage.scrollTop = chatMessage.scrollHeight;
};

const handleSendMessage = () => {
    const messageText = inputMessage.value.trim();

    if (messageText !== "") {
        socket.emit("userMessage", {
            message: messageText,
            name: nameUser,
        });

        inputMessage.value = "";
        scrollToBottom();
    }
};

const handleEnterPress = (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        handleSendMessage();
    }
};

const handleTyping = () => {
    socket.emit("typing", { nameUser });
    scrollToBottom();
};

const clearTypingMessage = () => {
    setTimeout(() => {
        typing.textContent = "";
        scrollToBottom();
    }, 3000);
};

/* events */
btnMessage.addEventListener("click", handleSendMessage);
inputMessage.addEventListener("keydown", handleEnterPress);
inputMessage.addEventListener("keypress", handleTyping);
inputMessage.addEventListener("keyup", clearTypingMessage);

/* socket events */
socket.on("userConnection", (data) => {
    chatMessage.innerHTML = renderMessages(data);
    scrollToBottom();
});

socket.on("userMessage", (data) => {
    chatMessage.innerHTML = renderMessages(data);
    scrollToBottom();
});

socket.on("typing", (data) => {
    typing.textContent = `${data.nameUser} is typing...`;
    scrollToBottom();
    clearTypingMessage();
});

setUsername();
