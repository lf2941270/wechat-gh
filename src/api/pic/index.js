import fs from 'fs'
import axios from 'axios'
class Pic {
	constructor() {
	}
	async detect(url) {
		const params = {
			"returnFaceId": "true",
			"returnFaceLandmarks": "true",
			"returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise",
		}
		const res = await axios({
			url: 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect',
			params,
			headers: {
				"Content-Type": "application/json",
				"Ocp-Apim-Subscription-Key": "5f429d0a2acc45638f6a98d2a46de6bf"
			},

			method: "post",

			// Request body.
			data: {
				url
			}
		})
		console.log(res)
	}

	async saveFile(url) {
		var http = require('http');
		var fs = require('fs');

		var filePath = new Date().getTime() + '_' + Math.round(Math.random() * 1000);
		var file = fs.createWriteStream(filePath);
		return new Promise(resolve => {
			http.get(url, function(response) {
				response.pipe(file);
				resolve(filePath)
			});
		})
	}

	async upload(url) {
		var qiniu = require("qiniu");


		const ACCESS_KEY = '35bMF5rT5-q3PYhVvJ793vaTwq5d8BU2EShyLkGC';
		const SECRET_KEY = '8A1haHkt71OY4VikO4X4zhtpx_N7gJkuTGnEW-KD';

		//要上传的空间
		var bucket = 'afan';

		//上传到七牛后保存的文件名

		var mac = new qiniu.auth.digest.Mac(ACCESS_KEY, SECRET_KEY);
		var options = {
			scope: bucket,
		}
		var putPolicy = new qiniu.rs.PutPolicy(options);

		var uploadToken = putPolicy.uploadToken(mac);
		var config = new qiniu.conf.Config();
		var formUploader = new qiniu.form_up.FormUploader(config);
		var putExtra = new qiniu.form_up.PutExtra();

//file
		const filePath = await this.saveFile(url)
		return new Promise(resolve => {
			formUploader.putFile(uploadToken, null, filePath, putExtra, function(respErr,
			                                                                     respBody, respInfo) {
				if (respErr) {
					throw respErr;
				}

				if (respInfo.statusCode == 200) {
					console.log(respBody);
					var fs = require('fs')
					fs.unlink(filePath)
					resolve(`http://ofp6fnkhe.bkt.clouddn.com/${respBody.key}`)

				} else {
					console.log(respInfo.statusCode);
					console.log(respBody);
				}
			});
		})

	}

	async addAvatar(url) {
		const params = '?imageMogr2/auto-orient/thumbnail/300000@/blur/1x0/quality/75|watermark/1/image/aHR0cDovLzd4aWQzbC5jb20xLnowLmdsYi5jbG91ZGRuLmNvbS9oYXQucG5n/dissolve/100/gravity/North/dx/-20/dy/-30|imageslim'
		return url + params
	}
}


export default new Pic()