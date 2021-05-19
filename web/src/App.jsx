import React from 'react';
//import './App.css';
import { Button, Flex, Input, Header, Text } from '@fluentui/react-northstar'
import { PlayIcon, MicIcon } from '@fluentui/react-icons-northstar'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { locale: null, displayName: null, nativeName: null };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    var synth = window.speechSynthesis;
    //var inputForm = document.querySelector('form');
    //var nativeInputTxt = document.querySelector('.txt');
    var voiceSelect = document.querySelector('select');
    var voices = [];

    populateVoiceList();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = populateVoiceList;
    }

    function populateVoiceList() {
      voices = synth.getVoices().sort(function (a, b) {
        const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
        if ( aname < bname ) return -1;
        else if ( aname == bname ) return 0;
        else return +1
      });
      //this.setState({voices});
      var selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
      voiceSelect.innerHTML = '';
      for(var i = 0; i < voices.length ; i++) {
        var option = document.createElement('option');
        option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
        
        if(voices[i].default) {
          option.textContent += ' -- DEFAULT';
        }

        option.setAttribute('data-lang', voices[i].lang);
        option.setAttribute('data-name', voices[i].name);
        voiceSelect.appendChild(option);
      }
      voiceSelect.selectedIndex = selectedIndex;
    }
  }

  render () {
    return (
      <div className="App">
        <Header
          as="h1"
          content="Say My Name"
          description="Tell us what you want to be called ! "
        />
          <form onSubmit={this.handleSubmit}>
            <div>
              <Input className="displayName" label="Your preferred name in English" />
            </div>
            <div>
              <Input className="nativeName" label="Your preferred name in native script" />
            </div>
            <div>
              <label>
                Language locale
              </label>
            </div>
            <div>
              <select>
              </select>
            </div>
            <div className="Play">
              <Flex gap="gap.large">
                <Button icon={<PlayIcon />} content="Play"  iconPosition="before" primary />
              </Flex>
            </div>
          </form>
          <div className="Mic">
            <Flex gap="gap.smaller">
              <Button content="Generate URL" secondary />
              <Button icon={<MicIcon />} content="Record it myself"  iconPosition="before" tinted />
            </Flex>
          </div>
          <div className="SharingURL">
            <Text content="Share your URL" />
            <Text content={`http://howtosaymy.name/?displayName=${this.state.displayName}&locale=${this.state.locale}&nativeName=${this.state.nativeName}`} />
            <Flex gap="gap.smaller">
              <Button icon={<PlayIcon />} content="Copy URL" iconPosition="before" primary />
            </Flex>
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
      if ( aname < bname ) return -1;
      else if ( aname == bname ) return 0;
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
      console.log(voiceSelect.selectedOptions)
      var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
      console.log(selectedOption);
      
      this.setState({ displayName: displayInputTxt.value, locale: selectedOption, nativeName: nativeInputTxt.value});
      console.log(voices)
      for(var i = 0; i < voices.length ; i++) {
        if(voices[i].name === selectedOption) {
          utterThis.voice = voices[i];
          break;
        }
      }
      synth.speak(utterThis);
      }
      nativeInputTxt.blur();
  }
}

export default App;