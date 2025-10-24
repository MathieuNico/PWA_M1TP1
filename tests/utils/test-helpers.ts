import { mount } from '@vue/test-utils'
import { vi } from 'vitest'

/**
 * Utilitaires pour les tests Vue
 */
export const createMockNavigate = () => {
  return vi.fn()
}

export const createMockInject = (mocks: Record<string, any> = {}) => {
  return vi.fn().mockImplementation((key: string) => {
    return mocks[key] || vi.fn()
  })
}

export const createMockProps = (overrides: Record<string, any> = {}) => {
  return {
    isOpen: false,
    ...overrides
  }
}

/**
 * Helper pour créer un composant avec les mocks courants
 */
export const mountWithMocks = (component: any, options: any = {}) => {
  const defaultMocks = {
    navigate: createMockNavigate(),
    currentRoomId: { value: 'test-room' }
  }

  return mount(component, {
    global: {
      provide: {
        ...defaultMocks,
        ...options.provide
      },
      mocks: {
        ...options.mocks
      }
    },
    ...options
  })
}

/**
 * Helper pour simuler un utilisateur connecté
 */
export const mockLoggedUser = () => {
  const user = {
    username: 'test-user',
    avatar: 'data:image/jpeg;base64,mock-avatar'
  }
  
  localStorage.getItem = vi.fn().mockImplementation((key) => {
    if (key === 'pwa_user') return JSON.stringify(user)
    return null
  })
  
  return user
}

/**
 * Helper pour simuler des rooms dans localStorage
 */
export const mockRooms = () => {
  const rooms = [
    {
      id: 'room1',
      name: 'Room Test 1',
      description: 'Description test',
      createdAt: Date.now()
    },
    {
      id: 'room2', 
      name: 'Room Test 2',
      description: 'Autre description',
      createdAt: Date.now()
    }
  ]

  localStorage.getItem = vi.fn().mockImplementation((key) => {
    if (key === 'pwa_rooms') return JSON.stringify(rooms)
    return null
  })

  return rooms
}

/**
 * Helper pour simuler des messages
 */
export const mockMessages = (roomId: string = 'test-room') => {
  const messages = [
    {
      id: 'msg1',
      username: 'user1',
      userId: 'user1',
      text: 'Hello world!',
      timestamp: Date.now() - 1000
    },
    {
      id: 'msg2',
      username: 'user2', 
      userId: 'user2',
      text: 'Hi there!',
      timestamp: Date.now()
    }
  ]

  localStorage.getItem = vi.fn().mockImplementation((key) => {
    if (key === `pwa_messages_${roomId}`) return JSON.stringify(messages)
    return null
  })

  return messages
}