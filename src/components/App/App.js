import React, { useState } from 'react';
import Lobby from '../Lobby/Lobby';
import Topbar from '../Topbar/Topbar';

import './App.css';
import VideoCallFrame from '../VideoCallFrame/VideoCallFrame';

export default function App() {
  const [userValidated, setUserValidated] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [currentUser, setCurentUser] = useState(null);

  return (
    <div className="app">
      {userValidated ? (
        <VideoCallFrame
          user={currentUser}
          url={'https://indielog.daily.co/' + roomId}
          setUserValidated={setUserValidated}
        ></VideoCallFrame>
      ) : (
        <>
          <Topbar />
          <Lobby
            setCurentUser={setCurentUser}
            setRoomId={setRoomId}
            setUserValidated={setUserValidated}
          />
        </>
      )}
    </div>
  );
}
