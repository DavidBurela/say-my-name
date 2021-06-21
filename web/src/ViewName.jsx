import React, { Component } from 'react';
import './App.css';
import { Button, Header, Text } from '@fluentui/react-northstar'
import { PlayIcon } from '@fluentui/react-icons-northstar'
import {Helmet} from 'react-helmet'

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
                <Helmet>
                    <title>How to say '{this.props.display}'</title>
                </Helmet>
                <a href='/' style={{ textDecoration: 'none' }} >
                    <Header
                        as="h1"
                        content="Say My Name"
                    /></a>
                <div className="Play">
                    <Header as="h2" content={`My display name is: ${this.props.display}`} />
                    <p />
                    {this.props.pronoun && <div className="row">
                        <Header as="h2" content={`My pronouns are: ${this.props.pronoun}`} />
                        <p /></div>}
                    <Header as="h2" content={`You pronounce it like this:`} />
                    <Button icon={<PlayIcon />} content="Play" iconPosition="before" primary onClick={this.handlePlaySound} />
                    <p />
                    <Text content={`Pronunciation: ${this.props.native}`} />
                    <br />
                    <Text content={`Locale: ${this.props.locale}`} />
                    <p />
                    {/* <a href='/' >"Like this? Click here to create your own!</a> */}
                    <Button text primary content="Like this? Click here to create your own!" onClick={(e) => window.location.href = '/'} />
                </div>
            </div>
        )
    }
}

export default ViewName;