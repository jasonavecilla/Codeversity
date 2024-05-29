const wrapper = document.querySelector('.wrapper');
const btnAddemployee = document.querySelector('.employee-title');
const iconClose = document.querySelector('.icon-close');
const btnAddtoSystem = document.querySelector('.btn-AddtoSystem');

btnAddemployee.addEventListener('click', ()=> {
    wrapper.classList.add('active-popup');
});

iconClose.addEventListener('click', ()=> {
    wrapper.classList.remove('active-popup');
});

btnAddtoSystem.addEventListener('click', ()=> {
    wrapper.classList.remove('active-popup');
});

function etoggle() {
    var blur = document.getElementById('blur');
    blur.classList.toggle('active');
    var popup = document.getElementById('popup');
    popup.classList.toggle('active');
    var closeIcon = document.getElementById('icon-popup');
    closeIcon.classList.toggle('active');
}