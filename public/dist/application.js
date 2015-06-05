'use strict';
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = function () {
    // Init module configuration options
    var applicationModuleName = 'joeks';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ngCookies',
        'ngAnimate',
        'ngTouch',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.utils',
        'ngS3upload'
      ];
    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
      // Create angular module
      angular.module(moduleName, dependencies || []);
      // Add the module to the AngularJS configuration file
      angular.module(applicationModuleName).requires.push(moduleName);
    };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();'use strict';
//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_')
    window.location.hash = '#!';
  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');'use strict';
// Configuring the Articles module
angular.module('articles').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown', '/articles(/create)?');
    Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
    Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
  }
]);'use strict';
// Setting up route
angular.module('articles').config([
  '$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider.state('listArticles', {
      url: '/articles',
      templateUrl: 'modules/articles/views/list-articles.client.view.html'
    }).state('createArticle', {
      url: '/articles/create',
      templateUrl: 'modules/articles/views/create-article.client.view.html'
    }).state('viewArticle', {
      url: '/articles/:articleId',
      templateUrl: 'modules/articles/views/view-article.client.view.html'
    }).state('editArticle', {
      url: '/articles/:articleId/edit',
      templateUrl: 'modules/articles/views/edit-article.client.view.html'
    });
  }
]);'use strict';
angular.module('articles').controller('ArticlesController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Articles',
  function ($scope, $stateParams, $location, Authentication, Articles) {
    $scope.authentication = Authentication;
    $scope.create = function () {
      var article = new Articles({
          title: this.title,
          content: this.content
        });
      article.$save(function (response) {
        $location.path('articles/' + response._id);
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    $scope.remove = function (article) {
      if (article) {
        article.$remove();
        for (var i in $scope.articles) {
          if ($scope.articles[i] === article) {
            $scope.articles.splice(i, 1);
          }
        }
      } else {
        $scope.article.$remove(function () {
          $location.path('articles');
        });
      }
    };
    $scope.update = function () {
      var article = $scope.article;
      article.$update(function () {
        $location.path('articles/' + article._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    $scope.find = function () {
      $scope.articles = Articles.query();
    };
    $scope.findOne = function () {
      $scope.article = Articles.get({ articleId: $stateParams.articleId });
    };
  }
]);'use strict';
//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', [
  '$resource',
  function ($resource) {
    return $resource('articles/:articleId', { articleId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Setting up route
angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');
    // Home state routing
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'modules/core/views/home.client.view.html'
    });
  }
]);'use strict';
angular.module('core').controller('HeaderController', [
  '$scope',
  'Authentication',
  'Menus',
  function ($scope, Authentication, Menus) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);'use strict';
angular.module('core').controller('HomeController', [
  '$scope',
  'Authentication',
  '$http',
  'Notifications',
  function ($scope, Authentication, $http, Notifications) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.pay = function () {
      $http.get('/paypal').then(function (res) {
        console.log(res);
      });
    };
    $scope.init = function () {
      $http.get('/users').success(function (result) {
        $scope.babysitters = result;
      });
    };
    $scope.scrollWindow = function () {
      jQuery('body').animate({ scrollTop: 515 }, 500);
      // Bad code to use jquery, but for animation sake!
      jQuery('.listing-container').animate({ opacity: 1 }, 500);
      jQuery('.baby-cta').animate({ opacity: 0 }, 500);
    };
    $scope.popover = {
      'content': 'Nanny sharing available! Click to inquire.',
      'saved': false
    };
    $scope.displayDetailTab = function (tab) {
      console.log('yo ' + tab);
    };
    $scope.message = {
      name: '',
      email: '',
      message: ''
    };
    $scope.newComment = '';
    $scope.sendMessage = function (user) {
      $http.post('/usermessages/' + user._id, $scope.message).then(onPostCompletd, onPostFailed);
    };
    function onPostCompletd(res) {
      Notifications.success('\u05d4\u05d4\u05d5\u05d3\u05e2\u05d4 \u05e0\u05e9\u05dc\u05d7\u05d4 \u05d1\u05d4\u05e6\u05dc\u05d7\u05d4');  //$modalInstance.close($scope.message);
    }
    function onPostFailed(res) {
      Notifications.error('\u05d0\u05d9\u05e8\u05e2\u05d4 \u05e9\u05d2\u05d9\u05d0\u05d4, \u05d0\u05e0\u05d0 \u05e0\u05e1\u05d4 \u05e9\u05e0\u05d9\u05ea');
    }
    $scope.addUserComment = function (user) {
      $http.post('/userreviews/' + user._id, $scope.newComment).then(function (savedComment) {
        user.comments.push(savedComment);
      });
    };  //$scope.babysitters = [
        //  {
        //    firstName: 'Teresa',
        //    lastName: 'Aldrige - $45/hour',
        //    description: 'Curabitur blandit tempus porttitor. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.',
        //    portrait: 'img/babysitter-portrait.png',
        //    location: 'Palo Alto, CA'
        //  },
        //  {
        //    firstName: 'Ana',
        //    lastName: 'Navarro - $55/hour',
        //    description: 'Curabitur blandit tempus porttitor. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.',
        //    portrait: 'img/babysitter-portrait2.png',
        //    location: 'Stanford, CA'
        //  },
        //  {
        //    firstName: 'Fei',
        //    lastName: 'Fei  - $45/hour',
        //    description: 'Curabitur blandit tempus porttitor. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.',
        //    portrait: 'img/babysitter-portrait3.png',
        //    location: 'Mountain View, CA'
        //  },
        //  {
        //    firstName: 'Melissa',
        //    lastName: 'Miranda - $50/hour',
        //    description: 'Curabitur blandit tempus porttitor. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.',
        //    portrait: 'img/babysitter-portrait4.png',
        //    location: 'Sunnyvale, CA'
        //  }
        //];
  }
]);
angular.module('core').directive('reviewsBtn', function () {
  return {
    scope: true,
    link: function (scope, element, attrs) {
      element.on('click', function () {
        $(element).closest('.search-listing').find('.detailsBox').hide();
        var parentListingView = $(element).closest('.search-listing').find('.listing-detail-container').removeClass('hide');
        if ($(parentListingView).find('.reviews').is(':visible')) {
          $(parentListingView).find('.reviews').hide();
        } else {
          $(parentListingView).find('.reviews').show();
        }  //var parentListingView = $(element).closest('.search-listing');//.parent().parent().parent();
           //if (parentListingView.css('height') === '220px') {
           //  //if (true) {
           //  parentListingView.css('height', 620);
           //  $(parentListingView).find('.reviews').addClass('show');
           //} else {
           //  parentListingView.css('height', 180);
           //  $(parentListingView).find('.reviews').removeClass('show');
           //}
      });
    }
  };
});
angular.module('core').directive('scheduleBtn', function () {
  return {
    link: function (scope, element, attrs) {
      element.on('click', function () {
        $(element).closest('.search-listing').find('.detailsBox').hide();
        var parentListingView = $(element).closest('.search-listing').find('.listing-detail-container').removeClass('hide');
        if ($(parentListingView).find('.schedule').is(':visible')) {
          $(parentListingView).find('.schedule').hide();
        } else {
          $(parentListingView).find('.schedule').show();
        }  //var parentListingView = element.parent().parent().parent().parent();
           ////if (parentListingView.css('height') === '180px') {
           //if (true) {
           //  parentListingView.css('height', 700);
           //  element.parent().parent().parent().next().next().children('.schedule').addClass('show');
           //
           //} else {
           //  parentListingView.css('height', 180);
           //  element.parent().parent().parent().next().next().children('.schedule').removeClass('show');
           //}
      });
    }
  };
});
angular.module('core').directive('videoBtn', function () {
  return {
    scope: true,
    link: function (scope, element, attrs) {
      element.on('click', function () {
        $(element).closest('.search-listing').find('.detailsBox').hide();
        var parentListingView = $(element).closest('.search-listing').find('.listing-detail-container').removeClass('hide');
        if ($(parentListingView).find('.video').is(':visible')) {
          $(parentListingView).find('.video').hide();
        } else {
          $(parentListingView).find('.video').show();
        }  //var parentListingView = element.parent().parent().parent().parent();
           ////if (parentListingView.css('height') === '180px') {
           //if (true) {
           //  element.parent().parent().parent().parent().css('height', 580);
           //  element.parent().parent().parent().next().next().children('.video').addClass('show');
           //} else {
           //  element.parent().parent().parent().parent().css('height', 180);
           //  element.parent().parent().parent().next().next().children('.video').removeClass('show');
           //}
      });
    }
  };
});
angular.module('core').directive('messageBtn', function () {
  return {
    scope: true,
    link: function (scope, element, attrs) {
      element.on('click', function () {
        $(element).closest('.search-listing').find('.detailsBox').hide();
        var parentListingView = $(element).closest('.search-listing').find('.listing-detail-container').removeClass('hide');
        if ($(parentListingView).find('.message').is(':visible')) {
          $(parentListingView).find('.message').hide();
        } else {
          $(parentListingView).find('.message').show();
        }
      });
    }
  };
});
angular.module('core').directive('toggle', function () {
  return {
    scope: true,
    link: function (scope, element, attrs) {
      scope.on = false;
      scope.toggle = function () {
        scope.on = !scope.on;
      };
    }
  };
});angular.module('core').directive('collapsPanel', function () {
  return {
    restrict: 'EA',
    scope: {},
    link: function (scope, elem, attr) {
      $(elem).find('span.clickable').on('click', function (e) {
        var $this = $(this);
        if (!$this.hasClass('panel-collapsed')) {
          $this.parents('.panel').find('.panel-body').slideUp();
          $this.addClass('panel-collapsed');
          $this.find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
        } else {
          $this.parents('.panel').find('.panel-body').slideDown();
          $this.removeClass('panel-collapsed');
          $this.find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        }
      });
    }
  };
});angular.module('core').directive('listingDetailButtons', function () {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'modules/core/views/listing-detail-buttons.html'
  };
});/**
 * notificationFx.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2014, Codrops
 * http://www.codrops.com
 */
;
(function (window) {
  'use strict';
  var docElem = window.document.documentElement, support = { animations: Modernizr.cssanimations }, animEndEventNames = {
      'WebkitAnimation': 'webkitAnimationEnd',
      'OAnimation': 'oAnimationEnd',
      'msAnimation': 'MSAnimationEnd',
      'animation': 'animationend'
    },
    // animation end event name
    animEndEventName = animEndEventNames[Modernizr.prefixed('animation')];
  /**
	 * extend obj function
	 */
  function extend(a, b) {
    for (var key in b) {
      if (b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }
    return a;
  }
  /**
	 * NotificationFx function
	 */
  function NotificationFx(options) {
    this.options = extend({}, this.options);
    extend(this.options, options);
    this._init();
  }
  /**
	 * NotificationFx options
	 */
  NotificationFx.prototype.options = {
    wrapper: document.body,
    message: 'yo!',
    layout: 'growl',
    effect: 'slide',
    type: 'error',
    ttl: 6000,
    onClose: function () {
      return false;
    },
    onOpen: function () {
      return false;
    }
  };
  /**
	 * init function
	 * initialize and cache some vars
	 */
  NotificationFx.prototype._init = function () {
    // create HTML structure
    this.ntf = document.createElement('div');
    this.ntf.className = 'ns-box ns-' + this.options.layout + ' ns-effect-' + this.options.effect + ' ns-type-' + this.options.type;
    var strinner = '<div class="ns-box-inner">';
    strinner += this.options.message;
    strinner += '</div>';
    strinner += '<span class="ns-close"></span></div>';
    this.ntf.innerHTML = strinner;
    // append to body or the element specified in options.wrapper
    this.options.wrapper.insertBefore(this.ntf, this.options.wrapper.firstChild);
    // dismiss after [options.ttl]ms
    var self = this;
    this.dismissttl = setTimeout(function () {
      if (self.active) {
        self.dismiss();
      }
    }, this.options.ttl);
    // init events
    this._initEvents();
  };
  /**
	 * init events
	 */
  NotificationFx.prototype._initEvents = function () {
    var self = this;
    // dismiss notification
    this.ntf.querySelector('.ns-close').addEventListener('click', function () {
      self.dismiss();
    });
  };
  /**
	 * show the notification
	 */
  NotificationFx.prototype.show = function () {
    this.active = true;
    classie.remove(this.ntf, 'ns-hide');
    classie.add(this.ntf, 'ns-show');
    this.options.onOpen();
  };
  /**
	 * dismiss the notification
	 */
  NotificationFx.prototype.dismiss = function () {
    var self = this;
    this.active = false;
    clearTimeout(this.dismissttl);
    classie.remove(this.ntf, 'ns-show');
    setTimeout(function () {
      classie.add(self.ntf, 'ns-hide');
      // callback
      self.options.onClose();
    }, 25);
    // after animation ends remove ntf from the DOM
    var onEndAnimationFn = function (ev) {
      if (support.animations) {
        if (ev.target !== self.ntf)
          return false;
        this.removeEventListener(animEndEventName, onEndAnimationFn);
      }
      self.options.wrapper.removeChild(this);
    };
    if (support.animations) {
      this.ntf.addEventListener(animEndEventName, onEndAnimationFn);
    } else {
      onEndAnimationFn();
    }
  };
  /**
	 * add to global namespace
	 */
  window.NotificationFx = NotificationFx;
}(window));'use strict';
//Menu service used for managing  menus
angular.module('core').service('Menus', [function () {
    // Define a set of default roles
    this.defaultRoles = ['*'];
    // Define the menus object
    this.menus = {};
    // A private function for rendering decision 
    var shouldRender = function (user) {
      if (user) {
        if (!!~this.roles.indexOf('*')) {
          return true;
        } else {
          for (var userRoleIndex in user.roles) {
            for (var roleIndex in this.roles) {
              if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                return true;
              }
            }
          }
        }
      } else {
        return this.isPublic;
      }
      return false;
    };
    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exists');
        }
      } else {
        throw new Error('MenuId was not provided');
      }
      return false;
    };
    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      return this.menus[menuId];
    };
    // Add new menu object by menu id
    this.addMenu = function (menuId, isPublic, roles) {
      // Create the new menu
      this.menus[menuId] = {
        isPublic: isPublic || false,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      };
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      delete this.menus[menuId];
    };
    // Add menu item object
    this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Push new menu item
      this.menus[menuId].items.push({
        title: menuItemTitle,
        link: menuItemURL,
        menuItemType: menuItemType || 'item',
        menuItemClass: menuItemType,
        uiRoute: menuItemUIRoute || '/' + menuItemURL,
        isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].isPublic : isPublic,
        roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].roles : roles,
        position: position || 0,
        items: [],
        shouldRender: shouldRender
      });
      // Return the menu object
      return this.menus[menuId];
    };
    // Add submenu item object
    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            uiRoute: menuItemUIRoute || '/' + menuItemURL,
            isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].items[itemIndex].isPublic : isPublic,
            roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].items[itemIndex].roles : roles,
            position: position || 0,
            shouldRender: shouldRender
          });
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    //Adding the topbar menu
    this.addMenu('topbar');
  }]);'use strict';
angular.module('core').factory('Notifications', function () {
  var service = {};
  service.error = function (message) {
    var notification = new NotificationFx({
        message: '<p>' + message + '</p>',
        layout: 'growl',
        effect: 'jelly',
        type: 'notice'
      });
    notification.show();
  };
  service.success = function (message) {
    var notification = new NotificationFx({
        message: '<p>' + message + '</p>',
        layout: 'growl',
        effect: 'scale',
        type: 'notice'
      });
    notification.show();
  };
  return service;
});'use strict';
// Config HTTP Error Handling
angular.module('users').config([
  '$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push([
      '$q',
      '$location',
      'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              // Redirect to signin page
              $location.path('signin');
              break;
            case 403:
              // Add unauthorized behaviour 
              break;
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);'use strict';
// Setting up route
angular.module('users').config([
  '$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider.state('profile', {
      url: '/settings/profile',
      templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
    }).state('password', {
      url: '/settings/password',
      templateUrl: 'modules/users/views/settings/change-password.client.view.html'
    }).state('accounts', {
      url: '/settings/accounts',
      templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
    }).state('signup', {
      url: '/signup',
      templateUrl: 'modules/users/views/authentication/signup.client.view.html'
    }).state('signin', {
      url: '/signin',
      templateUrl: 'modules/users/views/authentication/signin.client.view.html'
    }).state('forgot', {
      url: '/password/forgot',
      templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
    }).state('myMessages', {
      url: '/myMessages',
      templateUrl: 'modules/users/views/settings/myMessages.client.view.html',
      controller: 'MyMessagesController'
    }).state('reset-invlaid', {
      url: '/password/reset/invalid',
      templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
    }).state('reset-success', {
      url: '/password/reset/success',
      templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
    }).state('reset', {
      url: '/password/reset/:token',
      templateUrl: 'modules/users/views/password/reset-password.client.view.html'
    });
  }
]);'use strict';
angular.module('users').controller('AuthenticationController', [
  '$scope',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    $scope.languages1 = [
      '\u05d0\u05e0\u05d2\u05dc\u05d9\u05ea',
      '\u05e8\u05d5\u05e1\u05d9\u05ea',
      '\u05e6\u05e8\u05e4\u05ea\u05d9\u05ea',
      '\u05e6\u05e8\u05e4\u05ea\u05d9\u05ea'
    ];
    $scope.languages2 = [
      '\u05d0\u05de\u05d4\u05e8\u05d9\u05ea',
      '\u05d2\u05e8\u05de\u05e0\u05d9\u05ea',
      '\u05d0\u05d9\u05d3\u05d9\u05e9',
      '\u05e2\u05e8\u05d1\u05d9\u05ea'
    ];
    // If user is signed in then redirect back home
    //if ($scope.authentication.user) $location.path('/');
    $scope.genders = [
      {
        Id: 1,
        Descr: '\u05e0\u05e7\u05d1\u05d4'
      },
      {
        Id: 2,
        Descr: '\u05d6\u05db\u05e8'
      }
    ];
    $scope.credentials = {
      languages: [],
      s3OptionsUri: '/s3upload',
      image: null
    };
    $scope.signup = function () {
      $scope.credentials.username = $scope.credentials.email;
      $http.post('/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.signin = function () {
      $http.post('/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.toggleLangSelection = function (lang) {
      var idx = $scope.credentials.languages.indexOf(lang);
      // is currently selected
      if (idx > -1) {
        $scope.credentials.languages.splice(idx, 1);
      }  // is newly selected
      else {
        $scope.credentials.languages.push(lang);
      }
    };
  }
]);'use strict';
angular.module('users').controller('MyMessagesController', [
  '$scope',
  '$http',
  '$location',
  'Users',
  'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;
    $scope.getDate = function (date) {
      return moment(date).format('DD-MM-YYYY');
    };
    $scope.getTime = function (date) {
      return moment(date).format('HH:mm');
    };
    $scope.init = function () {
      $http.get('/usermessages').success(function (response) {
        // If successful we assign the response to the global user model
        $scope.messages = response;  // And redirect to the index page
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('PasswordController', [
  '$scope',
  '$stateParams',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $stateParams, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    //If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    // Submit forgotten password account id
    $scope.askForPasswordReset = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;
      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };
    // Change user password
    $scope.resetUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;
        // Attach user profile
        Authentication.user = response;
        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('SettingsController', [
  '$scope',
  '$http',
  '$location',
  'Users',
  'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;
    $scope.user.s3OptionsUri = '/s3upload';
    // If user is not signed in then redirect back home
    if (!$scope.user)
      $location.path('/');
    $scope.languages1 = [
      '\u05d0\u05e0\u05d2\u05dc\u05d9\u05ea',
      '\u05e8\u05d5\u05e1\u05d9\u05ea',
      '\u05e6\u05e8\u05e4\u05ea\u05d9\u05ea',
      '\u05e1\u05e4\u05e8\u05d3\u05d9\u05ea'
    ];
    $scope.languages2 = [
      '\u05d0\u05de\u05d4\u05e8\u05d9\u05ea',
      '\u05d2\u05e8\u05de\u05e0\u05d9\u05ea',
      '\u05d0\u05d9\u05d3\u05d9\u05e9',
      '\u05e2\u05e8\u05d1\u05d9\u05ea'
    ];
    // If user is signed in then redirect back home
    //if ($scope.authentication.user) $location.path('/');
    $scope.genders = [
      {
        Id: 1,
        Descr: '\u05e0\u05e7\u05d1\u05d4'
      },
      {
        Id: 2,
        Descr: '\u05d6\u05db\u05e8'
      }
    ];
    // Check if there are additional accounts 
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }
      return false;
    };
    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || $scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider];
    };
    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;
      $http.delete('/users/accounts', { params: { provider: provider } }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
        var user = new Users($scope.user);
        user.$update(function (response) {
          $scope.success = true;
          Authentication.user = response;
        }, function (response) {
          $scope.error = response.data.message;
        });
      } else {
        $scope.submitted = true;
      }
    };
    // Change user password
    $scope.changeUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.toggleLangSelection = function (lang) {
      var idx = $scope.user.languages.indexOf(lang);
      // is currently selected
      if (idx > -1) {
        $scope.user.languages.splice(idx, 1);
      }  // is newly selected
      else {
        $scope.user.languages.push(lang);
      }
    };
  }
]);'use strict';
// Authentication service for user variables
angular.module('users').factory('Authentication', [function () {
    var _this = this;
    _this._data = { user: window.user };
    return _this._data;
  }]);'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('users', {}, { update: { method: 'PUT' } });
  }
]);