
// Module Federation Remote Entry for Next.js 14
// Route-level federation for host app consumption

(function() {
  'use strict';

  // Get the remote app base URL dynamically
  var getRemoteBaseUrl = function() {
    // Try to get the current script's origin
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
      var script = scripts[i];
      if (script.src && script.src.includes('remoteEntry.js')) {
        var url = new URL(script.src);
        return url.origin;
      }
    }
    // Fallback to localhost:3000
    return 'http://localhost:3000';
  };

  var remoteBaseUrl = getRemoteBaseUrl();

  // Module Federation container - Routes only
  var remoteApp = {
    get: function(module) {
      return Promise.resolve().then(function() {
        switch(module) {
          case './App':
            return () => import(remoteBaseUrl + '/components/remote/RemoteApp');
          default:
            throw new Error('Route not found: ' + module);
        }
      });
    }
  };

  // Module Federation interface
  if (typeof window !== 'undefined') {
    window.__webpack_require__ = window.__webpack_require__ || {};
    window.__webpack_require__.e = function(chunkId) {
      return Promise.resolve();
    };

    // Expose the remote app
    window.__REMOTE_APP__ = remoteApp;
  }

  // CommonJS/AMD compatibility
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = remoteApp;
  }

  if (typeof define === 'function' && define.amd) {
    define(function() { return remoteApp; });
  }
})();
