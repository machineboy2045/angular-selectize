/**
 * Angular Selectize2
 * https://github.com/machineboy2045/angular-selectize
 **/

angular.module('selectize', []).value('selectizeConfig', {}).directive("selectize", ['selectizeConfig', function(selectizeConfig) {
  return {
    restrict: 'EA',
    require: '^ngModel',
    scope: {ngModel: '=', config: '=selectize', options: '=', ngDisabled: '='},
    link: function(scope, element, attrs, modelCtrl) {
      var config = angular.copy(selectizeConfig);
      var selectize;

      config.options = scope.options || [];

      if (typeof scope.config !== 'undefined') {
        config = angular.extend(config, scope.config);
      }
      
      config.maxItems = config.maxItems || null; //default to tag editor

      function addAngularOption(value, data) {
        scope.$evalAsync(function(){
          if(selectize.currentResults && (scope.options.length < selectize.currentResults.total)){
            scope.options.push(data);
          }
        });

      }

      function createItem(input) {
        var data = {};
        data[selectize.settings.labelField] = input;
        data[selectize.settings.valueField] = input;
        data[selectize.settings.searchField] = input;
        data[selectize.settings.sortField] = input;
        return data;
      }

      function toggle(disabled){
        disabled ? selectize.disable() : selectize.enable();
      }

      function setDirty(){
        modelCtrl.$setViewValue(angular.copy(modelCtrl.$modelValue));
      }

      function updateClasses(){
        selectize.$control.toggleClass('ng-invalid', modelCtrl.$invalid)
      }

      function updateValidity(){
        modelCtrl.$setValidity('required', !config.required || scope.ngModel.length !== 0 ? true : false)
        updateClasses();
      }

      function getValue(){
        if(selectize.settings.maxItems === 1)
          return selectize.items.join(selectize.settings.delimiter);
        else
          return selectize.items;
      }

      function updateAngularValue(val){
        if(val ===  scope.ngModel)
          return false;
        else
          setDirty();


        scope.$evalAsync(function(){
          scope.ngModel = getValue();
          updateValidity();
        });
      }

      function updateSelectizeOptions(value, prev){
        if( value === prev ) return;

        var needOptionRefresh = false;

        value = angular.isArray(value) ? value : [value]

        var i = 0
    	angular.forEach(value, function(item){
          i++;
          var value = item[selectize.settings.valueField];
          if (typeof item === 'string') {
              item = {id: i,text: item, value: item};
          }
          if(!selectize.options[value]){
            selectize.addOption(item);
            needOptionRefresh = true;
          }
        });

        if(needOptionRefresh)
          updateSelectizeValue(scope.ngModel); //allow the model value to be set before the options are loaded
      }

      function updateSelectizeValue(value, prev){
        var needOptionRefresh = false;


        if(value === prev) return;

        selectize.clear();


        if(!value || !value.length)
          return updateValidity();


        value = angular.isArray(value) ? value : [value]


        angular.forEach(value, function(val){

          if(selectize.settings.create){
            var item = createItem(val)
            if(!selectize.options[val]){
              selectize.addOption(item);
              needOptionRefresh = true;
            }
          }


          selectize.addItem(val);
        });

        if(needOptionRefresh)
          selectize.refreshOptions(false);

        updateValidity();

      }

      element.selectize(config);
      selectize = element[0].selectize;

      selectize.on('option_add', addAngularOption);
      selectize.on('change', updateAngularValue);
      
      //initialize with ngModel
      updateSelectizeValue(scope.ngModel);

      scope.$watchCollection('options', updateSelectizeOptions);
      scope.$watch('ngModel', updateSelectizeValue, true);
      scope.$watch('ngDisabled', toggle);

      element.on('$destroy', function() {
          if (selectize) {
              selectize.destroy();
              element = null;
          }
      });


    }
  };
}]);
