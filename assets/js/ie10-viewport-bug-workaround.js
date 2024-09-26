/*!
 * IE10 viewport hack for Surface/desktop Windows 8 bug
 * Copyright 2014-2017 The Bootstrap Authors
 * Copyright 2014-2017 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

(function () {
  'use strict';

  // Check for IE Mobile 10
  if (/IEMobile\/10\.0/.test(navigator.userAgent)) {
    // Create a style element for the viewport hack
    var style = document.createElement('style');
    style.textContent = '@-ms-viewport{width:auto!important}';
    document.head.appendChild(style);
  }
})();
