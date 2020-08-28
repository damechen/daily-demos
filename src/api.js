const indielogEndpoint = 'https://indielog.daily.co/';

async function createRoom(roomId) {
  const roomPath = indielogEndpoint + roomId;
  return { url: roomPath };
}

export default { createRoom };
