(function(){
	// nsync model constructor; initializes data
	var nsync = this.nsync = function(obj){
		this.data = deep_copy({}, obj);
	};

	var indexOf = Array.prototype.indexOf || function(obj){
		for (var i = 0; i < this.length; i++){
			if (this[i] === obj)
				return i;
		}
 
		return -1;
	};
	
	function isObject(obj){
		return !!obj && obj.constructor === Object;
	}
	
	// nsync also consists of a PubSub system that objects can 
	this.PubSub = {
		publish: function(type){
			var handlers = this.handlers || (this.handlers = {});
			var list = handlers[type];
			
			if (!list) return;
			
			var args = Array.prototype.slice.call(arguments, 1);
			for (var i = 0; i < list.length; i++)
				list[i].apply(this, args);
			
			return this;
		},

		subscribe:function(type, func){
			var handlers = this.handlers || (this.handlers = {});
			
			if (!func){
				for (var i in type)
					this.subscribe(i, type[i]);
				
			} else {
				var list = handlers[type] || (handlers[type] = []);
				
				if (indexOf.call(list, func) < 0)
					list.push(func);
			}
			
			return this;
		},
		
		unsubscribe:function(type, func){
			var handlers = this.handlers || (this.handlers = {});
			var list = handlers[type];
			
			if (!list) return;
			
			for (var i = 0; i < list.length;){
				if (func == list[i]){
					list.splice(i, 1);
					
				} else {
					i++;
					
				}
			}
			
			return this;
		}
	};
	
	// we need a "deep merge\copy" (only supports "JSON values")
	function deep_copy(dst, src, changes){
		for (var i in src){
			if (src[i] && typeof src[i] == 'object') { 
				// dst[i] is null\array or not same type as src
				if (!isObject(dst[i]) || dst[i].constructor !== src[i].constructor)
				 	delete dst[i];
				
				deep_copy(dst[i] || (dst[i] = isObject(src[i]) ? {} : []), src[i]);
				
			} else {
				dst[i] = src[i];
				
			}
		}
		
		return dst;
	}	
	
	// we can just use deep_copy to extend the prototype. the function is overkill
	// but it works fine and is only used once
	deep_copy(nsync.prototype, this.PubSub);
	deep_copy(nsync.prototype, {
		// Helper method to determine what changed. Supports deep object access via strings
		changed:function(path){
			if (this.changes == null)
				return false;
			
			var test = new Function('try{with(this){return '+ path +'!==undefined; }}catch(e){return !1;}');
			
			return test.call(this.changes)
		},
		
		// Merge in new data; publish changes unless this update is silent
		update: function(obj, silent){
			this.changes = deep_copy({}, obj);
			this.previous = deep_copy({}, this.data);
			
			deep_copy(this.data, obj);
			
			if (!silent)
				this.publish('update');
		}
	});
})();
