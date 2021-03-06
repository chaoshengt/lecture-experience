import Point from './classes/Point.js';

export function getMouseCoordsOnCanvas(e, canvas) {
  let x; let y;
  // handle tablet/phone
  if (e.touches) {
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
  } else {
    x = e.clientX;
    y = e.clientY;
  }
  const rect = canvas.getBoundingClientRect();
  x = Math.round(x - rect.left);
  y = Math.round(y - rect.top);
  return new Point(x, y);
}

// This will find the distance for the drawing of the circle in the canvas
export function findDistance(point1, point2) { // coord1 ==> start, coord2 ==> finish,
  const exp1 = Math.pow(point2.x - point1.x, 2);
  const exp2 = Math.pow(point2.y - point1.y, 2);

  const distance = Math.sqrt(exp1 + exp2);

  return distance;
}

export function getImgElemFromImgData(imgData) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = imgData.width;
  canvas.height = imgData.height;
  ctx.putImageData(imgData, 0, 0);
  const imgElem = document.createElement('img');
  imgElem.src = canvas.toDataURL();
  return imgElem;
}

export function getImgDataFromImgElem(imgElem) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = imgElem.width;
  canvas.height = imgElem.height;
  context.drawImage(imgElem, 0, 0);
  return context.getImageData(0, 0, imgElem.width, imgElem.height);
}

export function showInfoMessage(message) {
  const popupId = '#info-popup';
  $(popupId).html(message);
  // do not change to arrow function! Or else it loses "this" context.
  $(popupId).fadeIn(200, function () {
    setTimeout(() => {
      $(this).fadeOut(300);
    }, 2000);
  });
}

export function getUrlId() {
  const url = window.location.pathname;
  const lastSlash = url.lastIndexOf('/');
  return url.substr(lastSlash + 1);
}

export function getJanusUrl() {
  const { host } = window.location;
  if (host.includes('localhost')) {
    return 'http://localhost:8088/janus';
  }
  return '/janus';
}

export function buildPostRequestOpts(body) {
  return {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  };
}

export function redirectToStats(roomId) {
  window.location = `/lecture/stats/${roomId}`;
}

export function isIOS() {
  return navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
}

export function copyTextToClipboard(text) {
  const tmpInput = document.createElement('input');
  tmpInput.value = text;
  document.body.appendChild(tmpInput);
  tmpInput.select();
  const range = document.createRange();
  range.selectNodeContents(tmpInput);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  tmpInput.setSelectionRange(0, 999999);
  document.execCommand('copy');
  document.body.removeChild(tmpInput);
}

export function reloadWindow() {
  window.location.reload();
}

export function addStream(htmlElem, streamTrack) {
  if (typeof streamTrack !== 'undefined') {
    const stream = new MediaStream();
    stream.addTrack(streamTrack);
    if ('srcObject' in htmlElem) {
      htmlElem.srcObject = stream;
    } else {
      htmlElem.src = window.URL.createObjURL(stream);
    }
  }
}

export async function getJanusToken() {
  const response = await fetch('/rtcToken');
  if (response.status === 200) {
    const { janusToken } = await response.json();
    return janusToken;
  }
  return null;
}

export function getStatusColor(status) {
  switch (status) {
    case 'starting':
      return '#46c2ff';
    case 'live':
      return '#2ecc40';
    case 'connection_lost':
      return '#f44336';
    case 'host_disconnected':
      return '#f0ad4e';
    default:
      return 'lightgray';
  }
}

export async function getTurnServers() {
  const response = await fetch('/turncreds');
  const turnServers = [];
  if (response.status === 200) {
    const {
      active, username, password, uri,
    } = await response.json();

    if (active) turnServers.push({ username, credential: password, urls: uri });
  }
  return turnServers;
}

export function getStunServers() {
  return [
    { url: 'stun:stun.l.google.com:19302' },
    { url: 'stun:stun1.l.google.com:19302' },
    { url: 'stun:stun2.l.google.com:19302' },
    { url: 'stun:stunserver.org' },
  ];
}

export function displayImagePopUpOnClick(e) {
  const image = e.target;
  const newImage = document.createElement('img');

  const ratio = image.clientHeight / image.clientWidth;
  newImage.classList.add(`modal-message-image-${ratio >= 1 ? 'vertical' : 'horizontal'}`);
  newImage.src = image.src;

  const downloadContainer = document.createElement('div');
  const text = document.createElement('span');
  const button = document.createElement('span');

  text.innerHTML = $(image).attr('data-name');
  button.innerHTML = "<i class='fas fa-cloud-download-alt'></i>";
  downloadContainer.setAttribute('data-file', image.src);
  downloadContainer.setAttribute('data-name', $(image).attr('data-name'));

  downloadContainer.append(text);
  downloadContainer.append(button);

  document.getElementById('image-modal').append(newImage);
  document.getElementById('image-modal').append(downloadContainer);
  downloadContainer.classList.add('download-container');
  const container = document.querySelector('.wrap-div-message-image');
  container.innerHTML = '';
  container.appendChild(newImage);
  container.appendChild(downloadContainer);

  $('#image-modal').show();
}

export function getImageFromVideo(video) {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL();
}

export function saveCurrentBoard(whiteboard) {
  whiteboard.boards[whiteboard.currentBoard] = whiteboard.makeNewBoard();
  $('[data-page=page]')
    .eq(`${whiteboard.currentBoard}`)
    .find('img')
    .attr('src', whiteboard.boards[whiteboard.currentBoard].image);
}

export function downloadFile(fileContent, fileName){
  let fileElement = document.createElement('a');
  fileElement.href = fileContent;
  fileElement.download = fileName;
  fileElement.click();
}

// reference: https://stackoverflow.com/questions/12168909/blob-from-dataurl
export function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], {type: mimeString});
  return blob;

}

export function getRandomColor() {
  const chatColors = [
    'linear-gradient(315deg, #bdd4e7 0%, #91acdd 74%)',
    'linear-gradient(315deg, #7cffcb 0%, #74f2ce 74%)',
    'linear-gradient(315deg, #c0abf0 0%, #b498f3 74%)',
    'linear-gradient(315deg, #f39f86 0%, #f9d976 74%)',
    'linear-gradient(315deg, #abe9cd 0%, #8ad7ee 74%)',
  ];

  return chatColors[Math.floor(Math.random() * chatColors.length)];
}

export function areSpeakersMuted(){
  return $('#toggle-speaker').hasClass('fa-volume-mute');
}

export function toggleSpeakers(){
  const isMuted = areSpeakersMuted();
  document.querySelectorAll('.speaker').forEach((speaker) => {
    speaker.muted = !isMuted;
  });
  $('#toggle-speaker').toggleClass('fa-volume-up');
  $('#toggle-speaker').toggleClass('fa-volume-mute');
}

export function addNewSpeaker(audioTrack, speakerId){
  const newSpeaker = document.createElement('audio');
  newSpeaker.autoplay = true;
  newSpeaker.style.display = 'none';
  $(`#${speakerId}`).remove();
  newSpeaker.setAttribute('id', `${speakerId}`);
  newSpeaker.muted = areSpeakersMuted();
  newSpeaker.classList.add('speaker');
  addStream(newSpeaker, audioTrack);
  document.body.appendChild(newSpeaker);
  document.querySelectorAll('.speaker').forEach((speaker) => {
    if (speaker.srcObject && !speaker.srcObject.active) {
      $(speaker).remove();
    }
  });
}

export function displayMediaError(){
  Swal.fire({
    icon: 'error',
    title: `<strong style="font-size: 1.2rem">${$('#swal-title').val()}</strong>`,
    html: `<div style="font-size: .9rem; opacity: .85;">
              ${$('#swal-text').val()}
            </div>`,
    confirmButtonColor: 'rgba(70, 194, 255, 1)',
    confirmButtonText: 'Ok',
    showClass: {
      popup: 'animate__animated animate__fadeIn',
    },
    footer: `
          <a style="color: gray; text-decoration: none;" href="https://getacclaim.zendesk.com/hc/en-us/articles/360001547832-Setting-the-default-camera-on-your-browser">
          <i class="fa fa-question-circle" aria-hidden="true"></i> ${$('#swal-help').val()}
          </a>`,
  }).then(reloadWindow);
}

export function displayMaxPublishersReachedWarning(){
  Swal.fire({
    icon: 'warning',
    title: `<strong style="font-size: 1.4rem">${$('#swal-max-number-of-publishers-title').val()}</strong>`,
    html: `
          <div style="font-size: 1rem; opacity: .85; text-align: left;">
              ${$('#swal-max-number-of-publishers-text').val()}
          </div>`,
    confirmButtonColor: 'rgba(70, 194, 255, 1)',
    confirmButtonText: 'Ok',
    showClass: {
      popup: 'animate__animated animate__fadeIn',
    }
  });
}

//====================================================================
/** 
 * The following two functions assumes in your html: 
 * the body has the ld-over class 
 * the body element contains a direct child with the class="ld ld-ring ld-spin"
 * includes loading.io css framework
*/
export function startSpinningPage(){
  $('body').addClass('running');
}

export function stopSpinningPage() {
  $('body').removeClass('running');
}
//====================================================================

export function playSound(path) {
  const sound = new Audio(path);
  sound.play();
}