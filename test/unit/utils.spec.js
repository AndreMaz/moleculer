const utils = require("../../src/utils");

describe("Test utils.humanize", () => {

	it("should humanize elapsed milliseconds", () => {
		expect(utils.humanize()).toBe("?");
		expect(utils.humanize(1)).toBe("1ms");
		expect(utils.humanize(10)).toBe("10ms");
		expect(utils.humanize(100)).toBe("100ms");
		expect(utils.humanize(1000)).toBe("1s");
		expect(utils.humanize(10000)).toBe("10s");
		expect(utils.humanize(100000)).toBe("1m");
		expect(utils.humanize(1000000)).toBe("16m");
		expect(utils.humanize(10000000)).toBe("2h");
		expect(utils.humanize(100000000)).toBe("27h");

		expect(utils.humanize(0)).toBe("now");
		expect(utils.humanize(0.1)).toBe("100μs");
		expect(utils.humanize(0.01)).toBe("10μs");
		expect(utils.humanize(0.001)).toBe("1μs");
		expect(utils.humanize(0.0001)).toBe("100ns");
		expect(utils.humanize(0.00001)).toBe("10ns");
		expect(utils.humanize(0.000001)).toBe("1ns");
		expect(utils.humanize(0.0000001)).toBe("now");
	});

});

describe("Test utils.generateToken", () => {
	const REGEX_MATCHER = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;

	it("should generate unique token", () => {
		let res1 = utils.generateToken();
		expect(res1.length).toBe(36);
		expect(res1).toMatch(REGEX_MATCHER);

		let res2 = utils.generateToken();
		expect(res2).toMatch(REGEX_MATCHER);
		expect(res1).not.toEqual(res2);
	});
});


describe("Test utils.isPromise", () => {

	it("should check the param", () => {
		expect(utils.isPromise()).toBe(false);
		expect(utils.isPromise({})).toBe(false);
		expect(utils.isPromise(new Promise(() => {}))).toBe(true);
		expect(utils.isPromise(Promise.resolve())).toBe(true);
		//expect(utils.isPromise(Promise.reject())).toBe(true); // node gives warning
	});

});

describe("Test utils.getNodeID", () => {
	let os = require("os");
	it("should give the computer hostname", () => {
		expect(utils.getNodeID()).toBe(os.hostname().toLowerCase() + "-" + process.pid);
	});
});

describe("Test match", () => {

	expect(utils.match("1.2.3", "1.2.3")).toBe(true);
	expect(utils.match("a.b.c.d", "a.b.c.d")).toBe(true);
	expect(utils.match("aa.bb.cc", "aa.bb.cc")).toBe(true);

	expect(utils.match("a1c", "a?c")).toBe(true);
	expect(utils.match("a2c", "a?c")).toBe(true);
	expect(utils.match("a3c", "a?c")).toBe(true);
	expect(utils.match("ac", "a?c")).toBe(false);

	expect(utils.match("aa.1b.c", "aa.?b.*")).toBe(true);
	expect(utils.match("aa.2b.cc", "aa.?b.*")).toBe(true);
	expect(utils.match("aa.3b.ccc", "aa.?b.*")).toBe(true);
	expect(utils.match("aa.4b.cccc", "aa.?b.*")).toBe(true);
	expect(utils.match("aa.5b.ccccc", "aa.?b.*")).toBe(true);
	expect(utils.match("aa.5b.ccccc.d", "aa.?b.*")).toBe(false);

	expect(utils.match("aa.bb.cc", "aa.bb.*")).toBe(true);
	expect(utils.match("aa.bb.cc", "*.bb.*")).toBe(true);
	expect(utils.match("bb.cc", "bb.*")).toBe(true);
	expect(utils.match("dd", "*")).toBe(true);

	expect(utils.match("abcd", "*d")).toBe(true);
	expect(utils.match("abcd", "*d*")).toBe(true);
	expect(utils.match("abcd", "*a*")).toBe(true);
	expect(utils.match("abcd", "a*")).toBe(true);

	// --- DOUBLE STARS CASES ---

	expect(utils.match("aa.bb.cc", "aa.*")).toBe(false);
	expect(utils.match("aa.bb.cc", "a*")).toBe(false);
	expect(utils.match("bb.cc", "*")).toBe(false);

	expect(utils.match("aa.bb.cc.dd", "*.bb.*")).toBe(false);
	expect(utils.match("aa.bb.cc.dd", "*.cc.*")).toBe(false);

	expect(utils.match("aa.bb.cc.dd", "*bb*")).toBe(false);
	expect(utils.match("aa.bb.cc.dd", "*cc*")).toBe(false);

	expect(utils.match("aa.bb.cc.dd", "*b*")).toBe(false);
	expect(utils.match("aa.bb.cc.dd", "*c*")).toBe(false);

	expect(utils.match("aa.bb.cc.dd", "**.bb.**")).toBe(true);
	expect(utils.match("aa.bb.cc.dd", "**.cc.**")).toBe(true);

	expect(utils.match("aa.bb.cc.dd", "**aa**")).toBe(true);
	expect(utils.match("aa.bb.cc.dd", "**bb**")).toBe(true);
	expect(utils.match("aa.bb.cc.dd", "**cc**")).toBe(true);
	expect(utils.match("aa.bb.cc.dd", "**dd**")).toBe(true);

	expect(utils.match("aa.bb.cc.dd", "**b**")).toBe(true);
	expect(utils.match("aa.bb.cc.dd", "**c**")).toBe(true);

	expect(utils.match("aa.bb.cc", "aa.**")).toBe(true);
	expect(utils.match("aa.bb.cc", "**.cc")).toBe(true);

	expect(utils.match("bb.cc", "**")).toBe(true);
	expect(utils.match("b", "**")).toBe(true);

	expect(utils.match("$node.connected", "$node.*")).toBe(true);
	expect(utils.match("$node.connected", "$node.**")).toBe(true);
	expect(utils.match("$aa.bb.cc", "$aa.*.cc")).toBe(true);

	// ---
	expect(utils.match("$aa.bb.cc", "$aa.*.cc")).toBe(true);
	expect(utils.match("$aa.bb.cc", "$aa.**")).toBe(true);
	expect(utils.match("$aa.bb.cc", "$aa.**.cc")).toBe(true);
	expect(utils.match("$aa.bb.cc", "$aa.??.cc")).toBe(true);
	expect(utils.match("$aa.bb.cc", "?aa.bb.cc")).toBe(true);
	expect(utils.match("$aa.bb.cc", "aa.bb.cc")).toBe(false);
	expect(utils.match("$aa.bb.cc", "**.bb.cc")).toBe(true);
	expect(utils.match("$aa.bb.cc", "**.cc")).toBe(true);
	expect(utils.match("$aa.bb.cc", "**")).toBe(true);
	expect(utils.match("$aa.bb.cc", "*")).toBe(false);
});

describe("Test utils.safetyObject", () => {

	it("should return a same object", () => {
		const obj = {
			a: 5,
			b: "Hello",
			c: [0,1,2],
			d: {
				e: false,
				f: 1.23
			}
		};
		const res = utils.safetyObject(obj);
		expect(res).not.toBe(obj);
		expect(res).toEqual(obj);
	});

	it("should return a same object without circular refs & Function", () => {
		const obj = {
			a: 5,
			b: "Hello",
			c: [0,1,2],
			d: {
				e: false,
				f: 1.23
			},
			h: (ctx) => ctx
		};
		obj.d.g = obj;

		const res = utils.safetyObject(obj);
		expect(res).not.toBe(obj);
		expect(res).toEqual({
			a: 5,
			b: "Hello",
			c: [0,1,2],
			d: {
				e: false,
				f: 1.23
			}
		});

		expect(obj.d.g).toBeDefined();
		expect(obj.h).toBeInstanceOf(Function);
	});

});

describe("Test utils.dotSet", () => {

	it("should set variable", () => {
		const obj = {};
		const result = utils.dotSet(obj, "variable", "hello world");
		expect(result.variable).toBe("hello world");
	});

	it("should set nested variable", () => {
		const obj = {};
		const result = utils.dotSet(obj, "nested.variable", "hello world");
		expect(result.nested.variable).toBe("hello world");
	});

	it("should not change other variables", () => {
		const obj = {
			a: 1,
			b: {
				c: 2,
			},
		};
		const result = utils.dotSet(obj, "nested.variable", "hello world");
		expect(result.a).toBe(1);
		expect(result.b.c).toBe(2);
		expect(result.nested.variable).toBe("hello world");
	});

	it("should replace values", () => {
		const obj = {
			hello: {
				world: "!",
			},
		};
		const result = utils.dotSet(obj, "hello.world", "?");
		expect(result.hello.world).toBe("?");
	});

	it("should throw when not on leaf", (done) => {
		const obj = {
			level1: {
				level2: "hello",
			},
		};
		try {
			utils.dotSet(obj, "level1.level2.level3", "?");
			done.fail(new Error("Should have raised an error"));
		} catch(err) {
			done();
		}
	});

});

describe("Test utils.parseByteString", () => {

	it("should parse byte string to number of bytes", () => {
		expect(utils.parseByteString()).toBe(null);
		expect(utils.parseByteString(null)).toBe(null);
		expect(utils.parseByteString(0)).toBe(0);
		expect(utils.parseByteString(1000)).toBe(1000);
		expect(utils.parseByteString(10000)).toBe(10000);
		expect(utils.parseByteString(100000000)).toBe(100000000);

		expect(utils.parseByteString("")).toBe(null);
		expect(utils.parseByteString("0")).toBe(0);
		expect(utils.parseByteString("1")).toBe(1);
		expect(utils.parseByteString("10")).toBe(10);
		expect(utils.parseByteString("100")).toBe(100);
		expect(utils.parseByteString("1000")).toBe(1000);
		expect(utils.parseByteString("a")).toBe(null);
		expect(utils.parseByteString("b")).toBe(null);
		expect(utils.parseByteString("B")).toBe(null);

		expect(utils.parseByteString("1b")).toBe(1);
		expect(utils.parseByteString("5B")).toBe(5);
		expect(utils.parseByteString("100b")).toBe(100);
		expect(utils.parseByteString("1000b")).toBe(1000);
		expect(utils.parseByteString("0kb")).toBe(0);
		expect(utils.parseByteString("1kb")).toBe(1024);
		expect(utils.parseByteString("100kb")).toBe(102400);
		expect(utils.parseByteString("512kb")).toBe(524288);
		expect(utils.parseByteString("1mb")).toBe(1048576);
		expect(utils.parseByteString("5mb")).toBe(5242880);
		expect(utils.parseByteString("2.56GB")).toBe(2748779069);
		expect(utils.parseByteString("2.8TB")).toBe(3078632557772);
	});

});
