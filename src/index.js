
  var defaultImage = 'https://i.ibb.co/LPT3ZQW/Priscila-2022-RIG-Poses-Still-00003.png';

  function createBgEl() {
    document.querySelector('body').insertAdjacentHTML(
        "afterbegin",
        '<div class="bg-shadow"></div>'
      );
  }
  
  function removeOnboardingToClose() {
    var bgShadow = document.querySelector('.bg-shadow');
    var onboardingActive = document.querySelector('.onboarding-active');
    var onboarding = document.querySelector('.onboarding');
    var onboardingBox = document.querySelector('.onboarding-box');

    if(bgShadow) {
      bgShadow.remove();
    }
    if(onboarding) {
      onboarding.remove();
    }
    if(onboardingActive) {
      document.querySelector('.onboarding-active').classList.remove('onboarding-active');
    }
    if(onboardingBox) {
      onboardingBox.remove();
    }
    
    document.querySelector('body').style.overflow = 'auto';
    setCookie("notShowTour", true); 
  };

  function getCookie(cookieName) {
    var name = cookieName + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookieArray = decodedCookie.split(';');

    for (var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
  };

  function setCookie(name, value, daysToExpire) {
    var date = new Date();
    date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
    var expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=" + window.location.pathname;
  };
  
  function createOnboardingHTML(data) {
    return (
    '<div class="onboarding onboarding-steps-into ' +
    (data.position ? data.position : '') + 
    (data.size ? data.size : '') +
    '">' +
      '<div class="onboarding__content">' +
        '<div class="onboarding__content--box">' +
          '<div class="onboarding__content--box-left">' +
            '<div class="onboarding__content--text">' +
            data.text +
            "</div>" +
          "</div>" +
          '<div class="onboarding__content--image">' +
            '<img src="' +
            (data.image ? data.image : defaultImage) +
            '" alt="Priscila" />' +
          '</div>' +
        "</div>" +
      "</div>" +
      '<div class="onboarding__content--close">' +
        '<svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" width="17" height="17"><style>.a{fill:#f32315}</style><path fill-rule="evenodd" class="a" d="m1.6 16.7l15-15-1.5-1.4-14.9 14.9zm13.5 0l1.4-1.4-14.9-15-1.5 1.5z"/></svg>' +
      '</div>' +
      '<div class="onboarding__steps">' +
        '<div class="onboarding__steps--box-prev">' +
          (data.prevAction ? '<div class="onboarding__steps--prev">Retornar</div>' : '') +
        '</div>' +
        '<div class="onboarding__steps--balls step-' +
        data.stepActive +
        '">' +
        (data.steps.reduce(function(acc, item) {
          return acc + '<div class="onboarding__steps--balls-' +
          item + 
          '"></div>'
        }, '')) +
        "</div>" +
        '<div class="onboarding__steps--box-next">' +
          (data.nextAction ? '<div class="onboarding__steps--next">Próximo</div>' : '<div class="onboarding__steps--close">Fechar</div>') +
        '</div>' +
      "</div>" +
    "</div>"
    );
  }

  function removeClassOnboardingActive() {
    if (document.querySelector(".onboarding-active")) {
      document
        .querySelector(".onboarding-active")
        .classList.remove("onboarding-active");
    }
  }

  function removeElementOnboarding() {
    if (document.querySelector(".onboarding")) {
      document.querySelector(".onboarding").remove();
    }
  };

  function eventsToRemoveOnboarding() {
    var closeEl = document.querySelector('.onboarding__content--close');
    var closeBtnEl = document.querySelector('.onboarding__steps--close');
    var notSeeEl = document.querySelector('.onboarding__not-see');

    if(closeEl) {
      closeEl.addEventListener('click', function () {
        removeOnboardingToClose();
      });
    };

    if(closeBtnEl) {
      closeBtnEl.addEventListener('click', function () {
        removeOnboardingToClose();
      });
    };

    if(notSeeEl){
      notSeeEl.addEventListener('click', function () {
        var notSeeIsChecked = Boolean(document.querySelector('.onboarding__not-see input:checked'));
        setCookie("notShowTour", notSeeIsChecked); 
      });
    }
  };

  function changeStep(data) {
    var isMobile = window.innerWidth < 768;
    var currentToOnboardingEl = null;
    document.querySelector('body').style.overflow = 'auto';

    if(isMobile && data.elementMobile) {
      var currentToOnboardingEl = document.querySelector(data.elementMobile);
    } else {
      var currentToOnboardingEl = document.querySelector(data.element);
    }

    removeClassOnboardingActive();
    removeElementOnboarding();

    currentToOnboardingEl.classList.add("onboarding-active");

    // Create new HTML with onboarding
    currentToOnboardingEl.insertAdjacentHTML(
      "beforebegin",
      createOnboardingHTML(data)
    );
    
    eventsToRemoveOnboarding();

    // Update event prev in onboarding
    if(document.querySelector(".onboarding__steps--prev")) {
      document
        .querySelector(".onboarding__steps--prev")
        .addEventListener("click", function () {
          if(data.prevAction)
            data.prevAction();
      });
    }

    // Update event next in onboarding
    if(document.querySelector(".onboarding__steps--next")) {
      document
      .querySelector(".onboarding__steps--next")
      .addEventListener("click", function () {
        if(data.nextAction)
          data.nextAction();
      });
    }
    
    var onboardingEl = document.querySelector(".onboarding");
    var clientHeight = onboardingEl.clientHeight;
    var offsetTop = onboardingEl.offsetTop;
    var onboardingActiveEl = document.querySelector('.onboarding-active');

    if(data.extraFunction) {
      data.extraFunction();
    };

    if(data.position && !isMobile) {
      var offsetExtraLeft = 16;
      var offsetExtraRight = 25;
      var offsetTotal = clientHeight + offsetTop;
      var onboardingTop = onboardingActiveEl.offsetTop;
      var top = onboardingTop;
      var onboardingStepIntoEl = document.querySelector('.onboarding-steps-into');
      
      if(data.position === 'left') {
        var onboardingLeft = onboardingActiveEl.getBoundingClientRect().right - onboardingActiveEl.clientWidth - onboardingStepIntoEl.clientWidth - offsetExtraLeft;

        onboardingStepIntoEl.style.left = onboardingLeft + 'px';
        // window.scrollTo({ top: top, behavior: "smooth" });
      } 

      if (data.position === 'right') {
        var onboardingRight = onboardingActiveEl.getBoundingClientRect().right + offsetExtraRight;

        onboardingStepIntoEl.style.left = onboardingRight + 'px';
        // window.scrollTo({ top: top, behavior: "smooth" });
      }

      onboardingActiveEl.scrollIntoView({block: "start", behavior: "smooth"});
    } else {
      if(isMobile) {
        var offsetExtra = 75;
        var offsetTotal = clientHeight + offsetTop + offsetExtra;
        
        var newPositionScroll = onboardingActiveEl.getBoundingClientRect().top + window.scrollY - offsetTotal;
      } else {
        var offsetExtra = 25;
        var newPositionScroll = offsetTop - (clientHeight + offsetExtra);
      }

      window.scrollTo({ top: newPositionScroll, behavior: "smooth" });
    }

    document.querySelector('body').style.overflow = 'hidden';
  };

  function start() {
    document.addEventListener("DOMContentLoaded", function () {
      if (getCookie("notShowTour") !== 'true') {
        createBgEl();
  
        document.querySelector('.bg-shadow').classList.add('isActive');
        startSteps();
      }
    });
  }
  
  module.exports = { start }