'use strict';

angular.module('core').factory('Notifications', function () {
        var service = {};

        service.error = function (message) {
            var notification = new NotificationFx({
                message: '<p>' + message + '</p>',
                layout: 'growl',
                effect: 'jelly',
                type: 'notice' // notice, warning, error or success
                //onClose: function () {
                //    bttn.disabled = false;
                //}
            });

            notification.show();
        };

        service.success = function (message) {
            var notification = new NotificationFx({
                message: '<p>' + message + '</p>',
                layout: 'growl',
                effect: 'scale',
                type: 'notice' // notice, warning, error or success
                //onClose: function () {
                //    bttn.disabled = false;
                //}
            });

            notification.show();
        };

        return service;
    }
);
