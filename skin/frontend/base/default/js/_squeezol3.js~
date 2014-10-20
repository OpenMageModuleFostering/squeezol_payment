// JSON Object fallback for IE <= 8
// Thank you so much Duglas :-)
// Fuck you even more dear Bill :-)
if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
	'use strict';
	function f(n) {
  // Format integers to have at least two digits.
  	return n < 10 ? '0' + n : n;
  }
	if (typeof Date.prototype.toJSON !== 'function') {
		Date.prototype.toJSON = function () {
			return isFinite(this.valueOf())
      						? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                  : null;
     };
		 String.prototype.toJSON      =
     Number.prototype.toJSON  =
     Boolean.prototype.toJSON = function () {
     	return this.valueOf();
     };
  }
  var cx,
  		escapable,
      gap,
      indent,
      meta,
      rep;
	function quote(string) {
		// If the string contains no control characters, no quote characters, and no
		// backslash characters, then we can safely slap some quotes around it.
		// Otherwise we must also replace the offending characters with safe escape
		// sequences.
		escapable.lastIndex = 0;
    return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
    	var c = meta[a];
      return typeof c === 'string'
      						? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
    }) + '"' : '"' + string + '"';
  }
	function str(key, holder) {
		// Produce a string from holder[key].
		var i,          // The loop counter.
    		k,          // The member key.
        v,          // The member value.
        length,
        mind = gap,
        partial,
        value = holder[key];
		// If the value has a toJSON method, call it to obtain a replacement value.
		if (value && typeof value === 'object' &&
    	typeof value.toJSON === 'function') {
      value = value.toJSON(key);
    }
		// If we were called with a replacer function, then call the replacer to
		// obtain a replacement value.
		if (typeof rep === 'function') {
    	value = rep.call(holder, key, value);
    }
		// What happens next depends on the value's type.
		switch (typeof value) {
    	case 'string':
      	return quote(value);
			case 'number':
				// JSON numbers must be finite. Encode non-finite numbers as null.
				return isFinite(value) ? String(value) : 'null';
			case 'boolean':
      case 'null':
				// If the value is a boolean or null, convert it to a string. Note:
				// typeof null does not produce 'null'. The case is included here in
				// the remote chance that this gets fixed someday.
				return String(value);
				// If the type is 'object', we might be dealing with an object or an array or null.
			case 'object':
				// Due to a specification blunder in ECMAScript, typeof null is 'object',
				// so watch out for that case.

				if (!value) {
        	return 'null';
        }
				// Make an array to hold the partial results of stringifying this object value.
				gap += indent;
        partial = [];
				// Is the value an array?
				if (Object.prototype.toString.apply(value) === '[object Array]') {
					// The value is an array. Stringify every element. Use null as a placeholder
					// for non-JSON values.
					length = value.length;
          for (i = 0; i < length; i += 1) {
          	partial[i] = str(i, value) || 'null';
          }
					// Join all of the elements together, separated with commas, and wrap them in brackets.
					v = partial.length === 0
        										 ? '[]'
														 : gap
														 ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
														 : '[' + partial.join(',') + ']';
					gap = mind;
        	return v;
				}
				// If the replacer is an array, use it to select the members to be stringified.
				if (rep && typeof rep === 'object') {
        	length = rep.length;
          for (i = 0; i < length; i += 1) {
          	if (typeof rep[i] === 'string') {
            	k = rep[i];
              v = str(k, value);
            	if (v) {
              	partial.push(quote(k) + (gap ? ': ' : ':') + v);
              }
            }
          }
        } else {
				// Otherwise, iterate through all of the keys in the object.

        for (k in value) {
        	if (Object.prototype.hasOwnProperty.call(value, k)) {
          	v = str(k, value);
            if (v) {
            	partial.push(quote(k) + (gap ? ': ' : ':') + v);
            }
          }
        }
      }
			// Join all of the member texts together, separated with commas,
			// and wrap them in braces.
			v = partial.length === 0
      									 ? '{}'
												 : gap
												 ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
												 : '{' + partial.join(',') + '}';
												 gap = mind;
			return v;
    }
  }
	// If the JSON object does not yet have a stringify method, give it one.
	if (typeof JSON.stringify !== 'function') {
  	escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
    };
  JSON.stringify = function (value, replacer, space) {
		// The stringify method takes a value and an optional replacer, and an optional
		// space parameter, and returns a JSON text. The replacer can be a function
		// that can replace values, or an array of strings that will select the keys.
		// A default replacer method can be provided. Use of the space parameter can
		// produce text that is more easily readable.
  	var i;
    		gap = '';
        indent = '';
		// If the space parameter is a number, make an indent string containing that
		// many spaces.
    if (typeof space === 'number') {
    	for (i = 0; i < space; i += 1) {
      	indent += ' ';
      }
		// If the space parameter is a string, it will be used as the indent string.

		} else if (typeof space === 'string') {
    	indent = space;
    }
		// If there is a replacer, it must be a function or an array.
		// Otherwise, throw an error.
		rep = replacer;
    if (replacer && typeof replacer !== 'function' &&
    	(typeof replacer !== 'object' ||
       typeof replacer.length !== 'number')) {
         throw new Error('JSON.stringify');
    }
		// Make a fake root object containing our value under the key of ''.
		// Return the result of stringifying the value.
		return str('', {'': value});
  };
}
// If the JSON object does not yet have a parse method, give it one.
if (typeof JSON.parse !== 'function') {
	cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
  JSON.parse = function (text, reviver) {
	// The parse method takes a text and an optional reviver function, and returns
	// a JavaScript value if the text is a valid JSON text.
	var j;
	function walk(holder, key) {
	// The walk method is used to recursively walk the resulting structure so
	// that modifications can be made.
	var k, v, value = holder[key];
  if (value && typeof value === 'object') {
  	for (k in value) {
    	if (Object.prototype.hasOwnProperty.call(value, k)) {
      	v = walk(value, k);
        if (v !== undefined) {
        	value[k] = v;
        } else {
        	delete value[k];
        }
      }
    }
  }
  return reviver.call(holder, key, value);
}
// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

text = String(text);
cx.lastIndex = 0;
if (cx.test(text)) {
	text = text.replace(cx, function (a) {
  return '\\u' +
  ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	});
}
	// In the second stage, we run the text against regular expressions that look
	// for non-JSON patterns. We are especially concerned with '()' and 'new'
	// because they can cause invocation, and '=' because it can cause mutation.
	// But just to be safe, we want to reject all unexpected forms.

	// We split the second stage into 4 regexp operations in order to work around
	// crippling inefficiencies in IE's and Safari's regexp engines. First we
	// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
	// replace all simple value tokens with ']' characters. Third, we delete all
	// open brackets that follow a colon or comma or that begin the text. Finally,
	// we look to see that the remaining characters are only whitespace or ']' or
	// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.
	
	if (/^[\],:{}\s]*$/
	.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
  .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
  .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
	// In the third stage we use the eval function to compile the text into a
	// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
	// in JavaScript: it can begin a block or an object literal. We wrap the text
	// in parens to eliminate the ambiguity.
	j = eval('(' + text + ')');
	// In the optional fourth stage, we recursively walk the new structure, passing
	// each name/value pair to a reviver function for possible transformation.
	return typeof reviver === 'function'
  	? walk({'': j}, '')
    : j;
	}

// If the text is not JSON parseable, then a SyntaxError is thrown.
throw new SyntaxError('JSON.parse');
};
}
}());

(function() {
	// DOM ELEMENTS
	var SqStr = function(str) {
		var obj, that;
			  obj = {el:str};
				that = {};
				that.get = function() { return obj.el; };
				that.entityify = function() {
		        var character = {
		            '<': '&lt;',
		            '>': '&gt;',
		            '&': '&amp;',
		            '"': '&quot;'
		            };
		        return function() {
		            return obj.el.replace(/[<>&"]/g, function(c) {
		                return character[c];
		            });
		        };
		    }();
				return that;
	};

	var SqObj = function(ob) {
		var obj, that;
			  obj = {el:ob};
			  that = {};
		that.get = function() { return obj.el; };
		that.size = function() {
			var prop, count = 0;
		  for(prop in obj.el) {
		  	if(obj.el.hasOwnProperty(prop)) {
		    	if(typeof obj.el[prop] !== 'function') 
		      	count++; 
		      }
		  }
		  return count;
		 };
		 that.toFormUrlEnc = function() {
		   var encodedStr = '', count = 0,
		   		 prop, enc, len;
		   len = this.size();
		   for(prop in obj.el) {
		     if(obj.el.hasOwnProperty(prop)) {
		       if(typeof obj.el[prop] !== 'function') {
		         count++;
		         enc = encodeURI(obj.el[prop]);
		         encodedStr += encodeURI(prop) + '=' + enc.replace('=', '%3D');
		         if(count < len)
		           encodedStr += '&';
		       }
		     }
		   }
			 return encodedStr;
     };
		 that.toString = function() {
		   var str = '', prop;
			 for(prop in obj.el) {
				 if(obj.el.hasOwnProperty(prop)) {
					 if(typeof obj.el[prop] !== 'function') 
					   str += prop + ' : ' + obj.el[prop] + '\n';
				 }
			 }
			 return str;
		 };
		 that.collapse = function() {
			 var out={}, loop;
			 loop = function(ob) {
				 for(var prop in ob) {
					 if(!(ob[prop] instanceof Object)) {
						 if(typeof ob[prop] !== 'function') {
							 if(ob.hasOwnProperty(prop)) 
							   out[prop] = ob[prop];
						 }
					 }
					 else 
					   loop(ob[prop]);
				 }
			 };
			 loop(obj.el);
			 return out;
		 };
		 return that;
	};

	var DatePicker = function() {
		var that = {}, callBack;
		that.load = function(url) {
			var scr, css, isIe;
			css = document.createElement('link');
		  css.rel = 'stylesheet';
			css.type = 'text/css'; 
			css.href = css_url + 'pikaday.css';
			document.getElementsByTagName('head')[0].appendChild(css);
			scr = document.createElement('script');
			scr.type = 'text/javascript';
			if(typeof scr.onload === 'object') { 
				// Not IE <= 8
				scr.onload = function() {
					callBack();    
				}   
			}
			else if(typeof scr.onreadystatechange === 'object') {
				//IE <= 8 
				isIe = true;
				scr.onreadystatechange = function() {
					if(scr.readyState === 'loaded')
						callBack();
				 };
			}             
				scr.src = url;
				//TODO: if IE <= 8 maybe scr has to be appended to body
		    document.getElementsByTagName('body')[0].appendChild(scr);
	  };
		that.regCallBack = function(call) {
			callBack = call;
		};     
		return that;
  };

	var DomElement = function(obj) {
		var that = {};
		that.get = function(id) {
			if(id !== undefined) {
		  	if( (obj.el = document.getElementById(id)) == null ) 
			  	throw new Error('No elements with id ' + '"' + id + '"');
		  	else 
		  	  return obj.el;
			}
			else
				return obj.el;
		};
		that.addClass = function(name) {
			if(obj.el.className === '')
		  	obj.el.className = name;
		  else if(obj.el.className.indexOf(name) === -1) 
		  	obj.el.className += ' ' + name;
		  return this;
		};
		that.deleteClass = function(name) {
			var temp;
			if(obj.el.className.indexOf(name) != -1) {
				temp = obj.el.className.replace(name, '');
		    temp = temp.replace(/\s{2,}/g, ' ');
		    temp = temp.trim();
		    obj.el.className = temp;
		  }
		  return this;
		};
		that.remove = function() {
			obj.el.parentNode.removeChild(obj.el);
		};
		that.nextSibling = function() {
			var node; 
		  node = this.get();
		  do {
		  	node = node.nextSibling;
		  } while(node.nodeType !== 1);
		  	return DomElement({el:node});
		};
		that.previousSibling = function() {
			var node; 
		  node = this.get();
		  do {
		  	node = node.previousSibling;
		  } while(node.nodeType !== 1);
		  	return DomElement({el:node});
		};
		that.firstChild = function() {
			var node;
		  node = this.get().firstChild;
		  while(node.nodeType !== 1)
		  	node = node.nextSibling;   
		    return DomElement({el:node});
		};
		that.lastChild = function() {
			var node;
		  node = this.get().lastChild;
		  while(node.nodeType !== 1)
		  	node = node.previousSibling;   
			return DomElement({el:node});
		}; 
		that.find = function() {
			return; 
		};
		that.changeStyle = function(styleObj) {
			for(var prop in styleObj) {
		  	if(styleObj.hasOwnProperty(prop)) { 
		    	if(typeof styleObj[prop] !== 'function')
		      	obj.el.style[prop] = styleObj[prop];
		    }
		  }
		 	return this;
		}; 
		that.regHandler = function(eventName, handler) {
			if(obj.el.addEventListener) 
		  	obj.el.addEventListener(eventName, handler, false);
		  else if(obj.el.attachEvent)
		  	obj.el.attachEvent('on'+eventName, handler);
		  return this;
		};
		that.wrap = function(properties) {
			var wr, prop;
		  wr = document.createElement(properties.wrapper);
		  wr.className = properties.className;
		  wr.appendChild(obj.el);
		  return wr;
		};
		return that;  
  };

	var Div = function(element) {
		var obj, that;
		that = DomElement(obj = {el: element});
		// Creazione methodo "append"
		that.append = function(elem) {
			var ind;
		  if(elem instanceof Array) {
		  	for(ind=0; ind<elem.length; ind++) 
		    	obj.el.appendChild(elem[ind]);
		  }
		  else
		  	obj.el.appendChild(elem); 
		  return this;
		};
		return that; 
	};

	var Button = function(btn) {
		var obj, that, create, openUrl;
		that = DomElement(obj = {el: btn});
		that.create = function(name, size, btnId) {
			obj.el = document.createElement('button');
		  obj.el.appendChild(document.createTextNode(name));
		  if (btnId !== undefined){
		  	obj.el.id = btnId;
		  }
		  if(size === 'small') {
		  	obj.el.style.height = '25px';
		    obj.el.style.width = '100px';
		  }
		  else if(size === 'big') {
		  	obj.el.style.height = '50px';
		    obj.el.style.width = '150px';
		  }
			else if(size == 'ui'){
				return this;
			}
		  return this;
		};
		that.openUrl = function(url) {
			location.href = url;
		};
		that.wrap = function(wrapper) {
			var wr;
		  wr = document.createElement(wrapper['wrapper']);
		  wr.className = wrapper['className'];
		  wr.appendChild(obj.el);  
		  return wr;
		};
		return that;
	};
	
	// Vettore di input: oggetti di tipo Input
	var Input = function(obj) {
		var that;
		that = DomElement(obj);
		that.getName = function() { return obj.el.name; };
		that.getValue = function() { return SqStr(obj.el.value).entityify(); };
		that.getRawValue = function() { return obj.el.value };
		that.labelize = function(labelName, helpText) {
			var lab, div;
      var ui = UserInterface();
		  lab = document.createElement('label');
			div = document.createElement('div');
			lab.for = obj.el.id;
			div.className = 'form-group';
		  lab.appendChild(ui.textWithHelper(labelName, helpText));
			div.appendChild(lab)
		  div.appendChild(obj.el);		 
			return DomElement({el: div});
		},
		that.labelizeWithSpan = function(labelName, span, helpText){
			var lab;
      var ui = UserInterface();
			divForm = document.createElement('div');
			divInput = document.createElement('div');
		  lab = document.createElement('label');
			lab.for = obj.el.id
			divForm.className = 'form-group'
			divInput.className = 'input-group'
			divInput.appendChild(obj.el);
			divInput.appendChild(span);
		  lab.appendChild(ui.textWithHelper(labelName, helpText));
			divForm.appendChild(lab)
			divForm.appendChild(divInput)	 
			return DomElement({el: divForm});
		},
		that.getWrapDiv = function() {
			return obj.el.parentNode;
		};
		return that;
	};

	var TextInput = function(elem) {
		var obj, that;
		that = Input(obj = {el: elem});
		that.create = function(name) {
			var input = document.createElement('input');
			input.type = 'text';
		  input.name = name;
			input.maxlength = 120;
			input.className = "form-control";
		  obj.el = input;  
		  return this;
		};
		return that;
	};
		
	var TextArea = function(elem) {
		var obj, that;
		that = Input(obj = {el: elem});
		that.create = function(name) {
			var input = document.createElement('textarea');
		  input.name = name;
			input.className = "form-control";
		  obj.el = input;  
		  return this;
		};
		return that;
	}; 

	var DateInput = function(elem) {
		var obj, that, dp;
		that = Input(obj = {el: elem});
		that.getValue = function() {
			var date, temp;
			temp = dp.dp.getDate();
			if (temp){
				return date = temp.getDate() + '-' + (parseInt(temp.getMonth())+1).toString() + '-' + temp.getFullYear();
			}
		};
		that.create = function(name, init) {
			var input;
		  input = document.createElement('input');
		  input.type = 'text';
		  input.name = name;
			input.value = init.getDate() + '-' + (parseInt(init.getMonth())+1).toString() + '-' + init.getFullYear();
			input.className = "form-control";
		  obj.el = input;
		  return this;
		};
		that.addPicker = function(picker) {
			dp = picker;
		}
		return that;
	};

	var ComboBox = function(cmb) {
		var that, obj;
		that = Input(obj = {el: cmb});
		that.create = function(properties) {
			var ind, temp;
			obj.el = document.createElement('select');
		  for(ind = 0; ind < properties.length; ind++) {
		  	temp = document.createElement('option');
		    temp.value = properties[ind].value;
		    temp.appendChild(document.createTextNode(properties[ind].text));
		    obj.el.appendChild(temp);    
		  }
		  return this;
		};
		return that; 
  };

	var CheckBox = function(elem) {
		var that, obj;
		that = Input(obj = {el: elem});
		that.create = function(properties) {
		  obj.el = document.createElement('input');
		  obj.el['type'] = 'checkbox';
		  obj.el['name'] = properties.name;
		  obj.el['value'] = properties.value;
      if (properties.checked){
        obj.el['checked'] = properties.checked;
      }
		  return this;
		},
		that.labelize = function(labelName, helpText) {
			var lab, div; 
      var ui = UserInterface();
		  lab = document.createElement('label');
			div = document.createElement('div');
			lab.for = obj.el.id
			div.className = 'checkbox';
      lab.appendChild(obj.el);
		  lab.appendChild(ui.textWithHelper(labelName, helpText));
			div.appendChild(lab)
			return DomElement({el: div});
		},
		that.checked = function() { return obj.el.checked }; 
			return that;
	};
	
	var CheckBoxes = function() {
		var that = {},
		checkBoxes = [];
		that.push = function(elem) {
			checkBoxes.push(elem);
		};
		that.getValues = function() {
			var ind, obj = {};
		  for(ind=0; ind<checkBoxes.length; ind++)
		  	obj[checkBoxes[ind].getName()] = checkBoxes[ind].checked();
		    return obj;
		  };
		return that;
	};
	
	var Inputs = function() {
		var that = {},
		parentNode = undefined, 
		inputs = [];
		that.push = function(elem) {
			inputs.push(elem);
		};
		that.getParentNode = function() { 
			if(parentNode == undefined)
		  	return parentNode = inputs[0].get().parentNode;
		  else 
		  	return parentNode;
		  };
		that.getValues = function() {
			var ind, values = {};
		  for(ind=0; ind<inputs.length; ind++){
  		  	values[inputs[ind].getName()] = inputs[ind].getValue();
        }
		  return values;
		};
		that.getInputs = function() {
			var ind, inp = Inputs();
		  for(ind=0; ind<inputs.length; ind++)
		  	inp.push(inputs[ind].get());
		  return inp;
		};
		that.getInput = function(name) {
			var i; 
			for(i=0; i<inputs.length; i++) {
				if(inputs[i].getName() === name)
				return inputs[i]; 
		  }
			return null;
		};
		that.deleteDivClass = function(name) {
			var div;
			for(var i=0; i<inputs.length; i++) {
				div = inputs[i].getWrapDiv();
				Div(div).deleteClass(name);
			}
			return this;
		};
		return that;   
	};

	var Trolley = function(obj) {
		var that, trolley = {};
		trolley.money = obj.am;
		trolley.money_currency = obj.curr;
		trolley.products = obj.codP;
		that = {};
		that.get = function() { return trolley; };
		return that;
	};
		
	var AjaxRequest = function(answerCallBack) {
		var request, that = {};
		request = new XMLHttpRequest();
		request.onreadystatechange = function() {
		if(request.readyState < 4)
			return;
		if(request.status !== 200) 
		  throw new Error('AJAX - Server answered: ' + request.status + ' ' + request.statusText);
			answerCallBack();
		};
		that.get = function() { return request; };
		that.post = function(targetUrl, data) {
			request.open("POST", targetUrl, true);
		  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			request.send(data);
		};
		that.getRequest = function(targetUrl){
			request.open("GET", targetUrl, true);
      //request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			request.send();
		};
		return that;
	};

  var UserInterface = function() {
  	var that = {};
    
		that.drawHeader = function(page, mode) {
    	var viewPortDiv, modalDiv;
			var active='blu';
			var inactive='grigia';
			var crea = invita = gestisci = 'inactive';
      var title = '';
			var c_var = i_var = d_var = '';
			switch(page){
				case 'create':
					crea='active';
					c_var='-pink';
          title = 'Crea Split';
					break;
				case 'invitation':
					invita='active';
					i_var='-pink';
          title = 'Invita';
					break;
				case 'digest':
					gestisci='active';
					d_var='-pink';
          title = 'Gestisci';
					break;
			}
			// Bootstrap 3 Implementation
			viewPortDiv = jQuery('#squeezol_view');
			viewPortDiv.addClass("container-fluid");
      modalDiv = '<div class="col-xs-10 col-xs-offset-1 container-dashboard">'+
                   '<div class="row" style="margin-top: -30px;">'+
                     '<div class="col-sm-4 col-sm-offset-4 col-xs-10 col-xs-offset-1" style="padding-top: 10px; padding-left:50px;">'+
                       '<img class="squeezol-btn-header img-responsive" src="' + img_url + 'squeezol.png"></img>'+
                       '<p class="sq-content-title" style="display:inline; margin-left:20px;">'+title+'</p>'+
                     '</div>'+
									 '</div>'+
								   '<div id="squeezol_view">'+
										 '<div class="row row-separator row-separata">'+
                      '<div class="col-md-3 col-md-offset-1">'+
                        '<p class="text-center"><img class="img-responsive" style="display:inline;" src="'+img_url+'squeezol_icon-creasplit'+c_var+'.png"/></p>'+
                      '</div>'+
                      '<div class="col-md-4">'+
                        '<p class="text-center"><img class="img-responsive" style="display:inline;" src="'+img_url+'squeezol_icon-invita'+i_var+'.png"/></p>'+
                      '</div>'+
                      '<div class="col-md-3">'+
                        '<p class="text-center"><img class="img-responsive" style="display:inline;" src="'+img_url+'squeezol_icon-riassunto'+d_var+'.png"/></p>'+
                      '</div>'+
                     '</div>'+
										 '<div class="row">'+
											'<div class="col-xs-3 col-xs-offset-1 separator-'+crea+'"></div>'+
											'<div class="col-xs-4 separator-'+invita+'"></div>'+
											'<div class="col-xs-3 separator-'+gestisci+'"></div>'+
										 '</div>'+
									 '</div>'+
								 '</div>';
			viewPortDiv.append(modalDiv);
		  viewPortDiv.removeAttr('id', null);
			return;
    },
	  that.drawSeparator = function(text){
			var viewPortDiv = jQuery('#squeezol_view');
			var separator;
			separator = '<div class="row row-separata">'+
	  								'<div class="col-md-4 col-md-offset-1 col-xs-12"><h4 class="sq-content-body">'+text+'</h4></div>'+
										'<div class="col-xs-10 col-xs-offset-1 separator"></div>'+
									'</div>';
      viewPortDiv.append(separator);
      return;
	  },
    that.drawSeparatorCollapse = function(text){
      var viewPortDiv = jQuery('#squeezol_view');
      var panel = '<div class="row row-separata" id="squeezol-accordion-container">'+
                    '<div class="col-md-6 col-md-offset-1 col-xs-12">'+
                      '<div class="panel-group">'+
                        '<div class="panel panel-default">'+
                          '<div class="panel-heading alert alert-info">'+
                            '<a data-toggle="collapse" data-parent="#accordion" href="#collapseOne">'+
                              '<p class="sq-label">'+text+'</p>'+
                            '</a>'+
                          '</div>'+
                          '<div id="collapseOne" class="panel-collapse collapse out">'+
                            '<div class="panel-body" id="squeezol-accordion">'+
                            '</div>'+
                          '</div>'+
                        '</div>'+
                      '</div>'+
                    '</div>'+
                  '</div>';
      viewPortDiv.append(panel);
      return;
	  },
    that.drawWizard = function(position, clickElem){
      var div='<div class="row wizard">'+
                '<div class="col-xs-4">'+
								  '<img class="img-responsive" src="' + img_url + 'btn2.jpg" alt="Think">'+
                  '<h4 class="text-center">1.Crea una colletta</h4>'+
                '</div>'+
                '<div class="col-xs-4">'+
								  '<img class="img-responsive" src="' + img_url + 'busta2.jpg" alt="Find">'+
                  '<h4 class="text-center">2.Invita i tuoi amici</h4>'+
                '</div>'+
                '<div class="col-xs-4">'+
                  '<img class="img-responsive" src="' + img_url + 'salva2.jpg" alt="Fun">'+
                  '<h4 class="text-center">3. Versa la tua quota</h4>'+
							  '</div>'+
							'</div>'+
              '<div class="row">'+
                '<h4 class="text-center">  Dividi l\'acquisto con i tuoi amici senza anticipare... &egrave; gratis!'+
              '</div>';
      jQuery('#squeezol_btn').popover({ title:'Come funziona',
		       		                          html:true ,
																        content: div,
																        delay: { show: 100, hide:100 },
																        placement: position,
															       	  trigger: 'manual' });
      
      jQuery(clickElem).on('click', function(){
				jQuery('#squeezol_btn').popover('toggle');
			});
			jQuery('#squeezol_btn').on('shown.bs.popover', function(){
				jQuery('.popover').attr('style','display: block; top: -20px; left: 127px;max-width:800px;');
			});
			jQuery('#squeezol_btn').on('hidden.bs.popover', function(){
				jQuery('.popover').attr('style','');
        jQuery(this).css("display", "");
			});

	  },
		that.getText = function(text){
			var textElem='<a target="_blank" ><h4>'+text+'</h4></a>';
			return textElem;
		},
		that.renderAlreadyInvited = function(emailDiv, fbDiv, alreadyInvited, group) {
			this.drawSeparator('Amici Invitati');
			var container = document.createElement('div');
			container.id = 'containerCronologia';
      container.className = 'row';
			for (j=0; j<alreadyInvited.length; j++){
				var invObj=alreadyInvited[j];
				var contribution = parseFloat(group.amount/(alreadyInvited.length+1)).toFixed(2);
				var tmp = document.createElement('div');
				
				if(invObj.avatar_url){
					tmp.innerHTML='<div class="col-md-1 col-md-offset-1 hidden-xs"><img class="thumbnail imgAvatar" src="'+invObj.avatar_url+'" alt="User Avatar"></img></div>';
				}
				else {
					tmp.innerHTML='<div class="col-md-1 col-md-offset-1 hidden-xs"><img class="imgAvatar thumbnail" src="' + img_url + 'default.jpg" alt="User Avatar"></img> </div>';
				}
				if(invObj.fb_id) {
					tmp.className = 'row fbElement';
					tmp.innerHTML += '<div class="col-xs-10 col-xs-offset-1 col-md-4 col-md-offset-0 has-success input-group"> <input type="hidden" class="fbEntry form-control" value="'+invObj.fb_id+'"disabled></input>'+
											 		   '<input value="'+invObj.name+'" class="form-control" type="text" name="email"  disabled>'+
                             '<span class="input-group-addon glyph-ok">@</span>'+
													 '</div>';
				}
				else {
					tmp.className = 'row emailElement';
					tmp.innerHTML+= '<div class="col-xs-10 col-xs-offset-1 col-md-4 col-md-offset-0 form-group has-success input-group">'+
                            
														'<input value="'+invObj.email+'" class="form-control" type="email" name="email" placeholder="email address" disabled>'+
                            '<span class="input-group-addon glyph-ok">@</span>'+
													'</div>';
				}
				jQuery(container).append(tmp);
			}
			jQuery('#squeezol_view').append(container);
	  },
		that.loadState = function(button){
			jQuery(button).button('loading');
		},
		that.loadStop = function(button){
			jQuery(button).button('reset');
		},
		that.progressBar = function(totalPaid, totAmount){
			var perc = parseInt(totalPaid*100/totAmount);
			var bar;
			bar = '<div class="col-md-6 col-xs-6 col-xs-offset-1">'+
							'<h4> Quote raccolte </h4>'+
							'<div class="progress">'+
								'<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="'+perc+'" aria-valuemin="0" aria-valuemax="100" style="width: '+perc+'%;">'+perc+'%</div>'+
							'</div>'+
						'</div>';
			jQuery('#squeezolPayBox').append(bar);
		},
		that.sqModal = function(content, btn, id){
			var modalContent, modalBody, btn
      var modal=false;
      modalContent = jQuery("#"+id);
      if (modalContent.length>0) {
        modal = true;
      }
      if (modal==false){
			  modalContent = jQuery('<div />');
			  modalContent.addClass('modal fade bs-example-modal-lg');
			  modalContent.attr('id',id);
			  modalContent.attr('tabindex', '-1');
			  modalContent.attr('role', 'dialog');
			  modalContent.attr('aria-labelledby', 'SqueezolModal');
			  modalContent.attr('aria-hidden', 'true');
      }
			if (id == 'emailModal') {
        if (modal == false){
				  modalBody = jQuery('<div />');
				  modalBody.addClass('modal-body');
				  modalBody.append(content);
				  modalContent.append(jQuery('<div />').addClass('modal-dialog')
														  .append(jQuery('<div />').addClass('modal-content')
																.append('<div class="modal-header">'+
																					'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
																					'<h4 class="modal-title">Invita</h4>'+
																				'</div>', content, jQuery('<div />').addClass('modal-footer').append(btn))));
        }
        modalContent.on('show.bs.modal', function(){
          btn = jQuery("#squeezolEmail_");          
          jQuery("#squeezolEmail").empty();
          jQuery("#squeezolEmail").append(btn);
        });
			}
			else if (id == 'facebookModal'){				
				modalContent.append(content);
        modalContent.on('hide.bs.modal', function(e){
          location.reload(true);
        });
			}	
			jQuery(modalContent).modal('show');
			return;
		},
		that.modalClose = function(id){
			var currentModal = jQuery('#'+id);
			currentModal.modal('hide');
		},
    that.textWithHelper = function(labelName, helpText){
      var txt = document.createElement('p')
      var $question = jQuery('<div />');
      txt.className = 'sq-label';
      txt.appendChild(document.createTextNode(labelName));
      $question.attr('data-toggle', 'popover');
      $question.attr('data-placement', 'top');
      $question.attr('title', helpText);
      $question.addClass('icon glyph-info-sign');
      $question.append('<p>i</p>');
      jQuery(txt).append($question);
      return txt;
    },
    that.iconPopover = function(){
      jQuery('.icon').popover();
		  jQuery('.icon').on('mouseover', function(){
        jQuery(this).popover('show')
      });
      jQuery('.icon').on('mouseout', function(){
        jQuery(this).popover('hide');
      });
      jQuery('.icon').on('hidden.bs.popover', function(){
        jQuery(this).css("display", "");
			});

    };
    return that;
  };

	var GroupCreation = function() {
		var that = {},
				buttonHandler,
		    inputs = Inputs(),
		    combo = ComboBox(),
		    checkBoxes = CheckBoxes(),
		    promo = Input(),
		    button = Button(),
		    dp1={}, dp2={};
		that.addButtonHandler = function(handler) { buttonHandler = handler; };
		that.initDatePickers = function(d1, d2) {
			var datePicker = DatePicker();

			var i18n_ita = { previousMonth : 'Mese precedente',
                       nextMonth     : 'Mese successivo',
                       months        : ['Gennaio','February','March','April','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
                       weekdays      : ['Domenica','LunedÃ¬','MartedÃ¬','MercoledÃ¬','GiovedÃ¬','VenerdÃ¬','Sabato'],
                       weekdaysShort : ['Dom','Lun','Mar','Merc','Gio','Ven','Sab']
                     }

			datePicker.regCallBack( function() {
		    dp1.dp = new Pikaday({ field: document.getElementById('datepicker1'),
                               i18n: i18n_ita,
                               format: 'DD-MM-YY',
                               setDefaultDate: true,  
                               defaultDate: document.getElementById('datepicker1').value,
                               onSelect:  function(date) {
                                 document.getElementById('datepicker1').value = date.getDate() + '-' + (parseInt(date.getMonth())+1).toString() + '-' + date.getFullYear();
                               }
                            });
			  dp2.dp = new Pikaday({ field: document.getElementById('datepicker2'),
                               i18n: i18n_ita,
                               format: 'DD-MM-YY',
                               setDefaultDate: true,
                               defaultDate: document.getElementById('datepicker2').value,
                               onSelect: function(date) {
                                 document.getElementById('datepicker2').value = date.getDate() + '-' + (parseInt(date.getMonth())+1).toString() + '-' + date.getFullYear();
                               }
                            });
      });
			datePicker.load(js_url + 'pikaday.js');
		};
		that.draw = function(id) {
			var viewPortDiv, headDiv, icoDiv, tmpDiv, date1, date2, input, checkBox,
          wrapper, accordion, tempAcc;
      var opt = [];
			var tempRowDiv, spanCurr;
			var tmp, startDate, d1, d2;
			var day = 24 * 60 * 60 * 1000;
			var ui = UserInterface();
      var placeholder = { 'name': 'Regalo di compleanno, viaggio, cena...',
                          'description': 'Descrivi cosa intendi fare con la somma raccolta'}
      var helpText = { 'name': 'Dai un titolo allo Split. Per esempio: regalo per Marco, week end in Montagna ecc.',
                       'description': 'Il posto giusto dove inserire qualche dettaglio che invogli i tuoi amici a partecipare',
                       'max_acceptance_date': 'Scegli la data entro la quale gli invitati dovranno confermare la propria partecipazione',
                       'max_payment_date': 'Scegli la data entro la quale i partecipanti possono effettuare i pagamenti. La durata massima consentita Ã¨ 25 giorni',
                       'occurrence': 'Fai sapere ai partecipanti per quale occasione si effettua l\'acquisto',
                       'promo_code': 'Inserisci un codice promozionale valido: ti consente di avere uno sconto sulla colletta',
                       'alert_email': 'Disattiva le notifiche email sulle azioni degli invitati',
                       'hide_contribution': 'Nasconde ai soli partecipanti la quota versata da ognuno. Resta visibile a tutti il totale raccolto',
                       'hide_invitation': 'Nasconde l\' identitÃ  dei partecipanti tra di loro.',
                       'isOpen': 'Split aperto a chiunque abbia un invito, senza PIN e a donazione libera' }
			wrapper_row = { wrapper: 'div', className: 'row'};
      wrapper_row_pad = { wrapper: 'div', className: 'row pad-it'};
			wrapper_left = { wrapper: 'div', className : 'col-md-6 col-md-offset-1 col-xs-12' }
			wrapper_left_small = { wrapper: 'div', className : 'col-md-4 col-md-offset-1 col-xs-12' }
      wrapper_right = { wrapper: 'div', className: 'col-md-4 col-xs-12'};
      wrapper_btn = { wrapper: 'div', className: 'col-md-4 col-xs-10 col-xs-offset-1'}
			wrapper_push_right = { wrapper: 'div', className: 'col-md-3 col-md-offset-9 col-xs-12'};
			//UI
      ui.drawHeader('create', 'modal');
			viewPortDiv = Div();
		  viewPortDiv.get(id);
			// Temp Div
		  tmp=document.createElement('div');
			tempRowDiv = Div(tmp);
			tempRowDiv.addClass('row');
			// Nome Colletta
			input = TextInput();
		  input.create('name');
      input.get().setAttribute('placeholder', placeholder['name']);
			inputs.push(input);
			// Data Accettazione
			tempRowDiv.append(input.labelize('Nome Split', helpText['name']).wrap(wrapper_left));

			date1 = DateInput();
			d1 = new Date(new Date().getTime() + 7*day);
			//startDate = ('0' + d.getDate()).slice(-2) + "-" + ('0' + d.getMonth()).slice(-2) + "-" + d.getFullYear();
		  date1.create('max_acceptance_date', d1);
			date1.get().id = 'datepicker1';
			date1.addPicker(dp1);
			inputs.push(date1);
      spanCurr = document.createElement('span');
			spanCurr.className = 'input-group-addon';
			spanCurr.innerHTML = '#';
			tempRowDiv.append(date1.labelizeWithSpan('Scadenza Invito', spanCurr, helpText['max_acceptance_date']).wrap(wrapper_right));
			// Append first row
			viewPortDiv.append(tempRowDiv.get());
			// Temp Div
			tmp=document.createElement('div');
			tempRowDiv = Div(tmp);
			tempRowDiv.addClass('row');
			// Descrizione Colletta
		  input = TextArea();
		  input.create('description');
      input.get().setAttribute('placeholder', placeholder['description']);
		  inputs.push(input);
		  tempRowDiv.append(input.labelize('Descrizione', helpText['description']).wrap(wrapper_left));
			// Data Pagamenti
		  date2 = DateInput();
			d2 = new Date(new Date().getTime() + 25*day);
			//startDate = ('0' + d.getDate()).slice(-2) + "-" + ('0' + d.getMonth()).slice(-2) + "-" + d.getFullYear();
		  date2.create('max_payment_date', d2);
		  date2.get().id = 'datepicker2';
		  date2.addPicker(dp2);
      
		  inputs.push(date2);
	    spanCurr = document.createElement('span');
			spanCurr.className = 'input-group-addon';
			spanCurr.innerHTML = '#';
			tempRowDiv.append(date2.labelizeWithSpan('Scadenza Pagamenti', spanCurr, helpText['max_payment_date']).wrap(wrapper_right));
		  this.initDatePickers(d1, d2);
		  opt.push({value: 'R', text: 'Acquisto regalo'});
		  opt.push({value: 'V', text: 'Viaggio di gruppo'}); 
		  opt.push({value: 'C', text: 'Evento/Concerto'}); 
		  opt.push({value: 'G', text: 'Grigliata'}); 
		  opt.push({value: 'N', text: 'Regalo Nozze'}); 
		  opt.push({value: 'A', text: 'Altro ...'}); 
		  combo = ComboBox();
		  combo.create(opt);
      viewPortDiv.append(tempRowDiv.get())

      tmp=document.createElement('div');
			tempRowDiv = Div(tmp);
			tempRowDiv.addClass('row');
		  tempRowDiv.append(combo.labelize('Occorrenza', helpText['occurrence']).wrap(wrapper_left));
			viewPortDiv.append(tempRowDiv.get())
			ui.drawSeparator('');
			ui.drawSeparatorCollapse('Opzioni aggiuntive');
      //squeezol-accordion
      tempAcc = document.getElementById('squeezol-accordion');
			accordion = Div(tempAcc);
      
		  checkBox = CheckBox();
		  checkBox.create({name: 'alert_email', value: 'Email notifications'}); 
		  checkBoxes.push(checkBox);
		  accordion.append(checkBox.labelize('Disattiva notifiche', helpText['alert_email']).wrap(wrapper_row_pad));
						
		  checkBox = CheckBox();
		  checkBox.create({name: 'hide_contribution', value: 'Hide Contribution'}); 
		  checkBoxes.push(checkBox);
			accordion.append(checkBox.labelize('Nascondi le quote versate', helpText['hide_contribution']).wrap(wrapper_row_pad));

			checkBox = CheckBox();
		  checkBox.create({name: 'hide_invitation', value: 'Hide Invitation'});
		  checkBoxes.push(checkBox);
		  accordion.append(checkBox.labelize('Nascondi partecipanti', helpText['hide_invitation']).wrap(wrapper_row_pad));

			checkBox = CheckBox();
		  checkBox.create({name: 'isOpen', value: 'Open funding', checked: 'true'}); 
			checkBoxes.push(checkBox);
		  accordion.append(checkBox.labelize('Colletta a donazione libera', helpText['isOpen']).wrap(wrapper_row_pad));
			
			promo = TextInput();
		  promo.create('promo_code');
		  accordion.append(promo.labelize('Codice Promozionale', helpText['promo_code']).wrap(wrapper_row_pad));
						
			
		  button.create('Prosegui', 'big', 'squeezol_button');
			button.addClass('btn')
		  button.regHandler('click', buttonHandler);
			button = Div(button.wrap(wrapper_btn));
			tmp = document.getElementById('squeezol-accordion-container');
      tempRowDiv = Div(tmp);
		  tempRowDiv.append(button.wrap(wrapper_row));
		  ui.iconPopover();
      return this; 
		};     
		that.getInputs = function() { 
			var obj = {};
		  obj.inputs = inputs;
		  obj.occurrence = combo; 
		  obj.checkBoxes = checkBoxes;
		  obj.promo = promo;
		  return obj;
		};
		return that;
	};
	
	var CreationPostAJAX = function(targetUrl, firstUrl, secondUrl) {
		var ajaxRequest, answerCallBack,
				makeData, that, inputs, trolley;
		var that = {};
		makeData = function() {
			var prop, temp = {};
			temp.inputs = inputs.inputs.getValues();
      temp.inputs['max_acceptance_date'] = document.getElementById('datepicker1').value;
      temp.inputs['max_payment_date'] = document.getElementById('datepicker2').value;
		  temp.checkBoxes = inputs.checkBoxes.getValues();
			temp.trolley = trolley;    
			temp.occurrence = inputs.occurrence.getValue();
			temp.promo = inputs.promo.getValue();
			temp.firstUrl = firstUrl || '';
			temp.secondUrl = secondUrl || '';
			return SqObj(SqObj(temp).collapse()).toFormUrlEnc();        
		};
		answerCallBack = function() {
			var answer, ajaxAnswer;
			var ui = UserInterface();
			ui.loadStop(document.getElementById('squeezol_button'));
			answer = JSON.parse(ajaxRequest.get().responseText);
			ajaxAnswer = AjaxAnswer(answer, inputs);
		  ajaxAnswer.check();
		};
		that.send = function() {
			var ui = UserInterface();
			ui.loadState(document.getElementById('squeezol_button'));
			ajaxRequest = AjaxRequest(answerCallBack);
			ajaxRequest.post(targetUrl, makeData());

		}; 
		that.addData = function(data) { 
			inputs = data[0];
			trolley = data[1];
		};
		return that;
	};

	// Gestisce la ripsosta
	var AjaxAnswer = function(answer, inputs) {
		var that = {};
		that.redirect = function(targetUrl) { location.href = targetUrl; };
		that.check = function() {
			var prop, wrapDiv, message, inp, errors, i, div, pNode, l;
			inp = inputs.inputs;
			if(answer.status === 'ok') { 
				this.redirect(answer.url);
		  }
		  else if(answer.status='error'){
		    inp.deleteDivClass('has-error');
				errors = [].slice.call(document.getElementsByClassName('alert-danger'));
				for(i=0; i<errors.length;i++){
					div = errors[i];
					pNode = div.parentNode;
					pNode.removeChild(div);
				}
		  	// Gestisce messaggio errore
		    if('genericerror' in answer) {
		    	for(prop in answer.genericerror) {
						wrapDiv = inp.getInput(prop).getWrapDiv();
						error = document.createElement('p');
						error.className = 'alert alert-danger';
						error.innerHTML = 'Questo campo &egrave; obbligatorio';
						Div(wrapDiv).addClass('has-error');
						jQuery(wrapDiv).after(error);
		      }
		    }
        else if('non_field_errors' in answer) {
          wrapDiv = inp.getInput('max_payment_date').getWrapDiv();
          error = document.createElement('p');
				  error.className = 'alert alert-danger';
					error.innerHTML = answer.non_field_errors;
					Div(wrapDiv).addClass('has-error');
					jQuery(wrapDiv).after(error);
        }
        else {
          for (prop in answer){
            if (prop != "status"){
              wrapDiv = inp.getInput(prop).getWrapDiv();
						  error = document.createElement('p');
						  error.className = 'alert alert-danger';
						  error.innerHTML = answer[prop];
						  Div(wrapDiv).addClass('has-error'); 
						  jQuery(wrapDiv).after(error);
            }
          }
        }
		  }
			else if(answer.status == 'anauth_request'){
      	window.location.replace(answer.redirect_url);
      }
		};
		return that;
  };
		
  var InvitationGetAJAX = function(group_id, targetUrl){
  	var ajaxRequest, answerCallback, makeData;
    var btnArray = [];
    var that = {};
    makeData = function() {
    var temp = {};
    temp.group_id=group_id;
    	return SqObj(temp).toFormUrlEnc();
    };
    answerCallBack = function() {
    	var answer, ajaxAnswer, request, grId;
      answer = JSON.parse(ajaxRequest.get().responseText);
      ajaxAnswer = InvitationAnswer(answer);
      grId = ajaxAnswer.renderGET(targetUrl);
    };

    that.send = function() {
    	ajaxRequest = AjaxRequest(answerCallBack);
      ajaxRequest.getRequest(targetUrl+'?'+makeData());     
    };
    return that;
  };
		
  var InvitationPostAJAX = function(groupId, participantId, data, invitationUrl) {
  	var ajaxRequest, answerCallback, makeData;
    var that = {};
    makeData = function() {
    	var temp = {};
      temp.group_id=groupId;
			temp.participant_id=participantId;
			temp.admin_contrib = '';
			temp.group_contrib = '';
			temp.mailArray='[]';
			temp.fbArray='[]';
			if (data.action=='email'){
				temp.mailArray = JSON.stringify(data.emailArray);
			}
			else if (data.action=='facebook'){
				temp.fbArray = JSON.stringify(data.fbArray);
			}
			else if (data.action=='next'){
				temp.admin_contrib = data.admin_contrib;
				temp.group_contrib = data.fundraising;
		  }
			temp.action = data.action;
			return SqObj(temp).toFormUrlEnc();
    }
    answerCallBack = function() {
			var answer, ajaxAnswer, response;
			var invError = InvitationError();
			var ui = UserInterface();
			answer = JSON.parse(ajaxRequest.get().responseText);
			ui.loadStop(document.getElementById('squeezolSubmit_'));
			if (answer.status === 'ok'){
				if (answer.action == 'next'){
					window.location.replace(answer.redirect_url);
				}
				else {
					invError.appendSuccessInfo();
					invError.notifyValidEmail();
					ui.modalClose('emailModal');
				}
			}
			else {
				invError.handleError(answer);
			}
    };
    that.send = function() {
    	ajaxRequest = AjaxRequest(answerCallBack);
			ajaxRequest.post(invitationUrl, makeData());
    };
    return that;
  };
		
	var DigestGetAJAX = function(group_id, targetUrl){
		var ajaxRequest, answerCallback, makeData;
		var that = {};
		makeData = function() {
			var temp = {};
			temp.group_id=group_id;
			return SqObj(temp).toFormUrlEnc();
		};
		answerCallBack = function() {
			var answer, ajaxAnswer, request, grId;
			answer = JSON.parse(ajaxRequest.get().responseText);
			ajaxAnswer = DigestAnswer(answer);
			ajaxAnswer.addButtonHandler(function(e){
			var event= e || window.event;
			var target = event.target || event.srcElement || event.originalTarget;
			request = DigestPostAJAX(grId, target, targetUrl);
			request.send(target);
		});
		grId = ajaxAnswer.renderGET();
		};
	  that.send = function() {
		  ajaxRequest = AjaxRequest(answerCallBack);
		  ajaxRequest.getRequest(targetUrl+'?'+makeData());
	  };
	  return that;
	};

  var DigestPostAJAX = function(groupId, targetBtn, digestUrl) {
  	var ajaxRequest, answerCallback, makeData, buttonHandler, target;
    var that = {};
    makeData = function() {
      var temp = {};
			var quotaTmp= {};
			var p;
			p = document.getElementById('squeezol_single_amount');
			if (p){
				quotaTmp = p
			}
			else {
				quotaTmp.value = 0.00;
			}
      temp.group_id=groupId;
      temp.participant_id=targetBtn.getAttribute('data-participant');
      temp.action=targetBtn.getAttribute('data-action');
		  temp.single_amount=quotaTmp.value;
      return SqObj(temp).toFormUrlEnc();
    }
    answerCallBack = function() {
    	var answer, ajaxAnswer, response;
			var ui = UserInterface();
			ui.loadStop(target);
      answer = JSON.parse(ajaxRequest.get().responseText);
      ajaxAnswer = DigestAnswer(answer);
      ajaxAnswer.renderPOST(digestUrl);
		};
    that.send = function(targetBtn) {
			var ui = UserInterface();
			target = targetBtn
			ui.loadState(target);
    	ajaxRequest = AjaxRequest(answerCallBack);
      ajaxRequest.post(digestUrl, makeData());
		};
    return that;
  };

  var InvitationObj = function() {
		var that = {};
		that.computeSingleContribution = function(targetAmount) {
			var emailCount = document.getElementsByClassName('emailElement').length+1;
			var fbCount = document.getElementsByClassName('fbElement').length;
			var friendCount = fbCount+emailCount;
				return parseFloat(targetAmount/friendCount).toFixed(2);
		},
		that.updateContribution = function(contrib, targetAmount) {
			var rest = 0.00;
			var tot = 0.00;
			var totAdmin;
			var adminContrib=document.getElementById('squeezol_admin_contrib');
			var friendList = document.getElementsByClassName('emailElement');
			var fbList = document.getElementsByClassName('fbElement');
			tot = parseFloat(contrib*(fbList.length+friendList.length+1));
			if (tot != targetAmount){
				rest = parseFloat(targetAmount - tot).toFixed(2);
				totAdmin= parseFloat(contrib)+parseFloat(rest);
				adminContrib.value = totAdmin;
			}
			else{
				adminContrib.value = contrib;
			}
			adminContrib.disabled = true;
			return;
		},
		that.setToZero = function(){
			var contrib=document.getElementById('squeezol_admin_contrib');
			contrib.disabled = false;
		},
		that.createButton = function(text, size, btnId, btnCl) {
			var renderBtn = Button();
			renderBtn.create(text, btnId, size);
			renderBtn.addClass(btnCl);
			return renderBtn;
		},
		that.buildPostData = function() {
			var email, emailContrib, emailAvatar;       
			var emailArray = fbArray = []
			var data = {};
			emailArray = this.buildDataByClassName('emailElement', 'mail__Invitation', 'squeezolPrice', 'email');
			fbArray = this.buildDataByClassName('fbElement', 'fb__Invitation', 'squeezolPrice', 'facebook');
			data.emailArray = emailArray;
			data.fbArray = fbArray;
			data.action = 'email';
			return data
		},
		that.buildNextData = function() {
			var temp={};
			temp.admin_contrib = document.getElementById('squeezol_admin_contrib').value;
			temp.fundraising = document.getElementById('contributionType').value
			temp.action = 'next';
			return temp
		},
		that.buildDataByClassName = function(wrapperClass, IdClass, contribClass, action) {
			var elementList = document.getElementsByClassName(wrapperClass);
			var objId, objAvatar, objContrib = elemObj = {};
			var list = [];
			for (var i=0; i<elementList.length; i++){
				objId = elementList[i].getElementsByClassName(IdClass)[0];
				objAvatar = elementList[i].getElementsByClassName('imgAvatar')[0]; 
				elemObj = {};
				if (objId){
					switch(action){
						case 'email':
							elemObj.email = objId.value;
							elemObj.avatar_url = objAvatar.getAttribute('src');
							break;
						case 'facebook':
							elemObj.avatarUrl = objAvatar.getAttribute('src');
							elemObj.fbName = objId.value;
							elemObj.fb_id = objId.getAttribute('fb_id');
							break;
					}
					list.push(elemObj);
				}	
			}
			return list;
		}
		return that;
	};
			
	// Error Class
	var InvitationError = function(){
		var that={};
		var fbInputList = document.getElementsByClassName('fbEntry');
		var emailInputList = document.getElementsByClassName('mail__Invitation');

		that.handleError = function(answer){
		//Handle Server Reponse:
		  var errorType = answer.status;
			if(errorType === 'badMail') {
				this.setWrongEmails(answer.emailArray);
				this.appendErrorInfo("Una o piÃ¹ email inserite sono errate, correggi per proseguire.", document.getElementById('squeezolEmail'));
			}
			else if (errorType === 'duplicates') {
				this.setWrongEmails(answer.emailArray);
				this.appendErrorInfo('Una o piÃ¹ email inserite sono ripetute, correggi per proseguire.', document.getElementById('squeezolEmail'));
			}
			else if (errorType === 'Contribution') {
				this.appendErrorInfo('Inserisci un importo valido', document.getElementById('squeezolEmail'));
			}
			else if (errorType == 'error') {
				this.appendErrorInfo(answer.message, document.getElementsByClassName('squeezol_quota')[0]);
			}
			else {
				console.log('Bad error code');
			}
		},
		// From server for SMTP connection refused
		that.setWrongEmails = function(email_list) {
			var i, j, tempObj, tmpSpan;
			var emailInputList = document.getElementsByClassName('mail__Invitation');
			for (j=0; j<emailInputList.length; j++){
				for (i=0; i<email_list.length; i++ ) {
					if (emailInputList[j].value == email_list[i] ) {
						tempObj = DomElement({'el': emailInputList[j].parentNode})
						tempObj.addClass('has-error');
						//tmpSpan = document.createElement('span');
						//tmpSpan.className = 'input-group-addon glyphicon glyphicon-remove';
					}
					else {
						tempObj = DomElement({'el': emailInputList[j].parentNode})
						tempObj.addClass('has-success');
						//tmpSpan = document.createElement('span');
						//tmpSpan.className = 'input-group-addon glyphicon glyphicon-ok form-control-feedback';
					}
          // TODO: Decommentare, non riesco ad appendere tmpSpan
					//jQuery(tmpSpan).appendTo(tempObj);
				}
			}
		},
		// From server
		that.setRepeatedEntries = function (doubles_obj) {
			var i, j, tempObj;
			var email_list = doubles_obj['email'];
			var fb_list = doubles_obj['fb'];
			for (j=0; j<emailInputList.length; j++){
				for (i=0; i<email_list.length; i++ ) {
					if (emailInputList[j].value == email_list[i].email ) {
						tempObj = DomElement({'el': emailInputList[j].parentNode})
						tempObj.addClass('has-error');
					}
				}
			}
			for (j=0; j<fbInputList.length; j++){  
				for (i=0; i<fb_list.length; i++ ) {
					if (fbInputList.value == fb_list[i].fb_id ) {
						tempObj = DomElement({'el': fbInputList[j].parentNode})
						tempObj.addClass('has-error');
					}
				}
			}
		},
		// Client validator email
		that.validateEmail =  function() {
			var invalid_email = [];
			var repeated_email_list = [];
			var errors = {};
			var valid = true;
			var i, j, current_email, atpos, dotpos;
			errors.repetitions = [];
			errors.invalid = [];
			emailInputList = document.getElementsByClassName('mail__Invitation');
			if (emailInputList.length == 0){
				return false;
			}
			for (i=0; i<emailInputList.length; i++) {
				current_email = emailInputList[i].value;
				if (current_email == '' || current_email == null) {
					valid=false;
					invalid_email.push(current_email);
				}
				else {
					var atpos=current_email.indexOf("@");
					var dotpos=current_email.lastIndexOf(".");
					if (atpos<1 || dotpos<atpos+2 || dotpos+2>=current_email.length) {
						valid=false;
						invalid_email.push(current_email);
					}
				}
				if (i > 0) {
					for (j=0; j<i; j++) {
						if (emailInputList[j].value == current_email && current_email !== "") {
							repeated_email_list.push(current_email);
							valid = false;
						}
					}
				}
			}
			if (valid == false){
				errors.repetitions = repeated_email_list;
				errors.invalid = invalid_email;
				this.setInvalidOrRepeatedEmail(errors);
			}
			return valid;
		},
		that.setInvalidOrRepeatedEmail = function(error){
			var item_list, inp;
			if (error.repetitions.length > 0) {
				item_list=error.repetitions;
				this.addErrorClass(item_list)
				this.appendErrorInfo('Una o piÃ¹ email inserite sono ripetute, correggi per proseguire.', document.getElementById('squeezolEmail'));
			}
			if (error.invalid.length > 0){
				item_list=error.invalid;
				this.addErrorClass(item_list)
				this.appendErrorInfo("Una o piÃ¹ email inserite sono errate, correggi per proseguire.", document.getElementById('squeezolEmail'));
			}
		},
		that.addErrorClass = function(emailList){
			var i, j, tempObj;
			for (j=0; j<emailInputList.length; j++ ) {
				for (i=0; i<emailList.length; i++ ) {
					if (emailInputList[j].value == emailList[i] ) {
						tempObj = DomElement({'el': emailInputList[j].parentNode})
						tempObj.addClass('has-error');
					}
				}
			}
		},
		that.removeErrorInfo = function () {
			var tempObj, alertDiv, tmpDiv;
			var errorClassList = document.getElementsByClassName('has-error');
			alertDiv = document.getElementById('alertErrorDiv');
			if (alertDiv){
				tempDiv = DomElement({'el': alertDiv});
				tempDiv.remove();
			}
			for (var i=0; i<errorClassList.length;i++){
				tempObj = DomElement({'el': errorClassList[i]});
				tempObj.deleteClass('has-error');
			}
			return;
		},
		that.appendErrorInfo = function(text, domItem){
			var div = document.createElement('div');
			div.className = 'row';
			div.id = 'alertErrorDiv';
			div.innerHTML = '<div class="alert alert-danger col-xs-7 col-xs-offset-1">'+
											  '<p>'+
													'<strong>OOPS!</strong>'+
													text+
											  '</p>'+
											'</div>';
			domItem.appendChild(div);
			return;
		},
		that.appendSuccessInfo = function(){
			var div = document.createElement('div');
			var domItem = document.getElementById('squeezolEmail')
			div.className = 'row';
			div.id = 'alertErrorDiv';
			div.innerHTML = '<div class="alert alert-success col-xs-7 col-xs-offset-1">'+
											  '<p>'+
													'<strong>OK! </strong>'+
													'Email inviate con successo'+
											  '</p>'+
											'</div>';
			domItem.appendChild(div);
			return;
		},
		that.notifyValidEmail = function(){
			var sentEmail = document.getElementsByClassName('mail__Invitation');
			var container = document.getElementById('containerCronologia')
			var alreadyInvited = container.getElementsByClassName('emailElement');
			var currSent, inv, div;
      var found = false;
			for (var i=0; i<sentEmail.length; i++){
        div = document.createElement('div');
			  div.className = 'row emailElement';
				currSent = sentEmail[i];
				for (var j=0; j<alreadyInvited.length; j++) {
					inv = alreadyInvited[j].getElementsByTagName('input')[0];
          if (inv.value == currSent.value) {
            found = true;
          }
        }  
		  	if (found==false) {
					div.innerHTML = '<div class="col-md-1 col-md-offset-1 hidden-xs">'+
                            '<img class="imgAvatar thumbnail" src="' + img_url + 'default.jpg" alt="User Avatar"></img>'+
                          '</div>'+
													'<div class="col-xs-10 col-xs-offset-1 col-md-4 col-md-offset-0 form-group has-success input-group">'+
													  '<input value="'+currSent.value+'" class="form-control" type="email" name="email" placeholder="email address" disabled>'+
														'<span class="input-group-addon glyph-ok">'+
                            '@<span/>'+
                            '</div>'+
													'</div>';
					container.appendChild(div);
				} 
			}
		},
		that.validateForm = function(){
			var valid = this.validateEmail();
			return valid;
		}
		return that;
	}
	var InvitationAnswer = function(answer) {
		var that = {};
		that.renderGET = function(invitationUrl) {
			var params, participantAdmin, group, alreadyInvited, socialProviders,
			grId, grAmount, gData, pAdminId;
			var btnText = ['Email', 'f | Facebook', 'Invia E-mail'],
					btnId = ['squeezolEmail_', 'squeezolFb_', 'squeezolSubmit_' ],
					btnSize = ['small', 'small', 'big'],
					btnClass = ['btn btn-lg sq-buttonEmail', 'btn btn-lg sq-buttonFb', 'squeezolButtonSuccess btn btn-lg'];
			var fbBtn, emailBtn, submitBtn, emailDiv, fbDiv, selectBox, nextBtn,
				  invitationBtn, removeBtn, containerDiv, submitDiv, nextDiv;
			var fbUid, friendList;
			var sqDiv, tmpObj, tmpDiv, emailModal;
      var copiaUrl, a_temp, a_link;
			var i, j, currBtn, ui;
			var wrapper_left = { wrapper: 'div', className : 'col-xs-2' };
			var wrapper_center = { wrapper: 'div', className : 'col-md-3 col-xs-10 col-xs-offset-1' };
			var wrapper_btn = { wrapper: 'div', className : 'col-xs-10 col-xs-offset-1 col-md-3 col-md-offset-1' };
			var wrapper_row = { wrapper: 'div', className : 'row' };
      var wrapper_remove = { wrapper: 'div', className: 'col-sm-5 col-sm-offset-0 col-xs-10 col-xs-offset-1'}
			if(answer.status === 'ok') {
				// Parsing Parametri
				params=JSON.parse(answer.params);
				grId = params.group_id;
				gData = params.google_friends;
				participantAdmin = answer.p_admin;
				pAdminId = participantAdmin.id;
				alreadyInvited = answer.invited;
				socialProviders = params.social_providers;
				group = answer.group;
				// RENDER
				ui = UserInterface()
				ui.drawHeader('invitation', 'modal');
				this.renderGroupData(answer.group, participantAdmin, params.admin_email, alreadyInvited);
        ui.iconPopover();
				SqDiv = document.getElementById('squeezol_view')
				emailDiv=document.createElement('div');
				fbDiv=document.createElement('div');
				emailDiv.className = 'mailInvitation modal-body';
				emailDiv.id = 'squeezolEmail'
				fbDiv.className = 'fbInvitation';
				fbDiv.id = 'squeezolFb'
				invitationBtn = InvitationObj();
				emailBtn = invitationBtn.createButton('@ Email', btnId[0], btnSize[0], 'btn btn-sm sq-buttonEmail');
				emailModal = invitationBtn.createButton('@ | Invia Email', 'emailModal_', 'big', 'btn btn-lg sq-buttonEmail');
				
				// SEND EMAIL handler:
				submitBtn = invitationBtn.createButton(btnText[2], btnId[2], btnSize[2], btnClass[2]);
				submitBtn.regHandler('click', function(e){
					var event= e || window.event;
					var target = event.target || event.srcElement || event.originalTarget;
					var invObj = InvitationObj();
					var invitations = InvitationPostAJAX(grId, pAdminId, invObj.buildPostData(), invitationUrl);
					var invError = InvitationError();
					invError.removeErrorInfo();
					ui.loadState(target);
					if (invError.validateForm() == true){
					  invitations.send()
					}
					else {
						ui.loadStop(target);
					}
				});
				
				// Append Submit Button to 
				submitDiv = document.createElement('div');
				submitDiv.className = 'row';
				submitDiv.appendChild(submitBtn.wrap({ wrapper: 'div', className : 'col-xs-10 col-xs-offset-1 col-md-3 col-md-offset-8'}));
				
				// ADD EMAIL handler:
				emailBtn.regHandler('click', function() {
				  var contribution = parseFloat(0.00);
				  var invObj=InvitationObj();
				  var newEmail=document.createElement('div');
				  var sBox = document.getElementById('contributionType');
				  var contribType = sBox.options[sBox.selectedIndex].value;

					removeBtn = Button()
					removeBtn.create('- Elimina', 'small', 'btnRemove');
					removeBtn.addClass('btn btn-xs btn-danger')
					removeBtn.regHandler('click', function(e){
				  	var event= e || window.event;
				  	var target = event.target || event.srcElement || event.originalTarget;
				  	var invObj = InvitationObj();
				  	document.getElementById('squeezolEmail').removeChild(target.parentNode.parentNode);
				  	if (contribType === 'D'){
							contribution = invObj.computeSingleContribution(group.amount);
							invitationBtn.updateContribution(contribution, group.amount);
						}
					});
					newEmail = document.createElement('div');
					newEmail.className = 'row emailElement';
					jQuery(newEmail).append('<div class="hidden-xs col-sm-2 col-md-2">'+
															      '<img style="display:inline;" class="imgAvatar thumbnail" src="' + img_url + 'default.jpg" alt="User Avatar"></img>'+
		  											      '</div>'+
														      '<div class="col-sm-5 col-sm-offset-0 col-xs-10 col-xs-offset-1">'+
													          '<input class="form-control mail__Invitation" placeholder="Aggiungi Email" type="email" name="email">'+
														      '</div>');
					newEmail.appendChild(removeBtn.wrap(wrapper_remove));
					emailDiv.appendChild(newEmail);
					if (contribType === 'D'){
						contribution = invObj.computeSingleContribution(group.amount);
						invitationBtn.updateContribution(contribution, group.amount);
					}
				});
				emailDiv.appendChild(emailBtn.get());
				emailModal.regHandler('click', function() {
					var ui = UserInterface();
					ui.sqModal(emailDiv, submitDiv, 'emailModal');
				});

				tmpObj = document.createElement('div');
				tmpObj.className = 'row row-separata';
				tmpObj.appendChild(emailModal.wrap(wrapper_btn));

				// FACEBOOK IFRAME handler:
        if (params.fb_url) {
				  fbBtn = invitationBtn.createButton(btnText[1], btnId[1], 'big', btnClass[1]);
					fbBtn.regHandler('click', function(){
						var iFrameModal;
						var ui=UserInterface();
						iFrameModal = document.getElementById('squeezolIframe');
						if(!iFrameModal){
							iFrameModal = document.createElement('div');
							iFrameModal.id = 'squeezolIframe';
							iFrameModal.className = 'row';
						}
						else {
							iFrameModal.innerHTML = '';
						}
 						var socIframe = '<button id="closeModal" type="button" class="close text-step-active" data-dismiss="modal" aria-hidden="true">'+
                              'CHIUDI &times;'+
                            '</button>'+
                            '<div class="col-xs-10 col-xs-offset-1">'+
														  '<iframe width="620px" height="350px" class="squeezol_iframe" src="'+params.fb_url+'" frameborder="0">'+
						                	  'NON &egrave; possibile invitare con Facebook da questo dispositivo'+
														  '</iframe>'+
														'</div>';
                            

					  iFrameModal.innerHTML=socIframe;
						ui.sqModal(iFrameModal,'', 'facebookModal')
					  return
					});
					tmpObj.appendChild(fbBtn.wrap(wrapper_center));
        }
				
        copiaUrl = document.createElement('div')
        copiaUrl.className = 'col-md-3 col-xs-10 col-xs-offset-1 pink-link';
        copiaUrl.setAttribute('data-placement', 'top');
        copiaUrl.setAttribute('title', 'Copia URL della colletta e incollalo dove preferisci');
        a_temp = document.createElement('a');
        a_temp.innerHTML = 'Copia url split';
        a_link=DomElement({'el': a_temp});
        a_link.id='clipBoardLink';
        a_link.regHandler('click', function(e) {
          var message = 'Copia negli appunti con CTLR+C. Poi clicca OK';
          if (answer.group.isOpen){
            window.prompt(message, params.link_url);
          }
          else {
            window.prompt(message, params.link_url+'?pin='+group.pin);
          }
        });
        copiaUrl.appendChild(a_link.get());
        tmpObj.appendChild(copiaUrl);
				SqDiv.appendChild(tmpObj);
				
				// NEXT Button handler
				nextBtn = invitationBtn.createButton('Prosegui', 'squeezol_next', 'big', btnClass[2]);
				nextBtn.regHandler('click', function(e){
					var event= e || window.event;
					var target = event.target || event.srcElement || event.originalTarget;
					var invObj = InvitationObj();
					var invitations = InvitationPostAJAX(grId, pAdminId, invObj.buildNextData(), invitationUrl);
					var invError = InvitationError();
					invError.removeErrorInfo();
					ui.loadState(target);
          invitations.send()
				});
				// Select Contribution Type handler:
				var box = DomElement({el: document.getElementById('contributionType')});
				box.regHandler('change', function(e){
				  var invObj = InvitationObj();
					var event= e || window.event;
					var target = event.target || event.srcElement || event.originalTarget;
					if (target.value === 'D'){
						contribution = invObj.computeSingleContribution(group.amount);
						invitationBtn.updateContribution(contribution, group.amount);
					}
					else if(target.value === 'S'){
					  invObj.setToZero();
					}
				});
				// Append to View Port .invitationContainer
				containerDiv = document.createElement('div');
				containerDiv.className = 'invitationContainer';
				
				// Append .fbInvitation and mailInvitation Div to .invitationContainer
				containerDiv.appendChild(fbDiv);
				SqDiv.appendChild(containerDiv);
					
				// Render Amici giÃ  invitati
				ui.renderAlreadyInvited(emailDiv, fbDiv, alreadyInvited, group);
				ui.drawSeparator('');
					
				// Append Next Div to .invitationContainer
				nextDiv = document.createElement('div');
				nextDiv.className = 'row';
				nextDiv.appendChild(nextBtn.wrap({ wrapper: 'div', className : 'col-xs-10 col-xs-offset-1 col-md-3 col-md-offset-8' }));
				SqDiv.appendChild(nextDiv);
			}
			else if(answer.status === 'anauth'){
			  // Gestisce messaggio errore
				window.location.replace(answer.redirect_url);
			}
			else if(answer.status === 'error'){
				// Gestisce messaggio errore
				console.log(answer);
				}
			else {
				console.log('Bad status code');
			}
			return grId
		},
		that.renderGroupData = function(group, participantAdmin, adminEmail, alreadyInvited) {
			var groupDigest, status, contrib, options;
			var disabled='';
      var isOpen='';
      var groupDigest2;
      var date1=new Date(group.max_acceptance_date);
      var date2=new Date(group.max_payment_date);
			var sqDiv = document.getElementById('squeezol_view');
      if (group.isOpen == false){
        isOpen = '<div class="row sq-pin">'+
                   '<p><strong>PIN:'+group.pin+'</strong></p>'+
                 '</div>';
      }
			if (group.fundraising == 'S'){
				contrib = parseFloat(group.amount/(alreadyInvited.length+1)).toFixed(2);
				options = '<option value="D">Equa</option>'+
								  '<option value="S" selected>Suggerita</option>';
			}
			else {
				contrib = participantAdmin.single_amount;
				options = '<option value="D" selected>Equa</option>'+
								  '<option value="S">Suggerita</option>';
        disabled = 'disabled';
			}
     
			groupDigest=document.createElement('div');
			groupDigest.id = "squeezol_btn_container";
			groupDigest.className = "row row-separata";
      groupDigest2=document.createElement('div');
      groupDigest2.className='row row-separata';
      groupDigest2.innerHTML = '<div class="col-xs-10 col-xs-offset-1 col-md-2 col-md-offset-1 col-left">'+
                                 '<p class="sq-content-title">'+ group.name +'<p>'+
                               '</div>'+
                               '<div class="col-xs-10 col-xs-offset-1 col-md-2 col-md-offset-0">'+
                                 '<p class="sq-content-body">Scadenza invito:</p>'+
                                 '<p class="sq-content-body">'+
                                   date1.getDate() + '.' + (parseInt(date1.getMonth())+1).toString() + '.' + date1.getFullYear()+
                                 '</p>'+
                               '</div>'+
                               '<div class=" col-xs-10 col-xs-offset-1 col-md-2 col-md-offset-0">'+
                                 '<p class="sq-content-body">Scadenza pagamento:</p>'+
                                 '<p class="sq-content-body">'+
                                   date2.getDate() + '.' + (parseInt(date2.getMonth())+1).toString() + '.' + date2.getFullYear()+
                                 '</p>'+
                               '</div>'+
                               '<div class="col-xs-10 col-xs-offset-1 col-md-3 col-md-offset-0">'+
                                 '<div class="row target-P">'+
                                   '<p> Obiettivo:</p>'+
                                   '<p><strong>'+group.amount + group.currency +'</p>'+
                                 '</div>'+
                                 isOpen+
                               '</div>';

			groupDigest.innerHTML= '<div class="col-xs-10 col-xs-offset-1 sq-withBorder">'+
                                '<div class="row">'+   
                                  '<div class="col-xs-1 col-left">'+
                                    '<div class="box-blu">'+
                                      '<p><strong>'+alreadyInvited.length+'</strong></p>'+
                                      '<p>invitati</p>'+
                                    '</div>'+
                                  '</div>'+
														      '<div class="col-xs-10 col-xs-offset-1 col-md-4 col-md-offset-0 form-group" style="margin: 10px 0px 0px 20px;">'+
														       	'<p class="sq-label">Tipo quota:'+
                                      '<div data-toggle="popover" data-placement="top" title="Suggerisci la '+ 
                                        'quota che verrÃ  visualizzata dagli invitati. Altrimenti la quota proposta '+
                                        'verrÃ  calcolata in base al numero di invitati"'+
                                        'class="icon glyph-info-sign">'+
                                        '<p>i</p>'+
                                      '</div>'+
                                    '</p>'+
															      '<select class="selectContrib" id="contributionType">'+options+'</select>'+
															      '<input value="'+adminEmail+'"type="hidden" name="email" disabled>'+
														      '</div>'+
														      '<div class="squeezol_quota col-xs-10 col-xs-offset-1 col-md-4 col-md-offset-0" style="margin: 10px 0px 0px 20px;">'+
															      '<p class="sq-label">Quota singola:'+
                                      '<div data-toggle="popover" data-placement="top" title="La quota Ã¨ un '+
                                        'suggerimento per gli invitati."'+
                                        'class="icon glyph-info-sign">'+
                                        '<p>i</p>'+
                                      '</div>'+
                                    '</p>'+
															      '<div class="input-group">'+
															        '<input id="squeezol_admin_contrib" value="'+contrib+'" name="email_contribution"'+
																	      'type="text" class="squeezolPrice form-control" '+disabled+'><span class="input-group-addon">'+group.currency+'</span>'
        														'</div>'+
                                  '</div>'+
                                '</div>'+
														  '</div>';
		  groupDigest2=Div(groupDigest2);
			sqDiv.appendChild(groupDigest2.get());
      groupDigest=Div(groupDigest);
			sqDiv.appendChild(groupDigest.get());
		};
		return that;
	};

	var DigestAnswer = function(answer) {
		var that = {},
		buttonHandler;
		that.addButtonHandler = function(handler) { buttonHandler = handler; };
		that.renderGET = function() {
			var params, isAdmin, invited, participants, partObj, groupStatus, saInput,
				  openPay, canFinish, targetAmount, renderBtn, singleAmountBtn, inviteBtn,
          renderDiv, participantId, invAmount;
			var part, totalPaid;
			var SqDiv=document.getElementById('squeezol_view');
			var sqBtnContainer;
			var i, j, k, p, spanCurr, quotaDiv, labelQuota;
			var status, ui, state, ghianda, avatar_url, alertDes, contribution_amount;
			var wrapper = {wrapper: 'div', className: 'col-md-4 col-md-offset-1 col-xs-10 col-xs-offset-1'};
			var wrapBtn = {wrapper: 'div', className: 'col-md-2 col-xs-10 col-xs-offset-1'};
      var helpText = { 'p_quota': 'Inserisci la quota che intendi versare' };

			if(answer.status === 'ok') {
				params=JSON.parse(answer.params);
				isAdmin=params.is_admin;
				canFinish=params.canFinish;
				canOpenPay=params.canOpenPay;
				openPay=params.openPay;
				participantId = params.participant_id;
				invited=answer.invited;
				participants=JSON.parse(answer.participants);
				targetAmount=answer.group.amount;
				groupStatus=answer.group.status;
				invAmount = parseFloat(targetAmount/(invited.length+1)).toFixed(2);
				// Render Group Data
        ui = UserInterface()
				ui.drawHeader('digest', 'modal');
				
				this.renderGroupData(answer.group, params, SqDiv, participants);
				ui.drawSeparator('Pagamenti');
				renderDiv=Div(document.createElement('div'));
				renderDiv.addClass('row');

				renderBtn = Button();
				singleAmountBtn = Button();
				saInput = TextInput()
				SqDiv = document.getElementById('squeezol_view');
				// Group completed with success
				if(groupStatus == 'CWS') {
					renderBtn.create('Colletta conclusa', 'big', 'SqueezolPay_');
					renderBtn.get().setAttribute('data-participant', participantId)
					renderBtn.get().disabled=true;
					renderBtn.get().className='squeezolButtonSuccess';
				}
				// Waiting for accesptance or payments
				else if (groupStatus == 'WAC' || groupStatus == 'WPA'){
					// Possibilita' di proporre un importo se si e' in fase di accettazione o il gruppo e' aperto e WPA
					if (params.p_status == 'A'){
						saInput.create('single-amount');
						saInput.get().value=params.p_single_amount;
						saInput.get().id='squeezol_single_amount';
						singleAmountBtn.create('Modifica quota', 'ui', 'SqueezolModifyAmount_');
						singleAmountBtn.get().setAttribute('data-participant', participantId);
						singleAmountBtn.get().setAttribute('data-action', 'SA');
						singleAmountBtn.get().className='btn btn-lg';
						singleAmountBtn.regHandler('click', buttonHandler);
						quotaDiv = Div(document.createElement('div'));
						quotaDiv.addClass('input-group');
						spanCurr = document.createElement('span');
						spanCurr.className = 'input-group-addon';
						spanCurr.innerHTML = answer.group.currency;
						quotaDiv.append(saInput.labelizeWithSpan('Quota personale', spanCurr, helpText['p_quota']).get());
						renderDiv.append(quotaDiv.wrap(wrapper));
						renderDiv.append(singleAmountBtn.wrap(wrapBtn));
            SqDiv.appendChild(renderDiv.get());
					}
          
          ui.iconPopover();
					// Se admin
					if(isAdmin==true) {
            
            // Se puo' aprire i pagamenti
						if(canOpenPay==true){
							renderBtn.create('Inizia i pagamenti!', 'ui', 'SqueezolStartPay_');
							renderBtn.get().setAttribute('data-participant', participantId);
							renderBtn.get().setAttribute('data-action', 'OP');
							renderBtn.get().className='btn btn-lg';
							renderBtn.regHandler('click', buttonHandler);
						}
						// Se puo' concludere la collette
						else if(canFinish==true) {
							renderBtn.create('Concludi la colletta', 'ui', 'SqueezolFinishPay_');
							renderBtn.get().setAttribute('data-participant', participantId);
							renderBtn.get().setAttribute('data-action', 'CG');
							renderBtn.get().className='squeezolButtonSuccess btn btn-lg';
							renderBtn.regHandler('click', buttonHandler);
							renderDiv.append(renderBtn.wrap(wrapper));
							SqDiv.appendChild(renderDiv.get());
							renderBtn = '';
							renderBtn = Button();
							renderDiv=Div(document.createElement('div'));
							renderBtn.create('Rimborsa', 'small', 'SqueezolRefund_');
							renderBtn.get().setAttribute('data-participant', participantId);
							renderBtn.get().setAttribute('data-action', 'RG');
							renderBtn.get().className='btn btn-sm btn-danger';
							renderBtn.regHandler('click', buttonHandler);
						}
						// Se i pagamenti sono aperti
						else if(openPay==true) {
							for(k=0; k<participants.length; k++){
								partObj=participants[k];
								if(partObj.id==participantId) {
									if (partObj.status==='P'){
										renderBtn.create('Pagato', 'ui', 'SqueezolPay_');
										renderBtn.get().setAttribute('data-participant', participantId)
										renderBtn.get().disabled=true;
										renderBtn.get().className='btn btn-success btn-lg';
									}
									else{
										renderBtn.create('Paga ora', 'big', 'SqueezolPay_');
										renderBtn.get().setAttribute('data-participant', participantId);
										renderBtn.get().setAttribute('data-action', 'P');
										renderBtn.get().className='btn btn-lg';
										renderBtn.regHandler('click', buttonHandler);
									}
								}
							}
						}
						else {
							//Attualmente non e' un Button
							renderBtn = document.createElement('div');
							renderBtn.innerHTML = '<div class="alert alert-warning col-xs-6"'+
																		  '<p>'+
																			  '<strong>Attenzione!</strong>'+
									                      'La fase di accettazione non si &egrave; ancora conclusa, vuoi aprire i pagamenti ai tuoi invitati?'+
																		  '</p>'+
																		'</div>';
							SqDiv.appendChild(renderBtn);
							renderBtn = Button();
							renderBtn.create('Inizia i pagamenti!', 'big', 'SqueezolStartPay_');
							renderBtn.get().setAttribute('data-participant', participantId);
							renderBtn.get().setAttribute('data-action', 'OP');
							renderBtn.get().className='squeezolButtonSuccess btn';
							renderBtn.regHandler('click', buttonHandler);
						}
					}
					else {
						if(openPay==true){ //se arriva qui e' gia' openPay=True in teoria
							for(k=0; k<participants.length; k++){
								partObj=participants[k];
								if(partObj.id==participantId) {
									if (partObj.status==='P'){
										renderBtn.create('Pagato', 'ui', 'SqueezolPay_');
										renderBtn.get().setAttribute('data-participant', participantId)
										renderBtn.get().disabled=true;
										renderBtn.get().className='btn btn-lg';
									}
									else{
										renderBtn.create('Paga ora', 'ui', 'SqueezolPay_');
										renderBtn.get().setAttribute('data-participant', participantId);
										renderBtn.get().setAttribute('data-action', 'P');
										renderBtn.get().className='btn btn-lg';
										renderBtn.regHandler('click', buttonHandler);
										if(openPay==false){
											renderBtn.get().disabled=true;
										}
									}
								} 
							}
					  }
					}
					// Render

					renderDiv=Div(document.createElement('div'));
					renderDiv.addClass('row row-separata');
					renderDiv.get().id='squeezolPayBox';
					renderDiv.append(renderBtn.wrap(wrapper));
          if (params.invitation_url && isAdmin && (answer.group.status == 'WPA' || answer.group.status == 'WAC')){
            inviteBtn = Button();
            inviteBtn.create('Invita', 'ui', 'SqueezolInvitation_');
            inviteBtn.get().className='btn btn-lg squeezolButtonSuccess';
            inviteBtn.regHandler('click', function(){
              window.location.replace(params.invitation_url);
            });
            renderDiv.append(inviteBtn.wrap(wrapBtn));
          }
          SqDiv.appendChild(renderDiv.get());
				}
				// Group deserted
				else if(answer.group.status == 'DES') {
					renderBtn.create('Colletta Chiusa', 'big', 'SqueezolDeserted_');
					renderBtn.get().setAttribute('data-participant', participantId)
					renderBtn.get().disabled=true;
					renderBtn.get().className='buttonWarning btn btn-lg';
					alertDes = document.createElement('div');
					alertDes.className = 'alert alert-warning'
					alertDes.innerHTML = '<p>'+
																 '<strong>Attenzione!</strong>'+
																 'La colletta &egrave; stata chiusa dall\'organizzatore o Ã¨ scaduto il termine di 20 giorni entro i quali effetuare il pagamento.'+
															 '</p>';
					SqDiv.appendChild(alertDes);
				}
				
				// Render Partecipanti
        if (answer.group.hide_invitation == false || isAdmin){
				  ui.drawSeparator('Partecipanti');
				  for (j=0; j<participants.length; j++){
				    part=document.createElement('div');
					  part.className = 'row part';
					  p=participants[j];
					  status=this.switchStatus(p.status);
            var img = new Image();
            if(p.avatar_url){
				      avatar_url = p.avatar_url;
            } else {
	            avatar_url = img_url + 'default.jpg';
            } 
					  if (p.status == 'P'){
						  state = 'active';
						  ghianda = 'blu';
					  }
					  else if (p.status == 'A'){
						  state = 'accepted';
						  ghianda = 'grigia';
					  } else if (p.status == 'R'){
              state = 'refused';
						  ghianda = 'grigia';
            }
            if (answer.group.hide_contribution == true || !isAdmin)
              contribution_amount = '-';
            else
              contribution_amount = p.single_amount + ' ' + answer.group.currency;
					  part.innerHTML= '<div class="col-md-1 col-md-offset-1 col-xs-4">'+
						                  '<img id="thumb'+j+'" class="imgAvatar thumbnail img-responsive" src="'+avatar_url+'" alt="User Avatar"></img>'+
													  '</div>'+
													  '<div class="col-md-4 col-xs-4 has-success">'+
														  '<p class="sq-content-body text-center">'+p.name+'</p>'+
													  '</div>'+
													  '<div class="col-md-2 col-xs-10">'+
														  '<h4 class="text-center">'+contribution_amount+'</h4>'+
													  '</div>'+
													  '<div class="col-md-2 col-xs-10">'+
														  '<h4 class="text-center text-step-'+state+'">'+status+'</h4>'+
													  '</div>'+
													  '<div class="col-md-1 hidden-xs">'+
														  '<img class="img-responsive" src="' + img_url + 'ghianda_step_'+ghianda+'.png">'+
													  '</div>';
						  SqDiv.appendChild(part);
            }
					}
				}
				else if(answer.status === 'anauth'){
					// Gestisce messaggio errore
					window.location.replace(answer.redirect_url);
				}
				else if(answer.status === 'error'){
					// Gestisce messaggio errore
					console.log(answer);
				}
				else {
					console.log('Bad status code');
				}
				return params.group_id;
		  };
			that.renderPOST = function(targetUrl) {
				switch (answer.response){
				  case 'OP':
						jQuery('#squeezol_view').children().first().remove();
						this.POSTcallback(answer, 'OPENPAY', targetUrl);
						break;
					case 'P':
            this.POSTcallback(answer, 'PAY', targetUrl);
						break;
					case 'CG':
						this.POSTcallback(answer, 'FINISH', targetUrl);
						break;
					case 'SA':
						this.notifyAmount(answer);
						break;
				};
				return;
			},
      that.notifyAmount = function(answer) {
        var oldDiv, inputDiv, p, message;
        inputDiv=document.getElementById('squeezol_single_amount');
				p=document.getElementById('squeezolNotifyAmount_');
				if (answer.status == 'ok'){
					message='Importo corretamente modificato'
				}
				else if(answer.status == 'error') {
					message=answer.error || answer.message;
				}
				if (p) {
				  p.innerHTML=''
					p.appendChild(document.createTextNode(message));
					if (answer.status == 'error'){
					  p.className = 'alert alert-danger';
				  }
					else {
					  p.className = 'alert alert-success';
				  }
				}
				else{
				  p = document.createElement('div');
					p.id='squeezolNotifyAmount_';
					p.appendChild(document.createTextNode(message));
					inputDiv.parentNode.parentNode.appendChild(p);
					if (answer.status == 'error'){
						p.className = 'alert alert-danger';
					}
					else {
						p.className = 'alert alert-success';
					}
				}
      },
			that.renderGroupData = function(group, params, parent, participants) {
				var groupDigest, status, sqDiv;
				var ui, p, admin_name, participant, testo, classe;
        var totalPaid=0.00;
        ui = UserInterface()
        sqDiv = document.getElementById('squeezol_view');
        groupDigest=document.createElement('div');
				groupDigest.id = "squeezol_btn_container";
				groupDigest.className = "squeezol_group_box row";
				status = this.switchGroupStatus(group.status);

        for (var i=0; i<participants.length; i++){
          p = participants[i];
          if (p.status == 'P'){
							totalPaid+=parseFloat(p.single_amount);
				  }
          if (p.id == params.pAdminId){
            if (p.name)
              admin_name = p.name;
            else
              admin_name = p.email;
          }
          if (p.id == params.participant_id){
            participant = p;
          }
        }

        if (group.fundraising == 'D'){
          testo = 'Quota che intendo versare';
        }
        else if (group.fundraising == 'S'){
          testo = 'Quota da versare';
        }
        else if (group.fundraising == 'F'){
          testo = 'Quota fissa';
        }
        if (participant.status == 'P'){
          classe = 'target-P';
          testo = 'Quota pagata';
        }
        else if(participant.status == 'A'){
          classe='box-blu-digest sq-content-body';
        }
        else
          classe='target-R';
        groupDigest.innerHTML= '<div class="col-xs-10 col-xs-offset-1 col-md-3 col-md-offset-1 col-left">'+
                                 '<p class="sq-content-title">'+ group.name +'<p>'+
                               '</div>'+
                               '<div class="col-xs-10 col-xs-offset-1 col-md-3 col-md-offset-0">'+
                                 '<p class="sq-content-body">Organizzatore:</p>'+  
                                 '<strong>'+admin_name+'</strong>'+
                               '</div>'+
                               '<div class="col-xs-10 col-xs-offset-1 col-md-3 col-md-offset-1">'+
                                 '<div class="row box-blu-digest sq-content-body" style="padding:5px;">'+
                                   '<p class="text-center"> Scelta:'+this.switchStatus(participant.status)+'</p>'+
                                 '</div>'+
                               '</div>';
				groupDigest=Div(groupDigest);
				sqDiv.appendChild(groupDigest.get());

        groupDigest=document.createElement('div');
				groupDigest.className = "row row-separata";
        groupDigest.innerHTML = '<div class="col-md-10 col-md-offset-1">'+
                                  '<div class="row withPaddedBorder">'+
                                    '<div class="col-md-4">'+
                                      '<h4>TERMINA FRA</h4>'+
                                      '<div class="col-md-4 no-pad">'+
                                        '<p class="sq-target-small">'+params.daysLeft+' G</p>'+
                                      '</div>'+
                                      '<div class="col-md-4 no-pad">'+
                                        '<p class="sq-target-small">'+params.hoursLeft+' H</p>'+
                                      '</div>'+
                                      '<div class="col-md-4 no-pad">'+
                                        '<p class="sq-target-small">'+params.minutesLeft+' M</p>'+
                                      '</div>'+
                                    '</div>'+
                                    '<div class="col-md-4">'+
                                      '<div class="progress-radial-container">'+
                                        '<div class="progress-radial progress-'+params.totalPerc+'">'+
                                          '<div class="overlay">'+totalPaid+' '+group.currency+
                                            '<div style="margin-top: 20px; ">'+
                                              '<p class="text-overlay">'+
                                                'di'+group.amount+' '+group.currency+
                                              '</p>'+
                                            '</div>'+
                                          '</div>'+
                                        '</div>'+
                                      '</div>'+
                                    '</div>'+
                                    '<div class="col-md-4 '+classe+'">'+
                                      '<p class="text-center" style="font-family: DejavuSansCondensed-Bold;">'+
                                          participant.single_amount+' '+group.currency+
                                      '</p>'+
                                      '<p class="text-center">'+
                                        testo+
                                      '</p>'
                                    '</div>'+
                                  '</div>'+
                                '</div>';
        groupDigest=Div(groupDigest);
				sqDiv.appendChild(groupDigest.get());

			},
			that.POSTcallback = function(answer, action, targetUrl){
				var oldBtn, parentDiv, payBox, payBoxP;
				var renderBtn = Button();
				var participantId, form;
				if (action == 'OPENPAY'){
					oldBtn = document.getElementById('SqueezolStartPay_');
					participantId = oldBtn.getAttribute('data-participant');
					parentDiv = oldBtn.parentNode;
					parentDiv.removeChild(oldBtn);
					renderBtn.create('Paga ora', 'big', 'SqueezolPay_');
					renderBtn.get().setAttribute('data-action', 'P');
					renderBtn.regHandler('click', function(e){
			      var event= e || window.event;
			      var target = event.target || event.srcElement || event.originalTarget;
			      request = DigestPostAJAX(answer.group_id, target, targetUrl);
			      request.send(target);
				  });
				}
				else if (action == 'FINISH'){
					oldBtn = document.getElementById('SqueezolFinishPay_');
					payBox = document.getElementById('squeezolPayBox');
					participantId = oldBtn.getAttribute('data-participant');
					parentDiv = oldBtn.parentNode;
					parentDiv.removeChild(oldBtn);
					renderBtn.create('Pagato', 'ui', 'SqueezolPay_');
					renderBtn.get().disabled=true;
					payBoxP = payBox.parentNode;
					payBoxP.removeChild(payBox);
				}
        else if(action == 'PAY'){
          if (answer.status == 'ok'){
            form = document.createElement('form');
					  form.action='https://'+answer.squeezol_site+answer.redirect_url;
					  form.method='POST';
					  form.innerHTML='<input type="hidden" name="group_id" value="' + answer.group_id + '">'+
					                 '<input type="hidden" name="participant_id" value="' + answer.participant_id + '">'
					  document.body.appendChild(form);
					  form.submit();
          } else if(answer.status == 'error'){
              this.notifyAmount(answer);
          }
          return;
        }
				renderBtn.get().setAttribute('data-participant', participantId);
				renderBtn.get().className='btn btn-lg';
				parentDiv.appendChild(renderBtn.get());
			},
			that.switchStatus = function(status){
				var ret_st;
				switch(status){
					case 'A':
						ret_st='Accettato';
						break;
					case 'R':
						ret_st='Rifiutato';
						break;
					case 'P':
						ret_st='Pagato';
						break;
					}
					return ret_st;
			};
			that.switchGroupStatus = function(status) {
			  var gr_status;
					switch(status){
					case 'WAC':
						gr_status='In attesa di accettazione';
						break;
					case 'CWS':
						gr_status='Colletta Completata';
						break;
					case 'DES':
						gr_status='Abbandonato';
						break;
					case 'WPA':
						gr_status='In attesa di pagamenti';
						break;
					}
					return gr_status;
			};
			return that;
		};

    // API Call
    window.SqueezolApi = {
			createSqButton: function(targetUrl, size) {
				var tmpBtn, btn, div, txt;
				var ui = UserInterface();
				tmpBtn=document.createElement('div');
				tmpBtn.innerHTML = '<img src="' + img_url + 'pay_button2.png"></img>';
				btn = Div(tmpBtn);
				btn.addClass('squeezol_button_'+size)
				btn.regHandler('click', function() {
					location.href = targetUrl;
				});
				div = Div();
				div.get('squeezol_btn');
				div.append(btn.get());
				//txt = document.createElement('div');
				//txt.className = 'wizardOpen';
				//txt.innerHTML = ui.getText('Scopri cos\'&egrave; Squeezol');
				//div.append(txt);
				//ui.drawWizard('top', txt);
			},
			createGroup: function(amount, currency, codProducts, targetUrl, firstUrl, secondUrl) {
				var trolley, groupCr, ui;
				trolley = Trolley({am: amount, curr: currency, codP: codProducts});
				groupCr = GroupCreation();
				groupCr.addButtonHandler(function() {
					var ajaxObj, nodes, notifyDiv;
					ui = UserInterface();
					ajaxObj = CreationPostAJAX(targetUrl, firstUrl, secondUrl);
					ajaxObj.addData([groupCr.getInputs(), trolley.get()]);
					ajaxObj.send();
				});
				groupCr.draw('squeezol_view');
			},
			getDigestData: function(group_id, targetUrl) {
				var ajaxObj, nodes, notifyDiv;                   
				ajaxObj = DigestGetAJAX(group_id, targetUrl);
				ajaxObj.send();
			},
			getInvitationData: function(group_id, targetUrl) {
				var ajaxObj, nodes, notifyDiv;
				ajaxObj = InvitationGetAJAX(group_id, targetUrl);
				ajaxObj.send();
			}
		};		
		return;
}())
