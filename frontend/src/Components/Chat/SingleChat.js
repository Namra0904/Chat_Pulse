import React, { useState , useEffect} from 'react'
import { ChatState } from '../../Context/ChatProvider.js'
import { Box, FormControl, IconButton, Spinner, Text ,Input, useToast} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons"
import { getSender } from '../../Config/ChatLogic.js';
import ProfileModel from './ProfileModel.js';
import { getSenderFull } from '../../Config/ChatLogic.js';
import UpdateGroupChatModal from './UpdateGroupChatModal.js';
import axios from 'axios';
import ScrollableChat from './ScrollableChat.js';
import "./style.css"
import { isSameSender } from '../../Config/ChatLogic.js';
import io from 'socket.io-client'



const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

  const { user, selectedChat, setSelectedChat,notification,setNotification } = ChatState()
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [istyping,setIsTyping] = useState(false)
  const toast = useToast()

 

    useEffect(() => {
      socket = io(ENDPOINT);
      socket.emit("setup", user.data);
      socket.on("connected", () => {
        setSocketConnected(true);
      });
      socket.on('typing', () => setTyping(true))
      socket.on('stop typing',()=>setIsTyping(false))
    },[]);
  
  const fetchMessages = async () => {
    if (!selectedChat) return;
  

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `${process.env.REACT_APP_HOST}/api/message/${selectedChat._id}`,
        config
      );
      setMessage(data);
      setLoading(false);
      socket.emit('join chat',selectedChat._id)
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

    useEffect(() => {
      fetchMessages();
      selectedChatCompare = selectedChat
    }, [selectedChat]);
  
  console.log(notification, "----------");
  
 useEffect(() => {
   socket.on("message recieved", (newMessageRecieved) => {
     if (
       !selectedChatCompare ||
       selectedChatCompare._id !== newMessageRecieved.chat._id
     ) {
       if (!notification.includes(newMessageRecieved)) {
         setNotification([newMessageRecieved, ...notification]);
         setFetchAgain(!fetchAgain);
       }
     } else {
       setMessage([...message, newMessageRecieved]);
     }
   });
 });

  
 
  const sendMessage = async(e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit('stop typing',selectedChat._id)
      try {
          const config = {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.data.token}`,
            },
        };
          const { data } = await axios.post(
            `${process.env.REACT_APP_HOST}/api/message`,
            {
              content: newMessage,
              chatId: selectedChat._id,
            },
            config
        );
        console.log(data)
        setNewMessage("");
        setMessage([...message, data])
        socket.emit("new message",data);
      } catch (error) {
         toast({
           title: "Error Occured!",
           description: "Failed to send the Message",
           status: "error",
           duration: 5000,
           isClosable: true,
           position: "bottom",
         });
      }
    }
  }


 const typingHandler = (e) => {
   setNewMessage(e.target.value);

   if (!socketConnected)
     return console.log("error")
   if (!typing) {
     setTyping(true);
     socket.emit("typing", selectedChat._id);
   }
   let lastTypingTime = new Date().getTime();
   var timerLength = 3000;
   setTimeout(() => {
     var timeNow = new Date().getTime();
     var timeDiff = timeNow - lastTypingTime;
     if (timeDiff >= timerLength && typing) {
       socket.emit("stop typing", selectedChat._id);
       setTyping(false);
     }
   }, timerLength);
 };

  return (
    <>
      {selectedChat ? (
        <>
          <>
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              pb={3}
              px={2}
              w="100%"
              fontFamily="Work sans"
              display="flex"
              justifyContent={{ base: "space-between" }}
              alignItems="center"
            >
              <IconButton
                display={{ base: "flex", md: "none" }}
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedChat("")}
              />
              {!selectedChat.isGroupChat ? (
                <>
                  {getSender(user.data, selectedChat.users)}
                  <ProfileModel
                    user={getSenderFull(user.data, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              )}
            </Text>
            <Box
              display="flex"
              flexDir="column"
              justifyContent="flex-end"
              p={3}
              bg="#E8E8E8"
              w="100%"
              h="100%"
              borderRadius="lg"
              overflowY="hidden"
            >
              {loading ? (
                <Spinner
                  size="xl"
                  w={20}
                  h={20}
                  alignSelf="center"
                  margin="auto"
                />
              ) : (
                <div className="messages">
                  <ScrollableChat message={message} />
                </div>
              )}
              <FormControl
                onKeyDown={sendMessage}
                id="first-name"
                isRequired
                mt={3}
              >
                {istyping ? <div>Someone is typing...</div> : null}
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message.."
                  value={newMessage}
                  onChange={typingHandler}
                />
              </FormControl>
            </Box>
          </>
        </>
      ) : (
        <>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            h="100%"
          >
            <Text fontSize="3xl" pb={3} fontFamily="Work sans" fontWeight="700">
              Click on a user to start chatting
            </Text>
          </Box>
        </>
      )}
    </>
  );
}

export default SingleChat