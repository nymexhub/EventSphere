'use strict';

$(document).ready(function() {
    animateLandingPageElements();
    initializeFullPageBackgrounds();
    initializeBootstrapTooltips();
});

document.onreadystatechange = function () {
    let state = document.readyState,
        loader = document.getElementById('page-loader'),
        content = document.getElementById('content');

    if (state === 'interactive') {
        content.style.visibility = 'hidden';
    } else if (state === 'complete') {
        setTimeout(function(){
            loader.style.visibility = 'hidden';
            content.style.visibility = 'visible';
        }, 1000);
    }
};

function animateLandingPageElements(){
    $('#logo').addClass('animated rotateIn');
    $('#hp-caption-title').addClass('animated fadeInUp');
    $('#hp-caption-subtitle').addClass('animated fadeInUp');
    $('#hp-caption-buttons').addClass('animated fadeInUp');
}

function initializeFullPageBackgrounds(){
    $('.page-home').backstretch('/static/media/hp_cover.jpg');
    $('.page-login').backstretch('/static/media/hp_cover.jpg').blurElement('.page-login .backstretch');
    $('.page-register').backstretch('/static/media/hp_cover.jpg').blurElement('.page-register .backstretch');
    $('.page-profile').backstretch('/static/media/hp_cover.jpg').blurElement('.page-profile .backstretch');
    $('.page-create-event').backstretch('/static/media/hp_cover.jpg').blurElement('.page-create-event .backstretch');
}

function initializeBootstrapTooltips(){
    $('[data-toggle="tooltip"]').tooltip();
}

$.fn.blurElement = function (container) {
    let $elem = $(container);

    if($elem.length > 0 && $elem !== undefined){
        $elem.css('filter', 'blur(5px)');
        $elem.css('-moz-filter', 'blur(5px)');
        $elem.css('-webkit-filter', 'blur(5px)');
        $elem.css('-o-filter', 'blur(5px)');
        $elem.css('transform', 'scale(1.03)');
    }
};
