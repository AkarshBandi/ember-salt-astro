/* Edit-mode guard.
 *
 * The hero paints through a WebGL canvas with the real <img> held at
 * opacity:0 as its fallback. In the Tina admin the page lives in an
 * iframe, and the preview swaps island HTML out from under us, so anything
 * app.js does once at load time is discarded a second later: the canvas
 * comes back uninitialised and the img is still at opacity:0, which is a
 * blank hero a few seconds after the preview opened.
 *
 * So the fix is CSS keyed off a class on <html> rather than a DOM swap.
 * The canvas is hidden and the img is forced visible, which survives any
 * number of island swaps.
 */
(function () {
  function inEditMode() {
    try {
      if (window.self !== window.top) return true;
    } catch (e) {
      return true;
    }
    return !!document.querySelector('[data-tina-form]');
  }

  function mark() {
    document.documentElement.classList.add('is-tina-edit');
  }

  if (inEditMode()) {
    mark();
  } else {
    // Tina injects the bridge and form metadata after load, so poll briefly
    // rather than deciding once on the first tick.
    var tries = 0;
    var timer = setInterval(function () {
      if (inEditMode()) {
        mark();
        clearInterval(timer);
      } else if (++tries > 40) {
        clearInterval(timer);
      }
    }, 250);
  }
})();
