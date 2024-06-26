import React, { useEffect } from 'react';
import Messages from './Messages';
import MessageInput from './MessageInput';
import { TiMessages } from "react-icons/ti";
import useConversation from '../../zustand/useConversation';
import { useAuthContext } from '../../context/AuthContext';

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation } = useConversation()
  const { authUser } = useAuthContext()

  useEffect(() => {
    // cleanup function 
    return () => setSelectedConversation(null)
  }, [setSelectedConversation])

  return (
    <div className='md:min-w-[450px] flex flex-col'>
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          {/* Header */}
          {/*<div className='bg-slate-200 px-4 py-2 mb-2'>*/}
          <div className='px-4 py-2 mb-2'>
            <span className='label-text text-gray-800'>To: </span>
            {/*<span className='text-gray-800'> {selectedConversation.isGroupChat ? selectedConversation.chatName : "name"}</span>*/}
            <span className='text-gray-800'> {!selectedConversation.isGroupChat
              ? (authUser._id === selectedConversation.users[0]._id
                ? selectedConversation.users[1].fullName
                : selectedConversation.users[0].fullName)
              : selectedConversation.chatName}</span>
          </div>
          <Messages />
          <MessageInput />
        </>
      )}
    </div>
  );
};

export default MessageContainer;

const NoChatSelected = () => {
  const { authUser } = useAuthContext()
  return (
    <div className='flex items-center justify-center w-full h-full'>
      <div className='px-4 text-center sm:text-xl text-gray-500 flex flex-col items-center gap-2'>
        <p>Welcome {authUser.fullName},</p>
        <p>Select a chat to start messaging</p>
        <TiMessages className='text-3xl md:text-6xl text-center' />
      </div>
    </div>
  );
};

