import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ReceptionPage from '../../app/components/ReceptionPage.vue'

describe('ReceptionPage.vue', () => {
  it('doit afficher le formulaire de connexion par défaut', () => {
    const wrapper = mount(ReceptionPage, {
      global: {
        provide: {
          navigate: () => {}
        }
      }
    })
    
    expect(wrapper.find('.login-section').exists()).toBe(true)
    expect(wrapper.find('h2').text()).toBe('Connexion')
  })
})