nsync.js
========

nsync.js is a data synchronization wrapper for Javascript. It very loosely ties data to "views" (functions). It was created for and used by [BreakBase](http://breakbase.com). 

The idea is that you have some data that is constantly changing and being updated, usually by some "real-time" feed. Using nsync, it is possible to subscribe to these changes via "view" functions.

The goal of library is simplicity, no dependencies, and small size (currently about under 1200 bytes minified). Note that, nsync.js is not final and is still being developed. The best documentation at this time is to just examine code the itself.

### Quick Example

    var room = new nsync({status: 2, players: { alice: { id: 1234 }, bob: { id: 5678 } } });

    // subscribe to changes on different paths
    room.subscribe('status', function(){ alert(this.status); });
    room.subscribe('players', function(){ for (var i in players) alert(i); });

    // update something; only updated paths are called
    room.update({ status: 1 });

### Notes

Wrapped objects can only contain 'JSON' values. That is, strings, numbers, objects, arrays, true\false, and null. Additionally, `undefined` can also be used. This is because the code uses a `deep_copy` method which is only able to copy these types. Things like Date objects and so on are not supported.