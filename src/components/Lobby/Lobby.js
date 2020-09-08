import React from 'react';
import { Modal } from 'react-bootstrap';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { isBefore, parseISO } from 'date-fns';
import LoginModal from '../LoginModal/LoginModal';

class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      meetingRoom: '',
      showLogin: false,
      error: '',
    };
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        await firebase
          .database()
          .ref('users')
          .child(user.uid)
          .on('value', (snapshot) => {
            this.setState({ currentUser: snapshot.val() });
            this.props.setCurentUser(snapshot.val());
          });
      } else {
        this.setState({ currentUser: null });
      }
    });
  };

  onSignInWithToken = async (token) => {
    try {
      await firebase.auth().signInWithCustomToken(token);
    } catch (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      await firebase.database().ref('errors').push({
        where: 'onSignInWithToken',
        error: error,
        errorCode: errorCode,
        errorMessage: errorMessage,
        createdAt: Date.now(),
      });
    }
  };

  handleMeetingRoomChange = (event) => {
    this.setState({ meetingRoom: event.target.value });
  };

  handleJoinMeetup = () => async () => {
    this.setState({ error: '' });

    const { meetingRoom } = this.state;

    const meetupRoomRef = await firebase
      .database()
      .ref('meetup-rooms')
      .child(meetingRoom)
      .once('value');

    if (!meetupRoomRef.val()) {
      this.setState({ error: 'Invalid meetup id 🙁' });
      return;
    }

    this.props.setRoomId(meetingRoom);

    const meetupURL = meetupRoomRef.val().meetupURL;
    const meetingTime = meetupRoomRef.val().meetingTime;

    // if login a day before, prompt the error message
    var dateISO = parseISO(meetingTime);
    if (isBefore(Date.now() + 600000, dateISO)) {
      this.setState({ error: "You're too early to join 😅" });
      return;
    }

    const attendeeRef = await firebase
      .database()
      .ref('meetups')
      .child(meetupURL)
      .child('attendees')
      .child(this.state.currentUser.uid)
      .once('value');

    if (!attendeeRef.val()) {
      this.setState({ error: "You haven't signed up this meetup 😂" });
      return;
    }

    const allAttendees = await firebase
      .database()
      .ref('meetups')
      .child(meetupURL)
      .child('attendees')
      .once('value');

    this.props.setUserValidated(true);
    this.props.setAttendees(allAttendees.val());
  };

  setShowLogin = (showLogin) => {
    this.setState({
      showLogin: showLogin,
    });
  };

  render() {
    const { currentUser, isLogin, showLogin, error } = this.state;

    return (
      <div className="bg-white flex" style={{ minHeight: '94.2vh' }}>
        <Modal
          show={showLogin}
          onHide={() => this.setState({ showLogin: false })}
          centered
          size="lg"
        >
          <Modal.Body style={{ padding: 0 }}>
            <LoginModal
              isLogin={true}
              setShowLogin={(showLogin) => this.setShowLogin(showLogin)}
            />
          </Modal.Body>
        </Modal>
        <div className="flex-1 flex flex-col justify-center py-12 px-24 sm:px-6 lg:flex-none lg:px-20">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="mb-8">
              <h2 className="mt-6 text-3xl leading-9 font-extrabold text-gray-900">
                Join an IndieLog meetup 🤗
              </h2>
            </div>

            <div className="mt-8">
              <div className="mt-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-medium leading-5 text-gray-700 mb-2">
                      Meetup ID
                    </label>
                    <div className="mt-1 rounded-md shadow-sm">
                      <input
                        id="meetingRoom"
                        type="meetingRoom"
                        required
                        value={this.state.meetingRoom}
                        disabled={currentUser ? false : true}
                        onChange={this.handleMeetingRoomChange}
                        className="text-gray-900 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out text-lg font-medium sm:text-sm sm:leading-5"
                      />
                    </div>
                    {error !== '' && (
                      <label className="block text-sm font-medium leading-5 text-red-700 my-2">
                        {error}
                      </label>
                    )}
                  </div>
                </div>
                <span className="block w-full rounded-md shadow-sm mt-2">
                  {currentUser ? (
                    <button
                      onClick={this.handleJoinMeetup(currentUser)}
                      className="w-full flex justify-center py-2 px-4 border border-transparent text-lg font-bold rounded-md text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-700 transition duration-150 ease-in-out"
                    >
                      Join now
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        this.setState({ showLogin: true });
                      }}
                      className="w-full flex justify-center py-2 px-4 border border-transparent text-lg font-bold rounded-md text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-700 transition duration-150 ease-in-out"
                    >
                      Log in first
                    </button>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block relative w-0 flex-1">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1501353163335-102e39d92607?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3450&q=80"
            alt=""
          />
        </div>
      </div>
    );
  }
}

export default Lobby;
