var cameraClockin = document.querySelector('.camera-clockin');
var timeModal = document.querySelector('.timeModal');
var btnPulse = document.querySelector('.pulse');
var iconClose = document.querySelector('.icon-close');
var MiconClose = document.querySelector('.Micon-close');
var timeOut = document.querySelector('.time-out');
var timeIn = document.querySelector('.time-in');

btnPulse.addEventListener('click', ()=> {
    timeModal.classList.add('active-popup');
});

timeIn.addEventListener('click', ()=> {
    cameraClockin.classList.add('active-popup');
});

timeOut.addEventListener('click', ()=> {
    cameraClockin.classList.add('active-popup');
});

iconClose.addEventListener('click', ()=> {
    timeModal.classList.remove('active-popup');
});

MiconClose.addEventListener('click', ()=> {
    cameraClockin.classList.remove('active-popup');
});

timeIn.addEventListener('click', ()=> {
    timeModal.classList.remove('active-popup');
});

timeOut.addEventListener('click', ()=> {
    timeModal.classList.remove('active-popup');
});

function hideM() {
    $('#pulse').on('click', function() {
        $('#pulse').modal('hide');
    })
}


function utoggle() {
    var blur = document.getElementById('blur');
    blur.classList.toggle('active');
    var popup = document.getElementById('popup');
    popup.classList.toggle('active');
    var popUp = document.getElementById('pop-up');
    popUp.classList.toggle('active');
    var closeIcon = document.getElementById('icon-popup');
    closeIcon.classList.toggle('active');
    // var mcloseIcon = document.getElementById('Micon-popup');
    // mcloseIcon.classList.toggle('active');

    // mcloseIcon.addEventListener('click', ()=> {
    //     blur.classList.remove('blur');
    // });
}

function ctoggle() {
    var closeIcon = document.getElementById('icon-popup');
    closeIcon.classList.toggle('active');
}

// digital clock

function displayTime() {
    var dateTime = new Date();
    var hrs = dateTime.getHours();
    var min = dateTime.getMinutes();
    var sec = dateTime.getSeconds();
    var session = document.getElementById('session');

    if(hrs >= 12) {
        session.innerHTML = 'PM';
    } else {
        session.innerHTML = 'AM';
    }

    // if(hrs > 12) {
    //     hrs = hrs - 12;
    // }

    document.getElementById('hours').innerHTML = hrs;
    document.getElementById('minutes').innerHTML = min;
    document.getElementById('seconds').innerHTML = sec;
}

setInterval(displayTime, 10);

