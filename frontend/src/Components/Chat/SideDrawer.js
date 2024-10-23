import { Input,useDisclosure,Box, Button, Tooltip, Text, Menu, MenuButton, MenuList, Avatar, MenuIcon, MenuItem, MenuDivider,useToast } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import React from 'react'
import { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModel from './ProfileModel';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from './ChatLoading.js';
import { Spinner } from "@chakra-ui/react";
import UserListItem from './UserListItem.js';
import logo from "../../Assests/chat-pulse-high-resolution-logo-transparent.png";
import { useEffect } from 'react';
import "../../App.css"

import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import { getSender } from '../../Config/ChatLogic.js';

const SideDrawer = () => {

     const [search, setSearch] = useState("");
     const [searchResult, setSearchResult] = useState([]);
     const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

     const toast = useToast();
     const { isOpen, onOpen, onClose } = useDisclosure();
    const history = useHistory()
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();

    const [slideUp, setSlideUp] = useState(false);
    useEffect(() => {
      setSlideUp(true); 
    }, [notification]);
   
   
  
  
      const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        history.push("/");
    };
    
    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please Enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.data.token}`,
                },
            };

            const { data } = await axios.get(
                `${process.env.REACT_APP_HOST}/api/user?search=${search}`,
                config
            );

            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
        
    }
    const accessChat = async (userId) => {
      try {
        setLoadingChat(true); 
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.data.token}`,
          },
        };

        const { data } = await axios.post(
          `${process.env.REACT_APP_HOST}/api/chat`,
          { userId },
          config
        );

        if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
        setSelectedChat(data);
        setLoadingChat(false); 
        onClose();
      } catch (error) {
        toast({
          title: "Error Fetching the chat",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
        setLoadingChat(false); 
      }
  };

    
    return (
      <>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          bg="white"
          w="100%"
          p="5px 10px"
          borderWidth="5px"
        >
          {/* Left-aligned search button */}
          <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
            <Button variant="ghost" onClick={onOpen}>
              <i className="fas fa-search"></i>
              <Text display={{ base: "none", md: "flex" }} px={4}>
                Search User
              </Text>
            </Button>
          </Tooltip>

          <img src={logo} height="150px" width="150px" />
          <div>
            <Menu>
              <MenuButton p={1}>
                <div className="notification-container">
                  <button className="notification-button" type="button">
                    <BellIcon fontSize="2xl" m={1} />
                  </button>
                  <div
                    className={`notification-badge ${
                      slideUp ? "slide-in" : "slide-out"
                    }`}
                  >
                    <div>{notification.length}</div>
                  </div>
                </div>
              </MenuButton>
              <MenuList pl={2}>
                {!notification.length && "No new Message"}
                {notification.map((notif) => (
                  <MenuItem
                    key={notif._id}
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotification(notification.filter((n) => n !== notif));
                    }}
                  >
                    {notif.chat.isGroupChat
                      ? `New Message ${notif.chat.chatName}`
                      : `New Message from ${getSender(
                          user.data,
                          notif.chat.users
                        )}`}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                <Avatar
                  size="sm"
                  cursor="pointer"
                  name={user.data.name}
                  // src={user.pic}
                />
              </MenuButton>
              <MenuList>
                <ProfileModel user={user}>
                  <MenuItem>My Profile</MenuItem>
                </ProfileModel>

                <MenuDivider />
                <MenuItem onClick={logoutHandler}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </div>
        </Box>

        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
            <DrawerBody>
              <Box display="flex" pb={2}>
                <Input
                  placeholder="Search by name or email"
                  mr={2} // Adds space between Input and Button
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button onClick={handleSearch}>Go</Button>
              </Box>

              {loading ? (
                <ChatLoading />
              ) : (
                searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))
              )}
              {loadingChat && <Spinner ml="auto" display="flex" />}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    );
}

export default SideDrawer
