angular.module('core').directive('collapsPanel', function () {
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
      })
    }
  };
});
