nsync.js
========

nsync.js is a data synchronization wrapper for Javascript. It's designed to wrap large, nested data objects and provide a simple interface for observing updates and determing changes. 

It was created for and used by [BreakBase](http://breakbase.com). 

The idea is that you have some data that is constantly changing, usually by some "real-time" feed. Using nsync.js, it is possible to observe to these changes via it's independent `PubSub` system. Creating objects for you application that wrap nysnc.js objects is extremely easy and simple!

The goal of library is simplicity, no dependencies, and small size (currently about under 1200 bytes minified).