# PollJS #
PollJS is a lightweight wrapper for the JavaScript Interval and Timer methods.

# Features #
* Lightweight (~1.5k)
* Supports maximum attempt limits, fallbacks, and incremental interval times
* Compatible with all major browsers (Tested on Firefox 3.6, Firefox 4.0, Firefox 5.0, Fireofox 6.0, Chrome 9, Opera 11, IE7, IE8, IE9)
* Independant of all third party libraries, but plays nice with all of them

# Getting Started #
PollJS is simple to use.  Every time you want to start an interval or timer, simply call the `Poll.start` method, and give it the appropriate configuration values:

    Poll.start({
        name: "update_users",
        interval: 1500,
        action: function(){
            alert("Updated!");
        }
    });

To stop the interval, simply pass your defined name to the `Poll.stop` method:

    Poll.stop("update_users");

You can also stop an interval from within it's action by returning false:

    Poll.start({
        name: "update_users",
        interval: 1500,
        action: function(){
            alert("Updated!");
            return false; // Kill this poller.
        }
    });

# Configuration Options #
PollJS accepts several configuration options:

         name: The defined name for your poller.  This is the unique ID used to stop it in the future.   
       action: This is the method to be executed whenever you tell it to happen.
     interval: This is how often the action will be run.  Equivalent to calling the native `setInterval` function.
        start: This is when the action is first run. Equivalent to calling the native `setTimeout` function.
    increment: This works in conjunction with the 'interval` config option.  It tells PollJS to increase the time between intervals by a particular value.
     attempts: This is the maximum number of attempts to be made.
     fallback: If the maximum number of attempts is reached, PollJS will execute a fallback action if you specify one.

At least one of `start` or `interval` is required to set up a poller.  If both are omitted, PollJS will raise an exception.

# Advanced Polling #
You can use all of the PollJS configuration options at once:

    Poll.start({
        name: "check_print_job",
        action: function(){
            //do some code here
        },
        start: 5000, // Start this poller 5 seconds from now
        interval: 500, // Re-run the poller every 0.5 seconds
        increment: 200, // Increase the poll interval by 200ms every time it runs
        attempts: 5,
        fallback: function(){
            alert("Fallback");
        }
    });

In the example above, all three timing options are provided, and play nicely together.  Assuming the poller isn't killed, it will run the action 5 times, at increasingly longer intervals.

# Next Steps #
* Figure out how to test this
* Add examples

# Pull Requests #
To make a pull request, please do the following:

* Mention what specific version of PollJS you were using when you encountered the issue/added the feature.  This can be accessed by doing `Poll.version` in a debugger console
* Provide a [pastie](http://pastie.org/) or [gist](https://gist.github.com/) that demonstrates the bug/feature
* Make sure to update the minified version of the source
* Do **not** modify the `Poll.version` attribute.  I will modify that manually when merging the request

# Disclaimer #
This code is provided with no warranty.  While I strive to maintain backwards compatibility, the code is still under active development.  As this is the case, some revisions may break compatibility with earlier versions of the library.  Please keep this in mind when using PollJS.

# Copyright and Licensing #
Copyright (c) 2011 Mike Trpcic, released under the MIT license.
