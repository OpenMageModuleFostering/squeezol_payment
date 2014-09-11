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

// If the type is 'object', we might be dealing with an object or an array or
// null.

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

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

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
		        css.href = '/static/css/pikaday.css';
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
		    var obj, that, create,
		        openUrl;
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
		    that.labelize = function(labelName) {
		       var lab;
		       lab = document.createElement('label');
		       lab.appendChild(document.createTextNode(labelName));
		       lab.appendChild(obj.el);
		       return DomElement({el: lab});
		    }; 
		    that.getWrapDiv = function() {
		       return obj.el.parentNode.parentNode;
		    }
		    return that;
		};

		var TextInput = function(elem) {
		    var obj, that;
		    that = Input(obj = {el: elem});
		    that.create = function(name) {
		        var input;
		        input = document.createElement('input');
		        input.type = 'text';
		        input.name = name;
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
		        return date = temp.getDate() + '-' + (parseInt(temp.getMonth())+1).toString() +
		               '-' + temp.getFullYear(); 
		    };
		    that.create = function(name) {
		        var input;
		        input = document.createElement('input');
		        input.type = 'text';
		        input.name = name;
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
		        return this;
		    };
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
		        for(ind=0; ind<inputs.length; ind++) 
		            values[inputs[ind].getName()] = inputs[ind].getValue();
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
		
		var GiammAJAX = function(targetUrl, firstUrl, secondUrl) {
		    var ajaxRequest, answerCallBack,
		        makeData, that, inputs, trolley;
		    var that = {};
		    makeData = function() {
		        var prop, temp = {};
		        temp.inputs = inputs.inputs.getValues();
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
		        answer = JSON.parse(ajaxRequest.get().responseText);
		        ajaxAnswer = AjaxAnswer(answer, inputs);
		        ajaxAnswer.check();
		    };
		    that.send = function() {
		        ajaxRequest = AjaxRequest(answerCallBack);
		        ajaxRequest.post(targetUrl, makeData());     
		    }; 
		    that.addData = function(data) { 
		        inputs = data[0];
		        trolley = data[1];
		    };
		    return that;
		};

    var UserInterface = function() {
      var that = {};
    
      that.drawHeader = function() {
        var tmpDiv, icoDiv, viewPortDiv, wrapDiv;

        viewPortDiv = Div();
		    viewPortDiv.get('squeezol_view');
        tmpDiv=document.createElement('div');
        // TODO: REMOVE HARDCODING!!
        tmpDiv.innerHTML = '<img src="https://www.squeezol.com/static/img3/pay_button.png"></img>';
        headDiv = Div(tmpDiv);
        headDiv.addClass('squeezol_header');
        viewPortDiv.append(headDiv.get());
        wrapDiv = document.createElement('div');
        wrapDiv.className = 'menu-ico';
        // TODO: REMOVE HARDCODING!!
        wrapDiv.innerHTML = '<img src="https://test.squeezol.com/static/img3/menu-icon.png"></img>';
        icoDiv = Div(wrapDiv);
				viewPortDiv.append(icoDiv.get());
        icoDiv.regHandler('click', function(){
          var updateDiv=Div();
          updateDiv.get('squeezol_view');
          if (updateDiv.get().className === '' || updateDiv.get().className === undefined){
            viewPortDiv.get().className = 'slide-hide';
          }
          else {
            if (updateDiv.get().className == 'slide-hide'){
              updateDiv.get().className='slide-show';
            }
            else if (updateDiv.get().className == 'slide-show'){
              updateDiv.get().className='slide-hide';
            }
          }         
        });
      }
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
		    that.initDatePickers = function() {
		        var datePicker = DatePicker();

		        datePicker.regCallBack( function() {
		            dp1.dp = new Pikaday({ field: document.getElementById('datepicker1') });
		            dp2.dp = new Pikaday({ field: document.getElementById('datepicker2') });

		        } );    
		        datePicker.load('/static/js/squeezol/pikaday.js');
		    };
		    that.draw = function(id) {
		        var viewPortDiv, headDiv, icoDiv, tmpDiv, date1, date2, input, checkBox, wrapper;
            var opt = [];
            var ui = UserInterface();

		        wrapper = {wrapper: 'div', className: 'squeezol_wrapper'};
            date_wrapper = { wrapper: 'div', className: 'squeezol_wrapper squeezol_date'};
		        viewPortDiv = Div();
		        viewPortDiv.get(id);
						//UI
            ui.drawHeader();
		        input = TextInput();
		        input.create('name');
		        inputs.push(input);
		        viewPortDiv.append(input.labelize('Nome Colletta').wrap(wrapper));  
		        input = TextInput();
		        input.create('description');
		        inputs.push(input);
		        viewPortDiv.append(input.labelize('Descrizione').wrap(wrapper));
		        date1 = DateInput();
		        date1.create('max_acceptance_date');
		        date1.get().id = 'datepicker1';
		        date1.addPicker(dp1);
		        inputs.push(date1);
		        viewPortDiv.append(date1.labelize('Scadenza Accettazione').wrap(date_wrapper));
		        date2 = DateInput();
		        date2.create('max_payment_date');
		        date2.get().id = 'datepicker2';
		        date2.addPicker(dp2);
		        inputs.push(date2);
		        viewPortDiv.append(date2.labelize('Scadenza Pagamenti').wrap(date_wrapper));
		        this.initDatePickers();
		        opt.push({value: 'R', text: 'Acquisto regalo'});
		        opt.push({value: 'V', text: 'Viaggio di gruppo'}); 
		        opt.push({value: 'C', text: 'Evento/Concerto'}); 
		        opt.push({value: 'G', text: 'Grigliata'}); 
		        opt.push({value: 'N', text: 'Regalo Nozze'}); 
		        opt.push({value: 'A', text: 'Altro ...'}); 
		        combo = ComboBox();
		        combo.create(opt);
		        viewPortDiv.append(combo.labelize('Occorrenza').wrap(wrapper)); 
		        checkBox = CheckBox();
		        checkBox.create({name: 'alert_email', value: 'Email notifications'}); 
		        checkBoxes.push(checkBox);
		        viewPortDiv.append(checkBox.labelize('Disattiva notifiche').wrap(wrapper));
		        checkBox = CheckBox();
		        checkBox.create({name: 'hide_contribution', value: 'Hide Contribution'}); 
		        checkBoxes.push(checkBox);
		        viewPortDiv.append(checkBox.labelize('Nascondi importi versati').wrap(wrapper));
		        checkBox = CheckBox();
		        checkBox.create({name: 'hide_invitation', value: 'Hide Invitation'}); 
		        checkBoxes.push(checkBox);
		        viewPortDiv.append(checkBox.labelize('Nascondi partecipanti').wrap(wrapper));
		        checkBox = CheckBox();
		        checkBox.create({name: 'isOpen', value: 'Open funding'}); 
		        checkBoxes.push(checkBox);
		        viewPortDiv.append(checkBox.labelize('A donazione').wrap(wrapper));
		        promo = TextInput();
		        promo.create('promo_code');
		        viewPortDiv.append(promo.labelize('Codice Promozionale').wrap(date_wrapper));
		        button.create('Prosegui', 'small', 'squeezol_button');
		        button.regHandler('click', buttonHandler);
		        viewPortDiv.append(button.wrap(date_wrapper));
		        //viewPortDiv.append(button.get());
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

		var NotifyDiv = function() {
		    var that = {};
		    that.render = function(nodeId, message) {
		        var div, p, node;        
		        if((div = document.getElementById('_SqueezolNotifyDiv_')) != null) {
		            div = Div(div);    
		            div.remove();
		        }
		        node = document.getElementById(nodeId);
		        div = document.createElement('div');
		        div.id = '_SqueezolNotifyDiv_';
		        p = div.appendChild(document.createElement('p'));
		        p.appendChild(document.createTextNode(message));
		        node.appendChild(div);
		    };
		    return that;
		};
		
		// Gestisce la ripsosta
		var AjaxAnswer = function(answer, inputs) {
		    var that = {};
		    that.redirect = function(targetUrl) { location.href = targetUrl; };
		    that.check = function() {
		        var notifyDiv, prop, wrapDiv,
		            message, inp;
		        notifyDiv = NotifyDiv();
		        if(answer.status === 'ok') { 
		            notifyDiv.render('squeezol_view', 'Buccia bene :-)'); 
		            this.redirect(answer.url);
		        }
		        else if(answer.status='error'){
		            // Gestisce messaggio errore
		            inp = inputs.inputs;
		            inp.deleteDivClass('_SqueezolInputError_');
		            notifyDiv.render('squeezol_view', answer.error); 
		            if(answer.error === 'Form not valid') {
		                //Add 'error' class to wrong iputs' divs
		                for(prop in answer.genericerror) {
		                    if(answer.genericerror.hasOwnProperty(prop)) {
		                        if(typeof answer.genericerror[prop] !== 'function') {
		                            wrapDiv = inp.getInput(prop)
		                                         .getWrapDiv();
		                            Div(wrapDiv).addClass('_SqueezolInputError_');
		                        }
		                    }
		                }
		            }
		        }
            else if(answer.status='anauth'){
              alert(answer.redirect_url);
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
          grId = ajaxAnswer.renderGET();
        };

        that.send = function() {
          ajaxRequest = AjaxRequest(answerCallBack);
          ajaxRequest.getRequest(targetUrl+'?'+makeData());     
        };
        return that;
    };
		
    var InvitationPostAJAX = function(groupId, participantId, data) {
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
					var answer, ajaxAnswer, response, invError;
					answer = JSON.parse(ajaxRequest.get().responseText);
					if (answer.status === 'ok'){
						if (answer.action == 'next'){
							window.location.replace(answer.redirect_url);
						}
					}
					else {
						invError = InvitationError();
						invError.handleError(answer);
					}
        };
        that.send = function() {
            ajaxRequest = AjaxRequest(answerCallBack);
            ajaxRequest.post("/squeezol/invitation/", makeData());
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
					request = DigestPostAJAX(grId, target);
					request.send();
				});
				grId = ajaxAnswer.renderGET();
			};
			that.send = function() {
				ajaxRequest = AjaxRequest(answerCallBack);
				ajaxRequest.getRequest(targetUrl+'?'+makeData());
			};
			return that;
		};

    var DigestPostAJAX = function(groupId, targetBtn) {
        var ajaxRequest, answerCallback, makeData, buttonHandler;
        var that = {};
        makeData = function() {
          var temp = {};
          temp.group_id=groupId;
          temp.participant_id=targetBtn.getAttribute('data-participant');
          temp.action=targetBtn.getAttribute('data-action');
					temp.single_amount=document.getElementById('squeezol_single_amount').value;
          return SqObj(temp).toFormUrlEnc();
          }
          answerCallBack = function() {
            var answer, ajaxAnswer, response;
            answer = JSON.parse(ajaxRequest.get().responseText);
            ajaxAnswer = DigestAnswer(answer);
            ajaxAnswer.renderPOST();
          };
        that.send = function() {
            ajaxRequest = AjaxRequest(answerCallBack);
            ajaxRequest.post("/squeezol/digest/", makeData());
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
					console.log(elementList[i])
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
					this.appendErrorInfo("Una o più email inserite sono errate, correggi per proseguire.", document.getElementById('squeezolEmail'));
				}
				else if (errorType === 'duplicates') {
					this.setRepeatedEntries(answer.emailArray);
					this.appendErrorInfo('Una o più email inserite sono ripetute, correggi per proseguire.', document.getElementById('squeezolEmail'));
				}
				else if (errorType === 'Contribution') {
					this.appendErrorInfo('Insreisci un importo valido', document.getElementById('squeezolEmail'));
				}
				else if (errorType == 'error') {
					this.appendErrorInfo(answer.message, document.getElementById('squeezolSubtotal'));
				}
				else {
					console.log('Bad error code');
				}
			},
			// From server for SMTP conn refused
			that.setWrongEmails = function (email_list) {
				var i, j, tempObj,
				isWrong=false;
				for (j=0; j<emailInputList.length; j++){
					for (i=0; i<email_list.length; i++ ) {
						if (emailInputList[j].value == email_list[i] ) {
							tempObj = DomElement({'el': emailInputList[j].parentNode})
							tempObj.addClass('alertError__Class');
							isWrong=true;
						}
					}
				}
				/* TODO: check it out
				if(!isWrong) {
				$(this).attr('disabled', true);
				}*/
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
							tempObj.addClass('alertError__Class');
						}
					}
				}
				for (j=0; j<fbInputList.length; j++){  
					for (i=0; i<fb_list.length; i++ ) {
						if (fbInputList.value == fb_list[i].fb_id ) {
							tempObj = DomElement({'el': fbInputList[j].parentNode})
							tempObj.addClass('alertError__Class');
						}
					}
				}
			},
			// After FB UI dialog
			that.checkDuplicated = function(fbList) {
				var checkObj = {};
				var duplicatedUid = new Array();
				var fbId, item;
				var tempList = fbList
				var i,j;
          
				for (j=0; j<fbInputList.length; j++){
					fbId = fbInputList.value;
					for (i=0; i<fbList.length; i++){
						if (fbList[i].uid == fbId) {
							item = fbList[i].uid;
							tempList.splice(i,1);
							duplicatedUid.push(item);
						}
					}
				}
				checkObj.duplicatedUid = duplicatedUid;
				checkObj.validatedList = tempList;
				return checkObj;
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
							if (emailInputList[j].value == current_email) {
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
					this.appendErrorInfo('Una o più email inserite sono ripetute, correggi per proseguire.', document.getElementById('squeezolEmail'));
				}
				if (error.invalid.length > 0){
					item_list=error.invalid;
					this.addErrorClass(item_list)
					this.appendErrorInfo("Una o più email inserite sono errate, correggi per proseguire.", document.getElementById('squeezolEmail'));
				}
			},
			that.addErrorClass = function(emailList){
				var i, j, tempObj;
				for (j=0; j<emailInputList.length; j++ ) {
					for (i=0; i<emailList.length; i++ ) {
						if (emailInputList[j].value == emailList[i] ) {
							tempObj = DomElement({'el': emailInputList[j].parentNode})
							tempObj.addClass('alertError__Class');
						}
					}
				}
			},
			that.removeErrorInfo = function () {
				var tempObj;
				var errorDivList = document.getElementsByClassName('alertError__Append');
				var errorClassList = document.getElementsByClassName('alertError__Class');
				for (var i=0; i<errorDivList.length;i++){
					tempObj = DomElement({'el': errorDivList[i]})
					tempObj.remove();
				}
				for (var i=0; i<errorClassList.length;i++){
					tempObj = DomElement({'el': errorDivList[i]})
					tempObj.deleteClass('alertError__Class');
				}
				return;
			},
			that.appendErrorInfo = function(text, domItem){
				var div = document.createElement('div');
				div.className = 'alertError__Append';
				div.innerHTML = '<p>'+
				'<strong>OOPS! </strong>'+
				text+
				'</p>';
				domItem.appendChild(div);
				return;
			},
			that.validateForm = function(){
				var valid = this.validateEmail();
				return valid;
			}
			return that;
		}

		var InvitationAnswer = function(answer) {
			var that = {};

			that.renderGET = function() {
				var params, participantAdmin, group, alreadyInvited, socialProviders,
				grId, grAmount, gData, pAdminId;
				var btnText = ['Email', 'Facebook', 'Invita'],
				btnId = ['squeezolEmail_', 'squeezolFb_', 'squeezolSubmit_' ],
				btnSize = ['small', 'small', 'big'],
				btnClass = ['buttonWarning', 'buttonWarning', 'buttonSuccess'];
				var fbBtn, emailBtn, submitBtn, emailDiv, fbDiv, selectBox, nextBtn,
				invitationBtn, removeBtn, containerDiv, submitDiv;
				var fbUid, friendList;
				var SqDiv=document.getElementById('squeezol_view');
				var i, j, currBtn, ui;
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
					ui.drawHeader();
					this.renderGroupData(answer.group, participantAdmin, params.admin_email, SqDiv, alreadyInvited);

					emailDiv=document.createElement('div');
					fbDiv=document.createElement('div');
					emailDiv.className = 'mailInvitation';
					emailDiv.id = 'squeezolEmail'
					fbDiv.className = 'fbInvitation';
					fbDiv.id = 'squeezolFb'
					// Render Amici già invitati
					this.renderAlreadyInvited(emailDiv, fbDiv, alreadyInvited, group);
					// Email invitation handler:
					invitationBtn = InvitationObj();
					emailBtn = invitationBtn.createButton(btnText[0], btnId[0], btnSize[0], btnClass[0]);
					emailBtn.regHandler('click', function() {
						var contribution = parseFloat(0.00);
						var invObj=InvitationObj();
						var newEmail=document.createElement('div');
						var sBox = document.getElementById('contributionType');
						var contribType = sBox.options[sBox.selectedIndex].value;
						newEmail.className = 'emailElement';

						// TODO: Remove hardcoding
						newEmail.innerHTML = '<img class="imgAvatar" src="https://test.squeezol.com/static/images/default.jpg"'+
																			 'alt="User Avatar"></img>'+
																 '<input class="mail__Invitation" placeholder="Aggiungi Email"'+
																        'type="email" name="email">';
						removeBtn = Button()
						removeBtn.create('Elimina', 'small', '');
						removeBtn.regHandler('click', function(e){
							var event= e || window.event;
							var target = event.target || event.srcElement || event.originalTarget;
							var invObj = InvitationObj();
							document.getElementById('squeezolEmail').removeChild(target.parentNode);
							if (contribType === 'D'){
								contribution = invObj.computeSingleContribution(group.amount);
								invitationBtn.updateContribution(contribution, group.amount);
							}
						});
						newEmail.appendChild(removeBtn.get());
						emailDiv.appendChild(newEmail);
						if (contribType === 'D'){
							contribution = invObj.computeSingleContribution(group.amount);
							invitationBtn.updateContribution(contribution, group.amount);
						}
					});
					document.getElementById('squeezol_btn_container').appendChild(emailBtn.get());

					// Facebook invitation handler:
          if (params.fb_url){
					  fbBtn = invitationBtn.createButton(btnText[1], btnId[1], btnSize[1], btnClass[1]);
					  fbBtn.regHandler('click', function(){
						  var socIframe = '<iframe class="squeezol_iframe" src="'+params.fb_url+'">'+
  					  										'il tag iframe non è supportato su questo browser'+
						  									'</iframe>';
 					  	var iFrameModal = document.createElement('div');
					  	iFrameModal.className='squeezol_modal';
					  	iFrameModal.innerHTML=socIframe;
					  	document.body.appendChild(iFrameModal);
					  	return
					  });
          }
					document.getElementById('squeezol_btn_container').appendChild(fbBtn.get());
					// Submit handler:
					submitBtn = invitationBtn.createButton(btnText[2], btnId[2], btnSize[2], btnClass[2]);
					submitBtn.regHandler('click', function(){
						var invObj = InvitationObj();
						var invitations = InvitationPostAJAX(grId, pAdminId, invObj.buildPostData());
						var invError = InvitationError();
						invError.removeErrorInfo();
						if (invError.validateForm() == true){
							invitations.send()
						}
					});
					// Next Button
					nextBtn = invitationBtn.createButton('Prosegui', 'squeezol_next', 'big', btnClass[2]);
					nextBtn.regHandler('click', function(){
						var invObj = InvitationObj();
						var invitations = InvitationPostAJAX(grId, pAdminId, invObj.buildNextData());
						var invError = InvitationError();
						invError.removeErrorInfo();
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
					// Append to View Port
					containerDiv = document.createElement('div');
					containerDiv.className = 'invitationContainer';
					containerDiv.appendChild(emailDiv);
					containerDiv.appendChild(fbDiv);
					submitDiv = document.createElement('div');
					submitDiv.className = 'submitDiv'
					submitDiv.appendChild(submitBtn.get());
					submitDiv.appendChild(nextBtn.get());
					SqDiv.appendChild(containerDiv);
					SqDiv.appendChild(submitDiv);
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
			that.renderAlreadyInvited = function(emailDiv, fbDiv, alreadyInvited, group) {
				for (j=0; j<alreadyInvited.length; j++){
					var invObj=alreadyInvited[j];
					var inv=document.createElement('div');
					var contribution = parseFloat(group.amount/(alreadyInvited.length+1)).toFixed(2);
					
					if(invObj.avatar_url){
						inv.innerHTML='<img class="imgAvatar" src="'+invObj.avatar_url+'" alt="User Avatar"></img>';
					}
					else {
						// TODO: Remove Hardcoding
						inv.innerHTML='<img class="imgAvatar" src="https://test.squeezol.com/static/images/default.jpg"'+
						'alt="User Avatar"></img> ';
					}
					if(invObj.fb_id) {
						inv.className = 'fbElement';
						inv.innerHTML += '<input type="hidden" class="fbEntry" value="'+invObj.fb_id+'"disabled></input>'+
														 '<p class="fbName">'+invObj.name+'</p>';
					}
					else {
						inv.className = 'emailElement';
						inv.innerHTML+=  '<input value="'+invObj.email+'"'+
																     'type="email" name="email" placeholder="email address" disabled>';
					}
					if (inv.fb_id){
						fbDiv.appendChild(inv);
					}
					else {
						emailDiv.appendChild(inv);
					}
				}
			},
			that.renderGroupData = function(group, participantAdmin, adminEmail, sqDiv, alreadyInvited) {
				var groupDigest, status, contrib, options;
				var disabled='';
				if (group.fundraising == 'S'){
					contrib = parseFloat(group.amount/(alreadyInvited.length+1)).toFixed(2);
					options = '<option value="D">Equa</option>'+
									  '<option value="S" selected>Suggerisci</option>';
					
				}
				else {
					contrib = participantAdmin.single_contribution;
					options = '<option value="D" selected>Equa</option>'+
									  '<option value="S">Suggerisci</option>';
          disabled = 'disabled'
				}
				status = this.switchGroupStatus(group.status);
				groupDigest=document.createElement('div');
				groupDigest.id = "squeezol_btn_container";
				groupDigest.className = "squeezol_group_box";
				groupDigest.innerHTML=  '<p>Nome colletta: <strong> '+group.name+'</strong></p>'+
																'<p>Importo totale: <strong>'+group.amount+group.currency+'</strong></p>'+
																'<p>Stato: <strong> '+status+' </strong></p>'+
																'<p>Scadenza: <strong>'+group.max_payment_date+'</strong></p>'+
																'<p>Organizzatore:</p>'+
																'<p>'+
																	// TODO: REMOVE HARDCODING
																	'<img class="imgAvatar" src="https://test.squeezol.com/static/images/default.jpg" alt="User Avatar"></img>'+
																	'<strong>'+adminEmail+'</strong>'+
																'</p>'+
																'<input value="'+adminEmail+'"type="hidden" name="email" disabled>'+
																'<div class="squeezol_quota">'+
																	'<p>Divisione delle quote:</p>'+
																	'<select class="selectContrib" id="contributionType">'+options+'</select>'+
																	'<p>Quota:</p>'+
																	'<p>'+
																		'<input id="squeezol_admin_contrib" value="'+contrib+'" name="email_contribution"'+
																					 'type="text" class="squeezolPrice" '+disabled+'>'+group.currency+
  																'</p>'+
																'</div>';
				groupDigest=Div(groupDigest);
				sqDiv.appendChild(groupDigest.get());
			},
			that.switchGroupStatus = function(status) {
				var gr_status;
				switch(status){
				case 'WAC':
					gr_status='In attesa di accettazione';
					break;
				case 'CWS':
					gr_status='Concluso con successo';
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

		var DigestAnswer = function(answer) {
			var that = {},
			buttonHandler;
			that.addButtonHandler = function(handler) { buttonHandler = handler; };
			that.renderGET = function() {
				var params, isAdmin, invited, participants, partObj, groupStatus, saInput,
						openPay, canFinish, targetAmount, renderBtn, singleAmountBtn, renderDiv, participantId, invAmount;
				var part=document.createElement('div');
				var SqDiv=document.getElementById('squeezol_view');
				var sqBtnContainer;
				var i, j, k, p;
				var status, ui;
				var wrapper = {wrapper: 'div', className: 'squeezol_quota_mod'};
				var wrapBtn = {wrapper: 'div', className: 'squeezol_quota_btn'};
				if(answer.status === 'ok') {
					params=JSON.parse(answer.params);
					isAdmin=params.is_admin;
					canFinish=params.canFinish;
					canOpenPay=params.canOpenPay;
					openPay=params.openPay;
					participantId = params.participant_id;
					invited=answer.invited;
					participants=answer.participants;
					targetAmount=answer.group.amount;
					groupStatus=answer.group.status;
					invAmount = parseFloat(targetAmount/(invited.length+1)).toFixed(2);
					// Render Group Data
          ui = UserInterface()
					ui.drawHeader();
					this.renderGroupData(answer.group, params, SqDiv);
					renderDiv=Div(document.createElement('div'));
					renderDiv.addClass('submitDiv');
					renderBtn = Button();
					singleAmountBtn = Button();
					saInput = TextInput()
					// Group completed with success
					if(groupStatus == 'CWS') {
						renderBtn.create('Colletta conclusa', 'big', 'SqueezolPay_');
						renderBtn.get().setAttribute('data-participant', participantId)
						renderBtn.get().disabled=true;
						renderBtn.get().className='buttonSuccess';
					}
					// Waiting for accesptance or payments
					else if (groupStatus == 'WAC' || groupStatus == 'WPA'){
						// Possibilita' di proporre un importo se si e' in fase di accettazione o il gruppo e' aperto e WPA
						if (params.p_status == 'A'){
							saInput.create('single-amount');
							saInput.get().value=params.p_single_amount;
							saInput.get().id='squeezol_single_amount';
							singleAmountBtn.create('Modifica', 'small', 'SqueezolModifyAmount_');
							singleAmountBtn.get().setAttribute('data-participant', participantId);
							singleAmountBtn.get().setAttribute('data-action', 'SA');
							singleAmountBtn.get().className='buttonSuccess';
							singleAmountBtn.regHandler('click', buttonHandler);
							sqBtnContainer = document.getElementById('squeezol_btn_container');
							sqBtnContainer.appendChild(saInput.labelize('Quota Personale').wrap(wrapper));
							sqBtnContainer.appendChild(singleAmountBtn.wrap(wrapBtn));
						}
						// Se admin
						if(isAdmin==true) {
							// Se puo' aprire i pagamenti
							if(canOpenPay==true){
								renderBtn.create('Inizia i pagamenti!', 'big', 'SqueezolStartPay_');
								renderBtn.get().setAttribute('data-participant', participantId);
								renderBtn.get().setAttribute('data-action', 'OP');
								renderBtn.get().className='buttonSuccess';
								renderBtn.regHandler('click', buttonHandler);
							}
							// Se puo' concludere la collette
							else if(canFinish==true) {
								renderBtn.create('Concludi la colletta', 'big', 'SqueezolFinishPay_');
								renderBtn.get().setAttribute('data-participant', participantId);
								renderBtn.get().setAttribute('data-action', 'CG');
								renderBtn.get().className='buttonSuccess';
								renderBtn.regHandler('click', buttonHandler);
								renderDiv.append(renderBtn.get());
								SqDiv.appendChild(renderDiv.get());
								renderBtn = '';
								renderBtn = Button();
								renderDiv=Div(document.createElement('div'));
								renderBtn.create('Rimborsa i tuoi amici', 'big', 'SqueezolRefund_');
								renderBtn.get().setAttribute('data-participant', participantId);
								renderBtn.get().setAttribute('data-action', 'RG');
								renderBtn.get().className='buttonWarning';
								renderBtn.regHandler('click', buttonHandler);
							}
							// Se i pagamenti sono aperti
							else if(openPay==true) {
								for(k=0; k<participants.length; k++){
									partObj=participants[k];
									if(partObj.id==participantId) {
										if (partObj.status==='P'){
											renderBtn.create('Pagato', 'big', 'SqueezolPay_');
											renderBtn.get().setAttribute('data-participant', participantId)
											renderBtn.get().disabled=true;
											renderBtn.get().className='buttonSuccess';
										}
										else{
											renderBtn.create('Paga ora', 'big', 'SqueezolPay_');
											renderBtn.get().setAttribute('data-participant', participantId);
											renderBtn.get().setAttribute('data-action', 'P');
											renderBtn.get().className='buttonSuccess';
											renderBtn.regHandler('click', buttonHandler);
										}
									}
								}
							}
							else{
								//Attualmente non e' un Button
								renderBtn = document.createElement('div');
								renderBtn.innerHTML = '<p> <strong>Attenzione!</strong>'+
								"La fase di accettazione non si e' ancora conclusa, vuoi aprire i pagamenti ai tuoi invitati? </p>";
								SqDiv.appendChild(renderBtn);
								renderBtn = Button();
								renderBtn.create('Inizia i pagamenti!', 'big', 'SqueezolStartPay_');
								renderBtn.get().setAttribute('data-participant', participantId);
								renderBtn.get().setAttribute('data-action', 'OP');
								renderBtn.get().className='buttonSuccess';
								renderBtn.regHandler('click', buttonHandler);
							}
						}
						else {
							if(openPay==true){ //se arriva qui e' gia' openPay=True in teoria
								for(k=0; k<participants.length; k++){
									partObj=participants[k];
									if(partObj.id==participantId) {
										if (partObj.status==='P'){
											renderBtn.create('Pagato', 'big', 'SqueezolPay_');
											renderBtn.get().setAttribute('data-participant', participantId)
											renderBtn.get().disabled=true;
											renderBtn.get().className='buttonSuccess';
										}
										else{
											renderBtn.create('Paga ora', 'big', 'SqueezolPay_');
											renderBtn.get().setAttribute('data-participant', participantId);
											renderBtn.get().setAttribute('data-action', 'P');
											renderBtn.get().className='buttonSuccess';
											renderBtn.regHandler('click', buttonHandler);
											if(openPay==false){
												renderBtn.get().disabled=true;
											}
										}
									} 
								}
						  }
						}
					}
					// Group deserted
					else if(answer.group.status == 'DES') {
						renderBtn.create('Colletta Chiusa', 'big', 'SqueezolDeserted_');
						renderBtn.get().setAttribute('data-participant', participantId)
						renderBtn.get().disabled=true;
						renderBtn.get().className='buttonWarning';
						var alertDes = document.createElement('div');
						alertDes.className = 'alert'
						alertDes.innerHTML = '<p> <strong>Attenzione!</strong>'+
																			'La colletta è stata chiusa o è scaduto il termine di 20 giorni entro i quali effetuare il pagamento.</p>';
						SqDiv.appendChild(alertDes);
					}
					renderDiv.append(renderBtn.get());
					SqDiv.appendChild(renderDiv.get());
					// Render Group Admin
					for (j=0; j<participants.length; j++){
						p = participants[j];
						status=this.switchStatus(p.status);
						if (params.pAdminId == p.id){
							if (p.avatar_url && p.avatar_url !== 'null'){
								part.innerHTML='<img class="imgAvatar" src="'+p.avatar_url+'" alt="User Avatar"></img>'
							}
							part.innerHTML+='<h3 data-user="'+p.user+'">Organizzatore(user_id):'+p.id+'  , Importo da pagare: '+p.single_amount+' , Stato: '+status+'</h3>';
							participants.splice(j,1);
						}
					}
					for (j=0; j<participants.length; j++){
						p=participants[j];
						status=this.switchStatus(p.status);
						if (p.avatar_url && p.avatar_url !== 'null'){
							part.innerHTML='<img class="imgAvatar" src="'+p.avatar_url+'" alt="User Avatar"></img>'
						}
						part.innerHTML+=p.user+'<p>Importo stimato: '+p.single_amount+' , Stato: '+status+'</p>';
						SqDiv.appendChild(part);
					}

					for (j=0; j<invited.length; j++){
						var i=invited[j];
						var inv=document.createElement('div');
						if (i.avatar_url && i.avatar_url !== 'null'){
							inv.innerHTML='<img class="imgAvatar" src="'+i.avatar_url+'" alt="User Avatar"></img>'
						}
						inv.innerHTML+=i.email+'<p>Contributo stimato: '+invAmount+' , Stato: STO PENSANDO...</p>';
						SqDiv.appendChild(inv);
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
			that.renderPOST = function() {
				var oldDiv, inputDiv, p, message;
				switch (answer.response){
				  case 'OP':
						// Reload Group Data
						oldDiv=document.getElementById('squeezol_view');
						oldDiv.innerHTML='';
						window._SqueezoL_.getDigestData(answer.group_id, '/squeezol/digest_get/');
						break;
					case 'P':
						var form = document.createElement('form');
						// *********************************
						// TODO REMOVE HARDCODING!!!!! TODO*
						// *********************************
						form.action='https://test.squeezol.com'+answer.redirect_url;
						form.method='POST';
						form.innerHTML='<input type="hidden" name="group_id" value="' + answer.group_id + '">'+
						               '<input type="hidden" name="participant_id" value="' + answer.participant_id + '">'
						document.body.appendChild(form);
						form.submit();
						break;
					case 'CG':
						oldDiv=document.getElementById('squeezol_view');
						oldDiv.innerHTML='';
						window._SqueezoL_.getDigestData(answer.group_id, '/squeezol/digest_get/');
						break;
					case 'SA':
						inputDiv=document.getElementById('squeezol_single_amount');
						p=document.getElementById('_squeezolNotifyAmount');
						if (answer.status == 'ok'){
							message='Importo crretamente modificato'
						}
						else if(answer.status == 'error') {
							message=answer.error
						}
						if (p) {
							p.innerHTML=''
							p.appendChild(document.createTextNode(message));
						}
						else{
							p = document.createElement('p');
							p.id='_squeezolNotifyAmount';
							p.appendChild(document.createTextNode(message));
							inputDiv.parentNode.appendChild(p);
						}
						break;
				};
				return;
			};
			that.renderGroupData = function(group, params, parent) {
				var groupDigest, status, sqDiv;
        sqDiv = document.getElementById('squeezol_view');
        groupDigest=document.createElement('div');
				groupDigest.id = "squeezol_btn_container";
				groupDigest.className = "squeezol_group_box";
				status = this.switchGroupStatus(group.status);
        groupDigest.innerHTML='<p>Nome colletta: <strong> '+group.name+'</strong></p>'+
															'<p>Importo totale: <strong>'+group.amount+group.currency+'</strong></p>'+
															'<p>Stato: <strong> '+status+' </strong></p>'+
															'<p>Scadenza: <strong>'+group.max_payment_date+'</strong></p>'+
        											'<p>Organizzatore:</p>'+
															'<p>'+
															// TODO: REMOVE HARDCODING
															'<img class="imgAvatar" src="https://test.squeezol.com/static/images/default.jpg" alt="User Avatar"></img>'+
															'</p>';
				groupDigest=Div(groupDigest);
				sqDiv.appendChild(groupDigest.get());
			};

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
						gr_status='Chiuso con successo';
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
    window._SqueezoL_ = {
			createSqButton: function(targetUrl, size) {
				var tmpBtn, btn, div;
				tmpBtn=document.createElement('div');
				tmpBtn.innerHTML = '<img src="https://www.squeezol.com/static/img3/pay_button2.png"></img>';
				btn = Div(tmpBtn);
				btn.addClass('squeezol_button_'+size)
				btn.regHandler('click', function() {
					location.href = targetUrl;
				});
				div = Div();
				div.get('squeezol_btn');
				div.append(btn.get());
			},
			createGroup: function(amount, currency, codProducts, targetUrl, firstUrl, secondUrl) {
				var trolley, groupCr;
				console.log('Importo totale: '+amount);
				console.log('url digest: '+firstUrl);
				console.log('url invitations: '+secondUrl);
				trolley = Trolley({am: amount, curr: currency, codP: codProducts});
				console.log('JSON: ' + codProducts);
				console.log('JSON.parse(): ' + JSON.parse(codProducts));
				groupCr = GroupCreation();
				groupCr.addButtonHandler(function() {
					var ajaxObj, nodes, notifyDiv;                   
					ajaxObj = GiammAJAX(targetUrl, firstUrl, secondUrl);
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
