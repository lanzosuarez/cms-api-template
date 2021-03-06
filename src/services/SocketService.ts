import { Server } from "restify";
import * as io from "socket.io";

const JOIN = "JOIN";
const LOGOUT = "LOGOUT";

const NEW_QUEUE = "NEW_QUEUE";
const END_QUEUE = "END_QUEUE";
const CLIENT_MESSAGE = "CLIENT_MESSAGE";
const ADMIN_MESSAGE = "ADMIN_MESSAGE";
const AGENT_MESSAGE = "AGENT_MESSAGE";
const READ = "READ";

export default class SocketService {
  socket: io.Server;
  USER_SOCKETS = {};

  constructor(server: Server) {
    console.log("--------------------");
    console.log("SOCKET INITITALIZED");
    console.log("--------------------");

    this.socket = io(server, { transports: ["websocket"] });

    this.socket.on("connection", socket => {
      console.log("A USER JUST CONNECTED");
      socket.on(JOIN, user_id => {
        console.log("USER JOINED", user_id);
        this.USER_SOCKETS[user_id] = socket;
      });

      socket.on(LOGOUT, user_id => {
        console.log("USER DISCONNECTED");
        delete this.USER_SOCKETS[user_id];
      });
    });
  }

  getAdminSockets() {
    return Object.keys(this.USER_SOCKETS).filter(
      socket => socket.indexOf(`_ADMIN`) > -1
    );
  }

  emitToAgentAndAdmin(toEmit, agent, event: string) {
    const payload = {};
    Object.keys(toEmit).forEach(key => (payload[key] = toEmit[key]));

    const adminSockets = this.getAdminSockets();
    const agentSocket = this.USER_SOCKETS[agent];
    if (agentSocket) {
      agentSocket.emit(event, payload);
    }
    adminSockets.forEach(socket => {
      const adminSocket = this.USER_SOCKETS[socket];
      adminSocket.emit(event, payload);
    });
  }

  emitToAdmin(toEmit, event: string) {
    const payload = {};
    Object.keys(toEmit).forEach(key => (payload[key] = toEmit[key]));
    const adminSockets = this.getAdminSockets();
    adminSockets.forEach(socket => {
      const adminSocket = this.USER_SOCKETS[socket];
      adminSocket.emit(event, payload);
    });
  }

  emitToAgent(toEmit, agent, event: string) {
    const payload = {};
    Object.keys(toEmit).forEach(key => (payload[key] = toEmit[key]));
    const agentSocket = this.USER_SOCKETS[agent];
    if (agentSocket) {
      agentSocket.emit(event, payload);
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
    const { message, agent, queue } = payload;
    this.emitToAgentAndAdmin({ message, queue }, agent, CLIENT_MESSAGE);
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

  //emit read
  emitReadQueueMessages(payload) {
    console.log("emit read qeue messages");
    const { queue, agent } = payload;
    this.emitToAgentAndAdmin({ queue }, agent, READ);
  }

  emitEndQueue(payload) {
    console.log("emit end queue to admins and agent");
    const { queue, agent } = payload;
    console.log("emite agent", agent);
    this.emitToAgentAndAdmin({ queue }, agent, END_QUEUE);
  }
}
