var test_obj = { a: 1, b: { c: [] }, d: { e: {	f: 1 } } };

test('Base constructor', function(){
	var base = new nsync(test_obj);
	deepEqual(base.data, test_obj);
	notStrictEqual(base.data, test_obj);
	
	var src = {};
	var empty = new nsync();
	deepEqual(empty.data, src);
	notStrictEqual(base.data, src);
});

test('Base manipulation', function(){
	var src = { a:1, b:{ c:[] }, d:{ e:[ { g:1 }, {h:2} ] } };
	var base = new nsync(src);
	var obj = base.data;
	
	notStrictEqual(obj, src)
	
	obj.x = 1
	src.y = 2;
 
	strictEqual(base.data.x, 1);
	notEqual(base.data.x, src.x);
	strictEqual(base.data.y, undefined);
 
	obj.b.x = 1;
	src.b.y = 2;
 
	strictEqual(base.data.b.x, 1);
	strictEqual(base.data.b.y, undefined);	
	notEqual(base.data.b.x, src.b.x);
	
	obj.b.c.push(1);
	notDeepEqual(base.data.b.c, src.b.c);
	
	notStrictEqual(obj.d.e[0], src.d.e[0]);
	notStrictEqual(obj.d.e[1], src.d.e[1]);
});

test('Base#replace', function(){
	var fn = function(){ equal(this, base); };
	var base = new nsync(test_obj);
	var obj = { a:2, b:{ c:[1] } };
	
	expect(8);
	
	// base.subscribe(fn);
	// base.subscribe('a', fn);
	// base.subscribe('b.c', fn);
	// base.subscribe('d.e', fn);
	base.replace(obj);
	
	deepEqual(base.data, obj);
	deepEqual(base.data.a, obj.a);
	deepEqual(base.data.b, obj.b);
	strictEqual(base.data.d, undefined);

	deepEqual(base.previous, test_obj)
	strictEqual(base.changed, true);

	notStrictEqual(base.data, base.previous);
	notStrictEqual(base.data.b.c, base.previous.b.c);
});

test('Base#update', function(){
	var fn = function(path){ equal(this, base); };
	var base = new nsync(test_obj);
	var obj = { a:2, b:{ x:[] }, m:{ n: { q: 1 } } };

	expect(18);

	base.subscribe(fn);
	base.subscribe('a', fn);
	base.subscribe('b', fn);
	base.subscribe('b.c', fn); // should not run
	base.subscribe('d.e', fn); // should not run
	base.update(obj);
	
	ok(base.data.m.n.q);
	notStrictEqual(base.data.m, obj.m);
	notStrictEqual(base.data.m.n, obj.m.n);
	
	strictEqual(base.data.a, obj.a);
	deepEqual(base.data.b.x, obj.b.x);
	
	deepEqual(base.data.b.c, test_obj.b.c);
	deepEqual(base.data.d, test_obj.d);
	
	strictEqual(test_obj.b.x, undefined);
	
	deepEqual(base.previous, test_obj);
	notStrictEqual(base.data, base.previous);
	notStrictEqual(base.data.d.e, base.previous.d.e);
	
	deepEqual(base.changed, ['a', 'b', 'b.x', 'm', 'm.n', 'm.n.q']);
	
	var more = { y:{ z:1 } };
	base.subscribe('y.z', fn);
	base.update(more);
	
	equal(base.data.y.z, more.y.z);
	notStrictEqual(base.data.y, more.y);
	deepEqual(base.changed, ['y', 'y.z']);
});

test('Base#refresh', function(){
	var fn = function(path){ equal(this, base); };
	var gn = function(path){ equal(this, base); };
	var base = new nsync(test_obj);

	expect(4);

	base.subscribe(fn);
	base.subscribe(gn);
	base.refresh(); // 2 run
	
	base = new nsync(test_obj);
 
	base.subscribe(fn);
	base.subscribe(gn);
	base.subscribe('a.b', fn);
	base.subscribe('x.y q.n', gn);
	base.refresh(); // 3 run
});

test('Base#update with different types', function(){
	var base = new nsync({ a:{} });
	var updt = { a:[1,2,3] };
	base.update(updt);
	
	deepEqual(base.data, updt, '1-depth obj to array');

	base = new nsync({ a:[1,2,3] });
	updt = { a:{ b:1 } };
	base.update(updt);

	deepEqual(base.data, updt, '1-depth array to obj');

	base = new nsync({ a:{ b:{ x:1 }, c:1 } });
	updt = { a:{ b:[1,2,3], c:2 } };
	base.update(updt);
 
	deepEqual(base.data, updt, '2-depth obj to array');

	base = new nsync({ a:{ b:[1,2,3], c:1 } });
	updt = { a:{ b:{ x:1 }, c:2 } };
	base.update(updt);

	deepEqual(base.data, updt, '2-depth array to obj');

	base = new nsync({ a:[1,2,3] });
	updt = { a:[4,5] };
	base.update(updt);
	
	deepEqual(base.data, updt);
	equal(base.data.a.length, updt.a.length);

	base = new nsync({ a: { b:{ c:1 } } });
	updt = { a: { b:null } };
	base.update(updt);
	
	deepEqual(base.data, updt, 'null object');
});
