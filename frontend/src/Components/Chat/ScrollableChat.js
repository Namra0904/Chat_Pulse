import React from 'react'
import ScrollableFeed from "react-scrollable-feed"
import { isSameSender,isSameSenderMargin,isSameUser,isLastMessage} from '../../Config/ChatLogic';
import { ChatState } from '../../Context/ChatProvider';
import { Avatar,Tooltip } from '@chakra-ui/react';
const ScrollableChat = ({ message }) => {

    const { user } = ChatState()
    console.log(user)
    return (
      <ScrollableFeed>
        {message &&
          message.map((m, i) => {
            return (
              <div style={{ display: "flex" }} key={m._id}>
                {(isSameSender(message, m, i, user.data._id) ||
                  isLastMessage(message, i, user.data._id)) && (
                  <Tooltip
                    label={m.sender.name}
                    placement="bottom-start"
                    hasArrow
                  >
                    <Avatar
                      mt="7px"
                      mr={1}
                      size="sm"
                      cursor="pointer"
                      name={m.sender.name}
                      src={m.sender.pic}
                    />
                  </Tooltip>
                )}
                <span
                  style={{
                    backgroundColor: `${
                      m.sender._id === user.data._id ? "#BEE3F8" : "#B9F5D0"
                    }`,
                    marginLeft: isSameSenderMargin(
                      message,
                      m,
                      i,
                      user.data._id
                    ),
                    marginTop: isSameUser(message, m, i, user.data._id)
                      ? 3
                      : 10,
                    borderRadius: "20px",
                    padding: "5px 15px",
                    maxWidth: "75%",
                  }}
                >
                  {m.content}
                </span>
              </div>
            );
          })}
      </ScrollableFeed>
    );
};

export default ScrollableChat
