var test_obj = { a: 1, b: { c: [] }, d: { e: {	f: 1 } } };

test('object creation', function(){
	var base = new nsync(test_obj);
	
	deepEqual(base.data, test_obj);
	notStrictEqual(base.data, test_obj);
	
	var src = {};
	var empty = new nsync();
	
	deepEqual(empty.data, src);
	notStrictEqual(base.data, src);
});

test('data manipulation', function(){
	var src = { a:1, b:{ c:[] }, d:{ e:[ { g:1 }, {h:2} ] } };
	var base = new nsync(src);
	var data = base.data;
	
	notStrictEqual(data, src)
	
	data.x = 1
	src.y = 2;
 
	strictEqual(base.data.x, 1);
	notEqual(base.data.x, src.x);
	strictEqual(base.data.y, undefined);
 
	data.b.x = 1;
	src.b.y = 2;
 
	strictEqual(base.data.b.x, 1);
	strictEqual(base.data.b.y, undefined);	
	notEqual(base.data.b.x, src.b.x);
	
	data.b.c.push(1);
	
	notDeepEqual(base.data.b.c, src.b.c);
	notStrictEqual(data.d.e[0], src.d.e[0]);
	notStrictEqual(data.d.e[1], src.d.e[1]);
});

test('update method', function(){
	var base = new nsync(test_obj);
	var obj = { a:2, b:{ x:[] }, m:{ n: { q: 1 } } };

	base.update(obj);

	deepEqual(base.changes, obj);
	notStrictEqual(base.changes, obj);
		
 	ok(base.data.m.n.q);
	notStrictEqual(base.data.m, obj.m);
	notStrictEqual(base.data.m.n, obj.m.n);
	 
	equal(base.data.a, obj.a);
	deepEqual(base.data.b.x, obj.b.x);
	notStrictEqual(base.data.b.x, obj.b.x);
 
	deepEqual(base.data.b.c, test_obj.b.c);
	deepEqual(base.data.d, test_obj.d);
	
	equal(test_obj.b.x, undefined);
	 
	deepEqual(base.previous, test_obj);
	notStrictEqual(base.data, base.previous);
	notStrictEqual(base.data.b, base.previous.b);
});

test('changed method', function(){
	var base = new nsync(test_obj);
	var obj = { a:2, b:{ x:[] }, m:{ n: { q: 1 } } };

	base.update(obj);

	ok(base.changed('a'));
	ok(base.changed('b'));

	ok(!base.changed('b.c'));
	ok(base.changed('b.x'));

	ok(!base.changed('d.e.f'));
	ok(base.changed('m.n.q'));
	
});
