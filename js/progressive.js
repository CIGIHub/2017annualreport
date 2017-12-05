const progressiveImages = Array.from(document.getElementsByClassName('progressive'));
const blurDuration = 200;

export default function progressiveBlur() {
  progressiveImages.forEach(image => {
    if (!image.complete) {
      image.style.filter = 'blur(10px)';
      image.style.transition = `filter ${blurDuration}ms ease`;
      image.onload = () => {
        image.style.filter = '';
        setTimeout(() => {
          image.style.transition = '';
        }, blurDuration);
      };
    }
  });
}