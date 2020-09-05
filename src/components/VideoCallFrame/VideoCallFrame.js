import React from 'react';
import { Row, Col } from 'react-bootstrap';
import DailyIframe from '@daily-co/daily-js';
import './VideoCallFrame.css';

class VideoCallFrame extends React.Component {
  constructor(props) {
    super(props);
    this.iframeRef = React.createRef();
  }

  componentDidMount = () => {
    if (!this.props.url) {
      return;
    }

    const { user, setUserValidated } = this.props;

    this.daily = DailyIframe.wrap(this.iframeRef.current, {
      showLeaveButton: true,
    });

    this.daily.join({ url: this.props.url, userName: user.displayName });
    this.daily.setShowNamesMode('always');

    this.daily.on('left-meeting', (event) => {
      setUserValidated(false);
    });
  };

  render() {
    const { attendees } = this.props;

    return (
      <Row className="full-width-height">
        <Col lg={8} className="full-width-height pr-0">
          <iframe
            className="full-width-height"
            title="IndieLog virtual meetup"
            ref={this.iframeRef}
            allow="camera; microphone; fullscreen"
          ></iframe>
        </Col>
        <Col lg={4} className="px-0 video-chat-right-col">
          <h2 className="font-bold px-8 py-4 mb-0">Attendees</h2>

          <hr className="mt-0" />
          <div class="bg-white overflow-hidden sm:rounded-md">
            <ul>
              {attendees &&
                Object.values(attendees).map((attendee) => {
                  return (
                    <li>
                      <a
                        href={'https://indielog.com/user/' + attendee.id}
                        target="_blank"
                        class="block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out"
                      >
                        <div class="flex items-center px-8 py-4">
                          <div class="min-w-0 flex-1 flex items-center">
                            <div class="flex-shrink-0">
                              <img
                                class="h-12 w-12 rounded-full"
                                src={attendee.avatar}
                                alt=""
                              />
                            </div>
                            <div class="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                              <div>
                                <div class="text-lg leading-5 font-medium text-indigo-600 truncate">
                                  {attendee.name}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <svg
                              class="h-5 w-5 text-gray-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clip-rule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      </a>
                    </li>
                  );
                })}
            </ul>
          </div>
        </Col>
      </Row>
    );
  }
}

export default VideoCallFrame;
