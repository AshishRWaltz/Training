/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import router from '@adonisjs/core/services/router'
import './routes/users.js'
import './routes/admin.js'

router.get('/', () => {
  return 'Hello World'
})
