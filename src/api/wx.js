import fs from 'fs'
import axios from 'axios'

class Wx {
	constructor() {
		this.APPID = 'wx104c9afe0e7b2afd'
		this.APPSECRET = '85921dfddf8df7240c4088c8f3fe61a6'
		this.getToken()
	}


	async getToken() {
		const res = await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${this.APPID}&secret=${this.APPSECRET}`)
		this.token = res.data.access_token
		console.log('-----get token----')
		console.log(res.data)
	}

	async getAvatar(openid) {
		console.log('------get avatar------')
		const res = await axios.get(`https://api.weixin.qq.com/cgi-bin/user/info?access_token=${this.token}&openid=${openid}&lang=zh_C`)
		if(res && res.data && res.data.errcode) {
			console.log(res.data)
			await this.getToken()
			return await this.getAvatar(openid)
		}
		console.log(res)
	}

}


export default new Wx()