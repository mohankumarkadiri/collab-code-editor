const router = require('express').Router();
const { canAccessRoom } = require('../../middlewares/auth');
const { createRoom, inviteUser, fetchRoomDetails, fetchRooms } = require('../controllers/room');

router.get('/', fetchRooms);
router.post('/', createRoom);
router.get('/:roomId', fetchRoomDetails);
router.get('/:roomId/join', canAccessRoom, (_, res) => res.sendStatus(200));
router.post('/:roomId/invite', canAccessRoom, inviteUser);

module.exports = router;