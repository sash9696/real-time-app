import Message from "../models/messageModel.js";
import Chat from "../models/chatModel.js";

export const sendMessage = async (req, res) => {
  const { chatId, message } = req.body;

  // Basic validation
  if (!chatId || !message) {
    return res.status(400).json({
      message: "chatId and message are required",
    });
  }

  try {
    // Step 1: Store message in database
    let msg = await Message.create({
      sender: req.rootUserId,
      message,
      chatId,
    });

    // Step 2: Populate sender and chat details for frontend use
    msg = await (
      await msg.populate("sender", "name profilePic email")
    ).populate({
      path: "chatId",
      select: "chatName isGroup users",
      model: "Chat",
      populate: {
        path: "users",
        select: "name email profilePic",
        model: "User",
      },
    });

    // Step 3: Update latestMessage field in Chat for fast chat listing
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: msg,
    });

    // Note: Socket emission is handled by the client via 'new message' event
    // The server broadcasts it in the socket handler, so we don't emit here
    // to avoid duplicate messages

    return res.status(200).json(msg);

  } catch (error) {
    console.error("Send Message Error:", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getMessages = async (req, res) => {
  const { chatId } = req.params;

  // ChatId is mandatory to fetch messages
  if (!chatId) {
    return res.status(400).json({
      message: "chatId is required",
    });
  }

  try {
    // Fetch messages of a chat sorted by creation time
    const messages = await Message.find({ chatId })
      .populate({
        path: "sender",
        model: "User",
        select: "name profilePic email",
      })
      .populate({
        path: "chatId",
        model: "Chat",
      });

    return res.status(200).json(messages);

  } catch (error) {
    console.error("Get Messages Error:", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};
