'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
  function ($scope, $http, $location, Authentication) {
    $scope.authentication = Authentication;

    $scope.languages1 = ['אנגלית', 'רוסית', 'צרפתית', 'צרפתית'];
    $scope.languages2 = ['אמהרית', 'גרמנית', 'אידיש', 'ערבית'];

    // If user is signed in then redirect back home
    //if ($scope.authentication.user) $location.path('/');
    $scope.genders = [{Id: 1, Descr: 'נקבה'}, {Id: 2, Descr: 'זכר'}];
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
      }

      // is newly selected
      else {
        $scope.credentials.languages.push(lang);
      }
    };
  }
]);
