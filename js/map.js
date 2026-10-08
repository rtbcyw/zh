/* ============================================================
   map.js —— 决赛地图交互（map.html 专用）
   手绘航线图：经纬度投影 / 航线 / 橘子飞行 / 城市卡 / 时间轴
   ============================================================ */
(function () {
	"use strict";
	const map = SITE.finalsMap;
	const cities = map.cities;

	/* ---------- 经纬度 → SVG 坐标（手绘投影） ---------- */
	const LON0 = 106, LON1 = 123.5, LAT0 = 42.5, LAT1 = 17.5, W = 1000, H = 760;
	const px = lon => (lon - LON0) / (LON1 - LON0) * W;
	const py = lat => (LAT0 - lat) / (LAT0 - LAT1) * H;

	/* ---------- 点阵网格 ---------- */
	const grid = document.getElementById("mapGrid");
	let gd = "";
	for (let x = 40; x < W; x += 56) gd += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="' + H + '"/>';
	for (let y = 40; y < H; y += 56) gd += '<line x1="0" y1="' + y + '" x2="' + W + '" y2="' + y + '"/>';
	grid.innerHTML = gd;

	/* ---------- 展平全部赛事，按时间排序 ---------- */
	const stops = [];
	cities.forEach(c => c.events.forEach(ev => stops.push(Object.assign({ city: c.name }, ev))));
	stops.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
	const cityByName = n => cities.find(c => c.name === n);
	const P = c => ({ x: px(c.lon), y: py(c.lat) });

	/* ---------- 统计条 ---------- */
	function hav(a, b) {
		const R = 6371, r = d => d * Math.PI / 180;
		const dLat = r(b.lat - a.lat), dLon = r(b.lon - a.lon);
		const h = Math.sin(dLat/2)**2 + Math.cos(r(a.lat))*Math.cos(r(b.lat))*Math.sin(dLon/2)**2;
		return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
	}
	let miles = 0;
	for (let i = 1; i < stops.length; i++) miles += hav(cityByName(stops[i-1].city), cityByName(stops[i].city));
	const champN = stops.filter(s => s.result === "champion").length;
	const round100 = v => Math.round(v / 100) * 100;
	document.getElementById("fmStats").innerHTML =
		'<span class="fm-chip"><span class="ic">📍</span><b>' + cities.length + '</b>座决赛城市</span>' +
		'<span class="fm-chip"><span class="ic">🎮</span><b>' + stops.length + '</b>次决赛之旅</span>' +
		'<span class="fm-chip"><span class="ic">🏆</span><b>' + champN + '</b>次捧杯时刻</span>' +
		'<span class="fm-chip"><span class="ic">✈️</span>橘子飞行约 <b>' + round100(miles).toLocaleString() + '</b> 公里（直线估算）</span>' +
		'<span class="fm-chip" id="fmLitChip"><span class="ic">✨</span>已点亮 <b id="fmLitCount">0</b>/' + cities.length + ' 座</span>';
	document.getElementById("fmSubtitle").textContent = map.subtitle;
	// 更新已点亮计数 chip
	function updateLitChip() {
		const el = document.getElementById("fmLitCount");
		if (el) el.textContent = getLit().length;
	}

	/* ---------- 航线（按时间顺序单向飞行） ---------- */
	const routeDefs = [
		{ a: "南京", b: "北京" },
		{ a: "北京", b: "海口" },
		{ a: "海口", b: "上海" },
		{ a: "上海", b: "厦门" }
	];
	const routeLayer = document.getElementById("routeLayer");
	routeDefs.forEach((r, i) => {
		const A = P(cityByName(r.a)), B = P(cityByName(r.b));
		// 平行抖动，避免往返航线完全重叠
		const j = r.both ? 10 : 0;
		const dx = B.x - A.x, dy = B.y - A.y, len = Math.hypot(dx, dy);
		const ox = -dy / len * j, oy = dx / len * j;
		const d = "M" + (A.x + ox) + "," + (A.y + oy) + " L" + (B.x + ox) + "," + (B.y + oy);
		routeLayer.insertAdjacentHTML("beforeend",
			'<path class="route" d="' + d + '" style="animation-delay:' + (i * 0.35) + 's"/>');
		// 方向小箭头
		const arrow = (t, flip) => {
			const mx = A.x + dx * t + ox, my = A.y + dy * t + oy;
			const ang = Math.atan2(dy, dx) * 180 / Math.PI + (flip ? 180 : 0);
			routeLayer.insertAdjacentHTML("beforeend",
				'<path class="route-dir" transform="translate(' + mx + ',' + my + ') rotate(' + ang + ')" d="M0,-5 L9,0 L0,5 Z"/>');
		};
		if (r.both) { arrow(.42, false); arrow(.58, true); }
		else arrow(.5, false);
	});

	/* ---------- 小飞机 rAF 飞行（替代 SMIL animateMotion，避免引发 scrollIntoView 滑动） ----------
	   点击城市后，飞机用 requestAnimationFrame 插值飞到该城市上方。
	   JS 控制的属性变化不会触发浏览器对动态位置元素的隐式滚动。 */
	const flyOrange = document.getElementById("flyOrange");
	let planeX = 0, planeY = 0, planeAnim = null;
	function flyPlaneTo(targetX, targetY) {
		if (planeAnim) cancelAnimationFrame(planeAnim);
		const startX = planeX, startY = planeY;
		const startTime = performance.now();
		const dur = 1200;
		const step = now => {
			const t = Math.min(1, (now - startTime) / dur);
			const e = t < .5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2;
			planeX = startX + (targetX - startX) * e;
			planeY = startY + (targetY - startY) * e;
			flyOrange.setAttribute("x", planeX);
			flyOrange.setAttribute("y", planeY);
			const ang = Math.atan2(targetY - startY, targetX - startX) * 180 / Math.PI;
			flyOrange.setAttribute("transform", "rotate(" + ang.toFixed(1) + " " + planeX.toFixed(1) + " " + planeY.toFixed(1) + ")");
			if (t < 1) planeAnim = requestAnimationFrame(step);
		};
		planeAnim = requestAnimationFrame(step);
	}
	// 初始位置：第一站（南京）上方
	const firstP = P(cityByName(stops[0].city));
	planeX = firstP.x;
	planeY = firstP.y - 28;
	flyOrange.setAttribute("x", planeX);
	flyOrange.setAttribute("y", planeY);

	/* ---------- 点亮功能：用户标记"我曾在这里"看决赛（localStorage 持久化） ---------- */
	const LIT_KEY = "zihuan_lit_cities";
	function getLit() { try { return JSON.parse(localStorage.getItem(LIT_KEY) || "[]"); } catch(e) { return []; } }
	function isLit(name) { return getLit().indexOf(name) >= 0; }
	function toggleLit(name) {
		let arr = getLit();
		const i = arr.indexOf(name);
		if (i >= 0) arr.splice(i, 1); else arr.push(name);
		try { localStorage.setItem(LIT_KEY, JSON.stringify(arr)); } catch(e) {}
		updateMarkerLit(name);
		updateLitChip();
	}
	function updateMarkerLit(name) {
		const m = document.querySelector('.city-marker[data-city="' + name + '"]');
		if (m) m.classList.toggle("lit", isLit(name));
	}

	/* ---------- 城市图钉 ---------- */
	const markerLayer = document.getElementById("markerLayer");
	cities.forEach(c => {
		const p = P(c);
		const isChamp = c.events.some(e => e.result === "champion");
		const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
		g.setAttribute("class", "city-marker" + (isChamp ? " champion" : "") + (isLit(c.name) ? " lit" : ""));
		g.setAttribute("data-city", c.name);
		const lx = p.x + (c.labelDx || 0), ly = p.y + (c.labelDy || 0);
		const anchor = c.anchor || "middle";
		let badge = "";
		if (c.events.length > 1) {
			badge = '<circle class="times-badge-bg" cx="' + (p.x + 14) + '" cy="' + (p.y - 15) + '" r="9"/>' +
				'<text class="times-badge" x="' + (p.x + 14) + '" y="' + (p.y - 11) + '" text-anchor="middle">×' + c.events.length + '</text>';
		}
		g.innerHTML =
			'<circle class="pin-pulse" cx="' + p.x + '" cy="' + p.y + '" r="17"/>' +
			'<circle class="pin-halo" cx="' + p.x + '" cy="' + (p.y + 2) + '" r="23"/>' +
			'<text class="pin-orange" x="' + p.x + '" y="' + (p.y + 11) + '">🍊</text>' +
			'<text class="city-label" x="' + lx + '" y="' + ly + '" text-anchor="' + anchor + '">' + c.name + '</text>' +
			'<text class="city-en" x="' + lx + '" y="' + (ly + 13) + '" text-anchor="' + anchor + '">' + c.en + '</text>' +
			badge +
			'<circle cx="' + p.x + '" cy="' + (p.y + 4) + '" r="34" fill="transparent"/>';
		g.addEventListener("click", e => { e.preventDefault(); selectCity(c.name); });
		markerLayer.appendChild(g);
	});

	/* ---------- 时间轴 ---------- */
	const track = document.getElementById("fmTrack");
	track.innerHTML = stops.map((s, i) =>
		'<div class="t-stop ' + s.result + '" data-city="' + s.city + '" data-idx="' + i + '">' +
			'<span class="t-dot">' + (s.result === "champion" ? "🏆" : "") + '</span>' +
			'<span class="t-date">' + s.date + '</span>' +
			'<div class="t-city">' + s.city + '</div>' +
			'<div class="t-name">' + s.title.replace(/^20\d\d\s*/, "") + '</div>' +
		'</div>').join("");
	track.querySelectorAll(".t-stop").forEach(el =>
		el.addEventListener("click", e => { e.preventDefault(); selectCity(el.dataset.city, +el.dataset.idx); }));

	/* ---------- 选中城市 / 详情卡 ---------- */
	const card = document.getElementById("fmCard");
	const tip = document.getElementById("fmTip");

	function renderEvent(ev, cityName) {
		const tag = ev.result === "champion"
			? '<span class="fm-tag champion">🏆 冠军</span>'
			: '<span class="fm-tag runner">🥈 亚军</span>';
		const teamTag = ev.team
			? '<span class="fm-tag team">👕 ' + ev.team + '</span>'
			: '';
		const meta = [
			"📍 " + ev.venue,
			ev.vs ? "🆚 " + ev.vs + (ev.score ? "　" + ev.score : "") : ""
		].filter(Boolean).join("<br>");
		/* 现场召幻兽数：基础估算 + 当前用户点亮则 +1（含你），实时随点亮状态变化 */
		let fansLine = '';
		if (ev.fans) {
			const lit = isLit(cityName);
			const total = ev.fans + (lit ? 1 : 0);
			const youPart = lit ? ' <span style="color:var(--accent-e)">（含你 ✨）</span>' : '';
			fansLine = '<div class="fm-event-fans">📣 当天现场约 <b>' + total.toLocaleString() + '</b> 名召幻兽与紫幻一起呐喊' + youPart + '</div>';
		}
		return '<div class="fm-event ' + ev.result + '">' +
				'<div class="fm-event-date">' + ev.date + '</div>' +
				'<div class="fm-event-title">' + ev.title + '</div>' +
				'<div class="fm-event-meta">' + meta + '</div>' +
				'<div class="fm-event-tags">' + tag + teamTag + '</div>' +
				fansLine +
				'<div class="fm-event-note">' + ev.note + '</div>' +
			'</div>';
	}

	function selectCity(name, idx) {
		const c = cityByName(name);
		const p = P(c);
		flyPlaneTo(p.x, p.y - 28);   // 飞机飞到该城市上方
		const page = document.querySelector(".fm-page");
		const savedScroll = page ? page.scrollTop : 0;
		/* 展开详情卡期间临时锁死 .fm-page 滚动，杜绝浏览器隐式 scrollIntoView 把详情卡滚进视口 */
		if (page) page.style.overflowY = "hidden";
		document.querySelectorAll(".city-marker").forEach(m =>
			m.classList.toggle("active", m.dataset.city === name));
		document.querySelectorAll(".t-stop").forEach(t =>
			t.classList.toggle("active", t.dataset.city === name &&
				(idx === undefined || +t.dataset.idx === idx)));
		const lit = isLit(name);
		card.innerHTML =
			'<button class="fm-card-close" type="button" aria-label="关闭">×</button>' +
			'<div class="fm-city-head">' +
				'<span class="fm-city-name">' + c.name + '</span>' +
				'<span class="fm-city-en">' + c.en + '</span>' +
			'</div>' +
			'<div class="fm-city-count">🍊 在这里打过 ' + c.events.length + ' 场决赛</div>' +
			c.events.map(ev => renderEvent(ev, name)).join("") +
			'<button class="fm-lit-btn ' + (lit ? "lit" : "") + '" type="button">✨ ' + (lit ? "已点亮 · 我曾在这里" : "点亮 · 我曾在这里") + '</button>';
		card.querySelector(".fm-card-close").addEventListener("click", closeCard);
		card.querySelector(".fm-lit-btn").addEventListener("click", () => {
			toggleLit(name);
			selectCity(name, idx);  // 重新渲染按钮状态
		});
		card.classList.add("show");
		tip.style.opacity = 0;
		/* 双 rAF 等 layout 稳定后恢复滚动能力 + 锁回原位置 */
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				if (page) {
					page.scrollTop = savedScroll;
					page.style.overflowY = "";
				}
			});
		});
	}

	function closeCard() {
		card.classList.remove("show");
		document.querySelectorAll(".city-marker,.t-stop").forEach(m => m.classList.remove("active"));
		setTimeout(() => { tip.style.opacity = 1; }, 200);
	}
	document.addEventListener("keydown", e => { if (e.key === "Escape") closeCard(); });

	/* 初始化已点亮计数显示 */
	updateLitChip();

	/* 不自动打开 —— 让用户主动点橘子或时间轴，地图保持稳定不跳动 */
})();
