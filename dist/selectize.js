/**
 * Angular Selectize2
 * https://github.com/machineboy2045/angular-selectize
 **/

angular.module('selectize', []).value('selectizeConfig', {}).directive("selectize", ['selectizeConfig', function(selectizeConfig) {
  return {
    restrict: 'EA',
    require: 'ngModel',
    scope: {ngModel: '=', config: '=selectize', options: '=?', ngDisabled: '='},
    link: function(scope, element, attrs, modelCtrl) {
      
      Selectize.defaults.maxItems = null; //default to tag editor
      
      var selectize,
          config = angular.extend({}, Selectize.defaults, selectizeConfig, scope.config);
      
      
      //override to support checking empty arrays
      modelCtrl.$isEmpty = function(val){
        return (!val || !val.length);
      }


      function createItem(input) {
        var data = {};
        data[config.labelField] = input;
        data[config.valueField] = input;
        data[config.searchField] = input;
        data[config.sortField] = input;
        return data;
      }

      function toggle(disabled){
        disabled ? selectize.disable() : selectize.enable();
      }
      
      modelCtrl.$validators.required = function(modelValue, viewValue) {
        if(!config.required)
          return true;
          
        if (modelCtrl.$isEmpty(modelValue)) {
          selectize.$control.toggleClass('ng-invalid', true)
          return false;
        }else{
          selectize.$control.toggleClass('ng-invalid', false)
          return true
        }
      };

      config.onChange = function(){
        if(!angular.equals(selectize.items, scope.ngModel))
          modelCtrl.$setViewValue( angular.copy(selectize.items) );
      }
      
      config.onOptionAdd = function(value, data) {
        if( scope.options.indexOf(data) === -1 )
          scope.options.push(data);
      }

      function updateSelectizeOptions(){
        selectize.addOption(scope.options)
      }

      function updateSelectizeValue(){
        if(!angular.equals(selectize.items, scope.ngModel))
          selectize.setValue(scope.ngModel);
      }
      
      
      scope.options = scope.options || config.options || scope.ngModel || [];
      
      
      scope.options = $.map(scope.options, function(opt){
        if(typeof opt === 'string')
          return createItem(opt)
        else
          return opt
      })
      
      config.onInitialize = function(){
        selectize = element[0].selectize;
        
        selectize.addOption(scope.options)
        selectize.setValue(scope.ngModel)
        
        scope.$watchCollection('options', updateSelectizeOptions);
        scope.$watch('ngModel', updateSelectizeValue, true);
        scope.$watch('ngDisabled', toggle)
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
