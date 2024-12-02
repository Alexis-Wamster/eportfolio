let currentIndex = 0;
const wrapper = document.getElementById('carouselWrapper');
wrapper.classList.add("transition");
const slides = document.querySelectorAll('.carousel-item');
const totalSlides = slides.length;
const indicators = [];
let interval = setInterval(nextSlide, 6000);

duplicateFirstSlide();
initialiseIndicator();

function duplicateFirstSlide(){
  const fakeSlide = slides[0].cloneNode(true);
  wrapper.appendChild(fakeSlide);
}

function initialiseIndicator(){
  const carouselIndicators = document.getElementById("carouselIndicators");
  let indicator = carouselIndicators.getElementsByClassName("indicator")[0];
  carouselIndicators.removeChild(indicator);
    for (let i=0; i<slides.length; i++){
      let indicatorCopy = indicator.cloneNode(true);
      indicatorCopy.onclick = function() {goToSlide(i)};
      carouselIndicators.appendChild(indicatorCopy);
      indicators.push(indicatorCopy);
    }
}

function updateCarousel() {
  wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
  setActiveIndicator();
}

function nextSlide() {
  if (currentIndex === totalSlides-1){
    goToSlide(totalSlides);
    currentIndex = 0;
    setActiveIndicator();
    
    wrapper.addEventListener('transitionend', function handleTransitionEnd(event) {
    if (event.propertyName === 'transform') {
        wrapper.classList.remove("transition");
        wrapper.style.transform = `translateX(0%)`;
        setTimeout(() => {
          wrapper.classList.add("transition");
        }, 0);
        wrapper.removeEventListener('transitionend', handleTransitionEnd);
    }
});
  }
  else{
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
  }
}

function previousSlide() {
  if (currentIndex === 0){
    wrapper.classList.remove("transition");
    wrapper.style.transform = `translateX(-${totalSlides * 100}%)`;
    requestAnimationFrame(() => {
      wrapper.classList.add("transition");
      currentIndex = totalSlides-1;
      goToSlide(currentIndex);
    });
  }
  else{
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
  }
}

function goToSlide(index) {
  currentIndex = index;
  updateCarousel();
  stopAutoSlide();
}

function setActiveIndicator() {
  indicators.forEach((indicator, index) => {
    if (index === currentIndex) {
      indicator.classList.add('active');
    } else {
      indicator.classList.remove('active');
    }
  });
}

function stopAutoSlide() {
  clearInterval(interval);
}

document.querySelector('.button-left').addEventListener('click', stopAutoSlide);
document.querySelector('.button-right').addEventListener('click', stopAutoSlide);

setActiveIndicator();