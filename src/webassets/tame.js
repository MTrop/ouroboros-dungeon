
/*************************************************************************
 * TAME Engine v0.9BETA19
 * (C) 2016-2019 Matthew Tropiano
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the GNU Lesser Public License v2.1
 * which accompanies this distribution, and is available at
 * http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html
 * 
 * https://tame-if.com
 * @license
 *************************************************************************/

/*****************************************************************************
 * TAME.newResponseHandler(options)
 *****************************************************************************
 * Factory function - creates a new response handler (for aiding in browser functions).
 * Handles all standard cues and provides a way via a function to handle other cues.
 * This accumulates the results of contiguous "text" and "textf" cues before "print()" is called.
 * 
 * @param options options object, consisting of the following optional fields that reference functions:
 * 		print: fn(text)
 * 			Called when a string needs printing (may contain HTML or other things).
 * 		onStart: fn()
 * 			Called before cues start processing.
 * 			Should disable input.
 * 		onEnd: fn()
 * 			Called when cues stop processing, and the end is reached.
 * 			Should enable input.
 * 		onSuspend: fn()
 * 			Called when a call to process a cue initiates a suspension (processing stops, but not due to a pause).
 * 			Should disable input.
 * 		onResume: fn()
 * 			Called when cues process again.
 * 			Should disable input.
 * 		onPause: fn()
 * 			Called after a "pause" cue is processed. 
 * 			Should prompt for continuation somehow, then call resume() after the user "continues."
 * 		onQuit: fn()
 * 			Called after a "quit" cue is processed.
 * 			Should stop input and prevent further input. 
 * 		onError: fn(message)
 * 			Called after an "error" cue is processed.
 * 			Should make an error message appear on screen. Dismissable.
 * 				message: (string)
 * 					The message to display. 
 * 		onFatal: fn(message)
 * 			Called after a "fatal" cue is processed.
 * 			Should make a message appear on screen, and stop input as though a "quit" occurred. 
 * 				message: (string)
 * 					The message to display. 
 * 		onTrace: fn(type, content)
 * 			Called after a "trace" cue is processed.
 * 				type: (string)
 * 					The tracing type (internal, function, ... etc.). 
 * 				content: (string)
 * 					The trace message content. 
 * 		onOtherCue: fn(cueType, cueContent) 
 * 			Called when a cue that is not handled by this handler needs processing. 
 * 			Should return boolean. true = keep going, false = suspend (until resume() is called).
 * 				cueType: (string)
 * 					The cue type. 
 * 				cueContent: (string)
 * 					The cue content. 
 * 		onStartFormatTag: fn(tagname, accum)
 * 			Called when a formatted string (TEXTF) starts a tag.
 * 				tagname: (string)
 * 					the tag that is being started.
 * 				accum: (Array)
 * 					the accumulator to add the output to (combined into one print() call after formatting).
 * 		onEndFormatTag: fn(tagname, accum)
 * 			Called when a formatted string (TEXTF) ends a tag.
 * 				tagname: (string)
 * 					the tag that is being started.
 * 				accum: (Array)
 * 					the accumulator to add the output to (combined into one print() call after formatting).
 * 		onFormatText: fn(text, accum)
 * 			Called when a formatted string (TEXTF) needs to process text.
 * 				text: (string)
 * 					the text that is being formatted.
 * 				accum: (Array)
 * 					the accumulator to add the output to (combined into one print() call after formatting).
 * 
 * @return (TResponseHandler) 
 * 		a new response handler that calls the provided functions during response read.
 *
 * 
 *****************************************************************************
 * TResponseHandler.reset()
 *****************************************************************************
 * Resets the cue read state.
 * 
 * 
 *****************************************************************************
 * TResponseHandler.prepare(response)
 *****************************************************************************
 * Prepares the response for read.
 * 
 * @param response (TResponse)
 * 		the response from a TAME.initialize(...) or TAME.interpret(...) call.
 * 
 * 
 *****************************************************************************
 * TResponseHandler.resume()
 *****************************************************************************
 * Resumes reading the response.
 * Will return once reading is suspended or ends.
 * See prepare(response) for starting.
 * 
 * @return true if more unprocessed cues remain, or false if not. 
 * 
 * 
 *****************************************************************************
 * TResponseHandler.process(response)
 *****************************************************************************
 * Prepares the response for read and calls resume.
 * Convenience for: 
 * this.prepare(response);
 * this.resume();
 *
 * @param response (TResponse)
 * 		the response from a TAME.initialize(...) or TAME.interpret(...) call.
 * 
 * @return true if more unprocessed cues remain, or false if not. 
 * 
 * 
 *****************************************************************************
 * TAME.readModule(dataView)
 *****************************************************************************
 * Creates a new module from a DataView.
 * 
 * @param dataView (DataView) 
 * 		a DataView wrapping the serialized module.
 * 
 * @return (TModule) 
 * 		a deserialized module.
 *
 * 
 *****************************************************************************
 * TAME.newContext(module)
 *****************************************************************************
 * Creates a new context for a module.
 * 
 * @param module (TModule) 
 * 		the TAME module to create a context for.
 * 
 * @return (TModuleContext) 
 * 		a new module context, or null if no usable module.
 * 
 * 
 *****************************************************************************
 * TAME.initialize(context, traceTypes)
 *****************************************************************************
 * Initializes a context. Must be called after a new context and game is started.
 * 
 * @param context (TModuleContext) 
 * 		the module context.
 * @param traceTypes 
 * 		(boolean) if true, add all trace types, false for none.
 * 		(Array) list of tracing types (case-insensitive).
 * 		(Object) map of tracing types (case-insensitive).
 * 
 * @return (TResponse) 
 * 		the response from the initialize.
 * 
 * 
 *****************************************************************************
 * TAME.interpret(context, inputMessage, traceTypes)
 *****************************************************************************
 * Interprets and performs actions.
 * 
 * @param context (TModuleContext) 
 * 		the module context.
 * @param inputMessage (string) 
 * 		the input message to interpret (usually typed by the user).
 * @param traceTypes 
 * 		(boolean) if true, add all trace types, false for none.
 * 		(Array) list of tracing types (case-insensitive).
 * 		(Object) map of tracing types (case-insensitive).
 * 
 * @return (TResponse) 
 * 		the response.
 * 
 * 
 *****************************************************************************
 * TAME.inspect(context, elementIdentity, variable)
 *****************************************************************************
 * Inspects an element or element's value.
 * 
 * @param context (TModuleContext) 
 * 		the module context.
 * @param elementIdentity (string) 
 * 		the identity of a non-archetype element.
 * @param variable (string) [OPTIONAL] 
 * 		the name of the variable to inspect.
 *  
 * @return (Object) 
 * 		the queried identifiers as keys with debug strings as values.
 * 
 *****************************************************************************
 * TAME.parseFormatted(content, startFormatTag, endFormatTag, formatText)
 *****************************************************************************
 * Assists in parsing a cue with formatted text (TEXTF cue), or one known to have formatted text.
 * The target functions passed in are provided an accumulator array to push generated text into. 
 * On return, this function returns the accumulator's contents joined into a string.
 * 
 * @param sequence (string) 
 * 		the character sequence to parse.
 * @param tagStartFunc fn(tagName, accum) 
 * 		the function called on tag start. arguments: tagName (string), accumulator (Array)  
 * @param tagEndFunc fn(tagName, accum) 
 * 		the function called on tag end. arguments: tagName (string), accumulator (Array)
 * @param textFunc fn(text, accum)
 * 		the function called on tag contents. arguments: text (string), accumulator (Array)
 * 
 * @return (string) 
 * 		the full accumulated result.  
 *
 *****************************************************************************/
let TAME = (function(_TAMEENVCTX)
{

this.version = "0.9BETA19";

	let tameSelf = this;


/*****************************************************************************
 Utilities
 *****************************************************************************/
var Util = {};

// Nanosecond time (for timing stuff). Resolution varies by environment.
// Stub here.
Util.nanoTime = null;

// Smarter foreach.
Util.each = function(obj, func)
{
	for (let x in obj) 
		if (obj.hasOwnProperty(x)) 
			func(obj[x], x, obj.length);
};

// String format ({Number}) 
Util.format = function( /* str, args ... */ )
{
	if (!arguments.length)
		return null;
	
	let str = arguments[0];
	let args = Array.prototype.slice.call(arguments, 1);
	
    for (let key in args) 
        str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
    
    return str;
};

// String compare.
// Adapted from Java - java.lang.String.compareTo(String).
Util.strcmp = function(s1, s2)
{
    let len1 = s1.length;
    let len2 = s2.length;
    let lim = Math.min(len1, len2);
    let k = 0;
    while (k < lim)
    {
        let c1 = s1.charCodeAt(k);
        let c2 = s2.charCodeAt(k);
        if (c1 != c2) 
            return c1 - c2;
        k++;
    }
    return len1 - len2;
};

// Array remove
Util.arrayRemove = function(arr, obj)
{
	for (let i = 0; i < arr.length; i++) 
		if (arr[i] == obj)
		{
			arr.splice(i, 1);
			return true;
		}
	
	return false;
};

// Adds a string to a lookup hash.
Util.objectStringAdd = function(hash, identity, str)
{
	let arr = hash[identity];
	if (!arr)
		arr = hash[identity] = {};
	if (!arr[str])
		arr[str] = true;
};

// Remove a string from a lookup hash.
Util.objectStringRemove = function(hash, identity, str)
{
	let arr = hash[identity];
	if (!arr)
		return;
	if (arr[str])
		delete arr[str];
};

// Checks if a string is in a lookup hash.
// True if contained, false if not.
Util.objectStringContains = function(hash, identity, str)
{
	let arr = hash[identity];
	return (arr && arr[str]);
};

// isArray - tests if an object is an array.
Util.isArray = function(obj)
{
	return Object.prototype.toString.call(obj) === '[object Array]';
};

//isObject - tests if an object is an object.
Util.isObject = function(obj)
{
	return Object.prototype.toString.call(obj) === '[object Object]';
};

//isObject - tests if an object is an object.
Util.isFunction = function(obj)
{
	return Object.prototype.toString.call(obj) === '[object Function]';
};

// Mapify - [object, ...] to {object.memberKey -> object, ...}
Util.mapify = function(objlist, memberKey, multi) 
{
	let out = {}; 
	for (let x in objlist) 
		if (objlist.hasOwnProperty(x))
		{				
			let chain = out[objlist[x][memberKey]];
			if (multi && chain)
			{
				if (Util.isArray(chain))
					chain.push(objlist[x]); 
				else
					out[objlist[x][memberKey]] = [out[objlist[x][memberKey]], objlist[x]]; 
			}
			else
				out[objlist[x][memberKey]] = objlist[x]; 
		}
	return out;
};

// Pairify - [object, ...] to {object.memberKey -> object.memberValue, ...}
Util.pairify = function(objlist, memberKey, memberValue, multi) 
{
	let out = {}; 
	for (let x in objlist) 
		if (objlist.hasOwnProperty(x))
		{				
			let chain = out[objlist[x][memberKey]];
			if (multi && chain)
			{
				if (Util.isArray(chain))
					chain.push(objlist[x][memberValue]); 
				else
					out[objlist[x][memberKey]] = [out[objlist[x][memberKey]], objlist[x][memberValue]]; 
			}
			else
				out[objlist[x][memberKey]] = objlist[x][memberValue]; 
		}
	return out;
};

// replaceall - Return a string that replaces all matching patterns in inputstr with replacement
Util.replaceAll = function(inputstr, expression, replacement) 
{
	return inputstr.replace(new RegExp(expression, 'g'), replacement);
};

// withEscChars - Return a string that includes its escape characters.
Util.withEscChars = function(text) 
{
	let t = JSON.stringify(text);
	return t.substring(1, t.length - 1);
};

// formatDate - Return a string that is a formatted date. Similar to SimpleDateFormat in Java.
Util.formatDate = function(date, formatstring) 
{
	// Enumerations and stuff.
	let DEFAULT_LOCALE = 
	{
		"dayInWeek": [
			['S', 'M', 'T', 'W', 'T', 'F', 'S'],
			['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
			['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
			['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
		],
		"monthInYear": [
			['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // MMM
			['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] // MMMM
		]
	};

	let _PAD = function(value, len)
	{
		value = parseInt(value, 10);
		let out = '';
		do {
			out = value % 10 + out;
			value = Math.floor(value / 10);
			len--;
		} while (value > 0);

		while (len-- > 0)
			out = '0' + out;

		return out;
	};

	// The regular expression for finding all pertinent tokens.
	let _DATEFORMATREGEX = /e+|E+|y+|M+|d+|w+|W+|a+|A+|h+|H+|k+|K+|m+|s+|S+|z+|Z+|X+|'.*'/g;

	/* Mapping of token types to value function. All return strings. */
	// TODO: Finish this.
	let _TOKENFUNCS =
	{
		"e": function(locale, token, date)
		{
			let val = date.getFullYear();
			if (val < 0)
				return token.length < 2 ? "b" : "bc";
			else
				return token.length < 2 ? "a" : "ad";
		},
		"E": function(locale, token, date)
		{
			let val = date.getFullYear();
			if (val < 0)
				return token.length < 2 ? "B" : "BC";
			else
				return token.length < 2 ? "A" : "AD";
		},
		"y": function(locale, token, date)
		{
			return _PAD(date.getFullYear(), token.length);
		},
		"M": function(locale, token, date)
		{
			if (token.length <= 2)
				return _PAD(date.getMonth() + 1, token.length);
			else
			{
				let month = date.getMonth();
				let index = Math.min(Math.max(token.length - 3, 0), 1);
				return locale.monthInYear[index][month];
			}
		},
		"d": function(locale, token, date)
		{
			return _PAD(date.getDate(), token.length);
		},
		"W": function(locale, token, date)
		{
			let index = Math.min(Math.max(token.length - 1, 0), 3);
			let day = date.getDay();
			return locale.dayInWeek[index][day];
		},
		"w": function(locale, token, date)
		{
			return _PAD(date.getDay(), token.length);
		},
		"a": function(locale, token, date)
		{
			let val = date.getHours();
			if (val < 12)
				return token.length < 2 ? "a" : "am";
			else
				return token.length < 2 ? "p" : "pm";
		},
		"A": function(locale, token, date)
		{
			let val = date.getHours();
			if (val < 12)
				return token.length < 2 ? "A" : "AM";
			else
				return token.length < 2 ? "P" : "PM";
		},
		"h": function(locale, token, date)
		{
			return _PAD(date.getHours(), token.length);
		},
		"H": function(locale, token, date)
		{
			return _PAD(date.getHours() + 1, token.length);
		},
		"k": function(locale, token, date)
		{
			return _PAD(date.getHours() % 12, token.length);
		},
		"K": function(locale, token, date)
		{
			return _PAD((date.getHours() % 12) + 1, token.length);
		},
		"m": function(locale, token, date)
		{
			return _PAD(date.getMinutes(), token.length);
		},
		"s": function(locale, token, date)
		{
			return _PAD(date.getSeconds(), token.length);
		},
		"S": function(locale, token, date)
		{
			return _PAD(date.getMilliseconds(), token.length);
		},
		"z": function(locale, token, date)
		{
			let minuteOffset = date.getTimezoneOffset();
			let absMinuteOffset = Math.abs(date.getTimezoneOffset());
			return "GMT" + (minuteOffset > 0 ? "-" : "+") + _PAD(absMinuteOffset / 60, 2) + ":" + _PAD(absMinuteOffset % 60, 2);
		},
		"Z": function(locale, token, date)
		{
			let minuteOffset = date.getTimezoneOffset();
			let absMinuteOffset = Math.abs(date.getTimezoneOffset());
			return (minuteOffset > 0 ? "-" : "+") + _PAD(absMinuteOffset / 60, 2) + _PAD(absMinuteOffset % 60, 2);
		},
		"X": function(locale, token, date)
		{
			let minuteOffset = date.getTimezoneOffset();
			let absMinuteOffset = Math.abs(date.getTimezoneOffset());
			switch (token.length)
			{
				case 1:
					return (minuteOffset > 0 ? "-" : "+") + (absMinuteOffset / 60);
				case 2:
					return (minuteOffset > 0 ? "-" : "+") + _PAD(absMinuteOffset / 60, 2);
				case 3:
					return (minuteOffset > 0 ? "-" : "+") + _PAD(absMinuteOffset / 60, 2) + _PAD(absMinuteOffset % 60, 2);
				case 4:
					return (minuteOffset > 0 ? "-" : "+") + _PAD(absMinuteOffset / 60, 2) + ":" + _PAD(absMinuteOffset % 60, 2);
				default:
					return "GMT" + (minuteOffset > 0 ? "-" : "+") + _PAD(absMinuteOffset / 60, 2) + ":" + _PAD(absMinuteOffset % 60, 2);
			}
		},
		"'": function(locale, token, date)
		{
			if (token.length == 2)
				return "'";
			else
				return token.substring(1, token.length - 1);
		},
	};

	date = new Date(date);
	
	let lastEnd = 0;
	let sb = '';
	let match;
	while (match = _DATEFORMATREGEX.exec(formatstring)) // Intentional assignment.
	{
		let token = match[0];
		let start = match.index;
		if (start > lastEnd)
			sb += formatstring.substring(lastEnd, start);
		
		sb += _TOKENFUNCS[token[0]](DEFAULT_LOCALE, token, date);
		
		lastEnd = _DATEFORMATREGEX.lastIndex;
	}
	
	if (lastEnd < formatstring.length)
		sb += formatstring.substring(lastEnd);

	return sb;
};

/**
 * Assists in parsing a cue with formatted text (TEXTF cue), or one known to have formatted text.
 * The target functions passed in are provided an accumulator array to push generated text into. 
 * On return, this function returns the accumulator's contents joined into a string. 
 * @param sequence the character sequence to parse.
 * @param tagStartFunc the function called on tag start. arguments: tagName (string), accumulator (Array)  
 * @param tagEndFunc the function called on tag end. arguments: tagName (string), accumulator (Array)
 * @param textFunc the function called on tag contents. arguments: text (string), accumulator (Array)
 * @return the full accumulated result.  
 */
Util.parseFormatted = function(sequence, tagStartFunc, tagEndFunc, textFunc)
{
	let builder = '';
	let tagStack = [];
	let accumulator = [];
	
	let emitText = function()
	{
		if (builder.length === 0)
			return;
		
		let accum = [];
		textFunc(builder, accum);
		accumulator.push.apply(accumulator, accum);
		builder = '';
	};

	let emitTag = function()
	{
		if (builder.length === 0)
			return;

		let tag = builder;
		builder = '';
		
		if (tag == '/')
		{
			if (tagStack.length === 0)
				return;
			let accum = [];
			tagEndFunc(tagStack.pop(), accum);
			accumulator.push.apply(accumulator, accum);
		}
		else
		{
			tagStack.push(tag);
			let accum = [];
			tagStartFunc(tag, accum);
			accumulator.push.apply(accumulator, accum);
		}
	};
	
	let STATE_TEXT = 0;
	let STATE_TAG_MAYBE = 1;
	let STATE_TAG = 2;
	let STATE_TAG_END_MAYBE = 3;
	
	let state = STATE_TEXT;
	let len = sequence.length, i = 0;

	while (i < len)
	{
		let c = sequence.charAt(i);

		switch (state)
		{
			case STATE_TEXT:
			{
				if (c == '[')
					state = STATE_TAG_MAYBE;
				else
					builder += (c);
			}
			break;

			case STATE_TAG_MAYBE:
			{
				if (c == '[')
				{
					state = STATE_TEXT;
					builder += (c);
				}
				else
				{
					state = STATE_TAG;
					emitText();
					i--;
				}
			}
			break;
			
			case STATE_TAG:
			{
				if (c == ']')
					state = STATE_TAG_END_MAYBE;
				else
					builder += (c);
			}
			break;
			
			case STATE_TAG_END_MAYBE:
			{
				if (c == ']')
				{
					state = STATE_TAG;
					builder += (c);
				}
				else
				{
					state = STATE_TEXT;
					emitTag();
					i--;
				}
			}
			break;
		}
		
		i++;
	}
	
	if (state == STATE_TAG_END_MAYBE)
		emitTag();
	
	emitText();
	while (tagStack.length > 0)
	{
		let accum = [];
		tagEndFunc(tagStack.pop(), accum);
		accumulator.push.apply(accumulator, accum);
	}
	
	return accumulator.join('');
};


	
	Util.nanoTime = (function(CTX){
		// NodeJS
		if (CTX.process)
		{
			return function() 
			{
				// s,ns to ns (ns res)
				let t = process.hrtime();
				return t[0] * 1e9 + t[1];
			};	
		}
		// Webkit Browser
		else if (CTX.performance)
		{
			return function() 
			{
				// ms to ns (us res)
				return parseInt(CTX.performance.now() * 1e6, 10);
			};	
		}
		else
		{
			return function()
			{
				// ms to ns (ms res)
				return Date.now() * 1e6;
			};
		}
	})(_TAMEENVCTX);


/**
 * Constructor for TStringBuilder.
 */
var TStringBuilder = function()
{
	this.buffer = [];
};

/**
 * Appends a string to this.
 * @param value the value to add. Must be defined and not null.
 */
TStringBuilder.prototype.append = function(value)
{
	if (typeof value !== 'undefined' && value !== null)
		this.buffer.push(value.toString());
	return this;
};

/**
 * Clears the builder.
 * @param value the value to add. Must be defined and not null.
 */
TStringBuilder.prototype.clear = function()
{
	this.buffer.length = 0;
};

/**
 * @return the resultant string.
 */
TStringBuilder.prototype.toString = function()
{
	return this.buffer.join("");
};

/**
 * @return the length of the resultant string.
 */
TStringBuilder.prototype.length = function()
{
	return this.toString().length;
};


var TAMEConstants = {};
TAMEConstants.ActionType = {};
TAMEConstants.Cue = {};
TAMEConstants.Identity = {};
TAMEConstants.TraceType = {};

TAMEConstants.ActionType.GENERAL = 0;
TAMEConstants.ActionType.TRANSITIVE = 1;
TAMEConstants.ActionType.DITRANSITIVE = 2;
TAMEConstants.ActionType.MODAL = 3;
TAMEConstants.ActionType.OPEN = 4;

TAMEConstants.Cue.QUIT = "quit";
TAMEConstants.Cue.TEXT = "text";
TAMEConstants.Cue.TEXTF = "textf";
TAMEConstants.Cue.WAIT = "wait";
TAMEConstants.Cue.PAUSE = "pause";
TAMEConstants.Cue.TRACE = "trace";
TAMEConstants.Cue.ERROR = "error";
TAMEConstants.Cue.FATAL = "fatal";

TAMEConstants.Identity.ROOM = "room";
TAMEConstants.Identity.PLAYER = "player";
TAMEConstants.Identity.WORLD = "world";

TAMEConstants.TraceType.INTERPRETER = "interpreter";
TAMEConstants.TraceType.CONTEXT = "context";
TAMEConstants.TraceType.ENTRY = "entry";
TAMEConstants.TraceType.CONTROL = "control";
TAMEConstants.TraceType.FUNCTION = "function";
TAMEConstants.TraceType.INTERNAL = "internal";
TAMEConstants.TraceType.VALUE = "value";
TAMEConstants.TraceType.ALL = (function(){
	let out = {};
	for (let x in TAMEConstants.TraceType) if (TAMEConstants.TraceType.hasOwnProperty(x))
		out[TAMEConstants.TraceType[x]] = true;
	return out;
})();

TAMEConstants.DEFAULT_RUNAWAY_THRESHOLD = 100000;
TAMEConstants.DEFAULT_FUNCTION_DEPTH = 256;
TAMEConstants.RETURN_VARIABLE = "-. 0Return0 .-";


/*****************************************************************************
 Exception handling.
 *****************************************************************************/
var TAMEError = function(type, message)
{
	this.type = type;
	this.message = message;
};

TAMEError.Type = 
{
	"Module": "Module",
	"ModuleExecution": "ModuleExecution",
	"ModuleState": "ModuleState",
	"Arithmetic": "Arithmetic",
	"ArithmeticStackState": "ArithmeticStackState",
	"RunawayRequest": "RunawayRequest",
	"UnexpectedValueType": "UnexpectedValueType",
	"BadParameter": "BadParameter"
};

TAMEError.prototype.toString = function()
{
	return "TAMEError: "+ this.type + ": " + this.message;
};

// Convenience Constructors

TAMEError.Module = function(message) {return new TAMEError(TAMEError.Type.Module, message);};
TAMEError.ModuleExecution = function(message) {return new TAMEError(TAMEError.Type.ModuleExecution, message);};
TAMEError.ModuleState = function(message) {return new TAMEError(TAMEError.Type.ModuleState, message);};
TAMEError.Arithmetic = function(message) {return new TAMEError(TAMEError.Type.Arithmetic, message);};
TAMEError.ArithmeticStackState = function(message) {return new TAMEError(TAMEError.Type.ArithmeticStackState, message);};
TAMEError.RunawayRequest = function(message) {return new TAMEError(TAMEError.Type.RunawayRequest, message);};
TAMEError.UnexpectedValueType = function(message) {return new TAMEError(TAMEError.Type.UnexpectedValueType, message);};
TAMEError.BadParameter = function(message) {return new TAMEError(TAMEError.Type.BadParameter, message);};


/*****************************************************************************
 Interrupt handling.
 *****************************************************************************/
var TAMEInterrupt = function(type, message)
{
	this.type = type;
	this.message = message;
};

TAMEInterrupt.Type = 
{
	"Break": "Break",
	"Continue": "Continue",
	"Error": "Error",
	"End": "End",
	"Quit": "Quit",
	"Finish": "Finish"
};

// Convenience Constructors
TAMEInterrupt.Break = function() { return new TAMEInterrupt(TAMEInterrupt.Type.Break, "A break interrupt was thrown!"); };
TAMEInterrupt.Continue = function() { return new TAMEInterrupt(TAMEInterrupt.Type.Continue, "A continue interrupt was thrown!"); };
TAMEInterrupt.Error = function(message) { return new TAMEInterrupt(TAMEInterrupt.Type.Error, message); };
TAMEInterrupt.End = function() { return new TAMEInterrupt(TAMEInterrupt.Type.End, "An end interrupt was thrown!"); };
TAMEInterrupt.Quit = function() { return new TAMEInterrupt(TAMEInterrupt.Type.Quit, "A quit interrupt was thrown!"); };
TAMEInterrupt.Finish = function() { return new TAMEInterrupt(TAMEInterrupt.Type.Finish, "A finish interrupt was thrown!"); };


TAMEInterrupt.prototype.toString = function()
{
	return "TAMEInterrupt: "+ this.type + ": " + this.message;
};


/*****************************************************************************
 See com.tameif.tame.lang.Value
 *****************************************************************************/
var TValue = {};

/* Type Constants */
TValue.Type = 
{
	"BOOLEAN": "BOOLEAN",
	"INTEGER": "INTEGER",
	"FLOAT": "FLOAT",
	"STRING": "STRING",
	"LIST": "LIST",
	"OBJECT": "OBJECT",
	"CONTAINER": "CONTAINER",
	"PLAYER": "PLAYER",
	"ROOM": "ROOM",
	"WORLD": "WORLD",
	"ACTION": "ACTION",
	"VARIABLE": "VARIABLE"
};

// Factory.
TValue.create = function(type, value)
{
	if (!type)
		throw TAMEError.UnexpectedValueType("Invalid value type in TValue()");
	if (typeof value === 'undefined' || value === null)
		throw TAMEError.UnexpectedValueType("Value cannot be undefined or null in TValue()");

	var out = {};
	out.type = type;
	out.value = value;
	return out;
};

// Convenience constructors.
TValue.createBoolean = function(value) {return TValue.create(TValue.Type.BOOLEAN, Boolean(value));};
TValue.createInteger = function(value) {return TValue.create(TValue.Type.INTEGER, parseInt(value, 10));};
TValue.createFloat = function(value) {return TValue.create(TValue.Type.FLOAT, parseFloat(value));};
TValue.createString = function(value) {return TValue.create(TValue.Type.STRING, String(value));};
TValue.createList = function(value) {return TValue.create(TValue.Type.LIST, value);};
TValue.createWorld = function() {return TValue.create(TValue.Type.WORLD, "world");};
TValue.createObject = function(value) {return TValue.create(TValue.Type.OBJECT, String(value));};
TValue.createContainer = function(value) {return TValue.create(TValue.Type.CONTAINER, String(value));};
TValue.createPlayer = function(value) {return TValue.create(TValue.Type.PLAYER, String(value));};
TValue.createRoom = function(value) {return TValue.create(TValue.Type.ROOM, String(value));};
TValue.createAction = function(value) {return TValue.create(TValue.Type.ACTION, String(value));};
TValue.createVariable = function(value) {return TValue.create(TValue.Type.VARIABLE, String(value));};
TValue.createNaN = function() {return TValue.create(TValue.Type.FLOAT, NaN);};
TValue.createInfinity = function() {return TValue.create(TValue.Type.FLOAT, Infinity);};
TValue.createNegativeInfinity = function() {return TValue.create(TValue.Type.FLOAT, -Infinity);};
TValue.createValue = function(value) {return TValue.create(value.type, value.value);};

/**
 * Returns if this value is equal to another, value-wise.
 * If they are literals, they are compared by their string values.
 * @param v1 the first value.
 * @param v2 the second value.
 * @return true if so, false if not.
 */
TValue.areEqualIgnoreType = function(v1, v2)
{
	if (TValue.isLiteral(v1) && TValue.isLiteral(v2))
	{
		if (TValue.isList(v1) || TValue.isList(v2))
			return TValue.areEqual(v1, v2);
		else if (TValue.isString(v1) && TValue.isString(v2))
			return v1.value == v2.value;
		else
			return TValue.asDouble(v1) == TValue.asDouble(v2);
	}
	else
		return TValue.areEqual(v1, v2); 
};

/**
 * Returns if this value is equal to another: PERFECTLY EQUAL, type strict.
 * @param v1 the first value.
 * @param v2 the second value.
 * @return true if so, false if not.
 */
TValue.areEqual = function(v1, v2)
{
	if (TValue.isStrictlyNaN(v1))
		return false;
	else if (TValue.isStrictlyNaN(v2))
		return false;
	else
		return v1.type === v2.type && v1.value === v2.value;
};

/**
 * Compares two values.
 * @param v1 the first value.
 * @param v2 the second value.
 * @return -1 if v1 < v2, 0 if equal (ignore type), 1 if v1 > v2.
 */
TValue.compare = function(v1, v2)
{
	if (TValue.areEqual(v1, v2))
		return 0;
	
	if (!TValue.isLiteral(v1) || !TValue.isLiteral(v2))
		return -Number.MAX_VALUE;

	if (TValue.isList(v1) || TValue.isList(v2))
		return -Number.MAX_VALUE;
	
	if (TValue.isString(v1) || TValue.isString(v2))
	{
		let d1 = TValue.asString(v1);
		let d2 = TValue.asString(v2);
		return Util.strcmp(d1, d2);
	}
	
	if (TValue.isFloatingPoint(v1) || TValue.isFloatingPoint(v2))
	{
		let d1 = TValue.asDouble(v1);
		let d2 = TValue.asDouble(v2);
		return d1 === d2 ? 0 : (d1 < d2 ? -1 : 1);
	}
	
	if (TValue.isInteger(v1) || TValue.isInteger(v2))
	{
		let d1 = TValue.asLong(v1);
		let d2 = TValue.asLong(v2);
		return d1 === d2 ? 0 : (d1 < d2 ? -1 : 1);
	}
	
	if (TValue.isBoolean(v1) || TValue.isBoolean(v2))
	{
		let d1 = TValue.asBoolean(v1);
		let d2 = TValue.asBoolean(v2);
		return d1 === d2 ? 0 : (!d1 ? -1 : 1);
	}
	
	return 0;
};

/**
 * Returns the absolute value of a literal value.
 * @param value1 the first operand.
 * @return the resultant value.
 */
TValue.absolute = function(value1)
{
	if (TValue.isInteger(value1))
		return TValue.createInteger(Math.abs(TValue.asLong(value1)));
	else if (TValue.isNumeric(value1))
		return TValue.createFloat(Math.abs(TValue.asDouble(value1)));
	else
		return TValue.createNaN();
};

/**
 * Returns the negative value of a literal value.
 * @param value1 the first operand.
 * @return the resultant value.
 */
TValue.negate = function(value1)
{
	if (TValue.isInteger(value1))
		return TValue.createInteger(-TValue.asLong(value1));
	else if (TValue.isNumeric(value1))
		return TValue.createFloat(-TValue.asDouble(value1));
	else
		return TValue.createNaN();
};

/**
 * Returns the "logical not" value of a literal value.
 * @param value1 the first operand.
 * @return the resultant value as a boolean value.
 */
TValue.logicalNot = function(value1)
{
	if (TValue.isLiteral(value1))
		return TValue.createBoolean(!TValue.asBoolean(value1));
	else
		return TValue.createNaN();
};

/**
 * Returns the bitwise compliment value of a literal value.
 * @param value1 the first operand.
 * @return the resultant value.
 */
TValue.not = function(value1)
{
	if (TValue.isInfinite(value1))
		return TValue.createInteger(-1);
	else if (TValue.isNaN(value1))
		return TValue.createInteger(-1);
	else if (TValue.isBoolean(value1))
		return TValue.createBoolean(!TValue.asBoolean(value1));
	else if (TValue.isNumeric(value1))
		return TValue.createInteger(~TValue.asLong(value1));
	else if (TValue.isString(value1))
		return TValue.createInteger(-1);
	else
		return TValue.createNaN();
};

/**
 * Returns the addition of two literal values.
 * @param value1 the first operand.
 * @param value2 the second operand.
 * @return the resultant value.
 */
TValue.add = function(value1, value2)
{
	if (!TValue.isLiteral(value1) || !TValue.isLiteral(value2))
		return TValue.createNaN();

	if (TValue.isBoolean(value1) && TValue.isBoolean(value2))
	{
		let v1 = TValue.asBoolean(value1);
		let v2 = TValue.asBoolean(value2);
		return TValue.createBoolean(v1 || v2);
	}
	else if (TValue.isString(value1) || TValue.isString(value2))
	{
		let v1 = TValue.asString(value1);
		let v2 = TValue.asString(value2);
		return TValue.createString(v1 + v2);
	}
	else if (TValue.isInteger(value1) && TValue.isInteger(value2))
	{
		let v1 = TValue.asLong(value1);
		let v2 = TValue.asLong(value2);
		return TValue.createInteger(v1 + v2);
	}
	else
	{
		let v1 = TValue.asDouble(value1);
		let v2 = TValue.asDouble(value2);
		return TValue.createFloat(v1 + v2);
	}
};

/**
 * Returns the subtraction of the second literal value from the first.
 * @param value1 the first operand.
 * @param value2 the second operand.
 * @return the resultant value.
 */
TValue.subtract = function(value1, value2)
{
	if (!TValue.isLiteral(value1) || !TValue.isLiteral(value2))
		return TValue.createNaN();
	if (TValue.isList(value1) || TValue.isList(value2))
		return TValue.createNaN();
	if (TValue.isString(value1) || TValue.isString(value2))
		return TValue.createNaN();

	if (TValue.isBoolean(value1) && TValue.isBoolean(value2))
	{
		let v1 = TValue.asBoolean(value1);
		let v2 = TValue.asBoolean(value2);
		return TValue.createBoolean(v1 && !v2);
	}
	else if (TValue.isInteger(value1) && TValue.isInteger(value2))
	{
		let v1 = TValue.asLong(value1);
		let v2 = TValue.asLong(value2);
		return TValue.createInteger(v1 - v2);
	}
	else
	{
		let v1 = TValue.asDouble(value1);
		let v2 = TValue.asDouble(value2);
		return TValue.createFloat(v1 - v2);
	}
};

/**
 * Returns the multiplication of two literal values.
 * @param value1 the first operand.
 * @param value2 the second operand.
 * @return the resultant value.
 */
TValue.multiply = function(value1, value2)
{
	if (!TValue.isLiteral(value1) || !TValue.isLiteral(value2))
		return TValue.createNaN();
	if (TValue.isList(value1) || TValue.isList(value2))
		return TValue.createNaN();
	if (TValue.isString(value1) || TValue.isString(value2))
		return TValue.createNaN();

	if (TValue.isBoolean(value1) && TValue.isBoolean(value2))
	{
		let v1 = TValue.asBoolean(value1);
		let v2 = TValue.asBoolean(value2);
		return TValue.createBoolean(v1 && v2);
	}
	else if (TValue.isInteger(value1) && TValue.isInteger(value2))
	{
		let v1 = TValue.asLong(value1);
		let v2 = TValue.asLong(value2);
		return TValue.createInteger(v1 * v2);
	}
	else
	{
		let v1 = TValue.asDouble(value1);
		let v2 = TValue.asDouble(value2);
		return TValue.createFloat(v1 * v2);
	}
};

/**
 * Returns the division of two literal values.
 * @param value1 the first operand.
 * @param value2 the second operand.
 * @return the resultant value.
 * @throws Arithmetic an arithmetic exception, if any (or divide by zero).
 */
TValue.divide = function(value1, value2)
{
	if (!TValue.isLiteral(value1) || !TValue.isLiteral(value2))
		return TValue.createNaN();
	if (TValue.isList(value1) || TValue.isList(value2))
		return TValue.createNaN();
	if (TValue.isString(value1) || TValue.isString(value2))
		return TValue.createNaN();

	if (TValue.isInteger(value1) && TValue.isInteger(value2))
	{
		let v1 = TValue.asLong(value1);
		let v2 = TValue.asLong(value2);
		if (v2 === 0)
		{
			if (v1 !== 0)
				return v1 < 0 ? TValue.createNegativeInfinity() : TValue.createInfinity();
			else
				return TValue.createNaN();
		}
		else
			return TValue.createInteger(v1 / v2);
	}
	else
	{
		let v1 = TValue.asDouble(value1);
		let v2 = TValue.asDouble(value2);
		if (v2 === 0.0)
		{
			if (!Number.isNaN(v1) && v1 !== 0.0)
				return v1 < 0.0 ? TValue.createNegativeInfinity() : TValue.createInfinity();
			else
				return TValue.createNaN();
		}
		else
			return TValue.createFloat(v1 / v2);
	}
};

/**
 * Returns the modulo of one literal value using another.
 * @param value1 the first operand.
 * @param value2 the second operand.
 * @return the resultant value.
 * @throws Arithmetic an arithmetic exception, if any (or divide by zero).
 */
TValue.modulo = function(value1, value2)
{
	if (!TValue.isLiteral(value1) || !TValue.isLiteral(value2))
		return TValue.createNaN();
	if (TValue.isList(value1) || TValue.isList(value2))
		return TValue.createNaN();
	if (TValue.isString(value1) || TValue.isString(value2))
		return TValue.createNaN();

	if (TValue.isInteger(value1) && TValue.isInteger(value2))
	{
		let v1 = TValue.asLong(value1);
		let v2 = TValue.asLong(value2);
		if (v2 === 0)
			return TValue.createNaN();
		else
			return TValue.createInteger(v1 % v2);
	}
	else
	{
		let v1 = TValue.asDouble(value1);
		let v2 = TValue.asDouble(value2);
		if (v2 === 0.0)
			return TValue.createNaN();
		else
			return TValue.createFloat(v1 % v2);
	}
};

/**
 * Returns the result of one value raised to a certain power. 
 * @param value1 the first operand.
 * @param value2 the second operand.
 * @return the resultant value.
 * @throws Arithmetic an arithmetic exception, if any (or divide by zero).
 */
TValue.power = function(value1, value2)
{
	if (!TValue.isLiteral(value1) || !TValue.isLiteral(value2))
		return TValue.createNaN();
	if (TValue.isList(value1) || TValue.isList(value2))
		return TValue.createNaN();
	if (TValue.isString(value1) || TValue.isString(value2))
		return TValue.createNaN();

	let v1 = TValue.asDouble(value1);
	let v2 = TValue.asDouble(value2);
	let p = Math.pow(v1, v2);
	return TValue.createFloat(p);
};

/**
 * Returns the "logical and" of two literal values.
 * @param value1 the first operand.
 * @param value2 the second operand.
 * @return the resultant value, as a boolean.
 */
TValue.logicalAnd = function(value1, value2)
{
	if (!TValue.isLiteral(value1) || !TValue.isLiteral(value2))
		return TValue.createBoolean(false);
	
	let v1 = TValue.asBoolean(value1);
	let v2 = TValue.asBoolean(value2);
	return TValue.createBoolean(v1 && v2);
};

/**
 * Returns the "logical or" of two literal values.
 * @param value1 the first operand.
 * @param value2 the second operand.
 * @return the resultant value, as a boolean.
 */
TValue.logicalOr = function(value1, value2)
{
	if (!TValue.isLiteral(value1) || !TValue.isLiteral(value2))
		return TValue.createBoolean(false);
	
	let v1 = TValue.asBoolean(value1);
	let v2 = TValue.asBoolean(value2);
	return TValue.createBoolean(v1 || v2);
};

/**
 * Returns the "logical xor" of two literal values.
 * @param value1 the first operand.
 * @param value2 the second operand.
 * @return the resultant value, as a boolean.
 */
TValue.logicalXOr = function(value1, value2)
{
	if (!TValue.isLiteral(value1) || !TValue.isLiteral(value2))
		return TValue.createBoolean(false);
	
	let v1 = TValue.asBoolean(value1);
	let v2 = TValue.asBoolean(value2);
	return TValue.createBoolean(v1 ^ v2);
};

/**
 * Returns if two values are equal, no type safety if they are literals.
 * @param value1 the first operand.
 * @param value2 the second operand.
 * @return the resultant value, as a boolean.
 */
TValue.equals = function(value1, value2)
{
	return TValue.createBoolean(TValue.areEqualIgnoreType(value1, value2));
};

/**
 * Returns if two values are not equal, no type safety if they are literals.
 * @param value1 the first operand.
 * @param value2 the second operand.
 * @return the resultant value, as a boolean.
 */
TValue.notEquals = function(value1, value2)
{
	return TValue.createBoolean(!TValue.areEqualIgnoreType(value1, value2));
};

/**
 * Returns if two values are equal, with type strictness.
 * @param value1 the first operand.
 * @param value2 the second operand.
 * @return the resultant value, as a boolean.
 */
TValue.strictEquals = function(value1, value2)
{
	return TValue.createBoolean(TValue.areEqual(value1, value2));
};

/**
 * Returns if two values are not equal, with type strictness.
 * @param value1 the first operand.
 * @param value2 the second operand.
 * @return the resultant value, as a boolean.
 */
TValue.strictNotEquals = function(value1, value2)
{
	return TValue.createBoolean(!TValue.areEqual(value1, value2));
};

/**
 * Returns if the first literal value is less than the second.
 * If either are strings, they are compared lexicographically.
 * @param value1 the first operand.
 * @param value2 the second operand.
 * @return the resultant value, as a boolean.
 */
TValue.less = function(value1, value2)
{
	if (!TValue.isLiteral(value1) || !TValue.isLiteral(value2))
		return TValue.createBoolean(false);
	else if (TValue.isList(value1) || TValue.isList(value2))
		return TValue.createBoolean(false);
	else if (TValue.isStrictlyNaN(value1) || TValue.isStrictlyNaN(value2))
		return TValue.createBoolean(false);
	else 
		return TValue.createBoolean(TValue.compare(value1, value2) < 0);
};

/**
 * Returns if the first literal value is less than or equal to the second.
 * If either are strings, they are compared lexicographically.
 * @param value1 the first operand.
 * @param value2 the second operand.
 * @return the resultant value, as a boolean.
 */
TValue.lessOrEqual = function(value1, value2)
{
	if (!TValue.isLiteral(value1) || !TValue.isLiteral(value2))
		return TValue.createBoolean(false);
	else if (TValue.isList(value1) || TValue.isList(value2))
		return TValue.createBoolean(false);
	else if (TValue.isStrictlyNaN(value1) || TValue.isStrictlyNaN(value2))
		return TValue.createBoolean(false);
	else 
		return TValue.createBoolean(TValue.compare(value1, value2) <= 0);
};

/**
 * Returns if the first literal value is greater than the second.
 * If either are strings, they are compared lexicographically.
 * @param value1 the first operand.
 * @param value2 the second operand.
 * @return the resultant value, as a boolean.
 */
TValue.greater = function(value1, value2)
{
	if (!TValue.isLiteral(value1) || !TValue.isLiteral(value2))
		return TValue.createBoolean(false);
	else if (TValue.isList(value1) || TValue.isList(value2))
		return TValue.createBoolean(false);
	else if (TValue.isStrictlyNaN(value1) || TValue.isStrictlyNaN(value2))
		return TValue.createBoolean(false);
	else 
		return TValue.createBoolean(TValue.compare(value1, value2) > 0);
};

/**
 * Returns if the first literal value is greater than or equal to the second.
 * If either are strings, they are compared lexicographically.
 * @param value1 the first operand.
 * @param value2 the second operand.
 * @return the resultant value, as a boolean.
 */
TValue.greaterOrEqual = function(value1, value2)
{
	if (!TValue.isLiteral(value1) || !TValue.isLiteral(value2))
		return TValue.createBoolean(false);
	else if (TValue.isList(value1) || TValue.isList(value2))
		return TValue.createBoolean(false);
	else if (TValue.isStrictlyNaN(value1) || TValue.isStrictlyNaN(value2))
		return TValue.createBoolean(false);
	else 
		return TValue.createBoolean(TValue.compare(value1, value2) >= 0);
};

/**
 * Returns if this value is a boolean value.
 * @return true if so, false if not.
 */
TValue.isBoolean = function(value)
{
	return value.type === TValue.Type.BOOLEAN;
};

/**
 * Returns if this value is an integer.
 * @return true if so, false if not.
 */
TValue.isInteger = function(value)
{
	return value.type === TValue.Type.INTEGER;
};

/**
 * Returns if this value is a floating-point number.
 * @return true if so, false if not.
 */
TValue.isFloatingPoint = function(value)
{
	return value.type === TValue.Type.FLOAT;
};

/**
 * Returns if this value is a number.
 * @return true if so, false if not.
 */
TValue.isNumeric = function(value)
{
	return value.type === TValue.Type.INTEGER ||
		value.type === TValue.Type.FLOAT;
};

/**
 * Returns if this value is a string value.
 * @return true if so, false if not.
 */
TValue.isString = function(value)
{
	return value.type === TValue.Type.STRING;
};

/**
 * Returns if this value is a list.
 * @return true if so, false if not.
 */
TValue.isList = function(value)
{
	return value.type === TValue.Type.LIST;
};

/**
 * Returns if this value is copy-by-reference.
 * @return true if so, false if not.
 */
TValue.isReferenceCopied = function(value)
{
	return value.type === TValue.Type.LIST;
};

/**
 * Returns if this value is a literal value (or list).
 * @return true if so, false if not.
 */
TValue.isLiteral = function(value)
{
	return (value.type === TValue.Type.BOOLEAN ||
		value.type === TValue.Type.INTEGER ||
		value.type === TValue.Type.FLOAT ||
		value.type === TValue.Type.STRING ||
		value.type === TValue.Type.LIST);
};

/**
 * Returns if this value represents an element.
 * @return true if so, false if not.
 */
TValue.isElement = function(value)
{
	return value.type === TValue.Type.OBJECT ||
		value.type === TValue.Type.PLAYER ||
		value.type === TValue.Type.ROOM ||
		value.type === TValue.Type.CONTAINER ||
		value.type === TValue.Type.WORLD;
};

/**
 * Returns if this value represents an object container.
 * @return true if so, false if not.
 */
TValue.isObjectContainer = function(value)
{
	return value.type === TValue.Type.PLAYER ||
		value.type === TValue.Type.ROOM ||
		value.type === TValue.Type.CONTAINER ||
		value.type === TValue.Type.WORLD;
};

/**
 * Returns if this value represents an object.
 * @return true if so, false if not.
 */
TValue.isObject = function(value)
{
	return value.type === TValue.Type.OBJECT;
};

/**
 * Returns if this value represents a room.
 * @return true if so, false if not.
 */
TValue.isRoom = function(value)
{
	return value.type === TValue.Type.ROOM;
};

/**
 * Returns if this value represents a player.
 * @return true if so, false if not.
 */
TValue.isPlayer = function(value)
{
	return value.type === TValue.Type.PLAYER;
};

/**
 * Returns if this value represents a container.
 * @return true if so, false if not.
 */
TValue.isContainer = function(value)
{
	return value.type === TValue.Type.CONTAINER;
};

/**
 * Returns if this value represents an action.
 * @return true if so, false if not.
 */
TValue.isAction = function(value)
{
	return value.type === TValue.Type.ACTION;
};

/**
 * Returns if this value represents a variable.
 * @return true if so, false if not.
 */
TValue.isVariable = function(value)
{
	return value.type === TValue.Type.VARIABLE;
};

/**
 * Returns if this value represents a boolean.
 * @return true if so, false if not.
 */
TValue.isBoolean = function(value)
{
	return value.type === TValue.Type.BOOLEAN;
};

/**
 * Returns if this value evaluates to <code>NaN</code>.
 * @return true if so, false if not.
 */
TValue.isNaN = function(value)
{
	return Number.isNaN(TValue.asDouble(value));
};

/**
 * Returns if this value is floating point and literally <code>NaN</code>.
 * @return true if so, false if not.
 */
TValue.isStrictlyNaN = function(value)
{
	return TValue.isFloatingPoint(value) && TValue.isNaN(value);
};

/**
 * Returns if this value evaluates to positive or negative infinity.
 * @return true if so, false if not.
 */
TValue.isInfinite = function(value)
{
	let v = TValue.asDouble(value);
	return v === Infinity || v === -Infinity;
};

/**
 * Returns this value as a long value.
 * @return the long value of this value.
 */
TValue.asLong = function(value)
{
	if (TValue.isInfinite(value) || TValue.isNaN(value))
		return 0;
	else if (TValue.isBoolean(value))
		return TValue.asBoolean(value) ? 1 : 0;
	else if (TValue.isInteger(value))
		return value.value;
	else if (TValue.isFloatingPoint(value))
		return parseInt(value.value, 10);
	else if (TValue.isString(value))
		return parseInt(TValue.asDouble(value), 10);
	else
		return 0;
};

/**
 * Returns the double value of this value.
 * @return the double value of this value, or {@link Double#NaN} if not parsable as a number.
 */
TValue.asDouble = function(value)
{
	if (TValue.isBoolean(value))
		return TValue.asBoolean(value) ? 1.0 : 0.0;
	else if (TValue.isInteger(value))
		return parseFloat(value.value);
	else if (TValue.isFloatingPoint(value))
		return value.value;
	else if (TValue.isString(value))
	{
		let str = value.value.toLowerCase();
		if (str === "nan")
			return NaN;
		else if (str === "infinity")
			return Infinity;
		else if (str === "-infinity")
			return -Infinity;
		else
			return parseFloat(str);
	}
	else
		return NaN;
};

/**
 * Returns the String value of this value (not the same as toString()!!).
 * @return the String value of this value.
 */
TValue.asString = function(value)
{
	if (TValue.isList(value))
	{
		let tsb = new TStringBuilder();
		tsb.append("[");
		for (let i = 0; i < value.value.length; i++)
		{
			tsb.append(TValue.asString(value.value[i]));
			if (i < value.value.length - 1)
				tsb.append(", ");
		}
		tsb.append("]");
		return tsb.toString();
	}
	else if (TValue.isString(value) || TValue.isElement(value) || TValue.isVariable(value) || TValue.isAction(value))
		return value.value;
	else if (TValue.isInfinite(value) || TValue.isNaN(value))
		return ""+value.value;
	else if (TValue.isFloatingPoint(value))
	{
		// make it equal to Java/C#
		let d = TValue.asDouble(value);
		if (Math.abs(d) === 0.0)
			return "0.0";
		else if (Math.abs(d) < 0.001 || Math.abs(d) >= 10000000)
		{
			let out = d.toExponential().toUpperCase().replace('+','');
			if (out.indexOf('.') < 0)
			{
				let ie = out.indexOf('E');
				return out.substring(0, ie) + ".0" + out.substring(ie);
			}
			else
				return out;
		}
		else if (d % 1 === 0)		
			return value.value+".0";
		else
			return ""+value.value;
	}
	else
		return ""+value.value;
};

/**
 * Returns this value as a boolean value.
 * @return true if this evaluates true, false if not.
 */
TValue.asBoolean = function(value)
{
	if (TValue.isBoolean(value))
		return value.value;
	else if (TValue.isFloatingPoint(value))
	{
		if (TValue.isInfinite(value))
			return true;
		else if (Number.isNaN(value.value))
			return false;
		else
			return TValue.asDouble(value) !== 0;
	}
	else if (TValue.isInteger(value))
		return TValue.asLong(value) !== 0;
	else if (TValue.isString(value))
		return value.value.length !== 0;
	else
		return true; // all objects are true
};

/**
 * Returns if this value evaluates to "true".
 * @return true if so, false if not.
 */
TValue.isTrue = function(value)
{
	return TValue.asBoolean(value);
};
    
/**
 * @return a string representation of this value (for debug, usually).
 */
TValue.toString = function(value)
{
	let sb = new TStringBuilder();
	sb.append(value.type);
	sb.append('[');
	if (TValue.isList(value))
	{
		sb.append('[');
		for (let i = 0; i < value.value.length; i++)
		{
			sb.append(TValue.toString(value.value[i]));
			if (i < value.value.length - 1)
				sb.append(', ');
		}
		sb.append(']');
	}
	else
	{
		sb.append(TValue.asString(value));
	}
	sb.append(']');
	return sb.toString();
};

/**
 * Gets if a value is "empty."
 * If boolean, this returns true if and only if it is false.
 * If numeric, this returns true if and only if the value is 0 or NaN.
 * If string, this returns true if and only if the value, trimmed, is length 0.
 * If list, this returns true if and only if the list is length 0.
 * Otherwise, false.
 * @return true if this value is "empty", false if not.
 */
TValue.isEmpty = function(value)
{
	if (TValue.isStrictlyNaN(value))
		return true;
	else if (TValue.isBoolean(value))
		return !TValue.asBoolean(value);
	else if (TValue.isNumeric(value))
		return TValue.asDouble(value) === 0.0;
	else if (TValue.isString(value))
		return TValue.asString(value).trim().length === 0;
	else if (TValue.isList(value))
		return value.value.length === 0;
	else
		return false;
};

/**
 * Gets the length of this value.
 * If string, this returns the string length in characters.
 * If list, this returns the cardinality.
 * Otherwise, 1.
 * @return the length.
 */
TValue.length = function(value)
{
	if (TValue.isList(value))
		return value.value.length;
	else if (TValue.isString(value))
		return TValue.asString(value).length;
	else
		return 1;
};

/**
 * Adds a value to this, if this is a list.
 * @param listValue the list value.
 * @param v the value to add.
 * @return true if added, false if not.
 */
TValue.listAdd = function(listValue, v)
{
	if (!TValue.isList(listValue))
		return false;
	listValue.value.push(TValue.createValue(v));
	return true;
};

/**
 * Adds a value to this at a specific index, if this is a list.
 * @param listValue the list value.
 * @param i the index to add the value at.
 * @param v the value to add.
 * @return true if added, false if not.
 */
TValue.listAddAt = function(listValue, i, v)
{
	if (!TValue.isList(listValue))
		return false;
	if (i < 0)
		return false;
	listValue.value.splice(i, 0, TValue.createValue(v));
	return true;
};

/**
 * Sets a value on this at a specific index, if this is a list.
 * @param listValue the list value.
 * @param i the index to set.
 * @param v the value to set.
 * @return true if set, false if not (index is out of range).
 */
TValue.listSet = function(listValue, i, v)
{
	if (!TValue.isList(listValue))
		return false;
	
	if (i < 0 || i >= listValue.value.length)
		return false;
	
	listValue.value[i] = TValue.createValue(v);
	return true;
};

/**
 * Gets a value on this at a specific index, if this is a list.
 * @param listValue the list value.
 * @param i the index to get.
 * @return the value (new instance via TValue.createValue()) or false if not found.
 */
TValue.listGet = function(listValue, i)
{
	if (!TValue.isList(listValue))
		return TValue.createBoolean(false);
	
	if (i < 0 || i >= listValue.value.length)
		return TValue.createBoolean(false);
	
	return TValue.createValue(listValue.value[i]);
};

/**
 * Gets the index of a value from this, if this is a list.
 * Remember, list-typed values are compared by reference!
 * @param listValue the list value.
 * @param v the value to search for.
 * @return the index of the matching value, or -1 if not found.
 */
TValue.listIndexOf = function(listValue, v)
{
	if (!TValue.isList(listValue))
		return -1;
	
	for (let i = 0; i < listValue.value.length; i++)
	{
		if (TValue.areEqual(v, listValue.value[i]))
			return i;
	}
	
	return -1;
};

/**
 * Checks if this value contains a value, if this is a list.
 * Remember, list-typed values are compared by reference!
 * @param listValue the list value.
 * @param v the value to search for.
 * @return true if so, false if not.
 */
TValue.listContains = function(listValue, v)
{
	return TValue.listIndexOf(listValue, v) >= 0;
};

/**
 * Removes a value from inside this value, if this is a list.
 * Remember, list-typed values are compared by reference!
 * @param listValue the list value.
 * @param v the value to remove.
 * @return true if a value was removed or false if not found.
 */
TValue.listRemove = function(listValue, v)
{
	if (!TValue.isList(listValue))
		return false;

	let i = TValue.listIndexOf(listValue, v);
	if (i < 0)
		return false;
	
	listValue.value.splice(i, 1);
	return true;
};

/**
 * Removes a value from this at a specific index, if this is a list.
 * @param listValue the list value.
 * @param i the index to get.
 * @return the value removed (new instance via {@link #create(Value)}) or false if not found.
 */
TValue.listRemoveAt = function(listValue, i)
{
	if (!TValue.isList(listValue))
		return TValue.createBoolean(false);

	if (i < 0 || i >= listValue.value.length)
		return TValue.createBoolean(false);
	
	return TValue.createValue(listValue.value.splice(i, 1)[0]);
};


/*****************************************************************************
 See com.tameif.tame.TAMERequest
 *****************************************************************************/
var TRequest = function(context, inputMessage, traceTypesMap)
{
	this.moduleContext = context;
    this.inputMessage = inputMessage;
    this.traceTypesMap = traceTypesMap;
 
	// Stacks and Queues
    this.commandQueue = [];
    this.valueStack = [];
    this.contextStack = [];
};

/**
 * Gets the request's input message.
 * This gets interpreted by the TAME virtual machine.
 * @return the message used in the request.
 */
TRequest.prototype.getInputMessage = function()
{
	return this.inputMessage;
};

/**
 * Does this trace a specific type?
 * @param traceType the tracing type name. 
 * @return true if so, false if not.
 */
TRequest.prototype.traces = function(traceType)
{
	return this.traceTypesMap[traceType.toLowerCase()];
};

/**
 * Adds a command to the queue to be processed later.
 * @param item the command to add.
 */
TRequest.prototype.addCommand = function(item)
{
	this.commandQueue.push(item);
};

/**
 * Checks if this still has commands to process.
 * @return true if so, false if not.
 */
TRequest.prototype.hasCommands = function()
{
	return this.commandQueue.length !== 0;
};

/**
 * Dequeues a command from the queue to be processed later.
 * @return the next command to process.
 */
TRequest.prototype.nextCommand = function()
{
	return this.commandQueue.shift();
};

/**
 * Pushes an element context value onto the context stack.
 * @param context the context to push.
 */
TRequest.prototype.pushContext = function(context)
{
	this.contextStack.push(context);
};

/**
 * Removes an element context value off of the context stack and returns it.
 * @return the element context on the stack or null if none in the stack.
 */
TRequest.prototype.popContext = function()
{
	return this.contextStack.pop();
};

/**
 * Looks at the top of the element context stack.
 * @return the top of the context stack, or null if the stack is empty.
 */
TRequest.prototype.peekContext = function()
{
	return this.contextStack[this.contextStack.length - 1];
};

/**
 * Pushes a value onto the arithmetic stack.
 * @param value the value to push.
 */
TRequest.prototype.pushValue = function(value)
{
	this.valueStack.push(value);
};

/**
 * Removes the topmost value off the arithmetic stack.
 * @return the value popped off the stack or null if the stack is empty.
 * @throws ArithmeticStackStateException if the stack is empty.
 */
TRequest.prototype.popValue = function()
{
	if (this.valueStack.length === 0)
		throw TAMEError.ArithmeticStackState("Attempt to pop an empty arithmetic stack.");
	return this.valueStack.pop();
};

/**
 * Checks if the arithmetic stack is empty.
 * Should be called after a full request is made.
 * @throws ArithmeticStackStateException if the stack is NOT empty.
 */
TRequest.prototype.checkStackClear = function()
{
	if (this.valueStack.length !== 0)
		throw TAMEError.ArithmeticStackState("Arithmetic stack is not empty.");
};



/*****************************************************************************
 See com.tameif.tame.TAMEResponse
 *****************************************************************************/
var TResponse = function()
{
    this.responseCues = [];
    this.operationsExecuted = 0;
    this.functionDepth = 0;
    this.requestNanos = 0;
    this.interpretNanos = 0;
};

/**
 * Adds a cue to the response.
 * @param type the cue type name.
 * @param content the cue content.
 */
TResponse.prototype.addCue = function(type, content)
{
	if ((typeof content) === 'undefined' || content === null)
		content = "";
	else
		content = String(content);
	this.responseCues.push({"type": type, "content": content});
};

/**
 * Adds a TRACE cue to the response, if tracing is enabled.
 * @param request (TRequest) the request object.
 * @param traceType (string) the trace type.
 * @param content the content to add.
 */
TResponse.prototype.trace = function(request, traceType, content)
{
	if (request.traces(traceType))
		this.addCue(TAMEConstants.Cue.TRACE+"-"+traceType, content);
};

/**
 * Increments and checks if operation amount breaches the threshold.
 * @throw TAMEError if a breach is detected.
 */
TResponse.prototype.incrementAndCheckOperationsExecuted = function(maxOperations)
{
	this.operationsExecuted++;
	if (this.operationsExecuted >= maxOperations)
		throw TAMEError.RunawayRequest("Too many operations executed - possible infinite loop.");
};

/**
 * Increments and checks if function depth breaches the threshold.
 * @throw TAMEError if a breach is detected.
 */
TResponse.prototype.incrementAndCheckFunctionDepth = function(maxDepth)
{
	this.functionDepth++;
	if (this.functionDepth >= maxDepth)
		throw TAMEError.RunawayRequest("Too many function calls deep - possible stack overflow.");
};

/**
 * Decrements the function depth.
 */
TResponse.prototype.decrementFunctionDepth = function()
{
	this.functionDepth--;
};


/****************************************************
 See com.tameif.tame.TAMECommand
 ****************************************************/
var TCommand = function(action, target, object1, object2)
{
	this.action = action; 
	this.target = target; 
	this.object1 = object1; 
	this.object2 = object2;
};

// Convenience constructors.

TCommand.create = function(action) { return new TCommand(action, null, null, null); };
TCommand.createModal = function(action, target) { return new TCommand(action, target, null, null); };
TCommand.createObject = function(action, object1) { return new TCommand(action, null, object1, null); };
TCommand.createObject2 = function(action, object1, object2) { return new TCommand(action, null, object1, object2); };

TCommand.prototype.toString = function()
{
	var sb = new TStringBuilder();
	sb.append("Command ");
	sb.append("[");
	if (this.action)
		sb.append(this.action.identity);

	if (this.target)
		sb.append(", ").append(this.target);

	if (this.object1)
		sb.append(", ").append(this.object1.identity);

	if (this.object2)
	{
		if (this.object1.identity)
			sb.append(", ");
		sb.append(this.object2.identity);
	}
	
	sb.append("]");
	
	return sb.toString();
};



/****************************************************
 Constructor for the TAME Module.
 ****************************************************/

function TModule(theader, tdigest, tactions, telements)
{	
	// Fields --------------------
	this.header = theader;
	this.digest = tdigest;
	this.actions = Util.mapify(tactions, "identity");
	this.elements = {};
	this.actionNameTable = {};
	
	let elem = this.elements;
	let act = this.actions;
	let antbl = this.actionNameTable;

	let typeHash = {
		"TAction": true, 
		"TObject": true, 
		"TRoom": true, 
		"TPlayer": true, 
		"TContainer": true, 
		"TWorld": true
	};
	
	Util.each(Util.mapify(telements, "identity"), function(element, identity) {
		identity = identity.toLowerCase(); 
		if (!typeHash[element.tameType])
			throw TAMEError.Module("Unknown element type: "+element.tameType);
		if (elem[identity] || act[identity])
			throw TAMEError.Module("Another element already has the identity "+identity);
		elem[identity] = element;
	});

	Util.each(this.actions, function(action) {
		if (!typeHash[action.tameType])
			throw TAMEError.Module("Unknown element type: "+action.tameType);
		Util.each(action.names, function(name) {
			antbl[Util.replaceAll(name.toLowerCase(), "\\s+", " ")] = action.identity;
		});
	});

	if (!this.elements.world)
		throw TAMEError.Module('No world element!');
	
}

TModule.prototype.getActionByName = function(name)
{
	let identity = this.actionNameTable[name.toLowerCase()];
	if (!identity)
		return null;
	return this.actions[identity];
};


/****************************************************
 See com.tameif.tame.TAMEModuleContext
 ****************************************************/
var TModuleContext = function(module)
{
	this.module = module;			// module reference
	this.state = {};				// savable state.
	
	this.state.player = null;		// current player
	this.state.elements = {}; 		// element-to-contexts
	this.state.owners = {}; 		// element-to-objects
	this.state.objectOwners = {};	// object-to-element
	this.state.roomStacks = {};		// player-to-rooms
	this.state.names = {};			// object-to-names
	this.state.tags = {};			// object-to-tags
	
	var s = this.state;
	var m = this.module;
	
	var mc = this;
	
	// create element contexts.
	Util.each(m.elements, function(element, identity)
	{
		identity = identity.toLowerCase();
		
		if (element.archetype)
			return;
		if (s.elements[identity])
			throw TAMEError.Module("Another element already has the identity "+identity);
		s.elements[identity] = {
			"identity": identity,
			"variables": {}
		};
		
		// just for objects
		if (element.tameType === 'TObject')
		{
			s.names[identity] = {};
			s.tags[identity] = {};
			Util.each(element.names, function(name)
			{
				mc.addObjectName(element.identity, name);
			});
			Util.each(element.tags, function(tag)
			{
				mc.addObjectTag(element.identity, tag);
			});		
		}
		
	});
	
	var cr = parseInt(module.header.tame_runaway_max, 10);
	var fd = parseInt(module.header.tame_funcdepth_max, 10);
	
	this.operationRunawayMax = cr <= 0 || isNaN(cr) ? TAMEConstants.DEFAULT_RUNAWAY_THRESHOLD : cr;
	this.functionDepthMax = fd <= 0 || isNaN(fd) ? TAMEConstants.DEFAULT_FUNCTION_DEPTH : fd;
	
};

/**
 * Returns a serialized version of the context state.
 * @return a string that represents the state.
 */
TModuleContext.prototype.stateSave = function()
{
	/*
	 * tvalue: TAME value structure.
	 * atomicref: is an array with one index (integer reference: next refid).
	 * referenceSet (WeakMap): value -> integer - reference to id map
	 * targetRefmap (object): integer -> value - output set to add to state.
	 * Returns: resultant value to write in place of a value. 
	 */
	var REFADD = function(tvalue, atomicRef, referenceSet, targetRefmap) 
	{
		// if referential
		if (TValue.isReferenceCopied(tvalue))
		{
			// if we've not seen the object yet,
			if (!referenceSet.has(tvalue.value))
			{
				// handle lists recursively.
				if (tvalue.type === TValue.Type.LIST)
				{
					let ls = tvalue.value;
					for (let i = 0; i < ls.length; i++)
						ls[i] = REFADD(ls[i], atomicRef, referenceSet, targetRefmap);
				}
				
				let id = (atomicRef[0] += 1);
				targetRefmap[id] = tvalue;
				referenceSet.set(tvalue.value, id);
				return {"refid": id};
			}
			// else if we have,
			else
			{
				return {"refid": referenceSet.get(tvalue.value)};
			}
		}
		// if not reference-copied, return itself. (no change)
		else
		{
			return tvalue;
		}
	};
	
	let state = this.state;
	state.refMap = {};
	let curRef = [0];
	let vmap = new WeakMap();

	// For each element context...
	for (let identity in state.elements) if (state.elements.hasOwnProperty(identity))
	{
		let element = state.elements[identity];

		// For each variable in the element context...
		for (let valueName in element.variables) if (element.variables.hasOwnProperty(valueName))
		{
			element.variables[valueName] = REFADD(element.variables[valueName], curRef, vmap, state.refMap);
		}
	}

	let output = JSON.stringify(state);
	
	// horrible hack incoming
	this.stateRestore(output);
	
	return output;
};

/**
 * Restores the context from a serialized version of the context state.
 * @param stateData the state data to use for restoration.
 */
TModuleContext.prototype.stateRestore = function(stateData)
{
	this.state = JSON.parse(stateData);
	let state = this.state;
	
	if (!state.refMap)
		throw TAMEError.ModuleState("Context state is missing required member: refMap");

	/*
	 * tvalue: TAME value structure.
	 * refmap (object): integer -> value map.
	 * Returns: resultant value to set in place of a value. 
	 */
	var REFSWAP = function(tvalue, refmap) 
	{
		if (tvalue.refid)
		{
			let out = refmap[tvalue.refid];

			// handle lists recursively.
			if (out.type === TValue.Type.LIST)
			{
				let ls = out.value;
				for (let i = 0; i < ls.length; i++)
					ls[i] = REFSWAP(ls[i], refmap);
			}
			return out;
		}
		else
		{
			return tvalue;
		}
	};
	
	for (let identity in state.elements) if (state.elements.hasOwnProperty(identity))
	{
		let element = state.elements[identity];
		for (let valueName in element.variables) if (element.variables.hasOwnProperty(valueName))
		{
			element.variables[valueName] = REFSWAP(element.variables[valueName], state.refMap);
		}
	}
		
	delete state.refMap;
	
	console.log(JSON.stringify(state));
};

/**
 * Sets the current player.
 * @param playerIdentity the player identity, or null.
 * @throws TAMEError if no such player.
 */
TModuleContext.prototype.setCurrentPlayer = function(playerIdentity) 
{
	let contextState = this.state;

	if (!contextState)
		throw TAMEError.ModuleState("Context is invalid or null");
	if(!contextState.elements)
		throw TAMEError.ModuleState("Context state is missing required member: elements");
	
	playerIdentity = playerIdentity.toLowerCase();
	
	if (!contextState.elements[playerIdentity])
		throw TAMEError.ModuleExecution("Element is missing from context state: "+playerIdentity);
	
	contextState.player = playerIdentity;
};

/**
 * Removes a player from all rooms.
 * @param playerIdentity the player identity.
 * @throws TAMEError if no such player.
 */
TModuleContext.prototype.removePlayer = function(playerIdentity) 
{
	let contextState = this.state;

	if (!contextState)
		throw TAMEError.ModuleState("Context is invalid or null");
	if(!contextState.elements)
		throw TAMEError.ModuleState("Context state is missing required member: elements");
	
	playerIdentity = playerIdentity.toLowerCase();
	
	if (!contextState.elements[playerIdentity])
		throw TAMEError.ModuleExecution("Element is missing from context state: "+playerIdentity);
	delete contextState.roomStacks[playerIdentity];
};

/**
 * Pushes a room onto a player room stack.
 * @param playerIdentity the player identity.
 * @param roomIdentity the room identity.
 * @throws TAMEError if no such element context.
 */
TModuleContext.prototype.pushRoomOntoPlayer = function(playerIdentity, roomIdentity) 
{
	let contextState = this.state;

	if(!contextState.elements)
		throw TAMEError.ModuleState("Context state is missing required member: elements");
	if(!contextState.roomStacks)
		throw TAMEError.ModuleState("Context state is missing required member: roomStacks");

	playerIdentity = playerIdentity.toLowerCase();
	roomIdentity = roomIdentity.toLowerCase();

	if (!contextState.elements[playerIdentity])
		throw TAMEError.ModuleExecution("Element is missing from context state: "+playerIdentity);
	if (!contextState.elements[roomIdentity])
		throw TAMEError.ModuleExecution("Element is missing from context state: "+roomIdentity);
	
	if (!contextState.roomStacks[playerIdentity])
		contextState.roomStacks[playerIdentity] = [];
	contextState.roomStacks[playerIdentity].push(roomIdentity);
};
	
/**
 * Pops a room off of a player room stack.
 * @param playerIdentity the player identity.
 * @throws TAMEError if no such element context.
 */
TModuleContext.prototype.popRoomFromPlayer = function(playerIdentity)
{
	let contextState = this.state;

	if(!contextState.elements)
		throw TAMEError.ModuleState("Context state is missing required member: elements");
	if(!contextState.roomStacks)
		throw TAMEError.ModuleState("Context state is missing required member: roomStacks");

	playerIdentity = playerIdentity.toLowerCase();

	if (!contextState.elements[playerIdentity])
		throw TAMEError.ModuleExecution("Element is missing from context state: "+playerIdentity);
	if (!contextState.roomStacks[playerIdentity])
		return;

	let out = contextState.roomStacks[playerIdentity].pop();
	if (!contextState.roomStacks[playerIdentity].length)
		delete contextState.roomStacks[playerIdentity];
	return out;
};

/**
 * Checks if a player is in a room (or if the room is in the player's room stack).
 * @param playerIdentity the player identity.
 * @param roomIdentity the room identity.
 * @return true if the room is in the player's stack, false if not, or the player is in no room.
 * @throws TAMEError if no such element context.
 */
TModuleContext.prototype.checkPlayerIsInRoom = function(playerIdentity, roomIdentity) 
{
	let contextState = this.state;

	if(!contextState.elements)
		throw TAMEError.ModuleState("Context state is missing required member: elements");
	if(!contextState.roomStacks)
		throw TAMEError.ModuleState("Context state is missing required member: roomStacks");

	playerIdentity = playerIdentity.toLowerCase();
	roomIdentity = roomIdentity.toLowerCase();

	if (!contextState.elements[playerIdentity])
		throw TAMEError.ModuleExecution("Element is missing from context state: "+playerIdentity);
	if (!contextState.elements[roomIdentity])
		throw TAMEError.ModuleExecution("Element is missing from context state: "+roomIdentity);
	
	let roomstack = contextState.roomStacks[playerIdentity];
	if (!roomstack)
		return false;
	else
		return roomstack.indexOf(roomIdentity) >= 0;
};

/**
 * Removes an object from its owner.
 * @param objectIdentity the object identity.
 * @throws TAMEError if no such element context.
 */
TModuleContext.prototype.removeObject = function(objectIdentity) 
{
	let contextState = this.state;

	if(!contextState.elements)
		throw TAMEError.ModuleState("Context state is missing required member: elements");
	if(!contextState.objectOwners)
		throw TAMEError.ModuleState("Context state is missing required member: objectOwners");
	if(!contextState.owners)
		throw TAMEError.ModuleState("Context state is missing required member: owners");

	objectIdentity = objectIdentity.toLowerCase();
	
	if (!contextState.elements[objectIdentity])
		throw TAMEError.ModuleExecution("Element is missing from context state: "+objectIdentity);
	
	let elementIdentity = contextState.objectOwners[objectIdentity];
	if (!elementIdentity)
		return;
	
	delete contextState.objectOwners[objectIdentity];
	Util.arrayRemove(contextState.owners[elementIdentity], objectIdentity);
};

/**
 * Adds an object to an element.
 * @param elementIdentity the element identity.
 * @param objectIdentity the object identity.
 * @throws TAMEError if no such element context.
 */
TModuleContext.prototype.addObjectToElement = function(elementIdentity, objectIdentity) 
{
	let contextState = this.state;

	if(!contextState.elements)
		throw TAMEError.ModuleState("Context state is missing required member: elements");
	if(!contextState.objectOwners)
		throw TAMEError.ModuleState("Context state is missing required member: objectOwners");
	if(!contextState.owners)
		throw TAMEError.ModuleState("Context state is missing required member: owners");

	elementIdentity = elementIdentity.toLowerCase();
	objectIdentity = objectIdentity.toLowerCase();
	
	if (!contextState.elements[elementIdentity])
		throw TAMEError.ModuleExecution("Element is missing from context state: "+elementIdentity);
	if (!contextState.elements[objectIdentity])
		throw TAMEError.ModuleExecution("Element is missing from context state: "+objectIdentity);
	
	this.removeObject(objectIdentity);
	contextState.objectOwners[objectIdentity] = elementIdentity;
	
	if (!contextState.owners[elementIdentity])
		contextState.owners[elementIdentity] = [];
	contextState.owners[elementIdentity].push(objectIdentity);
};

/**
 * Checks if an object is owned by an element.
 * @param elementIdentity the element identity.
 * @param objectIdentity the object identity.
 * @return true if the element is the owner of the object, false if not.
 * @throws TAMEError if no such element context.
 */
TModuleContext.prototype.checkElementHasObject = function(elementIdentity, objectIdentity) 
{
	let contextState = this.state;

	if(!contextState.elements)
		throw TAMEError.ModuleState("Context state is missing required member: elements");
	if(!contextState.objectOwners)
		throw TAMEError.ModuleState("Context state is missing required member: objectOwners");

	elementIdentity = elementIdentity.toLowerCase();
	objectIdentity = objectIdentity.toLowerCase();

	if (!contextState.elements[elementIdentity])
		throw TAMEError.ModuleExecution("Element is missing from context state: "+elementIdentity);
	if (!contextState.elements[objectIdentity])
		throw TAMEError.ModuleExecution("Element is missing from context state: "+objectIdentity);
	
	return contextState.objectOwners[objectIdentity] == elementIdentity;
};


/**
 * Checks if an object has no owner.
 * @param objectIdentity the object identity.
 * @return true if the object is owned by nobody, false if it has an owner.
 * @throws TAMEError if no such element context.
 */
TModuleContext.prototype.checkObjectHasNoOwner = function(objectIdentity) 
{
	let contextState = this.state;

	if(!contextState.elements)
		throw TAMEError.ModuleState("Context state is missing required member: elements");
	if(!contextState.objectOwners)
		throw TAMEError.ModuleState("Context state is missing required member: objectOwners");

	objectIdentity = objectIdentity.toLowerCase();
	
	if (!contextState.elements[objectIdentity])
		throw TAMEError.ModuleExecution("Element is missing from context state: "+objectIdentity);
	
	return !contextState.objectOwners[objectIdentity];
};

/**
 * Gets a list of objects owned by this element.
 * The list is a copy, and can be modified without ruining the original.
 * @param elementIdentity the element identity.
 * @return an array of object identities contained by this element.
 * @throws TAMEError if no such element context.
 */
TModuleContext.prototype.getObjectsOwnedByElement = function(elementIdentity)
{
	let contextState = this.state;

	if(!contextState.elements)
		throw TAMEError.ModuleState("Context state is missing required member: elements");
	if(!contextState.owners)
		throw TAMEError.ModuleState("Context state is missing required member: owners");

	elementIdentity = elementIdentity.toLowerCase();
	
	if (!contextState.elements[elementIdentity])
		throw TAMEError.ModuleExecution("Element is missing from context state: "+elementIdentity);
	
	let arr = contextState.owners[elementIdentity];
	if (!arr)
		return [];
	else
		return arr.slice(); // return copy of full array.
};

/**
 * Gets a count of objects owned by this element.
 * The list is a copy, and can be modified without ruining the original.
 * @param elementIdentity the element identity.
 * @return an array of object identities contained by this element.
 * @throws TAMEError if no such element context.
 */
TModuleContext.prototype.getObjectsOwnedByElementCount = function(elementIdentity)
{
	let contextState = this.state;

	if(!contextState.elements)
		throw TAMEError.ModuleState("Context state is missing required member: elements");
	if(!contextState.owners)
		throw TAMEError.ModuleState("Context state is missing required member: owners");

	elementIdentity = elementIdentity.toLowerCase();

	if (!contextState.elements[elementIdentity])
		throw TAMEError.ModuleExecution("Element is missing from context state: "+elementIdentity);
	
	let arr = contextState.owners[elementIdentity];
	if (!arr)
		return 0;
	else
		return arr.length;
};

/**
 * Adds a interpretable name to an object.
 * The name is converted to lowercase and all contiguous whitespace is replaced with single spaces.
 * Does nothing if the object already has the name.
 * More than one object with this name can result in "ambiguous" actions!
 * @param objectIdentity the object identity.
 * @param name the name to add.
 * @throws TAMEError if no such element context.
 */
TModuleContext.prototype.addObjectName = function(objectIdentity, name)
{
	let contextState = this.state;

	if(!contextState.elements)
		throw TAMEError.ModuleState("Context state is missing required member: elements");
	if(!contextState.names)
		throw TAMEError.ModuleState("Context state is missing required member: names");

	objectIdentity = objectIdentity.toLowerCase();
	
	if (!contextState.elements[objectIdentity])
		throw TAMEError.ModuleExecution("Element is missing from context state: "+objectIdentity);
	
	let object = this.getElement(objectIdentity);
	
	name = Util.replaceAll(name.trim().toLowerCase(), "\\s+", " ");
	Util.objectStringAdd(contextState.names, objectIdentity, name);
	Util.each(object.determiners, function(determiner)
	{
		determiner = Util.replaceAll(determiner.trim().toLowerCase(), "\\s+", " ");
		Util.objectStringAdd(contextState.names, objectIdentity, determiner + ' ' + name);
	});
};

/**
 * Removes an interpretable name from an object.
 * The name is converted to lowercase and all contiguous whitespace is replaced with single spaces.
 * Does nothing if the object does not have the name.
 * @param objectIdentity the object identity.
 * @param name the name to remove.
 * @throws TAMEError if no such element context.
 */
TModuleContext.prototype.removeObjectName = function(objectIdentity, name)
{
	let contextState = this.state;

	if(!contextState.elements)
		throw TAMEError.ModuleState("Context state is missing required member: elements");
	if(!contextState.names)
		throw TAMEError.ModuleState("Context state is missing required member: names");

	objectIdentity = objectIdentity.toLowerCase();

	if (!contextState.elements[objectIdentity])
		throw TAMEError.ModuleExecution("Element is missing from context state: "+objectIdentity);

	var object = this.getElement(objectIdentity);
	
	name = Util.replaceAll(name.trim().toLowerCase(), "\\s+", " ");
	Util.objectStringRemove(contextState.names, objectIdentity, name);
	Util.each(object.determiners, function(determiner)
	{
		determiner = Util.replaceAll(determiner.trim().toLowerCase(), "\\s+", " ");
		Util.objectStringRemove(contextState.names, objectIdentity, determiner + ' ' + name);
	});
};

/**
 * Checks for an interpretable name on an object.
 * @param objectIdentity the object identity.
 * @param name the name to remove.
 * @return true if it exists, false if not.
 * @throws TAMEError if no such element context.
 */
TModuleContext.prototype.checkObjectHasName = function(objectIdentity, name) 
{
	let contextState = this.state;

	if(!contextState.elements)
		throw TAMEError.ModuleState("Context state is missing required member: elements");
	if(!contextState.names)
		throw TAMEError.ModuleState("Context state is missing required member: names");
	
	objectIdentity = objectIdentity.toLowerCase();

	if (!contextState.elements[objectIdentity])
		throw TAMEError.ModuleExecution("Element is missing from context state: "+objectIdentity);

	name = name.toLowerCase();
	return Util.objectStringContains(contextState.names, objectIdentity, name);
};

/**
 * Adds a tag to an object. Tags are case-insensitive.
 * Unlike names, tags undergo no whitespace conversion.
 * Does nothing if the object already has the tag.
 * @param objectIdentity the object identity.
 * @param name the name to add.
 * @throws TAMEError if no such element context.
 */
TModuleContext.prototype.addObjectTag = function(objectIdentity, tag)
{
	let contextState = this.state;

	if(!contextState.elements)
		throw TAMEError.ModuleState("Context state is missing required member: elements");
	if(!contextState.tags)
		throw TAMEError.ModuleState("Context state is missing required member: tags");
	
	objectIdentity = objectIdentity.toLowerCase();

	if (!contextState.elements[objectIdentity])
		throw TAMEError.ModuleExecution("Element is missing from context state: "+objectIdentity);
	
	tag = tag.toLowerCase();
	Util.objectStringAdd(contextState.tags, objectIdentity, tag);
};

/**
 * Removes a tag from an object. Tags are case-insensitive.
 * Unlike names, tags undergo no whitespace conversion.
 * Does nothing if the object does not have the tag.
 * @param objectIdentity the object identity.
 * @param name the name to remove.
 * @throws TAMEError if no such element context.
 */
TModuleContext.prototype.removeObjectTag = function(objectIdentity, tag)
{
	let contextState = this.state;

	if(!contextState.elements)
		throw TAMEError.ModuleState("Context state is missing required member: elements");
	if(!contextState.tags)
		throw TAMEError.ModuleState("Context state is missing required member: tags");
	
	objectIdentity = objectIdentity.toLowerCase();

	if (!contextState.elements[objectIdentity])
		throw TAMEError.ModuleExecution("Element is missing from context state: "+objectIdentity);

	tag = tag.toLowerCase();
	Util.objectStringRemove(contextState.tags, objectIdentity, tag);
};

/**
 * Checks for a tag on an object. Tags are case-insensitive.
 * Unlike names, tags undergo no whitespace conversion.
 * @param objectIdentity the object identity.
 * @param name the name to remove.
 * @return true if it exists, false if not.
 * @throws TAMEError if no such element context.
 */
TModuleContext.prototype.checkObjectHasTag = function(objectIdentity, tag) 
{
	let contextState = this.state;

	if(!contextState.elements)
		throw TAMEError.ModuleState("Context state is missing required member: elements");
	if(!contextState.tags)
		throw TAMEError.ModuleState("Context state is missing required member: tags");
	
	objectIdentity = objectIdentity.toLowerCase();

	if (!contextState.elements[objectIdentity])
		throw TAMEError.ModuleExecution("Element is missing from context state: "+objectIdentity);

	tag = tag.toLowerCase();
	return Util.objectStringContains(contextState.tags, objectIdentity, tag);
};

/**
 * Gets an element by its identity.
 * @return the element or null.
 */
TModuleContext.prototype.getElement = function(elementIdentity)
{
	return this.module.elements[elementIdentity.toLowerCase()];
};

/**
 * Gets an element context by its identity.
 * @return the element context or null.
 * @throws TAMEError if no such stored element context.
 */
TModuleContext.prototype.getElementContext = function(elementIdentity)
{
	let contextState = this.state;

	if(!contextState.elements)
		throw TAMEError.ModuleState("Context state is missing required member: elements");
	
	return contextState.elements[elementIdentity.toLowerCase()];
};

/**
 * Gets the current player.
 * @return player element, or null/undefined if no current player.
 * @throws TAMEError if no such stored element context.
 */
TModuleContext.prototype.getCurrentPlayer = function()
{
	let contextState = this.state;

	if(!contextState.elements)
		throw TAMEError.ModuleState("Context state is missing required member: elements");

	if (!contextState.player)
		return null;
	
	return this.getElement(contextState.player);
};

/**
 * Gets the current player context.
 * @return player context, or null/undefined if no current player.
 * @throws TAMEError if no such stored element context.
 */
TModuleContext.prototype.getCurrentPlayerContext = function()
{
	let player = this.getCurrentPlayer();
	if (!player)
		return null;
	
	return this.getElementContext(player.identity);
};

/**
 * Gets the current room. Influenced by current player.
 * @return room element, or null if no current room (or no current player).
 * @throws TAMEError if no such stored element context.
 */
TModuleContext.prototype.getCurrentRoom = function(playerIdentity)
{
	let contextState = this.state;

	if(!contextState.elements)
		throw TAMEError.ModuleState("Context state is missing required member: elements");
	if(!contextState.roomStacks)
		throw TAMEError.ModuleState("Context state is missing required member: roomStacks");

	if (!playerIdentity)
		playerIdentity = contextState.player;
	else
		playerIdentity = playerIdentity.toLowerCase(); 
	
	if (!playerIdentity)
		return null;

	if (!contextState.elements[playerIdentity])
		throw TAMEError.ModuleExecution("Element is missing from context state: "+playerIdentity);

	let stack = contextState.roomStacks[playerIdentity];

	if (!stack)
		return null;

	return this.getElement(stack[stack.length - 1]);
};

/**
 * Gets the current room context.
 * @return room context, or null/undefined if no current player.
 * @throws TAMEError if no such stored element context.
 */
TModuleContext.prototype.getCurrentRoomContext = function(playerIdentity)
{
	let room = this.getCurrentRoom(playerIdentity);
	if (!room)
		return null;
	
	return this.getElementContext(room.identity);
};

/**
 * Resolves an action by its action identity.
 * @param actionIdentity the action identity.
 * @return the corresponding action or null if no current room or player.
 * @throws TAMEError if no such element context.
 */
TModuleContext.prototype.resolveAction = function(actionIdentity)
{	
	let out = this.module.actions[actionIdentity];
	if (!out)
		throw TAMEError.ModuleExecution("Action is missing from module: "+actionIdentity);		
	return this.module.actions[actionIdentity];
};

/**
 * Resolves an element by its identity.
 * The identities "player", "room", and "world" are special.
 * @param elementIdentity the element identity.
 * @return the corresponding action or null if no current room or player.
 * @throws TAMEError if no such element context or if identity refers to a current object that is not set.
 */
TModuleContext.prototype.resolveElement = function(elementIdentity)
{	
	var element = null;
	elementIdentity = elementIdentity.toLowerCase();
	
	// current player
	if (elementIdentity === 'player')
	{
		element = this.getCurrentPlayer();
		if (!element)
			throw TAMEError.ModuleExecution("Current player context called with no current player!");
		return element;
	}
	// current room
	else if (elementIdentity === 'room')
	{
		let player = this.getCurrentPlayer();
		if (!player)
			throw TAMEError.ModuleExecution("Current room context called with no current player!");
		
		element = this.getCurrentRoom();
		if (!element)
			throw TAMEError.ModuleExecution("Current room context called with no current room!");
		return element;
	}
	else
	{
		element = this.getElement(elementIdentity);
		if (!element)
			throw TAMEError.ModuleExecution("Expected element '"+elementIdentity+"' in module!");
		return element;
	}
};

/**
 * Resolves an element context by its identity.
 * The identities "player", "room", and "world" are special.
 * @param elementIdentity the element identity.
 * @return the corresponding action or null if no current room or player.
 * @throws TAMEError if no such element context or if identity refers to a current object that is not set.
 */
TModuleContext.prototype.resolveElementContext = function(elementIdentity)
{	
	var contextState = this.state;

	if(!contextState.elements)
		throw TAMEError.ModuleState("Context state is missing required member: elements");

	var element = this.resolveElement(elementIdentity);

	var ident = element.identity.toLowerCase();
	
	if (!contextState.elements[ident])
		throw TAMEError.ModuleExecution("Element is missing from context state: "+element.identity);
	
	return contextState.elements[ident];
};


/**
 * Gets the entry block name for a block type and values.
 * This is used to resolve blocks.
 * @param blockType the block entry type.
 * @param blockValues the values for matching the block.
 * @return the resultant name.
 */
TModuleContext.prototype.resolveBlockName = function(blockType, blockValues)
{
	var blockname =	blockType + "(";
	if (blockValues) for (var i = 0; i < blockValues.length; i++)
	{
		blockname += TValue.toString(blockValues[i]);
		if (i < blockValues.length - 1)
			blockname += ",";
	}
	blockname += ")";
	return blockname;
};

/**
 * Resolves a qualifying code block starting from an element.
 * The identities "player", "room", and "world" are special.
 * @param elementIdentity the starting element identity.
 * @param blockType the block entry type.
 * @param blockValues the values for matching the block.
 * @return the first qualifying block in the lineage, or null if no matching block.
 * @throws TAMEError if no such element context.
 */
TModuleContext.prototype.resolveBlock = function(elementIdentity, blockType, blockValues)
{
	var blockname = this.resolveBlockName(blockType, blockValues);
	var element = this.resolveElement(elementIdentity); 
	
	while (element)
	{
		var out = element.blockTable[blockname];
		if (out)
			return out;
		if (element.parent)
			element = this.resolveElement(element.parent);
		else
			element = null;
	}

	return null;
};

/**
 * Resolves a qualifying function by name starting from an element.
 * The identities "player", "room", and "world" are special.
 * @param elementIdentity the starting element identity.
 * @param functionName the name of the function.
 * @return the first qualifying function in the lineage, or null if no matching entry.
 * @throws TAMEError if no such element context.
 */
TModuleContext.prototype.resolveFunction = function(elementIdentity, functionName)
{
	var element = this.resolveElement(elementIdentity); 
	functionName = functionName.toLowerCase();
	
	while (element)
	{
		var out = element.functionTable[functionName];
		if (out)
			return out;
		if (element.parent)
			element = this.resolveElement(element.parent);
		else
			element = null;
	}

	return null;	
};

/**
 * Returns all objects in the accessible area by an object name read from the interpreter.
 * The output stops if the size of the output array is reached.
 * @param name the name from the interpreter.
 * @param outputArray the output vector of found objects.
 * @param arrayOffset the starting offset into the array to put them.
 * @return the amount of objects found.
 */
TModuleContext.prototype.getAccessibleObjectsByName = function(name, outputArray, arrayOffset)
{
	var playerContext = this.getCurrentPlayerContext();
	var roomContext = this.getCurrentRoomContext();
	var worldContext = this.getElementContext("world");

	var start = arrayOffset;
	var arr = null;
	
	if (playerContext !== null)
	{
		arr = this.getObjectsOwnedByElement(playerContext.identity);
		for (let x in arr) if (arr.hasOwnProperty(x))
		{
			var objectIdentity = arr[x];
			if (this.checkObjectHasName(objectIdentity, name))
			{
				outputArray[arrayOffset++] = this.getElement(objectIdentity);
				if (arrayOffset == outputArray.length)
					return arrayOffset - start;
			}
		}
	}
	if (roomContext !== null) 
	{
		arr = this.getObjectsOwnedByElement(roomContext.identity);
		for (let x in arr) if (arr.hasOwnProperty(x))
		{
			let objectIdentity = arr[x];
			if (this.checkObjectHasName(objectIdentity, name))
			{
				outputArray[arrayOffset++] = this.getElement(objectIdentity);
				if (arrayOffset == outputArray.length)
					return arrayOffset - start;
			}
		}
	}
	
	arr = this.getObjectsOwnedByElement(worldContext.identity);
	for (let x in arr) if (arr.hasOwnProperty(x))
	{
		let objectIdentity = arr[x];
		if (this.checkObjectHasName(objectIdentity, name))
		{
			outputArray[arrayOffset++] = this.getElement(objectIdentity);
			if (arrayOffset == outputArray.length)
				return arrayOffset - start;
		}
	}
	
	return arrayOffset - start;
};




/**
 * Constructor for TDataReader.
 * This is a sequential reader for array buffers.
 * @param dataView (DataView) the Data View to read from.
 */
var TDataReader = function(dataView, littleEndian)
{
	this.dataView = dataView;
	this.littleEndian = littleEndian;
	this.pos = 0;
};

/**
 * Creates a new TDataReader that is split from this one from its current position.
 * @param len (Number:int) the length of the new view in bytes.
 */
TDataReader.prototype.split = function(len)
{
	let buf = this.dataView.buffer;
	return new TDataReader(new DataView(buf.slice(this.pos, this.pos + len)), this.littleEndian);
};

/**
 * Reads a signed 8-bit int.
 * Advances 1 byte.
 */
TDataReader.prototype.readInt8 = function()
{
	let out = this.dataView.getInt8(this.pos);
	this.pos = this.pos + 1;
	return out;
};

/**
 * Reads an unsigned 8-bit int.
 * Advances 1 byte.
 */
TDataReader.prototype.readUInt8 = function()
{
	let out = this.dataView.getUint8(this.pos);
	this.pos = this.pos + 1;
	return out;
};

/**
 * Reads a boolean value.
 * Advances 1 byte.
 */
TDataReader.prototype.readBoolean = function()
{
	return this.readUInt8() !== 0;
};

/**
 * Reads a sequence of bytes (UInt8's).
 * Advances 'bytes' bytes.
 */
TDataReader.prototype.readBytes = function(bytes)
{
	let out = [];
	while (bytes--)
		out.push(this.readUInt8());
	return out;
};

/**
 * Reads a signed 16-bit int.
 * Advances 2 bytes.
 */
TDataReader.prototype.readInt16 = function()
{
	let out = this.dataView.getInt16(this.pos, this.littleEndian);
	this.pos = this.pos + 2;
	return out;
};

/**
 * Reads an unsigned 16-bit int.
 * Advances 2 bytes.
 */
TDataReader.prototype.readUInt16 = function()
{
	let out = this.dataView.getUint16(this.pos, this.littleEndian);
	this.pos = this.pos + 2;
	return out;
};

/**
 * Reads a signed 32-bit int.
 * Advances 4 bytes.
 */
TDataReader.prototype.readInt32 = function()
{
	let out = this.dataView.getInt32(this.pos, this.littleEndian);
	this.pos = this.pos + 4;
	return out;
};

/**
 * Reads an unsigned 32-bit int.
 * Advances 4 bytes.
 */
TDataReader.prototype.readUInt32 = function()
{
	let out = this.dataView.getUint32(this.pos, this.littleEndian);
	this.pos = this.pos + 4;
	return out;
};

/**
 * Reads a signed 64-bit int (MAX 2^53).
 * Advances 8 bytes.
 */
TDataReader.prototype.readInt64 = function()
{
	let low = 0;
	let high = 0;
	if (this.littleEndian)
	{
		low =  this.readUInt32();
		high = this.readUInt32();
	}
	else
	{
		high = this.readUInt32();
		low =  this.readUInt32();
	}

	// negative check
	if (high & 0x80000000)
		return (Math.pow(2,32)*(high & 0x001fffff) + low) - 0x0020000000000000;
	else
		return Math.pow(2,32)*(high & 0x001fffff) + low; 
};

/**
 * Reads a 32-bit float.
 * Advances 4 bytes.
 */
TDataReader.prototype.readFloat32 = function()
{
	let out = this.dataView.getFloat32(this.pos, this.littleEndian);
	this.pos = this.pos + 4;
	return out;
};

/**
 * Reads a 64-bit float.
 * Advances 8 bytes.
 */
TDataReader.prototype.readFloat64 = function()
{
	let out = this.dataView.getFloat64(this.pos, this.littleEndian);
	this.pos = this.pos + 8;
	return out;
};

/**
 * Reads an ASCII character.
 * Advances 1 byte.
 * @return (string)
 */
TDataReader.prototype.readASCIIChar = function()
{
	let c = this.readUInt8();
	return String.fromCharCode(c);
};

/**
 * Reads a UTF-8 character.
 * Advances the amount of bytes that it takes to read one character, since UTF-8 characters very in width.
 * @return (string)
 */
TDataReader.prototype.readUTF8Char = function()
{
	let c1 = this.readUInt8();
	switch (c1 >> 4)
	{
		case 0:
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
		case 6:
		case 7:
			return String.fromCodePoint(c1);
		
		case 12:
		case 13:
		{
			let c2 = this.readUInt8();
			return String.fromCodePoint(((c1 & 0x1f) << 6) | (c2 & 0x3f));
		}
		
		case 14:
		{
			let c2 = this.readUInt8();
			let c3 = this.readUInt8();
			return String.fromCodePoint(((c1 & 0x0f) << 12) | ((c2 & 0x3f) << 6) | ((c3 & 0x3f) << 0));
		}
		
		case 15:
		{
			let c2 = this.readUInt8();
			let c3 = this.readUInt8();
			let c4 = this.readUInt8();
			return String.fromCodePoint(((c1 & 0x07) << 18) | ((c2 & 0x3f) << 12) | ((c3 & 0x3f) << 6) | (c4 & 0x3f));
		}
		
		default:
			throw new RangeError("Bad UTF-8 character encoding.");
	}
};


/****************************************************
 Factory for reading modules from binary data.
 ****************************************************/

var TBinaryReader = {};

// Block entry types.
TBinaryReader.BlockEntryType = [
	'INIT',
	'START',
	'AFTERSUCCESSFULCOMMAND',
	'AFTERFAILEDCOMMAND',
	'AFTEREVERYCOMMAND',
	'ONACTION',
	'ONMODALACTION',
	'ONACTIONWITH',
	'ONACTIONWITHANCESTOR',
	'ONACTIONWITHOTHER',
	'ONUNHANDLEDACTION',
	'ONUNKNOWNCOMMAND',
	'ONAMBIGUOUSCOMMAND',
	'ONINCOMPLETECOMMAND',
	'ONMALFORMEDCOMMAND',
	'ONELEMENTBROWSE',
	'ONWORLDBROWSE',
	'ONROOMBROWSE',
	'ONPLAYERBROWSE',
	'ONCONTAINERBROWSE'
];

/**
 * Reads a set of ASCII characters from a data reader.
 * @param dataReader (TDataReader) the data reader already positioned for reading.
 * @param characters (Number:int) the amount of characters to read. 
 * @return (string) a JS string.
 * @throws RangeError on a read error (incomplete data).
 */
TBinaryReader.readASCII = function(dataReader, characters)
{
	let out = '';
	while (characters--)
		out += dataReader.readASCIIChar();
	return out;
};


/**
 * Reads a UTF-8 encoded string from a set of bytes assumed to be a UTF-8 string.
 * @param byteArray (Array) an array of 8-bit unsigned bytes.
 * @return (string) a JS string.
 * @throws Error on a read error (incomplete/bad data).
 */
TBinaryReader.utf8BytesToString = function(byteArray)
{
	let out = '';
	let index = 0;
	while (index < byteArray.length)
	{
		let c1 = byteArray[index++];
		switch (c1 >> 4)
		{
			case 0:
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
				out += String.fromCodePoint(c1);
				continue;
			
			case 12:
			case 13:
			{
				let c2 = byteArray[index++];
				out += String.fromCodePoint(((c1 & 0x1f) << 6) | (c2 & 0x3f));
				continue;
			}
			
			case 14:
			{
				let c2 = byteArray[index++];
				let c3 = byteArray[index++];
				out += String.fromCodePoint(((c1 & 0x0f) << 12) | ((c2 & 0x3f) << 6) | ((c3 & 0x3f) << 0));
				continue;
			}
			
			case 15:
			{
				let c2 = byteArray[index++];
				let c3 = byteArray[index++];
				let c4 = byteArray[index++];
				out += String.fromCodePoint(((c1 & 0x07) << 18) | ((c2 & 0x3f) << 12) | ((c3 & 0x3f) << 6) | (c4 & 0x3f));
				continue;
			}
			
			default:
				throw new Error("Bad UTF-8 character encoding in ["+byteArray.toString()+"]");
		}
	}
	
	return out;
};

/**
 * Reads a UTF-8 encoded string from a data reader.
 * @param dataReader (TDataReader) the data reader already positioned for reading.
 * @return (string) a JS string.
 * @throws RangeError on a read error (incomplete data).
 */
TBinaryReader.readUTF8String = function(dataReader)
{
	// length is in bytes, not chars!
	let len = dataReader.readInt32();
	let bytes = dataReader.readBytes(len);
	return TBinaryReader.utf8BytesToString(bytes);
};

/**
 * Reads a variable-length encoded 32-bit integer.
 * @param dataReader (TDataReader) the data reader already positioned for reading.
 * @return (Number:int) an integer.
 * @throws RangeError on a read error (incomplete data).
 */
TBinaryReader.readVariableLengthInt = function(dataReader)
{
	let out = 0;
	let b = 0;
	do {
		b = dataReader.readUInt8();
		out = out | (b & 0x7f);
		if ((b & 0x80) !== 0)
			out = out << 7;
	} while ((b & 0x80) !== 0);
	return out;
};

/**
 * Reads a string array from a data reader (strings are UTF-8 encoded).
 * @param dataReader (TDataReader) the data reader already positioned for reading.
 * @return (object) an object that maps strings to strings.
 * @throws RangeError on a read error (incomplete data).
 */
TBinaryReader.readUTF8StringArray = function(dataReader)
{
	let out = [];
	let size = dataReader.readInt32();
	while (size--)
		out.push(TBinaryReader.readUTF8String(dataReader));
	return out;
};

/**
 * Reads a string map from a data reader (strings are UTF-8 encoded).
 * @param dataReader (TDataReader) the data reader already positioned for reading.
 * @return (object) an object that maps strings to strings.
 * @throws RangeError on a read error (incomplete data).
 */
TBinaryReader.readUTF8StringMap = function(dataReader)
{
	let out = {};
	let size = dataReader.readInt32();
	while (size--)
		out[TBinaryReader.readUTF8String(dataReader)] = TBinaryReader.readUTF8String(dataReader);
	return out;
};

/**
 * Reads a TAME value from a data reader.
 * @param dataReader (TDataReader) the data reader already positioned for reading.
 * @return (object) an object that represents a TValue.
 * @throws TAMEError on a read error, RangeError on a read error (incomplete data).
 */
TBinaryReader.readValue = function(dataReader)
{
	let type = dataReader.readUInt8();
	switch (type)
	{
		case 0:
			return TValue.createBoolean(dataReader.readBoolean());
		case 1:
			return TValue.createInteger(dataReader.readInt64());
		case 2:
			return TValue.createFloat(dataReader.readFloat64());
		case 3:
			return TValue.createString(TBinaryReader.readUTF8String(dataReader));
		case 4:
			let list = TValue.createList([]);
			let size = dataReader.readInt32();
			while (size--)
				TValue.listAdd(list, TBinaryReader.readValue(dataReader));
			return list;
		case 5:
			return TValue.createObject(TBinaryReader.readUTF8String(dataReader));
		case 6:
			return TValue.createContainer(TBinaryReader.readUTF8String(dataReader));
		case 7:
			return TValue.createPlayer(TBinaryReader.readUTF8String(dataReader));
		case 8:
			return TValue.createRoom(TBinaryReader.readUTF8String(dataReader));
		case 9:
			return TValue.createWorld(TBinaryReader.readUTF8String(dataReader));
		case 10:
			return TValue.createAction(TBinaryReader.readUTF8String(dataReader));
		case 11:
			return TValue.createVariable(TBinaryReader.readUTF8String(dataReader));
		default:
			throw TAMEError.Module("Bad value type. Internal error!");
	}
};

/**
 * Reads an operation.
 * @param dataReader (TDataReader) the data reader already positioned for reading.
 * @return (object) a deserialized operation.
 * @throws TAMEError on a read error, RangeError on a read error (incomplete data).
 */
TBinaryReader.readOperation = function(dataReader)
{
	let out = {};
	out.opcode = TBinaryReader.readVariableLengthInt(dataReader);

	let bits = dataReader.readUInt8();
	if ((bits & 0x01) !== 0)
		out.operand0 = TBinaryReader.readValue(dataReader);
	if ((bits & 0x02) !== 0)
		out.operand1 = TBinaryReader.readValue(dataReader);

	if ((bits & 0x04) !== 0)
		out.initBlock = TBinaryReader.readBlock(dataReader);
	if ((bits & 0x08) !== 0)
		out.conditionalBlock = TBinaryReader.readBlock(dataReader);
	if ((bits & 0x10) !== 0)
		out.stepBlock = TBinaryReader.readBlock(dataReader);
	if ((bits & 0x20) !== 0)
		out.successBlock = TBinaryReader.readBlock(dataReader);
	if ((bits & 0x40) !== 0)
		out.failureBlock = TBinaryReader.readBlock(dataReader);
	
	return out;
};

/**
 * Reads a block.
 * @param dataReader (TDataReader) the data reader already positioned for reading.
 * @return (Array) a deserialized block of operations.
 * @throws TAMEError on a read error, RangeError on a read error (incomplete data).
 */
TBinaryReader.readBlock = function(dataReader)
{
	let out = [];
	let size = dataReader.readInt32();
	while (size--)
		out.push(TBinaryReader.readOperation(dataReader));
	return out;
};

/**
 * Reads a block table entry key.
 * @param dataReader (TDataReader) the data reader already positioned for reading.
 * @return (string) a deserialized block entry key for a block table.
 * @throws TAMEError on a read error, RangeError on a read error (incomplete data).
 */
TBinaryReader.readBlockEntryKey = function(dataReader)
{
	let out = '';
	out += TBinaryReader.BlockEntryType[dataReader.readUInt8()];
	let size = dataReader.readInt32();
	out += '(';
	while (size--)
	{
		out += TValue.toString(TBinaryReader.readValue(dataReader));
		if (size > 0)
			out += ',';
	}
	out += ')';
	return out;
};

/**
 * Reads a block table.
 * @param dataReader (TDataReader) the data reader already positioned for reading.
 * @return (object) a deserialized block table.
 * @throws TAMEError on a read error, RangeError on a read error (incomplete data).
 */
TBinaryReader.readBlockTable = function(dataReader)
{
	let out = {};
	let size = dataReader.readInt32();
	while (size--)
	{
		let key = TBinaryReader.readBlockEntryKey(dataReader);
		let block = TBinaryReader.readBlock(dataReader);
		out[key] = block;
	}
	return out;
};

/**
 * Reads a function entry.
 * @param dataReader (TDataReader) the data reader already positioned for reading.
 * @return (object) a deserialized function entry.
 * @throws TAMEError on a read error, RangeError on a read error (incomplete data).
 */
TBinaryReader.readFunctionEntry = function(dataReader)
{
	let out = {};
	let argumentCount = dataReader.readInt32();
	out.arguments = [];
	while (argumentCount--)
		out.arguments.push(TBinaryReader.readUTF8String(dataReader));
	out.block = TBinaryReader.readBlock(dataReader);
	return out;
};

/**
 * Reads a function table.
 * @param dataReader (TDataReader) the data reader already positioned for reading.
 * @return (object) a deserialized function table.
 * @throws TAMEError on a read error, RangeError on a read error (incomplete data).
 */
TBinaryReader.readFunctionTable = function(dataReader)
{
	let out = {};
	let size = dataReader.readInt32();
	while (size--)
	{
		let name = TBinaryReader.readUTF8String(dataReader).toLowerCase();
		let functionEntry = TBinaryReader.readFunctionEntry(dataReader);
		out[name] = functionEntry;
	}
	return out;
};

/**
 * Reads an element into an object.
 * @param dataReader (TDataReader) the data reader already positioned for reading.
 * @param element (object) the element object to read data into.
 * @throws TAMEError on a read error, RangeError on a read error (incomplete data).
 */
TBinaryReader.readElement = function(dataReader, element)
{
	element.identity = TBinaryReader.readUTF8String(dataReader);
	element.archetype = dataReader.readBoolean();
	element.blockTable = TBinaryReader.readBlockTable(dataReader);
	element.functionTable = TBinaryReader.readFunctionTable(dataReader);
};

/**
 * Reads a container element.
 * @param dataReader (TDataReader) the data reader already positioned for reading.
 * @return (object) a deserialized world element.
 * @throws TAMEError on a read error, RangeError on a read error (incomplete data).
 */
TBinaryReader.readContainer = function(dataReader)
{
	let out = {};
	out.tameType = "TContainer";
	TBinaryReader.readElement(dataReader, out);
	return out;
};

/**
 * Reads a object element.
 * @param dataReader (TDataReader) the data reader already positioned for reading.
 * @return (object) a deserialized world element.
 * @throws TAMEError on a read error, RangeError on a read error (incomplete data).
 */
TBinaryReader.readObject = function(dataReader)
{
	let out = {};
	out.tameType = "TObject";
	TBinaryReader.readElement(dataReader, out);
	out.names = TBinaryReader.readUTF8StringArray(dataReader);
	out.determiners = TBinaryReader.readUTF8StringArray(dataReader);
	out.tags = TBinaryReader.readUTF8StringArray(dataReader);
	return out;
};

/**
 * Reads a room element.
 * @param dataReader (TDataReader) the data reader already positioned for reading.
 * @return (object) a deserialized world element.
 * @throws TAMEError on a read error, RangeError on a read error (incomplete data).
 */
TBinaryReader.readRoom = function(dataReader)
{
	let out = {};
	out.tameType = "TRoom";
	TBinaryReader.readElement(dataReader, out);
	return out;
};

/**
 * Reads a player element.
 * @param dataReader (TDataReader) the data reader already positioned for reading.
 * @return (object) a deserialized world element.
 * @throws TAMEError on a read error, RangeError on a read error (incomplete data).
 */
TBinaryReader.readPlayer = function(dataReader)
{
	let out = {};
	out.tameType = "TPlayer";
	TBinaryReader.readElement(dataReader, out);
	return out;
};

/**
 * Reads a world element.
 * @param dataReader (TDataReader) the data reader already positioned for reading.
 * @return (object) a deserialized world element.
 * @throws TAMEError on a read error, RangeError on a read error (incomplete data).
 */
TBinaryReader.readWorld = function(dataReader)
{
	let out = {};
	out.tameType = "TWorld";
	TBinaryReader.readElement(dataReader, out);
	return out;
};

/**
 * Reads a world element.
 * @param dataReader (TDataReader) the data reader already positioned for reading.
 * @return (object) a deserialized world element.
 * @throws TAMEError on a read error, RangeError on a read error (incomplete data).
 */
TBinaryReader.readAction = function(dataReader)
{
	let out = {};
	out.tameType = "TAction";
	out.identity = TBinaryReader.readUTF8String(dataReader);
	out.type = dataReader.readUInt8();

	let bits = dataReader.readUInt8();
	out.strict = ((bits & 0x01) !== 0);
	out.reversed = ((bits & 0x02) !== 0);

	out.names = TBinaryReader.readUTF8StringArray(dataReader);
	out.extraStrings = TBinaryReader.readUTF8StringArray(dataReader);
	return out;
};

/**
 * Reads a version 1 module (digest, actions, elements).
 * @param dataReader (TDataReader) the data reader already positioned for reading.
 * @param moduleOut (object) the output object to add parsed elements from {actions, elements}.
 * @throws TAMEError on a read error, RangeError on a read error (incomplete data).
 */
TBinaryReader.readModuleV1 = function(dataReader, moduleOut)
{
	moduleOut.digest = dataReader.readBytes(20);
	let bytes = dataReader.readInt32();
	let reader = dataReader.split(bytes);
	
	let actions = [];
	let elements = [];
	let elementMap = {};
	
	let world = TBinaryReader.readWorld(dataReader);
	elements[world.identity] = world;
	
	let READELEMENTS = function(f)
	{
		let count = dataReader.readInt32();
		while (count--) 
		{
			let e = f(dataReader);
			elementMap[e.identity] = e;
			elements.push(e);
		}
	};

	let READPARENTS = function()
	{
		let map = TBinaryReader.readUTF8StringMap(dataReader);
		Util.each(map, (value, key) => {elementMap[key].parent = value;});
	};

	count = dataReader.readInt32();
	while (count--)
		actions.push(TBinaryReader.readAction(dataReader));
	
	READELEMENTS(TBinaryReader.readPlayer);
	READELEMENTS(TBinaryReader.readRoom);
	READELEMENTS(TBinaryReader.readObject);
	READELEMENTS(TBinaryReader.readContainer);
	
	// Hierarchy arranged as players, rooms, objects, containers in binary - unnecessary to separate in JS.  
	READPARENTS();
	READPARENTS();
	READPARENTS();
	READPARENTS();
	
	moduleOut.actions = actions;
	moduleOut.elements = elements;
};

/**
 * Reads a module header from a binary data reader.
 * @param dataReader (TDataReader) the data reader already positioned for reading.
 * @return (object) an object containing the header keys mapped to values.
 * @throws TAMEError on a read error, RangeError on a read error (incomplete data).
 */
TBinaryReader.readModuleHeader = function(dataReader)
{
	let out = {};
	let size = dataReader.readInt32();
	while (size--)
	{
		let key = TBinaryReader.readUTF8String(dataReader);
		let value = TBinaryReader.readUTF8String(dataReader);
		out[key] = value;
	}
	return out;
};

/**
 * Reads a module from its serialized representation.
 * @param base64Data (DataView) the input data view to use for reading.
 * @return (TModule) a deserialized TAME Module.
 * @throws TAMEError on a read error, RangeError on a read error (incomplete data).
 */
TBinaryReader.readModule = function(dataView)
{
	let reader = new TDataReader(dataView, true);
	
	if (TBinaryReader.readASCII(reader, 4) != 'TAME')
		throw TAMEError.Module("Not a TAME Module.");
	
	let out = {};
	out.header = TBinaryReader.readModuleHeader(reader);
	
	let version = reader.readUInt8();
	if (version === 1)
		TBinaryReader.readModuleV1(reader, out);
	else
		throw TAMEError.Module("Module does not have a recognized version.");
	
	return new TModule(out.header, out.digest, out.actions, out.elements);
};



var TLogic = {};


/*****************************************************************************
 Arithmetic function entry points.
 *****************************************************************************/
var TArithmeticFunctions = 
[
 	/* ABSOLUTE */
	{
		"name": 'ABSOLUTE',
		"symbol": '+',
		"binary": false,
		"doOperation": TValue.absolute
	},
	
 	/* NEGATE */
	{
		"name": 'NEGATE',
		"symbol": '-',
		"binary": false,
		"doOperation": TValue.negate
	},
	
 	/* LOGICAL NOT */
	{
		"name": 'LOGICAL_NOT',
		"symbol": '!',
		"binary": false,
		"doOperation": TValue.logicalNot
	},
	
 	/* ADD */
	{
		"name": 'ADD',
		"symbol": '+',
		"binary": true,
		"doOperation": TValue.add
	},
	
 	/* SUBTRACT */
	{
		"name": 'SUBTRACT',
		"symbol": '-',
		"binary": true,
		"doOperation": TValue.subtract
	},
	
 	/* MULTIPLY */
	{
		"name": 'MULTIPLY',
		"symbol": '*',
		"binary": true,
		"doOperation": TValue.multiply
	},
	
 	/* DIVIDE */
	{
		"name": 'DIVIDE',
		"symbol": '/',
		"binary": true,
		"doOperation": TValue.divide
	},
	
 	/* MODULO */
	{
		"name": 'MODULO',
		"symbol": '%',
		"binary": true,
		"doOperation": TValue.modulo
	},
	
 	/* POWER */
	{
		"name": 'POWER',
		"symbol": '**',
		"binary": true,
		"doOperation": TValue.power
	},
	
 	/* LOGICAL AND */
	{
		"name": 'LOGICAL_AND',
		"symbol": '&',
		"binary": true,
		"doOperation": TValue.logicalAnd
	},
	
 	/* LOGICAL OR */
	{
		"name": 'LOGICAL_OR',
		"symbol": '|',
		"binary": true,
		"doOperation": TValue.logicalOr
	},
	
 	/* LOGICAL XOR */
	{
		"name": 'LOGICAL_XOR',
		"symbol": '^',
		"binary": true,
		"doOperation": TValue.logicalXOr
	},
	
 	/* EQUALS */
	{
		"name": 'EQUALS',
		"symbol": '==',
		"binary": true,
		"doOperation": TValue.equals
	},
	
 	/* NOT EQUALS */
	{
		"name": 'NOT_EQUALS',
		"symbol": '!=',
		"binary": true,
		"doOperation": TValue.notEquals
	},
	
 	/* STRICT EQUALS */
	{
		"name": 'STRICT_EQUALS',
		"symbol": '===',
		"binary": true,
		"doOperation": TValue.strictEquals
	},
	
 	/* STRICT NOT EQUALS */
	{
		"name": 'STRICT_NOT_EQUALS',
		"symbol": '!==',
		"binary": true,
		"doOperation": TValue.strictNotEquals
	},
	
 	/* LESS */
	{
		"name": 'LESS',
		"symbol": '<',
		"binary": true,
		"doOperation": TValue.less
	},
	
 	/* LESS OR EQUAL */
	{
		"name": 'LESS_OR_EQUAL',
		"symbol": '<=',
		"binary": true,
		"doOperation": TValue.lessOrEqual
	},
	
 	/* GREATER */
	{
		"name": 'GREATER',
		"symbol": '>',
		"binary": true,
		"doOperation": TValue.greater
	},
	
 	/* GREATER_OR_EQUAL */
	{
		"name": 'GREATER_OR_EQUAL',
		"symbol": '>=',
		"binary": true,
		"doOperation": TValue.greaterOrEqual
	},
	
];

/* Type enumeration. */
TArithmeticFunctions.Type = 
{
	"ABSOLUTE": 0,
	"NEGATE": 1,
	"LOGICAL_NOT": 2,
	"ADD": 3,
	"SUBTRACT": 4,
	"MULTIPLY": 5,
	"DIVIDE": 6,
	"MODULO": 7,
	"POWER": 8,
	"LOGICAL_AND": 9,
	"LOGICAL_OR": 10,
	"LOGICAL_XOR": 11,
	"EQUALS": 12,
	"NOT_EQUALS": 13,
	"STRICT_EQUALS": 14,
	"STRICT_NOT_EQUALS": 15,
	"LESS": 16,
	"LESS_OR_EQUAL": 17,
	"GREATER": 18,
	"GREATER_OR_EQUAL": 19
};

TArithmeticFunctions.COUNT = TArithmeticFunctions.Type.length; 


/*****************************************************************************
Operation entry points.
*****************************************************************************/
var TOperationFunctions =
[
	/* NOOP */
	{
		"name": 'NOOP', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			// Do nothing.
		}
	},

	/* POP */
	{
		"name": 'POP',
		"internal": true,
		"doOperation": function(request, response, blockLocal, operation)
		{
			request.popValue();
		}
	},

	/* POPVALUE */
	{
		"name": 'POPVALUE', 
		"internal": true,
		"doOperation": function(request, response, blockLocal, operation)
		{
			let varvalue = operation.operand0;
			let value = request.popValue();
			
			if (!TValue.isLiteral(value))
				throw TAMEError.UnexpectedValueType("Expected literal type in POPVALUE call.");
			if (!TValue.isVariable(varvalue))
				throw TAMEError.UnexpectedValueType("Expected variable type in POPVALUE call.");

			let variableName = TValue.asString(varvalue);
			
			if (TLogic.containsValue(blockLocal, variableName))
			{
				response.trace(request, TAMEConstants.TraceType.VALUE, Util.format("SET LOCAL {0} {1}", variableName, TValue.toString(value)));
				TLogic.setValue(blockLocal, variableName, value);
			}
			else
			{
				response.trace(request, TAMEConstants.TraceType.VALUE, Util.format("SET {0}.{1} {2}", request.peekContext().identity, variableName, TValue.toString(value)));
				TLogic.setValue(request.peekContext().variables, variableName, value);
			}
		}
	},

	/* POPLOCALVALUE */
	{
		"name": 'POPLOCALVALUE', 
		"internal": true,
		"doOperation": function(request, response, blockLocal, operation)
		{
			let varvalue = operation.operand0;
			let value = request.popValue();
			
			if (!TValue.isLiteral(value))
				throw TAMEError.UnexpectedValueType("Expected literal type in POPLOCALVALUE call.");
			if (!TValue.isVariable(varvalue))
				throw TAMEError.UnexpectedValueType("Expected variable type in POPLOCALVALUE call.");

			let variableName = TValue.asString(varvalue);
			response.trace(request, TAMEConstants.TraceType.VALUE, Util.format("SET LOCAL {0} {1}", variableName, TValue.toString(value)));
			TLogic.setValue(blockLocal, variableName, value);
		}
	},

	/* POPELEMENTVALUE */
	{
		"name": 'POPELEMENTVALUE', 
		"internal": true,
		"doOperation": function(request, response, blockLocal, operation)
		{
			let varElement = operation.operand0;
			let variable = operation.operand1;
			let value = request.popValue();

			if (!TValue.isLiteral(value))
				throw TAMEError.UnexpectedValueType("Expected literal type in POPELEMENTVALUE call.");
			if (!TValue.isVariable(variable))
				throw TAMEError.UnexpectedValueType("Expected variable type in POPELEMENTVALUE call.");
			if (!TValue.isElement(varElement))
				throw TAMEError.UnexpectedValueType("Expected element type in POPELEMENTVALUE call.");

			let elementName = TValue.asString(varElement);
			let variableName = TValue.asString(variable);
			let context = request.moduleContext.resolveElementContext(elementName);
			response.trace(request, TAMEConstants.TraceType.VALUE, Util.format("SET {0}.{1} {2}", context.identity, variableName, TValue.toString(value)));
			TLogic.setValue(context.variables, variableName, value);
		}
	},

	/* POPLISTVALUE */
	{
		"name": 'POPLISTVALUE', 
		"internal": true,
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value = request.popValue();
			let index = request.popValue();
			let listValue = request.popValue();
			
			if (!TValue.isLiteral(index))
				throw TAMEError.UnexpectedValueType("Expected literal type in POPLISTVALUE call.");
			if (!TValue.isLiteral(value))
				throw TAMEError.UnexpectedValueType("Expected literal type in POPLISTVALUE call.");
			if (!TValue.isLiteral(listValue))
				throw TAMEError.UnexpectedValueType("Expected literal type in POPLISTVALUE call.");
			
			if (!TValue.isList(listValue))
				return;
			
			response.trace(request, TAMEConstants.TraceType.VALUE, Util.format("SET LIST [{0}] {1}", TValue.asLong(index), TValue.toString(value)));
			TValue.listSet(listValue, TValue.asLong(index), value);
		}
	},
	
	/* PUSHVALUE */
	{
		"name": 'PUSHVALUE', 
		"internal": true,
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value = operation.operand0;
			
			if (TValue.isVariable(value))
			{
				let variableName = TValue.asString(value);
				if (TLogic.containsValue(blockLocal, variableName))
					request.pushValue(TLogic.getValue(blockLocal, variableName));
				else
					request.pushValue(TLogic.getValue(request.peekContext().variables, variableName));
			}
			else
			{
				request.pushValue(value);
			}
		}
	},

	/* PUSHELEMENTVALUE */
	{
		"name": 'PUSHELEMENTVALUE', 
		"internal": true,
		"doOperation": function(request, response, blockLocal, operation)
		{
			let varElement = operation.operand0;
			let variable = operation.operand1;

			if (!TValue.isVariable(variable))
				throw TAMEError.UnexpectedValueType("Expected variable type in PUSHELEMENTVALUE call.");
			if (!TValue.isElement(varElement))
				throw TAMEError.UnexpectedValueType("Expected element type in PUSHELEMENTVALUE call.");

			let elementName = TValue.asString(varElement);
			let variableName = TValue.asString(variable);
			
			request.pushValue(TLogic.getValue(request.moduleContext.resolveElementContext(elementName).variables, variableName));
		}
	},

	/* PUSHLISTVALUE */
	{
		"name": 'PUSHLISTVALUE', 
		"internal": true,
		"doOperation": function(request, response, blockLocal, operation)
		{
			let index = request.popValue();
			let listValue = request.popValue();

			if (!TValue.isLiteral(listValue))
				throw TAMEError.UnexpectedValueType("Expected literal type in PUSHLISTVALUE call.");
			if (!TValue.isLiteral(index))
				throw TAMEError.UnexpectedValueType("Expected literal type in PUSHLISTVALUE call.");
			
			if (!TValue.isList(listValue))
				request.pushValue(TValue.createBoolean(false));
			else
				request.pushValue(TValue.listGet(listValue, TValue.asLong(index)));
		}
	},
	
	/* PUSHNEWLIST */
	{
		"name": 'PUSHNEWLIST', 
		"internal": true,
		"doOperation": function(request, response, blockLocal, operation)
		{
			request.pushValue(TValue.createList([]));
		}
		
	},
	
	/* PUSHINITLIST */
	{
		"name": 'PUSHINITLIST', 
		"internal": true,
		"doOperation": function(request, response, blockLocal, operation)
		{
			let length = request.popValue();

			if (!TValue.isLiteral(length))
				throw TAMEError.UnexpectedValueType("Expected literal type in PUSHINITLIST call.");

			let size = TValue.asLong(length);
			let list = TValue.createList([]);
			while (size-- > 0)
			{
				let popped = request.popValue();
				if (!(TValue.isLiteral(popped) || TValue.isList(popped)))
					throw TAMEError.UnexpectedValueType("Expected literal or list type in PUSHINITLIST call.");
				TValue.listAddAt(list, 0, popped);
			}
			
			request.pushValue(list);
		}
	},
	
	/* CLEARVALUE */
	{
		"name": 'CLEARVALUE', 
		"internal": true,
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value = operation.operand0;

			if (!TValue.isVariable(value))
				throw TAMEError.UnexpectedValueType("Expected variable type in CLEARVALUE call.");
			
			let variableName = TValue.asString(value).toLowerCase();
			if (blockLocal[variableName])
			{
				response.trace(request, TAMEConstants.TraceType.VALUE, Util.format("CLEAR LOCAL {0}", variableName));
				TLogic.clearValue(blockLocal, variableName);
			}
			else
			{
				response.trace(request, TAMEConstants.TraceType.VALUE, Util.format("CLEAR {0}.{1}", request.peekContext().identity, variableName));
				TLogic.clearValue(request.peekContext().variables, variableName);
			}
		}
	},

	/* CLEARELEMENTVALUE */
	{
		"name": 'CLEARELEMENTVALUE', 
		"internal": true,
		"doOperation": function(request, response, blockLocal, operation)
		{
			let varElement = operation.operand0;
			let variable = operation.operand1;

			if (!TValue.isVariable(variable))
				throw TAMEError.UnexpectedValueType("Expected variable type in CLEARELEMENTVALUE call.");
			if (!TValue.isElement(varElement))
				throw TAMEError.UnexpectedValueType("Expected element type in CLEARELEMENTVALUE call.");

			let variableName = TValue.asString(variable).toLowerCase();
			let context = request.moduleContext.resolveElementContext(TValue.asString(varElement));
			response.trace(request, TAMEConstants.TraceType.VALUE, Util.format("CLEAR {0}.{1}", context.identity, variableName));
			TLogic.clearValue(context.variables, TValue.asString(variable));
		}
	},

	/* PUSHTHIS */
	{
		"name": 'PUSHTHIS', 
		"internal": true,
		"doOperation": function(request, response, blockLocal, operation)
		{
			let element = request.moduleContext.resolveElement(request.peekContext().identity);
			if (element.tameType === 'TObject')
				request.pushValue(TValue.createObject(element.identity));
			else if (element.tameType === 'TRoom')
				request.pushValue(TValue.createRoom(element.identity));
			else if (element.tameType === 'TPlayer')
				request.pushValue(TValue.createPlayer(element.identity));
			else if (element.tameType === 'TContainer')
				request.pushValue(TValue.createContainer(element.identity));
			else if (element.tameType === 'TWorld')
				request.pushValue(TValue.createWorld());
			else
				throw TAMEError.ModuleExecution("Internal error - invalid object type for PUSHTHIS.");
		}
	},
	
	/* ARITHMETICFUNC */
	{
		"name": 'ARITHMETICFUNC', 
		"internal": true,
		"doOperation": function(request, response, blockLocal, operation)
		{
			let functionValue = operation.operand0;

			if (!TValue.isInteger(functionValue))
				throw TAMEError.UnexpectedValueType("Expected integer type in ARITHMETICFUNC call.");

			TLogic.doArithmeticStackFunction(request, response, TValue.asLong(functionValue));
		}
	},

	/* IF */
	{
		"name": 'IF', 
		"internal": true,
		"doOperation": function(request, response, blockLocal, operation)
		{
			let result = TLogic.callConditional('IF', request, response, blockLocal, operation);
			
			if (result)
			{
				let success = operation.successBlock;
				if (!success)
					throw TAMEError.ModuleExecution("Success block for IF does NOT EXIST!");
				TLogic.executeBlock(success, request, response, blockLocal);
			}
			else
			{
				let failure = operation.failureBlock;
				if (failure)
					TLogic.executeBlock(failure, request, response, blockLocal);
			}
		}
	},

	/* WHILE */
	{
		"name": 'WHILE', 
		"internal": true,
		"doOperation": function(request, response, blockLocal, operation)
		{
			while (TLogic.callConditional('WHILE', request, response, blockLocal, operation))
			{
				try {
					let success = operation.successBlock;
					if (!success)
						throw TAMEError.ModuleExecution("Success block for WHILE does NOT EXIST!");
					TLogic.executeBlock(success, request, response, blockLocal);
				} catch (err) {
					if (err instanceof TAMEInterrupt)
					{
						if (err.type === TAMEInterrupt.Type.Break)
							break;
						else if (err.type === TAMEInterrupt.Type.Continue)
							continue;
						else
							throw err;
					}
					else
						throw err;
				}
			}
		}
	},

	/* FOR */
	{
		"name": 'FOR', 
		"internal": true,
		"doOperation": function(request, response, blockLocal, operation)
		{
			let init = operation.initBlock;
			if (!init)
				throw TAMEError.ModuleExecution("Init block for FOR does NOT EXIST!");
			let success = operation.successBlock;
			if (!success)
				throw TAMEError.ModuleExecution("Success block for FOR does NOT EXIST!");
			let step = operation.stepBlock;
			if (!step)
				throw TAMEError.ModuleExecution("Step block for FOR does NOT EXIST!");

			response.trace(request, TAMEConstants.TraceType.CONTROL, "FOR Init");

			for (
				TLogic.executeBlock(init, request, response, blockLocal);
				TLogic.callConditional('FOR', request, response, blockLocal, operation);
				response.trace(request, TAMEConstants.TraceType.CONTROL, "FOR Step"),
				TLogic.executeBlock(step, request, response, blockLocal)
			)
			{
				try {
					response.trace(request, TAMEConstants.TraceType.CONTROL, "FOR Success");
					TLogic.executeBlock(success, request, response, blockLocal);
				} catch (err) {
					if (err instanceof TAMEInterrupt)
					{
						if (err.type === TAMEInterrupt.Type.Break)
							break;
						else if (err.type === TAMEInterrupt.Type.Continue)
							continue;
						else
							throw err;
					}
					else
						throw err;
				}
			}
		}
	},

	/* BREAK */
	{
		"name": 'BREAK', 
		"internal": true,
		"doOperation": function(request, response, blockLocal, operation)
		{
			response.trace(request, TAMEConstants.TraceType.CONTROL, "THROW BREAK");
			throw TAMEInterrupt.Break();
		}
	},

	/* CONTINUE */
	{
		"name": 'CONTINUE', 
		"internal": true,
		"doOperation": function(request, response, blockLocal, operation)
		{
			response.trace(request, TAMEConstants.TraceType.CONTROL, "THROW CONTINUE");
			throw TAMEInterrupt.Continue();
		}
	},

	/* QUIT */
	{
		"name": 'QUIT', 
		"internal": true,
		"doOperation": function(request, response, blockLocal, operation)
		{
			response.trace(request, TAMEConstants.TraceType.CONTROL, "THROW QUIT");
			response.addCue(TAMEConstants.Cue.QUIT);
			throw TAMEInterrupt.Quit();
		}
	},

	/* FINISH */
	{
		"name": 'FINISH', 
		"internal": true,
		"doOperation": function(request, response, blockLocal, operation)
		{
			response.trace(request, TAMEConstants.TraceType.CONTROL, "THROW FINISH");
			throw TAMEInterrupt.Finish();
		}
	},

	/* END */
	{
		"name": 'END', 
		"internal": true,
		"doOperation": function(request, response, blockLocal, operation)
		{
			response.trace(request, TAMEConstants.TraceType.CONTROL, "THROW END");
			throw TAMEInterrupt.End();
		}
	},

	/* FUNCTIONRETURN */
	{
		"name": 'FUNCTIONRETURN', 
		"internal": true,
		"doOperation": function(request, response, blockLocal, operation)
		{
			let retVal = request.popValue();
			response.trace(request, TAMEConstants.TraceType.FUNCTION, "RETURN "+TValue.toString(retVal));
			TLogic.setValue(blockLocal, TAMEConstants.RETURN_VARIABLE, retVal);
			response.trace(request, TAMEConstants.TraceType.CONTROL, "THROW END");
			throw TAMEInterrupt.End();
		}
	},

	/* CALLFUNCTION */
	{
		"name": 'CALLFUNCTION', 
		"internal": true,
		"doOperation": function(request, response, blockLocal, operation)
		{
			let varFunctionName = operation.operand0;

			if (!TValue.isLiteral(varFunctionName))
				throw TAMEError.UnexpectedValueType("Expected literal type in CALLFUNCTION call.");

			request.pushValue(TLogic.callElementFunction(request, response, TValue.asString(varFunctionName), request.peekContext()));
		}
	},

	/* CALLELEMENTFUNCTION */
	{
		"name": 'CALLELEMENTFUNCTION', 
		"internal": true,
		"doOperation": function(request, response, blockLocal, operation)
		{
			let varElement = operation.operand0;
			let varFunctionName = operation.operand1;

			if (!TValue.isElement(varElement))
				throw TAMEError.UnexpectedValueType("Expected element type in CALLELEMENTFUNCTION call.");
			if (!TValue.isLiteral(varFunctionName))
				throw TAMEError.UnexpectedValueType("Expected literal type in CALLELEMENTFUNCTION call.");

			let elementContext = request.moduleContext.resolveElementContext(TValue.asString(varElement));
			request.pushValue(TLogic.callElementFunction(request, response, TValue.asString(varFunctionName), elementContext));
		}
	},

	/* QUEUEACTION */
	{
		"name": 'QUEUEACTION', 
		"internal": true,
		"doOperation": function(request, response, blockLocal, operation)
		{
			let varAction = request.popValue();

			if (!TValue.isAction(varAction))
				throw TAMEError.UnexpectedValueType("Expected action type in QUEUEACTION call.");

			let action = request.moduleContext.resolveAction(TValue.asString(varAction));

			if (action.type != TAMEConstants.ActionType.GENERAL)
				throw TAMEError.UnexpectedValueType("BAD TYPE: " + action.identity + " is not a general action.");

			let command = TCommand.create(action);
			request.addCommand(command);
			response.trace(request, TAMEConstants.TraceType.CONTROL, "Enqueue command "+command.toString());
		}
	},

	/* QUEUEACTIONSTRING */
	{
		"name": 'QUEUEACTIONSTRING', 
		"internal": true,
		"doOperation": function(request, response, blockLocal, operation)
		{
			let varTarget = request.popValue();
			let varAction = request.popValue();

			if (!TValue.isLiteral(varTarget))
				throw TAMEError.UnexpectedValueType("Expected literal type in QUEUEACTIONSTRING call.");
			if (!TValue.isAction(varAction))
				throw TAMEError.UnexpectedValueType("Expected action type in QUEUEACTIONSTRING call.");

			let action = request.moduleContext.resolveAction(TValue.asString(varAction));

			if (action.type != TAMEConstants.ActionType.MODAL && action.type != TAMEConstants.ActionType.OPEN)
				throw TAMEInterrupt.Error(action.identity + " is not a modal nor open action.");

			let command = TCommand.createModal(action, TValue.asString(varTarget));
			request.addCommand(command);
			response.trace(request, TAMEConstants.TraceType.CONTROL, "Enqueue command "+command.toString());
		}
	},

	/* QUEUEACTIONOBJECT */
	{
		"name": 'QUEUEACTIONOBJECT', 
		"internal": true,
		"doOperation": function(request, response, blockLocal, operation)
		{
			let varObject = request.popValue();
			let varAction = request.popValue();

			if (!TValue.isObject(varObject))
				throw TAMEError.UnexpectedValueType("Expected literal type in QUEUEACTIONOBJECT call.");
			if (!TValue.isAction(varAction))
				throw TAMEError.UnexpectedValueType("Expected action type in QUEUEACTIONOBJECT call.");

			let action = request.moduleContext.resolveAction(TValue.asString(varAction));
			let object = request.moduleContext.resolveElement(TValue.asString(varObject));

			if (action.type != TAMEConstants.ActionType.TRANSITIVE && action.type != TAMEConstants.ActionType.DITRANSITIVE)
				throw TAMEError.UnexpectedValueType("BAD TYPE: " + action.identity + " is not a transitive nor ditransitive action.");

			let command = TCommand.createObject(action, object);
			request.addCommand(command);
			response.trace(request, TAMEConstants.TraceType.CONTROL, "Enqueue command "+command.toString());
		}
	},

	/* QUEUEACTIONFOROBJECTSIN */
	{
		"name": 'QUEUEACTIONFOROBJECTSIN', 
		"internal": true,
		"doOperation": function(request, response, blockLocal, operation)
		{
			let varObjectContainer = request.popValue();
			let varAction = request.popValue();

			if (!TValue.isObjectContainer(varObjectContainer))
				throw TAMEError.UnexpectedValueType("Expected object-container type in QUEUEACTIONFOROBJECTSIN call.");
			if (!TValue.isAction(varAction))
				throw TAMEError.UnexpectedValueType("Expected action type in QUEUEACTIONFOROBJECTSIN call.");

			let context = request.moduleContext;
			let action = context.resolveAction(TValue.asString(varAction));

			if (action.type != TAMEConstants.ActionType.TRANSITIVE && action.type != TAMEConstants.ActionType.DITRANSITIVE)
				throw TAMEError.UnexpectedValueType("BAD TYPE: " + action.identity + " is not a transitive nor ditransitive action.");

			let element = context.resolveElement(TValue.asString(varObjectContainer));
			Util.each(context.getObjectsOwnedByElement(element.identity), function(objectIdentity){
				let object = context.resolveElement(objectIdentity);
				let command = TCommand.createObject(action, object);
				request.addCommand(command);
				response.trace(request, TAMEConstants.TraceType.CONTROL, "Enqueue command "+command.toString());
			});
		}

	},
	
	/* QUEUEACTIONFORTAGGEDOBJECTSIN */
	{
		"name": 'QUEUEACTIONFORTAGGEDOBJECTSIN', 
		"internal": true,
		"doOperation": function(request, response, blockLocal, operation)
		{
			let varTag = request.popValue();
			let varObjectContainer = request.popValue();
			let varAction = request.popValue();

			if (!TValue.isLiteral(varTag))
				throw TAMEError.UnexpectedValueType("Expected literal type in QUEUEACTIONFORTAGGEDOBJECTSIN call.");
			if (!TValue.isObjectContainer(varObjectContainer))
				throw TAMEError.UnexpectedValueType("Expected object-container type in QUEUEACTIONFORTAGGEDOBJECTSIN call.");
			if (!TValue.isAction(varAction))
				throw TAMEError.UnexpectedValueType("Expected action type in QUEUEACTIONFORTAGGEDOBJECTSIN call.");

			let context = request.moduleContext;
			let action = context.resolveAction(TValue.asString(varAction));

			if (action.type != TAMEConstants.ActionType.TRANSITIVE && action.type != TAMEConstants.ActionType.DITRANSITIVE)
				throw TAMEError.UnexpectedValueType("BAD TYPE: " + action.identity + " is not a transitive nor ditransitive action.");

			let tagName = TValue.asString(varTag);
			let element = context.resolveElement(TValue.asString(varObjectContainer));
			Util.each(context.getObjectsOwnedByElement(element.identity), function(objectIdentity){
				if (!context.checkObjectHasTag(objectIdentity, tagName))
					return;
				
				let object = context.resolveElement(objectIdentity);
				let command = TCommand.createObject(action, object);
				request.addCommand(command);
				response.trace(request, TAMEConstants.TraceType.CONTROL, "Enqueue command "+command.toString());
			});
		}

	},
	
	/* QUEUEACTIONOBJECT2 */
	{
		"name": 'QUEUEACTIONOBJECT2', 
		"internal": true,
		"doOperation": function(request, response, blockLocal, operation)
		{
			let varObject2 = request.popValue();
			let varObject = request.popValue();
			let varAction = request.popValue();

			if (!TValue.isObject(varObject2))
				throw TAMEError.UnexpectedValueType("Expected literal type in QUEUEACTIONOBJECT2 call.");
			if (!TValue.isObject(varObject))
				throw TAMEError.UnexpectedValueType("Expected literal type in QUEUEACTIONOBJECT2 call.");
			if (!TValue.isAction(varAction))
				throw TAMEError.UnexpectedValueType("Expected action type in QUEUEACTIONOBJECT2 call.");

			let context = request.moduleContext;
			let action = context.resolveAction(TValue.asString(varAction));
			let object = context.resolveElement(TValue.asString(varObject));
			let object2 = context.resolveElement(TValue.asString(varObject2));

			if (action.type != TAMEConstants.ActionType.DITRANSITIVE)
				throw TAMEError.UnexpectedValueType("BAD TYPE: " + action.identity + " is not a ditransitive action.");
			
			let command = TCommand.createObject2(action, object, object2);
			request.addCommand(command);
			response.trace(request, TAMEConstants.TraceType.CONTROL, "Enqueue command "+command.toString());
		}
	},

	/* ADDCUE */
	{
		"name": 'ADDCUE', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value = request.popValue();
			let cue = request.popValue();

			if (!TValue.isLiteral(value))
				throw TAMEError.UnexpectedValueType("Expected literal type in ADDCUE call.");
			if (!TValue.isLiteral(cue))
				throw TAMEError.UnexpectedValueType("Expected literal type in ADDCUE call.");

			response.addCue(TValue.asString(cue), TValue.asString(value));
		}
	},

	/* TEXT */
	{
		"name": 'TEXT', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value = request.popValue();
			
			if (!TValue.isLiteral(value))
				throw TAMEError.UnexpectedValueType("Expected literal type in TEXT call.");

			response.addCue(TAMEConstants.Cue.TEXT, TValue.asString(value));
		}
	},

	/* TEXTLN */
	{
		"name": 'TEXTLN', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value = request.popValue();
			
			if (!TValue.isLiteral(value))
				throw TAMEError.UnexpectedValueType("Expected literal type in TEXTLN call.");

			response.addCue(TAMEConstants.Cue.TEXT, TValue.asString(value) + '\n');
		}
	},

	/* TEXTF */
	{
		"name": 'TEXTF', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value = request.popValue();
			
			if (!TValue.isLiteral(value))
				throw TAMEError.UnexpectedValueType("Expected literal type in TEXTF call.");

			response.addCue(TAMEConstants.Cue.TEXTF, TValue.asString(value));
		}
	},

	/* TEXTFLN */
	{
		"name": 'TEXTFLN', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value = request.popValue();
			
			if (!TValue.isLiteral(value))
				throw TAMEError.UnexpectedValueType("Expected literal type in TEXTFLN call.");

			response.addCue(TAMEConstants.Cue.TEXTF, TValue.asString(value) + '\n');
		}
	},

	/* PAUSE */
	{
		"name": 'PAUSE', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			response.addCue(TAMEConstants.Cue.PAUSE);
		}
	},

	/* WAIT */
	{
		"name": 'WAIT', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value = request.popValue();
			
			if (!TValue.isLiteral(value))
				throw TAMEError.UnexpectedValueType("Expected literal type in WAIT call.");

			response.addCue(TAMEConstants.Cue.WAIT, TValue.asLong(value));
		}
	},

	/* ASBOOLEAN */
	{
		"name": 'ASBOOLEAN', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value = request.popValue();
			
			if (!TValue.isLiteral(value))
				throw TAMEError.UnexpectedValueType("Expected literal type in ASBOOLEAN call.");

			request.pushValue(TValue.createBoolean(TValue.asBoolean(value)));
		}
	},

	/* ASINT */
	{
		"name": 'ASINT', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value = request.popValue();
			
			if (!TValue.isLiteral(value))
				throw TAMEError.UnexpectedValueType("Expected literal type in ASINT call.");

			request.pushValue(TValue.createInteger(TValue.asLong(value)));
		}
	},

	/* ASFLOAT */
	{
		"name": 'ASFLOAT', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value = request.popValue();
			
			if (!TValue.isLiteral(value))
				throw TAMEError.UnexpectedValueType("Expected literal type in ASFLOAT call.");

			request.pushValue(TValue.createFloat(TValue.asDouble(value)));
		}
	},

	/* ASSTRING */
	{
		"name": 'ASSTRING', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value = request.popValue();
			
			if (!TValue.isLiteral(value))
				throw TAMEError.UnexpectedValueType("Expected literal type in ASSTRING call.");

			request.pushValue(TValue.createString(TValue.asString(value)));
		}
	},

	/* ASLIST */
	{
		"name": 'ASLIST', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value = request.popValue();
			
			if (!TValue.isLiteral(value))
				throw TAMEError.UnexpectedValueType("Expected literal type in ASLIST call.");

			if (TValue.isList(value))
				request.pushValue(value);
			else
			{
				let out = TValue.createList([]);
				TValue.listAdd(out, value);
				request.pushValue(out);
			}
		}
	},

	/* LENGTH */
	{
		"name": 'LENGTH', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value = request.popValue();
			
			if (!TValue.isLiteral(value))
				throw TAMEError.UnexpectedValueType("Expected literal type in LENGTH call.");

			request.pushValue(TValue.createInteger(TValue.length(value)));
		}
	},

	/* EMPTY */
	{
		"name": 'EMPTY', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value = request.popValue();
			
			if (!TValue.isLiteral(value))
				throw TAMEError.UnexpectedValueType("Expected literal type in EMPTY call.");

			request.pushValue(TValue.createBoolean(TValue.isEmpty(value)));
		}
	},

	/* STRCONCAT */
	{
		"name": 'STRCONCAT', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value2 = request.popValue();
			let value1 = request.popValue();
			
			if (!TValue.isLiteral(value2))
				throw TAMEError.UnexpectedValueType("Expected literal type in STRCONCAT call.");
			if (!TValue.isLiteral(value1))
				throw TAMEError.UnexpectedValueType("Expected literal type in STRCONCAT call.");

			request.pushValue(TValue.createString(TValue.asString(value1) + TValue.asString(value2)));
		}
	},

	/* STRREPLACE */
	{
		"name": 'STRREPLACE', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value3 = request.popValue();
			let value2 = request.popValue();
			let value1 = request.popValue();

			if (!TValue.isLiteral(value1))
				throw TAMEError.UnexpectedValueType("Expected literal type in STRREPLACE call.");
			if (!TValue.isLiteral(value2))
				throw TAMEError.UnexpectedValueType("Expected literal type in STRREPLACE call.");
			if (!TValue.isLiteral(value3))
				throw TAMEError.UnexpectedValueType("Expected literal type in STRREPLACE call.");

			let replacement = TValue.asString(value3);
			let sequence = TValue.asString(value2);
			let source = TValue.asString(value1);
			let index = source.indexOf(sequence);
			if (index >= 0)
			{
				request.pushValue(TValue.createString(
					source.substring(0, index) + 
					replacement + 
					source.substring(index + sequence.length, source.length)
				));
			}
			else
			{
				request.pushValue(TValue.createString(source));
			}
		}
	},

	/* STRREPLACELAST */
	{
		"name": 'STRREPLACELAST', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value3 = request.popValue();
			let value2 = request.popValue();
			let value1 = request.popValue();

			if (!TValue.isLiteral(value1))
				throw TAMEError.UnexpectedValueType("Expected literal type in STRREPLACELAST call.");
			if (!TValue.isLiteral(value2))
				throw TAMEError.UnexpectedValueType("Expected literal type in STRREPLACELAST call.");
			if (!TValue.isLiteral(value3))
				throw TAMEError.UnexpectedValueType("Expected literal type in STRREPLACELAST call.");

			let replacement = TValue.asString(value3);
			let sequence = TValue.asString(value2);
			let source = TValue.asString(value1);
			let index = source.lastIndexOf(sequence);
			if (index >= 0)
			{
				request.pushValue(TValue.createString(
					source.substring(0, index) + 
					replacement + 
					source.substring(index + sequence.length, source.length)
				));
			}
			else
			{
				request.pushValue(TValue.createString(source));
			}
		}
	},

	/* STRREPLACEALL */
	{
		"name": 'STRREPLACEALL', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value3 = request.popValue();
			let value2 = request.popValue();
			let value1 = request.popValue();

			if (!TValue.isLiteral(value1))
				throw TAMEError.UnexpectedValueType("Expected literal type in STRREPLACEALL call.");
			if (!TValue.isLiteral(value2))
				throw TAMEError.UnexpectedValueType("Expected literal type in STRREPLACEALL call.");
			if (!TValue.isLiteral(value3))
				throw TAMEError.UnexpectedValueType("Expected literal type in STRREPLACEALL call.");

			let replacement = TValue.asString(value3);
			let sequence = TValue.asString(value2);
			let source = TValue.asString(value1);

			let out = source;
			while (out.indexOf(sequence) >= 0)
				out = out.replace(sequence, replacement);
			
			request.pushValue(TValue.createString(out));
		}
	},

	/* STRINDEX */
	{
		"name": 'STRINDEX', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value2 = request.popValue();
			let value1 = request.popValue();

			if (!TValue.isLiteral(value1))
				throw TAMEError.UnexpectedValueType("Expected literal type in STRINDEX call.");
			if (!TValue.isLiteral(value2))
				throw TAMEError.UnexpectedValueType("Expected literal type in STRINDEX call.");
			
			let sequence = TValue.asString(value2);
			let str = TValue.asString(value1);

			request.pushValue(TValue.createInteger(str.indexOf(sequence)));
		}
	},

	/* STRLASTINDEX */
	{
		"name": 'STRLASTINDEX', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value2 = request.popValue();
			let value1 = request.popValue();

			if (!TValue.isLiteral(value1))
				throw TAMEError.UnexpectedValueType("Expected literal type in STRLASTINDEX call.");
			if (!TValue.isLiteral(value2))
				throw TAMEError.UnexpectedValueType("Expected literal type in STRLASTINDEX call.");
			
			let sequence = TValue.asString(value2);
			let str = TValue.asString(value1);

			request.pushValue(TValue.createInteger(str.lastIndexOf(sequence)));
		}
	},

	/* STRCONTAINS */
	{
		"name": 'STRCONTAINS', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value2 = request.popValue();
			let value1 = request.popValue();

			if (!TValue.isLiteral(value1))
				throw TAMEError.UnexpectedValueType("Expected literal type in STRCONTAINS call.");
			if (!TValue.isLiteral(value2))
				throw TAMEError.UnexpectedValueType("Expected literal type in STRCONTAINS call.");
			
			let sequence = TValue.asString(value2);
			let str = TValue.asString(value1);

			request.pushValue(TValue.createBoolean(str.indexOf(sequence) >= 0));
		}
	},

	/* STRSPLIT */
	{
		"name": 'STRSPLIT', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value2 = request.popValue();
			let value1 = request.popValue();

			if (!TValue.isLiteral(value1))
				throw TAMEError.UnexpectedValueType("Expected literal type in STRSPLIT call.");
			if (!TValue.isLiteral(value2))
				throw TAMEError.UnexpectedValueType("Expected literal type in STRSPLIT call.");
			
			let sequence = TValue.asString(value2);
			let str = TValue.asString(value1);

			let out = TValue.createList([]);
			let index = str.indexOf(sequence);
			while (index >= 0)
			{
				TValue.listAdd(out, TValue.createString(str.substring(0, index)));
				str = str.substring(index + sequence.length, str.length);
				index = str.indexOf(sequence);
			}
			TValue.listAdd(out, TValue.createString(str));
			request.pushValue(out);
		}
	},

	/* STRJOIN */
	{
		"name": 'STRJOIN', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let joiner = request.popValue();
			let list = request.popValue();

			if (!TValue.isLiteral(joiner))
				throw TAMEError.UnexpectedValueType("Expected literal type in STRJOIN call.");
			if (!TValue.isLiteral(list))
				throw TAMEError.UnexpectedValueType("Expected literal type in STRJOIN call.");
			
			let str = TValue.asString(joiner);

			if (!TValue.isList(list) || TValue.length(list) == 1)
				request.pushValue(TValue.createString(TValue.asString(list)));
			else
			{
				let sb = new TStringBuilder();
				let len = TValue.length(list);
				for (let i = 0; i < len; i++)
				{
					sb.append(TValue.asString(TValue.listGet(list, i)));
					if (i < len - 1)
						sb.append(str);
				}
				request.pushValue(TValue.createString(sb.toString()));
			}
		}
	},
	
	/* STRSTARTSWITH */
	{
		"name": 'STRSTARTSWITH', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value2 = request.popValue();
			let value1 = request.popValue();

			if (!TValue.isLiteral(value1))
				throw TAMEError.UnexpectedValueType("Expected literal type in STRSTARTSWITH call.");
			if (!TValue.isLiteral(value2))
				throw TAMEError.UnexpectedValueType("Expected literal type in STRSTARTSWITH call.");
			
			let sequence = TValue.asString(value2);
			let str = TValue.asString(value1);

			request.pushValue(TValue.createBoolean(str.substring(0, sequence.length) === sequence));
		}
	},

	/* STRENDSWITH */
	{
		"name": 'STRENDSWITH', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value2 = request.popValue();
			let value1 = request.popValue();

			if (!TValue.isLiteral(value1))
				throw TAMEError.UnexpectedValueType("Expected literal type in STRENDSWITH call.");
			if (!TValue.isLiteral(value2))
				throw TAMEError.UnexpectedValueType("Expected literal type in STRENDSWITH call.");
			
			let sequence = TValue.asString(value2);
			let str = TValue.asString(value1);

			request.pushValue(TValue.createBoolean(str.substring(str.length - sequence.length) === sequence));
		}
	},

	/* SUBSTRING */
	{
		"name": 'SUBSTRING', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value3 = request.popValue();
			let value2 = request.popValue();
			let value1 = request.popValue();

			if (!TValue.isLiteral(value1))
				throw TAMEError.UnexpectedValueType("Expected literal type in SUBSTRING call.");
			if (!TValue.isLiteral(value2))
				throw TAMEError.UnexpectedValueType("Expected literal type in SUBSTRING call.");
			if (!TValue.isLiteral(value3))
				throw TAMEError.UnexpectedValueType("Expected literal type in SUBSTRING call.");

			let end = TValue.asLong(value3);
			let start = TValue.asLong(value2);
			let source = TValue.asString(value1);
			
			start = Math.min(Math.max(start, 0), source.length);
			end = Math.min(Math.max(end, 0), source.length);
			if (end <= start)
				request.pushValue(TValue.createString(""));
			else
				request.pushValue(TValue.createString(source.substring(start, end)));
		}
	},

	/* STRLOWER */
	{
		"name": 'STRLOWER', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value1 = request.popValue();

			if (!TValue.isLiteral(value1))
				throw TAMEError.UnexpectedValueType("Expected literal type in STRLOWER call.");

			request.pushValue(TValue.createString(TValue.asString(value1).toLowerCase()));
		}
	},

	/* STRUPPER */
	{
		"name": 'STRUPPER', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value1 = request.popValue();

			if (!TValue.isLiteral(value1))
				throw TAMEError.UnexpectedValueType("Expected literal type in STRUPPER call.");

			request.pushValue(TValue.createString(TValue.asString(value1).toUpperCase()));
		}
	},

	/* STRCHAR */
	{
		"name": 'STRCHAR', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value2 = request.popValue();
			let value1 = request.popValue();

			if (!TValue.isLiteral(value1))
				throw TAMEError.UnexpectedValueType("Expected literal type in STRCHAR call.");
			if (!TValue.isLiteral(value2))
				throw TAMEError.UnexpectedValueType("Expected literal type in STRCHAR call.");
			
			let index = TValue.asLong(value2);
			let str = TValue.asString(value1);

			if (index < 0 || index >= str.length)
				request.pushValue(TValue.createString(''));
			else
				request.pushValue(TValue.createString(str.charAt(index)));
		}
	},

	/* STRTRIM */
	{
		"name": 'STRTRIM', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value1 = request.popValue();

			if (!TValue.isLiteral(value1))
				throw TAMEError.UnexpectedValueType("Expected literal type in STRTRIM call.");

			request.pushValue(TValue.createString(TValue.asString(value1).trim()));
		}
	},

	/* STRFORMAT */
	{
		"name": 'STRFORMAT', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let list = request.popValue();
			let str = request.popValue();

			if (!TValue.isLiteral(list))
				throw TAMEError.UnexpectedValueType("Expected literal type in STRFORMAT call.");
			if (!TValue.isLiteral(str))
				throw TAMEError.UnexpectedValueType("Expected literal type in STRFORMAT call.");

			if (!TValue.isList(list))
			{
				let nl = TValue.createList([]);
				TValue.listAdd(nl, list);
				list = nl;
			}

			let sb = '';
			let err = '';
			let chars = TValue.asString(str);
			
			const STATE_START = 0;
			const STATE_INDEX = 1;
			let DIGIT_ZERO = '0'.codePointAt(0);
			let DIGIT_NINE = '9'.codePointAt(0);
			let state = STATE_START;
			let index = 0;

			for (let i = 0; i < chars.length; i++)
			{
				let c = chars.charAt(i);
				switch (state)
				{
					case STATE_START:
					{
						if (c === '{')
						{
							state = STATE_INDEX;
							index = 0;
							err = '{';
						}
						else
							sb += c;
					}
					break;
					
					case STATE_INDEX:
					{
						if (c === '}')
						{
							state = STATE_START;
							sb += TValue.asString(TValue.listGet(list, index));
						}
						else if (c.codePointAt(0) >= DIGIT_ZERO && c.codePointAt(0) <= DIGIT_NINE)
						{
							index = (index * 10) + (c.codePointAt(0) - DIGIT_ZERO);
							err += c;
						}
						else
						{
							err += c;
							sb += err;
							state = STATE_START;
						}
					}
					break;
				}
			}
			
			request.pushValue(TValue.createString(sb));
		}
	},

	/* ISREGEX */
	{
		"name": 'ISREGEX', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let valPattern = request.popValue();
			
			if (!TValue.isLiteral(valPattern))
				throw TAMEError.UnexpectedValueType("Expected literal type in ISREGEX call.");

			try {
				new RegExp(TValue.asString(valPattern));
				request.pushValue(TValue.createBoolean(true));
			} catch (err) {
				request.pushValue(TValue.createBoolean(false));
			}
		}
	},

	/* REGEXCONTAINS */
	{
		"name": 'REGEXCONTAINS', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let valInput = request.popValue();
			let valPattern = request.popValue();
			
			if (!TValue.isLiteral(valPattern))
				throw TAMEError.UnexpectedValueType("Expected literal type in REGEXCONTAINS call.");
			if (!TValue.isLiteral(valInput))
				throw TAMEError.UnexpectedValueType("Expected literal type in REGEXCONTAINS call.");

			let pattern = null;
			try {
				pattern = new RegExp(TValue.asString(valPattern), "g");
			} catch (err) {
				throw TAMEError.BadParameter("RegEx could not be compiled:\n" + err.message);
			}
			
			let input = TValue.asString(valInput);
			let result = pattern.test(input);
			request.pushValue(TValue.createBoolean(pattern.test(input)));
		}
	},
	
	/* REGEXFIND */
	{
		"name": 'REGEXFIND', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let valInput = request.popValue();
			let valPattern = request.popValue();
			
			if (!TValue.isLiteral(valPattern))
				throw TAMEError.UnexpectedValueType("Expected literal type in REGEXFIND call.");
			if (!TValue.isLiteral(valInput))
				throw TAMEError.UnexpectedValueType("Expected literal type in REGEXFIND call.");

			let pattern = null;
			try {
				pattern = new RegExp(TValue.asString(valPattern), "g");
			} catch (err) {
				throw TAMEError.BadParameter("RegEx could not be compiled:\n" + err.message);
			}
			
			let input = TValue.asString(valInput);
			let result = pattern.exec(input);
			if (result)
				request.pushValue(TValue.createInteger(result.index));
			else
				request.pushValue(TValue.createInteger(-1));
		}
	},
	
	/* REGEXFINDLAST */
	{
		"name": 'REGEXFINDLAST', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let valInput = request.popValue();
			let valPattern = request.popValue();
			
			if (!TValue.isLiteral(valPattern))
				throw TAMEError.UnexpectedValueType("Expected literal type in REGEXFINDLAST call.");
			if (!TValue.isLiteral(valInput))
				throw TAMEError.UnexpectedValueType("Expected literal type in REGEXFINDLAST call.");

			let pattern = null;
			try {
				pattern = new RegExp(TValue.asString(valPattern), "g");
			} catch (err) {
				throw TAMEError.BadParameter("RegEx could not be compiled:\n" + err.message);
			}
			
			let input = TValue.asString(valInput);
			let result = null;
			let index = -1;
			while (result = pattern.exec(input)) // Intentional assignment.
				index = result.index;
			request.pushValue(TValue.createInteger(index));
		}
	},
	
	/* REGEXGET */
	{
		"name": 'REGEXGET', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let valInput = request.popValue();
			let valPattern = request.popValue();
			
			if (!TValue.isLiteral(valPattern))
				throw TAMEError.UnexpectedValueType("Expected literal type in REGEXGET call.");
			if (!TValue.isLiteral(valInput))
				throw TAMEError.UnexpectedValueType("Expected literal type in REGEXGET call.");

			let pattern = null;
			try {
				pattern = new RegExp(TValue.asString(valPattern), "g");
			} catch (err) {
				throw TAMEError.BadParameter("RegEx could not be compiled:\n" + err.message);
			}
			
			let input = TValue.asString(valInput);
			let result = pattern.exec(input);
			if (result)
				request.pushValue(TValue.createString(result[0]));
			else
				request.pushValue(TValue.createBoolean(false));
		}
	},
	
	/* REGEXGETLAST */
	{
		"name": 'REGEXGETLAST', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let valInput = request.popValue();
			let valPattern = request.popValue();
			
			if (!TValue.isLiteral(valPattern))
				throw TAMEError.UnexpectedValueType("Expected literal type in REGEXGETLAST call.");
			if (!TValue.isLiteral(valInput))
				throw TAMEError.UnexpectedValueType("Expected literal type in REGEXGETLAST call.");

			let pattern = null;
			try {
				pattern = new RegExp(TValue.asString(valPattern), "g");
			} catch (err) {
				throw TAMEError.BadParameter("RegEx could not be compiled:\n" + err.message);
			}
			
			let input = TValue.asString(valInput);
			let result = null;
			let found = null;
			while (result = pattern.exec(input)) // Intentional assignment.
				found = result[0];
			if (found !== null)
				request.pushValue(TValue.createString(found));
			else
				request.pushValue(TValue.createBoolean(false));
		}
	},
	
	/* REGEXGETALL */
	{
		"name": 'REGEXGETALL', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let valInput = request.popValue();
			let valPattern = request.popValue();
			
			if (!TValue.isLiteral(valPattern))
				throw TAMEError.UnexpectedValueType("Expected literal type in REGEXGETALL call.");
			if (!TValue.isLiteral(valInput))
				throw TAMEError.UnexpectedValueType("Expected literal type in REGEXGETALL call.");

			let pattern = null;
			try {
				pattern = new RegExp(TValue.asString(valPattern), "g");
			} catch (err) {
				throw TAMEError.BadParameter("RegEx could not be compiled:\n" + err.message);
			}
			
			let input = TValue.asString(valInput);
			let out = TValue.createList([]);
			while (result = pattern.exec(input)) // Intentional assignment.
				TValue.listAdd(out, TValue.createString(result[0]));
			request.pushValue(out);
		}
	},
	
	/* REGEXMATCHES */
	{
		"name": 'REGEXMATCHES', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let valInput = request.popValue();
			let valPattern = request.popValue();
			
			if (!TValue.isLiteral(valPattern))
				throw TAMEError.UnexpectedValueType("Expected literal type in REGEXMATCHES call.");
			if (!TValue.isLiteral(valInput))
				throw TAMEError.UnexpectedValueType("Expected literal type in REGEXMATCHES call.");

			let pattern = null;
			try {
				pattern = new RegExp(TValue.asString(valPattern), "g");
			} catch (err) {
				throw TAMEError.BadParameter("RegEx could not be compiled:\n" + err.message);
			}
			
			let input = TValue.asString(valInput);
			let result = pattern.exec(input);
			if (result)
				request.pushValue(TValue.createBoolean(input === result[0]));
			else
				request.pushValue(TValue.createBoolean(false));
		}
	},
		
	/* REGEXSPLIT */
	{
		"name": 'REGEXSPLIT', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let valInput = request.popValue();
			let valPattern = request.popValue();
			
			if (!TValue.isLiteral(valPattern))
				throw TAMEError.UnexpectedValueType("Expected literal type in REGEXSPLIT call.");
			if (!TValue.isLiteral(valInput))
				throw TAMEError.UnexpectedValueType("Expected literal type in REGEXSPLIT call.");

			let pattern = null;
			try {
				pattern = new RegExp(TValue.asString(valPattern), "g");
			} catch (err) {
				throw TAMEError.BadParameter("RegEx could not be compiled:\n" + err.message);
			}
			
			let out = TValue.createList([]);
			let tokens = TValue.asString(valInput).split(pattern);
			for (let i = 0; i < tokens.length; i++)
				TValue.listAdd(out, TValue.createString(tokens[i]));
			request.pushValue(out);
		}
	},
		
	/* REGEXREPLACE */
	{
		"name": 'REGEXREPLACE', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let valInput = request.popValue();
			let valReplacer = request.popValue();
			let valPattern = request.popValue();
			
			if (!TValue.isLiteral(valPattern))
				throw TAMEError.UnexpectedValueType("Expected literal type in REGEXREPLACE call.");
			if (!TValue.isLiteral(valReplacer))
				throw TAMEError.UnexpectedValueType("Expected literal type in REGEXREPLACE call.");
			if (!TValue.isLiteral(valInput))
				throw TAMEError.UnexpectedValueType("Expected literal type in REGEXREPLACE call.");

			let pattern = null;
			try {
				pattern = new RegExp(TValue.asString(valPattern), "g");
			} catch (err) {
				throw TAMEError.BadParameter("RegEx could not be compiled:\n" + err.message);
			}
			
			let sb = new TStringBuilder();
			let tokens = TValue.asString(valInput).split(pattern);
			let replacer = TValue.asString(valReplacer);
			for (let i = 0; i < tokens.length; i++)
			{
				sb.append(tokens[i]);
				if (i < tokens.length - 1)
					sb.append(replacer);
			}
			request.pushValue(TValue.createString(sb.toString()));
		}
	},
		
	/* LISTNEW */
	{
		"name": 'LISTNEW', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let size = request.popValue();
			
			if (!TValue.isLiteral(size))
				throw TAMEError.UnexpectedValueType("Expected literal type in LISTNEW call.");

			let len = TValue.asLong(size);
			if (len < 0)
				len = 0;
			
			let list = TValue.createList([]);
			while (len-- > 0)
				TValue.listAdd(list, TValue.createBoolean(false));
			request.pushValue(list);
		}
	},
		
	/* LISTADD */
	{
		"name": 'LISTADD', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value = request.popValue();
			let list = request.popValue();
			
			if (!TValue.isLiteral(value))
				throw TAMEError.UnexpectedValueType("Expected literal type in LISTADD call.");
			if (!TValue.isLiteral(list))
				throw TAMEError.UnexpectedValueType("Expected literal type in LISTADD call.");

			request.pushValue(TValue.createBoolean(TValue.listAdd(list, value)));
		}
	},
		
	/* LISTADDAT */
	{
		"name": 'LISTADDAT', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let index = request.popValue();
			let value = request.popValue();
			let list = request.popValue();
			
			if (!TValue.isLiteral(index))
				throw TAMEError.UnexpectedValueType("Expected literal type in LISTADDAT call.");
			if (!TValue.isLiteral(value))
				throw TAMEError.UnexpectedValueType("Expected literal type in LISTADDAT call.");
			if (!TValue.isLiteral(list))
				throw TAMEError.UnexpectedValueType("Expected literal type in LISTADDAT call.");

			request.pushValue(TValue.createBoolean(TValue.listAddAt(list, TValue.asLong(index), value)));
		}
	},
		
	/* LISTREMOVE */
	{
		"name": 'LISTREMOVE', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value = request.popValue();
			let list = request.popValue();
			
			if (!TValue.isLiteral(value))
				throw TAMEError.UnexpectedValueType("Expected literal type in LISTREMOVE call.");
			if (!TValue.isLiteral(list))
				throw TAMEError.UnexpectedValueType("Expected literal type in LISTREMOVE call.");

			request.pushValue(TValue.createBoolean(TValue.listRemove(list, value)));
		}
	
	},
		
	/* LISTREMOVEAT */
	{
		"name": 'LISTREMOVEAT', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let index = request.popValue();
			let list = request.popValue();
			
			if (!TValue.isLiteral(index))
				throw TAMEError.UnexpectedValueType("Expected literal type in LISTREMOVEAT call.");
			if (!TValue.isLiteral(list))
				throw TAMEError.UnexpectedValueType("Expected literal type in LISTREMOVEAT call.");

			request.pushValue(TValue.listRemoveAt(list, TValue.asLong(index)));
		}
	},
		
	/* LISTCONCAT */
	{
		"name": 'LISTCONCAT', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let appendix = request.popValue();
			let list = request.popValue();
			
			if (!TValue.isLiteral(appendix))
				throw TAMEError.UnexpectedValueType("Expected literal type in LISTCONCAT call.");
			if (!TValue.isLiteral(list))
				throw TAMEError.UnexpectedValueType("Expected literal type in LISTCONCAT call.");

			if (!TValue.isList(list))
			{
				let v = list;
				list = TValue.createList([]);
				TValue.listAdd(list, v);
			}

			if (!TValue.isList(appendix))
			{
				let v = appendix;
				appendix = TValue.createList([]);
				TValue.listAdd(appendix, v);
			}
			
			let out = TValue.createList([]);
			for (let i = 0; i < TValue.length(list); i++)
				TValue.listAdd(out, TValue.listGet(list, i));
			for (let i = 0; i < TValue.length(appendix); i++)
				TValue.listAdd(out, TValue.listGet(appendix, i));
			
			request.pushValue(out);
		}
	},
		
	/* LISTINDEX */
	{
		"name": 'LISTINDEX', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value = request.popValue();
			let list = request.popValue();
			
			if (!TValue.isLiteral(value))
				throw TAMEError.UnexpectedValueType("Expected literal type in LISTINDEX call.");
			if (!TValue.isLiteral(list))
				throw TAMEError.UnexpectedValueType("Expected literal type in LISTINDEX call.");

			request.pushValue(TValue.createInteger(TValue.listIndexOf(list, value)));
		}
	},
		
	/* LISTCONTAINS */
	{
		"name": 'LISTCONTAINS', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value = request.popValue();
			let list = request.popValue();
			
			if (!TValue.isLiteral(value))
				throw TAMEError.UnexpectedValueType("Expected literal type in LISTCONTAINS call.");
			if (!TValue.isLiteral(list))
				throw TAMEError.UnexpectedValueType("Expected literal type in LISTCONTAINS call.");

			request.pushValue(TValue.createBoolean(TValue.listContains(list, value)));
		}
	},
		
	/* FLOOR */
	{
		"name": 'FLOOR', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value1 = request.popValue();

			if (!TValue.isLiteral(value1))
				throw TAMEError.UnexpectedValueType("Expected literal type in FLOOR call.");

			request.pushValue(TValue.createFloat(Math.floor(TValue.asDouble(value1))));
		}
	},

	/* CEILING */
	{
		"name": 'CEILING', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value1 = request.popValue();

			if (!TValue.isLiteral(value1))
				throw TAMEError.UnexpectedValueType("Expected literal type in CEILING call.");

			request.pushValue(TValue.createFloat(Math.ceil(TValue.asDouble(value1))));
		}
	},

	/* ROUND */
	{
		"name": 'ROUND', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value1 = request.popValue();

			if (!TValue.isLiteral(value1))
				throw TAMEError.UnexpectedValueType("Expected literal type in ROUND call.");

			request.pushValue(TValue.createFloat(Math.round(TValue.asDouble(value1))));
		}
	},

	/* FIX */
	{
		"name": 'FIX', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value2 = request.popValue();
			let value1 = request.popValue();

			if (!TValue.isLiteral(value1))
				throw TAMEError.UnexpectedValueType("Expected literal type in FIX call.");
			if (!TValue.isLiteral(value2))
				throw TAMEError.UnexpectedValueType("Expected literal type in FIX call.");
			
			let d = TValue.asDouble(value1);
			let f = TValue.asDouble(value2);
			let t = Math.pow(10, f);

			request.pushValue(TValue.createFloat(Math.round(d * t) / t));
		}
	},

	/* SQRT */
	{
		"name": 'SQRT', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value1 = request.popValue();

			if (!TValue.isLiteral(value1))
				throw TAMEError.UnexpectedValueType("Expected literal type in SQRT call.");

			request.pushValue(TValue.createFloat(Math.sqrt(TValue.asDouble(value1))));
		}
	},

	/* PI */
	{
		"name": 'PI', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			request.pushValue(TValue.createFloat(Math.PI));
		}
	},

	/* E */
	{
		"name": 'E', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			request.pushValue(TValue.createFloat(Math.E));
		}
	},

	/* SIN */
	{
		"name": 'SIN', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value1 = request.popValue();

			if (!TValue.isLiteral(value1))
				throw TAMEError.UnexpectedValueType("Expected literal type in SIN call.");

			request.pushValue(TValue.createFloat(Math.sin(TValue.asDouble(value1))));
		}
	},

	/* COS */
	{
		"name": 'COS', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value1 = request.popValue();

			if (!TValue.isLiteral(value1))
				throw TAMEError.UnexpectedValueType("Expected literal type in COS call.");

			request.pushValue(TValue.createFloat(Math.cos(TValue.asDouble(value1))));
		}
	},

	/* TAN */
	{
		"name": 'TAN', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value1 = request.popValue();

			if (!TValue.isLiteral(value1))
				throw TAMEError.UnexpectedValueType("Expected literal type in TAN call.");

			request.pushValue(TValue.createFloat(Math.tan(TValue.asDouble(value1))));
		}
	},

	/* MIN */
	{
		"name": 'MIN', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value2 = request.popValue();
			let value1 = request.popValue();

			if (!TValue.isLiteral(value1))
				throw TAMEError.UnexpectedValueType("Expected literal type in MIN call.");
			if (!TValue.isLiteral(value2))
				throw TAMEError.UnexpectedValueType("Expected literal type in MIN call.");
			
			request.pushValue(TValue.compare(value1, value2) <= 0 ? value1 : value2);
		}
	},

	/* MAX */
	{
		"name": 'MAX', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value2 = request.popValue();
			let value1 = request.popValue();

			if (!TValue.isLiteral(value1))
				throw TAMEError.UnexpectedValueType("Expected literal type in MAX call.");
			if (!TValue.isLiteral(value2))
				throw TAMEError.UnexpectedValueType("Expected literal type in MAX call.");
			
			request.pushValue(TValue.compare(value1, value2) > 0 ? value1 : value2);
		}
	},

	/* CLAMP */
	{
		"name": 'CLAMP', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value3 = request.popValue();
			let value2 = request.popValue();
			let value1 = request.popValue();

			if (!TValue.isLiteral(value1))
				throw TAMEError.UnexpectedValueType("Expected literal type in CLAMP call.");
			if (!TValue.isLiteral(value2))
				throw TAMEError.UnexpectedValueType("Expected literal type in CLAMP call.");
			if (!TValue.isLiteral(value3))
				throw TAMEError.UnexpectedValueType("Expected literal type in CLAMP call.");

			let hi = TValue.asDouble(value3);
			let lo = TValue.asDouble(value2);
			let number = TValue.asDouble(value1);
			
			request.pushValue(TValue.createFloat(Math.min(Math.max(number, lo), hi)));
		}
	},

	/* IRANDOM */
	{
		"name": 'IRANDOM', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value1 = request.popValue();

			if (!TValue.isLiteral(value1))
				throw TAMEError.UnexpectedValueType("Expected literal type in IRANDOM call.");

			let value = TValue.asLong(value1);

			if (value === 0)
				request.pushValue(TValue.createInteger(0));
			else if (value < 0)
				request.pushValue(TValue.createInteger(-(Math.floor(Math.random() * Math.abs(value)))));
			else
				request.pushValue(TValue.createInteger(Math.floor(Math.random() * Math.abs(value))));
		}
	},

	/* FRANDOM */
	{
		"name": 'FRANDOM', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			request.pushValue(TValue.createFloat(Math.random()));
		}
	},

	/* GRANDOM */
	{
		"name": 'GRANDOM', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value2 = request.popValue();
			let value1 = request.popValue();

			if (!TValue.isLiteral(value1))
				throw TAMEError.UnexpectedValueType("Expected literal type in GRANDOM call.");
			if (!TValue.isLiteral(value2))
				throw TAMEError.UnexpectedValueType("Expected literal type in GRANDOM call.");
			
			// Box-Muller Approximate algorithm c/o Maxwell Collard on StackOverflow

			let stdDev = TValue.asDouble(value2);
			let mean = TValue.asDouble(value1);
			
		    let u = 1.0 - Math.random();
		    let v = 1.0 - Math.random();
		    let stdNormal = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
		    let out = mean + stdDev * stdNormal;

		    request.pushValue(TValue.createFloat(out));
		}
	},

	/* TIME */
	{
		"name": 'TIME', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			request.pushValue(TValue.createInteger(Date.now()));
		}
	},

	/* TIMEFORMAT */
	{
		"name": 'TIMEFORMAT', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let value2 = request.popValue();
			let value1 = request.popValue();

			if (!TValue.isLiteral(value1))
				throw TAMEError.UnexpectedValueType("Expected literal type in TIMEFORMAT call.");
			if (!TValue.isLiteral(value2))
				throw TAMEError.UnexpectedValueType("Expected literal type in TIMEFORMAT call.");

			let date = TValue.asLong(value1);
			let format = TValue.asString(value2);

			request.pushValue(TValue.createString(Util.formatDate(date, format)));
		}
	},

	/* OBJECTHASNAME */
	{
		"name": 'OBJECTHASNAME', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let nameValue = request.popValue();
			let varObject = request.popValue();

			if (!TValue.isLiteral(nameValue))
				throw TAMEError.UnexpectedValueType("Expected literal type in OBJECTHASNAME call.");
			if (!TValue.isObject(varObject))
				throw TAMEError.UnexpectedValueType("Expected object type in OBJECTHASNAME call.");

			request.pushValue(TValue.createBoolean(request.moduleContext.checkObjectHasName(TValue.asString(varObject), TValue.asString(nameValue))));
		}
	},

	/* OBJECTHASTAG */
	{
		"name": 'OBJECTHASTAG', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let tagValue = request.popValue();
			let varObject = request.popValue();

			if (!TValue.isLiteral(tagValue))
				throw TAMEError.UnexpectedValueType("Expected literal type in OBJECTHASTAG call.");
			if (!TValue.isObject(varObject))
				throw TAMEError.UnexpectedValueType("Expected object type in OBJECTHASTAG call.");

			request.pushValue(TValue.createBoolean(request.moduleContext.checkObjectHasTag(TValue.asString(varObject), TValue.asString(tagValue))));
		}
	},

	/* ADDOBJECTNAME */
	{
		"name": 'ADDOBJECTNAME', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let nameValue = request.popValue();
			let varObject = request.popValue();

			if (!TValue.isLiteral(nameValue))
				throw TAMEError.UnexpectedValueType("Expected literal type in ADDOBJECTNAME call.");
			if (!TValue.isObject(varObject))
				throw TAMEError.UnexpectedValueType("Expected object type in ADDOBJECTNAME call.");

			request.moduleContext.addObjectName(TValue.asString(varObject), TValue.asString(nameValue));
		}
	},

	/* ADDOBJECTTAG */
	{
		"name": 'ADDOBJECTTAG', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let tagValue = request.popValue();
			let varObject = request.popValue();

			if (!TValue.isLiteral(tagValue))
				throw TAMEError.UnexpectedValueType("Expected literal type in ADDOBJECTTAG call.");
			if (!TValue.isObject(varObject))
				throw TAMEError.UnexpectedValueType("Expected object type in ADDOBJECTTAG call.");

			request.moduleContext.addObjectTag(TValue.asString(varObject), TValue.asString(tagValue));
		}
	},

	/* ADDOBJECTTAGTOALLIN */
	{
		"name": 'ADDOBJECTTAGTOALLIN', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let tagValue = request.popValue();
			let elementValue = request.popValue();

			if (!TValue.isLiteral(tagValue))
				throw TAMEError.UnexpectedValueType("Expected literal type in ADDOBJECTTAGTOALLIN call.");
			if (!TValue.isObjectContainer(elementValue))
				throw TAMEError.UnexpectedValueType("Expected object-container type in ADDOBJECTTAGTOALLIN call.");

			let context = request.moduleContext;
			let element = context.resolveElement(TValue.asString(elementValue));
			
			let tag = TValue.asString(tagValue);
			Util.each(context.getObjectsOwnedByElement(element.identity), function(objectIdentity){
				context.addObjectTag(objectIdentity, tag);
			});
		}
	},

	/* REMOVEOBJECTNAME */
	{
		"name": 'REMOVEOBJECTNAME', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let nameValue = request.popValue();
			let varObject = request.popValue();

			if (!TValue.isLiteral(nameValue))
				throw TAMEError.UnexpectedValueType("Expected literal type in REMOVEOBJECTNAME call.");
			if (!TValue.isObject(varObject))
				throw TAMEError.UnexpectedValueType("Expected object type in REMOVEOBJECTNAME call.");

			request.moduleContext.removeObjectName(TValue.asString(varObject), TValue.asString(nameValue));
		}
	},

	/* REMOVEOBJECTTAG */
	{
		"name": 'REMOVEOBJECTTAG', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let tagValue = request.popValue();
			let varObject = request.popValue();

			if (!TValue.isLiteral(tagValue))
				throw TAMEError.UnexpectedValueType("Expected literal type in REMOVEOBJECTTAG call.");
			if (!TValue.isObject(varObject))
				throw TAMEError.UnexpectedValueType("Expected object type in REMOVEOBJECTTAG call.");

			request.moduleContext.removeObjectTag(TValue.asString(varObject), TValue.asString(tagValue));
		}
	},

	/* REMOVEOBJECTTAGFROMALLIN */
	{
		"name": 'REMOVEOBJECTTAGFROMALLIN', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let tagValue = request.popValue();
			let elementValue = request.popValue();

			if (!TValue.isLiteral(tagValue))
				throw TAMEError.UnexpectedValueType("Expected literal type in REMOVEOBJECTTAGFROMALLIN call.");
			if (!TValue.isObjectContainer(elementValue))
				throw TAMEError.UnexpectedValueType("Expected object-container type in REMOVEOBJECTTAGFROMALLIN call.");

			let context = request.moduleContext;
			let element = context.resolveElement(TValue.asString(elementValue));
			
			let tag = TValue.asString(tagValue);
			Util.each(context.getObjectsOwnedByElement(element.identity), function(objectIdentity){
				context.removeObjectTag(objectIdentity, tag);
			});
		}
	},

	/* GIVEOBJECT */
	{
		"name": 'GIVEOBJECT', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let varObject = request.popValue();
			let varObjectContainer = request.popValue();

			if (!TValue.isObject(varObject))
				throw TAMEError.UnexpectedValueType("Expected object type in GIVEOBJECT call.");
			if (!TValue.isObjectContainer(varObjectContainer))
				throw TAMEError.UnexpectedValueType("Expected object-container type in GIVEOBJECT call.");

			let element = request.moduleContext.resolveElement(TValue.asString(varObjectContainer));

			request.moduleContext.addObjectToElement(element.identity, TValue.asString(varObject));
		}
	},

	/* REMOVEOBJECT */
	{
		"name": 'REMOVEOBJECT', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let varObject = request.popValue();

			if (!TValue.isObject(varObject))
				throw TAMEError.UnexpectedValueType("Expected object type in REMOVEOBJECT call.");

			request.moduleContext.removeObject(TValue.asString(varObject));
		}
	},

	/* MOVEOBJECTSWITHTAG */
	{
		"name": 'MOVEOBJECTSWITHTAG', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let tagValue = request.popValue();
			let varObjectContainerDest = request.popValue();
			let varObjectContainerSource = request.popValue();

			if (!TValue.isLiteral(tagValue))
				throw TAMEError.UnexpectedValueType("Expected literal type in MOVEOBJECTSWITHTAG call.");
			if (!TValue.isObjectContainer(varObjectContainerDest))
				throw TAMEError.UnexpectedValueType("Expected object-container type in MOVEOBJECTSWITHTAG call.");
			if (!TValue.isObjectContainer(varObjectContainerSource))
				throw TAMEError.UnexpectedValueType("Expected object-container type in MOVEOBJECTSWITHTAG call.");

			let context = request.moduleContext;
			let destination = context.resolveElement(TValue.asString(varObjectContainerDest));
			let source = context.resolveElement(TValue.asString(varObjectContainerSource));
			let tag = TValue.asString(tagValue);
			
			Util.each(context.getObjectsOwnedByElement(source.identity), function(objectIdentity){
				if (context.checkObjectHasTag(objectIdentity, tag))
					context.addObjectToElement(destination.identity, objectIdentity);
			});
		}
	},

	/* OBJECTCOUNT */
	{
		"name": 'OBJECTCOUNT', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let elementValue = request.popValue();

			if (!TValue.isObjectContainer(elementValue))
				throw TAMEError.UnexpectedValueType("Expected object-container type in OBJECTCOUNT call.");

			let element = request.moduleContext.resolveElement(TValue.asString(elementValue));

			request.pushValue(TValue.createInteger(request.moduleContext.getObjectsOwnedByElementCount(element.identity)));
		}
	},

	/* HASOBJECT */
	{
		"name": 'HASOBJECT', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let varObject = request.popValue();
			let varObjectContainer = request.popValue();

			if (!TValue.isObject(varObject))
				throw TAMEError.UnexpectedValueType("Expected object type in HASOBJECT call.");
			if (!TValue.isObjectContainer(varObjectContainer))
				throw TAMEError.UnexpectedValueType("Expected object-container type in HASOBJECT call.");

			let element = request.moduleContext.resolveElement(TValue.asString(varObjectContainer));

			request.pushValue(TValue.createBoolean(request.moduleContext.checkElementHasObject(element.identity, TValue.asString(varObject))));
		}
	},

	/* OBJECTHASNOOWNER */
	{
		"name": 'OBJECTHASNOOWNER', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let varObject = request.popValue();

			if (!TValue.isObject(varObject))
				throw TAMEError.UnexpectedValueType("Expected object type in OBJECTHASNOOWNER call.");

			request.pushValue(TValue.createBoolean(request.moduleContext.checkObjectHasNoOwner(TValue.asString(varObject))));
		}
	},

	/* PLAYERISINROOM */
	{
		"name": 'PLAYERISINROOM', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let varRoom = request.popValue();
			let varPlayer = request.popValue();
			
			if (!TValue.isRoom(varRoom))
				throw TAMEError.UnexpectedValueType("Expected room type in PLAYERISINROOM call.");
			if (!TValue.isPlayer(varPlayer))
				throw TAMEError.UnexpectedValueType("Expected player type in PLAYERISINROOM call.");

			let context = request.moduleContext;
			let room = context.resolveElement(TValue.asString(varRoom));
			let player = context.resolveElement(TValue.asString(varPlayer));

			request.pushValue(TValue.createBoolean(context.checkPlayerIsInRoom(player.identity, room.identity)));
		}
	},

	/* PLAYERCANACCESSOBJECT */
	{
		"name": 'PLAYERCANACCESSOBJECT', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let varObject = request.popValue();
			let varPlayer = request.popValue();

			if (!TValue.isObject(varObject))
				throw TAMEError.UnexpectedValueType("Expected object type in PLAYERCANACCESSOBJECT call.");
			if (!TValue.isPlayer(varPlayer))
				throw TAMEError.UnexpectedValueType("Expected player type in PLAYERCANACCESSOBJECT call.");

			let player = request.moduleContext.resolveElement(TValue.asString(varPlayer));

			request.pushValue(TValue.createBoolean(TLogic.checkObjectAccessibility(request, response, player.identity, TValue.asString(varObject))));
		}
	},

	/* BROWSE */
	{
		"name": 'BROWSE', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let varObjectContainer = request.popValue();

			if (!TValue.isObjectContainer(varObjectContainer))
				throw TAMEError.UnexpectedValueType("Expected object-container type in BROWSE call.");

			let element = request.moduleContext.resolveElement(TValue.asString(varObjectContainer));

			TLogic.doBrowse(request, response, element.identity);
		}
	},

	/* BROWSETAGGED */
	{
		"name": 'BROWSETAGGED', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let varTag = request.popValue();
			let varObjectContainer = request.popValue();

			if (!TValue.isLiteral(varTag))
				throw TAMEError.UnexpectedValueType("Expected literal type in BROWSETAGGED call.");
			if (!TValue.isObjectContainer(varObjectContainer))
				throw TAMEError.UnexpectedValueType("Expected object-container type in BROWSETAGGED call.");

			let tagName = TValue.asString(varTag);
			let element = request.moduleContext.resolveElement(TValue.asString(varObjectContainer));

			TLogic.doBrowse(request, response, element.identity, tagName);
		}
	},

	/* ELEMENTHASANCESTOR */
	{
		"name": 'ELEMENTHASANCESTOR', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let varParent = request.popValue();
			let varElement = request.popValue();

			if (!TValue.isElement(varElement))
				throw TAMEError.UnexpectedValueType("Expected element type in ELEMENTHASANCESTOR call.");
			if (!TValue.isElement(varParent))
				throw TAMEError.UnexpectedValueType("Expected element type in ELEMENTHASANCESTOR call.");

			let context = request.moduleContext;
			let parentIdentity = context.resolveElement(TValue.asString(varParent)).identity;
			let element = context.resolveElement(TValue.asString(varElement));

			let found = false;
			while (element)
			{
				if (element.identity == parentIdentity)
				{
					found = true;
					break;
				}
				
				element = element.parent ? context.resolveElement(element.parent) : null;
			}

			request.pushValue(TValue.createBoolean(found));
		}
	},

	/* SETPLAYER */
	{
		"name": 'SETPLAYER', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let varPlayer = request.popValue();

			if (!TValue.isPlayer(varPlayer))
				throw TAMEError.UnexpectedValueType("Expected player type in SETPLAYER call.");

			let player = request.moduleContext.resolveElement(TValue.asString(varPlayer));

			TLogic.doPlayerSwitch(request, response, player.identity);
		}
	},

	/* SETROOM */
	{
		"name": 'SETROOM', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let varRoom = request.popValue();
			let varPlayer = request.popValue();

			if (!TValue.isRoom(varRoom))
				throw TAMEError.UnexpectedValueType("Expected room type in SETROOM call.");
			if (!TValue.isPlayer(varPlayer))
				throw TAMEError.UnexpectedValueType("Expected player type in SETROOM call.");

			let context = request.moduleContext;
			let room = context.resolveElement(TValue.asString(varRoom));
			let player = context.resolveElement(TValue.asString(varPlayer));
			
			TLogic.doRoomSwitch(request, response, player.identity, room.identity);
		}
	},

	/* PUSHROOM */
	{
		"name": 'PUSHROOM', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let varRoom = request.popValue();
			let varPlayer = request.popValue();

			if (!TValue.isRoom(varRoom))
				throw TAMEError.UnexpectedValueType("Expected room type in PUSHROOM call.");
			if (!TValue.isPlayer(varPlayer))
				throw TAMEError.UnexpectedValueType("Expected player type in PUSHROOM call.");

			let context = request.moduleContext;
			let room = context.resolveElement(TValue.asString(varRoom));
			let player = context.resolveElement(TValue.asString(varPlayer));

			TLogic.doRoomPush(request, response, player.identity, room.identity);
		}
	},

	/* POPROOM */
	{
		"name": 'POPROOM', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let varPlayer = request.popValue();

			if (!TValue.isPlayer(varPlayer))
				throw TAMEError.UnexpectedValueType("Expected player type in POPROOM call.");

			let context = request.moduleContext;
			let player = context.resolveElement(TValue.asString(varPlayer));

			let currentRoom = context.getCurrentRoom(player.identity);
			
			if (currentRoom === null)
				throw TAMEInterrupt.Error("No rooms for player" + TLogic.elementToString(player));
			
			TLogic.doRoomPop(request, response, player.identity);
		}
	},

	/* SWAPROOM */
	{
		"name": 'SWAPROOM', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let varRoom = request.popValue();
			let varPlayer = request.popValue();

			if (!TValue.isRoom(varRoom))
				throw TAMEError.UnexpectedValueType("Expected room type in SWAPROOM call.");
			if (!TValue.isPlayer(varPlayer))
				throw TAMEError.UnexpectedValueType("Expected player type in SWAPROOM call.");

			let context = request.moduleContext;
			let player = context.resolveElement(TValue.asString(varPlayer));

			if (player === null)
				throw TAMEInterrupt.Error("No current player!");

			let nextRoom = context.resolveElement(TValue.asString(varRoom)); 
			let currentRoom = context.getCurrentRoom(player.identity);

			if (currentRoom === null)
				throw new ErrorInterrupt("No rooms for current player!");
			
			TLogic.doRoomPop(request, response, player.identity);
			TLogic.doRoomPush(request, response, player.identity, nextRoom.identity);
		}
	},

	/* CURRENTPLAYERIS */
	{
		"name": 'CURRENTPLAYERIS', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let varPlayer = request.popValue();

			if (!TValue.isPlayer(varPlayer))
				throw TAMEError.UnexpectedValueType("Expected player type in CURRENTPLAYERIS call.");

			let context = request.moduleContext;
			let player = context.resolveElement(TValue.asString(varPlayer));
			let currentPlayer = context.getCurrentPlayer();
			
			request.pushValue(TValue.createBoolean(currentPlayer !== null && player.identity === currentPlayer.identity));
		}
	},

	/* NOCURRENTPLAYER */
	{
		"name": 'NOCURRENTPLAYER', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let currentPlayer = request.moduleContext.getCurrentPlayer();
			request.pushValue(TValue.createBoolean(currentPlayer === null));
		}
	},

	/* CURRENTROOMIS */
	{
		"name": 'CURRENTROOMIS', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let varRoom = request.popValue();
			let varPlayer = request.popValue();

			if (!TValue.isPlayer(varPlayer))
				throw TAMEError.UnexpectedValueType("Expected player type in CURRENTROOMIS call.");
			if (!TValue.isRoom(varRoom))
				throw TAMEError.UnexpectedValueType("Expected room type in CURRENTROOMIS call.");

			let context = request.moduleContext;
			let playerIdentity = TValue.asString(varPlayer);
			let player = context.resolveElement(playerIdentity);
			let room = context.resolveElement(TValue.asString(varRoom));
			
			let currentRoom = context.getCurrentRoom(player.identity);
			request.pushValue(TValue.createBoolean(currentRoom !== null && room.identity === currentRoom.identity));
		}
	},

	/* NOCURRENTROOM */
	{
		"name": 'NOCURRENTROOM', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let varPlayer = request.popValue();

			if (!TValue.isPlayer(varPlayer))
				throw TAMEError.UnexpectedValueType("Expected player type in NOCURRENTROOM call.");
			
			let context = request.moduleContext;
			let playerIdentity = TValue.asString(varPlayer);
			let player = context.resolveElement(playerIdentity);
			let currentRoom = context.getCurrentRoom(player.identity);
			request.pushValue(TValue.createBoolean(currentRoom === null));
		}
	},

	/* IDENTITY */
	{
		"name": 'IDENTITY', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let elementValue = request.popValue();
			
			if (!TValue.isElement(elementValue))
				throw TAMEError.UnexpectedValueType("Expected element type in IDENTITY call.");
			
			let element = request.moduleContext.resolveElement(TValue.asString(elementValue));
			request.pushValue(TValue.createString(element.identity));
		}
	},

	/* HEADER */
	{
		"name": 'HEADER', 
		"doOperation": function(request, response, blockLocal, operation)
		{
			let headerName = request.popValue();
			
			if (!TValue.isLiteral(headerName))
				throw TAMEError.UnexpectedValueType("Expected literal type in HEADER call.");
			
			let val = request.moduleContext.module.header[TValue.asString(headerName)];
			if ((typeof val) === 'undefined' || val === null)
				request.pushValue(TValue.createBoolean(false));
			else
				request.pushValue(TValue.createString(val));
		}
	},

];


/****************************************************************************
 * Main logic.
 ****************************************************************************/

/**
 * Sets a value on a variable hash.
 * @param valueHash the hash that contains the variables.
 * @param variableName the variable name.
 * @param value the value.
 */
TLogic.setValue = function(valueHash, variableName, value)
{
	variableName = variableName.toLowerCase();
	valueHash[variableName] = value;
};

/**
 * Sets a value on a variable hash.
 * @param valueHash the hash that contains the variables.
 * @param variableName the variable name.
 * @return the corresponding value or TValue.createBoolean(false) if no value.
 */
TLogic.getValue = function(valueHash, variableName)
{
	variableName = variableName.toLowerCase();
	if (!valueHash[variableName])
		return TValue.createBoolean(false);
	else
		return valueHash[variableName];
};

/**
 * Checks that a value exists on a variable hash.
 * @param valueHash the hash that contains the variables.
 * @param variableName the variable name.
 * @return true if so, false if not.
 */
TLogic.containsValue = function(valueHash, variableName)
{
	variableName = variableName.toLowerCase();
	return valueHash[variableName] ? true : false;
};

/**
 * Clears a value on a variable hash.
 * @param valueHash the hash that contains the variables.
 * @param variableName the variable name.
 */
TLogic.clearValue = function(valueHash, variableName)
{
	variableName = variableName.toLowerCase();
	delete valueHash[variableName];
};

/**
 * Turns a operation into a readable string.
 * @param cmdObject (Object) the operation object.
 * @return a string.
 */
TLogic.operationToString = function(operationObject)
{
	var sb = new TStringBuilder();
	sb.append(TOperationFunctions[operationObject.opcode].name);
	if (operationObject.operand0)
		sb.append(' ').append(TValue.toString(operationObject.operand0));
	if (operationObject.operand1)
		sb.append(' ').append(TValue.toString(operationObject.operand1));
	return sb.toString();
};

/**
 * Turns an element into a readable string.
 * @param elemObject (Object) the element object.
 * @return a string.
 */
TLogic.elementToString = function(elemObject)
{
	return elemObject.tameType + "[" + elemObject.identity + "]";
};

/**
 * Executes a block of operations.
 * @param block (Array) the block of operations.
 * @param request (TRequest) the request object.
 * @param response (TResponse) the response object.
 * @param blockLocal (Object) the local variables on the block call.
 * @throws TAMEInterrupt if an interrupt occurs. 
 */
TLogic.executeBlock = function(block, request, response, blockLocal)
{
	Util.each(block, function(operation) {
		if (TOperationFunctions[operation.opcode].internal)
			response.trace(request, TAMEConstants.TraceType.INTERNAL, Util.format("CALL {0}", TLogic.operationToString(operation))); 
		else
			response.trace(request, TAMEConstants.TraceType.FUNCTION, Util.format("CALL {0}", TLogic.operationToString(operation))); 
		TLogic.executeOperation(request, response, blockLocal, operation);
	});
};

/**
 * Increments the runaway operation counter and calls the operation.  
 * @param request (TRequest) the request object.
 * @param response (TResponse) the response object.
 * @param blockLocal (Object) the local variables on the block call.
 * @param operation (Object) the operation object.
 * @throws TAMEInterrupt if an interrupt occurs. 
 */
TLogic.executeOperation = function(request, response, blockLocal, operation)
{
	TOperationFunctions[operation.opcode].doOperation(request, response, blockLocal, operation);
	response.incrementAndCheckOperationsExecuted(request.moduleContext.operationRunawayMax);
};


/**
 * Calls the conditional block on a operation, returning the result as a .
 * @param request (TRequest) the request object.
 * @param response (TResponse) the response object.
 * @param blockLocal (Object) the local variables on the block call.
 * @param operation (Object) the operation object.
 * @return true if result is equivalent to true, false if not.
 * @throws TAMEInterrupt if an interrupt occurs. 
 */
TLogic.callConditional = function(operationName, request, response, blockLocal, operation)
{
	// block should contain arithmetic operations and a last push.
	let conditional = operation.conditionalBlock;
	if (!conditional)
		throw TAMEError.ModuleExecution("Conditional block for "+operationName+" does NOT EXIST!");
	
	response.trace(request, TAMEConstants.TraceType.CONTROL, operationName+" Conditional");
	TLogic.executeBlock(conditional, request, response, blockLocal);

	// get remaining expression value.
	let value = request.popValue();
	
	if (!TValue.isLiteral(value))
		throw TAMEError.UnexpectedValueType("Expected literal type after "+operationName+" conditional block execution.");

	let result = TValue.asBoolean(value);
	response.trace(request, TAMEConstants.TraceType.CONTROL, Util.format(operationName+" Conditional {0} is {1}", TValue.toString(value), result));
	return result;
};


/**
 * Enqueues an action based on how it is interpreted.
 * @param request the request object.
 * @param response the response object.
 * @param interpreterContext the interpreter context (left after interpretation).
 * @return true if interpret was good and an action was enqueued, false if error.
 * @throws TAMEInterrupt if an uncaught interrupt occurs.
 * @throws TAMEError if something goes wrong during execution.
 */
TLogic.enqueueInterpretedAction = function(request, response, interpreterContext) 
{
	var action = interpreterContext.action;
	if (action === null)
	{
		response.trace(request, TAMEConstants.TraceType.INTERPRETER, "UNKNOWN ACTION");
		if (!TLogic.callUnknownCommand(request, response))
			response.addCue(TAMEConstants.Cue.ERROR, "UNKNOWN COMMAND (make a better in-universe handler!).");
		return false;
	}
	else
	{
		switch (action.type)
		{
			default:
			case TAMEConstants.ActionType.GENERAL:
			{
				if (action.strict && interpreterContext.tokenOffset < interpreterContext.tokens.length)
				{
					response.trace(request, TAMEConstants.TraceType.INTERPRETER, Util.format("STRICT GENERAL ACTION {0}: Extra Tokens (MALFORMED)", action.identity));
					if (!TLogic.callMalformedCommand(request, response, action))
						response.addCue(TAMEConstants.Cue.ERROR, "MALFORMED COMMAND (make a better in-universe handler!).");
					return false;
				}
				else
				{
					let command = TCommand.create(action);
					request.addCommand(command);
					response.trace(request, TAMEConstants.TraceType.CONTROL, "Enqueue command "+command.toString());
					return true;
				}
				break;
			}

			case TAMEConstants.ActionType.OPEN:
			{
				if (!interpreterContext.targetLookedUp)
				{
					response.trace(request, TAMEConstants.TraceType.INTERPRETER, Util.format("OPEN ACTION {0}: No Target (INCOMPLETE)", action.identity));
					if (!TLogic.callIncompleteCommand(request, response, action))
						response.addCue(TAMEConstants.Cue.ERROR, "INCOMPLETE COMMAND (make a better in-universe handler!).");
					return false;
				}
				else
				{
					let command = TCommand.createModal(action, interpreterContext.target);
					request.addCommand(command);
					response.trace(request, TAMEConstants.TraceType.CONTROL, "Enqueue command "+command.toString());
					return true;
				}
				break;
			}

			case TAMEConstants.ActionType.MODAL:
			{
				if (!interpreterContext.modeLookedUp)
				{
					response.trace(request, TAMEConstants.TraceType.INTERPRETER, Util.format("MODAL ACTION {0}: No Mode (INCOMPLETE)", action.identity));
					if (!TLogic.callIncompleteCommand(request, response, action))
						response.addCue(TAMEConstants.Cue.ERROR, "INCOMPLETE COMMAND (make a better in-universe handler!).");
					return false;
				}
				else if (interpreterContext.mode === null)
				{
					response.trace(request, TAMEConstants.TraceType.INTERPRETER, Util.format("MODAL ACTION {0}: Unknown Mode (MALFORMED)", action.identity));
					if (!TLogic.callMalformedCommand(request, response, action))
						response.addCue(TAMEConstants.Cue.ERROR, "MALFORMED COMMAND (make a better in-universe handler!).");
					return false;
				}
				else if (action.strict && interpreterContext.tokenOffset < interpreterContext.tokens.length)
				{
					response.trace(request, TAMEConstants.TraceType.INTERPRETER, Util.format("STRICT MODAL ACTION {0}: Extra Tokens (MALFORMED)", action.identity));
					if (!TLogic.callMalformedCommand(request, response, action))
						response.addCue(TAMEConstants.Cue.ERROR, "MALFORMED COMMAND (make a better in-universe handler!).");
					return false;
				}
				else
				{
					let command = TCommand.createModal(action, interpreterContext.mode);
					request.addCommand(command);
					response.trace(request, TAMEConstants.TraceType.CONTROL, "Enqueue command "+command.toString());
					return true;
				}
				break;
			}

			case TAMEConstants.ActionType.TRANSITIVE:
			{
				if (interpreterContext.objectAmbiguous)
				{
					response.trace(request, TAMEConstants.TraceType.INTERPRETER, Util.format("TRANSITIVE ACTION {0} (AMBIGUOUS)", action.identity));
					if (!TLogic.callAmbiguousCommand(request, response, action))
						response.addCue(TAMEConstants.Cue.ERROR, "AMBIGUOUS COMMAND (make a better in-universe handler!).");
					return false;
				}
				else if (!interpreterContext.object1LookedUp)
				{
					response.trace(request, TAMEConstants.TraceType.INTERPRETER, Util.format("TRANSITIVE ACTION {0}: No Object (INCOMPLETE)", action.identity));
					if (!TLogic.callIncompleteCommand(request, response, action))
						response.addCue(TAMEConstants.Cue.ERROR, "INCOMPLETE COMMAND (make a better in-universe handler!).");
					return false;
				}
				else if (interpreterContext.object1 === null)
				{
					response.trace(request, TAMEConstants.TraceType.INTERPRETER, Util.format("TRANSITIVE ACTION {0}: Unknown Object (MALFORMED)", action.identity));
					if (!TLogic.callMalformedCommand(request, response, action))
						response.addCue(TAMEConstants.Cue.ERROR, "MALFORMED COMMAND (make a better in-universe handler!).");
					return false;
				}
				else if (action.strict && interpreterContext.tokenOffset < interpreterContext.tokens.length)
				{
					response.trace(request, TAMEConstants.TraceType.INTERPRETER, Util.format("STRICT TRANSITIVE ACTION {0}: Extra Tokens (MALFORMED)", action.identity));
					if (!TLogic.callMalformedCommand(request, response, action))
						response.addCue(TAMEConstants.Cue.ERROR, "MALFORMED COMMAND (make a better in-universe handler!).");
					return false;
				}
				else
				{
					let command = TCommand.createObject(action, interpreterContext.object1);
					request.addCommand(command);
					response.trace(request, TAMEConstants.TraceType.CONTROL, "Enqueue command "+command.toString());
					return true;
				}
				break;
			}
	
			case TAMEConstants.ActionType.DITRANSITIVE:
			{
				if (interpreterContext.objectAmbiguous)
				{
					response.trace(request, TAMEConstants.TraceType.INTERPRETER, Util.format("DITRANSITIVE ACTION {0} (AMBIGUOUS)", action.identity));
					if (!TLogic.callAmbiguousCommand(request, response, action))
						response.addCue(TAMEConstants.Cue.ERROR, "AMBIGUOUS COMMAND (make a better in-universe handler!).");
					return false;
				}
				else if (!interpreterContext.object1LookedUp)
				{
					response.trace(request, TAMEConstants.TraceType.INTERPRETER, Util.format("DITRANSITIVE ACTION {0}: No First Object (INCOMPLETE)", action.identity));
					if (!TLogic.callIncompleteCommand(request, response, action))
						response.addCue(TAMEConstants.Cue.ERROR, "INCOMPLETE COMMAND (make a better in-universe handler!).");
					return false;
				}
				else if (interpreterContext.object1 === null)
				{
					response.trace(request, TAMEConstants.TraceType.INTERPRETER, Util.format("DITRANSITIVE ACTION {0}: Unknown First Object (MALFORMED)", action.identity));
					if (!TLogic.callMalformedCommand(request, response, action))
						response.addCue(TAMEConstants.Cue.ERROR, "MALFORMED COMMAND (make a better in-universe handler!).");
					return false;
				}
				else if (!interpreterContext.conjugateLookedUp)
				{
					if (action.strict)
					{
						response.trace(request, TAMEConstants.TraceType.INTERPRETER, Util.format("STRICT DITRANSITIVE ACTION {0}: No Conjunction (INCOMPLETE)", action.identity));
						if (!TLogic.callIncompleteCommand(request, response, action))
							response.addCue(TAMEConstants.Cue.ERROR, "INCOMPLETE COMMAND (make a better in-universe handler!).");
						return false;
					}
					else
					{
						response.trace(request, TAMEConstants.TraceType.INTERPRETER, Util.format("DITRANSITIVE ACTION {0}: No Conjunction, Process TRANSITIVE", action.identity));
						let command = TCommand.createObject(action, interpreterContext.object1);
						request.addCommand(command);
						response.trace(request, TAMEConstants.TraceType.CONTROL, "Enqueue command "+command.toString());
						return true;
					}
				}
				else if (!interpreterContext.conjugateFound)
				{
					response.trace(request, TAMEConstants.TraceType.INTERPRETER, Util.format("DITRANSITIVE ACTION {0}: Unknown Conjunction (MALFORMED)", action.identity));
					if (!TLogic.callMalformedCommand(request, response, action))
						response.addCue(TAMEConstants.Cue.ERROR, "MALFORMED COMMAND (make a better in-universe handler!).");
					return false;
				}
				else if (!interpreterContext.object2LookedUp)
				{
					response.trace(request, TAMEConstants.TraceType.INTERPRETER, Util.format("DITRANSITIVE ACTION {0}: No Second Object (INCOMPLETE)", action.identity));
					if (!TLogic.callIncompleteCommand(request, response, action))
						response.addCue(TAMEConstants.Cue.ERROR, "INCOMPLETE COMMAND (make a better in-universe handler!).");
					return false;
				}
				else if (interpreterContext.object2 === null)
				{
					response.trace(request, TAMEConstants.TraceType.INTERPRETER, Util.format("DITRANSITIVE ACTION {0}: Unknown Second Object (MALFORMED)", action.identity));
					if (!TLogic.callMalformedCommand(request, response, action))
						response.addCue(TAMEConstants.Cue.ERROR, "MALFORMED COMMAND (make a better in-universe handler!).");
					return false;
				}
				else if (action.strict && interpreterContext.tokenOffset < interpreterContext.tokens.length)
				{
					response.trace(request, TAMEConstants.TraceType.INTERPRETER, Util.format("STRICT DITRANSITIVE ACTION {0}: Extra Tokens (MALFORMED)", action.identity));
					if (!TLogic.callMalformedCommand(request, response, action))
						response.addCue(TAMEConstants.Cue.ERROR, "MALFORMED COMMAND (make a better in-universe handler!).");
					return false;
				}
				else
				{
					let command = TCommand.createObject2(action, interpreterContext.object1, interpreterContext.object2);
					request.addCommand(command);
					response.trace(request, TAMEConstants.TraceType.CONTROL, "Enqueue command "+command.toString());
					return true;
				}
			}
		}
	}
};

/**
 * Does an action loop: this keeps processing queued actions 
 * until there is nothing left to process.
 * @param request the request context.
 * @param response the response object.
 * @param tameCommand (TCommand) the action to process.
 * @throws TAMEInterrupt if an uncaught interrupt occurs.
 * @throws TAMEError if something goes wrong during execution.
 */
TLogic.processCommand = function(request, response, tameCommand) 
{
	try {
		
		switch (tameCommand.action.type)
		{
			default:
			case TAMEConstants.ActionType.GENERAL:
				TLogic.doActionGeneral(request, response, tameCommand.action);
				break;
			case TAMEConstants.ActionType.OPEN:
				TLogic.doActionOpen(request, response, tameCommand.action, tameCommand.target);
				break;
			case TAMEConstants.ActionType.MODAL:
				TLogic.doActionModal(request, response, tameCommand.action, tameCommand.target);
				break;
			case TAMEConstants.ActionType.TRANSITIVE:
				TLogic.doActionTransitive(request, response, tameCommand.action, tameCommand.object1);
				break;
			case TAMEConstants.ActionType.DITRANSITIVE:
				if (tameCommand.object2 === null)
					TLogic.doActionTransitive(request, response, tameCommand.action, tameCommand.object1);
				else
					TLogic.doActionDitransitive(request, response, tameCommand.action, tameCommand.object1, tameCommand.object2);
				break;
		}
		
	} catch (err) {
		// catch finish interrupt, throw everything else.
		if (!(err instanceof TAMEInterrupt) || err.type != TAMEInterrupt.Type.Finish)
			throw err;
	} 
	
	request.checkStackClear();
	
};

/**
 * Does an action loop: this keeps processing queued actions until there is nothing left to process.
 * @param request the request object.
 * @param response the response object.
 * @throws TAMEInterrupt if an uncaught interrupt occurs.
 * @throws TAMEError if something goes wrong during execution.
 */
TLogic.doAllCommands = function(request, response) 
{
	while (request.hasCommands())
		TLogic.processCommand(request, response, request.nextCommand());
};

/**
 * Does a command loop: this keeps processing queued commands 
 * until there is nothing left to process.
 * @param request the request object.
 * @param response the response object.
 * @param afterSuccessfulCommand if true, executes the "after successful command" block.
 * @param afterFailedCommand if true, executes the "after failed command" block.
 * @param afterEveryCommand if true, executes the "after every command" block.
 * @throws TAMEInterrupt if an uncaught interrupt occurs.
 * @throws TAMEError if something goes wrong during execution.
 */
TLogic.processCommandLoop = function(request, response, afterSuccessfulCommand, afterFailedCommand, afterEveryCommand) 
{
	TLogic.doAllCommands(request, response);
	let worldContext = request.moduleContext.getElementContext('world');
	if (afterSuccessfulCommand)
	{
		TLogic.callElementBlock(request, response, worldContext, "AFTERSUCCESSFULCOMMAND");
		TLogic.doAllCommands(request, response);
	}
	if (afterFailedCommand)
	{
		TLogic.callElementBlock(request, response, worldContext, "AFTERFAILEDCOMMAND");
		TLogic.doAllCommands(request, response);
	}
	if (afterEveryCommand)
	{
		TLogic.callElementBlock(request, response, worldContext, "AFTEREVERYCOMMAND");
		TLogic.doAllCommands(request, response);
	}		
	
};

/**
 * Creates a set of tracing types from a "traceTypes" parameter from
 * handleInit or handleRequest.
 * @param traceTypes 
 * 		(boolean) if true, add all trace types, false for none.
 * 		(Array) list of tracing types (case-insensitive).
 * 		(Object) map of tracing types (case-insensitive).
 * @return the map/set of unique trace types.
 */
TLogic.createTracingMap = function(traceTypes)
{
	let tracing = {};
	
	// check for boolean.
	if (traceTypes === true)
	{
		tracing = TAMEConstants.TraceType.ALL;
	}
	// check for array.
	else if (Util.isArray(traceTypes))
	{
		tracing = {};
		for (let i = 0; i < traceTypes.length; i++)
			tracing[traceTypes[i].toString().toLowerCase()] = true;
	}
	// check for array.
	else if (Util.isObject(traceTypes))
	{
		tracing = {};
		Util.each(traceTypes, function(value, key){
			let uk = key.toLowerCase();
			tracing[uk] = true;
		});
	}
	
	return tracing;
};

/**
 * Tokenizes the input string into tokens based on module settings.
 * @param context (object) the module context to use (for object availability).
 * @param inputMessage (string) the input message to tokenize.
 * @return (string[]) the tokens to parse.
 */
TLogic.tokenizeInput = function(context, input)
{
	return input.trim().toLowerCase().split(/\s+/);
};

/**
 * Handles initializing a context. Must be called after a new context and game is started.
 * @param context the module context.
 * @param traceTypes 
 * 		(boolean) if true, add all trace types, false for none.
 * 		(Array) list of tracing types (case-insensitive).
 * 		(Object) map of tracing types (case-insensitive).
 * @return (TResponse) the response from the initialize.
 */
TLogic.handleInit = function(context, traceTypes) 
{
	let tracing = TLogic.createTracingMap(traceTypes);
	let request = new TRequest(context, "[INITIALIZE]", tracing);
	let response = new TResponse();
	
	response.interpretNanos = 0;
	let time = Util.nanoTime();

	try 
	{
		TLogic.initializeContext(request, response);
		TLogic.processCommandLoop(request, response, false, false, false);
	} 
	catch (err) 
	{
		if (err instanceof TAMEInterrupt)
		{
			if (err.type != TAMEInterrupt.Type.Quit)
				response.addCue(TAMEConstants.Cue.ERROR, err.type+" interrupt was thrown.");
		}
		else if (err instanceof TAMEError)
			response.addCue(TAMEConstants.Cue.FATAL, err.message);
		else
			response.addCue(TAMEConstants.Cue.FATAL, err);
	}

	response.requestNanos = Util.nanoTime() - time;
	return response;
};


/**
 * Handles interpretation and performs actions.
 * @param context (object) the module context.
 * @param inputMessage (string) the input message to interpret.
 * @param traceTypes 
 * 		(boolean) if true, add all trace types, false for none.
 * 		(Array) list of tracing types (case-insensitive).
 * 		(Object) map of tracing types (case-insensitive).
 * @return (TResponse) the response.
 */
TLogic.handleRequest = function(context, inputMessage, traceTypes)
{
	let tracing = TLogic.createTracingMap(traceTypes);
	let request = new TRequest(context, inputMessage, tracing);
	let response = new TResponse();

	let time = Util.nanoTime();
	let interpreterContext = TLogic.interpret(request, response);
	response.interpretNanos = Util.nanoTime() - time; 

	time = Util.nanoTime();
	
	try 
	{
		let good = TLogic.enqueueInterpretedAction(request, response, interpreterContext);
		TLogic.processCommandLoop(request, response, good, !good, true);
	} 
	catch (err) 
	{
		if (err instanceof TAMEInterrupt)
		{
			if (err.type != TAMEInterrupt.Type.Quit)
				response.addCue(TAMEConstants.Cue.ERROR, err.type+" interrupt was thrown.");
		}
		else if (err instanceof TAMEError)
			response.addCue(TAMEConstants.Cue.FATAL, err.message);
		else
			response.addCue(TAMEConstants.Cue.FATAL, err);
	}
	
	response.requestNanos = Util.nanoTime() - time;
	return response;
};

/**
 * Inspects an element or element's value.
 * @param context (object) the module context.
 * @param elementIdentity (string) the identity of a non-archetype element.
 * @param variable (string) [OPTIONAL] the name of the variable to inspect. 
 * @return (Object) the queried identifiers and values as debug strings. 
 */
TLogic.inspect = function(context, elementIdentity, variable)
{
	let out = {};
	let element = context.getElementContext(elementIdentity);
	if (element)
	{
		if (!variable)
		{
			Util.each(element.variables, (value, key) => {
				out[element.identity+'.'+key] = TValue.toString(value);
			});
		}
		else
		{
			out[element.identity+'.'+variable] = TValue.toString(TLogic.getValue(element.variables, variable));
		}
	}
	else
		return null;
	return out;
};

/**
 * Performs the necessary tasks for calling an object block.
 * Ensures that the block is called cleanly.
 * @param request (TRequest) the request object.
 * @param response (TResponse) the response object.
 * @param elementContext (object) the context that the block is executed through.
 * @param block [Object, ...] the block to execute.
 * @param isFunctionBlock (boolean) if true, this is a function call (changes some logic).
 * @param blockLocal (object) the initial block-local values to set on invoke.
 * @throws TAMEInterrupt if an interrupt occurs.
 */
TLogic.callBlock = function(request, response, elementContext, block, isFunctionBlock, blockLocal)
{
	response.trace(request, TAMEConstants.TraceType.CONTEXT, Util.format("PUSH {0}", "Context:"+elementContext.identity));
	request.pushContext(elementContext);
	
	if (!blockLocal)
		blockLocal = {};
	
	try {
		TLogic.executeBlock(block, request, response, blockLocal);
	} catch (err) {
		// catch end interrupt, throw everything else.
		if (!(err instanceof TAMEInterrupt) || err.type != TAMEInterrupt.Type.End)
			throw err;
	} finally {
		response.trace(request, TAMEConstants.TraceType.CONTEXT, Util.format("POP {0}", "Context:"+elementContext.identity));
		request.popContext();
	}
	
	if (!isFunctionBlock)
		request.checkStackClear();
	
};

/**
 * Increments the runaway operation counter and calls the operation.  
 * @param request (TRequest) the request object.
 * @param response (TResponse) the response object.
 * @param elementContext (Object) the element context to search from.
 * @param blockTypeName (string) the name of the block type.
 * @param blockTypeValues (Array) list of values.
 * @param localname (string) [OPTIONAL] the name of the local variable to set.
 * @param targetValue (string) [OPTIONAL] the value to assign.
 * @return true if a block was called, false if not.
 * @throws TAMEInterrupt if an interrupt occurs. 
 */
TLogic.callElementBlock = function(request, response, elementContext, blockTypeName, blockTypeValues, localname, targetValue)
{
	let context = request.moduleContext;
	let blockEntryName = context.resolveBlockName(blockTypeName, blockTypeValues);
	response.trace(request, TAMEConstants.TraceType.ENTRY, Util.format("RESOLVE {0}.{1}", elementContext.identity, blockEntryName));
	let block = context.resolveBlock(elementContext.identity, blockTypeName, blockTypeValues);
	if (block !== null)
	{
		response.trace(request, TAMEConstants.TraceType.ENTRY, Util.format("CALL {0}.{1}", elementContext.identity, blockEntryName));

		if (targetValue && localname)
		{
			// wrap value
			targetValue = TValue.createString(targetValue);
			
			// set locals
			let blockLocal = {};
			response.trace(request, TAMEConstants.TraceType.VALUE, Util.format("SET LOCAL {0} {1}", localname, TValue.toString(targetValue)));
			TLogic.setValue(blockLocal, localname, targetValue);
			TLogic.callBlock(request, response, elementContext, block, false, blockLocal);
		}
		else
			TLogic.callBlock(request, response, elementContext, block);
		return true;
	}
	
	return false;
};

/**
 * Calls a function from an arbitrary context, using the bound element as a lineage search point.
 * @param request the request object.
 * @param response the response object.
 * @param functionName the function to execute.
 * @param originContext the origin context (and then element).
 * @throws TAMEInterrupt if an interrupt occurs.
 * @return the return value from the function call. if no return, returns false.
 */
TLogic.callElementFunction = function(request, response, functionName, originContext)
{
	var context = request.moduleContext;
	var element = context.resolveElement(originContext.identity);

	var entry = context.resolveFunction(originContext.identity, functionName);
	if (entry === null)
		throw TAMEError.Module("No such function ("+functionName+") in lineage of element " + TLogic.elementToString(element));

	response.trace(request, TAMEConstants.TraceType.FUNCTION, "CALL "+functionName);
	var blockLocal = {};
	var args = entry.arguments;
	for (var i = args.length - 1; i >= 0; i--)
	{
		var localValue = request.popValue();
		response.trace(request, TAMEConstants.TraceType.FUNCTION, Util.format("SET LOCAL {0} {1}", args[i], TValue.toString(localValue)));
		blockLocal[args[i]] = localValue;
	}
	
	response.incrementAndCheckFunctionDepth(request.moduleContext.functionDepthMax);
	TLogic.callBlock(request, response, originContext, entry.block, true, blockLocal);
	response.decrementFunctionDepth();

	return TLogic.getValue(blockLocal, TAMEConstants.RETURN_VARIABLE);
};


/**
 * Interprets the input on the request.
 * @param request (TRequest) the request object.
 * @param response (TResponse) the response object.
 * @return a new interpreter context using the input.
 */
TLogic.interpret = function(request, response)
{
	let context = request.moduleContext;
	let tokens = TLogic.tokenizeInput(context, request.inputMessage);
	
	var interpreterContext = 
	{
		"tokens": tokens,
		"tokenOffset": 0,
		"objects": [null, null],
		"action": null,
		"modeLookedUp": false,
		"mode": null,
		"targetLookedUp": false,
		"target": null,
		"conjugateLookedUp": false,
		"conjugate": null,
		"object1LookedUp": false,
		"object1": null,
		"object2LookedUp": false,
		"object2": null,
		"objectAmbiguous": false
	};

	TLogic.interpretAction(request, response, interpreterContext);

	let action = interpreterContext.action;
	if (action === null)
		return interpreterContext;

	switch (action.type)
	{
		default:
		case TAMEConstants.ActionType.GENERAL:
			return interpreterContext;
		case TAMEConstants.ActionType.OPEN:
			TLogic.interpretOpen(request, response, interpreterContext);
			return interpreterContext;
		case TAMEConstants.ActionType.MODAL:
			TLogic.interpretMode(request, response, action, interpreterContext);
			return interpreterContext;
		case TAMEConstants.ActionType.TRANSITIVE:
			TLogic.interpretObject1(request, response, interpreterContext);
			return interpreterContext;
		case TAMEConstants.ActionType.DITRANSITIVE:
			if (TLogic.interpretObject1(request, response, interpreterContext))
				if (TLogic.interpretConjugate(request, response, action, interpreterContext))
					TLogic.interpretObject2(request, response, interpreterContext);
			return interpreterContext;
	}
	
};

/**
 * Interprets an action from the input line.
 * @param moduleContext (TModuleContext) the module context.
 * @param interpreterContext (Object) the interpreter context.
 */
TLogic.interpretAction = function(request, response, interpreterContext)
{
	let moduleContext = request.moduleContext;
	var module = moduleContext.module;
	var sb = new TStringBuilder();
	var index = interpreterContext.tokenOffset;
	var tokens = interpreterContext.tokens;

	while (index < tokens.length)
	{
		if (sb.length() > 0)
			sb.append(' ');
		sb.append(tokens[index]);
		index++;

		let name = sb.toString();
		response.trace(request, TAMEConstants.TraceType.INTERPRETER, "TEST ACTION "+name);
		var next = module.getActionByName(name);
		if (next !== null)
		{
			response.trace(request, TAMEConstants.TraceType.INTERPRETER, "MATCHED ACTION "+next.identity);
			interpreterContext.action = next;
			interpreterContext.tokenOffset = index;
		}
	
	}
	
};

/**
 * Interprets an action mode from the input line.
 * @param action (object:action) the action to use.
 * @param interpreterContext (Object) the interpreter context.
 */
TLogic.interpretMode = function(request, response, action, interpreterContext)
{
	var sb = new TStringBuilder();
	var index = interpreterContext.tokenOffset;
	var tokens = interpreterContext.tokens;

	while (index < tokens.length)
	{
		if (sb.length() > 0)
			sb.append(' ');
		sb.append(tokens[index]);
		index++;

		interpreterContext.modeLookedUp = true;
		var next = sb.toString();
		response.trace(request, TAMEConstants.TraceType.INTERPRETER, "TEST MODE "+next);
		if (action.extraStrings.indexOf(next) >= 0)
		{
			response.trace(request, TAMEConstants.TraceType.INTERPRETER, "MATCHED MODE "+next);
			interpreterContext.mode = next;
			interpreterContext.tokenOffset = index;
		}
		
	}
	
};

/**
 * Interprets open target.
 * @param interpreterContext (Object) the interpreter context.
 */
TLogic.interpretOpen = function(request, response, interpreterContext)
{
	var sb = new TStringBuilder();
	var index = interpreterContext.tokenOffset;
	var tokens = interpreterContext.tokens;
	
	while (index < tokens.length)
	{
		interpreterContext.targetLookedUp = true;
		if (sb.length() > 0)
			sb.append(' ');
		sb.append(tokens[index]);
		index++;
	}
	
	var out = sb.toString();
	response.trace(request, TAMEConstants.TraceType.INTERPRETER, "READ OPEN TARGET "+out);
	interpreterContext.target = out.length > 0 ? out : null;
	interpreterContext.tokenOffset = index;
};

/**
 * Interprets an action conjugate from the input line (like "with" or "on" or whatever).
 * @param action the action to use.
 * @param interpreterContext (Object) the interpreter context.
 */
TLogic.interpretConjugate = function(request, response, action, interpreterContext)
{
	var sb = new TStringBuilder();
	var index = interpreterContext.tokenOffset;
	var tokens = interpreterContext.tokens;
	var out = false;

	while (index < tokens.length)
	{
		if (sb.length() > 0)
			sb.append(' ');
		sb.append(tokens[index]);
		index++;
		
		interpreterContext.conjugateLookedUp = true;
		let name = sb.toString();
		response.trace(request, TAMEConstants.TraceType.INTERPRETER, "TEST CONJUNCTION "+name);
		if (action.extraStrings.indexOf(name) >= 0)
		{
			response.trace(request, TAMEConstants.TraceType.INTERPRETER, "MATCHED CONJUNCTION "+name);
			interpreterContext.tokenOffset = index;
			out = true;
		}
		
	}

	interpreterContext.conjugateFound = out;
	return out;
};

/**
 * Interprets the first object from the input line.
 * This is context-sensitive, as its priority is to match objects on the current
 * player's person, as well as in the current room. These checks are skipped if
 * the player is null, or the current room is null.
 * The priority order is player inventory, then room contents, then world.
 * @param moduleContext (TModuleContext) the module context.
 * @param interpreterContext (Object) the interpreter context.
 */
TLogic.interpretObject1 = function(request, response, interpreterContext)
{
	let moduleContext = request.moduleContext;
	var sb = new TStringBuilder();
	var index = interpreterContext.tokenOffset;
	var tokens = interpreterContext.tokens;

	while (index < tokens.length)
	{
		if (sb.length() > 0)
			sb.append(' ');
		sb.append(tokens[index]);
		index++;
		
		let name = sb.toString();
		interpreterContext.object1LookedUp = true;
		response.trace(request, TAMEConstants.TraceType.INTERPRETER, "TEST OBJECT 1 "+name);
		let out = moduleContext.getAccessibleObjectsByName(name, interpreterContext.objects, 0);
		if (out > 1)
		{
			response.trace(request, TAMEConstants.TraceType.INTERPRETER, "MATCHED MULTIPLE OBJECTS");
			interpreterContext.objectAmbiguous = true;
			interpreterContext.object1 = null;
			interpreterContext.tokenOffset = index;
		}
		else if (out > 0)
		{
			response.trace(request, TAMEConstants.TraceType.INTERPRETER, "MATCHED OBJECT 1 "+interpreterContext.objects[0].identity);
			interpreterContext.objectAmbiguous = false;
			interpreterContext.object1 = interpreterContext.objects[0];
			interpreterContext.tokenOffset = index;
		}
	}
		
	return interpreterContext.object1 !== null;
};

/**
 * Interprets the second object from the input line.
 * This is context-sensitive, as its priority is to match objects on the current
 * player's person, as well as in the current room. These checks are skipped if
 * the player is null, or the current room is null.
 * The priority order is player inventory, then room contents, then world.
 * @param moduleContext the module context.
 * @param interpreterContext the TAMEInterpreterContext.
 */
TLogic.interpretObject2 = function(request, response, interpreterContext)
{
	let moduleContext = request.moduleContext;
	var sb = new TStringBuilder();
	var index = interpreterContext.tokenOffset;
	var tokens = interpreterContext.tokens;

	while (index < tokens.length)
	{
		if (sb.length() > 0)
			sb.append(' ');
		sb.append(tokens[index]);
		index++;
		
		let name = sb.toString();
		interpreterContext.object2LookedUp = true;
		response.trace(request, TAMEConstants.TraceType.INTERPRETER, "TEST OBJECT 2 "+name);
		let out = moduleContext.getAccessibleObjectsByName(name, interpreterContext.objects, 0);
		if (out > 1)
		{
			response.trace(request, TAMEConstants.TraceType.INTERPRETER, "MATCHED MULTIPLE OBJECTS");
			interpreterContext.objectAmbiguous = true;
			interpreterContext.object2 = null;
			interpreterContext.tokenOffset = index;
		}
		else if (out > 0)
		{
			response.trace(request, TAMEConstants.TraceType.INTERPRETER, "MATCHED OBJECT 2 "+interpreterContext.objects[0].identity);
			interpreterContext.objectAmbiguous = false;
			interpreterContext.object2 = interpreterContext.objects[0];
			interpreterContext.tokenOffset = index;
		}
	}
		
	return interpreterContext.object2 !== null;
};

/**
 * Checks if an object is accessible to a player.
 * @param request the request object.
 * @param response the response object.
 * @param playerIdentity the player viewpoint identity.
 * @param objectIdentity the object to check's identity.
 * @return true if the object is considered "accessible," false if not.
 */
TLogic.checkObjectAccessibility = function(request, response, playerIdentity, objectIdentity) 
{
	let context = request.moduleContext;
	let world = context.getElement('world');

	if (context.checkElementHasObject(world.identity, objectIdentity))
		return true;

	if (context.checkElementHasObject(playerIdentity, objectIdentity))
		return true;

	let currentRoom = context.getCurrentRoom(playerIdentity);
	if (currentRoom !== null && context.checkElementHasObject(currentRoom.identity, objectIdentity))
		return true;
	
	return false;
};


/**
 * Performs an arithmetic function on the stack.
 * @param request the request context.
 * @param response the response object.
 * @param functionType the function type (index).
 * @throws TAMEInterrupt if an interrupt occurs.
 */
TLogic.doArithmeticStackFunction = function(request, response, functionType)
{
	if (functionType < 0 || functionType >= TArithmeticFunctions.COUNT)
		throw TAMEError.ModuleExecution("Expected arithmetic function type, got illegal value "+functionType+".");
	
	var operator = TArithmeticFunctions[functionType];
	response.trace(request, TAMEConstants.TraceType.INTERNAL, "Operator is " + operator.name);
	
	if (operator.binary)
	{
		let v2 = request.popValue();
		let v1 = request.popValue();
		request.pushValue(operator.doOperation(v1, v2));
	}
	else
	{
		let v1 = request.popValue();
		request.pushValue(operator.doOperation(v1));
	}
};

/**
 * Attempts to perform a player switch.
 * @param request the request object.
 * @param response the response object.
 * @param playerIdentity the next player identity.
 * @throws TAMEInterrupt if an interrupt occurs.
 */
TLogic.doPlayerSwitch = function(request, response, playerIdentity)
{
	var context = request.moduleContext;
	context.setCurrentPlayer(playerIdentity);
	response.trace(request, TAMEConstants.TraceType.CONTEXT, "CURRENT PLAYER: "+playerIdentity);
};

/**
 * Attempts to perform a room stack pop for a player.
 * @param request the request object.
 * @param response the response object.
 * @param playerIdentity the player identity to pop a room context from.
 * @throws TAMEInterrupt if an interrupt occurs.
 */
TLogic.doRoomPop = function(request, response, playerIdentity)
{
	var context = request.moduleContext;
	let roomIdentity = context.popRoomFromPlayer(playerIdentity);
	if (roomIdentity)
		response.trace(request, TAMEConstants.TraceType.CONTEXT, Util.format("POP ROOM {0} FROM PLAYER {1}", roomIdentity, playerIdentity));
};

/**
 * Attempts to perform a room stack push for a player.
 * @param request the request object.
 * @param response the response object.
 * @param playerIdentity the player identity to push a room context onto.
 * @param roomIdentity the room identity to push.
 * @throws TAMEInterrupt if an interrupt occurs.
 */
TLogic.doRoomPush = function(request, response, playerIdentity, roomIdentity)
{
	var context = request.moduleContext;
	context.pushRoomOntoPlayer(playerIdentity, roomIdentity);
	response.trace(request, TAMEConstants.TraceType.CONTEXT, Util.format("PUSH ROOM {0} ON PLAYER {1}", roomIdentity, playerIdentity));
};

/**
 * Attempts to perform a room switch.
 * @param request the request object.
 * @param response the response object.
 * @param playerIdentity the player identity that is switching rooms.
 * @param roomIdentity the target room identity.
 * @throws TAMEInterrupt if an interrupt occurs.
 */
TLogic.doRoomSwitch = function(request, response, playerIdentity, roomIdentity)
{
	var context = request.moduleContext;

	// pop all rooms on the stack.
	while (context.getCurrentRoom(playerIdentity) !== null)
		TLogic.doRoomPop(request, response, playerIdentity);

	// push new room on the stack and call focus.
	TLogic.doRoomPush(request, response, playerIdentity, roomIdentity);
};

/**
 * @param request (TRequest) the request object.
 * @param response (TResponse) the response object.
 * @param element (Object) the element being browsed.
 * @param objectContext (Object) the object context to call a browse block on.
 * @throws TAMEInterrupt if an interrupt occurs.
 */
TLogic.doBrowseBlockSearch = function(request, response, element, objectContext)
{
	var context = request.moduleContext;

	// special case for world - no hierarchy.
	if (element.tameType === 'TWorld')
		return TLogic.callElementBlock(request, response, objectContext, "ONWORLDBROWSE");

	var next = element;
	while (next !== null)
	{
		let blockEntryName;
		let blockEntryValues;
		
		// aspect search.
		if (next.tameType === 'TContainer')
		{
			blockEntryName = "ONELEMENTBROWSE";
			blockEntryValues = [TValue.createContainer(next.identity)];
		}
		else if (next.tameType === 'TRoom')
		{
			blockEntryName = "ONELEMENTBROWSE"; 
			blockEntryValues = [TValue.createRoom(next.identity)];
		}
		else if (next.tameType === 'TPlayer')
		{
			blockEntryName = "ONELEMENTBROWSE";
			blockEntryValues = [TValue.createPlayer(next.identity)];
		}
		else
			throw TAMEError.UnexpectedValueType("Bad object container type in hierarchy.");

		if (TLogic.callElementBlock(request, response, objectContext, blockEntryName, blockEntryValues))
			return true;
		
		next = next.parent ? context.getElement(next.parent) : null;
	}
	
	// base fallback.
	if (element.tameType === 'TContainer')
		return TLogic.callElementBlock(request, response, objectContext, "ONCONTAINERBROWSE");
	else if (element.tameType === 'TRoom')
		return TLogic.callElementBlock(request, response, objectContext, "ONROOMBROWSE");
	else if (element.tameType === 'TPlayer')
		return TLogic.callElementBlock(request, response, objectContext, "ONPLAYERBROWSE");
	else
		throw TAMEError.UnexpectedValueType("Bad object container type in hierarchy.");
};


/**
 * Attempts to perform a browse.
 * @param request the request object.
 * @param response the response object.
 * @param blockEntryTypeName the block entry type name.
 * @param elementIdentity the element identity to browse through.
 * @param tag the tag to filter by.
 * @throws TAMEInterrupt if an interrupt occurs.
 */
TLogic.doBrowse = function(request, response, elementIdentity, tag)
{
	var context = request.moduleContext;
	var element = context.resolveElement(elementIdentity);

	Util.each(context.getObjectsOwnedByElement(element.identity), function(objectIdentity)
	{
		var objectContext = context.getElementContext(objectIdentity);
		
		if (tag && !context.checkObjectHasTag(objectIdentity, tag))
			return;
		
		TLogic.doBrowseBlockSearch(request, response, element, objectContext);
	});
};

/**
 * Call init on iterable contexts.
 */
TLogic.callInitOnContexts = function(request, response, contextList)
{
	Util.each(contextList, function(context)
	{
		TLogic.callElementBlock(request, response, context, "INIT");
	});
};

/**
 * Initializes a newly-created context by executing each initialization block on each object.
 * Order is Containers, Objects, Rooms, Players, and the World.
 * @param request the request object containing the module context.
 * @param response the response object.
 * @throws TAMEInterrupt if an interrupt is thrown.
 * @throws TAMEFatalException if something goes wrong during execution.
 */
TLogic.initializeContext = function(request, response) 
{
	var context = request.moduleContext;
	
	var containerContexts = [];
	var objectContexts = [];
	var roomContexts = [];
	var playerContexts = [];
	
	Util.each(context.state.elements, function(elementContext)
	{
		var element = context.resolveElement(elementContext.identity);
		if (element.tameType === 'TContainer')
			containerContexts.push(elementContext);
		else if (element.tameType === 'TObject')
			objectContexts.push(elementContext);
		else if (element.tameType === 'TPlayer')
			playerContexts.push(elementContext);
		else if (element.tameType === 'TRoom')
			roomContexts.push(elementContext);
	});
	
	try {
		TLogic.callInitOnContexts(request, response, containerContexts);
		TLogic.callInitOnContexts(request, response, objectContexts);
		TLogic.callInitOnContexts(request, response, roomContexts);
		TLogic.callInitOnContexts(request, response, playerContexts);
		let worldContext = context.resolveElementContext("world");
		TLogic.callElementBlock(request, response, worldContext, "INIT");
		TLogic.callElementBlock(request, response, worldContext, "START");
	} catch (err) {
		// catch finish interrupt, throw everything else.
		if (!(err instanceof TAMEInterrupt) || err.type != TAMEInterrupt.Type.Finish)
			throw err;
	}
};

/**
 * Attempts to call the ambiguous command blocks.
 * @param request the request object.
 * @param response the response object.
 * @param action the action used.
 * @return true if a block was called, false if not.
 * @throws TAMEInterrupt if an interrupt occurs.
 */
TLogic.callAmbiguousCommand = function(request, response, action)
{
	let context = request.moduleContext;
	let currentPlayerContext = context.getCurrentPlayerContext();

	let actionValues = [TValue.createAction(action.identity)];
	
	if (currentPlayerContext !== null)
	{
		if (TLogic.callElementBlock(request, response, currentPlayerContext, "ONAMBIGUOUSCOMMAND", actionValues))
			return true;
		if (TLogic.callElementBlock(request, response, currentPlayerContext, "ONAMBIGUOUSCOMMAND"))
			return true;
	}

	let worldContext = context.getElementContext('world');
	
	if (TLogic.callElementBlock(request, response, worldContext, "ONAMBIGUOUSCOMMAND", actionValues))
		return true;
	if (TLogic.callElementBlock(request, response, worldContext, "ONAMBIGUOUSCOMMAND"))
		return true;

	return false;
};

/**
 * Calls the appropriate malformed command blocks if they exist.
 * Malformed commands are actions with mismatched conjugates, unknown modal parts, or unknown object references. 
 * @param request the request object.
 * @param response the response object.
 * @param action the action attempted.
 * @return true if a block was called, false if not.
 * @throws TAMEInterrupt if an interrupt occurs.
 */
TLogic.callMalformedCommand = function(request, response, action)
{
	let context = request.moduleContext;
	let currentPlayerContext = context.getCurrentPlayerContext();

	let actionValues = [TValue.createAction(action.identity)];
	
	if (currentPlayerContext !== null)
	{
		if (TLogic.callElementBlock(request, response, currentPlayerContext, "ONMALFORMEDCOMMAND", actionValues))
			return true;
		if (TLogic.callElementBlock(request, response, currentPlayerContext, "ONMALFORMEDCOMMAND"))
			return true;
	}

	let worldContext = context.getElementContext('world');
	
	if (TLogic.callElementBlock(request, response, worldContext, "ONMALFORMEDCOMMAND", actionValues))
		return true;
	if (TLogic.callElementBlock(request, response, worldContext, "ONMALFORMEDCOMMAND"))
		return true;

	return false;
};

/**
 * Calls the appropriate incomplete command blocks if they exist.
 * @param request the request object.
 * @param response the response object.
 * @param action the action attempted.
 * @return true if a fail block was called, false if not.
 * @throws TAMEInterrupt if an interrupt occurs.
 */
TLogic.callIncompleteCommand = function(request, response, action)
{
	let context = request.moduleContext;
	let currentPlayerContext = context.getCurrentPlayerContext();

	let actionValues = [TValue.createAction(action.identity)];
	
	if (currentPlayerContext !== null)
	{
		if (TLogic.callElementBlock(request, response, currentPlayerContext, "ONINCOMPLETECOMMAND", actionValues))
			return true;
		if (TLogic.callElementBlock(request, response, currentPlayerContext, "ONINCOMPLETECOMMAND"))
			return true;
	}

	let worldContext = context.getElementContext('world');
	
	if (TLogic.callElementBlock(request, response, worldContext, "ONINCOMPLETECOMMAND", actionValues))
		return true;
	if (TLogic.callElementBlock(request, response, worldContext, "ONINCOMPLETECOMMAND"))
		return true;

	return false;
};

/**
 * Calls the appropriate action unhandled blocks if they exist.
 * @param request the request object.
 * @param response the response object.
 * @param action the action attempted.
 * @return true if a fail block was called, false if not.
 * @throws TAMEInterrupt if an interrupt occurs.
 */
TLogic.callActionUnhandled = function(request, response, action)
{
	var context = request.moduleContext;
	var currentPlayerContext = context.getCurrentPlayerContext();

	let actionValues = [TValue.createAction(action.identity)];
	
	if (currentPlayerContext !== null)
	{
		if (TLogic.callElementBlock(request, response, currentPlayerContext, "ONUNHANDLEDACTION", actionValues))
			return true;
		if (TLogic.callElementBlock(request, response, currentPlayerContext, "ONUNHANDLEDACTION"))
			return true;
	}

	let worldContext = context.getElementContext('world');
	
	if (TLogic.callElementBlock(request, response, worldContext, "ONUNHANDLEDACTION", actionValues))
		return true;
	if (TLogic.callElementBlock(request, response, worldContext, "ONUNHANDLEDACTION"))
		return true;

	return false;
};


/**
 * Attempts to call the unknown command blocks.
 * @param request the request object.
 * @param response the response object.
 * @throws TAMEInterrupt if an interrupt occurs.
 */
TLogic.callUnknownCommand = function(request, response)
{
	let context = request.moduleContext;
	let currentPlayerContext = context.getCurrentPlayerContext();

	if (currentPlayerContext !== null)
	{
		if (TLogic.callElementBlock(request, response, currentPlayerContext, "ONUNKNOWNCOMMAND"))
			return true;
	}
	
	let worldContext = context.getElementContext('world');

	if (TLogic.callElementBlock(request, response, worldContext, "ONUNKNOWNCOMMAND"))
		return true;

	return false;
};

/**
 * Attempts to perform a general action.
 * @param request the request object.
 * @param response the response object.
 * @param action the action that is being called.
 * @throws TAMEInterrupt if an interrupt occurs.
 */
TLogic.doActionGeneral = function(request, response, action)
{
	TLogic.doActionOpen(request, response, action, null);
};

/**
 * Attempts to perform a general action.
 * @param request the request object.
 * @param response the response object.
 * @param action the action that is being called.
 * @param openTarget if not null, added as a target variable.
 * @throws TAMEInterrupt if an interrupt occurs.
 */
TLogic.doActionOpen = function(request, response, action, openTarget)
{
	let context = request.moduleContext;
	let currentPlayerContext = context.getCurrentPlayerContext();

	let actionValues = [TValue.createAction(action.identity)];
	let localValue = action.extraStrings ? action.extraStrings[0] : null;
	
	if (currentPlayerContext !== null)
	{
		let currentRoomContext = context.getCurrentRoomContext();

		if (currentRoomContext !== null && TLogic.callElementBlock(request, response, currentRoomContext, "ONACTION", actionValues, localValue, openTarget))
			return;

		if (TLogic.callElementBlock(request, response, currentPlayerContext, "ONACTION", actionValues, localValue, openTarget))
			return;
	}
	
	let worldContext = context.getElementContext('world');

	if (TLogic.callElementBlock(request, response, worldContext, "ONACTION", actionValues, localValue, openTarget))
		return;

	if (!TLogic.callActionUnhandled(request, response, action))
		response.addCue(TAMEConstants.Cue.ERROR, "ACTION UNHANDLED (make a better in-universe handler!).");
};

/**
 * Attempts to perform a modal action.
 * @param request the request object.
 * @param response the response object.
 * @param action the action that is being called.
 * @param mode the mode to process.
 * @throws TAMEInterrupt if an interrupt occurs.
 */
TLogic.doActionModal = function(request, response, action, mode)
{
	let context = request.moduleContext;
	let currentPlayerContext = context.getCurrentPlayerContext();

	let actionValues = [TValue.createAction(action.identity), TValue.createString(mode)];
	
	if (currentPlayerContext !== null)
	{
		// try current room.
		let currentRoomContext = context.getCurrentRoomContext();
		if (currentRoomContext !== null && TLogic.callElementBlock(request, response, currentRoomContext, "ONMODALACTION", actionValues))
			return;
		
		if (TLogic.callElementBlock(request, response, currentPlayerContext, "ONMODALACTION", actionValues))
			return;
	}
	
	let worldContext = context.getElementContext('world');
	if (TLogic.callElementBlock(request, response, worldContext, "ONMODALACTION", actionValues))
		return;

	if (!TLogic.callActionUnhandled(request, response, action))
		response.addCue(TAMEConstants.Cue.ERROR, "ACTION UNHANDLED (make a better in-universe handler!).");
};

/**
 * Attempts to perform a transitive action.
 * @param request the request object.
 * @param response the response object.
 * @param action the action that is being called.
 * @param object the target object for the action.
 * @throws TAMEInterrupt if an interrupt occurs.
 */
TLogic.doActionTransitive = function(request, response, action, object)
{
	let context = request.moduleContext;
	let currentObjectContext = context.getElementContext(object.identity);
	let actionValue = TValue.createAction(action.identity);
	
	if (TLogic.callElementBlock(request, response, currentObjectContext, "ONACTION", [actionValue]))
		return;
	
	let objectValue = TValue.createObject(object.identity);
	let currentPlayerContext = context.getCurrentPlayerContext();

	// Call onActionWith(action, object) on current room, then player.
	if (currentPlayerContext !== null)
	{
		let currentRoomContext = context.getCurrentRoomContext();
		if (currentRoomContext !== null)
		{
			if (TLogic.callElementBlock(request, response, currentRoomContext, "ONACTIONWITH", [actionValue, objectValue]))
				return;
			else if (TLogic.doActionAncestorSearch(request, response, actionValue, currentRoomContext, object))
				return;
			else if (TLogic.callElementBlock(request, response, currentRoomContext, "ONACTIONWITHOTHER", [actionValue]))
				return;
		}
		
		if (TLogic.callElementBlock(request, response, currentPlayerContext, "ONACTIONWITH", [actionValue, objectValue]))
			return;
		else if (TLogic.doActionAncestorSearch(request, response, actionValue, currentPlayerContext, object))
			return;
		else if (TLogic.callElementBlock(request, response, currentPlayerContext, "ONACTIONWITHOTHER", [actionValue]))
			return;
	}

	let worldContext = context.getElementContext('world');

	if (TLogic.callElementBlock(request, response, worldContext, "ONACTIONWITH", [actionValue, objectValue]))
		return;
	else if (TLogic.doActionAncestorSearch(request, response, actionValue, worldContext, object))
		return;
	else if (TLogic.callElementBlock(request, response, worldContext, "ONACTIONWITHOTHER", [actionValue]))
		return;

	if (!TLogic.callActionUnhandled(request, response, action))
		response.addCue(TAMEConstants.Cue.ERROR, "ACTION UNHANDLED (make a better in-universe handler!).");
};


/**
 * Attempts to perform a ditransitive action for the ancestor search.
 * @param request the request object.
 * @param response the response object.
 * @param actionValue the action that is being called (value).
 * @param elementContext the element context to call the block on.
 * @param start the object to start the search from.
 * @return true if a block was found an called.
 * @throws TAMEInterrupt if an interrupt occurs.
 */
TLogic.doActionAncestorSearch = function(request, response, actionValue, elementContext, start)
{
	var context = request.moduleContext;
	var ancestor = start.parent ? context.getElement(start.parent) : null;
	while (ancestor !== null)
	{
		if (TLogic.callElementBlock(request, response, elementContext, "ONACTIONWITHANCESTOR", [actionValue, TValue.createObject(ancestor.identity)]))
			return true;
		ancestor = ancestor.parent ? context.getElement(ancestor.parent) : null;
	}
	
	return false;
};

/**
 * Attempts to perform a ditransitive action.
 * @param request the request object.
 * @param response the response object.
 * @param action the action that is being called.
 * @param object1 the first object for the action.
 * @param object2 the second object for the action.
 * @throws TAMEInterrupt if an interrupt occurs.
 */
TLogic.doActionDitransitive = function(request, response, action, object1, object2)
{
	let context = request.moduleContext;
	let currentObject1Context = context.getElementContext(object1.identity);
	let currentObject2Context = context.getElementContext(object2.identity);

	let actionValue = TValue.createAction(action.identity);
	let object1Value = TValue.createObject(object1.identity);
	let object2Value = TValue.createObject(object2.identity);
	
	var call12 = !action.strict || !action.reversed;
	var call21 = !action.strict || action.reversed;

	// call action on each object. one or both need to succeed for no failure.
	if (call12 && TLogic.callElementBlock(request, response, currentObject1Context, "ONACTIONWITH", [actionValue, object2Value]))
		return;
	if (call21 && TLogic.callElementBlock(request, response, currentObject2Context, "ONACTIONWITH", [actionValue, object1Value]))
		return;

	// call action with ancestor on each object. one or both need to succeed for no failure.
	if (call12 && TLogic.doActionAncestorSearch(request, response, actionValue, currentObject1Context, object2))
		return;
	if (call21 && TLogic.doActionAncestorSearch(request, response, actionValue, currentObject2Context, object1))
		return;
	
	// attempt action with other on both objects.

	if (call12 && TLogic.callElementBlock(request, response, currentObject1Context, "ONACTIONWITHOTHER", [actionValue]))
		return;
	if (call21 && TLogic.callElementBlock(request, response, currentObject2Context, "ONACTIONWITHOTHER", [actionValue]))
		return;

	// if we STILL can't do it...
	if (!TLogic.callActionUnhandled(request, response, action))
		response.addCue(TAMEConstants.Cue.ERROR, "ACTION UNHANDLED (make a better in-universe handler!).");
};



var TResponseHandler = function(options)
{
	let self = this;
	let BLANK_FUNCTION = function(){};

	// Fill Options
	this.defaultOptions = 
	{
		"print": BLANK_FUNCTION,
		"onStart": BLANK_FUNCTION,
		"onEnd": BLANK_FUNCTION,
		"onSuspend": BLANK_FUNCTION,
		"onResume": BLANK_FUNCTION,
		"onQuit": BLANK_FUNCTION,
		"onPause": BLANK_FUNCTION,
		"onError": BLANK_FUNCTION,
		"onFatal": BLANK_FUNCTION,
		"onTrace": BLANK_FUNCTION,
		"onOtherCue": BLANK_FUNCTION,
		"onStartFormatTag": BLANK_FUNCTION,
		"onEndFormatTag": BLANK_FUNCTION, 
		"onFormatText": function(text, accum) 
		{
			accum.push(text);
		}
	};
	
	if (!options)
		options = {};
	
	let combinedOptions = {};
	for (let x in this.defaultOptions) if (this.defaultOptions.hasOwnProperty(x)) 
		combinedOptions[x] = options[x] || this.defaultOptions[x];
	this.options = combinedOptions;
	
	// cue name -> function(content)
	this.cueHandlers =
	{
		"quit": function()
		{
			self.stop = true;
			return false;
		},
		
		"text": function(content)
		{
			self.textBuffer.push(content);
			return true;
		},
		
		"textf": function(content)
		{
			self.textBuffer.push(Util.parseFormatted(
				content, 
				self.options.onStartFormatTag, 
				self.options.onEndFormatTag, 
				self.options.onFormatText
			));
			return true;
		},
			
		"wait": function(content)
		{
			setTimeout(function(){self.resume();}, parseInt(content, 10));
			return false;
		},

		"pause": function()
		{
			self.pause = true;
			return false;
		},

		"error": function(content)
		{
			self.options.onError(content);
			return true;
		},

		"fatal": function(content)
		{
			self.options.onFatal(content);
			self.stop = true;
			return false;
		}
		
	};

};

/**
 * Resets the cue read state.
 */
TResponseHandler.prototype.reset = function()
{
	this.stop = false;
	this.pause = false;
	this.textBuffer = [];	
};

/**
 * Prepares the response for read.
 * @param response the response from an initialize or interpret call.
 */
TResponseHandler.prototype.prepare = function(response)
{
	this.reset();
	this.response = response;
	this.nextCue = 0;
};

/**
 * Reads the response.
 * Set with prepare().
 * @return true if more unprocessed cues remain, or false if not. 
 */
TResponseHandler.prototype.resume = function()
{
	if (!this.response)
		throw new Error('resume() before prepare()!');

	if (this.nextCue === 0)
		this.options.onStart();
	else
		this.options.onResume();

	// clear pause if set.
	if (this.pause)
		this.pause = false;
	
	// Process Cue Loop
	let keepGoing = true;
	while ((this.nextCue < this.response.responseCues.length) && keepGoing) 
	{
		let cue = this.response.responseCues[this.nextCue++];
		
		let cueType = cue.type.toLowerCase();
		let cueContent = cue.content;
		
		if (cueType !== 'text' && cueType !== 'textf') 
		{
			this.options.print(this.textBuffer.join(''));
			this.textBuffer.length = 0;
		}
		
		if (cueType.startsWith('trace-'))
		{
			let type = cueType.substring('trace-'.length);
			this.options.onTrace(type, cueContent);
		}
		else if (this.cueHandlers[cueType])
			keepGoing = this.cueHandlers[cueType](cueContent);
		else
			keepGoing = this.options.onOtherCue(cueType, cueContent);
	}

	if (this.textBuffer.length > 0) 
	{
		this.options.print(this.textBuffer.join(''));
		this.textBuffer.length = 0;
	}
	
	if (this.pause)
	{
		this.options.onPause();
	}
	
	// if stop, halt completely.
	if (this.stop)
	{
		// unload response.
		this.response = null;
		this.options.onQuit();
		this.options.onEnd();
		return false;
	}
	
	// If halted before end...
	if (!this.pause)
	{
		if (this.nextCue < this.response.responseCues.length)
		{
			this.options.onSuspend();
			return true;
		}
		else
		{
			this.options.onEnd();
			return false;
		}
	}
	else
	{
		return false;
	}
	
};

/**
 * Prepares the response for read and calls resume.
 * Calls prepare(response) and then resume().
 * @param response the response from an initialize or interpret call.
 * @return true if more unprocessed cues remain, or false if not. 
 */
TResponseHandler.prototype.process = function(response)
{
	this.prepare(response);
	return this.resume();
};

	
	this.newResponseHandler = function(options) 
	{
		return new TResponseHandler(options);
	};
	
	this.readModule = function(dataView)
	{
		return TBinaryReader.readModule(dataView);
	};

	this.newContext = function(module) 
	{
		return module ? new TModuleContext(module) : null;
	};

	this.initialize = function(context, traceTypes) 
	{
		return TLogic.handleInit(context, traceTypes);
	};
	
	this.interpret = function(context, inputMessage, traceTypes) 
	{
		return TLogic.handleRequest(context, inputMessage, traceTypes);
	};

	this.inspect = function(context, elementIdentity, variable)
	{
		return TLogic.inspect(context, elementIdentity, variable);
	};
	
	this.parseFormatted = function(content, startFormatTag, endFormatTag, formatText)
	{
		return Util.parseFormatted(content, startFormatTag, endFormatTag, formatText);
	};
	
	return this;
	
})(this);

