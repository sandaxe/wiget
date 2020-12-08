const oicWidget = (function() {
	let isSendingTrue = '';
	let localMediaStream = '';
	let $userRefPermissionModal = document.querySelector('#oic-permission-modal');
	let $imageFrame = document.querySelector('.imgframe');
	let $demoFrame = document.querySelector('.demo');
	let $captureBtn = '';
	let $captureVideoBtn = '';
	let $stopVideoBtn = '';
	let $video = '';
	let $canvas = '';

	let $userRefUploadModal = document.querySelector('#oic-upload-modal');
	let $userRefSelectModelModal = document.querySelector('#oic-select-model-modal');
	let $modelFigurePreview = document.querySelector('#modelfigure img');
	let $previewFrame = document.querySelector('#oic-frame');
	let $profileImage = document.querySelector('#profile-image');
	let $preloader = document.querySelector('#oic-preloader');
	const defaultImage = '/public/img/widget/profile.jpg';
	let currentModelInView = 0;
	let imageData = {};
	let imageSource = '';
	const chunks = [];
	let recorder = null;
	let onDataAvailable = e => {
		chunks.push(e.data);
	};

	function _init(options) {
		if (options.capturePage) {
			if (!navigator.mediaDevices) {
				alert('getUserMedia support required to use this page');
			}

			$userRefPermissionModal = document.querySelector('#oic-permission-modal');
			$imageFrame = document.querySelector('.image-frame');
			$demoFrame = document.querySelector('.demo-frame');
			$captureBtn = document.querySelector('#oic-capture-btn');
			$captureVideoBtn = document.querySelector('#oic-capture-video-btn');
			$stopVideoBtn = document.querySelector('#oic-stop-video-btn');
			$video = document.getElementById('oic-video');
			$canvas = document.getElementById('oic-canvas');
			isSendingTrue = true;
			window.navigator.mediaDevices
				.getUserMedia({ video: true })
				.then(stream => {
					debugger;
					localMediaStream = stream;
					_takeUserPicture();
					_takeUserVideo();
				})
				.catch(err => {
					debugger;
					$userRefPermissionModal.style.display = 'block';
				});
			$video.addEventListener('click', _snapshotUserFace, false);
		} else {
			
			const sessionId = window.localStorage.getItem('sId');
			if (sessionId) {
				const request = new XMLHttpRequest();
				request.open('GET', `/v1/widget/${sessionId}`);
				request.onreadystatechange = () => {
					if (request.readyState === 4 && request.status === 200) {
						imageData = JSON.parse(request.responseText);
						$profileImage.setAttribute(
							'src',
							`https://storage.googleapis.com/cep-module/webapp/${imageData.imageUrl}`
						);
					} else {
						//$modelFigurePreview.setAttribute('src', '/public/img/widget/profile.jpg');
					}
				};
				request.onerror = () => {
					imageData = {};
					alert('Something went wrong');
				};
				request.send(null);
			}

			imageData = {
				_id: 'DEFAULT',
				sellionPointsWidth: 186.6,
				sellionPointsHeight: 215.5,
				distance: 136.19,
				YPR: '0_3_0',
				deviationYaw: 0,
				deviationPitch: 0,
				deviationRoll: 0
			};
			document.querySelector('#oicprev').addEventListener('click', () => {
				currentModelInView = 0;
				$modelFigurePreview.setAttribute('src', '/public/img/widget/profile.jpg');
			});
			document.querySelector('.navnext').addEventListener('click', () => {
				currentModelInView = 1;
				$modelFigurePreview.setAttribute('src', '/public/img/widget/female.jpg');
			});
			document.querySelector('#oic-submit-image').addEventListener('click', () => {
				$previewFrame.setAttribute('src', '');
				if (currentModelInView === 0) {
					// Male Model
					imageSource = '/public/img/widget/profile.jpg';
					imageData = {
						_id: 'DEFAULT',
						sellionPointsWidth: 186.6,
						sellionPointsHeight: 215.5,
						distance: 136.19,
						YPR: '0_3_0',
						deviationYaw: 0,
						deviationPitch: 0,
						deviationRoll: 0
					};
				} else {
					// Female Model
					imageSource = '/public/img/widget/female.jpg';
					imageData = {
						_id: 'DEFAULT',
						sellionPointsWidth: 183.71,
						sellionPointsHeight: 201.08,
						distance: 136.19,
						YPR: '0_3_0',
						deviationYaw: 0,
						deviationPitch: 0,
						deviationRoll: 0
					};
				}
				$profileImage.setAttribute('src', imageSource);
				$userRefSelectModelModal.style.display = 'none';
			});

			document.querySelector('#upload-image-btn').addEventListener('click', () => {
				$userRefUploadModal.style.display = 'block';
			});

			const modalCloseList = document.querySelectorAll('.oic-modal__close');
			Array.from(modalCloseList).forEach(modalclose => {
				modalclose.addEventListener('click', () => {
					$userRefUploadModal.style.display = 'none';
					$userRefSelectModelModal.style.display = 'none';
				});
			});

			document.querySelector('#select-model-btn').addEventListener('click', () => {
				$userRefSelectModelModal.style.display = '';
				$userRefSelectModelModal.style.display = 'block';
			});

			document.querySelector('#widget-upload').addEventListener('change', function() {
				$preloader.style.display = 'block';
				resizeImages(this.files[0], dataUrl => {
					const blobBin = atob(dataUrl.split(',')[1]);
					const selfieImageArray = [];
					for (let i = 0; i < blobBin.length; i++) {
						selfieImageArray.push(blobBin.charCodeAt(i));
					}
					const selfieImageFile = new Blob([new Uint8Array(selfieImageArray)], { type: 'image/png' });
					const formdata = new FormData();
					formdata.append('selfie', selfieImageFile);

					const request = new XMLHttpRequest();
					request.open('POST', '/v1/widget/uploadSelfie', true);
					request.onreadystatechange = () => {
						if (request.readyState === 4 && request.status === 200) {
							const data = JSON.parse(request.responseText);
							window.localStorage.setItem('sId', data._id);
							$profileImage.setAttribute('src', dataUrl);
							$previewFrame.setAttribute('src', '');
							$userRefUploadModal.style.display = 'none';
							imageData = data;
							$preloader.style.display = 'none';
						}
					};
					request.onerror = () => {
						alert('Something went wrong');
					};
					request.send(formdata);
				});
			});
		}
	}

	function resizeImages(file, complete) {
		const reader = new FileReader();
		reader.onload = function(e) {
			const img = new Image();
			img.onload = function() {
				complete(resizeInCanvas(img));
			};
			img.src = e.target.result;
		};
		reader.readAsDataURL(file);
	}

	function resizeInCanvas(img) {
		var perferedWidth = 360;
		var ratio = perferedWidth / img.width;
		var canvas = document.createElement('canvas');
		canvas.width = img.width * ratio;
		canvas.height = img.height * ratio;
		var ctx = canvas.getContext('2d');
		if (canvas.width > canvas.height) {
			var preferedWidth = 360;
			var ratio = preferedWidth / img.width;
			var canvas = document.createElement('canvas');
			canvas.width = img.width * ratio;
			canvas.height = img.width * ratio * img.width / img.height;
			var ctx = canvas.getContext('2d');
			ctx.setTransform(0, perferedWidth / img.height, -perferedWidth / img.height, 0, canvas.width, 0);
			ctx.drawImage(img, 0, 0);
		} else {
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		}
		return canvas.toDataURL();
	}

	function _getFrames(frameId) {
		debugger;
		var frameIdArray = [];
		frameIdArray.push(frameId);
		$previewFrame.setAttribute('src', '');
		$preloader.style.display = 'block';

		const request = new XMLHttpRequest();
		request.open('POST', '/v1/widget/getGlassFrames', true);
		request.setRequestHeader('Content-Type', 'application/json');
		request.onreadystatechange = () => {
			if (request.readyState === 4 && request.status === 200) {
				$preloader.style.display = 'none';
				const data = JSON.parse(request.responseText);
				$previewFrame.setAttribute('src', data[0].frameUrl);
				$previewFrame.style.left = `${data[0].left}px`;
				$previewFrame.style.top = `${data[0].top}px`;
				$previewFrame.style.width = `${data[0].width}px`;
				$previewFrame.style.transform = `perspective(200px) rotateX(${data[0].deviationX}deg) rotateY(${
					data[0].deviationY
				}deg) rotateZ(${data[0].deviationZ}deg)`;
			}
		};
		request.onerror = () => {
			alert('Something went wrong');
			$preloader.style.display = 'none';
		};
		if (imageData._id === 'DEFAULT') {
			request.send(
				JSON.stringify({
					_id: imageData._id,
					frameId: frameIdArray,
					imageData
				})
			);
		} else {
			request.send(
				JSON.stringify({
					_id: imageData._id,
					frameId: frameIdArray
				})
			);
		}
	}

	function _takeUserPicture() {
		$userRefPermissionModal.style.display = 'none';
		$demoFrame.style.marginTop = 0;
		$demoFrame.style.marginBottom = 0;
		$captureBtn.style.display = 'block';
		$captureBtn.disabled = true;
		$captureBtn.className += ' disabled';
		window.setTimeout(() => {
			document.querySelector('.oic-h-head').style.display = 'block';
			document.querySelector('.oic-face-place').style.display = 'block';
		}, 500);

		const context = $canvas.getContext('2d');
		const tracker = new tracking.ObjectTracker('face');
		tracker.setInitialScale(4);
		tracker.setStepSize(2);
		tracker.setEdgesDensity(0.1);
		const trackerTask = tracking.track('#oic-video', tracker, { camera: true });
		tracker.on('track', function(event) {
			event.data.forEach(function(rect) {
				$captureBtn.disabled = false;
				$captureBtn.classList.remove('disabled');
				$captureBtn.addEventListener('click', () => {
					if (isSendingTrue === true) {
						isSendingTrue = false;
						context.drawImage(
							$video,
							130,
							0,
							$canvas.width,
							$canvas.height,
							0,
							0,
							$canvas.width,
							$canvas.height
						);
						const blobBin = atob($canvas.toDataURL().split(',')[1]);
						const selfieImageArray = [];
						for (let i = 0; i < blobBin.length; i++) {
							selfieImageArray.push(blobBin.charCodeAt(i));
						}
						const selfieImageFile = new Blob([new Uint8Array(selfieImageArray)], { type: 'image/png' });
						const formdata = new FormData();
						formdata.append('selfie', selfieImageFile);

						window.setTimeout(() => {
							$preloader.style.display = 'block';
							const request = new XMLHttpRequest();
							request.open('POST', '/v1/widget/uploadSelfie', true);
							request.onreadystatechange = () => {
								if (request.readyState === 4) {
									if (request.status === 200) {
										$preloader.style.display = 'none';
										const data = JSON.parse(request.responseText);
										window.localStorage.setItem('sId', data._id);
										window.history.go(-1);
									} else {
										window.history.go(-1);
									}
								}
							};
							request.onerror = () => {
								alert('Something went wrong');
							};
							request.send(formdata);
						}, 1);
						trackerTask.stop();
					}
				});
			});
		});
	}

	function _takeUserVideo() {
		if (!localMediaStream) {
			return false;
		}
		recorder = new MediaRecorder(localMediaStream);
		recorder.ondataavailable = onDataAvailable;
		const video = document.querySelector('video');
		const url = window.URL.createObjectURL(localMediaStream);
		video.src = url;

		$captureVideoBtn.onclick = () => {
			recorder.start();
			console.log(recorder.state);
			console.log('recorder started');
		};

		$stopVideoBtn.onclick = () => {
			recorder.stop();
			console.log(recorder.state);
			console.log('recorder stopped');
		};

		video.onloadedmetadata = e => {
			console.log('onloadedmetadata', e);
		};

		recorder.onstop = e => {
			console.log('e', e);
			console.log('chunks', chunks);
			const bigVideoBlob = new Blob(chunks, { type: 'video/webm; codecs=webm' });
			let fd = new FormData();
			fd.append('selfieVideo', bigVideoBlob);
			const request = new XMLHttpRequest();
			request.open('POST', '/v1/widget/uploadVideo', true);
			request.onreadystatechange = () => {
				if (request.readyState === 4) {
					if (request.status === 200) {
						$preloader.style.display = 'none';
						const data = JSON.parse(request.responseText);
						debugger;
						console.log(data);
						// window.localStorage.setItem('sId', data._id);
						// window.history.go(-1);
					} else {
						// window.history.go(-1);
					}
				}
			};
			request.onerror = () => {
				alert('Something went wrong');
			};
			request.send(fd);
		};
	}

	function _snapshotUserFace() {
		if (localMediaStream) {
			document.querySelector('a').href = $canvas.toDataURL('image/webp');
		}
	}

	return {
		init: _init,
		selectedFrame: _getFrames
	};
})();

window.oicWidget = oicWidget;
