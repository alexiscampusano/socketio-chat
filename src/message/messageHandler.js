export const messages = [];

export const addUserConnection = (id, username) => {
    messages.push({
        id,
        info: "connection",
        name: username,
        message: `${username} has connected`,
        date: new Date().toTimeString(),
    });
};

export const addUserMessage = (id, username, message) => {
    messages.push({
        id,
        info: "message",
        name: username,
        message,
        date: new Date().toTimeString(),
    });
};

export const addDisconnectMessage = (id, username) => {
    messages.push({
        id,
        info: "connection",
        name: username,
        message: `${username} has disconnected`,
        date: new Date().toTimeString(),
    });
};
