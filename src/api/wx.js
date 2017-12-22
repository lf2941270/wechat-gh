import fs from 'fs'
import axios from 'axios'

class Wx {
	constructor() {
		this.ACCESS_TOKEN = 'req.wxsession'
	}


	async getAvatar(openid) {
		axios.get(`https://api.weixin.qq.com/cgi-bin/user/info?access_token=${this.ACCESS_TOKEN}&openid=${openid}&lang=zh_C`)
	}

}

export default new Wx()