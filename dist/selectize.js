/**
 * Angular Selectize2
 * https://github.com/machineboy2045/angular-selectize
 **/

angular.module('selectize', []).value('selectizeConfig', {}).directive("selectize", ['selectizeConfig', function(selectizeConfig) {
  return {
    restrict: 'E',
    require: '^ngModel',
    scope: {ngModel: '=', config: '=?', options: '=?', ngDisabled: '='},
    link: function(scope, element, attrs, modelCtrl) {

      Selectize.defaults.maxItems = null; //default to tag editor

      var selectize,
          config = angular.extend({}, Selectize.defaults, selectizeConfig, scope.config);

      modelCtrl.$isEmpty = function(val){
        return (val === undefined || val === null || !val.length); //override to support checking empty arrays
      }

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
        var isInvalid = config.required && modelCtrl.$isEmpty(scope.ngModel);
        modelCtrl.$setValidity('required', !isInvalid)
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

        selectize.$control.toggleClass('ng-valid', modelCtrl.$valid)
        selectize.$control.toggleClass('ng-invalid', modelCtrl.$invalid)
        selectize.$control.toggleClass('ng-dirty', modelCtrl.$dirty)
        selectize.$control.toggleClass('ng-pristine', modelCtrl.$pristine)

        if( !angular.equals(selectize.items, scope.ngModel) ){
          selectize.addOption(generateOptions(scope.ngModel))
          selectize.setValue(scope.ngModel)
        }
      }

      function search(array, key, val){
          for (var i=0; i < array.length; i++) {
              if (array[i][key] === val) {
                  return array[i];
              }
          }
      }

      function refresh(data) {
        selectize.addOption.bind(selectize)(data);
        if (angular.isArray(scope.ngModel)) {
          angular.forEach(scope.ngModel, function(value,key) {
            selectize.updateOption(value,search(scope.options,'id',value));    
          })
        } else {
          selectize.updateOption(scope.ngModel,search(scope.options,'id',scope.ngModel));    
        }
      }
      
      config.onChange = function(){
        if( !angular.equals(selectize.items, scope.ngModel) )
          scope.$evalAsync(function(){
            var value = angular.copy(selectize.items);
            if (config.maxItems == 1) {
              value = value[0]
            }
            modelCtrl.$setViewValue( value );
          });
      }

      config.onOptionAdd = function(value, data) {
        if( scope.options.indexOf(data) === -1 )
          scope.options.push(data);
      }

      // ngModel (ie selected items) is included in this because if no options are specified, we
      // need to create the corresponding options for the items to be visible
      scope.options = generateOptions( angular.copy(scope.options || config.options || scope.ngModel) );
      
      var angularCallback = config.onInitialize;

      config.onInitialize = function(){
        selectize = element[0].selectize;
        selectize.addOption(scope.options)
        selectize.setValue(scope.ngModel)
        
        //provides a way to access the selectize element from an
        //angular controller
        if(angularCallback){
          angularCallback(selectize);
        }

        scope.$watchCollection('options', refresh);
        scope.$watch('ngModel', updateSelectize);
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
