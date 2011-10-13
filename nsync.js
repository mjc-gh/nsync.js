(function(){
	var nsync;
	nsync = this.nsync = function(obj){
		this.data = deep_copy({}, obj);
	};
	
	function isObject(obj){
		return !!obj && obj.constructor === Object;
	}
	
	function collect_paths(obj, prev){
		var paths = [];
		for (var i in obj){
			var path = prev ? prev + '.' + i : i;
			paths.push(path);

			if (isObject(obj[i])) {
				paths = paths.concat(collect_paths(obj[i], path));
			}
		}
		
		return paths;
	}

	// we need a "deep merge\copy" (only supports "JSON values")
	function deep_copy(dst, src){
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
	
	var indexOf = Array.prototype.indexOf || function(obj){
		for (var i = 0; i < this.length; i++){
			if (this[i] === obj) 
				return i;
		}

		return -1;
	};
	
	// we can just use deep_copy to extend the prototype. the function is overkill
	// but it works fine and is only used once
	deep_copy(nsync.prototype, {
		
		// Publish for a given path. If not path is supplied, the root path
		// is used
		publish:function(path){
			if (!this._paths) return;
			
			path = path || '.';
			var list = this._paths[path];
			
			if (list){
				for (var i = 0; i < list.length; i++){
					list[i].call(this, path);
				}
			}
		},
		
		// Subscribe function to supplied path. The function is also added to the 
		// root path, '.'. The root path is used to track all unique subscriber function
		subscribe:function(path_or_fn, func){
			var paths = this._paths || (this._paths = {});
			var split = func ? path_or_fn.split(/\s+/).concat(['.']) : ['.'];
			
			for (var i = 0; i < split.length; i++){
				var list = paths[split[i]] || (paths[split[i]] = []);
				if (indexOf.call(list, func) < 0){
					list.push(func || path_or_fn);
				}
			}
		},
		
		// Remove function from list of subscribers. Just like subscribe will add the function
		// to the root path, unsubscribe will remove it.
		unsubscribe:function(path, func){
			if (!this._paths)
				return;

			if (!func)
				return this.unsubscribe('.', path);

			var list = this._paths[path];
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
			this.changed = collect_paths(obj);

			deep_copy(this.data, obj);
			
			if (silent) return;
			
			for (var i = 0; i < this.changed.length; i++){
				this.publish(this.changed[i]);
			}
		},
		
		// alias to publish 'root' path; calls all unique subscriber functions
		refresh: function(){
			this.publish();
		}
	});
})();


