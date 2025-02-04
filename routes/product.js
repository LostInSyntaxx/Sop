const  express = require('express')
const router = express.Router()
const { create, list, read, update ,listBy, remove, searchFilters } = require('../controllers/Shop')

router.post('/product', create)
router.get('/products/:count', list)
router.get('/product/:id', read)
router.put('/product/:id', update)
router.delete('/product/:id', remove)
router.post('/productBy', listBy)
router.post('/search/filters',searchFilters)


module.exports = router