// Utilitaires pour la gestion du localStorage dans l'application PWA

export interface User {
  username: string
  avatar?: string
}

export interface Room {
  id: string
  name: string
  description: string
  createdAt: number
}

export interface Message {
  id: string
  username: string
  userId: string
  avatar?: string
  text?: string
  image?: string
  timestamp: number
}

export interface GalleryItem {
  id: string
  data: string
  timestamp: number
  roomId?: string
  roomName?: string
}

/**
 * Gestion de l'utilisateur connecté
 */
export const userStorage = {
  get(): User | null {
    try {
      const stored = localStorage.getItem('pwa_user')
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error('Erreur lors de la lecture de l\'utilisateur:', error)
      return null
    }
  },

  set(user: User): boolean {
    try {
      localStorage.setItem('pwa_user', JSON.stringify(user))
      return true
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error)
      return false
    }
  },

  remove(): boolean {
    try {
      localStorage.removeItem('pwa_user')
      return true
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error)
      return false
    }
  }
}

/**
 * Gestion des salles de discussion
 */
export const roomsStorage = {
  getAll(): Room[] {
    try {
      const stored = localStorage.getItem('pwa_rooms')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Erreur lors de la lecture des rooms:', error)
      return []
    }
  },

  save(rooms: Room[]): boolean {
    try {
      localStorage.setItem('pwa_rooms', JSON.stringify(rooms))
      return true
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des rooms:', error)
      return false
    }
  },

  add(room: Room): boolean {
    const rooms = this.getAll()
    rooms.push(room)
    return this.save(rooms)
  },

  remove(roomId: string): boolean {
    const rooms = this.getAll().filter(r => r.id !== roomId)
    const success = this.save(rooms)
    
    // Supprimer aussi les messages de cette room
    if (success) {
      messagesStorage.removeAll(roomId)
    }
    
    return success
  },

  findById(roomId: string): Room | null {
    const rooms = this.getAll()
    return rooms.find(r => r.id === roomId) || null
  }
}

/**
 * Gestion des messages par room
 */
export const messagesStorage = {
  get(roomId: string): Message[] {
    try {
      const stored = localStorage.getItem(`pwa_messages_${roomId}`)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error(`Erreur lors de la lecture des messages (${roomId}):`, error)
      return []
    }
  },

  save(roomId: string, messages: Message[]): boolean {
    try {
      localStorage.setItem(`pwa_messages_${roomId}`, JSON.stringify(messages))
      return true
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde des messages (${roomId}):`, error)
      return false
    }
  },

  add(roomId: string, message: Message): boolean {
    const messages = this.get(roomId)
    messages.push(message)
    return this.save(roomId, messages)
  },

  removeAll(roomId: string): boolean {
    try {
      localStorage.removeItem(`pwa_messages_${roomId}`)
      return true
    } catch (error) {
      console.error(`Erreur lors de la suppression des messages (${roomId}):`, error)
      return false
    }
  }
}

/**
 * Gestion de la galerie photo
 */
export const galleryStorage = {
  getAll(): GalleryItem[] {
    try {
      const stored = localStorage.getItem('pwa_gallery')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Erreur lors de la lecture de la galerie:', error)
      return []
    }
  },

  save(items: GalleryItem[]): boolean {
    try {
      localStorage.setItem('pwa_gallery', JSON.stringify(items))
      return true
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la galerie:', error)
      return false
    }
  },

  add(item: GalleryItem): boolean {
    const items = this.getAll()
    items.push(item)
    return this.save(items)
  },

  remove(itemId: string): boolean {
    const items = this.getAll().filter(item => item.id !== itemId)
    return this.save(items)
  },

  clear(): boolean {
    try {
      localStorage.removeItem('pwa_gallery')
      return true
    } catch (error) {
      console.error('Erreur lors de la suppression de la galerie:', error)
      return false
    }
  }
}

/**
 * Vérification de la disponibilité du localStorage
 */
export const storageUtils = {
  isAvailable(): boolean {
    try {
      const test = '__storage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  },

  getUsage(): { used: number; total: number; percentage: number } {
    if (!this.isAvailable()) {
      return { used: 0, total: 0, percentage: 0 }
    }

    let used = 0
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length
      }
    }

    // Estimation approximative de la limite (5-10MB selon les navigateurs)
    const total = 5 * 1024 * 1024 // 5MB en bytes
    const percentage = Math.round((used / total) * 100)

    return { used, total, percentage }
  },

  clearAll(): boolean {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Erreur lors de la suppression complète:', error)
      return false
    }
  }
}

/**
 * Utilitaires pour les notifications
 */
export const notificationUtils = {
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied'
    }

    if (Notification.permission === 'granted') {
      return 'granted'
    }

    if (Notification.permission !== 'denied') {
      return await Notification.requestPermission()
    }

    return 'denied'
  },

  canSend(): boolean {
    return 'Notification' in window && Notification.permission === 'granted'
  },

  send(title: string, options: NotificationOptions = {}): Notification | null {
    if (!this.canSend()) {
      return null
    }

    const defaultOptions: NotificationOptions = {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      ...options
    }

    return new Notification(title, defaultOptions)
  }
}
