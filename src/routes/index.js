const express = require('express')

const router = express.Router()

const { auth } = require('../middlewares/auth')
const { uploadFile } = require('../middlewares/uploadFile')
const { replaceFile } = require('../middlewares/replaceFile')

const { register, login, checkAuth } = require('../controllers/auth')
const { addUsers, getUsers, getUser, updateUser, deleteUser } = require('../controllers/user')
const { addBlog, getBlogs, getBlog, updateBlog, deleteBlog, getBlogUser } = require('../controllers/blog')
const { addBookmark, getBookmarks, getBookmark, deleteBookmark, getUserBookmarks } = require('../controllers/bookmark')

router.post('/user', addUsers)
router.get('/users', getUsers)
router.get('/user/:id', getUser)
router.patch('/user/:id', updateUser)
router.delete('/user/:id', deleteUser)

router.post('/register', register)
router.post('/login', login)
router.get("/check-auth", auth, checkAuth);

// router.post('/blog', auth, uploadFile('image'), addBlog)
router.post("/blog", auth, uploadFile("image"), addBlog)
router.get('/blogs', getBlogs)
router.get('/blog/:id', getBlog)
router.get("/blogUser/:id", getBlogUser);
router.patch('/blog/:id', auth, replaceFile('image'), updateBlog)
router.delete('/blog/:id', auth, deleteBlog)

router.post('/bookmark', auth, addBookmark)
router.get('/bookmarks', getBookmarks)
router.get('/user-bookmarks', getUserBookmarks)
router.get('/bookmark/:id', getBookmark)
router.delete('/bookmark/:id', auth, deleteBookmark)

module.exports = router
