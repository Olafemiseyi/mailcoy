import { a as __toCommonJS, i as __require, n as __esmMin, r as __exportAll, t as __commonJSMin } from "../../_runtime.mjs";
import { Readable } from "node:stream";
import node_https from "node:https";
import nodeHTTP2, { default as node_http2 } from "node:http2";
//#region node_modules/@smithy/types/dist-es/auth/auth.js
var HttpAuthLocation;
var init_auth$1 = __esmMin((() => {
	(function(HttpAuthLocation) {
		HttpAuthLocation["HEADER"] = "header";
		HttpAuthLocation["QUERY"] = "query";
	})(HttpAuthLocation || (HttpAuthLocation = {}));
}));
//#endregion
//#region node_modules/@smithy/types/dist-es/auth/HttpApiKeyAuth.js
var HttpApiKeyAuthLocation;
var init_HttpApiKeyAuth = __esmMin((() => {
	(function(HttpApiKeyAuthLocation) {
		HttpApiKeyAuthLocation["HEADER"] = "header";
		HttpApiKeyAuthLocation["QUERY"] = "query";
	})(HttpApiKeyAuthLocation || (HttpApiKeyAuthLocation = {}));
}));
//#endregion
//#region node_modules/@smithy/types/dist-es/auth/index.js
var init_auth = __esmMin((() => {
	init_auth$1();
	init_HttpApiKeyAuth();
}));
//#endregion
//#region node_modules/@smithy/types/dist-es/endpoint.js
var EndpointURLScheme;
var init_endpoint = __esmMin((() => {
	(function(EndpointURLScheme) {
		EndpointURLScheme["HTTP"] = "http";
		EndpointURLScheme["HTTPS"] = "https";
	})(EndpointURLScheme || (EndpointURLScheme = {}));
}));
//#endregion
//#region node_modules/@smithy/types/dist-es/extensions/checksum.js
var AlgorithmId, getChecksumConfiguration, resolveChecksumRuntimeConfig;
var init_checksum = __esmMin((() => {
	(function(AlgorithmId) {
		AlgorithmId["MD5"] = "md5";
		AlgorithmId["CRC32"] = "crc32";
		AlgorithmId["CRC32C"] = "crc32c";
		AlgorithmId["SHA1"] = "sha1";
		AlgorithmId["SHA256"] = "sha256";
	})(AlgorithmId || (AlgorithmId = {}));
	getChecksumConfiguration = (runtimeConfig) => {
		const checksumAlgorithms = [];
		if (runtimeConfig.sha256 !== void 0) checksumAlgorithms.push({
			algorithmId: () => AlgorithmId.SHA256,
			checksumConstructor: () => runtimeConfig.sha256
		});
		if (runtimeConfig.md5 != void 0) checksumAlgorithms.push({
			algorithmId: () => AlgorithmId.MD5,
			checksumConstructor: () => runtimeConfig.md5
		});
		return {
			addChecksumAlgorithm(algo) {
				checksumAlgorithms.push(algo);
			},
			checksumAlgorithms() {
				return checksumAlgorithms;
			}
		};
	};
	resolveChecksumRuntimeConfig = (clientConfig) => {
		const runtimeConfig = {};
		clientConfig.checksumAlgorithms().forEach((checksumAlgorithm) => {
			runtimeConfig[checksumAlgorithm.algorithmId()] = checksumAlgorithm.checksumConstructor();
		});
		return runtimeConfig;
	};
}));
//#endregion
//#region node_modules/@smithy/types/dist-es/extensions/defaultClientConfiguration.js
var getDefaultClientConfiguration, resolveDefaultRuntimeConfig$1;
var init_defaultClientConfiguration = __esmMin((() => {
	init_checksum();
	getDefaultClientConfiguration = (runtimeConfig) => {
		return getChecksumConfiguration(runtimeConfig);
	};
	resolveDefaultRuntimeConfig$1 = (config) => {
		return resolveChecksumRuntimeConfig(config);
	};
}));
//#endregion
//#region node_modules/@smithy/types/dist-es/extensions/index.js
var init_extensions = __esmMin((() => {
	init_defaultClientConfiguration();
	init_checksum();
}));
//#endregion
//#region node_modules/@smithy/types/dist-es/http.js
var FieldPosition;
var init_http = __esmMin((() => {
	(function(FieldPosition) {
		FieldPosition[FieldPosition["HEADER"] = 0] = "HEADER";
		FieldPosition[FieldPosition["TRAILER"] = 1] = "TRAILER";
	})(FieldPosition || (FieldPosition = {}));
}));
//#endregion
//#region node_modules/@smithy/types/dist-es/middleware.js
var SMITHY_CONTEXT_KEY;
var init_middleware = __esmMin((() => {
	SMITHY_CONTEXT_KEY = "__smithy_context";
}));
//#endregion
//#region node_modules/@smithy/types/dist-es/profile.js
var IniSectionType;
var init_profile = __esmMin((() => {
	(function(IniSectionType) {
		IniSectionType["PROFILE"] = "profile";
		IniSectionType["SSO_SESSION"] = "sso-session";
		IniSectionType["SERVICES"] = "services";
	})(IniSectionType || (IniSectionType = {}));
}));
//#endregion
//#region node_modules/@smithy/types/dist-es/transfer.js
var RequestHandlerProtocol;
var init_transfer = __esmMin((() => {
	(function(RequestHandlerProtocol) {
		RequestHandlerProtocol["HTTP_0_9"] = "http/0.9";
		RequestHandlerProtocol["HTTP_1_0"] = "http/1.0";
		RequestHandlerProtocol["TDS_8_0"] = "tds/8.0";
	})(RequestHandlerProtocol || (RequestHandlerProtocol = {}));
}));
//#endregion
//#region node_modules/@smithy/types/dist-es/index.js
var dist_es_exports$5 = /* @__PURE__ */ __exportAll({
	AlgorithmId: () => AlgorithmId,
	EndpointURLScheme: () => EndpointURLScheme,
	FieldPosition: () => FieldPosition,
	HttpApiKeyAuthLocation: () => HttpApiKeyAuthLocation,
	HttpAuthLocation: () => HttpAuthLocation,
	IniSectionType: () => IniSectionType,
	RequestHandlerProtocol: () => RequestHandlerProtocol,
	SMITHY_CONTEXT_KEY: () => SMITHY_CONTEXT_KEY,
	getDefaultClientConfiguration: () => getDefaultClientConfiguration,
	resolveDefaultRuntimeConfig: () => resolveDefaultRuntimeConfig$1
});
var init_dist_es$3 = __esmMin((() => {
	init_auth();
	init_endpoint();
	init_extensions();
	init_http();
	init_middleware();
	init_profile();
	init_transfer();
}));
//#endregion
//#region node_modules/@smithy/core/dist-cjs/submodules/transport/index.js
var require_transport = /* @__PURE__ */ __commonJSMin(((exports) => {
	var { SMITHY_CONTEXT_KEY } = (init_dist_es$3(), __toCommonJS(dist_es_exports$5));
	var getSmithyContext = (context) => context[SMITHY_CONTEXT_KEY] || (context[SMITHY_CONTEXT_KEY] = {});
	var HttpRequest = class HttpRequest {
		method;
		protocol;
		hostname;
		port;
		path;
		query;
		headers;
		username;
		password;
		fragment;
		body;
		constructor(options) {
			this.method = options.method || "GET";
			this.hostname = options.hostname || "localhost";
			this.port = options.port;
			this.query = options.query || {};
			this.headers = options.headers || {};
			this.body = options.body;
			this.protocol = options.protocol ? options.protocol.slice(-1) !== ":" ? `${options.protocol}:` : options.protocol : "https:";
			this.path = options.path ? options.path.charAt(0) !== "/" ? `/${options.path}` : options.path : "/";
			this.username = options.username;
			this.password = options.password;
			this.fragment = options.fragment;
		}
		static clone(request) {
			const cloned = new HttpRequest({
				...request,
				headers: { ...request.headers }
			});
			if (cloned.query) cloned.query = cloneQuery(cloned.query);
			return cloned;
		}
		static isInstance(request) {
			if (!request) return false;
			const req = request;
			return "method" in req && "protocol" in req && "hostname" in req && "path" in req && typeof req["query"] === "object" && typeof req["headers"] === "object";
		}
		clone() {
			return HttpRequest.clone(this);
		}
	};
	function cloneQuery(query) {
		return Object.keys(query).reduce((carry, paramName) => {
			const param = query[paramName];
			return {
				...carry,
				[paramName]: Array.isArray(param) ? [...param] : param
			};
		}, {});
	}
	var HttpResponse = class {
		statusCode;
		reason;
		headers;
		body;
		constructor(options) {
			this.statusCode = options.statusCode;
			this.reason = options.reason;
			this.headers = options.headers || {};
			this.body = options.body;
		}
		static isInstance(response) {
			if (!response) return false;
			const resp = response;
			return typeof resp.statusCode === "number" && typeof resp.headers === "object";
		}
	};
	var VALID_HOST_LABEL_REGEX = new RegExp(`^(?!.*-$)(?!-)[a-zA-Z0-9-]{1,63}$`);
	var isValidHostLabel = (value, allowSubDomains = false) => {
		if (!allowSubDomains) return VALID_HOST_LABEL_REGEX.test(value);
		const labels = value.split(".");
		for (const label of labels) if (!isValidHostLabel(label)) return false;
		return true;
	};
	function isValidHostname(hostname) {
		return /^[a-z0-9][a-z0-9.-]*[a-z0-9]$/.test(hostname);
	}
	var normalizeProvider = (input) => {
		if (typeof input === "function") return input;
		const promisified = Promise.resolve(input);
		return () => promisified;
	};
	function parseQueryString(querystring) {
		const query = {};
		querystring = querystring.replace(/^\?/, "");
		if (querystring) for (const pair of querystring.split("&")) {
			let [key, value = null] = pair.split("=");
			key = decodeURIComponent(key);
			if (value) value = decodeURIComponent(value);
			if (!(key in query)) query[key] = value;
			else if (Array.isArray(query[key])) query[key].push(value);
			else query[key] = [query[key], value];
		}
		return query;
	}
	var parseUrl = (url) => {
		if (typeof url === "string") return parseUrl(new URL(url));
		const { hostname, pathname, port, protocol, search } = url;
		let query;
		if (search) query = parseQueryString(search);
		return {
			hostname,
			port: port ? parseInt(port) : void 0,
			protocol,
			path: pathname,
			query
		};
	};
	var toEndpointV1 = (endpoint) => {
		if (typeof endpoint === "object") {
			if ("url" in endpoint) {
				const v1Endpoint = parseUrl(endpoint.url);
				if (endpoint.headers) {
					v1Endpoint.headers = {};
					for (const name in endpoint.headers) v1Endpoint.headers[name.toLowerCase()] = endpoint.headers[name].join(", ");
				}
				return v1Endpoint;
			}
			return endpoint;
		}
		return parseUrl(endpoint);
	};
	exports.HttpRequest = HttpRequest;
	exports.HttpResponse = HttpResponse;
	exports.getSmithyContext = getSmithyContext;
	exports.isValidHostLabel = isValidHostLabel;
	exports.isValidHostname = isValidHostname;
	exports.normalizeProvider = normalizeProvider;
	exports.parseQueryString = parseQueryString;
	exports.parseUrl = parseUrl;
	exports.toEndpointV1 = toEndpointV1;
}));
//#endregion
//#region node_modules/@smithy/core/dist-cjs/submodules/schema/index.js
var require_schema = /* @__PURE__ */ __commonJSMin(((exports) => {
	var { getSmithyContext, HttpResponse, toEndpointV1 } = require_transport();
	var deref = (schemaRef) => {
		if (typeof schemaRef === "function") return schemaRef();
		return schemaRef;
	};
	var operation = (namespace, name, traits, input, output) => ({
		name,
		namespace,
		traits,
		input,
		output
	});
	var schemaDeserializationMiddleware = (config) => (next, context) => async (args) => {
		const { response } = await next(args);
		const { operationSchema } = getSmithyContext(context);
		const [, ns, n, t, i, o] = operationSchema ?? [];
		try {
			return {
				response,
				output: await config.protocol.deserializeResponse(operation(ns, n, t, i, o), {
					...config,
					...context
				}, response)
			};
		} catch (error) {
			Object.defineProperty(error, "$response", {
				value: response,
				enumerable: false,
				writable: false,
				configurable: false
			});
			if (!("$metadata" in error)) {
				const hint = `Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.`;
				try {
					error.message += "\n  " + hint;
				} catch (ignored) {
					if (!context.logger || context.logger?.constructor?.name === "NoOpLogger") console.warn(hint);
					else context.logger?.warn?.(hint);
				}
				if (typeof error.$responseBodyText !== "undefined") {
					if (error.$response) error.$response.body = error.$responseBodyText;
				}
				try {
					if (HttpResponse.isInstance(response)) {
						const { headers = {}, statusCode } = response;
						const headerEntries = Object.entries(headers);
						error.$metadata = {
							httpStatusCode: statusCode,
							requestId: findHeader(/^x-[\w-]+-request-?id$/, headerEntries),
							extendedRequestId: findHeader(/^x-[\w-]+-id-2$/, headerEntries),
							cfId: findHeader(/^x-[\w-]+-cf-id$/, headerEntries)
						};
					}
				} catch (ignored) {}
			}
			throw error;
		}
	};
	var findHeader = (pattern, headers) => {
		return (headers.find(([k]) => {
			return k.match(pattern);
		}) || [void 0, void 0])[1];
	};
	var schemaSerializationMiddleware = (config) => (next, context) => async (args) => {
		const { operationSchema } = getSmithyContext(context);
		const [, ns, n, t, i, o] = operationSchema ?? [];
		const endpoint = context.endpointV2 ? async () => toEndpointV1(context.endpointV2) : config.endpoint;
		const request = await config.protocol.serializeRequest(operation(ns, n, t, i, o), args.input, {
			...config,
			...context,
			endpoint
		});
		return next({
			...args,
			request
		});
	};
	var deserializerMiddlewareOption = {
		name: "deserializerMiddleware",
		step: "deserialize",
		tags: ["DESERIALIZER"],
		override: true
	};
	var serializerMiddlewareOption = {
		name: "serializerMiddleware",
		step: "serialize",
		tags: ["SERIALIZER"],
		override: true
	};
	function getSchemaSerdePlugin(config) {
		return { applyToStack: (commandStack) => {
			commandStack.add(schemaSerializationMiddleware(config), serializerMiddlewareOption);
			commandStack.add(schemaDeserializationMiddleware(config), deserializerMiddlewareOption);
			config.protocol.setSerdeContext(config);
		} };
	}
	var Schema = class {
		name;
		namespace;
		traits;
		static assign(instance, values) {
			return Object.assign(instance, values);
		}
		static [Symbol.hasInstance](lhs) {
			const isPrototype = this.prototype.isPrototypeOf(lhs);
			if (!isPrototype && typeof lhs === "object" && lhs !== null) return lhs.symbol === this.symbol;
			return isPrototype;
		}
		getName() {
			return this.namespace + "#" + this.name;
		}
	};
	var ListSchema = class ListSchema extends Schema {
		static symbol = Symbol.for("@smithy/lis");
		name;
		traits;
		valueSchema;
		symbol = ListSchema.symbol;
	};
	var list = (namespace, name, traits, valueSchema) => Schema.assign(new ListSchema(), {
		name,
		namespace,
		traits,
		valueSchema
	});
	var MapSchema = class MapSchema extends Schema {
		static symbol = Symbol.for("@smithy/map");
		name;
		traits;
		keySchema;
		valueSchema;
		symbol = MapSchema.symbol;
	};
	var map = (namespace, name, traits, keySchema, valueSchema) => Schema.assign(new MapSchema(), {
		name,
		namespace,
		traits,
		keySchema,
		valueSchema
	});
	var OperationSchema = class OperationSchema extends Schema {
		static symbol = Symbol.for("@smithy/ope");
		name;
		traits;
		input;
		output;
		symbol = OperationSchema.symbol;
	};
	var op = (namespace, name, traits, input, output) => Schema.assign(new OperationSchema(), {
		name,
		namespace,
		traits,
		input,
		output
	});
	var StructureSchema = class StructureSchema extends Schema {
		static symbol = Symbol.for("@smithy/str");
		name;
		traits;
		memberNames;
		memberList;
		symbol = StructureSchema.symbol;
	};
	var struct = (namespace, name, traits, memberNames, memberList) => Schema.assign(new StructureSchema(), {
		name,
		namespace,
		traits,
		memberNames,
		memberList
	});
	var ErrorSchema = class ErrorSchema extends StructureSchema {
		static symbol = Symbol.for("@smithy/err");
		ctor;
		symbol = ErrorSchema.symbol;
	};
	var error = (namespace, name, traits, memberNames, memberList, _ctor) => Schema.assign(new ErrorSchema(), {
		name,
		namespace,
		traits,
		memberNames,
		memberList,
		ctor: null
	});
	var traitsCache = [];
	function translateTraits(indicator) {
		if (typeof indicator === "object") return indicator;
		indicator = indicator | 0;
		if (traitsCache[indicator]) return traitsCache[indicator];
		const traits = {};
		let i = 0;
		for (const trait of [
			"httpLabel",
			"idempotent",
			"idempotencyToken",
			"sensitive",
			"httpPayload",
			"httpResponseCode",
			"httpQueryParams"
		]) if ((indicator >> i++ & 1) === 1) traits[trait] = 1;
		return traitsCache[indicator] = traits;
	}
	var anno = {
		it: Symbol.for("@smithy/nor-struct-it"),
		ns: Symbol.for("@smithy/ns")
	};
	var simpleSchemaCacheN = [];
	var simpleSchemaCacheS = {};
	var NormalizedSchema = class NormalizedSchema {
		ref;
		memberName;
		static symbol = Symbol.for("@smithy/nor");
		symbol = NormalizedSchema.symbol;
		name;
		schema;
		_isMemberSchema;
		traits;
		memberTraits;
		normalizedTraits;
		constructor(ref, memberName) {
			this.ref = ref;
			this.memberName = memberName;
			const traitStack = [];
			let _ref = ref;
			let schema = ref;
			this._isMemberSchema = false;
			while (isMemberSchema(_ref)) {
				traitStack.push(_ref[1]);
				_ref = _ref[0];
				schema = deref(_ref);
				this._isMemberSchema = true;
			}
			if (traitStack.length > 0) {
				this.memberTraits = {};
				for (let i = traitStack.length - 1; i >= 0; --i) {
					const traitSet = traitStack[i];
					Object.assign(this.memberTraits, translateTraits(traitSet));
				}
			} else this.memberTraits = 0;
			if (schema instanceof NormalizedSchema) {
				const computedMemberTraits = this.memberTraits;
				Object.assign(this, schema);
				this.memberTraits = Object.assign({}, computedMemberTraits, schema.getMemberTraits(), this.getMemberTraits());
				this.normalizedTraits = void 0;
				this.memberName = memberName ?? schema.memberName;
				return;
			}
			this.schema = deref(schema);
			if (isStaticSchema(this.schema)) {
				this.name = `${this.schema[1]}#${this.schema[2]}`;
				this.traits = this.schema[3];
			} else {
				this.name = this.memberName ?? String(schema);
				this.traits = 0;
			}
			if (this._isMemberSchema && !memberName) throw new Error(`@smithy/core/schema - NormalizedSchema member init ${this.getName(true)} missing member name.`);
		}
		static [Symbol.hasInstance](lhs) {
			const isPrototype = this.prototype.isPrototypeOf(lhs);
			if (!isPrototype && typeof lhs === "object" && lhs !== null) return lhs.symbol === this.symbol;
			return isPrototype;
		}
		static of(ref) {
			const keyAble = typeof ref === "function" || typeof ref === "object" && ref !== null;
			if (typeof ref === "number") {
				if (simpleSchemaCacheN[ref]) return simpleSchemaCacheN[ref];
			} else if (typeof ref === "string") {
				if (simpleSchemaCacheS[ref]) return simpleSchemaCacheS[ref];
			} else if (keyAble) {
				if (ref[anno.ns]) return ref[anno.ns];
			}
			const sc = deref(ref);
			if (sc instanceof NormalizedSchema) return sc;
			if (isMemberSchema(sc)) {
				const [ns, traits] = sc;
				if (ns instanceof NormalizedSchema) {
					Object.assign(ns.getMergedTraits(), translateTraits(traits));
					return ns;
				}
				throw new Error(`@smithy/core/schema - may not init unwrapped member schema=${JSON.stringify(ref, null, 2)}.`);
			}
			const ns = new NormalizedSchema(sc);
			if (keyAble) return ref[anno.ns] = ns;
			if (typeof sc === "string") return simpleSchemaCacheS[sc] = ns;
			if (typeof sc === "number") return simpleSchemaCacheN[sc] = ns;
			return ns;
		}
		getSchema() {
			const sc = this.schema;
			if (Array.isArray(sc) && sc[0] === 0) return sc[4];
			return sc;
		}
		getName(withNamespace = false) {
			const { name } = this;
			return !withNamespace && name && name.includes("#") ? name.split("#")[1] : name || void 0;
		}
		getMemberName() {
			return this.memberName;
		}
		isMemberSchema() {
			return this._isMemberSchema;
		}
		isListSchema() {
			const sc = this.getSchema();
			return typeof sc === "number" ? sc >= 64 && sc < 128 : sc[0] === 1;
		}
		isMapSchema() {
			const sc = this.getSchema();
			return typeof sc === "number" ? sc >= 128 && sc <= 255 : sc[0] === 2;
		}
		isStructSchema() {
			const sc = this.getSchema();
			if (typeof sc !== "object") return false;
			const id = sc[0];
			return id === 3 || id === -3 || id === 4;
		}
		isUnionSchema() {
			const sc = this.getSchema();
			if (typeof sc !== "object") return false;
			return sc[0] === 4;
		}
		isBlobSchema() {
			const sc = this.getSchema();
			return sc === 21 || sc === 42;
		}
		isTimestampSchema() {
			const sc = this.getSchema();
			return typeof sc === "number" && sc >= 4 && sc <= 7;
		}
		isUnitSchema() {
			return this.getSchema() === "unit";
		}
		isDocumentSchema() {
			return this.getSchema() === 15;
		}
		isStringSchema() {
			return this.getSchema() === 0;
		}
		isBooleanSchema() {
			return this.getSchema() === 2;
		}
		isNumericSchema() {
			return this.getSchema() === 1;
		}
		isBigIntegerSchema() {
			return this.getSchema() === 17;
		}
		isBigDecimalSchema() {
			return this.getSchema() === 19;
		}
		isStreaming() {
			const { streaming } = this.getMergedTraits();
			return !!streaming || this.getSchema() === 42;
		}
		isIdempotencyToken() {
			return !!this.getMergedTraits().idempotencyToken;
		}
		getMergedTraits() {
			return this.normalizedTraits ?? (this.normalizedTraits = {
				...this.getOwnTraits(),
				...this.getMemberTraits()
			});
		}
		getMemberTraits() {
			return translateTraits(this.memberTraits);
		}
		getOwnTraits() {
			return translateTraits(this.traits);
		}
		getKeySchema() {
			const [isDoc, isMap] = [this.isDocumentSchema(), this.isMapSchema()];
			if (!isDoc && !isMap) throw new Error(`@smithy/core/schema - cannot get key for non-map: ${this.getName(true)}`);
			const schema = this.getSchema();
			return member([isDoc ? 15 : schema[4] ?? 0, 0], "key");
		}
		getValueSchema() {
			const sc = this.getSchema();
			const [isDoc, isMap, isList] = [
				this.isDocumentSchema(),
				this.isMapSchema(),
				this.isListSchema()
			];
			const memberSchema = typeof sc === "number" ? 63 & sc : sc && typeof sc === "object" && (isMap || isList) ? sc[3 + sc[0]] : isDoc ? 15 : void 0;
			if (memberSchema != null) return member([memberSchema, 0], isMap ? "value" : "member");
			throw new Error(`@smithy/core/schema - ${this.getName(true)} has no value member.`);
		}
		getMemberSchema(memberName) {
			const struct = this.getSchema();
			if (this.isStructSchema() && struct[4].includes(memberName)) {
				const i = struct[4].indexOf(memberName);
				const memberSchema = struct[5][i];
				return member(isMemberSchema(memberSchema) ? memberSchema : [memberSchema, 0], memberName);
			}
			if (this.isDocumentSchema()) return member([15, 0], memberName);
			throw new Error(`@smithy/core/schema - ${this.getName(true)} has no member=${memberName}.`);
		}
		getMemberSchemas() {
			const buffer = {};
			try {
				for (const [k, v] of this.structIterator()) buffer[k] = v;
			} catch (ignored) {}
			return buffer;
		}
		getEventStreamMember() {
			if (this.isStructSchema()) {
				for (const [memberName, memberSchema] of this.structIterator()) if (memberSchema.isStreaming() && memberSchema.isStructSchema()) return memberName;
			}
			return "";
		}
		*structIterator() {
			if (this.isUnitSchema()) return;
			if (!this.isStructSchema()) throw new Error("@smithy/core/schema - cannot iterate non-struct schema.");
			const struct = this.getSchema();
			const z = struct[4].length;
			let it = struct[anno.it];
			if (it && z === it.length) {
				yield* it;
				return;
			}
			it = Array(z);
			for (let i = 0; i < z; ++i) {
				const k = struct[4][i];
				const v = member([struct[5][i], 0], k);
				yield it[i] = [k, v];
			}
			struct[anno.it] = it;
		}
	};
	function member(memberSchema, memberName) {
		if (memberSchema instanceof NormalizedSchema) return Object.assign(memberSchema, {
			memberName,
			_isMemberSchema: true
		});
		return new NormalizedSchema(memberSchema, memberName);
	}
	var isMemberSchema = (sc) => Array.isArray(sc) && sc.length === 2;
	var isStaticSchema = (sc) => Array.isArray(sc) && sc.length >= 5;
	var SimpleSchema = class SimpleSchema extends Schema {
		static symbol = Symbol.for("@smithy/sim");
		name;
		schemaRef;
		traits;
		symbol = SimpleSchema.symbol;
	};
	var sim = (namespace, name, schemaRef, traits) => Schema.assign(new SimpleSchema(), {
		name,
		namespace,
		traits,
		schemaRef
	});
	var simAdapter = (namespace, name, traits, schemaRef) => Schema.assign(new SimpleSchema(), {
		name,
		namespace,
		traits,
		schemaRef
	});
	var SCHEMA = {
		BLOB: 21,
		STREAMING_BLOB: 42,
		BOOLEAN: 2,
		STRING: 0,
		NUMERIC: 1,
		BIG_INTEGER: 17,
		BIG_DECIMAL: 19,
		DOCUMENT: 15,
		TIMESTAMP_DEFAULT: 4,
		TIMESTAMP_DATE_TIME: 5,
		TIMESTAMP_HTTP_DATE: 6,
		TIMESTAMP_EPOCH_SECONDS: 7,
		LIST_MODIFIER: 64,
		MAP_MODIFIER: 128
	};
	var TypeRegistry = class TypeRegistry {
		namespace;
		schemas;
		exceptions;
		static registries = /* @__PURE__ */ new Map();
		constructor(namespace, schemas = /* @__PURE__ */ new Map(), exceptions = /* @__PURE__ */ new Map()) {
			this.namespace = namespace;
			this.schemas = schemas;
			this.exceptions = exceptions;
		}
		static for(namespace) {
			if (!TypeRegistry.registries.has(namespace)) TypeRegistry.registries.set(namespace, new TypeRegistry(namespace));
			return TypeRegistry.registries.get(namespace);
		}
		copyFrom(other) {
			const { schemas, exceptions } = this;
			for (const [k, v] of other.schemas) if (!schemas.has(k)) schemas.set(k, v);
			for (const [k, v] of other.exceptions) if (!exceptions.has(k)) exceptions.set(k, v);
		}
		register(shapeId, schema) {
			const qualifiedName = this.normalizeShapeId(shapeId);
			for (const r of [this, TypeRegistry.for(qualifiedName.split("#")[0])]) r.schemas.set(qualifiedName, schema);
		}
		getSchema(shapeId) {
			const id = this.normalizeShapeId(shapeId);
			if (!this.schemas.has(id)) {
				if (!shapeId.includes("#")) {
					const suffix = "#" + shapeId;
					const candidates = [];
					for (const [shapeId, schema] of this.schemas.entries()) if (shapeId.endsWith(suffix)) candidates.push(schema);
					if (candidates.length === 1) return candidates[0];
				}
				throw new Error(`@smithy/core/schema - schema not found for ${id}`);
			}
			return this.schemas.get(id);
		}
		registerError(es, ctor) {
			const $error = es;
			const ns = $error[1];
			for (const r of [this, TypeRegistry.for(ns)]) {
				r.schemas.set(ns + "#" + $error[2], $error);
				r.exceptions.set($error, ctor);
			}
		}
		getErrorCtor(es) {
			const $error = es;
			if (this.exceptions.has($error)) return this.exceptions.get($error);
			return TypeRegistry.for($error[1]).exceptions.get($error);
		}
		getBaseException() {
			for (const exceptionKey of this.exceptions.keys()) if (Array.isArray(exceptionKey)) {
				const [, ns, name] = exceptionKey;
				const id = ns + "#" + name;
				if (id.startsWith("smithy.ts.sdk.synthetic.") && id.endsWith("ServiceException")) return exceptionKey;
			}
		}
		find(predicate) {
			for (const schema of this.schemas.values()) if (predicate(schema)) return schema;
		}
		clear() {
			this.schemas.clear();
			this.exceptions.clear();
		}
		normalizeShapeId(shapeId) {
			if (shapeId.includes("#")) return shapeId;
			return this.namespace + "#" + shapeId;
		}
	};
	exports.ErrorSchema = ErrorSchema;
	exports.ListSchema = ListSchema;
	exports.MapSchema = MapSchema;
	exports.NormalizedSchema = NormalizedSchema;
	exports.OperationSchema = OperationSchema;
	exports.SCHEMA = SCHEMA;
	exports.Schema = Schema;
	exports.SimpleSchema = SimpleSchema;
	exports.StructureSchema = StructureSchema;
	exports.TypeRegistry = TypeRegistry;
	exports.deref = deref;
	exports.deserializerMiddlewareOption = deserializerMiddlewareOption;
	exports.error = error;
	exports.getSchemaSerdePlugin = getSchemaSerdePlugin;
	exports.isStaticSchema = isStaticSchema;
	exports.list = list;
	exports.map = map;
	exports.op = op;
	exports.operation = operation;
	exports.serializerMiddlewareOption = serializerMiddlewareOption;
	exports.sim = sim;
	exports.simAdapter = simAdapter;
	exports.simpleSchemaCacheN = simpleSchemaCacheN;
	exports.simpleSchemaCacheS = simpleSchemaCacheS;
	exports.struct = struct;
	exports.traitsCache = traitsCache;
	exports.translateTraits = translateTraits;
}));
//#endregion
//#region node_modules/@smithy/core/dist-cjs/submodules/client/index.js
var require_client$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var { getSmithyContext, normalizeProvider } = require_transport();
	exports.getSmithyContext = getSmithyContext;
	exports.normalizeProvider = normalizeProvider;
	var { SMITHY_CONTEXT_KEY, AlgorithmId } = (init_dist_es$3(), __toCommonJS(dist_es_exports$5));
	exports.AlgorithmId = AlgorithmId;
	var { NormalizedSchema } = require_schema();
	var getAllAliases = (name, aliases) => {
		const _aliases = [];
		if (name) _aliases.push(name);
		if (aliases) for (const alias of aliases) _aliases.push(alias);
		return _aliases;
	};
	var getMiddlewareNameWithAliases = (name, aliases) => {
		return `${name || "anonymous"}${aliases && aliases.length > 0 ? ` (a.k.a. ${aliases.join(",")})` : ""}`;
	};
	var constructStack = () => {
		let absoluteEntries = [];
		let relativeEntries = [];
		let identifyOnResolve = false;
		const entriesNameSet = /* @__PURE__ */ new Set();
		const sort = (entries) => entries.sort((a, b) => stepWeights[b.step] - stepWeights[a.step] || priorityWeights[b.priority || "normal"] - priorityWeights[a.priority || "normal"]);
		const removeByName = (toRemove) => {
			let isRemoved = false;
			const filterCb = (entry) => {
				const aliases = getAllAliases(entry.name, entry.aliases);
				if (aliases.includes(toRemove)) {
					isRemoved = true;
					for (const alias of aliases) entriesNameSet.delete(alias);
					return false;
				}
				return true;
			};
			absoluteEntries = absoluteEntries.filter(filterCb);
			relativeEntries = relativeEntries.filter(filterCb);
			return isRemoved;
		};
		const removeByReference = (toRemove) => {
			let isRemoved = false;
			const filterCb = (entry) => {
				if (entry.middleware === toRemove) {
					isRemoved = true;
					for (const alias of getAllAliases(entry.name, entry.aliases)) entriesNameSet.delete(alias);
					return false;
				}
				return true;
			};
			absoluteEntries = absoluteEntries.filter(filterCb);
			relativeEntries = relativeEntries.filter(filterCb);
			return isRemoved;
		};
		const cloneTo = (toStack) => {
			absoluteEntries.forEach((entry) => {
				toStack.add(entry.middleware, { ...entry });
			});
			relativeEntries.forEach((entry) => {
				toStack.addRelativeTo(entry.middleware, { ...entry });
			});
			toStack.identifyOnResolve?.(stack.identifyOnResolve());
			return toStack;
		};
		const expandRelativeMiddlewareList = (from) => {
			const expandedMiddlewareList = [];
			from.before.forEach((entry) => {
				if (entry.before.length === 0 && entry.after.length === 0) expandedMiddlewareList.push(entry);
				else expandedMiddlewareList.push(...expandRelativeMiddlewareList(entry));
			});
			expandedMiddlewareList.push(from);
			from.after.reverse().forEach((entry) => {
				if (entry.before.length === 0 && entry.after.length === 0) expandedMiddlewareList.push(entry);
				else expandedMiddlewareList.push(...expandRelativeMiddlewareList(entry));
			});
			return expandedMiddlewareList;
		};
		const getMiddlewareList = (debug = false) => {
			const normalizedAbsoluteEntries = [];
			const normalizedRelativeEntries = [];
			const normalizedEntriesNameMap = {};
			absoluteEntries.forEach((entry) => {
				const normalizedEntry = {
					...entry,
					before: [],
					after: []
				};
				for (const alias of getAllAliases(normalizedEntry.name, normalizedEntry.aliases)) normalizedEntriesNameMap[alias] = normalizedEntry;
				normalizedAbsoluteEntries.push(normalizedEntry);
			});
			relativeEntries.forEach((entry) => {
				const normalizedEntry = {
					...entry,
					before: [],
					after: []
				};
				for (const alias of getAllAliases(normalizedEntry.name, normalizedEntry.aliases)) normalizedEntriesNameMap[alias] = normalizedEntry;
				normalizedRelativeEntries.push(normalizedEntry);
			});
			normalizedRelativeEntries.forEach((entry) => {
				if (entry.toMiddleware) {
					const toMiddleware = normalizedEntriesNameMap[entry.toMiddleware];
					if (toMiddleware === void 0) {
						if (debug) return;
						throw new Error(`${entry.toMiddleware} is not found when adding ${getMiddlewareNameWithAliases(entry.name, entry.aliases)} middleware ${entry.relation} ${entry.toMiddleware}`);
					}
					if (entry.relation === "after") toMiddleware.after.push(entry);
					if (entry.relation === "before") toMiddleware.before.push(entry);
				}
			});
			return sort(normalizedAbsoluteEntries).map(expandRelativeMiddlewareList).reduce((wholeList, expandedMiddlewareList) => {
				wholeList.push(...expandedMiddlewareList);
				return wholeList;
			}, []);
		};
		const stack = {
			add: (middleware, options = {}) => {
				const { name, override, aliases: _aliases } = options;
				const entry = {
					step: "initialize",
					priority: "normal",
					middleware,
					...options
				};
				const aliases = getAllAliases(name, _aliases);
				if (aliases.length > 0) {
					if (aliases.some((alias) => entriesNameSet.has(alias))) {
						if (!override) throw new Error(`Duplicate middleware name '${getMiddlewareNameWithAliases(name, _aliases)}'`);
						for (const alias of aliases) {
							const toOverrideIndex = absoluteEntries.findIndex((entry) => entry.name === alias || entry.aliases?.some((a) => a === alias));
							if (toOverrideIndex === -1) continue;
							const toOverride = absoluteEntries[toOverrideIndex];
							if (toOverride.step !== entry.step || entry.priority !== toOverride.priority) throw new Error(`"${getMiddlewareNameWithAliases(toOverride.name, toOverride.aliases)}" middleware with ${toOverride.priority} priority in ${toOverride.step} step cannot be overridden by "${getMiddlewareNameWithAliases(name, _aliases)}" middleware with ${entry.priority} priority in ${entry.step} step.`);
							absoluteEntries.splice(toOverrideIndex, 1);
						}
					}
					for (const alias of aliases) entriesNameSet.add(alias);
				}
				absoluteEntries.push(entry);
			},
			addRelativeTo: (middleware, options) => {
				const { name, override, aliases: _aliases } = options;
				const entry = {
					middleware,
					...options
				};
				const aliases = getAllAliases(name, _aliases);
				if (aliases.length > 0) {
					if (aliases.some((alias) => entriesNameSet.has(alias))) {
						if (!override) throw new Error(`Duplicate middleware name '${getMiddlewareNameWithAliases(name, _aliases)}'`);
						for (const alias of aliases) {
							const toOverrideIndex = relativeEntries.findIndex((entry) => entry.name === alias || entry.aliases?.some((a) => a === alias));
							if (toOverrideIndex === -1) continue;
							const toOverride = relativeEntries[toOverrideIndex];
							if (toOverride.toMiddleware !== entry.toMiddleware || toOverride.relation !== entry.relation) throw new Error(`"${getMiddlewareNameWithAliases(toOverride.name, toOverride.aliases)}" middleware ${toOverride.relation} "${toOverride.toMiddleware}" middleware cannot be overridden by "${getMiddlewareNameWithAliases(name, _aliases)}" middleware ${entry.relation} "${entry.toMiddleware}" middleware.`);
							relativeEntries.splice(toOverrideIndex, 1);
						}
					}
					for (const alias of aliases) entriesNameSet.add(alias);
				}
				relativeEntries.push(entry);
			},
			clone: () => cloneTo(constructStack()),
			use: (plugin) => {
				plugin.applyToStack(stack);
			},
			remove: (toRemove) => {
				if (typeof toRemove === "string") return removeByName(toRemove);
				else return removeByReference(toRemove);
			},
			removeByTag: (toRemove) => {
				let isRemoved = false;
				const filterCb = (entry) => {
					const { tags, name, aliases: _aliases } = entry;
					if (tags && tags.includes(toRemove)) {
						const aliases = getAllAliases(name, _aliases);
						for (const alias of aliases) entriesNameSet.delete(alias);
						isRemoved = true;
						return false;
					}
					return true;
				};
				absoluteEntries = absoluteEntries.filter(filterCb);
				relativeEntries = relativeEntries.filter(filterCb);
				return isRemoved;
			},
			concat: (from) => {
				const cloned = cloneTo(constructStack());
				cloned.use(from);
				cloned.identifyOnResolve(identifyOnResolve || cloned.identifyOnResolve() || (from.identifyOnResolve?.() ?? false));
				return cloned;
			},
			applyToStack: cloneTo,
			identify: () => {
				return getMiddlewareList(true).map((mw) => {
					const step = mw.step ?? mw.relation + " " + mw.toMiddleware;
					return getMiddlewareNameWithAliases(mw.name, mw.aliases) + " - " + step;
				});
			},
			identifyOnResolve(toggle) {
				if (typeof toggle === "boolean") identifyOnResolve = toggle;
				return identifyOnResolve;
			},
			resolve: (handler, context) => {
				for (const middleware of getMiddlewareList().map((entry) => entry.middleware).reverse()) handler = middleware(handler, context);
				if (identifyOnResolve) console.log(stack.identify());
				return handler;
			}
		};
		return stack;
	};
	var stepWeights = {
		initialize: 5,
		serialize: 4,
		build: 3,
		finalizeRequest: 2,
		deserialize: 1
	};
	var priorityWeights = {
		high: 3,
		normal: 2,
		low: 1
	};
	var invalidFunction = (message) => () => {
		throw new Error(message);
	};
	var invalidProvider = (message) => () => Promise.reject(message);
	var getCircularReplacer = () => {
		const seen = /* @__PURE__ */ new WeakSet();
		return (key, value) => {
			if (typeof value === "object" && value !== null) {
				if (seen.has(value)) return "[Circular]";
				seen.add(value);
			}
			return value;
		};
	};
	var sleep = (seconds) => {
		return new Promise((resolve) => setTimeout(resolve, seconds * 1e3));
	};
	var waiterServiceDefaults = {
		minDelay: 2,
		maxDelay: 120
	};
	var WaiterState;
	(function(WaiterState) {
		WaiterState["ABORTED"] = "ABORTED";
		WaiterState["FAILURE"] = "FAILURE";
		WaiterState["SUCCESS"] = "SUCCESS";
		WaiterState["RETRY"] = "RETRY";
		WaiterState["TIMEOUT"] = "TIMEOUT";
	})(WaiterState || (WaiterState = {}));
	var checkExceptions = (result) => {
		if (result.state === WaiterState.ABORTED) {
			const abortError = /* @__PURE__ */ new Error(`${JSON.stringify({
				...result,
				reason: "Request was aborted"
			}, getCircularReplacer())}`);
			abortError.name = "AbortError";
			throw abortError;
		} else if (result.state === WaiterState.TIMEOUT) {
			const timeoutError = /* @__PURE__ */ new Error(`${JSON.stringify({
				...result,
				reason: "Waiter has timed out"
			}, getCircularReplacer())}`);
			timeoutError.name = "TimeoutError";
			throw timeoutError;
		} else if (result.state !== WaiterState.SUCCESS) throw new Error(`${JSON.stringify(result, getCircularReplacer())}`);
		return result;
	};
	var runPolling = async ({ minDelay, maxDelay, maxWaitTime, abortController, client, abortSignal }, input, acceptorChecks) => {
		const observedResponses = {};
		const [minDelayMs, maxDelayMs] = [minDelay * 1e3, maxDelay * 1e3];
		let currentAttempt = 0;
		const waitUntil = Date.now() + maxWaitTime * 1e3;
		const warn403Time = Date.now() + 6e4;
		let didWarn403 = false;
		while (true) {
			if (currentAttempt > 0) {
				const delayMs = exponentialBackoffWithJitter(minDelayMs, maxDelayMs, currentAttempt, waitUntil);
				if (abortController?.signal?.aborted || abortSignal?.aborted) {
					const message = "AbortController signal aborted.";
					observedResponses[message] |= 0;
					observedResponses[message] += 1;
					return {
						state: WaiterState.ABORTED,
						observedResponses
					};
				}
				if (Date.now() + delayMs > waitUntil) return {
					state: WaiterState.TIMEOUT,
					observedResponses
				};
				await sleep(delayMs / 1e3);
			}
			const { state, reason } = await acceptorChecks(client, input);
			if (reason) {
				const message = createMessageFromResponse(reason);
				observedResponses[message] |= 0;
				observedResponses[message] += 1;
			}
			if (state !== WaiterState.RETRY) return {
				state,
				reason,
				final: reason,
				observedResponses
			};
			currentAttempt += 1;
			if (!didWarn403 && Date.now() >= warn403Time) {
				checkWarn403(observedResponses, client);
				didWarn403 = true;
			}
		}
	};
	var checkWarn403 = (observedResponses = {}, client) => {
		const orderedErrors = Object.keys(observedResponses);
		let count403 = 0;
		for (const response of orderedErrors) {
			const n = observedResponses[response] | 0;
			if (response.startsWith("403:")) count403 += n;
		}
		const clientLogger = client?.config?.logger;
		const warningLogger = typeof clientLogger?.warn === "function" && !clientLogger.constructor?.name?.includes?.("NoOpLogger") ? clientLogger : console;
		if (count403 >= 3 || orderedErrors[orderedErrors.length - 1]?.startsWith("403:")) warningLogger.warn(`@smithy/util-waiter WARN - 403 status code encountered during waiter polling.`);
	};
	var createMessageFromResponse = (reason) => {
		const status = reason?.$response?.statusCode ?? reason?.$metadata?.httpStatusCode;
		if (reason?.$responseBodyText) return `${status ? status + ": " : ""}Deserialization error for body: ${reason.$responseBodyText}`;
		if (status) {
			if (reason?.$response || reason?.message) return `${status ?? "Unknown"}: ${reason?.message}`;
			return `${status}: OK`;
		}
		return String(reason?.message ?? JSON.stringify(reason, getCircularReplacer()) ?? "Unknown");
	};
	var exponentialBackoffWithJitter = (minDelayMs, maxDelayMs, attempt, waitUntil) => {
		if (attempt > Math.log(maxDelayMs / minDelayMs) / Math.log(2) + 1) return maxDelayMs;
		const delay = minDelayMs * 2 ** (attempt - 1);
		const waitFor = randomInRange(minDelayMs, Math.min(delay, maxDelayMs));
		if (Date.now() + waitFor > waitUntil) {
			const timeRemaining = waitUntil - Date.now();
			return Math.max(0, timeRemaining - 500);
		}
		return waitFor;
	};
	var randomInRange = (min, max) => min + Math.random() * (max - min);
	var validateWaiterOptions = (options) => {
		if (options.maxWaitTime <= 0) throw new Error(`WaiterConfiguration.maxWaitTime must be greater than 0`);
		else if (options.minDelay <= 0) throw new Error(`WaiterConfiguration.minDelay must be greater than 0`);
		else if (options.maxDelay <= 0) throw new Error(`WaiterConfiguration.maxDelay must be greater than 0`);
		else if (options.maxWaitTime <= options.minDelay) throw new Error(`WaiterConfiguration.maxWaitTime [${options.maxWaitTime}] must be greater than WaiterConfiguration.minDelay [${options.minDelay}] for this waiter`);
		else if (options.maxDelay < options.minDelay) throw new Error(`WaiterConfiguration.maxDelay [${options.maxDelay}] must be greater than WaiterConfiguration.minDelay [${options.minDelay}] for this waiter`);
	};
	var abortTimeout = (abortSignal) => {
		let onAbort;
		return {
			clearListener() {
				if (typeof abortSignal.removeEventListener === "function") abortSignal.removeEventListener("abort", onAbort);
			},
			aborted: new Promise((resolve) => {
				onAbort = () => resolve({ state: WaiterState.ABORTED });
				if (typeof abortSignal.addEventListener === "function") abortSignal.addEventListener("abort", onAbort);
				else abortSignal.onabort = onAbort;
			})
		};
	};
	var createWaiter = async (options, input, acceptorChecks) => {
		const params = {
			...waiterServiceDefaults,
			...options
		};
		validateWaiterOptions(params);
		const exitConditions = [runPolling(params, input, acceptorChecks)];
		const finalize = [];
		if (options.abortSignal) {
			const { aborted, clearListener } = abortTimeout(options.abortSignal);
			finalize.push(clearListener);
			exitConditions.push(aborted);
		}
		if (options.abortController?.signal) {
			const { aborted, clearListener } = abortTimeout(options.abortController.signal);
			finalize.push(clearListener);
			exitConditions.push(aborted);
		}
		return Promise.race(exitConditions).then((result) => {
			for (const fn of finalize) fn();
			return result;
		});
	};
	var Client = class {
		config;
		middlewareStack = constructStack();
		initConfig;
		handlers;
		constructor(config) {
			this.config = config;
			const { protocol, protocolSettings } = config;
			if (protocolSettings) {
				if (typeof protocol === "function") config.protocol = new protocol(protocolSettings);
			}
		}
		send(command, optionsOrCb, cb) {
			const options = typeof optionsOrCb !== "function" ? optionsOrCb : void 0;
			const callback = typeof optionsOrCb === "function" ? optionsOrCb : cb;
			const useHandlerCache = options === void 0 && this.config.cacheMiddleware === true;
			let handler;
			if (useHandlerCache) {
				if (!this.handlers) this.handlers = /* @__PURE__ */ new WeakMap();
				const handlers = this.handlers;
				if (handlers.has(command.constructor)) handler = handlers.get(command.constructor);
				else {
					handler = command.resolveMiddleware(this.middlewareStack, this.config, options);
					handlers.set(command.constructor, handler);
				}
			} else {
				delete this.handlers;
				handler = command.resolveMiddleware(this.middlewareStack, this.config, options);
			}
			if (callback) handler(command).then((result) => callback(null, result.output), (err) => callback(err)).catch(() => {});
			else return handler(command).then((result) => result.output);
		}
		destroy() {
			this.config?.requestHandler?.destroy?.();
			delete this.handlers;
		}
	};
	var SENSITIVE_STRING$1 = "***SensitiveInformation***";
	function schemaLogFilter(schema, data) {
		if (data == null) return data;
		const ns = NormalizedSchema.of(schema);
		if (ns.getMergedTraits().sensitive) return SENSITIVE_STRING$1;
		if (ns.isListSchema()) {
			if (!!ns.getValueSchema().getMergedTraits().sensitive) return SENSITIVE_STRING$1;
		} else if (ns.isMapSchema()) {
			if (!!ns.getKeySchema().getMergedTraits().sensitive || !!ns.getValueSchema().getMergedTraits().sensitive) return SENSITIVE_STRING$1;
		} else if (ns.isStructSchema() && typeof data === "object") {
			const object = data;
			const newObject = {};
			for (const [member, memberNs] of ns.structIterator()) if (object[member] != null) newObject[member] = schemaLogFilter(memberNs, object[member]);
			return newObject;
		}
		return data;
	}
	var Command = class {
		middlewareStack = constructStack();
		schema;
		static classBuilder() {
			return new ClassBuilder();
		}
		resolveMiddlewareWithContext(clientStack, configuration, options, { middlewareFn, clientName, commandName, inputFilterSensitiveLog, outputFilterSensitiveLog, smithyContext, additionalContext, CommandCtor }) {
			for (const mw of middlewareFn.bind(this)(CommandCtor, clientStack, configuration, options)) this.middlewareStack.use(mw);
			const stack = clientStack.concat(this.middlewareStack);
			const { logger } = configuration;
			const handlerExecutionContext = {
				logger,
				clientName,
				commandName,
				inputFilterSensitiveLog,
				outputFilterSensitiveLog,
				[SMITHY_CONTEXT_KEY]: {
					commandInstance: this,
					...smithyContext
				},
				...additionalContext
			};
			const { requestHandler } = configuration;
			let requestOptions = options ?? {};
			if (smithyContext.eventStream) requestOptions = {
				isEventStream: true,
				...requestOptions
			};
			return stack.resolve((request) => requestHandler.handle(request.request, requestOptions), handlerExecutionContext);
		}
	};
	var ClassBuilder = class {
		_init = () => {};
		_ep = {};
		_middlewareFn = () => [];
		_commandName = "";
		_clientName = "";
		_additionalContext = {};
		_smithyContext = {};
		_inputFilterSensitiveLog = void 0;
		_outputFilterSensitiveLog = void 0;
		_serializer = null;
		_deserializer = null;
		_operationSchema;
		init(cb) {
			this._init = cb;
		}
		ep(endpointParameterInstructions) {
			this._ep = endpointParameterInstructions;
			return this;
		}
		m(middlewareSupplier) {
			this._middlewareFn = middlewareSupplier;
			return this;
		}
		s(service, operation, smithyContext = {}) {
			this._smithyContext = {
				service,
				operation,
				...smithyContext
			};
			return this;
		}
		c(additionalContext = {}) {
			this._additionalContext = additionalContext;
			return this;
		}
		n(clientName, commandName) {
			this._clientName = clientName;
			this._commandName = commandName;
			return this;
		}
		f(inputFilter = (_) => _, outputFilter = (_) => _) {
			this._inputFilterSensitiveLog = inputFilter;
			this._outputFilterSensitiveLog = outputFilter;
			return this;
		}
		ser(serializer) {
			this._serializer = serializer;
			return this;
		}
		de(deserializer) {
			this._deserializer = deserializer;
			return this;
		}
		sc(operation) {
			this._operationSchema = operation;
			this._smithyContext.operationSchema = operation;
			return this;
		}
		build() {
			const closure = this;
			let CommandRef;
			return CommandRef = class extends Command {
				input;
				static getEndpointParameterInstructions() {
					return closure._ep;
				}
				constructor(...[input]) {
					super();
					this.input = input ?? {};
					closure._init(this);
					this.schema = closure._operationSchema;
				}
				resolveMiddleware(stack, configuration, options) {
					const op = closure._operationSchema;
					const input = op?.[4] ?? op?.input;
					const output = op?.[5] ?? op?.output;
					return this.resolveMiddlewareWithContext(stack, configuration, options, {
						CommandCtor: CommandRef,
						middlewareFn: closure._middlewareFn,
						clientName: closure._clientName,
						commandName: closure._commandName,
						inputFilterSensitiveLog: closure._inputFilterSensitiveLog ?? (op ? schemaLogFilter.bind(null, input) : (_) => _),
						outputFilterSensitiveLog: closure._outputFilterSensitiveLog ?? (op ? schemaLogFilter.bind(null, output) : (_) => _),
						smithyContext: closure._smithyContext,
						additionalContext: closure._additionalContext
					});
				}
				serialize = closure._serializer;
				deserialize = closure._deserializer;
			};
		}
	};
	var SENSITIVE_STRING = "***SensitiveInformation***";
	var createAggregatedClient = (commands, Client, options) => {
		for (const [command, CommandCtor] of Object.entries(commands)) {
			const methodImpl = async function(args, optionsOrCb, cb) {
				const command = new CommandCtor(args);
				if (typeof optionsOrCb === "function") this.send(command, optionsOrCb);
				else if (typeof cb === "function") {
					if (typeof optionsOrCb !== "object") throw new Error(`Expected http options but got ${typeof optionsOrCb}`);
					this.send(command, optionsOrCb || {}, cb);
				} else return this.send(command, optionsOrCb);
			};
			const methodName = (command[0].toLowerCase() + command.slice(1)).replace(/Command$/, "");
			Client.prototype[methodName] = methodImpl;
		}
		const { paginators = {}, waiters = {} } = options ?? {};
		for (const [paginatorName, paginatorFn] of Object.entries(paginators)) if (Client.prototype[paginatorName] === void 0) Client.prototype[paginatorName] = function(commandInput = {}, paginationConfiguration, ...rest) {
			return paginatorFn({
				...paginationConfiguration,
				client: this
			}, commandInput, ...rest);
		};
		for (const [waiterName, waiterFn] of Object.entries(waiters)) if (Client.prototype[waiterName] === void 0) Client.prototype[waiterName] = async function(commandInput = {}, waiterConfiguration, ...rest) {
			let config = waiterConfiguration;
			if (typeof waiterConfiguration === "number") config = { maxWaitTime: waiterConfiguration };
			return waiterFn({
				...config,
				client: this
			}, commandInput, ...rest);
		};
	};
	var ServiceException = class ServiceException extends Error {
		$fault;
		$response;
		$retryable;
		$metadata;
		constructor(options) {
			super(options.message);
			Object.setPrototypeOf(this, Object.getPrototypeOf(this).constructor.prototype);
			this.name = options.name;
			this.$fault = options.$fault;
			this.$metadata = options.$metadata;
		}
		static isInstance(value) {
			if (!value) return false;
			const candidate = value;
			return ServiceException.prototype.isPrototypeOf(candidate) || Boolean(candidate.$fault) && Boolean(candidate.$metadata) && (candidate.$fault === "client" || candidate.$fault === "server");
		}
		static [Symbol.hasInstance](instance) {
			if (!instance) return false;
			const candidate = instance;
			if (this === ServiceException) return ServiceException.isInstance(instance);
			if (ServiceException.isInstance(instance)) {
				if (candidate.name && this.name) return this.prototype.isPrototypeOf(instance) || candidate.name === this.name;
				return this.prototype.isPrototypeOf(instance);
			}
			return false;
		}
	};
	var decorateServiceException = (exception, additions = {}) => {
		Object.entries(additions).filter(([, v]) => v !== void 0).forEach(([k, v]) => {
			if (exception[k] == void 0 || exception[k] === "") exception[k] = v;
		});
		exception.message = exception.message || exception.Message || "UnknownError";
		delete exception.Message;
		return exception;
	};
	var throwDefaultError = ({ output, parsedBody, exceptionCtor, errorCode }) => {
		const $metadata = deserializeMetadata(output);
		const statusCode = $metadata.httpStatusCode ? $metadata.httpStatusCode + "" : void 0;
		throw decorateServiceException(new exceptionCtor({
			name: parsedBody?.code || parsedBody?.Code || errorCode || statusCode || "UnknownError",
			$fault: "client",
			$metadata
		}), parsedBody);
	};
	var withBaseException = (ExceptionCtor) => {
		return ({ output, parsedBody, errorCode }) => {
			throwDefaultError({
				output,
				parsedBody,
				exceptionCtor: ExceptionCtor,
				errorCode
			});
		};
	};
	var deserializeMetadata = (output) => ({
		httpStatusCode: output.statusCode,
		requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
		extendedRequestId: output.headers["x-amz-id-2"],
		cfId: output.headers["x-amz-cf-id"]
	});
	var loadConfigsForDefaultMode = (mode) => {
		switch (mode) {
			case "standard": return {
				retryMode: "standard",
				connectionTimeout: 3100
			};
			case "in-region": return {
				retryMode: "standard",
				connectionTimeout: 1100
			};
			case "cross-region": return {
				retryMode: "standard",
				connectionTimeout: 3100
			};
			case "mobile": return {
				retryMode: "standard",
				connectionTimeout: 3e4
			};
			default: return {};
		}
	};
	var warningEmitted = false;
	var emitWarningIfUnsupportedVersion = (version) => {
		if (version && !warningEmitted && parseInt(version.substring(1, version.indexOf("."))) < 16) warningEmitted = true;
	};
	var knownAlgorithms = Object.values(AlgorithmId);
	var getChecksumConfiguration = (runtimeConfig) => {
		const checksumAlgorithms = [];
		for (const id in AlgorithmId) {
			const algorithmId = AlgorithmId[id];
			if (runtimeConfig[algorithmId] === void 0) continue;
			checksumAlgorithms.push({
				algorithmId: () => algorithmId,
				checksumConstructor: () => runtimeConfig[algorithmId]
			});
		}
		for (const [id, ChecksumCtor] of Object.entries(runtimeConfig.checksumAlgorithms ?? {})) checksumAlgorithms.push({
			algorithmId: () => id,
			checksumConstructor: () => ChecksumCtor
		});
		return {
			addChecksumAlgorithm(algo) {
				runtimeConfig.checksumAlgorithms = runtimeConfig.checksumAlgorithms ?? {};
				const id = algo.algorithmId();
				const ctor = algo.checksumConstructor();
				if (knownAlgorithms.includes(id)) runtimeConfig.checksumAlgorithms[id.toUpperCase()] = ctor;
				else runtimeConfig.checksumAlgorithms[id] = ctor;
				checksumAlgorithms.push(algo);
			},
			checksumAlgorithms() {
				return checksumAlgorithms;
			}
		};
	};
	var resolveChecksumRuntimeConfig = (clientConfig) => {
		const runtimeConfig = {};
		clientConfig.checksumAlgorithms().forEach((checksumAlgorithm) => {
			const id = checksumAlgorithm.algorithmId();
			if (knownAlgorithms.includes(id)) runtimeConfig[id] = checksumAlgorithm.checksumConstructor();
		});
		return runtimeConfig;
	};
	var getRetryConfiguration = (runtimeConfig) => {
		return {
			setRetryStrategy(retryStrategy) {
				runtimeConfig.retryStrategy = retryStrategy;
			},
			retryStrategy() {
				return runtimeConfig.retryStrategy;
			}
		};
	};
	var resolveRetryRuntimeConfig = (retryStrategyConfiguration) => {
		const runtimeConfig = {};
		runtimeConfig.retryStrategy = retryStrategyConfiguration.retryStrategy();
		return runtimeConfig;
	};
	var getDefaultExtensionConfiguration = (runtimeConfig) => {
		return Object.assign(getChecksumConfiguration(runtimeConfig), getRetryConfiguration(runtimeConfig));
	};
	var getDefaultClientConfiguration = getDefaultExtensionConfiguration;
	var resolveDefaultRuntimeConfig = (config) => {
		return Object.assign(resolveChecksumRuntimeConfig(config), resolveRetryRuntimeConfig(config));
	};
	var getArrayIfSingleItem = (mayBeArray) => Array.isArray(mayBeArray) ? mayBeArray : [mayBeArray];
	var getValueFromTextNode = (obj) => {
		const textNodeName = "#text";
		for (const key in obj) if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key][textNodeName] !== void 0) obj[key] = obj[key][textNodeName];
		else if (typeof obj[key] === "object" && obj[key] !== null) obj[key] = getValueFromTextNode(obj[key]);
		return obj;
	};
	var isSerializableHeaderValue = (value) => {
		return value != null;
	};
	var NoOpLogger = class {
		trace() {}
		debug() {}
		info() {}
		warn() {}
		error() {}
	};
	function map(arg0, arg1, arg2) {
		let target;
		let filter;
		let instructions;
		if (typeof arg1 === "undefined" && typeof arg2 === "undefined") {
			target = {};
			instructions = arg0;
		} else {
			target = arg0;
			if (typeof arg1 === "function") {
				filter = arg1;
				instructions = arg2;
				return mapWithFilter(target, filter, instructions);
			} else instructions = arg1;
		}
		for (const key of Object.keys(instructions)) {
			if (!Array.isArray(instructions[key])) {
				target[key] = instructions[key];
				continue;
			}
			applyInstruction(target, null, instructions, key);
		}
		return target;
	}
	var convertMap = (target) => {
		const output = {};
		for (const [k, v] of Object.entries(target || {})) output[k] = [, v];
		return output;
	};
	var take = (source, instructions) => {
		const out = {};
		for (const key in instructions) applyInstruction(out, source, instructions, key);
		return out;
	};
	var mapWithFilter = (target, filter, instructions) => {
		return map(target, Object.entries(instructions).reduce((_instructions, [key, value]) => {
			if (Array.isArray(value)) _instructions[key] = value;
			else if (typeof value === "function") _instructions[key] = [filter, value()];
			else _instructions[key] = [filter, value];
			return _instructions;
		}, {}));
	};
	var applyInstruction = (target, source, instructions, targetKey) => {
		if (source !== null) {
			let instruction = instructions[targetKey];
			if (typeof instruction === "function") instruction = [, instruction];
			const [filter = nonNullish, valueFn = pass, sourceKey = targetKey] = instruction;
			if (typeof filter === "function" && filter(source[sourceKey]) || typeof filter !== "function" && !!filter) target[targetKey] = valueFn(source[sourceKey]);
			return;
		}
		let [filter, value] = instructions[targetKey];
		if (typeof value === "function") {
			let _value;
			const defaultFilterPassed = filter === void 0 && (_value = value()) != null;
			const customFilterPassed = typeof filter === "function" && !!filter(void 0) || typeof filter !== "function" && !!filter;
			if (defaultFilterPassed) target[targetKey] = _value;
			else if (customFilterPassed) target[targetKey] = value();
		} else {
			const defaultFilterPassed = filter === void 0 && value != null;
			const customFilterPassed = typeof filter === "function" && !!filter(value) || typeof filter !== "function" && !!filter;
			if (defaultFilterPassed || customFilterPassed) target[targetKey] = value;
		}
	};
	var nonNullish = (_) => _ != null;
	var pass = (_) => _;
	var serializeFloat = (value) => {
		if (value !== value) return "NaN";
		switch (value) {
			case Infinity: return "Infinity";
			case -Infinity: return "-Infinity";
			default: return value;
		}
	};
	var serializeDateTime = (date) => date.toISOString().replace(".000Z", "Z");
	var _json = (obj) => {
		if (obj == null) return {};
		if (Array.isArray(obj)) return obj.filter((_) => _ != null).map(_json);
		if (typeof obj === "object") {
			const target = {};
			for (const key of Object.keys(obj)) {
				if (obj[key] == null) continue;
				target[key] = _json(obj[key]);
			}
			return target;
		}
		return obj;
	};
	function makeBuilder(common, service, name, ep) {
		return function makeCommand(added, plugins, op, $, smithyContext = {}) {
			const epMerged = Object.assign({}, common, added);
			return Command.classBuilder().ep(epMerged).m(function(CommandCtor, clientStack, config, options) {
				const list = plugins.call(this, CommandCtor, clientStack, config, options);
				list.unshift(ep(config, CommandCtor.getEndpointParameterInstructions()));
				return list;
			}).s(service, op, smithyContext).n(name, op.charAt(0).toUpperCase() + op.slice(1) + "Command").sc($).build();
		};
	}
	exports.Client = Client;
	exports.Command = Command;
	exports.NoOpLogger = NoOpLogger;
	exports.SENSITIVE_STRING = SENSITIVE_STRING;
	exports.ServiceException = ServiceException;
	exports.WaiterState = WaiterState;
	exports._json = _json;
	exports.checkExceptions = checkExceptions;
	exports.constructStack = constructStack;
	exports.convertMap = convertMap;
	exports.createAggregatedClient = createAggregatedClient;
	exports.createWaiter = createWaiter;
	exports.decorateServiceException = decorateServiceException;
	exports.emitWarningIfUnsupportedVersion = emitWarningIfUnsupportedVersion;
	exports.getArrayIfSingleItem = getArrayIfSingleItem;
	exports.getChecksumConfiguration = getChecksumConfiguration;
	exports.getDefaultClientConfiguration = getDefaultClientConfiguration;
	exports.getDefaultExtensionConfiguration = getDefaultExtensionConfiguration;
	exports.getRetryConfiguration = getRetryConfiguration;
	exports.getValueFromTextNode = getValueFromTextNode;
	exports.invalidFunction = invalidFunction;
	exports.invalidProvider = invalidProvider;
	exports.isSerializableHeaderValue = isSerializableHeaderValue;
	exports.loadConfigsForDefaultMode = loadConfigsForDefaultMode;
	exports.makeBuilder = makeBuilder;
	exports.map = map;
	exports.resolveChecksumRuntimeConfig = resolveChecksumRuntimeConfig;
	exports.resolveDefaultRuntimeConfig = resolveDefaultRuntimeConfig;
	exports.resolveRetryRuntimeConfig = resolveRetryRuntimeConfig;
	exports.schemaLogFilter = schemaLogFilter;
	exports.serializeDateTime = serializeDateTime;
	exports.serializeFloat = serializeFloat;
	exports.take = take;
	exports.throwDefaultError = throwDefaultError;
	exports.waiterServiceDefaults = waiterServiceDefaults;
	exports.withBaseException = withBaseException;
}));
//#endregion
//#region node_modules/@smithy/core/dist-cjs/submodules/config/index.js
var require_config = /* @__PURE__ */ __commonJSMin(((exports) => {
	var { homedir } = __require("node:os");
	var { sep, join } = __require("node:path");
	var { createHash: createHash$2 } = __require("node:crypto");
	var { readFile: readFile$1 } = __require("node:fs/promises");
	var { IniSectionType } = (init_dist_es$3(), __toCommonJS(dist_es_exports$5));
	var { normalizeProvider } = require_client$1();
	var { isValidHostLabel } = require_transport();
	var ProviderError = class ProviderError extends Error {
		name = "ProviderError";
		tryNextLink;
		constructor(message, options = true) {
			let logger;
			let tryNextLink = true;
			if (typeof options === "boolean") {
				logger = void 0;
				tryNextLink = options;
			} else if (options != null && typeof options === "object") {
				logger = options.logger;
				tryNextLink = options.tryNextLink ?? true;
			}
			super(message);
			this.tryNextLink = tryNextLink;
			Object.setPrototypeOf(this, ProviderError.prototype);
			logger?.debug?.(`@smithy/property-provider ${tryNextLink ? "->" : "(!)"} ${message}`);
		}
		static from(error, options = true) {
			return Object.assign(new this(error.message, options), error);
		}
	};
	var CredentialsProviderError = class CredentialsProviderError extends ProviderError {
		name = "CredentialsProviderError";
		constructor(message, options = true) {
			super(message, options);
			Object.setPrototypeOf(this, CredentialsProviderError.prototype);
		}
	};
	var TokenProviderError = class TokenProviderError extends ProviderError {
		name = "TokenProviderError";
		constructor(message, options = true) {
			super(message, options);
			Object.setPrototypeOf(this, TokenProviderError.prototype);
		}
	};
	var chain = (...providers) => async () => {
		if (providers.length === 0) throw new ProviderError("No providers in chain");
		let lastProviderError;
		for (const provider of providers) try {
			return await provider();
		} catch (err) {
			lastProviderError = err;
			if (err?.tryNextLink) continue;
			throw err;
		}
		throw lastProviderError;
	};
	var fromValue = (staticValue) => () => Promise.resolve(staticValue);
	var memoize = (provider, isExpired, requiresRefresh) => {
		let resolved;
		let pending;
		let hasResult;
		let isConstant = false;
		const coalesceProvider = async () => {
			if (!pending) pending = provider();
			try {
				resolved = await pending;
				hasResult = true;
				isConstant = false;
			} finally {
				pending = void 0;
			}
			return resolved;
		};
		if (isExpired === void 0) return async (options) => {
			if (!hasResult || options?.forceRefresh) resolved = await coalesceProvider();
			return resolved;
		};
		return async (options) => {
			if (!hasResult || options?.forceRefresh) resolved = await coalesceProvider();
			if (isConstant) return resolved;
			if (requiresRefresh && !requiresRefresh(resolved)) {
				isConstant = true;
				return resolved;
			}
			if (isExpired(resolved)) {
				await coalesceProvider();
				return resolved;
			}
			return resolved;
		};
	};
	var booleanSelector = (obj, key, type) => {
		if (!(key in obj)) return void 0;
		if (obj[key] === "true") return true;
		if (obj[key] === "false") return false;
		throw new Error(`Cannot load ${type} "${key}". Expected "true" or "false", got ${obj[key]}.`);
	};
	var numberSelector = (obj, key, type) => {
		if (!(key in obj)) return void 0;
		const numberValue = parseInt(obj[key], 10);
		if (Number.isNaN(numberValue)) throw new TypeError(`Cannot load ${type} '${key}'. Expected number, got '${obj[key]}'.`);
		return numberValue;
	};
	var SelectorType;
	(function(SelectorType) {
		SelectorType["ENV"] = "env";
		SelectorType["CONFIG"] = "shared config entry";
	})(SelectorType || (SelectorType = {}));
	var homeDirCache = {};
	var getHomeDirCacheKey = () => {
		if (process && process.geteuid) return `${process.geteuid()}`;
		return "DEFAULT";
	};
	var getHomeDir = () => {
		const { HOME, USERPROFILE, HOMEPATH, HOMEDRIVE = `C:${sep}` } = process.env;
		if (HOME) return HOME;
		if (USERPROFILE) return USERPROFILE;
		if (HOMEPATH) return `${HOMEDRIVE}${HOMEPATH}`;
		const homeDirCacheKey = getHomeDirCacheKey();
		if (!homeDirCache[homeDirCacheKey]) homeDirCache[homeDirCacheKey] = homedir();
		return homeDirCache[homeDirCacheKey];
	};
	var ENV_PROFILE = "AWS_PROFILE";
	var DEFAULT_PROFILE = "default";
	var getProfileName = (init) => init.profile || process.env[ENV_PROFILE] || DEFAULT_PROFILE;
	var getSSOTokenFilepath = (id) => {
		const cacheName = createHash$2("sha1").update(id).digest("hex");
		return join(getHomeDir(), ".aws", "sso", "cache", `${cacheName}.json`);
	};
	var tokenIntercept = {};
	var getSSOTokenFromFile = async (id) => {
		if (tokenIntercept[id]) return tokenIntercept[id];
		const ssoTokenText = await readFile$1(getSSOTokenFilepath(id), "utf8");
		return JSON.parse(ssoTokenText);
	};
	var CONFIG_PREFIX_SEPARATOR = ".";
	var getConfigData = (data) => Object.entries(data).filter(([key]) => {
		const indexOfSeparator = key.indexOf(CONFIG_PREFIX_SEPARATOR);
		if (indexOfSeparator === -1) return false;
		return Object.values(IniSectionType).includes(key.substring(0, indexOfSeparator));
	}).reduce((acc, [key, value]) => {
		const indexOfSeparator = key.indexOf(CONFIG_PREFIX_SEPARATOR);
		const updatedKey = key.substring(0, indexOfSeparator) === IniSectionType.PROFILE ? key.substring(indexOfSeparator + 1) : key;
		acc[updatedKey] = value;
		return acc;
	}, { ...data.default && { default: data.default } });
	var ENV_CONFIG_PATH = "AWS_CONFIG_FILE";
	var getConfigFilepath = () => process.env[ENV_CONFIG_PATH] || join(getHomeDir(), ".aws", "config");
	var ENV_CREDENTIALS_PATH = "AWS_SHARED_CREDENTIALS_FILE";
	var getCredentialsFilepath = () => process.env[ENV_CREDENTIALS_PATH] || join(getHomeDir(), ".aws", "credentials");
	var prefixKeyRegex = /^([\w-]+)\s(["'])?([\w-@+.%:/]+)\2$/;
	var profileNameBlockList = ["__proto__", "profile __proto__"];
	var parseIni = (iniData) => {
		const map = {};
		let currentSection;
		let currentSubSection;
		for (const iniLine of iniData.split(/\r?\n/)) {
			const trimmedLine = iniLine.split(/(^|\s)[;#]/)[0].trim();
			if (trimmedLine[0] === "[" && trimmedLine[trimmedLine.length - 1] === "]") {
				currentSection = void 0;
				currentSubSection = void 0;
				const sectionName = trimmedLine.substring(1, trimmedLine.length - 1);
				const matches = prefixKeyRegex.exec(sectionName);
				if (matches) {
					const [, prefix, , name] = matches;
					if (Object.values(IniSectionType).includes(prefix)) currentSection = [prefix, name].join(CONFIG_PREFIX_SEPARATOR);
				} else currentSection = sectionName;
				if (profileNameBlockList.includes(sectionName)) throw new Error(`Found invalid profile name "${sectionName}"`);
			} else if (currentSection) {
				const indexOfEqualsSign = trimmedLine.indexOf("=");
				if (![0, -1].includes(indexOfEqualsSign)) {
					const [name, value] = [trimmedLine.substring(0, indexOfEqualsSign).trim(), trimmedLine.substring(indexOfEqualsSign + 1).trim()];
					if (value === "") currentSubSection = name;
					else {
						if (currentSubSection && iniLine.trimStart() === iniLine) currentSubSection = void 0;
						map[currentSection] = map[currentSection] || {};
						const key = currentSubSection ? [currentSubSection, name].join(CONFIG_PREFIX_SEPARATOR) : name;
						map[currentSection][key] = value;
					}
				}
			}
		}
		return map;
	};
	var filePromises = {};
	var fileIntercept = {};
	var readFile = (path, options) => {
		if (fileIntercept[path] !== void 0) return fileIntercept[path];
		if (!filePromises[path] || options?.ignoreCache) filePromises[path] = readFile$1(path, "utf8");
		return filePromises[path];
	};
	var swallowError$1 = () => ({});
	var loadSharedConfigFiles = async (init = {}) => {
		const { filepath = getCredentialsFilepath(), configFilepath = getConfigFilepath() } = init;
		const homeDir = getHomeDir();
		const relativeHomeDirPrefix = "~/";
		let resolvedFilepath = filepath;
		if (filepath.startsWith(relativeHomeDirPrefix)) resolvedFilepath = join(homeDir, filepath.slice(2));
		let resolvedConfigFilepath = configFilepath;
		if (configFilepath.startsWith(relativeHomeDirPrefix)) resolvedConfigFilepath = join(homeDir, configFilepath.slice(2));
		const parsedFiles = await Promise.all([readFile(resolvedConfigFilepath, { ignoreCache: init.ignoreCache }).then(parseIni).then(getConfigData).catch(swallowError$1), readFile(resolvedFilepath, { ignoreCache: init.ignoreCache }).then(parseIni).catch(swallowError$1)]);
		return {
			configFile: parsedFiles[0],
			credentialsFile: parsedFiles[1]
		};
	};
	var getSsoSessionData = (data) => Object.entries(data).filter(([key]) => key.startsWith(IniSectionType.SSO_SESSION + CONFIG_PREFIX_SEPARATOR)).reduce((acc, [key, value]) => ({
		...acc,
		[key.substring(key.indexOf(CONFIG_PREFIX_SEPARATOR) + 1)]: value
	}), {});
	var swallowError = () => ({});
	var loadSsoSessionData = async (init = {}) => readFile(init.configFilepath ?? getConfigFilepath()).then(parseIni).then(getSsoSessionData).catch(swallowError);
	var mergeConfigFiles = (...files) => {
		const merged = {};
		for (const file of files) for (const [key, values] of Object.entries(file)) if (merged[key] !== void 0) Object.assign(merged[key], values);
		else merged[key] = values;
		return merged;
	};
	var parseKnownFiles = async (init) => {
		const parsedFiles = await loadSharedConfigFiles(init);
		return mergeConfigFiles(parsedFiles.configFile, parsedFiles.credentialsFile);
	};
	var externalDataInterceptor = {
		getFileRecord() {
			return fileIntercept;
		},
		interceptFile(path, contents) {
			fileIntercept[path] = Promise.resolve(contents);
		},
		getTokenRecord() {
			return tokenIntercept;
		},
		interceptToken(id, contents) {
			tokenIntercept[id] = contents;
		}
	};
	function getSelectorName(functionString) {
		try {
			const constants = new Set(Array.from(functionString.match(/([A-Z_]){3,}/g) ?? []));
			constants.delete("CONFIG");
			constants.delete("CONFIG_PREFIX_SEPARATOR");
			constants.delete("ENV");
			return [...constants].join(", ");
		} catch (ignored) {
			return functionString;
		}
	}
	var fromEnv = (envVarSelector, options) => async () => {
		try {
			const config = envVarSelector(process.env, options);
			if (config === void 0) throw new Error();
			return config;
		} catch (e) {
			throw new CredentialsProviderError(e.message || `Not found in ENV: ${getSelectorName(envVarSelector.toString())}`, { logger: options?.logger });
		}
	};
	var fromSharedConfigFiles = (configSelector, { preferredFile = "config", ...init } = {}) => async () => {
		const profile = getProfileName(init);
		const { configFile, credentialsFile } = await loadSharedConfigFiles(init);
		const profileFromCredentials = credentialsFile[profile] || {};
		const profileFromConfig = configFile[profile] || {};
		const mergedProfile = preferredFile === "config" ? {
			...profileFromCredentials,
			...profileFromConfig
		} : {
			...profileFromConfig,
			...profileFromCredentials
		};
		try {
			const configValue = configSelector(mergedProfile, preferredFile === "config" ? configFile : credentialsFile);
			if (configValue === void 0) throw new Error();
			return configValue;
		} catch (e) {
			throw new CredentialsProviderError(e.message || `Not found in config files w/ profile [${profile}]: ${getSelectorName(configSelector.toString())}`, { logger: init.logger });
		}
	};
	var isFunction = (func) => typeof func === "function";
	var fromStatic = (defaultValue) => isFunction(defaultValue) ? async () => await defaultValue() : fromValue(defaultValue);
	var loadConfig = ({ environmentVariableSelector, configFileSelector, default: defaultValue }, configuration = {}) => {
		const { signingName, logger } = configuration;
		return memoize(chain(fromEnv(environmentVariableSelector, {
			signingName,
			logger
		}), fromSharedConfigFiles(configFileSelector, configuration), fromStatic(defaultValue)));
	};
	var ENV_USE_DUALSTACK_ENDPOINT = "AWS_USE_DUALSTACK_ENDPOINT";
	var CONFIG_USE_DUALSTACK_ENDPOINT = "use_dualstack_endpoint";
	var DEFAULT_USE_DUALSTACK_ENDPOINT = false;
	var NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS = {
		environmentVariableSelector: (env) => booleanSelector(env, ENV_USE_DUALSTACK_ENDPOINT, SelectorType.ENV),
		configFileSelector: (profile) => booleanSelector(profile, CONFIG_USE_DUALSTACK_ENDPOINT, SelectorType.CONFIG),
		default: false
	};
	var nodeDualstackConfigSelectors = {
		environmentVariableSelector: (env) => booleanSelector(env, ENV_USE_DUALSTACK_ENDPOINT, SelectorType.ENV),
		configFileSelector: (profile) => booleanSelector(profile, CONFIG_USE_DUALSTACK_ENDPOINT, SelectorType.CONFIG),
		default: void 0
	};
	var ENV_USE_FIPS_ENDPOINT = "AWS_USE_FIPS_ENDPOINT";
	var CONFIG_USE_FIPS_ENDPOINT = "use_fips_endpoint";
	var DEFAULT_USE_FIPS_ENDPOINT = false;
	var NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS = {
		environmentVariableSelector: (env) => booleanSelector(env, ENV_USE_FIPS_ENDPOINT, SelectorType.ENV),
		configFileSelector: (profile) => booleanSelector(profile, CONFIG_USE_FIPS_ENDPOINT, SelectorType.CONFIG),
		default: false
	};
	var nodeFipsConfigSelectors = {
		environmentVariableSelector: (env) => booleanSelector(env, ENV_USE_FIPS_ENDPOINT, SelectorType.ENV),
		configFileSelector: (profile) => booleanSelector(profile, CONFIG_USE_FIPS_ENDPOINT, SelectorType.CONFIG),
		default: void 0
	};
	var resolveCustomEndpointsConfig = (input) => {
		const { tls, endpoint, urlParser, useDualstackEndpoint } = input;
		return Object.assign(input, {
			tls: tls ?? true,
			endpoint: normalizeProvider(typeof endpoint === "string" ? urlParser(endpoint) : endpoint),
			isCustomEndpoint: true,
			useDualstackEndpoint: normalizeProvider(useDualstackEndpoint ?? false)
		});
	};
	var getEndpointFromRegion = async (input) => {
		const { tls = true } = input;
		const region = await input.region();
		if (!(/* @__PURE__ */ new RegExp(/^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])$/)).test(region)) throw new Error("Invalid region in client config");
		const useDualstackEndpoint = await input.useDualstackEndpoint();
		const useFipsEndpoint = await input.useFipsEndpoint();
		const { hostname } = await input.regionInfoProvider(region, {
			useDualstackEndpoint,
			useFipsEndpoint
		}) ?? {};
		if (!hostname) throw new Error("Cannot resolve hostname from client config");
		return input.urlParser(`${tls ? "https:" : "http:"}//${hostname}`);
	};
	var resolveEndpointsConfig = (input) => {
		const useDualstackEndpoint = normalizeProvider(input.useDualstackEndpoint ?? false);
		const { endpoint, useFipsEndpoint, urlParser, tls } = input;
		return Object.assign(input, {
			tls: tls ?? true,
			endpoint: endpoint ? normalizeProvider(typeof endpoint === "string" ? urlParser(endpoint) : endpoint) : () => getEndpointFromRegion({
				...input,
				useDualstackEndpoint,
				useFipsEndpoint
			}),
			isCustomEndpoint: !!endpoint,
			useDualstackEndpoint
		});
	};
	var AWS_EXECUTION_ENV = "AWS_EXECUTION_ENV";
	var AWS_REGION_ENV = "AWS_REGION";
	var AWS_DEFAULT_REGION_ENV = "AWS_DEFAULT_REGION";
	var ENV_IMDS_DISABLED = "AWS_EC2_METADATA_DISABLED";
	var DEFAULTS_MODE_OPTIONS = [
		"in-region",
		"cross-region",
		"mobile",
		"standard",
		"legacy"
	];
	var IMDS_REGION_PATH = "/latest/meta-data/placement/region";
	var IMDS_TOKEN_PATH = "/latest/api/token";
	var X_AWS_EC2_METADATA_TOKEN = "x-aws-ec2-metadata-token";
	var X_AWS_EC2_METADATA_TOKEN_TTL = "x-aws-ec2-metadata-token-ttl-seconds";
	var TIMEOUT_MS = 1e3;
	var NEG_CACHE_TTL_MS = 6e4;
	var negativeCacheUntil = 0;
	var getInstanceMetadataRegion = async () => {
		if (process.env[ENV_IMDS_DISABLED]) return;
		if (Date.now() < negativeCacheUntil) return;
		try {
			const endpoint = resolveImdsEndpoint();
			const token = (await imdsRequest({
				...endpoint,
				path: IMDS_TOKEN_PATH,
				method: "PUT",
				headers: { [X_AWS_EC2_METADATA_TOKEN_TTL]: "21600" }
			})).toString();
			return (await imdsRequest({
				...endpoint,
				path: IMDS_REGION_PATH,
				method: "GET",
				headers: { [X_AWS_EC2_METADATA_TOKEN]: token }
			})).toString().trim() || cacheNegativeAndReturnUndefined();
		} catch {
			return cacheNegativeAndReturnUndefined();
		}
	};
	var cacheNegativeAndReturnUndefined = () => {
		negativeCacheUntil = Date.now() + NEG_CACHE_TTL_MS;
	};
	var resolveImdsEndpoint = () => {
		const envEndpoint = process.env.AWS_EC2_METADATA_SERVICE_ENDPOINT;
		if (envEndpoint) {
			const url = new URL(envEndpoint);
			return {
				hostname: url.hostname.replace(/^\[(.+)]$/, "$1"),
				port: url.port ? Number(url.port) : void 0
			};
		}
		if (process.env.AWS_EC2_METADATA_SERVICE_ENDPOINT_MODE === "IPv6") return { hostname: "fd00:ec2::254" };
		return { hostname: "169.254.169.254" };
	};
	var imdsRequest = async (options) => {
		const { request } = __require("node:http");
		return new Promise((resolve, reject) => {
			const req = request({
				hostname: options.hostname,
				port: options.port,
				path: options.path,
				method: options.method,
				headers: options.headers,
				timeout: TIMEOUT_MS,
				signal: AbortSignal.timeout(TIMEOUT_MS)
			});
			req.on("error", (err) => {
				reject(err);
				req.destroy();
			});
			req.on("timeout", () => {
				reject(/* @__PURE__ */ new Error("TimeoutError from instance metadata service"));
				req.destroy();
			});
			req.on("response", (res) => {
				const { statusCode = 400 } = res;
				if (statusCode < 200 || statusCode >= 300) {
					reject(Object.assign(/* @__PURE__ */ new Error("Error response received from instance metadata service"), { statusCode }));
					req.destroy();
					return;
				}
				const chunks = [];
				res.on("data", (chunk) => chunks.push(chunk));
				res.on("end", () => {
					resolve(Buffer.concat(chunks));
					req.destroy();
				});
			});
			req.end();
		});
	};
	var REGION_ENV_NAME = "AWS_REGION";
	var REGION_INI_NAME = "region";
	var NODE_REGION_CONFIG_OPTIONS = {
		environmentVariableSelector: (env) => env[REGION_ENV_NAME],
		configFileSelector: (profile) => profile[REGION_INI_NAME],
		default: async () => {
			const region = await getInstanceMetadataRegion();
			if (region) return region;
			throw new Error("Region is missing");
		}
	};
	var NODE_REGION_CONFIG_FILE_OPTIONS = { preferredFile: "credentials" };
	var validRegions = /* @__PURE__ */ new Set();
	var checkRegion = (region, check = isValidHostLabel) => {
		if (!validRegions.has(region) && !check(region)) if (region === "*") console.warn(`@smithy/config-resolver WARN - Please use the caller region instead of "*". See "sigv4a" in https://github.com/aws/aws-sdk-js-v3/blob/main/supplemental-docs/CLIENTS.md.`);
		else throw new Error(`Region not accepted: region="${region}" is not a valid hostname component.`);
		else validRegions.add(region);
	};
	var isFipsRegion = (region) => typeof region === "string" && (region.startsWith("fips-") || region.endsWith("-fips"));
	var getRealRegion = (region) => isFipsRegion(region) ? ["fips-aws-global", "aws-fips"].includes(region) ? "us-east-1" : region.replace(/fips-(dkr-|prod-)?|-fips/, "") : region;
	var resolveRegionConfig = (input) => {
		const { region, useFipsEndpoint } = input;
		if (!region) throw new Error("Region is missing");
		return Object.assign(input, {
			region: async () => {
				const realRegion = getRealRegion(typeof region === "function" ? await region() : region);
				checkRegion(realRegion);
				return realRegion;
			},
			useFipsEndpoint: async () => {
				if (isFipsRegion(typeof region === "string" ? region : await region())) return true;
				return typeof useFipsEndpoint !== "function" ? Promise.resolve(!!useFipsEndpoint) : useFipsEndpoint();
			}
		});
	};
	var getHostnameFromVariants = (variants = [], { useFipsEndpoint, useDualstackEndpoint }) => variants.find(({ tags }) => useFipsEndpoint === tags.includes("fips") && useDualstackEndpoint === tags.includes("dualstack"))?.hostname;
	var getResolvedHostname = (resolvedRegion, { regionHostname, partitionHostname }) => regionHostname ? regionHostname : partitionHostname ? partitionHostname.replace("{region}", resolvedRegion) : void 0;
	var getResolvedPartition = (region, { partitionHash }) => Object.keys(partitionHash || {}).find((key) => partitionHash[key].regions.includes(region)) ?? "aws";
	var getResolvedSigningRegion = (hostname, { signingRegion, regionRegex, useFipsEndpoint }) => {
		if (signingRegion) return signingRegion;
		else if (useFipsEndpoint) {
			const regionRegexJs = regionRegex.replace("\\\\", "\\").replace(/^\^/g, "\\.").replace(/\$$/g, "\\.");
			const regionRegexmatchArray = hostname.match(regionRegexJs);
			if (regionRegexmatchArray) return regionRegexmatchArray[0].slice(1, -1);
		}
	};
	var getRegionInfo = (region, { useFipsEndpoint = false, useDualstackEndpoint = false, signingService, regionHash, partitionHash }) => {
		const partition = getResolvedPartition(region, { partitionHash });
		const resolvedRegion = region in regionHash ? region : partitionHash[partition]?.endpoint ?? region;
		const hostnameOptions = {
			useFipsEndpoint,
			useDualstackEndpoint
		};
		const hostname = getResolvedHostname(resolvedRegion, {
			regionHostname: getHostnameFromVariants(regionHash[resolvedRegion]?.variants, hostnameOptions),
			partitionHostname: getHostnameFromVariants(partitionHash[partition]?.variants, hostnameOptions)
		});
		if (hostname === void 0) throw new Error(`Endpoint resolution failed for: [object Object]`);
		const signingRegion = getResolvedSigningRegion(hostname, {
			signingRegion: regionHash[resolvedRegion]?.signingRegion,
			regionRegex: partitionHash[partition].regionRegex,
			useFipsEndpoint
		});
		return {
			partition,
			signingService,
			hostname,
			...signingRegion && { signingRegion },
			...regionHash[resolvedRegion]?.signingService && { signingService: regionHash[resolvedRegion].signingService }
		};
	};
	var AWS_DEFAULTS_MODE_ENV = "AWS_DEFAULTS_MODE";
	var AWS_DEFAULTS_MODE_CONFIG = "defaults_mode";
	var NODE_DEFAULTS_MODE_CONFIG_OPTIONS = {
		environmentVariableSelector: (env) => {
			return env[AWS_DEFAULTS_MODE_ENV];
		},
		configFileSelector: (profile) => {
			return profile[AWS_DEFAULTS_MODE_CONFIG];
		},
		default: "legacy"
	};
	var resolveDefaultsModeConfig = ({ region = loadConfig(NODE_REGION_CONFIG_OPTIONS), defaultsMode = loadConfig(NODE_DEFAULTS_MODE_CONFIG_OPTIONS) } = {}) => memoize(async () => {
		const mode = typeof defaultsMode === "function" ? await defaultsMode() : defaultsMode;
		switch (mode?.toLowerCase()) {
			case "auto": return resolveNodeDefaultsModeAuto(region);
			case "in-region":
			case "cross-region":
			case "mobile":
			case "standard":
			case "legacy": return Promise.resolve(mode?.toLocaleLowerCase());
			case void 0: return Promise.resolve("legacy");
			default: throw new Error(`Invalid parameter for "defaultsMode", expect ${DEFAULTS_MODE_OPTIONS.join(", ")}, got ${mode}`);
		}
	});
	var resolveNodeDefaultsModeAuto = async (clientRegion) => {
		if (clientRegion) {
			const resolvedRegion = typeof clientRegion === "function" ? await clientRegion() : clientRegion;
			const inferredRegion = await inferPhysicalRegion();
			if (!inferredRegion) return "standard";
			if (resolvedRegion === inferredRegion) return "in-region";
			else return "cross-region";
		}
		return "standard";
	};
	var inferPhysicalRegion = async () => {
		if (process.env[AWS_EXECUTION_ENV] && (process.env[AWS_REGION_ENV] || process.env[AWS_DEFAULT_REGION_ENV])) return process.env[AWS_REGION_ENV] ?? process.env[AWS_DEFAULT_REGION_ENV];
		return getInstanceMetadataRegion();
	};
	exports.CONFIG_PREFIX_SEPARATOR = CONFIG_PREFIX_SEPARATOR;
	exports.CONFIG_USE_DUALSTACK_ENDPOINT = CONFIG_USE_DUALSTACK_ENDPOINT;
	exports.CONFIG_USE_FIPS_ENDPOINT = CONFIG_USE_FIPS_ENDPOINT;
	exports.CredentialsProviderError = CredentialsProviderError;
	exports.DEFAULT_PROFILE = DEFAULT_PROFILE;
	exports.DEFAULT_USE_DUALSTACK_ENDPOINT = DEFAULT_USE_DUALSTACK_ENDPOINT;
	exports.DEFAULT_USE_FIPS_ENDPOINT = DEFAULT_USE_FIPS_ENDPOINT;
	exports.ENV_PROFILE = ENV_PROFILE;
	exports.ENV_USE_DUALSTACK_ENDPOINT = ENV_USE_DUALSTACK_ENDPOINT;
	exports.ENV_USE_FIPS_ENDPOINT = ENV_USE_FIPS_ENDPOINT;
	exports.NODE_REGION_CONFIG_FILE_OPTIONS = NODE_REGION_CONFIG_FILE_OPTIONS;
	exports.NODE_REGION_CONFIG_OPTIONS = NODE_REGION_CONFIG_OPTIONS;
	exports.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS = NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS;
	exports.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS = NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS;
	exports.ProviderError = ProviderError;
	exports.REGION_ENV_NAME = REGION_ENV_NAME;
	exports.REGION_INI_NAME = REGION_INI_NAME;
	exports.SelectorType = SelectorType;
	exports.TokenProviderError = TokenProviderError;
	exports.booleanSelector = booleanSelector;
	exports.chain = chain;
	exports.externalDataInterceptor = externalDataInterceptor;
	exports.fromStatic = fromStatic;
	exports.fromValue = fromValue;
	exports.getHomeDir = getHomeDir;
	exports.getProfileName = getProfileName;
	exports.getRegionInfo = getRegionInfo;
	exports.getSSOTokenFilepath = getSSOTokenFilepath;
	exports.getSSOTokenFromFile = getSSOTokenFromFile;
	exports.loadConfig = loadConfig;
	exports.loadSharedConfigFiles = loadSharedConfigFiles;
	exports.loadSsoSessionData = loadSsoSessionData;
	exports.memoize = memoize;
	exports.nodeDualstackConfigSelectors = nodeDualstackConfigSelectors;
	exports.nodeFipsConfigSelectors = nodeFipsConfigSelectors;
	exports.numberSelector = numberSelector;
	exports.parseKnownFiles = parseKnownFiles;
	exports.readFile = readFile;
	exports.resolveCustomEndpointsConfig = resolveCustomEndpointsConfig;
	exports.resolveDefaultsModeConfig = resolveDefaultsModeConfig;
	exports.resolveEndpointsConfig = resolveEndpointsConfig;
	exports.resolveRegionConfig = resolveRegionConfig;
}));
//#endregion
//#region node_modules/@smithy/core/dist-cjs/submodules/endpoints/index.js
var require_endpoints = /* @__PURE__ */ __commonJSMin(((exports) => {
	var { CONFIG_PREFIX_SEPARATOR, booleanSelector, SelectorType, loadConfig } = require_config();
	var { toEndpointV1, getSmithyContext, normalizeProvider, isValidHostLabel } = require_transport();
	exports.isValidHostLabel = isValidHostLabel;
	exports.middlewareEndpointToEndpointV1 = toEndpointV1;
	exports.toEndpointV1 = toEndpointV1;
	var { EndpointURLScheme } = (init_dist_es$3(), __toCommonJS(dist_es_exports$5));
	var ENV_ENDPOINT_URL = "AWS_ENDPOINT_URL";
	var CONFIG_ENDPOINT_URL = "endpoint_url";
	var getEndpointUrlConfig = (serviceId) => ({
		environmentVariableSelector: (env) => {
			const serviceEndpointUrl = env[[ENV_ENDPOINT_URL, ...serviceId.split(" ").map((w) => w.toUpperCase())].join("_")];
			if (serviceEndpointUrl) return serviceEndpointUrl;
			const endpointUrl = env[ENV_ENDPOINT_URL];
			if (endpointUrl) return endpointUrl;
		},
		configFileSelector: (profile, config) => {
			if (profile.services) {
				const servicesSectionKey = ["services", profile.services].join(CONFIG_PREFIX_SEPARATOR);
				if (!config || !config[servicesSectionKey]) throw new Error(`The services section "${profile.services}" specified in the profile is not present in the shared configuration file.`);
				const endpointUrl = config[servicesSectionKey][[serviceId.split(" ").map((w) => w.toLowerCase()).join("_"), CONFIG_ENDPOINT_URL].join(CONFIG_PREFIX_SEPARATOR)];
				if (endpointUrl) return endpointUrl;
			}
			const endpointUrl = profile[CONFIG_ENDPOINT_URL];
			if (endpointUrl) return endpointUrl;
		},
		default: void 0
	});
	var ENV_IGNORE_CONFIGURED_ENDPOINT_URLS = "AWS_IGNORE_CONFIGURED_ENDPOINT_URLS";
	var CONFIG_IGNORE_CONFIGURED_ENDPOINT_URLS = "ignore_configured_endpoint_urls";
	var ignoreConfiguredEndpointUrlsConfigSelectors = {
		environmentVariableSelector: (env) => booleanSelector(env, ENV_IGNORE_CONFIGURED_ENDPOINT_URLS, SelectorType.ENV),
		configFileSelector: (profile) => booleanSelector(profile, CONFIG_IGNORE_CONFIGURED_ENDPOINT_URLS, SelectorType.CONFIG),
		default: false
	};
	var getEndpointFromConfig = async (serviceId) => {
		if (await loadConfig(ignoreConfiguredEndpointUrlsConfigSelectors)()) return;
		return loadConfig(getEndpointUrlConfig(serviceId ?? ""))();
	};
	var resolveParamsForS3 = async (endpointParams) => {
		const bucket = endpointParams?.Bucket || "";
		if (typeof endpointParams.Bucket === "string") endpointParams.Bucket = bucket.replace(/#/g, encodeURIComponent("#")).replace(/\?/g, encodeURIComponent("?"));
		if (isArnBucketName(bucket)) {
			if (endpointParams.ForcePathStyle === true) throw new Error("Path-style addressing cannot be used with ARN buckets");
		} else if (!isDnsCompatibleBucketName(bucket) || bucket.indexOf(".") !== -1 && !String(endpointParams.Endpoint).startsWith("http:") || bucket.toLowerCase() !== bucket || bucket.length < 3) endpointParams.ForcePathStyle = true;
		if (endpointParams.DisableMultiRegionAccessPoints) {
			endpointParams.disableMultiRegionAccessPoints = true;
			endpointParams.DisableMRAP = true;
		}
		return endpointParams;
	};
	var DOMAIN_PATTERN = /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/;
	var IP_ADDRESS_PATTERN = /(\d+\.){3}\d+/;
	var DOTS_PATTERN = /\.\./;
	var isDnsCompatibleBucketName = (bucketName) => DOMAIN_PATTERN.test(bucketName) && !IP_ADDRESS_PATTERN.test(bucketName) && !DOTS_PATTERN.test(bucketName);
	var isArnBucketName = (bucketName) => {
		const [arn, partition, service, , , bucket] = bucketName.split(":");
		const isArn = arn === "arn" && bucketName.split(":").length >= 6;
		const isValidArn = Boolean(isArn && partition && service && bucket);
		if (isArn && !isValidArn) throw new Error(`Invalid ARN: ${bucketName} was an invalid ARN.`);
		return isValidArn;
	};
	var createConfigValueProvider = (configKey, canonicalEndpointParamKey, config, isClientContextParam = false) => {
		const configProvider = async () => {
			let configValue;
			if (isClientContextParam) configValue = config.clientContextParams?.[configKey] ?? config[configKey] ?? config[canonicalEndpointParamKey];
			else configValue = config[configKey] ?? config[canonicalEndpointParamKey];
			if (typeof configValue === "function") return configValue();
			return configValue;
		};
		if (configKey === "credentialScope" || canonicalEndpointParamKey === "CredentialScope") return async () => {
			const credentials = typeof config.credentials === "function" ? await config.credentials() : config.credentials;
			return credentials?.credentialScope ?? credentials?.CredentialScope;
		};
		if (configKey === "accountId" || canonicalEndpointParamKey === "AccountId") return async () => {
			const credentials = typeof config.credentials === "function" ? await config.credentials() : config.credentials;
			return credentials?.accountId ?? credentials?.AccountId;
		};
		if (configKey === "endpoint" || canonicalEndpointParamKey === "endpoint") return async () => {
			if (config.isCustomEndpoint === false) return;
			const endpoint = await configProvider();
			if (endpoint && typeof endpoint === "object") {
				if ("url" in endpoint) return endpoint.url.href;
				if ("hostname" in endpoint) {
					const { protocol, hostname, port, path } = endpoint;
					return `${protocol}//${hostname}${port ? ":" + port : ""}${path}`;
				}
			}
			return endpoint;
		};
		return configProvider;
	};
	function bindGetEndpointFromInstructions(getEndpointFromConfig) {
		return async (commandInput, instructionsSupplier, clientConfig, context) => {
			if (!clientConfig.isCustomEndpoint && !clientConfig.ignoreConfiguredEndpointUrls) {
				let endpointFromConfig;
				if (clientConfig.serviceConfiguredEndpoint) endpointFromConfig = await clientConfig.serviceConfiguredEndpoint();
				else endpointFromConfig = await getEndpointFromConfig(clientConfig.serviceId);
				if (endpointFromConfig) {
					clientConfig.endpoint = () => Promise.resolve(toEndpointV1(endpointFromConfig));
					clientConfig.isCustomEndpoint = true;
					context?.logger?.debug?.(`@smithy/core/endpoints - resolved endpoint from config: ${endpointFromConfig}`);
				}
			}
			const endpointParams = await resolveParams(commandInput, instructionsSupplier, clientConfig);
			if (typeof clientConfig.endpointProvider !== "function") throw new Error("config.endpointProvider is not set.");
			const endpoint = clientConfig.endpointProvider(endpointParams, context);
			if (clientConfig.isCustomEndpoint && clientConfig.endpoint) {
				const customEndpoint = await clientConfig.endpoint();
				if (customEndpoint?.headers) {
					endpoint.headers ??= {};
					for (const [name, value] of Object.entries(customEndpoint.headers)) endpoint.headers[name] = Array.isArray(value) ? value : [value];
				}
			}
			return endpoint;
		};
	}
	var resolveParams = async (commandInput, instructionsSupplier, clientConfig) => {
		const endpointParams = {};
		const instructions = instructionsSupplier?.getEndpointParameterInstructions?.() || {};
		for (const [name, instruction] of Object.entries(instructions)) switch (instruction.type) {
			case "staticContextParams":
				endpointParams[name] = instruction.value;
				break;
			case "contextParams":
				endpointParams[name] = commandInput[instruction.name];
				break;
			case "clientContextParams":
			case "builtInParams":
				endpointParams[name] = await createConfigValueProvider(instruction.name, name, clientConfig, instruction.type !== "builtInParams")();
				break;
			case "operationContextParams":
				endpointParams[name] = instruction.get(commandInput);
				break;
			default: throw new Error("Unrecognized endpoint parameter instruction: " + JSON.stringify(instruction));
		}
		if (Object.keys(instructions).length === 0) Object.assign(endpointParams, clientConfig);
		if (String(clientConfig.serviceId).toLowerCase() === "s3") await resolveParamsForS3(endpointParams);
		return endpointParams;
	};
	function setFeature(context, feature, value) {
		if (!context.__smithy_context) context.__smithy_context = { features: {} };
		else if (!context.__smithy_context.features) context.__smithy_context.features = {};
		context.__smithy_context.features[feature] = value;
	}
	function bindEndpointMiddleware(getEndpointFromConfig) {
		const getEndpointFromInstructions = bindGetEndpointFromInstructions(getEndpointFromConfig);
		return ({ config, instructions }) => {
			return (next, context) => async (args) => {
				if (config.isCustomEndpoint) setFeature(context, "ENDPOINT_OVERRIDE", "N");
				const endpoint = await getEndpointFromInstructions(args.input, { getEndpointParameterInstructions() {
					return instructions;
				} }, { ...config }, context);
				context.endpointV2 = endpoint;
				context.authSchemes = endpoint.properties?.authSchemes;
				const authScheme = context.authSchemes?.[0];
				if (authScheme) {
					context["signing_region"] = authScheme.signingRegion;
					context["signing_service"] = authScheme.signingName;
					const httpAuthOption = getSmithyContext(context)?.selectedHttpAuthScheme?.httpAuthOption;
					if (httpAuthOption) httpAuthOption.signingProperties = Object.assign(httpAuthOption.signingProperties || {}, {
						signing_region: authScheme.signingRegion,
						signingRegion: authScheme.signingRegion,
						signing_service: authScheme.signingName,
						signingName: authScheme.signingName,
						signingRegionSet: authScheme.signingRegionSet
					}, authScheme.properties);
				}
				return next({ ...args });
			};
		};
	}
	var endpointMiddlewareOptions = {
		step: "serialize",
		tags: [
			"ENDPOINT_PARAMETERS",
			"ENDPOINT_V2",
			"ENDPOINT"
		],
		name: "endpointV2Middleware",
		override: true,
		relation: "before",
		toMiddleware: { name: "serializerMiddleware" }.name
	};
	function bindGetEndpointPlugin(getEndpointFromConfig) {
		const endpointMiddleware = bindEndpointMiddleware(getEndpointFromConfig);
		return (config, instructions) => ({ applyToStack: (clientStack) => {
			clientStack.addRelativeTo(endpointMiddleware({
				config,
				instructions
			}), endpointMiddlewareOptions);
		} });
	}
	function bindResolveEndpointConfig(getEndpointFromConfig) {
		return (input) => {
			const tls = input.tls ?? true;
			const { endpoint, useDualstackEndpoint, useFipsEndpoint } = input;
			const resolvedConfig = Object.assign(input, {
				endpoint: endpoint != null ? async () => toEndpointV1(await normalizeProvider(endpoint)()) : void 0,
				tls,
				isCustomEndpoint: !!endpoint,
				useDualstackEndpoint: normalizeProvider(useDualstackEndpoint ?? false),
				useFipsEndpoint: normalizeProvider(useFipsEndpoint ?? false),
				ignoreConfiguredEndpointUrls: !!input.ignoreConfiguredEndpointUrls
			});
			let configuredEndpointPromise = void 0;
			resolvedConfig.serviceConfiguredEndpoint = async () => {
				if (input.serviceId && !configuredEndpointPromise) configuredEndpointPromise = getEndpointFromConfig(input.serviceId);
				return configuredEndpointPromise;
			};
			return resolvedConfig;
		};
	}
	var BinaryDecisionDiagram = class BinaryDecisionDiagram {
		nodes;
		root;
		conditions;
		results;
		constructor(bdd, root, conditions, results) {
			this.nodes = bdd;
			this.root = root;
			this.conditions = conditions;
			this.results = results;
		}
		static from(bdd, root, conditions, results) {
			return new BinaryDecisionDiagram(bdd, root, conditions, results);
		}
	};
	var EndpointCache = class {
		capacity;
		data = /* @__PURE__ */ new Map();
		parameters = [];
		constructor({ size, params }) {
			this.capacity = size ?? 50;
			if (params) this.parameters = params;
		}
		get(endpointParams, resolver) {
			const key = this.hash(endpointParams);
			if (key === false) return resolver();
			if (!this.data.has(key)) {
				if (this.data.size > this.capacity + 10) {
					const keys = this.data.keys();
					let i = 0;
					while (true) {
						const { value, done } = keys.next();
						this.data.delete(value);
						if (done || ++i > 10) break;
					}
				}
				this.data.set(key, resolver());
			}
			return this.data.get(key);
		}
		size() {
			return this.data.size;
		}
		hash(endpointParams) {
			let buffer = "";
			const { parameters } = this;
			if (parameters.length === 0) return false;
			for (const param of parameters) {
				const val = String(endpointParams[param] ?? "");
				if (val.includes("|;")) return false;
				buffer += val + "|;";
			}
			return buffer;
		}
	};
	var EndpointError = class extends Error {
		constructor(message) {
			super(message);
			this.name = "EndpointError";
		}
	};
	var debugId = "endpoints";
	function toDebugString(input) {
		if (typeof input !== "object" || input == null) return input;
		if ("ref" in input) return `$${toDebugString(input.ref)}`;
		if ("fn" in input) return `${input.fn}(${(input.argv || []).map(toDebugString).join(", ")})`;
		return JSON.stringify(input, null, 2);
	}
	var customEndpointFunctions = {};
	var booleanEquals = (value1, value2) => value1 === value2;
	function coalesce(...args) {
		for (const arg of args) if (arg != null) return arg;
	}
	var getAttrPathList = (path) => {
		const parts = path.split(".");
		const pathList = [];
		for (const part of parts) {
			const squareBracketIndex = part.indexOf("[");
			if (squareBracketIndex !== -1) {
				if (part.indexOf("]") !== part.length - 1) throw new EndpointError(`Path: '${path}' does not end with ']'`);
				const arrayIndex = part.slice(squareBracketIndex + 1, -1);
				if (Number.isNaN(parseInt(arrayIndex))) throw new EndpointError(`Invalid array index: '${arrayIndex}' in path: '${path}'`);
				if (squareBracketIndex !== 0) pathList.push(part.slice(0, squareBracketIndex));
				pathList.push(arrayIndex);
			} else pathList.push(part);
		}
		return pathList;
	};
	var getAttr = (value, path) => getAttrPathList(path).reduce((acc, index) => {
		if (typeof acc !== "object") throw new EndpointError(`Index '${index}' in '${path}' not found in '${JSON.stringify(value)}'`);
		else if (Array.isArray(acc)) {
			const i = parseInt(index);
			return acc[i < 0 ? acc.length + i : i];
		}
		return acc[index];
	}, value);
	var isSet = (value) => value != null;
	function ite(condition, trueValue, falseValue) {
		return condition ? trueValue : falseValue;
	}
	var not = (value) => !value;
	var IP_V4_REGEX = new RegExp(`^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$`);
	var isIpAddress = (value) => IP_V4_REGEX.test(value) || value.startsWith("[") && value.endsWith("]");
	var DEFAULT_PORTS = {
		[EndpointURLScheme.HTTP]: 80,
		[EndpointURLScheme.HTTPS]: 443
	};
	var parseURL = (value) => {
		const whatwgURL = (() => {
			try {
				if (value instanceof URL) return value;
				if (typeof value === "object" && "hostname" in value) {
					const { hostname, port, protocol = "", path = "", query = {} } = value;
					const url = new URL(`${protocol}//${hostname}${port ? `:${port}` : ""}${path}`);
					url.search = Object.entries(query).map(([k, v]) => `${k}=${v}`).join("&");
					return url;
				}
				return new URL(value);
			} catch (ignored) {
				return null;
			}
		})();
		if (!whatwgURL) {
			console.error(`Unable to parse ${JSON.stringify(value)} as a whatwg URL.`);
			return null;
		}
		const urlString = whatwgURL.href;
		const { host, hostname, pathname, protocol, search } = whatwgURL;
		if (search) return null;
		const scheme = protocol.slice(0, -1);
		if (!Object.values(EndpointURLScheme).includes(scheme)) return null;
		const isIp = isIpAddress(hostname);
		return {
			scheme,
			authority: `${host}${urlString.includes(`${host}:${DEFAULT_PORTS[scheme]}`) || typeof value === "string" && value.includes(`${host}:${DEFAULT_PORTS[scheme]}`) ? `:${DEFAULT_PORTS[scheme]}` : ``}`,
			path: pathname,
			normalizedPath: pathname.endsWith("/") ? pathname : `${pathname}/`,
			isIp
		};
	};
	function split(value, delimiter, limit) {
		if (limit === 1) return [value];
		if (value === "") return [""];
		const parts = value.split(delimiter);
		if (limit === 0) return parts;
		return parts.slice(0, limit - 1).concat(parts.slice(1).join(delimiter));
	}
	var stringEquals = (value1, value2) => value1 === value2;
	var substring = (input, start, stop, reverse) => {
		if (input == null || start >= stop || input.length < stop || /[^\u0000-\u007f]/.test(input)) return null;
		if (!reverse) return input.substring(start, stop);
		return input.substring(input.length - stop, input.length - start);
	};
	var uriEncode = (value) => encodeURIComponent(value).replace(/[!*'()]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
	var endpointFunctions = {
		booleanEquals,
		coalesce,
		getAttr,
		isSet,
		isValidHostLabel,
		ite,
		not,
		parseURL,
		split,
		stringEquals,
		substring,
		uriEncode
	};
	var evaluateTemplate = (template, options) => {
		const evaluatedTemplateArr = [];
		const { referenceRecord, endpointParams } = options;
		let currentIndex = 0;
		while (currentIndex < template.length) {
			const openingBraceIndex = template.indexOf("{", currentIndex);
			if (openingBraceIndex === -1) {
				evaluatedTemplateArr.push(template.slice(currentIndex));
				break;
			}
			evaluatedTemplateArr.push(template.slice(currentIndex, openingBraceIndex));
			const closingBraceIndex = template.indexOf("}", openingBraceIndex);
			if (closingBraceIndex === -1) {
				evaluatedTemplateArr.push(template.slice(openingBraceIndex));
				break;
			}
			if (template[openingBraceIndex + 1] === "{" && template[closingBraceIndex + 1] === "}") {
				evaluatedTemplateArr.push(template.slice(openingBraceIndex + 1, closingBraceIndex));
				currentIndex = closingBraceIndex + 2;
			}
			const parameterName = template.substring(openingBraceIndex + 1, closingBraceIndex);
			if (parameterName.includes("#")) {
				const [refName, attrName] = parameterName.split("#");
				evaluatedTemplateArr.push(getAttr(referenceRecord[refName] ?? endpointParams[refName], attrName));
			} else evaluatedTemplateArr.push(referenceRecord[parameterName] ?? endpointParams[parameterName]);
			currentIndex = closingBraceIndex + 1;
		}
		return evaluatedTemplateArr.join("");
	};
	var getReferenceValue = ({ ref }, options) => {
		return options.referenceRecord[ref] ?? options.endpointParams[ref];
	};
	var evaluateExpression = (obj, keyName, options) => {
		if (typeof obj === "string") return evaluateTemplate(obj, options);
		else if (obj["fn"]) return group$2.callFunction(obj, options);
		else if (obj["ref"]) return getReferenceValue(obj, options);
		throw new EndpointError(`'${keyName}': ${String(obj)} is not a string, function or reference.`);
	};
	var callFunction = ({ fn, argv }, options) => {
		const evaluatedArgs = Array(argv.length);
		for (let i = 0; i < evaluatedArgs.length; ++i) {
			const arg = argv[i];
			if (typeof arg === "boolean" || typeof arg === "number") evaluatedArgs[i] = arg;
			else evaluatedArgs[i] = group$2.evaluateExpression(arg, "arg", options);
		}
		const namespaceSeparatorIndex = fn.indexOf(".");
		if (namespaceSeparatorIndex !== -1) {
			const customFunction = customEndpointFunctions[fn.slice(0, namespaceSeparatorIndex)]?.[fn.slice(namespaceSeparatorIndex + 1)];
			if (typeof customFunction === "function") return customFunction(...evaluatedArgs);
		}
		const callable = endpointFunctions[fn];
		if (typeof callable === "function") return callable(...evaluatedArgs);
		throw new Error(`function ${fn} not loaded in endpointFunctions.`);
	};
	var group$2 = {
		evaluateExpression,
		callFunction
	};
	var evaluateCondition = (condition, options) => {
		const { assign } = condition;
		if (assign && assign in options.referenceRecord) throw new EndpointError(`'${assign}' is already defined in Reference Record.`);
		const value = callFunction(condition, options);
		options.logger?.debug?.(`${debugId} evaluateCondition: ${toDebugString(condition)} = ${toDebugString(value)}`);
		const result = value === "" ? true : !!value;
		if (assign != null) return {
			result,
			toAssign: {
				name: assign,
				value
			}
		};
		return { result };
	};
	var getEndpointHeaders = (headers, options) => Object.entries(headers ?? {}).reduce((acc, [headerKey, headerVal]) => {
		acc[headerKey] = headerVal.map((headerValEntry) => {
			const processedExpr = evaluateExpression(headerValEntry, "Header value entry", options);
			if (typeof processedExpr !== "string") throw new EndpointError(`Header '${headerKey}' value '${processedExpr}' is not a string`);
			return processedExpr;
		});
		return acc;
	}, {});
	var getEndpointProperties = (properties, options) => Object.entries(properties).reduce((acc, [propertyKey, propertyVal]) => {
		acc[propertyKey] = group$1.getEndpointProperty(propertyVal, options);
		return acc;
	}, {});
	var getEndpointProperty = (property, options) => {
		if (Array.isArray(property)) return property.map((propertyEntry) => getEndpointProperty(propertyEntry, options));
		switch (typeof property) {
			case "string": return evaluateTemplate(property, options);
			case "object":
				if (property === null) throw new EndpointError(`Unexpected endpoint property: ${property}`);
				return group$1.getEndpointProperties(property, options);
			case "boolean": return property;
			default: throw new EndpointError(`Unexpected endpoint property type: ${typeof property}`);
		}
	};
	var group$1 = {
		getEndpointProperty,
		getEndpointProperties
	};
	var getEndpointUrl = (endpointUrl, options) => {
		const expression = evaluateExpression(endpointUrl, "Endpoint URL", options);
		if (typeof expression === "string") try {
			return new URL(expression);
		} catch (error) {
			console.error(`Failed to construct URL with ${expression}`, error);
			throw error;
		}
		throw new EndpointError(`Endpoint URL must be a string, got ${typeof expression}`);
	};
	var RESULT = 1e8;
	var decideEndpoint = (bdd, options) => {
		const { nodes, root, results, conditions } = bdd;
		let ref = root;
		const referenceRecord = {};
		const closure = {
			referenceRecord,
			endpointParams: options.endpointParams,
			logger: options.logger
		};
		while (ref !== 1 && ref !== -1 && ref < RESULT) {
			const node_i = 3 * (Math.abs(ref) - 1);
			const [condition_i, highRef, lowRef] = [
				nodes[node_i],
				nodes[node_i + 1],
				nodes[node_i + 2]
			];
			const [fn, argv, assign] = conditions[condition_i];
			const evaluation = evaluateCondition({
				fn,
				assign,
				argv
			}, closure);
			if (evaluation.toAssign) {
				const { name, value } = evaluation.toAssign;
				referenceRecord[name] = value;
			}
			ref = ref >= 0 === evaluation.result ? highRef : lowRef;
		}
		if (ref >= RESULT) {
			const result = results[ref - RESULT];
			if (result[0] === -1) {
				const [, errorExpression] = result;
				throw new EndpointError(evaluateExpression(errorExpression, "Error", closure));
			}
			const [url, properties, headers] = result;
			return {
				url: getEndpointUrl(url, closure),
				properties: getEndpointProperties(properties, closure),
				headers: getEndpointHeaders(headers ?? {}, closure)
			};
		}
		throw new EndpointError(`No matching endpoint.`);
	};
	var evaluateConditions = (conditions = [], options) => {
		const conditionsReferenceRecord = {};
		const conditionOptions = {
			...options,
			referenceRecord: { ...options.referenceRecord }
		};
		let didAssign = false;
		for (const condition of conditions) {
			const { result, toAssign } = evaluateCondition(condition, conditionOptions);
			if (!result) return { result };
			if (toAssign) {
				didAssign = true;
				conditionsReferenceRecord[toAssign.name] = toAssign.value;
				conditionOptions.referenceRecord[toAssign.name] = toAssign.value;
				options.logger?.debug?.(`${debugId} assign: ${toAssign.name} := ${toDebugString(toAssign.value)}`);
			}
		}
		if (didAssign) return {
			result: true,
			referenceRecord: conditionsReferenceRecord
		};
		return { result: true };
	};
	var evaluateEndpointRule = (endpointRule, options) => {
		const { conditions, endpoint } = endpointRule;
		const { result, referenceRecord } = evaluateConditions(conditions, options);
		if (!result) return;
		const endpointRuleOptions = referenceRecord ? {
			...options,
			referenceRecord: {
				...options.referenceRecord,
				...referenceRecord
			}
		} : options;
		const { url, properties, headers } = endpoint;
		options.logger?.debug?.(`${debugId} Resolving endpoint from template: ${toDebugString(endpoint)}`);
		const endpointToReturn = { url: getEndpointUrl(url, endpointRuleOptions) };
		if (headers != null) endpointToReturn.headers = getEndpointHeaders(headers, endpointRuleOptions);
		if (properties != null) endpointToReturn.properties = getEndpointProperties(properties, endpointRuleOptions);
		return endpointToReturn;
	};
	var evaluateErrorRule = (errorRule, options) => {
		const { conditions, error } = errorRule;
		const { result, referenceRecord } = evaluateConditions(conditions, options);
		if (!result) return;
		throw new EndpointError(evaluateExpression(error, "Error", referenceRecord ? {
			...options,
			referenceRecord: {
				...options.referenceRecord,
				...referenceRecord
			}
		} : options));
	};
	var evaluateRules = (rules, options) => {
		for (const rule of rules) if (rule.type === "endpoint") {
			const endpointOrUndefined = evaluateEndpointRule(rule, options);
			if (endpointOrUndefined) return endpointOrUndefined;
		} else if (rule.type === "error") evaluateErrorRule(rule, options);
		else if (rule.type === "tree") {
			const endpointOrUndefined = group.evaluateTreeRule(rule, options);
			if (endpointOrUndefined) return endpointOrUndefined;
		} else throw new EndpointError(`Unknown endpoint rule: ${rule}`);
		throw new EndpointError(`Rules evaluation failed`);
	};
	var evaluateTreeRule = (treeRule, options) => {
		const { conditions, rules } = treeRule;
		const { result, referenceRecord } = evaluateConditions(conditions, options);
		if (!result) return;
		const treeRuleOptions = referenceRecord ? {
			...options,
			referenceRecord: {
				...options.referenceRecord,
				...referenceRecord
			}
		} : options;
		return group.evaluateRules(rules, treeRuleOptions);
	};
	var group = {
		evaluateRules,
		evaluateTreeRule
	};
	var resolveEndpoint = (ruleSetObject, options) => {
		const { endpointParams, logger } = options;
		const { parameters, rules } = ruleSetObject;
		options.logger?.debug?.(`${debugId} Initial EndpointParams: ${toDebugString(endpointParams)}`);
		for (const paramKey in parameters) {
			const parameter = parameters[paramKey];
			const endpointParam = endpointParams[paramKey];
			if (endpointParam == null && parameter.default != null) {
				endpointParams[paramKey] = parameter.default;
				continue;
			}
			if (parameter.required && endpointParam == null) throw new EndpointError(`Missing required parameter: '${paramKey}'`);
		}
		const endpoint = evaluateRules(rules, {
			endpointParams,
			logger,
			referenceRecord: {}
		});
		options.logger?.debug?.(`${debugId} Resolved endpoint: ${toDebugString(endpoint)}`);
		return endpoint;
	};
	var resolveEndpointRequiredConfig = (input) => {
		const { endpoint } = input;
		if (endpoint === void 0) input.endpoint = async () => {
			throw new Error("@smithy/middleware-endpoint: (default endpointRuleSet) endpoint is not set - you must configure an endpoint.");
		};
		return input;
	};
	var getEndpointFromInstructions = bindGetEndpointFromInstructions(getEndpointFromConfig);
	var resolveEndpointConfig = bindResolveEndpointConfig(getEndpointFromConfig);
	var endpointMiddleware = bindEndpointMiddleware(getEndpointFromConfig);
	var getEndpointPlugin = bindGetEndpointPlugin(getEndpointFromConfig);
	exports.BinaryDecisionDiagram = BinaryDecisionDiagram;
	exports.EndpointCache = EndpointCache;
	exports.EndpointError = EndpointError;
	exports.customEndpointFunctions = customEndpointFunctions;
	exports.decideEndpoint = decideEndpoint;
	exports.endpointMiddleware = endpointMiddleware;
	exports.endpointMiddlewareOptions = endpointMiddlewareOptions;
	exports.getEndpointFromInstructions = getEndpointFromInstructions;
	exports.getEndpointPlugin = getEndpointPlugin;
	exports.isIpAddress = isIpAddress;
	exports.resolveEndpoint = resolveEndpoint;
	exports.resolveEndpointConfig = resolveEndpointConfig;
	exports.resolveEndpointRequiredConfig = resolveEndpointRequiredConfig;
	exports.resolveParams = resolveParams;
}));
//#endregion
//#region node_modules/@smithy/core/dist-cjs/submodules/serde/index.js
var require_serde = /* @__PURE__ */ __commonJSMin(((exports) => {
	var { createHmac: createHmac$1, createHash: createHash$1, getRandomValues } = __require("node:crypto");
	var { ReadStream, lstatSync, fstatSync } = __require("node:fs");
	var { HttpResponse } = require_transport();
	var { toEndpointV1 } = require_endpoints();
	var { Readable: Readable$3, Writable: Writable$1, PassThrough: PassThrough$1 } = __require("node:stream");
	var isArrayBuffer = (arg) => typeof ArrayBuffer === "function" && arg instanceof ArrayBuffer || Object.prototype.toString.call(arg) === "[object ArrayBuffer]";
	var fromArrayBuffer = (input, offset = 0, length = input.byteLength - offset) => {
		if (!isArrayBuffer(input)) throw new TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof input} (${input})`);
		return Buffer.from(input, offset, length);
	};
	var fromString = (input, encoding) => {
		if (typeof input !== "string") throw new TypeError(`The "input" argument must be of type string. Received type ${typeof input} (${input})`);
		return encoding ? Buffer.from(input, encoding) : Buffer.from(input);
	};
	var BASE64_REGEX = /^[A-Za-z0-9+/]*={0,2}$/;
	var fromBase64 = (input) => {
		if (input.length * 3 % 4 !== 0) throw new TypeError(`Incorrect padding on base64 string.`);
		if (!BASE64_REGEX.exec(input)) throw new TypeError(`Invalid base64 string.`);
		const buffer = fromString(input, "base64");
		return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
	};
	var fromUtf8$1 = (input) => {
		const buf = fromString(input, "utf8");
		return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT);
	};
	var toBase64$1 = (_input) => {
		let input;
		if (typeof _input === "string") input = fromUtf8$1(_input);
		else input = _input;
		if (typeof input !== "object" || typeof input.byteOffset !== "number" || typeof input.byteLength !== "number") throw new Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
		return fromArrayBuffer(input.buffer, input.byteOffset, input.byteLength).toString("base64");
	};
	function bindUint8ArrayBlobAdapter(toUtf8, fromUtf8, toBase64, fromBase64) {
		return class Uint8ArrayBlobAdapter extends Uint8Array {
			static fromString(source, encoding = "utf-8") {
				if (typeof source === "string") {
					if (encoding === "base64") return Uint8ArrayBlobAdapter.mutate(fromBase64(source));
					return Uint8ArrayBlobAdapter.mutate(fromUtf8(source));
				}
				throw new Error(`Unsupported conversion from ${typeof source} to Uint8ArrayBlobAdapter.`);
			}
			static mutate(source) {
				Object.setPrototypeOf(source, Uint8ArrayBlobAdapter.prototype);
				return source;
			}
			transformToString(encoding = "utf-8") {
				if (encoding === "base64") return toBase64(this);
				return toUtf8(this);
			}
		};
	}
	var toUtf8$1 = (input) => {
		if (typeof input === "string") return input;
		if (typeof input !== "object" || typeof input.byteOffset !== "number" || typeof input.byteLength !== "number") throw new Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
		return fromArrayBuffer(input.buffer, input.byteOffset, input.byteLength).toString("utf8");
	};
	var decimalToHex = Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
	function bindV4(getRandomValues) {
		if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return () => crypto.randomUUID();
		return () => {
			const rnds = /* @__PURE__ */ new Uint8Array(16);
			getRandomValues(rnds);
			rnds[6] = rnds[6] & 15 | 64;
			rnds[8] = rnds[8] & 63 | 128;
			return decimalToHex[rnds[0]] + decimalToHex[rnds[1]] + decimalToHex[rnds[2]] + decimalToHex[rnds[3]] + "-" + decimalToHex[rnds[4]] + decimalToHex[rnds[5]] + "-" + decimalToHex[rnds[6]] + decimalToHex[rnds[7]] + "-" + decimalToHex[rnds[8]] + decimalToHex[rnds[9]] + "-" + decimalToHex[rnds[10]] + decimalToHex[rnds[11]] + decimalToHex[rnds[12]] + decimalToHex[rnds[13]] + decimalToHex[rnds[14]] + decimalToHex[rnds[15]];
		};
	}
	var copyDocumentWithTransform = (source, _schemaRef, _transform = (_) => _) => source;
	var parseBoolean = (value) => {
		switch (value) {
			case "true": return true;
			case "false": return false;
			default: throw new Error(`Unable to parse boolean value "${value}"`);
		}
	};
	var expectBoolean = (value) => {
		if (value === null || value === void 0) return;
		if (typeof value === "number") {
			if (value === 0 || value === 1) logger.warn(stackTraceWarning(`Expected boolean, got ${typeof value}: ${value}`));
			if (value === 0) return false;
			if (value === 1) return true;
		}
		if (typeof value === "string") {
			const lower = value.toLowerCase();
			if (lower === "false" || lower === "true") logger.warn(stackTraceWarning(`Expected boolean, got ${typeof value}: ${value}`));
			if (lower === "false") return false;
			if (lower === "true") return true;
		}
		if (typeof value === "boolean") return value;
		throw new TypeError(`Expected boolean, got ${typeof value}: ${value}`);
	};
	var expectNumber = (value) => {
		if (value === null || value === void 0) return;
		if (typeof value === "string") {
			const parsed = parseFloat(value);
			if (!Number.isNaN(parsed)) {
				if (String(parsed) !== String(value)) logger.warn(stackTraceWarning(`Expected number but observed string: ${value}`));
				return parsed;
			}
		}
		if (typeof value === "number") return value;
		throw new TypeError(`Expected number, got ${typeof value}: ${value}`);
	};
	var MAX_FLOAT = Math.ceil(2 ** 127 * (2 - 2 ** -23));
	var expectFloat32 = (value) => {
		const expected = expectNumber(value);
		if (expected !== void 0 && !Number.isNaN(expected) && expected !== Infinity && expected !== -Infinity) {
			if (Math.abs(expected) > MAX_FLOAT) throw new TypeError(`Expected 32-bit float, got ${value}`);
		}
		return expected;
	};
	var expectLong = (value) => {
		if (value === null || value === void 0) return;
		if (Number.isInteger(value) && !Number.isNaN(value)) return value;
		throw new TypeError(`Expected integer, got ${typeof value}: ${value}`);
	};
	var expectInt = expectLong;
	var expectInt32 = (value) => expectSizedInt(value, 32);
	var expectShort = (value) => expectSizedInt(value, 16);
	var expectByte = (value) => expectSizedInt(value, 8);
	var expectSizedInt = (value, size) => {
		const expected = expectLong(value);
		if (expected !== void 0 && castInt(expected, size) !== expected) throw new TypeError(`Expected ${size}-bit integer, got ${value}`);
		return expected;
	};
	var castInt = (value, size) => {
		switch (size) {
			case 32: return Int32Array.of(value)[0];
			case 16: return Int16Array.of(value)[0];
			case 8: return Int8Array.of(value)[0];
		}
	};
	var expectNonNull = (value, location) => {
		if (value === null || value === void 0) {
			if (location) throw new TypeError(`Expected a non-null value for ${location}`);
			throw new TypeError("Expected a non-null value");
		}
		return value;
	};
	var expectObject = (value) => {
		if (value === null || value === void 0) return;
		if (typeof value === "object" && !Array.isArray(value)) return value;
		throw new TypeError(`Expected object, got ${Array.isArray(value) ? "array" : typeof value}: ${value}`);
	};
	var expectString = (value) => {
		if (value === null || value === void 0) return;
		if (typeof value === "string") return value;
		if ([
			"boolean",
			"number",
			"bigint"
		].includes(typeof value)) {
			logger.warn(stackTraceWarning(`Expected string, got ${typeof value}: ${value}`));
			return String(value);
		}
		throw new TypeError(`Expected string, got ${typeof value}: ${value}`);
	};
	var expectUnion = (value) => {
		if (value === null || value === void 0) return;
		const asObject = expectObject(value);
		const setKeys = [];
		for (const k in asObject) if (asObject[k] != null) setKeys.push(k);
		if (setKeys.length === 0) throw new TypeError(`Unions must have exactly one non-null member. None were found.`);
		if (setKeys.length > 1) throw new TypeError(`Unions must have exactly one non-null member. Keys ${setKeys} were not null.`);
		return asObject;
	};
	var strictParseDouble = (value) => {
		if (typeof value == "string") return expectNumber(parseNumber(value));
		return expectNumber(value);
	};
	var strictParseFloat = strictParseDouble;
	var strictParseFloat32 = (value) => {
		if (typeof value == "string") return expectFloat32(parseNumber(value));
		return expectFloat32(value);
	};
	var NUMBER_REGEX = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g;
	var parseNumber = (value) => {
		const matches = value.match(NUMBER_REGEX);
		if (matches === null || matches[0].length !== value.length) throw new TypeError(`Expected real number, got implicit NaN`);
		return parseFloat(value);
	};
	var limitedParseDouble = (value) => {
		if (typeof value == "string") return parseFloatString(value);
		return expectNumber(value);
	};
	var handleFloat = limitedParseDouble;
	var limitedParseFloat = limitedParseDouble;
	var limitedParseFloat32 = (value) => {
		if (typeof value == "string") return parseFloatString(value);
		return expectFloat32(value);
	};
	var parseFloatString = (value) => {
		switch (value) {
			case "NaN": return NaN;
			case "Infinity": return Infinity;
			case "-Infinity": return -Infinity;
			default: throw new Error(`Unable to parse float value: ${value}`);
		}
	};
	var strictParseLong = (value) => {
		if (typeof value === "string") return expectLong(parseNumber(value));
		return expectLong(value);
	};
	var strictParseInt = strictParseLong;
	var strictParseInt32 = (value) => {
		if (typeof value === "string") return expectInt32(parseNumber(value));
		return expectInt32(value);
	};
	var strictParseShort = (value) => {
		if (typeof value === "string") return expectShort(parseNumber(value));
		return expectShort(value);
	};
	var strictParseByte = (value) => {
		if (typeof value === "string") return expectByte(parseNumber(value));
		return expectByte(value);
	};
	var stackTraceWarning = (message) => {
		return String(new TypeError(message).stack || message).split("\n").slice(0, 5).filter((s) => !s.includes("stackTraceWarning")).join("\n");
	};
	var logger = { warn: console.warn };
	var DAYS = [
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat"
	];
	var MONTHS = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	];
	function dateToUtcString(date) {
		const year = date.getUTCFullYear();
		const month = date.getUTCMonth();
		const dayOfWeek = date.getUTCDay();
		const dayOfMonthInt = date.getUTCDate();
		const hoursInt = date.getUTCHours();
		const minutesInt = date.getUTCMinutes();
		const secondsInt = date.getUTCSeconds();
		const dayOfMonthString = dayOfMonthInt < 10 ? `0${dayOfMonthInt}` : `${dayOfMonthInt}`;
		const hoursString = hoursInt < 10 ? `0${hoursInt}` : `${hoursInt}`;
		const minutesString = minutesInt < 10 ? `0${minutesInt}` : `${minutesInt}`;
		const secondsString = secondsInt < 10 ? `0${secondsInt}` : `${secondsInt}`;
		return `${DAYS[dayOfWeek]}, ${dayOfMonthString} ${MONTHS[month]} ${year} ${hoursString}:${minutesString}:${secondsString} GMT`;
	}
	var RFC3339 = /* @__PURE__ */ new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?[zZ]$/);
	var parseRfc3339DateTime = (value) => {
		if (value === null || value === void 0) return;
		if (typeof value !== "string") throw new TypeError("RFC-3339 date-times must be expressed as strings");
		const match = RFC3339.exec(value);
		if (!match) throw new TypeError("Invalid RFC-3339 date-time value");
		const [_, yearStr, monthStr, dayStr, hours, minutes, seconds, fractionalMilliseconds] = match;
		return buildDate(strictParseShort(stripLeadingZeroes(yearStr)), parseDateValue(monthStr, "month", 1, 12), parseDateValue(dayStr, "day", 1, 31), {
			hours,
			minutes,
			seconds,
			fractionalMilliseconds
		});
	};
	var RFC3339_WITH_OFFSET$1 = /* @__PURE__ */ new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(([-+]\d{2}:\d{2})|[zZ])$/);
	var parseRfc3339DateTimeWithOffset = (value) => {
		if (value === null || value === void 0) return;
		if (typeof value !== "string") throw new TypeError("RFC-3339 date-times must be expressed as strings");
		const match = RFC3339_WITH_OFFSET$1.exec(value);
		if (!match) throw new TypeError("Invalid RFC-3339 date-time value");
		const [_, yearStr, monthStr, dayStr, hours, minutes, seconds, fractionalMilliseconds, offsetStr] = match;
		const date = buildDate(strictParseShort(stripLeadingZeroes(yearStr)), parseDateValue(monthStr, "month", 1, 12), parseDateValue(dayStr, "day", 1, 31), {
			hours,
			minutes,
			seconds,
			fractionalMilliseconds
		});
		if (offsetStr.toUpperCase() != "Z") date.setTime(date.getTime() - parseOffsetToMilliseconds(offsetStr));
		return date;
	};
	var IMF_FIXDATE$1 = /* @__PURE__ */ new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/);
	var RFC_850_DATE$1 = /* @__PURE__ */ new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/);
	var ASC_TIME$1 = /* @__PURE__ */ new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/);
	var parseRfc7231DateTime = (value) => {
		if (value === null || value === void 0) return;
		if (typeof value !== "string") throw new TypeError("RFC-7231 date-times must be expressed as strings");
		let match = IMF_FIXDATE$1.exec(value);
		if (match) {
			const [_, dayStr, monthStr, yearStr, hours, minutes, seconds, fractionalMilliseconds] = match;
			return buildDate(strictParseShort(stripLeadingZeroes(yearStr)), parseMonthByShortName(monthStr), parseDateValue(dayStr, "day", 1, 31), {
				hours,
				minutes,
				seconds,
				fractionalMilliseconds
			});
		}
		match = RFC_850_DATE$1.exec(value);
		if (match) {
			const [_, dayStr, monthStr, yearStr, hours, minutes, seconds, fractionalMilliseconds] = match;
			return adjustRfc850Year(buildDate(parseTwoDigitYear(yearStr), parseMonthByShortName(monthStr), parseDateValue(dayStr, "day", 1, 31), {
				hours,
				minutes,
				seconds,
				fractionalMilliseconds
			}));
		}
		match = ASC_TIME$1.exec(value);
		if (match) {
			const [_, monthStr, dayStr, hours, minutes, seconds, fractionalMilliseconds, yearStr] = match;
			return buildDate(strictParseShort(stripLeadingZeroes(yearStr)), parseMonthByShortName(monthStr), parseDateValue(dayStr.trimLeft(), "day", 1, 31), {
				hours,
				minutes,
				seconds,
				fractionalMilliseconds
			});
		}
		throw new TypeError("Invalid RFC-7231 date-time value");
	};
	var parseEpochTimestamp = (value) => {
		if (value === null || value === void 0) return;
		let valueAsDouble;
		if (typeof value === "number") valueAsDouble = value;
		else if (typeof value === "string") valueAsDouble = strictParseDouble(value);
		else if (typeof value === "object" && value.tag === 1) valueAsDouble = value.value;
		else throw new TypeError("Epoch timestamps must be expressed as floating point numbers or their string representation");
		if (Number.isNaN(valueAsDouble) || valueAsDouble === Infinity || valueAsDouble === -Infinity) throw new TypeError("Epoch timestamps must be valid, non-Infinite, non-NaN numerics");
		return new Date(Math.round(valueAsDouble * 1e3));
	};
	var buildDate = (year, month, day, time) => {
		const adjustedMonth = month - 1;
		validateDayOfMonth(year, adjustedMonth, day);
		return new Date(Date.UTC(year, adjustedMonth, day, parseDateValue(time.hours, "hour", 0, 23), parseDateValue(time.minutes, "minute", 0, 59), parseDateValue(time.seconds, "seconds", 0, 60), parseMilliseconds(time.fractionalMilliseconds)));
	};
	var parseTwoDigitYear = (value) => {
		const thisYear = (/* @__PURE__ */ new Date()).getUTCFullYear();
		const valueInThisCentury = Math.floor(thisYear / 100) * 100 + strictParseShort(stripLeadingZeroes(value));
		if (valueInThisCentury < thisYear) return valueInThisCentury + 100;
		return valueInThisCentury;
	};
	var FIFTY_YEARS_IN_MILLIS = 50 * 365 * 24 * 60 * 60 * 1e3;
	var adjustRfc850Year = (input) => {
		if (input.getTime() - (/* @__PURE__ */ new Date()).getTime() > FIFTY_YEARS_IN_MILLIS) return new Date(Date.UTC(input.getUTCFullYear() - 100, input.getUTCMonth(), input.getUTCDate(), input.getUTCHours(), input.getUTCMinutes(), input.getUTCSeconds(), input.getUTCMilliseconds()));
		return input;
	};
	var parseMonthByShortName = (value) => {
		const monthIdx = MONTHS.indexOf(value);
		if (monthIdx < 0) throw new TypeError(`Invalid month: ${value}`);
		return monthIdx + 1;
	};
	var DAYS_IN_MONTH = [
		31,
		28,
		31,
		30,
		31,
		30,
		31,
		31,
		30,
		31,
		30,
		31
	];
	var validateDayOfMonth = (year, month, day) => {
		let maxDays = DAYS_IN_MONTH[month];
		if (month === 1 && isLeapYear(year)) maxDays = 29;
		if (day > maxDays) throw new TypeError(`Invalid day for ${MONTHS[month]} in ${year}: ${day}`);
	};
	var isLeapYear = (year) => {
		return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
	};
	var parseDateValue = (value, type, lower, upper) => {
		const dateVal = strictParseByte(stripLeadingZeroes(value));
		if (dateVal < lower || dateVal > upper) throw new TypeError(`${type} must be between ${lower} and ${upper}, inclusive`);
		return dateVal;
	};
	var parseMilliseconds = (value) => {
		if (value === null || value === void 0) return 0;
		return strictParseFloat32("0." + value) * 1e3;
	};
	var parseOffsetToMilliseconds = (value) => {
		const directionStr = value[0];
		let direction = 1;
		if (directionStr == "+") direction = 1;
		else if (directionStr == "-") direction = -1;
		else throw new TypeError(`Offset direction, ${directionStr}, must be "+" or "-"`);
		const hour = Number(value.substring(1, 3));
		const minute = Number(value.substring(4, 6));
		return direction * (hour * 60 + minute) * 60 * 1e3;
	};
	var stripLeadingZeroes = (value) => {
		let idx = 0;
		while (idx < value.length - 1 && value.charAt(idx) === "0") idx++;
		if (idx === 0) return value;
		return value.slice(idx);
	};
	var LazyJsonString = function LazyJsonString(val) {
		return Object.assign(new String(val), {
			deserializeJSON() {
				return JSON.parse(String(val));
			},
			toString() {
				return String(val);
			},
			toJSON() {
				return String(val);
			}
		});
	};
	LazyJsonString.from = (object) => {
		if (object && typeof object === "object" && (object instanceof LazyJsonString || "deserializeJSON" in object)) return object;
		else if (typeof object === "string" || Object.getPrototypeOf(object) === String.prototype) return LazyJsonString(String(object));
		return LazyJsonString(JSON.stringify(object));
	};
	LazyJsonString.fromObject = LazyJsonString.from;
	function quoteHeader(part) {
		if (part.includes(",") || part.includes("\"")) part = `"${part.replace(/"/g, "\\\"")}"`;
		return part;
	}
	var ddd = `(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)(?:[ne|u?r]?s?day)?`;
	var mmm = `(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)`;
	var time = `(\\d?\\d):(\\d{2}):(\\d{2})(?:\\.(\\d+))?`;
	var date = `(\\d?\\d)`;
	var year = `(\\d{4})`;
	var RFC3339_WITH_OFFSET = /* @__PURE__ */ new RegExp(/^(\d{4})-(\d\d)-(\d\d)[tT](\d\d):(\d\d):(\d\d)(\.(\d+))?(([-+]\d\d:\d\d)|[zZ])$/);
	var IMF_FIXDATE = new RegExp(`^${ddd}, ${date} ${mmm} ${year} ${time} GMT$`);
	var RFC_850_DATE = new RegExp(`^${ddd}, ${date}-${mmm}-(\\d\\d) ${time} GMT$`);
	var ASC_TIME = new RegExp(`^${ddd} ${mmm} ( [1-9]|\\d\\d) ${time} ${year}$`);
	var months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	];
	var _parseEpochTimestamp = (value) => {
		if (value == null) return;
		let num = NaN;
		if (typeof value === "number") num = value;
		else if (typeof value === "string") {
			if (!/^-?\d*\.?\d+$/.test(value)) throw new TypeError(`parseEpochTimestamp - numeric string invalid.`);
			num = Number.parseFloat(value);
		} else if (typeof value === "object" && value.tag === 1) num = value.value;
		if (isNaN(num) || Math.abs(num) === Infinity) throw new TypeError("Epoch timestamps must be valid finite numbers.");
		return new Date(Math.round(num * 1e3));
	};
	var _parseRfc3339DateTimeWithOffset = (value) => {
		if (value == null) return;
		if (typeof value !== "string") throw new TypeError("RFC3339 timestamps must be strings");
		const matches = RFC3339_WITH_OFFSET.exec(value);
		if (!matches) throw new TypeError(`Invalid RFC3339 timestamp format ${value}`);
		const [, yearStr, monthStr, dayStr, hours, minutes, seconds, , ms, offsetStr] = matches;
		range(monthStr, 1, 12);
		range(dayStr, 1, 31);
		range(hours, 0, 23);
		range(minutes, 0, 59);
		range(seconds, 0, 60);
		const date = new Date(Date.UTC(Number(yearStr), Number(monthStr) - 1, Number(dayStr), Number(hours), Number(minutes), Number(seconds), Number(ms) ? Math.round(parseFloat(`0.${ms}`) * 1e3) : 0));
		date.setUTCFullYear(Number(yearStr));
		if (offsetStr.toUpperCase() != "Z") {
			const [, sign, offsetH, offsetM] = /([+-])(\d\d):(\d\d)/.exec(offsetStr) || [
				void 0,
				"+",
				0,
				0
			];
			const scalar = sign === "-" ? 1 : -1;
			date.setTime(date.getTime() + scalar * (Number(offsetH) * 60 * 60 * 1e3 + Number(offsetM) * 60 * 1e3));
		}
		return date;
	};
	var _parseRfc7231DateTime = (value) => {
		if (value == null) return;
		if (typeof value !== "string") throw new TypeError("RFC7231 timestamps must be strings.");
		let day;
		let month;
		let year;
		let hour;
		let minute;
		let second;
		let fraction;
		let matches;
		if (matches = IMF_FIXDATE.exec(value)) [, day, month, year, hour, minute, second, fraction] = matches;
		else if (matches = RFC_850_DATE.exec(value)) {
			[, day, month, year, hour, minute, second, fraction] = matches;
			year = (Number(year) + 1900).toString();
		} else if (matches = ASC_TIME.exec(value)) [, month, day, hour, minute, second, fraction, year] = matches;
		if (year && second) {
			const timestamp = Date.UTC(Number(year), months.indexOf(month), Number(day), Number(hour), Number(minute), Number(second), fraction ? Math.round(parseFloat(`0.${fraction}`) * 1e3) : 0);
			range(day, 1, 31);
			range(hour, 0, 23);
			range(minute, 0, 59);
			range(second, 0, 60);
			const date = new Date(timestamp);
			date.setUTCFullYear(Number(year));
			return date;
		}
		throw new TypeError(`Invalid RFC7231 date-time value ${value}.`);
	};
	function range(v, min, max) {
		const _v = Number(v);
		if (_v < min || _v > max) throw new Error(`Value ${_v} out of range [${min}, ${max}]`);
	}
	function splitEvery(value, delimiter, numDelimiters) {
		if (numDelimiters <= 0 || !Number.isInteger(numDelimiters)) throw new Error("Invalid number of delimiters (" + numDelimiters + ") for splitEvery.");
		const segments = value.split(delimiter);
		if (numDelimiters === 1) return segments;
		const compoundSegments = [];
		let currentSegment = "";
		for (let i = 0; i < segments.length; i++) {
			if (currentSegment === "") currentSegment = segments[i];
			else currentSegment += delimiter + segments[i];
			if ((i + 1) % numDelimiters === 0) {
				compoundSegments.push(currentSegment);
				currentSegment = "";
			}
		}
		if (currentSegment !== "") compoundSegments.push(currentSegment);
		return compoundSegments;
	}
	var splitHeader = (value) => {
		const z = value.length;
		const values = [];
		let withinQuotes = false;
		let prevChar = void 0;
		let anchor = 0;
		for (let i = 0; i < z; ++i) {
			const char = value[i];
			switch (char) {
				case `"`:
					if (prevChar !== "\\") withinQuotes = !withinQuotes;
					break;
				case ",":
					if (!withinQuotes) {
						values.push(value.slice(anchor, i));
						anchor = i + 1;
					}
					break;
			}
			prevChar = char;
		}
		values.push(value.slice(anchor));
		return values.map((v) => {
			v = v.trim();
			const z = v.length;
			if (z < 2) return v;
			if (v[0] === `"` && v[z - 1] === `"`) v = v.slice(1, z - 1);
			return v.replace(/\\"/g, "\"");
		});
	};
	var format = /^-?\d*(\.\d+)?$/;
	var NumericValue = class NumericValue {
		string;
		type;
		constructor(string, type) {
			this.string = string;
			this.type = type;
			if (!format.test(string)) throw new Error(`@smithy/core/serde - NumericValue must only contain [0-9], at most one decimal point ".", and an optional negation prefix "-".`);
		}
		toString() {
			return this.string;
		}
		static [Symbol.hasInstance](object) {
			if (!object || typeof object !== "object") return false;
			const _nv = object;
			return NumericValue.prototype.isPrototypeOf(object) || _nv.type === "bigDecimal" && format.test(_nv.string);
		}
	};
	function nv(input) {
		return new NumericValue(String(input), "bigDecimal");
	}
	var SHORT_TO_HEX = {};
	var HEX_TO_SHORT = {};
	for (let i = 0; i < 256; i++) {
		let encodedByte = i.toString(16).toLowerCase();
		if (encodedByte.length === 1) encodedByte = `0${encodedByte}`;
		SHORT_TO_HEX[i] = encodedByte;
		HEX_TO_SHORT[encodedByte] = i;
	}
	function fromHex(encoded) {
		if (encoded.length % 2 !== 0) throw new Error("Hex encoded strings must have an even number length");
		const out = new Uint8Array(encoded.length / 2);
		for (let i = 0; i < encoded.length; i += 2) {
			const encodedByte = encoded.slice(i, i + 2).toLowerCase();
			if (encodedByte in HEX_TO_SHORT) out[i / 2] = HEX_TO_SHORT[encodedByte];
			else throw new Error(`Cannot decode unrecognized sequence ${encodedByte} as hexadecimal`);
		}
		return out;
	}
	function toHex(bytes) {
		let out = "";
		for (let i = 0; i < bytes.byteLength; i++) out += SHORT_TO_HEX[bytes[i]];
		return out;
	}
	var calculateBodyLength = (body) => {
		if (!body) return 0;
		if (typeof body === "string") return Buffer.byteLength(body);
		else if (typeof body.byteLength === "number") return body.byteLength;
		else if (typeof body.size === "number") return body.size;
		else if (typeof body.start === "number" && typeof body.end === "number") return body.end + 1 - body.start;
		else if (body instanceof ReadStream) {
			if (body.path != null) return lstatSync(body.path).size;
			else if (typeof body.fd === "number") return fstatSync(body.fd).size;
		}
		throw new Error(`Body Length computation failed for ${body}`);
	};
	var toUint8Array = (data) => {
		if (data instanceof Uint8Array) return data;
		if (typeof data === "string") return fromUtf8$1(data);
		if (ArrayBuffer.isView(data)) return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
		return new Uint8Array(data);
	};
	function concatBytes(arrays, length) {
		if (length === void 0) {
			length = 0;
			for (const bytes of arrays) length += bytes.byteLength;
		}
		const result = new Uint8Array(length);
		let offset = 0;
		for (const buf of arrays) {
			result.set(buf, offset);
			offset += buf.byteLength;
		}
		return result;
	}
	var deserializerMiddleware = (options, deserializer) => (next, context) => async (args) => {
		const { response } = await next(args);
		try {
			return {
				response,
				output: await deserializer(response, options)
			};
		} catch (error) {
			Object.defineProperty(error, "$response", {
				value: response,
				enumerable: false,
				writable: false,
				configurable: false
			});
			if (!("$metadata" in error)) {
				const hint = `Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.`;
				try {
					error.message += "\n  " + hint;
				} catch (ignored) {
					if (!context.logger || context.logger?.constructor?.name === "NoOpLogger") console.warn(hint);
					else context.logger?.warn?.(hint);
				}
				if (typeof error.$responseBodyText !== "undefined") {
					if (error.$response) error.$response.body = error.$responseBodyText;
				}
				try {
					if (HttpResponse.isInstance(response)) {
						const { headers = {} } = response;
						const headerEntries = Object.entries(headers);
						error.$metadata = {
							httpStatusCode: response.statusCode,
							requestId: findHeader(/^x-[\w-]+-request-?id$/, headerEntries),
							extendedRequestId: findHeader(/^x-[\w-]+-id-2$/, headerEntries),
							cfId: findHeader(/^x-[\w-]+-cf-id$/, headerEntries)
						};
					}
				} catch (ignored) {}
			}
			throw error;
		}
	};
	var findHeader = (pattern, headers) => {
		return (headers.find(([k]) => {
			return k.match(pattern);
		}) || [void 0, void 0])[1];
	};
	var serializerMiddleware = (options, serializer) => (next, context) => async (args) => {
		const endpointConfig = options;
		const endpoint = context.endpointV2 ? async () => toEndpointV1(context.endpointV2) : endpointConfig.endpoint;
		if (!endpoint) throw new Error("No valid endpoint provider available.");
		const request = await serializer(args.input, {
			...options,
			endpoint
		});
		return next({
			...args,
			request
		});
	};
	var deserializerMiddlewareOption = {
		name: "deserializerMiddleware",
		step: "deserialize",
		tags: ["DESERIALIZER"],
		override: true
	};
	var serializerMiddlewareOption = {
		name: "serializerMiddleware",
		step: "serialize",
		tags: ["SERIALIZER"],
		override: true
	};
	function getSerdePlugin(config, serializer, deserializer) {
		return { applyToStack: (commandStack) => {
			commandStack.add(deserializerMiddleware(config, deserializer), deserializerMiddlewareOption);
			commandStack.add(serializerMiddleware(config, serializer), serializerMiddlewareOption);
		} };
	}
	var Hash = class {
		algorithmIdentifier;
		secret;
		hash;
		constructor(algorithmIdentifier, secret) {
			this.algorithmIdentifier = algorithmIdentifier;
			this.secret = secret;
			this.reset();
		}
		update(toHash, encoding) {
			this.hash.update(toUint8Array(castSourceData(toHash, encoding)));
		}
		digest() {
			return Promise.resolve(this.hash.digest());
		}
		reset() {
			this.hash = this.secret ? createHmac$1(this.algorithmIdentifier, castSourceData(this.secret)) : createHash$1(this.algorithmIdentifier);
		}
	};
	function castSourceData(toCast, encoding) {
		if (Buffer.isBuffer(toCast)) return toCast;
		if (typeof toCast === "string") return fromString(toCast, encoding);
		if (ArrayBuffer.isView(toCast)) return fromArrayBuffer(toCast.buffer, toCast.byteOffset, toCast.byteLength);
		return fromArrayBuffer(toCast);
	}
	var ChecksumStream$1 = class ChecksumStream extends Readable$3 {
		expectedChecksum;
		checksumSourceLocation;
		checksum;
		source;
		base64Encoder;
		constructor({ expectedChecksum, checksum, source, checksumSourceLocation, base64Encoder }) {
			super();
			if (typeof source.pipe !== "function") throw new Error(`@smithy/util-stream: unsupported source type ${source?.constructor?.name ?? source} in ChecksumStream.`);
			this.source = source;
			this.base64Encoder = base64Encoder ?? toBase64$1;
			this.expectedChecksum = expectedChecksum;
			this.checksum = checksum;
			this.checksumSourceLocation = checksumSourceLocation;
			this.source.on("data", this.onSourceData);
			this.source.on("end", this.onSourceEnd);
			this.source.on("error", this.onSourceError);
			this.source.on("close", this.onSourceClose);
			this.source.pause();
		}
		onSourceData = (chunk) => {
			if (this.destroyed) return;
			try {
				this.checksum.update(chunk);
			} catch (e) {
				this.destroy(e);
				return;
			}
			if (!this.push(chunk)) this.source.pause();
		};
		onSourceEnd = async () => {
			if (this.destroyed) return;
			try {
				const digest = await this.checksum.digest();
				const received = this.base64Encoder(digest);
				if (this.expectedChecksum !== received) {
					this.destroy(/* @__PURE__ */ new Error(`Checksum mismatch: expected "${this.expectedChecksum}" but received "${received}" in response header "${this.checksumSourceLocation}".`));
					return;
				}
			} catch (e) {
				this.destroy(e);
				return;
			}
			this.push(null);
		};
		onSourceError = (error) => {
			this.destroy(error);
		};
		onSourceClose = () => {
			if (!this.destroyed && !this.source.readableEnded) this.destroy(/* @__PURE__ */ new Error("Connection lost or stream closed before all data was received."));
		};
		_read(_size) {
			this.source.resume();
		}
		_destroy(error, callback) {
			this.source?.removeListener("data", this.onSourceData);
			this.source?.removeListener("end", this.onSourceEnd);
			this.source?.removeListener("error", this.onSourceError);
			this.source?.removeListener("close", this.onSourceClose);
			this.source?.destroy();
			callback(error);
		}
	};
	var isReadableStream = (stream) => typeof ReadableStream === "function" && (stream?.constructor?.name === ReadableStream.name || stream instanceof ReadableStream);
	var isBlob = (blob) => {
		return typeof Blob === "function" && (blob?.constructor?.name === Blob.name || blob instanceof Blob);
	};
	var fromUtf8 = (input) => new TextEncoder().encode(input);
	var chars = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`;
	Object.entries(chars).reduce((acc, [i, c]) => {
		acc[c] = Number(i);
		return acc;
	}, {});
	var alphabetByValue = chars.split("");
	var bitsPerLetter = 6;
	var bitsPerByte = 8;
	var maxLetterValue = 63;
	function toBase64(_input) {
		let input;
		if (typeof _input === "string") input = fromUtf8(_input);
		else input = _input;
		const isArrayLike = typeof input === "object" && typeof input.length === "number";
		const isUint8Array = typeof input === "object" && typeof input.byteOffset === "number" && typeof input.byteLength === "number";
		if (!isArrayLike && !isUint8Array) throw new Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
		let str = "";
		for (let i = 0; i < input.length; i += 3) {
			let bits = 0;
			let bitLength = 0;
			for (let j = i, limit = Math.min(i + 3, input.length); j < limit; j++) {
				bits |= input[j] << (limit - j - 1) * bitsPerByte;
				bitLength += bitsPerByte;
			}
			const bitClusterCount = Math.ceil(bitLength / bitsPerLetter);
			bits <<= bitClusterCount * bitsPerLetter - bitLength;
			for (let k = 1; k <= bitClusterCount; k++) {
				const offset = (bitClusterCount - k) * bitsPerLetter;
				str += alphabetByValue[(bits & maxLetterValue << offset) >> offset];
			}
			str += "==".slice(0, 4 - bitClusterCount);
		}
		return str;
	}
	var ReadableStreamRef = typeof ReadableStream === "function" ? ReadableStream : function() {};
	var ChecksumStream = class extends ReadableStreamRef {};
	var createChecksumStream$1 = ({ expectedChecksum, checksum, source, checksumSourceLocation, base64Encoder }) => {
		if (!isReadableStream(source)) throw new Error(`@smithy/util-stream: unsupported source type ${source?.constructor?.name ?? source} in ChecksumStream.`);
		const encoder = base64Encoder ?? toBase64;
		if (typeof TransformStream !== "function") throw new Error("@smithy/util-stream: unable to instantiate ChecksumStream because API unavailable: ReadableStream/TransformStream.");
		const transform = new TransformStream({
			start() {},
			async transform(chunk, controller) {
				checksum.update(chunk);
				controller.enqueue(chunk);
			},
			async flush(controller) {
				const digest = await checksum.digest();
				const received = encoder(digest);
				if (expectedChecksum !== received) {
					const error = /* @__PURE__ */ new Error(`Checksum mismatch: expected "${expectedChecksum}" but received "${received}" in response header "${checksumSourceLocation}".`);
					controller.error(error);
				} else controller.terminate();
			}
		});
		source.pipeThrough(transform);
		const readable = transform.readable;
		Object.setPrototypeOf(readable, ChecksumStream.prototype);
		return readable;
	};
	function createChecksumStream(init) {
		if (typeof ReadableStream === "function" && isReadableStream(init.source)) return createChecksumStream$1(init);
		return new ChecksumStream$1(init);
	}
	var ByteArrayCollector = class {
		allocByteArray;
		byteLength = 0;
		byteArrays = [];
		constructor(allocByteArray) {
			this.allocByteArray = allocByteArray;
		}
		push(byteArray) {
			this.byteArrays.push(byteArray);
			this.byteLength += byteArray.byteLength;
		}
		flush() {
			if (this.byteArrays.length === 1) {
				const bytes = this.byteArrays[0];
				this.reset();
				return bytes;
			}
			const aggregation = this.allocByteArray(this.byteLength);
			let cursor = 0;
			for (let i = 0; i < this.byteArrays.length; ++i) {
				const bytes = this.byteArrays[i];
				aggregation.set(bytes, cursor);
				cursor += bytes.byteLength;
			}
			this.reset();
			return aggregation;
		}
		reset() {
			this.byteArrays = [];
			this.byteLength = 0;
		}
	};
	function createBufferedReadableStream(upstream, size, logger) {
		const reader = upstream.getReader();
		let streamBufferingLoggedWarning = false;
		let bytesSeen = 0;
		const buffers = ["", new ByteArrayCollector((size) => new Uint8Array(size))];
		let mode = -1;
		const pull = async (controller) => {
			const { value, done } = await reader.read();
			const chunk = value;
			if (done) {
				if (mode !== -1) {
					const remainder = flush(buffers, mode);
					if (sizeOf(remainder) > 0) controller.enqueue(remainder);
				}
				controller.close();
			} else {
				const chunkMode = modeOf(chunk, false);
				if (mode !== chunkMode) {
					if (mode >= 0) controller.enqueue(flush(buffers, mode));
					mode = chunkMode;
				}
				if (mode === -1) {
					controller.enqueue(chunk);
					return;
				}
				const chunkSize = sizeOf(chunk);
				bytesSeen += chunkSize;
				const bufferSize = sizeOf(buffers[mode]);
				if (chunkSize >= size && bufferSize === 0) controller.enqueue(chunk);
				else {
					const newSize = merge(buffers, mode, chunk);
					if (!streamBufferingLoggedWarning && bytesSeen > size * 2) {
						streamBufferingLoggedWarning = true;
						logger?.warn(`@smithy/util-stream - stream chunk size ${chunkSize} is below threshold of ${size}, automatically buffering.`);
					}
					if (newSize >= size) controller.enqueue(flush(buffers, mode));
					else await pull(controller);
				}
			}
		};
		return new ReadableStream({ pull });
	}
	function merge(buffers, mode, chunk) {
		switch (mode) {
			case 0:
				buffers[0] += chunk;
				return sizeOf(buffers[0]);
			case 1:
			case 2:
				buffers[mode].push(chunk);
				return sizeOf(buffers[mode]);
		}
	}
	function flush(buffers, mode) {
		switch (mode) {
			case 0:
				const s = buffers[0];
				buffers[0] = "";
				return s;
			case 1:
			case 2: return buffers[mode].flush();
		}
		throw new Error(`@smithy/util-stream - invalid index ${mode} given to flush()`);
	}
	function sizeOf(chunk) {
		return chunk?.byteLength ?? chunk?.length ?? 0;
	}
	function modeOf(chunk, allowBuffer = true) {
		if (allowBuffer && typeof Buffer !== "undefined" && chunk instanceof Buffer) return 2;
		if (chunk instanceof Uint8Array) return 1;
		if (typeof chunk === "string") return 0;
		return -1;
	}
	function createBufferedReadable(upstream, size, logger) {
		if (isReadableStream(upstream)) return createBufferedReadableStream(upstream, size, logger);
		const downstream = new Readable$3({ read() {} });
		let streamBufferingLoggedWarning = false;
		let bytesSeen = 0;
		const buffers = [
			"",
			new ByteArrayCollector((size) => new Uint8Array(size)),
			new ByteArrayCollector((size) => Buffer.from(new Uint8Array(size)))
		];
		let mode = -1;
		upstream.on("data", (chunk) => {
			const chunkMode = modeOf(chunk, true);
			if (mode !== chunkMode) {
				if (mode >= 0) downstream.push(flush(buffers, mode));
				mode = chunkMode;
			}
			if (mode === -1) {
				downstream.push(chunk);
				return;
			}
			const chunkSize = sizeOf(chunk);
			bytesSeen += chunkSize;
			const bufferSize = sizeOf(buffers[mode]);
			if (chunkSize >= size && bufferSize === 0) downstream.push(chunk);
			else {
				const newSize = merge(buffers, mode, chunk);
				if (!streamBufferingLoggedWarning && bytesSeen > size * 2) {
					streamBufferingLoggedWarning = true;
					logger?.warn(`@smithy/util-stream - stream chunk size ${chunkSize} is below threshold of ${size}, automatically buffering.`);
				}
				if (newSize >= size) downstream.push(flush(buffers, mode));
			}
		});
		upstream.on("end", () => {
			if (mode !== -1) {
				const remainder = flush(buffers, mode);
				if (sizeOf(remainder) > 0) downstream.push(remainder);
			}
			downstream.push(null);
		});
		return downstream;
	}
	var getAwsChunkedEncodingStream$1 = (readableStream, options) => {
		const { base64Encoder, bodyLengthChecker, checksumAlgorithmFn, checksumLocationName, streamHasher } = options;
		const checksumRequired = base64Encoder !== void 0 && bodyLengthChecker !== void 0 && checksumAlgorithmFn !== void 0 && checksumLocationName !== void 0 && streamHasher !== void 0;
		const digest = checksumRequired ? streamHasher(checksumAlgorithmFn, readableStream) : void 0;
		const reader = readableStream.getReader();
		return new ReadableStream({ async pull(controller) {
			const { value, done } = await reader.read();
			if (done) {
				controller.enqueue(`0\r\n`);
				if (checksumRequired) {
					const checksum = base64Encoder(await digest);
					controller.enqueue(`${checksumLocationName}:${checksum}\r\n`);
					controller.enqueue(`\r\n`);
				}
				controller.close();
			} else controller.enqueue(`${(bodyLengthChecker(value) || 0).toString(16)}\r\n${value}\r\n`);
		} });
	};
	function getAwsChunkedEncodingStream(stream, options) {
		const readable = stream;
		const readableStream = stream;
		if (isReadableStream(readableStream)) return getAwsChunkedEncodingStream$1(readableStream, options);
		const { base64Encoder, bodyLengthChecker, checksumAlgorithmFn, checksumLocationName, streamHasher } = options;
		const checksumRequired = base64Encoder !== void 0 && checksumAlgorithmFn !== void 0 && checksumLocationName !== void 0 && streamHasher !== void 0;
		const digest = checksumRequired ? streamHasher(checksumAlgorithmFn, readable) : void 0;
		const awsChunkedEncodingStream = new Readable$3({ read: () => {} });
		readable.on("data", (data) => {
			const length = bodyLengthChecker(data) || 0;
			if (length === 0) return;
			awsChunkedEncodingStream.push(`${length.toString(16)}\r\n`);
			awsChunkedEncodingStream.push(data);
			awsChunkedEncodingStream.push("\r\n");
		});
		readable.on("end", async () => {
			awsChunkedEncodingStream.push(`0\r\n`);
			if (checksumRequired) {
				const checksum = base64Encoder(await digest);
				awsChunkedEncodingStream.push(`${checksumLocationName}:${checksum}\r\n`);
				awsChunkedEncodingStream.push(`\r\n`);
			}
			awsChunkedEncodingStream.push(null);
		});
		return awsChunkedEncodingStream;
	}
	async function headStream$1(stream, bytes) {
		let byteLengthCounter = 0;
		const chunks = [];
		const reader = stream.getReader();
		let isDone = false;
		while (!isDone) {
			const { done, value } = await reader.read();
			if (value) {
				chunks.push(value);
				byteLengthCounter += value?.byteLength ?? 0;
			}
			if (byteLengthCounter >= bytes) break;
			isDone = done;
		}
		reader.releaseLock();
		const collected = new Uint8Array(Math.min(bytes, byteLengthCounter));
		let offset = 0;
		for (const chunk of chunks) {
			if (chunk.byteLength > collected.byteLength - offset) {
				collected.set(chunk.subarray(0, collected.byteLength - offset), offset);
				break;
			} else collected.set(chunk, offset);
			offset += chunk.length;
		}
		return collected;
	}
	var headStream = (stream, bytes) => {
		if (isReadableStream(stream)) return headStream$1(stream, bytes);
		return new Promise((resolve, reject) => {
			const collector = new Collector$1();
			collector.limit = bytes;
			stream.pipe(collector);
			stream.on("error", (err) => {
				collector.end();
				reject(err);
			});
			collector.on("error", reject);
			collector.on("finish", function() {
				resolve(concatBytes(this.buffers));
			});
		});
	};
	var Collector$1 = class Collector extends Writable$1 {
		buffers = [];
		limit = Infinity;
		bytesBuffered = 0;
		_write(chunk, encoding, callback) {
			this.buffers.push(chunk);
			this.bytesBuffered += chunk.byteLength ?? 0;
			if (this.bytesBuffered >= this.limit) {
				const excess = this.bytesBuffered - this.limit;
				const tailBuffer = this.buffers[this.buffers.length - 1];
				this.buffers[this.buffers.length - 1] = tailBuffer.subarray(0, tailBuffer.byteLength - excess);
				this.emit("finish");
			}
			callback();
		}
	};
	var toUtf8 = (input) => {
		if (typeof input === "string") return input;
		if (typeof input !== "object" || typeof input.byteOffset !== "number" || typeof input.byteLength !== "number") throw new Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
		return new TextDecoder("utf-8").decode(input);
	};
	var streamCollector$1 = async (stream) => {
		if (isBlob(stream)) return collectBlob(stream);
		return collectReadableStream(stream);
	};
	async function collectBlob(blob) {
		return blob.arrayBuffer().then((ab) => new Uint8Array(ab));
	}
	async function collectReadableStream(stream) {
		const chunks = [];
		const reader = stream.getReader();
		let length = 0;
		while (true) {
			const { done, value } = await reader.read();
			if (value) {
				chunks.push(value);
				length += value.length;
			}
			if (done) break;
		}
		return concatBytes(chunks, length);
	}
	var ERR_MSG_STREAM_HAS_BEEN_TRANSFORMED$1 = "The stream has already been transformed.";
	var sdkStreamMixin$1 = (stream) => {
		if (!isBlobInstance(stream) && !isReadableStream(stream)) {
			const name = stream?.__proto__?.constructor?.name || stream;
			throw new Error(`Unexpected stream implementation, expect Blob or ReadableStream, got ${name}`);
		}
		let transformed = false;
		const transformToByteArray = async () => {
			if (transformed) throw new Error(ERR_MSG_STREAM_HAS_BEEN_TRANSFORMED$1);
			transformed = true;
			return await streamCollector$1(stream);
		};
		const blobToWebStream = (blob) => {
			if (typeof blob.stream !== "function") throw new Error("Cannot transform payload Blob to web stream. Please make sure the Blob.stream() is polyfilled.\nIf you are using React Native, this API is not yet supported, see: https://react-native.canny.io/feature-requests/p/fetch-streaming-body");
			return blob.stream();
		};
		return Object.assign(stream, {
			transformToByteArray,
			transformToString: async (encoding) => {
				const buf = await transformToByteArray();
				if (encoding === "base64") return toBase64(buf);
				else if (encoding === "hex") return toHex(buf);
				else if (encoding === void 0 || encoding === "utf8" || encoding === "utf-8") return toUtf8(buf);
				else if (typeof TextDecoder === "function") return new TextDecoder(encoding).decode(buf);
				else throw new Error("TextDecoder is not available, please make sure polyfill is provided.");
			},
			transformToWebStream: () => {
				if (transformed) throw new Error(ERR_MSG_STREAM_HAS_BEEN_TRANSFORMED$1);
				transformed = true;
				if (isBlobInstance(stream)) return blobToWebStream(stream);
				else if (isReadableStream(stream)) return stream;
				else throw new Error(`Cannot transform payload to web stream, got ${stream}`);
			}
		});
	};
	var isBlobInstance = (stream) => typeof Blob === "function" && stream instanceof Blob;
	var streamCollector = (stream) => {
		if (isBlob(stream)) return collectBlob(stream);
		if (isReadableStream(stream)) return collectReadableStream(stream);
		return new Promise((resolve, reject) => {
			const collector = new Collector();
			const nodeStream = stream;
			nodeStream.pipe(collector);
			nodeStream.on("error", (err) => {
				collector.end();
				reject(err);
			});
			collector.on("error", reject);
			collector.on("finish", function() {
				resolve(concatBytes(this.bufferedBytes));
			});
		});
	};
	var Collector = class extends Writable$1 {
		bufferedBytes = [];
		_write(chunk, encoding, callback) {
			this.bufferedBytes.push(chunk);
			callback();
		}
	};
	var ERR_MSG_STREAM_HAS_BEEN_TRANSFORMED = "The stream has already been transformed.";
	var sdkStreamMixin = (stream) => {
		if (!(stream instanceof Readable$3)) try {
			return sdkStreamMixin$1(stream);
		} catch (ignored) {
			const name = stream?.__proto__?.constructor?.name || stream;
			throw new Error(`Unexpected stream implementation, expect Stream.Readable instance, got ${name}`);
		}
		let transformed = false;
		const transformToByteArray = async () => {
			if (transformed) throw new Error(ERR_MSG_STREAM_HAS_BEEN_TRANSFORMED);
			transformed = true;
			return await streamCollector(stream);
		};
		return Object.assign(stream, {
			transformToByteArray,
			transformToString: async (encoding) => {
				const buf = await transformToByteArray();
				if (encoding === void 0 || Buffer.isEncoding(encoding)) return fromArrayBuffer(buf.buffer, buf.byteOffset, buf.byteLength).toString(encoding);
				else return new TextDecoder(encoding).decode(buf);
			},
			transformToWebStream: () => {
				if (transformed) throw new Error(ERR_MSG_STREAM_HAS_BEEN_TRANSFORMED);
				if (stream.readableFlowing !== null) throw new Error("The stream has been consumed by other callbacks.");
				if (typeof Readable$3.toWeb !== "function") throw new Error("Readable.toWeb() is not supported. Please ensure a polyfill is available.");
				transformed = true;
				return Readable$3.toWeb(stream);
			}
		});
	};
	async function splitStream$1(stream) {
		if (typeof stream.stream === "function") stream = stream.stream();
		return stream.tee();
	}
	async function splitStream(stream) {
		if (isReadableStream(stream) || isBlob(stream)) return splitStream$1(stream);
		const stream1 = new PassThrough$1();
		const stream2 = new PassThrough$1();
		stream.pipe(stream1);
		stream.pipe(stream2);
		return [stream1, stream2];
	}
	var Uint8ArrayBlobAdapter = class extends bindUint8ArrayBlobAdapter(toUtf8$1, fromUtf8$1, toBase64$1, fromBase64) {};
	var v4 = bindV4(getRandomValues);
	var generateIdempotencyToken = v4;
	exports.ChecksumStream = ChecksumStream$1;
	exports.Hash = Hash;
	exports.LazyJsonString = LazyJsonString;
	exports.NumericValue = NumericValue;
	exports.Uint8ArrayBlobAdapter = Uint8ArrayBlobAdapter;
	exports._parseEpochTimestamp = _parseEpochTimestamp;
	exports._parseRfc3339DateTimeWithOffset = _parseRfc3339DateTimeWithOffset;
	exports._parseRfc7231DateTime = _parseRfc7231DateTime;
	exports.calculateBodyLength = calculateBodyLength;
	exports.concatBytes = concatBytes;
	exports.copyDocumentWithTransform = copyDocumentWithTransform;
	exports.createBufferedReadable = createBufferedReadable;
	exports.createChecksumStream = createChecksumStream;
	exports.dateToUtcString = dateToUtcString;
	exports.deserializerMiddleware = deserializerMiddleware;
	exports.deserializerMiddlewareOption = deserializerMiddlewareOption;
	exports.expectBoolean = expectBoolean;
	exports.expectByte = expectByte;
	exports.expectFloat32 = expectFloat32;
	exports.expectInt = expectInt;
	exports.expectInt32 = expectInt32;
	exports.expectLong = expectLong;
	exports.expectNonNull = expectNonNull;
	exports.expectNumber = expectNumber;
	exports.expectObject = expectObject;
	exports.expectShort = expectShort;
	exports.expectString = expectString;
	exports.expectUnion = expectUnion;
	exports.fromArrayBuffer = fromArrayBuffer;
	exports.fromBase64 = fromBase64;
	exports.fromHex = fromHex;
	exports.fromString = fromString;
	exports.fromUtf8 = fromUtf8$1;
	exports.generateIdempotencyToken = generateIdempotencyToken;
	exports.getAwsChunkedEncodingStream = getAwsChunkedEncodingStream;
	exports.getSerdePlugin = getSerdePlugin;
	exports.handleFloat = handleFloat;
	exports.headStream = headStream;
	exports.isArrayBuffer = isArrayBuffer;
	exports.isBlob = isBlob;
	exports.isReadableStream = isReadableStream;
	exports.limitedParseDouble = limitedParseDouble;
	exports.limitedParseFloat = limitedParseFloat;
	exports.limitedParseFloat32 = limitedParseFloat32;
	exports.logger = logger;
	exports.nv = nv;
	exports.parseBoolean = parseBoolean;
	exports.parseEpochTimestamp = parseEpochTimestamp;
	exports.parseRfc3339DateTime = parseRfc3339DateTime;
	exports.parseRfc3339DateTimeWithOffset = parseRfc3339DateTimeWithOffset;
	exports.parseRfc7231DateTime = parseRfc7231DateTime;
	exports.quoteHeader = quoteHeader;
	exports.sdkStreamMixin = sdkStreamMixin;
	exports.serializerMiddleware = serializerMiddleware;
	exports.serializerMiddlewareOption = serializerMiddlewareOption;
	exports.splitEvery = splitEvery;
	exports.splitHeader = splitHeader;
	exports.splitStream = splitStream;
	exports.streamCollector = streamCollector;
	exports.strictParseByte = strictParseByte;
	exports.strictParseDouble = strictParseDouble;
	exports.strictParseFloat = strictParseFloat;
	exports.strictParseFloat32 = strictParseFloat32;
	exports.strictParseInt = strictParseInt;
	exports.strictParseInt32 = strictParseInt32;
	exports.strictParseLong = strictParseLong;
	exports.strictParseShort = strictParseShort;
	exports.toBase64 = toBase64$1;
	exports.toHex = toHex;
	exports.toUint8Array = toUint8Array;
	exports.toUtf8 = toUtf8$1;
	exports.v4 = v4;
}));
//#endregion
//#region node_modules/@smithy/core/dist-cjs/submodules/checksum/index.js
var require_checksum = /* @__PURE__ */ __commonJSMin(((exports) => {
	var { createReadStream } = __require("node:fs");
	var { Writable } = __require("node:stream");
	var { toUint8Array, concatBytes } = require_serde();
	var { createHash, createHmac } = __require("node:crypto");
	var zlib = __require("node:zlib");
	async function blobReader(blob, onChunk, chunkSize = 1024 * 1024) {
		const size = blob.size;
		let totalBytesRead = 0;
		while (totalBytesRead < size) {
			const slice = blob.slice(totalBytesRead, Math.min(size, totalBytesRead + chunkSize));
			onChunk(new Uint8Array(await slice.arrayBuffer()));
			totalBytesRead += slice.size;
		}
	}
	var blobHasher = async function blobHasher(hashCtor, blob) {
		const hash = new hashCtor();
		await blobReader(blob, (chunk) => {
			hash.update(chunk);
		});
		return hash.digest();
	};
	var HashCalculator = class extends Writable {
		hash;
		constructor(hash, options) {
			super(options);
			this.hash = hash;
		}
		_write(chunk, encoding, callback) {
			try {
				this.hash.update(toUint8Array(chunk));
			} catch (err) {
				return callback(err);
			}
			callback();
		}
	};
	var fileStreamHasher = (hashCtor, fileStream) => new Promise((resolve, reject) => {
		if (!isReadStream(fileStream)) {
			reject(/* @__PURE__ */ new Error("Unable to calculate hash for non-file streams."));
			return;
		}
		const fileStreamTee = createReadStream(fileStream.path, {
			start: fileStream.start,
			end: fileStream.end
		});
		const hash = new hashCtor();
		const hashCalculator = new HashCalculator(hash);
		fileStreamTee.pipe(hashCalculator);
		fileStreamTee.on("error", (err) => {
			hashCalculator.end();
			reject(err);
		});
		hashCalculator.on("error", reject);
		hashCalculator.on("finish", function() {
			hash.digest().then(resolve).catch(reject);
		});
	});
	var isReadStream = (stream) => typeof stream.path === "string";
	var readableStreamHasher = (hashCtor, readableStream) => {
		if (readableStream.readableFlowing !== null) throw new Error("Unable to calculate hash for flowing readable stream");
		const hash = new hashCtor();
		const hashCalculator = new HashCalculator(hash);
		readableStream.pipe(hashCalculator);
		return new Promise((resolve, reject) => {
			readableStream.on("error", (err) => {
				hashCalculator.end();
				reject(err);
			});
			hashCalculator.on("error", reject);
			hashCalculator.on("finish", () => {
				hash.digest().then(resolve).catch(reject);
			});
		});
	};
	var Md5Js = class {
		digestLength = 16;
		state = Uint32Array.from(INIT$1);
		writeBuffer = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(64));
		bufferLength = 0;
		bytesHashed = 0;
		update(sourceData) {
			const data = toUint8Array(sourceData);
			let pos = 0;
			let len = data.byteLength;
			this.bytesHashed += len;
			while (len > 0) {
				this.writeBuffer.setUint8(this.bufferLength++, data[pos++]);
				--len;
				if (this.bufferLength === 64) {
					compress(this.state, this.writeBuffer);
					this.bufferLength = 0;
				}
			}
		}
		async digest() {
			const state = Uint32Array.from(this.state);
			const buf = new DataView(this.writeBuffer.buffer.slice(0));
			let bufLen = this.bufferLength;
			const bits = this.bytesHashed * 8;
			buf.setUint8(bufLen++, 128);
			if (this.bufferLength % 64 >= 56) {
				for (let i = bufLen; i < 64; ++i) buf.setUint8(i, 0);
				compress(state, buf);
				bufLen = 0;
			}
			for (let i = bufLen; i < 56; ++i) buf.setUint8(i, 0);
			buf.setUint32(56, bits >>> 0, true);
			buf.setUint32(60, Math.floor(bits / 2 ** 32), true);
			compress(state, buf);
			const out = /* @__PURE__ */ new Uint8Array(16);
			const view = new DataView(out.buffer);
			for (let i = 0; i < 4; ++i) view.setUint32(i * 4, state[i], true);
			return out;
		}
		reset() {
			this.state.set(INIT$1);
			this.writeBuffer = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(64));
			this.bufferLength = 0;
			this.bytesHashed = 0;
		}
	};
	var INIT$1 = [
		1732584193,
		4023233417,
		2562383102,
		271733878
	];
	var M = 4294967295;
	var S = Uint8Array.of(7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21);
	var T = Array.from({ length: 64 }, (_, i) => Math.abs(Math.sin(i + 1)) * 2 ** 32 >>> 0);
	function compress(state, block) {
		let a = state[0], b = state[1], c = state[2], d = state[3];
		for (let i = 0; i < 64; ++i) {
			let f, g;
			if (i < 16) {
				f = b & c | ~b & d;
				g = i;
			} else if (i < 32) {
				f = d & b | c & ~d;
				g = (5 * i + 1) % 16;
			} else if (i < 48) {
				f = b ^ c ^ d;
				g = (3 * i + 5) % 16;
			} else {
				f = c ^ (b | ~d);
				g = 7 * i % 16;
			}
			const x = block.getUint32(g * 4, true);
			const tmp = d;
			d = c;
			c = b;
			const s = S[(i >> 4) * 4 + (i & 3)];
			const sum = (a + f & M) + (x + T[i] & M) & M;
			b = b + ((sum << s | sum >>> 32 - s) >>> 0) & M;
			a = tmp;
		}
		state[0] = state[0] + a & M;
		state[1] = state[1] + b & M;
		state[2] = state[2] + c & M;
		state[3] = state[3] + d & M;
	}
	var Md5Node = (() => {
		try {
			createHash("md5");
			return true;
		} catch {
			return false;
		}
	})() ? buildNativeClass$2() : Md5Js;
	function buildNativeClass$2() {
		return class Md5Node {
			digestLength = 16;
			hash = createHash("md5");
			update(data) {
				this.hash.update(toUint8Array(data));
			}
			async digest() {
				const buf = this.hash.copy().digest();
				return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
			}
			reset() {
				this.hash = createHash("md5");
			}
		};
	}
	var CRC32_TABLE = /* @__PURE__ */ new Uint32Array(256);
	for (let i = 0; i < 256; ++i) {
		let c = i;
		for (let j = 0; j < 8; ++j) c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
		CRC32_TABLE[i] = c >>> 0;
	}
	var ONES = 4294967295;
	var Crc32Js = class {
		digestLength = 4;
		checksum = ONES;
		update(data) {
			for (let i = 0; i < data.length; ++i) this.checksum = this.checksum >>> 8 ^ CRC32_TABLE[(this.checksum ^ data[i]) & 255];
		}
		digestSync() {
			return (this.checksum ^ ONES) >>> 0;
		}
		async digest() {
			const value = this.digestSync();
			const out = /* @__PURE__ */ new Uint8Array(4);
			new DataView(out.buffer).setUint32(0, value, false);
			return out;
		}
		reset() {
			this.checksum = ONES;
		}
	};
	var zlibCrc32 = typeof zlib.crc32 === "function" ? zlib.crc32 : void 0;
	var Crc32Node = zlibCrc32 ? buildNativeClass$1(zlibCrc32) : Crc32Js;
	function buildNativeClass$1(nativeCrc32) {
		return class Crc32Node {
			digestLength = 4;
			value = 0;
			update(data) {
				this.value = nativeCrc32(data, this.value);
			}
			digestSync() {
				return this.value >>> 0;
			}
			async digest() {
				const out = /* @__PURE__ */ new Uint8Array(4);
				new DataView(out.buffer).setUint32(0, this.digestSync(), false);
				return out;
			}
			reset() {
				this.value = 0;
			}
		};
	}
	var BLOCK = 64;
	var DIGEST_LENGTH = 32;
	var MAX_HASHABLE_LENGTH = 2 ** 53 - 1;
	var Sha256Js = class Sha256Js {
		digestLength = DIGEST_LENGTH;
		state = Int32Array.from(INIT);
		w;
		buffer = /* @__PURE__ */ new Uint8Array(64);
		bufferLength = 0;
		bytesHashed = 0;
		finished = false;
		inner;
		outer;
		constructor(secret) {
			if (secret) {
				const key = Sha256Js.normalizeKey(secret);
				this.inner = new Sha256Js();
				this.outer = new Sha256Js();
				const { inner, outer } = this;
				const pad = new Uint8Array(BLOCK * 2);
				for (let i = 0; i < BLOCK; ++i) {
					pad[i] = 54 ^ key[i];
					pad[i + BLOCK] = 92 ^ key[i];
				}
				inner.update(pad.subarray(0, BLOCK));
				outer.update(pad.subarray(BLOCK));
			}
		}
		update(data) {
			if (this.finished) throw new Error("Attempted to update an already finished HMAC.");
			if (this.inner) {
				this.inner.update(data);
				return;
			}
			const chunk = toUint8Array(data);
			let position = 0;
			let { byteLength } = chunk;
			this.bytesHashed += byteLength;
			if (this.bytesHashed * 8 > MAX_HASHABLE_LENGTH) throw new Error("Cannot hash more than 2^53 - 1 bits");
			while (byteLength > 0) {
				this.buffer[this.bufferLength++] = chunk[position++];
				byteLength--;
				if (this.bufferLength === BLOCK) {
					this.hashBuffer();
					this.bufferLength = 0;
				}
			}
		}
		async digest() {
			const { inner, outer } = this;
			if (inner && outer) {
				if (this.finished) throw new Error("Attempted to digest an already finished HMAC.");
				this.finished = true;
				const innerDigest = inner.digestSync();
				outer.update(innerDigest);
				return outer.digestSync();
			}
			return this.digestSync();
		}
		reset() {
			this.state = Int32Array.from(INIT);
			this.buffer = /* @__PURE__ */ new Uint8Array(64);
			this.bufferLength = 0;
			this.bytesHashed = 0;
		}
		digestSync() {
			const state = this.state.slice();
			const buffer = this.buffer.slice();
			let bufferLength = this.bufferLength;
			const bitsHashed = this.bytesHashed * 8;
			const bufferView = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
			bufferView.setUint8(bufferLength++, 128);
			if ((bufferLength - 1) % BLOCK >= BLOCK - 8) {
				for (let i = bufferLength; i < BLOCK; ++i) bufferView.setUint8(i, 0);
				this.hashBufferWith(state, buffer);
				bufferLength = 0;
			}
			for (let i = bufferLength; i < BLOCK - 8; ++i) bufferView.setUint8(i, 0);
			bufferView.setUint32(BLOCK - 8, Math.floor(bitsHashed / 4294967296), false);
			bufferView.setUint32(BLOCK - 4, bitsHashed, false);
			this.hashBufferWith(state, buffer);
			const out = new Uint8Array(DIGEST_LENGTH);
			for (let i = 0; i < 8; ++i) {
				out[i * 4] = state[i] >>> 24 & 255;
				out[i * 4 + 1] = state[i] >>> 16 & 255;
				out[i * 4 + 2] = state[i] >>> 8 & 255;
				out[i * 4 + 3] = state[i] >>> 0 & 255;
			}
			return out;
		}
		static normalizeKey(secret) {
			const key = toUint8Array(secret);
			if (key.byteLength > BLOCK) {
				const h = new Sha256Js();
				h.update(key);
				const out = h.digestSync();
				const padded = new Uint8Array(BLOCK);
				padded.set(out);
				return padded;
			}
			if (key.byteLength < BLOCK) {
				const padded = new Uint8Array(BLOCK);
				padded.set(key);
				return padded;
			}
			return key;
		}
		hashBuffer() {
			this.hashBufferWith(this.state, this.buffer);
		}
		hashBufferWith(state, buffer) {
			const w = this.w ??= /* @__PURE__ */ new Int32Array(64);
			let s0 = state[0], s1 = state[1], s2 = state[2], s3 = state[3], s4 = state[4], s5 = state[5], s6 = state[6], s7 = state[7];
			for (let i = 0; i < BLOCK; ++i) {
				if (i < 16) w[i] = (buffer[i * 4] & 255) << 24 | (buffer[i * 4 + 1] & 255) << 16 | (buffer[i * 4 + 2] & 255) << 8 | buffer[i * 4 + 3] & 255;
				else {
					let u = w[i - 2];
					const t1 = (u >>> 17 | u << 15) ^ (u >>> 19 | u << 13) ^ u >>> 10;
					u = w[i - 15];
					const t2 = (u >>> 7 | u << 25) ^ (u >>> 18 | u << 14) ^ u >>> 3;
					w[i] = (t1 + w[i - 7] | 0) + (t2 + w[i - 16] | 0);
				}
				const t1 = (((s4 >>> 6 | s4 << 26) ^ (s4 >>> 11 | s4 << 21) ^ (s4 >>> 25 | s4 << 7)) + (s4 & s5 ^ ~s4 & s6) | 0) + (s7 + (K[i] + w[i] | 0) | 0) | 0;
				const t2 = ((s0 >>> 2 | s0 << 30) ^ (s0 >>> 13 | s0 << 19) ^ (s0 >>> 22 | s0 << 10)) + (s0 & s1 ^ s0 & s2 ^ s1 & s2) | 0;
				s7 = s6;
				s6 = s5;
				s5 = s4;
				s4 = s3 + t1 | 0;
				s3 = s2;
				s2 = s1;
				s1 = s0;
				s0 = t1 + t2 | 0;
			}
			state[0] += s0;
			state[1] += s1;
			state[2] += s2;
			state[3] += s3;
			state[4] += s4;
			state[5] += s5;
			state[6] += s6;
			state[7] += s7;
		}
	};
	var INIT = new Int32Array([
		1779033703,
		3144134277,
		1013904242,
		2773480762,
		1359893119,
		2600822924,
		528734635,
		1541459225
	]);
	var K = new Int32Array([
		1116352408,
		1899447441,
		3049323471,
		3921009573,
		961987163,
		1508970993,
		2453635748,
		2870763221,
		3624381080,
		310598401,
		607225278,
		1426881987,
		1925078388,
		2162078206,
		2614888103,
		3248222580,
		3835390401,
		4022224774,
		264347078,
		604807628,
		770255983,
		1249150122,
		1555081692,
		1996064986,
		2554220882,
		2821834349,
		2952996808,
		3210313671,
		3336571891,
		3584528711,
		113926993,
		338241895,
		666307205,
		773529912,
		1294757372,
		1396182291,
		1695183700,
		1986661051,
		2177026350,
		2456956037,
		2730485921,
		2820302411,
		3259730800,
		3345764771,
		3516065817,
		3600352804,
		4094571909,
		275423344,
		430227734,
		506948616,
		659060556,
		883997877,
		958139571,
		1322822218,
		1537002063,
		1747873779,
		1955562222,
		2024104815,
		2227730452,
		2361852424,
		2428436474,
		2756734187,
		3204031479,
		3329325298
	]);
	var Sha256Node = (() => {
		try {
			createHash("sha256");
			return true;
		} catch {
			return false;
		}
	})() ? buildNativeClass() : Sha256Js;
	function buildNativeClass() {
		return class Sha256Node {
			digestLength = 32;
			secret;
			hash;
			isHmac;
			finished = false;
			constructor(secret) {
				this.secret = secret;
				this.isHmac = !!secret;
				this.hash = this.createHash();
			}
			update(data) {
				if (this.finished) throw new Error("Attempted to update an already finished hash.");
				this.hash.update(data);
			}
			async digest() {
				let buf;
				if (this.isHmac) {
					this.finished = true;
					buf = this.hash.digest();
				} else buf = this.hash.copy().digest();
				return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
			}
			reset() {
				this.hash = this.createHash();
				this.finished = false;
			}
			createHash() {
				return this.secret ? createHmac("sha256", toBuffer(this.secret)) : createHash("sha256");
			}
		};
	}
	function toBuffer(data) {
		if (typeof data === "string") return data;
		if (ArrayBuffer.isView(data)) return Buffer.from(data.buffer, data.byteOffset, data.byteLength);
		return Buffer.from(data);
	}
	var { digest, sign, importKey } = globalThis?.crypto?.subtle ?? {};
	var subtle = typeof digest === "function" && typeof sign === "function" && typeof importKey === "function" ? globalThis.crypto.subtle : void 0;
	var MAX_PENDING_BYTES = 8 * 1024 * 1024;
	var Sha256WebCrypto = class {
		digestLength = 32;
		secret;
		pending = [];
		pendingBytes = 0;
		fallback;
		finished = false;
		constructor(secret) {
			if (secret) this.secret = toUint8Array(secret);
		}
		update(data) {
			if (this.finished) throw new Error("Attempted to update an already finished HMAC.");
			if (this.fallback) {
				this.fallback.update(data);
				return;
			}
			this.pending.push(data.slice());
			this.pendingBytes += data.byteLength;
			if (this.pendingBytes >= MAX_PENDING_BYTES) this.switchToFallback();
		}
		async digest() {
			if (this.fallback) return this.fallback.digest();
			if (this.secret && this.finished) throw new Error("Attempted to digest an already finished HMAC.");
			const data = concatBytes(this.pending);
			if (subtle) {
				if (this.secret) {
					this.finished = true;
					const key = await subtle.importKey("raw", this.secret, {
						name: "HMAC",
						hash: "SHA-256"
					}, false, ["sign"]);
					const sig = await subtle.sign("HMAC", key, data);
					return new Uint8Array(sig);
				}
				const hash = await subtle.digest("SHA-256", data);
				return new Uint8Array(hash);
			}
			const sha256 = new Sha256Js(this.secret);
			sha256.update(data);
			return sha256.digest();
		}
		reset() {
			this.pending = [];
			this.pendingBytes = 0;
			this.fallback = void 0;
			this.finished = false;
		}
		switchToFallback() {
			const sha256Js = new Sha256Js(this.secret);
			for (const chunk of this.pending) sha256Js.update(chunk);
			this.fallback = sha256Js;
			this.pending = [];
			this.pendingBytes = 0;
		}
	};
	exports.Crc32 = Crc32Node;
	exports.Crc32Js = Crc32Js;
	exports.Crc32Node = Crc32Node;
	exports.Md5 = Md5Node;
	exports.Md5Js = Md5Js;
	exports.Md5Node = Md5Node;
	exports.Sha256 = Sha256Node;
	exports.Sha256Js = Sha256Js;
	exports.Sha256Node = Sha256Node;
	exports.Sha256WebCrypto = Sha256WebCrypto;
	exports.blobHasher = blobHasher;
	exports.blobReader = blobReader;
	exports.fileStreamHasher = fileStreamHasher;
	exports.readableStreamHasher = readableStreamHasher;
}));
//#endregion
//#region node_modules/@smithy/core/dist-cjs/submodules/event-streams/index.js
var require_event_streams = /* @__PURE__ */ __commonJSMin(((exports) => {
	var { Crc32 } = require_checksum();
	var { toHex, fromHex, toUtf8, fromUtf8 } = require_serde();
	var { Readable: Readable$2 } = __require("node:stream");
	var Int64 = class Int64 {
		bytes;
		constructor(bytes) {
			this.bytes = bytes;
			if (bytes.byteLength !== 8) throw new Error("Int64 buffers must be exactly 8 bytes");
		}
		static fromNumber(number) {
			if (number > 0x8000000000000000 || number < -0x8000000000000000) throw new Error(`${number} is too large (or, if negative, too small) to represent as an Int64`);
			const bytes = /* @__PURE__ */ new Uint8Array(8);
			for (let i = 7, remaining = Math.abs(Math.round(number)); i > -1 && remaining > 0; i--, remaining /= 256) bytes[i] = remaining;
			if (number < 0) negate(bytes);
			return new Int64(bytes);
		}
		valueOf() {
			const bytes = this.bytes.slice(0);
			const negative = bytes[0] & 128;
			if (negative) negate(bytes);
			return parseInt(toHex(bytes), 16) * (negative ? -1 : 1);
		}
		toString() {
			return String(this.valueOf());
		}
	};
	function negate(bytes) {
		for (let i = 0; i < 8; i++) bytes[i] ^= 255;
		for (let i = 7; i > -1; i--) {
			bytes[i]++;
			if (bytes[i] !== 0) break;
		}
	}
	var HeaderMarshaller = class {
		toUtf8;
		fromUtf8;
		constructor(toUtf8, fromUtf8) {
			this.toUtf8 = toUtf8;
			this.fromUtf8 = fromUtf8;
		}
		format(headers) {
			const chunks = [];
			for (const headerName of Object.keys(headers)) {
				const bytes = this.fromUtf8(headerName);
				chunks.push(Uint8Array.from([bytes.byteLength]), bytes, this.formatHeaderValue(headers[headerName]));
			}
			const out = new Uint8Array(chunks.reduce((carry, bytes) => carry + bytes.byteLength, 0));
			let position = 0;
			for (const chunk of chunks) {
				out.set(chunk, position);
				position += chunk.byteLength;
			}
			return out;
		}
		formatHeaderValue(header) {
			switch (header.type) {
				case "boolean": return Uint8Array.from([header.value ? HEADER_VALUE_TYPE.boolTrue : HEADER_VALUE_TYPE.boolFalse]);
				case "byte": return Uint8Array.from([HEADER_VALUE_TYPE.byte, header.value]);
				case "short":
					const shortView = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(3));
					shortView.setUint8(0, HEADER_VALUE_TYPE.short);
					shortView.setInt16(1, header.value, false);
					return new Uint8Array(shortView.buffer);
				case "integer":
					const intView = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(5));
					intView.setUint8(0, HEADER_VALUE_TYPE.integer);
					intView.setInt32(1, header.value, false);
					return new Uint8Array(intView.buffer);
				case "long":
					const longBytes = /* @__PURE__ */ new Uint8Array(9);
					longBytes[0] = HEADER_VALUE_TYPE.long;
					longBytes.set(header.value.bytes, 1);
					return longBytes;
				case "binary":
					const binView = new DataView(new ArrayBuffer(3 + header.value.byteLength));
					binView.setUint8(0, HEADER_VALUE_TYPE.byteArray);
					binView.setUint16(1, header.value.byteLength, false);
					const binBytes = new Uint8Array(binView.buffer);
					binBytes.set(header.value, 3);
					return binBytes;
				case "string":
					const utf8Bytes = this.fromUtf8(header.value);
					const strView = new DataView(new ArrayBuffer(3 + utf8Bytes.byteLength));
					strView.setUint8(0, HEADER_VALUE_TYPE.string);
					strView.setUint16(1, utf8Bytes.byteLength, false);
					const strBytes = new Uint8Array(strView.buffer);
					strBytes.set(utf8Bytes, 3);
					return strBytes;
				case "timestamp":
					const tsBytes = /* @__PURE__ */ new Uint8Array(9);
					tsBytes[0] = HEADER_VALUE_TYPE.timestamp;
					tsBytes.set(Int64.fromNumber(header.value.valueOf()).bytes, 1);
					return tsBytes;
				case "uuid":
					if (!UUID_PATTERN.test(header.value)) throw new Error(`Invalid UUID received: ${header.value}`);
					const uuidBytes = /* @__PURE__ */ new Uint8Array(17);
					uuidBytes[0] = HEADER_VALUE_TYPE.uuid;
					uuidBytes.set(fromHex(header.value.replace(/-/g, "")), 1);
					return uuidBytes;
			}
		}
		parse(headers) {
			const out = {};
			let position = 0;
			while (position < headers.byteLength) {
				const nameLength = headers.getUint8(position++);
				const name = this.toUtf8(new Uint8Array(headers.buffer, headers.byteOffset + position, nameLength));
				position += nameLength;
				switch (headers.getUint8(position++)) {
					case HEADER_VALUE_TYPE.boolTrue:
						out[name] = {
							type: BOOLEAN_TAG,
							value: true
						};
						break;
					case HEADER_VALUE_TYPE.boolFalse:
						out[name] = {
							type: BOOLEAN_TAG,
							value: false
						};
						break;
					case HEADER_VALUE_TYPE.byte:
						out[name] = {
							type: BYTE_TAG,
							value: headers.getInt8(position++)
						};
						break;
					case HEADER_VALUE_TYPE.short:
						out[name] = {
							type: SHORT_TAG,
							value: headers.getInt16(position, false)
						};
						position += 2;
						break;
					case HEADER_VALUE_TYPE.integer:
						out[name] = {
							type: INT_TAG,
							value: headers.getInt32(position, false)
						};
						position += 4;
						break;
					case HEADER_VALUE_TYPE.long:
						out[name] = {
							type: LONG_TAG,
							value: new Int64(new Uint8Array(headers.buffer, headers.byteOffset + position, 8))
						};
						position += 8;
						break;
					case HEADER_VALUE_TYPE.byteArray:
						const binaryLength = headers.getUint16(position, false);
						position += 2;
						out[name] = {
							type: BINARY_TAG,
							value: new Uint8Array(headers.buffer, headers.byteOffset + position, binaryLength)
						};
						position += binaryLength;
						break;
					case HEADER_VALUE_TYPE.string:
						const stringLength = headers.getUint16(position, false);
						position += 2;
						out[name] = {
							type: STRING_TAG,
							value: this.toUtf8(new Uint8Array(headers.buffer, headers.byteOffset + position, stringLength))
						};
						position += stringLength;
						break;
					case HEADER_VALUE_TYPE.timestamp:
						out[name] = {
							type: TIMESTAMP_TAG,
							value: new Date(new Int64(new Uint8Array(headers.buffer, headers.byteOffset + position, 8)).valueOf())
						};
						position += 8;
						break;
					case HEADER_VALUE_TYPE.uuid:
						const uuidBytes = new Uint8Array(headers.buffer, headers.byteOffset + position, 16);
						position += 16;
						out[name] = {
							type: UUID_TAG,
							value: `${toHex(uuidBytes.subarray(0, 4))}-${toHex(uuidBytes.subarray(4, 6))}-${toHex(uuidBytes.subarray(6, 8))}-${toHex(uuidBytes.subarray(8, 10))}-${toHex(uuidBytes.subarray(10))}`
						};
						break;
					default: throw new Error(`Unrecognized header type tag`);
				}
			}
			return out;
		}
	};
	var HEADER_VALUE_TYPE;
	(function(HEADER_VALUE_TYPE) {
		HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["boolTrue"] = 0] = "boolTrue";
		HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["boolFalse"] = 1] = "boolFalse";
		HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["byte"] = 2] = "byte";
		HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["short"] = 3] = "short";
		HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["integer"] = 4] = "integer";
		HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["long"] = 5] = "long";
		HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["byteArray"] = 6] = "byteArray";
		HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["string"] = 7] = "string";
		HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["timestamp"] = 8] = "timestamp";
		HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["uuid"] = 9] = "uuid";
	})(HEADER_VALUE_TYPE || (HEADER_VALUE_TYPE = {}));
	var BOOLEAN_TAG = "boolean";
	var BYTE_TAG = "byte";
	var SHORT_TAG = "short";
	var INT_TAG = "integer";
	var LONG_TAG = "long";
	var BINARY_TAG = "binary";
	var STRING_TAG = "string";
	var TIMESTAMP_TAG = "timestamp";
	var UUID_TAG = "uuid";
	var UUID_PATTERN = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
	var PRELUDE_MEMBER_LENGTH = 4;
	var PRELUDE_LENGTH = PRELUDE_MEMBER_LENGTH * 2;
	var CHECKSUM_LENGTH = 4;
	var MINIMUM_MESSAGE_LENGTH = 16;
	function splitMessage({ byteLength, byteOffset, buffer }) {
		if (byteLength < MINIMUM_MESSAGE_LENGTH) throw new Error("Provided message too short to accommodate event stream message overhead");
		const view = new DataView(buffer, byteOffset, byteLength);
		const messageLength = view.getUint32(0, false);
		if (byteLength !== messageLength) throw new Error("Reported message length does not match received message length");
		const headerLength = view.getUint32(PRELUDE_MEMBER_LENGTH, false);
		const expectedPreludeChecksum = view.getUint32(PRELUDE_LENGTH, false);
		const expectedMessageChecksum = view.getUint32(byteLength - CHECKSUM_LENGTH, false);
		const checksummer = new Crc32();
		checksummer.update(new Uint8Array(buffer, byteOffset, PRELUDE_LENGTH));
		if (expectedPreludeChecksum !== checksummer.digestSync()) throw new Error(`The prelude checksum specified in the message (${expectedPreludeChecksum}) does not match the calculated CRC32 checksum (${checksummer.digestSync()})`);
		checksummer.update(new Uint8Array(buffer, byteOffset + PRELUDE_LENGTH, byteLength - 12));
		if (expectedMessageChecksum !== checksummer.digestSync()) throw new Error(`The message checksum (${checksummer.digestSync()}) did not match the expected value of ${expectedMessageChecksum}`);
		return {
			headers: new DataView(buffer, byteOffset + PRELUDE_LENGTH + CHECKSUM_LENGTH, headerLength),
			body: new Uint8Array(buffer, byteOffset + PRELUDE_LENGTH + CHECKSUM_LENGTH + headerLength, messageLength - headerLength - 16)
		};
	}
	var EventStreamCodec = class {
		headerMarshaller;
		messageBuffer;
		isEndOfStream;
		constructor(toUtf8, fromUtf8) {
			this.headerMarshaller = new HeaderMarshaller(toUtf8, fromUtf8);
			this.messageBuffer = [];
			this.isEndOfStream = false;
		}
		feed(message) {
			this.messageBuffer.push(this.decode(message));
		}
		endOfStream() {
			this.isEndOfStream = true;
		}
		getMessage() {
			const message = this.messageBuffer.pop();
			const isEndOfStream = this.isEndOfStream;
			return {
				getMessage() {
					return message;
				},
				isEndOfStream() {
					return isEndOfStream;
				}
			};
		}
		getAvailableMessages() {
			const messages = this.messageBuffer;
			this.messageBuffer = [];
			const isEndOfStream = this.isEndOfStream;
			return {
				getMessages() {
					return messages;
				},
				isEndOfStream() {
					return isEndOfStream;
				}
			};
		}
		encode({ headers: rawHeaders, body }) {
			const headers = this.headerMarshaller.format(rawHeaders);
			const length = headers.byteLength + body.byteLength + 16;
			const out = new Uint8Array(length);
			const view = new DataView(out.buffer, out.byteOffset, out.byteLength);
			const checksum = new Crc32();
			view.setUint32(0, length, false);
			view.setUint32(4, headers.byteLength, false);
			checksum.update(out.subarray(0, 8));
			view.setUint32(8, checksum.digestSync(), false);
			out.set(headers, 12);
			out.set(body, headers.byteLength + 12);
			checksum.update(out.subarray(8, length - 4));
			view.setUint32(length - 4, checksum.digestSync(), false);
			return out;
		}
		decode(message) {
			const { headers, body } = splitMessage(message);
			return {
				headers: this.headerMarshaller.parse(headers),
				body
			};
		}
		formatHeaders(rawHeaders) {
			return this.headerMarshaller.format(rawHeaders);
		}
	};
	var MessageDecoderStream = class {
		options;
		constructor(options) {
			this.options = options;
		}
		[Symbol.asyncIterator]() {
			return this.asyncIterator();
		}
		async *asyncIterator() {
			for await (const bytes of this.options.inputStream) yield this.options.decoder.decode(bytes);
		}
	};
	var MessageEncoderStream = class {
		options;
		constructor(options) {
			this.options = options;
		}
		[Symbol.asyncIterator]() {
			return this.asyncIterator();
		}
		async *asyncIterator() {
			for await (const msg of this.options.messageStream) yield this.options.encoder.encode(msg);
			if (this.options.includeEndFrame) yield /* @__PURE__ */ new Uint8Array(0);
		}
	};
	var SmithyMessageDecoderStream = class {
		options;
		constructor(options) {
			this.options = options;
		}
		[Symbol.asyncIterator]() {
			return this.asyncIterator();
		}
		async *asyncIterator() {
			for await (const message of this.options.messageStream) {
				const deserialized = await this.options.deserializer(message);
				if (deserialized === void 0) continue;
				yield deserialized;
			}
		}
	};
	var SmithyMessageEncoderStream = class {
		options;
		constructor(options) {
			this.options = options;
		}
		[Symbol.asyncIterator]() {
			return this.asyncIterator();
		}
		async *asyncIterator() {
			for await (const chunk of this.options.inputStream) yield this.options.serializer(chunk);
		}
	};
	function getChunkedStream(source) {
		let currentMessageTotalLength = 0;
		let currentMessagePendingLength = 0;
		let currentMessage = null;
		let messageLengthBuffer = null;
		const allocateMessage = (size) => {
			if (typeof size !== "number") throw new Error("Attempted to allocate an event message where size was not a number: " + size);
			currentMessageTotalLength = size;
			currentMessagePendingLength = 4;
			currentMessage = new Uint8Array(size);
			new DataView(currentMessage.buffer).setUint32(0, size, false);
		};
		const iterator = async function* () {
			const sourceIterator = source[Symbol.asyncIterator]();
			while (true) {
				const { value, done } = await sourceIterator.next();
				if (done) {
					if (!currentMessageTotalLength) return;
					else if (currentMessageTotalLength === currentMessagePendingLength) yield currentMessage;
					else throw new Error("Truncated event message received.");
					return;
				}
				const chunkLength = value.length;
				let currentOffset = 0;
				while (currentOffset < chunkLength) {
					if (!currentMessage) {
						const bytesRemaining = chunkLength - currentOffset;
						if (!messageLengthBuffer) messageLengthBuffer = /* @__PURE__ */ new Uint8Array(4);
						const numBytesForTotal = Math.min(4 - currentMessagePendingLength, bytesRemaining);
						messageLengthBuffer.set(value.slice(currentOffset, currentOffset + numBytesForTotal), currentMessagePendingLength);
						currentMessagePendingLength += numBytesForTotal;
						currentOffset += numBytesForTotal;
						if (currentMessagePendingLength < 4) break;
						allocateMessage(new DataView(messageLengthBuffer.buffer).getUint32(0, false));
						messageLengthBuffer = null;
					}
					const numBytesToWrite = Math.min(currentMessageTotalLength - currentMessagePendingLength, chunkLength - currentOffset);
					currentMessage.set(value.slice(currentOffset, currentOffset + numBytesToWrite), currentMessagePendingLength);
					currentMessagePendingLength += numBytesToWrite;
					currentOffset += numBytesToWrite;
					if (currentMessageTotalLength && currentMessageTotalLength === currentMessagePendingLength) {
						yield currentMessage;
						currentMessage = null;
						currentMessageTotalLength = 0;
						currentMessagePendingLength = 0;
					}
				}
			}
		};
		return { [Symbol.asyncIterator]: iterator };
	}
	function getUnmarshalledStream(source, options) {
		const messageUnmarshaller = getMessageUnmarshaller(options.deserializer, options.toUtf8);
		return { [Symbol.asyncIterator]: async function* () {
			for await (const chunk of source) {
				const message = options.eventStreamCodec.decode(chunk);
				const type = await messageUnmarshaller(message);
				if (type === void 0) continue;
				yield type;
			}
		} };
	}
	function getMessageUnmarshaller(deserializer, toUtf8) {
		return async function(message) {
			const { value: messageType } = message.headers[":message-type"];
			if (messageType === "error") {
				const unmodeledError = new Error(message.headers[":error-message"].value || "UnknownError");
				unmodeledError.name = message.headers[":error-code"].value;
				throw unmodeledError;
			} else if (messageType === "exception") {
				const code = message.headers[":exception-type"].value;
				const deserializedException = await deserializer({ [code]: message });
				if (deserializedException.$unknown) {
					const error = new Error(toUtf8(message.body));
					error.name = code;
					throw error;
				}
				throw deserializedException[code];
			} else if (messageType === "event") {
				const deserialized = await deserializer({ [message.headers[":event-type"].value]: message });
				if (deserialized.$unknown) return;
				return deserialized;
			} else throw Error(`Unrecognizable event type: ${message.headers[":event-type"].value}`);
		};
	}
	var EventStreamMarshaller$1 = class EventStreamMarshaller {
		eventStreamCodec;
		utfEncoder;
		constructor({ utf8Encoder, utf8Decoder }) {
			this.eventStreamCodec = new EventStreamCodec(utf8Encoder, utf8Decoder);
			this.utfEncoder = utf8Encoder;
		}
		deserialize(body, deserializer) {
			return new SmithyMessageDecoderStream({
				messageStream: new MessageDecoderStream({
					inputStream: getChunkedStream(body),
					decoder: this.eventStreamCodec
				}),
				deserializer: getMessageUnmarshaller(deserializer, this.utfEncoder)
			});
		}
		serialize(inputStream, serializer) {
			return new MessageEncoderStream({
				messageStream: new SmithyMessageEncoderStream({
					inputStream,
					serializer
				}),
				encoder: this.eventStreamCodec,
				includeEndFrame: true
			});
		}
	};
	var eventStreamSerdeProvider$1 = (options) => new EventStreamMarshaller$1(options);
	var EventStreamMarshaller = class {
		universalMarshaller;
		constructor({ utf8Encoder, utf8Decoder }) {
			this.universalMarshaller = new EventStreamMarshaller$1({
				utf8Decoder,
				utf8Encoder
			});
		}
		deserialize(body, deserializer) {
			const bodyIterable = typeof body[Symbol.asyncIterator] === "function" ? body : readableToIterable(body);
			return this.universalMarshaller.deserialize(bodyIterable, deserializer);
		}
		serialize(input, serializer) {
			return Readable$2.from(this.universalMarshaller.serialize(input, serializer));
		}
	};
	var eventStreamSerdeProvider = (options) => new EventStreamMarshaller(options);
	async function* readableToIterable(readStream) {
		let streamEnded = false;
		let generationEnded = false;
		const records = new Array();
		readStream.on("error", (err) => {
			if (!streamEnded) streamEnded = true;
			if (err) throw err;
		});
		readStream.on("data", (data) => {
			records.push(data);
		});
		readStream.on("end", () => {
			streamEnded = true;
		});
		while (!generationEnded) {
			const value = await new Promise((resolve) => setTimeout(() => resolve(records.shift()), 0));
			if (value) yield value;
			generationEnded = streamEnded && records.length === 0;
		}
	}
	var readableStreamToIterable = (readableStream) => ({ [Symbol.asyncIterator]: async function* () {
		const reader = readableStream.getReader();
		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) return;
				yield value;
			}
		} finally {
			reader.releaseLock();
		}
	} });
	var iterableToReadableStream = (asyncIterable) => {
		const iterator = asyncIterable[Symbol.asyncIterator]();
		return new ReadableStream({ async pull(controller) {
			const { done, value } = await iterator.next();
			if (done) return controller.close();
			controller.enqueue(value);
		} });
	};
	var resolveEventStreamSerdeConfig = (input) => Object.assign(input, { eventStreamMarshaller: input.eventStreamSerdeProvider(input) });
	var EventStreamSerde = class {
		marshaller;
		serializer;
		deserializer;
		serdeContext;
		defaultContentType;
		constructor({ marshaller, serializer, deserializer, serdeContext, defaultContentType }) {
			this.marshaller = marshaller;
			this.serializer = serializer;
			this.deserializer = deserializer;
			this.serdeContext = serdeContext;
			this.defaultContentType = defaultContentType;
		}
		async serializeEventStream({ eventStream, requestSchema, initialRequest }) {
			const marshaller = this.marshaller;
			const eventStreamMember = requestSchema.getEventStreamMember();
			const unionSchema = requestSchema.getMemberSchema(eventStreamMember);
			const serializer = this.serializer;
			const defaultContentType = this.defaultContentType;
			const initialRequestMarker = Symbol("initialRequestMarker");
			const eventStreamIterable = { async *[Symbol.asyncIterator]() {
				if (initialRequest) {
					const headers = {
						":event-type": {
							type: "string",
							value: "initial-request"
						},
						":message-type": {
							type: "string",
							value: "event"
						},
						":content-type": {
							type: "string",
							value: defaultContentType
						}
					};
					serializer.write(requestSchema, initialRequest);
					const body = serializer.flush();
					yield {
						[initialRequestMarker]: true,
						headers,
						body
					};
				}
				for await (const page of eventStream) yield page;
			} };
			return marshaller.serialize(eventStreamIterable, (event) => {
				if (event[initialRequestMarker]) return {
					headers: event.headers,
					body: event.body
				};
				let unionMember = "";
				for (const key in event) if (key !== "__type") {
					unionMember = key;
					break;
				}
				const { additionalHeaders, body, eventType, explicitPayloadContentType } = this.writeEventBody(unionMember, unionSchema, event);
				return {
					headers: {
						":event-type": {
							type: "string",
							value: eventType
						},
						":message-type": {
							type: "string",
							value: "event"
						},
						":content-type": {
							type: "string",
							value: explicitPayloadContentType ?? defaultContentType
						},
						...additionalHeaders
					},
					body
				};
			});
		}
		async deserializeEventStream({ response, responseSchema, initialResponseContainer }) {
			const marshaller = this.marshaller;
			const eventStreamMember = responseSchema.getEventStreamMember();
			const memberSchemas = responseSchema.getMemberSchema(eventStreamMember).getMemberSchemas();
			const initialResponseMarker = Symbol("initialResponseMarker");
			const asyncIterable = marshaller.deserialize(response.body, async (event) => {
				let unionMember = "";
				for (const key in event) if (key !== "__type") {
					unionMember = key;
					break;
				}
				const body = event[unionMember].body;
				if (unionMember === "initial-response") {
					const dataObject = await this.deserializer.read(responseSchema, body);
					delete dataObject[eventStreamMember];
					return {
						[initialResponseMarker]: true,
						...dataObject
					};
				} else if (unionMember in memberSchemas) {
					const eventStreamSchema = memberSchemas[unionMember];
					if (eventStreamSchema.isStructSchema()) {
						const out = {};
						let hasBindings = false;
						for (const [name, member] of eventStreamSchema.structIterator()) {
							const { eventHeader, eventPayload } = member.getMergedTraits();
							hasBindings = hasBindings || Boolean(eventHeader || eventPayload);
							if (eventPayload) {
								if (member.isBlobSchema()) out[name] = body;
								else if (member.isStringSchema()) out[name] = (this.serdeContext?.utf8Encoder ?? toUtf8)(body);
								else if (member.isStructSchema()) out[name] = await this.deserializer.read(member, body);
							} else if (eventHeader) {
								const value = event[unionMember].headers[name]?.value;
								if (value != null) if (member.isNumericSchema()) if (value && typeof value === "object" && "bytes" in value) out[name] = BigInt(value.toString());
								else out[name] = Number(value);
								else out[name] = value;
							}
						}
						if (hasBindings) return { [unionMember]: out };
						if (body.byteLength === 0) return { [unionMember]: {} };
					}
					return { [unionMember]: await this.deserializer.read(eventStreamSchema, body) };
				} else return { $unknown: event };
			});
			const asyncIterator = asyncIterable[Symbol.asyncIterator]();
			const firstEvent = await asyncIterator.next();
			if (firstEvent.done) return asyncIterable;
			if (firstEvent.value?.[initialResponseMarker]) {
				if (!responseSchema) throw new Error("@smithy::core/protocols - initial-response event encountered in event stream but no response schema given.");
				for (const key in firstEvent.value) initialResponseContainer[key] = firstEvent.value[key];
			}
			return { async *[Symbol.asyncIterator]() {
				if (!firstEvent?.value?.[initialResponseMarker]) yield firstEvent.value;
				while (true) {
					const { done, value } = await asyncIterator.next();
					if (done) break;
					yield value;
				}
			} };
		}
		writeEventBody(unionMember, unionSchema, event) {
			const serializer = this.serializer;
			let eventType = unionMember;
			let explicitPayloadMember = null;
			let explicitPayloadContentType;
			const isKnownSchema = (() => {
				return unionSchema.getSchema()[4].includes(unionMember);
			})();
			const additionalHeaders = {};
			if (!isKnownSchema) {
				const [type, value] = event[unionMember];
				eventType = type;
				serializer.write(15, value);
			} else {
				const eventSchema = unionSchema.getMemberSchema(unionMember);
				if (eventSchema.isStructSchema()) {
					for (const [memberName, memberSchema] of eventSchema.structIterator()) {
						const { eventHeader, eventPayload } = memberSchema.getMergedTraits();
						if (eventPayload) explicitPayloadMember = memberName;
						else if (eventHeader) {
							const value = event[unionMember][memberName];
							let type = "binary";
							if (memberSchema.isNumericSchema()) if ((-2) ** 31 <= value && value <= 2 ** 31 - 1) type = "integer";
							else type = "long";
							else if (memberSchema.isTimestampSchema()) type = "timestamp";
							else if (memberSchema.isStringSchema()) type = "string";
							else if (memberSchema.isBooleanSchema()) type = "boolean";
							if (value != null) {
								additionalHeaders[memberName] = {
									type,
									value
								};
								delete event[unionMember][memberName];
							}
						}
					}
					if (explicitPayloadMember !== null) {
						const payloadSchema = eventSchema.getMemberSchema(explicitPayloadMember);
						if (payloadSchema.isBlobSchema()) explicitPayloadContentType = "application/octet-stream";
						else if (payloadSchema.isStringSchema()) explicitPayloadContentType = "text/plain";
						serializer.write(payloadSchema, event[unionMember][explicitPayloadMember]);
					} else serializer.write(eventSchema, event[unionMember]);
				} else if (eventSchema.isUnitSchema()) serializer.write(eventSchema, {});
				else throw new Error("@smithy/core/event-streams - non-struct member not supported in event stream union.");
			}
			const messageSerialization = serializer.flush() ?? /* @__PURE__ */ new Uint8Array();
			return {
				body: typeof messageSerialization === "string" ? (this.serdeContext?.utf8Decoder ?? fromUtf8)(messageSerialization) : messageSerialization,
				eventType,
				explicitPayloadContentType,
				additionalHeaders
			};
		}
	};
	exports.EventStreamCodec = EventStreamCodec;
	exports.EventStreamMarshaller = EventStreamMarshaller;
	exports.EventStreamSerde = EventStreamSerde;
	exports.HeaderMarshaller = HeaderMarshaller;
	exports.Int64 = Int64;
	exports.MessageDecoderStream = MessageDecoderStream;
	exports.MessageEncoderStream = MessageEncoderStream;
	exports.SmithyMessageDecoderStream = SmithyMessageDecoderStream;
	exports.SmithyMessageEncoderStream = SmithyMessageEncoderStream;
	exports.UniversalEventStreamMarshaller = EventStreamMarshaller$1;
	exports.eventStreamSerdeProvider = eventStreamSerdeProvider;
	exports.getChunkedStream = getChunkedStream;
	exports.getMessageUnmarshaller = getMessageUnmarshaller;
	exports.getUnmarshalledStream = getUnmarshalledStream;
	exports.iterableToReadableStream = iterableToReadableStream;
	exports.readableStreamToIterable = readableStreamToIterable;
	exports.resolveEventStreamSerdeConfig = resolveEventStreamSerdeConfig;
	exports.universalEventStreamSerdeProvider = eventStreamSerdeProvider$1;
}));
//#endregion
//#region node_modules/@smithy/core/dist-cjs/submodules/protocols/index.js
var require_protocols$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var { Uint8ArrayBlobAdapter, sdkStreamMixin, splitEvery, splitHeader, fromBase64, _parseEpochTimestamp, _parseRfc7231DateTime, _parseRfc3339DateTimeWithOffset, LazyJsonString, NumericValue, toUtf8, fromUtf8, generateIdempotencyToken, toBase64, dateToUtcString, quoteHeader } = require_serde();
	var { TypeRegistry, NormalizedSchema, translateTraits } = require_schema();
	var { HttpRequest, HttpResponse, isValidHostname } = require_transport();
	var { parseQueryString, parseUrl } = require_transport();
	exports.HttpRequest = HttpRequest;
	exports.HttpResponse = HttpResponse;
	exports.isValidHostname = isValidHostname;
	exports.parseQueryString = parseQueryString;
	exports.parseUrl = parseUrl;
	var { FieldPosition } = (init_dist_es$3(), __toCommonJS(dist_es_exports$5));
	var collectBody = async (streamBody = /* @__PURE__ */ new Uint8Array(), context) => {
		if (streamBody instanceof Uint8Array) return Uint8ArrayBlobAdapter.mutate(streamBody);
		if (!streamBody) return Uint8ArrayBlobAdapter.mutate(/* @__PURE__ */ new Uint8Array());
		const fromContext = context.streamCollector(streamBody);
		return Uint8ArrayBlobAdapter.mutate(await fromContext);
	};
	function extendedEncodeURIComponent(str) {
		return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
			return "%" + c.charCodeAt(0).toString(16).toUpperCase();
		});
	}
	var SerdeContext = class {
		serdeContext;
		setSerdeContext(serdeContext) {
			this.serdeContext = serdeContext;
		}
	};
	var HttpProtocol = class extends SerdeContext {
		options;
		compositeErrorRegistry;
		constructor(options) {
			super();
			this.options = options;
			this.compositeErrorRegistry = TypeRegistry.for(options.defaultNamespace);
			for (const etr of options.errorTypeRegistries ?? []) this.compositeErrorRegistry.copyFrom(etr);
		}
		getRequestType() {
			return HttpRequest;
		}
		getResponseType() {
			return HttpResponse;
		}
		setSerdeContext(serdeContext) {
			this.serdeContext = serdeContext;
			this.serializer.setSerdeContext(serdeContext);
			this.deserializer.setSerdeContext(serdeContext);
			if (this.getPayloadCodec()) this.getPayloadCodec().setSerdeContext(serdeContext);
		}
		updateServiceEndpoint(request, endpoint) {
			if ("url" in endpoint) {
				request.protocol = endpoint.url.protocol;
				request.hostname = endpoint.url.hostname;
				request.port = endpoint.url.port ? Number(endpoint.url.port) : void 0;
				request.path = endpoint.url.pathname;
				request.fragment = endpoint.url.hash || void 0;
				request.username = endpoint.url.username || void 0;
				request.password = endpoint.url.password || void 0;
				if (!request.query) request.query = {};
				for (const [k, v] of endpoint.url.searchParams.entries()) request.query[k] = v;
				if (endpoint.headers) for (const name in endpoint.headers) request.headers[name] = endpoint.headers[name].join(", ");
				return request;
			} else {
				request.protocol = endpoint.protocol;
				request.hostname = endpoint.hostname;
				request.port = endpoint.port ? Number(endpoint.port) : void 0;
				request.path = endpoint.path;
				request.query = { ...endpoint.query };
				if (endpoint.headers) for (const name in endpoint.headers) request.headers[name] = endpoint.headers[name];
				return request;
			}
		}
		setHostPrefix(request, operationSchema, input) {
			if (this.serdeContext?.disableHostPrefix) return;
			const inputNs = NormalizedSchema.of(operationSchema.input);
			const opTraits = translateTraits(operationSchema.traits ?? {});
			if (opTraits.endpoint) {
				let hostPrefix = opTraits.endpoint?.[0];
				if (typeof hostPrefix === "string") {
					for (const [name, member] of inputNs.structIterator()) {
						if (!member.getMergedTraits().hostLabel) continue;
						const replacement = input[name];
						if (typeof replacement !== "string") throw new Error(`@smithy/core/schema - ${name} in input must be a string as hostLabel.`);
						hostPrefix = hostPrefix.replace(`{${name}}`, replacement);
					}
					request.hostname = hostPrefix + request.hostname;
					if (!isValidHostname(request.hostname)) throw new Error(`[${request.hostname}] is not a valid hostname.`);
				}
			}
		}
		deserializeMetadata(output) {
			return {
				httpStatusCode: output.statusCode,
				requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
				extendedRequestId: output.headers["x-amz-id-2"],
				cfId: output.headers["x-amz-cf-id"]
			};
		}
		async serializeEventStream({ eventStream, requestSchema, initialRequest }) {
			return (await this.loadEventStreamCapability()).serializeEventStream({
				eventStream,
				requestSchema,
				initialRequest
			});
		}
		async deserializeEventStream({ response, responseSchema, initialResponseContainer }) {
			return (await this.loadEventStreamCapability()).deserializeEventStream({
				response,
				responseSchema,
				initialResponseContainer
			});
		}
		async loadEventStreamCapability() {
			const { EventStreamSerde, eventStreamSerdeProvider } = require_event_streams();
			return new EventStreamSerde({
				marshaller: this.resolveEventStreamMarshaller(eventStreamSerdeProvider),
				serializer: this.serializer,
				deserializer: this.deserializer,
				serdeContext: this.serdeContext,
				defaultContentType: this.getDefaultContentType()
			});
		}
		resolveEventStreamMarshaller(importedProvider) {
			const context = this.serdeContext;
			if (context.eventStreamMarshaller) return context.eventStreamMarshaller;
			return importedProvider(this.serdeContext);
		}
		getDefaultContentType() {
			throw new Error(`@smithy/core/protocols - ${this.constructor.name} getDefaultContentType() implementation missing.`);
		}
		async deserializeHttpMessage(schema, context, response, arg4, arg5) {
			return [];
		}
		getEventStreamMarshaller() {
			const context = this.serdeContext;
			if (!context.eventStreamMarshaller) throw new Error("@smithy/core - HttpProtocol: eventStreamMarshaller missing in serdeContext.");
			return context.eventStreamMarshaller;
		}
	};
	var HttpBindingProtocol = class extends HttpProtocol {
		async serializeRequest(operationSchema, _input, context) {
			const input = _input && typeof _input === "object" ? _input : {};
			const serializer = this.serializer;
			const query = {};
			const headers = {};
			const endpoint = await context.endpoint();
			const ns = NormalizedSchema.of(operationSchema?.input);
			const payloadMemberNames = [];
			const payloadMemberSchemas = [];
			let hasNonHttpBindingMember = false;
			let payload;
			const request = new HttpRequest({
				protocol: "",
				hostname: "",
				port: void 0,
				path: "",
				fragment: void 0,
				query,
				headers,
				body: void 0
			});
			if (endpoint) {
				this.updateServiceEndpoint(request, endpoint);
				this.setHostPrefix(request, operationSchema, input);
				const opTraits = translateTraits(operationSchema.traits);
				if (opTraits.http) {
					request.method = opTraits.http[0];
					const [path, search] = opTraits.http[1].split("?");
					if (request.path == "/") request.path = path;
					else request.path += path;
					const traitSearchParams = new URLSearchParams(search ?? "");
					for (const [key, value] of traitSearchParams) query[key] = value;
				}
			}
			for (const [memberName, memberNs] of ns.structIterator()) {
				const memberTraits = memberNs.getMergedTraits() ?? {};
				const inputMemberValue = input[memberName];
				if (inputMemberValue == null && !memberNs.isIdempotencyToken()) {
					if (memberTraits.httpLabel) {
						if (request.path.includes(`{${memberName}+}`) || request.path.includes(`{${memberName}}`)) throw new Error(`No value provided for input HTTP label: ${memberName}.`);
					}
					continue;
				}
				if (memberTraits.httpPayload) if (memberNs.isStreaming()) if (memberNs.isStructSchema()) {
					if (input[memberName]) payload = await this.serializeEventStream({
						eventStream: input[memberName],
						requestSchema: ns
					});
				} else payload = inputMemberValue;
				else {
					serializer.write(memberNs, inputMemberValue);
					payload = serializer.flush();
				}
				else if (memberTraits.httpLabel) {
					serializer.write(memberNs, inputMemberValue);
					const replacement = serializer.flush();
					if (request.path.includes(`{${memberName}+}`)) request.path = request.path.replace(`{${memberName}+}`, replacement.split("/").map(extendedEncodeURIComponent).join("/"));
					else if (request.path.includes(`{${memberName}}`)) request.path = request.path.replace(`{${memberName}}`, extendedEncodeURIComponent(replacement));
				} else if (memberTraits.httpHeader) {
					serializer.write(memberNs, inputMemberValue);
					headers[memberTraits.httpHeader.toLowerCase()] = String(serializer.flush());
				} else if (typeof memberTraits.httpPrefixHeaders === "string") for (const key in inputMemberValue) {
					const val = inputMemberValue[key];
					const amalgam = memberTraits.httpPrefixHeaders + key;
					serializer.write([memberNs.getValueSchema(), { httpHeader: amalgam }], val);
					headers[amalgam.toLowerCase()] = serializer.flush();
				}
				else if (memberTraits.httpQuery || memberTraits.httpQueryParams) this.serializeQuery(memberNs, inputMemberValue, query);
				else {
					hasNonHttpBindingMember = true;
					payloadMemberNames.push(memberName);
					payloadMemberSchemas.push(memberNs);
				}
			}
			if (hasNonHttpBindingMember && input) {
				const [namespace, name] = (ns.getName(true) ?? "#Unknown").split("#");
				const requiredMembers = ns.getSchema()[6];
				const payloadSchema = [
					3,
					namespace,
					name,
					ns.getMergedTraits(),
					payloadMemberNames,
					payloadMemberSchemas,
					void 0
				];
				if (requiredMembers) payloadSchema[6] = requiredMembers;
				else payloadSchema.pop();
				serializer.write(payloadSchema, input);
				payload = serializer.flush();
			}
			request.headers = headers;
			request.query = query;
			request.body = payload;
			return request;
		}
		serializeQuery(ns, data, query) {
			const serializer = this.serializer;
			const traits = ns.getMergedTraits();
			if (traits.httpQueryParams) {
				for (const key in data) if (!(key in query)) {
					const val = data[key];
					const valueSchema = ns.getValueSchema();
					Object.assign(valueSchema.getMergedTraits(), {
						...traits,
						httpQuery: key,
						httpQueryParams: void 0
					});
					this.serializeQuery(valueSchema, val, query);
				}
				return;
			}
			if (ns.isListSchema()) {
				const sparse = !!ns.getMergedTraits().sparse;
				const buffer = [];
				for (const item of data) {
					serializer.write([ns.getValueSchema(), traits], item);
					const serializable = serializer.flush();
					if (sparse || serializable !== void 0) buffer.push(serializable);
				}
				query[traits.httpQuery] = buffer;
			} else {
				serializer.write([ns, traits], data);
				query[traits.httpQuery] = serializer.flush();
			}
		}
		async deserializeResponse(operationSchema, context, response) {
			const deserializer = this.deserializer;
			const ns = NormalizedSchema.of(operationSchema.output);
			const dataObject = {};
			if (response.statusCode >= 300) {
				const bytes = await collectBody(response.body, context);
				if (bytes.byteLength > 0) Object.assign(dataObject, await deserializer.read(15, bytes));
				await this.handleError(operationSchema, context, response, dataObject, this.deserializeMetadata(response));
				throw new Error("@smithy/core/protocols - HTTP Protocol error handler failed to throw.");
			}
			for (const header in response.headers) {
				const value = response.headers[header];
				delete response.headers[header];
				response.headers[header.toLowerCase()] = value;
			}
			const nonHttpBindingMembers = await this.deserializeHttpMessage(ns, context, response, dataObject);
			if (nonHttpBindingMembers.length) {
				const bytes = await collectBody(response.body, context);
				if (bytes.byteLength > 0) {
					const dataFromBody = await deserializer.read(ns, bytes);
					for (const member of nonHttpBindingMembers) if (dataFromBody[member] != null) dataObject[member] = dataFromBody[member];
				}
			} else if (nonHttpBindingMembers.discardResponseBody) await collectBody(response.body, context);
			dataObject.$metadata = this.deserializeMetadata(response);
			return dataObject;
		}
		async deserializeHttpMessage(schema, context, response, arg4, arg5) {
			let dataObject;
			if (arg4 instanceof Set) dataObject = arg5;
			else dataObject = arg4;
			let discardResponseBody = true;
			const deserializer = this.deserializer;
			const ns = NormalizedSchema.of(schema);
			const nonHttpBindingMembers = [];
			for (const [memberName, memberSchema] of ns.structIterator()) {
				const memberTraits = memberSchema.getMemberTraits();
				if (memberTraits.httpPayload) {
					discardResponseBody = false;
					if (memberSchema.isStreaming()) if (memberSchema.isStructSchema()) dataObject[memberName] = await this.deserializeEventStream({
						response,
						responseSchema: ns
					});
					else dataObject[memberName] = sdkStreamMixin(response.body);
					else if (response.body) {
						const bytes = await collectBody(response.body, context);
						if (bytes.byteLength > 0) dataObject[memberName] = await deserializer.read(memberSchema, bytes);
					}
				} else if (memberTraits.httpHeader) {
					const key = String(memberTraits.httpHeader).toLowerCase();
					const value = response.headers[key];
					if (null != value) if (memberSchema.isListSchema()) {
						const headerListValueSchema = memberSchema.getValueSchema();
						headerListValueSchema.getMergedTraits().httpHeader = key;
						let sections;
						if (headerListValueSchema.isTimestampSchema() && headerListValueSchema.getSchema() === 4) sections = splitEvery(value, ",", 2);
						else sections = splitHeader(value);
						const list = [];
						for (const section of sections) list.push(await deserializer.read(headerListValueSchema, section.trim()));
						dataObject[memberName] = list;
					} else dataObject[memberName] = await deserializer.read(memberSchema, value);
				} else if (memberTraits.httpPrefixHeaders !== void 0) {
					dataObject[memberName] = {};
					for (const header in response.headers) if (header.startsWith(memberTraits.httpPrefixHeaders)) {
						const value = response.headers[header];
						const valueSchema = memberSchema.getValueSchema();
						valueSchema.getMergedTraits().httpHeader = header;
						dataObject[memberName][header.slice(memberTraits.httpPrefixHeaders.length)] = await deserializer.read(valueSchema, value);
					}
				} else if (memberTraits.httpResponseCode) dataObject[memberName] = response.statusCode;
				else nonHttpBindingMembers.push(memberName);
			}
			nonHttpBindingMembers.discardResponseBody = discardResponseBody;
			return nonHttpBindingMembers;
		}
	};
	var RpcProtocol = class extends HttpProtocol {
		async serializeRequest(operationSchema, _input, context) {
			const serializer = this.serializer;
			const query = {};
			const headers = {};
			const endpoint = await context.endpoint();
			const ns = NormalizedSchema.of(operationSchema?.input);
			const schema = ns.getSchema();
			let payload;
			const input = _input && typeof _input === "object" ? _input : {};
			const request = new HttpRequest({
				protocol: "",
				hostname: "",
				port: void 0,
				path: "/",
				fragment: void 0,
				query,
				headers,
				body: void 0
			});
			if (endpoint) {
				this.updateServiceEndpoint(request, endpoint);
				this.setHostPrefix(request, operationSchema, input);
			}
			if (input) {
				const eventStreamMember = ns.getEventStreamMember();
				if (eventStreamMember) {
					if (input[eventStreamMember]) {
						const initialRequest = {};
						for (const [memberName, memberSchema] of ns.structIterator()) if (memberName !== eventStreamMember && input[memberName]) {
							serializer.write(memberSchema, input[memberName]);
							initialRequest[memberName] = serializer.flush();
						}
						payload = await this.serializeEventStream({
							eventStream: input[eventStreamMember],
							requestSchema: ns,
							initialRequest
						});
					}
				} else {
					serializer.write(schema, input);
					payload = serializer.flush();
				}
			}
			request.headers = Object.assign(request.headers, headers);
			request.query = query;
			request.body = payload;
			request.method = "POST";
			return request;
		}
		async deserializeResponse(operationSchema, context, response) {
			const deserializer = this.deserializer;
			const ns = NormalizedSchema.of(operationSchema.output);
			const dataObject = {};
			if (response.statusCode >= 300) {
				const bytes = await collectBody(response.body, context);
				if (bytes.byteLength > 0) Object.assign(dataObject, await deserializer.read(15, bytes));
				await this.handleError(operationSchema, context, response, dataObject, this.deserializeMetadata(response));
				throw new Error("@smithy/core/protocols - RPC Protocol error handler failed to throw.");
			}
			for (const header in response.headers) {
				const value = response.headers[header];
				delete response.headers[header];
				response.headers[header.toLowerCase()] = value;
			}
			const eventStreamMember = ns.getEventStreamMember();
			if (eventStreamMember) dataObject[eventStreamMember] = await this.deserializeEventStream({
				response,
				responseSchema: ns,
				initialResponseContainer: dataObject
			});
			else {
				const bytes = await collectBody(response.body, context);
				if (bytes.byteLength > 0) Object.assign(dataObject, await deserializer.read(ns, bytes));
			}
			dataObject.$metadata = this.deserializeMetadata(response);
			return dataObject;
		}
	};
	var resolvedPath = (resolvedPath, input, memberName, labelValueProvider, uriLabel, isGreedyLabel) => {
		if (input != null && input[memberName] !== void 0) {
			const labelValue = labelValueProvider();
			if (labelValue == null || labelValue.length <= 0) throw new Error("Empty value provided for input HTTP label: " + memberName + ".");
			resolvedPath = resolvedPath.replace(uriLabel, isGreedyLabel ? labelValue.split("/").map((segment) => extendedEncodeURIComponent(segment)).join("/") : extendedEncodeURIComponent(labelValue));
		} else throw new Error("No value provided for input HTTP label: " + memberName + ".");
		return resolvedPath;
	};
	function requestBuilder(input, context) {
		return new RequestBuilder(input, context);
	}
	var RequestBuilder = class {
		input;
		context;
		query = {};
		method = "";
		headers = {};
		path = "";
		body = null;
		hostname = "";
		resolvePathStack = [];
		constructor(input, context) {
			this.input = input;
			this.context = context;
		}
		async build() {
			const { hostname, protocol = "https", port, path: basePath } = await this.context.endpoint();
			this.path = basePath;
			for (const resolvePath of this.resolvePathStack) resolvePath(this.path);
			return new HttpRequest({
				protocol,
				hostname: this.hostname || hostname,
				port,
				method: this.method,
				path: this.path,
				query: this.query,
				body: this.body,
				headers: this.headers
			});
		}
		hn(hostname) {
			this.hostname = hostname;
			return this;
		}
		bp(uriLabel) {
			this.resolvePathStack.push((basePath) => {
				this.path = `${basePath?.endsWith("/") ? basePath.slice(0, -1) : basePath || ""}` + uriLabel;
			});
			return this;
		}
		p(memberName, labelValueProvider, uriLabel, isGreedyLabel) {
			this.resolvePathStack.push((path) => {
				this.path = resolvedPath(path, this.input, memberName, labelValueProvider, uriLabel, isGreedyLabel);
			});
			return this;
		}
		h(headers) {
			this.headers = headers;
			return this;
		}
		q(query) {
			this.query = query;
			return this;
		}
		b(body) {
			this.body = body;
			return this;
		}
		m(method) {
			this.method = method;
			return this;
		}
	};
	function determineTimestampFormat(ns, settings) {
		if (settings.timestampFormat.useTrait) {
			if (ns.isTimestampSchema() && (ns.getSchema() === 5 || ns.getSchema() === 6 || ns.getSchema() === 7)) return ns.getSchema();
		}
		const { httpLabel, httpPrefixHeaders, httpHeader, httpQuery } = ns.getMergedTraits();
		return (settings.httpBindings ? typeof httpPrefixHeaders === "string" || Boolean(httpHeader) ? 6 : Boolean(httpQuery) || Boolean(httpLabel) ? 5 : void 0 : void 0) ?? settings.timestampFormat.default;
	}
	var FromStringShapeDeserializer = class extends SerdeContext {
		settings;
		constructor(settings) {
			super();
			this.settings = settings;
		}
		read(_schema, data) {
			const ns = NormalizedSchema.of(_schema);
			if (ns.isListSchema()) return splitHeader(data).map((item) => this.read(ns.getValueSchema(), item));
			if (ns.isBlobSchema()) return (this.serdeContext?.base64Decoder ?? fromBase64)(data);
			if (ns.isTimestampSchema()) switch (determineTimestampFormat(ns, this.settings)) {
				case 5: return _parseRfc3339DateTimeWithOffset(data);
				case 6: return _parseRfc7231DateTime(data);
				case 7: return _parseEpochTimestamp(data);
				default:
					console.warn("Missing timestamp format, parsing value with Date constructor:", data);
					return new Date(data);
			}
			if (ns.isStringSchema()) {
				const mediaType = ns.getMergedTraits().mediaType;
				let intermediateValue = data;
				if (mediaType) {
					if (ns.getMergedTraits().httpHeader) intermediateValue = this.base64ToUtf8(intermediateValue);
					if (mediaType === "application/json" || mediaType.endsWith("+json")) intermediateValue = LazyJsonString.from(intermediateValue);
					return intermediateValue;
				}
			}
			if (ns.isNumericSchema()) return Number(data);
			if (ns.isBigIntegerSchema()) return BigInt(data);
			if (ns.isBigDecimalSchema()) return new NumericValue(data, "bigDecimal");
			if (ns.isBooleanSchema()) return String(data).toLowerCase() === "true";
			return data;
		}
		base64ToUtf8(base64String) {
			return (this.serdeContext?.utf8Encoder ?? toUtf8)((this.serdeContext?.base64Decoder ?? fromBase64)(base64String));
		}
	};
	var HttpInterceptingShapeDeserializer = class extends SerdeContext {
		codecDeserializer;
		stringDeserializer;
		constructor(codecDeserializer, codecSettings) {
			super();
			this.codecDeserializer = codecDeserializer;
			this.stringDeserializer = new FromStringShapeDeserializer(codecSettings);
		}
		setSerdeContext(serdeContext) {
			this.stringDeserializer.setSerdeContext(serdeContext);
			this.codecDeserializer.setSerdeContext(serdeContext);
			this.serdeContext = serdeContext;
		}
		read(schema, data) {
			const ns = NormalizedSchema.of(schema);
			const traits = ns.getMergedTraits();
			const toString = this.serdeContext?.utf8Encoder ?? toUtf8;
			if (traits.httpHeader || traits.httpResponseCode) return this.stringDeserializer.read(ns, toString(data));
			if (traits.httpPayload) {
				if (ns.isBlobSchema()) {
					const toBytes = this.serdeContext?.utf8Decoder ?? fromUtf8;
					if (typeof data === "string") return toBytes(data);
					return data;
				} else if (ns.isStringSchema()) {
					if ("byteLength" in data) return toString(data);
					return data;
				}
			}
			return this.codecDeserializer.read(ns, data);
		}
	};
	var ToStringShapeSerializer = class extends SerdeContext {
		settings;
		stringBuffer = "";
		constructor(settings) {
			super();
			this.settings = settings;
		}
		write(schema, value) {
			const ns = NormalizedSchema.of(schema);
			switch (typeof value) {
				case "object":
					if (value === null) {
						this.stringBuffer = "null";
						return;
					}
					if (ns.isTimestampSchema()) {
						if (!(value instanceof Date)) throw new Error(`@smithy/core/protocols - received non-Date value ${value} when schema expected Date in ${ns.getName(true)}`);
						switch (determineTimestampFormat(ns, this.settings)) {
							case 5:
								this.stringBuffer = value.toISOString().replace(".000Z", "Z");
								break;
							case 6:
								this.stringBuffer = dateToUtcString(value);
								break;
							case 7:
								this.stringBuffer = String(value.getTime() / 1e3);
								break;
							default:
								console.warn("Missing timestamp format, using epoch seconds", value);
								this.stringBuffer = String(value.getTime() / 1e3);
						}
						return;
					}
					if (ns.isBlobSchema() && "byteLength" in value) {
						this.stringBuffer = (this.serdeContext?.base64Encoder ?? toBase64)(value);
						return;
					}
					if (ns.isListSchema() && Array.isArray(value)) {
						let buffer = "";
						for (const item of value) {
							this.write([ns.getValueSchema(), ns.getMergedTraits()], item);
							const headerItem = this.flush();
							const serialized = ns.getValueSchema().isTimestampSchema() ? headerItem : quoteHeader(headerItem);
							if (buffer !== "") buffer += ", ";
							buffer += serialized;
						}
						this.stringBuffer = buffer;
						return;
					}
					this.stringBuffer = JSON.stringify(value, null, 2);
					break;
				case "string":
					const mediaType = ns.getMergedTraits().mediaType;
					let intermediateValue = value;
					if (mediaType) {
						if (mediaType === "application/json" || mediaType.endsWith("+json")) intermediateValue = LazyJsonString.from(intermediateValue);
						if (ns.getMergedTraits().httpHeader) {
							this.stringBuffer = (this.serdeContext?.base64Encoder ?? toBase64)(intermediateValue.toString());
							return;
						}
					}
					this.stringBuffer = value;
					break;
				default: if (ns.isIdempotencyToken()) this.stringBuffer = generateIdempotencyToken();
				else this.stringBuffer = String(value);
			}
		}
		flush() {
			const buffer = this.stringBuffer;
			this.stringBuffer = "";
			return buffer;
		}
	};
	var HttpInterceptingShapeSerializer = class {
		codecSerializer;
		stringSerializer;
		buffer;
		constructor(codecSerializer, codecSettings, stringSerializer = new ToStringShapeSerializer(codecSettings)) {
			this.codecSerializer = codecSerializer;
			this.stringSerializer = stringSerializer;
		}
		setSerdeContext(serdeContext) {
			this.codecSerializer.setSerdeContext(serdeContext);
			this.stringSerializer.setSerdeContext(serdeContext);
		}
		write(schema, value) {
			const ns = NormalizedSchema.of(schema);
			const traits = ns.getMergedTraits();
			if (traits.httpHeader || traits.httpLabel || traits.httpQuery) {
				this.stringSerializer.write(ns, value);
				this.buffer = this.stringSerializer.flush();
				return;
			}
			return this.codecSerializer.write(ns, value);
		}
		flush() {
			if (this.buffer !== void 0) {
				const buffer = this.buffer;
				this.buffer = void 0;
				return buffer;
			}
			return this.codecSerializer.flush();
		}
	};
	var Field = class {
		name;
		kind;
		values;
		constructor({ name, kind = FieldPosition.HEADER, values = [] }) {
			this.name = name;
			this.kind = kind;
			this.values = values;
		}
		add(value) {
			this.values.push(value);
		}
		set(values) {
			this.values = values;
		}
		remove(value) {
			this.values = this.values.filter((v) => v !== value);
		}
		toString() {
			return this.values.map((v) => v.includes(",") || v.includes(" ") ? `"${v}"` : v).join(", ");
		}
		get() {
			return this.values;
		}
	};
	var Fields = class {
		entries = {};
		encoding;
		constructor({ fields = [], encoding = "utf-8" }) {
			fields.forEach(this.setField.bind(this));
			this.encoding = encoding;
		}
		setField(field) {
			this.entries[field.name.toLowerCase()] = field;
		}
		getField(name) {
			return this.entries[name.toLowerCase()];
		}
		removeField(name) {
			delete this.entries[name.toLowerCase()];
		}
		getByType(kind) {
			return Object.values(this.entries).filter((field) => field.kind === kind);
		}
	};
	var getHttpHandlerExtensionConfiguration = (runtimeConfig) => {
		return {
			setHttpHandler(handler) {
				runtimeConfig.httpHandler = handler;
			},
			httpHandler() {
				return runtimeConfig.httpHandler;
			},
			updateHttpClientConfig(key, value) {
				runtimeConfig.httpHandler?.updateHttpClientConfig(key, value);
			},
			httpHandlerConfigs() {
				return runtimeConfig.httpHandler.httpHandlerConfigs();
			}
		};
	};
	var resolveHttpHandlerRuntimeConfig = (httpHandlerExtensionConfiguration) => {
		return { httpHandler: httpHandlerExtensionConfiguration.httpHandler() };
	};
	var CONTENT_LENGTH_HEADER = "content-length";
	function contentLengthMiddleware(bodyLengthChecker) {
		return (next) => async (args) => {
			const request = args.request;
			if (HttpRequest.isInstance(request)) {
				const { body, headers } = request;
				if (body && Object.keys(headers).map((str) => str.toLowerCase()).indexOf(CONTENT_LENGTH_HEADER) === -1) try {
					const length = bodyLengthChecker(body);
					request.headers = {
						...request.headers,
						[CONTENT_LENGTH_HEADER]: String(length)
					};
				} catch (ignored) {}
			}
			return next({
				...args,
				request
			});
		};
	}
	var contentLengthMiddlewareOptions = {
		step: "build",
		tags: ["SET_CONTENT_LENGTH", "CONTENT_LENGTH"],
		name: "contentLengthMiddleware",
		override: true
	};
	var getContentLengthPlugin = (options) => ({ applyToStack: (clientStack) => {
		clientStack.add(contentLengthMiddleware(options.bodyLengthChecker), contentLengthMiddlewareOptions);
	} });
	var escapeUri = (uri) => encodeURIComponent(uri).replace(/[!'()*]/g, hexEncode);
	var hexEncode = (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`;
	var escapeUriPath = (uri) => uri.split("/").map(escapeUri).join("/");
	function buildQueryString(query) {
		const parts = [];
		for (let key of Object.keys(query).sort()) {
			const value = query[key];
			key = escapeUri(key);
			if (Array.isArray(value)) for (let i = 0, iLen = value.length; i < iLen; i++) parts.push(`${key}=${escapeUri(value[i])}`);
			else {
				let qsEntry = key;
				if (value || typeof value === "string") qsEntry += `=${escapeUri(value)}`;
				parts.push(qsEntry);
			}
		}
		return parts.join("&");
	}
	exports.Field = Field;
	exports.Fields = Fields;
	exports.FromStringShapeDeserializer = FromStringShapeDeserializer;
	exports.HttpBindingProtocol = HttpBindingProtocol;
	exports.HttpInterceptingShapeDeserializer = HttpInterceptingShapeDeserializer;
	exports.HttpInterceptingShapeSerializer = HttpInterceptingShapeSerializer;
	exports.HttpProtocol = HttpProtocol;
	exports.RequestBuilder = RequestBuilder;
	exports.RpcProtocol = RpcProtocol;
	exports.SerdeContext = SerdeContext;
	exports.ToStringShapeSerializer = ToStringShapeSerializer;
	exports.buildQueryString = buildQueryString;
	exports.collectBody = collectBody;
	exports.contentLengthMiddleware = contentLengthMiddleware;
	exports.contentLengthMiddlewareOptions = contentLengthMiddlewareOptions;
	exports.determineTimestampFormat = determineTimestampFormat;
	exports.escapeUri = escapeUri;
	exports.escapeUriPath = escapeUriPath;
	exports.extendedEncodeURIComponent = extendedEncodeURIComponent;
	exports.getContentLengthPlugin = getContentLengthPlugin;
	exports.getHttpHandlerExtensionConfiguration = getHttpHandlerExtensionConfiguration;
	exports.requestBuilder = requestBuilder;
	exports.resolveHttpHandlerRuntimeConfig = resolveHttpHandlerRuntimeConfig;
	exports.resolvedPath = resolvedPath;
}));
//#endregion
//#region node_modules/@smithy/core/dist-cjs/submodules/retry/index.js
var require_retry = /* @__PURE__ */ __commonJSMin(((exports) => {
	var { Readable: Readable$1 } = __require("node:stream");
	var { NoOpLogger, normalizeProvider } = require_client$1();
	var { HttpResponse, HttpRequest } = require_protocols$1();
	var { parseRfc7231DateTime, v4 } = require_serde();
	var isStreamingPayload = (request) => request?.body instanceof Readable$1 || typeof ReadableStream !== "undefined" && request?.body instanceof ReadableStream;
	var CLOCK_SKEW_ERROR_CODES = [
		"AuthFailure",
		"InvalidSignatureException",
		"RequestExpired",
		"RequestInTheFuture",
		"RequestTimeTooSkewed",
		"SignatureDoesNotMatch"
	];
	var THROTTLING_ERROR_CODES = [
		"BandwidthLimitExceeded",
		"EC2ThrottledException",
		"LimitExceededException",
		"PriorRequestNotComplete",
		"ProvisionedThroughputExceededException",
		"RequestLimitExceeded",
		"RequestThrottled",
		"RequestThrottledException",
		"SlowDown",
		"ThrottledException",
		"Throttling",
		"ThrottlingException",
		"TooManyRequestsException",
		"TransactionInProgressException"
	];
	var TRANSIENT_ERROR_CODES = [
		"TimeoutError",
		"RequestTimeout",
		"RequestTimeoutException"
	];
	var TRANSIENT_ERROR_STATUS_CODES = [
		500,
		502,
		503,
		504
	];
	var NODEJS_TIMEOUT_ERROR_CODES = [
		"ECONNRESET",
		"ECONNREFUSED",
		"EPIPE",
		"ETIMEDOUT"
	];
	var NODEJS_NETWORK_ERROR_CODES = [
		"EHOSTUNREACH",
		"ENETUNREACH",
		"ENOTFOUND",
		"EAI_AGAIN"
	];
	var isRetryableByTrait = (error) => error?.$retryable !== void 0;
	var isClockSkewError = (error) => CLOCK_SKEW_ERROR_CODES.includes(error.name);
	var isClockSkewCorrectedError = (error) => error.$metadata?.clockSkewCorrected;
	var isBrowserNetworkError = (error) => {
		const errorMessages = /* @__PURE__ */ new Set([
			"Failed to fetch",
			"NetworkError when attempting to fetch resource",
			"The Internet connection appears to be offline",
			"Load failed",
			"Network request failed"
		]);
		if (!(error && error instanceof TypeError)) return false;
		return errorMessages.has(error.message);
	};
	var isThrottlingError = (error) => error.$metadata?.httpStatusCode === 429 || THROTTLING_ERROR_CODES.includes(error.name) || error.$retryable?.throttling == true;
	var isTransientError = (error, depth = 0) => isRetryableByTrait(error) || isClockSkewCorrectedError(error) || error.name === "InvalidSignatureException" && error.message?.includes("Signature expired") || TRANSIENT_ERROR_CODES.includes(error.name) || NODEJS_TIMEOUT_ERROR_CODES.includes(error?.code || "") || NODEJS_NETWORK_ERROR_CODES.includes(error?.code || "") || TRANSIENT_ERROR_STATUS_CODES.includes(error.$metadata?.httpStatusCode || 0) || isBrowserNetworkError(error) || isNodeJsHttp2TransientError(error) || error.cause !== void 0 && depth <= 10 && isTransientError(error.cause, depth + 1);
	var isServerError = (error) => {
		if (error.$metadata?.httpStatusCode !== void 0) {
			const statusCode = error.$metadata.httpStatusCode;
			if (500 <= statusCode && statusCode <= 599 && !isTransientError(error)) return true;
			return false;
		}
		return false;
	};
	function isNodeJsHttp2TransientError(error) {
		return error.code === "ERR_HTTP2_STREAM_ERROR" && error.message.includes("NGHTTP2_REFUSED_STREAM");
	}
	var DEFAULT_RETRY_DELAY_BASE = 100;
	var MAXIMUM_RETRY_DELAY = 20 * 1e3;
	var THROTTLING_RETRY_DELAY_BASE = 500;
	var INITIAL_RETRY_TOKENS = 500;
	var RETRY_COST = 5;
	var TIMEOUT_RETRY_COST = 10;
	var NO_RETRY_INCREMENT = 1;
	var INVOCATION_ID_HEADER = "amz-sdk-invocation-id";
	var REQUEST_HEADER = "amz-sdk-request";
	function parseRetryAfterHeader(response, logger) {
		if (!HttpResponse.isInstance(response)) return;
		for (const header of Object.keys(response.headers)) {
			const h = header.toLowerCase();
			if (h === "retry-after") {
				const retryAfter = response.headers[header];
				let retryAfterSeconds = NaN;
				if (retryAfter.endsWith("GMT")) try {
					retryAfterSeconds = (parseRfc7231DateTime(retryAfter).getTime() - Date.now()) / 1e3;
				} catch (e) {
					logger?.trace?.("Failed to parse retry-after header");
					logger?.trace?.(e);
				}
				else if (retryAfter.match(/ GMT, ((\d+)|(\d+\.\d+))$/)) retryAfterSeconds = Number(retryAfter.match(/ GMT, ([\d.]+)$/)?.[1]);
				else if (retryAfter.match(/^((\d+)|(\d+\.\d+))$/)) retryAfterSeconds = Number(retryAfter);
				else if (Date.parse(retryAfter) >= Date.now()) retryAfterSeconds = (Date.parse(retryAfter) - Date.now()) / 1e3;
				if (isNaN(retryAfterSeconds)) return;
				return new Date(Date.now() + retryAfterSeconds * 1e3);
			} else if (h === "x-amz-retry-after") {
				const v = response.headers[header];
				const backoffMilliseconds = Number(v);
				if (isNaN(backoffMilliseconds)) {
					logger?.trace?.(`Failed to parse x-amz-retry-after=${v}`);
					return;
				}
				return new Date(Date.now() + backoffMilliseconds);
			}
		}
	}
	function getRetryAfterHint(response, logger) {
		return parseRetryAfterHeader(response, logger);
	}
	var asSdkError = (error) => {
		if (error instanceof Error) return error;
		if (error instanceof Object) return Object.assign(/* @__PURE__ */ new Error(), error);
		if (typeof error === "string") return new Error(error);
		return /* @__PURE__ */ new Error(`AWS SDK error wrapper for ${error}`);
	};
	function bindRetryMiddleware(isStreamingPayload) {
		return (options) => (next, context) => async (args) => {
			let retryStrategy = await options.retryStrategy();
			const maxAttempts = await options.maxAttempts();
			if (isRetryStrategyV2(retryStrategy)) {
				retryStrategy = retryStrategy;
				let retryToken = await retryStrategy.acquireInitialRetryToken((context["partition_id"] ?? "") + (context.__retryLongPoll ? ":longpoll" : ""));
				let lastError = /* @__PURE__ */ new Error();
				let attempts = 0;
				let totalRetryDelay = 0;
				const { request } = args;
				const isRequest = HttpRequest.isInstance(request);
				if (isRequest) request.headers[INVOCATION_ID_HEADER] = v4();
				while (true) try {
					if (isRequest) request.headers[REQUEST_HEADER] = `attempt=${attempts + 1}; max=${maxAttempts}`;
					const { response, output } = await next(args);
					retryStrategy.recordSuccess(retryToken);
					output.$metadata.attempts = attempts + 1;
					output.$metadata.totalRetryDelay = totalRetryDelay;
					return {
						response,
						output
					};
				} catch (e) {
					const retryErrorInfo = getRetryErrorInfo(e, options.logger);
					lastError = asSdkError(e);
					if (isRequest && isStreamingPayload(request)) {
						(context.logger instanceof NoOpLogger ? console : context.logger)?.warn("An error was encountered in a non-retryable streaming request.");
						throw lastError;
					}
					try {
						retryToken = await retryStrategy.refreshRetryTokenForRetry(retryToken, retryErrorInfo);
					} catch (ignoredRefreshError) {
						if (!lastError.$metadata) lastError.$metadata = {};
						lastError.$metadata.attempts = attempts + 1;
						lastError.$metadata.totalRetryDelay = totalRetryDelay;
						throw lastError;
					}
					attempts = retryToken.getRetryCount();
					const delay = retryToken.getRetryDelay();
					totalRetryDelay += (retryToken?.$retryLog?.acquisitionDelay ?? 0) + delay;
					if (delay > 0) await cooldown(delay);
				}
			} else {
				retryStrategy = retryStrategy;
				if (retryStrategy?.mode) context.userAgent = [...context.userAgent || [], ["cfg/retry-mode", retryStrategy.mode]];
				return retryStrategy.retry(next, args);
			}
		};
	}
	var cooldown = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
	var isRetryStrategyV2 = (retryStrategy) => typeof retryStrategy.acquireInitialRetryToken !== "undefined" && typeof retryStrategy.refreshRetryTokenForRetry !== "undefined" && typeof retryStrategy.recordSuccess !== "undefined";
	var getRetryErrorInfo = (error, logger) => {
		const errorInfo = {
			error,
			errorType: getRetryErrorType(error)
		};
		const retryAfterHint = parseRetryAfterHeader(error.$response, logger);
		if (retryAfterHint) errorInfo.retryAfterHint = retryAfterHint;
		return errorInfo;
	};
	var getRetryErrorType = (error) => {
		if (isThrottlingError(error)) return "THROTTLING";
		if (isTransientError(error)) return "TRANSIENT";
		if (isServerError(error)) return "SERVER_ERROR";
		return "CLIENT_ERROR";
	};
	var retryMiddlewareOptions = {
		name: "retryMiddleware",
		tags: ["RETRY"],
		step: "finalizeRequest",
		priority: "high",
		override: true
	};
	function bindGetRetryPlugin(isStreamingPayload) {
		const retryMiddleware = bindRetryMiddleware(isStreamingPayload);
		return (options) => ({ applyToStack: (clientStack) => {
			clientStack.add(retryMiddleware(options), retryMiddlewareOptions);
		} });
	}
	var DefaultRateLimiter = class DefaultRateLimiter {
		static setTimeoutFn = (fn, delay) => setTimeout(fn, delay);
		beta;
		minCapacity;
		minFillRate;
		scaleConstant;
		smooth;
		enabled = false;
		availableTokens = 0;
		lastMaxRate = 0;
		measuredTxRate = 0;
		requestCount = 0;
		fillRate;
		lastThrottleTime;
		lastTimestamp = 0;
		lastTxRateBucket;
		maxCapacity;
		timeWindow = 0;
		constructor(options) {
			this.beta = options?.beta ?? .7;
			this.minCapacity = options?.minCapacity ?? 1;
			this.minFillRate = options?.minFillRate ?? .5;
			this.scaleConstant = options?.scaleConstant ?? .4;
			this.smooth = options?.smooth ?? .8;
			this.lastThrottleTime = this.getCurrentTimeInSeconds();
			this.lastTxRateBucket = Math.floor(this.getCurrentTimeInSeconds());
			this.fillRate = this.minFillRate;
			this.maxCapacity = this.minCapacity;
		}
		async getSendToken() {
			return this.acquireTokenBucket(1);
		}
		updateClientSendingRate(response) {
			let calculatedRate;
			this.updateMeasuredRate();
			const retryErrorInfo = response;
			if (retryErrorInfo?.errorType === "THROTTLING" || isThrottlingError(retryErrorInfo?.error ?? response)) {
				const rateToUse = !this.enabled ? this.measuredTxRate : Math.min(this.measuredTxRate, this.fillRate);
				this.lastMaxRate = rateToUse;
				this.calculateTimeWindow();
				this.lastThrottleTime = this.getCurrentTimeInSeconds();
				calculatedRate = this.cubicThrottle(rateToUse);
				this.enableTokenBucket();
			} else {
				this.calculateTimeWindow();
				calculatedRate = this.cubicSuccess(this.getCurrentTimeInSeconds());
			}
			const newRate = Math.min(calculatedRate, 2 * this.measuredTxRate);
			this.updateTokenBucketRate(newRate);
		}
		getCurrentTimeInSeconds() {
			return Date.now() / 1e3;
		}
		async acquireTokenBucket(amount) {
			if (!this.enabled) return;
			this.refillTokenBucket();
			while (amount > this.availableTokens) {
				const delay = (amount - this.availableTokens) / this.fillRate * 1e3;
				await new Promise((resolve) => DefaultRateLimiter.setTimeoutFn(resolve, delay));
				this.refillTokenBucket();
			}
			this.availableTokens = this.availableTokens - amount;
		}
		refillTokenBucket() {
			const timestamp = this.getCurrentTimeInSeconds();
			if (!this.lastTimestamp) {
				this.lastTimestamp = timestamp;
				return;
			}
			const fillAmount = (timestamp - this.lastTimestamp) * this.fillRate;
			this.availableTokens = Math.min(this.maxCapacity, this.availableTokens + fillAmount);
			this.lastTimestamp = timestamp;
		}
		calculateTimeWindow() {
			this.timeWindow = this.getPrecise(Math.pow(this.lastMaxRate * (1 - this.beta) / this.scaleConstant, 1 / 3));
		}
		cubicThrottle(rateToUse) {
			return this.getPrecise(rateToUse * this.beta);
		}
		cubicSuccess(timestamp) {
			return this.getPrecise(this.scaleConstant * Math.pow(timestamp - this.lastThrottleTime - this.timeWindow, 3) + this.lastMaxRate);
		}
		enableTokenBucket() {
			this.enabled = true;
		}
		updateTokenBucketRate(newRate) {
			this.refillTokenBucket();
			this.fillRate = Math.max(newRate, this.minFillRate);
			this.maxCapacity = Math.max(newRate, this.minCapacity);
			this.availableTokens = Math.min(this.availableTokens, this.maxCapacity);
		}
		updateMeasuredRate() {
			const t = this.getCurrentTimeInSeconds();
			const timeBucket = Math.floor(t * 2) / 2;
			this.requestCount++;
			if (timeBucket > this.lastTxRateBucket) {
				const currentRate = this.requestCount / (timeBucket - this.lastTxRateBucket);
				this.measuredTxRate = this.getPrecise(currentRate * this.smooth + this.measuredTxRate * (1 - this.smooth));
				this.requestCount = 0;
				this.lastTxRateBucket = timeBucket;
			}
		}
		getPrecise(num) {
			return parseFloat(num.toFixed(8));
		}
	};
	var Retry = class Retry {
		static v2026 = typeof process !== "undefined" && process.env?.SMITHY_NEW_RETRIES_2026 === "true";
		static delay() {
			return Retry.v2026 ? 50 : 100;
		}
		static throttlingDelay() {
			return Retry.v2026 ? 1e3 : 500;
		}
		static cost() {
			return Retry.v2026 ? 14 : 5;
		}
		static throttlingCost() {
			return Retry.v2026 ? 5 : 10;
		}
		static modifiedCostType() {
			return Retry.v2026 ? "THROTTLING" : "TRANSIENT";
		}
	};
	var DefaultRetryBackoffStrategy = class {
		x = Retry.delay();
		computeNextBackoffDelay(i) {
			const t_i = Math.random() * Math.min(this.x * 2 ** i, MAXIMUM_RETRY_DELAY);
			return Math.floor(t_i);
		}
		setDelayBase(delay) {
			this.x = delay;
		}
	};
	var DefaultRetryToken = class {
		delay;
		count;
		cost;
		longPoll;
		$retryLog = { acquisitionDelay: 0 };
		constructor(delay, count, cost, longPoll) {
			this.delay = delay;
			this.count = count;
			this.cost = cost;
			this.longPoll = longPoll;
		}
		getRetryCount() {
			return this.count;
		}
		getRetryDelay() {
			return Math.min(MAXIMUM_RETRY_DELAY, this.delay);
		}
		getRetryCost() {
			return this.cost;
		}
		isLongPoll() {
			return this.longPoll;
		}
	};
	var RETRY_MODES;
	(function(RETRY_MODES) {
		RETRY_MODES["STANDARD"] = "standard";
		RETRY_MODES["ADAPTIVE"] = "adaptive";
	})(RETRY_MODES || (RETRY_MODES = {}));
	var DEFAULT_MAX_ATTEMPTS = 3;
	var DEFAULT_RETRY_MODE = RETRY_MODES.STANDARD;
	var refusal = {
		incompatible: 1,
		attempts: 2,
		capacity: 3
	};
	var StandardRetryStrategy$1 = class StandardRetryStrategy {
		mode = RETRY_MODES.STANDARD;
		retryBackoffStrategy;
		capacity = INITIAL_RETRY_TOKENS;
		maxAttemptsProvider;
		baseDelay;
		constructor(arg1) {
			if (typeof arg1 === "number") this.maxAttemptsProvider = async () => arg1;
			else if (typeof arg1 === "function") this.maxAttemptsProvider = arg1;
			else if (arg1 && typeof arg1 === "object") {
				this.maxAttemptsProvider = async () => arg1.maxAttempts;
				this.baseDelay = arg1.baseDelay;
				this.retryBackoffStrategy = arg1.backoff;
			}
			this.maxAttemptsProvider ??= async () => DEFAULT_MAX_ATTEMPTS;
			this.baseDelay ??= Retry.delay();
			this.retryBackoffStrategy ??= new DefaultRetryBackoffStrategy();
		}
		async acquireInitialRetryToken(retryTokenScope) {
			return new DefaultRetryToken(Retry.delay(), 0, void 0, Retry.v2026 && retryTokenScope.includes(":longpoll"));
		}
		async refreshRetryTokenForRetry(token, errorInfo) {
			const maxAttempts = await this.getMaxAttempts();
			const retryCode = this.retryCode(token, errorInfo, maxAttempts);
			const shouldRetry = retryCode === 0;
			const isLongPoll = token.isLongPoll?.();
			if (shouldRetry || isLongPoll) {
				const errorType = errorInfo.errorType;
				this.retryBackoffStrategy.setDelayBase(errorType === "THROTTLING" ? Retry.throttlingDelay() : this.baseDelay);
				const delayFromErrorType = this.retryBackoffStrategy.computeNextBackoffDelay(token.getRetryCount());
				let retryDelay = delayFromErrorType;
				if (errorInfo.retryAfterHint instanceof Date) retryDelay = Math.max(delayFromErrorType, Math.min(errorInfo.retryAfterHint.getTime() - Date.now(), delayFromErrorType + 5e3));
				if (!shouldRetry) {
					const longPollBackoff = Retry.v2026 && retryCode === refusal.capacity && isLongPoll ? retryDelay : 0;
					if (longPollBackoff > 0) await new Promise((r) => setTimeout(r, longPollBackoff));
				} else {
					const capacityCost = this.getCapacityCost(errorType);
					this.capacity -= capacityCost;
					const nextToken = new DefaultRetryToken(0, token.getRetryCount() + 1, capacityCost, token.isLongPoll?.() ?? false);
					await new Promise((r) => setTimeout(r, retryDelay));
					nextToken.$retryLog.acquisitionDelay = retryDelay;
					return nextToken;
				}
			}
			throw new Error("No retry token available");
		}
		recordSuccess(token) {
			this.capacity = Math.min(INITIAL_RETRY_TOKENS, this.capacity + (token.getRetryCost() ?? NO_RETRY_INCREMENT));
		}
		getCapacity() {
			return this.capacity;
		}
		async maxAttempts() {
			return this.maxAttemptsProvider();
		}
		async getMaxAttempts() {
			try {
				return await this.maxAttemptsProvider();
			} catch (ignored) {
				console.warn(`Max attempts provider could not resolve. Using default of ${DEFAULT_MAX_ATTEMPTS}`);
				return DEFAULT_MAX_ATTEMPTS;
			}
		}
		retryCode(tokenToRenew, errorInfo, maxAttempts) {
			const attempts = tokenToRenew.getRetryCount() + 1;
			const retryableStatus = this.isRetryableError(errorInfo.errorType) ? 0 : refusal.incompatible;
			const attemptStatus = attempts < maxAttempts ? 0 : refusal.attempts;
			const capacityStatus = this.capacity >= this.getCapacityCost(errorInfo.errorType) ? 0 : refusal.capacity;
			return retryableStatus || attemptStatus || capacityStatus;
		}
		getCapacityCost(errorType) {
			return errorType === Retry.modifiedCostType() ? Retry.throttlingCost() : Retry.cost();
		}
		isRetryableError(errorType) {
			return errorType === "THROTTLING" || errorType === "TRANSIENT";
		}
	};
	var AdaptiveRetryStrategy$1 = class AdaptiveRetryStrategy {
		mode = RETRY_MODES.ADAPTIVE;
		rateLimiter;
		standardRetryStrategy;
		constructor(maxAttemptsProvider, options) {
			const { rateLimiter } = options ?? {};
			this.rateLimiter = rateLimiter ?? new DefaultRateLimiter();
			this.standardRetryStrategy = options ? new StandardRetryStrategy$1({
				maxAttempts: typeof maxAttemptsProvider === "number" ? maxAttemptsProvider : 3,
				...options
			}) : new StandardRetryStrategy$1(maxAttemptsProvider);
		}
		async acquireInitialRetryToken(retryTokenScope) {
			const token = await this.standardRetryStrategy.acquireInitialRetryToken(retryTokenScope);
			await this.rateLimiter.getSendToken();
			return token;
		}
		async refreshRetryTokenForRetry(tokenToRenew, errorInfo) {
			this.rateLimiter.updateClientSendingRate(errorInfo);
			const token = await this.standardRetryStrategy.refreshRetryTokenForRetry(tokenToRenew, errorInfo);
			await this.rateLimiter.getSendToken();
			return token;
		}
		recordSuccess(token) {
			this.rateLimiter.updateClientSendingRate({});
			this.standardRetryStrategy.recordSuccess(token);
		}
		async maxAttemptsProvider() {
			return this.standardRetryStrategy.maxAttempts();
		}
	};
	var ConfiguredRetryStrategy = class extends StandardRetryStrategy$1 {
		computeNextBackoffDelay;
		constructor(maxAttempts, computeNextBackoffDelay = Retry.delay()) {
			super(typeof maxAttempts === "function" ? maxAttempts : async () => maxAttempts);
			if (typeof computeNextBackoffDelay === "number") this.computeNextBackoffDelay = () => computeNextBackoffDelay;
			else this.computeNextBackoffDelay = computeNextBackoffDelay;
			this.retryBackoffStrategy.computeNextBackoffDelay = (completedAttempt) => {
				const nextAttempt = completedAttempt + 1;
				return this.computeNextBackoffDelay(nextAttempt);
			};
		}
	};
	var getDefaultRetryQuota = (initialRetryTokens, options) => {
		const MAX_CAPACITY = initialRetryTokens;
		const noRetryIncrement = NO_RETRY_INCREMENT;
		const retryCost = RETRY_COST;
		const timeoutRetryCost = TIMEOUT_RETRY_COST;
		let availableCapacity = initialRetryTokens;
		const getCapacityAmount = (error) => error.name === "TimeoutError" ? timeoutRetryCost : retryCost;
		const hasRetryTokens = (error) => getCapacityAmount(error) <= availableCapacity;
		const retrieveRetryTokens = (error) => {
			if (!hasRetryTokens(error)) throw new Error("No retry token available");
			const capacityAmount = getCapacityAmount(error);
			availableCapacity -= capacityAmount;
			return capacityAmount;
		};
		const releaseRetryTokens = (capacityReleaseAmount) => {
			availableCapacity += capacityReleaseAmount ?? noRetryIncrement;
			availableCapacity = Math.min(availableCapacity, MAX_CAPACITY);
		};
		return Object.freeze({
			hasRetryTokens,
			retrieveRetryTokens,
			releaseRetryTokens
		});
	};
	var defaultDelayDecider = (delayBase, attempts) => Math.floor(Math.min(MAXIMUM_RETRY_DELAY, Math.random() * 2 ** attempts * delayBase));
	var defaultRetryDecider = (error) => {
		if (!error) return false;
		return isRetryableByTrait(error) || isClockSkewError(error) || isThrottlingError(error) || isTransientError(error);
	};
	var StandardRetryStrategy = class {
		maxAttemptsProvider;
		retryDecider;
		delayDecider;
		retryQuota;
		mode = RETRY_MODES.STANDARD;
		constructor(maxAttemptsProvider, options) {
			this.maxAttemptsProvider = maxAttemptsProvider;
			this.retryDecider = options?.retryDecider ?? defaultRetryDecider;
			this.delayDecider = options?.delayDecider ?? defaultDelayDecider;
			this.retryQuota = options?.retryQuota ?? getDefaultRetryQuota(INITIAL_RETRY_TOKENS);
		}
		shouldRetry(error, attempts, maxAttempts) {
			return attempts < maxAttempts && this.retryDecider(error) && this.retryQuota.hasRetryTokens(error);
		}
		async getMaxAttempts() {
			let maxAttempts;
			try {
				maxAttempts = await this.maxAttemptsProvider();
			} catch (ignored) {
				maxAttempts = DEFAULT_MAX_ATTEMPTS;
			}
			return maxAttempts;
		}
		async retry(next, args, options) {
			let retryTokenAmount;
			let attempts = 0;
			let totalDelay = 0;
			const maxAttempts = await this.getMaxAttempts();
			const { request } = args;
			if (HttpRequest.isInstance(request)) request.headers[INVOCATION_ID_HEADER] = v4();
			while (true) try {
				if (HttpRequest.isInstance(request)) request.headers[REQUEST_HEADER] = `attempt=${attempts + 1}; max=${maxAttempts}`;
				if (options?.beforeRequest) await options.beforeRequest();
				const { response, output } = await next(args);
				if (options?.afterRequest) options.afterRequest(response);
				this.retryQuota.releaseRetryTokens(retryTokenAmount);
				output.$metadata.attempts = attempts + 1;
				output.$metadata.totalRetryDelay = totalDelay;
				return {
					response,
					output
				};
			} catch (e) {
				const err = asSdkError(e);
				attempts++;
				if (this.shouldRetry(err, attempts, maxAttempts)) {
					retryTokenAmount = this.retryQuota.retrieveRetryTokens(err);
					const delayFromDecider = this.delayDecider(isThrottlingError(err) ? THROTTLING_RETRY_DELAY_BASE : DEFAULT_RETRY_DELAY_BASE, attempts);
					const delayFromResponse = getDelayFromRetryAfterHeader(err.$response);
					const delay = Math.max(delayFromResponse || 0, delayFromDecider);
					totalDelay += delay;
					await new Promise((resolve) => setTimeout(resolve, delay));
					continue;
				}
				if (!err.$metadata) err.$metadata = {};
				err.$metadata.attempts = attempts;
				err.$metadata.totalRetryDelay = totalDelay;
				throw err;
			}
		}
	};
	var getDelayFromRetryAfterHeader = (response) => {
		if (!HttpResponse.isInstance(response)) return;
		const retryAfterHeaderName = Object.keys(response.headers).find((key) => key.toLowerCase() === "retry-after");
		if (!retryAfterHeaderName) return;
		const retryAfter = response.headers[retryAfterHeaderName];
		const retryAfterSeconds = Number(retryAfter);
		if (!Number.isNaN(retryAfterSeconds)) return Math.min(retryAfterSeconds * 1e3, 2e4);
		const retryAfterDate = new Date(retryAfter);
		return Math.min(retryAfterDate.getTime() - Date.now(), 2e4);
	};
	var AdaptiveRetryStrategy = class extends StandardRetryStrategy {
		rateLimiter;
		constructor(maxAttemptsProvider, options) {
			const { rateLimiter, ...superOptions } = options ?? {};
			super(maxAttemptsProvider, superOptions);
			this.rateLimiter = rateLimiter ?? new DefaultRateLimiter();
			this.mode = RETRY_MODES.ADAPTIVE;
		}
		async retry(next, args) {
			return super.retry(next, args, {
				beforeRequest: async () => {
					return this.rateLimiter.getSendToken();
				},
				afterRequest: (response) => {
					this.rateLimiter.updateClientSendingRate(response);
				}
			});
		}
	};
	var ENV_MAX_ATTEMPTS = "AWS_MAX_ATTEMPTS";
	var CONFIG_MAX_ATTEMPTS = "max_attempts";
	var NODE_MAX_ATTEMPT_CONFIG_OPTIONS = {
		environmentVariableSelector: (env) => {
			const value = env[ENV_MAX_ATTEMPTS];
			if (!value) return void 0;
			const maxAttempt = parseInt(value);
			if (Number.isNaN(maxAttempt)) throw new Error(`Environment variable ${ENV_MAX_ATTEMPTS} mast be a number, got "${value}"`);
			return maxAttempt;
		},
		configFileSelector: (profile) => {
			const value = profile[CONFIG_MAX_ATTEMPTS];
			if (!value) return void 0;
			const maxAttempt = parseInt(value);
			if (Number.isNaN(maxAttempt)) throw new Error(`Shared config file entry ${CONFIG_MAX_ATTEMPTS} mast be a number, got "${value}"`);
			return maxAttempt;
		},
		default: DEFAULT_MAX_ATTEMPTS
	};
	var resolveRetryConfig = (input, defaults) => {
		const { retryStrategy, retryMode } = input;
		const { defaultMaxAttempts = DEFAULT_MAX_ATTEMPTS, defaultBaseDelay = Retry.delay() } = defaults ?? {};
		const maxAttemptsProvider = normalizeProvider(input.maxAttempts ?? defaultMaxAttempts);
		let controller = retryStrategy ? Promise.resolve(retryStrategy) : void 0;
		const getDefault = async () => {
			const maxAttempts = await maxAttemptsProvider();
			if (await normalizeProvider(retryMode)() === RETRY_MODES.ADAPTIVE) return new AdaptiveRetryStrategy$1(maxAttemptsProvider, {
				maxAttempts,
				baseDelay: defaultBaseDelay
			});
			return new StandardRetryStrategy$1({
				maxAttempts,
				baseDelay: defaultBaseDelay
			});
		};
		return Object.assign(input, {
			maxAttempts: maxAttemptsProvider,
			retryStrategy: () => controller ??= getDefault()
		});
	};
	var ENV_RETRY_MODE = "AWS_RETRY_MODE";
	var CONFIG_RETRY_MODE = "retry_mode";
	var NODE_RETRY_MODE_CONFIG_OPTIONS = {
		environmentVariableSelector: (env) => env[ENV_RETRY_MODE],
		configFileSelector: (profile) => profile[CONFIG_RETRY_MODE],
		default: DEFAULT_RETRY_MODE
	};
	var omitRetryHeadersMiddleware = () => (next) => async (args) => {
		const { request } = args;
		if (HttpRequest.isInstance(request)) {
			delete request.headers[INVOCATION_ID_HEADER];
			delete request.headers[REQUEST_HEADER];
		}
		return next(args);
	};
	var omitRetryHeadersMiddlewareOptions = {
		name: "omitRetryHeadersMiddleware",
		tags: [
			"RETRY",
			"HEADERS",
			"OMIT_RETRY_HEADERS"
		],
		relation: "before",
		toMiddleware: "awsAuthMiddleware",
		override: true
	};
	var getOmitRetryHeadersPlugin = (options) => ({ applyToStack: (clientStack) => {
		clientStack.addRelativeTo(omitRetryHeadersMiddleware(), omitRetryHeadersMiddlewareOptions);
	} });
	var retryMiddleware = bindRetryMiddleware(isStreamingPayload);
	var getRetryPlugin = bindGetRetryPlugin(isStreamingPayload);
	exports.AdaptiveRetryStrategy = AdaptiveRetryStrategy$1;
	exports.CONFIG_MAX_ATTEMPTS = CONFIG_MAX_ATTEMPTS;
	exports.CONFIG_RETRY_MODE = CONFIG_RETRY_MODE;
	exports.ConfiguredRetryStrategy = ConfiguredRetryStrategy;
	exports.DEFAULT_MAX_ATTEMPTS = DEFAULT_MAX_ATTEMPTS;
	exports.DEFAULT_RETRY_DELAY_BASE = DEFAULT_RETRY_DELAY_BASE;
	exports.DEFAULT_RETRY_MODE = DEFAULT_RETRY_MODE;
	exports.DefaultRateLimiter = DefaultRateLimiter;
	exports.DeprecatedAdaptiveRetryStrategy = AdaptiveRetryStrategy;
	exports.DeprecatedStandardRetryStrategy = StandardRetryStrategy;
	exports.ENV_MAX_ATTEMPTS = ENV_MAX_ATTEMPTS;
	exports.ENV_RETRY_MODE = ENV_RETRY_MODE;
	exports.INITIAL_RETRY_TOKENS = INITIAL_RETRY_TOKENS;
	exports.INVOCATION_ID_HEADER = INVOCATION_ID_HEADER;
	exports.MAXIMUM_RETRY_DELAY = MAXIMUM_RETRY_DELAY;
	exports.NODE_MAX_ATTEMPT_CONFIG_OPTIONS = NODE_MAX_ATTEMPT_CONFIG_OPTIONS;
	exports.NODE_RETRY_MODE_CONFIG_OPTIONS = NODE_RETRY_MODE_CONFIG_OPTIONS;
	exports.NO_RETRY_INCREMENT = NO_RETRY_INCREMENT;
	exports.REQUEST_HEADER = REQUEST_HEADER;
	exports.RETRY_COST = RETRY_COST;
	exports.RETRY_MODES = RETRY_MODES;
	exports.Retry = Retry;
	exports.StandardRetryStrategy = StandardRetryStrategy$1;
	exports.THROTTLING_RETRY_DELAY_BASE = THROTTLING_RETRY_DELAY_BASE;
	exports.TIMEOUT_RETRY_COST = TIMEOUT_RETRY_COST;
	exports.defaultDelayDecider = defaultDelayDecider;
	exports.defaultRetryDecider = defaultRetryDecider;
	exports.getOmitRetryHeadersPlugin = getOmitRetryHeadersPlugin;
	exports.getRetryAfterHint = getRetryAfterHint;
	exports.getRetryPlugin = getRetryPlugin;
	exports.isBrowserNetworkError = isBrowserNetworkError;
	exports.isClockSkewCorrectedError = isClockSkewCorrectedError;
	exports.isClockSkewError = isClockSkewError;
	exports.isNodeJsHttp2TransientError = isNodeJsHttp2TransientError;
	exports.isRetryableByTrait = isRetryableByTrait;
	exports.isServerError = isServerError;
	exports.isThrottlingError = isThrottlingError;
	exports.isTransientError = isTransientError;
	exports.omitRetryHeadersMiddleware = omitRetryHeadersMiddleware;
	exports.omitRetryHeadersMiddlewareOptions = omitRetryHeadersMiddlewareOptions;
	exports.resolveRetryConfig = resolveRetryConfig;
	exports.retryMiddleware = retryMiddleware;
	exports.retryMiddlewareOptions = retryMiddlewareOptions;
}));
//#endregion
//#region node_modules/@aws/lambda-invoke-store/dist-cjs/invoke-store.js
var require_invoke_store = /* @__PURE__ */ __commonJSMin(((exports) => {
	var PROTECTED_KEYS = {
		REQUEST_ID: Symbol.for("_AWS_LAMBDA_REQUEST_ID"),
		X_RAY_TRACE_ID: Symbol.for("_AWS_LAMBDA_X_RAY_TRACE_ID"),
		TENANT_ID: Symbol.for("_AWS_LAMBDA_TENANT_ID"),
		TRACEPARENT: Symbol.for("_AWS_LAMBDA_TRACEPARENT"),
		TRACESTATE: Symbol.for("_AWS_LAMBDA_TRACESTATE"),
		BAGGAGE: Symbol.for("_AWS_LAMBDA_BAGGAGE")
	};
	var NO_GLOBAL_AWS_LAMBDA = ["true", "1"].includes(process.env?.AWS_LAMBDA_NODEJS_NO_GLOBAL_AWSLAMBDA ?? "");
	if (!NO_GLOBAL_AWS_LAMBDA) globalThis.awslambda = globalThis.awslambda || {};
	var InvokeStoreBase = class {
		static PROTECTED_KEYS = PROTECTED_KEYS;
		isProtectedKey(key) {
			return Object.values(PROTECTED_KEYS).includes(key);
		}
		getRequestId() {
			return this.get(PROTECTED_KEYS.REQUEST_ID) ?? "-";
		}
		getXRayTraceId() {
			return this.get(PROTECTED_KEYS.X_RAY_TRACE_ID);
		}
		getTenantId() {
			return this.get(PROTECTED_KEYS.TENANT_ID);
		}
		getTraceparent() {
			return this.get(PROTECTED_KEYS.TRACEPARENT);
		}
		getTracestate() {
			return this.get(PROTECTED_KEYS.TRACESTATE);
		}
		getBaggage() {
			return this.get(PROTECTED_KEYS.BAGGAGE);
		}
	};
	var InvokeStoreSingle = class extends InvokeStoreBase {
		currentContext;
		getContext() {
			return this.currentContext;
		}
		hasContext() {
			return this.currentContext !== void 0;
		}
		get(key) {
			return this.currentContext?.[key];
		}
		set(key, value) {
			if (this.isProtectedKey(key)) throw new Error(`Cannot modify protected Lambda context field: ${String(key)}`);
			this.currentContext = this.currentContext || {};
			this.currentContext[key] = value;
		}
		run(context, fn) {
			this.currentContext = context;
			return fn();
		}
	};
	var InvokeStoreMulti = class InvokeStoreMulti extends InvokeStoreBase {
		als;
		static async create() {
			const instance = new InvokeStoreMulti();
			instance.als = new (await (import("node:async_hooks"))).AsyncLocalStorage();
			return instance;
		}
		getContext() {
			return this.als.getStore();
		}
		hasContext() {
			return this.als.getStore() !== void 0;
		}
		get(key) {
			return this.als.getStore()?.[key];
		}
		set(key, value) {
			if (this.isProtectedKey(key)) throw new Error(`Cannot modify protected Lambda context field: ${String(key)}`);
			const store = this.als.getStore();
			if (!store) throw new Error("No context available");
			store[key] = value;
		}
		run(context, fn) {
			return this.als.run(context, fn);
		}
	};
	exports.InvokeStore = void 0;
	(function(InvokeStore) {
		let instance = null;
		async function getInstanceAsync(forceInvokeStoreMulti) {
			if (!instance) instance = (async () => {
				const newInstance = forceInvokeStoreMulti === true || "AWS_LAMBDA_MAX_CONCURRENCY" in process.env ? await InvokeStoreMulti.create() : new InvokeStoreSingle();
				if (!NO_GLOBAL_AWS_LAMBDA && globalThis.awslambda?.InvokeStore) return globalThis.awslambda.InvokeStore;
				else if (!NO_GLOBAL_AWS_LAMBDA && globalThis.awslambda) {
					globalThis.awslambda.InvokeStore = newInstance;
					return newInstance;
				} else return newInstance;
			})();
			return instance;
		}
		InvokeStore.getInstanceAsync = getInstanceAsync;
		InvokeStore._testing = process.env.AWS_LAMBDA_BENCHMARK_MODE === "1" ? { reset: () => {
			instance = null;
			if (globalThis.awslambda?.InvokeStore) delete globalThis.awslambda.InvokeStore;
			globalThis.awslambda = { InvokeStore: void 0 };
		} } : void 0;
	})(exports.InvokeStore || (exports.InvokeStore = {}));
	exports.InvokeStoreBase = InvokeStoreBase;
}));
//#endregion
//#region node_modules/@smithy/core/dist-cjs/index.js
var require_dist_cjs = /* @__PURE__ */ __commonJSMin(((exports) => {
	var { getSmithyContext } = require_transport();
	exports.getSmithyContext = getSmithyContext;
	var { HttpRequest } = require_protocols$1();
	var { requestBuilder } = require_protocols$1();
	exports.requestBuilder = requestBuilder;
	var { HttpApiKeyAuthLocation } = (init_dist_es$3(), __toCommonJS(dist_es_exports$5));
	var resolveAuthOptions = (candidateAuthOptions, authSchemePreference) => {
		if (!authSchemePreference || authSchemePreference.length === 0) return candidateAuthOptions;
		const preferredAuthOptions = [];
		for (const preferredSchemeName of authSchemePreference) for (const candidateAuthOption of candidateAuthOptions) if (candidateAuthOption.schemeId.split("#")[1] === preferredSchemeName) preferredAuthOptions.push(candidateAuthOption);
		for (const candidateAuthOption of candidateAuthOptions) if (!preferredAuthOptions.find(({ schemeId }) => schemeId === candidateAuthOption.schemeId)) preferredAuthOptions.push(candidateAuthOption);
		return preferredAuthOptions;
	};
	function convertHttpAuthSchemesToMap(httpAuthSchemes) {
		const map = /* @__PURE__ */ new Map();
		for (const scheme of httpAuthSchemes) map.set(scheme.schemeId, scheme);
		return map;
	}
	var httpAuthSchemeMiddleware = (config, mwOptions) => (next, context) => async (args) => {
		const resolvedOptions = resolveAuthOptions(config.httpAuthSchemeProvider(await mwOptions.httpAuthSchemeParametersProvider(config, context, args.input)), config.authSchemePreference ? await config.authSchemePreference() : []);
		const authSchemes = convertHttpAuthSchemesToMap(config.httpAuthSchemes);
		const smithyContext = getSmithyContext(context);
		const failureReasons = [];
		for (const option of resolvedOptions) {
			const scheme = authSchemes.get(option.schemeId);
			if (!scheme) {
				failureReasons.push(`HttpAuthScheme \`${option.schemeId}\` was not enabled for this service.`);
				continue;
			}
			const identityProvider = scheme.identityProvider(await mwOptions.identityProviderConfigProvider(config));
			if (!identityProvider) {
				failureReasons.push(`HttpAuthScheme \`${option.schemeId}\` did not have an IdentityProvider configured.`);
				continue;
			}
			const { identityProperties = {}, signingProperties = {} } = option.propertiesExtractor?.(config, context) || {};
			option.identityProperties = Object.assign(option.identityProperties || {}, identityProperties);
			option.signingProperties = Object.assign(option.signingProperties || {}, signingProperties);
			smithyContext.selectedHttpAuthScheme = {
				httpAuthOption: option,
				identity: await identityProvider(option.identityProperties),
				signer: scheme.signer
			};
			break;
		}
		if (!smithyContext.selectedHttpAuthScheme) throw new Error(failureReasons.join("\n"));
		return next(args);
	};
	var httpAuthSchemeEndpointRuleSetMiddlewareOptions = {
		step: "serialize",
		tags: ["HTTP_AUTH_SCHEME"],
		name: "httpAuthSchemeMiddleware",
		override: true,
		relation: "before",
		toMiddleware: "endpointV2Middleware"
	};
	var getHttpAuthSchemeEndpointRuleSetPlugin = (config, { httpAuthSchemeParametersProvider, identityProviderConfigProvider }) => ({ applyToStack: (clientStack) => {
		clientStack.addRelativeTo(httpAuthSchemeMiddleware(config, {
			httpAuthSchemeParametersProvider,
			identityProviderConfigProvider
		}), httpAuthSchemeEndpointRuleSetMiddlewareOptions);
	} });
	var httpAuthSchemeMiddlewareOptions = {
		step: "serialize",
		tags: ["HTTP_AUTH_SCHEME"],
		name: "httpAuthSchemeMiddleware",
		override: true,
		relation: "before",
		toMiddleware: "serializerMiddleware"
	};
	var getHttpAuthSchemePlugin = (config, { httpAuthSchemeParametersProvider, identityProviderConfigProvider }) => ({ applyToStack: (clientStack) => {
		clientStack.addRelativeTo(httpAuthSchemeMiddleware(config, {
			httpAuthSchemeParametersProvider,
			identityProviderConfigProvider
		}), httpAuthSchemeMiddlewareOptions);
	} });
	var defaultErrorHandler = (signingProperties) => (error) => {
		throw error;
	};
	var defaultSuccessHandler = (httpResponse, signingProperties) => {};
	var httpSigningMiddleware = (config) => (next, context) => async (args) => {
		if (!HttpRequest.isInstance(args.request)) return next(args);
		const scheme = getSmithyContext(context).selectedHttpAuthScheme;
		if (!scheme) throw new Error(`No HttpAuthScheme was selected: unable to sign request`);
		const { httpAuthOption: { signingProperties = {} }, identity, signer } = scheme;
		const output = await next({
			...args,
			request: await signer.sign(args.request, identity, signingProperties)
		}).catch((signer.errorHandler || defaultErrorHandler)(signingProperties));
		(signer.successHandler || defaultSuccessHandler)(output.response, signingProperties);
		return output;
	};
	var httpSigningMiddlewareOptions = {
		step: "finalizeRequest",
		tags: ["HTTP_SIGNING"],
		name: "httpSigningMiddleware",
		aliases: [
			"apiKeyMiddleware",
			"tokenMiddleware",
			"awsAuthMiddleware"
		],
		override: true,
		relation: "after",
		toMiddleware: "retryMiddleware"
	};
	var getHttpSigningPlugin = (config) => ({ applyToStack: (clientStack) => {
		clientStack.addRelativeTo(httpSigningMiddleware(), httpSigningMiddlewareOptions);
	} });
	var normalizeProvider = (input) => {
		if (typeof input === "function") return input;
		const promisified = Promise.resolve(input);
		return () => promisified;
	};
	var makePagedClientRequest = async (CommandCtor, client, input, withCommand = (_) => _, ...args) => {
		let command = new CommandCtor(input);
		command = withCommand(command) ?? command;
		return await client.send(command, ...args);
	};
	function createPaginator(ClientCtor, CommandCtor, inputTokenName, outputTokenName, pageSizeTokenName) {
		return async function* paginateOperation(config, input, ...additionalArguments) {
			const _input = input;
			let token = config.startingToken ?? _input[inputTokenName];
			let hasNext = true;
			let page;
			while (hasNext) {
				_input[inputTokenName] = token;
				if (pageSizeTokenName) _input[pageSizeTokenName] = _input[pageSizeTokenName] ?? config.pageSize;
				if (config.client instanceof ClientCtor) page = await makePagedClientRequest(CommandCtor, config.client, input, config.withCommand, ...additionalArguments);
				else throw new Error(`Invalid client, expected instance of ${ClientCtor.name}`);
				yield page;
				const prevToken = token;
				token = get(page, outputTokenName);
				hasNext = !!(token && (!config.stopOnSameToken || token !== prevToken));
			}
			return void 0;
		};
	}
	var get = (fromObject, path) => {
		let cursor = fromObject;
		const pathComponents = path.split(".");
		for (const step of pathComponents) {
			if (!cursor || typeof cursor !== "object") return;
			cursor = cursor[step];
		}
		return cursor;
	};
	function setFeature(context, feature, value) {
		if (!context.__smithy_context) context.__smithy_context = { features: {} };
		else if (!context.__smithy_context.features) context.__smithy_context.features = {};
		context.__smithy_context.features[feature] = value;
	}
	var DefaultIdentityProviderConfig = class {
		authSchemes = /* @__PURE__ */ new Map();
		constructor(config) {
			for (const key in config) {
				const value = config[key];
				if (value !== void 0) this.authSchemes.set(key, value);
			}
		}
		getIdentityProvider(schemeId) {
			return this.authSchemes.get(schemeId);
		}
	};
	var HttpApiKeyAuthSigner = class {
		async sign(httpRequest, identity, signingProperties) {
			if (!signingProperties) throw new Error("request could not be signed with `apiKey` since the `name` and `in` signer properties are missing");
			if (!signingProperties.name) throw new Error("request could not be signed with `apiKey` since the `name` signer property is missing");
			if (!signingProperties.in) throw new Error("request could not be signed with `apiKey` since the `in` signer property is missing");
			if (!identity.apiKey) throw new Error("request could not be signed with `apiKey` since the `apiKey` is not defined");
			const clonedRequest = HttpRequest.clone(httpRequest);
			if (signingProperties.in === HttpApiKeyAuthLocation.QUERY) clonedRequest.query[signingProperties.name] = identity.apiKey;
			else if (signingProperties.in === HttpApiKeyAuthLocation.HEADER) clonedRequest.headers[signingProperties.name] = signingProperties.scheme ? `${signingProperties.scheme} ${identity.apiKey}` : identity.apiKey;
			else throw new Error("request can only be signed with `apiKey` locations `query` or `header`, but found: `" + signingProperties.in + "`");
			return clonedRequest;
		}
	};
	var HttpBearerAuthSigner = class {
		async sign(httpRequest, identity, signingProperties) {
			const clonedRequest = HttpRequest.clone(httpRequest);
			if (!identity.token) throw new Error("request could not be signed with `token` since the `token` is not defined");
			clonedRequest.headers["Authorization"] = `Bearer ${identity.token}`;
			return clonedRequest;
		}
	};
	var NoAuthSigner = class {
		async sign(httpRequest, identity, signingProperties) {
			return httpRequest;
		}
	};
	var createIsIdentityExpiredFunction = (expirationMs) => function isIdentityExpired(identity) {
		return doesIdentityRequireRefresh(identity) && identity.expiration.getTime() - Date.now() < expirationMs;
	};
	var EXPIRATION_MS = 3e5;
	var isIdentityExpired = createIsIdentityExpiredFunction(EXPIRATION_MS);
	var doesIdentityRequireRefresh = (identity) => identity.expiration !== void 0;
	var memoizeIdentityProvider = (provider, isExpired, requiresRefresh) => {
		if (provider === void 0) return;
		const normalizedProvider = typeof provider !== "function" ? async () => Promise.resolve(provider) : provider;
		let resolved;
		let pending;
		let hasResult;
		let isConstant = false;
		const coalesceProvider = async (options) => {
			if (!pending) pending = normalizedProvider(options);
			try {
				resolved = await pending;
				hasResult = true;
				isConstant = false;
			} finally {
				pending = void 0;
			}
			return resolved;
		};
		if (isExpired === void 0) return async (options) => {
			if (!hasResult || options?.forceRefresh) resolved = await coalesceProvider(options);
			return resolved;
		};
		return async (options) => {
			if (!hasResult || options?.forceRefresh) resolved = await coalesceProvider(options);
			if (isConstant) return resolved;
			if (!requiresRefresh(resolved)) {
				isConstant = true;
				return resolved;
			}
			if (isExpired(resolved)) {
				await coalesceProvider(options);
				return resolved;
			}
			return resolved;
		};
	};
	exports.DefaultIdentityProviderConfig = DefaultIdentityProviderConfig;
	exports.EXPIRATION_MS = EXPIRATION_MS;
	exports.HttpApiKeyAuthSigner = HttpApiKeyAuthSigner;
	exports.HttpBearerAuthSigner = HttpBearerAuthSigner;
	exports.NoAuthSigner = NoAuthSigner;
	exports.createIsIdentityExpiredFunction = createIsIdentityExpiredFunction;
	exports.createPaginator = createPaginator;
	exports.doesIdentityRequireRefresh = doesIdentityRequireRefresh;
	exports.getHttpAuthSchemeEndpointRuleSetPlugin = getHttpAuthSchemeEndpointRuleSetPlugin;
	exports.getHttpAuthSchemePlugin = getHttpAuthSchemePlugin;
	exports.getHttpSigningPlugin = getHttpSigningPlugin;
	exports.httpAuthSchemeEndpointRuleSetMiddlewareOptions = httpAuthSchemeEndpointRuleSetMiddlewareOptions;
	exports.httpAuthSchemeMiddleware = httpAuthSchemeMiddleware;
	exports.httpAuthSchemeMiddlewareOptions = httpAuthSchemeMiddlewareOptions;
	exports.httpSigningMiddleware = httpSigningMiddleware;
	exports.httpSigningMiddlewareOptions = httpSigningMiddlewareOptions;
	exports.isIdentityExpired = isIdentityExpired;
	exports.memoizeIdentityProvider = memoizeIdentityProvider;
	exports.normalizeProvider = normalizeProvider;
	exports.setFeature = setFeature;
}));
//#endregion
//#region node_modules/bowser/src/constants.js
var BROWSER_ALIASES_MAP, BROWSER_MAP, PLATFORMS_MAP, OS_MAP, ENGINE_MAP;
var init_constants$2 = __esmMin((() => {
	BROWSER_ALIASES_MAP = {
		AmazonBot: "amazonbot",
		"Amazon Silk": "amazon_silk",
		"Android Browser": "android",
		BaiduSpider: "baiduspider",
		Bada: "bada",
		BingCrawler: "bingcrawler",
		Brave: "brave",
		BlackBerry: "blackberry",
		"ChatGPT-User": "chatgpt_user",
		Chrome: "chrome",
		ClaudeBot: "claudebot",
		Chromium: "chromium",
		Diffbot: "diffbot",
		DuckDuckBot: "duckduckbot",
		DuckDuckGo: "duckduckgo",
		Electron: "electron",
		Epiphany: "epiphany",
		FacebookExternalHit: "facebookexternalhit",
		Firefox: "firefox",
		Focus: "focus",
		Generic: "generic",
		"Google Search": "google_search",
		Googlebot: "googlebot",
		GPTBot: "gptbot",
		"Internet Explorer": "ie",
		InternetArchiveCrawler: "internetarchivecrawler",
		"K-Meleon": "k_meleon",
		LibreWolf: "librewolf",
		Linespider: "linespider",
		Maxthon: "maxthon",
		"Meta-ExternalAds": "meta_externalads",
		"Meta-ExternalAgent": "meta_externalagent",
		"Meta-ExternalFetcher": "meta_externalfetcher",
		"Meta-WebIndexer": "meta_webindexer",
		"Microsoft Edge": "edge",
		"MZ Browser": "mz",
		"NAVER Whale Browser": "naver",
		"OAI-SearchBot": "oai_searchbot",
		Omgilibot: "omgilibot",
		Opera: "opera",
		"Opera Coast": "opera_coast",
		"Pale Moon": "pale_moon",
		PerplexityBot: "perplexitybot",
		"Perplexity-User": "perplexity_user",
		PhantomJS: "phantomjs",
		PingdomBot: "pingdombot",
		Puffin: "puffin",
		QQ: "qq",
		QQLite: "qqlite",
		QupZilla: "qupzilla",
		Roku: "roku",
		Safari: "safari",
		Sailfish: "sailfish",
		"Samsung Internet for Android": "samsung_internet",
		SlackBot: "slackbot",
		SeaMonkey: "seamonkey",
		Sleipnir: "sleipnir",
		"Sogou Browser": "sogou",
		Swing: "swing",
		Tizen: "tizen",
		"UC Browser": "uc",
		Vivaldi: "vivaldi",
		"WebOS Browser": "webos",
		WeChat: "wechat",
		YahooSlurp: "yahooslurp",
		"Yandex Browser": "yandex",
		YandexBot: "yandexbot",
		YouBot: "youbot"
	};
	BROWSER_MAP = {
		amazonbot: "AmazonBot",
		amazon_silk: "Amazon Silk",
		android: "Android Browser",
		baiduspider: "BaiduSpider",
		bada: "Bada",
		bingcrawler: "BingCrawler",
		blackberry: "BlackBerry",
		brave: "Brave",
		chatgpt_user: "ChatGPT-User",
		chrome: "Chrome",
		claudebot: "ClaudeBot",
		chromium: "Chromium",
		diffbot: "Diffbot",
		duckduckbot: "DuckDuckBot",
		duckduckgo: "DuckDuckGo",
		edge: "Microsoft Edge",
		electron: "Electron",
		epiphany: "Epiphany",
		facebookexternalhit: "FacebookExternalHit",
		firefox: "Firefox",
		focus: "Focus",
		generic: "Generic",
		google_search: "Google Search",
		googlebot: "Googlebot",
		gptbot: "GPTBot",
		ie: "Internet Explorer",
		internetarchivecrawler: "InternetArchiveCrawler",
		k_meleon: "K-Meleon",
		librewolf: "LibreWolf",
		linespider: "Linespider",
		maxthon: "Maxthon",
		meta_externalads: "Meta-ExternalAds",
		meta_externalagent: "Meta-ExternalAgent",
		meta_externalfetcher: "Meta-ExternalFetcher",
		meta_webindexer: "Meta-WebIndexer",
		mz: "MZ Browser",
		naver: "NAVER Whale Browser",
		oai_searchbot: "OAI-SearchBot",
		omgilibot: "Omgilibot",
		opera: "Opera",
		opera_coast: "Opera Coast",
		pale_moon: "Pale Moon",
		perplexitybot: "PerplexityBot",
		perplexity_user: "Perplexity-User",
		phantomjs: "PhantomJS",
		pingdombot: "PingdomBot",
		puffin: "Puffin",
		qq: "QQ Browser",
		qqlite: "QQ Browser Lite",
		qupzilla: "QupZilla",
		roku: "Roku",
		safari: "Safari",
		sailfish: "Sailfish",
		samsung_internet: "Samsung Internet for Android",
		seamonkey: "SeaMonkey",
		slackbot: "SlackBot",
		sleipnir: "Sleipnir",
		sogou: "Sogou Browser",
		swing: "Swing",
		tizen: "Tizen",
		uc: "UC Browser",
		vivaldi: "Vivaldi",
		webos: "WebOS Browser",
		wechat: "WeChat",
		yahooslurp: "YahooSlurp",
		yandex: "Yandex Browser",
		yandexbot: "YandexBot",
		youbot: "YouBot"
	};
	PLATFORMS_MAP = {
		bot: "bot",
		desktop: "desktop",
		mobile: "mobile",
		tablet: "tablet",
		tv: "tv"
	};
	OS_MAP = {
		Android: "Android",
		Bada: "Bada",
		BlackBerry: "BlackBerry",
		ChromeOS: "Chrome OS",
		HarmonyOS: "HarmonyOS",
		iOS: "iOS",
		Linux: "Linux",
		MacOS: "macOS",
		PlayStation4: "PlayStation 4",
		Roku: "Roku",
		Tizen: "Tizen",
		WebOS: "WebOS",
		Windows: "Windows",
		WindowsPhone: "Windows Phone"
	};
	ENGINE_MAP = {
		Blink: "Blink",
		EdgeHTML: "EdgeHTML",
		Gecko: "Gecko",
		Presto: "Presto",
		Trident: "Trident",
		WebKit: "WebKit"
	};
}));
//#endregion
//#region node_modules/bowser/src/utils.js
var Utils;
var init_utils = __esmMin((() => {
	init_constants$2();
	Utils = class Utils {
		/**
		* Get first matched item for a string
		* @param {RegExp} regexp
		* @param {String} ua
		* @return {Array|{index: number, input: string}|*|boolean|string}
		*/
		static getFirstMatch(regexp, ua) {
			const match = ua.match(regexp);
			return match && match.length > 0 && match[1] || "";
		}
		/**
		* Get second matched item for a string
		* @param regexp
		* @param {String} ua
		* @return {Array|{index: number, input: string}|*|boolean|string}
		*/
		static getSecondMatch(regexp, ua) {
			const match = ua.match(regexp);
			return match && match.length > 1 && match[2] || "";
		}
		/**
		* Match a regexp and return a constant or undefined
		* @param {RegExp} regexp
		* @param {String} ua
		* @param {*} _const Any const that will be returned if regexp matches the string
		* @return {*}
		*/
		static matchAndReturnConst(regexp, ua, _const) {
			if (regexp.test(ua)) return _const;
		}
		static getWindowsVersionName(version) {
			switch (version) {
				case "NT": return "NT";
				case "XP": return "XP";
				case "NT 5.0": return "2000";
				case "NT 5.1": return "XP";
				case "NT 5.2": return "2003";
				case "NT 6.0": return "Vista";
				case "NT 6.1": return "7";
				case "NT 6.2": return "8";
				case "NT 6.3": return "8.1";
				case "NT 10.0": return "10";
				default: return;
			}
		}
		/**
		* Get macOS version name
		*    10.5 - Leopard
		*    10.6 - Snow Leopard
		*    10.7 - Lion
		*    10.8 - Mountain Lion
		*    10.9 - Mavericks
		*    10.10 - Yosemite
		*    10.11 - El Capitan
		*    10.12 - Sierra
		*    10.13 - High Sierra
		*    10.14 - Mojave
		*    10.15 - Catalina
		*    11 - Big Sur
		*    12 - Monterey
		*    13 - Ventura
		*    14 - Sonoma
		*    15 - Sequoia
		*
		* @example
		*   getMacOSVersionName("10.14") // 'Mojave'
		*
		* @param  {string} version
		* @return {string} versionName
		*/
		static getMacOSVersionName(version) {
			const v = version.split(".").splice(0, 2).map((s) => parseInt(s, 10) || 0);
			v.push(0);
			const major = v[0];
			const minor = v[1];
			if (major === 10) switch (minor) {
				case 5: return "Leopard";
				case 6: return "Snow Leopard";
				case 7: return "Lion";
				case 8: return "Mountain Lion";
				case 9: return "Mavericks";
				case 10: return "Yosemite";
				case 11: return "El Capitan";
				case 12: return "Sierra";
				case 13: return "High Sierra";
				case 14: return "Mojave";
				case 15: return "Catalina";
				default: return;
			}
			switch (major) {
				case 11: return "Big Sur";
				case 12: return "Monterey";
				case 13: return "Ventura";
				case 14: return "Sonoma";
				case 15: return "Sequoia";
				default: return;
			}
		}
		/**
		* Get Android version name
		*    1.5 - Cupcake
		*    1.6 - Donut
		*    2.0 - Eclair
		*    2.1 - Eclair
		*    2.2 - Froyo
		*    2.x - Gingerbread
		*    3.x - Honeycomb
		*    4.0 - Ice Cream Sandwich
		*    4.1 - Jelly Bean
		*    4.4 - KitKat
		*    5.x - Lollipop
		*    6.x - Marshmallow
		*    7.x - Nougat
		*    8.x - Oreo
		*    9.x - Pie
		*
		* @example
		*   getAndroidVersionName("7.0") // 'Nougat'
		*
		* @param  {string} version
		* @return {string} versionName
		*/
		static getAndroidVersionName(version) {
			const v = version.split(".").splice(0, 2).map((s) => parseInt(s, 10) || 0);
			v.push(0);
			if (v[0] === 1 && v[1] < 5) return void 0;
			if (v[0] === 1 && v[1] < 6) return "Cupcake";
			if (v[0] === 1 && v[1] >= 6) return "Donut";
			if (v[0] === 2 && v[1] < 2) return "Eclair";
			if (v[0] === 2 && v[1] === 2) return "Froyo";
			if (v[0] === 2 && v[1] > 2) return "Gingerbread";
			if (v[0] === 3) return "Honeycomb";
			if (v[0] === 4 && v[1] < 1) return "Ice Cream Sandwich";
			if (v[0] === 4 && v[1] < 4) return "Jelly Bean";
			if (v[0] === 4 && v[1] >= 4) return "KitKat";
			if (v[0] === 5) return "Lollipop";
			if (v[0] === 6) return "Marshmallow";
			if (v[0] === 7) return "Nougat";
			if (v[0] === 8) return "Oreo";
			if (v[0] === 9) return "Pie";
		}
		/**
		* Get version precisions count
		*
		* @example
		*   getVersionPrecision("1.10.3") // 3
		*
		* @param  {string} version
		* @return {number}
		*/
		static getVersionPrecision(version) {
			return version.split(".").length;
		}
		/**
		* Calculate browser version weight
		*
		* @example
		*   compareVersions('1.10.2.1',  '1.8.2.1.90')    // 1
		*   compareVersions('1.010.2.1', '1.09.2.1.90');  // 1
		*   compareVersions('1.10.2.1',  '1.10.2.1');     // 0
		*   compareVersions('1.10.2.1',  '1.0800.2');     // -1
		*   compareVersions('1.10.2.1',  '1.10',  true);  // 0
		*
		* @param {String} versionA versions versions to compare
		* @param {String} versionB versions versions to compare
		* @param {boolean} [isLoose] enable loose comparison
		* @return {Number} comparison result: -1 when versionA is lower,
		* 1 when versionA is bigger, 0 when both equal
		*/
		static compareVersions(versionA, versionB, isLoose = false) {
			const versionAPrecision = Utils.getVersionPrecision(versionA);
			const versionBPrecision = Utils.getVersionPrecision(versionB);
			let precision = Math.max(versionAPrecision, versionBPrecision);
			let lastPrecision = 0;
			const chunks = Utils.map([versionA, versionB], (version) => {
				const delta = precision - Utils.getVersionPrecision(version);
				const _version = version + new Array(delta + 1).join(".0");
				return Utils.map(_version.split("."), (chunk) => new Array(20 - chunk.length).join("0") + chunk).reverse();
			});
			if (isLoose) lastPrecision = precision - Math.min(versionAPrecision, versionBPrecision);
			precision -= 1;
			while (precision >= lastPrecision) {
				if (chunks[0][precision] > chunks[1][precision]) return 1;
				if (chunks[0][precision] === chunks[1][precision]) {
					if (precision === lastPrecision) return 0;
					precision -= 1;
				} else if (chunks[0][precision] < chunks[1][precision]) return -1;
			}
		}
		/**
		* Array::map polyfill
		*
		* @param  {Array} arr
		* @param  {Function} iterator
		* @return {Array}
		*/
		static map(arr, iterator) {
			const result = [];
			let i;
			if (Array.prototype.map) return Array.prototype.map.call(arr, iterator);
			for (i = 0; i < arr.length; i += 1) result.push(iterator(arr[i]));
			return result;
		}
		/**
		* Array::find polyfill
		*
		* @param  {Array} arr
		* @param  {Function} predicate
		* @return {Array}
		*/
		static find(arr, predicate) {
			let i;
			let l;
			if (Array.prototype.find) return Array.prototype.find.call(arr, predicate);
			for (i = 0, l = arr.length; i < l; i += 1) {
				const value = arr[i];
				if (predicate(value, i)) return value;
			}
		}
		/**
		* Object::assign polyfill
		*
		* @param  {Object} obj
		* @param  {Object} ...objs
		* @return {Object}
		*/
		static assign(obj, ...assigners) {
			const result = obj;
			let i;
			let l;
			if (Object.assign) return Object.assign(obj, ...assigners);
			for (i = 0, l = assigners.length; i < l; i += 1) {
				const assigner = assigners[i];
				if (typeof assigner === "object" && assigner !== null) Object.keys(assigner).forEach((key) => {
					result[key] = assigner[key];
				});
			}
			return obj;
		}
		/**
		* Get short version/alias for a browser name
		*
		* @example
		*   getBrowserAlias('Microsoft Edge') // edge
		*
		* @param  {string} browserName
		* @return {string}
		*/
		static getBrowserAlias(browserName) {
			return BROWSER_ALIASES_MAP[browserName];
		}
		/**
		* Get browser name for a short version/alias
		*
		* @example
		*   getBrowserTypeByAlias('edge') // Microsoft Edge
		*
		* @param  {string} browserAlias
		* @return {string}
		*/
		static getBrowserTypeByAlias(browserAlias) {
			return BROWSER_MAP[browserAlias] || "";
		}
	};
}));
//#endregion
//#region node_modules/bowser/src/parser-browsers.js
var commonVersionIdentifier, browsersList;
var init_parser_browsers = __esmMin((() => {
	init_utils();
	commonVersionIdentifier = /version\/(\d+(\.?_?\d+)+)/i;
	browsersList = [
		{
			test: [/gptbot/i],
			describe(ua) {
				const browser = { name: "GPTBot" };
				const version = Utils.getFirstMatch(/gptbot\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/chatgpt-user/i],
			describe(ua) {
				const browser = { name: "ChatGPT-User" };
				const version = Utils.getFirstMatch(/chatgpt-user\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/oai-searchbot/i],
			describe(ua) {
				const browser = { name: "OAI-SearchBot" };
				const version = Utils.getFirstMatch(/oai-searchbot\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [
				/claudebot/i,
				/claude-web/i,
				/claude-user/i,
				/claude-searchbot/i
			],
			describe(ua) {
				const browser = { name: "ClaudeBot" };
				const version = Utils.getFirstMatch(/(?:claudebot|claude-web|claude-user|claude-searchbot)\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/omgilibot/i, /webzio-extended/i],
			describe(ua) {
				const browser = { name: "Omgilibot" };
				const version = Utils.getFirstMatch(/(?:omgilibot|webzio-extended)\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/diffbot/i],
			describe(ua) {
				const browser = { name: "Diffbot" };
				const version = Utils.getFirstMatch(/diffbot\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/perplexitybot/i],
			describe(ua) {
				const browser = { name: "PerplexityBot" };
				const version = Utils.getFirstMatch(/perplexitybot\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/perplexity-user/i],
			describe(ua) {
				const browser = { name: "Perplexity-User" };
				const version = Utils.getFirstMatch(/perplexity-user\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/youbot/i],
			describe(ua) {
				const browser = { name: "YouBot" };
				const version = Utils.getFirstMatch(/youbot\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/meta-webindexer/i],
			describe(ua) {
				const browser = { name: "Meta-WebIndexer" };
				const version = Utils.getFirstMatch(/meta-webindexer\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/meta-externalads/i],
			describe(ua) {
				const browser = { name: "Meta-ExternalAds" };
				const version = Utils.getFirstMatch(/meta-externalads\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/meta-externalagent/i],
			describe(ua) {
				const browser = { name: "Meta-ExternalAgent" };
				const version = Utils.getFirstMatch(/meta-externalagent\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/meta-externalfetcher/i],
			describe(ua) {
				const browser = { name: "Meta-ExternalFetcher" };
				const version = Utils.getFirstMatch(/meta-externalfetcher\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/googlebot/i],
			describe(ua) {
				const browser = { name: "Googlebot" };
				const version = Utils.getFirstMatch(/googlebot\/(\d+(\.\d+))/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/linespider/i],
			describe(ua) {
				const browser = { name: "Linespider" };
				const version = Utils.getFirstMatch(/(?:linespider)(?:-[-\w]+)?[\s/](\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/amazonbot/i],
			describe(ua) {
				const browser = { name: "AmazonBot" };
				const version = Utils.getFirstMatch(/amazonbot\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/bingbot/i],
			describe(ua) {
				const browser = { name: "BingCrawler" };
				const version = Utils.getFirstMatch(/bingbot\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/baiduspider/i],
			describe(ua) {
				const browser = { name: "BaiduSpider" };
				const version = Utils.getFirstMatch(/baiduspider\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/duckduckbot/i],
			describe(ua) {
				const browser = { name: "DuckDuckBot" };
				const version = Utils.getFirstMatch(/duckduckbot\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/ia_archiver/i],
			describe(ua) {
				const browser = { name: "InternetArchiveCrawler" };
				const version = Utils.getFirstMatch(/ia_archiver\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/facebookexternalhit/i, /facebookcatalog/i],
			describe() {
				return { name: "FacebookExternalHit" };
			}
		},
		{
			test: [/slackbot/i, /slack-imgProxy/i],
			describe(ua) {
				const browser = { name: "SlackBot" };
				const version = Utils.getFirstMatch(/(?:slackbot|slack-imgproxy)(?:-[-\w]+)?[\s/](\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/yahoo!?[\s/]*slurp/i],
			describe() {
				return { name: "YahooSlurp" };
			}
		},
		{
			test: [/yandexbot/i, /yandexmobilebot/i],
			describe() {
				return { name: "YandexBot" };
			}
		},
		{
			test: [/pingdom/i],
			describe() {
				return { name: "PingdomBot" };
			}
		},
		{
			test: [/opera/i],
			describe(ua) {
				const browser = { name: "Opera" };
				const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:opera)[\s/](\d+(\.?_?\d+)+)/i, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/opr\/|opios/i],
			describe(ua) {
				const browser = { name: "Opera" };
				const version = Utils.getFirstMatch(/(?:opr|opios)[\s/](\S+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/SamsungBrowser/i],
			describe(ua) {
				const browser = { name: "Samsung Internet for Android" };
				const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:SamsungBrowser)[\s/](\d+(\.?_?\d+)+)/i, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/Whale/i],
			describe(ua) {
				const browser = { name: "NAVER Whale Browser" };
				const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:whale)[\s/](\d+(?:\.\d+)+)/i, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/PaleMoon/i],
			describe(ua) {
				const browser = { name: "Pale Moon" };
				const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:PaleMoon)[\s/](\d+(?:\.\d+)+)/i, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/MZBrowser/i],
			describe(ua) {
				const browser = { name: "MZ Browser" };
				const version = Utils.getFirstMatch(/(?:MZBrowser)[\s/](\d+(?:\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/focus/i],
			describe(ua) {
				const browser = { name: "Focus" };
				const version = Utils.getFirstMatch(/(?:focus)[\s/](\d+(?:\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/swing/i],
			describe(ua) {
				const browser = { name: "Swing" };
				const version = Utils.getFirstMatch(/(?:swing)[\s/](\d+(?:\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/coast/i],
			describe(ua) {
				const browser = { name: "Opera Coast" };
				const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:coast)[\s/](\d+(\.?_?\d+)+)/i, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/opt\/\d+(?:.?_?\d+)+/i],
			describe(ua) {
				const browser = { name: "Opera Touch" };
				const version = Utils.getFirstMatch(/(?:opt)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/yabrowser/i],
			describe(ua) {
				const browser = { name: "Yandex Browser" };
				const version = Utils.getFirstMatch(/(?:yabrowser)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/ucbrowser/i],
			describe(ua) {
				const browser = { name: "UC Browser" };
				const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:ucbrowser)[\s/](\d+(\.?_?\d+)+)/i, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/Maxthon|mxios/i],
			describe(ua) {
				const browser = { name: "Maxthon" };
				const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:Maxthon|mxios)[\s/](\d+(\.?_?\d+)+)/i, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/epiphany/i],
			describe(ua) {
				const browser = { name: "Epiphany" };
				const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:epiphany)[\s/](\d+(\.?_?\d+)+)/i, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/puffin/i],
			describe(ua) {
				const browser = { name: "Puffin" };
				const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:puffin)[\s/](\d+(\.?_?\d+)+)/i, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/sleipnir/i],
			describe(ua) {
				const browser = { name: "Sleipnir" };
				const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:sleipnir)[\s/](\d+(\.?_?\d+)+)/i, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/k-meleon/i],
			describe(ua) {
				const browser = { name: "K-Meleon" };
				const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:k-meleon)[\s/](\d+(\.?_?\d+)+)/i, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/micromessenger/i],
			describe(ua) {
				const browser = { name: "WeChat" };
				const version = Utils.getFirstMatch(/(?:micromessenger)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/qqbrowser/i],
			describe(ua) {
				const browser = { name: /qqbrowserlite/i.test(ua) ? "QQ Browser Lite" : "QQ Browser" };
				const version = Utils.getFirstMatch(/(?:qqbrowserlite|qqbrowser)[/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/msie|trident/i],
			describe(ua) {
				const browser = { name: "Internet Explorer" };
				const version = Utils.getFirstMatch(/(?:msie |rv:)(\d+(\.?_?\d+)+)/i, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/\sedg\//i],
			describe(ua) {
				const browser = { name: "Microsoft Edge" };
				const version = Utils.getFirstMatch(/\sedg\/(\d+(\.?_?\d+)+)/i, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/edg([ea]|ios)/i],
			describe(ua) {
				const browser = { name: "Microsoft Edge" };
				const version = Utils.getSecondMatch(/edg([ea]|ios)\/(\d+(\.?_?\d+)+)/i, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/vivaldi/i],
			describe(ua) {
				const browser = { name: "Vivaldi" };
				const version = Utils.getFirstMatch(/vivaldi\/(\d+(\.?_?\d+)+)/i, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/seamonkey/i],
			describe(ua) {
				const browser = { name: "SeaMonkey" };
				const version = Utils.getFirstMatch(/seamonkey\/(\d+(\.?_?\d+)+)/i, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/sailfish/i],
			describe(ua) {
				const browser = { name: "Sailfish" };
				const version = Utils.getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/silk/i],
			describe(ua) {
				const browser = { name: "Amazon Silk" };
				const version = Utils.getFirstMatch(/silk\/(\d+(\.?_?\d+)+)/i, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/phantom/i],
			describe(ua) {
				const browser = { name: "PhantomJS" };
				const version = Utils.getFirstMatch(/phantomjs\/(\d+(\.?_?\d+)+)/i, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/slimerjs/i],
			describe(ua) {
				const browser = { name: "SlimerJS" };
				const version = Utils.getFirstMatch(/slimerjs\/(\d+(\.?_?\d+)+)/i, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
			describe(ua) {
				const browser = { name: "BlackBerry" };
				const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/blackberry[\d]+\/(\d+(\.?_?\d+)+)/i, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/(web|hpw)[o0]s/i],
			describe(ua) {
				const browser = { name: "WebOS Browser" };
				const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/w(?:eb)?[o0]sbrowser\/(\d+(\.?_?\d+)+)/i, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/bada/i],
			describe(ua) {
				const browser = { name: "Bada" };
				const version = Utils.getFirstMatch(/dolfin\/(\d+(\.?_?\d+)+)/i, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/tizen/i],
			describe(ua) {
				const browser = { name: "Tizen" };
				const version = Utils.getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/qupzilla/i],
			describe(ua) {
				const browser = { name: "QupZilla" };
				const version = Utils.getFirstMatch(/(?:qupzilla)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/librewolf/i],
			describe(ua) {
				const browser = { name: "LibreWolf" };
				const version = Utils.getFirstMatch(/(?:librewolf)[\s/](\d+(\.?_?\d+)+)/i, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/firefox|iceweasel|fxios/i],
			describe(ua) {
				const browser = { name: "Firefox" };
				const version = Utils.getFirstMatch(/(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/electron/i],
			describe(ua) {
				const browser = { name: "Electron" };
				const version = Utils.getFirstMatch(/(?:electron)\/(\d+(\.?_?\d+)+)/i, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [
				/sogoumobilebrowser/i,
				/metasr/i,
				/se 2\.[x]/i
			],
			describe(ua) {
				const browser = { name: "Sogou Browser" };
				const sogouMobileVersion = Utils.getFirstMatch(/(?:sogoumobilebrowser)[\s/](\d+(\.?_?\d+)+)/i, ua);
				const chromiumVersion = Utils.getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i, ua);
				const seVersion = Utils.getFirstMatch(/se ([\d.]+)x/i, ua);
				const version = sogouMobileVersion || chromiumVersion || seVersion;
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/MiuiBrowser/i],
			describe(ua) {
				const browser = { name: "Miui" };
				const version = Utils.getFirstMatch(/(?:MiuiBrowser)[\s/](\d+(\.?_?\d+)+)/i, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test(parser) {
				if (parser.hasBrand("DuckDuckGo")) return true;
				return parser.test(/\sDdg\/[\d.]+$/i);
			},
			describe(ua, parser) {
				const browser = { name: "DuckDuckGo" };
				if (parser) {
					const hintsVersion = parser.getBrandVersion("DuckDuckGo");
					if (hintsVersion) {
						browser.version = hintsVersion;
						return browser;
					}
				}
				const uaVersion = Utils.getFirstMatch(/\sDdg\/([\d.]+)$/i, ua);
				if (uaVersion) browser.version = uaVersion;
				return browser;
			}
		},
		{
			test(parser) {
				return parser.hasBrand("Brave");
			},
			describe(ua, parser) {
				const browser = { name: "Brave" };
				if (parser) {
					const hintsVersion = parser.getBrandVersion("Brave");
					if (hintsVersion) {
						browser.version = hintsVersion;
						return browser;
					}
				}
				return browser;
			}
		},
		{
			test: [/chromium/i],
			describe(ua) {
				const browser = { name: "Chromium" };
				const version = Utils.getFirstMatch(/(?:chromium)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/chrome|crios|crmo/i],
			describe(ua) {
				const browser = { name: "Chrome" };
				const version = Utils.getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/GSA/i],
			describe(ua) {
				const browser = { name: "Google Search" };
				const version = Utils.getFirstMatch(/(?:GSA)\/(\d+(\.?_?\d+)+)/i, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test(parser) {
				const notLikeAndroid = !parser.test(/like android/i);
				const butAndroid = parser.test(/android/i);
				return notLikeAndroid && butAndroid;
			},
			describe(ua) {
				const browser = { name: "Android Browser" };
				const version = Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/playstation 4/i],
			describe(ua) {
				const browser = { name: "PlayStation 4" };
				const version = Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/safari|applewebkit/i],
			describe(ua) {
				const browser = { name: "Safari" };
				const version = Utils.getFirstMatch(commonVersionIdentifier, ua);
				if (version) browser.version = version;
				return browser;
			}
		},
		{
			test: [/.*/i],
			describe(ua) {
				const regexp = ua.search("\\(") !== -1 ? /^(.*)\/(.*)[ \t]\((.*)/ : /^(.*)\/(.*) /;
				return {
					name: Utils.getFirstMatch(regexp, ua),
					version: Utils.getSecondMatch(regexp, ua)
				};
			}
		}
	];
}));
//#endregion
//#region node_modules/bowser/src/parser-os.js
var parser_os_default;
var init_parser_os = __esmMin((() => {
	init_utils();
	init_constants$2();
	parser_os_default = [
		{
			test: [/Roku\/DVP/],
			describe(ua) {
				const version = Utils.getFirstMatch(/Roku\/DVP-(\d+\.\d+)/i, ua);
				return {
					name: OS_MAP.Roku,
					version
				};
			}
		},
		{
			test: [/windows phone/i],
			describe(ua) {
				const version = Utils.getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i, ua);
				return {
					name: OS_MAP.WindowsPhone,
					version
				};
			}
		},
		{
			test: [/windows /i],
			describe(ua) {
				const version = Utils.getFirstMatch(/Windows ((NT|XP)( \d\d?.\d)?)/i, ua);
				const versionName = Utils.getWindowsVersionName(version);
				return {
					name: OS_MAP.Windows,
					version,
					versionName
				};
			}
		},
		{
			test: [/Macintosh(.*?) FxiOS(.*?)\//],
			describe(ua) {
				const result = { name: OS_MAP.iOS };
				const version = Utils.getSecondMatch(/(Version\/)(\d[\d.]+)/, ua);
				if (version) result.version = version;
				return result;
			}
		},
		{
			test: [/macintosh/i],
			describe(ua) {
				const version = Utils.getFirstMatch(/mac os x (\d+(\.?_?\d+)+)/i, ua).replace(/[_\s]/g, ".");
				const versionName = Utils.getMacOSVersionName(version);
				const os = {
					name: OS_MAP.MacOS,
					version
				};
				if (versionName) os.versionName = versionName;
				return os;
			}
		},
		{
			test: [/(ipod|iphone|ipad)/i],
			describe(ua) {
				const version = Utils.getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i, ua).replace(/[_\s]/g, ".");
				return {
					name: OS_MAP.iOS,
					version
				};
			}
		},
		{
			test: [/OpenHarmony/i],
			describe(ua) {
				const version = Utils.getFirstMatch(/OpenHarmony\s+(\d+(\.\d+)*)/i, ua);
				return {
					name: OS_MAP.HarmonyOS,
					version
				};
			}
		},
		{
			test(parser) {
				const notLikeAndroid = !parser.test(/like android/i);
				const butAndroid = parser.test(/android/i);
				return notLikeAndroid && butAndroid;
			},
			describe(ua) {
				const version = Utils.getFirstMatch(/android[\s/-](\d+(\.\d+)*)/i, ua);
				const versionName = Utils.getAndroidVersionName(version);
				const os = {
					name: OS_MAP.Android,
					version
				};
				if (versionName) os.versionName = versionName;
				return os;
			}
		},
		{
			test: [/(web|hpw)[o0]s/i],
			describe(ua) {
				const version = Utils.getFirstMatch(/(?:web|hpw)[o0]s\/(\d+(\.\d+)*)/i, ua);
				const os = { name: OS_MAP.WebOS };
				if (version && version.length) os.version = version;
				return os;
			}
		},
		{
			test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
			describe(ua) {
				const version = Utils.getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(/blackberry\d+\/(\d+([_\s]\d+)*)/i, ua) || Utils.getFirstMatch(/\bbb(\d+)/i, ua);
				return {
					name: OS_MAP.BlackBerry,
					version
				};
			}
		},
		{
			test: [/bada/i],
			describe(ua) {
				const version = Utils.getFirstMatch(/bada\/(\d+(\.\d+)*)/i, ua);
				return {
					name: OS_MAP.Bada,
					version
				};
			}
		},
		{
			test: [/tizen/i],
			describe(ua) {
				const version = Utils.getFirstMatch(/tizen[/\s](\d+(\.\d+)*)/i, ua);
				return {
					name: OS_MAP.Tizen,
					version
				};
			}
		},
		{
			test: [/linux/i],
			describe() {
				return { name: OS_MAP.Linux };
			}
		},
		{
			test: [/CrOS/],
			describe() {
				return { name: OS_MAP.ChromeOS };
			}
		},
		{
			test: [/PlayStation 4/],
			describe(ua) {
				const version = Utils.getFirstMatch(/PlayStation 4[/\s](\d+(\.\d+)*)/i, ua);
				return {
					name: OS_MAP.PlayStation4,
					version
				};
			}
		}
	];
}));
//#endregion
//#region node_modules/bowser/src/parser-platforms.js
var parser_platforms_default;
var init_parser_platforms = __esmMin((() => {
	init_utils();
	init_constants$2();
	parser_platforms_default = [
		{
			test: [/googlebot/i],
			describe() {
				return {
					type: PLATFORMS_MAP.bot,
					vendor: "Google"
				};
			}
		},
		{
			test: [/linespider/i],
			describe() {
				return {
					type: PLATFORMS_MAP.bot,
					vendor: "Line"
				};
			}
		},
		{
			test: [/amazonbot/i],
			describe() {
				return {
					type: PLATFORMS_MAP.bot,
					vendor: "Amazon"
				};
			}
		},
		{
			test: [/gptbot/i],
			describe() {
				return {
					type: PLATFORMS_MAP.bot,
					vendor: "OpenAI"
				};
			}
		},
		{
			test: [/chatgpt-user/i],
			describe() {
				return {
					type: PLATFORMS_MAP.bot,
					vendor: "OpenAI"
				};
			}
		},
		{
			test: [/oai-searchbot/i],
			describe() {
				return {
					type: PLATFORMS_MAP.bot,
					vendor: "OpenAI"
				};
			}
		},
		{
			test: [/baiduspider/i],
			describe() {
				return {
					type: PLATFORMS_MAP.bot,
					vendor: "Baidu"
				};
			}
		},
		{
			test: [/bingbot/i],
			describe() {
				return {
					type: PLATFORMS_MAP.bot,
					vendor: "Bing"
				};
			}
		},
		{
			test: [/duckduckbot/i],
			describe() {
				return {
					type: PLATFORMS_MAP.bot,
					vendor: "DuckDuckGo"
				};
			}
		},
		{
			test: [
				/claudebot/i,
				/claude-web/i,
				/claude-user/i,
				/claude-searchbot/i
			],
			describe() {
				return {
					type: PLATFORMS_MAP.bot,
					vendor: "Anthropic"
				};
			}
		},
		{
			test: [/omgilibot/i, /webzio-extended/i],
			describe() {
				return {
					type: PLATFORMS_MAP.bot,
					vendor: "Webz.io"
				};
			}
		},
		{
			test: [/diffbot/i],
			describe() {
				return {
					type: PLATFORMS_MAP.bot,
					vendor: "Diffbot"
				};
			}
		},
		{
			test: [/perplexitybot/i],
			describe() {
				return {
					type: PLATFORMS_MAP.bot,
					vendor: "Perplexity AI"
				};
			}
		},
		{
			test: [/perplexity-user/i],
			describe() {
				return {
					type: PLATFORMS_MAP.bot,
					vendor: "Perplexity AI"
				};
			}
		},
		{
			test: [/youbot/i],
			describe() {
				return {
					type: PLATFORMS_MAP.bot,
					vendor: "You.com"
				};
			}
		},
		{
			test: [/ia_archiver/i],
			describe() {
				return {
					type: PLATFORMS_MAP.bot,
					vendor: "Internet Archive"
				};
			}
		},
		{
			test: [/meta-webindexer/i],
			describe() {
				return {
					type: PLATFORMS_MAP.bot,
					vendor: "Meta"
				};
			}
		},
		{
			test: [/meta-externalads/i],
			describe() {
				return {
					type: PLATFORMS_MAP.bot,
					vendor: "Meta"
				};
			}
		},
		{
			test: [/meta-externalagent/i],
			describe() {
				return {
					type: PLATFORMS_MAP.bot,
					vendor: "Meta"
				};
			}
		},
		{
			test: [/meta-externalfetcher/i],
			describe() {
				return {
					type: PLATFORMS_MAP.bot,
					vendor: "Meta"
				};
			}
		},
		{
			test: [/facebookexternalhit/i, /facebookcatalog/i],
			describe() {
				return {
					type: PLATFORMS_MAP.bot,
					vendor: "Meta"
				};
			}
		},
		{
			test: [/slackbot/i, /slack-imgProxy/i],
			describe() {
				return {
					type: PLATFORMS_MAP.bot,
					vendor: "Slack"
				};
			}
		},
		{
			test: [/yahoo/i],
			describe() {
				return {
					type: PLATFORMS_MAP.bot,
					vendor: "Yahoo"
				};
			}
		},
		{
			test: [/yandexbot/i, /yandexmobilebot/i],
			describe() {
				return {
					type: PLATFORMS_MAP.bot,
					vendor: "Yandex"
				};
			}
		},
		{
			test: [/pingdom/i],
			describe() {
				return {
					type: PLATFORMS_MAP.bot,
					vendor: "Pingdom"
				};
			}
		},
		{
			test: [/huawei/i],
			describe(ua) {
				const model = Utils.getFirstMatch(/(can-l01)/i, ua) && "Nova";
				const platform = {
					type: PLATFORMS_MAP.mobile,
					vendor: "Huawei"
				};
				if (model) platform.model = model;
				return platform;
			}
		},
		{
			test: [/nexus\s*(?:7|8|9|10).*/i],
			describe() {
				return {
					type: PLATFORMS_MAP.tablet,
					vendor: "Nexus"
				};
			}
		},
		{
			test: [/ipad/i],
			describe() {
				return {
					type: PLATFORMS_MAP.tablet,
					vendor: "Apple",
					model: "iPad"
				};
			}
		},
		{
			test: [/Macintosh(.*?) FxiOS(.*?)\//],
			describe() {
				return {
					type: PLATFORMS_MAP.tablet,
					vendor: "Apple",
					model: "iPad"
				};
			}
		},
		{
			test: [/kftt build/i],
			describe() {
				return {
					type: PLATFORMS_MAP.tablet,
					vendor: "Amazon",
					model: "Kindle Fire HD 7"
				};
			}
		},
		{
			test: [/silk/i],
			describe() {
				return {
					type: PLATFORMS_MAP.tablet,
					vendor: "Amazon"
				};
			}
		},
		{
			test: [/tablet(?! pc)/i],
			describe() {
				return { type: PLATFORMS_MAP.tablet };
			}
		},
		{
			test(parser) {
				const iDevice = parser.test(/ipod|iphone/i);
				const likeIDevice = parser.test(/like (ipod|iphone)/i);
				return iDevice && !likeIDevice;
			},
			describe(ua) {
				const model = Utils.getFirstMatch(/(ipod|iphone)/i, ua);
				return {
					type: PLATFORMS_MAP.mobile,
					vendor: "Apple",
					model
				};
			}
		},
		{
			test: [/nexus\s*[0-6].*/i, /galaxy nexus/i],
			describe() {
				return {
					type: PLATFORMS_MAP.mobile,
					vendor: "Nexus"
				};
			}
		},
		{
			test: [/Nokia/i],
			describe(ua) {
				const model = Utils.getFirstMatch(/Nokia\s+([0-9]+(\.[0-9]+)?)/i, ua);
				const platform = {
					type: PLATFORMS_MAP.mobile,
					vendor: "Nokia"
				};
				if (model) platform.model = model;
				return platform;
			}
		},
		{
			test: [/[^-]mobi/i],
			describe() {
				return { type: PLATFORMS_MAP.mobile };
			}
		},
		{
			test(parser) {
				return parser.getBrowserName(true) === "blackberry";
			},
			describe() {
				return {
					type: PLATFORMS_MAP.mobile,
					vendor: "BlackBerry"
				};
			}
		},
		{
			test(parser) {
				return parser.getBrowserName(true) === "bada";
			},
			describe() {
				return { type: PLATFORMS_MAP.mobile };
			}
		},
		{
			test(parser) {
				return parser.getBrowserName() === "windows phone";
			},
			describe() {
				return {
					type: PLATFORMS_MAP.mobile,
					vendor: "Microsoft"
				};
			}
		},
		{
			test(parser) {
				const osMajorVersion = Number(String(parser.getOSVersion()).split(".")[0]);
				return parser.getOSName(true) === "android" && osMajorVersion >= 3;
			},
			describe() {
				return { type: PLATFORMS_MAP.tablet };
			}
		},
		{
			test(parser) {
				return parser.getOSName(true) === "android";
			},
			describe() {
				return { type: PLATFORMS_MAP.mobile };
			}
		},
		{
			test: [/smart-?tv|smarttv/i],
			describe() {
				return { type: PLATFORMS_MAP.tv };
			}
		},
		{
			test: [/netcast/i],
			describe() {
				return { type: PLATFORMS_MAP.tv };
			}
		},
		{
			test(parser) {
				return parser.getOSName(true) === "macos";
			},
			describe() {
				return {
					type: PLATFORMS_MAP.desktop,
					vendor: "Apple"
				};
			}
		},
		{
			test(parser) {
				return parser.getOSName(true) === "windows";
			},
			describe() {
				return { type: PLATFORMS_MAP.desktop };
			}
		},
		{
			test(parser) {
				return parser.getOSName(true) === "linux";
			},
			describe() {
				return { type: PLATFORMS_MAP.desktop };
			}
		},
		{
			test(parser) {
				return parser.getOSName(true) === "playstation 4";
			},
			describe() {
				return { type: PLATFORMS_MAP.tv };
			}
		},
		{
			test(parser) {
				return parser.getOSName(true) === "roku";
			},
			describe() {
				return { type: PLATFORMS_MAP.tv };
			}
		}
	];
}));
//#endregion
//#region node_modules/bowser/src/parser-engines.js
var parser_engines_default;
var init_parser_engines = __esmMin((() => {
	init_utils();
	init_constants$2();
	parser_engines_default = [
		{
			test(parser) {
				return parser.getBrowserName(true) === "microsoft edge";
			},
			describe(ua) {
				if (/\sedg\//i.test(ua)) return { name: ENGINE_MAP.Blink };
				const version = Utils.getFirstMatch(/edge\/(\d+(\.?_?\d+)+)/i, ua);
				return {
					name: ENGINE_MAP.EdgeHTML,
					version
				};
			}
		},
		{
			test: [/trident/i],
			describe(ua) {
				const engine = { name: ENGINE_MAP.Trident };
				const version = Utils.getFirstMatch(/trident\/(\d+(\.?_?\d+)+)/i, ua);
				if (version) engine.version = version;
				return engine;
			}
		},
		{
			test(parser) {
				return parser.test(/presto/i);
			},
			describe(ua) {
				const engine = { name: ENGINE_MAP.Presto };
				const version = Utils.getFirstMatch(/presto\/(\d+(\.?_?\d+)+)/i, ua);
				if (version) engine.version = version;
				return engine;
			}
		},
		{
			test(parser) {
				const isGecko = parser.test(/gecko/i);
				const likeGecko = parser.test(/like gecko/i);
				return isGecko && !likeGecko;
			},
			describe(ua) {
				const engine = { name: ENGINE_MAP.Gecko };
				const version = Utils.getFirstMatch(/gecko\/(\d+(\.?_?\d+)+)/i, ua);
				if (version) engine.version = version;
				return engine;
			}
		},
		{
			test: [/(apple)?webkit\/537\.36/i],
			describe() {
				return { name: ENGINE_MAP.Blink };
			}
		},
		{
			test: [/(apple)?webkit/i],
			describe(ua) {
				const engine = { name: ENGINE_MAP.WebKit };
				const version = Utils.getFirstMatch(/webkit\/(\d+(\.?_?\d+)+)/i, ua);
				if (version) engine.version = version;
				return engine;
			}
		}
	];
}));
//#endregion
//#region node_modules/bowser/src/parser.js
var Parser;
var init_parser = __esmMin((() => {
	init_parser_browsers();
	init_parser_os();
	init_parser_platforms();
	init_parser_engines();
	init_utils();
	Parser = class {
		/**
		* Create instance of Parser
		*
		* @param {String} UA User-Agent string
		* @param {Boolean|ClientHints} [skipParsingOrHints=false] Either a boolean to skip parsing,
		* or a ClientHints object containing User-Agent Client Hints data
		* @param {ClientHints} [clientHints] User-Agent Client Hints data (navigator.userAgentData)
		*
		* @throw {Error} in case of empty UA String
		*
		* @constructor
		*/
		constructor(UA, skipParsingOrHints = false, clientHints = null) {
			if (UA === void 0 || UA === null || UA === "") throw new Error("UserAgent parameter can't be empty");
			this._ua = UA;
			let skipParsing = false;
			if (typeof skipParsingOrHints === "boolean") {
				skipParsing = skipParsingOrHints;
				this._hints = clientHints;
			} else if (skipParsingOrHints != null && typeof skipParsingOrHints === "object") this._hints = skipParsingOrHints;
			else this._hints = null;
			/**
			* @typedef ParsedResult
			* @property {Object} browser
			* @property {String|undefined} [browser.name]
			* Browser name, like `"Chrome"` or `"Internet Explorer"`
			* @property {String|undefined} [browser.version] Browser version as a String `"12.01.45334.10"`
			* @property {Object} os
			* @property {String|undefined} [os.name] OS name, like `"Windows"` or `"macOS"`
			* @property {String|undefined} [os.version] OS version, like `"NT 5.1"` or `"10.11.1"`
			* @property {String|undefined} [os.versionName] OS name, like `"XP"` or `"High Sierra"`
			* @property {Object} platform
			* @property {String|undefined} [platform.type]
			* platform type, can be either `"desktop"`, `"tablet"` or `"mobile"`
			* @property {String|undefined} [platform.vendor] Vendor of the device,
			* like `"Apple"` or `"Samsung"`
			* @property {String|undefined} [platform.model] Device model,
			* like `"iPhone"` or `"Kindle Fire HD 7"`
			* @property {Object} engine
			* @property {String|undefined} [engine.name]
			* Can be any of this: `WebKit`, `Blink`, `Gecko`, `Trident`, `Presto`, `EdgeHTML`
			* @property {String|undefined} [engine.version] String version of the engine
			*/
			this.parsedResult = {};
			if (skipParsing !== true) this.parse();
		}
		/**
		* Get Client Hints data
		* @return {ClientHints|null}
		*
		* @public
		* @example
		* const parser = Bowser.getParser(UA, clientHints);
		* const hints = parser.getHints();
		* console.log(hints.platform); // 'Windows'
		* console.log(hints.mobile); // false
		*/
		getHints() {
			return this._hints;
		}
		/**
		* Check if a brand exists in Client Hints brands array
		* @param {string} brandName The brand name to check for
		* @return {boolean}
		*
		* @public
		* @example
		* const parser = Bowser.getParser(UA, clientHints);
		* if (parser.hasBrand('Google Chrome')) {
		*   console.log('Chrome detected!');
		* }
		*/
		hasBrand(brandName) {
			if (!this._hints || !Array.isArray(this._hints.brands)) return false;
			const brandLower = brandName.toLowerCase();
			return this._hints.brands.some((b) => b.brand && b.brand.toLowerCase() === brandLower);
		}
		/**
		* Get brand version from Client Hints
		* @param {string} brandName The brand name to get version for
		* @return {string|undefined}
		*
		* @public
		* @example
		* const parser = Bowser.getParser(UA, clientHints);
		* const version = parser.getBrandVersion('Google Chrome');
		* console.log(version); // '131'
		*/
		getBrandVersion(brandName) {
			if (!this._hints || !Array.isArray(this._hints.brands)) return;
			const brandLower = brandName.toLowerCase();
			const brand = this._hints.brands.find((b) => b.brand && b.brand.toLowerCase() === brandLower);
			return brand ? brand.version : void 0;
		}
		/**
		* Get UserAgent string of current Parser instance
		* @return {String} User-Agent String of the current <Parser> object
		*
		* @public
		*/
		getUA() {
			return this._ua;
		}
		/**
		* Test a UA string for a regexp
		* @param {RegExp} regex
		* @return {Boolean}
		*/
		test(regex) {
			return regex.test(this._ua);
		}
		/**
		* Get parsed browser object
		* @return {Object}
		*/
		parseBrowser() {
			this.parsedResult.browser = {};
			const browserDescriptor = Utils.find(browsersList, (_browser) => {
				if (typeof _browser.test === "function") return _browser.test(this);
				if (Array.isArray(_browser.test)) return _browser.test.some((condition) => this.test(condition));
				throw new Error("Browser's test function is not valid");
			});
			if (browserDescriptor) this.parsedResult.browser = browserDescriptor.describe(this.getUA(), this);
			return this.parsedResult.browser;
		}
		/**
		* Get parsed browser object
		* @return {Object}
		*
		* @public
		*/
		getBrowser() {
			if (this.parsedResult.browser) return this.parsedResult.browser;
			return this.parseBrowser();
		}
		/**
		* Get browser's name
		* @return {String} Browser's name or an empty string
		*
		* @public
		*/
		getBrowserName(toLowerCase) {
			if (toLowerCase) return String(this.getBrowser().name).toLowerCase() || "";
			return this.getBrowser().name || "";
		}
		/**
		* Get browser's version
		* @return {String} version of browser
		*
		* @public
		*/
		getBrowserVersion() {
			return this.getBrowser().version;
		}
		/**
		* Get OS
		* @return {Object}
		*
		* @example
		* this.getOS();
		* {
		*   name: 'macOS',
		*   version: '10.11.12'
		* }
		*/
		getOS() {
			if (this.parsedResult.os) return this.parsedResult.os;
			return this.parseOS();
		}
		/**
		* Parse OS and save it to this.parsedResult.os
		* @return {*|{}}
		*/
		parseOS() {
			this.parsedResult.os = {};
			const os = Utils.find(parser_os_default, (_os) => {
				if (typeof _os.test === "function") return _os.test(this);
				if (Array.isArray(_os.test)) return _os.test.some((condition) => this.test(condition));
				throw new Error("Browser's test function is not valid");
			});
			if (os) this.parsedResult.os = os.describe(this.getUA());
			return this.parsedResult.os;
		}
		/**
		* Get OS name
		* @param {Boolean} [toLowerCase] return lower-cased value
		* @return {String} name of the OS — macOS, Windows, Linux, etc.
		*/
		getOSName(toLowerCase) {
			const { name } = this.getOS();
			if (toLowerCase) return String(name).toLowerCase() || "";
			return name || "";
		}
		/**
		* Get OS version
		* @return {String} full version with dots ('10.11.12', '5.6', etc)
		*/
		getOSVersion() {
			return this.getOS().version;
		}
		/**
		* Get parsed platform
		* @return {{}}
		*/
		getPlatform() {
			if (this.parsedResult.platform) return this.parsedResult.platform;
			return this.parsePlatform();
		}
		/**
		* Get platform name
		* @param {Boolean} [toLowerCase=false]
		* @return {*}
		*/
		getPlatformType(toLowerCase = false) {
			const { type } = this.getPlatform();
			if (toLowerCase) return String(type).toLowerCase() || "";
			return type || "";
		}
		/**
		* Get parsed platform
		* @return {{}}
		*/
		parsePlatform() {
			this.parsedResult.platform = {};
			const platform = Utils.find(parser_platforms_default, (_platform) => {
				if (typeof _platform.test === "function") return _platform.test(this);
				if (Array.isArray(_platform.test)) return _platform.test.some((condition) => this.test(condition));
				throw new Error("Browser's test function is not valid");
			});
			if (platform) this.parsedResult.platform = platform.describe(this.getUA());
			return this.parsedResult.platform;
		}
		/**
		* Get parsed engine
		* @return {{}}
		*/
		getEngine() {
			if (this.parsedResult.engine) return this.parsedResult.engine;
			return this.parseEngine();
		}
		/**
		* Get engines's name
		* @return {String} Engines's name or an empty string
		*
		* @public
		*/
		getEngineName(toLowerCase) {
			if (toLowerCase) return String(this.getEngine().name).toLowerCase() || "";
			return this.getEngine().name || "";
		}
		/**
		* Get parsed platform
		* @return {{}}
		*/
		parseEngine() {
			this.parsedResult.engine = {};
			const engine = Utils.find(parser_engines_default, (_engine) => {
				if (typeof _engine.test === "function") return _engine.test(this);
				if (Array.isArray(_engine.test)) return _engine.test.some((condition) => this.test(condition));
				throw new Error("Browser's test function is not valid");
			});
			if (engine) this.parsedResult.engine = engine.describe(this.getUA());
			return this.parsedResult.engine;
		}
		/**
		* Parse full information about the browser
		* @returns {Parser}
		*/
		parse() {
			this.parseBrowser();
			this.parseOS();
			this.parsePlatform();
			this.parseEngine();
			return this;
		}
		/**
		* Get parsed result
		* @return {ParsedResult}
		*/
		getResult() {
			return Utils.assign({}, this.parsedResult);
		}
		/**
		* Check if parsed browser matches certain conditions
		*
		* @param {Object} checkTree It's one or two layered object,
		* which can include a platform or an OS on the first layer
		* and should have browsers specs on the bottom-laying layer
		*
		* @returns {Boolean|undefined} Whether the browser satisfies the set conditions or not.
		* Returns `undefined` when the browser is no described in the checkTree object.
		*
		* @example
		* const browser = Bowser.getParser(window.navigator.userAgent);
		* if (browser.satisfies({chrome: '>118.01.1322' }))
		* // or with os
		* if (browser.satisfies({windows: { chrome: '>118.01.1322' } }))
		* // or with platforms
		* if (browser.satisfies({desktop: { chrome: '>118.01.1322' } }))
		*/
		satisfies(checkTree) {
			const platformsAndOSes = {};
			let platformsAndOSCounter = 0;
			const browsers = {};
			let browsersCounter = 0;
			Object.keys(checkTree).forEach((key) => {
				const currentDefinition = checkTree[key];
				if (typeof currentDefinition === "string") {
					browsers[key] = currentDefinition;
					browsersCounter += 1;
				} else if (typeof currentDefinition === "object") {
					platformsAndOSes[key] = currentDefinition;
					platformsAndOSCounter += 1;
				}
			});
			if (platformsAndOSCounter > 0) {
				const platformsAndOSNames = Object.keys(platformsAndOSes);
				const OSMatchingDefinition = Utils.find(platformsAndOSNames, (name) => this.isOS(name));
				if (OSMatchingDefinition) {
					const osResult = this.satisfies(platformsAndOSes[OSMatchingDefinition]);
					if (osResult !== void 0) return osResult;
				}
				const platformMatchingDefinition = Utils.find(platformsAndOSNames, (name) => this.isPlatform(name));
				if (platformMatchingDefinition) {
					const platformResult = this.satisfies(platformsAndOSes[platformMatchingDefinition]);
					if (platformResult !== void 0) return platformResult;
				}
			}
			if (browsersCounter > 0) {
				const browserNames = Object.keys(browsers);
				const matchingDefinition = Utils.find(browserNames, (name) => this.isBrowser(name, true));
				if (matchingDefinition !== void 0) return this.compareVersion(browsers[matchingDefinition]);
			}
		}
		/**
		* Check if the browser name equals the passed string
		* @param {string} browserName The string to compare with the browser name
		* @param [includingAlias=false] The flag showing whether alias will be included into comparison
		* @returns {boolean}
		*/
		isBrowser(browserName, includingAlias = false) {
			const defaultBrowserName = this.getBrowserName().toLowerCase();
			let browserNameLower = browserName.toLowerCase();
			const alias = Utils.getBrowserTypeByAlias(browserNameLower);
			if (includingAlias && alias) browserNameLower = alias.toLowerCase();
			return browserNameLower === defaultBrowserName;
		}
		compareVersion(version) {
			let expectedResults = [0];
			let comparableVersion = version;
			let isLoose = false;
			const currentBrowserVersion = this.getBrowserVersion();
			if (typeof currentBrowserVersion !== "string") return;
			if (version[0] === ">" || version[0] === "<") {
				comparableVersion = version.substr(1);
				if (version[1] === "=") {
					isLoose = true;
					comparableVersion = version.substr(2);
				} else expectedResults = [];
				if (version[0] === ">") expectedResults.push(1);
				else expectedResults.push(-1);
			} else if (version[0] === "=") comparableVersion = version.substr(1);
			else if (version[0] === "~") {
				isLoose = true;
				comparableVersion = version.substr(1);
			}
			return expectedResults.indexOf(Utils.compareVersions(currentBrowserVersion, comparableVersion, isLoose)) > -1;
		}
		/**
		* Check if the OS name equals the passed string
		* @param {string} osName The string to compare with the OS name
		* @returns {boolean}
		*/
		isOS(osName) {
			return this.getOSName(true) === String(osName).toLowerCase();
		}
		/**
		* Check if the platform type equals the passed string
		* @param {string} platformType The string to compare with the platform type
		* @returns {boolean}
		*/
		isPlatform(platformType) {
			return this.getPlatformType(true) === String(platformType).toLowerCase();
		}
		/**
		* Check if the engine name equals the passed string
		* @param {string} engineName The string to compare with the engine name
		* @returns {boolean}
		*/
		isEngine(engineName) {
			return this.getEngineName(true) === String(engineName).toLowerCase();
		}
		/**
		* Is anything? Check if the browser is called "anything",
		* the OS called "anything" or the platform called "anything"
		* @param {String} anything
		* @param [includingAlias=false] The flag showing whether alias will be included into comparison
		* @returns {Boolean}
		*/
		is(anything, includingAlias = false) {
			return this.isBrowser(anything, includingAlias) || this.isOS(anything) || this.isPlatform(anything);
		}
		/**
		* Check if any of the given values satisfies this.is(anything)
		* @param {String[]} anythings
		* @returns {Boolean}
		*/
		some(anythings = []) {
			return anythings.some((anything) => this.is(anything));
		}
	};
}));
//#endregion
//#region node_modules/bowser/src/bowser.js
var bowser_exports = /* @__PURE__ */ __exportAll({ default: () => Bowser });
var Bowser;
var init_bowser = __esmMin((() => {
	init_parser();
	init_constants$2();
	Bowser = class {
		/**
		* Creates a {@link Parser} instance
		*
		* @param {String} UA UserAgent string
		* @param {Boolean|Object} [skipParsingOrHints=false] Either a boolean to skip parsing,
		* or a ClientHints object (navigator.userAgentData)
		* @param {Object} [clientHints] User-Agent Client Hints data (navigator.userAgentData)
		* @returns {Parser}
		* @throws {Error} when UA is not a String
		*
		* @example
		* const parser = Bowser.getParser(window.navigator.userAgent);
		* const result = parser.getResult();
		*
		* @example
		* // With User-Agent Client Hints
		* const parser = Bowser.getParser(
		*   window.navigator.userAgent,
		*   window.navigator.userAgentData
		* );
		*/
		static getParser(UA, skipParsingOrHints = false, clientHints = null) {
			/*!
			* Bowser - a browser detector
			* https://github.com/bowser-js/bowser
			* MIT License | (c) Dustin Diaz 2012-2015
			* MIT License | (c) Denis Demchenko 2015-2019
			*/
			if (typeof UA !== "string") throw new Error("UserAgent should be a string");
			return new Parser(UA, skipParsingOrHints, clientHints);
		}
		/**
		* Creates a {@link Parser} instance and runs {@link Parser.getResult} immediately
		*
		* @param {String} UA UserAgent string
		* @param {Object} [clientHints] User-Agent Client Hints data (navigator.userAgentData)
		* @return {ParsedResult}
		*
		* @example
		* const result = Bowser.parse(window.navigator.userAgent);
		*
		* @example
		* // With User-Agent Client Hints
		* const result = Bowser.parse(
		*   window.navigator.userAgent,
		*   window.navigator.userAgentData
		* );
		*/
		static parse(UA, clientHints = null) {
			return new Parser(UA, clientHints).getResult();
		}
		static get BROWSER_MAP() {
			return BROWSER_MAP;
		}
		static get ENGINE_MAP() {
			return ENGINE_MAP;
		}
		static get OS_MAP() {
			return OS_MAP;
		}
		static get PLATFORMS_MAP() {
			return PLATFORMS_MAP;
		}
	};
}));
//#endregion
//#region node_modules/@aws-sdk/core/dist-cjs/submodules/client/index.js
var require_client = /* @__PURE__ */ __commonJSMin(((exports) => {
	var { Retry, RETRY_MODES } = require_retry();
	var { HttpRequest, parseUrl } = require_protocols$1();
	var { InvokeStore } = require_invoke_store();
	var { normalizeProvider } = require_dist_cjs();
	var { platform, release } = __require("node:os");
	var { versions, env } = __require("node:process");
	var { isValidHostLabel, isIpAddress, customEndpointFunctions } = require_endpoints();
	var { EndpointError, resolveEndpoint } = require_endpoints();
	exports.EndpointError = EndpointError;
	exports.isIpAddress = isIpAddress;
	exports.resolveEndpoint = resolveEndpoint;
	var { loadConfig, NODE_REGION_CONFIG_OPTIONS, NODE_REGION_CONFIG_FILE_OPTIONS } = require_config();
	var { REGION_ENV_NAME, REGION_INI_NAME, resolveRegionConfig } = require_config();
	exports.NODE_REGION_CONFIG_FILE_OPTIONS = NODE_REGION_CONFIG_FILE_OPTIONS;
	exports.NODE_REGION_CONFIG_OPTIONS = NODE_REGION_CONFIG_OPTIONS;
	exports.REGION_ENV_NAME = REGION_ENV_NAME;
	exports.REGION_INI_NAME = REGION_INI_NAME;
	exports.resolveRegionConfig = resolveRegionConfig;
	var state = { warningEmitted: false };
	var emitWarningIfUnsupportedVersion = (version) => {
		if (version && !state.warningEmitted) {
			if (process.env.AWS_SDK_JS_NODE_VERSION_SUPPORT_WARNING_DISABLED === "true") {
				state.warningEmitted = true;
				return;
			}
			const userMajorVersion = parseInt(version.substring(1, version.indexOf(".")));
			const vv = 22;
			if (userMajorVersion < vv) {
				state.warningEmitted = true;
				process.emitWarning(`NodeVersionSupportWarning: The AWS SDK for JavaScript (v3)
versions published after the first week of January 2027
will require node >=${vv}. You are running node ${version}.

To continue receiving updates to AWS services, bug fixes,
and security updates please upgrade to node >=${vv}.

More information can be found at: https://a.co/c895JFp`);
			}
		}
	};
	var longPollMiddleware = () => (next, context) => async (args) => {
		context.__retryLongPoll = true;
		return next(args);
	};
	var longPollMiddlewareOptions = {
		name: "longPollMiddleware",
		tags: ["RETRY"],
		step: "initialize",
		override: true
	};
	var getLongPollPlugin = (options) => ({ applyToStack: (clientStack) => {
		clientStack.add(longPollMiddleware(), longPollMiddlewareOptions);
	} });
	function setCredentialFeature(credentials, feature, value) {
		if (!credentials.$source) credentials.$source = {};
		credentials.$source[feature] = value;
		return credentials;
	}
	Retry.v2026 ||= typeof process === "object" && process.env?.AWS_NEW_RETRIES_2026 === "true";
	function setFeature(context, feature, value) {
		if (!context.__aws_sdk_context) context.__aws_sdk_context = { features: {} };
		else if (!context.__aws_sdk_context.features) context.__aws_sdk_context.features = {};
		context.__aws_sdk_context.features[feature] = value;
	}
	function setTokenFeature(token, feature, value) {
		if (!token.$source) token.$source = {};
		token.$source[feature] = value;
		return token;
	}
	function resolveHostHeaderConfig(input) {
		return input;
	}
	var hostHeaderMiddleware = (options) => (next) => async (args) => {
		if (!HttpRequest.isInstance(args.request)) return next(args);
		const { request } = args;
		const { handlerProtocol = "" } = options.requestHandler.metadata || {};
		if (handlerProtocol.indexOf("h2") >= 0 && !request.headers[":authority"]) {
			delete request.headers["host"];
			request.headers[":authority"] = request.hostname + (request.port ? ":" + request.port : "");
		} else if (!request.headers["host"]) {
			let host = request.hostname;
			if (request.port != null) host += `:${request.port}`;
			request.headers["host"] = host;
		}
		return next(args);
	};
	var hostHeaderMiddlewareOptions = {
		name: "hostHeaderMiddleware",
		step: "build",
		priority: "low",
		tags: ["HOST"],
		override: true
	};
	var getHostHeaderPlugin = (options) => ({ applyToStack: (clientStack) => {
		clientStack.add(hostHeaderMiddleware(options), hostHeaderMiddlewareOptions);
	} });
	var loggerMiddleware = () => (next, context) => async (args) => {
		try {
			const response = await next(args);
			const { clientName, commandName, logger, dynamoDbDocumentClientOptions = {} } = context;
			const { overrideInputFilterSensitiveLog, overrideOutputFilterSensitiveLog } = dynamoDbDocumentClientOptions;
			const inputFilterSensitiveLog = overrideInputFilterSensitiveLog ?? context.inputFilterSensitiveLog;
			const outputFilterSensitiveLog = overrideOutputFilterSensitiveLog ?? context.outputFilterSensitiveLog;
			const { $metadata, ...outputWithoutMetadata } = response.output;
			logger?.info?.({
				clientName,
				commandName,
				input: inputFilterSensitiveLog(args.input),
				output: outputFilterSensitiveLog(outputWithoutMetadata),
				metadata: $metadata
			});
			return response;
		} catch (error) {
			const { clientName, commandName, logger, dynamoDbDocumentClientOptions = {} } = context;
			const { overrideInputFilterSensitiveLog } = dynamoDbDocumentClientOptions;
			const inputFilterSensitiveLog = overrideInputFilterSensitiveLog ?? context.inputFilterSensitiveLog;
			logger?.error?.({
				clientName,
				commandName,
				input: inputFilterSensitiveLog(args.input),
				error,
				metadata: error.$metadata
			});
			throw error;
		}
	};
	var loggerMiddlewareOptions = {
		name: "loggerMiddleware",
		tags: ["LOGGER"],
		step: "initialize",
		override: true
	};
	var getLoggerPlugin = (options) => ({ applyToStack: (clientStack) => {
		clientStack.add(loggerMiddleware(), loggerMiddlewareOptions);
	} });
	var recursionDetectionMiddlewareOptions = {
		step: "build",
		tags: ["RECURSION_DETECTION", "TRACE_CONTEXT_PROPAGATION"],
		name: "recursionDetectionMiddleware",
		override: true,
		priority: "low"
	};
	var AWS_LAMBDA_FUNCTION_NAME = "AWS_LAMBDA_FUNCTION_NAME";
	var _X_AMZN_TRACE_ID = "_X_AMZN_TRACE_ID";
	var X_AMZN_TRACE_ID = "X-Amzn-Trace-Id";
	var TRACEPARENT = "traceparent";
	var TRACESTATE = "tracestate";
	var BAGGAGE = "baggage";
	var recursionDetectionMiddleware = () => (next) => async (args) => {
		const { request } = args;
		if (!HttpRequest.isInstance(request)) return next(args);
		let invokeStore;
		{
			const traceIdHeader = Object.keys(request.headers ?? {}).find((h) => h.toLowerCase() === X_AMZN_TRACE_ID.toLowerCase()) ?? X_AMZN_TRACE_ID;
			if (!request.headers.hasOwnProperty(traceIdHeader)) {
				const functionName = process.env[AWS_LAMBDA_FUNCTION_NAME];
				const traceIdFromEnv = process.env[_X_AMZN_TRACE_ID];
				invokeStore ??= await InvokeStore.getInstanceAsync();
				const traceId = invokeStore?.getXRayTraceId() ?? traceIdFromEnv;
				const nonEmptyString = (str) => typeof str === "string" && str.length > 0;
				if (nonEmptyString(functionName) && nonEmptyString(traceId)) request.headers[X_AMZN_TRACE_ID] = traceId;
			}
		}
		sanitizeTraceHeaders(request.headers);
		if (!request.headers[TRACEPARENT]) {
			const traceparent = (invokeStore ??= await InvokeStore.getInstanceAsync())?.getTraceparent?.();
			if (traceparent) {
				request.headers[TRACEPARENT] = traceparent;
				const tracestate = invokeStore?.getTracestate?.();
				if (tracestate) request.headers[TRACESTATE] = tracestate;
				const baggage = invokeStore?.getBaggage?.();
				if (baggage) request.headers[BAGGAGE] = baggage;
			}
		}
		return next(args);
	};
	function sanitizeTraceHeaders(headers) {
		for (const header of Object.keys(headers)) {
			const lower = header.toLowerCase();
			if (header !== lower && (lower === TRACEPARENT || lower === TRACESTATE || lower === BAGGAGE)) {
				headers[lower] = headers[header];
				delete headers[header];
			}
		}
	}
	var getRecursionDetectionPlugin = (options) => ({ applyToStack: (clientStack) => {
		clientStack.add(recursionDetectionMiddleware(), recursionDetectionMiddlewareOptions);
	} });
	var DEFAULT_UA_APP_ID = void 0;
	function isValidUserAgentAppId(appId) {
		if (appId === void 0) return true;
		return typeof appId === "string" && appId.length <= 50;
	}
	function resolveUserAgentConfig(input) {
		const normalizedAppIdProvider = normalizeProvider(input.userAgentAppId ?? DEFAULT_UA_APP_ID);
		const { customUserAgent } = input;
		return Object.assign(input, {
			customUserAgent: typeof customUserAgent === "string" ? [[customUserAgent]] : customUserAgent,
			userAgentAppId: async () => {
				const appId = await normalizedAppIdProvider();
				if (!isValidUserAgentAppId(appId)) {
					const logger = input.logger?.constructor?.name === "NoOpLogger" || !input.logger ? console : input.logger;
					if (typeof appId !== "string") logger?.warn("userAgentAppId must be a string or undefined.");
					else if (appId.length > 50) logger?.warn("The provided userAgentAppId exceeds the maximum length of 50 characters.");
				}
				return appId;
			}
		});
	}
	var partitionsInfo = {
		"partitions": [
			{
				"id": "aws",
				"outputs": {
					"dnsSuffix": "amazonaws.com",
					"dualStackDnsSuffix": "api.aws",
					"implicitGlobalRegion": "us-east-1",
					"name": "aws",
					"supportsDualStack": true,
					"supportsFIPS": true
				},
				"regionRegex": "^(us|eu|ap|sa|ca|me|af|il|mx)\\-\\w+\\-\\d+$",
				"regions": {
					"af-south-1": { "description": "Africa (Cape Town)" },
					"ap-east-1": { "description": "Asia Pacific (Hong Kong)" },
					"ap-east-2": { "description": "Asia Pacific (Taipei)" },
					"ap-northeast-1": { "description": "Asia Pacific (Tokyo)" },
					"ap-northeast-2": { "description": "Asia Pacific (Seoul)" },
					"ap-northeast-3": { "description": "Asia Pacific (Osaka)" },
					"ap-south-1": { "description": "Asia Pacific (Mumbai)" },
					"ap-south-2": { "description": "Asia Pacific (Hyderabad)" },
					"ap-southeast-1": { "description": "Asia Pacific (Singapore)" },
					"ap-southeast-2": { "description": "Asia Pacific (Sydney)" },
					"ap-southeast-3": { "description": "Asia Pacific (Jakarta)" },
					"ap-southeast-4": { "description": "Asia Pacific (Melbourne)" },
					"ap-southeast-5": { "description": "Asia Pacific (Malaysia)" },
					"ap-southeast-6": { "description": "Asia Pacific (New Zealand)" },
					"ap-southeast-7": { "description": "Asia Pacific (Thailand)" },
					"aws-global": { "description": "aws global region" },
					"ca-central-1": { "description": "Canada (Central)" },
					"ca-west-1": { "description": "Canada West (Calgary)" },
					"eu-central-1": { "description": "Europe (Frankfurt)" },
					"eu-central-2": { "description": "Europe (Zurich)" },
					"eu-north-1": { "description": "Europe (Stockholm)" },
					"eu-south-1": { "description": "Europe (Milan)" },
					"eu-south-2": { "description": "Europe (Spain)" },
					"eu-west-1": { "description": "Europe (Ireland)" },
					"eu-west-2": { "description": "Europe (London)" },
					"eu-west-3": { "description": "Europe (Paris)" },
					"il-central-1": { "description": "Israel (Tel Aviv)" },
					"me-central-1": { "description": "Middle East (UAE)" },
					"me-south-1": { "description": "Middle East (Bahrain)" },
					"mx-central-1": { "description": "Mexico (Central)" },
					"sa-east-1": { "description": "South America (Sao Paulo)" },
					"us-east-1": { "description": "US East (N. Virginia)" },
					"us-east-2": { "description": "US East (Ohio)" },
					"us-west-1": { "description": "US West (N. California)" },
					"us-west-2": { "description": "US West (Oregon)" }
				}
			},
			{
				"id": "aws-cn",
				"outputs": {
					"dnsSuffix": "amazonaws.com.cn",
					"dualStackDnsSuffix": "api.amazonwebservices.com.cn",
					"implicitGlobalRegion": "cn-northwest-1",
					"name": "aws-cn",
					"supportsDualStack": true,
					"supportsFIPS": true
				},
				"regionRegex": "^cn\\-\\w+\\-\\d+$",
				"regions": {
					"aws-cn-global": { "description": "aws-cn global region" },
					"cn-north-1": { "description": "China (Beijing)" },
					"cn-northwest-1": { "description": "China (Ningxia)" }
				}
			},
			{
				"id": "aws-eusc",
				"outputs": {
					"dnsSuffix": "amazonaws.eu",
					"dualStackDnsSuffix": "api.amazonwebservices.eu",
					"implicitGlobalRegion": "eusc-de-east-1",
					"name": "aws-eusc",
					"supportsDualStack": true,
					"supportsFIPS": true
				},
				"regionRegex": "^eusc\\-(de)\\-\\w+\\-\\d+$",
				"regions": { "eusc-de-east-1": { "description": "AWS European Sovereign Cloud (Germany)" } }
			},
			{
				"id": "aws-iso",
				"outputs": {
					"dnsSuffix": "c2s.ic.gov",
					"dualStackDnsSuffix": "api.aws.ic.gov",
					"implicitGlobalRegion": "us-iso-east-1",
					"name": "aws-iso",
					"supportsDualStack": true,
					"supportsFIPS": true
				},
				"regionRegex": "^us\\-iso\\-\\w+\\-\\d+$",
				"regions": {
					"aws-iso-global": { "description": "aws-iso global region" },
					"us-iso-east-1": { "description": "US ISO East" },
					"us-iso-west-1": { "description": "US ISO WEST" }
				}
			},
			{
				"id": "aws-iso-b",
				"outputs": {
					"dnsSuffix": "sc2s.sgov.gov",
					"dualStackDnsSuffix": "api.aws.scloud",
					"implicitGlobalRegion": "us-isob-east-1",
					"name": "aws-iso-b",
					"supportsDualStack": true,
					"supportsFIPS": true
				},
				"regionRegex": "^us\\-isob\\-\\w+\\-\\d+$",
				"regions": {
					"aws-iso-b-global": { "description": "aws-iso-b global region" },
					"us-isob-east-1": { "description": "US ISOB East (Ohio)" },
					"us-isob-west-1": { "description": "US ISOB West" }
				}
			},
			{
				"id": "aws-iso-e",
				"outputs": {
					"dnsSuffix": "cloud.adc-e.uk",
					"dualStackDnsSuffix": "api.cloud-aws.adc-e.uk",
					"implicitGlobalRegion": "eu-isoe-west-1",
					"name": "aws-iso-e",
					"supportsDualStack": true,
					"supportsFIPS": true
				},
				"regionRegex": "^eu\\-isoe\\-\\w+\\-\\d+$",
				"regions": {
					"aws-iso-e-global": { "description": "aws-iso-e global region" },
					"eu-isoe-west-1": { "description": "EU ISOE West" }
				}
			},
			{
				"id": "aws-iso-f",
				"outputs": {
					"dnsSuffix": "csp.hci.ic.gov",
					"dualStackDnsSuffix": "api.aws.hci.ic.gov",
					"implicitGlobalRegion": "us-isof-south-1",
					"name": "aws-iso-f",
					"supportsDualStack": true,
					"supportsFIPS": true
				},
				"regionRegex": "^us\\-isof\\-\\w+\\-\\d+$",
				"regions": {
					"aws-iso-f-global": { "description": "aws-iso-f global region" },
					"us-isof-east-1": { "description": "US ISOF EAST" },
					"us-isof-south-1": { "description": "US ISOF SOUTH" }
				}
			},
			{
				"id": "aws-us-gov",
				"outputs": {
					"dnsSuffix": "amazonaws.com",
					"dualStackDnsSuffix": "api.aws",
					"implicitGlobalRegion": "us-gov-west-1",
					"name": "aws-us-gov",
					"supportsDualStack": true,
					"supportsFIPS": true
				},
				"regionRegex": "^us\\-gov\\-\\w+\\-\\d+$",
				"regions": {
					"aws-us-gov-global": { "description": "aws-us-gov global region" },
					"us-gov-east-1": { "description": "AWS GovCloud (US-East)" },
					"us-gov-west-1": { "description": "AWS GovCloud (US-West)" }
				}
			}
		],
		"version": "1.1"
	};
	var selectedPartitionsInfo = partitionsInfo;
	var selectedUserAgentPrefix = "";
	var partition = (value) => {
		const { partitions } = selectedPartitionsInfo;
		for (const partition of partitions) {
			const { regions, outputs } = partition;
			for (const [region, regionData] of Object.entries(regions)) if (region === value) return {
				...outputs,
				...regionData
			};
		}
		for (const partition of partitions) {
			const { regionRegex, outputs } = partition;
			if (new RegExp(regionRegex).test(value)) return { ...outputs };
		}
		const DEFAULT_PARTITION = partitions.find((partition) => partition.id === "aws");
		if (!DEFAULT_PARTITION) throw new Error("Provided region was not found in the partition array or regex, and default partition with id 'aws' doesn't exist.");
		return { ...DEFAULT_PARTITION.outputs };
	};
	var setPartitionInfo = (partitionsInfo, userAgentPrefix = "") => {
		selectedPartitionsInfo = partitionsInfo;
		selectedUserAgentPrefix = userAgentPrefix;
	};
	var useDefaultPartitionInfo = () => {
		setPartitionInfo(partitionsInfo, "");
	};
	var getUserAgentPrefix = () => selectedUserAgentPrefix;
	var ACCOUNT_ID_ENDPOINT_REGEX = /\d{12}\.ddb/;
	async function checkFeatures(context, config, args) {
		if (args.request?.headers?.["smithy-protocol"] === "rpc-v2-cbor") setFeature(context, "PROTOCOL_RPC_V2_CBOR", "M");
		if (typeof config.retryStrategy === "function") {
			const retryStrategy = await config.retryStrategy();
			if (typeof retryStrategy.mode === "string") switch (retryStrategy.mode) {
				case RETRY_MODES.ADAPTIVE:
					setFeature(context, "RETRY_MODE_ADAPTIVE", "F");
					break;
				case RETRY_MODES.STANDARD:
					setFeature(context, "RETRY_MODE_STANDARD", "E");
					break;
			}
		}
		if (typeof config.accountIdEndpointMode === "function") {
			const endpointV2 = context.endpointV2;
			if (String(endpointV2?.url?.hostname).match(ACCOUNT_ID_ENDPOINT_REGEX)) setFeature(context, "ACCOUNT_ID_ENDPOINT", "O");
			switch (await config.accountIdEndpointMode?.()) {
				case "disabled":
					setFeature(context, "ACCOUNT_ID_MODE_DISABLED", "Q");
					break;
				case "preferred":
					setFeature(context, "ACCOUNT_ID_MODE_PREFERRED", "P");
					break;
				case "required":
					setFeature(context, "ACCOUNT_ID_MODE_REQUIRED", "R");
					break;
			}
		}
		const identity = context.__smithy_context?.selectedHttpAuthScheme?.identity;
		if (identity?.$source) {
			const credentials = identity;
			if (credentials.accountId) setFeature(context, "RESOLVED_ACCOUNT_ID", "T");
			for (const [key, value] of Object.entries(credentials.$source ?? {})) setFeature(context, key, value);
		}
	}
	var USER_AGENT = "user-agent";
	var X_AMZ_USER_AGENT = "x-amz-user-agent";
	var SPACE = " ";
	var UA_NAME_SEPARATOR = "/";
	var UA_NAME_ESCAPE_REGEX = /[^!$%&'*+\-.^_`|~\w]/g;
	var UA_VALUE_ESCAPE_REGEX = /[^!$%&'*+\-.^_`|~\w#]/g;
	var UA_ESCAPE_CHAR = "-";
	var BYTE_LIMIT = 1024;
	function encodeFeatures(features) {
		let buffer = "";
		for (const key in features) {
			const val = features[key];
			if (buffer.length + val.length + 1 <= BYTE_LIMIT) {
				if (buffer.length) buffer += "," + val;
				else buffer += val;
				continue;
			}
			break;
		}
		return buffer;
	}
	var userAgentMiddleware = (options) => (next, context) => async (args) => {
		const { request } = args;
		if (!HttpRequest.isInstance(request)) return next(args);
		const { headers } = request;
		const userAgent = context?.userAgent?.map(escapeUserAgent) || [];
		const defaultUserAgent = (await options.defaultUserAgentProvider()).map(escapeUserAgent);
		await checkFeatures(context, options, args);
		const awsContext = context;
		defaultUserAgent.push(`m/${encodeFeatures(Object.assign({}, context.__smithy_context?.features, awsContext.__aws_sdk_context?.features))}`);
		const customUserAgent = options?.customUserAgent?.map(escapeUserAgent) || [];
		const appId = await options.userAgentAppId();
		if (appId) defaultUserAgent.push(escapeUserAgent([`app`, `${appId}`]));
		const prefix = getUserAgentPrefix();
		const sdkUserAgentValue = (prefix ? [prefix] : []).concat([
			...defaultUserAgent,
			...userAgent,
			...customUserAgent
		]).join(SPACE);
		const normalUAValue = [...defaultUserAgent.filter((section) => section.startsWith("aws-sdk-")), ...customUserAgent].join(SPACE);
		if (options.runtime !== "browser") {
			if (normalUAValue) headers[X_AMZ_USER_AGENT] = headers[X_AMZ_USER_AGENT] ? `${headers[USER_AGENT]} ${normalUAValue}` : normalUAValue;
			headers[USER_AGENT] = sdkUserAgentValue;
		} else headers[X_AMZ_USER_AGENT] = sdkUserAgentValue;
		return next({
			...args,
			request
		});
	};
	var escapeUserAgent = (userAgentPair) => {
		const name = userAgentPair[0].split(UA_NAME_SEPARATOR).map((part) => part.replace(UA_NAME_ESCAPE_REGEX, UA_ESCAPE_CHAR)).join(UA_NAME_SEPARATOR);
		const version = userAgentPair[1]?.replace(UA_VALUE_ESCAPE_REGEX, UA_ESCAPE_CHAR);
		const prefixSeparatorIndex = name.indexOf(UA_NAME_SEPARATOR);
		const prefix = name.substring(0, prefixSeparatorIndex);
		let uaName = name.substring(prefixSeparatorIndex + 1);
		if (prefix === "api") uaName = uaName.toLowerCase();
		return [
			prefix,
			uaName,
			version
		].filter((item) => item && item.length > 0).reduce((acc, item, index) => {
			switch (index) {
				case 0: return item;
				case 1: return `${acc}/${item}`;
				default: return `${acc}#${item}`;
			}
		}, "");
	};
	var getUserAgentMiddlewareOptions = {
		name: "getUserAgentMiddleware",
		step: "build",
		priority: "low",
		tags: ["SET_USER_AGENT", "USER_AGENT"],
		override: true
	};
	var getUserAgentPlugin = (config) => ({ applyToStack: (clientStack) => {
		clientStack.add(userAgentMiddleware(config), getUserAgentMiddlewareOptions);
	} });
	var getRuntimeUserAgentPair = () => {
		for (const runtime of [
			"deno",
			"bun",
			"llrt"
		]) if (versions[runtime]) return [`md/${runtime}`, versions[runtime]];
		return ["md/nodejs", versions.node];
	};
	var crtAvailability = { isCrtAvailable: false };
	var isCrtAvailable = () => {
		if (crtAvailability.isCrtAvailable) return ["md/crt-avail"];
		return null;
	};
	var createDefaultUserAgentProvider = ({ serviceId, clientVersion }) => {
		const runtimeUserAgentPair = getRuntimeUserAgentPair();
		return async (config) => {
			const sections = [
				["aws-sdk-js", clientVersion],
				["ua", "2.1"],
				[`os/${platform()}`, release()],
				["lang/js"],
				runtimeUserAgentPair
			];
			const crtAvailable = isCrtAvailable();
			if (crtAvailable) sections.push(crtAvailable);
			if (serviceId) sections.push([`api/${serviceId}`, clientVersion]);
			if (env.AWS_EXECUTION_ENV) sections.push([`exec-env/${env.AWS_EXECUTION_ENV}`]);
			const appId = await config?.userAgentAppId?.();
			return appId ? [...sections, [`app/${appId}`]] : [...sections];
		};
	};
	var defaultUserAgent = createDefaultUserAgentProvider;
	var UA_APP_ID_ENV_NAME = "AWS_SDK_UA_APP_ID";
	var UA_APP_ID_INI_NAME = "sdk_ua_app_id";
	var UA_APP_ID_INI_NAME_DEPRECATED = "sdk-ua-app-id";
	var NODE_APP_ID_CONFIG_OPTIONS = {
		environmentVariableSelector: (env) => env[UA_APP_ID_ENV_NAME],
		configFileSelector: (profile) => profile[UA_APP_ID_INI_NAME] ?? profile[UA_APP_ID_INI_NAME_DEPRECATED],
		default: DEFAULT_UA_APP_ID
	};
	var createUserAgentStringParsingProvider = ({ serviceId, clientVersion }) => async (config) => {
		const module$1 = (init_bowser(), __toCommonJS(bowser_exports));
		const parse = module$1.parse ?? module$1.default.parse ?? (() => "");
		const parsedUA = typeof window !== "undefined" && window?.navigator?.userAgent ? parse(window.navigator.userAgent) : void 0;
		const sections = [
			["aws-sdk-js", clientVersion],
			["ua", "2.1"],
			[`os/${parsedUA?.os?.name || "other"}`, parsedUA?.os?.version],
			["lang/js"],
			["md/browser", `${parsedUA?.browser?.name ?? "unknown"}_${parsedUA?.browser?.version ?? "unknown"}`]
		];
		if (serviceId) sections.push([`api/${serviceId}`, clientVersion]);
		const appId = await config?.userAgentAppId?.();
		if (appId) sections.push([`app/${appId}`]);
		return sections;
	};
	var fallback = {
		os(ua) {
			if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
			if (/Macintosh|Mac OS X/.test(ua)) return "macOS";
			if (/Windows NT/.test(ua)) return "Windows";
			if (/Android/.test(ua)) return "Android";
			if (/Linux/.test(ua)) return "Linux";
		},
		browser(ua) {
			if (/EdgiOS|EdgA|Edg\//.test(ua)) return "Microsoft Edge";
			if (/Firefox\//.test(ua)) return "Firefox";
			if (/Chrome\//.test(ua)) return "Chrome";
			if (/Safari\//.test(ua)) return "Safari";
		}
	};
	var isVirtualHostableS3Bucket = (value, allowSubDomains = false) => {
		if (allowSubDomains) {
			for (const label of value.split(".")) if (!isVirtualHostableS3Bucket(label)) return false;
			return true;
		}
		if (!isValidHostLabel(value)) return false;
		if (value.length < 3 || value.length > 63) return false;
		if (value !== value.toLowerCase()) return false;
		if (isIpAddress(value)) return false;
		return true;
	};
	var ARN_DELIMITER = ":";
	var RESOURCE_DELIMITER = "/";
	var parseArn = (value) => {
		const segments = value.split(ARN_DELIMITER);
		if (segments.length < 6) return null;
		const [arn, partition, service, region, accountId, ...resourcePath] = segments;
		if (arn !== "arn" || partition === "" || service === "" || resourcePath.join(ARN_DELIMITER) === "") return null;
		return {
			partition,
			service,
			region,
			accountId,
			resourceId: resourcePath.map((resource) => resource.split(RESOURCE_DELIMITER)).flat()
		};
	};
	var awsEndpointFunctions = {
		isVirtualHostableS3Bucket,
		parseArn,
		partition
	};
	customEndpointFunctions.aws = awsEndpointFunctions;
	var resolveDefaultAwsRegionalEndpointsConfig = (input) => {
		if (typeof input.endpointProvider !== "function") throw new Error("@aws-sdk/util-endpoint - endpointProvider and endpoint missing in config for this client.");
		const { endpoint } = input;
		if (endpoint === void 0) input.endpoint = async () => {
			return toEndpointV1(input.endpointProvider({
				Region: typeof input.region === "function" ? await input.region() : input.region,
				UseDualStack: typeof input.useDualstackEndpoint === "function" ? await input.useDualstackEndpoint() : input.useDualstackEndpoint,
				UseFIPS: typeof input.useFipsEndpoint === "function" ? await input.useFipsEndpoint() : input.useFipsEndpoint,
				Endpoint: void 0
			}, { logger: input.logger }));
		};
		return input;
	};
	var toEndpointV1 = (endpoint) => parseUrl(endpoint.url);
	function stsRegionDefaultResolver(loaderConfig = {}) {
		return loadConfig({
			...NODE_REGION_CONFIG_OPTIONS,
			async default() {
				if (!warning.silence) console.warn("@aws-sdk - WARN - default STS region of us-east-1 used. See @aws-sdk/credential-providers README and set a region explicitly.");
				return "us-east-1";
			}
		}, {
			...NODE_REGION_CONFIG_FILE_OPTIONS,
			...loaderConfig
		});
	}
	var warning = { silence: false };
	var getAwsRegionExtensionConfiguration = (runtimeConfig) => {
		return {
			setRegion(region) {
				runtimeConfig.region = region;
			},
			region() {
				return runtimeConfig.region;
			}
		};
	};
	var resolveAwsRegionExtensionConfiguration = (awsRegionExtensionConfiguration) => {
		return { region: awsRegionExtensionConfiguration.region() };
	};
	exports.DEFAULT_UA_APP_ID = DEFAULT_UA_APP_ID;
	exports.NODE_APP_ID_CONFIG_OPTIONS = NODE_APP_ID_CONFIG_OPTIONS;
	exports.UA_APP_ID_ENV_NAME = UA_APP_ID_ENV_NAME;
	exports.UA_APP_ID_INI_NAME = UA_APP_ID_INI_NAME;
	exports.awsEndpointFunctions = awsEndpointFunctions;
	exports.createDefaultUserAgentProvider = createDefaultUserAgentProvider;
	exports.createUserAgentStringParsingProvider = createUserAgentStringParsingProvider;
	exports.crtAvailability = crtAvailability;
	exports.defaultUserAgent = defaultUserAgent;
	exports.emitWarningIfUnsupportedVersion = emitWarningIfUnsupportedVersion;
	exports.fallback = fallback;
	exports.getAwsRegionExtensionConfiguration = getAwsRegionExtensionConfiguration;
	exports.getHostHeaderPlugin = getHostHeaderPlugin;
	exports.getLoggerPlugin = getLoggerPlugin;
	exports.getLongPollPlugin = getLongPollPlugin;
	exports.getRecursionDetectionPlugin = getRecursionDetectionPlugin;
	exports.getUserAgentMiddlewareOptions = getUserAgentMiddlewareOptions;
	exports.getUserAgentPlugin = getUserAgentPlugin;
	exports.getUserAgentPrefix = getUserAgentPrefix;
	exports.hostHeaderMiddleware = hostHeaderMiddleware;
	exports.hostHeaderMiddlewareOptions = hostHeaderMiddlewareOptions;
	exports.isVirtualHostableS3Bucket = isVirtualHostableS3Bucket;
	exports.loggerMiddleware = loggerMiddleware;
	exports.loggerMiddlewareOptions = loggerMiddlewareOptions;
	exports.parseArn = parseArn;
	exports.partition = partition;
	exports.recursionDetectionMiddleware = recursionDetectionMiddleware;
	exports.recursionDetectionMiddlewareOptions = recursionDetectionMiddlewareOptions;
	exports.resolveAwsRegionExtensionConfiguration = resolveAwsRegionExtensionConfiguration;
	exports.resolveDefaultAwsRegionalEndpointsConfig = resolveDefaultAwsRegionalEndpointsConfig;
	exports.resolveHostHeaderConfig = resolveHostHeaderConfig;
	exports.resolveUserAgentConfig = resolveUserAgentConfig;
	exports.setCredentialFeature = setCredentialFeature;
	exports.setFeature = setFeature;
	exports.setPartitionInfo = setPartitionInfo;
	exports.setTokenFeature = setTokenFeature;
	exports.state = state;
	exports.stsRegionDefaultResolver = stsRegionDefaultResolver;
	exports.stsRegionWarning = warning;
	exports.toEndpointV1 = toEndpointV1;
	exports.useDefaultPartitionInfo = useDefaultPartitionInfo;
	exports.userAgentMiddleware = userAgentMiddleware;
}));
//#endregion
//#region node_modules/@smithy/signature-v4/dist-es/HeaderFormatter.js
function negate(bytes) {
	for (let i = 0; i < 8; i++) bytes[i] ^= 255;
	for (let i = 7; i > -1; i--) {
		bytes[i]++;
		if (bytes[i] !== 0) break;
	}
}
var import_serde$6, HeaderFormatter, HEADER_VALUE_TYPE, UUID_PATTERN, Int64;
var init_HeaderFormatter = __esmMin((() => {
	import_serde$6 = require_serde();
	HeaderFormatter = class {
		format(headers) {
			const chunks = [];
			for (const headerName of Object.keys(headers)) {
				const bytes = (0, import_serde$6.fromUtf8)(headerName);
				chunks.push(Uint8Array.from([bytes.byteLength]), bytes, this.formatHeaderValue(headers[headerName]));
			}
			const out = new Uint8Array(chunks.reduce((carry, bytes) => carry + bytes.byteLength, 0));
			let position = 0;
			for (const chunk of chunks) {
				out.set(chunk, position);
				position += chunk.byteLength;
			}
			return out;
		}
		formatHeaderValue(header) {
			switch (header.type) {
				case "boolean": return Uint8Array.from([header.value ? HEADER_VALUE_TYPE.boolTrue : HEADER_VALUE_TYPE.boolFalse]);
				case "byte": return Uint8Array.from([HEADER_VALUE_TYPE.byte, header.value]);
				case "short":
					const shortView = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(3));
					shortView.setUint8(0, HEADER_VALUE_TYPE.short);
					shortView.setInt16(1, header.value, false);
					return new Uint8Array(shortView.buffer);
				case "integer":
					const intView = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(5));
					intView.setUint8(0, HEADER_VALUE_TYPE.integer);
					intView.setInt32(1, header.value, false);
					return new Uint8Array(intView.buffer);
				case "long":
					const longBytes = /* @__PURE__ */ new Uint8Array(9);
					longBytes[0] = HEADER_VALUE_TYPE.long;
					longBytes.set(header.value.bytes, 1);
					return longBytes;
				case "binary":
					const binView = new DataView(new ArrayBuffer(3 + header.value.byteLength));
					binView.setUint8(0, HEADER_VALUE_TYPE.byteArray);
					binView.setUint16(1, header.value.byteLength, false);
					const binBytes = new Uint8Array(binView.buffer);
					binBytes.set(header.value, 3);
					return binBytes;
				case "string":
					const utf8Bytes = (0, import_serde$6.fromUtf8)(header.value);
					const strView = new DataView(new ArrayBuffer(3 + utf8Bytes.byteLength));
					strView.setUint8(0, HEADER_VALUE_TYPE.string);
					strView.setUint16(1, utf8Bytes.byteLength, false);
					const strBytes = new Uint8Array(strView.buffer);
					strBytes.set(utf8Bytes, 3);
					return strBytes;
				case "timestamp":
					const tsBytes = /* @__PURE__ */ new Uint8Array(9);
					tsBytes[0] = HEADER_VALUE_TYPE.timestamp;
					tsBytes.set(Int64.fromNumber(header.value.valueOf()).bytes, 1);
					return tsBytes;
				case "uuid":
					if (!UUID_PATTERN.test(header.value)) throw new Error(`Invalid UUID received: ${header.value}`);
					const uuidBytes = /* @__PURE__ */ new Uint8Array(17);
					uuidBytes[0] = HEADER_VALUE_TYPE.uuid;
					uuidBytes.set((0, import_serde$6.fromHex)(header.value.replace(/-/g, "")), 1);
					return uuidBytes;
			}
		}
	};
	(function(HEADER_VALUE_TYPE) {
		HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["boolTrue"] = 0] = "boolTrue";
		HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["boolFalse"] = 1] = "boolFalse";
		HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["byte"] = 2] = "byte";
		HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["short"] = 3] = "short";
		HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["integer"] = 4] = "integer";
		HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["long"] = 5] = "long";
		HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["byteArray"] = 6] = "byteArray";
		HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["string"] = 7] = "string";
		HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["timestamp"] = 8] = "timestamp";
		HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["uuid"] = 9] = "uuid";
	})(HEADER_VALUE_TYPE || (HEADER_VALUE_TYPE = {}));
	UUID_PATTERN = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
	Int64 = class Int64 {
		bytes;
		constructor(bytes) {
			this.bytes = bytes;
			if (bytes.byteLength !== 8) throw new Error("Int64 buffers must be exactly 8 bytes");
		}
		static fromNumber(number) {
			if (number > 0x8000000000000000 || number < -0x8000000000000000) throw new Error(`${number} is too large (or, if negative, too small) to represent as an Int64`);
			const bytes = /* @__PURE__ */ new Uint8Array(8);
			for (let i = 7, remaining = Math.abs(Math.round(number)); i > -1 && remaining > 0; i--, remaining /= 256) bytes[i] = remaining;
			if (number < 0) negate(bytes);
			return new Int64(bytes);
		}
		valueOf() {
			const bytes = this.bytes.slice(0);
			const negative = bytes[0] & 128;
			if (negative) negate(bytes);
			return parseInt((0, import_serde$6.toHex)(bytes), 16) * (negative ? -1 : 1);
		}
		toString() {
			return String(this.valueOf());
		}
	};
}));
//#endregion
//#region node_modules/@smithy/signature-v4/dist-es/constants.js
var ALGORITHM_QUERY_PARAM, CREDENTIAL_QUERY_PARAM, AMZ_DATE_QUERY_PARAM, SIGNED_HEADERS_QUERY_PARAM, EXPIRES_QUERY_PARAM, SIGNATURE_QUERY_PARAM, TOKEN_QUERY_PARAM, REGION_SET_PARAM, AUTH_HEADER, AMZ_DATE_HEADER, DATE_HEADER, GENERATED_HEADERS, SIGNATURE_HEADER, SHA256_HEADER, TOKEN_HEADER, HOST_HEADER, ALWAYS_UNSIGNABLE_HEADERS, PROXY_HEADER_PATTERN, SEC_HEADER_PATTERN, UNSIGNABLE_PATTERNS, ALGORITHM_IDENTIFIER, ALGORITHM_IDENTIFIER_V4A, EVENT_ALGORITHM_IDENTIFIER, UNSIGNED_PAYLOAD, KEY_TYPE_IDENTIFIER, MAX_PRESIGNED_TTL;
var init_constants$1 = __esmMin((() => {
	ALGORITHM_QUERY_PARAM = "X-Amz-Algorithm";
	CREDENTIAL_QUERY_PARAM = "X-Amz-Credential";
	AMZ_DATE_QUERY_PARAM = "X-Amz-Date";
	SIGNED_HEADERS_QUERY_PARAM = "X-Amz-SignedHeaders";
	EXPIRES_QUERY_PARAM = "X-Amz-Expires";
	SIGNATURE_QUERY_PARAM = "X-Amz-Signature";
	TOKEN_QUERY_PARAM = "X-Amz-Security-Token";
	REGION_SET_PARAM = "X-Amz-Region-Set";
	AUTH_HEADER = "authorization";
	AMZ_DATE_HEADER = AMZ_DATE_QUERY_PARAM.toLowerCase();
	DATE_HEADER = "date";
	GENERATED_HEADERS = [
		AUTH_HEADER,
		AMZ_DATE_HEADER,
		DATE_HEADER
	];
	SIGNATURE_HEADER = SIGNATURE_QUERY_PARAM.toLowerCase();
	SHA256_HEADER = "x-amz-content-sha256";
	TOKEN_HEADER = TOKEN_QUERY_PARAM.toLowerCase();
	HOST_HEADER = "host";
	ALWAYS_UNSIGNABLE_HEADERS = {
		authorization: true,
		"cache-control": true,
		connection: true,
		expect: true,
		from: true,
		"keep-alive": true,
		"max-forwards": true,
		pragma: true,
		referer: true,
		te: true,
		trailer: true,
		"transfer-encoding": true,
		upgrade: true,
		"user-agent": true,
		"x-amzn-trace-id": true
	};
	PROXY_HEADER_PATTERN = /^proxy-/;
	SEC_HEADER_PATTERN = /^sec-/;
	UNSIGNABLE_PATTERNS = [/^proxy-/i, /^sec-/i];
	ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256";
	ALGORITHM_IDENTIFIER_V4A = "AWS4-ECDSA-P256-SHA256";
	EVENT_ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256-PAYLOAD";
	UNSIGNED_PAYLOAD = "UNSIGNED-PAYLOAD";
	KEY_TYPE_IDENTIFIER = "aws4_request";
	MAX_PRESIGNED_TTL = 3600 * 24 * 7;
}));
//#endregion
//#region node_modules/@smithy/signature-v4/dist-es/getCanonicalQuery.js
var import_protocols$7, getCanonicalQuery;
var init_getCanonicalQuery = __esmMin((() => {
	import_protocols$7 = require_protocols$1();
	init_constants$1();
	getCanonicalQuery = ({ query = {} }) => {
		const keys = [];
		const serialized = {};
		for (const key of Object.keys(query)) {
			if (key.toLowerCase() === "x-amz-signature") continue;
			const encodedKey = (0, import_protocols$7.escapeUri)(key);
			keys.push(encodedKey);
			const value = query[key];
			if (typeof value === "string") serialized[encodedKey] = `${encodedKey}=${(0, import_protocols$7.escapeUri)(value)}`;
			else if (Array.isArray(value)) serialized[encodedKey] = value.slice(0).reduce((encoded, value) => encoded.concat([`${encodedKey}=${(0, import_protocols$7.escapeUri)(value)}`]), []).sort().join("&");
		}
		return keys.sort().map((key) => serialized[key]).filter((serialized) => serialized).join("&");
	};
}));
//#endregion
//#region node_modules/@smithy/signature-v4/dist-es/utilDate.js
var iso8601, toDate;
var init_utilDate = __esmMin((() => {
	iso8601 = (time) => toDate(time).toISOString().replace(/\.\d{3}Z$/, "Z");
	toDate = (time) => {
		if (typeof time === "number") return /* @__PURE__ */ new Date(time * 1e3);
		if (typeof time === "string") {
			if (Number(time)) return /* @__PURE__ */ new Date(Number(time) * 1e3);
			return new Date(time);
		}
		return time;
	};
}));
//#endregion
//#region node_modules/@smithy/signature-v4/dist-es/SignatureV4Base.js
var import_client$2, import_protocols$6, import_serde$5, SignatureV4Base;
var init_SignatureV4Base = __esmMin((() => {
	import_client$2 = require_client$1();
	import_protocols$6 = require_protocols$1();
	import_serde$5 = require_serde();
	init_getCanonicalQuery();
	init_utilDate();
	SignatureV4Base = class {
		service;
		regionProvider;
		credentialProvider;
		sha256;
		uriEscapePath;
		applyChecksum;
		constructor({ applyChecksum, credentials, region, service, sha256, uriEscapePath = true }) {
			this.service = service;
			this.sha256 = sha256;
			this.uriEscapePath = uriEscapePath;
			this.applyChecksum = typeof applyChecksum === "boolean" ? applyChecksum : true;
			this.regionProvider = (0, import_client$2.normalizeProvider)(region);
			this.credentialProvider = (0, import_client$2.normalizeProvider)(credentials);
		}
		createCanonicalRequest(request, canonicalHeaders, payloadHash) {
			const sortedHeaders = Object.keys(canonicalHeaders).sort();
			return `${request.method}
${this.getCanonicalPath(request)}
${getCanonicalQuery(request)}
${sortedHeaders.map((name) => `${name}:${canonicalHeaders[name]}`).join("\n")}

${sortedHeaders.join(";")}
${payloadHash}`;
		}
		async createStringToSign(longDate, credentialScope, canonicalRequest, algorithmIdentifier) {
			const hash = new this.sha256();
			hash.update((0, import_serde$5.toUint8Array)(canonicalRequest));
			return `${algorithmIdentifier}
${longDate}
${credentialScope}
${(0, import_serde$5.toHex)(await hash.digest())}`;
		}
		getCanonicalPath({ path }) {
			if (this.uriEscapePath) {
				const normalizedPathSegments = [];
				for (const pathSegment of path.split("/")) {
					if (pathSegment?.length === 0) continue;
					if (pathSegment === ".") continue;
					if (pathSegment === "..") normalizedPathSegments.pop();
					else normalizedPathSegments.push(pathSegment);
				}
				return (0, import_protocols$6.escapeUri)(`${path?.startsWith("/") ? "/" : ""}${normalizedPathSegments.join("/")}${normalizedPathSegments.length > 0 && path?.endsWith("/") ? "/" : ""}`).replace(/%2F/g, "/");
			}
			return path;
		}
		validateResolvedCredentials(credentials) {
			if (typeof credentials !== "object" || typeof credentials.accessKeyId !== "string" || typeof credentials.secretAccessKey !== "string") throw new Error("Resolved credential object is not valid");
		}
		formatDate(now) {
			const longDate = iso8601(now).replace(/[-:]/g, "");
			return {
				longDate,
				shortDate: longDate.slice(0, 8)
			};
		}
		getCanonicalHeaderList(headers) {
			return Object.keys(headers).sort().join(";");
		}
	};
}));
//#endregion
//#region node_modules/@smithy/signature-v4/dist-es/credentialDerivation.js
var import_serde$4, signingKeyCache, cacheQueue, createScope, getSigningKey, clearCredentialCache, hmac;
var init_credentialDerivation = __esmMin((() => {
	import_serde$4 = require_serde();
	init_constants$1();
	signingKeyCache = {};
	cacheQueue = [];
	createScope = (shortDate, region, service) => `${shortDate}/${region}/${service}/${KEY_TYPE_IDENTIFIER}`;
	getSigningKey = async (sha256Constructor, credentials, shortDate, region, service) => {
		const cacheKey = `${shortDate}:${region}:${service}:${(0, import_serde$4.toHex)(await hmac(sha256Constructor, credentials.secretAccessKey, credentials.accessKeyId))}:${credentials.sessionToken}`;
		if (cacheKey in signingKeyCache) return signingKeyCache[cacheKey];
		cacheQueue.push(cacheKey);
		while (cacheQueue.length > 50) delete signingKeyCache[cacheQueue.shift()];
		let key = `AWS4${credentials.secretAccessKey}`;
		for (const signable of [
			shortDate,
			region,
			service,
			KEY_TYPE_IDENTIFIER
		]) key = await hmac(sha256Constructor, key, signable);
		return signingKeyCache[cacheKey] = key;
	};
	clearCredentialCache = () => {
		cacheQueue.length = 0;
		Object.keys(signingKeyCache).forEach((cacheKey) => {
			delete signingKeyCache[cacheKey];
		});
	};
	hmac = (ctor, secret, data) => {
		const hash = new ctor(secret);
		hash.update((0, import_serde$4.toUint8Array)(data));
		return hash.digest();
	};
}));
//#endregion
//#region node_modules/@smithy/signature-v4/dist-es/getCanonicalHeaders.js
var getCanonicalHeaders;
var init_getCanonicalHeaders = __esmMin((() => {
	init_constants$1();
	getCanonicalHeaders = ({ headers }, unsignableHeaders, signableHeaders) => {
		const canonical = {};
		for (const headerName of Object.keys(headers).sort()) {
			if (headers[headerName] == void 0) continue;
			const canonicalHeaderName = headerName.toLowerCase();
			if (canonicalHeaderName in ALWAYS_UNSIGNABLE_HEADERS || unsignableHeaders?.has(canonicalHeaderName) || PROXY_HEADER_PATTERN.test(canonicalHeaderName) || SEC_HEADER_PATTERN.test(canonicalHeaderName)) {
				if (!signableHeaders || signableHeaders && !signableHeaders.has(canonicalHeaderName)) continue;
			}
			canonical[canonicalHeaderName] = headers[headerName].trim().replace(/\s+/g, " ");
		}
		return canonical;
	};
}));
//#endregion
//#region node_modules/@smithy/signature-v4/dist-es/getPayloadHash.js
var import_serde$3, getPayloadHash;
var init_getPayloadHash = __esmMin((() => {
	import_serde$3 = require_serde();
	init_constants$1();
	getPayloadHash = async ({ headers, body }, hashConstructor) => {
		for (const headerName of Object.keys(headers)) if (headerName.toLowerCase() === "x-amz-content-sha256") return headers[headerName];
		if (body == void 0) return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
		else if (typeof body === "string" || ArrayBuffer.isView(body) || (0, import_serde$3.isArrayBuffer)(body)) {
			const hashCtor = new hashConstructor();
			hashCtor.update((0, import_serde$3.toUint8Array)(body));
			return (0, import_serde$3.toHex)(await hashCtor.digest());
		}
		return UNSIGNED_PAYLOAD;
	};
}));
//#endregion
//#region node_modules/@smithy/signature-v4/dist-es/headerUtil.js
var hasHeader;
var init_headerUtil = __esmMin((() => {
	hasHeader = (soughtHeader, headers) => {
		soughtHeader = soughtHeader.toLowerCase();
		for (const headerName of Object.keys(headers)) if (soughtHeader === headerName.toLowerCase()) return true;
		return false;
	};
}));
//#endregion
//#region node_modules/@smithy/signature-v4/dist-es/moveHeadersToQuery.js
var import_protocols$5, moveHeadersToQuery;
var init_moveHeadersToQuery = __esmMin((() => {
	import_protocols$5 = require_protocols$1();
	moveHeadersToQuery = (request, options = {}) => {
		const { headers, query = {} } = import_protocols$5.HttpRequest.clone(request);
		for (const name of Object.keys(headers)) {
			const lname = name.toLowerCase();
			if (lname.slice(0, 6) === "x-amz-" && !options.unhoistableHeaders?.has(lname) || options.hoistableHeaders?.has(lname)) {
				query[name] = headers[name];
				delete headers[name];
			}
		}
		return {
			...request,
			headers,
			query
		};
	};
}));
//#endregion
//#region node_modules/@smithy/signature-v4/dist-es/prepareRequest.js
var import_protocols$4, prepareRequest;
var init_prepareRequest = __esmMin((() => {
	import_protocols$4 = require_protocols$1();
	init_constants$1();
	prepareRequest = (request) => {
		request = import_protocols$4.HttpRequest.clone(request);
		for (const headerName of Object.keys(request.headers)) if (GENERATED_HEADERS.indexOf(headerName.toLowerCase()) > -1) delete request.headers[headerName];
		return request;
	};
}));
//#endregion
//#region node_modules/@smithy/signature-v4/dist-es/SignatureV4.js
var import_serde$2, SignatureV4;
var init_SignatureV4 = __esmMin((() => {
	import_serde$2 = require_serde();
	init_HeaderFormatter();
	init_SignatureV4Base();
	init_constants$1();
	init_credentialDerivation();
	init_getCanonicalHeaders();
	init_getPayloadHash();
	init_headerUtil();
	init_moveHeadersToQuery();
	init_prepareRequest();
	SignatureV4 = class extends SignatureV4Base {
		headerFormatter = new HeaderFormatter();
		constructor({ applyChecksum, credentials, region, service, sha256, uriEscapePath = true }) {
			super({
				applyChecksum,
				credentials,
				region,
				service,
				sha256,
				uriEscapePath
			});
		}
		async presign(originalRequest, options = {}) {
			const { signingDate = /* @__PURE__ */ new Date(), expiresIn = 3600, unsignableHeaders, unhoistableHeaders, signableHeaders, hoistableHeaders, signingRegion, signingService } = options;
			const credentials = await this.credentialProvider();
			this.validateResolvedCredentials(credentials);
			const region = signingRegion ?? await this.regionProvider();
			const { longDate, shortDate } = this.formatDate(signingDate);
			if (expiresIn > 604800) return Promise.reject("Signature version 4 presigned URLs must have an expiration date less than one week in the future");
			const scope = createScope(shortDate, region, signingService ?? this.service);
			const request = moveHeadersToQuery(prepareRequest(originalRequest), {
				unhoistableHeaders,
				hoistableHeaders
			});
			if (credentials.sessionToken) request.query[TOKEN_QUERY_PARAM] = credentials.sessionToken;
			request.query[ALGORITHM_QUERY_PARAM] = ALGORITHM_IDENTIFIER;
			request.query[CREDENTIAL_QUERY_PARAM] = `${credentials.accessKeyId}/${scope}`;
			request.query[AMZ_DATE_QUERY_PARAM] = longDate;
			request.query[EXPIRES_QUERY_PARAM] = expiresIn.toString(10);
			const canonicalHeaders = getCanonicalHeaders(request, unsignableHeaders, signableHeaders);
			request.query[SIGNED_HEADERS_QUERY_PARAM] = this.getCanonicalHeaderList(canonicalHeaders);
			request.query[SIGNATURE_QUERY_PARAM] = await this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request, canonicalHeaders, await getPayloadHash(originalRequest, this.sha256)));
			return request;
		}
		async sign(toSign, options) {
			if (typeof toSign === "string") return this.signString(toSign, options);
			else if (toSign.headers && toSign.payload) return this.signEvent(toSign, options);
			else if (toSign.message) return this.signMessage(toSign, options);
			else return this.signRequest(toSign, options);
		}
		async signEvent({ headers, payload }, { signingDate = /* @__PURE__ */ new Date(), priorSignature, signingRegion, signingService, eventStreamCredentials }) {
			const region = signingRegion ?? await this.regionProvider();
			const { shortDate, longDate } = this.formatDate(signingDate);
			const scope = createScope(shortDate, region, signingService ?? this.service);
			const hashedPayload = await getPayloadHash({
				headers: {},
				body: payload
			}, this.sha256);
			const hash = new this.sha256();
			hash.update(headers);
			const stringToSign = [
				EVENT_ALGORITHM_IDENTIFIER,
				longDate,
				scope,
				priorSignature,
				(0, import_serde$2.toHex)(await hash.digest()),
				hashedPayload
			].join("\n");
			return this.signString(stringToSign, {
				signingDate,
				signingRegion: region,
				signingService,
				eventStreamCredentials
			});
		}
		async signMessage(signableMessage, { signingDate = /* @__PURE__ */ new Date(), signingRegion, signingService, eventStreamCredentials }) {
			return this.signEvent({
				headers: this.headerFormatter.format(signableMessage.message.headers),
				payload: signableMessage.message.body
			}, {
				signingDate,
				signingRegion,
				signingService,
				priorSignature: signableMessage.priorSignature,
				eventStreamCredentials
			}).then((signature) => {
				return {
					message: signableMessage.message,
					signature
				};
			});
		}
		async signString(stringToSign, { signingDate = /* @__PURE__ */ new Date(), signingRegion, signingService, eventStreamCredentials } = {}) {
			const credentials = eventStreamCredentials ?? await this.credentialProvider();
			this.validateResolvedCredentials(credentials);
			const region = signingRegion ?? await this.regionProvider();
			const { shortDate } = this.formatDate(signingDate);
			const hash = new this.sha256(await this.getSigningKey(credentials, region, shortDate, signingService));
			hash.update((0, import_serde$2.toUint8Array)(stringToSign));
			return (0, import_serde$2.toHex)(await hash.digest());
		}
		async signRequest(requestToSign, { signingDate = /* @__PURE__ */ new Date(), signableHeaders, unsignableHeaders, signingRegion, signingService } = {}) {
			const credentials = await this.credentialProvider();
			this.validateResolvedCredentials(credentials);
			const region = signingRegion ?? await this.regionProvider();
			const request = prepareRequest(requestToSign);
			const { longDate, shortDate } = this.formatDate(signingDate);
			const scope = createScope(shortDate, region, signingService ?? this.service);
			request.headers[AMZ_DATE_HEADER] = longDate;
			if (credentials.sessionToken) request.headers[TOKEN_HEADER] = credentials.sessionToken;
			const payloadHash = await getPayloadHash(request, this.sha256);
			if (!hasHeader("x-amz-content-sha256", request.headers) && this.applyChecksum) request.headers[SHA256_HEADER] = payloadHash;
			const canonicalHeaders = getCanonicalHeaders(request, unsignableHeaders, signableHeaders);
			const signature = await this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request, canonicalHeaders, payloadHash));
			request.headers[AUTH_HEADER] = `${ALGORITHM_IDENTIFIER} Credential=${credentials.accessKeyId}/${scope}, SignedHeaders=${this.getCanonicalHeaderList(canonicalHeaders)}, Signature=${signature}`;
			return request;
		}
		async getSignature(longDate, credentialScope, keyPromise, canonicalRequest) {
			const stringToSign = await this.createStringToSign(longDate, credentialScope, canonicalRequest, ALGORITHM_IDENTIFIER);
			const hash = new this.sha256(await keyPromise);
			hash.update((0, import_serde$2.toUint8Array)(stringToSign));
			return (0, import_serde$2.toHex)(await hash.digest());
		}
		getSigningKey(credentials, region, shortDate, service) {
			return getSigningKey(this.sha256, credentials, shortDate, region, service || this.service);
		}
	};
}));
//#endregion
//#region node_modules/@smithy/signature-v4/dist-es/signature-v4a-container.js
var signatureV4aContainer;
var init_signature_v4a_container = __esmMin((() => {
	signatureV4aContainer = { SignatureV4a: null };
}));
//#endregion
//#region node_modules/@smithy/signature-v4/dist-es/index.js
var dist_es_exports$4 = /* @__PURE__ */ __exportAll({
	ALGORITHM_IDENTIFIER: () => ALGORITHM_IDENTIFIER,
	ALGORITHM_IDENTIFIER_V4A: () => ALGORITHM_IDENTIFIER_V4A,
	ALGORITHM_QUERY_PARAM: () => ALGORITHM_QUERY_PARAM,
	ALWAYS_UNSIGNABLE_HEADERS: () => ALWAYS_UNSIGNABLE_HEADERS,
	AMZ_DATE_HEADER: () => AMZ_DATE_HEADER,
	AMZ_DATE_QUERY_PARAM: () => AMZ_DATE_QUERY_PARAM,
	AUTH_HEADER: () => AUTH_HEADER,
	CREDENTIAL_QUERY_PARAM: () => CREDENTIAL_QUERY_PARAM,
	DATE_HEADER: () => DATE_HEADER,
	EVENT_ALGORITHM_IDENTIFIER: () => EVENT_ALGORITHM_IDENTIFIER,
	EXPIRES_QUERY_PARAM: () => EXPIRES_QUERY_PARAM,
	GENERATED_HEADERS: () => GENERATED_HEADERS,
	HOST_HEADER: () => HOST_HEADER,
	KEY_TYPE_IDENTIFIER: () => KEY_TYPE_IDENTIFIER,
	MAX_CACHE_SIZE: () => 50,
	MAX_PRESIGNED_TTL: () => MAX_PRESIGNED_TTL,
	PROXY_HEADER_PATTERN: () => PROXY_HEADER_PATTERN,
	REGION_SET_PARAM: () => REGION_SET_PARAM,
	SEC_HEADER_PATTERN: () => SEC_HEADER_PATTERN,
	SHA256_HEADER: () => SHA256_HEADER,
	SIGNATURE_HEADER: () => SIGNATURE_HEADER,
	SIGNATURE_QUERY_PARAM: () => SIGNATURE_QUERY_PARAM,
	SIGNED_HEADERS_QUERY_PARAM: () => SIGNED_HEADERS_QUERY_PARAM,
	SignatureV4: () => SignatureV4,
	SignatureV4Base: () => SignatureV4Base,
	TOKEN_HEADER: () => TOKEN_HEADER,
	TOKEN_QUERY_PARAM: () => TOKEN_QUERY_PARAM,
	UNSIGNABLE_PATTERNS: () => UNSIGNABLE_PATTERNS,
	UNSIGNED_PAYLOAD: () => UNSIGNED_PAYLOAD,
	clearCredentialCache: () => clearCredentialCache,
	createScope: () => createScope,
	getCanonicalHeaders: () => getCanonicalHeaders,
	getCanonicalQuery: () => getCanonicalQuery,
	getPayloadHash: () => getPayloadHash,
	getSigningKey: () => getSigningKey,
	hasHeader: () => hasHeader,
	moveHeadersToQuery: () => moveHeadersToQuery,
	prepareRequest: () => prepareRequest,
	signatureV4aContainer: () => signatureV4aContainer
});
var init_dist_es$2 = __esmMin((() => {
	init_SignatureV4();
	init_constants$1();
	init_getCanonicalHeaders();
	init_getCanonicalQuery();
	init_getPayloadHash();
	init_moveHeadersToQuery();
	init_prepareRequest();
	init_credentialDerivation();
	init_SignatureV4Base();
	init_headerUtil();
	init_signature_v4a_container();
}));
//#endregion
//#region node_modules/@aws-sdk/core/dist-cjs/submodules/httpAuthSchemes/index.js
var require_httpAuthSchemes = /* @__PURE__ */ __commonJSMin(((exports) => {
	var { HttpResponse, HttpRequest } = require_protocols$1();
	var { normalizeProvider, memoizeIdentityProvider, isIdentityExpired, doesIdentityRequireRefresh } = require_dist_cjs();
	var { ProviderError } = require_config();
	var { setCredentialFeature } = require_client();
	var { SignatureV4 } = (init_dist_es$2(), __toCommonJS(dist_es_exports$4));
	var getDateHeader = (response) => HttpResponse.isInstance(response) ? response.headers?.date ?? response.headers?.Date : void 0;
	var getSkewCorrectedDate = (systemClockOffset) => new Date(Date.now() + systemClockOffset);
	var isClockSkewed = (clockTime, systemClockOffset) => Math.abs(getSkewCorrectedDate(systemClockOffset).getTime() - clockTime) >= 3e5;
	var getUpdatedSystemClockOffset = (clockTime, currentSystemClockOffset) => {
		const clockTimeInMs = Date.parse(clockTime);
		if (isClockSkewed(clockTimeInMs, currentSystemClockOffset)) return clockTimeInMs - Date.now();
		return currentSystemClockOffset;
	};
	var throwSigningPropertyError = (name, property) => {
		if (!property) throw new Error(`Property \`${name}\` is not resolved for AWS SDK SigV4Auth`);
		return property;
	};
	var validateSigningProperties = async (signingProperties) => {
		const context = throwSigningPropertyError("context", signingProperties.context);
		const config = throwSigningPropertyError("config", signingProperties.config);
		const authScheme = context.endpointV2?.properties?.authSchemes?.[0];
		return {
			config,
			signer: await throwSigningPropertyError("signer", config.signer)(authScheme),
			signingRegion: signingProperties?.signingRegion,
			signingRegionSet: signingProperties?.signingRegionSet,
			signingName: signingProperties?.signingName
		};
	};
	var AwsSdkSigV4Signer = class {
		async sign(httpRequest, identity, signingProperties) {
			if (!HttpRequest.isInstance(httpRequest)) throw new Error("The request is not an instance of `HttpRequest` and cannot be signed");
			const validatedProps = await validateSigningProperties(signingProperties);
			const { config, signer } = validatedProps;
			let { signingRegion, signingName } = validatedProps;
			const handlerExecutionContext = signingProperties.context;
			if (handlerExecutionContext?.authSchemes?.length ?? false) {
				const [first, second] = handlerExecutionContext.authSchemes;
				if (first?.name === "sigv4a" && second?.name === "sigv4") {
					signingRegion = second?.signingRegion ?? signingRegion;
					signingName = second?.signingName ?? signingName;
				}
			}
			signingProperties._preRequestSystemClockOffset = config.systemClockOffset;
			return await signer.sign(httpRequest, {
				signingDate: getSkewCorrectedDate(config.systemClockOffset),
				signingRegion,
				signingService: signingName
			});
		}
		errorHandler(signingProperties) {
			return (error) => {
				const errorException = error;
				const serverTime = errorException.ServerTime ?? getDateHeader(errorException.$response);
				if (serverTime) {
					const config = throwSigningPropertyError("config", signingProperties.config);
					const preRequestOffset = signingProperties._preRequestSystemClockOffset;
					const newOffset = getUpdatedSystemClockOffset(serverTime, config.systemClockOffset);
					if ((newOffset !== config.systemClockOffset || preRequestOffset !== void 0 && preRequestOffset !== newOffset) && errorException.$metadata) {
						config.systemClockOffset = newOffset;
						errorException.$metadata.clockSkewCorrected = true;
					}
				}
				throw error;
			};
		}
		successHandler(httpResponse, signingProperties) {
			const dateHeader = getDateHeader(httpResponse);
			if (dateHeader) {
				const config = throwSigningPropertyError("config", signingProperties.config);
				config.systemClockOffset = getUpdatedSystemClockOffset(dateHeader, config.systemClockOffset);
			}
		}
	};
	var AWSSDKSigV4Signer = AwsSdkSigV4Signer;
	var AwsSdkSigV4ASigner = class extends AwsSdkSigV4Signer {
		async sign(httpRequest, identity, signingProperties) {
			if (!HttpRequest.isInstance(httpRequest)) throw new Error("The request is not an instance of `HttpRequest` and cannot be signed");
			const { config, signer, signingRegion, signingRegionSet, signingName } = await validateSigningProperties(signingProperties);
			const multiRegionOverride = (await config.sigv4aSigningRegionSet?.() ?? signingRegionSet ?? [signingRegion]).join(",");
			signingProperties._preRequestSystemClockOffset = config.systemClockOffset;
			return await signer.sign(httpRequest, {
				signingDate: getSkewCorrectedDate(config.systemClockOffset),
				signingRegion: multiRegionOverride,
				signingService: signingName
			});
		}
	};
	var getArrayForCommaSeparatedString = (str) => typeof str === "string" && str.length > 0 ? str.split(",").map((item) => item.trim()) : [];
	var getBearerTokenEnvKey = (signingName) => `AWS_BEARER_TOKEN_${signingName.replace(/[\s-]/g, "_").toUpperCase()}`;
	var NODE_AUTH_SCHEME_PREFERENCE_ENV_KEY = "AWS_AUTH_SCHEME_PREFERENCE";
	var NODE_AUTH_SCHEME_PREFERENCE_CONFIG_KEY = "auth_scheme_preference";
	var NODE_AUTH_SCHEME_PREFERENCE_OPTIONS = {
		environmentVariableSelector: (env, options) => {
			if (options?.signingName) {
				if (getBearerTokenEnvKey(options.signingName) in env) return ["httpBearerAuth"];
			}
			if (!(NODE_AUTH_SCHEME_PREFERENCE_ENV_KEY in env)) return void 0;
			return getArrayForCommaSeparatedString(env[NODE_AUTH_SCHEME_PREFERENCE_ENV_KEY]);
		},
		configFileSelector: (profile) => {
			if (!(NODE_AUTH_SCHEME_PREFERENCE_CONFIG_KEY in profile)) return void 0;
			return getArrayForCommaSeparatedString(profile[NODE_AUTH_SCHEME_PREFERENCE_CONFIG_KEY]);
		},
		default: []
	};
	var resolveAwsSdkSigV4AConfig = (config) => {
		config.sigv4aSigningRegionSet = normalizeProvider(config.sigv4aSigningRegionSet);
		return config;
	};
	var NODE_SIGV4A_CONFIG_OPTIONS = {
		environmentVariableSelector(env) {
			if (env.AWS_SIGV4A_SIGNING_REGION_SET) return env.AWS_SIGV4A_SIGNING_REGION_SET.split(",").map((_) => _.trim());
			throw new ProviderError("AWS_SIGV4A_SIGNING_REGION_SET not set in env.", { tryNextLink: true });
		},
		configFileSelector(profile) {
			if (profile.sigv4a_signing_region_set) return (profile.sigv4a_signing_region_set ?? "").split(",").map((_) => _.trim());
			throw new ProviderError("sigv4a_signing_region_set not set in profile.", { tryNextLink: true });
		},
		default: void 0
	};
	var resolveAwsSdkSigV4Config = (config) => {
		let inputCredentials = config.credentials;
		let isUserSupplied = !!config.credentials;
		let resolvedCredentials = void 0;
		Object.defineProperty(config, "credentials", {
			set(credentials) {
				if (credentials && credentials !== inputCredentials && credentials !== resolvedCredentials) isUserSupplied = true;
				inputCredentials = credentials;
				const boundProvider = bindCallerConfig(config, normalizeCredentialProvider(config, {
					credentials: inputCredentials,
					credentialDefaultProvider: config.credentialDefaultProvider
				}));
				if (isUserSupplied && !boundProvider.attributed) {
					const isCredentialObject = typeof inputCredentials === "object" && inputCredentials !== null;
					resolvedCredentials = async (options) => {
						const attributedCreds = await boundProvider(options);
						if (isCredentialObject && (!attributedCreds.$source || Object.keys(attributedCreds.$source).length === 0)) return setCredentialFeature(attributedCreds, "CREDENTIALS_CODE", "e");
						return attributedCreds;
					};
					resolvedCredentials.memoized = boundProvider.memoized;
					resolvedCredentials.configBound = boundProvider.configBound;
					resolvedCredentials.attributed = true;
				} else resolvedCredentials = boundProvider;
			},
			get() {
				return resolvedCredentials;
			},
			enumerable: true,
			configurable: true
		});
		config.credentials = inputCredentials;
		const { signingEscapePath = true, systemClockOffset = config.systemClockOffset || 0, sha256 } = config;
		let signer;
		if (config.signer) signer = normalizeProvider(config.signer);
		else if (config.regionInfoProvider) signer = () => normalizeProvider(config.region)().then(async (region) => [await config.regionInfoProvider(region, {
			useFipsEndpoint: await config.useFipsEndpoint(),
			useDualstackEndpoint: await config.useDualstackEndpoint()
		}) || {}, region]).then(([regionInfo, region]) => {
			const { signingRegion, signingService } = regionInfo;
			config.signingRegion = config.signingRegion || signingRegion || region;
			config.signingName = config.signingName || signingService || config.serviceId;
			const params = {
				...config,
				credentials: config.credentials,
				region: config.signingRegion,
				service: config.signingName,
				sha256,
				uriEscapePath: signingEscapePath
			};
			return new (config.signerConstructor || SignatureV4)(params);
		});
		else signer = async (authScheme) => {
			authScheme = Object.assign({}, {
				name: "sigv4",
				signingName: config.signingName || config.defaultSigningName,
				signingRegion: await normalizeProvider(config.region)(),
				properties: {}
			}, authScheme);
			const signingRegion = authScheme.signingRegion;
			const signingService = authScheme.signingName;
			config.signingRegion = config.signingRegion || signingRegion;
			config.signingName = config.signingName || signingService || config.serviceId;
			const params = {
				...config,
				credentials: config.credentials,
				region: config.signingRegion,
				service: config.signingName,
				sha256,
				uriEscapePath: signingEscapePath
			};
			return new (config.signerConstructor || SignatureV4)(params);
		};
		return Object.assign(config, {
			systemClockOffset,
			signingEscapePath,
			signer
		});
	};
	var resolveAWSSDKSigV4Config = resolveAwsSdkSigV4Config;
	function normalizeCredentialProvider(config, { credentials, credentialDefaultProvider }) {
		let credentialsProvider;
		if (credentials) if (!credentials?.memoized) credentialsProvider = memoizeIdentityProvider(credentials, isIdentityExpired, doesIdentityRequireRefresh);
		else credentialsProvider = credentials;
		else if (credentialDefaultProvider) credentialsProvider = normalizeProvider(credentialDefaultProvider(Object.assign({}, config, { parentClientConfig: config })));
		else credentialsProvider = async () => {
			throw new Error("@aws-sdk/core::resolveAwsSdkSigV4Config - `credentials` not provided and no credentialDefaultProvider was configured.");
		};
		credentialsProvider.memoized = true;
		return credentialsProvider;
	}
	function bindCallerConfig(config, credentialsProvider) {
		if (credentialsProvider.configBound) return credentialsProvider;
		const fn = async (options) => credentialsProvider({
			...options,
			callerClientConfig: config
		});
		fn.memoized = credentialsProvider.memoized;
		fn.configBound = true;
		return fn;
	}
	exports.AWSSDKSigV4Signer = AWSSDKSigV4Signer;
	exports.AwsSdkSigV4ASigner = AwsSdkSigV4ASigner;
	exports.AwsSdkSigV4Signer = AwsSdkSigV4Signer;
	exports.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS = NODE_AUTH_SCHEME_PREFERENCE_OPTIONS;
	exports.NODE_SIGV4A_CONFIG_OPTIONS = NODE_SIGV4A_CONFIG_OPTIONS;
	exports.getBearerTokenEnvKey = getBearerTokenEnvKey;
	exports.resolveAWSSDKSigV4Config = resolveAWSSDKSigV4Config;
	exports.resolveAwsSdkSigV4AConfig = resolveAwsSdkSigV4AConfig;
	exports.resolveAwsSdkSigV4Config = resolveAwsSdkSigV4Config;
	exports.validateSigningProperties = validateSigningProperties;
}));
//#endregion
//#region node_modules/@aws-sdk/client-ses/dist-es/auth/httpAuthSchemeProvider.js
var import_schema = require_schema();
var import_config = require_config();
var import_endpoints = require_endpoints();
var import_retry = require_retry();
var import_dist_cjs = require_dist_cjs();
var import_client = require_client();
var import_httpAuthSchemes = require_httpAuthSchemes();
var import_client$1 = require_client$1();
var defaultSESHttpAuthSchemeParametersProvider = async (config, context, input) => {
	return {
		operation: (0, import_client$1.getSmithyContext)(context).operation,
		region: await (0, import_client$1.normalizeProvider)(config.region)() || (() => {
			throw new Error("expected `region` to be configured for `aws.auth#sigv4`");
		})()
	};
};
function createAwsAuthSigv4HttpAuthOption(authParameters) {
	return {
		schemeId: "aws.auth#sigv4",
		signingProperties: {
			name: "ses",
			region: authParameters.region
		},
		propertiesExtractor: (config, context) => ({ signingProperties: {
			config,
			context
		} })
	};
}
var defaultSESHttpAuthSchemeProvider = (authParameters) => {
	const options = [];
	switch (authParameters.operation) {
		default: options.push(createAwsAuthSigv4HttpAuthOption(authParameters));
	}
	return options;
};
var resolveHttpAuthSchemeConfig = (config) => {
	const config_0 = (0, import_httpAuthSchemes.resolveAwsSdkSigV4Config)(config);
	return Object.assign(config_0, { authSchemePreference: (0, import_client$1.normalizeProvider)(config.authSchemePreference ?? []) });
};
//#endregion
//#region node_modules/@aws-sdk/client-ses/dist-es/endpoint/EndpointParameters.js
var resolveClientEndpointParameters = (options) => {
	return Object.assign(options, {
		useDualstackEndpoint: options.useDualstackEndpoint ?? false,
		useFipsEndpoint: options.useFipsEndpoint ?? false,
		defaultSigningName: "ses"
	});
};
var commonParams = {
	UseFIPS: {
		type: "builtInParams",
		name: "useFipsEndpoint"
	},
	Endpoint: {
		type: "builtInParams",
		name: "endpoint"
	},
	Region: {
		type: "builtInParams",
		name: "region"
	},
	UseDualStack: {
		type: "builtInParams",
		name: "useDualstackEndpoint"
	}
};
var package_default = {
	name: "@aws-sdk/client-ses",
	version: "3.1091.0",
	description: "AWS SDK for JavaScript Ses Client for Node.js, Browser and React Native",
	homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-ses",
	license: "Apache-2.0",
	author: {
		"name": "AWS SDK for JavaScript Team",
		"url": "https://aws.amazon.com/sdk-for-javascript/"
	},
	repository: {
		"type": "git",
		"url": "https://github.com/aws/aws-sdk-js-v3.git",
		"directory": "clients/client-ses"
	},
	files: ["dist-*/**"],
	sideEffects: false,
	main: "./dist-cjs/index.js",
	module: "./dist-es/index.js",
	browser: { "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser" },
	types: "./dist-types/index.d.ts",
	typesVersions: { "<4.5": { "dist-types/*": ["dist-types/ts3.4/*"] } },
	"react-native": { "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native" },
	scripts: {
		"build": "concurrently 'yarn:build:types' 'yarn:build:es' && yarn build:cjs",
		"build:cjs": "node ../../scripts/compilation/inline",
		"build:es": "premove dist-es && tsc -p tsconfig.es.json",
		"build:include:deps": "yarn g:turbo run build -F=\"$npm_package_name\"",
		"build:types": "premove dist-types && tsc -p tsconfig.types.json",
		"build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
		"clean": "premove dist-cjs dist-es dist-types",
		"extract:docs": "api-extractor run --local",
		"generate:client": "node ../../scripts/generate-clients/single-service",
		"test": "yarn g:vitest run --passWithNoTests",
		"test:watch": "yarn g:vitest watch --passWithNoTests",
		"test:integration": "yarn g:vitest run --passWithNoTests -c vitest.config.integ.mts",
		"test:integration:watch": "yarn g:vitest watch --passWithNoTests -c vitest.config.integ.mts",
		"test:e2e": "yarn g:vitest run -c vitest.config.e2e.mts",
		"test:e2e:watch": "yarn g:vitest watch -c vitest.config.e2e.mts",
		"test:index": "tsc --noEmit ./test/index-types.ts && node ./test/index-objects.spec.mjs"
	},
	dependencies: {
		"@aws-sdk/core": "^3.975.3",
		"@aws-sdk/credential-provider-node": "^3.972.70",
		"@aws-sdk/types": "^3.974.2",
		"@smithy/core": "^3.29.4",
		"@smithy/fetch-http-handler": "^5.6.6",
		"@smithy/node-http-handler": "^4.9.6",
		"@smithy/types": "^4.16.1",
		"tslib": "^2.6.2"
	},
	devDependencies: {
		"@smithy/snapshot-testing": "^2.2.9",
		"@tsconfig/node20": "20.1.8",
		"@types/node": "^20.14.8",
		"concurrently": "7.0.0",
		"downlevel-dts": "0.10.1",
		"premove": "4.0.0",
		"typescript": "~5.8.3",
		"vitest": "^4.0.17"
	},
	engines: { "node": ">=20.0.0" }
};
//#endregion
//#region node_modules/@aws-sdk/credential-provider-env/dist-es/fromEnv.js
var ENV_KEY = "AWS_ACCESS_KEY_ID";
var ENV_SECRET = "AWS_SECRET_ACCESS_KEY";
var ENV_SESSION = "AWS_SESSION_TOKEN";
var ENV_EXPIRATION = "AWS_CREDENTIAL_EXPIRATION";
var ENV_CREDENTIAL_SCOPE = "AWS_CREDENTIAL_SCOPE";
var ENV_ACCOUNT_ID = "AWS_ACCOUNT_ID";
var fromEnv = (init) => async () => {
	init?.logger?.debug("@aws-sdk/credential-provider-env - fromEnv");
	const accessKeyId = process.env[ENV_KEY];
	const secretAccessKey = process.env[ENV_SECRET];
	const sessionToken = process.env[ENV_SESSION];
	const expiry = process.env[ENV_EXPIRATION];
	const credentialScope = process.env[ENV_CREDENTIAL_SCOPE];
	const accountId = process.env[ENV_ACCOUNT_ID];
	if (accessKeyId && secretAccessKey) {
		const credentials = {
			accessKeyId,
			secretAccessKey,
			...sessionToken && { sessionToken },
			...expiry && { expiration: new Date(expiry) },
			...credentialScope && { credentialScope },
			...accountId && { accountId }
		};
		(0, import_client.setCredentialFeature)(credentials, "CREDENTIALS_ENV_VARS", "g");
		return credentials;
	}
	throw new import_config.CredentialsProviderError("Unable to find environment variable credentials.", { logger: init?.logger });
};
//#endregion
//#region node_modules/@aws-sdk/credential-provider-env/dist-es/index.js
var dist_es_exports$3 = /* @__PURE__ */ __exportAll({
	ENV_ACCOUNT_ID: () => ENV_ACCOUNT_ID,
	ENV_CREDENTIAL_SCOPE: () => ENV_CREDENTIAL_SCOPE,
	ENV_EXPIRATION: () => ENV_EXPIRATION,
	ENV_KEY: () => ENV_KEY,
	ENV_SECRET: () => ENV_SECRET,
	ENV_SESSION: () => ENV_SESSION,
	fromEnv: () => fromEnv
});
var remoteProvider = async (init) => {
	const { ENV_CMDS_FULL_URI, ENV_CMDS_RELATIVE_URI, fromContainerMetadata, fromInstanceMetadata } = await import("../@smithy/credential-provider-imds+[...].mjs").then((n) => n.t);
	if (process.env[ENV_CMDS_RELATIVE_URI] || process.env[ENV_CMDS_FULL_URI]) {
		init.logger?.debug("@aws-sdk/credential-provider-node - remoteProvider::fromHttp/fromContainerMetadata");
		const { fromHttp } = await import("./credential-provider-http+[...].mjs").then((n) => n.t);
		return (0, import_config.chain)(fromHttp(init), fromContainerMetadata(init));
	}
	if (process.env["AWS_EC2_METADATA_DISABLED"] && process.env["AWS_EC2_METADATA_DISABLED"] !== "false") return async () => {
		throw new import_config.CredentialsProviderError("EC2 Instance Metadata Service access disabled", { logger: init.logger });
	};
	init.logger?.debug("@aws-sdk/credential-provider-node - remoteProvider::fromInstanceMetadata");
	return fromInstanceMetadata(init);
};
//#endregion
//#region node_modules/@aws-sdk/credential-provider-node/dist-es/runtime/memoize-chain.js
function memoizeChain(providers, treatAsExpired) {
	const chain = internalCreateChain(providers);
	let activeLock;
	let passiveLock;
	let credentials;
	let forceRefreshLock;
	const provider = async (options) => {
		if (options?.forceRefresh) {
			if (!forceRefreshLock) forceRefreshLock = chain(options).then((c) => {
				credentials = c;
			}).finally(() => {
				forceRefreshLock = void 0;
			});
			await forceRefreshLock;
			return credentials;
		}
		if (credentials?.expiration) {
			if (credentials?.expiration?.getTime() < Date.now()) credentials = void 0;
		}
		if (activeLock) await activeLock;
		else if (!credentials || treatAsExpired?.(credentials)) if (credentials) {
			if (!passiveLock) passiveLock = chain(options).then((c) => {
				credentials = c;
			}).finally(() => {
				passiveLock = void 0;
			});
		} else {
			activeLock = chain(options).then((c) => {
				credentials = c;
			}).finally(() => {
				activeLock = void 0;
			});
			return provider(options);
		}
		return credentials;
	};
	return provider;
}
var internalCreateChain = (providers) => async (awsIdentityProperties) => {
	let lastProviderError;
	for (const provider of providers) try {
		return await provider(awsIdentityProperties);
	} catch (err) {
		lastProviderError = err;
		if (err?.tryNextLink) continue;
		throw err;
	}
	throw lastProviderError;
};
//#endregion
//#region node_modules/@aws-sdk/credential-provider-node/dist-es/defaultProvider.js
var multipleCredentialSourceWarningEmitted = false;
var defaultProvider = (init = {}) => memoizeChain([
	async () => {
		if (init.profile ?? process.env[import_config.ENV_PROFILE]) {
			if (process.env["AWS_ACCESS_KEY_ID"] && process.env["AWS_SECRET_ACCESS_KEY"]) {
				if (!multipleCredentialSourceWarningEmitted) {
					(init.logger?.warn && init.logger?.constructor?.name !== "NoOpLogger" ? init.logger.warn.bind(init.logger) : console.warn)(`@aws-sdk/credential-provider-node - defaultProvider::fromEnv WARNING:
    Multiple credential sources detected: 
    Both AWS_PROFILE and the pair AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY static credentials are set.
    This SDK will proceed with the AWS_PROFILE value.
    
    However, a future version may change this behavior to prefer the ENV static credentials.
    Please ensure that your environment only sets either the AWS_PROFILE or the
    AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY pair.
`);
					multipleCredentialSourceWarningEmitted = true;
				}
			}
			throw new import_config.CredentialsProviderError("AWS_PROFILE is set, skipping fromEnv provider.", {
				logger: init.logger,
				tryNextLink: true
			});
		}
		init.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromEnv");
		return fromEnv(init)();
	},
	async (awsIdentityProperties) => {
		init.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromSSO");
		const { ssoStartUrl, ssoAccountId, ssoRegion, ssoRoleName, ssoSession } = init;
		if (!ssoStartUrl && !ssoAccountId && !ssoRegion && !ssoRoleName && !ssoSession) throw new import_config.CredentialsProviderError("Skipping SSO provider in default chain (inputs do not include SSO fields).", { logger: init.logger });
		const { fromSSO } = await import("./credential-provider-sso+[...].mjs").then((n) => n.t);
		return fromSSO(init)(awsIdentityProperties);
	},
	async (awsIdentityProperties) => {
		init.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromIni");
		const { fromIni } = await import("./credential-provider-ini+[...].mjs").then((n) => n.t);
		return fromIni(init)(awsIdentityProperties);
	},
	async (awsIdentityProperties) => {
		init.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromProcess");
		const { fromProcess } = await import("./credential-provider-process+[...].mjs").then((n) => n.t);
		return fromProcess(init)(awsIdentityProperties);
	},
	async (awsIdentityProperties) => {
		init.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromTokenFile");
		const { fromTokenFile } = await import("./credential-provider-web-identity+[...].mjs").then((n) => n.t);
		return fromTokenFile(init)(awsIdentityProperties);
	},
	async () => {
		init.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::remoteProvider");
		return (await remoteProvider(init))();
	},
	async () => {
		throw new import_config.CredentialsProviderError("Could not load credentials from any providers", {
			tryNextLink: false,
			logger: init.logger
		});
	}
], credentialsTreatedAsExpired);
var credentialsTreatedAsExpired = (credentials) => credentials?.expiration !== void 0 && credentials.expiration.getTime() - Date.now() < 3e5;
//#endregion
//#region node_modules/@smithy/node-http-handler/dist-es/build-abort-error.js
function buildAbortError(abortSignal) {
	const reason = abortSignal && typeof abortSignal === "object" && "reason" in abortSignal ? abortSignal.reason : void 0;
	if (reason) {
		if (reason instanceof Error) {
			const abortError = /* @__PURE__ */ new Error("Request aborted");
			abortError.name = "AbortError";
			abortError.cause = reason;
			return abortError;
		}
		const abortError = new Error(String(reason));
		abortError.name = "AbortError";
		return abortError;
	}
	const abortError = /* @__PURE__ */ new Error("Request aborted");
	abortError.name = "AbortError";
	return abortError;
}
var init_build_abort_error = __esmMin((() => {}));
//#endregion
//#region node_modules/@smithy/node-http-handler/dist-es/constants.js
var NODEJS_TIMEOUT_ERROR_CODES;
var init_constants = __esmMin((() => {
	NODEJS_TIMEOUT_ERROR_CODES = [
		"ECONNRESET",
		"EPIPE",
		"ETIMEDOUT"
	];
}));
//#endregion
//#region node_modules/@smithy/node-http-handler/dist-es/get-transformed-headers.js
var getTransformedHeaders;
var init_get_transformed_headers = __esmMin((() => {
	getTransformedHeaders = (headers) => {
		const transformedHeaders = {};
		for (const name in headers) {
			const headerValues = headers[name];
			transformedHeaders[name] = Array.isArray(headerValues) ? headerValues.join(",") : headerValues;
		}
		return transformedHeaders;
	};
}));
//#endregion
//#region node_modules/@smithy/node-http-handler/dist-es/node-https.js
var init_node_https = __esmMin((() => {}));
//#endregion
//#region node_modules/@smithy/node-http-handler/dist-es/timing.js
var timing;
var init_timing = __esmMin((() => {
	timing = {
		setTimeout: (cb, ms) => setTimeout(cb, ms),
		clearTimeout: (timeoutId) => clearTimeout(timeoutId)
	};
}));
//#endregion
//#region node_modules/@smithy/node-http-handler/dist-es/set-connection-timeout.js
var DEFER_EVENT_LISTENER_TIME$2, setConnectionTimeout;
var init_set_connection_timeout = __esmMin((() => {
	init_timing();
	DEFER_EVENT_LISTENER_TIME$2 = 1e3;
	setConnectionTimeout = (request, reject, timeoutInMs = 0) => {
		if (!timeoutInMs) return -1;
		const registerTimeout = (offset) => {
			const timeoutId = timing.setTimeout(() => {
				request.destroy();
				reject(Object.assign(/* @__PURE__ */ new Error(`@smithy/node-http-handler - the request socket did not establish a connection with the server within the configured timeout of ${timeoutInMs} ms.`), { name: "TimeoutError" }));
			}, timeoutInMs - offset);
			const doWithSocket = (socket) => {
				if (socket?.connecting) socket.on("connect", () => {
					timing.clearTimeout(timeoutId);
				});
				else timing.clearTimeout(timeoutId);
			};
			if (request.socket) doWithSocket(request.socket);
			else request.on("socket", doWithSocket);
		};
		if (timeoutInMs < 2e3) {
			registerTimeout(0);
			return 0;
		}
		return timing.setTimeout(registerTimeout.bind(null, DEFER_EVENT_LISTENER_TIME$2), DEFER_EVENT_LISTENER_TIME$2);
	};
}));
//#endregion
//#region node_modules/@smithy/node-http-handler/dist-es/set-request-timeout.js
var setRequestTimeout;
var init_set_request_timeout = __esmMin((() => {
	init_timing();
	setRequestTimeout = (req, reject, timeoutInMs = 0, throwOnRequestTimeout, logger) => {
		if (timeoutInMs) return timing.setTimeout(() => {
			let msg = `@smithy/node-http-handler - [${throwOnRequestTimeout ? "ERROR" : "WARN"}] a request has exceeded the configured ${timeoutInMs} ms requestTimeout.`;
			if (throwOnRequestTimeout) {
				const error = Object.assign(new Error(msg), {
					name: "TimeoutError",
					code: "ETIMEDOUT"
				});
				req.destroy(error);
				reject(error);
			} else {
				msg += ` Init client requestHandler with throwOnRequestTimeout=true to turn this into an error.`;
				logger?.warn?.(msg);
			}
		}, timeoutInMs);
		return -1;
	};
}));
//#endregion
//#region node_modules/@smithy/node-http-handler/dist-es/set-socket-keep-alive.js
var DEFER_EVENT_LISTENER_TIME$1, setSocketKeepAlive;
var init_set_socket_keep_alive = __esmMin((() => {
	init_timing();
	DEFER_EVENT_LISTENER_TIME$1 = 3e3;
	setSocketKeepAlive = (request, { keepAlive, keepAliveMsecs }, deferTimeMs = DEFER_EVENT_LISTENER_TIME$1) => {
		if (keepAlive !== true) return -1;
		const registerListener = () => {
			if (request.socket) request.socket.setKeepAlive(keepAlive, keepAliveMsecs || 0);
			else request.on("socket", (socket) => {
				socket.setKeepAlive(keepAlive, keepAliveMsecs || 0);
			});
		};
		if (deferTimeMs === 0) {
			registerListener();
			return 0;
		}
		return timing.setTimeout(registerListener, deferTimeMs);
	};
}));
//#endregion
//#region node_modules/@smithy/node-http-handler/dist-es/set-socket-timeout.js
var DEFER_EVENT_LISTENER_TIME, setSocketTimeout;
var init_set_socket_timeout = __esmMin((() => {
	init_timing();
	DEFER_EVENT_LISTENER_TIME = 3e3;
	setSocketTimeout = (request, reject, timeoutInMs = 0) => {
		const registerTimeout = (offset) => {
			const timeout = timeoutInMs - offset;
			const onTimeout = () => {
				request.destroy();
				reject(Object.assign(/* @__PURE__ */ new Error(`@smithy/node-http-handler - the request socket timed out after ${timeoutInMs} ms of inactivity (configured by client requestHandler).`), { name: "TimeoutError" }));
			};
			if (request.socket) {
				request.socket.setTimeout(timeout, onTimeout);
				request.on("close", () => request.socket?.removeListener("timeout", onTimeout));
			} else request.setTimeout(timeout, onTimeout);
		};
		if (0 < timeoutInMs && timeoutInMs < 6e3) {
			registerTimeout(0);
			return 0;
		}
		return timing.setTimeout(registerTimeout.bind(null, timeoutInMs === 0 ? 0 : DEFER_EVENT_LISTENER_TIME), DEFER_EVENT_LISTENER_TIME);
	};
}));
//#endregion
//#region node_modules/@smithy/node-http-handler/dist-es/write-request-body.js
async function writeRequestBody(httpRequest, request, maxContinueTimeoutMs = MIN_WAIT_TIME, externalAgent = false) {
	const headers = request.headers;
	const expect = headers ? headers.Expect || headers.expect : void 0;
	let timeoutId = -1;
	let sendBody = true;
	if (!externalAgent && expect === "100-continue") sendBody = await Promise.race([new Promise((resolve) => {
		timeoutId = Number(timing.setTimeout(() => resolve(true), Math.max(MIN_WAIT_TIME, maxContinueTimeoutMs)));
	}), new Promise((resolve) => {
		httpRequest.on("continue", () => {
			timing.clearTimeout(timeoutId);
			resolve(true);
		});
		httpRequest.on("response", () => {
			timing.clearTimeout(timeoutId);
			resolve(false);
		});
		httpRequest.on("error", () => {
			timing.clearTimeout(timeoutId);
			resolve(false);
		});
	})]);
	if (sendBody) writeBody(httpRequest, request.body);
}
function writeBody(httpRequest, body) {
	if (body instanceof Readable) {
		body.pipe(httpRequest);
		return;
	}
	if (body) {
		const isBuffer = Buffer.isBuffer(body);
		if (isBuffer || typeof body === "string") {
			if (isBuffer && body.byteLength === 0) httpRequest.end();
			else httpRequest.end(body);
			return;
		}
		const uint8 = body;
		if (typeof uint8 === "object" && uint8.buffer && typeof uint8.byteOffset === "number" && typeof uint8.byteLength === "number") {
			httpRequest.end(Buffer.from(uint8.buffer, uint8.byteOffset, uint8.byteLength));
			return;
		}
		httpRequest.end(Buffer.from(body));
		return;
	}
	httpRequest.end();
}
var MIN_WAIT_TIME;
var init_write_request_body = __esmMin((() => {
	init_timing();
	MIN_WAIT_TIME = 6e3;
}));
//#endregion
//#region node_modules/@smithy/node-http-handler/dist-es/node-http-handler.js
var import_protocols$3, hAgent, hRequest, NodeHttpHandler;
var init_node_http_handler = __esmMin((() => {
	import_protocols$3 = require_protocols$1();
	init_build_abort_error();
	init_constants();
	init_get_transformed_headers();
	init_node_https();
	init_set_connection_timeout();
	init_set_request_timeout();
	init_set_socket_keep_alive();
	init_set_socket_timeout();
	init_timing();
	init_write_request_body();
	hAgent = void 0;
	hRequest = void 0;
	NodeHttpHandler = class NodeHttpHandler {
		config;
		configProvider;
		socketWarningTimestamp = 0;
		externalAgent = false;
		metadata = { handlerProtocol: "http/1.1" };
		static create(instanceOrOptions) {
			if (typeof instanceOrOptions?.handle === "function") return instanceOrOptions;
			return new NodeHttpHandler(instanceOrOptions);
		}
		static checkSocketUsage(agent, socketWarningTimestamp, logger = console) {
			const { sockets, requests, maxSockets } = agent;
			if (typeof maxSockets !== "number" || maxSockets === Infinity) return socketWarningTimestamp;
			if (Date.now() - 15e3 < socketWarningTimestamp) return socketWarningTimestamp;
			if (sockets && requests) for (const origin in sockets) {
				const socketsInUse = sockets[origin]?.length ?? 0;
				const requestsEnqueued = requests[origin]?.length ?? 0;
				if (socketsInUse >= maxSockets && requestsEnqueued >= 2 * maxSockets) {
					logger?.warn?.(`@smithy/node-http-handler:WARN - socket usage at capacity=${socketsInUse} and ${requestsEnqueued} additional requests are enqueued.
See https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/node-configuring-maxsockets.html
or increase socketAcquisitionWarningTimeout=(millis) in the NodeHttpHandler config.`);
					return Date.now();
				}
			}
			return socketWarningTimestamp;
		}
		constructor(options) {
			this.configProvider = new Promise((resolve, reject) => {
				if (typeof options === "function") options().then((_options) => {
					resolve(this.resolveDefaultConfig(_options));
				}).catch(reject);
				else resolve(this.resolveDefaultConfig(options));
			});
		}
		destroy() {
			this.config?.httpAgent?.destroy();
			this.config?.httpsAgent?.destroy();
		}
		async handle(request, { abortSignal, requestTimeout } = {}) {
			if (!this.config) this.config = await this.configProvider;
			const config = this.config;
			const isSSL = request.protocol === "https:";
			if (!isSSL && !this.config.httpAgent) this.config.httpAgent = await this.config.httpAgentProvider();
			return new Promise((_resolve, _reject) => {
				let writeRequestBodyPromise = void 0;
				let socketWarningTimeoutId = -1;
				let connectionTimeoutId = -1;
				let requestTimeoutId = -1;
				let socketTimeoutId = -1;
				let keepAliveTimeoutId = -1;
				const clearTimeouts = () => {
					timing.clearTimeout(socketWarningTimeoutId);
					timing.clearTimeout(connectionTimeoutId);
					timing.clearTimeout(requestTimeoutId);
					timing.clearTimeout(socketTimeoutId);
					timing.clearTimeout(keepAliveTimeoutId);
				};
				const resolve = async (arg) => {
					await writeRequestBodyPromise;
					clearTimeouts();
					_resolve(arg);
				};
				const reject = async (arg) => {
					await writeRequestBodyPromise;
					clearTimeouts();
					_reject(arg);
				};
				if (abortSignal?.aborted) {
					reject(buildAbortError(abortSignal));
					return;
				}
				const headers = request.headers;
				const expectContinue = headers ? (headers.Expect ?? headers.expect) === "100-continue" : false;
				let agent = isSSL ? config.httpsAgent : config.httpAgent;
				if (expectContinue && !this.externalAgent) agent = new (isSSL ? node_https.Agent : hAgent)({
					keepAlive: false,
					maxSockets: Infinity
				});
				socketWarningTimeoutId = timing.setTimeout(() => {
					this.socketWarningTimestamp = NodeHttpHandler.checkSocketUsage(agent, this.socketWarningTimestamp, config.logger);
				}, config.socketAcquisitionWarningTimeout ?? (config.requestTimeout ?? 2e3) + (config.connectionTimeout ?? 1e3));
				const queryString = request.query ? (0, import_protocols$3.buildQueryString)(request.query) : "";
				let auth = void 0;
				if (request.username != null || request.password != null) auth = `${request.username ?? ""}:${request.password ?? ""}`;
				let path = request.path;
				if (queryString) path += `?${queryString}`;
				if (request.fragment) path += `#${request.fragment}`;
				let hostname = request.hostname ?? "";
				if (hostname[0] === "[" && hostname.endsWith("]")) hostname = request.hostname.slice(1, -1);
				else hostname = request.hostname;
				const nodeHttpsOptions = {
					headers: request.headers,
					host: hostname,
					method: request.method,
					path,
					port: request.port,
					agent,
					auth
				};
				const req = (isSSL ? node_https.request : hRequest)(nodeHttpsOptions, (res) => {
					const httpResponse = new import_protocols$3.HttpResponse({
						statusCode: res.statusCode || -1,
						reason: res.statusMessage,
						headers: getTransformedHeaders(res.headers),
						body: res
					});
					resolve({ response: httpResponse });
				});
				req.on("error", (err) => {
					if (NODEJS_TIMEOUT_ERROR_CODES.includes(err.code)) reject(Object.assign(err, { name: "TimeoutError" }));
					else reject(err);
				});
				if (abortSignal) {
					const onAbort = () => {
						req.destroy();
						const abortError = buildAbortError(abortSignal);
						reject(abortError);
					};
					if (typeof abortSignal.addEventListener === "function") {
						const signal = abortSignal;
						signal.addEventListener("abort", onAbort, { once: true });
						req.once("close", () => signal.removeEventListener("abort", onAbort));
					} else abortSignal.onabort = onAbort;
				}
				const effectiveRequestTimeout = requestTimeout ?? config.requestTimeout;
				connectionTimeoutId = setConnectionTimeout(req, reject, config.connectionTimeout);
				requestTimeoutId = setRequestTimeout(req, reject, effectiveRequestTimeout, config.throwOnRequestTimeout, config.logger ?? console);
				socketTimeoutId = setSocketTimeout(req, reject, config.socketTimeout);
				const httpAgent = nodeHttpsOptions.agent;
				if (typeof httpAgent === "object" && "keepAlive" in httpAgent) keepAliveTimeoutId = setSocketKeepAlive(req, {
					keepAlive: httpAgent.keepAlive,
					keepAliveMsecs: httpAgent.keepAliveMsecs
				});
				writeRequestBodyPromise = writeRequestBody(req, request, effectiveRequestTimeout, this.externalAgent).catch((e) => {
					clearTimeouts();
					return _reject(e);
				});
			});
		}
		updateHttpClientConfig(key, value) {
			this.config = void 0;
			this.configProvider = this.configProvider.then((config) => {
				return {
					...config,
					[key]: value
				};
			});
		}
		httpHandlerConfigs() {
			return this.config ?? {};
		}
		resolveDefaultConfig(options) {
			const { requestTimeout, connectionTimeout, socketTimeout, socketAcquisitionWarningTimeout, httpAgent, httpsAgent, throwOnRequestTimeout, logger } = options || {};
			const keepAlive = true;
			const maxSockets = 50;
			return {
				connectionTimeout,
				requestTimeout,
				socketTimeout,
				socketAcquisitionWarningTimeout,
				throwOnRequestTimeout,
				httpAgentProvider: async () => {
					const node_http = await import("node:http");
					const { Agent, request } = node_http.default ?? node_http;
					hRequest = request;
					hAgent = Agent;
					if (httpAgent instanceof hAgent || typeof httpAgent?.destroy === "function") {
						this.externalAgent = true;
						return httpAgent;
					}
					return new hAgent({
						keepAlive,
						maxSockets,
						...httpAgent
					});
				},
				httpsAgent: (() => {
					if (httpsAgent instanceof node_https.Agent || typeof httpsAgent?.destroy === "function") {
						this.externalAgent = true;
						return httpsAgent;
					}
					return new node_https.Agent({
						keepAlive,
						maxSockets,
						...httpsAgent
					});
				})(),
				logger
			};
		}
	};
}));
//#endregion
//#region node_modules/@smithy/node-http-handler/dist-es/node-http2.js
var init_node_http2 = __esmMin((() => {}));
//#endregion
//#region node_modules/@smithy/node-http-handler/dist-es/http2/ClientHttp2SessionRef.js
var ids, ClientHttp2SessionRef;
var init_ClientHttp2SessionRef = __esmMin((() => {
	ids = /* @__PURE__ */ new Uint16Array(1);
	ClientHttp2SessionRef = class {
		id = ids[0]++;
		total = 0;
		max = 0;
		session;
		refs = 0;
		constructor(session) {
			session.unref();
			this.session = session;
		}
		retain() {
			if (this.session.destroyed) throw new Error("@smithy/node-http-handler - cannot acquire reference to destroyed session.");
			this.refs += 1;
			this.total += 1;
			this.max = Math.max(this.refs, this.max);
			this.session.ref();
		}
		free() {
			if (this.session.destroyed) return;
			this.refs -= 1;
			if (this.refs === 0) this.session.unref();
			if (this.refs < 0) throw new Error("@smithy/node-http-handler - ClientHttp2Session refcount at zero, cannot decrement.");
		}
		deref() {
			return this.session;
		}
		close() {
			if (!this.session.closed) this.session.close();
		}
		destroy() {
			this.refs = 0;
			if (!this.session.destroyed) this.session.destroy();
		}
		useCount() {
			return this.refs;
		}
	};
}));
//#endregion
//#region node_modules/@smithy/node-http-handler/dist-es/node-http2-connection-pool.js
var NodeHttp2ConnectionPool;
var init_node_http2_connection_pool = __esmMin((() => {
	init_ClientHttp2SessionRef();
	NodeHttp2ConnectionPool = class {
		sessions = [];
		maxConcurrency = 0;
		constructor(sessions) {
			this.sessions = (sessions ?? []).map((session) => new ClientHttp2SessionRef(session));
		}
		poll() {
			let cleanup = false;
			for (const session of this.sessions) {
				if (session.deref().destroyed) {
					cleanup = true;
					continue;
				}
				if (!this.maxConcurrency || session.useCount() < this.maxConcurrency) return session;
			}
			if (cleanup) {
				for (const session of this.sessions) if (session.deref().destroyed) this.remove(session);
			}
		}
		offerLast(ref) {
			this.sessions.push(ref);
		}
		remove(ref) {
			const ix = this.sessions.indexOf(ref);
			if (ix > -1) this.sessions.splice(ix, 1);
		}
		[Symbol.iterator]() {
			return this.sessions[Symbol.iterator]();
		}
		setMaxConcurrency(maxConcurrency) {
			this.maxConcurrency = maxConcurrency;
		}
		destroy(ref) {
			this.remove(ref);
			ref.destroy();
		}
	};
}));
//#endregion
//#region node_modules/@smithy/node-http-handler/dist-es/node-http2-connection-manager.js
var NodeHttp2ConnectionManager;
var init_node_http2_connection_manager = __esmMin((() => {
	init_ClientHttp2SessionRef();
	init_node_http2_connection_pool();
	NodeHttp2ConnectionManager = class {
		config;
		connectOptions;
		connectionPools = /* @__PURE__ */ new Map();
		constructor(config) {
			this.config = config;
			if (this.config.maxConcurrency && this.config.maxConcurrency <= 0) throw new RangeError("maxConcurrency must be greater than zero.");
		}
		lease(requestContext, connectionConfiguration) {
			const url = this.getUrlString(requestContext);
			const pool = this.getPool(url);
			if (!this.config.disableConcurrency && !connectionConfiguration.isEventStream) {
				const available = pool.poll();
				if (available) {
					available.retain();
					return available;
				}
			}
			const ref = new ClientHttp2SessionRef(this.connect(url));
			const session = ref.deref();
			if (this.config.maxConcurrency) session.settings({ maxConcurrentStreams: this.config.maxConcurrency }, (err) => {
				if (err) throw new Error("Fail to set maxConcurrentStreams to " + this.config.maxConcurrency + "when creating new session for " + requestContext.destination.toString());
			});
			const graceful = () => {
				this.removeFromPoolAndClose(url, ref);
			};
			const ensureDestroyed = () => {
				this.removeFromPoolAndCheckedDestroy(url, ref);
			};
			session.on("goaway", graceful);
			session.on("error", ensureDestroyed);
			session.on("frameError", ensureDestroyed);
			session.on("close", ensureDestroyed);
			if (connectionConfiguration.requestTimeout) session.setTimeout(connectionConfiguration.requestTimeout, ensureDestroyed);
			pool.offerLast(ref);
			ref.retain();
			return ref;
		}
		release(_requestContext, ref) {
			ref.free();
		}
		createIsolatedSession(requestContext, connectionConfiguration) {
			const url = this.getUrlString(requestContext);
			const ref = new ClientHttp2SessionRef(this.connect(url));
			const session = ref.deref();
			session.settings({ maxConcurrentStreams: 1 });
			const ensureDestroyed = () => {
				ref.destroy();
			};
			session.on("error", ensureDestroyed);
			session.on("frameError", ensureDestroyed);
			session.on("close", ensureDestroyed);
			if (connectionConfiguration.requestTimeout) session.setTimeout(connectionConfiguration.requestTimeout, ensureDestroyed);
			ref.retain();
			return ref;
		}
		destroy() {
			for (const [url, connectionPool] of this.connectionPools) {
				for (const session of [...connectionPool]) session.destroy();
				this.connectionPools.delete(url);
			}
		}
		setMaxConcurrentStreams(maxConcurrentStreams) {
			if (maxConcurrentStreams && maxConcurrentStreams <= 0) throw new RangeError("maxConcurrentStreams must be greater than zero.");
			this.config.maxConcurrency = maxConcurrentStreams;
			for (const pool of this.connectionPools.values()) pool.setMaxConcurrency(maxConcurrentStreams);
		}
		setDisableConcurrentStreams(disableConcurrentStreams) {
			this.config.disableConcurrency = disableConcurrentStreams;
		}
		setNodeHttp2ConnectOptions(nodeHttp2ConnectOptions) {
			this.connectOptions = nodeHttp2ConnectOptions;
		}
		debug() {
			const pools = {};
			for (const [url, pool] of this.connectionPools) {
				const sessions = [];
				for (const ref of pool) sessions.push({
					id: ref.id,
					active: ref.useCount(),
					maxConcurrent: ref.max,
					totalRequests: ref.total
				});
				pools[url] = { sessions };
			}
			return pools;
		}
		removeFromPoolAndClose(authority, ref) {
			this.connectionPools.get(authority)?.remove(ref);
			ref.close();
		}
		removeFromPoolAndCheckedDestroy(authority, ref) {
			this.connectionPools.get(authority)?.remove(ref);
			ref.destroy();
		}
		getPool(url) {
			if (!this.connectionPools.has(url)) {
				const pool = new NodeHttp2ConnectionPool();
				if (this.config.maxConcurrency) pool.setMaxConcurrency(this.config.maxConcurrency);
				this.connectionPools.set(url, pool);
			}
			return this.connectionPools.get(url);
		}
		getUrlString(request) {
			return request.destination.toString();
		}
		connect(url) {
			return this.connectOptions === void 0 ? nodeHTTP2.connect(url) : nodeHTTP2.connect(url, this.connectOptions);
		}
	};
}));
//#endregion
//#region node_modules/@smithy/node-http-handler/dist-es/node-http2-handler.js
var import_protocols$2, constants, NodeHttp2Handler;
var init_node_http2_handler = __esmMin((() => {
	import_protocols$2 = require_protocols$1();
	init_build_abort_error();
	init_get_transformed_headers();
	init_node_http2();
	init_node_http2_connection_manager();
	init_write_request_body();
	({constants} = node_http2);
	NodeHttp2Handler = class NodeHttp2Handler {
		config;
		configProvider;
		metadata = { handlerProtocol: "h2" };
		connectionManager = new NodeHttp2ConnectionManager({});
		static create(instanceOrOptions) {
			if (typeof instanceOrOptions?.handle === "function") return instanceOrOptions;
			return new NodeHttp2Handler(instanceOrOptions);
		}
		constructor(options) {
			this.configProvider = new Promise((resolve, reject) => {
				if (typeof options === "function") options().then((opts) => {
					resolve(opts || {});
				}).catch(reject);
				else resolve(options || {});
			});
		}
		destroy() {
			this.connectionManager.destroy();
		}
		async handle(request, { abortSignal, requestTimeout, isEventStream } = {}) {
			if (!this.config) {
				this.config = await this.configProvider;
				const { disableConcurrentStreams, maxConcurrentStreams, nodeHttp2ConnectOptions } = this.config;
				this.connectionManager.setDisableConcurrentStreams(disableConcurrentStreams ?? false);
				if (maxConcurrentStreams) this.connectionManager.setMaxConcurrentStreams(maxConcurrentStreams);
				if (nodeHttp2ConnectOptions) this.connectionManager.setNodeHttp2ConnectOptions(nodeHttp2ConnectOptions);
			}
			const { requestTimeout: configRequestTimeout, disableConcurrentStreams } = this.config;
			const useIsolatedSession = disableConcurrentStreams || isEventStream;
			const effectiveRequestTimeout = requestTimeout ?? configRequestTimeout;
			return new Promise((_resolve, _reject) => {
				let fulfilled = false;
				let writeRequestBodyPromise = void 0;
				const resolve = async (arg) => {
					await writeRequestBodyPromise;
					_resolve(arg);
				};
				const reject = async (arg) => {
					await writeRequestBodyPromise;
					_reject(arg);
				};
				if (abortSignal?.aborted) {
					fulfilled = true;
					reject(buildAbortError(abortSignal));
					return;
				}
				const { hostname, method, port, protocol, query } = request;
				let auth = "";
				if (request.username != null || request.password != null) auth = `${request.username ?? ""}:${request.password ?? ""}@`;
				const authority = `${protocol}//${auth}${hostname}${port ? `:${port}` : ""}`;
				const requestContext = { destination: new URL(authority) };
				const connectConfig = {
					requestTimeout: this.config?.sessionTimeout,
					isEventStream
				};
				const ref = useIsolatedSession ? this.connectionManager.createIsolatedSession(requestContext, connectConfig) : this.connectionManager.lease(requestContext, connectConfig);
				const session = ref.deref();
				const rejectWithDestroy = (err) => {
					if (useIsolatedSession) ref.destroy();
					fulfilled = true;
					reject(err);
				};
				const queryString = query ? (0, import_protocols$2.buildQueryString)(query) : "";
				let path = request.path;
				if (queryString) path += `?${queryString}`;
				if (request.fragment) path += `#${request.fragment}`;
				const clientHttp2Stream = session.request({
					...request.headers,
					[constants.HTTP2_HEADER_PATH]: path,
					[constants.HTTP2_HEADER_METHOD]: method
				});
				if (effectiveRequestTimeout) clientHttp2Stream.setTimeout(effectiveRequestTimeout, () => {
					clientHttp2Stream.close();
					const timeoutError = /* @__PURE__ */ new Error(`Stream timed out because of no activity for ${effectiveRequestTimeout} ms`);
					timeoutError.name = "TimeoutError";
					rejectWithDestroy(timeoutError);
				});
				if (abortSignal) {
					const onAbort = () => {
						clientHttp2Stream.close();
						const abortError = buildAbortError(abortSignal);
						rejectWithDestroy(abortError);
					};
					if (typeof abortSignal.addEventListener === "function") {
						const signal = abortSignal;
						signal.addEventListener("abort", onAbort, { once: true });
						clientHttp2Stream.once("close", () => signal.removeEventListener("abort", onAbort));
					} else abortSignal.onabort = onAbort;
				}
				clientHttp2Stream.on("frameError", (type, code, id) => {
					rejectWithDestroy(/* @__PURE__ */ new Error(`Frame type id ${type} in stream id ${id} has failed with code ${code}.`));
				});
				clientHttp2Stream.on("error", rejectWithDestroy);
				clientHttp2Stream.on("aborted", () => {
					rejectWithDestroy(/* @__PURE__ */ new Error(`HTTP/2 stream is abnormally aborted in mid-communication with result code ${clientHttp2Stream.rstCode}.`));
				});
				clientHttp2Stream.on("response", (headers) => {
					const httpResponse = new import_protocols$2.HttpResponse({
						statusCode: headers[":status"] ?? -1,
						headers: getTransformedHeaders(headers),
						body: clientHttp2Stream
					});
					fulfilled = true;
					resolve({ response: httpResponse });
					if (useIsolatedSession) session.close();
				});
				clientHttp2Stream.on("close", () => {
					if (useIsolatedSession) ref.destroy();
					else this.connectionManager.release(requestContext, ref);
					if (!fulfilled) rejectWithDestroy(/* @__PURE__ */ new Error("Unexpected error: http2 request did not get a response"));
				});
				writeRequestBodyPromise = writeRequestBody(clientHttp2Stream, request, effectiveRequestTimeout);
			});
		}
		updateHttpClientConfig(key, value) {
			this.config = void 0;
			this.configProvider = this.configProvider.then((config) => {
				return {
					...config,
					[key]: value
				};
			});
		}
		httpHandlerConfigs() {
			return this.config ?? {};
		}
	};
}));
//#endregion
//#region node_modules/@smithy/node-http-handler/dist-es/index.js
var dist_es_exports$2 = /* @__PURE__ */ __exportAll({
	DEFAULT_REQUEST_TIMEOUT: () => 0,
	NodeHttp2Handler: () => NodeHttp2Handler,
	NodeHttpHandler: () => NodeHttpHandler,
	streamCollector: () => import_serde$1.streamCollector
});
var import_serde$1;
var init_dist_es$1 = __esmMin((() => {
	init_node_http_handler();
	init_node_http2_handler();
	import_serde$1 = require_serde();
}));
//#endregion
//#region node_modules/@smithy/core/dist-cjs/submodules/cbor/index.js
var require_cbor = /* @__PURE__ */ __commonJSMin(((exports) => {
	var { nv, NumericValue, calculateBodyLength, _parseEpochTimestamp, fromBase64, generateIdempotencyToken } = require_serde();
	var { HttpRequest, collectBody, SerdeContext, RpcProtocol } = require_protocols$1();
	var { NormalizedSchema, deref, TypeRegistry } = require_schema();
	var { getSmithyContext } = require_transport();
	var majorUint64 = 0;
	var majorNegativeInt64 = 1;
	var majorUnstructuredByteString = 2;
	var majorUtf8String = 3;
	var majorList = 4;
	var majorMap = 5;
	var majorTag = 6;
	var majorSpecial = 7;
	var specialFalse = 20;
	var specialTrue = 21;
	var specialNull = 22;
	var specialUndefined = 23;
	var extendedOneByte = 24;
	var extendedFloat16 = 25;
	var extendedFloat32 = 26;
	var extendedFloat64 = 27;
	var minorIndefinite = 31;
	function alloc(size) {
		return typeof Buffer !== "undefined" ? Buffer.alloc(size) : new Uint8Array(size);
	}
	var tagSymbol = Symbol("@smithy/core/cbor::tagSymbol");
	function tag(data) {
		data[tagSymbol] = true;
		return data;
	}
	var USE_BUFFER$1 = typeof Buffer !== "undefined";
	var textDecoder = new TextDecoder();
	var payload = alloc(0);
	var isBuffer = false;
	var dataView$1 = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
	var _offset = 0;
	function setPayload(bytes) {
		payload = bytes;
		isBuffer = USE_BUFFER$1 && payload instanceof Buffer;
		dataView$1 = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
	}
	function decode(at, to) {
		if (at >= to) throw new Error("unexpected end of (decode) payload.");
		const major = (payload[at] & 224) >> 5;
		const minor = payload[at] & 31;
		if (minor === minorIndefinite && 2 <= major && major <= 5) return decodeIndefinite(at, to);
		switch (major) {
			case majorUint64:
			case majorNegativeInt64:
			case majorTag: {
				let unsignedInt;
				let offset;
				if (minor < 24) {
					unsignedInt = minor;
					offset = 1;
				} else switch (minor) {
					case extendedOneByte:
						if (to - at < 2) overflow(1);
						unsignedInt = payload[at + 1];
						offset = 2;
						break;
					case extendedFloat16:
						if (to - at < 3) overflow(2);
						unsignedInt = dataView$1.getUint16(at + 1);
						offset = 3;
						break;
					case extendedFloat32:
						if (to - at < 5) overflow(4);
						unsignedInt = dataView$1.getUint32(at + 1);
						offset = 5;
						break;
					case extendedFloat64:
						if (to - at < 9) overflow(8);
						{
							const hi = dataView$1.getUint32(at + 1);
							if (hi < 2097152) unsignedInt = hi * 4294967296 + dataView$1.getUint32(at + 5);
							else unsignedInt = dataView$1.getBigUint64(at + 1);
						}
						offset = 9;
						break;
					default: unexpectedMinor(minor);
				}
				if (major === majorUint64) {
					_offset = offset;
					return castBigInt(unsignedInt);
				} else if (major === majorNegativeInt64) {
					let negativeInt;
					if (typeof unsignedInt === "bigint") negativeInt = BigInt(-1) - unsignedInt;
					else negativeInt = -1 - unsignedInt;
					_offset = offset;
					return castBigInt(negativeInt);
				} else return decodeTagValue(at, to, minor, unsignedInt, offset);
			}
			case majorUtf8String: return decodeUtf8String(at, to);
			case majorMap: return decodeMap(at, to);
			case majorList: return decodeList(at, to);
			case majorUnstructuredByteString: return decodeUnstructuredByteString(at, to);
			default: return decodeSpecial(at, to);
		}
	}
	function decodeIndefinite(at, to) {
		const major = (payload[at] & 224) >> 5;
		if ((payload[at] & 31) === minorIndefinite) switch (major) {
			case majorUtf8String: return decodeUtf8StringIndefinite(at, to);
			case majorMap: return decodeMapIndefinite(at, to);
			case majorList: return decodeListIndefinite(at, to);
			case majorUnstructuredByteString: return decodeUnstructuredByteStringIndefinite(at, to);
		}
	}
	function bytesToFloat16(a, b) {
		const sign = a >> 7;
		const exponent = (a & 124) >> 2;
		const fraction = (a & 3) << 8 | b;
		const scalar = sign === 0 ? 1 : -1;
		if (exponent === 0) {
			if (fraction === 0) return 0;
			return scalar * (Math.pow(2, -14) * (fraction / 1024));
		} else if (exponent === 31) {
			if (fraction === 0) return scalar * Infinity;
			return NaN;
		}
		return scalar * (Math.pow(2, exponent - 15) * (1 + fraction / 1024));
	}
	function decodeMap(at, to) {
		const mapDataLength = decodeCount(at, to);
		if (mapDataLength < 15) return decodeMapSmall(at, to, mapDataLength);
		return decodeMapLarge(at, to, mapDataLength);
	}
	function decodeMapLarge(at, to, mapDataLength) {
		const offset = _offset;
		at += offset;
		const base = at;
		const map = Object.create(null);
		for (let i = 0; i < mapDataLength; ++i) {
			const key = decodeUtf8String(at, to);
			at += _offset;
			if ((payload[at] & 224) >> 5 === majorUtf8String) map[key] = decodeUtf8String(at, to);
			else map[key] = decode(at, to);
			at += _offset;
		}
		_offset = offset + (at - base);
		Object.setPrototypeOf(map, Object.prototype);
		return map;
	}
	function decodeMapSmall(at, to, mapDataLength) {
		const offset = _offset;
		at += offset;
		const base = at;
		const map = {};
		for (let i = 0; i < mapDataLength; ++i) {
			const key = decodeUtf8String(at, to);
			at += _offset;
			map[key] = decode(at, to);
			at += _offset;
		}
		_offset = offset + (at - base);
		return map;
	}
	function decodeList(at, to) {
		const listDataLength = decodeCount(at, to);
		const offset = _offset;
		at += offset;
		const base = at;
		const list = Array(listDataLength);
		for (let i = 0; i < listDataLength; ++i) {
			list[i] = decode(at, to);
			at += _offset;
		}
		_offset = offset + (at - base);
		return list;
	}
	function decodeUtf8String(at, to) {
		const length = decodeCount(at, to);
		const offset = _offset;
		at += offset;
		if (to - at < length) overflow(length);
		_offset = offset + length;
		if (length < 24) return decodeUtf8StringCached(at, length);
		if (isBuffer) return payload.toString("utf-8", at, at + length);
		return textDecoder.decode(payload.subarray(at, at + length));
	}
	var stringCache = new Array(2048);
	var stringCacheEpochs = /* @__PURE__ */ new Uint16Array(2048);
	var cacheEpoch = 0;
	function advanceDecodingEpoch() {
		cacheEpoch = cacheEpoch + 1 & 65535;
	}
	function decodeUtf8StringCached(at, length) {
		let h = length;
		for (let i = 0; i < length; ++i) h = h * 31 + payload[at + i] | 0;
		const slot = h >>> 0 & 2047;
		const cached = stringCache[slot];
		if (cached !== void 0) {
			if (cached.length === length) {
				let match = true;
				for (let i = 0; i < length; ++i) if (cached.charCodeAt(i) !== payload[at + i]) {
					match = false;
					break;
				}
				if (match) {
					stringCacheEpochs[slot] = cacheEpoch;
					return cached;
				}
			}
		}
		const result = isBuffer ? payload.toString("utf-8", at, at + length) : textDecoder.decode(payload.subarray(at, at + length));
		if (stringCacheEpochs[slot] !== cacheEpoch) {
			stringCache[slot] = result;
			stringCacheEpochs[slot] = cacheEpoch;
		}
		return result;
	}
	function decodeUnstructuredByteString(at, to) {
		const length = decodeCount(at, to);
		const offset = _offset;
		at += offset;
		if (to - at < length) overflow(length);
		const value = payload.subarray(at, at + length);
		_offset = offset + length;
		return value;
	}
	function decodeTagValue(at, to, minor, unsignedInt, offset) {
		if (minor === 2 || minor === 3) {
			const length = decodeCount(at + offset, to);
			let b = BigInt(0);
			const start = at + offset + _offset;
			for (let i = start; i < start + length; ++i) b = b << BigInt(8) | BigInt(payload[i]);
			_offset = offset + _offset + length;
			return minor === 3 ? -b - BigInt(1) : b;
		} else if (minor === 4) {
			const [exponent, mantissa] = decode(at + offset, to);
			const normalizer = mantissa < 0 ? -1 : 1;
			const mantissaStr = "0".repeat(Math.abs(exponent) + 1) + String(BigInt(normalizer) * BigInt(mantissa));
			let numericString;
			const sign = mantissa < 0 ? "-" : "";
			numericString = exponent === 0 ? mantissaStr : mantissaStr.slice(0, mantissaStr.length + exponent) + "." + mantissaStr.slice(exponent);
			numericString = numericString.replace(/^0+/g, "");
			if (numericString === "") numericString = "0";
			if (numericString[0] === ".") numericString = "0" + numericString;
			numericString = sign + numericString;
			_offset = offset + _offset;
			return nv(numericString);
		} else {
			const value = decode(at + offset, to);
			_offset = offset + _offset;
			return tag({
				tag: castBigInt(unsignedInt),
				value
			});
		}
	}
	function decodeSpecial(at, to) {
		const minor = payload[at] & 31;
		switch (minor) {
			case specialTrue:
			case specialFalse:
				_offset = 1;
				return minor === specialTrue;
			case specialNull:
				_offset = 1;
				return null;
			case specialUndefined:
				_offset = 1;
				return null;
			case extendedFloat16:
				if (to - at < 3) throw new Error("incomplete float16 at end of buf.");
				_offset = 3;
				return bytesToFloat16(payload[at + 1], payload[at + 2]);
			case extendedFloat32:
				if (to - at < 5) throw new Error("incomplete float32 at end of buf.");
				_offset = 5;
				return dataView$1.getFloat32(at + 1);
			case extendedFloat64:
				if (to - at < 9) throw new Error("incomplete float64 at end of buf.");
				_offset = 9;
				return dataView$1.getFloat64(at + 1);
			default: unexpectedMinor(minor);
		}
	}
	function decodeCount(at, to) {
		const minor = payload[at] & 31;
		if (minor < 24) {
			_offset = 1;
			return minor;
		}
		switch (minor) {
			case extendedOneByte:
				if (to - at < 2) overflow(1);
				_offset = 2;
				return payload[at + 1];
			case extendedFloat16:
				if (to - at < 3) overflow(2);
				_offset = 3;
				return dataView$1.getUint16(at + 1);
			case extendedFloat32:
				if (to - at < 5) overflow(4);
				_offset = 5;
				return dataView$1.getUint32(at + 1);
			case extendedFloat64:
				if (to - at < 9) overflow(8);
				_offset = 9;
				return demote(dataView$1.getBigUint64(at + 1));
			default: unexpectedMinor(minor);
		}
	}
	function decodeMapIndefinite(at, to) {
		at += 1;
		const base = at;
		const map = {};
		for (; at < to;) {
			if (payload[at] === 255) {
				_offset = at - base + 2;
				return map;
			}
			const key = decodeUtf8String(at, to);
			at += _offset;
			map[key] = decode(at, to);
			at += _offset;
		}
		throw new Error("expected break marker.");
	}
	function decodeListIndefinite(at, to) {
		at += 1;
		const list = [];
		for (const base = at; at < to;) {
			if (payload[at] === 255) {
				_offset = at - base + 2;
				return list;
			}
			list.push(decode(at, to));
			at += _offset;
		}
		throw new Error("expected break marker.");
	}
	function decodeUtf8StringIndefinite(at, to) {
		at += 1;
		const vector = [];
		for (const base = at; at < to;) {
			if (payload[at] === 255) {
				const data = alloc(vector.length);
				data.set(vector, 0);
				_offset = at - base + 2;
				if (USE_BUFFER$1) return data.toString("utf-8", 0, data.length);
				return textDecoder.decode(data);
			}
			const major = (payload[at] & 224) >> 5;
			const minor = payload[at] & 31;
			if (major !== majorUtf8String) unexpectedMajorInIndefiniteString(major);
			if (minor === minorIndefinite) throw new Error("nested indefinite string.");
			const bytes = decodeUnstructuredByteString(at, to);
			at += _offset;
			for (let i = 0; i < bytes.length; ++i) vector.push(bytes[i]);
		}
		throw new Error("expected break marker.");
	}
	function decodeUnstructuredByteStringIndefinite(at, to) {
		at += 1;
		const vector = [];
		for (const base = at; at < to;) {
			if (payload[at] === 255) {
				const data = alloc(vector.length);
				data.set(vector, 0);
				_offset = at - base + 2;
				return data;
			}
			const major = (payload[at] & 224) >> 5;
			const minor = payload[at] & 31;
			if (major !== majorUnstructuredByteString) unexpectedMajorInIndefiniteString(major);
			if (minor === minorIndefinite) throw new Error("nested indefinite string.");
			const bytes = decodeUnstructuredByteString(at, to);
			at += _offset;
			for (let i = 0; i < bytes.length; ++i) vector.push(bytes[i]);
		}
		throw new Error("expected break marker.");
	}
	function castBigInt(bigInt) {
		if (typeof bigInt === "number") return bigInt;
		const num = Number(bigInt);
		if (Number.MIN_SAFE_INTEGER <= num && num <= Number.MAX_SAFE_INTEGER) return num;
		return bigInt;
	}
	function demote(bigInteger) {
		const num = Number(bigInteger);
		if (num < Number.MIN_SAFE_INTEGER || Number.MAX_SAFE_INTEGER < num) console.warn(/* @__PURE__ */ new Error(`@smithy/core/cbor - truncating BigInt(${bigInteger}) to ${num} with loss of precision.`));
		return num;
	}
	function overflow(n) {
		throw new Error(`length ${n} greater than remaining buf len.`);
	}
	function unexpectedMinor(minor) {
		throw new Error(`unexpected minor value ${minor}.`);
	}
	function unexpectedMajorInIndefiniteString(major) {
		throw new Error(`unexpected major type ${major} in indefinite string.`);
	}
	var USE_BUFFER = typeof Buffer !== "undefined";
	var encodeStringCache = /* @__PURE__ */ new Map();
	var encodeCacheEpoch = 0;
	var encodeCacheSaturated = false;
	var data = alloc(2048);
	var dataView = new DataView(data.buffer, data.byteOffset, data.byteLength);
	var cursor = 0;
	function encode(_input) {
		const encodeStack = [_input];
		while (encodeStack.length) {
			const input = encodeStack.pop();
			if (typeof input === "string") {
				const len = input.length;
				if (USE_BUFFER) {
					ensureSpace(len * 3 + 9);
					if (len > 23) {
						encodeHeader(majorUtf8String, Buffer.byteLength(input));
						cursor += data.write(input, cursor);
					} else encodeStringCached(input);
				} else {
					ensureSpace(len * 3 + 9);
					const headerPos = cursor;
					const byteLen = new TextEncoder().encodeInto(input, data.subarray(cursor + 9)).written;
					let headerSize;
					if (byteLen < 24) headerSize = 1;
					else if (byteLen < 256) headerSize = 2;
					else if (byteLen < 65536) headerSize = 3;
					else if (byteLen < 4294967296) headerSize = 5;
					else headerSize = 9;
					if (headerSize < 9) data.copyWithin(headerPos + headerSize, headerPos + 9, headerPos + 9 + byteLen);
					cursor = headerPos;
					encodeInteger(majorUtf8String, byteLen);
					cursor += byteLen;
				}
				continue;
			}
			if (data.byteLength - cursor < 9) ensureSpace(64);
			if (typeof input === "number") {
				if (Number.isInteger(input)) {
					const nonNegative = input >= 0;
					const major = nonNegative ? majorUint64 : majorNegativeInt64;
					const value = nonNegative ? input : -input - 1;
					if (value < 24) data[cursor++] = major << 5 | value;
					else if (value < 256) {
						data[cursor++] = major << 5 | 24;
						data[cursor++] = value;
					} else if (value < 65536) {
						data[cursor++] = major << 5 | extendedFloat16;
						data[cursor++] = value >> 8;
						data[cursor++] = value & 255;
					} else if (value < 4294967296) {
						data[cursor++] = major << 5 | extendedFloat32;
						dataView.setUint32(cursor, value);
						cursor += 4;
					} else {
						data[cursor++] = major << 5 | extendedFloat64;
						const hi = value / 4294967296 | 0;
						const lo = value - hi * 4294967296 | 0;
						dataView.setUint32(cursor, hi);
						dataView.setUint32(cursor + 4, lo);
						cursor += 8;
					}
					continue;
				}
				data[cursor++] = 251;
				dataView.setFloat64(cursor, input);
				cursor += 8;
				continue;
			} else if (typeof input === "bigint") {
				const nonNegative = input >= 0;
				const major = nonNegative ? majorUint64 : majorNegativeInt64;
				const value = nonNegative ? input : -input - BigInt(1);
				if (value < BigInt("18446744073709551616")) {
					const n = Number(value);
					if (n < 4294967296) encodeInteger(major, n);
					else {
						data[cursor++] = major << 5 | extendedFloat64;
						dataView.setBigUint64(cursor, value);
						cursor += 8;
					}
				} else {
					const binaryBigInt = value.toString(2);
					const bigIntBytes = new Uint8Array(Math.ceil(binaryBigInt.length / 8));
					let b = value;
					let i = 0;
					while (bigIntBytes.byteLength - ++i >= 0) {
						bigIntBytes[bigIntBytes.byteLength - i] = Number(b & BigInt(255));
						b >>= BigInt(8);
					}
					ensureSpace(bigIntBytes.byteLength * 2 + 16);
					data[cursor++] = nonNegative ? 194 : 195;
					encodeHeader(majorUnstructuredByteString, bigIntBytes.byteLength);
					data.set(bigIntBytes, cursor);
					cursor += bigIntBytes.byteLength;
				}
				continue;
			} else if (input === null) {
				data[cursor++] = 246;
				continue;
			} else if (typeof input === "boolean") {
				data[cursor++] = majorSpecial << 5 | (input ? specialTrue : specialFalse);
				continue;
			} else if (typeof input === "undefined") throw new Error("@smithy/core/cbor: client may not serialize undefined value.");
			else if (Array.isArray(input)) {
				encodeInteger(majorList, input.length);
				ensureSpace(input.length * 9 + 64);
				for (let i = input.length - 1; i >= 0; --i) encodeStack.push(input[i]);
				continue;
			} else if (typeof input.byteLength === "number") {
				ensureSpace(input.length * 2 + 9);
				encodeInteger(majorUnstructuredByteString, input.length);
				data.set(input, cursor);
				cursor += input.byteLength;
				continue;
			} else if (typeof input === "object") {
				if (input instanceof NumericValue) {
					const decimalIndex = input.string.indexOf(".");
					const exponent = decimalIndex === -1 ? 0 : decimalIndex - input.string.length + 1;
					const mantissa = BigInt(input.string.replace(".", ""));
					data[cursor++] = 196;
					encodeInteger(majorList, 2);
					encodeStack.push(mantissa);
					encodeStack.push(exponent);
					continue;
				}
				if (input[tagSymbol]) if ("tag" in input && "value" in input) {
					encodeStack.push(input.value);
					encodeHeader(majorTag, input.tag);
					continue;
				} else throw new Error("tag encountered with missing fields, need 'tag' and 'value', found: " + JSON.stringify(input));
				const keys = Object.keys(input);
				const len = keys.length;
				encodeInteger(majorMap, len);
				for (let i = len - 1; i >= 0; --i) {
					encodeStack.push(input[keys[i]]);
					encodeStack.push(keys[i]);
				}
				continue;
			}
			throw new Error(`data type ${input?.constructor?.name ?? typeof input} not compatible for encoding.`);
		}
	}
	function advanceEncodingEpoch() {
		encodeCacheEpoch = encodeCacheEpoch + 1 & 65535;
		encodeCacheSaturated = false;
	}
	function toUint8Array() {
		const out = alloc(cursor);
		out.set(data.subarray(0, cursor), 0);
		cursor = 0;
		return out;
	}
	function resize(size) {
		const old = data;
		data = alloc(size);
		if (old) if (old.copy) old.copy(data, 0, 0, old.byteLength);
		else data.set(old, 0);
		dataView = new DataView(data.buffer, data.byteOffset, data.byteLength);
	}
	function encodeStringCached(input) {
		const cached = encodeStringCache.get(input);
		if (cached !== void 0) {
			data.set(cached.bytes, cursor);
			cursor += cached.bytes.length;
			cached.epoch = encodeCacheEpoch;
			return;
		}
		const start = cursor;
		encodeInteger(majorUtf8String, Buffer.byteLength(input));
		cursor += data.write(input, cursor);
		const bytes = Uint8Array.prototype.slice.call(data, start, cursor);
		if (encodeStringCache.size >= 2048) {
			if (encodeCacheSaturated) return;
			let evicted = 0;
			for (const [key, entry] of encodeStringCache) {
				if (evicted >= 1024) break;
				if (entry.epoch !== encodeCacheEpoch) {
					encodeStringCache.delete(key);
					evicted++;
				}
			}
			if (evicted === 0) {
				encodeCacheSaturated = true;
				return;
			}
		}
		if (encodeStringCache.size < 2048) encodeStringCache.set(input, {
			epoch: encodeCacheEpoch,
			bytes
		});
	}
	function ensureSpace(bytes) {
		if (data.byteLength - cursor < bytes) if (cursor < 16e6) resize(Math.max(data.byteLength * 4, data.byteLength + bytes));
		else resize(data.byteLength + bytes + 16e6);
	}
	function encodeHeader(major, value) {
		if (value < 24) data[cursor++] = major << 5 | value;
		else if (value < 256) {
			data[cursor++] = major << 5 | 24;
			data[cursor++] = value;
		} else if (value < 65536) {
			data[cursor++] = major << 5 | extendedFloat16;
			dataView.setUint16(cursor, value);
			cursor += 2;
		} else if (value < 4294967296) {
			data[cursor++] = major << 5 | extendedFloat32;
			dataView.setUint32(cursor, value);
			cursor += 4;
		} else {
			data[cursor++] = major << 5 | extendedFloat64;
			dataView.setBigUint64(cursor, typeof value === "bigint" ? value : BigInt(value));
			cursor += 8;
		}
	}
	function encodeInteger(major, value) {
		if (value < 24) data[cursor++] = major << 5 | value;
		else if (value < 256) {
			data[cursor++] = major << 5 | 24;
			data[cursor++] = value;
		} else if (value < 65536) {
			data[cursor++] = major << 5 | extendedFloat16;
			data[cursor++] = value >> 8;
			data[cursor++] = value & 255;
		} else if (value < 4294967296) {
			data[cursor++] = major << 5 | extendedFloat32;
			dataView.setUint32(cursor, value);
			cursor += 4;
		} else {
			data[cursor++] = major << 5 | extendedFloat64;
			const hi = value / 4294967296 | 0;
			const lo = value - hi * 4294967296 | 0;
			dataView.setUint32(cursor, hi);
			dataView.setUint32(cursor + 4, lo);
			cursor += 8;
		}
	}
	var cbor = {
		deserialize(payload) {
			advanceDecodingEpoch();
			setPayload(payload);
			return decode(0, payload.length);
		},
		serialize(input) {
			advanceEncodingEpoch();
			try {
				encode(input);
				return toUint8Array();
			} catch (e) {
				toUint8Array();
				throw e;
			}
		},
		resizeEncodingBuffer(size) {
			resize(size);
		}
	};
	var parseCborBody = (streamBody, context) => {
		return collectBody(streamBody, context).then(async (bytes) => {
			if (bytes.length) try {
				return cbor.deserialize(bytes);
			} catch (e) {
				Object.defineProperty(e, "$responseBodyText", { value: context.utf8Encoder(bytes) });
				throw e;
			}
			return {};
		});
	};
	var dateToTag = (date) => {
		return tag({
			tag: 1,
			value: date.getTime() / 1e3
		});
	};
	var parseCborErrorBody = async (errorBody, context) => {
		const value = await parseCborBody(errorBody, context);
		value.message = value.message ?? value.Message;
		return value;
	};
	var loadSmithyRpcV2CborErrorCode = (output, data) => {
		const sanitizeErrorCode = (rawValue) => {
			let cleanValue = rawValue;
			if (typeof cleanValue === "number") cleanValue = cleanValue.toString();
			if (cleanValue.indexOf(",") >= 0) cleanValue = cleanValue.split(",")[0];
			if (cleanValue.indexOf(":") >= 0) cleanValue = cleanValue.split(":")[0];
			if (cleanValue.indexOf("#") >= 0) cleanValue = cleanValue.split("#")[1];
			return cleanValue;
		};
		if (data["__type"] !== void 0) return sanitizeErrorCode(data["__type"]);
		let codeKey;
		for (const key in data) if (key.toLowerCase() === "code") {
			codeKey = key;
			break;
		}
		if (codeKey && data[codeKey] !== void 0) return sanitizeErrorCode(data[codeKey]);
	};
	var checkCborResponse = (response) => {
		if (String(response.headers["smithy-protocol"]).toLowerCase() !== "rpc-v2-cbor") throw new Error("Malformed RPCv2 CBOR response, status: " + response.statusCode);
	};
	var buildHttpRpcRequest = async (context, headers, path, resolvedHostname, body) => {
		const endpoint = await context.endpoint();
		const { hostname, protocol = "https", port, path: basePath } = endpoint;
		const contents = {
			protocol,
			hostname,
			port,
			method: "POST",
			path: basePath.endsWith("/") ? basePath.slice(0, -1) + path : basePath + path,
			headers: { ...headers }
		};
		if (resolvedHostname !== void 0) contents.hostname = resolvedHostname;
		if (endpoint.headers) for (const name in endpoint.headers) contents.headers[name] = endpoint.headers[name];
		if (body !== void 0) {
			contents.body = body;
			try {
				contents.headers["content-length"] = String(calculateBodyLength(body));
			} catch (ignored) {}
		}
		return new HttpRequest(contents);
	};
	var CborCodec = class extends SerdeContext {
		createSerializer() {
			const serializer = new CborShapeSerializer();
			serializer.setSerdeContext(this.serdeContext);
			return serializer;
		}
		createDeserializer() {
			const deserializer = new CborShapeDeserializer();
			deserializer.setSerdeContext(this.serdeContext);
			return deserializer;
		}
	};
	var CborShapeSerializer = class extends SerdeContext {
		value;
		write(schema, value) {
			this.value = this.serialize(schema, value);
		}
		serialize(schema, source) {
			const ns = NormalizedSchema.of(schema);
			if (source == null) {
				if (ns.isIdempotencyToken()) return generateIdempotencyToken();
				return source;
			}
			if (ns.isBlobSchema()) {
				if (typeof source === "string") return (this.serdeContext?.base64Decoder ?? fromBase64)(source);
				return source;
			}
			if (ns.isTimestampSchema()) {
				if (typeof source === "number" || typeof source === "bigint") return dateToTag(/* @__PURE__ */ new Date(Number(source) / 1e3 | 0));
				return dateToTag(source);
			}
			if (typeof source === "function" || typeof source === "object") {
				const sourceObject = source;
				if (ns.isListSchema() && Array.isArray(sourceObject)) {
					const sparse = !!ns.getMergedTraits().sparse;
					const newArray = [];
					let i = 0;
					for (const item of sourceObject) {
						const value = this.serialize(ns.getValueSchema(), item);
						if (value != null || sparse) newArray[i++] = value;
					}
					return newArray;
				}
				if (sourceObject instanceof Date) return dateToTag(sourceObject);
				const newObject = {};
				if (ns.isMapSchema()) {
					const sparse = !!ns.getMergedTraits().sparse;
					for (const key in sourceObject) {
						const value = this.serialize(ns.getValueSchema(), sourceObject[key]);
						if (value != null || sparse) newObject[key] = value;
					}
				} else if (ns.isStructSchema()) {
					for (const [key, memberSchema] of ns.structIterator()) {
						const value = this.serialize(memberSchema, sourceObject[key]);
						if (value != null) newObject[key] = value;
					}
					if (ns.isUnionSchema() && Array.isArray(sourceObject.$unknown)) {
						const [k, v] = sourceObject.$unknown;
						newObject[k] = v;
					} else if (typeof sourceObject.__type === "string") {
						for (const k in sourceObject) if (!(k in newObject)) newObject[k] = this.serialize(15, sourceObject[k]);
					}
				} else if (ns.isDocumentSchema()) for (const key in sourceObject) newObject[key] = this.serialize(ns.getValueSchema(), sourceObject[key]);
				else if (ns.isBigDecimalSchema()) return sourceObject;
				return newObject;
			}
			return source;
		}
		flush() {
			const buffer = cbor.serialize(this.value);
			this.value = void 0;
			return buffer;
		}
	};
	var CborShapeDeserializer = class extends SerdeContext {
		read(schema, bytes) {
			const data = cbor.deserialize(bytes);
			return this.readValue(schema, data);
		}
		readValue(_schema, value) {
			const ns = NormalizedSchema.of(_schema);
			if (ns.isTimestampSchema()) {
				if (typeof value === "number") return _parseEpochTimestamp(value);
				if (typeof value === "object") {
					if (value.tag === 1 && "value" in value) return _parseEpochTimestamp(value.value);
				}
			}
			if (ns.isBlobSchema()) {
				if (typeof value === "string") return (this.serdeContext?.base64Decoder ?? fromBase64)(value);
				return value;
			}
			if (typeof value === "undefined" || typeof value === "boolean" || typeof value === "number" || typeof value === "string" || typeof value === "bigint" || typeof value === "symbol") return value;
			else if (typeof value === "object") {
				if (value === null) return null;
				if ("byteLength" in value) return value;
				if (value instanceof Date) return value;
				if (ns.isDocumentSchema()) return value;
				if (ns.isListSchema()) {
					const newArray = [];
					const memberSchema = ns.getValueSchema();
					for (const item of value) {
						const itemValue = this.readValue(memberSchema, item);
						newArray.push(itemValue);
					}
					return newArray;
				}
				const newObject = {};
				if (ns.isMapSchema()) {
					const targetSchema = ns.getValueSchema();
					for (const key in value) newObject[key] = this.readValue(targetSchema, value[key]);
				} else if (ns.isStructSchema()) {
					const isUnion = ns.isUnionSchema();
					let keys;
					if (isUnion) {
						keys = /* @__PURE__ */ new Set();
						for (const k in value) if (k !== "__type") keys.add(k);
					}
					for (const [key, memberSchema] of ns.structIterator()) {
						if (isUnion) keys.delete(key);
						if (value[key] != null) newObject[key] = this.readValue(memberSchema, value[key]);
					}
					if (isUnion && keys?.size === 1) {
						let newObjectEmpty = true;
						for (const _ in newObject) {
							newObjectEmpty = false;
							break;
						}
						if (newObjectEmpty) {
							const k = keys.values().next().value;
							newObject.$unknown = [k, value[k]];
						}
					} else if (typeof value.__type === "string") {
						for (const k in value) if (!(k in newObject)) newObject[k] = value[k];
					}
				} else if (value instanceof NumericValue) return value;
				return newObject;
			} else return value;
		}
	};
	var SmithyRpcV2CborProtocol = class extends RpcProtocol {
		codec = new CborCodec();
		serializer = this.codec.createSerializer();
		deserializer = this.codec.createDeserializer();
		constructor({ defaultNamespace, errorTypeRegistries }) {
			super({
				defaultNamespace,
				errorTypeRegistries
			});
		}
		getShapeId() {
			return "smithy.protocols#rpcv2Cbor";
		}
		getPayloadCodec() {
			return this.codec;
		}
		async serializeRequest(operationSchema, input, context) {
			const request = await super.serializeRequest(operationSchema, input, context);
			Object.assign(request.headers, {
				"content-type": this.getDefaultContentType(),
				"smithy-protocol": "rpc-v2-cbor",
				accept: this.getDefaultContentType()
			});
			if (deref(operationSchema.input) === "unit") {
				delete request.body;
				delete request.headers["content-type"];
			} else {
				if (!request.body) {
					this.serializer.write(15, {});
					request.body = this.serializer.flush();
				}
				try {
					request.headers["content-length"] = String(request.body.byteLength);
				} catch (ignored) {}
			}
			const { service, operation } = getSmithyContext(context);
			const path = `/service/${service}/operation/${operation}`;
			if (request.path.endsWith("/")) request.path += path.slice(1);
			else request.path += path;
			return request;
		}
		async deserializeResponse(operationSchema, context, response) {
			return super.deserializeResponse(operationSchema, context, response);
		}
		async handleError(operationSchema, context, response, dataObject, metadata) {
			const errorName = loadSmithyRpcV2CborErrorCode(response, dataObject) ?? "Unknown";
			const errorMetadata = {
				$metadata: metadata,
				$fault: response.statusCode <= 500 ? "client" : "server"
			};
			let namespace = this.options.defaultNamespace;
			if (errorName.includes("#")) [namespace] = errorName.split("#");
			const registry = this.compositeErrorRegistry;
			const nsRegistry = TypeRegistry.for(namespace);
			registry.copyFrom(nsRegistry);
			let errorSchema;
			try {
				errorSchema = registry.getSchema(errorName);
			} catch (ignored) {
				if (dataObject.Message) dataObject.message = dataObject.Message;
				const syntheticRegistry = TypeRegistry.for("smithy.ts.sdk.synthetic." + namespace);
				registry.copyFrom(syntheticRegistry);
				const baseExceptionSchema = registry.getBaseException();
				if (baseExceptionSchema) {
					const ErrorCtor = registry.getErrorCtor(baseExceptionSchema);
					throw Object.assign(new ErrorCtor({ name: errorName }), errorMetadata, dataObject);
				}
				throw Object.assign(new Error(errorName), errorMetadata, dataObject);
			}
			const ns = NormalizedSchema.of(errorSchema);
			const ErrorCtor = registry.getErrorCtor(errorSchema);
			const message = dataObject.message ?? dataObject.Message ?? "Unknown";
			const exception = new ErrorCtor({});
			const output = {};
			for (const [name, member] of ns.structIterator()) output[name] = this.deserializer.readValue(member, dataObject[name]);
			throw Object.assign(exception, errorMetadata, {
				$fault: ns.getMergedTraits().error,
				message
			}, output);
		}
		getDefaultContentType() {
			return "application/cbor";
		}
	};
	exports.CborCodec = CborCodec;
	exports.CborShapeDeserializer = CborShapeDeserializer;
	exports.CborShapeSerializer = CborShapeSerializer;
	exports.SmithyRpcV2CborProtocol = SmithyRpcV2CborProtocol;
	exports.buildHttpRpcRequest = buildHttpRpcRequest;
	exports.cbor = cbor;
	exports.checkCborResponse = checkCborResponse;
	exports.dateToTag = dateToTag;
	exports.loadSmithyRpcV2CborErrorCode = loadSmithyRpcV2CborErrorCode;
	exports.parseCborBody = parseCborBody;
	exports.parseCborErrorBody = parseCborErrorBody;
	exports.tag = tag;
	exports.tagSymbol = tagSymbol;
}));
//#endregion
//#region node_modules/@aws-sdk/xml-builder/dist-es/escape-attribute.js
function escapeAttribute(value) {
	return value.replace(ATTR_ESCAPE_RE, (ch) => ATTR_ESCAPE_MAP[ch]);
}
var ATTR_ESCAPE_RE, ATTR_ESCAPE_MAP;
var init_escape_attribute = __esmMin((() => {
	ATTR_ESCAPE_RE = /[&<>"]/g;
	ATTR_ESCAPE_MAP = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;"
	};
}));
//#endregion
//#region node_modules/@aws-sdk/xml-builder/dist-es/escape-element.js
function escapeElement(value) {
	return value.replace(ELEMENT_ESCAPE_RE, (ch) => ELEMENT_ESCAPE_MAP[ch]);
}
var ELEMENT_ESCAPE_RE, ELEMENT_ESCAPE_MAP;
var init_escape_element = __esmMin((() => {
	ELEMENT_ESCAPE_RE = /[&"'<>\r\n\u0085\u2028]/g;
	ELEMENT_ESCAPE_MAP = {
		"&": "&amp;",
		"\"": "&quot;",
		"'": "&apos;",
		"<": "&lt;",
		">": "&gt;",
		"\r": "&#x0D;",
		"\n": "&#x0A;",
		"": "&#x85;",
		"\u2028": "&#x2028;"
	};
}));
//#endregion
//#region node_modules/@aws-sdk/xml-builder/dist-es/XmlText.js
var XmlText;
var init_XmlText = __esmMin((() => {
	init_escape_element();
	XmlText = class {
		value;
		constructor(value) {
			this.value = value;
		}
		toString() {
			return escapeElement("" + this.value);
		}
	};
}));
//#endregion
//#region node_modules/@aws-sdk/xml-builder/dist-es/XmlNode.js
var XmlNode;
var init_XmlNode = __esmMin((() => {
	init_escape_attribute();
	init_XmlText();
	XmlNode = class XmlNode {
		name;
		children;
		attributes = {};
		static of(name, childText, withName) {
			const node = new XmlNode(name);
			if (childText !== void 0) node.addChildNode(new XmlText(childText));
			if (withName !== void 0) node.withName(withName);
			return node;
		}
		constructor(name, children = []) {
			this.name = name;
			this.children = children;
		}
		withName(name) {
			this.name = name;
			return this;
		}
		addAttribute(name, value) {
			this.attributes[name] = value;
			return this;
		}
		addChildNode(child) {
			this.children.push(child);
			return this;
		}
		removeAttribute(name) {
			delete this.attributes[name];
			return this;
		}
		n(name) {
			this.name = name;
			return this;
		}
		c(child) {
			this.children.push(child);
			return this;
		}
		a(name, value) {
			if (value != null) this.attributes[name] = value;
			return this;
		}
		cc(input, field, withName = field) {
			if (input[field] != null) {
				const node = XmlNode.of(field, input[field]).withName(withName);
				this.c(node);
			}
		}
		l(input, listName, memberName, valueProvider) {
			if (input[listName] != null) valueProvider().map((node) => {
				node.withName(memberName);
				this.c(node);
			});
		}
		lc(input, listName, memberName, valueProvider) {
			if (input[listName] != null) {
				const nodes = valueProvider();
				const containerNode = new XmlNode(memberName);
				nodes.map((node) => {
					containerNode.c(node);
				});
				this.c(containerNode);
			}
		}
		toString() {
			const hasChildren = Boolean(this.children.length);
			let xmlText = `<${this.name}`;
			const attributes = this.attributes;
			for (const attributeName of Object.keys(attributes)) {
				const attribute = attributes[attributeName];
				if (attribute != null) xmlText += ` ${attributeName}="${escapeAttribute("" + attribute)}"`;
			}
			return xmlText += !hasChildren ? "/>" : `>${this.children.map((c) => c.toString()).join("")}</${this.name}>`;
		}
	};
}));
//#endregion
//#region node_modules/@aws-sdk/xml-builder/dist-es/xml-parser.js
function parseXML(xml) {
	return new AwsXmlParser(xml).parse();
}
var AwsXmlParser;
var init_xml_parser = __esmMin((() => {
	AwsXmlParser = class AwsXmlParser {
		x;
		i = 0;
		z;
		constructor(x) {
			this.x = x;
			this.x = x.replace(/\r\n?/g, "\n");
			this.z = this.x.length;
		}
		parse() {
			const p = this;
			const { z } = p;
			while (p.i < z) {
				p.trim();
				if (p.i >= z) break;
				if (p.isNext("<?")) {
					p.readTo("?>");
					p.trim();
				} else if (p.isNext("<!--")) {
					p.readTo("-->");
					p.trim();
				} else if (p.isNext("<!DOCTYPE", false)) {
					p.skipDoctype();
					p.trim();
				} else if (p.x[p.i] === "<") {
					const root = p.parseTag();
					return { [root.tag]: root.value };
				} else throw new Error("@aws-sdk XML parse error: unexpected content.");
			}
			throw new Error("@aws-sdk XML parse error: no root element.");
		}
		isNext(s, caseSensitive = true) {
			const p = this;
			if (caseSensitive) return p.x.startsWith(s, p.i);
			return p.x.toLowerCase().startsWith(s.toLowerCase(), p.i);
		}
		readTo(stop) {
			const p = this;
			const _i = p.x.indexOf(stop, p.i);
			if (_i === -1) throw new Error(`@aws-sdk XML parse error: expected "${stop}" not found.`);
			const result = p.x.slice(p.i, _i);
			p.i = _i + stop.length;
			return result;
		}
		trim() {
			const p = this;
			while (p.i < p.z && " 	\r\n".includes(p.x[p.i])) ++p.i;
		}
		readAttrValue() {
			const p = this;
			const quote = p.x[p.i];
			++p.i;
			let value = "";
			while (p.i < p.z && p.x[p.i] !== quote) value += p.x[p.i++];
			++p.i;
			return p.decodeEntities(value);
		}
		parseTag() {
			const p = this;
			++p.i;
			let tag = "";
			while (p.i < p.z && !" 	\r\n>/".includes(p.x[p.i])) tag += p.x[p.i++];
			let hasAttrs = false;
			const attrs = Object.create(null);
			while (p.i < p.z) {
				p.trim();
				if (">/".includes(p.x[p.i])) break;
				let name = "";
				while (p.i < p.z && !"= 	\r\n>/?".includes(p.x[p.i])) name += p.x[p.i++];
				p.trim();
				if (p.x[p.i] !== "=") break;
				++p.i;
				p.trim();
				attrs[name] = p.readAttrValue();
				hasAttrs = true;
			}
			if (p.i >= p.z) throw new Error("@aws-sdk XML parse error: unexpected end of input.");
			if (p.x[p.i] === "/") {
				++p.i;
				if (p.i >= p.z || p.x[p.i] !== ">") throw new Error("@aws-sdk XML parse error: expected > at the end of self-closing tag.");
				++p.i;
				Object.setPrototypeOf(attrs, Object.prototype);
				return {
					tag,
					value: hasAttrs ? attrs : ""
				};
			}
			if (p.x[p.i] !== ">") throw new Error("@aws-sdk XML parse error: expected > at the end of opening tag.");
			++p.i;
			const textParts = [];
			const childTags = [];
			let hasElementChild = false;
			while (p.i < p.z) {
				if (p.isNext("</")) break;
				if (p.x[p.i] === "<") if (p.isNext("<!--")) p.readTo("-->");
				else if (p.isNext("<![CDATA[")) {
					p.i += 9;
					textParts.push(p.readTo("]]>"));
				} else if (p.isNext("<?")) p.readTo("?>");
				else {
					hasElementChild = true;
					childTags.push(p.parseTag());
				}
				else {
					let text = "";
					while (p.i < p.z && p.x[p.i] !== "<") text += p.x[p.i++];
					textParts.push(p.decodeEntities(text));
				}
			}
			if (!p.isNext("</")) throw new Error(`@aws-sdk XML parse error: missing closing tag </${tag}>.`);
			p.i += 2;
			const closeTag = p.readTo(">").trim();
			if (closeTag !== tag) throw new Error(`@aws-sdk XML parse error: mismatched tags <${tag}> and </${closeTag}>.`);
			if (!hasAttrs && textParts.length === 0 && !hasElementChild) return {
				tag,
				value: ""
			};
			if (!hasAttrs && !hasElementChild) {
				const text = textParts.length === 1 ? textParts[0] : textParts.join("");
				if (text.trim() === "" && text.includes("\n")) return {
					tag,
					value: ""
				};
				return {
					tag,
					value: text
				};
			}
			const obj = Object.create(null);
			for (const text of textParts) {
				if (text.trim() === "" && text.includes("\n")) continue;
				obj["#text"] = "#text" in obj ? obj["#text"] + text : text;
			}
			for (const child of childTags) if (child.tag in obj) if (Array.isArray(obj[child.tag])) obj[child.tag].push(child.value);
			else obj[child.tag] = [obj[child.tag], child.value];
			else obj[child.tag] = child.value;
			for (const [k, v] of Object.entries(attrs)) obj[k] = v;
			Object.setPrototypeOf(obj, Object.prototype);
			return {
				tag,
				value: obj
			};
		}
		static ENTITIES = {
			amp: "&",
			lt: "<",
			gt: ">",
			quot: "\"",
			apos: "'"
		};
		skipDoctype() {
			const p = this;
			p.i += 9;
			let depth = 0;
			while (p.i < p.z) {
				const c = p.x[p.i];
				if (c === "[") ++depth;
				else if (c === "]") --depth;
				else if (c === ">" && depth === 0) {
					++p.i;
					return;
				}
				++p.i;
			}
			throw new Error("@aws-sdk XML parse error: unclosed DOCTYPE.");
		}
		decodeEntities(s) {
			return s.replace(/&(?:#x([0-9a-fA-F]{1,6})|#(\d{1,7})|([a-zA-Z][a-zA-Z0-9]{0,30}));/g, (_, hex, dec, named) => {
				if (hex) return String.fromCharCode(parseInt(hex, 16));
				if (dec) return String.fromCharCode(parseInt(dec, 10));
				return AwsXmlParser.ENTITIES[named] ?? "";
			});
		}
	};
}));
//#endregion
//#region node_modules/@aws-sdk/xml-builder/dist-es/index.js
var dist_es_exports$1 = /* @__PURE__ */ __exportAll({
	XmlNode: () => XmlNode,
	XmlText: () => XmlText,
	parseXML: () => parseXML
});
var init_dist_es = __esmMin((() => {
	init_XmlNode();
	init_XmlText();
	init_xml_parser();
}));
//#endregion
//#region node_modules/@aws-sdk/core/dist-cjs/submodules/protocols/index.js
var require_protocols = /* @__PURE__ */ __commonJSMin(((exports) => {
	var { SmithyRpcV2CborProtocol, loadSmithyRpcV2CborErrorCode } = require_cbor();
	var { TypeRegistry, NormalizedSchema, deref } = require_schema();
	var { decorateServiceException, getValueFromTextNode } = require_client$1();
	var { collectBody, determineTimestampFormat, RpcProtocol, HttpBindingProtocol, HttpInterceptingShapeSerializer, HttpInterceptingShapeDeserializer, FromStringShapeDeserializer, extendedEncodeURIComponent } = require_protocols$1();
	var { NumericValue, toUtf8, fromBase64, LazyJsonString, parseEpochTimestamp, parseRfc7231DateTime, parseRfc3339DateTimeWithOffset, toBase64, dateToUtcString, generateIdempotencyToken, expectUnion } = require_serde();
	var { parseXML, XmlNode, XmlText } = (init_dist_es(), __toCommonJS(dist_es_exports$1));
	var ProtocolLib = class {
		queryCompat;
		errorRegistry;
		constructor(queryCompat = false) {
			this.queryCompat = queryCompat;
		}
		resolveRestContentType(defaultContentType, inputSchema) {
			const members = inputSchema.getMemberSchemas();
			const httpPayloadMember = Object.values(members).find((m) => {
				return !!m.getMergedTraits().httpPayload;
			});
			if (httpPayloadMember) {
				const mediaType = httpPayloadMember.getMergedTraits().mediaType;
				if (mediaType) return mediaType;
				else if (httpPayloadMember.isStringSchema()) return "text/plain";
				else if (httpPayloadMember.isBlobSchema()) return "application/octet-stream";
				else return defaultContentType;
			} else if (!inputSchema.isUnitSchema()) {
				if (Object.values(members).find((m) => {
					const { httpQuery, httpQueryParams, httpHeader, httpLabel, httpPrefixHeaders } = m.getMergedTraits();
					return !httpQuery && !httpQueryParams && !httpHeader && !httpLabel && httpPrefixHeaders === void 0;
				})) return defaultContentType;
			}
		}
		async getErrorSchemaOrThrowBaseException(errorIdentifier, defaultNamespace, response, dataObject, metadata, getErrorSchema) {
			let errorName = errorIdentifier;
			if (errorIdentifier.includes("#")) [, errorName] = errorIdentifier.split("#");
			const errorMetadata = {
				$metadata: metadata,
				$fault: response.statusCode < 500 ? "client" : "server"
			};
			if (!this.errorRegistry) throw new Error("@aws-sdk/core/protocols - error handler not initialized.");
			try {
				return {
					errorSchema: getErrorSchema?.(this.errorRegistry, errorName) ?? this.errorRegistry.getSchema(errorIdentifier),
					errorMetadata
				};
			} catch (e) {
				dataObject.message = dataObject.message ?? dataObject.Message ?? "UnknownError";
				const synthetic = this.errorRegistry;
				const baseExceptionSchema = synthetic.getBaseException();
				if (baseExceptionSchema) {
					const ErrorCtor = synthetic.getErrorCtor(baseExceptionSchema) ?? Error;
					throw this.decorateServiceException(Object.assign(new ErrorCtor({ name: errorName }), errorMetadata), dataObject);
				}
				const d = dataObject;
				const message = d?.message ?? d?.Message ?? d?.Error?.Message ?? d?.Error?.message;
				throw this.decorateServiceException(Object.assign(new Error(message), { name: errorName }, errorMetadata), dataObject);
			}
		}
		compose(composite, errorIdentifier, defaultNamespace) {
			let namespace = defaultNamespace;
			if (errorIdentifier.includes("#")) [namespace] = errorIdentifier.split("#");
			const staticRegistry = TypeRegistry.for(namespace);
			const defaultSyntheticRegistry = TypeRegistry.for("smithy.ts.sdk.synthetic." + defaultNamespace);
			composite.copyFrom(staticRegistry);
			composite.copyFrom(defaultSyntheticRegistry);
			this.errorRegistry = composite;
		}
		decorateServiceException(exception, additions = {}) {
			if (this.queryCompat) {
				const msg = exception.Message ?? additions.Message;
				const error = decorateServiceException(exception, additions);
				if (msg) error.message = msg;
				const errorObj = error.Error ?? {};
				errorObj.Type = error.Error?.Type;
				errorObj.Code = error.Error?.Code;
				errorObj.Message = error.Error?.message ?? error.Error?.Message ?? msg;
				error.Error = errorObj;
				const reqId = error.$metadata.requestId;
				if (reqId) error.RequestId = reqId;
				return error;
			}
			return decorateServiceException(exception, additions);
		}
		setQueryCompatError(output, response) {
			const queryErrorHeader = response.headers?.["x-amzn-query-error"];
			if (output !== void 0 && queryErrorHeader != null) {
				const [Code, Type] = queryErrorHeader.split(";");
				const keys = Object.keys(output);
				const Error = {
					Code,
					Type
				};
				output.Code = Code;
				output.Type = Type;
				for (let i = 0; i < keys.length; i++) {
					const k = keys[i];
					Error[k === "message" ? "Message" : k] = output[k];
				}
				delete Error.__type;
				output.Error = Error;
			}
		}
		queryCompatOutput(queryCompatErrorData, errorData) {
			if (queryCompatErrorData.Error) errorData.Error = queryCompatErrorData.Error;
			if (queryCompatErrorData.Type) errorData.Type = queryCompatErrorData.Type;
			if (queryCompatErrorData.Code) errorData.Code = queryCompatErrorData.Code;
		}
		findQueryCompatibleError(registry, errorName) {
			try {
				return registry.getSchema(errorName);
			} catch (e) {
				return registry.find((schema) => NormalizedSchema.of(schema).getMergedTraits().awsQueryError?.[0] === errorName);
			}
		}
	};
	var AwsSmithyRpcV2CborProtocol = class extends SmithyRpcV2CborProtocol {
		awsQueryCompatible;
		mixin;
		constructor({ defaultNamespace, errorTypeRegistries, awsQueryCompatible }) {
			super({
				defaultNamespace,
				errorTypeRegistries
			});
			this.awsQueryCompatible = !!awsQueryCompatible;
			this.mixin = new ProtocolLib(this.awsQueryCompatible);
		}
		async serializeRequest(operationSchema, input, context) {
			const request = await super.serializeRequest(operationSchema, input, context);
			if (this.awsQueryCompatible) request.headers["x-amzn-query-mode"] = "true";
			return request;
		}
		async handleError(operationSchema, context, response, dataObject, metadata) {
			if (this.awsQueryCompatible) this.mixin.setQueryCompatError(dataObject, response);
			const errorName = (() => {
				const compatHeader = response.headers["x-amzn-query-error"];
				if (compatHeader && this.awsQueryCompatible) return compatHeader.split(";")[0];
				return loadSmithyRpcV2CborErrorCode(response, dataObject) ?? "Unknown";
			})();
			this.mixin.compose(this.compositeErrorRegistry, errorName, this.options.defaultNamespace);
			const { errorSchema, errorMetadata } = await this.mixin.getErrorSchemaOrThrowBaseException(errorName, this.options.defaultNamespace, response, dataObject, metadata, this.awsQueryCompatible ? this.mixin.findQueryCompatibleError : void 0);
			const ns = NormalizedSchema.of(errorSchema);
			const message = dataObject.message ?? dataObject.Message ?? "UnknownError";
			const exception = new ((this.compositeErrorRegistry.getErrorCtor(errorSchema)) ?? Error)({});
			const output = {};
			for (const [name, member] of ns.structIterator()) if (dataObject[name] != null) output[name] = this.deserializer.readValue(member, dataObject[name]);
			if (this.awsQueryCompatible) this.mixin.queryCompatOutput(dataObject, output);
			throw this.mixin.decorateServiceException(Object.assign(exception, errorMetadata, {
				$fault: ns.getMergedTraits().error,
				message
			}, output), dataObject);
		}
	};
	var _toStr = (val) => {
		if (val == null) return val;
		if (typeof val === "number" || typeof val === "bigint") {
			const warning = /* @__PURE__ */ new Error(`Received number ${val} where a string was expected.`);
			warning.name = "Warning";
			console.warn(warning);
			return String(val);
		}
		if (typeof val === "boolean") {
			const warning = /* @__PURE__ */ new Error(`Received boolean ${val} where a string was expected.`);
			warning.name = "Warning";
			console.warn(warning);
			return String(val);
		}
		return val;
	};
	var _toBool = (val) => {
		if (val == null) return val;
		if (typeof val === "string") {
			const lowercase = val.toLowerCase();
			if (val !== "" && lowercase !== "false" && lowercase !== "true") {
				const warning = /* @__PURE__ */ new Error(`Received string "${val}" where a boolean was expected.`);
				warning.name = "Warning";
				console.warn(warning);
			}
			return val !== "" && lowercase !== "false";
		}
		return val;
	};
	var _toNum = (val) => {
		if (val == null) return val;
		if (typeof val === "string") {
			const num = Number(val);
			if (num.toString() !== val) {
				const warning = /* @__PURE__ */ new Error(`Received string "${val}" where a number was expected.`);
				warning.name = "Warning";
				console.warn(warning);
				return val;
			}
			return num;
		}
		return val;
	};
	var SerdeContextConfig = class {
		serdeContext;
		setSerdeContext(serdeContext) {
			this.serdeContext = serdeContext;
		}
	};
	var UnionSerde = class {
		from;
		to;
		keys;
		constructor(from, to) {
			this.from = from;
			this.to = to;
			const keys = Object.keys(this.from);
			const set = new Set(keys);
			set.delete("__type");
			this.keys = set;
		}
		mark(key) {
			this.keys.delete(key);
		}
		hasUnknown() {
			return this.keys.size === 1 && Object.keys(this.to).length === 0;
		}
		writeUnknown() {
			if (this.hasUnknown()) {
				const k = this.keys.values().next().value;
				const v = this.from[k];
				this.to.$unknown = [k, v];
			}
		}
	};
	function jsonReviver(key, value, context) {
		if (context?.source) {
			const numericString = context.source;
			if (typeof value === "number") {
				if (value > Number.MAX_SAFE_INTEGER || value < Number.MIN_SAFE_INTEGER || numericString !== String(value)) if (numericString.includes(".")) return new NumericValue(numericString, "bigDecimal");
				else return BigInt(numericString);
			}
		}
		return value;
	}
	var collectBodyString = (streamBody, context) => collectBody(streamBody, context).then((body) => (context?.utf8Encoder ?? toUtf8)(body));
	var parseJsonBody = (streamBody, context) => collectBodyString(streamBody, context).then((encoded) => {
		if (encoded.length) try {
			return JSON.parse(encoded);
		} catch (e) {
			if (e?.name === "SyntaxError") Object.defineProperty(e, "$responseBodyText", { value: encoded });
			throw e;
		}
		return {};
	});
	var parseJsonErrorBody = async (errorBody, context) => {
		const value = await parseJsonBody(errorBody, context);
		value.message = value.message ?? value.Message;
		return value;
	};
	var findKey = (object, key) => Object.keys(object).find((k) => k.toLowerCase() === key.toLowerCase());
	var sanitizeErrorCode = (rawValue) => {
		let cleanValue = rawValue;
		if (typeof cleanValue === "number") cleanValue = cleanValue.toString();
		if (cleanValue.indexOf(",") >= 0) cleanValue = cleanValue.split(",")[0];
		if (cleanValue.indexOf(":") >= 0) cleanValue = cleanValue.split(":")[0];
		if (cleanValue.indexOf("#") >= 0) cleanValue = cleanValue.split("#")[1];
		return cleanValue;
	};
	var loadRestJsonErrorCode = (output, data) => {
		return loadErrorCode(output, data, [
			"header",
			"code",
			"type"
		]);
	};
	var loadJsonRpcErrorCode = (output, data, queryCompat = false) => {
		return loadErrorCode(output, data, queryCompat ? [
			"code",
			"header",
			"type"
		] : [
			"type",
			"code",
			"header"
		]);
	};
	var loadErrorCode = ({ headers }, data, order) => {
		while (order.length > 0) switch (order.shift()) {
			case "header":
				const headerKey = findKey(headers ?? {}, "x-amzn-errortype");
				if (headerKey !== void 0) return sanitizeErrorCode(headers[headerKey]);
				break;
			case "code":
				const codeKey = findKey(data ?? {}, "code");
				if (codeKey && data[codeKey] !== void 0) return sanitizeErrorCode(data[codeKey]);
				break;
			case "type":
				if (data?.__type !== void 0) return sanitizeErrorCode(data.__type);
				break;
		}
	};
	var JsonShapeDeserializer = class extends SerdeContextConfig {
		settings;
		constructor(settings) {
			super();
			this.settings = settings;
		}
		async read(schema, data) {
			return this._read(schema, typeof data === "string" ? JSON.parse(data, jsonReviver) : await parseJsonBody(data, this.serdeContext));
		}
		readObject(schema, data) {
			return this._read(schema, data);
		}
		_read(schema, value) {
			const isObject = value !== null && typeof value === "object";
			const ns = NormalizedSchema.of(schema);
			if (isObject) {
				if (ns.isStructSchema()) {
					const record = value;
					const union = ns.isUnionSchema();
					const out = {};
					let nameMap = void 0;
					const { jsonName } = this.settings;
					if (jsonName) nameMap = {};
					let unionSerde;
					if (union) unionSerde = new UnionSerde(record, out);
					for (const [memberName, memberSchema] of ns.structIterator()) {
						let fromKey = memberName;
						if (jsonName) {
							fromKey = memberSchema.getMergedTraits().jsonName ?? fromKey;
							nameMap[fromKey] = memberName;
						}
						if (union) unionSerde.mark(fromKey);
						if (record[fromKey] != null) out[memberName] = this._read(memberSchema, record[fromKey]);
					}
					if (union) unionSerde.writeUnknown();
					else if (typeof record.__type === "string") for (const k in record) {
						const v = record[k];
						const t = jsonName ? nameMap[k] ?? k : k;
						if (!(t in out)) out[t] = v;
					}
					return out;
				}
				if (Array.isArray(value) && ns.isListSchema()) {
					const listMember = ns.getValueSchema();
					const out = [];
					for (const item of value) out.push(this._read(listMember, item));
					return out;
				}
				if (ns.isMapSchema()) {
					const mapMember = ns.getValueSchema();
					const out = {};
					for (const _k in value) out[_k] = this._read(mapMember, value[_k]);
					return out;
				}
			}
			if (ns.isBlobSchema() && typeof value === "string") return fromBase64(value);
			const mediaType = ns.getMergedTraits().mediaType;
			if (ns.isStringSchema() && typeof value === "string" && mediaType) {
				if (mediaType === "application/json" || mediaType.endsWith("+json")) return LazyJsonString.from(value);
				return value;
			}
			if (ns.isTimestampSchema() && value != null) switch (determineTimestampFormat(ns, this.settings)) {
				case 5: return parseRfc3339DateTimeWithOffset(value);
				case 6: return parseRfc7231DateTime(value);
				case 7: return parseEpochTimestamp(value);
				default:
					console.warn("Missing timestamp format, parsing value with Date constructor:", value);
					return new Date(value);
			}
			if (ns.isBigIntegerSchema() && (typeof value === "number" || typeof value === "string")) return BigInt(value);
			if (ns.isBigDecimalSchema() && value != void 0) {
				if (value instanceof NumericValue) return value;
				const untyped = value;
				if (untyped.type === "bigDecimal" && "string" in untyped) return new NumericValue(untyped.string, untyped.type);
				return new NumericValue(String(value), "bigDecimal");
			}
			if (ns.isNumericSchema() && typeof value === "string") {
				switch (value) {
					case "Infinity": return Infinity;
					case "-Infinity": return -Infinity;
					case "NaN": return NaN;
				}
				return value;
			}
			if (ns.isDocumentSchema()) if (isObject) {
				const out = Array.isArray(value) ? [] : {};
				for (const k in value) {
					const v = value[k];
					if (v instanceof NumericValue) out[k] = v;
					else out[k] = this._read(ns, v);
				}
				return out;
			} else return structuredClone(value);
			return value;
		}
	};
	var JsonReplacer = class {
		values = /* @__PURE__ */ new Map();
		counter = 0;
		stage = 0;
		createReplacer() {
			if (this.stage === 1) throw new Error("@aws-sdk/core/protocols - JsonReplacer already created.");
			if (this.stage === 2) throw new Error("@aws-sdk/core/protocols - JsonReplacer exhausted.");
			this.stage = 1;
			return (key, value) => {
				if (value instanceof NumericValue) {
					const v = `${"Νnv" + this.counter++}_` + value.string;
					this.values.set(`"${v}"`, value.string);
					return v;
				}
				if (typeof value === "bigint") {
					const s = value.toString();
					const v = `${"Νb" + this.counter++}_` + s;
					this.values.set(`"${v}"`, s);
					return v;
				}
				return value;
			};
		}
		replaceInJson(json) {
			if (this.stage === 0) throw new Error("@aws-sdk/core/protocols - JsonReplacer not created yet.");
			if (this.stage === 2) throw new Error("@aws-sdk/core/protocols - JsonReplacer exhausted.");
			this.stage = 2;
			if (this.counter === 0) return json;
			for (const [key, value] of this.values) json = json.replace(key, value);
			return json;
		}
	};
	var JsonShapeSerializer = class extends SerdeContextConfig {
		settings;
		buffer;
		useReplacer = false;
		rootSchema;
		constructor(settings) {
			super();
			this.settings = settings;
		}
		write(schema, value) {
			this.rootSchema = NormalizedSchema.of(schema);
			this.buffer = this._write(this.rootSchema, value);
		}
		flush() {
			const { rootSchema, useReplacer } = this;
			this.rootSchema = void 0;
			this.useReplacer = false;
			if (rootSchema?.isStructSchema() || rootSchema?.isDocumentSchema()) {
				if (!useReplacer) return JSON.stringify(this.buffer);
				const replacer = new JsonReplacer();
				return replacer.replaceInJson(JSON.stringify(this.buffer, replacer.createReplacer(), 0));
			}
			return this.buffer;
		}
		writeDiscriminatedDocument(schema, value) {
			this.write(schema, value);
			if (typeof this.buffer === "object") this.buffer.__type = NormalizedSchema.of(schema).getName(true);
		}
		_write(schema, value, container) {
			const isObject = value !== null && typeof value === "object";
			const ns = NormalizedSchema.of(schema);
			if (isObject) {
				if (ns.isStructSchema()) {
					const record = value;
					const out = {};
					const { jsonName } = this.settings;
					let nameMap = void 0;
					if (jsonName) nameMap = {};
					let outCount = 0;
					for (const [memberName, memberSchema] of ns.structIterator()) {
						const serializableValue = this._write(memberSchema, record[memberName], ns);
						if (serializableValue !== void 0) {
							let targetKey = memberName;
							if (jsonName) {
								targetKey = memberSchema.getMergedTraits().jsonName ?? memberName;
								nameMap[memberName] = targetKey;
							}
							out[targetKey] = serializableValue;
							outCount++;
						}
					}
					if (ns.isUnionSchema() && outCount === 0) {
						const { $unknown } = record;
						if (Array.isArray($unknown)) {
							const [k, v] = $unknown;
							out[k] = this._write(15, v);
						}
					} else if (typeof record.__type === "string") for (const k in record) {
						const v = record[k];
						const targetKey = jsonName ? nameMap[k] ?? k : k;
						if (!(targetKey in out)) out[targetKey] = this._write(15, v);
					}
					return out;
				}
				if (Array.isArray(value) && ns.isListSchema()) {
					const listMember = ns.getValueSchema();
					const out = [];
					const sparse = !!ns.getMergedTraits().sparse;
					for (const item of value) if (sparse || item != null) out.push(this._write(listMember, item));
					return out;
				}
				if (ns.isMapSchema()) {
					const mapMember = ns.getValueSchema();
					const out = {};
					const sparse = !!ns.getMergedTraits().sparse;
					for (const _k in value) {
						const _v = value[_k];
						if (sparse || _v != null) out[_k] = this._write(mapMember, _v);
					}
					return out;
				}
				if (value instanceof Uint8Array && (ns.isBlobSchema() || ns.isDocumentSchema())) {
					if (ns === this.rootSchema) return value;
					return (this.serdeContext?.base64Encoder ?? toBase64)(value);
				}
				if (value instanceof Date && (ns.isTimestampSchema() || ns.isDocumentSchema())) switch (determineTimestampFormat(ns, this.settings)) {
					case 5: return value.toISOString().replace(".000Z", "Z");
					case 6: return dateToUtcString(value);
					case 7: return value.getTime() / 1e3;
					default:
						console.warn("Missing timestamp format, using epoch seconds", value);
						return value.getTime() / 1e3;
				}
				if (value instanceof NumericValue) this.useReplacer = true;
			}
			if (value === null && container?.isStructSchema()) return;
			if (ns.isStringSchema()) {
				if (typeof value === "undefined" && ns.isIdempotencyToken()) return generateIdempotencyToken();
				const mediaType = ns.getMergedTraits().mediaType;
				if (value != null && mediaType) {
					if (mediaType === "application/json" || mediaType.endsWith("+json")) return LazyJsonString.from(value);
				}
				return value;
			}
			if (typeof value === "number" && ns.isNumericSchema()) {
				if (Math.abs(value) === Infinity || isNaN(value)) return String(value);
				return value;
			}
			if (typeof value === "string" && ns.isBlobSchema()) {
				if (ns === this.rootSchema) return value;
				return (this.serdeContext?.base64Encoder ?? toBase64)(value);
			}
			if (typeof value === "bigint") this.useReplacer = true;
			if (ns.isDocumentSchema()) if (isObject) {
				const out = Array.isArray(value) ? [] : {};
				for (const k in value) {
					const v = value[k];
					if (v instanceof NumericValue) {
						this.useReplacer = true;
						out[k] = v;
					} else out[k] = this._write(ns, v);
				}
				return out;
			} else return structuredClone(value);
			return value;
		}
	};
	var JsonCodec = class extends SerdeContextConfig {
		settings;
		constructor(settings) {
			super();
			this.settings = settings;
		}
		createSerializer() {
			const serializer = new JsonShapeSerializer(this.settings);
			serializer.setSerdeContext(this.serdeContext);
			return serializer;
		}
		createDeserializer() {
			const deserializer = new JsonShapeDeserializer(this.settings);
			deserializer.setSerdeContext(this.serdeContext);
			return deserializer;
		}
	};
	var AwsJsonRpcProtocol = class extends RpcProtocol {
		serializer;
		deserializer;
		serviceTarget;
		codec;
		mixin;
		awsQueryCompatible;
		constructor({ defaultNamespace, errorTypeRegistries, serviceTarget, awsQueryCompatible, jsonCodec }) {
			super({
				defaultNamespace,
				errorTypeRegistries
			});
			this.serviceTarget = serviceTarget;
			this.codec = jsonCodec ?? new JsonCodec({
				timestampFormat: {
					useTrait: true,
					default: 7
				},
				jsonName: false
			});
			this.serializer = this.codec.createSerializer();
			this.deserializer = this.codec.createDeserializer();
			this.awsQueryCompatible = !!awsQueryCompatible;
			this.mixin = new ProtocolLib(this.awsQueryCompatible);
		}
		async serializeRequest(operationSchema, input, context) {
			const request = await super.serializeRequest(operationSchema, input, context);
			if (!request.path.endsWith("/")) request.path += "/";
			request.headers["content-type"] = `application/x-amz-json-${this.getJsonRpcVersion()}`;
			request.headers["x-amz-target"] = `${this.serviceTarget}.${operationSchema.name}`;
			if (this.awsQueryCompatible) request.headers["x-amzn-query-mode"] = "true";
			if (deref(operationSchema.input) === "unit" || !request.body) request.body = "{}";
			return request;
		}
		getPayloadCodec() {
			return this.codec;
		}
		async handleError(operationSchema, context, response, dataObject, metadata) {
			const { awsQueryCompatible } = this;
			if (awsQueryCompatible) this.mixin.setQueryCompatError(dataObject, response);
			const errorIdentifier = loadJsonRpcErrorCode(response, dataObject, awsQueryCompatible) ?? "Unknown";
			this.mixin.compose(this.compositeErrorRegistry, errorIdentifier, this.options.defaultNamespace);
			const { errorSchema, errorMetadata } = await this.mixin.getErrorSchemaOrThrowBaseException(errorIdentifier, this.options.defaultNamespace, response, dataObject, metadata, awsQueryCompatible ? this.mixin.findQueryCompatibleError : void 0);
			const ns = NormalizedSchema.of(errorSchema);
			const message = dataObject.message ?? dataObject.Message ?? "UnknownError";
			const exception = new ((this.compositeErrorRegistry.getErrorCtor(errorSchema)) ?? Error)({});
			const output = {};
			const errorDeserializer = this.codec.createDeserializer();
			for (const [name, member] of ns.structIterator()) if (dataObject[name] != null) output[name] = errorDeserializer.readObject(member, dataObject[name]);
			if (awsQueryCompatible) this.mixin.queryCompatOutput(dataObject, output);
			throw this.mixin.decorateServiceException(Object.assign(exception, errorMetadata, {
				$fault: ns.getMergedTraits().error,
				message
			}, output), dataObject);
		}
	};
	var AwsJson1_0Protocol = class extends AwsJsonRpcProtocol {
		constructor({ defaultNamespace, errorTypeRegistries, serviceTarget, awsQueryCompatible, jsonCodec }) {
			super({
				defaultNamespace,
				errorTypeRegistries,
				serviceTarget,
				awsQueryCompatible,
				jsonCodec
			});
		}
		getShapeId() {
			return "aws.protocols#awsJson1_0";
		}
		getJsonRpcVersion() {
			return "1.0";
		}
		getDefaultContentType() {
			return "application/x-amz-json-1.0";
		}
	};
	var AwsJson1_1Protocol = class extends AwsJsonRpcProtocol {
		constructor({ defaultNamespace, errorTypeRegistries, serviceTarget, awsQueryCompatible, jsonCodec }) {
			super({
				defaultNamespace,
				errorTypeRegistries,
				serviceTarget,
				awsQueryCompatible,
				jsonCodec
			});
		}
		getShapeId() {
			return "aws.protocols#awsJson1_1";
		}
		getJsonRpcVersion() {
			return "1.1";
		}
		getDefaultContentType() {
			return "application/x-amz-json-1.1";
		}
	};
	var AwsRestJsonProtocol = class extends HttpBindingProtocol {
		serializer;
		deserializer;
		codec;
		mixin = new ProtocolLib();
		constructor({ defaultNamespace, errorTypeRegistries }) {
			super({
				defaultNamespace,
				errorTypeRegistries
			});
			const settings = {
				timestampFormat: {
					useTrait: true,
					default: 7
				},
				httpBindings: true,
				jsonName: true
			};
			this.codec = new JsonCodec(settings);
			this.serializer = new HttpInterceptingShapeSerializer(this.codec.createSerializer(), settings);
			this.deserializer = new HttpInterceptingShapeDeserializer(this.codec.createDeserializer(), settings);
		}
		getShapeId() {
			return "aws.protocols#restJson1";
		}
		getPayloadCodec() {
			return this.codec;
		}
		setSerdeContext(serdeContext) {
			this.codec.setSerdeContext(serdeContext);
			super.setSerdeContext(serdeContext);
		}
		async serializeRequest(operationSchema, input, context) {
			const request = await super.serializeRequest(operationSchema, input, context);
			const inputSchema = NormalizedSchema.of(operationSchema.input);
			if (!request.headers["content-type"]) {
				const contentType = this.mixin.resolveRestContentType(this.getDefaultContentType(), inputSchema);
				if (contentType) request.headers["content-type"] = contentType;
			}
			if (request.body == null && request.headers["content-type"] === this.getDefaultContentType()) request.body = "{}";
			return request;
		}
		async deserializeResponse(operationSchema, context, response) {
			const output = await super.deserializeResponse(operationSchema, context, response);
			const outputSchema = NormalizedSchema.of(operationSchema.output);
			for (const [name, member] of outputSchema.structIterator()) if (member.getMemberTraits().httpPayload && !(name in output)) output[name] = null;
			return output;
		}
		async handleError(operationSchema, context, response, dataObject, metadata) {
			const errorIdentifier = loadRestJsonErrorCode(response, dataObject) ?? "Unknown";
			this.mixin.compose(this.compositeErrorRegistry, errorIdentifier, this.options.defaultNamespace);
			const { errorSchema, errorMetadata } = await this.mixin.getErrorSchemaOrThrowBaseException(errorIdentifier, this.options.defaultNamespace, response, dataObject, metadata);
			const ns = NormalizedSchema.of(errorSchema);
			const message = dataObject.message ?? dataObject.Message ?? "UnknownError";
			const exception = new ((this.compositeErrorRegistry.getErrorCtor(errorSchema)) ?? Error)({});
			await this.deserializeHttpMessage(errorSchema, context, response, dataObject);
			const output = {};
			const errorDeserializer = this.codec.createDeserializer();
			for (const [name, member] of ns.structIterator()) {
				const target = member.getMergedTraits().jsonName ?? name;
				output[name] = errorDeserializer.readObject(member, dataObject[target]);
			}
			throw this.mixin.decorateServiceException(Object.assign(exception, errorMetadata, {
				$fault: ns.getMergedTraits().error,
				message
			}, output), dataObject);
		}
		getDefaultContentType() {
			return "application/json";
		}
	};
	var awsExpectUnion = (value) => {
		if (value == null) return;
		if (typeof value === "object" && "__type" in value) delete value.__type;
		return expectUnion(value);
	};
	var XmlShapeDeserializer = class extends SerdeContextConfig {
		settings;
		stringDeserializer;
		constructor(settings) {
			super();
			this.settings = settings;
			this.stringDeserializer = new FromStringShapeDeserializer(settings);
		}
		setSerdeContext(serdeContext) {
			this.serdeContext = serdeContext;
			this.stringDeserializer.setSerdeContext(serdeContext);
		}
		read(schema, bytes, key) {
			const ns = NormalizedSchema.of(schema);
			const memberSchemas = ns.getMemberSchemas();
			if (ns.isStructSchema() && ns.isMemberSchema() && !!Object.values(memberSchemas).find((memberNs) => {
				return !!memberNs.getMemberTraits().eventPayload;
			})) {
				const output = {};
				const memberName = Object.keys(memberSchemas)[0];
				if (memberSchemas[memberName].isBlobSchema()) output[memberName] = bytes;
				else output[memberName] = this.read(memberSchemas[memberName], bytes);
				return output;
			}
			const xmlString = (this.serdeContext?.utf8Encoder ?? toUtf8)(bytes);
			const parsedObject = this.parseXml(xmlString);
			return this.readSchema(schema, key ? parsedObject[key] : parsedObject);
		}
		readSchema(_schema, value) {
			const ns = NormalizedSchema.of(_schema);
			if (ns.isUnitSchema()) return;
			const traits = ns.getMergedTraits();
			if (ns.isListSchema() && !Array.isArray(value)) return this.readSchema(ns, [value]);
			if (value == null) return value;
			if (typeof value === "object") {
				const flat = !!traits.xmlFlattened;
				if (ns.isListSchema()) {
					const listValue = ns.getValueSchema();
					const buffer = [];
					const sourceKey = listValue.getMergedTraits().xmlName ?? "member";
					const source = flat ? value : (value[0] ?? value)[sourceKey];
					if (source == null) return buffer;
					const sourceArray = Array.isArray(source) ? source : [source];
					for (const v of sourceArray) buffer.push(this.readSchema(listValue, v));
					return buffer;
				}
				const buffer = {};
				if (ns.isMapSchema()) {
					const keyNs = ns.getKeySchema();
					const memberNs = ns.getValueSchema();
					let entries;
					if (flat) entries = Array.isArray(value) ? value : [value];
					else entries = Array.isArray(value.entry) ? value.entry : [value.entry];
					const keyProperty = keyNs.getMergedTraits().xmlName ?? "key";
					const valueProperty = memberNs.getMergedTraits().xmlName ?? "value";
					for (const entry of entries) {
						const key = entry[keyProperty];
						const value = entry[valueProperty];
						buffer[key] = this.readSchema(memberNs, value);
					}
					return buffer;
				}
				if (ns.isStructSchema()) {
					const union = ns.isUnionSchema();
					let unionSerde;
					if (union) unionSerde = new UnionSerde(value, buffer);
					for (const [memberName, memberSchema] of ns.structIterator()) {
						const memberTraits = memberSchema.getMergedTraits();
						const xmlObjectKey = !memberTraits.httpPayload ? memberSchema.getMemberTraits().xmlName ?? memberName : memberTraits.xmlName ?? memberSchema.getName();
						if (union) unionSerde.mark(xmlObjectKey);
						if (value[xmlObjectKey] != null) buffer[memberName] = this.readSchema(memberSchema, value[xmlObjectKey]);
					}
					if (union) unionSerde.writeUnknown();
					return buffer;
				}
				if (ns.isDocumentSchema()) return value;
				throw new Error(`@aws-sdk/core/protocols - xml deserializer unhandled schema type for ${ns.getName(true)}`);
			}
			if (ns.isListSchema()) return [];
			if (ns.isMapSchema() || ns.isStructSchema()) return {};
			return this.stringDeserializer.read(ns, value);
		}
		parseXml(xml) {
			if (xml.length) {
				let parsedObj;
				try {
					parsedObj = parseXML(xml);
				} catch (e) {
					if (e && typeof e === "object") Object.defineProperty(e, "$responseBodyText", { value: xml });
					throw e;
				}
				const textNodeName = "#text";
				const key = Object.keys(parsedObj)[0];
				const parsedObjToReturn = parsedObj[key];
				if (parsedObjToReturn[textNodeName]) {
					parsedObjToReturn[key] = parsedObjToReturn[textNodeName];
					delete parsedObjToReturn[textNodeName];
				}
				return getValueFromTextNode(parsedObjToReturn);
			}
			return {};
		}
	};
	var QueryShapeSerializer = class extends SerdeContextConfig {
		settings;
		buffer;
		constructor(settings) {
			super();
			this.settings = settings;
		}
		write(schema, value, prefix = "") {
			if (this.buffer === void 0) this.buffer = "";
			const ns = NormalizedSchema.of(schema);
			if (prefix && !prefix.endsWith(".")) prefix += ".";
			if (ns.isBlobSchema()) {
				if (typeof value === "string" || value instanceof Uint8Array) {
					this.writeKey(prefix);
					this.writeValue((this.serdeContext?.base64Encoder ?? toBase64)(value));
				}
			} else if (ns.isBooleanSchema() || ns.isNumericSchema() || ns.isStringSchema()) {
				if (value != null) {
					this.writeKey(prefix);
					this.writeValue(String(value));
				} else if (ns.isIdempotencyToken()) {
					this.writeKey(prefix);
					this.writeValue(generateIdempotencyToken());
				}
			} else if (ns.isBigIntegerSchema()) {
				if (value != null) {
					this.writeKey(prefix);
					this.writeValue(String(value));
				}
			} else if (ns.isBigDecimalSchema()) {
				if (value != null) {
					this.writeKey(prefix);
					this.writeValue(value instanceof NumericValue ? value.string : String(value));
				}
			} else if (ns.isTimestampSchema()) {
				if (value instanceof Date) {
					this.writeKey(prefix);
					switch (determineTimestampFormat(ns, this.settings)) {
						case 5:
							this.writeValue(value.toISOString().replace(".000Z", "Z"));
							break;
						case 6:
							this.writeValue(dateToUtcString(value));
							break;
						case 7:
							this.writeValue(String(value.getTime() / 1e3));
							break;
					}
				}
			} else if (ns.isDocumentSchema()) if (Array.isArray(value)) this.write(79, value, prefix);
			else if (value instanceof Date) this.write(4, value, prefix);
			else if (value instanceof Uint8Array) this.write(21, value, prefix);
			else if (value && typeof value === "object") this.write(143, value, prefix);
			else {
				this.writeKey(prefix);
				this.writeValue(String(value));
			}
			else if (ns.isListSchema()) {
				if (Array.isArray(value)) if (value.length === 0) {
					if (this.settings.serializeEmptyLists) {
						this.writeKey(prefix);
						this.writeValue("");
					}
				} else {
					const member = ns.getValueSchema();
					const flat = this.settings.flattenLists || ns.getMergedTraits().xmlFlattened;
					let i = 1;
					for (const item of value) {
						if (item == null) continue;
						const traits = member.getMergedTraits();
						const suffix = this.getKey("member", traits.xmlName, traits.ec2QueryName);
						const key = flat ? `${prefix}${i}` : `${prefix}${suffix}.${i}`;
						this.write(member, item, key);
						++i;
					}
				}
			} else if (ns.isMapSchema()) {
				if (value && typeof value === "object") {
					const keySchema = ns.getKeySchema();
					const memberSchema = ns.getValueSchema();
					const flat = ns.getMergedTraits().xmlFlattened;
					let i = 1;
					for (const k in value) {
						const v = value[k];
						if (v == null) continue;
						const keyTraits = keySchema.getMergedTraits();
						const keySuffix = this.getKey("key", keyTraits.xmlName, keyTraits.ec2QueryName);
						const key = flat ? `${prefix}${i}.${keySuffix}` : `${prefix}entry.${i}.${keySuffix}`;
						const valTraits = memberSchema.getMergedTraits();
						const valueSuffix = this.getKey("value", valTraits.xmlName, valTraits.ec2QueryName);
						const valueKey = flat ? `${prefix}${i}.${valueSuffix}` : `${prefix}entry.${i}.${valueSuffix}`;
						this.write(keySchema, k, key);
						this.write(memberSchema, v, valueKey);
						++i;
					}
				}
			} else if (ns.isStructSchema()) {
				if (value && typeof value === "object") {
					let didWriteMember = false;
					for (const [memberName, member] of ns.structIterator()) {
						if (value[memberName] == null && !member.isIdempotencyToken()) continue;
						const traits = member.getMergedTraits();
						const suffix = this.getKey(memberName, traits.xmlName, traits.ec2QueryName, "struct");
						const key = `${prefix}${suffix}`;
						this.write(member, value[memberName], key);
						didWriteMember = true;
					}
					if (!didWriteMember && ns.isUnionSchema()) {
						const { $unknown } = value;
						if (Array.isArray($unknown)) {
							const [k, v] = $unknown;
							const key = `${prefix}${k}`;
							this.write(15, v, key);
						}
					}
				}
			} else if (ns.isUnitSchema());
			else throw new Error(`@aws-sdk/core/protocols - QuerySerializer unrecognized schema type ${ns.getName(true)}`);
		}
		flush() {
			if (this.buffer === void 0) throw new Error("@aws-sdk/core/protocols - QuerySerializer cannot flush with nothing written to buffer.");
			const str = this.buffer;
			delete this.buffer;
			return str;
		}
		getKey(memberName, xmlName, ec2QueryName, keySource) {
			const { ec2, capitalizeKeys } = this.settings;
			if (ec2 && ec2QueryName) return ec2QueryName;
			const key = xmlName ?? memberName;
			if (capitalizeKeys && keySource === "struct") return key[0].toUpperCase() + key.slice(1);
			return key;
		}
		writeKey(key) {
			if (key.endsWith(".")) key = key.slice(0, key.length - 1);
			this.buffer += `&${extendedEncodeURIComponent(key)}=`;
		}
		writeValue(value) {
			this.buffer += extendedEncodeURIComponent(value);
		}
	};
	var AwsQueryProtocol = class extends RpcProtocol {
		options;
		serializer;
		deserializer;
		mixin = new ProtocolLib();
		constructor(options) {
			super({
				defaultNamespace: options.defaultNamespace,
				errorTypeRegistries: options.errorTypeRegistries
			});
			this.options = options;
			const settings = {
				timestampFormat: {
					useTrait: true,
					default: 5
				},
				httpBindings: false,
				xmlNamespace: options.xmlNamespace,
				serviceNamespace: options.defaultNamespace,
				serializeEmptyLists: true
			};
			this.serializer = new QueryShapeSerializer(settings);
			this.deserializer = new XmlShapeDeserializer(settings);
		}
		getShapeId() {
			return "aws.protocols#awsQuery";
		}
		setSerdeContext(serdeContext) {
			this.serializer.setSerdeContext(serdeContext);
			this.deserializer.setSerdeContext(serdeContext);
		}
		getPayloadCodec() {
			throw new Error("AWSQuery protocol has no payload codec.");
		}
		async serializeRequest(operationSchema, input, context) {
			const request = await super.serializeRequest(operationSchema, input, context);
			if (!request.path.endsWith("/")) request.path += "/";
			request.headers["content-type"] = "application/x-www-form-urlencoded";
			if (deref(operationSchema.input) === "unit" || !request.body) request.body = "";
			request.body = `Action=${operationSchema.name.split("#")[1] ?? operationSchema.name}&Version=${this.options.version}` + request.body;
			if (request.body.endsWith("&")) request.body = request.body.slice(-1);
			return request;
		}
		async deserializeResponse(operationSchema, context, response) {
			const deserializer = this.deserializer;
			const ns = NormalizedSchema.of(operationSchema.output);
			const dataObject = {};
			if (response.statusCode >= 300) {
				const bytes = await collectBody(response.body, context);
				if (bytes.byteLength > 0) Object.assign(dataObject, await deserializer.read(15, bytes));
				await this.handleError(operationSchema, context, response, dataObject, this.deserializeMetadata(response));
			}
			for (const header in response.headers) {
				const value = response.headers[header];
				delete response.headers[header];
				response.headers[header.toLowerCase()] = value;
			}
			const shortName = operationSchema.name.split("#")[1] ?? operationSchema.name;
			const awsQueryResultKey = ns.isStructSchema() && this.useNestedResult() ? shortName + "Result" : void 0;
			const bytes = await collectBody(response.body, context);
			if (bytes.byteLength > 0) Object.assign(dataObject, await deserializer.read(ns, bytes, awsQueryResultKey));
			dataObject.$metadata = this.deserializeMetadata(response);
			return dataObject;
		}
		useNestedResult() {
			return true;
		}
		async handleError(operationSchema, context, response, dataObject, metadata) {
			const errorIdentifier = this.loadQueryErrorCode(response, dataObject) ?? "Unknown";
			this.mixin.compose(this.compositeErrorRegistry, errorIdentifier, this.options.defaultNamespace);
			const errorData = this.loadQueryError(dataObject) ?? {};
			const message = this.loadQueryErrorMessage(dataObject);
			errorData.message = message;
			errorData.Error = {
				Type: errorData.Type,
				Code: errorData.Code,
				Message: message
			};
			const { errorSchema, errorMetadata } = await this.mixin.getErrorSchemaOrThrowBaseException(errorIdentifier, this.options.defaultNamespace, response, errorData, metadata, this.mixin.findQueryCompatibleError);
			const ns = NormalizedSchema.of(errorSchema);
			const exception = new ((this.compositeErrorRegistry.getErrorCtor(errorSchema)) ?? Error)({});
			const output = {
				Type: errorData.Error.Type,
				Code: errorData.Error.Code,
				Error: errorData.Error
			};
			for (const [name, member] of ns.structIterator()) {
				const target = member.getMergedTraits().xmlName ?? name;
				const value = errorData[target] ?? dataObject[target];
				output[name] = this.deserializer.readSchema(member, value);
			}
			throw this.mixin.decorateServiceException(Object.assign(exception, errorMetadata, {
				$fault: ns.getMergedTraits().error,
				message
			}, output), dataObject);
		}
		loadQueryErrorCode(output, data) {
			const code = (data.Errors?.[0]?.Error ?? data.Errors?.Error ?? data.Error)?.Code;
			if (code !== void 0) return code;
			if (output.statusCode == 404) return "NotFound";
		}
		loadQueryError(data) {
			return data.Errors?.[0]?.Error ?? data.Errors?.Error ?? data.Error;
		}
		loadQueryErrorMessage(data) {
			const errorData = this.loadQueryError(data);
			return errorData?.message ?? errorData?.Message ?? data.message ?? data.Message ?? "Unknown";
		}
		getDefaultContentType() {
			return "application/x-www-form-urlencoded";
		}
	};
	var AwsEc2QueryProtocol = class extends AwsQueryProtocol {
		options;
		constructor(options) {
			super(options);
			this.options = options;
			Object.assign(this.serializer.settings, {
				capitalizeKeys: true,
				flattenLists: true,
				serializeEmptyLists: false,
				ec2: true
			});
		}
		getShapeId() {
			return "aws.protocols#ec2Query";
		}
		useNestedResult() {
			return false;
		}
	};
	var parseXmlBody = (streamBody, context) => collectBodyString(streamBody, context).then((encoded) => {
		if (encoded.length) {
			let parsedObj;
			try {
				parsedObj = parseXML(encoded);
			} catch (e) {
				if (e && typeof e === "object") Object.defineProperty(e, "$responseBodyText", { value: encoded });
				throw e;
			}
			const textNodeName = "#text";
			const key = Object.keys(parsedObj)[0];
			const parsedObjToReturn = parsedObj[key];
			if (parsedObjToReturn[textNodeName]) {
				parsedObjToReturn[key] = parsedObjToReturn[textNodeName];
				delete parsedObjToReturn[textNodeName];
			}
			return getValueFromTextNode(parsedObjToReturn);
		}
		return {};
	});
	var parseXmlErrorBody = async (errorBody, context) => {
		const value = await parseXmlBody(errorBody, context);
		if (value.Error) value.Error.message = value.Error.message ?? value.Error.Message;
		return value;
	};
	var loadRestXmlErrorCode = (output, data) => {
		if (data?.Error?.Code !== void 0) return data.Error.Code;
		if (data?.Code !== void 0) return data.Code;
		if (output.statusCode == 404) return "NotFound";
	};
	var XmlShapeSerializer = class extends SerdeContextConfig {
		settings;
		stringBuffer;
		byteBuffer;
		buffer;
		constructor(settings) {
			super();
			this.settings = settings;
		}
		write(schema, value) {
			const ns = NormalizedSchema.of(schema);
			if (ns.isStringSchema() && typeof value === "string") this.stringBuffer = value;
			else if (ns.isBlobSchema()) this.byteBuffer = "byteLength" in value ? value : (this.serdeContext?.base64Decoder ?? fromBase64)(value);
			else {
				this.buffer = this.writeStruct(ns, value, void 0);
				const traits = ns.getMergedTraits();
				if (traits.httpPayload && !traits.xmlName) this.buffer.withName(ns.getName());
			}
		}
		flush() {
			if (this.byteBuffer !== void 0) {
				const bytes = this.byteBuffer;
				delete this.byteBuffer;
				return bytes;
			}
			if (this.stringBuffer !== void 0) {
				const str = this.stringBuffer;
				delete this.stringBuffer;
				return str;
			}
			const buffer = this.buffer;
			if (this.settings.xmlNamespace) {
				if (!buffer?.attributes?.["xmlns"]) buffer.addAttribute("xmlns", this.settings.xmlNamespace);
			}
			delete this.buffer;
			return buffer.toString();
		}
		writeStruct(ns, value, parentXmlns) {
			const traits = ns.getMergedTraits();
			const name = ns.isMemberSchema() && !traits.httpPayload ? ns.getMemberTraits().xmlName ?? ns.getMemberName() : traits.xmlName ?? ns.getName();
			if (!name || !ns.isStructSchema()) throw new Error(`@aws-sdk/core/protocols - xml serializer, cannot write struct with empty name or non-struct, schema=${ns.getName(true)}.`);
			const structXmlNode = XmlNode.of(name);
			const [xmlnsAttr, xmlns] = this.getXmlnsAttribute(ns, parentXmlns);
			for (const [memberName, memberSchema] of ns.structIterator()) {
				const val = value[memberName];
				if (val != null || memberSchema.isIdempotencyToken()) {
					if (memberSchema.getMergedTraits().xmlAttribute) {
						structXmlNode.addAttribute(memberSchema.getMergedTraits().xmlName ?? memberName, this.writeSimple(memberSchema, val));
						continue;
					}
					if (memberSchema.isListSchema()) this.writeList(memberSchema, val, structXmlNode, xmlns);
					else if (memberSchema.isMapSchema()) this.writeMap(memberSchema, val, structXmlNode, xmlns);
					else if (memberSchema.isStructSchema()) structXmlNode.addChildNode(this.writeStruct(memberSchema, val, xmlns));
					else {
						const memberNode = XmlNode.of(memberSchema.getMergedTraits().xmlName ?? memberSchema.getMemberName());
						this.writeSimpleInto(memberSchema, val, memberNode, xmlns);
						structXmlNode.addChildNode(memberNode);
					}
				}
			}
			const { $unknown } = value;
			if ($unknown && ns.isUnionSchema() && Array.isArray($unknown) && Object.keys(value).length === 1) {
				const [k, v] = $unknown;
				const node = XmlNode.of(k);
				if (typeof v !== "string") if (value instanceof XmlNode || value instanceof XmlText) structXmlNode.addChildNode(value);
				else throw new Error("@aws-sdk - $unknown union member in XML requires value of type string, @aws-sdk/xml-builder::XmlNode or XmlText.");
				this.writeSimpleInto(0, v, node, xmlns);
				structXmlNode.addChildNode(node);
			}
			if (xmlns) structXmlNode.addAttribute(xmlnsAttr, xmlns);
			return structXmlNode;
		}
		writeList(listMember, array, container, parentXmlns) {
			if (!listMember.isMemberSchema()) throw new Error(`@aws-sdk/core/protocols - xml serializer, cannot write non-member list: ${listMember.getName(true)}`);
			const listTraits = listMember.getMergedTraits();
			const listValueSchema = listMember.getValueSchema();
			const listValueTraits = listValueSchema.getMergedTraits();
			const sparse = !!listValueTraits.sparse;
			const flat = !!listTraits.xmlFlattened;
			const [xmlnsAttr, xmlns] = this.getXmlnsAttribute(listMember, parentXmlns);
			const writeItem = (container, value) => {
				if (listValueSchema.isListSchema()) this.writeList(listValueSchema, Array.isArray(value) ? value : [value], container, xmlns);
				else if (listValueSchema.isMapSchema()) this.writeMap(listValueSchema, value, container, xmlns);
				else if (listValueSchema.isStructSchema()) {
					const struct = this.writeStruct(listValueSchema, value, xmlns);
					container.addChildNode(struct.withName(flat ? listTraits.xmlName ?? listMember.getMemberName() : listValueTraits.xmlName ?? "member"));
				} else {
					const listItemNode = XmlNode.of(flat ? listTraits.xmlName ?? listMember.getMemberName() : listValueTraits.xmlName ?? "member");
					this.writeSimpleInto(listValueSchema, value, listItemNode, xmlns);
					container.addChildNode(listItemNode);
				}
			};
			if (flat) {
				for (const value of array) if (sparse || value != null) writeItem(container, value);
			} else {
				const listNode = XmlNode.of(listTraits.xmlName ?? listMember.getMemberName());
				if (xmlns) listNode.addAttribute(xmlnsAttr, xmlns);
				for (const value of array) if (sparse || value != null) writeItem(listNode, value);
				container.addChildNode(listNode);
			}
		}
		writeMap(mapMember, map, container, parentXmlns, containerIsMap = false) {
			if (!mapMember.isMemberSchema()) throw new Error(`@aws-sdk/core/protocols - xml serializer, cannot write non-member map: ${mapMember.getName(true)}`);
			const mapTraits = mapMember.getMergedTraits();
			const mapKeySchema = mapMember.getKeySchema();
			const keyTag = mapKeySchema.getMergedTraits().xmlName ?? "key";
			const mapValueSchema = mapMember.getValueSchema();
			const mapValueTraits = mapValueSchema.getMergedTraits();
			const valueTag = mapValueTraits.xmlName ?? "value";
			const sparse = !!mapValueTraits.sparse;
			const flat = !!mapTraits.xmlFlattened;
			const [xmlnsAttr, xmlns] = this.getXmlnsAttribute(mapMember, parentXmlns);
			const addKeyValue = (entry, key, val) => {
				const keyNode = XmlNode.of(keyTag, key);
				const [keyXmlnsAttr, keyXmlns] = this.getXmlnsAttribute(mapKeySchema, xmlns);
				if (keyXmlns) keyNode.addAttribute(keyXmlnsAttr, keyXmlns);
				entry.addChildNode(keyNode);
				let valueNode = XmlNode.of(valueTag);
				if (mapValueSchema.isListSchema()) this.writeList(mapValueSchema, val, valueNode, xmlns);
				else if (mapValueSchema.isMapSchema()) this.writeMap(mapValueSchema, val, valueNode, xmlns, true);
				else if (mapValueSchema.isStructSchema()) valueNode = this.writeStruct(mapValueSchema, val, xmlns);
				else this.writeSimpleInto(mapValueSchema, val, valueNode, xmlns);
				entry.addChildNode(valueNode);
			};
			if (flat) for (const key in map) {
				const val = map[key];
				if (sparse || val != null) {
					const entry = XmlNode.of(mapTraits.xmlName ?? mapMember.getMemberName());
					addKeyValue(entry, key, val);
					container.addChildNode(entry);
				}
			}
			else {
				let mapNode;
				if (!containerIsMap) {
					mapNode = XmlNode.of(mapTraits.xmlName ?? mapMember.getMemberName());
					if (xmlns) mapNode.addAttribute(xmlnsAttr, xmlns);
					container.addChildNode(mapNode);
				}
				for (const key in map) {
					const val = map[key];
					if (sparse || val != null) {
						const entry = XmlNode.of("entry");
						addKeyValue(entry, key, val);
						(containerIsMap ? container : mapNode).addChildNode(entry);
					}
				}
			}
		}
		writeSimple(_schema, value) {
			if (null === value) throw new Error("@aws-sdk/core/protocols - (XML serializer) cannot write null value.");
			const ns = NormalizedSchema.of(_schema);
			let nodeContents = null;
			if (value && typeof value === "object") if (ns.isBlobSchema()) nodeContents = (this.serdeContext?.base64Encoder ?? toBase64)(value);
			else if (ns.isTimestampSchema() && value instanceof Date) switch (determineTimestampFormat(ns, this.settings)) {
				case 5:
					nodeContents = value.toISOString().replace(".000Z", "Z");
					break;
				case 6:
					nodeContents = dateToUtcString(value);
					break;
				case 7:
					nodeContents = String(value.getTime() / 1e3);
					break;
				default:
					console.warn("Missing timestamp format, using http date", value);
					nodeContents = dateToUtcString(value);
					break;
			}
			else if (ns.isBigDecimalSchema() && value) {
				if (value instanceof NumericValue) return value.string;
				return String(value);
			} else if (ns.isMapSchema() || ns.isListSchema()) throw new Error("@aws-sdk/core/protocols - xml serializer, cannot call _write() on List/Map schema, call writeList or writeMap() instead.");
			else throw new Error(`@aws-sdk/core/protocols - xml serializer, unhandled schema type for object value and schema: ${ns.getName(true)}`);
			if (ns.isBooleanSchema() || ns.isNumericSchema() || ns.isBigIntegerSchema() || ns.isBigDecimalSchema()) nodeContents = String(value);
			if (ns.isStringSchema()) if (value === void 0 && ns.isIdempotencyToken()) nodeContents = generateIdempotencyToken();
			else nodeContents = String(value);
			if (nodeContents === null) throw new Error(`Unhandled schema-value pair ${ns.getName(true)}=${value}`);
			return nodeContents;
		}
		writeSimpleInto(_schema, value, into, parentXmlns) {
			const nodeContents = this.writeSimple(_schema, value);
			const ns = NormalizedSchema.of(_schema);
			const content = new XmlText(nodeContents);
			const [xmlnsAttr, xmlns] = this.getXmlnsAttribute(ns, parentXmlns);
			if (xmlns) into.addAttribute(xmlnsAttr, xmlns);
			into.addChildNode(content);
		}
		getXmlnsAttribute(ns, parentXmlns) {
			const [prefix, xmlns] = ns.getMergedTraits().xmlNamespace ?? [];
			if (xmlns && xmlns !== parentXmlns) return [prefix ? `xmlns:${prefix}` : "xmlns", xmlns];
			return [void 0, void 0];
		}
	};
	var XmlCodec = class extends SerdeContextConfig {
		settings;
		constructor(settings) {
			super();
			this.settings = settings;
		}
		createSerializer() {
			const serializer = new XmlShapeSerializer(this.settings);
			serializer.setSerdeContext(this.serdeContext);
			return serializer;
		}
		createDeserializer() {
			const deserializer = new XmlShapeDeserializer(this.settings);
			deserializer.setSerdeContext(this.serdeContext);
			return deserializer;
		}
	};
	var AwsRestXmlProtocol = class extends HttpBindingProtocol {
		codec;
		serializer;
		deserializer;
		mixin = new ProtocolLib();
		constructor(options) {
			super(options);
			const settings = {
				timestampFormat: {
					useTrait: true,
					default: 5
				},
				httpBindings: true,
				xmlNamespace: options.xmlNamespace,
				serviceNamespace: options.defaultNamespace
			};
			this.codec = new XmlCodec(settings);
			this.serializer = new HttpInterceptingShapeSerializer(this.codec.createSerializer(), settings);
			this.deserializer = new HttpInterceptingShapeDeserializer(this.codec.createDeserializer(), settings);
		}
		getPayloadCodec() {
			return this.codec;
		}
		getShapeId() {
			return "aws.protocols#restXml";
		}
		async serializeRequest(operationSchema, input, context) {
			const request = await super.serializeRequest(operationSchema, input, context);
			const inputSchema = NormalizedSchema.of(operationSchema.input);
			if (!request.headers["content-type"]) {
				const contentType = this.mixin.resolveRestContentType(this.getDefaultContentType(), inputSchema);
				if (contentType) request.headers["content-type"] = contentType;
			}
			if (typeof request.body === "string" && request.headers["content-type"] === this.getDefaultContentType() && !request.body.startsWith("<?xml ") && !this.hasUnstructuredPayloadBinding(inputSchema)) request.body = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + request.body;
			return request;
		}
		async deserializeResponse(operationSchema, context, response) {
			return super.deserializeResponse(operationSchema, context, response);
		}
		async handleError(operationSchema, context, response, dataObject, metadata) {
			const errorIdentifier = loadRestXmlErrorCode(response, dataObject) ?? "Unknown";
			this.mixin.compose(this.compositeErrorRegistry, errorIdentifier, this.options.defaultNamespace);
			if (dataObject.Error && typeof dataObject.Error === "object") for (const key of Object.keys(dataObject.Error)) {
				dataObject[key] = dataObject.Error[key];
				if (key.toLowerCase() === "message") dataObject.message = dataObject.Error[key];
			}
			if (dataObject.RequestId && !metadata.requestId) metadata.requestId = dataObject.RequestId;
			const { errorSchema, errorMetadata } = await this.mixin.getErrorSchemaOrThrowBaseException(errorIdentifier, this.options.defaultNamespace, response, dataObject, metadata);
			const ns = NormalizedSchema.of(errorSchema);
			const message = dataObject.Error?.message ?? dataObject.Error?.Message ?? dataObject.message ?? dataObject.Message ?? "UnknownError";
			const exception = new ((this.compositeErrorRegistry.getErrorCtor(errorSchema)) ?? Error)({});
			await this.deserializeHttpMessage(errorSchema, context, response, dataObject);
			const output = {};
			const errorDeserializer = this.codec.createDeserializer();
			for (const [name, member] of ns.structIterator()) {
				const target = member.getMergedTraits().xmlName ?? name;
				const value = dataObject.Error?.[target] ?? dataObject[target];
				output[name] = errorDeserializer.readSchema(member, value);
			}
			throw this.mixin.decorateServiceException(Object.assign(exception, errorMetadata, {
				$fault: ns.getMergedTraits().error,
				message
			}, output), dataObject);
		}
		getDefaultContentType() {
			return "application/xml";
		}
		hasUnstructuredPayloadBinding(ns) {
			for (const [, member] of ns.structIterator()) if (member.getMergedTraits().httpPayload) return !(member.isStructSchema() || member.isMapSchema() || member.isListSchema());
			return false;
		}
	};
	exports.AwsEc2QueryProtocol = AwsEc2QueryProtocol;
	exports.AwsJson1_0Protocol = AwsJson1_0Protocol;
	exports.AwsJson1_1Protocol = AwsJson1_1Protocol;
	exports.AwsJsonRpcProtocol = AwsJsonRpcProtocol;
	exports.AwsQueryProtocol = AwsQueryProtocol;
	exports.AwsRestJsonProtocol = AwsRestJsonProtocol;
	exports.AwsRestXmlProtocol = AwsRestXmlProtocol;
	exports.AwsSmithyRpcV2CborProtocol = AwsSmithyRpcV2CborProtocol;
	exports.JsonCodec = JsonCodec;
	exports.JsonShapeDeserializer = JsonShapeDeserializer;
	exports.JsonShapeSerializer = JsonShapeSerializer;
	exports.QueryShapeSerializer = QueryShapeSerializer;
	exports.XmlCodec = XmlCodec;
	exports.XmlShapeDeserializer = XmlShapeDeserializer;
	exports.XmlShapeSerializer = XmlShapeSerializer;
	exports._toBool = _toBool;
	exports._toNum = _toNum;
	exports._toStr = _toStr;
	exports.awsExpectUnion = awsExpectUnion;
	exports.loadJsonRpcErrorCode = loadJsonRpcErrorCode;
	exports.loadRestJsonErrorCode = loadRestJsonErrorCode;
	exports.loadRestXmlErrorCode = loadRestXmlErrorCode;
	exports.parseJsonBody = parseJsonBody;
	exports.parseJsonErrorBody = parseJsonErrorBody;
	exports.parseXmlBody = parseXmlBody;
	exports.parseXmlErrorBody = parseXmlErrorBody;
}));
//#endregion
//#region node_modules/@aws-sdk/client-ses/dist-es/endpoint/bdd.js
var import_checksum = require_checksum();
init_dist_es$1();
var import_protocols = require_protocols();
var k = "ref";
var a = -1;
var b = true;
var c = "isSet";
var d = "PartitionResult";
var e = "booleanEquals";
var f = "getAttr";
var g = { [k]: "Endpoint" };
var h = { [k]: d };
var i = {};
var j = [{ [k]: "Region" }];
var _data = {
	conditions: [
		[c, [g]],
		[c, j],
		[
			"aws.partition",
			j,
			d
		],
		[e, [{ [k]: "UseFIPS" }, b]],
		[e, [{ [k]: "UseDualStack" }, b]],
		[e, [{
			fn: f,
			argv: [h, "supportsDualStack"]
		}, b]],
		[e, [{
			fn: f,
			argv: [h, "supportsFIPS"]
		}, b]]
	],
	results: [
		[a],
		[a, "Invalid Configuration: FIPS and custom endpoint are not supported"],
		[a, "Invalid Configuration: Dualstack and custom endpoint are not supported"],
		[g, i],
		["https://email-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", i],
		[a, "FIPS and DualStack are enabled, but this partition does not support one or both"],
		["https://email-fips.{Region}.{PartitionResult#dnsSuffix}", i],
		[a, "FIPS is enabled but this partition does not support FIPS"],
		["https://email.{Region}.{PartitionResult#dualStackDnsSuffix}", i],
		[a, "DualStack is enabled but this partition does not support DualStack"],
		["https://email.{Region}.{PartitionResult#dnsSuffix}", i],
		[a, "Invalid Configuration: Missing Region"]
	]
};
var root = 2;
var nodes = new Int32Array([
	-1,
	1,
	-1,
	0,
	12,
	3,
	1,
	4,
	100000011,
	2,
	5,
	100000011,
	3,
	8,
	6,
	4,
	7,
	100000010,
	5,
	100000008,
	100000009,
	4,
	10,
	9,
	6,
	100000006,
	100000007,
	5,
	11,
	100000005,
	6,
	100000004,
	100000005,
	3,
	100000001,
	13,
	4,
	100000002,
	100000003
]);
var bdd = import_endpoints.BinaryDecisionDiagram.from(nodes, root, _data.conditions, _data.results);
//#endregion
//#region node_modules/@aws-sdk/client-ses/dist-es/endpoint/endpointResolver.js
var cache = new import_endpoints.EndpointCache({
	size: 50,
	params: [
		"Endpoint",
		"Region",
		"UseDualStack",
		"UseFIPS"
	]
});
var defaultEndpointResolver = (endpointParams, context = {}) => {
	return cache.get(endpointParams, () => (0, import_endpoints.decideEndpoint)(bdd, {
		endpointParams,
		logger: context.logger
	}));
};
import_endpoints.customEndpointFunctions.aws = import_client.awsEndpointFunctions;
//#endregion
//#region node_modules/@aws-sdk/client-ses/dist-es/models/SESServiceException.js
var SESServiceException = class SESServiceException extends import_client$1.ServiceException {
	constructor(options) {
		super(options);
		Object.setPrototypeOf(this, SESServiceException.prototype);
	}
};
//#endregion
//#region node_modules/@aws-sdk/client-ses/dist-es/models/errors.js
var AccountSendingPausedException = class AccountSendingPausedException extends SESServiceException {
	name = "AccountSendingPausedException";
	$fault = "client";
	constructor(opts) {
		super({
			name: "AccountSendingPausedException",
			$fault: "client",
			...opts
		});
		Object.setPrototypeOf(this, AccountSendingPausedException.prototype);
	}
};
var AlreadyExistsException = class AlreadyExistsException extends SESServiceException {
	name = "AlreadyExistsException";
	$fault = "client";
	Name;
	constructor(opts) {
		super({
			name: "AlreadyExistsException",
			$fault: "client",
			...opts
		});
		Object.setPrototypeOf(this, AlreadyExistsException.prototype);
		this.Name = opts.Name;
	}
};
var CannotDeleteException = class CannotDeleteException extends SESServiceException {
	name = "CannotDeleteException";
	$fault = "client";
	Name;
	constructor(opts) {
		super({
			name: "CannotDeleteException",
			$fault: "client",
			...opts
		});
		Object.setPrototypeOf(this, CannotDeleteException.prototype);
		this.Name = opts.Name;
	}
};
var LimitExceededException = class LimitExceededException extends SESServiceException {
	name = "LimitExceededException";
	$fault = "client";
	constructor(opts) {
		super({
			name: "LimitExceededException",
			$fault: "client",
			...opts
		});
		Object.setPrototypeOf(this, LimitExceededException.prototype);
	}
};
var RuleSetDoesNotExistException = class RuleSetDoesNotExistException extends SESServiceException {
	name = "RuleSetDoesNotExistException";
	$fault = "client";
	Name;
	constructor(opts) {
		super({
			name: "RuleSetDoesNotExistException",
			$fault: "client",
			...opts
		});
		Object.setPrototypeOf(this, RuleSetDoesNotExistException.prototype);
		this.Name = opts.Name;
	}
};
var ConfigurationSetAlreadyExistsException = class ConfigurationSetAlreadyExistsException extends SESServiceException {
	name = "ConfigurationSetAlreadyExistsException";
	$fault = "client";
	ConfigurationSetName;
	constructor(opts) {
		super({
			name: "ConfigurationSetAlreadyExistsException",
			$fault: "client",
			...opts
		});
		Object.setPrototypeOf(this, ConfigurationSetAlreadyExistsException.prototype);
		this.ConfigurationSetName = opts.ConfigurationSetName;
	}
};
var ConfigurationSetDoesNotExistException = class ConfigurationSetDoesNotExistException extends SESServiceException {
	name = "ConfigurationSetDoesNotExistException";
	$fault = "client";
	ConfigurationSetName;
	constructor(opts) {
		super({
			name: "ConfigurationSetDoesNotExistException",
			$fault: "client",
			...opts
		});
		Object.setPrototypeOf(this, ConfigurationSetDoesNotExistException.prototype);
		this.ConfigurationSetName = opts.ConfigurationSetName;
	}
};
var ConfigurationSetSendingPausedException = class ConfigurationSetSendingPausedException extends SESServiceException {
	name = "ConfigurationSetSendingPausedException";
	$fault = "client";
	ConfigurationSetName;
	constructor(opts) {
		super({
			name: "ConfigurationSetSendingPausedException",
			$fault: "client",
			...opts
		});
		Object.setPrototypeOf(this, ConfigurationSetSendingPausedException.prototype);
		this.ConfigurationSetName = opts.ConfigurationSetName;
	}
};
var InvalidConfigurationSetException = class InvalidConfigurationSetException extends SESServiceException {
	name = "InvalidConfigurationSetException";
	$fault = "client";
	constructor(opts) {
		super({
			name: "InvalidConfigurationSetException",
			$fault: "client",
			...opts
		});
		Object.setPrototypeOf(this, InvalidConfigurationSetException.prototype);
	}
};
var EventDestinationAlreadyExistsException = class EventDestinationAlreadyExistsException extends SESServiceException {
	name = "EventDestinationAlreadyExistsException";
	$fault = "client";
	ConfigurationSetName;
	EventDestinationName;
	constructor(opts) {
		super({
			name: "EventDestinationAlreadyExistsException",
			$fault: "client",
			...opts
		});
		Object.setPrototypeOf(this, EventDestinationAlreadyExistsException.prototype);
		this.ConfigurationSetName = opts.ConfigurationSetName;
		this.EventDestinationName = opts.EventDestinationName;
	}
};
var InvalidCloudWatchDestinationException = class InvalidCloudWatchDestinationException extends SESServiceException {
	name = "InvalidCloudWatchDestinationException";
	$fault = "client";
	ConfigurationSetName;
	EventDestinationName;
	constructor(opts) {
		super({
			name: "InvalidCloudWatchDestinationException",
			$fault: "client",
			...opts
		});
		Object.setPrototypeOf(this, InvalidCloudWatchDestinationException.prototype);
		this.ConfigurationSetName = opts.ConfigurationSetName;
		this.EventDestinationName = opts.EventDestinationName;
	}
};
var InvalidFirehoseDestinationException = class InvalidFirehoseDestinationException extends SESServiceException {
	name = "InvalidFirehoseDestinationException";
	$fault = "client";
	ConfigurationSetName;
	EventDestinationName;
	constructor(opts) {
		super({
			name: "InvalidFirehoseDestinationException",
			$fault: "client",
			...opts
		});
		Object.setPrototypeOf(this, InvalidFirehoseDestinationException.prototype);
		this.ConfigurationSetName = opts.ConfigurationSetName;
		this.EventDestinationName = opts.EventDestinationName;
	}
};
var InvalidSNSDestinationException = class InvalidSNSDestinationException extends SESServiceException {
	name = "InvalidSNSDestinationException";
	$fault = "client";
	ConfigurationSetName;
	EventDestinationName;
	constructor(opts) {
		super({
			name: "InvalidSNSDestinationException",
			$fault: "client",
			...opts
		});
		Object.setPrototypeOf(this, InvalidSNSDestinationException.prototype);
		this.ConfigurationSetName = opts.ConfigurationSetName;
		this.EventDestinationName = opts.EventDestinationName;
	}
};
var InvalidTrackingOptionsException = class InvalidTrackingOptionsException extends SESServiceException {
	name = "InvalidTrackingOptionsException";
	$fault = "client";
	constructor(opts) {
		super({
			name: "InvalidTrackingOptionsException",
			$fault: "client",
			...opts
		});
		Object.setPrototypeOf(this, InvalidTrackingOptionsException.prototype);
	}
};
var TrackingOptionsAlreadyExistsException = class TrackingOptionsAlreadyExistsException extends SESServiceException {
	name = "TrackingOptionsAlreadyExistsException";
	$fault = "client";
	ConfigurationSetName;
	constructor(opts) {
		super({
			name: "TrackingOptionsAlreadyExistsException",
			$fault: "client",
			...opts
		});
		Object.setPrototypeOf(this, TrackingOptionsAlreadyExistsException.prototype);
		this.ConfigurationSetName = opts.ConfigurationSetName;
	}
};
var CustomVerificationEmailInvalidContentException = class CustomVerificationEmailInvalidContentException extends SESServiceException {
	name = "CustomVerificationEmailInvalidContentException";
	$fault = "client";
	constructor(opts) {
		super({
			name: "CustomVerificationEmailInvalidContentException",
			$fault: "client",
			...opts
		});
		Object.setPrototypeOf(this, CustomVerificationEmailInvalidContentException.prototype);
	}
};
var CustomVerificationEmailTemplateAlreadyExistsException = class CustomVerificationEmailTemplateAlreadyExistsException extends SESServiceException {
	name = "CustomVerificationEmailTemplateAlreadyExistsException";
	$fault = "client";
	CustomVerificationEmailTemplateName;
	constructor(opts) {
		super({
			name: "CustomVerificationEmailTemplateAlreadyExistsException",
			$fault: "client",
			...opts
		});
		Object.setPrototypeOf(this, CustomVerificationEmailTemplateAlreadyExistsException.prototype);
		this.CustomVerificationEmailTemplateName = opts.CustomVerificationEmailTemplateName;
	}
};
var FromEmailAddressNotVerifiedException = class FromEmailAddressNotVerifiedException extends SESServiceException {
	name = "FromEmailAddressNotVerifiedException";
	$fault = "client";
	FromEmailAddress;
	constructor(opts) {
		super({
			name: "FromEmailAddressNotVerifiedException",
			$fault: "client",
			...opts
		});
		Object.setPrototypeOf(this, FromEmailAddressNotVerifiedException.prototype);
		this.FromEmailAddress = opts.FromEmailAddress;
	}
};
var InvalidLambdaFunctionException = class InvalidLambdaFunctionException extends SESServiceException {
	name = "InvalidLambdaFunctionException";
	$fault = "client";
	FunctionArn;
	constructor(opts) {
		super({
			name: "InvalidLambdaFunctionException",
			$fault: "client",
			...opts
		});
		Object.setPrototypeOf(this, InvalidLambdaFunctionException.prototype);
		this.FunctionArn = opts.FunctionArn;
	}
};
var InvalidS3ConfigurationException = class InvalidS3ConfigurationException extends SESServiceException {
	name = "InvalidS3ConfigurationException";
	$fault = "client";
	Bucket;
	constructor(opts) {
		super({
			name: "InvalidS3ConfigurationException",
			$fault: "client",
			...opts
		});
		Object.setPrototypeOf(this, InvalidS3ConfigurationException.prototype);
		this.Bucket = opts.Bucket;
	}
};
var InvalidSnsTopicException = class InvalidSnsTopicException extends SESServiceException {
	name = "InvalidSnsTopicException";
	$fault = "client";
	Topic;
	constructor(opts) {
		super({
			name: "InvalidSnsTopicException",
			$fault: "client",
			...opts
		});
		Object.setPrototypeOf(this, InvalidSnsTopicException.prototype);
		this.Topic = opts.Topic;
	}
};
var RuleDoesNotExistException = class RuleDoesNotExistException extends SESServiceException {
	name = "RuleDoesNotExistException";
	$fault = "client";
	Name;
	constructor(opts) {
		super({
			name: "RuleDoesNotExistException",
			$fault: "client",
			...opts
		});
		Object.setPrototypeOf(this, RuleDoesNotExistException.prototype);
		this.Name = opts.Name;
	}
};
var InvalidTemplateException = class InvalidTemplateException extends SESServiceException {
	name = "InvalidTemplateException";
	$fault = "client";
	TemplateName;
	constructor(opts) {
		super({
			name: "InvalidTemplateException",
			$fault: "client",
			...opts
		});
		Object.setPrototypeOf(this, InvalidTemplateException.prototype);
		this.TemplateName = opts.TemplateName;
	}
};
var CustomVerificationEmailTemplateDoesNotExistException = class CustomVerificationEmailTemplateDoesNotExistException extends SESServiceException {
	name = "CustomVerificationEmailTemplateDoesNotExistException";
	$fault = "client";
	CustomVerificationEmailTemplateName;
	constructor(opts) {
		super({
			name: "CustomVerificationEmailTemplateDoesNotExistException",
			$fault: "client",
			...opts
		});
		Object.setPrototypeOf(this, CustomVerificationEmailTemplateDoesNotExistException.prototype);
		this.CustomVerificationEmailTemplateName = opts.CustomVerificationEmailTemplateName;
	}
};
var EventDestinationDoesNotExistException = class EventDestinationDoesNotExistException extends SESServiceException {
	name = "EventDestinationDoesNotExistException";
	$fault = "client";
	ConfigurationSetName;
	EventDestinationName;
	constructor(opts) {
		super({
			name: "EventDestinationDoesNotExistException",
			$fault: "client",
			...opts
		});
		Object.setPrototypeOf(this, EventDestinationDoesNotExistException.prototype);
		this.ConfigurationSetName = opts.ConfigurationSetName;
		this.EventDestinationName = opts.EventDestinationName;
	}
};
var TrackingOptionsDoesNotExistException = class TrackingOptionsDoesNotExistException extends SESServiceException {
	name = "TrackingOptionsDoesNotExistException";
	$fault = "client";
	ConfigurationSetName;
	constructor(opts) {
		super({
			name: "TrackingOptionsDoesNotExistException",
			$fault: "client",
			...opts
		});
		Object.setPrototypeOf(this, TrackingOptionsDoesNotExistException.prototype);
		this.ConfigurationSetName = opts.ConfigurationSetName;
	}
};
var TemplateDoesNotExistException = class TemplateDoesNotExistException extends SESServiceException {
	name = "TemplateDoesNotExistException";
	$fault = "client";
	TemplateName;
	constructor(opts) {
		super({
			name: "TemplateDoesNotExistException",
			$fault: "client",
			...opts
		});
		Object.setPrototypeOf(this, TemplateDoesNotExistException.prototype);
		this.TemplateName = opts.TemplateName;
	}
};
var InvalidDeliveryOptionsException = class InvalidDeliveryOptionsException extends SESServiceException {
	name = "InvalidDeliveryOptionsException";
	$fault = "client";
	constructor(opts) {
		super({
			name: "InvalidDeliveryOptionsException",
			$fault: "client",
			...opts
		});
		Object.setPrototypeOf(this, InvalidDeliveryOptionsException.prototype);
	}
};
var InvalidPolicyException = class InvalidPolicyException extends SESServiceException {
	name = "InvalidPolicyException";
	$fault = "client";
	constructor(opts) {
		super({
			name: "InvalidPolicyException",
			$fault: "client",
			...opts
		});
		Object.setPrototypeOf(this, InvalidPolicyException.prototype);
	}
};
var InvalidRenderingParameterException = class InvalidRenderingParameterException extends SESServiceException {
	name = "InvalidRenderingParameterException";
	$fault = "client";
	TemplateName;
	constructor(opts) {
		super({
			name: "InvalidRenderingParameterException",
			$fault: "client",
			...opts
		});
		Object.setPrototypeOf(this, InvalidRenderingParameterException.prototype);
		this.TemplateName = opts.TemplateName;
	}
};
var MailFromDomainNotVerifiedException = class MailFromDomainNotVerifiedException extends SESServiceException {
	name = "MailFromDomainNotVerifiedException";
	$fault = "client";
	constructor(opts) {
		super({
			name: "MailFromDomainNotVerifiedException",
			$fault: "client",
			...opts
		});
		Object.setPrototypeOf(this, MailFromDomainNotVerifiedException.prototype);
	}
};
var MessageRejected = class MessageRejected extends SESServiceException {
	name = "MessageRejected";
	$fault = "client";
	constructor(opts) {
		super({
			name: "MessageRejected",
			$fault: "client",
			...opts
		});
		Object.setPrototypeOf(this, MessageRejected.prototype);
	}
};
var MissingRenderingAttributeException = class MissingRenderingAttributeException extends SESServiceException {
	name = "MissingRenderingAttributeException";
	$fault = "client";
	TemplateName;
	constructor(opts) {
		super({
			name: "MissingRenderingAttributeException",
			$fault: "client",
			...opts
		});
		Object.setPrototypeOf(this, MissingRenderingAttributeException.prototype);
		this.TemplateName = opts.TemplateName;
	}
};
var ProductionAccessNotGrantedException = class ProductionAccessNotGrantedException extends SESServiceException {
	name = "ProductionAccessNotGrantedException";
	$fault = "client";
	constructor(opts) {
		super({
			name: "ProductionAccessNotGrantedException",
			$fault: "client",
			...opts
		});
		Object.setPrototypeOf(this, ProductionAccessNotGrantedException.prototype);
	}
};
//#endregion
//#region node_modules/@aws-sdk/client-ses/dist-es/schemas/schemas_0.js
var _AEE = "AlreadyExistsException";
var _ASPE = "AccountSendingPausedException";
var _B = "Bucket";
var _CDE = "CannotDeleteException";
var _CSAEE = "ConfigurationSetAlreadyExistsException";
var _CSDNEE = "ConfigurationSetDoesNotExistException";
var _CSN = "ConfigurationSetName";
var _CSSPE = "ConfigurationSetSendingPausedException";
var _CVEICE = "CustomVerificationEmailInvalidContentException";
var _CVETAEE = "CustomVerificationEmailTemplateAlreadyExistsException";
var _CVETDNEE = "CustomVerificationEmailTemplateDoesNotExistException";
var _CVETN = "CustomVerificationEmailTemplateName";
var _EDAEE = "EventDestinationAlreadyExistsException";
var _EDDNEE = "EventDestinationDoesNotExistException";
var _EDN = "EventDestinationName";
var _FA = "FunctionArn";
var _FEA = "FromEmailAddress";
var _FEANVE = "FromEmailAddressNotVerifiedException";
var _GSQ = "GetSendQuota";
var _GSQR = "GetSendQuotaResponse";
var _ICSE = "InvalidConfigurationSetException";
var _ICWDE = "InvalidCloudWatchDestinationException";
var _IDOE = "InvalidDeliveryOptionsException";
var _IFDE = "InvalidFirehoseDestinationException";
var _ILFE = "InvalidLambdaFunctionException";
var _IPE = "InvalidPolicyException";
var _IRPE = "InvalidRenderingParameterException";
var _ISCE = "InvalidS3ConfigurationException";
var _ISNSDE = "InvalidSNSDestinationException";
var _ISTE = "InvalidSnsTopicException";
var _ITE = "InvalidTemplateException";
var _ITOE = "InvalidTrackingOptionsException";
var _LEE = "LimitExceededException";
var _MFDNVE = "MailFromDomainNotVerifiedException";
var _MHS = "Max24HourSend";
var _MR = "MessageRejected";
var _MRAE = "MissingRenderingAttributeException";
var _MSR = "MaxSendRate";
var _N = "Name";
var _PANGE = "ProductionAccessNotGrantedException";
var _RDNEE = "RuleDoesNotExistException";
var _RSDNEE = "RuleSetDoesNotExistException";
var _SLH = "SentLast24Hours";
var _T = "Topic";
var _TDNEE = "TemplateDoesNotExistException";
var _TN = "TemplateName";
var _TOAEE = "TrackingOptionsAlreadyExistsException";
var _TODNEE = "TrackingOptionsDoesNotExistException";
var _aQE = "awsQueryError";
var _c = "client";
var _e = "error";
var _hE = "httpError";
var _m = "message";
var _s = "smithy.ts.sdk.synthetic.com.amazonaws.ses";
var n0 = "com.amazonaws.ses";
var _s_registry = import_schema.TypeRegistry.for(_s);
var SESServiceException$ = [
	-3,
	_s,
	"SESServiceException",
	0,
	[],
	[]
];
_s_registry.registerError(SESServiceException$, SESServiceException);
var n0_registry = import_schema.TypeRegistry.for(n0);
var AccountSendingPausedException$ = [
	-3,
	n0,
	_ASPE,
	{
		[_aQE]: [`AccountSendingPausedException`, 400],
		[_e]: _c,
		[_hE]: 400
	},
	[_m],
	[0]
];
n0_registry.registerError(AccountSendingPausedException$, AccountSendingPausedException);
var AlreadyExistsException$ = [
	-3,
	n0,
	_AEE,
	{
		[_aQE]: [`AlreadyExists`, 400],
		[_e]: _c,
		[_hE]: 400
	},
	[_N, _m],
	[0, 0]
];
n0_registry.registerError(AlreadyExistsException$, AlreadyExistsException);
var CannotDeleteException$ = [
	-3,
	n0,
	_CDE,
	{
		[_aQE]: [`CannotDelete`, 400],
		[_e]: _c,
		[_hE]: 400
	},
	[_N, _m],
	[0, 0]
];
n0_registry.registerError(CannotDeleteException$, CannotDeleteException);
var ConfigurationSetAlreadyExistsException$ = [
	-3,
	n0,
	_CSAEE,
	{
		[_aQE]: [`ConfigurationSetAlreadyExists`, 400],
		[_e]: _c,
		[_hE]: 400
	},
	[_CSN, _m],
	[0, 0]
];
n0_registry.registerError(ConfigurationSetAlreadyExistsException$, ConfigurationSetAlreadyExistsException);
var ConfigurationSetDoesNotExistException$ = [
	-3,
	n0,
	_CSDNEE,
	{
		[_aQE]: [`ConfigurationSetDoesNotExist`, 400],
		[_e]: _c,
		[_hE]: 400
	},
	[_CSN, _m],
	[0, 0]
];
n0_registry.registerError(ConfigurationSetDoesNotExistException$, ConfigurationSetDoesNotExistException);
var ConfigurationSetSendingPausedException$ = [
	-3,
	n0,
	_CSSPE,
	{
		[_aQE]: [`ConfigurationSetSendingPausedException`, 400],
		[_e]: _c,
		[_hE]: 400
	},
	[_CSN, _m],
	[0, 0]
];
n0_registry.registerError(ConfigurationSetSendingPausedException$, ConfigurationSetSendingPausedException);
var CustomVerificationEmailInvalidContentException$ = [
	-3,
	n0,
	_CVEICE,
	{
		[_aQE]: [`CustomVerificationEmailInvalidContent`, 400],
		[_e]: _c,
		[_hE]: 400
	},
	[_m],
	[0]
];
n0_registry.registerError(CustomVerificationEmailInvalidContentException$, CustomVerificationEmailInvalidContentException);
var CustomVerificationEmailTemplateAlreadyExistsException$ = [
	-3,
	n0,
	_CVETAEE,
	{
		[_aQE]: [`CustomVerificationEmailTemplateAlreadyExists`, 400],
		[_e]: _c,
		[_hE]: 400
	},
	[_CVETN, _m],
	[0, 0]
];
n0_registry.registerError(CustomVerificationEmailTemplateAlreadyExistsException$, CustomVerificationEmailTemplateAlreadyExistsException);
var CustomVerificationEmailTemplateDoesNotExistException$ = [
	-3,
	n0,
	_CVETDNEE,
	{
		[_aQE]: [`CustomVerificationEmailTemplateDoesNotExist`, 400],
		[_e]: _c,
		[_hE]: 400
	},
	[_CVETN, _m],
	[0, 0]
];
n0_registry.registerError(CustomVerificationEmailTemplateDoesNotExistException$, CustomVerificationEmailTemplateDoesNotExistException);
var EventDestinationAlreadyExistsException$ = [
	-3,
	n0,
	_EDAEE,
	{
		[_aQE]: [`EventDestinationAlreadyExists`, 400],
		[_e]: _c,
		[_hE]: 400
	},
	[
		_CSN,
		_EDN,
		_m
	],
	[
		0,
		0,
		0
	]
];
n0_registry.registerError(EventDestinationAlreadyExistsException$, EventDestinationAlreadyExistsException);
var EventDestinationDoesNotExistException$ = [
	-3,
	n0,
	_EDDNEE,
	{
		[_aQE]: [`EventDestinationDoesNotExist`, 400],
		[_e]: _c,
		[_hE]: 400
	},
	[
		_CSN,
		_EDN,
		_m
	],
	[
		0,
		0,
		0
	]
];
n0_registry.registerError(EventDestinationDoesNotExistException$, EventDestinationDoesNotExistException);
var FromEmailAddressNotVerifiedException$ = [
	-3,
	n0,
	_FEANVE,
	{
		[_aQE]: [`FromEmailAddressNotVerified`, 400],
		[_e]: _c,
		[_hE]: 400
	},
	[_FEA, _m],
	[0, 0]
];
n0_registry.registerError(FromEmailAddressNotVerifiedException$, FromEmailAddressNotVerifiedException);
var InvalidCloudWatchDestinationException$ = [
	-3,
	n0,
	_ICWDE,
	{
		[_aQE]: [`InvalidCloudWatchDestination`, 400],
		[_e]: _c,
		[_hE]: 400
	},
	[
		_CSN,
		_EDN,
		_m
	],
	[
		0,
		0,
		0
	]
];
n0_registry.registerError(InvalidCloudWatchDestinationException$, InvalidCloudWatchDestinationException);
var InvalidConfigurationSetException$ = [
	-3,
	n0,
	_ICSE,
	{
		[_aQE]: [`InvalidConfigurationSet`, 400],
		[_e]: _c,
		[_hE]: 400
	},
	[_m],
	[0]
];
n0_registry.registerError(InvalidConfigurationSetException$, InvalidConfigurationSetException);
var InvalidDeliveryOptionsException$ = [
	-3,
	n0,
	_IDOE,
	{
		[_aQE]: [`InvalidDeliveryOptions`, 400],
		[_e]: _c,
		[_hE]: 400
	},
	[_m],
	[0]
];
n0_registry.registerError(InvalidDeliveryOptionsException$, InvalidDeliveryOptionsException);
var InvalidFirehoseDestinationException$ = [
	-3,
	n0,
	_IFDE,
	{
		[_aQE]: [`InvalidFirehoseDestination`, 400],
		[_e]: _c,
		[_hE]: 400
	},
	[
		_CSN,
		_EDN,
		_m
	],
	[
		0,
		0,
		0
	]
];
n0_registry.registerError(InvalidFirehoseDestinationException$, InvalidFirehoseDestinationException);
var InvalidLambdaFunctionException$ = [
	-3,
	n0,
	_ILFE,
	{
		[_aQE]: [`InvalidLambdaFunction`, 400],
		[_e]: _c,
		[_hE]: 400
	},
	[_FA, _m],
	[0, 0]
];
n0_registry.registerError(InvalidLambdaFunctionException$, InvalidLambdaFunctionException);
var InvalidPolicyException$ = [
	-3,
	n0,
	_IPE,
	{
		[_aQE]: [`InvalidPolicy`, 400],
		[_e]: _c,
		[_hE]: 400
	},
	[_m],
	[0]
];
n0_registry.registerError(InvalidPolicyException$, InvalidPolicyException);
var InvalidRenderingParameterException$ = [
	-3,
	n0,
	_IRPE,
	{
		[_aQE]: [`InvalidRenderingParameter`, 400],
		[_e]: _c,
		[_hE]: 400
	},
	[_TN, _m],
	[0, 0]
];
n0_registry.registerError(InvalidRenderingParameterException$, InvalidRenderingParameterException);
var InvalidS3ConfigurationException$ = [
	-3,
	n0,
	_ISCE,
	{
		[_aQE]: [`InvalidS3Configuration`, 400],
		[_e]: _c,
		[_hE]: 400
	},
	[_B, _m],
	[0, 0]
];
n0_registry.registerError(InvalidS3ConfigurationException$, InvalidS3ConfigurationException);
var InvalidSNSDestinationException$ = [
	-3,
	n0,
	_ISNSDE,
	{
		[_aQE]: [`InvalidSNSDestination`, 400],
		[_e]: _c,
		[_hE]: 400
	},
	[
		_CSN,
		_EDN,
		_m
	],
	[
		0,
		0,
		0
	]
];
n0_registry.registerError(InvalidSNSDestinationException$, InvalidSNSDestinationException);
var InvalidSnsTopicException$ = [
	-3,
	n0,
	_ISTE,
	{
		[_aQE]: [`InvalidSnsTopic`, 400],
		[_e]: _c,
		[_hE]: 400
	},
	[_T, _m],
	[0, 0]
];
n0_registry.registerError(InvalidSnsTopicException$, InvalidSnsTopicException);
var InvalidTemplateException$ = [
	-3,
	n0,
	_ITE,
	{
		[_aQE]: [`InvalidTemplate`, 400],
		[_e]: _c,
		[_hE]: 400
	},
	[_TN, _m],
	[0, 0]
];
n0_registry.registerError(InvalidTemplateException$, InvalidTemplateException);
var InvalidTrackingOptionsException$ = [
	-3,
	n0,
	_ITOE,
	{
		[_aQE]: [`InvalidTrackingOptions`, 400],
		[_e]: _c,
		[_hE]: 400
	},
	[_m],
	[0]
];
n0_registry.registerError(InvalidTrackingOptionsException$, InvalidTrackingOptionsException);
var LimitExceededException$ = [
	-3,
	n0,
	_LEE,
	{
		[_aQE]: [`LimitExceeded`, 400],
		[_e]: _c,
		[_hE]: 400
	},
	[_m],
	[0]
];
n0_registry.registerError(LimitExceededException$, LimitExceededException);
var MailFromDomainNotVerifiedException$ = [
	-3,
	n0,
	_MFDNVE,
	{
		[_aQE]: [`MailFromDomainNotVerifiedException`, 400],
		[_e]: _c,
		[_hE]: 400
	},
	[_m],
	[0]
];
n0_registry.registerError(MailFromDomainNotVerifiedException$, MailFromDomainNotVerifiedException);
var MessageRejected$ = [
	-3,
	n0,
	_MR,
	{
		[_aQE]: [`MessageRejected`, 400],
		[_e]: _c,
		[_hE]: 400
	},
	[_m],
	[0]
];
n0_registry.registerError(MessageRejected$, MessageRejected);
var MissingRenderingAttributeException$ = [
	-3,
	n0,
	_MRAE,
	{
		[_aQE]: [`MissingRenderingAttribute`, 400],
		[_e]: _c,
		[_hE]: 400
	},
	[_TN, _m],
	[0, 0]
];
n0_registry.registerError(MissingRenderingAttributeException$, MissingRenderingAttributeException);
var ProductionAccessNotGrantedException$ = [
	-3,
	n0,
	_PANGE,
	{
		[_aQE]: [`ProductionAccessNotGranted`, 400],
		[_e]: _c,
		[_hE]: 400
	},
	[_m],
	[0]
];
n0_registry.registerError(ProductionAccessNotGrantedException$, ProductionAccessNotGrantedException);
var RuleDoesNotExistException$ = [
	-3,
	n0,
	_RDNEE,
	{
		[_aQE]: [`RuleDoesNotExist`, 400],
		[_e]: _c,
		[_hE]: 400
	},
	[_N, _m],
	[0, 0]
];
n0_registry.registerError(RuleDoesNotExistException$, RuleDoesNotExistException);
var RuleSetDoesNotExistException$ = [
	-3,
	n0,
	_RSDNEE,
	{
		[_aQE]: [`RuleSetDoesNotExist`, 400],
		[_e]: _c,
		[_hE]: 400
	},
	[_N, _m],
	[0, 0]
];
n0_registry.registerError(RuleSetDoesNotExistException$, RuleSetDoesNotExistException);
var TemplateDoesNotExistException$ = [
	-3,
	n0,
	_TDNEE,
	{
		[_aQE]: [`TemplateDoesNotExist`, 400],
		[_e]: _c,
		[_hE]: 400
	},
	[_TN, _m],
	[0, 0]
];
n0_registry.registerError(TemplateDoesNotExistException$, TemplateDoesNotExistException);
var TrackingOptionsAlreadyExistsException$ = [
	-3,
	n0,
	_TOAEE,
	{
		[_aQE]: [`TrackingOptionsAlreadyExistsException`, 400],
		[_e]: _c,
		[_hE]: 400
	},
	[_CSN, _m],
	[0, 0]
];
n0_registry.registerError(TrackingOptionsAlreadyExistsException$, TrackingOptionsAlreadyExistsException);
var TrackingOptionsDoesNotExistException$ = [
	-3,
	n0,
	_TODNEE,
	{
		[_aQE]: [`TrackingOptionsDoesNotExistException`, 400],
		[_e]: _c,
		[_hE]: 400
	},
	[_CSN, _m],
	[0, 0]
];
n0_registry.registerError(TrackingOptionsDoesNotExistException$, TrackingOptionsDoesNotExistException);
var errorTypeRegistries = [_s_registry, n0_registry];
var GetSendQuotaResponse$ = [
	3,
	n0,
	_GSQR,
	0,
	[
		_MHS,
		_MSR,
		_SLH
	],
	[
		1,
		1,
		1
	]
];
var __Unit = "unit";
var GetSendQuota$ = [
	9,
	n0,
	_GSQ,
	0,
	() => __Unit,
	() => GetSendQuotaResponse$
];
//#endregion
//#region node_modules/@aws-sdk/client-ses/dist-es/runtimeConfig.shared.js
var import_protocols$1 = require_protocols$1();
var import_serde = require_serde();
var getRuntimeConfig$1 = (config) => {
	return {
		apiVersion: "2010-12-01",
		base64Decoder: config?.base64Decoder ?? import_serde.fromBase64,
		base64Encoder: config?.base64Encoder ?? import_serde.toBase64,
		disableHostPrefix: config?.disableHostPrefix ?? false,
		endpointProvider: config?.endpointProvider ?? defaultEndpointResolver,
		extensions: config?.extensions ?? [],
		httpAuthSchemeProvider: config?.httpAuthSchemeProvider ?? defaultSESHttpAuthSchemeProvider,
		httpAuthSchemes: config?.httpAuthSchemes ?? [{
			schemeId: "aws.auth#sigv4",
			identityProvider: (ipc) => ipc.getIdentityProvider("aws.auth#sigv4"),
			signer: new import_httpAuthSchemes.AwsSdkSigV4Signer()
		}],
		logger: config?.logger ?? new import_client$1.NoOpLogger(),
		protocol: config?.protocol ?? import_protocols.AwsQueryProtocol,
		protocolSettings: config?.protocolSettings ?? {
			defaultNamespace: "com.amazonaws.ses",
			errorTypeRegistries,
			xmlNamespace: "http://ses.amazonaws.com/doc/2010-12-01/",
			version: "2010-12-01",
			serviceTarget: "SimpleEmailService"
		},
		serviceId: config?.serviceId ?? "SES",
		sha256: config?.sha256 ?? import_checksum.Sha256,
		urlParser: config?.urlParser ?? import_protocols$1.parseUrl,
		utf8Decoder: config?.utf8Decoder ?? import_serde.fromUtf8,
		utf8Encoder: config?.utf8Encoder ?? import_serde.toUtf8
	};
};
//#endregion
//#region node_modules/@aws-sdk/client-ses/dist-es/runtimeConfig.js
var getRuntimeConfig = (config) => {
	(0, import_client$1.emitWarningIfUnsupportedVersion)(process.version);
	const defaultsMode = (0, import_config.resolveDefaultsModeConfig)(config);
	const defaultConfigProvider = () => defaultsMode().then(import_client$1.loadConfigsForDefaultMode);
	const clientSharedValues = getRuntimeConfig$1(config);
	(0, import_client.emitWarningIfUnsupportedVersion)(process.version);
	const loaderConfig = {
		profile: config?.profile,
		logger: clientSharedValues.logger
	};
	return {
		...clientSharedValues,
		...config,
		runtime: "node",
		defaultsMode,
		authSchemePreference: config?.authSchemePreference ?? (0, import_config.loadConfig)(import_httpAuthSchemes.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, loaderConfig),
		bodyLengthChecker: config?.bodyLengthChecker ?? import_serde.calculateBodyLength,
		credentialDefaultProvider: config?.credentialDefaultProvider ?? defaultProvider,
		defaultUserAgentProvider: config?.defaultUserAgentProvider ?? (0, import_client.createDefaultUserAgentProvider)({
			serviceId: clientSharedValues.serviceId,
			clientVersion: package_default.version
		}),
		maxAttempts: config?.maxAttempts ?? (0, import_config.loadConfig)(import_retry.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, config),
		region: config?.region ?? (0, import_config.loadConfig)(import_config.NODE_REGION_CONFIG_OPTIONS, {
			...import_config.NODE_REGION_CONFIG_FILE_OPTIONS,
			...loaderConfig
		}),
		requestHandler: NodeHttpHandler.create(config?.requestHandler ?? defaultConfigProvider),
		retryMode: config?.retryMode ?? (0, import_config.loadConfig)({
			...import_retry.NODE_RETRY_MODE_CONFIG_OPTIONS,
			default: async () => (await defaultConfigProvider()).retryMode || import_retry.DEFAULT_RETRY_MODE
		}, config),
		streamCollector: config?.streamCollector ?? import_serde$1.streamCollector,
		useDualstackEndpoint: config?.useDualstackEndpoint ?? (0, import_config.loadConfig)(import_config.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
		useFipsEndpoint: config?.useFipsEndpoint ?? (0, import_config.loadConfig)(import_config.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
		userAgentAppId: config?.userAgentAppId ?? (0, import_config.loadConfig)(import_client.NODE_APP_ID_CONFIG_OPTIONS, loaderConfig)
	};
};
//#endregion
//#region node_modules/@aws-sdk/client-ses/dist-es/auth/httpAuthExtensionConfiguration.js
var getHttpAuthExtensionConfiguration = (runtimeConfig) => {
	const _httpAuthSchemes = runtimeConfig.httpAuthSchemes;
	let _httpAuthSchemeProvider = runtimeConfig.httpAuthSchemeProvider;
	let _credentials = runtimeConfig.credentials;
	return {
		setHttpAuthScheme(httpAuthScheme) {
			const index = _httpAuthSchemes.findIndex((scheme) => scheme.schemeId === httpAuthScheme.schemeId);
			if (index === -1) _httpAuthSchemes.push(httpAuthScheme);
			else _httpAuthSchemes.splice(index, 1, httpAuthScheme);
		},
		httpAuthSchemes() {
			return _httpAuthSchemes;
		},
		setHttpAuthSchemeProvider(httpAuthSchemeProvider) {
			_httpAuthSchemeProvider = httpAuthSchemeProvider;
		},
		httpAuthSchemeProvider() {
			return _httpAuthSchemeProvider;
		},
		setCredentials(credentials) {
			_credentials = credentials;
		},
		credentials() {
			return _credentials;
		}
	};
};
var resolveHttpAuthRuntimeConfig = (config) => {
	return {
		httpAuthSchemes: config.httpAuthSchemes(),
		httpAuthSchemeProvider: config.httpAuthSchemeProvider(),
		credentials: config.credentials()
	};
};
//#endregion
//#region node_modules/@aws-sdk/client-ses/dist-es/runtimeExtensions.js
var resolveRuntimeExtensions = (runtimeConfig, extensions) => {
	const extensionConfiguration = Object.assign((0, import_client.getAwsRegionExtensionConfiguration)(runtimeConfig), (0, import_client$1.getDefaultExtensionConfiguration)(runtimeConfig), (0, import_protocols$1.getHttpHandlerExtensionConfiguration)(runtimeConfig), getHttpAuthExtensionConfiguration(runtimeConfig));
	extensions.forEach((extension) => extension.configure(extensionConfiguration));
	return Object.assign(runtimeConfig, (0, import_client.resolveAwsRegionExtensionConfiguration)(extensionConfiguration), (0, import_client$1.resolveDefaultRuntimeConfig)(extensionConfiguration), (0, import_protocols$1.resolveHttpHandlerRuntimeConfig)(extensionConfiguration), resolveHttpAuthRuntimeConfig(extensionConfiguration));
};
//#endregion
//#region node_modules/@aws-sdk/client-ses/dist-es/SESClient.js
var SESClient = class extends import_client$1.Client {
	config;
	constructor(...[configuration]) {
		const _config_0 = getRuntimeConfig(configuration || {});
		super(_config_0);
		this.initConfig = _config_0;
		const _config_8 = resolveRuntimeExtensions(resolveHttpAuthSchemeConfig((0, import_endpoints.resolveEndpointConfig)((0, import_client.resolveHostHeaderConfig)((0, import_config.resolveRegionConfig)((0, import_retry.resolveRetryConfig)((0, import_client.resolveUserAgentConfig)(resolveClientEndpointParameters(_config_0))))))), configuration?.extensions || []);
		this.config = _config_8;
		this.middlewareStack.use((0, import_schema.getSchemaSerdePlugin)(this.config));
		this.middlewareStack.use((0, import_client.getUserAgentPlugin)(this.config));
		this.middlewareStack.use((0, import_retry.getRetryPlugin)(this.config));
		this.middlewareStack.use((0, import_protocols$1.getContentLengthPlugin)(this.config));
		this.middlewareStack.use((0, import_client.getHostHeaderPlugin)(this.config));
		this.middlewareStack.use((0, import_client.getLoggerPlugin)(this.config));
		this.middlewareStack.use((0, import_client.getRecursionDetectionPlugin)(this.config));
		this.middlewareStack.use((0, import_dist_cjs.getHttpAuthSchemeEndpointRuleSetPlugin)(this.config, {
			httpAuthSchemeParametersProvider: defaultSESHttpAuthSchemeParametersProvider,
			identityProviderConfigProvider: async (config) => new import_dist_cjs.DefaultIdentityProviderConfig({ "aws.auth#sigv4": config.credentials })
		}));
		this.middlewareStack.use((0, import_dist_cjs.getHttpSigningPlugin)(this.config));
	}
	destroy() {
		super.destroy();
	}
};
//#endregion
//#region node_modules/@aws-sdk/client-ses/dist-es/commandBuilder.js
var command = (0, import_client$1.makeBuilder)(commonParams, "SimpleEmailService", "SESClient", import_endpoints.getEndpointPlugin);
var _ep0 = {};
var _mw0 = (Command, cs, config, o) => [];
//#endregion
//#region node_modules/@aws-sdk/client-ses/dist-es/commands/GetSendQuotaCommand.js
var GetSendQuotaCommand = class extends command(_ep0, _mw0, "GetSendQuota", GetSendQuota$) {};
//#endregion
//#region node_modules/@aws-sdk/client-ses/dist-es/index.js
var dist_es_exports = /* @__PURE__ */ __exportAll({
	AccountSendingPausedException: () => AccountSendingPausedException,
	AccountSendingPausedException$: () => AccountSendingPausedException$,
	AlreadyExistsException: () => AlreadyExistsException,
	AlreadyExistsException$: () => AlreadyExistsException$,
	CannotDeleteException: () => CannotDeleteException,
	CannotDeleteException$: () => CannotDeleteException$,
	ConfigurationSetAlreadyExistsException: () => ConfigurationSetAlreadyExistsException,
	ConfigurationSetAlreadyExistsException$: () => ConfigurationSetAlreadyExistsException$,
	ConfigurationSetDoesNotExistException: () => ConfigurationSetDoesNotExistException,
	ConfigurationSetDoesNotExistException$: () => ConfigurationSetDoesNotExistException$,
	ConfigurationSetSendingPausedException: () => ConfigurationSetSendingPausedException,
	ConfigurationSetSendingPausedException$: () => ConfigurationSetSendingPausedException$,
	CustomVerificationEmailInvalidContentException: () => CustomVerificationEmailInvalidContentException,
	CustomVerificationEmailInvalidContentException$: () => CustomVerificationEmailInvalidContentException$,
	CustomVerificationEmailTemplateAlreadyExistsException: () => CustomVerificationEmailTemplateAlreadyExistsException,
	CustomVerificationEmailTemplateAlreadyExistsException$: () => CustomVerificationEmailTemplateAlreadyExistsException$,
	CustomVerificationEmailTemplateDoesNotExistException: () => CustomVerificationEmailTemplateDoesNotExistException,
	CustomVerificationEmailTemplateDoesNotExistException$: () => CustomVerificationEmailTemplateDoesNotExistException$,
	EventDestinationAlreadyExistsException: () => EventDestinationAlreadyExistsException,
	EventDestinationAlreadyExistsException$: () => EventDestinationAlreadyExistsException$,
	EventDestinationDoesNotExistException: () => EventDestinationDoesNotExistException,
	EventDestinationDoesNotExistException$: () => EventDestinationDoesNotExistException$,
	FromEmailAddressNotVerifiedException: () => FromEmailAddressNotVerifiedException,
	FromEmailAddressNotVerifiedException$: () => FromEmailAddressNotVerifiedException$,
	GetSendQuota$: () => GetSendQuota$,
	GetSendQuotaCommand: () => GetSendQuotaCommand,
	GetSendQuotaResponse$: () => GetSendQuotaResponse$,
	InvalidCloudWatchDestinationException: () => InvalidCloudWatchDestinationException,
	InvalidCloudWatchDestinationException$: () => InvalidCloudWatchDestinationException$,
	InvalidConfigurationSetException: () => InvalidConfigurationSetException,
	InvalidConfigurationSetException$: () => InvalidConfigurationSetException$,
	InvalidDeliveryOptionsException: () => InvalidDeliveryOptionsException,
	InvalidDeliveryOptionsException$: () => InvalidDeliveryOptionsException$,
	InvalidFirehoseDestinationException: () => InvalidFirehoseDestinationException,
	InvalidFirehoseDestinationException$: () => InvalidFirehoseDestinationException$,
	InvalidLambdaFunctionException: () => InvalidLambdaFunctionException,
	InvalidLambdaFunctionException$: () => InvalidLambdaFunctionException$,
	InvalidPolicyException: () => InvalidPolicyException,
	InvalidPolicyException$: () => InvalidPolicyException$,
	InvalidRenderingParameterException: () => InvalidRenderingParameterException,
	InvalidRenderingParameterException$: () => InvalidRenderingParameterException$,
	InvalidS3ConfigurationException: () => InvalidS3ConfigurationException,
	InvalidS3ConfigurationException$: () => InvalidS3ConfigurationException$,
	InvalidSNSDestinationException: () => InvalidSNSDestinationException,
	InvalidSNSDestinationException$: () => InvalidSNSDestinationException$,
	InvalidSnsTopicException: () => InvalidSnsTopicException,
	InvalidSnsTopicException$: () => InvalidSnsTopicException$,
	InvalidTemplateException: () => InvalidTemplateException,
	InvalidTemplateException$: () => InvalidTemplateException$,
	InvalidTrackingOptionsException: () => InvalidTrackingOptionsException,
	InvalidTrackingOptionsException$: () => InvalidTrackingOptionsException$,
	LimitExceededException: () => LimitExceededException,
	LimitExceededException$: () => LimitExceededException$,
	MailFromDomainNotVerifiedException: () => MailFromDomainNotVerifiedException,
	MailFromDomainNotVerifiedException$: () => MailFromDomainNotVerifiedException$,
	MessageRejected: () => MessageRejected,
	MessageRejected$: () => MessageRejected$,
	MissingRenderingAttributeException: () => MissingRenderingAttributeException,
	MissingRenderingAttributeException$: () => MissingRenderingAttributeException$,
	ProductionAccessNotGrantedException: () => ProductionAccessNotGrantedException,
	ProductionAccessNotGrantedException$: () => ProductionAccessNotGrantedException$,
	RuleDoesNotExistException: () => RuleDoesNotExistException,
	RuleDoesNotExistException$: () => RuleDoesNotExistException$,
	RuleSetDoesNotExistException: () => RuleSetDoesNotExistException,
	RuleSetDoesNotExistException$: () => RuleSetDoesNotExistException$,
	SESClient: () => SESClient,
	SESServiceException$: () => SESServiceException$,
	TemplateDoesNotExistException: () => TemplateDoesNotExistException,
	TemplateDoesNotExistException$: () => TemplateDoesNotExistException$,
	TrackingOptionsAlreadyExistsException: () => TrackingOptionsAlreadyExistsException,
	TrackingOptionsAlreadyExistsException$: () => TrackingOptionsAlreadyExistsException$,
	TrackingOptionsDoesNotExistException: () => TrackingOptionsDoesNotExistException,
	TrackingOptionsDoesNotExistException$: () => TrackingOptionsDoesNotExistException$,
	__Client: () => import_client$1.Client,
	errorTypeRegistries: () => errorTypeRegistries
});
//#endregion
export { require_schema as C, require_client$1 as S, require_protocols$1 as _, NodeHttpHandler as a, require_endpoints as b, require_httpAuthSchemes as c, signatureV4aContainer as d, SignatureV4 as f, require_retry as g, require_dist_cjs as h, init_dist_es$1 as i, init_dist_es$2 as l, require_client as m, require_protocols as n, init_node_http_handler as o, init_SignatureV4 as p, dist_es_exports$2 as r, dist_es_exports$3 as s, dist_es_exports as t, init_signature_v4a_container as u, require_checksum as v, require_config as x, require_serde as y };
