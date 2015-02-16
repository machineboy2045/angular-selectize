angular-selectize
==================
![selectize5](https://cloud.githubusercontent.com/assets/4087667/5633745/2cfeac18-958f-11e4-9e62-6eba90547b4c.png)

###Demo
[Try the Demo on Plunker](http://plnkr.co/edit/X2YYPX?p=preview)

###Features
This is an Angular.js directive for Brian Reavis's [selectize jQuery plugin](http://brianreavis.github.io/selectize.js/). It supports all of Selectize's features. Here are some highlights:

* Better performance than UI-Select ([ui-select](http://plnkr.co/edit/pSJNHS?p=preview) vs [angular-selectize](http://plnkr.co/edit/xdyzf9?p=preview))
* Selectize is ~7kb (gzipped)
* Smart Ranking / Multi-Property Searching & Sorting
* Angular Models & Bindings
* Skinnable
* Keyboard support





## Dependencies

- [AngularJS](http://angularjs.org/)
- [JQuery](http://jquery.com/)
- [Selectize](http://brianreavis.github.io/selectize.js/)

## Install
Install with [Bower](http://bower.io)

`$ bower install angular-selectize2`

Load the script files in your application:
```html
<link rel="stylesheet" href="bower_components/selectize/dist/css/selectize.default.css ">
<script type="text/javascript" src="bower_components/jquery/jquery.js"></script>
<script type="text/javascript" src="bower_components/selectize/dist/js/standalone/selectize.min.js"></script>
<script type="text/javascript" src="bower_components/angular/angular.js"></script>
<script type="text/javascript" src="bower_components/angular-selectize2/dist/selectize.js"></script>
```


Add the selectize module as a dependency to your application module:

```javascript
var myAppModule = angular.module('MyApp', ['selectize']);
```

## Basic Usage
Setup your controller variables:

```javascript
$scope.myModel;
$scope.myOptions = ['Spectrometer', 'Star Chart', 'Laser Pointer'];
```

Add the selectize element to your view template:

```html
<selectize options='myOptions' ng-model="myModel"></selectize>
```

## Advanced Usage

```javascript
$scope.myModel = 1;

$scope.myOptions = [
  {id: 1, title: 'Spectrometer'},
  {id: 2, title: 'Star Chart'},
  {id: 3, title: 'Laser Pointer'}
];

$scope.myConfig = {
  create: true,
  valueField: 'id',
  labelField: 'title',
  delimiter: '|',
  placeholder: 'Pick something',
  onInitialize: function(selectize){
    // receives the selectize object as an argument
  },
  // maxItems: 1
};
```


```html
<selectize config='myConfig' options='myOptions' ng-model="myModel"></selectize>
```


##Documentation
- [Selectize config options](https://github.com/brianreavis/selectize.js/blob/master/docs/usage.md)
- [Selectize API](https://github.com/brianreavis/selectize.js/blob/master/docs/api.md)

##Config
####Inline

```html
<selectize config="{create:true, maxItems:10}" options='myOptions' ng-model="myModel"></selectize>
```


####Global
To define global defaults, you can configure the `selectize` injectable:

```javascript
MyApp.value('selectizeConfig', {
  delimiter: '|'
});
```
