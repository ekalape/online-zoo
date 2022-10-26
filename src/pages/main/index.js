import '../../assets/styles/normalize.css';
import '../../assets/styles/variables.scss';

import '../../assets/styles/header.scss';
import '../../assets/styles/header-media.scss';

import '../../assets/styles/footer.scss';
import '../../assets/styles/footer-media.scss';

import './index.scss';
import './index-media1000.scss';

import '../../json-source/animals.json';
import '../../json-source/testim.json';

import '../../assets/icons/pay.png';
import '../../assets/icons/arrow.png';
import '../../assets/icons/monkey.png';
import '../../assets/icons/zoo.png';
import '../../assets/icons/banana-bamboo_icon.png';
import '../../assets/icons/logo.png';
import '../../assets/icons/meet-fish_icon.png';
import '../../assets/icons/avatars/profile_icon1.png';
import '../../assets/icons/avatars/profile_icon2.png';
import '../../assets/icons/avatars/profile_icon3.png';
import '../../assets/icons/avatars/profile_icon4.png';
import '../../assets/icons/avatars/profile_icon5.png';
import '../../assets/icons/avatars/profile_icon6.png';
import '../../assets/icons/avatars/profile_icon8.png';
import '../../assets/icons/avatars/profile_icon9.png';
import '../../assets/icons/avatars/profile_icon10.png';
import '../../assets/icons/avatars/profile_icon11.png';
import '../../assets/images/gallery/cheetahs.png';
import '../../assets/images/gallery/eagles.png';
import '../../assets/images/gallery/giant-pandas.png';
import '../../assets/images/gallery/gorillas.png';
import '../../assets/images/gallery/penguins.png';
import '../../assets/images/gallery/sloth.png';
import '../../assets/images/gallery/bear.jpg';
import '../../assets/images/gallery/canguroo.jpg';
import '../../assets/images/gallery/deer.jpg';
import '../../assets/images/gallery/dolphin.jpg';
import '../../assets/images/gallery/lemure.jpg';
import '../../assets/images/gallery/lion.jpg';
import '../../assets/images/gallery/otter.jpg';
import '../../assets/images/gallery/tiger.jpg';
import '../../assets/images/gallery/tucan.jpg';
import '../../assets/images/gallery/croco.jpg';
import '../../assets/images/gallery/wolf.jpg';
import '../../assets/images/gallery/zhirafa.jpg';
import '../../assets/images/gallery/squirrel.jpg';
import '../../assets/images/bamboo-cap.png';
import '../../assets/images/bamboo-cap1000.png';
import '../../assets/images/panda_widget.png';
import '../../assets/icons/panda_fav.ico';

const galleryContainer = document.querySelector('.gallery__cont');
const galWindow = document.querySelector('.gallery');

const btnGalBack = document.querySelector('.btn-back');
const btnGalForward = document.querySelector('.btn-forward');
let reduceCards = window.matchMedia('(max-width:950px)');
let cardsCount = reduceCards.matches ? 4 : 6;

let centralIndexes = [];

const cardsQuantity = 18;

btnGalBack.addEventListener('click', galleryForward);
btnGalForward.addEventListener('click', galleryBack);

/* -------------------- touch reaction start --------------------- */

galWindow.addEventListener('pointerdown', getStartPos);
galWindow.addEventListener('pointermove', getLastPos);
galWindow.addEventListener('pointerleave', () => stopTouch());

let startX = null;
let arrOfEnds = [];

function getStartPos(event) {
  startX = event.clientX - galWindow.getBoundingClientRect().left;
}
function getLastPos(event) {
  let endX = event.clientX - galWindow.getBoundingClientRect().left;
  arrOfEnds.push(endX);

  touchMove(Math.max(...arrOfEnds));
}
function touchMove(endX) {
  if (startX) {
    if (endX > startX) {
      galleryForward();
    }
    if (startX > endX) {
      galleryBack();
    }
  }
}
function stopTouch() {
  startX = null;

  arrOfEnds.length = 0;
}
/* -------------------- touch reaction end --------------------- */

/* -------- fetch animals -------- */

window.addEventListener('load', createGallery);
window.addEventListener('resize', updateGallery);

//updating gallery after resize window
async function updateGallery() {
  const animals = await getAnimals();
  let newCardCount = reduceCards.matches ? 4 : 6;

  if (newCardCount === cardsCount) return;
  cardsCount = newCardCount;
  for (let cb = 0; cb < 3; cb++) {
    let centerBlock = galleryContainer.children[cb];

    if (centerBlock.children.length == newCardCount) return;
    if (centerBlock.children.length < newCardCount) {
      let newIndexes = [];
      while (newIndexes.length < 2) {
        let num = Math.floor(Math.random() * cardsQuantity);
        if (
          ![...centerBlock.children].some(
            (x) => Number(x.dataset.index) == num
          ) &&
          !newIndexes.some((x) => Number(x.dataset.index) == num)
        ) {
          newIndexes.push(createCard(animals[num], num));
        }
      }
      //centerBlock.append(...newIndexes);
      centerBlock.children[1].after(newIndexes[0]);
      centerBlock.lastElementChild.after(newIndexes[1]);
    }
    if (centerBlock.children.length > newCardCount) {
      centerBlock.children[2].remove();
      centerBlock.lastElementChild.remove();
    }
  }
}

//the first gallery creation
async function createGallery() {
  for (let i = 0; i < 3; i++) {
    const block = await createCardBlock();
    galleryContainer.append(block);
  }
  centralIndexes = [...galleryContainer.children[1].children].map((x) =>
    Number(x.dataset.index)
  );
  console.log(centralIndexes);
}

//fetch animals json
async function getAnimals() {
  const resp = await fetch('../../json-source/animals.json');
  const animals = await resp.json();
  return animals;
}

//create one card
function createCard(c, index) {
  const card = document.createElement('div');
  card.className = 'border-card';
  card.dataset.index = index;
  card.innerHTML = `<div class="card">
      <img class="card__image" src=${c.url}
          alt=${c.name}>
      <div class="card__bottom  bottom-card">
          <div class="bottom-card__text">
              <h4>${c.name}</h4>
              <p>${c.native}</p>
          </div>
          <img src=${c.food}
              class="bottom-card__food-image">
      </div>
  </div>`;
  return card;
}

//create one block od cards depending on cards quantity per block
async function createCardBlock() {
  const animals = await getAnimals();
  let cardsNum = reduceCards.matches ? 4 : 6;
  const block = document.createElement('div');
  block.className = 'cards-block';
  //block.dataset.cardsQ = cardsNum;

  let blockArr = [];
  while (blockArr.length < cardsNum) {
    let num = Math.floor(Math.random() * cardsQuantity);

    if (
      !blockArr.some((x) => Number(x.dataset.index) == num) &&
      !centralIndexes.includes(num)
    ) {
      blockArr.push(createCard(animals[num], num));
    }
  }

  block.append(...blockArr);
  return block;
}

//moving gallery blocks back and forward
function galleryBack() {
  btnGalBack.removeEventListener('click', galleryForward);
  btnGalForward.removeEventListener('click', galleryBack);

  galWindow.removeEventListener('pointerdown', getStartPos);
  galWindow.removeEventListener('pointermove', getLastPos);
  stopTouch();
  galleryContainer.classList.add('skid-back');

  setTimeout(async () => {
    btnGalBack.addEventListener('click', galleryForward);
    btnGalForward.addEventListener('click', galleryBack);

    galWindow.addEventListener('pointerdown', getStartPos);
    galWindow.addEventListener('pointermove', getLastPos);
    centralIndexes = [...galleryContainer.children[2].children].map((x) =>
      Number(x.dataset.index)
    );
    let block = await createCardBlock();

    galleryContainer.firstElementChild.remove();

    galleryContainer.append(block);
    galleryContainer.classList.remove('skid-back');
  }, 800);
}
function galleryForward() {
  btnGalBack.removeEventListener('click', galleryForward);
  btnGalForward.removeEventListener('click', galleryBack);

  galWindow.removeEventListener('pointerdown', getStartPos);
  galWindow.removeEventListener('pointermove', getLastPos);
  stopTouch();
  galleryContainer.classList.add('skid-forward');

  setTimeout(async () => {
    btnGalBack.addEventListener('click', galleryForward);
    btnGalForward.addEventListener('click', galleryBack);

    galWindow.addEventListener('pointerdown', getStartPos);
    galWindow.addEventListener('pointermove', getLastPos);
    centralIndexes = [...galleryContainer.children[0].children].map((x) =>
      Number(x.dataset.index)
    );
    let block = await createCardBlock();

    galleryContainer.prepend(block);
    galleryContainer.lastElementChild.remove();

    galleryContainer.classList.remove('skid-forward');
  }, 800);
}

/* ----------------------------------------------------------------- */
/* --------------------------- btns -------------------------------- */

const feedBtn = document.querySelector('.btn-feed');
const donateBtn = document.querySelector('.btn-donate');

feedBtn.addEventListener(
  'click',
  () => (window.location.href = '../donate/donate.html')
);
donateBtn.addEventListener(
  'click',
  () => (window.location.href = '../donate/donate.html')
);

document.querySelector('.logo_footer').addEventListener('click', () => {
  window.location.href = './index.html';
});

const mailInputField = document.querySelector('#email-input');
const submitBtn = document.querySelector('.subscribe-form__btn');
let pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

mailInputField.addEventListener('input', (e) => {
  if (pattern.test(e.target.value)) {
    submitBtn.classList.add('submit__btn-valid');
  } else submitBtn.classList.remove('submit__btn-valid');
});
submitBtn.addEventListener('click', (e) => {
  if (!pattern.test(mailInputField.value)) {
    submitBtn.classList.remove('submit__btn-valid');
    submitBtn.classList.add('submit__btn-mistake');
  }
});

/* -------- hamburger start -------- */
const hamburgerBtn = document.querySelector('.hamburger');
const lateralMenu = document.querySelector('.lateral_menu');
const darkCover = document.querySelector('.dark-cover');

hamburgerBtn.addEventListener('click', () => {
  if (lateralMenu.classList.contains('menu_out')) {
    openMenu(false);
  } else {
    openMenu(true);
  }
});
lateralMenu.addEventListener('click', (event) => {
  if (event.target.classList.contains('clickable')) {
    event.stopPropagation();
    openMenu(false);
  }
});

darkCover.addEventListener('click', (event) => {
  event.stopPropagation();
  openMenu(false);
});
/* -------- hamburger end -------- */

function openMenu(open) {
  if (open) {
    darkCover.classList.add('modal-show');
    document.body.style.overflowY = 'hidden';
    lateralMenu.classList.add('menu_out');
    hamburgerBtn.classList.add('change');
  } else {
    darkCover.classList.remove('modal-show');
    document.body.style.overflowY = 'visible';
    lateralMenu.classList.remove('menu_out');
    hamburgerBtn.classList.remove('change');
  }
}

/* ---------------- testimonials start ------------------ */
const testContainer = document.querySelector('.testimonials-content__all');

async function getUsers() {
  const res = await fetch('../../json-source/testim.json');
  const users = await res.json();
  testContainer.innerHTML = '';
  for (let i = 0; i < users.length; i++) {
    let x = users[i];
    const testimonialsCard = `<div class="testimonials__card-border">
    <div class="testimonials__card" data-num=${i}>
        <div class="author">
            <img src=${x.avatarUrl}
                class="feedback-avatar">
            <div class="feedback-author">
                <p class="name">${x.name}</p>
                <p class="feedback-data">
                    <span>${x.place}</span><span> · </span><span>${x.day}</span>
                </p>
            </div>
        </div>
        <p class="feedback-text">The best online zoo I’ve met. My son delighted very much ljves
            to
            watch
            gouillas. Online zoo is one jf the ways to instill a love for animals.The best
            online
            zoo
            I’ve met. My son delighted very much ljves to watch gouillas. Online zoo is one jf
            the
            ways
            to instill a love for animals.
            The best online zoo I’ve met. My son delighted very much ljves to watch gouillas.
            Online
            zoo
            is one jf the ways to instill a love for animals.The best online zoo I’ve met. My
            son
            delighted very much ljves to watch gouillas. Online zoo is one jf the ways to
            instill a
            love
            for animals.
        </p>
    </div>
    </div>`;
    testContainer.innerHTML += testimonialsCard;
    const testCards = document.querySelectorAll('.testimonials__card');

    testCards.forEach((c) =>
      c.addEventListener('click', (e) => {
        let person = users[e.currentTarget.dataset.num];

        createModal(person);
      })
    );
  }
}
getUsers();
const modalBg = document.querySelector('.modal-dark-bg');

function createModal(person) {
  //modal.innerHTML="";
  const card = `<div class="modal-border"><div class="modal-close"></div>
  <div class="modal-testimonial"><div class="author">
  <img src=${person.avatarUrl}
      class="feedback-avatar">
  <div class="feedback-author">
      <p class="name">${person.name}</p>
      <p class="feedback-data">
          <span>${person.place}</span><span> · </span><span>${person.day}</span>
      </p>
  </div>
</div>
<p class="feedback-text">The best online zoo I’ve met. My son delighted very much ljves
  to
  watch
  gouillas. Online zoo is one jf the ways to instill a love for animals.The best
  online
  zoo
  I’ve met. My son delighted very much ljves to watch gouillas. Online zoo is one jf
  the
  ways
  to instill a love for animals.
  The best online zoo I’ve met. My son delighted very much ljves to watch gouillas.
  Online
  zoo
  is one jf the ways to instill a love for animals.The best online zoo I’ve met. My
  son
  delighted very much ljves to watch gouillas. Online zoo is one jf the ways to
  instill a
  love
  for animals.
</p></div></div>`;
  modalBg.innerHTML = card;
  modalBg.classList.add('modal-show');
  document.body.style.overflow = 'hidden';
  const closeModalBtn = document.querySelector('.modal-close'); //exists only after modal is opened
  modalBg.addEventListener('click', closeModal);
  closeModalBtn.addEventListener('click', closeModal);
}

function closeModal(event) {
  event.stopPropagation();
  if (
    event.target.classList.contains('modal-dark-bg') ||
    event.target.classList.contains('modal-close')
  ) {
    modalBg.classList.remove('modal-show');
    document.body.style.overflow = '';
  }
}

const slider = document.querySelector('.scrollbar__range');
let sliderMod = slider.value;
const test640 = window.matchMedia('(max-width: 640px)');

slider.addEventListener('input', testSliderPosition);
function testSliderPosition() {
  {
    sliderMod = slider.value;

    if (test640.matches) {
      slider.value = 0;
      testContainer.style.left = `0px`;
    } else {
      if (window.matchMedia('(max-width: 1000px)').matches) {
        testContainer.style.left = `-${(294 + 28) * sliderMod}px`;
      } else {
        testContainer.style.left = `-${(270 + 27) * sliderMod}px`;
      }
    }
  }
}

window.addEventListener('resize', testSliderPosition);
/* ---------------- testimonials end ------------------ */
