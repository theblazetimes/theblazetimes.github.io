(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.lazyLoad = factory();
  }
}(this, function () {

  var options = {
    pageUpdatedEventName: 'page:updated', 
    elements: 'img[data-src], img[data-srcset], source[data-srcset], iframe[data-src], video[data-src], [data-lazyload]', 
    rootMargin: '0px', 
    threshold: 0,
  };

  var els = [];
  var observer;

  /**
   * Converts HTML collections to an array
   * @private
   */
  function _htmlCollectionToArray(collection) {
    return Array.prototype.slice.call(collection);
  }

  /**
   * Removes data- attributes after loading
   * @private
   */
  function _removeDataAttrs(el) {
    el.removeAttribute('data-src');
    el.removeAttribute('data-srcset');
    el.removeAttribute('data-lazyload');
  }

  /**
   * Update element with data attributes
   * @private
   */
  function _updateEl(el) {
    var srcset = el.getAttribute('data-srcset');
    var src = el.getAttribute('data-src');
    
    if (srcset) el.setAttribute('srcset', srcset);
    if (src) el.src = src;
    
    el.addEventListener('load', function () {
      _removeDataAttrs(el);
    });
  }

  /**
   * IntersectionObserver callback function
   * @private
   */
  function _intersection(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        _updateEl(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }

  /**
   * Initiates lazy loading process
   * @private
   */
  function _init() {
    els = _htmlCollectionToArray(document.querySelectorAll(options.elements));
    observer = new IntersectionObserver(_intersection, {
      rootMargin: options.rootMargin,
      threshold: options.threshold
    });

    els.forEach(function(el) {
      observer.observe(el);
    });
  }

  /**
   * Initializes and configures lazyLoad
   * @public
   */
  var lazyLoad = function(opts) {
    if (opts) {
      Object.assign(options, opts);
    }

    _init();

    if (options.pageUpdatedEventName) {
      document.addEventListener(options.pageUpdatedEventName, _init, true);
    }
  };

  return lazyLoad;
}));

// Initialize the optimized lazy loader
lazyLoad();
