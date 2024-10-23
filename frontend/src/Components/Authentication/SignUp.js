import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,

  InputRightElement,
  Button,
  useToast,
} from "@chakra-ui/react";
import React from 'react'
import { useState} from 'react';
import axios from 'axios'
import { useHistory } from "react-router-dom";
// import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME, // Your cloud name
//   api_key: process.env.CLOUD_API_KEY, // Your API key
//   api_secret: process.env.CLOUD_API_SECRET, // Your API secret
// });


// try {
//         const result = await cloudinary.uploader.upload(filePath, );
//          console.log('Uploaded image:', result.secure_url);  // URL of the uploaded image
//         return result.secure_url;
//   } catch (error) {
//     console.error('Error uploading image:', error);
//         }
//         setLoading(false)

//       }


const SignUp = () => {
  const [show, setShow] = useState(false)
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const history = useHistory()
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false)
  const toast = useToast();
  
  const postDetails = (pics) => {
    // setLoading(true);
    // if (pics === undefined) {
    //   toast({
    //     title: "Please Select an Image!",
    //     status: "warning",
    //     duration: 5000,
    //     isClosable: true,
    //     position:"bottom"
    //   });
    //   return;
    // }

    // if (pics.type === 'image/jpeg' || pic.type === "image/png") {
    //   const data = new FormData();
    //   data.append("File", pics)
    //   data.append("upload_present", "chat-pulse")
    //   data.append("cloud_name", "dffsbxpp4");
    //   fetch("https://api.cloudinary.com/v1_1/dffsbxpp4/image/upload", {
    //     method: "post",
    //     body:data
    //   }).then((res) => res.json()).then(data => {
    //     setPic(data.url.toString());
    //     console.log(data.url.toString());
    //     setLoading(false)
    //   }).catch((err) => {
    //     console.error(err);
    //     setLoading(false)
    //   });

    // }
    // else {
    //   toast({
    //     title: "Please Select an Image!",
    //     status: "warning",
    //     duration: 5000,
    //     isClosable: true,
    //     position: "bottom",
    //   });
    //   setLoading(false)
    //   return;
    // }
  }
  const SubmitHandler = async () => {
    setLoading(true)
    if (!name || !password || !confirmpassword || !email) {
      toast({
        title: "Please Fill are Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false)
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Password do not match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_HOST}/api/user/signUp`,
        { name, email, password, pic },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(response));
      setLoading(false);
            history.push("/chats");

      
    } catch (error) {
      toast({
        title: "Error Occured!",
        // description: error.response.response.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false)
    }
  }

    return (
      <>
        <VStack spacing={5} color="black">
          <FormControl id="first-name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              placeholder="Enter Your Name"
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              placeholder="Enter Your Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={show ? "text" : "password"}
                placeholder="Enter Your Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl id="confirm-password" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
              <Input
                type={show ? "text" : "password"}
                placeholder="Enter Your Confirm-Password"
                onChange={(e) => setConfirmpassword(e.target.value)}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          {/* <FormControl id="pic">
            <FormLabel>Upload Your Pic</FormLabel>
            <Input type="File" p={1.5} accept='image/*'
              onChange={(e) => { postDetails(e.target.files[0]) }} />
          </FormControl> */}
          <Button colorScheme='blue' width="100%" style={{ marginTop: "15" }} onClick={SubmitHandler} isLoading={loading}>Sign Up</Button>
        </VStack>
      </>
  );
  
  }

export default SignUp;