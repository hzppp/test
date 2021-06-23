// #ifdef MP-WEIXIN		
! function(t, e) {
	"object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define &&
		define.amd ? define(e) : t.Ald = e()
}(this, function() {
	function t() {
		this.concurrency = 4, this.queue = [], this.tasks = [], this.activeCount = 0;
		var t = this;
		this.push = function(e) {
			this.tasks.push(new Promise(function(n, o) {
				var r = function() {
					t.activeCount++, e().then(function(t) {
						n(t)
					}).then(function() {
						t.next()
					})
				};
				t.activeCount < t.concurrency ? r() : t.queue.push(r)
			}))
		}, this.all = function() {
			return Promise.all(this.tasks)
		}, this.next = function() {
			t.activeCount--, t.queue.length > 0 && t.queue.shift()()
		}
	}

	function e() {
		this.request = [], this.updata = !1, this.push = function(t) {
			if (this.request.length >= 8 && !this.updata && (this.updata = !0, n()), this.request.length >=
				10) {
				let e = this.request.shift();
				e().then(function(t) {}).catch(t => {}), this.request.push(t)
			} else this.request.push(t)
		}, this.concat = function() {
			this.request.map(function(t) {
				wx.Queue.push(t)
			}), this.request = []
		}
	}

	function n() {
		"function" == typeof St && "" === K && St().then(function(t) {
			28 === t.length && (K = t, wx.setStorageSync("aldstat_op", t))
		})
	}

	function o(t) {
		this.app = t
	}

	function r(t) {
		function e(t) {
			return Object.prototype.toString.call(t)
		}
		var n = {};
		return "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" ").forEach(function(t,
				e) {
				n["[object " + t + "]"] = t.toLowerCase()
			}),
			function() {
				return null == t ? t : "object" == typeof t || "function" == typeof t ? n[e.call(t)] || "object" :
					typeof t
			}()
	}

	function a(t) {
		T = x(), F = t, ht = t.scene, this.aldstat = new o(this)
	}

	function i(t) {
		n();
		var e;
		if (e = t.scene != ht, ht = t.scene, z = 0, F = t, X = t.query.ald_share_src, Y = t.query.aldsrc || "", Z =
			t.query.ald_share_src, lt || dt || xt || (W = !1), lt = !1, (0 !== J && Date.now() - J > 3e4 || e) && (
				dt || (B = x(), Q = Date.now(), vt = 0)), 0 !== J && Date.now() - J < 3e4 && (at = !0), t.query
			.ald_share_src && "1044" == t.scene && t.shareTicket ? wx.getShareInfo({
				shareTicket: t.shareTicket,
				success: function(t) {
					et = t, D("event", "ald_share_click", JSON.stringify(t))
				}
			}) : t.query.ald_share_src && D("event", "ald_share_click", 1), "" === nt && wx.getSetting({
				withCredentials: !0,
				success: function(t) {
					if (t.authSetting["scope.userInfo"]) {
						pt && (pt = !1, wx.getUserInfo({
							withCredentials: !0,
							success: function(t) {
								var e = v();
								nt = t, e.ufo = S(t);
								try {
									gt = S(t).userInfo.gender
								} catch (t) {
									gt = ""
								}
								G = y(t.userInfo.avatarUrl.split("/")), m(e)
							}
						}))
					}
				}
			}), O("app", "show"), "" === K) {
			let t = wx.getAccountInfoSync().miniProgram.appId;
			wx.login({
				success(e) {
					wx.request({
						url: "https://log.aldwx.com/authorize/mini_program_openid",
						data: {
							ai: t,
							uuid: $,
							jc: e.code,
							reqid: "1"
						},
						success(t) {
							t.data.code || (K = t.data.data.openid, wx.setStorageSync("aldstat_op",
								t.data.data.openid))
						}
					})
				},
				fail(t) {}
			})
		}
	}

	function c() {
		n(), J = Date.now(), "" === nt && wx.getSetting({
			success: function(t) {
				t.authSetting["scope.userInfo"] && pt && (pt = !1, wx.getUserInfo({
					withCredentials: !0,
					success: function(t) {
						nt = t, G = y(t.userInfo.avatarUrl.split("/"));
						var e = v();
						e.ufo = S(t);
						try {
							gt = S(t).userInfo.gender
						} catch (t) {
							gt = ""
						}
						m(e)
					}
				}))
			}
		}), O("app", "hide")
	}

	function s(t) {
		tt++, D("event", "ald_error_message", t)
	}

	function u(t) {
		st = t
	}

	function l() {
		mt = Date.now(), it = H ? this.$mp.page.route : this.route, "" === nt && wx.getSetting({
			success: function(t) {
				t.authSetting["scope.userInfo"] && pt && (pt = !1, wx.getUserInfo({
					withCredentials: !0,
					success: function(t) {
						nt = t, G = y(t.userInfo.avatarUrl.split("/"));
						var e = v();
						e.ufo = S(t);
						try {
							gt = S(t).userInfo.gender
						} catch (t) {
							gt = ""
						}
						m(e)
					}
				}))
			}
		}), I("page", "show"), at = !1
	}

	function d() {
		ct = it, vt = Date.now() - mt
	}

	function h() {
		ct = it, vt = Date.now() - mt
	}

	function f() {
		D("event", "ald_pulldownrefresh", 1)
	}

	function p() {
		D("event", "ald_reachbottom", 1)
	}

	function g(t) {
		dt = !0;
		var e = _(t.path),
			n = {};
		for (var o in F.query) "ald_share_src" !== o && "ald_share_op" !== o || (n[o] = F.query[o]);
		var r = "";
		if (r = t.path.indexOf("?") == -1 ? t.path + "?" : t.path.substr(0, t.path.indexOf("?")) + "?", "" !== e)
			for (var o in e) n[o] = e[o];
		n.ald_share_src ? n.ald_share_src.indexOf($) == -1 && n.ald_share_src.length < 200 && (n.ald_share_src = n
			.ald_share_src + "," + $) : n.ald_share_src = $, L.useOpen && (n.ald_share_op ? n.ald_share_op
			.indexOf(K) == -1 && n.ald_share_op.length < 200 && (n.ald_share_op = n.ald_share_op + "," + K) : n
			.ald_share_op = K);
		for (var a in n) a.indexOf("ald") == -1 && (r += a + "=" + n[a] + "&");
		return t.path = r + (L.useOpen ? "ald_share_op=" + n.ald_share_op + "&" : "") + "ald_share_src=" + n
			.ald_share_src, D("event", "ald_share_status", t), t
	}

	function w() {
		function t() {
			return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
		}
		return t() + t() + t() + t() + t() + t() + t() + t()
	}

	function m(t) {
		function e() {
			return new Promise(function(e, n) {
				var o = {
					AldStat: "MiniApp-Stat",
					se: V || "",
					op: K || "",
					img: G
				};
				"" === U || (o.ai = U), wx.request({
					url: "https://" + C + ".aldwx.com/d.html",
					data: t,
					header: o,
					method: "GET",
					success: function(t) {
						e(200 == t.statusCode ? "" : "status error")
					},
					fail: function() {
						e("fail")
					}
				})
			})
		}
		z++, t.at = B, t.uu = $, t.v = R, t.ak = L.app_key.replace(/(\t)|(\s)/g, ""), t.wsr = F, t.ifo = W, t.rq_c =
			z, t.ls = T, t.te = E, t.et = Date.now(), t.st = Date.now(), t.ge = gt, L.useOpen ? "" === K ? ft.push(
				e) : (wx.Queue.push(e), ft.concat()) : wx.Queue.push(e)
	}

	function v() {
		var t = {};
		for (var e in ot) t[e] = ot[e];
		return t
	}

	function y(t) {
		for (var e = "", n = 0; n < t.length; n++) t[n].length > e.length && (e = t[n]);
		return e
	}

	function x() {
		return "" + Date.now() + Math.floor(1e7 * Math.random())
	}

	function S(t) {
		var e = {};
		for (var n in t) "rawData" != n && "errMsg" != n && (e[n] = t[n]);
		return e
	}

	function _(t) {
		if (t.indexOf("?") == -1) return "";
		var e = {};
		return t.split("?")[1].split("&").forEach(function(t) {
			var n = t.split("=")[1];
			e[t.split("=")[0]] = n
		}), e
	}

	function b(t) {
		for (var e in t)
			if ("object" == typeof t[e] && null !== t[e]) return !0;
		return !1
	}

	function O(t, e) {
		var n = v();
		n.ev = t, n.life = e, n.ec = tt, n.dr = Date.now() - Q, "show" == e && (n.uo = L.useOpen), Y && (n.qr = Y, n
			.sr = Y), X && (n.usr = X), m(n)
	}

	function I(t, e) {
		var n = v();
		n.ev = t, n.life = e, n.pp = it, n.pc = ct, n.dr = Date.now() - Q, (dt || xt) && (n.so = 1), xt = !1, dt = !
			1, st && "{}" != JSON.stringify(st) && (n.ag = st), Y && (n.qr = Y, n.sr = Y), X && (n.usr = X), at && (
				n.ps = 1), rt ? n.pdr = vt : (ut = it, rt = !0, n.ifp = rt, n.fp = it, n.pdr = 0), m(n)
	}

	function D(t, e, n) {
		var o = v();
		o.ev = t, o.tp = e, o.dr = Date.now() - Q, n && (o.ct = n), m(o)
	}

	function q(t, e, n) {
		if (t[e]) {
			var o = t[e];
			t[e] = function(t) {
				n.call(this, t, e), o.call(this, t)
			}
		} else t[e] = function(t) {
			n.call(this, t, e)
		}
	}

	function A(t) {
		var e = {};
		for (var n in t) "onLaunch" !== n && "onShow" !== n && "onHide" !== n && "onError" !== n && (e[n] = t[n]);
		return e.onLaunch = function(e) {
			a.call(this, e), "function" == typeof t.onLaunch && t.onLaunch.call(this, e)
		}, e.onShow = function(e) {
			i.call(this, e), t.onShow && "function" == typeof t.onShow && t.onShow.call(this, e)
		}, e.onHide = function() {
			c.call(this), t.onHide && "function" == typeof t.onHide && t.onHide.call(this)
		}, e.onError = function(e) {
			s.call(this, e), t.onError && "function" == typeof t.onError && t.onError.call(this, e)
		}, e
	}

	function j(t) {
		var e = {};
		for (var n in t) "onLoad" !== n && "onShow" !== n && "onHide" !== n && "onUnload" !== n &&
			"onPullDownRefresh" !== n && "onReachBottom" !== n && "onShareAppMessage" !== n && (e[n] = t[n]);
		return e.onLoad = function(e) {
			u.call(this, e), "function" == typeof t.onLoad && t.onLoad.call(this, e)
		}, e.onShow = function(e) {
			l.call(this), "function" == typeof t.onShow && t.onShow.call(this, e)
		}, e.onHide = function(e) {
			d.call(this), "function" == typeof t.onHide && t.onHide.call(this, e)
		}, e.onUnload = function(e) {
			h.call(this), "function" == typeof t.onUnload && t.onUnload.call(this, e)
		}, e.onReachBottom = function(e) {
			p(), t.onReachBottom && "function" == typeof t.onReachBottom && t.onReachBottom.call(this, e)
		}, e.onPullDownRefresh = function(e) {
			f(), t.onPullDownRefresh && "function" == typeof t.onPullDownRefresh && t.onPullDownRefresh.call(
				this, e)
		}, t.onShareAppMessage && "function" == typeof t.onShareAppMessage && (e.onShareAppMessage = function(
		e) {
			var n = t.onShareAppMessage.call(this, e);
			return void 0 === n ? (n = {}, n.path = this.route) : void 0 === n.path && (n.path = this
				.route), g.call(this, n)
		}), e
	}

	function P(t) {
		return App(A(t))
	}

	function N(t) {
		return Page(j(t))
	}

	function M(t) {
		return H = !0, A(t)
	}

	function k(t) {
		return j(t)
	}
	var L = require("./ald-stat-conf");
	void 0 === wx.Queue && (wx.Queue = new t, wx.Queue.all()), "" === L.app_key && console.error(
			"请在ald-stat-conf.js文件中填写小程序统计/广告监测平台创建小程序后生成的app_key，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南！"), L
		.useOpen && console.warn(
			"提示：开启了useOpen配置后，如果不上传用户OpendID则不会上报数据，上传方式：http://doc.aldwx.com 小程序统计/广告监测平台-快速接入指南-上传OpenID！");
	var R = "7.4.0",
		C = "log",
		E = "wx",
		U = function() {
			return void 0 === wx.getAccountInfoSync ? "" : wx.getAccountInfoSync().miniProgram.appId.split("").map(
				function(t) {
					return t.charCodeAt(0) + 9
				}).join("-")
		}(),
		H = !1,
		B = x(),
		T = "",
		Q = Date.now(),
		J = 0,
		V = "",
		K = function() {
			var t = "";
			try {
				t = wx.getStorageSync("aldstat_op")
			} catch (t) {}
			return t
		}(),
		G = "",
		z = 0,
		F = "",
		W = "",
		$ = function() {
			var t = "";
			try {
				t = wx.getStorageSync("aldstat_uuid")
			} catch (e) {
				t = "uuid_getstoragesync"
			}
			if (t) W = !1;
			else {
				t = w();
				try {
					wx.setStorageSync("aldstat_uuid", t), W = !0
				} catch (t) {
					wx.setStorageSync("aldstat_uuid", "uuid_getstoragesync")
				}
			}
			return t
		}(),
		X = "",
		Y = "",
		Z = "",
		tt = 0,
		et = "",
		nt = "",
		ot = {},
		rt = !1,
		at = !1,
		it = "",
		ct = "",
		st = "",
		ut = "",
		lt = !0,
		dt = !1,
		ht = "",
		ft = new e,
		pt = !0,
		gt = "",
		wt = ["aldVisit", "aldPayOrder"],
		mt = 0,
		vt = 0,
		yt = [{
			name: "scanCode"
		}, {
			name: "chooseAddress"
		}, {
			name: "chooseImage"
		}, {
			name: "previewImage"
		}, {
			name: "chooseInvoiceTitle"
		}, {
			name: "chooseInvoice"
		}],
		xt = !1;
	! function() {
		yt.forEach(function(t) {
			t.fn = wx[t.name];
			var e = t.name;
			try {
				Object.defineProperty(wx, e, {
					get: function() {
						return xt = !0, t.fn
					}
				})
			} catch (t) {}
		})
	}();
	var St = "";
	! function() {
		wx.request({
			url: "https://" + C + ".aldwx.com/config/app.json",
			header: {
				AldStat: "MiniApp-Stat"
			},
			method: "GET",
			success: function(t) {
				200 === t.statusCode && (R < t.data.version && console.warn(
						"您的SDK不是最新版本，部分功能不可用，请尽快前往 http://tj.aldwx.com/downSDK 升级"), t.data.warn &&
					console.warn(t.data.warn), t.data.error && console.error(t.data.error))
			}
		})
	}(), wx.aldstat = new o("");
	try {
		var _t = wx.getSystemInfoSync();
		ot.br = _t.brand, ot.pm = _t.model, ot.pr = _t.pixelRatio, ot.ww = _t.windowWidth, ot.wh = _t.windowHeight,
			ot.lang = _t.language, ot.wv = _t.version, ot.wvv = _t.platform, ot.wsdk = _t.SDKVersion, ot.sv = _t
			.system
	} catch (t) {}
	wx.getNetworkType({
		success: function(t) {
			ot.nt = t.networkType
		}
	}), wx.getSetting({
		success: function(t) {
			t.authSetting["scope.userLocation"] ? wx.getLocation({
				type: "wgs84",
				success: function(t) {
					ot.lat = t.latitude, ot.lng = t.longitude, ot.spd = t.speed
				}
			}) : L.getLocation && wx.getLocation({
				type: "wgs84",
				success: function(t) {
					ot.lat = t.latitude, ot.lng = t.longitude, ot.spd = t.speed
				}
			})
		}
	}), o.prototype.sendEvent = function(t, e) {
		if ("" !== t && "string" == typeof t && t.length <= 255)
			if ("string" == typeof e && e.length <= 255) D("event", t, e);
			else if ("object" == typeof e) {
			if (JSON.stringify(e).length >= 255) return void console.error(
				"自定义事件参数不能超过255个字符，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-自定义事件！");
			if (b(e)) return void console.error(
				"事件参数内部只支持Number、String等类型，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-自定义事件！");
			D("event", t, JSON.stringify(e))
		} else void 0 === e ? D("event", t, !1) : console.error(
			"事件参数必须为String、Object类型，且参数长度不能超过255个字符，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-自定义事件！");
		else console.error("事件名称必须为String类型且不能超过255个字符，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-自定义事件！")
	}, o.prototype.sendSession = function(t) {
		if ("" === t || !t) return void console.error("请传入从后台获取的session_key");
		V = t;
		var e = v();
		e.tp = "session", e.ct = "session", e.ev = "event", "" === nt ? wx.getSetting({
			success: function(t) {
				t.authSetting["scope.userInfo"] ? wx.getUserInfo({
					success: function(t) {
						e.ufo = S(t);
						try {
							gt = S(t).userInfo.gender
						} catch (t) {
							gt = ""
						}
						G = y(t.userInfo.avatarUrl.split("/")), "" !== et && (e.gid =
							et), m(e)
					}
				}) : "" !== et && (e.gid = et, m(e))
			}
		}) : (e.ufo = nt, "" !== et && (e.gid = et), m(e))
	}, o.prototype.sendOpenid = function(t) {
		if ("" === t || !t || 28 !== t.length) return void console.error(
			"OpenID不符合规则，请参考接入文档 http://doc.aldwx.com 小程序统计/广告监测平台-快速接入指南！");
		K = t, wx.setStorageSync("aldstat_op", t);
		var e = v();
		e.tp = "openid", e.ev = "event", e.ct = "openid", m(e)
	}, o.prototype.setOpenid = function(t) {
		"function" == typeof t && (St = t, n())
	};
	for (var bt = {
			aldVisit: function(t) {
				if ("[object Object]" !== Object.prototype.toString.call(t)) return void console.error(
					"wx.aldVisit()传参不符合规则，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！");
				var {
					category: category,
					id: id,
					name: name
				} = t;
				if (!category || 0 !== id && !id || !name) return void console.error(
					"category、id、name为必传字段且数据类型必须符合规则,请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！"
					);
				if (function(t, e, n) {
						return "string" !== r(t) || t.length > 32 ? (console.error(
							"category字段(商品类别)只支持String类型，且长度小于32个字符，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！"
							), !1) : "number" !== r(e) && "string" !== r(e) ? (console.error(
							"id字段(商品唯一id)只支持Number类型和String类型，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！"
							), !1) : !("string" !== r(n) || n.length > 32) || (console.error(
							"name字段(商品名称)只支持String类型，且长度小于32个字符，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！"
							), !1)
					}(category, id, name)) {
					D("visit", null, {
						category: t.category,
						id: t.id,
						name: t.name
					})
				}
			},
			aldPayOrder: function(t) {
				if ("[object Object]" !== Object.prototype.toString.call(t)) return void console.error(
					"wx.aldPayOrder()传参不符合规则，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！");
				var {
					price: price,
					details: details
				} = t;
				if (0 !== price && !price || !details) return void console.error(
					"price、details为必传字段且数据类型必须符合规则,请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！"
					);
				if (function(t, e) {
						return 1 == t && 1 != t ? (console.error(
							"price字段(付费金额)只支持Number类型和数字字符串，且不能小于0，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！"
							), !1) : (t = Number(t), "number" !== r(t) || t < 0 || isNaN(t) ? (console
							.error(
								"price字段(付费金额)只支持Number类型和数字字符串，且不能小于0，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！"
								), !1) : !("[object Array]" !== Object.prototype.toString.call(e) ||
							e.length < 1) || (console.error(
							"details字段(订单详细信息)为Array类型，且长度不能小于1，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！"
							), !1))
					}(price, details)) {
					for (var e = 0; e < details.length; e++)
						if (! function(t) {
								var {
									amount: amount,
									category: category,
									id: id,
									name: name
								} = t;
								return 0 == amount ? (console.error(
										"details参数下amount字段值(商品数量)只支持Number类型和数字字符串，且不能小于或等于0，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！"
										), !1) : amount && category && (0 === id || id) && name ? 1 ==
									amount && 1 != amount ? (console.error(
										"details参数下amount字段值(商品数量)只支持Number类型和数字字符串，且不能小于或等于0，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！"
										), !1) : (amount = Number(amount), "number" !== r(amount) ||
										amount <= 0 || isNaN(amount) ? (console.error(
											"details参数下amount字段值(商品数量)只支持Number类型和数字字符串，且不能小于或等于0，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！"
											), !1) : "number" !== r(id) && "string" !== r(id) ? (console
											.error(
												"id字段(商品唯一id)只支持Number类型和String类型，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！"
												), !1) : "string" !== r(category) || category.length > 32 ?
										(console.error(
											"details参数下category字段值(商品类别)只支持String类型，且长度小于32个字符，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！"
											), !1) : !("string" !== r(name) || name.length > 32) || (console
											.error(
												"details参数下name字段值(商品类别)只支持String类型，且长度小于32个字符，请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！"
												), !1)) : (console.error(
										"amount、category、id、name为必传字段且数据类型必须符合规则,请参考接入文档 http://doc.aldwx.com 小程序统计平台-快速接入指南-智慧零售分析！"
										), !1)
							}(details[e])) return;
					D("pay", null, {
						price: t.price,
						details: t.details
					})
				}
			}
		}, Ot = 0; Ot < wt.length; Ot++) ! function(t, e) {
		Object.defineProperty(wx, t, {
			value: e,
			writable: !1,
			enumerable: !0,
			configurable: !0
		})
	}(wt[Ot], bt[wt[Ot]]);
	return L.plugin ? {
		App: P,
		Page: N,
		MpvueApp: M,
		MpvuePage: k
	} : function(t) {
		! function() {
			var t = App,
				e = Page,
				n = Component;
			App = function(e) {
				q(e, "onLaunch", a), q(e, "onShow", i), q(e, "onHide", c), q(e, "onError", s), t(e)
			}, Page = function(t) {
				var n = t.onShareAppMessage;
				q(t, "onLoad", u), q(t, "onUnload", h), q(t, "onShow", l), q(t, "onHide", d), q(t,
					"onReachBottom", p), q(t, "onPullDownRefresh", f), void 0 !== n && null !== n && (t
					.onShareAppMessage = function(t) {
						if (void 0 !== n) {
							var e = n.call(this, t);
							return void 0 === e ? (e = {}, e.path = it) : void 0 === e.path && (e.path =
								it), g(e)
						}
					}), e(t)
			}, Component = function(t) {
				try {
					var e = t.methods.onShareAppMessage;
					q(t.methods, "onLoad", u), q(t.methods, "onUnload", h), q(t.methods, "onShow", l), q(t
						.methods, "onHide", d), q(t.methods, "onReachBottom", p), q(t.methods,
						"onPullDownRefresh", f), void 0 !== e && null !== e && (t.methods
						.onShareAppMessage = function(t) {
							if (void 0 !== e) {
								var n = e.call(this, t);
								return void 0 === n ? (n = {}, n.path = it) : void 0 === n.path && (n
									.path = it), g(n)
							}
						}), n(t)
				} catch (e) {
					n(t)
				}
			}
		}()
	}()
});
// #endif