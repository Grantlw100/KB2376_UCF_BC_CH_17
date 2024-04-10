const router = require('express').Router();
const {
  createUser,
  getSingleUser,
  saveBook,
  deleteBook,
  login,
} = require('../../../../../../bootcamp-1/UCF-VIRT-FSF-PT-10-2023-U-LOLC/UCF-VIRT-FSF-PT-10-2023-U-LOLC/21-MERN/02-Challenge/Develop/serverS/controllers/user-controller');

// import middleware
const { authMiddleware } = require('../../../../../../bootcamp-1/UCF-VIRT-FSF-PT-10-2023-U-LOLC/UCF-VIRT-FSF-PT-10-2023-U-LOLC/21-MERN/02-Challenge/Develop/serverS/utils/auth');

// put authMiddleware anywhere we need to send a token for verification of user
router.route('/').post(createUser).put(authMiddleware, saveBook);

router.route('/login').post(login);

router.route('/me').get(authMiddleware, getSingleUser);

router.route('/books/:bookId').delete(authMiddleware, deleteBook);

module.exports = router;
