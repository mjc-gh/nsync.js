test('PubSub#subscribe', function(){
	var fn = function(){};
	var gn = function(){};
	var psub = new nsync({ a: 1});
	psub.subscribe('a', fn);
	psub.subscribe('a.b', fn);
	
	ok(psub._paths['a']);
	equal(psub._paths['a'].length, 1);
	
	ok(psub._paths['a.b']);
	equal(psub._paths['a.b'].length, 1);
	
	psub.subscribe('a || a.b', gn);
	equal(psub._paths['a || a.b'].length, 1);
	
	psub.subscribe('a && a.b', gn);
	equal(psub._paths['a && a.b'].length, 1);
});

test('PubSub#unsubscribe', function(){
	var fn = function(){};
 	var gn = function(){};
	var psub = new nsync();

	psub.subscribe('a', fn);
	psub.subscribe('a', fn);
	psub.subscribe('a', gn);
	psub.subscribe('a.b', fn);
	psub.subscribe('a.b', gn);
	psub.subscribe('a.b', function(){});

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
	var psub, fn = function(){ equal(this, psub); };
	
	expect(10);

	psub = new nsync({a: 1});
	psub.subscribe('a', fn);
	psub.subscribe('b.c', fn);
	psub.subscribe('x || y', fn);
	psub.publish(); // expect 1
	
	psub = new nsync({a:1, b:{ c:1 }});
	psub.subscribe('a', fn);
	psub.subscribe('b.c', fn);
	psub.subscribe('x || y', fn);
	psub.publish(); // expect 2

	psub = new nsync({a:1, b:{ c:1 }});
	psub.subscribe('a || b.c', fn);
	psub.publish(); // expect 1

	psub = new nsync({a:1});
	psub.subscribe('a || b.c', fn);
	psub.subscribe('a || x.y.z', fn);
	psub.publish(); // expect 2
	
	psub = new nsync({a:1, b:{ c:1 }});
	psub.subscribe('a && b.c', fn);
	psub.publish(); // expect 1
	
	psub = new nsync({a:1});
	psub.subscribe('a && b.c', fn);
	psub.publish(); // expect 0
	
	psub = new nsync({a:1, b:{ c:1 }});
	psub.subscribe('a && b.c || x.y.z', fn);
	psub.subscribe('a && b.c && x.y.z', fn);
	psub.publish(); // expect 1
	
	psub = new nsync({a:1, b:{ c:1 }, d:{ e: { f:1 } } });
	psub.subscribe('a && b.c && d.e.f', fn);
	psub.subscribe('a && b && d.e', fn);
	psub.subscribe('x || a', fn);
	psub.publish(); // expect 2
	
	psub = new nsync({ a:1 });
	psub.subscribe('x || a > 0', fn);
	psub.publish(); // expect 0 (x is undefined)
});