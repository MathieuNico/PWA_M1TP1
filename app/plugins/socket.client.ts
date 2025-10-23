import { io } from 'socket.io-client'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  const socket = io('http://localhost:3000') // adapte si backend externe

  socket.on('connect', () => {
    console.log('✅ Connecté au serveur Socket.IO', socket.id)
  })

  socket.on('disconnect', () => {
    console.log('❌ Déconnecté du serveur')
  })

  return {
    provide: {
      socket
    }
  }
})
