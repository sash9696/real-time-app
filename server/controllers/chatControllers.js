
import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";


export const accessChats = async (req,res) => {

    ///extract the userId of the person we want to chat with

    const {userId} = req.body;

    // validate input

    if(!userId){
        return res.status(400).json({
            message:`Provide User's Id`,
        })
    };

    try {

        //check if 1:1 chat already exists between both users
        // isGroup: false its a direct chat
        //$all ensures both users must be present in the users array


        let chatExists = await Chat.findOne({
            isGroup:false,
            users: {$all: [userId, req.rootUserId]}
        })
        .populate("users", "-password") //remove the password field for security
        .populate("latestMessage")

        if(chatExists){
            chatExists = await User.populate(chatExists, {
                path:"latestMesssage.sender",
                select:"name email profilePic"
            });
            return res.status(200).json(chatExists)
        }
        // if chat exists -> populate sender details of last message and return exisitng chat

        //if chat does not exists -> create one on one chat

        const chatData = {
            chatName: "sender",
            users: [userId, req.rootUserId],
            isGroup:false
        };

        const newChat = await Chat.create(chatData);

        //populate users before sending response
        const fullChat = await Chat.findById(newChat._id)
            .populate("users", "-password")

        return res.status(201).json(fullChat);
        
    } catch (error) {
        console.log('Access chats error', error);
        return res.status(500).json({message:"Internal server Error"});
    }

}

export const fetchAllChats = async (req,res) => {

    //fetch direct + group chats
    //where the logged in user is either a member or groupd admin

    try {

        //find chats wher
        //1.user exists inside the users array
        //or usr is a groupd admin


        const chats = await Chat.find({
            $or:[
                {users: {$elemMatch: {$eq: req.rootUserId}}}, //direct or a group member
                {groupAdmin: req.rootUserId} //groupAdmin
            ]
        })
            .populate("users", "-password")
            .populate("latestMessage")
            .populate("groupAdmin", "-password")
            .sort({updatedAt: -1})


            const finalChats = await Chat.populate(chats,{
                path:"latesMessage.sender",
                select: "name email profilePic"
            })

            res.status(200).json(finalChats)
        
    } catch (error) {
        console.log('Failed to fetch chats: ', error)
        res.status(500).json({
            message:'Failed to fetch chats'
        })


    
}
}

export const createGroup = async (req, res) => {
    // chatName = group name, users = JSON string of userIds
    const { chatName, users } = req.body;
  
    // Basic input validation
    if (!chatName || !users) {
      return res.status(400).json({
        message: "Please provide chat name and users",
      });
    }
  
    // Users are sent as string from frontend, so we must parse
    let parsedUsers;
    try {
      parsedUsers = JSON.parse(users);
    } catch (err) {
      return res.status(400).json({ message: "Invalid users format" });
    }
  
    // Minimum 3 people required: admin + 2 users
    if (parsedUsers.length < 2) {
      return res.status(400).json({
        message: "Group should contain at least 3 users",
      });
    }
  
    // Logged-in user must always be part of the group
    parsedUsers.push(req.rootUserId);
  
    try {
      // Create group with admin
      const chat = await Chat.create({
        chatName,
        users: parsedUsers,
        isGroup: true,
        groupAdmin: req.rootUserId,
      });
  
      // Populate users & admin before sending to frontend
      const createdChat = await Chat.findById(chat._id)
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
  
      return res.status(201).json(createdChat);
  
    } catch (error) {
      console.error("Create Group Error:", error);
      return res.status(500).json({ message: "Failed to create group" });
    }
  };
  
  export const renameGroup = async (req, res) => {
    const { chatId, chatName } = req.body;
  
    // Both chatId and new name are mandatory
    if (!chatId || !chatName) {
      return res.status(400).json({
        message: "Provide Chat ID and new Chat Name",
      });
    }
  
    try {
      // new:true ensures we get updated document
      const chat = await Chat.findByIdAndUpdate(
        chatId,
        { $set: { chatName } },
        { new: true }
      )
        .populate("groupAdmin", "-password")
        .populate("users", "-password");
  
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
  
      return res.status(200).json(chat);
  
    } catch (error) {
      console.error("Rename Group Error:", error);
      return res.status(500).json({ message: "Server Error" });
    }
  };
  
  export const addToGroup = async (req, res) => {
    const { userId, chatId } = req.body;
  
    // Validation
    if (!userId || !chatId) {
      return res.status(400).json({
        message: "Provide userId and chatId",
      });
    }
  
    try {
      // First check if group exists
      const existing = await Chat.findById(chatId);
  
      if (!existing) {
        return res.status(404).json({ message: "Chat not found" });
      }
  
      // Prevent duplicate users in group
      if (existing.users.includes(userId)) {
        return res.status(409).json({
          message: "User already exists in group",
        });
      }
  
      // $push adds new user without overwriting existing users
      const chat = await Chat.findByIdAndUpdate(
        chatId,
        { $push: { users: userId } },
        { new: true }
      )
        .populate("groupAdmin", "-password")
        .populate("users", "-password");
  
      return res.status(200).json(chat);
  
    } catch (error) {
      console.error("Add To Group Error:", error);
      return res.status(500).json({ message: "Server Error" });
    }
  };
  
  export const removeFromGroup = async (req, res) => {
    const { userId, chatId } = req.body;
  
    try {
      // Check if group exists
      const existing = await Chat.findById(chatId);
  
      if (!existing) {
        return res.status(404).json({
          message: "Chat not found",
        });
      }
  
      // Group admin cannot be removed directly
      if (existing.groupAdmin?.toString() === userId) {
        return res.status(403).json({
          message: "You can't remove the group admin",
        });
      }
  
      // User must exist in group before removal
      if (!existing.users.includes(userId)) {
        return res.status(409).json({
          message: "User does not exist in this group",
        });
      }
  
      // $pull removes the userId from users array
      const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { $pull: { users: userId } },
        { new: true }
      )
        .populate("groupAdmin", "-password")
        .populate("users", "-password");
  
      return res.status(200).json(updatedChat);
  
    } catch (error) {
      console.error("Remove From Group Error:", error);
      return res.status(500).json({
        message: "Server error",
      });
    }
  };