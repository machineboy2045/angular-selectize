/**
 * Angular Selectize2
 * https://github.com/machineboy2045/angular-selectize
 **/

angular.module('selectize', [])
  .value('selectizeConfig', {})
  .directive("selectize", ['selectizeConfig', '$timeout',
  function(selectizeConfig, $timeout) {
    return {
      restrict: 'EA',
      require: '^ngModel',
      scope: {
        ngModel: '=',
        config: '=?',
        options: '=?',
        ngDisabled: '=',
        ngRequired: '&'
      },
      link: function(scope, element, attrs, modelCtrl) {

        Selectize.defaults.maxItems = null; //default to tag editor

        var selectize,
            config = angular.extend({}, Selectize.defaults,
                                    selectizeConfig, scope.config);

        modelCtrl.$isEmpty = function(val){
          //override to support checking empty arrays
          return (val === undefined || val === null || !val.length);
        };

        function createItem(input) {
          var data = {};
          data[config.labelField] = input;
          data[config.valueField] = input;
          return data;
        }

        function toggle(disabled){
          disabled ? selectize.disable() : selectize.enable();
        }

        var validate = function() {
          var isInvalid = (scope.ngRequired() || attrs.required ||
                        config.required) && modelCtrl.$isEmpty(scope.ngModel);
          modelCtrl.$setValidity('required', !isInvalid)
        };

        // Sets the value in a timeout
        // in order to avoid '$scope already in digest...' console errors
        var setValue = function () {
          $timeout(function () {
            selectize.setValue(scope.ngModel);
          });
        };

        function generateOptions(data){
          if(!data)
            return [];

          data = angular.isArray(data) ? data : [data]

          return $.map(data, function(opt){
            return typeof opt === 'string' ? createItem(opt) : opt;
          });
        }

        function updateSelectize(){
          validate();

          selectize.$control.toggleClass('ng-valid', modelCtrl.$valid);
          selectize.$control.toggleClass('ng-invalid', modelCtrl.$invalid);
          selectize.$control.toggleClass('ng-dirty', modelCtrl.$dirty);
          selectize.$control.toggleClass('ng-pristine', modelCtrl.$pristine);

          if( !angular.equals(selectize.items, scope.ngModel) ){
            selectize.addOption(generateOptions(scope.ngModel));
            setValue();
          }
        }

        var onChange = config.onChange,
            onOptionAdd = config.onOptionAdd;

        config.onChange = function(){
          if( !angular.equals(selectize.items, scope.ngModel) )
            scope.$evalAsync(function(){
              var value = selectize.items.slice();
              if (config.maxItems == 1) {
                value = value[0]
              }
              modelCtrl.$setViewValue( value );
            });

          if (onChange) {
            onChange.apply(this, arguments);
          }
        }

        config.onOptionAdd = function(value, data) {
          if( scope.options.indexOf(data) === -1 )
            scope.options.push(data);

          if (onOptionAdd) {
            onOptionAdd.apply(this, arguments);
          }
        }

        // ngModel (ie selected items) is included in this because
        // if no options are specified, we
        // need to create the corresponding options for the items to be visible
        scope.options = generateOptions((scope.options ||
                        config.options || scope.ngModel).slice());

        var angularCallback = config.onInitialize;

        config.onInitialize = function(){
          selectize = element[0].selectize;
          selectize.addOption(scope.options);
          setValue();

          //provides a way to access the selectize element from an
          //angular controller
          if(angularCallback){
            angularCallback(selectize);
          }

          scope.$watch('options', function(){
            selectize.clearOptions();
            selectize.addOption(scope.options)
            setValue();
          }, true);

          scope.$watchCollection('ngModel', updateSelectize);
          scope.$watch('ngDisabled', toggle);
        }

        element.selectize(config);

        element.on('$destroy', function() {
          if (selectize) {
            selectize.destroy();
            element = null;
          }
        });

      }
    };
  }]);
