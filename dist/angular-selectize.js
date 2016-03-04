/**
 * Angular Selectize2
 * https://github.com/machineboy2045/angular-selectize
 **/

angular.module('selectize', []).value('selectizeConfig', {}).directive("selectize", ['selectizeConfig', function(selectizeConfig) {
  return {
    restrict: 'EA',
    require: '^ngModel',
    scope: { ngModel: '=', config: '=?', options: '=?', ngDisabled: '=', ngRequired: '&' },
    link: function(scope, element, attrs, modelCtrl) {

      var selectize,
          settings = angular.extend({}, Selectize.defaults, selectizeConfig, scope.config);

      scope.options = scope.options || [];
      scope.config = scope.config || {};

      var isEmpty = function(val) {
        return val === undefined || val === null || val.length === 0; // support checking empty arrays / strings
      };

      var toggle = function(disabled) {
        disabled ? selectize.disable() : selectize.enable();
      };

      var validate = function() {
        var isInvalid = (scope.ngRequired() || attrs.required || settings.required) && isEmpty(scope.ngModel);
        modelCtrl.$setValidity('required', !isInvalid);
      };

      var setSelectizeOptions = function(curr, prev) {
        if (!curr)
          return;
        if (scope._noUpdate) { // Internal changes to scope.options, eschew the watch mechanism
          scope._noUpdate = false;
          return;
        }
        scope._skipRemove = true;
        angular.forEach(prev, function(opt) {
          if (curr.indexOf(opt) === -1) {
            var value = opt[settings.valueField];
            selectize.removeOption(value, true);
          }
        });
        scope._skipRemove = false;
        angular.forEach(curr, function(opt) {
          selectize.registerOption(opt);
        });
        selectize.lastQuery = undefined; // Hack because of a Selectize bug...
        selectize.refreshOptions(false); // Update the content of the drop-down

        setSelectizeValue();
      };

      var setSelectizeValue = function() {
        validate();

        selectize.$control.toggleClass('ng-valid', modelCtrl.$valid);
        selectize.$control.toggleClass('ng-invalid', modelCtrl.$invalid);
        selectize.$control.toggleClass('ng-dirty', modelCtrl.$dirty);
        selectize.$control.toggleClass('ng-pristine', modelCtrl.$pristine);

        if (!angular.equals(selectize.items, scope.ngModel)) {
          selectize.setValue(scope.ngModel, true);
        }
      };

      settings.onChange = function(value) {
        var items = angular.copy(selectize.items);
        if (settings.maxItems === 1) {
          items = items[0];
        }
        modelCtrl.$setViewValue(items);

        if (scope.config.onChange) {
          scope.config.onChange.apply(this, arguments);
        }
      };

      // User entered a new tag.
      settings.onOptionAdd = function(value, data) {
        if (scope.options.indexOf(data) === -1) {
          scope._noUpdate = true;
          scope.options.push(data);
        }
        if (scope.config.onOptionAdd) {
          scope.config.onOptionAdd.apply(this, arguments);
        }
      };

      // User removed a tag they entered, or we called removeOption().
      // Note: it is not called if persist is true.
      settings.onOptionRemove = function(value) {
        if (scope._skipRemove)
          return;
        var idx = -1;
        for (var i = 0; i < scope.options.length; i++) {
          if (scope.options[i][scope.config.valueField] === value) {
            idx = i;
            break;
          }
        }
        if (idx !== -1 ) {
          scope._noUpdate = true;
          scope.options.splice(idx, 1);
        }
        if (scope.config.onOptionRemove) {
          scope.config.onOptionRemove.apply(this, arguments);
        }
      };

      settings.onInitialize = function() {
        selectize = element[0].selectize;

        setSelectizeOptions(scope.options);

        //provides a way to access the selectize element from an
        //angular controller
        if (scope.config.onInitialize) {
          scope.config.onInitialize(selectize);
        }

        scope.$watchCollection('options', setSelectizeOptions);
        scope.$watch('ngModel', setSelectizeValue);
        scope.$watch('ngDisabled', toggle);
      };

      element.selectize(settings);

      element.on('$destroy', function() {
        if (selectize) {
          selectize.destroy();
          element = null;
        }
      });
    }
  };
}]);
