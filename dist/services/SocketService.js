"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io = require("socket.io");
const JOIN = "JOIN";
const LOGOUT = "LOGOUT";
const DISCONNECT = "ORDER";
const NEW_QUEUE = "NEW_QUEUE";
const CLIENT_MESSAGE = "CLIENT_MESSAGE";
const ADMIN_MESSAGE = "ADMIN_MESSAGE";
const AGENT_MESSAGE = "AGENT_MESSAGE";
class SocketService {
    constructor(server) {
        this.USER_SOCKETS = {};
        console.log("--------------------");
        console.log("SOCKET INITITALIZED");
        console.log("--------------------");
        this.socket = io(server, { transports: ["websocket"] });
        this.socket.on("connection", socket => {
            console.log("A USER JUST CONNECTED");
            socket.on(JOIN, user_id => {
                this.USER_SOCKETS[user_id] = socket;
            });
            socket.on(DISCONNECT, user_id => {
                delete this.USER_SOCKETS[user_id];
            });
        });
    }
    getAdminSockets() {
        return Object.keys(this.USER_SOCKETS).filter(socket => socket.indexOf(`_ADMIN`) > -1);
    }
    emitToAgentAndAdmin(toEmit, agent, event) {
        const [q] = Object.keys(toEmit);
        const adminSockets = this.getAdminSockets();
        const agentSocket = this.USER_SOCKETS[agent];
        if (agentSocket) {
            agentSocket.emit(event, { [q]: toEmit[q] });
        }
        adminSockets.forEach(socket => {
            const adminSocket = this.USER_SOCKETS[socket];
            adminSocket.emit(event, { [q]: toEmit[q] });
        });
    }
    emitToAdmin(toEmit, event) {
        const [q] = Object.keys(toEmit);
        const adminSockets = this.getAdminSockets();
        adminSockets.forEach(socket => {
            const adminSocket = this.USER_SOCKETS[socket];
            adminSocket.emit(event, { [q]: toEmit[q] });
        });
    }
    emitToAgent(toEmit, agent, event) {
        const [q] = Object.keys(toEmit);
        const agentSocket = this.USER_SOCKETS[agent];
        if (agentSocket) {
            agentSocket.emit(event, { [q]: toEmit[q] });
        }
    }
    //emit new queue to agent and admin
    emitNewQueue(payload) {
        console.log("emit new queue to admins and agent");
        const { queue, agent } = payload;
        this.emitToAgentAndAdmin({ queue }, agent, NEW_QUEUE);
    }
    //emit new message to admin and agent
    emitClientMessage(payload) {
        const { message, agent } = payload;
        this.emitToAgentAndAdmin({ message }, agent, CLIENT_MESSAGE);
    }
    //emit agent message to admin
    emitAgentMessageToAdmin(payload) {
        const { message } = payload;
        this.emitToAdmin({ message }, AGENT_MESSAGE);
    }
    //emit admin message to agent
    emitAdminMessageToAgent(payload) {
        const { message, agent } = payload;
        this.emitToAgent({ message }, agent, ADMIN_MESSAGE);
    }
}
exports.default = SocketService;
//# sourceMappingURL=SocketService.js.map