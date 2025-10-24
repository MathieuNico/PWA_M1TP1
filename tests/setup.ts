import { vi, beforeEach } from 'vitest'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  configurable: true
})

// Mock confirm
Object.defineProperty(window, 'confirm', {
  value: vi.fn().mockReturnValue(true),
  configurable: true
})

// Mock navigator.mediaDevices
Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    getUserMedia: vi.fn().mockResolvedValue({
      getTracks: vi.fn().mockReturnValue([
        { stop: vi.fn() }
      ])
    })
  }
})

// Mock Notification as a proper constructor
const NotificationMock = vi.fn().mockImplementation(function(this: any, title: string, options?: any) {
  this.title = title
  this.body = options?.body
  this.icon = options?.icon
  return this
})

Object.defineProperty(NotificationMock, 'permission', {
  value: 'granted',
  configurable: true
})

Object.defineProperty(NotificationMock, 'requestPermission', {
  value: vi.fn().mockResolvedValue('granted'),
  configurable: true
})

Object.defineProperty(window, 'Notification', {
  value: NotificationMock,
  configurable: true
})

// Mock HTMLCanvasElement.getContext
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  drawImage: vi.fn(),
})

HTMLCanvasElement.prototype.toDataURL = vi.fn().mockReturnValue('data:image/jpeg;base64,mock-image-data')

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks()
  localStorageMock.getItem.mockReturnValue(null)
  localStorageMock.setItem.mockReturnValue(undefined)
  localStorageMock.removeItem.mockReturnValue(undefined)
  localStorageMock.clear.mockReturnValue(undefined)
})