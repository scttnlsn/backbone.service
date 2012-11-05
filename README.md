backbone.service
================
[![build status](https://secure.travis-ci.org/mkuklis/backbone.service.js.png)](http://travis-ci.org/mkuklis/backbone.service.js)
# backbone.service

Sometimes you run into situations when restful API is not an option. Backbone.service is trying to solve this for you.

## Install

    <script src="backbone.service.js"></script>

## Usage

You can use backbone.service.js as a standalone object or extend backbone model or collection.

````javascript

// server targets
 var targets = {
   login: ["/login", "post"],
   signup: ["/signup", "post"],
   logout: ["/logout", "get"],
   search: ["/search", "get"],
   resetpassword: ["/resetpassword", "post"],
   updateSettings: ["/updateSettings", "post"]
 };

// standalone service

var service = new Backbone.Service({ url: "http://localhost:5000", targets: targets }));

// extend backbone model

var User = Backbone.Model.extend(service);

````

##License:
<pre>
(The MIT License)

Copyright (c) 2012 Michal Kuklis

</pre>
