import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js'

Vue.component('loader', {
  template: `
    <div style="display: flex; justify-content: center; align-items: center">
      <div class="spinner-border" role="status"> 
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  `
})

new Vue({
  el: '#app',
  data() {
    return {
      loading: false,
      form: {
        name: '',
        value: '',
      },
      contacts: []
    }
  },
  computed: {
    canCreate() {
      return this.form.name.trim() && this.form.value.trim()
    }
  },
  methods: {
    async createContact() {
      const {...contact} = this.form

      const newContact = await request('/api/contacts', 'POST', contact)

      this.contacts.push(newContact)

      this.form.value = this.form.name = ''

    },
    async markContact(id) {
      const contact = this.contacts.find(e => e.id === id)
      const markedContact = await request(`api/contacts/${id}`, 'PUT', {
        ...contact,
        marked: true
      })
      contact.marked = markedContact.marked
    },
    async removeContact(id) {
      const deletedContact = await request(`api/contacts/${id}`, 'DELETE')
      this.contacts = this.contacts.filter(e => e.id !== id)

      // console.log('deletedContact: ', deletedContact); // getting message
    }
  },
  async mounted() {
    this.loading = true

    // this.contacts = await request('/api/contacts')
    const data = await request('/api/contacts')

    setTimeout(() => { // to see loading
      this.contacts = data
      this.loading = false
    }, 1000)

  }
})

async function request(url, method = 'GET', data = null) {
  try {
    const headers = {}
    let body

    if(data) {
      headers['Content-Type'] = 'application/json'
      body = JSON.stringify(data)
    }

    const response = await fetch(url, {
      method,
      headers,
      body
    })

    return await response.json()
  } catch (e) {
    console.warn('Error: ', e.message);
  }

}