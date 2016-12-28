
console.log('ok');

var utils = require('./utils');
console.log('utils.multi(10, 10) :', utils.multi(10, 10));


/*
 * import
 */
import * as math from './lib/math';
console.log('import :', math.sum(math.pi, math.pi) );


/*
 * block scope
 */

{
	var a = 10;
	let b = 20;
	const tmp = a;
	a = b;

	console.log('tmp :', tmp);
	console.log('b :', b);

	console.log('a :', a);
}


/*
 * Arrows
 */
var evens = [2, 4, 6, 8, 10];
var odds = evens.map(v => v + 1);
console.log('odds :', odds);

var nums = evens.map((v, i) => v + i);
console.log('nums :', nums);

var fives = [];
nums.forEach(v => {
	if(v % 5 === 0) fives.push(v);
});
console.log('fives :', fives);


/*
 * Class
 */
class Character {
	constructor(name, job) {
		this._name = name;
		this.job = job;
	}

	get name() {
		return this._name;
	}

	set name(str) {
		this._name = str;
	}

	// public functions
	read(bookTitle) {
		console.log('Character read this book :', bookTitle);
	}
}

class Boy extends Character {
	constructor(name, job, country) {
		super(name, job);
		this.country = country;
	}

	// override public function
	read(bookTitle, writer) {
		super.read(bookTitle);
		console.log('this book has written by this writer :', writer, this.country);
	}
}

var character = new Character('vuild', 'programmer');
character.read('hello world');
console.log('character.name :', character.name);

var boy = new Boy('dragmove', 'front-end developer', 'korea');
boy.read('hi extended boy', 'kim hyun seok');
console.log('boy.name :', boy.name);


/*
 * template strings
 */
{
	var name = 'Bob', time = 'today';
	const tpl = `Hello ${name}, how are you ${time}?`;
	console.log('tpl :', tpl);

	var a = 5,
		b = 10;

	function tag(strings, ...values) {
		console.log(strings[0]); // Hello
		console.log(strings[1]); //  world
		console.log(values[0]); // a + b = 15
		console.log(values[1]); // a * b = 50
	}

	tag`Hello ${a + b} world ${a * b}`;
}


/*
 * multiline console
 */
console.log(`Hello,
boy?`);


/*
 * Default + Rest + Spread
 */
{
	function f1(x, y=12) {
		return x + y;
	}

	console.log('f1(3) === 15 :', f1(3) === 15);

	function f2(x, ...y) {
		return x * y.length;
	}
	console.log( f2(3, 'hello', true) === 6 );

	function f3(x, y, z) {
		return x + y + z;
	}
	console.log( f3(...[1, 2, 3]) === 6 );
}


/*
 * Iterator
 */
{
	let arr = ['a', 'b', 'c'];
	let iter = arr[Symbol.iterator]();

	console.log( iter.next() ); // {value: 'a', done: false}
	console.log( iter.next() ); // {value: 'b', done: false}
	console.log( iter.next() ); // {value: 'c', done: false}
	console.log( iter.next() ); // {value: undefined, done: true}

	// Arrays
	for(let x of ['a', 'b']) {
		console.log(x);
	}

	// Strings
	for(let x of 'a\uD83D\uDC0A') {
		console.log(x);
	}

	// Map
	let map = new Map().set('a', 1).set('b', 2);
	for(let pair of map) {
		console.log(pair);
	}
	console.log('map.size :', map.size);
	console.log('map.get("b") :', map.get("b"));

	// Set
	let set = new Set().add('a').add('b');
	for(let x of set) {
		console.log(x);
	}
	console.log('set.size :', set.size);
	console.log('set.has("a") :', set.has("a"));

	// Array like
	let arrayLike = {length:2, 0: 'a', 1: 'b'};
	for(let x of Array.from(arrayLike)) {
		console.log('Array.from :', x);
	}

	// make iterator
	let fibonacci = {
		[Symbol.iterator]() {
			let pre = 0, cur = 1;
			return {
				next() {
					[pre, cur] = [cur, pre + cur];
					return { done: false, value: cur };
				}
			};
		}
	};

	for(var n of fibonacci) {
		if(n > 1000) break;
		console.log(n);
	}
}


/*
 * Generators
 */
var fibonacci = {
	[Symbol.iterator]: function*() {
		var pre = 0, cur = 1;
		for(;;) {
			var temp = pre;
			pre = cur;
			cur += temp;
			yield cur;
		}
	}
};

for(var n of fibonacci) {
	if(n > 1000) break;
	console.log(n);
}


/*
 * Symbols
 */
(function() {
	var key = Symbol('key');

	function MyClass(privateData) {
		this[key] = privateData;
	}

	MyClass.prototype = {
		doStuff: function() {
			return this[key];
			// ... this[key]...
		}
	};

	console.log( typeof key === 'symbol' );

	var c = new MyClass('hello');
	console.log( c[key] );
})();


/*
 * Math + Number + String
 */
console.log('Number.EPSILON :', Number.EPSILON);
console.log('Number.isInteger(1) :', Number.isInteger(1));
console.log('Number.isInteger(Infinity) :', Number.isInteger(Infinity));

console.log( 'abcde'.includes('cd') ); // true
console.log( 'abc'.repeat(3) ); // abcabcabc

console.log( [0, 0, 0, 0].fill(7, 1) ); // [0, 7, 7, 7]
console.log( [1, 2, 3].findIndex(x => x == 2) );

var keys = ['a', 'b', 'c'].keys();
console.log( 'keys.next() :', keys.next() );

var vals = ['a', 'b', 'c'].values();
console.log( 'vals.next() :', vals.next() );


/*
 * Object.assign
 */
{
	var obj = {a: 1};
	var copy = Object.assign({}, obj);
	console.log('copy :', copy);

	var o1 = {a: 1},
		o2 = {b: 2},
		o3 = {c: 3};

	var obj = Object.assign(o1, o2, o3);
	console.log(obj);
	console.log(o1); // target Object itself is changed.
}


/*
 * Promises
 */
function timeout(duration = 0) {
	console.log('timeout duration :', duration);
	return new Promise((resolve, reject) => {
		setTimeout(resolve, duration);
	});
}

var p = timeout(3000).then(() => {
		return timeout(2000);
	}).then(() => {
		throw new Error("hmm");
	}).catch(err => {
		return Promise.all([timeout(100), timeout(200)]);
	});


/*
 * Reflect - http://qnimate.com/es6-reflect-api-tutorial/
 */
var obj = {name: 'super-mario'};
var name = Reflect.get(obj, 'name');
console.log(name);

Reflect.set(obj, 'name', 'mario');
console.log(obj.name);
