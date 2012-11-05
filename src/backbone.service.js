(function (Backbone) {

  "use strict";

  function Service(options) {
    this.options = options || {};
    this.targets = parseTargets(options.targets);
    _(this.targets).each(this.createMethod, this);
  }

  Service.prototype.createMethod = function (target) {
    this[target.name] = function (data, options) {
      var promise = new Promise(this);
      options = this.createOptions(promise, target, data, options);
      Backbone.sync(methodMap[target.method.toUpperCase()], null, options);
      return promise;
    }
  }

  Service.prototype.createOptions = function (promise, target, data, options) {
    var self = this;
    return {
      url: this.options.url + target.path,
      data: data,
      success: function (resp, status, xhr) {
        options.success && options.success.call(self, resp);
        promise.resolve(resp);
      },
      error: function (xhr, status, error) {
        console.log(arguments);
        options.error && options.error.apply(self, [error, xhr]);
        promise.reject(error, xhr);
      }
    };
  };

  var methodMap = {
    'POST':   'create',
    'PUT':    'update',
    'DELETE': 'delete',
    'GET':    'read'
  };

  function parseTargets(targets) {
    return _(targets).map(function (props, name) {
      var target = { name: name, path: props, method: "GET" };
      if (_.isArray(props)) {
        _.extend(target, { path: props[0], method: props[1] });
      }
      return target;
    });
  }

  Backbone.Service = Service;

  // simple promise implementation
  function Promise(context) {
    this.context = context || this;
    this.success = [];
    this.error = [];
  }

  Promise.prototype = {
    constructor: Promise,
    then: function (success, error) {
      if (success) {
        if (this.resolved) {
          success.apply(this.context, this.resolved);
        }
        else {
          this.success.push(success);
        }
      }

      if (error) {
        if (this.rejected) {
          error.apply(this.context, this.rejected);
        }
        else {
          this.error.push(error);
        }
      }

      return this;
    },

    resolve: function () {
      var callback;
      this.resolved = arguments;
      this.error = [];
      while (callback = this.success.shift()) {
        callback.apply(this.context, this.resolved);
      }
    },

    reject: function () {
      var callback;
      this.rejected = arguments;
      this.success = [];
      while (callback = this.error.shift()) {
        callback.apply(this.context, this.rejected);
      }
    }
  };

})(Backbone);
