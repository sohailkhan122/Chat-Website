const Group = require('../models/groups model');

const createGroup = async (req, res) => {
  const { groupName, adminId, image } = req.body;

  try {
    const group = new Group({
      name: groupName,
      admin: adminId,
      members: [adminId],
      image: image
        ? {
          data: Buffer.from(image, 'base64'),
          contentType: req.headers['content-type'] || 'application/octet-stream',
        }
        : null,
    });

    await group.save();

    return res.status(201).json(group);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const addMember = async (req, res) => {
  const groupId = req.body.groupId;
  const memberId = req.body.memberId;

  try {
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    if (group.members.includes(memberId)) {
      return res.status(400).json({ error: 'Member already exists in the group' });
    }

    group.members.push(memberId);
    await group.save();

    return res.status(200).json({ message: 'Member added successfully', group });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate('admin', 'name email');

    return res.status(200).json(groups);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


const sendMessage = async (req, res) => {
  const groupId = req.params.groupId;
  const { senderId, text, image } = req.body;

  try {
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const newMessage = {
      sender: senderId,
      text,
      image: image
        ? {
          data: Buffer.from(image, 'base64'),
          contentType: req.headers['content-type'] || 'application/octet-stream',
        }
        : null,
      createdAt: new Date(),
    };

    group.messages.push(newMessage);
    await group.save();

    return res.status(200).json({ message: 'Message sent successfully', group });
  } catch (error) {
    console.error(error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error', details: error.message });
    }

    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getMessages = async (req, res) => {
  const groupId = req.params.groupId;

  try {
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const messages = group.messages;
    return res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports = { createGroup, addMember, getAllGroups, sendMessage, getMessages };
