const roomModel = require('../../models/room');
const { fetchRoomDetails: fetchRoomDetailsService } = require('../../services/room');


const createRoom = async (req, res) => {
    try {
        const { email } = req.user || {}
        const room = await roomModel.create({ host: email, users: [email] })
        return res.status(200).send(room);
    } catch (error) {
        return res.status(500).send({ message: error?.message || 'Failed to create new room' });
    }
}

const inviteUser = async (req, res) => {
    try {
        const { roomId } = req.params;
        const { email } = req.body;
        const { email: hostEmail } = req.user || {};

        const room = await roomModel.findById(roomId);
        if (!room || room.host != hostEmail) return res.status(403).send('Not authorized to invite users');
        await roomModel.findByIdAndUpdate(roomId, { $addToSet: { users: email } });
        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).send({ message: error?.message || 'Failed to invite the user' });
    }
}

const fetchRoomDetails = async (req, res) => {
    try {
        const { roomId } = req.params;
        const { email } = req.user || {};
        const roomDetails = await roomModel.findById(roomId).lean();
        if (!roomDetails || !roomDetails.users.includes(email)) {
            return res.status(404).send({ message: "Room does not exist" });
        }
        const { users, language, code, error } = await fetchRoomDetailsService(roomId);
        if (error) return res.status(500).send({ message: error });
        return res.status(200).send({ ...roomDetails, users, language, code });
    } catch (error) {
        return res.status(500).send({ message: error.message || 'Failed to fetch room details' });
    }
}

const fetchRooms = async (req, res) => {
    try {
        const { email } = req.user || {};
        const rooms = await roomModel.find({ users: email });
        return res.status(200).send(rooms);
    } catch (error) {
        return res.status(500).send({ message: error.message || "Failed to fetch rooms" });
    }

}

module.exports = {
    createRoom,
    inviteUser,
    fetchRoomDetails,
    fetchRooms,
}