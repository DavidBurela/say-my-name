import React, { useState } from 'react';
import './App.css';
import { Button, Header, Text } from '@fluentui/react-northstar'
import { PlayIcon } from '@fluentui/react-icons-northstar'
import {Helmet} from 'react-helmet'
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin } from './AppInsights';
import { useAppInsightsContext, useTrackEvent } from "@microsoft/applicationinsights-react-js";

const ViewName = (props) => {
    const [playName, setPlayName] = useState([]);
    const appInsights = useAppInsightsContext();
    const trackPlayClicked = useTrackEvent(appInsights, "PlayClicked");
    const trackURLClicked = useTrackEvent(appInsights, "URLClicked");

const handlePlaySound = (e) => {
        let synth = window.speechSynthesis;
        var voices = synth.getVoices();
        setPlayName('PlayPage');

        e.preventDefault();

        if (synth.speaking) {
            console.error('speechSynthesis.speaking');
            return;
        }
        let utterThis = new SpeechSynthesisUtterance(props.native);
        utterThis.onend = function (e) {
            console.log('SpeechSynthesisUtterance.onend');
        }
        utterThis.onerror = function (e) {
            console.error('SpeechSynthesisUtterance.onerror');
        }

        for (let i = 0; i < voices.length; i++) {
            if (voices[i].lang === props.locale) {
                utterThis.voice = voices[i];
                break;
            }
        }
        synth.speak(utterThis);
    }

const handleURLClicked = (e) => {
    trackURLClicked();
    window.location.href = '/'
}

return (
            <div className="ViewName">
                <Helmet>
                    <title>How to say '{props.display}'</title>
                </Helmet>
                <a href='/' style={{ textDecoration: 'none' }} >
                    <Header
                        as="h1"
                        content="Say My Name"
                    /></a>
                <div className="Play">
                    <Header as="h2" content={`My display name is: ${props.display}`} />
                    <p />
                    {props.pronoun && <div className="row">
                        <Header as="h2" content={`My pronouns are: ${props.pronoun}`} />
                        <p /></div>}
                    <Header as="h2" content={`You pronounce it like this:`} />
                    <Button icon={<PlayIcon />} content="Play" iconPosition="before" primary onClick={(e) => {
                        // trackComponent();
                        trackPlayClicked();
                        handlePlaySound(e);
                        }} />
                    <p />
                    <Text content={`Pronunciation: ${props.native}`} />
                    <br />
                    <Text content={`Locale: ${props.locale}`} />
                    <p />
                    {/* <a href='/' >"Like this? Click here to create your own!</a> */}
                    <Button text primary content="Like this? Click here to create your own!" onClick={(e) => {
                        handleURLClicked(e);
                    }} />
                </div>
            </div>
        );
}

export default withAITracking(reactPlugin, ViewName, "ViewNamePage");