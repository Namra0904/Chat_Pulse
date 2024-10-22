import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
  Avatar
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import React from "react";

const ProfileModel = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}
      <Modal
        size="lg"
        onClose={onClose}
        isOpen={isOpen}
        isCentered
        motionPreset="none"
      >
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            display="flex" // Corrected
            justifyContent="center"
          >
            {user?.data ? <>{user?.data?.name}</> : <>{user?.name}</>}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
          >
            {/* <Image
              borderRadius="full"
              boxSize="150px"
              src={user.data ? (<>{user.data.pic}</>) : (<>{ user.pic}</>)}
              alt={user?.name}
            /> */}
            <Avatar
              size="2xl"
              cursor="pointer"
              name={
                user?.data?.name
                  ? user.data.name.slice(0, 2).toUpperCase()
                  : "NA"
              }
              // src={user?.data?.pic}
            />

            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
            >
              Email: {user?.data ? <>{user.data.email}</> : <>{user.email}</>}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModel;