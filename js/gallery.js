import {
  createDiv,
  createEl,
  closeSvg,
  createLoadOverlay,
} from 'helpers';

import {
  disableOverlay,
  enableOverlay,
  mobile,
} from 'navigation';

export default function galleryMagic() {
  const gallery = document.getElementById('gallery');
  const galleryParent = gallery.parentElement;
  const loadingOverlay = createLoadOverlay();
  galleryParent.insertBefore(loadingOverlay, galleryParent.firstElementChild);
  const imageContainers = Array.from(gallery.getElementsByClassName('image-container'));
  let closing = false;

  //Array.prototype.forEach.call(gallery.children, child => { child.ondragstart = () => false; });

  const imageIndexToPhotoContainer = new Array(imageContainers.length);

  const lightbox = createDiv('lightbox overflow-hidden bg-black');
  let currentPhotocontainer = null;

  function closeLightbox() {
    lightbox.classList.remove('enabled');
    closing = true;
    setTimeout(() => {
      closing = false;
      disableOverlay();
      currentPhotocontainer.remove();
      lightbox.remove();
    }, 500);
  }

  lightbox.onclick = e => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  };

  function generatePhotoContainer(i) {
    const imageContainer = imageContainers[i];
    const image = imageContainer.firstElementChild.firstElementChild;
    const photoContainer = createDiv('media-container');
    const photoWrapper = createDiv('relative');
    const caption = imageContainer.lastElementChild.cloneNode(true);
    caption.classList.add('absolute');
    const photo = createEl('img', 'photo');
    photo.src = image.src;
    photoWrapper.appendChild(photo);
    const closeButton = createDiv('close-button pointer dim');
    closeButton.innerHTML = closeSvg;
    photoWrapper.appendChild(closeButton);
    closeButton.onclick = closeLightbox;

    const leftSide = 'translateX(-100vw) translate(-50%, -50%)';
    const rightSide = 'translateX(100vw) translate(-50%, -50%)';

    if (i < imageContainers.length - 1) {
      const rightButton = createDiv('gallery-right f3 flex pointer dim');
      rightButton.appendChild(createEl('i', 'fa fa-angle-right self-center'));
      photoWrapper.appendChild(rightButton);
      rightButton.onclick = () => {
        photoContainer.style.transform = leftSide;
        setTimeout(() => {
          photoContainer.remove();
          photoContainer.style.transform = '';
        }, 1000);
        const nextPhotoContainer = imageIndexToPhotoContainer[i + 1] || generatePhotoContainer(i + 1);
        nextPhotoContainer.style.transform = rightSide;
        lightbox.appendChild(nextPhotoContainer);
        currentPhotocontainer = nextPhotoContainer;
        nextPhotoContainer.clientHeight;
        nextPhotoContainer.style.transform = '';
      };
    }
    if (i > 0) {
      const leftButton = createDiv('gallery-left f3 flex pointer dim');
      leftButton.appendChild(createEl('i', 'fa fa-angle-left self-center'));
      photoWrapper.appendChild(leftButton);
      leftButton.onclick = () => {
        photoContainer.style.transform = rightSide;
        setTimeout(() => {
          photoContainer.remove();
          photoContainer.style.transform = '';
        }, 1000);
        const nextPhotoContainer = imageIndexToPhotoContainer[i - 1] || generatePhotoContainer(i - 1);
        nextPhotoContainer.style.transform = leftSide;
        lightbox.appendChild(nextPhotoContainer);
        currentPhotocontainer = nextPhotoContainer;
        nextPhotoContainer.clientHeight;
        nextPhotoContainer.style.transform = '';
      };
    }
    photoContainer.appendChild(photoWrapper);
    photoWrapper.appendChild(caption);
    imageIndexToPhotoContainer[i] = photoContainer;
    return photoContainer;
  }

  imageContainers.forEach((imageContainer, i) => {
    const image = imageContainer;
    image.onclick = () => {

      if (closing) {
        return;
      }
      const photoContainer = imageIndexToPhotoContainer[i] || generatePhotoContainer(i);
      document.body.appendChild(lightbox);
      lightbox.appendChild(photoContainer);
      currentPhotocontainer = photoContainer;
      enableOverlay();
      lightbox.clientHeight;
      lightbox.classList.add('enabled');
    };
  });

  Promise.all(imageContainers.map(imageContainer => new Promise(resolve => {
    const image = imageContainer.firstElementChild.firstElementChild;
    if (image.complete) {
      resolve();
    } else {
      image.onload = () => { resolve(); };
    }
  }))).then(() => {
    loadingOverlay.style.display = 'none';
  });
}
