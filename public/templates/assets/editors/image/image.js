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
    window.EditorHelper.resizable( trackEvent, _container, _target, {
      minWidth: 5,
      minHeight: 5,
      handlePositions: "n,ne,e,se,s,sw,w,nw"
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
          trackEvent.popcornTrackEvent.image.style.marginTop = ui.position.top  + trackEvent.popcornTrackEvent.margintop + "px";
          trackEvent.popcornTrackEvent.image.style.marginLeft = ui.position.left  + trackEvent.popcornTrackEvent.marginleft + "px";
        },
        stop: function( event, ui ) {
          //var top = ui.position.top / trackEvent.popcornTrackEvent.image.offsetHeight * 100,
          //    left = ui.position.left / trackEvent.popcornTrackEvent.image.offsetWidth * 100;

          trackEvent.update({
            margintop: ui.position.top + trackEvent.popcornTrackEvent.margintop,
            marginleft: ui.position.left + trackEvent.popcornTrackEvent.marginleft
          });
          trackEvent.draggable.edit();
        }
      });

      $( _clone ).resizable({
        handles: "n, ne, e, se, s, sw, w, nw",
        resize: function( event, ui ) {
          trackEvent.popcornTrackEvent.image.style.height = ui.size.height - trackEvent.popcornTrackEvent.margintop + "px";
          trackEvent.popcornTrackEvent.image.style.width = ui.size.width - trackEvent.popcornTrackEvent.marginleft + "px";
          _clone.style.height = ui.size.height - trackEvent.popcornTrackEvent.margintop + "px";
          _clone.style.width = ui.size.width - trackEvent.popcornTrackEvent.marginleft + "px";
        },
        stop: function( event, ui ) {
          trackEvent.update({
            innerheight: ui.size.height - trackEvent.popcornTrackEvent.margintop,
            innerwidth: ui.size.width - trackEvent.popcornTrackEvent.marginleft
          });
          trackEvent.draggable.edit();
        }
      });
    }
  }
});
