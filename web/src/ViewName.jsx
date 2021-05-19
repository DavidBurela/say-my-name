import React, { Component } from 'react';
import { Button, Flex, Input, Header, Text } from '@fluentui/react-northstar'
import { PlayIcon, MicIcon } from '@fluentui/react-icons-northstar'

class ViewName extends Component {
    constructor(props) {
        super(props);
    }

    handlePlaySound = (e) => {
        let synth = window.speechSynthesis;
        var voices = [];

        voices = synth.getVoices().sort(function (a, b) {
            const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
            if (aname < bname) return -1;
            else if (aname == bname) return 0;
            else return +1;
        });

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
            if (voices[i].locale === this.props.locale) {
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
                <Text content={`My display name is: ${this.props.display}`} />
                <p/>
                <Text content={`This is how you say my name:`} />
                    <Flex gap="gap.large">
                        <Button icon={<PlayIcon />} content="Play" iconPosition="before" primary onClick={this.handlePlaySound} />
                        <Button content="Click here to generate your own link" secondary onClick={(e) => window.location.href = '/'} />
                    </Flex>
                    <Text content={`Text: ${this.props.native}`} />
                    <Text content={`Locale: ${this.props.locale}`} />
                </div>
            </div>
        )
    }
}

export default ViewName;