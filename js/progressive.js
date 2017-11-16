const progressiveImages = Array.from(document.getElementsByClassName('progressive'));
const blurDuration = 200;

export default function progressiveBlur() {
  progressiveImages.forEach(image => {
    if (!image.complete) {
      console.log(image);
      image.style.filter = 'blur(10px)';
      image.style.transition = `filter ${blurDuration}ms ease`;
      image.onload = () => {
        image.style.filter = null;
        setTimeout(() => {
          image.style.transition = null;
        }, blurDuration);
      };
    }
  });
}