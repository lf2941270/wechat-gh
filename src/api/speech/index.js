import fs from 'fs'
import axios from 'axios'
class Speech {
	constructor() {
		this.getToken()
	}
	async getToken() {
		const res = await axios({
			url: 'https://api.cognitive.microsoft.com/sts/v1.0/issueToken',
			method: 'post',
			headers: {
				'Ocp-Apim-Subscription-Key': 'edef9292c4c84943a44cc6454a30accf'
			}
		})
		this.token = res.data
	}

	async toVoice(text) {
		let outputFormatArr = ["ssml-16khz-16bit-mono-tts", "raw-16khz-16bit-mono-pcm", "audio-16khz-16kbps-mono-siren", "riff-16khz-16kbps-mono-siren", "riff-16khz-16bit-mono-pcm", "audio-16khz-128kbitrate-mono-mp3", "audio-16khz-64kbitrate-mono-mp3", "audio-16khz-32kbitrate-mono-mp3"]
		try{

			const res = await axios({
				url: 'https://speech.platform.bing.com/synthesize',
				method: 'post',
				headers: {
					'Content-Type': 'application/ssml+xml',
					'X-Microsoft-OutputFormat': outputFormatArr[2],
					'Authorization': `Bearer ${this.token}`
				},
				data: `<speak version='1.0' xml:lang='en-US'><voice xml:lang='en-US' xml:gender='Female' name='Microsoft Server Speech Text to Speech Voice (en-US, ZiraRUS)'>${text}</voice></speak>`
			})
			return res.data
		} catch (e) {
			console.log(e)
		}

	}
}

export default new Speech()