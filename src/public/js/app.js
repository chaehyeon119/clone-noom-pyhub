const socketIo = io();

socketIo.on("welcome", () => {
    appendMessageToUI("누군가가 들어왔습니다.");
});

socketIo.on("bye", () => {
    appendMessageToUI("누군가가 나갔습니다. :-(");
});

socketIo.on("new_message", (message) => {
    appendMessageToUI(message);
});


let roomName = "";
const welcomeForm = document.querySelector("#welcome form");

function appendMessageToUI(message) {
    const li = document.createElement("li");
    li.innerText = message;
    document.querySelector("#room ul").append(li);
}

function updateUI(isShowRoom) {
    if ( !isShowRoom ) {
        // welcome만 보여주고, room은 숨깁니다.
        document.querySelector("#welcome").hidden = false;
        document.querySelector("#room").hidden = true;
    }
    else {
        document.querySelector("#welcome").hidden = true;
        document.querySelector("#room").hidden = false;
    }
}

updateUI(false);

welcomeForm.addEventListener("submit", (event) => {
    event.preventDefault();

    roomName = welcomeForm.querySelector("input").value;
    welcomeForm.querySelector("input").value = "";

    socketIo.emit("enter_room", roomName, () => {
        // showRoom
        document.querySelector("#room h3").innerText = `Room ${roomName}`;

        updateUI(true);
    });
});

document.querySelector("#room form").addEventListener("submit", (event) => {
    event.preventDefault();

    const message = document.querySelector("#room form input").value;
    document.querySelector("#room form input").value = "";

    socketIo.emit("new_message", message, roomName, () => {
        appendMessageToUI(`You : ${message}`);
    });
});
