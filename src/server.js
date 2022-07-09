import SocketIO from "socket.io";
import express from "express";
import http from "http";

const app = express();

// http

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/*", (req, res) => {
    res.redirect("/");
});

// websocket

const httpServer = http.createServer(app);
const socketIoServer = SocketIO(httpServer);

socketIoServer.on("connection", (socketIo) => {
    console.log("Connection maded");

    socketIo.nickname = "익명";

    socketIo.onAny((event) => {
        console.group("socketIo.onAny");
        console.log(socketIoServer.sockets.adapter);
        console.log("socket event : ", event);
        console.groupEnd();
    })

    socketIo.on("nickname", (user_nickname) => {
        socketIo.nickname = user_nickname;
    });


    socketIo.on("enter_room", (roomName, done) => {
        console.group(`[enter_room] ${roomName}`);
        done();
        socketIo.join(roomName);  // 현재 socket.io 연결을 roomName 방에 입장
        // 현재의 rootName에 새로운 연결이 맺어졌음에 대한 이벤트 발생
        socketIo.to(roomName).emit("welcome", socketIo.nickname);
        // 비효율적: db 없는 sw이기에 어쩔 수 없는 선택.
        socketIoServer.sockets.emit("room_change", getPublicRoomNames());
    });

    socketIo.on("disconnecting", () => {
        socketIo.rooms.forEach((room) => {
            socketIo.to(room).emit("bye", socketIo.nickname);
  
        });
    });

    socketIo.on("disconnect", () => {
        socketIoServer.sockets.emit("room_change", getPublicRoomNames());
    })

    socketIo.on("new_message", (message, roomName, done) => {
        socketIo.to(roomName).emit("new_message", `${socketIo.nickname}: ${message}`);
        done();
    });
});

httpServer.listen(3000, () => {
    console.log('Listening on http://localhost:3000')
});

// Utlity functions
function getPublicRoomNames(){
    // socketIoServer.sockets.adapter.sids; // Map
    // socketIoServer.sockets.adapter.rooms; // Map

    const{
        sockets: {
            adapter: { sids, rooms },
        }
    } = socketIoServer;

    const publicRoomIds = [];
    // rooms.forEach((_, roomId) => {
    //     // roomId 문자열 값이 멤버id가 아니라면
    //     if(sids.get(roomId) === undefined) {

    //         // 공개 채팅방 이름으로 생각하자.
    //         publicRoomIds.push(roomId);
    //     }
    // })

    for(const roomId of rooms.keys()) {
        if ( !sids.get(roomId )) {
            publicRoomIds.push(roomId);
        }
    }
    return publicRoomIds;
}

