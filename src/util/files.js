import {MODULE_URL} from 'RestUrl';
import ajax from 'Utils/ajax';
import imgload from 'Img/imgload.png';

var uploadUrl = MODULE_URL.ATTACHURL + "/muploadx"; //多附件上传接口地址
var downloadUrl = MODULE_URL.ATTACHURL + "/list"; //获取附件列表
var deleteUrl = MODULE_URL.ATTACHURL + "/del"
var maxSize = 200 * 1024; //200KB

var compress = function(img) {
	var canvas = document.createElement('canvas'),
		ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	canvas.width = img.naturalWidth;
	canvas.height = img.naturalHeight;

	//利用canvas进行绘图
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

	//将原来图片的质量压缩到原先的0.2倍。
	var data = canvas.toDataURL("image/jpeg", 0.2); //data url的形式
	return data;
}

var multiFilesUpLoad = function(itemData, files, billType, authToken, source, callback) {
	var imgPics = [];
	var _files = [];
	source = source || {
		sourceId: '',
		sourceType: ''
	};
	if(files.length > 0) {
		for(let i = 0; i < files.length; i++) {
			if(files[i].gid !== undefined) continue;
			var imgInfo = {},
				result = files[i].url;
			imgInfo.src = result;
			imgPics.push(imgInfo);

			var fileContent = result;
			var singleFile = {};
			singleFile.fileName = files[i].file.name;

			// if(fileContent.length > maxSize)
			// 	fileContent = compress(this); //图片压缩

			singleFile.fileSize = fileContent.length;
			singleFile.fileContent = fileContent.substring(fileContent.indexOf(",") + 1);

			_files.push(singleFile);

			var params = {
				billType: billType,
				sourceId: source.sourceId,
				sourceType: source.sourceType,
				userId: authToken.getUserId(),
				userName: authToken.getUserName(),
				files: _files
			};
			ajax.postJSON(uploadUrl, JSON.stringify(params), function(data) {
				if(data.success) {
					var backData = data.backData;
					console.log("imgbackData===", backData);
					if(backData.length) {
						for(var j = 0; j < backData.length; j++) {
							var imgItem = {};
							imgItem = files[i];
							imgItem.gid = backData[j].gid;
							itemData.attachesList.push(imgItem);
						}
					}
					if(typeof callback === 'function') callback(itemData);
					// mui.previewImage();
					// mui.toast(data.backMsg ? data.backMsg : "上传成功！");
				} else {
					// mui.toast(data.backMsg ? data.backMsg : "上传失败！");
				}
			})
		}
	}
}

/*
 * 附件上传方法2
 * params:{billType单据类型;sourceId单据id;sourceType附件类型;userId;userName;files附件数组}
 */
var filesUpLoad = function(itemData, obj, params) {
	var that = obj.target;
	var files = [];
	var imgPics = [];
	if(that.files.length > 0) {
		// Util.loadingIn('正在上传...');
		for(var i = 0; i < that.files.length; i++) {
			var reader = new FileReader();
			reader.readAsDataURL(that.files[i]);
			(function(i) {
				reader.onload = function(e) {
					var imgInfo = {},
						result = this.result;
					imgInfo.src = result;
					imgPics.push(imgInfo);

					var img = new Image();
					img.src = result;
					var fileContent = result;

					img.onload = function() {
						var singleFile = {};
						singleFile.fileName = that.files[i].name;

						if(fileContent.length > maxSize)
							fileContent = compress(this); //图片压缩

						singleFile.fileSize = fileContent.length;
						singleFile.fileContent = fileContent.substring(fileContent.indexOf(",") + 1);

						files.push(singleFile);
						singleFile = {};

						if(files.length === that.files.length) {
							params.files = files;
							ajax.postJSON(uploadUrl, JSON.stringify(params), function(data) {
								if(data.success) {
									var backData = data.backData;
									console.log("imgbackData===", backData);
									if(backData.length) {
										for(var i = 0; i < imgPics.length; i++) {
											itemData.attaches.push({
												thumbnail: imgPics[i].src,
												preview: imgPics[i].src,
												gid: backData[i].gid
											});
										}
									}
									// mui.previewImage();
									// mui.toast(data.backMsg ? data.backMsg : "上传成功！");
								} else {
									// mui.toast(data.backMsg ? data.backMsg : "上传失败！");
								}
							})
						}
					}
				}
			})(i);
		}
	}
}

//下载显示图片，可以删除，新增
var multiFilesDownLoad = function(itemData, params) {
	var imgAttaches = [];
	ajax.getJSON(downloadUrl, params, function(data) {
		if(data.success) {
			var backData = data.backData;
			if(backData !== null) {
				var length = backData.length;
				for(var i = 0; i < length; i++) {
					//真实图片加载完成前默认图片
					var imgInit = imgload;
					itemData.attachesList.push({
						thumbnail: imgInit,
						preview: imgInit
					});
					itemData.attaches.push({
						thumbnail: imgInit,
						preview: imgInit
					});

					imgAttaches.push({
						thumbnail: imgInit,
						preview: imgInit
					});
					if(i === length - 1) {
						// mui.previewImage();
					}
					(function(i) {
						var img = new Image();
						var filePath = backData[i].filePath;
						var fileType = filePath.split('.')[1];
						var thumb_size = '100x100';
						var thumbnail = MODULE_URL.FILE_DOWN_SERVER +'/'+ filePath.substring(0, filePath.indexOf('.')) + '_' + thumb_size + '.' + fileType;
						img.src = thumbnail;
						img.onload = function() {
							imgAttaches[i] = {
								thumbnail: thumbnail,
								preview: MODULE_URL.FILE_DOWN_SERVER + filePath,
								gid: backData[i].gid
							};
							itemData.attachesList(imgAttaches);
							itemData.attaches(imgAttaches);
						}
					})(i);
				}
			}

		} else {
			// mui.toast("获取图片失败！");
		}
	});
}

//下载图片，不可删除，新增图片
var filesDownLoad = function(itemData, params, callback) {
	var imgAttaches = [];
	// if(!itemData.attaches)
	// 	itemData.attaches = ko.observableArray([]);
	// if(!itemData.attachesList)
	// 	itemData.attachesList = ko.observableArray([]);
	ajax.getJSON(downloadUrl, params, function(data) {
		if(data.success) {
			var backData = data.backData;
			if(backData !== null) {
				var length = backData.length;
				for(var i = 0; i < length; i++) {
					//真实图片加载完成前默认图片
					var imgInit = imgload;
					imgAttaches.push({
						thumbnail: imgInit,
						preview: imgInit
					});
					itemData.attachesList.push({
						thumbnail: imgInit,
						preview: imgInit
					});
					if(i === length - 1) {
						// mui.previewImage();
					}
					(function(i) {
						var img = new Image();
						var filePath = backData[i].filePath;
						var fileType = filePath.split('.')[1];
						var thumb_size = '100x100';
						var thumbnail = MODULE_URL.FILE_DOWN_SERVER + '/' + filePath.substring(0, filePath.indexOf('.')) + '_' + thumb_size + '.' + fileType;
						img.src = thumbnail;
						img.onload = function() {
							imgAttaches[i] = {
								thumbnail: thumbnail,
								preview: MODULE_URL.FILE_DOWN_SERVER + '/' + filePath,
								gid: backData[i].gid
							};
							// itemData.attaches(imgAttaches);
							itemData.attachesList = imgAttaches;
							callback();
						}
					})(i);
				}
			}
		} else {
			// mui.toast("获取图片失败！");
		}
	});
}

var fileDelByGid = function(param) {
	console.log("param==",param);
	if(!param.attachIds){
		// Toast.info('图片gid为空',1);
		return;
	}
	ajax.getJSON(deleteUrl, param, function(data) {
		if(data.success) {
			// Toast.info("删除成功！",1)
		} else {
			// Toast.info(data.backMsg);
			return;
		}
	})
}

export default {
	'multiFilesUpLoad': multiFilesUpLoad,
	'filesUpLoad': filesUpLoad,
	'multiFilesDownLoad': multiFilesDownLoad,
	'filesDownLoad': filesDownLoad,
	'fileDelByGid': fileDelByGid
};