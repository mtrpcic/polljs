(function (glob, factory) {
    "use strict";

    if (typeof define === "function" && define.amd) {
        define("poll", [], function() {
            return factory();
        });
    } else if (typeof exports === "object") {
        module.exports = factory();
    } else {
        glob.Poll = factory();
    }
}(this, function() {
    "use strict";

    var Poll = {
        "version": "@@VERSION",
        "start": function(config){
            config.internalAction = config.action;
            config.action = function(){
                Poll.util.attempts(config.name, config.internalAction);
            };
            if(config.start){
                if(config.interval){
                    if(config.increment){
                        Poll.timers[config.name] = {"type": "timeout", "config": config, "attempts": 0, "value": setTimeout(function(){
                            Poll.util.timeout(config.name, config.action, config.interval);
                        }, config.start)};
                    } else {
                        Poll.timers[config.name] = {"type": "timeout", "config": config, "attempts": 0, "value": setTimeout(function(){
                            config.action();
                            Poll.timers[config.name].value = setInterval(config.action, config.interval);
                            Poll.timers[config.name].type = "interval";
                        }, config.start)};
                    }
                } else {
                    Poll.timers[config.name] = {"type": "timeout", "config": config, "attempts": 0, "value": setTimeout(config.action, config.start)};
                }
            } else if(config.interval){
                if(config.increment){
                    Poll.timers[config.name] = {"type": "interval", "config": config, "attempts": 0, "value": setTimeout(function(){
                        Poll.util.timeout(config.name, config.action, (config.interval + config.increment));
                    }, config.interval)};
                } else {
                    Poll.timers[config.name] = {"type": "interval", "config": config, "attempts": 0, "value": setInterval(config.action, config.interval)};
                }
            } else {
                throw "PollJS: You need to define a start, an interval, or both.";
            }
        },
        "util": {
            "attempts": function(name, fn){
                var ret, instance = Poll.timers[name];
                Poll.timers[name].attempts += 1;
                ret = fn();

                if(ret === false){
                    Poll.stop(name);
                }

                if(instance.config.attempts){
                    if(instance.attempts === instance.config.attempts){
                        Poll.stop(name);
                        instance.config.fallback();
                    }
                }
            },
            "timeout": function(name, fn, start){
                var time, config = Poll.timers[name].config;
                time = (start + (config.increment || 0));
                Poll.timers[name].value = setTimeout(function(){
                    Poll.util.timeout(config.name, fn, time);
                }, time);
                Poll.timers[name].type = "timeout";
                fn();
            }
        },
        "stop": function(name){
            var instance = Poll.timers[name];
            if(instance.type === "interval"){
                clearInterval(instance.value);
            } else {
                clearTimeout(instance.value);
            }
        },
        "timers": {}
    };

    return Poll;
}));
