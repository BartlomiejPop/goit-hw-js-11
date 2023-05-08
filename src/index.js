import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// import throttle from 'lodash.throttle';

let pageCounter;

console.log('wyszukiwarka obrazów');
const inputEl = document.querySelector('.search-input');
const submitBtn = document.querySelector('.submit-btn');
// const loadMoreBtn = document.querySelector('.load-more');
const galleryEl = document.querySelector('.gallery');

const fetchFirstData = async phraseToSearch => {
  const response = await fetch(
    `https://pixabay.com/api/?key=35826418-2b05267c07a6de2b6b5980d0a&q=${phraseToSearch}&image_type=photo&orientation=horizontal&safesearch=true`
  );
  const responseJSON = await response.json();
  Notiflix.Notify.info(
    `Hooray! We found ${responseJSON.totalHits} images.`
  )
    // .catch(error => console.log('error : ', error));
};

const fetchData = async phraseToSearch => {
  const response = await fetch(
    `https://pixabay.com/api/?key=35826418-2b05267c07a6de2b6b5980d0a&q=${phraseToSearch}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pageCounter}`
  );
  const responseJSON = await response.json();
  const data = await responseJSON.hits;
  //  data.catch( error => console.log('error : ', error));
  // .then(response => response.json())
  // .then(data => data.hits)
  // .catch(error => console.log('error : ', error));

  return data;
};

// const fetchData = async phraseToSearch => {
//   return await axios.get('https://pixabay.com/api/', {
//       params: {
//         key: `35826418-2b05267c07a6de2b6b5980d0a`,
//         q: `${inputEl.value}`,
//         image_type: `photo`,
//         orientation: `horizontal`,
//         safesearch: true,
//       },
//     })
//     .then(response => response.json())
//     .then(data => data.hits)
//     .catch(error => console.log('error : ', error));
// };

const renderGalleryItems = pictures => {
  if (pictures.length < 40) {
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    // loadMoreBtn.style.display = 'none';
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
    fetchData(inputEl.value).then(res => {
      renderGalleryItems(res);
    });
  }
};

submitBtn.addEventListener('click', e => {
  fetchFirstData(inputEl.value);
  pageCounter = 1;
  // loadMoreBtn.style.display = 'block';
  galleryEl.innerHTML = '';
  e.preventDefault();
  fetchData(inputEl.value).then(res => {
    console.log(res);
    renderGalleryItems(res);
  });
});

// loadMoreBtn.addEventListener('click', () => {
//   pageCounter++;
//   fetchData(inputEl.value).then(res => {
//     console.log(res);
//     renderGalleryItems(res);
//   });
// });

// galleryEl.addEventListener('click', e => {
//   e.preventDefault();
// });

window.addEventListener(
  'scroll',
  // throttle(() => {
  handleInfiniteScroll
  // }, 1000)
);

// var gallery = $('.gallery a').simpleLightbox();
var lightbox = new SimpleLightbox('.gallery a', { captionDelay: 500 });
console.log('x')
