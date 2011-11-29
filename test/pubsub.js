test('PubSub exists', function(){
	ok(PubSub);
});

test('subscribe method', function(){
	var fn = function(){};
	var gn = function(){};
	var psub = new nsync({ a: 1});
	
	psub.subscribe('abc', fn);
	psub.subscribe('xyz', fn);
	
	ok(psub.handlers['abc']);
	equal(psub.handlers['abc'].length, 1);
	
	ok(psub.handlers['xyz']);
	equal(psub.handlers['xyz'].length, 1);

	psub.subscribe('abc', gn);
	psub.subscribe('abc', fn);

	ok(psub.handlers['abc']);
	equal(psub.handlers['abc'].length, 2);
	
	psub.subscribe({
		abc: function(){},
		xyz: function(){}
	});
	
	equal(psub.handlers['abc'].length, 3);
	equal(psub.handlers['xyz'].length, 2);
});

test('unsubscribe method', function(){
	var fn = function(){};
 	var gn = function(){};
	var psub = new nsync();

	psub.subscribe('abc', fn);
	psub.subscribe('abc', gn);
	
	psub.subscribe('xyz', fn);
	psub.subscribe('xyz', gn);
	psub.subscribe('xyz', function(){});
	
	psub.unsubscribe('abc', fn);
	equal(psub.handlers['abc'].length, 1);
	
	psub.unsubscribe('abc', gn);
	equal(psub.handlers['abc'].length, 0);

	psub.unsubscribe('xyz', fn);
	equal(psub.handlers['xyz'].length, 2);

	psub.unsubscribe('xyz', gn);
	equal(psub.handlers['xyz'].length, 1);
});

test('publish method', function(){
	var psub = new nsync(), ctx = {};
	
	var fn = function(){ equal(this, psub); };
	var gn = function(){ deepEqual(arguments, [1,2,3]); };
	var hn = function(){ equal(this, ctx); };
	
	expect(5);

	psub.subscribe('abc', fn);
	psub.subscribe('xyz', fn);
	psub.subscribe('lmn', fn);

	psub.publish('abc');
	psub.publish('xyz');
	
	psub.publish('abc', [1,2,3]);
	psub.publish('xyz', [1,2,3]);
	
	psub.subscribe('ctx', hn);
	psub.publish('ctx', [], ctx);
});
