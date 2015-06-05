'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$http', 'Notifications',
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
      jQuery('body').animate({scrollTop: 515}, 500);
      // Bad code to use jquery, but for animation sake!
      jQuery('.listing-container').animate({opacity: 1}, 500);
      jQuery('.baby-cta').animate({opacity: 0}, 500);
    };

    $scope.popover = {
      "content": "Nanny sharing available! Click to inquire.",
      "saved": false
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
      Notifications.success('ההודעה נשלחה בהצלחה');
      //$modalInstance.close($scope.message);
    }

    function onPostFailed(res) {
      Notifications.error('אירעה שגיאה, אנא נסה שנית');
    }


    $scope.addUserComment = function (user) {
      $http.post('/userreviews/' + user._id, $scope.newComment).then(function (savedComment) {
        user.comments.push(savedComment);
      });
    };

    //$scope.babysitters = [
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
        }
        //var parentListingView = $(element).closest('.search-listing');//.parent().parent().parent();
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
    // scope: true,
    link: function (scope, element, attrs) {
      element.on('click', function () {
        $(element).closest('.search-listing').find('.detailsBox').hide();
        var parentListingView = $(element).closest('.search-listing').find('.listing-detail-container').removeClass('hide');
        if ($(parentListingView).find('.schedule').is(':visible')) {

          $(parentListingView).find('.schedule').hide();
        } else {

          $(parentListingView).find('.schedule').show();
        }

        //var parentListingView = element.parent().parent().parent().parent();
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
        }

        //var parentListingView = element.parent().parent().parent().parent();
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
});
