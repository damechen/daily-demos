import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Lobby from '../Lobby/Lobby';
import Topbar from '../Topbar/Topbar';

import './App.css';
import VideoCallFrame from '../VideoCallFrame/VideoCallFrame';

toast.configure();

export default function App() {
  const [userValidated, setUserValidated] = useState(false);
  const [attendees, setAttendees] = useState(null);
  const [roomId, setRoomId] = useState('');
  const [currentUser, setCurentUser] = useState(null);

  return (
    <div className="app">
      {userValidated ? (
        <VideoCallFrame
          user={currentUser}
          url={'https://indielog.daily.co/' + roomId}
          setUserValidated={setUserValidated}
          attendees={attendees}
        ></VideoCallFrame>
      ) : (
        <>
          <Topbar />
          <Lobby
            setCurentUser={setCurentUser}
            setRoomId={setRoomId}
            setUserValidated={setUserValidated}
            setAttendees={setAttendees}
          />
        </>
      )}
    </div>
  );
}
