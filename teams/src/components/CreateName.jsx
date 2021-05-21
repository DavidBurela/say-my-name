import React from 'react';
import './App.css';
import { Button, Flex, Input, Header, Text, Alert, Popup, Tooltip } from '@fluentui/react-northstar'
import { PlayIcon, MicIcon, ClipboardCopiedToIcon, LinkIcon } from '@fluentui/react-icons-northstar'

class CreateName extends React.Component {
  constructor(props) {
    super(props);
    this.state = { locale: null, display: null, native: null, url: null, pronoun: null };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.generateURL = this.generateURL.bind(this);
    this.copyURL = this.copyURL.bind(this);
  }

  componentDidMount() {
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
  }

  render() {
    return (
      <div className="CreateName">
        <Header
          as="h1"
          content="Say My Name"
          description="Tell us what you want to be called ! "
        />
        <form onSubmit={this.handleSubmit}>
            <label>
              Your display name (in English)
            </label>
          <div>
            <Input className="displayName" label="Your display name in English" required />
          </div>
          <label>
            Your preferred pronouns (Optional)
            </label>
          <div>
            <Input className="pronoun" label="Your preferred pronouns (Optional)" />
          </div>
            <label>
              What you want others to call you
            </label>
            <div>
            <Input className="nativeName" label="Your preferred name - What should others call you?" required />
          </div>
          <div className="row">
            <label>
              Language locale of preferred name
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
          <Text id="mySharingURL" content={this.state.url} color="Brand" />
          <div className="row">
            <Popup trigger={<Button size="small" icon={<ClipboardCopiedToIcon />} content="Copy URL" iconPosition="before" onClick={this.copyURL} secondary />} content="Successfully copied!" inline />
          </div>
        </div>
      </div>
    );
  }

  handleSubmit(e) {
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
    this.generateURL();
    var shareURL = document.getElementById("SharingURL");
    shareURL.style.display = 'block';
  }

  generateURL() {
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

    this.setState({ url: url });
  }

  copyURL(){
    navigator.clipboard.writeText(this.state.url);
  }
}

export default CreateName;
