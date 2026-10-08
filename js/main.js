/* ============================================================
   main.js —— 储物柜场景交互（首页 index.html 专用）
   分工：开场运镜 / 热区聚焦 / 弹层渲染 / 软木板留言 / BGM
   动效手感参数全部在 data.js 的 SITE.camera 里调。
   ============================================================ */

(function () {
	"use strict";

	/* ---------- 把运镜参数注入 CSS 变量 ---------- */
	const cam = SITE.camera;
	const locker = document.getElementById("locker");
	if (locker) {
		document.documentElement.style.setProperty("--zoom-duration", cam.zoomDuration + "ms");
		document.documentElement.style.setProperty("--door-duration", cam.doorDuration + "ms");
		document.documentElement.style.setProperty("--start-y", cam.startRotateY + "deg");
		document.documentElement.style.setProperty("--start-x", cam.startRotateX + "deg");

		/* ---------- 开场：斜角全景 → 推近转正 → ②号门弹开 ---------- */
		setTimeout(() => locker.classList.add("in"), cam.startDelay);
		setTimeout(() => document.getElementById("bay2").classList.add("open"),
			cam.startDelay + cam.doorDelay);
	}

	/* ---------- 顶部导航 ---------- */
	const navEl = document.getElementById("topnav");
	if (navEl) {
		SITE.nav.forEach(n => {
			const a = document.createElement("a");
			a.href = n.action === "link" ? n.href : "javascript:void(0)";
			a.textContent = n.en;
			a.title = n.zh;
			if (n.action === "modal") a.addEventListener("click", () => openModal(n.target));
			navEl.appendChild(a);
		});
	}

	/* ---------- 热区：悬停由CSS处理；点击先聚焦，再弹层/跳转 ---------- */
	document.querySelectorAll(".hotspot").forEach(el => {
		el.addEventListener("click", () => {
			if (el.dataset.dragged === "1") { el.dataset.dragged = "0"; return; }
			el.classList.add("focused");
			const go = () => {
				el.classList.remove("focused");
				if (el.dataset.action === "link") {
					window.location.href = el.dataset.href;
				} else if (el.dataset.action === "lightbox") {
					openLightbox(el.dataset.img);
				} else {
					openModal(el.dataset.target);
				}
			};
			setTimeout(go, cam.focusDuration);
		});
	});

	/* ---------- 按 H 开关热区调试框（换正式素材后标定用） ---------- */
	document.addEventListener("keydown", e => {
		if (e.key.toLowerCase() === "h") document.body.classList.toggle("debug");
		if (e.key === "Escape") closeModal();
	});

	/* ============================================================
	   弹层系统
	   ============================================================ */
	const root = document.getElementById("modalRoot");

	function closeModal() {
		if (!root) return;
		root.hidden = true;
		root.innerHTML = "";
	}

	function openModal(target) {
		if (!root) return;
		root.innerHTML = "";
		const box = document.createElement("div");
		box.className = "modal-pop";
		const close = document.createElement("button");
		close.className = "modal-close";
		close.textContent = "×";
		close.addEventListener("click", closeModal);
		root.appendChild(close);

		if (target === "idcard") box.appendChild(renderIdCard());
		if (target === "folders-honor") box.appendChild(renderHonorFolders());
		if (target === "bag") box.appendChild(renderBag());
		if (target === "corkboard") box.appendChild(renderCorkboard());

		root.appendChild(box);
		root.hidden = false;
		// 点击空白处关闭
		root.onclick = e => { if (e.target === root) closeModal(); };
	}

	/* ---------- 照片大图查看（lightbox） ---------- */
	function openLightbox(src) {
		if (!root) return;
		root.innerHTML = "";
		const close = document.createElement("button");
		close.className = "modal-close";
		close.textContent = "×";
		close.addEventListener("click", closeModal);
		root.appendChild(close);

		const box = document.createElement("div");
		box.className = "lightbox-box modal-pop";
		const img = document.createElement("img");
		img.src = src;
		img.alt = "合照大图";
		box.appendChild(img);
		root.appendChild(box);
		root.hidden = false;
		root.onclick = e => { if (e.target === root) closeModal(); };
	}

	/* ---------- 证件卡 ---------- */
	function renderIdCard() {
		const p = SITE.profile;
		const card = document.createElement("div");
		card.className = "id-card";
		const rows = [
			["本名", p.name], ["ID", p.id],
			["位置", p.role], ["战队", p.team],
			["家乡", p.hometown], ["粉丝名", p.fansName],
			["游戏账号", p.gameAccount], ["生日", "2003.11.16"],
			["爱好", p.hobby], ["本命英雄", p.hero],
			["最爱", p.food + "、" + p.fruit], ["雷点", p.dislike]
		];
		card.innerHTML =
			`<h2>BASIC INFORMATION<small>个人简介</small></h2>
			<div class="id-head">
				<div class="id-avatar" style="background-image:url('assets/images/avatar.jpg')"></div>
				<div class="id-list">
					${rows.map(r => `<div><b>${r[0]}</b>${r[1]}</div>`).join("")}
				</div>
			</div>
			<div class="id-barcode"></div>`;
		return card;
	}

	/* ---------- 荣誉文件夹扇 ---------- */
	function renderHonorFolders() {
		const fan = document.createElement("div");
		fan.className = "fan";
		SITE.honorFolders.forEach(f => {
			const a = document.createElement("a");
			a.className = "folder";
			a.href = f.href;
			a.style.background = f.color;
			a.style.color = f.ink;
			a.innerHTML = `<span class="f-en">${f.en}</span><span class="f-zh">${f.title}</span>`;
			fan.appendChild(a);
		});
		return fan;
	}

	/* ---------- 书包："100件小事"故事卡，点击翻下一张 / 按钮来回翻看 ---------- */
	function renderBag() {
		const cards = SITE.bagCards;
		const colors = ["#fff", "#f4f9ef", "#fdf4ee", "#eef4fb", "#fbeef2", "#f3f0fb", "#eefaf6", "#fbf6ee"];
		const wrap = document.createElement("div");
		wrap.className = "bag-deck";

		const stage = document.createElement("div");
		stage.className = "bag-stage";

		// 翻页导航：‹ 上一张 / 页码 / 下一张 ›
		const nav = document.createElement("div");
		nav.className = "bag-nav";
		const prevBtn = document.createElement("button");
		prevBtn.type = "button"; prevBtn.className = "bag-btn";
		prevBtn.textContent = "‹ 上一张";
		const counter = document.createElement("div");
		counter.className = "bag-counter";
		const nextBtn = document.createElement("button");
		nextBtn.type = "button"; nextBtn.className = "bag-btn";
		nextBtn.textContent = "下一张 ›";
		nav.appendChild(prevBtn);
		nav.appendChild(counter);
		nav.appendChild(nextBtn);

		const hint = document.createElement("div");
		hint.className = "bag-hint";
		hint.textContent = "点击卡片或按钮翻页，可来回查看";

		let idx = 0;
		function show(i, dir) {
			idx = (i + cards.length) % cards.length;
			const c = cards[idx];
			stage.innerHTML =
				`<div class="bag-card" style="--c:${colors[idx % colors.length]}">
					<h3>${c.title}</h3>
					<p>${c.text}</p>
				</div>`;
			stage.querySelector(".bag-card").classList.add(dir >= 0 ? "flip-in" : "flip-in-prev");
			counter.textContent = `${idx + 1} / ${cards.length}`;
		}
		stage.addEventListener("click", () => show(idx + 1, 1));
		nextBtn.addEventListener("click", () => show(idx + 1, 1));
		prevBtn.addEventListener("click", () => show(idx - 1, -1));
		show(0, 1);

		wrap.appendChild(stage);
		wrap.appendChild(nav);
		wrap.appendChild(hint);
		return wrap;
	}

	/* ============================================================
	   软木板祝福墙（LeanCloud 密钥未填时自动降级本机保存）
	   ============================================================ */
	function renderCorkboard() {
		const cfg = SITE.wishes;
		const board = document.createElement("div");
		board.className = "board";

		// 预置便利贴（固定三个位置）
		cfg.preset.slice(0, 3).forEach((n, i) => {
			board.appendChild(makeNote(n, [12, 52, 70][i], [10, 44, 12][i], [-4, 3, -2][i]));
		});
		// 本机留言
		loadLocalWishes().forEach(n => board.appendChild(makeNote(n, n.x, n.y, n.rot, n.color)));

		// 打字机输入条
		const bar = document.createElement("div");
		bar.className = "typewriter-bar";
		bar.innerHTML =
			`<input class="tw-name" maxlength="10" placeholder="昵称">
			<input class="tw-text" maxlength="${cfg.maxLength}" placeholder="写一句给紫幻的祝福…">
			<button type="button">TYPE NOTE</button>`;
		const [nameInput, textInput, btn] = bar.querySelectorAll("input, button");

		let lastSubmit = 0;
		btn.addEventListener("click", () => submit());
		textInput.addEventListener("keydown", e => { if (e.key === "Enter") submit(); });

		function submit() {
			const now = Date.now();
			if (now - lastSubmit < cfg.minIntervalMs) { btn.textContent = "太快啦"; setTimeout(() => btn.textContent = "TYPE NOTE", 1200); return; }
			const text = textInput.value.trim();
			if (!text) return;
			if (cfg.badWords.some(w => w && text.includes(w))) { btn.textContent = "换个说法"; setTimeout(() => btn.textContent = "TYPE NOTE", 1200); return; }
			const note = {
				name: (nameInput.value.trim() || cfg.defaultName).slice(0, 10),
				text: text.slice(0, cfg.maxLength),
				color: ["var(--accent-yellow)", "var(--accent-green)", "var(--accent-pink)", "#f6efd8"][Math.floor(Math.random() * 4)],
				x: 6 + Math.random() * 66,
				y: 8 + Math.random() * 48,
				rot: -5 + Math.random() * 10
			};
			lastSubmit = now;
			board.appendChild(makeNote(note, note.x, note.y, note.rot, note.color));
			saveLocalWish(note);
			textInput.value = "";
			// TODO(第4步): 填了 LeanCloud 密钥后，在此同步到云端并拉取其他访客留言
		}
		board.appendChild(bar);

		/* ---------- 便利贴点击查看完整留言 ---------- */
		const detail = document.createElement("div");
		detail.className = "note-detail";
		detail.innerHTML =
			`<div class="note-detail-card">
				<button class="note-detail-close" type="button">×</button>
				<div class="note-detail-who"></div>
				<div class="note-detail-text"></div>
			 </div>`;
		detail.hidden = true;
		board.appendChild(detail);
		const detailCard = detail.querySelector(".note-detail-card");
		const detailWho = detail.querySelector(".note-detail-who");
		const detailText = detail.querySelector(".note-detail-text");
		detail.querySelector(".note-detail-close").addEventListener("click", e => { e.stopPropagation(); detail.hidden = true; });
		detail.addEventListener("click", e => { if (e.target === detail) detail.hidden = true; });

		board.addEventListener("click", e => {
			const note = e.target.closest(".note");
			if (!note || !note._note) return;
			const n = note._note;
			detailWho.textContent = "— " + n.name;
			detailText.textContent = n.text;
			detail.hidden = false;
			detailCard.classList.remove("flip-in");
			void detailCard.offsetWidth;
			detailCard.classList.add("flip-in");
		});

		return board;
	}

	function makeNote(n, x, y, rot, color) {
		const el = document.createElement("div");
		el.className = "note";
		el.style.left = x + "%";
		el.style.top = y + "%";
		el.style.transform = `rotate(${rot}deg)`;
		el.style.background = color || "var(--accent-yellow)";
		el.title = "点击查看完整留言";
		el._note = n;
		el.innerHTML = `<span class="pin"></span>${escapeHtml(n.text)}<span class="who">— ${escapeHtml(n.name)}</span>`;
		return el;
	}

	function loadLocalWishes() {
		try { return JSON.parse(localStorage.getItem("zihuan_wishes") || "[]"); }
		catch { return []; }
	}
	function saveLocalWish(n) {
		const list = loadLocalWishes();
		list.push(n);
		localStorage.setItem("zihuan_wishes", JSON.stringify(list.slice(-100)));
	}
	function escapeHtml(s) {
		return String(s).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
	}

	/* ---------- BGM（data.js 填了 src 才出现按钮） ---------- */
	const bgmBtn = document.getElementById("bgmBtn");
	if (bgmBtn && SITE.bgm.src) {
		bgmBtn.hidden = false;
		document.getElementById("bgmLabel").textContent = SITE.bgm.label;
		const audio = new Audio("assets/audio/" + SITE.bgm.src);
		audio.loop = true;
		let playing = false;
		bgmBtn.addEventListener("click", () => {
			if (playing) { audio.pause(); bgmBtn.classList.remove("playing"); }
			else { audio.play(); bgmBtn.classList.add("playing"); }
			playing = !playing;
		});
	}

	/* ---------- 照片 + DIY 贴纸：可在①④号柜门之间自由拖拽 ----------
	   拖动时元素临时挂到 body（position:fixed，不被柜门遮挡）；
	   松手时按指针落点判定归属柜门，再用相对柜门的百分比落位。 */
	const dragItems = document.querySelectorAll(".pw, .diy-sticker:not(.static-sticker)");
	let pending = null;  // 按下后、尚未确认是“点击还是拖动”
	let drag = null;     // 确认进入拖动后的状态

	function placeDrag() {
		drag.raf = 0;
		drag.el.style.transform =
			`translate3d(${drag.x - drag.offX}px, ${drag.y - drag.offY}px, 0) rotate(var(--rot, 0deg))`;
	}

	/* 按下时只记录，不移动 DOM、不 preventDefault —— 纯点击才能正常触发 click 打开大图 */
	dragItems.forEach(el => {
		el.addEventListener("pointerdown", e => {
			if (e.button !== undefined && e.button !== 0) return;
			const rect = el.getBoundingClientRect();
			pending = {
				el,
				offX: e.clientX - rect.left,
				offY: e.clientY - rect.top,
				x0: e.clientX, y0: e.clientY,
				x: e.clientX, y: e.clientY,
				w: rect.width, h: rect.height,
				active: false, raf: 0, pid: e.pointerId,
				origin: el.parentElement
			};
		});
	});

	// rAF 合帧：移动超过阈值才升级为“拖拽”，把元素挂到 body 跟随指针
	document.addEventListener("pointermove", e => {
		if (!pending || e.pointerId !== pending.pid) return;
		if (!pending.active) {
			if (Math.abs(e.clientX - pending.x0) <= 6 && Math.abs(e.clientY - pending.y0) <= 6) return;
			pending.active = true;
			drag = pending;
			const el = drag.el;
			el.style.width = drag.w + "px";
			el.style.height = drag.h + "px";
			el.classList.add("free-drag");
			document.body.appendChild(el);
			try { el.setPointerCapture(drag.pid); } catch (_) {}
		}
		drag.x = e.clientX; drag.y = e.clientY;
		if (!drag.raf) drag.raf = requestAnimationFrame(placeDrag);
	}, { passive: true });

	function finishDrag(p, x, y) {
		if (p.raf) { cancelAnimationFrame(p.raf); p.raf = 0; }
		const el = p.el;
		try { el.releasePointerCapture(p.pid); } catch (_) {}

		// 隐藏自身后探测指针下的柜门（只能落到①、④号门）
		el.classList.remove("free-drag");
		el.style.visibility = "hidden";
		const under = document.elementFromPoint(x, y);
		el.style.visibility = "";
		const bay = under && under.closest(".bay-1, .bay-4");
		const wall = bay && bay.querySelector(".photo-wall");
		const target = wall || p.origin;
		target.appendChild(el);

		// 用相对柜门的百分比落位，刷新/缩放后位置依然贴合
		const dr = target.getBoundingClientRect();
		const leftPct = (x - p.w / 2 - dr.left) / dr.width * 100;   // 元素中心对准指针
		const topPct  = (y - p.h / 2 - dr.top) / dr.height * 100;
		const maxL = 100 - p.w / dr.width * 100;
		const maxT = 100 - p.h / dr.height * 100;
		const clamp = (v, max) => Math.min(Math.max(v, 0), max);
		// 落位这一帧关掉过渡，松手即停，不“飘”
		el.classList.add("no-anim");
		el.style.left = clamp(leftPct, maxL).toFixed(1) + "%";
		el.style.top  = clamp(topPct, maxT).toFixed(1) + "%";
		el.style.right = "auto";
		el.style.bottom = "auto";
		el.style.width = "";
		el.style.height = "";
		el.style.transform = "";
		requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove("no-anim")));

		// 节点被移动过，拦截随后可能触发的 click（避免误开大图）
		el.dataset.dragged = "1";
		setTimeout(() => { if (el.dataset.dragged === "1") el.dataset.dragged = "0"; }, 80);
	}

	document.addEventListener("pointerup", e => {
		if (!pending || e.pointerId !== pending.pid) return;
		const p = pending; pending = null;
		if (!p.active) return;          // 位移不足：视为点击，不干预，click 正常打开大图
		drag = null;
		finishDrag(p, e.clientX, e.clientY);
	});
	document.addEventListener("pointercancel", e => {
		if (!pending || e.pointerId !== pending.pid) return;
		const p = pending; pending = null; drag = null;
		if (p.active) finishDrag(p, e.clientX, e.clientY);
	});
})();
