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
        return val === undefined || val === null || !val.length; //support checking empty arrays
      };

      var toggle = function(disabled) {
        disabled ? selectize.disable() : selectize.enable();
      }

      var validate = function() {
        var isInvalid = (scope.ngRequired() || attrs.required || settings.required) && isEmpty(scope.ngModel);
        modelCtrl.$setValidity('required', !isInvalid);
      };

      var setSelectizeOptions = function(curr, prev) {
        angular.forEach(prev, function(opt){
          if(curr.indexOf(opt) === -1){
            var value = opt[settings.valueField];
            selectize.removeOption(value, true);
          }
        });

        selectize.addOption(curr, true);

        selectize.refreshOptions(false); // updates results if user has entered a query
        setSelectizeValue();
      }

      var setSelectizeValue = function() {
        validate();

        selectize.$control.toggleClass('ng-valid', modelCtrl.$valid);
        selectize.$control.toggleClass('ng-invalid', modelCtrl.$invalid);
        selectize.$control.toggleClass('ng-dirty', modelCtrl.$dirty);
        selectize.$control.toggleClass('ng-pristine', modelCtrl.$pristine);

        if (!angular.equals(selectize.items, scope.ngModel)) {
          selectize.setValue(scope.ngModel, true);
        }
      }

      settings.onChange = function(value) {
        var value = angular.copy(selectize.items);
        if (settings.maxItems == 1) {
          value = value[0]
        }
        modelCtrl.$setViewValue( value );

        if (scope.config.onChange) {
          scope.config.onChange.apply(this, arguments);
        }
      };

      settings.onOptionAdd = function(value, data) {
        if( scope.options.indexOf(data) === -1 ) {
          scope.options.push(data);

          if (scope.config.onOptionAdd) {
            scope.config.onOptionAdd.apply(this, arguments);
          }
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

      // watch for changes to attributes that are copied down to the
      // input and keep them in sync.  We have set the attr in the watch expression
      // rather than in the listener because after an update the selectize library
      // may have reverted the placeholder to the un-interpolated value even though
      // the value of element.attr(prop) has not changed
      var input;
      ['placeholder', 'title'].forEach(function(prop){
        scope.$watch(function()  {
          if (element) {
            var val = element.attr(prop);
            input = input || element.siblings('.selectize-control').find('input');
            input.attr(prop, val);
          }
        });
      });


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
