const router = require('express').Router();
const { isAuthenticated } = require('../../middlewares/auth');
const healthRoutes = require('./health');
const roomRoutes = require('./room');
const authRoutes = require('./auth');

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/room', isAuthenticated, roomRoutes);
router.use('/api', isAuthenticated, (req, res) => res.status(200).send(req.user));

module.exports = router