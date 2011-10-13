test('PubSub#subscribe', function(){
	var fn = function(){};
	var gn = function(){};
	var psub = new nsync({ a: 1});
	psub.subscribe(fn);

	ok(psub._paths);
	ok(psub._paths['.']);
	equal(psub._paths['.'].length, 1);

	psub.subscribe(fn);
	equal(psub._paths['.'].length, 2);
	
	psub.subscribe('a', fn);
	psub.subscribe('a.b', fn);
	
	ok(psub._paths['a']);
	equal(psub._paths['a'].length, 1);
	
	ok(psub._paths['a.b']);
	equal(psub._paths['a.b'].length, 1);
	
	psub.subscribe('a a.b', gn);
	equal(psub._paths['a'].length, 2);
	equal(psub._paths['a.b'].length, 2);
});

test('PubSub#unsubscribe', function(){
	var fn = function(){};
 	var gn = function(){};
	var psub = new nsync();

	psub.subscribe(fn); // refresh only
	psub.subscribe('a', fn);
	psub.subscribe('a', fn);
	psub.subscribe('a', gn);
	psub.subscribe('a.b', fn);
	psub.subscribe('a.b', gn);
	psub.subscribe('a.b', function(){});

	equal(psub._paths['.'].length, 3);
	equal(psub._paths['a'].length, 2);
	equal(psub._paths['a.b'].length, 3);
	
	psub.unsubscribe(fn);
	
	equal(psub._paths['.'].length, 2);

	psub.unsubscribe('a', fn);
	equal(psub._paths['a'].length, 1);
	
	psub.unsubscribe('a', gn);
	equal(psub._paths['a'].length, 0);

	psub.unsubscribe('a.b', fn);
	equal(psub._paths['a.b'].length, 2);

	psub.unsubscribe('a.b', gn);
	equal(psub._paths['a.b'].length, 1);
});

test('PubSub#publish', function(){
	var psub = new nsync();
	var fn = function(){ equal(this, psub); };
	var gn = function(){ equal(this, psub); };
	
	expect(6);

	psub.subscribe(fn);
	psub.subscribe('a b.c', fn);
	
	psub.subscribe('a', gn);
	psub.subscribe('b.c', gn);
	
	psub.subscribe('x y', fn);
	psub.subscribe('y z', gn);

	psub.publish('a');
	psub.publish('b.c');
	psub.publish('y');
	
});