angular-selectize2
==================
This is an Angular.js directive for Brian Reavis's selectize jQuery plugin (http://brianreavis.github.io/selectize.js/). It supports 2-way model binding, ng-required, and 2-way binding of the options. 

I decided to adapt Selectize for Angular after being disatisfied with the performance of ui-elect2 when there were many options on the page.


##Demo
[Try the Plunker here](http://plnkr.co/edit/4J6IUj?p=info)

## Requirements

- [AngularJS](http://angularjs.org/)
- [JQuery](http://jquery.com/)
- [Selectize](http://brianreavis.github.io/selectize.js/)

## Usage

We use [bower](https://github.com/bower/bower) for dependency management. Install Angular-Selectize2 into your project by running the command

`$ bower install angular-selectize2`

If you use a `bower.json` file in your project, you can have Bower save ui-select2 as a dependency by passing the `--save` or `--save-dev` flag with the above command.

This will copy the ui-selectize2 files into your `bower_components` folder, along with its dependencies. Load the script files in your application:
```html
<link rel="stylesheet" href="bower_components/selectize/dist/css/selectize.default.css ">
<script type="text/javascript" src="bower_components/jquery/jquery.js"></script>
<script type="text/javascript" src="bower_components/selectize/dist/js/standalone/selectize.min.js.js"></script>
<script type="text/javascript" src="bower_components/angular/angular.js"></script>
<script type="text/javascript" src="bower_components/angular-selectize2/dist/selectize2.js"></script>
```

(Note that `jquery` must be loaded before `angular` so that it doesn't use `jqLite` internally)


Add the selectize2 module as a dependency to your application module:

```javascript
var myAppModule = angular.module('MyApp', ['selectize2']);
```

Setup your controller variables:

```javascript
$scope.myModel = 1;

$scope.myOptions = [
  {id: 1, title: 'Spectrometer'},
  {id: 2, title: 'Star Chart'},
  {id: 3, title: 'Laser Pointer'}
];

$scope.config = {
  create: true,
  valueField: 'id',
  labelField: 'title',
  delimiter: '|',
//  maxItems: 1
}
```

Add the input element to your view template:

```html
<input type="text" selectize="config" options='myOptions' ng-model="myModel">
```

##Config
Theoretically, all of the config options from the original selectize should work. But I have not been able to test them all.

- [Selectize config options](https://github.com/brianreavis/selectize.js/blob/master/docs/usage.md)
- [Selectize API](https://github.com/brianreavis/selectize.js/blob/master/docs/api.md)

##Global Defaults
To define global defaults, you can configure the `selectize2` injectable:

```javascript
myAppModule.run(['selectize2Config', function(selectize2Config) {
	selectize2Config.delimiter = ",";
}]);
```
