(function() {
	function $(selector, context) {
		return Array.prototype.slice.call((context || document).querySelectorAll(selector));
	}
	
	function parseOptions(options, defaults) {
		((typeof options == "object" && options) || (options = {}));
		
		for(var def in defaults) {
			if(!options.hasOwnProperty(def)) {
				options[def] = defaults[def];
			}
		}
		
		return options;
	}
	
	function isNum() {
		for(var a in arguments) {
			if(typeof (a = arguments[a]) != "number" || isNaN(a) || Math.abs(a) >= Infinity) {
				return false;
			}
		}
		return true;
	}
	
	function parseSelector(selector) {
		var parsed = { attribs: {}, classes: [] };
		
		selector.match(/(\[[^\]]+\]|#[^#.\[]+|\.[^#.\[]+|\w+)/g)
		.forEach(function(match) {
			switch(match[0]) {
				case "[":
					var m = match.match(/^\[([^=\]]+)=?([^\]]+)?\]$/);
					parsed.attribs[m[1]] = m[2] || "";
					break;
					
				case ".":
					parsed.classes.push(match.substr(1));
					break;
					
				case "#":
					parsed.id = match.substr(1);
					break;
					
				default:
					parsed.tag = match;
			}
		});
		
		return parsed;
	}
	
	function Element(selector, options) {
		options = parseOptions(options, {
			appendTo: null,
			context: document,
			format: "YYYY-MM-DDDD",
			html: "",
			insertAfter: null,
			insertBefore: null,
			replace: null
		});
		
		var rules = parseSelector(selector), attr, elem;
		elem = this.domElement = options.context.createElement(rules.tag);
		this.parent = null;
		
		// Add classes
		rules.classes.forEach(function(className) {
			elem.classList.add(className);
		});
		
		// Add attributes
		for(attr in rules.attribs) {
			if(rules.attribs.hasOwnProperty(attr)) {
				elem.setAttribute(attr, rules.attribs[attr]);
			}
		}
		
		// Add inner HTML
		elem.innerHTML = options.html;
		
		// Add element to DOM
		if(options.replace) {
			options.replace.parentNode.replaceChild(elem, options.replace);
		} else if(options.appendTo) {
			(this.parent = options.appendTo).domElement.appendChild(elem);
		} else if(options.insertAfter) {
			options.insertAfter.parentNode.insertBefore(elem, options.insertAfter.nextSibling);			
		} else if(options.insertBefore) {
			options.insertBefore.parentNode.insertBefore(elem, options.insertBefore);
		}
	}
	
	Element.prototype = {
		add: function(elements, clear) {
			(clear === true && (this.clear()));
			
			(elements instanceof Array ? elements : [ elements ])
			.forEach(function(element) {
				this.domElement.appendChild(element.domElement);
				element.parent = this;
			}, this);
			
			return this;
		},
		get classes() {
			return this.domElement.classList;
		},
		clear: function() {
			var elem = this.domElement, child;
			
			while((child = elem.firstChild)) {
				elem.removeChild(child);
			}
			
			return this;
		},
		on: function(event, callback) {
			this.domElement.addEventListener(event, callback);
			return this;
		}
	};
	
	function δ(date) {
		return {
			compare: function(arg) {
				var result = 0, f, fragments = [ "getFullYear", "getMonth", "getDate", "getHours", "getMinutes", "getSeconds" ];
				
				for(f in fragments) {
					if(date[fragments[f]]() == arg[fragments[f]]()) {
						result = ++f;
					} else break;
				}
				
				return result;
			},
			get days() {
				return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
			},
			get firstDay() {
				return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
			},
			get week() {
				var d = new Date(date);
				d.setHours(0, 0, 0);
				d.setDate(d.getDate() + 4 - (d.getDay() || 7));
				return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 86400000) + 1) / 7);
			}
		};
	}
	
	function ε(selector, options) {
		return new Element(selector, options);
	}
	
	function ϝ(date, format, locale) {
		var d = date.getDate(),
			m = date.getMonth(),
			y = date.getFullYear(),
			h = date.getHours(),
			n = date.getMinutes(),
			s = date.getSeconds(),
			w = δ(date).week,
			wd = date.getDay(),
			ap = h < 12 ? "㏂" : "㏘";
			
		return format
		.replace(/{ww}/gi, ("0" + w).slice(-2))
		.replace(/{w}/gi, w)
		.replace(/{DDDD}/g, locale.dayOfWeek[wd])
		.replace(/{DDD}/g, locale.dayOfWeekShort[wd])
		.replace(/{DD}/g, ("0" + d).slice(-2))
		.replace(/{D}/g, d)
		.replace(/{MMMM}/g, locale.monthName[m])
		.replace(/{MMM}/g, locale.monthNameShort[m])
		.replace(/{MM}/g, ("0" + (m + 1)).slice(-2))
		.replace(/{M}/g, m + 1)
		.replace(/{YYYY}/g, y)
		.replace(/{YY}/g, y.toString().slice(-2))
		.replace(/{HH}/g, ("0" + h).slice(-2))
		.replace(/{H}/g, h)
		.replace(/{hh}/g, ("0" + (h % 12)).slice(-2))
		.replace(/{h}/g, h % 12)
		.replace(/{mm}/g, ("0" + n).slice(-2))
		.replace(/{m}/g, n)
		.replace(/{ss}/g, ("0" + s).slice(-2))
		.replace(/{s}/g, s)
		.replace(/{ap}/g, ap);
	}
	
	function dayTable(year, month) {
		var firstDay = δ(new Date(year, month)).firstDay || 7,
			current = new Date(year, month, 1 - ((firstDay - 1) || 7)),
			row, col, table = [];
			
		for(row = 0; row < 6; ++row) {
			table.push([]);
			
			for(col = 0; col < 7; ++col) {
				table[row].push(new Date(current)); 
				current.setDate(current.getDate() + 1);
			}
		}
		
		return table;
	}
	
	function monthTable(year) {
		var row, col, table = [];
		
		for(row = 0; row < 3; ++row) {
			table.push([]);
			
			for(col = 0; col < 4; ++col) {
				table[row].push(new Date(year, (row * 4) + col));
			}
		}
		
		return table;
	}
	
	function _(selector, options) {
		options = parseOptions(options, {
			className: "chronopic",
			format: null,
			locale: "en_GB",
			max: { year: 9999 },
			min: { year: 0 },
			onChange: null
		});
		
		this.instances = [];
		this.i18n = _.i18n.en_GB;
		this.max = (typeof options.max == 'object' ? options.max : {});
		this.min = (typeof options.min == 'object' ? options.min : {});
		
		var now = new Date(), self = this;
		
		function valid(year, month, day) {
			var days, min = self.min, max = self.max;
			while(day > (days = δ(new Date(year, month, day)).days)) { ++month; day -= day - days; }
			while(month > 12) { ++year; month -= 12; }
			
			if(isNum(year)) {
				if((isNum(min.year) && year < min.year)
				|| (isNum(max.year) && year > max.year)) {
					return false;
				}
				
				if(isNum(month)) {
					if((isNum(min.month) && month < min.month && year <= min.year)
					|| (isNum(max.month) && month > max.month && year >= max.year)) {
						return false;
					}
					
					if(isNum(day)) {
						if((isNum(min.day) && day < min.day && month <= min.month && year <= min.year)
						|| (isNum(max.day) && day > max.day && month >= max.month && year >= max.year)) {
							return false;
						}
					}
				}
			}
				
			return true;
		}
		
		(typeof selector == "string" ? $(selector) : [ selector ])
		.forEach(function(element) {
			if(element instanceof HTMLElement) {
				var sibling = element.nextSibling;
				((sibling.tagName == "DIV" && sibling.classList.contains(options.className)) || (sibling = null));
				
				var className = options.className,
					container = ε("div." + className, { insertAfter: element, replace: sibling }),
					instance,
					self = this,
					tables = {};
					
				[ "day", "month" ].forEach(function(table) {
					container.add((tables[table] = ε("table.hidden." + table)));
					tables[table].head = ε("thead", { appendTo: tables[table] });
					tables[table].body = ε("tbody", { appendTo: tables[table] });
				});
				
				this.instances.push((instance = {
					date: new Date(now.getFullYear(), now.getMonth()),
					container: container,
					element: element,
					selected: {},
					tables: tables,
					visible: false,
					
					get day() {
						return this.date.getDate();
					},
					set day(value) {
						if(valid(this.date.getFullYear(), this.date.getMonth() + 1, value)) {
							this.date.setDate(value);
							this.selected.day = new Date(this.date);
							this.element.value = options.format ? ϝ(this.date, options.format, self.i18n) : this.date.toDateString();
							this.hide();
							
							if(typeof options.onChange == 'function') {
								options.onChange(element, this.date);
							}
						}
					},
					hide: function() {
						for(var t in tables) {
							tables[t].classes.add("hidden");
						}
						
						if(this.selected.day) {
							this.date = new Date(this.selected.day);
							this.selected.month = new Date(this.date);
						} else this.selected.month = null;
						
						this.visible = false;
					},
					get month() {
						return this.date.getMonth();
					},
					set month(value) {
						if(valid(this.date.getFullYear(), value + 1)) {
							this.date.setMonth(value);
							this.selected.month = new Date(this.date);
							this.show("day");
						}
					},
					rebuild: function(table) {
						var instance = this,
							sel = instance.selected,
							now = new Date(),
							dow = 1,
							lables, i;
							
						if(!table || table == "day") {
							instance.tables.day.head.add([
								ε("tr.title").add([
									ε("th.prev[title=" + self.locale.prevMonth + "]", { html: "&lt;" })
									.on("click", function(e) { instance.month--; e.stopPropagation(); }),
									ε("th[colspan=6][title=" + self.locale.selectMonth + "]", { html: ϝ(instance.date, self.locale.formatMonth, self.locale) })
									.on("click", function() { instance.show("month"); }),
									ε("th.next[title=" + self.locale.nextMonth + "]", { html: "&gt;" })
									.on("click", function(e) { instance.month++; e.stopPropagation(); })
								]),
								(lables = ε("tr.labels").add(ε("th.week", { html: self.locale.week })))
							], true);
							
							for(i = 0; i < 7; ++i) {
								lables.add(ε("th.day[title=" + self.locale.dayOfWeek[dow % 7] + "]", { html: self.locale.dayOfWeekShort[dow++ % 7] }));
							}
							
							instance.tables.day.body.clear();
							dayTable(instance.year, instance.month).forEach(function(row) {
								var tr = ε("tr", { appendTo: instance.tables.day.body });
								tr.add(ε("td.week", { html: δ(row[0]).week }));
								
								row.forEach(function(col) {
									var classNames = ".day",
										monthDiff = col.getMonth() - instance.month,
										disabled = !valid(col.getFullYear(), col.getMonth() + 1, col.getDate()),
										elem;
										
									((monthDiff == -1 || monthDiff == 11) && (classNames += ".prev"));
									((monthDiff == 1 || monthDiff == -11) && (classNames += ".next"));
									(sel.day && δ(sel.day).compare(col) >= 3 && (classNames += ".selected"));
									(disabled && (classNames += ".disabled"));
									(δ(col).compare(now) >= 3 && (classNames += ".now"));
									
									tr.add((elem = ε("td[title=" + ϝ(col, self.locale.formatDay, self.locale) + "]" + classNames, { html: col.getDate() })));
									(!disabled && elem.on("click", function() { instance.month = col.getMonth(), instance.day = col.getDate(); }));
								});
							});
						}
						
						if(!table || table == "month") {
							instance.tables.month.head.add([
								ε("tr.title").add([
									ε("th.prev[title=" + self.locale.prevYear + "]", { html: "&lt;" })
									.on("click", function(e) { instance.year--; e.stopPropagation(); }),
									ε("th.year[colspan=6][title=" + self.locale.year + "]").add(
										ε("input[type=number][step=1][min=" + (self.min.year || 0) + "][max=" + (self.max.year || 9999) + "][value=" + instance.year + "]")
										.on("change", function(e) { instance.year = e.target.value; })
									),
									ε("th.next[title=" + self.locale.nextYear + "]", { html: "&gt;" })
									.on("click", function(e) { instance.year++; e.stopPropagation(); })
								]),
							], true);
							
							instance.tables.month.body.clear();
							monthTable(instance.year).forEach(function(row) {
								var tr = ε("tr", { appendTo: instance.tables.month.body });
								
								row.forEach(function(col) {
									var classNames = ".month",
										month = col.getMonth(),
										disabled = !valid(col.getFullYear(), month + 1),
										elem;
									
									(sel.month && δ(sel.month).compare(col) >= 2 && (classNames += ".selected"));
									(disabled && (classNames += ".disabled"));
									(δ(col).compare(now) >= 2 && (classNames += ".now"));
									
									tr.add((elem = ε("td[colspan=2][title=" + self.locale.monthName[month] + "]" + classNames, { html: self.locale.monthNameShort[month] })));
									(!disabled && elem.on("click", function() { instance.month = month; }));
								});
							});
						}
						
						return this;
					},
					show: function(table) {
						(table || (table = "day"));
						this.rebuild(table);
						this.visible = true;
						
						for(var t in tables) {
							if(tables.hasOwnProperty(t)) {
								tables[t].classes[(t == table ? "remove" : "add")]("hidden");
							}
						}
						
						var container = this.container.domElement, elem = this.element;
						container.style.top = elem.offsetTop + elem.offsetHeight + "px";
						container.style.left = elem.offsetLeft + "px";
						
						if(container.offsetWidth < elem.offsetWidth) {
							container.style.width = elem.offsetWidth + "px";
						}
					},
					get year() {
						return this.date.getFullYear();
					},
					set year(value) {
						if(valid(value)) {
							this.date.setFullYear(value);
							this.show("month");
						}
					}
				}));
				
				element.addEventListener("click", function(e) {
					instance[(instance.visible ? "hide" : "show")]();
				});
				
				document.addEventListener("click", function(e) {
					var node = e.target;
					
					while(node) {
						if(node == element || node == container.domElement) {
							return;
						}
						
						node = node.parentNode;
					}
					
					instance.hide();
				});
			}
		}, this);
		
		this.locale = options.locale;
	}
	
	_.prototype = {
		get locale() {
			return this.i18n;
		},
		set locale(value) {
			if(_.i18n[value] && (_.i18n[value] !== this.i18n)) {
				this.i18n = _.i18n[value];
				
				this.instances.forEach(function(instance) {
					(instance.selected.day && (instance.day = instance.date.getDate()));
					instance.rebuild();
				});
			}
		}
	};
	
	_.i18n = {
		en_GB: {
			dayOfWeek:		[ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
			dayOfWeekShort:	[ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
			disabled:		"Disabled",
			formatDay:		"{DDDD} {D}. {MMMM} {YYYY}",
			formatMonth:	"{MMMM} {YYYY}",
			month:			"Month",
			monthName:		[ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
			monthNameShort:	[ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
			nextMonth:		"Next month",
			nextYear:		"Next year",
			prevMonth:		"Previous month",
			prevYear:		"Previous year",
			selectMonth:	"Select month",
			week:			"Week",
			year:			"Year"
		}
	};
	
	if(typeof window != "undefined") {
		window.Chronopic = _;
	}
	
	if(typeof module == "object" && module.exports) {
		module.exports = _;
	}
	
	return _;
})();
