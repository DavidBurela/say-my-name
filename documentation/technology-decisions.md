# Technology decisions

## Website
Decision:
- Static HTML + React website.

Reasons:
- Server side coding is not needed at this stage. As there is not a backend.
- Allows for easy reuse and embedding in different locations


## TTS engine
Decision:
- Web speech API.

Choices:
- [Azure cognitive services TTS](https://azure.microsoft.com/en-us/services/cognitive-services/text-to-speech/)
- [W3C web accesibility - speech synthesis](https://wicg.github.io/speech-api/#tts-section)
  - [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

Reasons:
- For the initial release we valued UI responsiveness and ease of getting started.
- Related to the static website decision, also alows for reuse and embedding elsewhere.

Downsides:
- The Web Speech API does support [SSML](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/speech-synthesis-markup) on most browsers. However none currently implement `<phoneme>` tag support, meaning that fine grained control of pronunciation is not possible.  For the initial release this was acceptable as we do not have a UI that supports defining a name via phonemes.

Considerations:
- Correct pronunciation of names
- Phonemes for fine grained control

## Potential Spikes

### Investigation on TTS phoneme options:
- UI to support phonetic input
  - [IPA (International Phonetic Alphabet) keyboard](https://ipa.typeit.org/full/)
- Phoneme synthesis support
  - Javascript library to add `<phoneme>` support to browser TTS engine
  - Using Azure cognitive services. 
    - Need to consider subscription costs, key management, latency, etc.
    - [Azure cognitive services - Use phonemes to improve pronunciation](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/speech-synthesis-markup#use-phonemes-to-improve-pronunciation)

### Investigation on voice recording storage options:
- Directly upload audio against AAD attribute.
  - There is a `spokenName` attribute where a 32KB wav file can be uploaded. <https://docs.microsoft.com/en-us/powershell/module/exchange/import-recipientdataproperty>
  - However during initial One CSE Week, we could not find a way to access via Microsoft Graph.
- Upload audio to user's One Drive, generate a link, and then upload the link against AAD custom attribute.
- Azure blob storage

### Actions based on Persona:
- As Persona 1, I can generate a URL using the TTS workflow.
- As Persona 1, I can record my name and generate a URL.
- As Persona 2, I can view a person's profile and playback the name recording.