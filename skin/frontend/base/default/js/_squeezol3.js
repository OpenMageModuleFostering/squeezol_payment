/*
 * Squeezol js v 1.0 
 * Copyright 2013-2015 Squeezol SRL.
 * Licensed under OSL 
 */
+function($sqjQuery) {
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
		that.labelize = function(labelName, helpText, expl) {
			var lab, div;
      var ui = UserInterface();
      var p = document.createElement('p');
		  lab = document.createElement('label');
			div = document.createElement('div');
			lab.for = obj.el.id;
			div.className = 'sq-form-group';
		  lab.appendChild(ui.textWithHelper(labelName, helpText));
			div.appendChild(lab);
      if (expl != ''){
        p.innerHTML=expl;
        p.className='sq-exp';
        div.appendChild(p);
      }
		  div.appendChild(obj.el);
			return DomElement({el: div});
		},
		that.labelizeWithSpan = function(labelName, span, helpText, expl){
			var lab;
      var ui = UserInterface();
      var p = document.createElement('p');
			divForm = document.createElement('div');
			divInput = document.createElement('div');
		  lab = document.createElement('label');
			lab.for = obj.el.id
			divForm.className = 'sq-form-group'
			divInput.className = 'sq-input-group'
			divInput.appendChild(obj.el);
			divInput.appendChild(span);
		  lab.appendChild(ui.textWithHelper(labelName, helpText));
			divForm.appendChild(lab);
      if (expl != ''){
        p.innerHTML=expl;
        p.className='sq-exp';
        divForm.appendChild(p);
      }
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
			input.className = "sq-form-control";
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
			input.className = "sq-form-control";
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
			input.className = "sq-form-control";
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
			div.className = 'sq-checkbox sq-col-xs-12';
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
		trolley.amount = obj.am;
		trolley.currency = obj.curr;
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
    that.PopupCenter = function(url, title, w, h) {
      // Fixes dual-screen position Most browsers Firefox
      var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
      var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
      width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
      height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

      var left = ((width / 2) - (w / 2)) + dualScreenLeft;
      var top = ((height / 2) - (h / 2)) + dualScreenTop;
      var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

      // Puts focus on the newWindow
      if (window.focus) {
        newWindow.focus();
      }
      return newWindow;
    },
    that.switchCurrency = function(curr){
      if (curr == 'EUR'){
        return '€';
      }
      else if (curr == 'USD'){
        return '$';
      }
      else {
        return curr;
      }
    },
		that.drawHeader = function(page, mode) {
    	var viewPortDiv, modalDiv;
			var active='blu';
			var inactive='grigia';
			var crea = invita = gestisci = 'inactive';
      var title = howWorks = '';
      var hide_c = hide_i = hide_r = 'sq-hidden-xs';
			var c_var = i_var = d_var = '';
			switch(page){
				case 'create':
					crea='active';
					c_var='-pink';
          title = 'Crea Split';
          hide_c = '';
					howWorks = '<p class="sq-text-center">Queste informazioni saranno visibili nell\’invito per i tuoi amici, convincili a partecipare!</p>';
					break;
				case 'invitation':
					invita='active';
					i_var='-pink';
          title = 'Invita';
          hide_i = '';
					howWorks = '<p class="sq-text-center">Scegli come dividere le quote e ricorda che potrai modificare questa opzione in qualunque momento.</p>';
					break;
				case 'digest':
					gestisci='active';
					d_var='-pink';
          title = 'Gestisci';
          hide_r = '';
					howWorks = '';
					break;
			}
			viewPortDiv = $sqjQuery('#squeezol_view');
			viewPortDiv.addClass("container-fluid");
      modalDiv = '<div class="sq-col-xs-10 sq-col-xs-offset-1 sq-container-dashboard">'+
								   '<div id="squeezol_view">'+
                     '<div class="sq-row sq-header">'+
                       '<div class="sq-col-sm-2 sq-col-sm-offset-1 sq-col-xs-4 sq-col-xs-offset-4">'+
                         '<img class="sq-img-responsive" src="'+img_url+'logo_squeezol_blu_nowrite.png">'+
                       '</div>'+
                       '<div class="sq-col-sm-2 sq-col-sm-offset-6 sq-col-xs-4 sq-col-xs-offset-4">'+
                         '<img class="sq-img-responsive" src="'+img_url+'gestpay.png">'+
                       '</div>'+
                     '</div>'+
										 '<div class="sq-row row-separata">'+
                       '<div class="sq-col-sm-3 sq-col-sm-offset-1 sq-col-xs-4 sq-col-xs-offset-4 '+hide_c+'">'+
                         '<p class="sq-text-left"><img class="sq-img-responsive" style="display:inline;" src="'+img_url+'squeezol_icon-creasplit'+c_var+'.png"/></p>'+
                       '</div>'+
                       '<div class="sq-col-sm-4 sq-col-sm-offset-0 sq-col-xs-4 sq-col-xs-offset-4 '+hide_i+'">'+
                         '<p class="sq-text-center"><img class="sq-img-responsive" style="display:inline;" src="'+img_url+'squeezol_icon-invita'+i_var+'.png"/></p>'+
                       '</div>'+
                       '<div class="sq-col-sm-3 sq-col-sm-offset-0 sq-col-xs-4 sq-col-xs-offset-4 '+hide_r+'">'+
                         '<p class="sq-text-right"><img class="sq-img-responsive" style="display:inline;" src="'+img_url+'squeezol_icon-riassunto'+d_var+'.png"/></p>'+
                       '</div>'+
                     '</div>'+
										 '<div class="sq-row sq-hidden-xs">'+
											 '<div class="sq-col-xs-3 sq-col-xs-offset-1 separator-'+crea+'"></div>'+
											 '<div class="sq-col-xs-4 separator-'+invita+'"></div>'+
											 '<div class="sq-col-xs-3 separator-'+gestisci+'"></div>'+
										 '</div>'+
										 '<div class="sq-row">'+
										   '<div class="sq-col-xs-10 sq-col-xs-offset-1">'+
                         '<div class="sq-row sq-panel">'+
                           '<div class="sq-col-xs-12">'+
										       howWorks+
                           '</div>'+
                         '</div>'+
										   '</div>'+
										 '</div>'+
									 '</div>'+
								 '</div>';
			viewPortDiv.append(modalDiv);
		  viewPortDiv.removeAttr('id', null);
			return;
    },
	  that.drawSeparator = function(text){
			var viewPortDiv = $sqjQuery('#squeezol_view');
			var separator;
			separator = '<div class="sq-row row-separata">'+
	  								'<div class="sq-col-md-4 sq-col-md-offset-1 sq-col-xs-12"><h4 class="sq-content-body sq-pink-text">'+text+'</h4></div>'+
										'<div class="sq-col-xs-10 sq-col-xs-offset-1 separator"></div>'+
									'</div>';
      viewPortDiv.append(separator);
      return;
	  },
    that.drawSeparatorCollapse = function(text){
      var viewPortDiv = $sqjQuery('#squeezol_view');
      var panel = '<div class="sq-row row-separata" id="squeezol-accordion-container">'+
                    '<div class="sq-col-md-5 sq-col-md-offset-1 sq-col-xs-12">'+
                      '<div class="sq-panel-group">'+
                        '<div class="sq-panel sq-panel-default">'+
                          '<div class="sq-panel-heading sq-panel-custom">'+
                            '<a data-toggle="collapse" data-parent="#accordion" href="#collapseOne">'+
                              '<p class="sq-text-left sq-label">'+text+'</p>'+
                            '</a>'+
                          '</div>'+
                          '<div id="collapseOne" class="sq-panel-collapse sq-collapse sq-out">'+
                            '<div class="sq-panel-body" id="squeezol-accordion">'+
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
      var div='<div class="sq-row sq-wizard">'+
                '<div class="sq-col-xs-4">'+
								  '<img class="sq-img-responsive" src="' + img_url + 'btn2.jpg" alt="Think">'+
                  '<h4 class="sq-text-center">1.Crea uno Split</h4>'+
                '</div>'+
                '<div class="sq-col-xs-4">'+
								  '<img class="sq-img-responsive" src="' + img_url + 'busta2.jpg" alt="Find">'+
                  '<h4 class="sq-text-center">2.Invita i tuoi amici</h4>'+
                '</div>'+
                '<div class="sq-col-xs-4">'+
                  '<img class="sq-img-responsive" src="' + img_url + 'salva2.jpg" alt="Fun">'+
                  '<h4 class="sq-text-center">3. Versa la tua quota</h4>'+
							  '</div>'+
							'</div>'+
              '<div class="sq-row">'+
                '<h4 class="sq-text-center">  Dividi l\'acquisto con i tuoi amici senza anticipare... è gratis!'+
              '</div>';
      $sqjQuery('#squeezol_btn').popover({ title:'Come funziona',
		       		                          html:true ,
																        content: div,
																        delay: { show: 100, hide:100 },
																        placement: position,
															       	  trigger: 'manual' });
      
      $sqjQuery(clickElem).on('click', function(){
				$sqjQuery('#squeezol_btn').popover('toggle');
			});
			$sqjQuery('#squeezol_btn').on('shown.bs.popover', function(){
				$sqjQuery('.sq-popover').attr('style','display: block; top: -20px; left: 127px;max-width:800px;');
			});
			$sqjQuery('#squeezol_btn').on('hidden.bs.popover', function(){
				$sqjQuery('.sq-popover').attr('style','');
        $sqjQuery(this).css("display", "");
			});

	  },
		that.getText = function(text){
			var textElem='<a target="_blank" ><h4>'+text+'</h4></a>';
			return textElem;
		},
		that.renderAlreadyInvited = function(emailDiv, fbDiv, alreadyInvited, group) {
			this.drawSeparator('Inviti inviati:');
			var container = document.createElement('div');
			container.id = 'containerCronologia';
      container.className = 'sq-row';
			for (j=0; j<alreadyInvited.length; j++){
				var invObj=alreadyInvited[j];
				var contribution = parseFloat(group.amount/(alreadyInvited.length+1)).toFixed(2);
				var tmp = document.createElement('div');
				
				if(invObj.avatar_url){
					tmp.innerHTML='<div class="sq-col-md-1 sq-col-md-offset-1 sq-hidden-xs"><img class="sq-thumbnail imgAvatar" src="'+invObj.avatar_url+'" alt="User Avatar"></img></div>';
				}
				else {
					tmp.innerHTML='<div class="sq-col-md-1 sq-col-md-offset-1 sq-hidden-xs"><img class="imgAvatar sq-thumbnail" src="' + img_url + 'default.jpg" alt="User Avatar"></img> </div>';
				}
				if(invObj.fb_id) {
					tmp.className = 'sq-row sq-fb-element';
					tmp.innerHTML += '<div class="sq-col-xs-10 sq-col-xs-offset-1 sq-col-md-4 sq-col-md-offset-0 sq-has-success sq-input-group"> <input type="hidden" class="fbEntry sq-form-control" value="'+invObj.fb_id+'"disabled></input>'+
											 		   '<input value="'+invObj.name+'" class="sq-form-control" type="text" name="email"  disabled>'+
                             '<span class="sq-input-group-addon sq-glyph-ok sq-check"></span>'+
													 '</div>';
				}
				else {
					tmp.className = 'sq-row sq-email-element';
					tmp.innerHTML+= '<div class="sq-col-xs-10 sq-col-xs-offset-1 sq-col-md-4 sq-col-md-offset-0 sq-form-group sq-has-success sq-input-group">'+
                            
														'<input value="'+invObj.email+'" class="sq-form-control" type="email" name="email" placeholder="email address" disabled>'+
                            '<span class="sq-input-group-addon sq-glyph-ok sq-check"></span>'+
													'</div>';
				}
				$sqjQuery(container).append(tmp);
			}
			$sqjQuery('#squeezol_view').append(container);
	  },
		that.loadState = function(button){
			$sqjQuery(button).button('loading');
		},
		that.loadStop = function(button){
			$sqjQuery(button).button('reset');
		},
		that.progressBar = function(totalPaid, totAmount){
			var perc = parseInt(totalPaid*100/totAmount);
			var bar;
			bar = '<div class="sq-col-md-6 sq-col-xs-6 sq-col-xs-offset-1">'+
							'<h4> Quote raccolte </h4>'+
							'<div class="sq-progress">'+
								'<div class="sq-progress-bar sq-progress-bar-success" role="progressbar" aria-valuenow="'+perc+'" aria-valuemin="0" aria-valuemax="100" style="width: '+perc+'%;">'+perc+'%</div>'+
							'</div>'+
						'</div>';
			$sqjQuery('#squeezolPayBox').append(bar);
		},
		that.sqModal = function(content, btn, id){
			var modalContent, modalBody, btn, removeBtn;
      var modal=false;
      modalContent = $sqjQuery("#"+id);
      if (modalContent.length>0) {
        modal = true;
      }
      if (modal==false){
			  modalContent = $sqjQuery('<div />');
			  modalContent.addClass('sq-modal sq-fade sq-bs-example-modal-lg');
			  modalContent.attr('id',id);
			  modalContent.attr('tabindex', '-1');
			  modalContent.attr('role', 'dialog');
			  modalContent.attr('aria-labelledby', 'SqueezolModal');
			  modalContent.attr('aria-hidden', 'true');
      }
			if (id == 'emailModal') {
        if (modal == false){
          removeBtn = Button()
					removeBtn.create('', 'ui', 'btnRemove');
					removeBtn.addClass('sq-btn sq-btn-xs sq-btn-rm')
					removeBtn.regHandler('click', function(e){
				  	var event= e || window.event;
				  	var target = event.target || event.srcElement || event.originalTarget;
				  	var invObj = InvitationObj();
				  	document.getElementById('squeezolEmail').removeChild(target.parentNode.parentNode);
					});
				  modalBody = $sqjQuery('<div />');
				  modalBody.addClass('sq-modal-body');
				  modalBody.append(content);
				  modalContent.append($sqjQuery('<div />').addClass('sq-modal-dialog')
					  .append($sqjQuery('<div />').addClass('sq-modal-content')
						.append('<div class="sq-modal-header">'+
											'<button type="button" class="sq-close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
											'<h4 class="sq-modal-title">Invita</h4>'+
										'</div>',  content, $sqjQuery('<div />').addClass('sq-modal-footer').append(btn))));
          
        }
        modalContent.on('show.bs.modal', function(){
          btn = $sqjQuery("#squeezolEmail_");          
          $sqjQuery("#squeezolEmail").empty();
          
          $sqjQuery("#squeezolEmail").append(btn);
        });
			}
			else if (id == 'facebookModal'){				
				modalContent.append(content);
      /*  modalContent.on('hide.bs.modal', function(e){
          location.reload(true);
        });*/
			}
      else if(id == 'authorizeModal'){
        modalBody = $sqjQuery('<div />');
			  modalBody.addClass('sq-modal-body');
			  modalBody.append(content);
			  modalContent.append($sqjQuery('<div />').addClass('sq-modal-dialog sq-modal-lg')
				  .append($sqjQuery('<div />').addClass('sq-modal-content')
					.append('<div class="sq-modal-header">'+
										'<h4 class="sq-modal-title">I conti non tornano? Ora c\'è Squeezol! Ti permette di dividire il costo del carrello con amici, colleghi e parenti.</h4>'+
									'</div>',  content, '<div id="social-login" class="sq-row">'+
                                        '<div class="sq-col-xs-10 sq-col-xs-offset-1">'+
                                          '<div class="sq-col-sm-6 sq-col-sm-offset-0 sq-col-xs-10 sq-col-xs-offset-1">'+
                                              '<p class="sq-content-title sq-text-center">Oppure Accedi con</p>'+
                                          '</div>'+
                                          '<div class="sq-col-sm-3 sq-col-sm-offset-0 sq-col-xs-10 sq-col-xs-offset-1">'+
                                            '<a href='+btn+'><img src="'+img_url+'fb_login.png" title="Login with Facebook" alt="Login with Facebook" style="cursor:pointer;" class="sq-img-responsive"></a>'+
                                          '</div>'+
                                          '<div class="sq-col-sm-3 sq-col-sm-offset-0 sq-col-xs-10 sq-col-xs-offset-1">'+
                                            '<a title="Google" href="'+btn+'"><img src="'+img_url+'/g_login.png" class="sq-img-responsive" alt="Login with Google" style="cursor:pointer;"></a>'+
                                          '</div>'+
                                        '</div>'+
                                      '</div>',
                                      $sqjQuery('<div />').addClass('sq-modal-footer')
                                      .append('<div class="sq-row sq-footer"><div class="sq-col-sm-2 sq-col-sm-offset-0 sq-col-xs-4 sq-col-xs-offset-4">'+
                                                '<img class="sq-img-responsive" src="'+img_url+'gestpay.png"></div>'+
                                                '<div class="sq-col-sm-2 sq-col-sm-offset-8 sq-col-xs-4 sq-col-xs-offset-4">'+
                                                '<img class="sq-img-responsive" src="'+img_url+'logo_squeezol_blu_nowrite.png"></div>'+
                                              '</div>'))));
        $sqjQuery(modalContent).modal({backdrop:'static',keyboard:false});
      }
        $sqjQuery(modalContent).modal('show');
          return modalContent;
    },
    that.modalClose = function(id){
      var currentModal = $sqjQuery('#'+id);
      currentModal.modal('hide');
    },
    that.textWithHelper = function(labelName, helpText){
      var txt = document.createElement('p')
      var $question = $sqjQuery('<div />');
      txt.className = 'sq-label';
      txt.appendChild(document.createTextNode(labelName));
      $question.attr('data-toggle', 'popover');
      $question.attr('data-placement', 'top');
      $question.attr('title', helpText);
      $question.addClass('sq-icon sq-glyph-info-sign');
      $question.append('i');
      $sqjQuery(txt).append($question);
      return txt;
    },
    that.iconPopover = function(){
      $sqjQuery('.sq-icon').popover();
		  /*$sqjQuery('.sq-icon').on('mouseenter', function(){
        $sqjQuery(this).popover('show')
      });
      $sqjQuery('.sq-icon').on('mouseout', function(){
        $sqjQuery(this).popover('hide');
      });
      $sqjQuery('.sq-icon').on('hidden.bs.popover', function(){
        $sqjQuery(this).css("display", "");
			});*/
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
                       months        : ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
                       weekdays      : ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'],
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
          wrapper, accordion, tempAcc, dateIcon;
      var opt = [];
			var tempRowDiv, spanCurr;
			var tmp, startDate, d1, d2, dI2;
			var day = 24 * 60 * 60 * 1000;
			var ui = UserInterface();
      var placeholder = { 'name': 'Compleanno di Mario, Laurea di Giulia...',
                          'description': 'Descrivi cosa intendi fare con la somma raccolta'}
      var expl = { 'name': 'Scrivi il titolo che i partecipanti leggeranno nel messaggio di invito',
                   'description': 'Aggiungi una descrizione per spiegare i dettagli ai partecipanti',
                   'max_payment_date': 'Scegli la data entro la quale pagare la propria quota',
                   'occurrence': 'Decidi per quale occasione stai organizzando l\'acquisto'}
      var helpText = { 'name': 'Dai un titolo allo Split. Per esempio: regalo per Marco, week end in Montagna ecc.',
                       'description': 'Il posto giusto dove inserire qualche dettaglio che invogli i tuoi amici a partecipare',
                       'max_acceptance_date': 'Scegli la data entro la quale gli invitati dovranno confermare la propria partecipazione',
                       'max_payment_date': 'Scegli la data entro la quale i partecipanti possono effettuare i pagamenti. La durata massima è 20 giorni, se l\'obiettivo non viene raggiunto entro questa data tutti i pagamenti verranno rimborsati',
                       'occurrence': 'Fai sapere ai partecipanti per quale occasione si effettua l\'acquisto',
                       'promo_code': 'Inserisci un codice promozionale valido: ti consente di avere uno sconto sullo Split',
                       'alert_email': 'Invia una mail ogni volta che un invitato decide di accettare o rifiutare il tuo invito',
                       'hide_contribution': 'Nasconde ai partecipanti la quota versata da ognuno. Resta visibile a tutti il totale raccolto',
                       'hide_invitation': 'Nasconde l\' identità  dei partecipanti tra di loro.',
                       'isOpen': 'Split aperto a chiunque abbia un invito, senza PIN e a donazione libera' }
			wrapper_row = { wrapper: 'div', className: 'sq-row'};
      wrapper_row_pad = { wrapper: 'div', className: 'sq-row pad-it'};
			wrapper_left = { wrapper: 'div', className : 'sq-col-md-5 sq-col-md-offset-1 sq-col-xs-12' }
			wrapper_left_small = { wrapper: 'div', className : 'sq-col-md-4 sq-col-md-offset-1 sq-col-xs-12' }
      wrapper_right = { wrapper: 'div', className: 'sq-col-md-5 sq-col-xs-12'};
      wrapper_btn = { wrapper: 'div', className: 'sq-col-md-3 sq-col-md-offset-3 sq-col-xs-4 sq-col-xs-offset-4'}
			wrapper_push_right = { wrapper: 'div', className: 'sq-col-md-3 sq-col-md-offset-9 sq-col-xs-12'};
      wrapper_hide = {wrapper: 'div', className: 'sq-hidden sq-display-none'};
      dateIcon = document.createElement('img');
      dateIcon.setAttribute('src', img_url+'calendar.png')
      dateIcon.className = 'sq-img-responsive sq-date-icon';
			//UI
      ui.drawHeader('create', 'modal');
			viewPortDiv = Div();
		  viewPortDiv.get(id);
			// Temp Div
		  tmp=document.createElement('div');
			tempRowDiv = Div(tmp);
			tempRowDiv.addClass('sq-row');
			// Nome Collettaat
			input = TextInput();
		  input.create('name');
      input.get().setAttribute('placeholder', placeholder['name']);
			inputs.push(input);
			// Data Accettazione
			tempRowDiv.append(input.labelize('Titolo*: ', helpText['name'], expl['name']).wrap(wrapper_left));

      // Data Pagamenti
		  date2 = DateInput();
			d2 = new Date(new Date().getTime() + 20*day);
		  date2.create('max_payment_date', d2);
		  date2.get().id = 'datepicker2';
		  date2.addPicker(dp2);
      
		  inputs.push(date2);
	    spanCurr = document.createElement('span');
			spanCurr.className = 'sq-input-group-addon';
      dI2 = DomElement({'el': dateIcon.cloneNode()});
      dI2.get().id = 'sq-calendar';
      dI2.regHandler('click', function(e){
        date2.get().click();
      });
			spanCurr.appendChild(dI2.get());
			tempRowDiv.append(date2.labelizeWithSpan('Data di fine Split*: ',spanCurr, helpText['max_payment_date'], expl['max_payment_date']).wrap(wrapper_right));
		  this.initDatePickers(d1, d2);
		  opt.push({value: 'R', text: 'Regalo di compleanno'});
		  opt.push({value: 'V', text: 'Viaggio'}); 
		  opt.push({value: 'C', text: 'Evento, concerto'}); 
		  opt.push({value: 'G', text: 'Cena, pranzo, catering'}); 
		  opt.push({value: 'N', text: 'Regalo di Nozze'}); 
		  opt.push({value: 'A', text: 'Altro ...'}); 
		  combo = ComboBox();
		  combo.create(opt);
      viewPortDiv.append(tempRowDiv.get())

      // Hidden acceptance date
			date1 = DateInput();
			d1 = new Date(new Date().getTime()+day);
		  date1.create('max_acceptance_date', d1);
			date1.get().id = 'datepicker1';
			date1.addPicker(dp1);
			inputs.push(date1);
      spanCurr = document.createElement('span');
			spanCurr.className = 'sq-input-group-addon';
			spanCurr.appendChild(dateIcon);
			tempRowDiv.append(date1.labelizeWithSpan('Scadenza Invito', spanCurr, helpText['max_acceptance_date']).wrap(wrapper_hide));

			// Append first row
			viewPortDiv.append(tempRowDiv.get());
			// Temp Div
			tmp=document.createElement('div');
			tempRowDiv = Div(tmp);
			tempRowDiv.addClass('sq-row');
			// Descrizione Colletta
		  input = TextArea();
		  input.create('description');
      input.get().setAttribute('placeholder', placeholder['description']);
		  inputs.push(input);
		  tempRowDiv.append(input.labelize('Descrizione: ', helpText['description'], expl['description']).wrap(wrapper_left));

		  tempRowDiv.append(combo.labelize('Occasione: ', helpText['occurrence'], expl['occurrence']).wrap(wrapper_right));
			viewPortDiv.append(tempRowDiv.get())
			ui.drawSeparator('');
			ui.drawSeparatorCollapse('Opzioni');
      //squeezol-accordion
      tempAcc = document.getElementById('squeezol-accordion');
			accordion = Div(tempAcc);
      
		  checkBox = CheckBox();
		  checkBox.create({name: 'alert_email', value: 'Email notifications'}); 
		  checkBoxes.push(checkBox);
		  accordion.append(checkBox.labelize('Attiva notifiche email', helpText['alert_email']).wrap(wrapper_row_pad));
						
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
		  accordion.append(checkBox.labelize('Split a donazione libera', helpText['isOpen']).wrap(wrapper_hide));
			promo = TextInput();
		  promo.create('promo_code');
		  accordion.append(promo.labelize('Codice Promozionale', helpText['promo_code']).wrap(wrapper_hide));
		  
			
		  button.create('Prosegui', 'big', 'squeezol_button');
			button.addClass('sq-btn')
		  button.regHandler('click', buttonHandler);
			tmp = document.getElementById('squeezol-accordion-container');
      tempRowDiv = Div(tmp);
		  tempRowDiv.append(button.wrap(wrapper_btn));
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
		    inp.deleteDivClass('sq-has-error');
				errors = [].slice.call(document.getElementsByClassName('sq-alert-danger'));
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
						error.className = 'sq-alert sq-alert-danger';
						error.innerHTML = 'Questo campo è obbligatorio';
						Div(wrapDiv).addClass('sq-has-error');
						$sqjQuery(wrapDiv).after(error);
		      }
		    }
        else if('non_field_errors' in answer) {
          wrapDiv = inp.getInput('max_payment_date').getWrapDiv();
          error = document.createElement('p');
				  error.className = 'sq-alert sq-alert-danger';
					error.innerHTML = answer.non_field_errors;
					Div(wrapDiv).addClass('sq-has-error');
					$sqjQuery(wrapDiv).after(error);
        }
        else {
          for (prop in answer){
            if (prop != "status"){
              wrapDiv = inp.getInput(prop).getWrapDiv();
						  error = document.createElement('p');
						  error.className = 'sq-alert sq-alert-danger';
						  error.innerHTML = answer[prop];
						  Div(wrapDiv).addClass('sq-has-error'); 
						  $sqjQuery(wrapDiv).after(error);
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
      var invObj = InvitationObj();
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
          invObj.updateQuota();
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
      var mex, action;
			var quotaTmp= {};
			var p;
			p = document.getElementById('squeezol_single_amount');
			if (p){
				quotaTmp = p
			}
			else {
				quotaTmp.value = 0.00;
			}
      action=targetBtn.getAttribute('data-action');
      temp.group_id=groupId;
      temp.participant_id=targetBtn.getAttribute('data-participant');
      temp.action=action
		  temp.single_amount=quotaTmp.value;
      if (action == 'CG'){
        mex = "Stai per concludere lo Split e nessuno potrà più pagare. Vuoi proseguire?"
      }
      else if (action == 'RG'){
        mex = "Stai per annullare lo Split, TUTTI i partecipanti verranno rimborsati. Vuoi proseguire?"
      }
      else if (action == 'OP'){
        mex = "Stai per dare a tutti la possibilità di pagare. Vuoi proseguire?"
      }
      else{
        return SqObj(temp).toFormUrlEnc();
      }
      r=confirm(mex)
      if (r == true) {
        return SqObj(temp).toFormUrlEnc();
      }     
      return
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
      var emailCount = document.getElementsByClassName('sq-email-element').length+1;
      var fbCount = document.getElementsByClassName('sq-fb-element').length;
      var friendCount = fbCount+emailCount;
      return parseFloat(targetAmount/friendCount).toFixed(2);
    },
    that.updateFundraising = function(f){
      var uxDiv=document.getElementById('sq-fund-text');
			var fundText;
      if (f=='D'){
				fundText ='<p class="sq-content-body"><strong> Suggerisci la quota:</strong></p>'+
                  '<p class="sq-content-body" id="sq-fundraising-text">'+
							 			'l\'organizzatore suggerisce la quota che dovranno versare i singoli partecipanti. '+
                    'La quota potrà essere eventualmente modificata al momento del pagamento.'+
									'</p>';
      }else if(f=='S'){
				fundText = '<p class="sq-content-body"><strong> Dividi equamente:</strong></p>'+
        		 			 '<p class="sq-content-body">'+
									   'la quota del singolo partecipante verrà ricalcolata ogni volta che l’invitato conferma la sua adesione. '+
                     'La quota potrà essere eventualmente modificata al momento del pagamento.'+
									 '</p>';      	
      }else if(f=='F'){
				fundText = '<p class="sq-content-body"><strong> Quota fissa:</strong></p>'+
		 				 			 '<p class="sq-content-body">'+
									   'l\'organizzatore sceglie una quota fissa che i singoli partecipanti dovranno versare. '+
                     'La quota NON potrà essere modifica al momento del pagamento.'+
									 '</p>';
      	
      }
			if(uxDiv){
				uxDiv.innerHTML=fundText;
			}
			return fundText;
    },
		that.updateQuotaOption=function(f,c,curr){
			var uxDiv=document.getElementById('sq-quota-option');
			var quotaOption;
			if (f=='S'){
			  quotaOption='<div class="squeezol_quota">'+
								 		  '<p class="sq-label">Quota con divisione equa:</p>'+
											'<p class="sq-exp">Quota a persona se tutti gli invitati accetteranno l\'invito.</p>'+
											'<div class="sq-input-group">'+
												'<input id="squeezol_admin_contrib" value="'+c+'" name="email_contribution"'+
										 			     'type="text" class="squeezolPrice sq-form-control" disabled><span class="sq-input-group-addon">'+curr+'</span>'+
											'</div>'+ 
									  '</div>';
			}else if(f=='D'){
        quotaOption='<div class="squeezol_quota">'+
                      '<p class="sq-label">Quota suggerita a persona:</p>'+
                      '<p class="sq-exp">La quota è un suggerimento per gli invitati.</p>'+
              			  '<div class="sq-input-group">'+
											  '<input id="squeezol_admin_contrib" value="'+c+'" name="email_contribution"'+
											         'type="text" class="squeezolPrice sq-form-control"><span class="sq-input-group-addon">'+curr+'</span>'+
											'</div>'+
										'</div>';
			}
			else if(f=='F'){
				quotaOption='<div class="squeezol_quota">'+
        							'<p class="sq-label">Quota fissa a persona:</p>'+
                      '<p class="sq-exp">La quota fissa non è modifcabile dagli invitati</p>'+
											'<div class="sq-input-group">'+
												'<input id="squeezol_admin_contrib" value="'+c+'" name="email_contribution"'+
							         				 'type="text" class="squeezolPrice sq-form-control"><span class="sq-input-group-addon">'+curr+'</span>'+
											'</div>'+
										'</div>';
			}
			if(uxDiv){
				uxDiv.innerHTML=quotaOption;
			}
			return quotaOption;
		},
    that.updateContribution = function(contrib, targetAmount) {
      var rest = 0.00;
      var tot = 0.00;
      var totAdmin;
      var inv_div=document.getElementById('sq-inv-count');
      var adminContrib=document.getElementById('squeezol_admin_contrib');
      var friendList = document.getElementsByClassName('sq-email-element');
      var fbList = document.getElementsByClassName('sq-fb-element');
      var num_inv=fbList.length+friendList.length;
      tot = parseFloat(contrib*(num_inv+1));
      if (tot != targetAmount){
      rest = parseFloat(targetAmount - tot).toFixed(2);
				totAdmin= parseFloat(contrib)+parseFloat(rest);
				adminContrib.value = parseFloat(totAdmin).toFixed(2);
			}
			else{
				adminContrib.value = parseFloat(contrib).toFixed(2);
			}
      inv_div.innerHTML=num_inv;
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
			emailArray = this.buildDataByClassName('sq-email-send', 'mail__Invitation', 'squeezolPrice', 'email');
			fbArray = this.buildDataByClassName('sq-fb-element', 'fb__Invitation', 'squeezolPrice', 'facebook');
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
		},
    that.updateQuota = function(){
      var target, amount;
      target = document.getElementById('contributionType');
      if (target.value === 'S') {
        amount = document.getElementById('sq-group-amount').value;
				contribution = this.computeSingleContribution(amount);
				this.updateContribution(contribution, amount);
		  }
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
				this.setWrongEmails(answer.emailArray);
				this.appendErrorInfo('Una o più email inserite sono ripetute, correggi per proseguire.', document.getElementById('squeezolEmail'));
			}
			else if (errorType == 'error') {
				this.appendErrorInfo(answer.error, document.getElementById('squeezol_admin_contrib').parentNode.parentNode);
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
						tempObj.addClass('sq-has-error');
						//tmpSpan = document.createElement('span');
						//tmpSpan.className = 'input-group-addon glyphicon glyphicon-remove';
					}
					else {
						tempObj = DomElement({'el': emailInputList[j].parentNode})
						tempObj.addClass('sq-has-success');
						//tmpSpan = document.createElement('span');
						//tmpSpan.className = 'input-group-addon glyphicon glyphicon-ok form-control-feedback';
					}
          // TODO: Decommentare, non riesco ad appendere tmpSpan
					//$sqjQuery(tmpSpan).appendTo(tempObj);
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
						tempObj.addClass('sq-has-error');
					}
				}
			}
			for (j=0; j<fbInputList.length; j++){  
				for (i=0; i<fb_list.length; i++ ) {
					if (fbInputList.value == fb_list[i].fb_id ) {
						tempObj = DomElement({'el': fbInputList[j].parentNode})
						tempObj.addClass('sq-has-error');
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
						tempObj.addClass('sq-has-error');
					}
				}
			}
		},
		that.removeErrorInfo = function () {
			var tempObj, alertDiv, tmpDiv;
			var errorClassList = document.getElementsByClassName('sq-has-error');
			alertDiv = document.getElementById('alertErrorDiv');
			if (alertDiv){
				tempDiv = DomElement({'el': alertDiv});
				tempDiv.remove();
			}
			for (var i=0; i<errorClassList.length;i++){
				tempObj = DomElement({'el': errorClassList[i]});
				tempObj.deleteClass('sq-has-error');
			}
			return;
		},
		that.appendErrorInfo = function(text, domItem){
			var div = document.createElement('div');
      var error=document.getElementById('alertErrorDiv');
      if (error){
        $jQuery(error).remove();
      }
			div.className = 'sq-row row-separata';
			div.id = 'alertErrorDiv';
			div.innerHTML = '<div class="sq-alert sq-alert-danger sq-col-xs-11 sq-col-xs-offset-1">'+
											  '<p>'+
													text+
											  '</p>'+
											'</div>';
			domItem.appendChild(div);
			return;
		},
		that.appendSuccessInfo = function(){
			var div = document.createElement('div');
			var domItem = document.getElementById('squeezolEmail')
			div.className = 'sq-row';
			div.id = 'alertErrorDiv';
			div.innerHTML = '<div class="sq-alert sq-alert-success sq-col-xs-7 sq-col-xs-offset-1">'+
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
			var alreadyInvited = container.getElementsByClassName('sq-email-element');
			var currSent, inv, div;
      var found = false;
			for (var i=0; i<sentEmail.length; i++){
        div = document.createElement('div');
			  div.className = 'sq-row sq-email-element';
				currSent = sentEmail[i];
				for (var j=0; j<alreadyInvited.length; j++) {
					inv = alreadyInvited[j].getElementsByTagName('input')[0];
          if (inv.value == currSent.value) {
            found = true;
          }
        }  
		  	if (found==false) {
					div.innerHTML = '<div class="sq-col-md-1 sq-col-md-offset-1 sq-hidden-xs">'+
                            '<img class="imgAvatar sq-thumbnail" src="' + img_url + 'default.jpg" alt="User Avatar"></img>'+
                          '</div>'+
													'<div class="sq-col-xs-10 sq-col-xs-offset-1 sq-col-md-4 sq-col-md-offset-0 sq-form-group sq-has-success sq-input-group">'+
													  '<input value="'+currSent.value+'" class="sq-form-control" type="email" name="email" placeholder="email address" disabled>'+
														'<span class="sq-input-group-addon sq-glyph-ok sq-check">'+
                            '<span/>'+
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
			var btnText = ['Email', 'f | INVITA VIA FACEBOOK', 'Invia E-mail'],
					btnId = ['squeezolEmail_', 'squeezolFb_', 'squeezolSubmit_' ],
					btnSize = ['small', 'small', 'big'],
					btnClass = ['sq-btn sq-btn-lg sq-buttonEmail', 'sq-btn sq-btn-lg sq-buttonFb', 'sq-btn'];
			var fbBtn, emailBtn, submitBtn, emailDiv, fbDiv, selectBox, nextBtn,
				  invitationBtn, removeBtn, containerDiv, submitDiv, nextDiv;
			var fbUid, friendList;
			var sqDiv, tmpObj, tmpDiv, emailModal;
      var copiaUrl, a_temp, a_link;
			var i, j, currBtn, ui;
			var wrapper_left = { wrapper: 'div', className : 'sq-col-xs-2' };
			var wrapper_center = { wrapper: 'div', className : 'sq-col-md-3 sq-col-xs-10 hidden-xs hidden-sm' };
			var wrapper_btn = { wrapper: 'div', className : 'sq-col-md-3 sq-col-md-offset-1 sq-col-xs-10 ' };
			var wrapper_row = { wrapper: 'div', className : 'sq-row' };
      var wrapper_remove = { wrapper: 'div', className: 'sq-col-sm-4 sq-col-sm-offset-0 sq-col-xs-10 sq-col-xs-offset-1'}
			if(answer.status === 'ok') {
        //Set Post Message
        if(window.addEventListener){
          window.addEventListener("message",PostMessageReceiver,false)
        }else if(window.attachEvent){
          window.attachEvent("onmessage",PostMessageReceiver)
        }
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
				emailDiv.className = 'mailInvitation sq-modal-body';
				emailDiv.id = 'squeezolEmail'
				fbDiv.className = 'fbInvitation';
				fbDiv.id = 'squeezolFb'
				invitationBtn = InvitationObj();
				emailBtn = invitationBtn.createButton('+ Email', btnId[0], btnSize[0], 'sq-btn sq-btn-sm sq-buttonEmail');
				emailModal = invitationBtn.createButton('@ | INVITA VIA EMAIL', 'emailModal_', 'big', 'sq-btn sq-btn-lg sq-buttonEmail');
				
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
				submitDiv.className = 'sq-row';
				submitDiv.appendChild(submitBtn.wrap({ wrapper: 'div', className : 'sq-col-xs-10 sq-col-xs-offset-1 sq-col-md-3 sq-col-md-offset-8'}));
				
        var NewremoveBtn = Button()
					NewremoveBtn.create('', 'ui', 'btnRemove');
					NewremoveBtn.addClass('sq-btn sq-btn-xs sq-btn-rm')
					NewremoveBtn.regHandler('click', function(e){
				  	var event= e || window.event;
				  	var target = event.target || event.srcElement || event.originalTarget;
				  	var invObj = InvitationObj();
				  	document.getElementById('squeezolEmail').removeChild(target.parentNode.parentNode);
					});


				// ADD EMAIL handler:
				emailBtn.regHandler('click', function() {
				  var invObj=InvitationObj();
				  var newEmail=document.createElement('div');
				  var sBox = document.getElementById('contributionType');
				  var contribType = sBox.options[sBox.selectedIndex].value;

					removeBtn = Button()
					removeBtn.create('', 'ui', 'btnRemove');
					removeBtn.addClass('sq-btn sq-btn-xs sq-btn-rm')
					removeBtn.regHandler('click', function(e){
				  	var event= e || window.event;
				  	var target = event.target || event.srcElement || event.originalTarget;
				  	var invObj = InvitationObj();
				  	document.getElementById('squeezolEmail').removeChild(target.parentNode.parentNode);
					});
					newEmail = document.createElement('div');
					newEmail.className = 'sq-row sq-email-send';
					$sqjQuery(newEmail).append('<div class="sq-hidden-xs sq-col-sm-2 sq-col-md-2">'+
															      '<img style="display:inline;" class="imgAvatar sq-thumbnail" src="' + img_url + 'default.jpg" alt="User Avatar"></img>'+
		  											      '</div>'+
														      '<div class="sq-col-sm-6 sq-col-sm-offset-0 sq-col-xs-10 sq-col-xs-offset-1">'+
													          '<input class="sq-form-control mail__Invitation" placeholder="Aggiungi Email" type="email" name="email">'+
														      '</div>');
					newEmail.appendChild(removeBtn.wrap(wrapper_remove));
					emailDiv.appendChild(newEmail);
				});
				emailDiv.appendChild(emailBtn.get());
        $sqjQuery(emailDiv).append($sqjQuery('<div />').addClass('sq-row sq-email-send')
            .append('<div class="sq-hidden-xs sq-col-sm-2 sq-col-md-2">'+
								      '<img style="display:inline;" class="imgAvatar sq-thumbnail" src="' + img_url + 'default.jpg" alt="User Avatar"></img>'+
						        '</div>'+
						        '<div class="sq-col-sm-6 sq-col-sm-offset-0 sq-col-xs-10 sq-col-xs-offset-1">'+
					            '<input class="sq-form-control mail__Invitation" placeholder="Aggiungi Email" type="email" name="email">'+
				            '</div>', NewremoveBtn.wrap(wrapper_remove)))
				emailModal.regHandler('click', function() {
					var ui = UserInterface();
					ui.sqModal(emailDiv, submitDiv, 'emailModal');
				});
        var boxInvita = document.createElement('div');
        boxInvita.className='sq-row row-separata';
        var textInfo = document.createElement('p');
        var texttt = document.createTextNode('Per invitare usa una email, un messaggio privato su Facebook oppure Condividi il link! Le informazioni compariranno automaticamente e gli invitati potranno versare la propria quota in 3 click!');
        textInfo.appendChild(texttt);
        
				tmpObj = document.createElement('div');
				tmpObj.className = 'sq-col-xs-10 sq-col-xs-offset-1 sq-panel sq-panel-info';
        tmpObj.appendChild(textInfo);
				tmpObj.appendChild(emailModal.wrap(wrapper_btn));

				// FACEBOOK IFRAME handler:
        if (params.fb_url) {
				  fbBtn = invitationBtn.createButton(btnText[1], btnId[1], 'ui', 'sq-btn sq-btn-lg sq-buttonFb');
					fbBtn.regHandler('click', function(){
						var iFrameModal;
						var ui=UserInterface();
						iFrameModal = document.getElementById('squeezolIframe');
						if(!iFrameModal){
							iFrameModal = document.createElement('div');
							iFrameModal.id = 'squeezolIframe';
							iFrameModal.className = 'sq-row';
						}
						else {
							iFrameModal.innerHTML = '';
						}
 						var socIframe = '<div class="ajax-widget-container sq-embed-responsive sq-embed-responsive-4by3" id="appendSqIframe">'+
                          		'<iframe scrolling="auto" class="sq-embed-responsive-item" src="'+params.fb_url+'"></iframe>'
														'</div>';
					  iFrameModal.innerHTML=socIframe;
						ui.sqModal(iFrameModal,'', 'facebookModal');
					  return
					});
					tmpObj.appendChild(fbBtn.wrap(wrapper_center));
        }
        else {
          fbBtn = invitationBtn.createButton('f | CONDIVIDI SU FACEBOOK', 'sq-fb-sharer', 'ui', 'sq-btn sq-btn-lg sq-buttonFb');
          fbBtn.regHandler('click', function(){
    			  ui.PopupCenter('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(params.link_url), 'facebook-share-dialog', '626', '436');
          });
          tmpObj.appendChild(fbBtn.wrap(wrapper_center));
        }
				
        copiaUrl = document.createElement('div')
        copiaUrl.className = 'sq-col-md-3 sq-col-xs-10 sq-col-xs-offset-1 pink-link';
        copiaUrl.setAttribute('data-placement', 'top');
        copiaUrl.setAttribute('title', 'Copia URL dello Split e condividilo dove preferisci');
        a_temp = document.createElement('a');
        a_temp.innerHTML = 'COPIA LINK INVITO';
        a_link=DomElement({'el': a_temp});
        a_link.id='clipBoardLink';
        a_link.regHandler('click', function(e) {
          var message = 'Copia il link con CTRL+C o CMD+C e invialo a chi vuoi utilizzando la tua chat preferita, ad esempio: Whatsapp, Hangouts e Telegram';
          if (answer.group.isOpen){
            window.prompt(message, params.link_url);
          }
          else {
            window.prompt(message, params.link_url+'?pin='+group.pin);
          }
        });
        copiaUrl.appendChild(a_link.get());
        /*$sqjQuery(copiaUrl).append('<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="100" height="50" id="clippy" >'+
                                 '<param name="movie" value="'+img_url+'plus.png"/>'+
                                 '<param name="allowScriptAccess" value="always" />'+
                                 '<param name="quality" value="high" />'+
                                 '<param name="scale" value="noscale" />'+
                                 '<param NAME="FlashVars" value="text=COPIA LINK INVITO">'+
                                 '<param name="bgcolor" value="#FFF">'+
                                 '<embed src="'+css_url+'clippy.swf"'+
                                         'width="100"'+
                                         'height="50"'+
                                         'name="clippy"'+
                                         'quality="high"'+
                                         'allowScriptAccess="always"'+
                                         'type="application/x-shockwave-flash"'+
                                         'pluginspage="http://www.macromedia.com/go/getflashplayer"'+
                                         'FlashVars="text='+params.link_url+'"'+
                                         'bgcolor="#DA396F"/>'+
                                  '</object>');*/
        tmpObj.appendChild(copiaUrl);
        boxInvita.appendChild(tmpObj);
				SqDiv.appendChild(boxInvita);
				
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
          var ui=UserInterface();
					var target = event.target || event.srcElement || event.originalTarget;
					if (target.value == 'S'){
						contribution = invObj.computeSingleContribution(group.amount);
						invitationBtn.updateContribution(contribution, group.amount);
					}
					else {
					  invObj.setToZero();
            contribution = parseFloat(0).toFixed(2);
					}
					invObj.updateFundraising(target.value);
          invObj.updateQuotaOption(target.value,contribution,ui.switchCurrency(group.currency));
				});
				// Append to View Port .invitationContainer
				containerDiv = document.createElement('div');
				containerDiv.className = 'invitationContainer';
				
				// Append .fbInvitation and mailInvitation Div to .invitationContainer
				containerDiv.appendChild(fbDiv);
				SqDiv.appendChild(containerDiv);
					
				// Render Amici gia'  invitati
				ui.renderAlreadyInvited(emailDiv, fbDiv, alreadyInvited, group);
				ui.drawSeparator('');
					
				// Append Next Div to .invitationContainer
				nextDiv = document.createElement('div');
				nextDiv.className = 'sq-row row-separata-bottom';
				nextDiv.appendChild(nextBtn.wrap({ wrapper: 'div', className : 'sq-col-xs-10 sq-col-xs-offset-1 sq-col-sm-3 sq-col-md-offset-8' }));
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
      var ui = UserInterface();
      var invObj=InvitationObj();
			var groupDigest, status, contrib, options, fundText;
      var isOpen='';
      var groupDigest2;
			var sqDiv = document.getElementById('squeezol_view');
      var quotaOption;
      if (group.fundraising == 'D'){
        contrib = participantAdmin.single_amount;
        options = '<option value="S">Dividi Equamente</option>'+
	                '<option value="D" selected>Suggerisci la quota</option>'+
									'<option value="F">Quota Fissa</option>';
      }
      else if(group.fundraising == 'S') {
        contrib = parseFloat(group.amount/(alreadyInvited.length+1)).toFixed(2);
        options = '<option value="S" selected>Dividi Equamente</option>'+
									'<option value="D">Suggerisci la quota</option>'+
									'<option value="F">Quota Fissa</option>';
        
        
      }
			else  {
				contrib = participantAdmin.single_amount;
				options = '<option value="S">Dividi Equamente</option>'+
									'<option value="D">Suggerisci la quota</option>'+
									'<option value="F" selected>Quota Fissa</option>';
			}
      fundText=invObj.updateFundraising(group.fundraising);
      quotaOption=invObj.updateQuotaOption(group.fundraising,contrib,ui.switchCurrency(group.currency));
			groupDigest=document.createElement('div');
			groupDigest.id = "squeezol_btn_container";
			groupDigest.className = "sq-col-sm-5 sq-col-xs-10 sq-col-xs-offset-1";
      groupDigest2=document.createElement('div');
      groupDigest2.className='sq-row row-separata';
      groupDigest2.innerHTML = '<div class="sq-col-sm-4 sq-col-sm-offset-1 sq-col-xs-10 sq-col-xs-offset-1">'+
                                 '<div class="sq-row">'+
                                   '<p class="sq-label">Divisione delle quote:'+
                                     '<div data-toggle="popover" data-placement="top" title="Aiuta gli invitati '+ 
                                       'a capire come intendi dividere le quote dell\'acquisto."'+
                                       'class="sq-icon sq-glyph-info-sign">i'+
                                     '</div>'+
                                   '</p>'+
                                   '<p class="sq-exp">Decidi come dividere le quote con gli invitati.</p>'+
															     '<select class="selectContrib" id="contributionType">'+options+'</select>'+
															     '<input value="'+adminEmail+'"type="hidden" name="email" disabled>'+
                                 '</div>'+
                                 '<div class="sq-row row-separata" id="sq-quota-option">'+
                                   quotaOption+
                                 '</div>'+
                                '</div>';
			groupDigest.innerHTML= '<div class="sq-row">'+
                               '<div class="sq-col-sm-6 sq-col-sm-offset-0 sq-col-xs-10 sq-col-xs-offset-1">'+
                                 '<p>Invitati: <strong id="sq-inv-count">'+alreadyInvited.length+'</strong></p>'+
                               '</div>'+
                               '<div class="sq-col-sm-6 sq-col-sm-offset-0 sq-col-xs-10 sq-col-xs-offset-1">'+
                                 '<input type="hidden"  id="sq-group-amount" value="'+group.amount+'"></input>'+
                                 '<p class="sq-text-right"> Obiettivo: '+
                                   '<strong>'+group.amount+ui.switchCurrency(group.currency)+'</strong>'+
                                 '</p>'+
                               '</div>'+
                             '</div>'+
                             '<div class="sq-row sq-withBorder">'+
                               '<div class="sq-col-xs-12" id="sq-fund-text">'+
                                  fundText
                               '</div>'+
                             '</div>';
      $sqjQuery(groupDigest2).append(groupDigest);
			$sqjQuery(sqDiv).append(groupDigest2);
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
          renderDiv, participantId, invAmount, alertPaid, renderRef, refContainer;
      var paidCount=0;
			var part, totalPaid, superTemp, ttt, ttr;
			var SqDiv=document.getElementById('squeezol_view');
			var sqBtnContainer;
			var i, j, k, p, spanCurr, quotaDiv, labelQuota;
			var status, ui, state, ghianda, avatar_url, alertDes, contribution_amount;
      var textAdd, tDiv;
      var paidText = '<p class="sq-text-center"><strong> La tua quota è stata prenotata! </strong>'+
                    'L\'importo verrà scalato dalla tua carta solo se l\'obiettivo verrà raggiunto!<br/>'+
                    'Invita altri amici per diminuire la quota. '+
                    'Oppure continua lo shopping!'
                    +'</p>'; 
			var wrapper = {wrapper: 'div', className: 'sq-col-md-2 sq-col-md-offset-1 sq-col-xs-10 sq-col-xs-offset-1'};
      var wrapperQ = {wrapper: 'div', className: 'sq-col-md-5 sq-col-md-offset-1 sq-col-xs-10 sq-col-xs-offset-1'};
      var wrapper_row = {wrapper: 'div', className: 'sq-row'};
			var wrapBtn = {wrapper: 'div', className: 'sq-col-md-2 sq-col-xs-10 sq-col-xs-offset-1'};
      var wrapper_btn = {wrapper: 'div', className: 'sq-col-sm-4 sq-col-sm-offset-4 sq-col-xs-12 sq-col-xs-offset-0'};
      var wrapper_right = {wrapper: 'div', className: 'sq-col-md-3 sq-col-md-offset-3 sq-col-xs-10 sq-col-xs-offset-1'};
      var helpText = { 'p_quota': 'Inserisci la quota che intendi versare. Nota: fai click su modifica dopo aver inserito l\'importo', 
                       'expl': 'Se lo ritieni necessario modifica la tua quota prima di pagare'};

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
				
				renderDiv=Div(document.createElement('div'));
				renderDiv.addClass('sq-row row-separata');

				renderBtn = Button();
				singleAmountBtn = Button();
				saInput = TextInput()
				SqDiv = document.getElementById('squeezol_view');
				// Group completed with success
				if(groupStatus == 'CWS') {
					alertDes = document.createElement('div');
					alertDes.className = 'sq-row sq-alert sq-alert-success row-separata'
					alertDes.innerHTML = '<p class="sq-text-center">'+
																 '<strong> Congratulazioni! Ordine Completato</strong>'+
																 'Lo split si è concluso con successo! '+
															 '</p>';
					SqDiv.appendChild(alertDes);
				}
				// Waiting for accesptance or payments
				else if (groupStatus == 'WAC' || groupStatus == 'WPA'){
					// Possibilita' di proporre un importo se si e' in fase di accettazione o il gruppo e' aperto e WPA
					if (params.p_status == 'A' && !canFinish){
            ui.drawSeparator('Quota');
						saInput.create('single-amount');
						saInput.get().value=parseFloat(params.p_single_amount).toFixed(2);
						saInput.get().id='squeezol_single_amount';
						singleAmountBtn.create('Salva quota', 'ui', 'SqueezolModifyAmount_');
						singleAmountBtn.get().setAttribute('data-participant', participantId);
						singleAmountBtn.get().setAttribute('data-action', 'SA');
						singleAmountBtn.get().className='sq-btn sq-btn-lg';
						singleAmountBtn.regHandler('click', buttonHandler);
						quotaDiv = Div(document.createElement('div'));
						quotaDiv.addClass('sq-input-group');
						spanCurr = document.createElement('span');
						spanCurr.className = 'sq-input-group-addon';
						spanCurr.innerHTML = ui.switchCurrency(answer.group.currency);
						quotaDiv.append(saInput.labelizeWithSpan('La tua quota', spanCurr, helpText['p_quota'], helpText['expl']).get());
						renderDiv.append(quotaDiv.wrap(wrapperQ));
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
							renderBtn.get().className='sq-btn';
							renderBtn.regHandler('click', buttonHandler);
						}
						// Se puo' concludere la collette
						else if(canFinish==true) {
							renderBtn.create('Concludi Split', 'ui', 'SqueezolFinishPay_');
							renderBtn.get().setAttribute('data-participant', participantId);
							renderBtn.get().setAttribute('data-action', 'CG');
							renderBtn.get().className='squeezolButtonSuccess sq-btn';
							renderBtn.regHandler('click', buttonHandler);
              textAdd = document.createTextNode('Obiettivo raggiunto! Clicca su Concludi lo split per confermare l\'acquisto. Una notifica verrà inviata a tutti i partecipanti.');
              tDiv = Div(document.createElement('div'));
              tDiv.addClass('sq-col-md-7 sq-col-xs-10 sq-col-xs-offset-1');
              tDiv.append(textAdd);
							renderDiv.append(renderBtn.wrap(wrapper));
              renderDiv.append(tDiv.get());
							SqDiv.appendChild(renderDiv.get());
							renderBtn = '';
							renderBtn = Button();
							renderDiv=Div(document.createElement('div'));
							renderBtn.create('Rimborsa', 'small', 'SqueezolRefund_');
							renderBtn.get().setAttribute('data-participant', participantId);
							renderBtn.get().setAttribute('data-action', 'RG');
							renderBtn.get().className='sq-btn sq-btn-sm sq-btn-danger';
							renderBtn.regHandler('click', buttonHandler);
              renderBtn = Div(renderBtn.wrap(wrapper));
						}
						// Se i pagamenti sono aperti
						else if(openPay==true) {
							for(k=0; k<participants.length; k++){
								partObj=participants[k];
								if(partObj.id==participantId) {
									if (partObj.status==='P'){
                    alertPaid=document.createElement('div');
                    alertPaid.className='sq-alert sq-alert-success';
                    alertPaid.innerHTML=paidText;
                    renderBtn = Button();
                    renderBtn=Div(alertPaid);
									}
									else{
										renderBtn.create('Versa la tua quota', 'ui', 'SqueezolPay_');
										renderBtn.get().setAttribute('data-participant', participantId);
										renderBtn.get().setAttribute('data-action', 'P');
										renderBtn.get().className='sq-btn sq-btn-lg';
										renderBtn.regHandler('click', buttonHandler);
                    superTemp = document.createElement('p');
                    superTemp.className='sq-text-left';
                    ttt=document.createTextNode('Versa la tua quota, l\importo verrà scalato dalla carta di credito solo se l\'obiettivo verrà raggiunto');
                    superTemp.appendChild(ttt);
                    ttr = document.createElement('div');
                    ttr.className = 'sq-col-xs-10 sq-col-xs-offset-1 sq-panel sq-panel-info';
                    ttr.appendChild(superTemp);
                    ttr = Div(ttr);
					          ttr.append(renderBtn.wrap(wrapper_btn));
                    renderBtn = DomElement({'el': ttr.get()});
									}
								}
                if(partObj.status=='P' && paidCount==0){
                  paidCount=1;
                  refContainer = Div(document.createElement('div'));
                  refContainer.addClass('sq-row row-separata');
                  textAdd = document.createTextNode('Puoi rimborsare il pagamento, le quote versate torneranno disponibili secondo le tempistiche dell\'istituto bancario emittente della carta.');
                  tDiv = Div(document.createElement('div'));
                  tDiv.addClass('sq-col-md-7 sq-col-xs-10 sq-col-xs-offset-1');
                  tDiv.append(textAdd);
                  renderRef=Button();
						      renderRef.create('Rimborsa', 'small', 'SqueezolRefund_');
						      renderRef.get().setAttribute('data-participant', participantId);
						      renderRef.get().setAttribute('data-action', 'RG');
						      renderRef.get().className='sq-btn sq-btn-sm sq-btn-danger';
						      renderRef.regHandler('click', buttonHandler);
                  refContainer.append(renderRef.wrap(wrapBtn));
                  refContainer.append(tDiv.get());
                  SqDiv.appendChild(refContainer.get());
                }
							}
						}
						else {
							//Attualmente non e' un Button
							renderBtn = document.createElement('div');
							renderBtn.innerHTML = '<div class="sq-alert sq-alert-warning">'+
																		  '<p>'+
																			  '<strong>Attenzione!</strong>'+
									                      'Split scaduto, eventuali pagamenti effettutati verrano rimborsati.'+ 
                                        'Crea un nuovo ordine per rieffettuare l\'acquisto'+
																		  '</p>'+
																		'</div>';
							SqDiv.appendChild(Div(renderBtn).wrap(wrapper_row));
						}
					}
					else {
						if(openPay==true){ //se arriva qui e' gia' openPay=True in teoria
							for(k=0; k<participants.length; k++){
								partObj=participants[k];
								if(partObj.id==participantId) {
									if (partObj.status==='P'){
										alertPaid=document.createElement('div');
                    alertPaid.className='sq-alert sq-alert-success';
                    alertPaid.innerHTML=paidText;
                    renderBtn=Div(alertPaid);
									}
									else{
										renderBtn.create('Versa la tua quota', 'ui', 'SqueezolPay_');
										renderBtn.get().setAttribute('data-participant', participantId);
										renderBtn.get().setAttribute('data-action', 'P');
										renderBtn.get().className='sq-btn';
										renderBtn.regHandler('click', buttonHandler);
										superTemp = document.createElement('p');
                    superTemp.className='sq-text-center';
                    ttt=document.createTextNode('Versa la tua quota, l\importo verrà scalato dalla carta di credito solo se l\'obiettivo verrà raggiunto');
                    superTemp.appendChild(ttt);
                    ttr = document.createElement('div');
                    ttr.className = 'sq-col-xs-10 sq-col-xs-offset-1 sq-panel sq-panel-info';
                    ttr.appendChild(superTemp);
                    ttr = Div(ttr);
					          ttr.append(renderBtn.wrap(wrapper_btn));
                    renderBtn = DomElement({'el': ttr.get()});
									}
								} 
							}
					  }
					}
          
					// Render
          renderDiv=Div(document.createElement('div'));
  			  renderDiv.addClass('sq-row row-separata');
	  		  renderDiv.get().id='squeezolPayBox';

          if (openPay == false && groupStatus == 'WAC') {						
            superTemp = document.createElement('p');
            superTemp.className='sq-text-left';
            ttt=document.createTextNode('Al momento i partecipanti non hanno la possibilita\' di pagare. Clicca su Inizia i pagamenti: sara\' possibile a tutti versare la propria quota (una notifica verra\' inoltrata a tutti i partecipanti!)');
            superTemp.appendChild(ttt);
            ttr = document.createElement('div');
            ttr.id='sq-alert-start-pay';
            superTemp.appendChild(ttt);
            ttr.className = 'sq-col-xs-10 sq-col-xs-offset-1 sq-panel sq-panel-info';
            ttr.appendChild(superTemp);
            ttr = Div(ttr);
						if (isAdmin == true){
							ttr.append(renderBtn.wrap(wrapper_btn));
						}
						/*else {
						  superTemp.append('<p class="sq-text-center">Potrai versare la tua quota quando l\'organizzatore avrà iniziato i pagamenti(una notifica ti verrà inviata per email)</p>');
						}*/
						renderDiv.append(ttr.wrap(wrapper_row));
           // renderDiv.append(renderBtn.wrap(wrapper_right));
					}
          else{
					  renderDiv.append(renderBtn.get());
          }
          if (params.invitation_url && isAdmin && (answer.group.status == 'WPA' || answer.group.status == 'WAC')){
            inviteBtn = Button();
            inviteBtn.create('Invita ancora', 'ui', 'SqueezolInvitation_');
            inviteBtn.get().className='sq-btn sq-btn-lg sq-invita-ancora';
            inviteBtn.regHandler('click', function(){
              window.location.replace(params.invitation_url);
            });
            document.getElementById('sq-append-invitation').appendChild(inviteBtn.wrap(wrapper_row));
          }
          SqDiv.appendChild(renderDiv.get());
				}
				// Group deserted
				else if(answer.group.status == 'DES') {
					renderBtn.create('Split Chiuso', 'big', 'SqueezolDeserted_');
					renderBtn.get().setAttribute('data-participant', participantId)
					renderBtn.get().disabled=true;
					renderBtn.get().className='buttonWarning sq-btn sq-btn-lg';
					alertDes = document.createElement('div');
					alertDes.className = 'sq-row row-separata';
					alertDes.innerHTML = '<div class="sq-col-xs-10 sq-col-xs-offset-1 sq-alert sq-alert-warning"><p>'+
																 '<strong>Attenzione!</strong>'+
																 'Lo Split è stato chiuso dall\'organizzatore o è scaduto il termine di 20 giorni entro i quali effettuare il pagamento. Le quote versate torneranno disponibili al massimo entro 30 giorni dalla data del pagamento.'+
															 '</div></p>';
					SqDiv.appendChild(alertDes);
				}
				// Render Partecipanti
        if (answer.group.hide_invitation == false || isAdmin){
				  ui.drawSeparator('Partecipanti');
				  for (j=0; j<participants.length; j++){
				    part=document.createElement('div');
					  part.className = 'sq-row part';
					  p=participants[j];
            
					  status=this.switchStatus(p.status);
            var img = new Image();
            if(p.avatar_url){
				      avatar_url = p.avatar_url;
            } else {
	            avatar_url = img_url + 'default.jpg';
            } 
					  if (p.status == 'P'){
              if (answer.group.status == 'DES'){
                  state = 'refused';
                  ghianda = 'grigia';
                  status = 'Rimborsato';
              } else {
						      state = 'active';
						      ghianda = 'blu';
              }
					  }
					  else if (p.status == 'A'){
						  state = 'accepted';
						  ghianda = 'grigia';
					  } else if (p.status == 'R'){
              state = 'refused';
						  ghianda = 'grigia';
            }
            if (answer.group.hide_contribution == true && !isAdmin)
              contribution_amount = '-';
            else
              contribution_amount = p.single_amount + ' ' + ui.switchCurrency(answer.group.currency);
					  part.innerHTML= '<div class="sq-col-sm-1 sq-col-sm-offset-1 sq-col-xs-4 sq-col-xs-offset-4">'+
						                  '<img id="thumb'+j+'" class="imgAvatar sq-thumbnail sq-img-responsive" src="'+avatar_url+'" alt="User Avatar"></img>'+
													  '</div>'+
													  '<div class="sq-col-sm-4 sq-col-sm-offset-1 sq-col-xs-10 sq-col-xs-offset-0 sq-has-success">'+
														  '<p class="sq-text-center">'+p.name+'</p>'+
													  '</div>'+
													  '<div class="sq-col-sm-2 sq-col-xs-10">'+
														  '<h4 class="sq-text-center">'+contribution_amount+'</h4>'+
													  '</div>'+
													  '<div class="sq-col-sm-2 sq-col-xs-10">'+
														  '<h4 class="sq-text-center text-step-'+state+'">'+status+'</h4>'+
													  '</div>'+
													  '<div class="sq-col-sm-1 sq-hidden-xs">'+
														  '<img class="sq-img-responsive" src="' + img_url + 'ghianda_step_'+ghianda+'.png">'+
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
						$sqjQuery('#squeezol_view').children().first().remove();
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
          case 'RG':
            location.reload(true);
            break;
				};
				return;
			},
      that.notifyAmount = function(answer) {
        var oldDiv, inputDiv, p, message, quota, currency;
        var ui = UserInterface();
        inputDiv=document.getElementById('squeezol_single_amount');

				p=document.getElementById('squeezolNotifyAmount_');
				if (answer.status == 'ok'){
					message='Importo correttamente modificato';
          currency=inputDiv.nextSibling.innerHTML;
          quota=document.getElementById('sq-modify-amount').innerHTML=inputDiv.value+' '+ui.switchCurrency(currency);
				}
				else if(answer.status == 'error') {
					message=answer.error || answer.message;
				}
				if (p) {
				  p.innerHTML=''
					p.appendChild(document.createTextNode(message));
					if (answer.status == 'error'){
					  p.className = 'sq-alert sq-alert-danger';
				  }
					else {
					  p.className = 'sq-alert sq-alert-success';
				  }
				}
				else{
				  p = document.createElement('div');
					p.id='squeezolNotifyAmount_';
					p.appendChild(document.createTextNode(message));
					inputDiv.parentNode.parentNode.appendChild(p);
					if (answer.status == 'error'){
						p.className = 'sq-alert sq-alert-danger';
					}
					else {
						p.className = 'sq-alert sq-alert-success';
					}
				}
      },
			that.renderGroupData = function(group, params, parent, participants) {
				var groupDigest, status, sqDiv;
				var ui, p, admin_name, participant, testo, classe;
        var totalPaid=0.00;
				var d1=new Date(group.max_payment_date);
        ui = UserInterface();
        sqDiv = document.getElementById('squeezol_view');
        groupDigest=document.createElement('div');
				groupDigest.id = "squeezol_btn_container";
				groupDigest.className = "squeezol_group_box sq-row";
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
        totalPaid=totalPaid.toFixed(2)
        if (group.fundraising == 'D'){
          testo = 'Quota che intendo versare';
        }
        else if (group.fundraising == 'S'){
          testo = 'Quota singola';
        }
        else if (group.fundraising == 'F'){
          testo = 'Quota fissa';
        }
        if (participant.status == 'P'){
          classe = 'target-P';
          testo = 'Quota pagata';
        }
        else if(participant.status == 'A'){
          classe='box-blu-digest';
        }
        else
          classe='target-R';
        groupDigest.innerHTML= '<div class="sq-col-xs-10 sq-col-xs-offset-1 sq-col-md-7 sq-col-md-offset-1 sq-col-left">'+
                                 '<p class="sq-content-title">'+ group.name +'<p>'+
                               '</div>'+
                               '<div class="sq-col-xs-10 sq-col-xs-offset-1 sq-col-md-4 sq-col-md-offset-0">'+
                                 '<p class="sq-content-body sq-text-center">Organizzatore:</p>'+  
                                 '<strong>'+admin_name+'</strong>'+
                               '</div>';
				groupDigest=Div(groupDigest);
				sqDiv.appendChild(groupDigest.get());
        groupDigest=document.createElement('div');
				groupDigest.className = "sq-row row-separata";
        groupDigest.innerHTML = '<div class="sq-col-md-10 sq-col-md-offset-1">'+
                                  '<div class="sq-row withPaddedBorder">'+
                                    '<div class="sq-col-md-4">'+
                                      '<div class="sq-row">'+
                                        '<h4>TERMINA FRA</h4>'+
                                        '<div class="sq-col-md-4 sq-col-sm-2 sq-col-xs-4 sq-no-pad">'+
                                          '<p class="sq-target-small">'+params.daysLeft+' G</p>'+
                                        '</div>'+
                                        '<div class="sq-col-md-4 sq-col-sm-2 sq-col-xs-4 sq-no-pad">'+
                                          '<p class="sq-target-small">'+params.hoursLeft+' H</p>'+
                                        '</div>'+
                                        '<div class="sq-col-md-4 sq-col-sm-2 sq-col-xs-4 sq-no-pad">'+
                                          '<p class="sq-target-small">'+params.minutesLeft+' M</p>'+
                                        '</div>'+
                                      '</div>'+
																			'<p class="sq-content-body">Il '+d1.getDate()+'.'+(parseInt(d1.getMonth())+1).toString()+'.'+d1.getFullYear()+'</p>'+
                                    '</div>'+
                                    '<div class="sq-col-md-4">'+
                                      '<div class="sq-row">'+
                                        '<p class="sq-text-center">'+
                                          'totale: <strong>'+ group.amount+' '+ui.switchCurrency(group.currency)+'</strong>'+
                                        '</p>'+
                                      '</div>'+
                                      '<div class="sq-progress-radial-container">'+
                                        '<div class="sq-progress-radial sq-progress-'+params.totalPerc+'">'+
                                          '<div class="sq-overlay">'+totalPaid+' '+ui.switchCurrency(group.currency)+
                                          '</div>'+
                                        '</div>'+
                                      '</div>'+
                                    '</div>'+
                                    '<div class="sq-col-md-4 '+classe+'" id="sq-append-invitation">'+
                                      '<p class="sq-text-center">'+
                                        testo+
                                      '</p>'+
                                      '<p class="sq-text-center sq-quota" id="sq-modify-amount">'+
                                          parseFloat(participant.single_amount).toFixed(2)+' '+ui.switchCurrency(group.currency)+
                                      '</p>'+
                                    '</div>'+
                                  '</div>'+
                                '</div>';
        groupDigest=Div(groupDigest);
				sqDiv.appendChild(groupDigest.get());
			},
			that.POSTcallback = function(answer, action, targetUrl){
				var oldBtn, parentDiv, payBox, payBoxP, alertPaid, renderBtn;
        var renderButton=Button();
				var participantId, form, sq_message, superTemp, ttt, ttr;
				if (action == 'OPENPAY'){
					oldBtn = document.getElementById('SqueezolStartPay_');
					participantId = oldBtn.getAttribute('data-participant');
					parentDiv = oldBtn.parentNode;
					parentDiv.removeChild(oldBtn);
          sq_message=document.getElementById('sq-alert-start-pay');
          parentDiv=sq_message.parentNode;
          parentDiv.removeChild(sq_message);
          parentDiv=document.getElementById('squeezolPayBox');
          parentDiv.innerHTML='';
					renderButton.create('Versa la tua quota', 'ui', 'SqueezolPay_');
					renderButton.get().setAttribute('data-action', 'P');
          renderButton.get().setAttribute('data-participant', participantId);
					renderButton.regHandler('click', function(e){
			      var event= e || window.event;
			      var target = event.target || event.srcElement || event.originalTarget;
			      request = DigestPostAJAX(answer.group_id, target, targetUrl);
			      request.send(target);
				  });
          renderButton.addClass('sq-btn')
        
          superTemp = document.createElement('p');
          superTemp.className='sq-text-center';
          ttt=document.createTextNode('Versa la tua quota, l\importo verrà scalato dalla carta di credito solo se l\'obiettivo verrà raggiunto');
          superTemp.appendChild(ttt);
          ttr = document.createElement('div');
          superTemp.appendChild(ttt);
          ttr.className = 'sq-col-xs-10 sq-col-xs-offset-1 sq-panel sq-panel-info';
          ttr.appendChild(superTemp);
          ttr = Div(ttr);
					ttr.append(renderButton.wrap({wrapper: 'div', className: 'sq-col-sm-4 sq-col-sm-offset-4 sq-col-xs-12 sq-col-xs-offset-0'}));
          parentDiv.appendChild(ttr.get());
				}
				else if (action == 'FINISH'){
					oldBtn = document.getElementById('SqueezolFinishPay_');
					payBox = document.getElementById('squeezolPayBox');
					participantId = oldBtn.getAttribute('data-participant');
          parentDiv = oldBtn.parentNode.parentNode;
          parentDiv.removeChild(oldBtn.parentNode.nextSibling);
          parentDiv.removeChild(oldBtn.parentNode);
					alertPaid=document.createElement('div');
          alertPaid.className='sq-alert sq-alert-success';
          alertPaid.innerHTML='<p class="sq-text-center">'+
															  '<strong> Congratulazioni! pagamento effettuato, </strong>'+
																'lo split si è concluso con successo!'+
															'</p>';
          renderBtn=Div(document.createElement('div'));
          renderBtn.append(alertPaid);
					payBoxP = payBox.parentNode;
					payBoxP.removeChild(payBox);
          renderBtn.get().setAttribute('data-participant', participantId);
				  parentDiv.appendChild(renderBtn.get());
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
        }
        return;
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
						gr_status='Split Completato';
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
    var PostMessageReceiver = function(e) {
      var DecodedString=decodeURIComponent(e.data);
      var data=JSON.parse(DecodedString);
      var authModal;
      if (data.action == 'delete-social'){
        $sqjQuery('#social-login').remove();
      }
      else if (data.action == 'close-pop'){
        window.location.replace(auth_url+'?'+data.code);
      }
      else if (data.action == 'facebook'){
        authModal = $sqjQuery('#facebookModal');
        authModal.modal('hide');
        if (data.fbList)
          notifyFacebookPostMessage(data.fbList);
      }
    }
    var notifyFacebookPostMessage = function(fbList){
			var container = document.getElementById('containerCronologia')
			var alreadyInvited = container.getElementsByClassName('sq-fb-element');
			var currSent, inv, div;
      var found = false;
      console.log(fbList);
			for (var i=0; i<fbList.length; i++){
        div = document.createElement('div');
			  div.className = 'sq-row sq-fb-element';
				currSent = fbList[i];
				for (var j=0; j<alreadyInvited.length; j++) {
					inv = alreadyInvited[j].getElementsByTagName('input')[0];
          if (inv.value == currSent.id) {
            found = true;
          }
        }  
		  	if (found==false) {
					if(currSent.avatar_url){
					  div.innerHTML='<div class="sq-col-md-1 sq-col-md-offset-1 sq-hidden-xs"><img class="sq-thumbnail imgAvatar" src="'+invObj.avatar_url+'" alt="User Avatar"></img></div>';
				  }
				  else {
					  div.innerHTML='<div class="sq-col-md-1 sq-col-md-offset-1 sq-hidden-xs"><img class="imgAvatar sq-thumbnail" src="' + img_url + 'facebook_small.png" alt="User Avatar"></img> </div>';
				  }
				  if(currSent.id) {
					  div.className = 'sq-row sq-fb-element';
					  div.innerHTML += '<div class="sq-col-xs-10 sq-col-xs-offset-1 sq-col-md-4 sq-col-md-offset-0 sq-has-success sq-input-group"> <input type="hidden" class="fbEntry sq-form-control" value="'+currSent.id+'"disabled></input>'+
											   		   '<input value="'+currSent.name+'" class="sq-form-control" type="text" name="email"  disabled>'+
                               '<span class="sq-input-group-addon sq-glyph-ok sq-check"></span>'+
													   '</div>';
				  }
					container.appendChild(div);
				} 
			}
		}
    // API Call
    window.SqueezolApi = {
			createSqButton: function(targetUrl, size, access_token) {
				var tmpBtn, btn, div, txt;
				var popupWin, m;
				var ui=UserInterface();
        var sqLoading = Div(document.getElementById('sq-loading'));
        tmpBtn=document.createElement('div');
				tmpBtn.innerHTML = '<img src="' + img_url + 'pay_button2.png"></img>';
				btn = Div(tmpBtn);
				btn.addClass('squeezol_button_'+size)
				btn.regHandler('click', function() {
					popupWin = ui.PopupCenter(targetUrl, "sq_login", 600, 550);
				});
				div = Div();
				div.get('squeezol_btn');
        sqLoading.remove();
				div.append(btn.get());
        if(window.addEventListener){
          window.addEventListener("message", PostMessageReceiver,false);
        }else if(window.attachEvent){
          window.attachEvent("onmessage", PostMessageReceiver);
        }
        if(access_token != "")
          window.location.replace(targetUrl);
        else
          popupWin = ui.PopupCenter(targetUrl, "sq_login", 600, 550);
        
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
}(jQuery);
