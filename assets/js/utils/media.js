import { getConfig } from 'store/config';

/**
 *
 * @param {string} src
 * @param {number} secs
 * @returns {Promise}
 */
export function getVideoImage(src, secs) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');

    video.onloadedmetadata = () => {
      if (secs === -1) {
        secs = Math.round(video.duration / 2);
      }
      video.currentTime = Math.min(Math.max(0, (secs < 0 ? video.duration : 0) + secs), video.duration);
    };

    video.onseeked = () => {
      const canvas  = document.createElement('canvas');
      canvas.height = video.videoHeight;
      canvas.width  = video.videoWidth;
      const ctx     = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL());
    };

    video.onerror = (e) => {
      reject(e);
    };

    video.src = src;
  });
}

/**
 * @param {string} dataURI
 * @returns {Blob}
 */
export function dataURItoBlob(dataURI) {
  let byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0) {
    byteString = atob(dataURI.split(',')[1]);
  } else {
    byteString = unescape(dataURI.split(',')[1]);
  }

  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], {
    type: dataURI.split(',')[0].split(':')[1].split(';')[0]
  });
}

/**
 * @param {string} src
 * @returns {Promise}
 */
export function getImageDimensions(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width:  img.width,
        height: img.height,
        src
      });
    };
    if (getConfig().https) {
      img.src = src.replace('http://', 'https://');
    } else {
      img.src = src;
    }
  });
}

export default {
  getVideoImage,
  dataURItoBlob,
  getImageDimensions
};
