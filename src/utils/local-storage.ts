import store from 'store'
import expirePlugin from 'store/plugins/expire'
import sessionStorage from 'store/storages/sessionStorage'

// plugin usage:
store.addPlugin(expirePlugin)

export { store as localStorage, sessionStorage }
