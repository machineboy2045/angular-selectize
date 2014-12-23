var app = angular.module('plunker', ['selectize']);

app.controller('MainCtrl', function($scope, $timeout) {
  $scope.disable = false;
  //=======================================================
  //tagging
  //=======================================================
  $scope.tags = ['Awesome', 'Neat'];
  
  $scope.tagsConfig = {
    delimiter: ',',
    persist: false,
    create: function(input) {
        return {
            value: input,
            text: input
        }
    }
  }
  
  //=======================================================
  //emails
  //=======================================================
  $scope.emails; 
  

  var REGEX_EMAIL = '([a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@' +
                  '(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)';
  $scope.emailsConfig = {
    persist: false,
    maxItems: null,
    valueField: 'email',
    labelField: 'name',
    options: [{email: 'brian@thirdroute.com', name: 'Brian Reavis'},
        {email: 'nikola@tesla.com', name: 'Nikola Tesla'},
        {email: 'someone@gmail.com'}],
    searchField: ['name', 'email'],
    render: {
        item: function(item, escape) {
            return '<div>' +
                (item.name ? '<span class="name">' + escape(item.name) + '</span>' : '') +
                (item.email ? '<span class="email">' + escape(item.email) + '</span>' : '') +
            '</div>';
        },
        option: function(item, escape) {
            var label = item.name || item.email;
            var caption = item.name ? item.email : null;
            return '<div>' +
                '<span class="label">' + escape(label) + '</span>' +
                (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
            '</div>';
        }
    },
    createFilter: function(input) {
        var match, regex;

        // email@address.com
        regex = new RegExp('^' + REGEX_EMAIL + '$', 'i');
        match = input.match(regex);
        if (match) return !this.options.hasOwnProperty(match[0]);

        // name <email@address.com>
        regex = new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$', 'i');
        match = input.match(regex);
        if (match) return !this.options.hasOwnProperty(match[2]);

        return false;
    },
    create: function(input) {
        if ((new RegExp('^' + REGEX_EMAIL + '$', 'i')).test(input)) {
            return {email: input};
        }
        var match = input.match(new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$', 'i'));
        if (match) {
            return {
                email : match[2],
                name  : $.trim(match[1])
            };
        }
        alert('Invalid email address.');
        return false;
    }
  }
  
  //=======================================================
  //Single
  //=======================================================
  $scope.single = null;
  
  $scope.singleConfig = {
    options: [{value: 1, text: 'Chuck Testa'}, {value: 2, text:'Nikola Tesla'}],
    create: true,
    sortField: 'text',
    maxItems: 1,
  }
  
 
  //=======================================================
  //Angular Bindings
  //=======================================================
  $scope.myModel = ['1'];
  
  $scope.myOptions = [{value: '1', text: 'Chuck Testa'}, {value: '2', text:'Nikola Tesla'}];
  
  $scope.myConfig = {
    create: true,
    required: true,
  }
  
  //simulate async option loading
  $timeout(function(){
    for(var i = 10; i < 10000; i++){
      $scope.myOptions.push({value: i, text: 'option'+i})
    }
  })
  
  
});
