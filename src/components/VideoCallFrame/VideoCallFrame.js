import React from 'react';
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
    // this.daily.setShowNamesMode('always');
    this.daily.join({ url: this.props.url, userName: user.displayName });
    this.daily.on('left-meeting', (event) => {
      setUserValidated(false);
    });
  };

  render() {
    return (
      <iframe
        className="daily-video-frame"
        title="IndieLog virtual meetup"
        ref={this.iframeRef}
        allow="camera; microphone; fullscreen"
      ></iframe>
    );
  }
}

export default VideoCallFrame;
