import React, {useEffect, useState} from 'react';
import './App.css';
import { Button, Flex, Input, Header, Text, Alert, Popup, Tooltip } from '@fluentui/react-northstar'
import { PlayIcon, MicIcon, ClipboardCopiedToIcon, LinkIcon } from '@fluentui/react-icons-northstar'
import {Helmet} from 'react-helmet'
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin } from './AppInsights';
import { useAppInsightsContext, useTrackEvent } from "@microsoft/applicationinsights-react-js";

const CreateName = () => { 
  const [locale, setLocale] = useState(null);
  const [display, setDisplay] = useState(null);
  const [native, setNative] = useState(null);
  const [url, setURL] = useState(null);
  const [pronoun, setPronoun] = useState(null);
  const [creatingName, setCreateName] = useState([]);

  const appInsights = useAppInsightsContext();
  const trackCreateName = useTrackEvent(appInsights, "CreateNameClicked", creatingName);
  
  useEffect(() => {
    var synth = window.speechSynthesis;
    var voiceSelect = document.querySelector('select');
    var voices = [];

    var shareURL = document.getElementById("SharingURL");
    shareURL.style.display = 'none';

    populateVoiceList();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = populateVoiceList;
    }

    function populateVoiceList() {
      voices = synth.getVoices().sort(function (a, b) {
        const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
        if (aname < bname) return -1;
        else if (aname == bname) return 0;
        else return +1
      });
      //this.setState({voices});
      var selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
      voiceSelect.innerHTML = '';
      for (var i = 0; i < voices.length; i++) {
        var option = document.createElement('option');
        option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

        if (voices[i].default) {
          option.textContent += ' -- DEFAULT';
        }

        option.setAttribute('data-lang', voices[i].lang);
        option.setAttribute('data-name', voices[i].name);
        voiceSelect.appendChild(option);
      }
      voiceSelect.selectedIndex = selectedIndex;
    }
  }, []);

  const handleSubmit = (e) => {
    var synth = window.speechSynthesis;
    //var inputForm = document.querySelector('form');
    var displayInputTxt = document.querySelector('.displayName input');
    var nativeInputTxt = document.querySelector('.nativeName input');
    console.log(nativeInputTxt)
    var voiceSelect = document.querySelector('select');
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

    if (nativeInputTxt.value !== '') {
      console.log(nativeInputTxt.value)
      var utterThis = new SpeechSynthesisUtterance(nativeInputTxt.value);
      utterThis.onend = function (e) {
        console.log('SpeechSynthesisUtterance.onend');
      }
      utterThis.onerror = function (e) {
        console.error('SpeechSynthesisUtterance.onerror');
      }
      var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
      let selectedLocale = voiceSelect.selectedOptions[0].getAttribute('data-lang');

      // this.setState({ display: displayInputTxt.value, locale: selectedLocale, native: nativeInputTxt.value });
      for (var i = 0; i < voices.length; i++) {
        if (voices[i].name === selectedOption) {
          utterThis.voice = voices[i];
          break;
        }
      }
      synth.speak(utterThis);
    }
    nativeInputTxt.blur();
    generateURL();
    var shareURL = document.getElementById("SharingURL");
    shareURL.style.display = 'block';
    setCreateName('CreateName');
  }

  const generateURL = () => {
    let displayInputTxt = document.querySelector('.displayName input').value;
    let nativeInputTxt = document.querySelector('.nativeName input').value;
    let pronounTxt = document.querySelector('.pronoun input').value;
    let localeTxt = document.querySelector('select').selectedOptions[0].getAttribute('data-lang');

    let url = '';

    if (pronounTxt) {
      url = encodeURI(`${window.location.href}?display=${displayInputTxt}&locale=${localeTxt}&native=${nativeInputTxt}&pronoun=${pronounTxt}`);
    } else {
      url = encodeURI(`${window.location.href}?display=${displayInputTxt}&locale=${localeTxt}&native=${nativeInputTxt}`);
    }

    setURL(url);
  }

  const copyURL= () =>{
    navigator.clipboard.writeText(url);
  }

return (
      <div className="CreateName">
        <Helmet>
            <title>How to say my name</title>
        </Helmet>
        <a href='/' style={{ textDecoration: 'none' }} >
          <Header
            as="h1"
            content="Say My Name"
          /></a>
        <form onSubmit={(e) => {
          trackCreateName();
          handleSubmit(e);
        }}>
          <div className="row">
            <Input className="displayName" label="Display Name" required placeholder="Daisuke (大輔)" />
          </div>
          <div className="row">
            <Input className="pronoun" label="Your preferred pronouns (Optional)" placeholder="He/Him" />
          </div>
          <div className="row">
            <Input className="nativeName" label="Name pronunciation" required placeholder="だいすけ" />
          </div>
          <div className="row">
            <label>
              Pronunciation locale
              </label>
          </div>
          <div>
            <select>
            </select>
          </div>
          <div className="row">
            <Flex gap="gap.smaller" hAlign="center">
              <Button icon={<PlayIcon />} content="Play and Generate Link" iconPosition="before" primary />
              <Tooltip trigger={<Button disabledFocusable icon={<MicIcon />} content="Record it myself" iconPosition="before" tinted />} content="Coming soon..." />
            </Flex>
          </div>
        </form>
        <div id="SharingURL">
          <Header as="h3" className="row" content={`Share your name with others:`} color="Brand" />
          <Text id="mySharingURL" content={url} color="Brand" />
          <div className="row">
            <Popup trigger={<Button size="small" icon={<ClipboardCopiedToIcon />} content="Copy URL" iconPosition="before" onClick={copyURL} secondary />} content="Successfully copied!" inline />
          </div>
        </div>
      </div>
    );
}

export default withAITracking(reactPlugin, CreateName, "CreateNamePage");
