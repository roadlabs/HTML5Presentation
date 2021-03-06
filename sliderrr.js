var Sliderrr = function() {
  var current, $ = jQuery, currentTranslate, currentScale, currentScaleVal, currentTransX, currentTransY;
  function doToVideo(section, func) {
    if (section.find('video').length > 0) {
      section.find('video')[0][func]();
    }
  }
  
  function showSlide(section) {   
    var s = $(section),
        w = s.width(),
        h = s.height(),
        vW = $(window).width(),
        vH = $(window).height(),
        scaleX = vW / w,
        scaleY = vH / h,
        scale = Math.min(scaleX, scaleY),
        transX = (s.data('offset').left*scale*-1 + vW/2 - w*scale/2),
        transY = (s.data('offset').top*scale*-1 + vH/2 - h*scale/2);
    
    currentTransX = transX;
    currentTransY = transY;
    currentTranslate = 'translate('+ transX.toFixed(4) + 'px,' + transY.toFixed(4) + 'px)';
    currentScaleVal = scale;
    currentScale = 'scale(' + currentScaleVal.toFixed(4) + ')';
    
    var transform = currentTranslate + ' ' + currentScale;
    s.addClass('current');
    $(document.body).addClass('presentmode');      
    $('.slides').css({
      '-moz-transform': transform,
      '-webkit-transform': transform          
    });
    
    // if (scale == scaleX) {
    //   $('#overlayt').height((vH - s.outerHeight(true)) / 2).show(); 
    //   $('#overlayb').height((vH - s.outerHeight(true)) / 2).show();
    //   $('#overlayl, #overlayr').hide();
    // } else {
    //   $('#overlayl').width((vW - s.outerWidth(true)) / 2).show(); 
    //   $('#overlayr').width((vW - s.outerWidth(true)) / 2).show();
    //   $('#overlayt, #overlayb').hide();      
    // }
    
    doToVideo(s, 'play');
  }
  function move(func) {
    $('.popover').hide();
    
    // builds
    if (func == 'next') {
      for (var i = 0; i < 6; i++) {
        var cls = 'b' + i;
        if (current.find('.' + cls).length === 0) {
          break;
        }
        
        if (!current.hasClass(cls)) {
          current.addClass('b' + i);
          return;
        }
      }      
    }
      
    doToVideo(current, 'pause');  
      
    var el = current[func]('section');
    if (el && el.length) {
      current.removeClass('current');
      current = el;
      current.removeClass('b0 b1 b2 b2 b3 b4 b5');        
      showSlide(current);
    }        
  }
  function moveNext() {
    move('next');
  }
  function movePrevious() {
    move('prev');
  }
  function enablePresentMode() {
    if (!$(document.body).hasClass('presentmode')) {    
      document.body.scrollTop = 0;    
      document.body.scrollLeft = 0;                  
      showSlide(current);    
    }
  }
  function disablePresentMode() {
    if ($(document.body).hasClass('presentmode')) {        
      $(document.body).removeClass('presentmode');
      $('.slides').css({'-moz-transform': '', '-webkit-transform': ''});            
      document.body.scrollTop = Math.max(0, current.offset().top - 100);    
      document.body.scrollLeft = Math.max(0, current.offset().left - 100);          
    }
  }
  function togglePresentMode() {
    if ($(document.body).hasClass('presentmode')) {            
      disablePresentMode();
    } else {
      enablePresentMode();
    }
  }
              
  function init() {
    var PAGE_UP = 33,
      PAGE_DOWN = 34,
      ARROW_LEFT = 37,
      ARROW_UP = 38,
      ARROW_RIGHT = 39,
      ARROW_DOWN = 40,
      TAB = 9,
      ESC = 27;

    $(document).keydown(function(e) {            
      switch (e.keyCode) {
        case TAB: 
          e.preventDefault();
          break;
        case PAGE_UP:
        case ARROW_LEFT: 
          movePrevious();
          e.preventDefault();
          break;     
        case PAGE_DOWN:               
        case ARROW_RIGHT:
          moveNext();
          e.preventDefault();
          break;
        case 66:
          togglePresentMode();
          break;
        case ESC:
          if (e.metaKey) {
            disablePresentMode();
          } else {
            $('#browser').remove();            
          }
          break;
      }
    });
    
    $('.slides section').live('dblclick', function() {
      current = $(this);
      enablePresentMode();      
    });
    
    $('.popover').live('click', function(e) {
      e.preventDefault();
      $(this).hide();
    })
    $('button').live('click', function(e){
      e.preventDefault();
    });
    
    
    $(window).bind('mousewheel', function() {      
      var key;
      return function(e) {return;
        clearTimeout(key);
        $(document.body).addClass('zooming');

        var wheel = (e.wheelDelta) ? e.wheelDelta / 120 : -(e.detail || 0) / 3;
        var vW = $(window).width(),
          vH = $(window).height();
          
        currentScaleVal += (wheel / 500) * 5;
        //console.log(currentScaleVal);
        //console.log(currentScaleVal, e.wheelDelta, (e.wheelDelta / 120), (e.wheelDelta / 120)*0.5);
        
        var transform = 'translate(' + (currentTransX+vW/2) + 'px, ' + (currentTransY+vH/2) +  + 'px)' + ' scale(' + currentScaleVal.toFixed(4) + ')';
        console.log(transform);
        $('.slides').css({'-moz-transform': transform, '-webkit-transform': transform});            
        
        key = setTimeout(function() {
          $(document.body).removeClass('zooming');
          var transform = currentTranslate + ' ' + currentScale;
          $('.slides').css({'-moz-transform': transform, '-webkit-transform': transform});            
        }, 2000);
      };
    }());
    
    // Handle links to open in iframes, and popovers
    $('a').live('click', function(e) {
      e.preventDefault();      
      
      var popoverId = $(this).attr('data:popover');
      if (popoverId) {
        $('#' + popoverId).appendTo(document.body).show();        
        return;
      }
      
      window.open(this.href);
      
      //$(document.body).append('<iframe id="browser" src="' + this.href + '"></iframe>');
      // var browser = document.getElementById('browser'),
      //           frame = document.getElementById('browser_frame');
      //       frame.contentWindow.onload = function() {
      //         browser.show();
      //       };
    });

    // Cache sections offset
    $('.slides section').each(function(){
      $(this).data('offset', $(this).offset());
    });
            
    current = $('.slides section').first();
    showSlide(current);
  }


  return  {
    current: current,
    init: function() {
      setTimeout(init, 1000);
    }
  }
}();


// Space timeline
$(function() {
  var $ = jQuery;
  $('.timeline').each(function() {
    var dates = $.map($(this).find('time'), function(time) {
      return {
        date: new Date($(time).attr('datetime').replace(/-/g,'/')),
        el: time
      };
    });
    if (dates.length === 0) {
      return;
    }

    var first = dates[0].date,
      last = dates[dates.length-1].date,
      range = last - first;
      
    $.each(dates, function(i, d) {
      if (i < dates.length - 1) {
        var years = (dates[i+1].date.getTime() - d.date.getTime()) / 1000 / 60 / 60 / 24 / 365,
          width = Math.max(Math.min((years * 1.5), 20), 2);
        $(d.el).parents('li').width(width + 'em');  
      }            
    });
  });
});
