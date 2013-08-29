/*global EditorHelper*/

EditorHelper.addPlugin( "image", function( trackEvent ) {

  var _popcornOptions = trackEvent.popcornTrackEvent,
      _container = _popcornOptions._container,
      _clone,
      _draggable,
      _cloneContainer,
      _target = _popcornOptions._target;

  if ( window.jQuery ) {

    if ( _popcornOptions.src ) {
      window.EditorHelper.droppable( trackEvent, _container );
    }

    window.EditorHelper.selectable( trackEvent, _container );
    trackEvent.draggable = window.EditorHelper.draggable( trackEvent, _container, _target, {
      tooltip: "Double click to crop image"
    });
    $( _container ).resizable({
      handles: "n,ne,e,se,s,sw,w,nw",
      containment: "parent",
      start: function() {
        var image = trackEvent.popcornTrackEvent.image;
        if ( image ) {
          image.style.top = image.offsetTop + "px";
          image.style.left = image.offsetLeft + "px";
          image.style.width = image.clientWidth + "px";
          image.style.height = image.clientHeight + "px";
          _clone.style.width = _clone.clientWidth + "px";
          _clone.style.height = _clone.clientHeight + "px";
          _cloneContainer.style.width = _cloneContainer.clientWidth + "px";
          _cloneContainer.style.height = _cloneContainer.clientHeight + "px";
          _clone.style.top = _clone.offsetTop + "px";
          _clone.style.left = _clone.offsetLeft + "px";
          _cloneContainer.style.top = _cloneContainer.offsetTop + "px";
          _cloneContainer.style.left = _cloneContainer.offsetLeft + "px";
        }
      },
      stop: function( event, ui ) {
        var image = trackEvent.popcornTrackEvent.image,
            width = ui.size.width,
            height = ui.size.height,
            left = ui.position.left,
            top = ui.position.top;
            
        if ( image ) {
          if ( left < 0 ) {
            width += left;
            left = 0;
          }
          if ( top < 0 ) {
            height += top;
            top = 0;
          }

          if ( width + left > _target.clientWidth ) {
            width = _target.clientWidth - left;
          }
          if ( height + top > _target.clientHeight ) {
            height = _target.clientHeight - top;
          }

          width = width / _target.clientWidth * 100;
          height = height / _target.clientHeight * 100;
          left = left / _target.clientWidth * 100;
          top = top / _target.clientHeight * 100;

          trackEvent.update({
            innerwidth: image.offsetWidth / _container.clientWidth * 100,
            innerheight: image.offsetHeight / _container.clientHeight * 100,
            innertop: image.offsetTop / _container.clientHeight * 100,
            innerleft: image.offsetLeft / _container.clientWidth * 100,
            width: width,
            height: height,
            left: left,
            top: top
          });
          console.log(image.offsetWidth, _container.clientWidth);
        }
      }
    });

    if ( trackEvent.popcornTrackEvent.image ) {
      _cloneContainer = document.createElement( "div" );
      _cloneContainer.classList.add( "clone-container" );
      _clone = trackEvent.popcornTrackEvent.image.cloneNode();
      _clone.classList.add( "image-crop-clone" );
      _cloneContainer.appendChild( _clone );
      _container.appendChild( _cloneContainer );

      $( _clone ).draggable({
        drag: function( event, ui ) {
          var top = ui.position.top / _container.clientHeight * 100,
              innerTop = trackEvent.popcornTrackEvent.innertop,
              left = ui.position.left / _container.clientWidth * 100,
              innerLeft = trackEvent.popcornTrackEvent.innerleft;

          trackEvent.popcornTrackEvent.image.style.top = top + "%";
          trackEvent.popcornTrackEvent.image.style.left = left + "%";
        },
        stop: function( event, ui ) {
          var top = ui.position.top / _container.clientHeight * 100,
              left = ui.position.left / _container.clientWidth * 100;

          trackEvent.update({
            innertop: top,
            innerleft: left
          });
          trackEvent.draggable.edit();
        }
      });

      $( _clone ).resizable({
        handles: "n, ne, e, se, s, sw, w, nw",
        resize: function( event, ui ) {
          trackEvent.popcornTrackEvent.image.style.height = ui.size.height + "px";
          trackEvent.popcornTrackEvent.image.style.width = ui.size.width + "px";
          _clone.style.height = ui.size.height + "px";
          _clone.style.width = ui.size.width + "px";
        },
        stop: function( event, ui ) {
          trackEvent.update({
            innerheight: ui.size.height / _container.clientHeight * 100,
            innerwidth: ui.size.width / _container.clientWidth * 100
          });
          trackEvent.draggable.edit();
        }
      });
    }
  }
});
