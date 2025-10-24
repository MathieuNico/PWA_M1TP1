import { describe, it, expect, beforeEach } from 'vitest'
import {
  userStorage,
  roomsStorage,
  type User,
  type Room
} from '../../app/utils/storage'

describe('Storage Utils - Tests basiques', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('userStorage', () => {
    const mockUser: User = {
      username: 'testuser',
      avatar: 'data:image/jpeg;base64,test'
    }

    it('doit retourner null quand aucun utilisateur n\'est stocké', () => {
      expect(userStorage.get()).toBeNull()
    })

    it('doit sauvegarder un utilisateur', () => {
      const result = userStorage.set(mockUser)
      expect(result).toBe(true)
    })

    it('doit supprimer un utilisateur', () => {
      userStorage.set(mockUser)
      const result = userStorage.remove()
      expect(result).toBe(true)
    })
  })

  describe('roomsStorage', () => {
    const mockRooms: Room[] = [
      {
        id: 'room1',
        name: 'Room 1',
        description: 'Description 1',
        createdAt: Date.now()
      }
    ]

    it('doit retourner un tableau vide par défaut', () => {
      expect(roomsStorage.getAll()).toEqual([])
    })

    it('doit trouver une room inexistante', () => {
      expect(roomsStorage.findById('inexistant')).toBeNull()
    })
  })
})