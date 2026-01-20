import { io } from "socket.io-client";

export default defineNuxtPlugin(() => {
  const socket = io('https://api.tools.gavago.fr', {
    path: '/socket.io', // Standard path, NOT /socketio/
    transports: ['websocket'], // Reference uses websocket only
    autoConnect: true,
    withCredentials: true // Keeping this as cookies seem involved
  });

  return {
    provide: {
      socket: socket
    }
  }
});
