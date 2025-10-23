import { Server as SocketIOServer } from 'socket.io'
import { defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  setup(_, nuxt) {
    nuxt.hook('listen', (server) => {
      const io = new SocketIOServer(server, {
        cors: {
          origin: 'http://localhost:3000',
        }
      })

      io.on('connection', (socket) => {
        console.log('🔌 Client connecté :', socket.id)

        socket.on('message', (data) => {
          console.log('📩 Reçu du client:', data)
          socket.emit('reply', `Reçu : ${data}`)
        })

        socket.on('disconnect', () => {
          console.log('❌ Client déconnecté :', socket.id)
        })
      })

      // garder l'instance pour pouvoir l'utiliser ailleurs si besoin
      ;(globalThis as any).io = io
    })
  }
})
