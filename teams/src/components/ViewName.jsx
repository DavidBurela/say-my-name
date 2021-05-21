import React, { Component } from 'react';
import { Button, Header, Text } from '@fluentui/react-northstar'
import { PlayIcon } from '@fluentui/react-icons-northstar'

class ViewName extends Component {
    constructor(props) {
        super(props);
    }

    handlePlaySound = (e) => {
        let synth = window.speechSynthesis;
        var voices = synth.getVoices();

        e.preventDefault();

        if (synth.speaking) {
            console.error('speechSynthesis.speaking');
            return;
        }
        let utterThis = new SpeechSynthesisUtterance(this.props.native);
        utterThis.onend = function (e) {
            console.log('SpeechSynthesisUtterance.onend');
        }
        utterThis.onerror = function (e) {
            console.error('SpeechSynthesisUtterance.onerror');
        }

        for (let i = 0; i < voices.length; i++) {
            if (voices[i].lang === this.props.locale) {
                utterThis.voice = voices[i];
                break;
            }
        }
        synth.speak(utterThis);
    }

    render() {
        return (
            <div className="ViewName">
                <Header
                    as="h1"
                    content="Say My Name"
                />
                <div className="Play">
                    <Header as="h2" content={`My display name is: ${this.props.display}`} />
                    <p />
                    <Header as="h2" content={`You can call me:`} />
                    <Button icon={<PlayIcon />} content="Play" iconPosition="before" primary onClick={this.handlePlaySound} />
                    <p/>
                    <Text content={`Native Text: ${this.props.native}`} />
                    <br/>
                    <Text content={`Locale: ${this.props.locale}`} />
                    <p/>
                    <Button text primary content="Like this? Click here to create your own!" onClick={(e) => window.location.href = '/'} />
                </div>
            </div>
        )
    }
}

export default ViewName;