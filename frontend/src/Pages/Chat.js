import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box } from '@chakra-ui/react'
import SideDrawer from '../Components/Chat/SideDrawer'
import MyChats from '../Components/Chat/MyChats'
import ChatBox from '../Components/Chat/ChatBox'
import { set } from 'mongoose'
import { useState } from 'react'
const Chat = () => {

  const { user } = ChatState()
  const [fetchChats,setFetchAgain] = useState(false)
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10">
        {user && (
          <MyChats fetchChat={fetchChats} />
        )}
        {user && (
          <ChatBox fetchChats={fetchChats} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
}

export default Chat
