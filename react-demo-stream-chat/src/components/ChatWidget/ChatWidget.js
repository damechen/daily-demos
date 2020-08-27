import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import CallObjectContext from '../../CallObjectContext';
import {
  Chat,
  Channel,
  ChannelHeader,
  Thread,
  Window,
} from 'stream-chat-react';
import { MessageList, MessageInput } from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import 'stream-chat-react/dist/css/index.css';

const STATE_IDLE_CHAT = 'IDLE_CHAT';
const STATE_JOINING_CHAT = 'JOINING_CHAT';
const STATE_JOINED_CHAT = 'JOINED_CHAT';

export default function ChatWidget(props) {
  const callObject = useContext(CallObjectContext);
  const [channel, setChannel] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [chatState, setChatState] = useState(STATE_IDLE_CHAT);
  const displayChat = props.display;

  /**
   * Once call state is 'joined-meeting', also join a Stream chat
   *
   */
  useEffect(() => {
    if (!callObject) {
      return;
    }

    function startStreamChat(event) {
      // Get the username and session_id from the joined-meeting event
      const id = event.participants.local.session_id;
      const username = event.participants.local.user_name
        ? `${event.participants.local.user_name}`
        : 'Guest';
      if (event) {
        const joinURL = 'https://opaque-incandescent-count.glitch.me/join-chat';

        try {
          // Send a POST with the username
          axios
            .post(joinURL, { id: id, username: username })
            .then((response) => {
              setChatState(STATE_JOINING_CHAT);

              const chatToken = response.data.chatToken;
              const apiKey = response.data.streamKey;
              const user = response.data.user;

              // Create a new chat, using returned apiKey
              const chatClient = new StreamChat(apiKey);
              setChatClient(chatClient);

              // Set user, using returned token
              chatClient.setUser(
                {
                  id: user.id,
                  name: user.username,
                },
                chatToken
              );

              // Join the channel using setChannel
              const channel = chatClient.channel('messaging', 'team-chat');
              channel.watch();
              setChannel(channel);
              setChatState(STATE_JOINED_CHAT);
            });
        } catch (error) {
          console.log(error);
        }
      }
    }
    callObject.on('joined-meeting', startStreamChat);
  }, [callObject]);

  const available = [STATE_JOINING_CHAT, STATE_JOINED_CHAT].includes(chatState);

  return chatClient && displayChat && available ? (
    <Chat client={chatClient} theme={'messaging light'}>
      <Channel channel={channel}>
        <Window className="window">
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  ) : null;
}