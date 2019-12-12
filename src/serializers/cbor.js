/*
 * moleculer
 * Copyright (c) 2018 MoleculerJS (https://github.com/moleculerjs/moleculer)
 * MIT Licensed
 */

"use strict";

const BaseSerializer = require("./base");

/**
 * MessagePack serializer for Moleculer
 *
 * https://github.com/mcollina/msgpack5
 *
 * @class CBORSerializer
 */
class CBORSerializer extends BaseSerializer {

	/**
	 * Initialize Serializer
	 *
	 * @param {any} broker
	 *
	 * @memberof Serializer
	 */
	init(broker) {
		super.init(broker);

		try {
			this.cbor = require('borc');
		} catch(err) {
			/* istanbul ignore next */
			this.broker.fatal("The 'borc' package is missing! Please install it with 'npm install cbor --save' command!", err, true);
		}
	}

	/**
	 * Serializer a JS object to Buffer
	 *
	 * @param {Object} obj
	 * @returns {Buffer}
	 *
	 * @memberof CBORSerializer
	 */
	serialize(obj) {
		const res = this.cbor.encode(obj);
		return res;
	}

	/**
	 * Deserialize Buffer to JS object
	 *
	 * @param {Buffer} str
	 * @returns {Object}
	 *
	 * @memberof CBORSerializer
	 */
	deserialize(buf) {
		const res = this.cbor.decode(buf);
		return res;
	}
}

module.exports = CBORSerializer;
