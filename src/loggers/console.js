/*
 * moleculer
 * Copyright (c) 2019 MoleculerJS (https://github.com/moleculerjs/moleculer)
 * MIT Licensed
 */

/* eslint-disable no-console */

"use strict";

const BaseLogger 	= require("./base");
const _ 			= require("lodash");
const kleur 		= require("kleur");
const util 			= require("util");
//const { match }		= require("../utils");


function getColor(type) {
	switch(type) {
		case "fatal": return kleur.red().inverse;
		case "error": return kleur.red;
		case "warn": return kleur.yellow;
		case "debug": return kleur.magenta;
		case "trace": return kleur.gray;
		default: return kleur.green;
	}
}

/**
 * Console logger for Moleculer
 *
 * @class ConsoleLogger
 * @extends {BaseLogger}
 */
class ConsoleLogger extends BaseLogger {

	/**
	 * Creates an instance of ConsoleLogger.
	 * @param {Object} opts
	 * @memberof ConsoleLogger
	 */
	constructor(opts) {
		super(opts);

		this.opts = _.defaultsDeep(this.opts, {
			colors: true,
			moduleColors: false,
			formatter: null,
			objectPrinter: null
		});
	}

	init(logFactory) {
		super.init(logFactory);

		if (!this.opts.colors)
			kleur.enabled = false;

		this.objectPrinter = this.opts.objectPrinter ? this.opts.objectPrinter : o => util.inspect(o, { showHidden: false, depth: 2, colors: kleur.enabled, breakLength: Number.POSITIVE_INFINITY });

		// Generate colorful log level names
		this.levelColorStr = BaseLogger.LEVELS.reduce((a, level) => {
			a[level] = getColor(level)(_.padEnd(level.toUpperCase(), 5));
			return a;
		}, {});

		if (this.opts.colors && this.opts.moduleColors === true) {
			this.opts.moduleColors = ["cyan", "yellow", "green", "magenta", "red", "blue", "white", "grey",
				"bold.cyan", "bold.yellow", "bold.green", "bold.magenta", "bold.red", "bold.blue", "bold.white", "bold.grey"];
		}
		this.colorCnt = 0;
	}

	/**
	 *
	 */
	getNextColor() {
		if (this.opts.colors && Array.isArray(this.opts.moduleColors))
			return this.opts.moduleColors[this.colorCnt++ % this.opts.moduleColors.length];

		return "grey";
	}

	/**
	 *
	 * @param {object} bindings
	 */
	getFormatter(bindings) {
		const formatter = this.opts.formatter;
		if (_.isFunction(formatter))
			return (type, args) => formatter(type, args, bindings);

		const c = this.getNextColor();

		const mod = (bindings && bindings.mod) ? bindings.mod.toUpperCase() : "";
		const modColorName = c.split(".").reduce((a,b) => a[b] || a()[b], kleur)(mod);
		const moduleColorName = bindings ? kleur.grey(bindings.nodeID + "/") + modColorName : "";

		const printArgs = args => {
			return args.map(p => {
				if (_.isObject(p) || _.isArray(p))
					return this.objectPrinter(p);
				return p;
			});
		};

		if (formatter == "simple") {
			// INFO  - Moleculer v0.14.0-beta3 is starting...
			return (type, args) => [this.levelColorStr[type], "-", ...printArgs(args)];
		} else if (formatter == "short") {
			// [08:42:12.973Z] INFO  BROKER: Moleculer v0.14.0-beta3 is starting...
			return (type, args) => [kleur.grey(`[${new Date().toISOString().substr(11)}]`), this.levelColorStr[type], modColorName + kleur.grey(":"), ...printArgs(args)];
		} else {
			// [2019-08-31T08:40:53.481Z] INFO  bobcsi-pc-7100/BROKER: Moleculer v0.14.0-beta3 is starting...
			return (type, args) => [kleur.grey(`[${new Date().toISOString()}]`), this.levelColorStr[type], moduleColorName + kleur.grey(":"), ...printArgs(args)];
		}
	}

	/**
	 *
	 * @param {object} bindings
	 */
	getLogHandler(bindings) {
		const formatter = this.getFormatter(bindings);

		const level = this.getLogLevel(bindings ? bindings.mod : null);
		const levelIdx = level ? BaseLogger.LEVELS.indexOf(level) : -1;

		return (type, args) => {
			const typeIdx = BaseLogger.LEVELS.indexOf(type);
			if (typeIdx > levelIdx) return;

			const pargs = formatter(type, args);
			switch(type) {
				case "fatal":
				case "error": return console.error(...pargs);
				case "warn": return console.warn(...pargs);
				default: return console.log(...pargs);
			}
		};
	}

}

module.exports = ConsoleLogger;