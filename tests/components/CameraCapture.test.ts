import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CameraCapture from '../../app/components/CameraCapture.vue'

describe('CameraCapture.vue', () => {
  it('ne doit pas être visible quand isOpen est false', () => {
    const wrapper = mount(CameraCapture, {
      props: { isOpen: false }
    })
    
    expect(wrapper.find('.camera-modal').exists()).toBe(false)
  })

  it('doit être visible quand isOpen est true', () => {
    const wrapper = mount(CameraCapture, {
      props: { isOpen: true }
    })
    
    expect(wrapper.find('.camera-modal').exists()).toBe(true)
    expect(wrapper.find('.camera-header h3').text()).toBe('📸 Capture Photo')
  })
})