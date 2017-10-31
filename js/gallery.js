import {
  nextTick,
  createDiv,
  createEl,
  closeSvg,
  createLoadOverlay,
} from 'helpers';

import {
  disableOverlay,
  enableOverlay,
} from 'navigation';

export default function galleryMagic() {
  const gallery = document.getElementById('gallery');
  const loadingOverlay = createLoadOverlay();
  gallery.insertBefore(loadingOverlay, gallery.firstChild);
  const images = [...gallery.getElementsByTagName('img')];
  let moving = false;
  let wasMoving = false;
  let closing = false;
  let startScroll = 0;
  let startLeft = 0;
  let offset = 0;
  let time = 0;

  gallery.classList.add('cursor-grab');
  gallery.style.overflowY = 'hidden';
  const galleryMouseDownEvent = e => {
    gallery.classList.remove('cursor-grab');
    document.body.classList.add('cursor-grabbing');
    time = performance.now();
    startScroll = e.clientX;
    startLeft = gallery.scrollLeft;
    moving = true;
  };
  const galleryMouseMoveEvent = e => {
    if (!moving) return;
    wasMoving = true;
    offset = e.clientX - startScroll;
    requestAnimationFrame(() => { gallery.scrollTo(startLeft - offset, 0); });
  };

  const smooth = (off) => {
    const velocity = off / time * 30;
    const gg = (vel, scrollLeft) => {
      const newScrollLeft = scrollLeft - vel;
      gallery.scrollTo(newScrollLeft, 0);
      if (Math.abs(vel) > 1) {
        requestAnimationFrame(() => gg(vel * 0.9, newScrollLeft));
      }
    };
    requestAnimationFrame(() => gg(velocity, startLeft - off));
  };

  const galleryMouseUpEvent = () => {
    if (!moving) return;
    document.body.classList.remove('cursor-grabbing');
    gallery.classList.add('cursor-grab');
    time = performance.now() - time;
    if (offset !== 0) {
      smooth(offset);
      offset = 0;
    }
    moving = false;
    nextTick(() => { wasMoving = false; });
  };

  Array.prototype.forEach.call(gallery.children, child => { child.ondragstart = () => false; });

  gallery.onmousedown = galleryMouseDownEvent;
  document.addEventListener('mousemove', galleryMouseMoveEvent);
  document.addEventListener('mouseup', galleryMouseUpEvent);

  const imageIndexToPhotoContainer = Array(images.length);

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
    }, 1000);
  }

  lightbox.onclick = e => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  };

  function generatePhotoContainer(i) {
    const image = images[i];
    const photoContainer = createDiv('photo-container');
    const photoWrapper = createDiv('relative');
    const caption = createDiv('w-100 fw5 mt2');
    caption.innerText = image.alt;
    const photo = createEl('img', 'photo');
    photo.src = image.src;
    photoWrapper.appendChild(photo);
    const closeButton = createDiv('close-button pointer dim');
    closeButton.innerHTML = closeSvg;
    photoWrapper.appendChild(closeButton);
    closeButton.onclick = closeLightbox;

    const leftSide = 'translateX(-100vw) translate(-50%, -50%)';
    const rightSide = 'translateX(100vw) translate(-50%, -50%)';

    if (i < images.length - 1) {
      const rightButton = createDiv('gallery-right f3 flex pointer dim');
      rightButton.appendChild(createEl('i', 'fa fa-angle-right fa-fw self-center'));
      photoWrapper.appendChild(rightButton);
      rightButton.onclick = () => {
        photoContainer.style.transform = leftSide;
        setTimeout(() => {
          photoContainer.remove();
          photoContainer.style.transform = null;
        }, 1000);
        const nextPhotoContainer = imageIndexToPhotoContainer[i + 1] || generatePhotoContainer(i + 1);
        nextPhotoContainer.style.transform = rightSide;
        lightbox.appendChild(nextPhotoContainer);
        currentPhotocontainer = nextPhotoContainer;
        nextPhotoContainer.clientHeight;
        nextPhotoContainer.style.transform = null;
      };
    }
    if (i > 0) {
      const leftButton = createDiv('gallery-left f3 flex pointer dim');
      leftButton.appendChild(createEl('i', 'fa fa-angle-left fa-fw self-center'));
      photoWrapper.appendChild(leftButton);
      leftButton.onclick = () => {
        photoContainer.style.transform = rightSide;
        setTimeout(() => {
          photoContainer.remove();
          photoContainer.style.transform = null;
        }, 1000);
        const nextPhotoContainer = imageIndexToPhotoContainer[i - 1] || generatePhotoContainer(i - 1);
        nextPhotoContainer.style.transform = leftSide;
        lightbox.appendChild(nextPhotoContainer);
        currentPhotocontainer = nextPhotoContainer;
        nextPhotoContainer.clientHeight;
        nextPhotoContainer.style.transform = null;
      };
    }
    photoContainer.appendChild(photoWrapper);
    photoContainer.appendChild(caption);
    imageIndexToPhotoContainer[i] = photoContainer;
    return photoContainer;
  }

  images.forEach((image, i) => {
    image.onclick = () => {
      if (wasMoving || closing) {
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

  Promise.all(images.map(image => new Promise(resolve => {
    if (image.complete) {
      resolve();
    } else {
      image.onload = () => { resolve(); };
    }
  }))).then(() => {
    loadingOverlay.style.display = 'none';
    new window.Packery(gallery, {
      itemSelector: '.gallery-img-wrapper',
      layoutMode: 'packery',
      horizontal: true,
      resize: false,
      gutter: 10,
    });
  });
}
