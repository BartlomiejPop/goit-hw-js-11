import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// import throttle from 'lodash.throttle';

let pageCounter;

console.log('wyszukiwarka obrazów');
const inputEl = document.querySelector('.search-input');
const submitBtn = document.querySelector('.submit-btn');
const galleryEl = document.querySelector('.gallery');

const fetchData = async phraseToSearch => {
  const response = await axios.get(
    `https://pixabay.com/api/?key=35826418-2b05267c07a6de2b6b5980d0a&q=${phraseToSearch}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pageCounter}`
  );
  if (response.data.totalHits > 0 && pageCounter === 1) {
    Notiflix.Notify.info(`Hooray! We found ${response.data.totalHits} images.`);
  }
  return response.data.hits;
};

const renderGalleryItems = pictures => {
  if (pictures.length < 40 && pictures.length !== 0) {
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  } else if (pictures.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  pictures.forEach(
    el =>
      (galleryEl.innerHTML += `
<div class="photo-card">
<div class="photo">
<a href="${el.largeImageURL}">
  <img src="${el.webformatURL}" title="author : ${el.user}" loading="lazy" />
  </a>
  </div>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${el.likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${el.views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${el.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${el.downloads}</b>
    </p>
  </div>
</div>`)
  );
  lightbox.refresh();
};

const handleInfiniteScroll = () => {
  const endOfPage =
    window.innerHeight + window.pageYOffset >= document.body.offsetHeight;

  if (endOfPage) {
    pageCounter++;
    fetchData(inputEl.value)
      .then(res => {
        renderGalleryItems(res);
      })
      .catch(error => console.error(error));
    
  }
};

submitBtn.addEventListener('click', e => {
  pageCounter = 1;
  galleryEl.innerHTML = '';
  e.preventDefault();
  fetchData(inputEl.value).then(res => {
    renderGalleryItems(res);
  });
});

window.addEventListener(
  'scroll',
  // throttle(() => {
  handleInfiniteScroll
  // }, 1000)
);

var lightbox = new SimpleLightbox('.gallery a', { captionDelay: 500 });
