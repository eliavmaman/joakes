'use strict';

angular.module('users').controller('MyMessagesController', ['$scope', '$http', '$location', 'Users', 'Authentication',
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
        $scope.messages = response;

        // And redirect to the index page

      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);
