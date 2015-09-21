angular-selectize
==================
![selectize5](https://cloud.githubusercontent.com/assets/4087667/5633745/2cfeac18-958f-11e4-9e62-6eba90547b4c.png)

###Demo
[Try the Demo on Plunker](http://plnkr.co/edit/nTf19f?p=preview)

###Features
This is an Angular.js directive for Brian Reavis's [selectize jQuery plugin](http://brianreavis.github.io/selectize.js/). It supports all of Selectize's features. Here are some highlights:

* Better performance than UI-Select ([ui-select](http://plnkr.co/edit/pSJNHS?p=preview) vs [angular-selectize](http://plnkr.co/edit/23VkhV?p=preview))
* Selectize is ~7kb (gzipped)
* Smart Ranking / Multi-Property Searching & Sorting
* Angular Models & Bindings
* Skinnable
* Keyboard support


## Upgrading to version 3.x.x
Previous versions supported simple arrays for options `['Option 1', 'Option 2']`. Version 3.0 drops this in order
to simplify the directive and make it more consistent with the original Selectize.

Also note the main js file has been renamed from `'selectize.js'` to `'angular-selectize.js'`.


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
<script type="text/javascript" src="bower_components/angular-selectize2/dist/angular-selectize.js"></script>
```


Add the selectize module as a dependency to your application module:

```javascript
var myAppModule = angular.module('MyApp', ['selectize']);
```

## Usage

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
##Differences in Angular version
Please note in the example that, unlike the original Selectize, options should NOT be passed in the config object.

##More Documentation
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
