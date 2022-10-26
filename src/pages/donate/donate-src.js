import '../../assets/styles/normalize.css';
import '../../assets/styles/variables.scss';

import '../../assets/styles/header.scss';
import '../../assets/styles/header-media.scss';

import '../../assets/styles/footer.scss';
import '../../assets/styles/footer-media.scss';

import './donate-style.scss';
import './donate-style-media1000.scss';

const moneyInputField = document.querySelector('.money-input');
moneyInputField.addEventListener('input', (ev) => {
  console.log(ev.target.value);
  if (ev.target.value == '') moneyInputField.classList.remove('input_valid');
  if (ev.target.value.length > 0 && ev.target.value.length <= 4) {
    moneyInputField.classList.add('input_valid');
  } else moneyInputField.classList.remove('input_valid');
  setTimeout(() => {
    moneyInputField.value = moneyInputField.value.slice(0, 4);
    moneyInputField.classList.add('input_valid');
  }, 1000);
});
moneyInputField.addEventListener('blur', (ev) => {
  if (ev.target.value == '') ev.target.classList.remove('input_valid');
});

document.querySelector('.logo_footer').addEventListener('click', () => {
  window.location.href = '../main/index.html';
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
  console.log(event.target);
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

/* -------- connect amounts start -------- */

const moneyInput = document.querySelector('.money-input');
const amountLabels = document.querySelectorAll('.hiddeninput');
amountLabels.forEach((x) =>
  x.addEventListener('change', (ev) => {
    moneyInput.value = ev.target.id.substring(1);
  })
);
let amounts = [25, 50, 100, 250, 500, 1000, 2000, 5000];

moneyInput.addEventListener('input', (ev) => {
  let val = ev.target.valueAsNumber;
  if (amounts.includes(val)) {
    let lineVal = [...amountLabels].filter(
      (x) => val == Number(x.id.substring(1))
    )[0];

    lineVal.click();
  } else {
    amountLabels.forEach((s) => (s.checked = false));
  }
});

/* -------- connect amounts end -------- */
