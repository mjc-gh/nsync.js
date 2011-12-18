nsync.js
========

*This code is very experimental and is constantly changing.*

nsync.js is a data synchronization wrapper for Javascript. It very loosely ties data to "views" (functions). It was created for and used by [BreakBase](http://breakbase.com). 

The idea is that you have some data that is constantly changing and being updated, usually by some "real-time" feed. Using nsync, it is possible to subscribe to these changes via a simple PubSub system.

The goal of library is simplicity, no dependencies, and small size (currently about under 1200 bytes minified). Note that, nsync.js is not final and is still being developed. The best documentation at this time is to just examine code the itself.


### Notes

Wrapped objects can only contain 'JSON' values. That is, strings, numbers, objects, arrays, true\false, and null. Additionally, `undefined` can also be used. This is because the code uses a `deep_copy` method which is only able to copy these types. Things like Date objects and so on are not supported.

