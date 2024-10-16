import React from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  Box,
  Container,
  Flex,
} from "@chakra-ui/react";
import Login from "../Components/Authentication/Login";
import SignUp from "../Components/Authentication/SignUp";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
// const history = useHistory()

//    useEffect(() => {
//      const user = JSON.parse(localStorage.getItem("userInfo"));
//      if (user) {
//        history.push("/chats");
//      }
//    }, [history]);
  return (
    <>
      <Container maxW="md" alignContent="center">
        <Box
          bg="white"
          w="100%"
          p={4}
          m="40px 0 15px 0"
          borderRadius="lg"
          borderWidth="1px"
          color="black"
        >
          <Text
            fontSize="4xl"
            display="flex"
            justifyContent="center"
            fontFamily="Work sans"
            color="black"
            fontWeight="700"
            marginBottom="18"
          >
            Chat-Pulse
          </Text>
          <Tabs variant="soft-rounded">
            <TabList mb="1em">
              <Tab width="50%" color="black">
                Login
              </Tab>
              <Tab width="50%" color="black">
                Sign Up
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {/* Login */}
                <Login />
              </TabPanel>
              <TabPanel>
                {/* Sign Up */}
                <SignUp />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </>
  );
};

export default Home;