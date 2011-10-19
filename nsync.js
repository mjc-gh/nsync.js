(function(){
	var nsync;
	nsync = this.nsync = function(obj){
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
	
	function collect_changes(full, subset, changes){
		for (var i in full){
			if (isObject(subset[i])){
				collect_changes(full[i], subset[i], (changes[i] = {}));
				
			} else {
				changes[i] = !!subset[i];
			}
		}
	}

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
	deep_copy(nsync.prototype, {		
		// Publish for a given update set; defaults to what is in this.data
		publish:function(changes){
			var query_paths = this._paths;
			if (!query_paths) return;
			
			// if no changes, use data directly
			var data = changes || this.data;
			
			for (var query in query_paths){
				var test = new Function('try{with(this){return '+ query +'; }}catch(e){return !1;}');
				
				if (test.call(data)){
					var fn_list = query_paths[query];
					for (var i = 0; i < fn_list.length; i++)
						fn_list[i].call(this);
				}
			}
		},
		
		// Subscribe function with a supplied query
		subscribe:function(query, func){
			var query_map = this._paths || (this._paths = {});
			
			var list = query_map[query] || (query_map[query] = []);
			if (indexOf.call(list, func) < 0){
				list.push(func);
			}
		},
		
		// Remove function from list of subscribers for the given query.
		unsubscribe:function(query, func){
			var list = this._paths[query];
			if (!list) return;
			
			for (var i = 0; i < list.length;){
				if (func === list[i]){
					list.splice(i, 1);
					
				} else {
					i++;
					
				}
			}
		},
		
		// Merge in new data; publish changes unless this update is silent
		update: function(obj, silent){
			this.previous = deep_copy({}, this.data);
			deep_copy(this.data, obj);
			
			var changes = this.changes = {};
			collect_changes(this.data, obj, changes);
			
			if (!silent) {
				this.publish(changes);
			}
		}
	});
})();

