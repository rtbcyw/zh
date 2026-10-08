/* ============================================================
   data.js —— 全站内容配置中心
   后期改文案 / 换图片 / 加题库 / 加MVP / 换音乐 / 填云密钥，
   都只需要改这个文件，不用碰页面代码。
   ============================================================ */

const SITE = {

	/* ---------- 基础信息 ---------- */
	siteName: "紫幻生日纪念",
	bgm: {
		// 把音频文件放进 assets/audio/ 后，在这里写文件名即可启用；留空则不显示音乐按钮
		src: "",
		label: "BGM"
	},

	/* ---------- 开场运镜参数（想调手感改这里，单位：毫秒/度） ---------- */
	camera: {
		startDelay: 300,        // 打开页面后多久开始运镜
		zoomDuration: 1600,     // 斜角全景 → 正面推近 的时长
		doorDelay: 1100,        // 转正后多久弹开②号门
		doorDuration: 1100,     // 开门动画时长
		focusDuration: 420,     // 点击物品后聚焦时长，然后弹层/跳转
		startRotateY: -32,      // 开场斜角角度（左右）
		startRotateX: 8         // 开场斜角角度（俯仰）
	},

	/* ---------- 顶部四个文字导航（英文占位，等你给最终文字） ---------- */
	nav: [
		{ id: "about",   en: "ABOUT",         zh: "关于紫幻", action: "modal", target: "idcard" },
		{ id: "honors",  en: "HONORS",        zh: "荣誉陈列", action: "modal", target: "folders-honor" },
		{ id: "quiz",    en: "QUIZ",          zh: "趣味问答", action: "link",  href: "quiz.html" },
		{ id: "wishes",  en: "WISHES",        zh: "祝福墙",   action: "modal", target: "corkboard" }
	],

	/* ---------- 个人档案（证件卡/档案用） ---------- */
	profile: {
		id: "紫幻",
		name: "黄广顺",
		role: "中单",
		team: "重庆狼队",
		hometown: "四川省 宜宾市",
		fansName: "召幻兽",
		gameAccount: "紫薇星幻之瞳",
		debut: "2022.02.11",
		birthday: "2003.11.16（阴历）",
		birthdayTarget: "2026-11-16",   // 倒计时公历目标日
		avatar: "",                     // 头像：放图到 assets/images/ 后写文件名
		hobby: "睡觉（本人认证）、看小说",
		food: "燃面、小炒肉",
		fruit: "橘子",
		color: "黄色",
		hero: "诸葛亮",
		skin: "小乔·线条小狗",
		dislike: "抹茶、海鲜"
	},

	/* ---------- 背包弹层：书包里的"100件小事"故事卡（点击翻下一张） ---------- */
	/* 编号从 01 连续往后排，后续加新故事往数组里追加即可 */
	bagCards: [
		{
			title: "01 · 诸葛亮，还是诸葛亮",
			text: "问：全王者荣耀最喜欢的英雄是谁？\"嗯，诸葛亮吧。\"问：拿的第一个国服是哪个英雄？\"是诸葛亮……还是诸葛亮忘记了。\"问：最喜欢他的哪个皮肤？\"黄金分割率。\"——翻来覆去全是诸葛亮，爱得非常专一。"
		},
		{
			title: "02 · 数羊入睡理论",
			text: "\"用一个动物代表自己，你会选什么？\"\"羊吧，因为一只羊两只羊很爱睡觉。\"数羊助眠实锤，关键他本人也刚好属羊——人羊合一，睡觉这块被安排得明明白白。"
		},
		{
			title: "03 · 中单皮肤风向标",
			text: "目前最爱中单皮肤TOP3：冠军小乔·线条小狗，亚军西施·织梦人，季军大乔·时之奇旅。第一名断层领先——毕竟是小狗，谁能拒绝小狗呢。"
		},
		{
			title: "04 · 国服收割机",
			text: "一个月打过7个国服，目前国服第一中路，24国服拥有者，10个英雄战力两万以上。别人收集皮肤，他收集国服——列表拉出来比购物车还长。"
		},
		{
			title: "05 · 防盗防八字",
			text: "阴历生日2003.11.16，阳历生日2003.12.09，是射手男不是天蝎男。狼妹来确认生日过阳历还是农历，结果等来🍊的灵魂反问：\"你不会偷我生辰八字吧？\"——人家只是想给你过生日啊，警惕心拉满。"
		},
		{
			title: "06 · 嘴硬心软猫奴实录",
			text: "基地的猫叫年年。他一开始嘴硬：\"不是我喜欢的那种类型，我喜欢布偶那种精致的。\"结果年年天天跑来他这边休息，打翻他桌上的水也不生气，还说年年是想帮忙\"洗桌子\"，还叫别人别吵到年年睡觉。——猫咪果然只爱不黏自己的人。"
		},
		{
			title: "07 · 主教练盖章认证",
			text: "前主教练风君认证：性格好、纯粹、专注职业。\"和紫幻有矛盾吗？\"\"没矛盾，紫幻跟任何人都没矛盾。\"还有一句名言：打比赛的，不是来交朋友的。"
		},
		{
			title: "08 · 90斤干饭王",
			text: "非常瘦，吃不胖体质（可能是胃不太好），体重常年90斤，最胖也才100斤。直播间反手劝弹幕老师要好好吃饭、细嚼慢咽。有人说\"看你们吃我减肥就放心了\"，他回：\"我90斤你放心啥啊？\"——自己吃不胖还爱管别人干饭。"
		},
		{
			title: "09 · 小心超人十级学者",
			text: "觉得小心超人很帅，原话：\"小心超人老帅了我去！\"某天直播等进游戏的时候，和粉丝俩人聊《熊出没》聊得不知天地为何物，连里面的猫头鹰叫啥都要研究明白。——赛场上是大魔王，直播间是动画片课堂。"
		},
		{
			title: "10 · 赛场神秘ID大赏",
			text: "水友赛上的ID有点好玩：九、杨天y1次大王、孟佼之冶、StevenDanielle……问就是之前买的QQ号，懒得换ID。于是电竞选手的赛博马甲，就这么光明正大挂上了大屏幕。"
		},
		{
			title: "11 · 一只承担了所有的小橘子",
			text: "那天片场，🍊主动背起了💌。💌双脚离地，却一脸无辜地摊手：\"我根本没感觉啊。\"——没感觉的只有你呀，背上那只🍊嘴紧紧闭着，脸憋得通红，一个人默默扛下了全部的重量。到了拍摄环节，🍊依旧不忘他的招牌✌️，今天比得格外萌：眼睛弯弯，两根手指一举，活脱脱一只萌萌小正太。——片场复评：建议这只橘子以后多背几次💌，毕竟脸红的样子、比V的样子，都很萌。"
		}
	],

	/* ---------- 荣誉：奖杯 → 文件夹扇 → 三个内容页 ---------- */
	honorFolders: [
		{ key: "champions", title: "我的冠军",     en: "CHAMPIONS", href: "champions.html", color: "var(--accent-a)", ink: "#23300e" },
		{ key: "mvp",       title: "我的MVP",      en: "MVP",        href: "mvp.html",       color: "var(--accent-b)", ink: "#ffffff" },
		{ key: "badges",    title: "我的国标英雄", en: "NATIONAL",   href: "badges.html",    color: "var(--accent-d)", ink: "#2b3440" }
	],

	/* ---------- 我的冠军：两段夺冠视频（封面你提供，视频放 assets/video/） ---------- */
	championVideos: [
		{
			file: "champion-2023-summer.mp4",   // 视频放 assets/video/ 下
			cover: "",  // 封面图放 assets/images/ 下（留空则显示占位）
			title: "2023 KPL夏季赛 夺冠时刻",
			note: "2023年KPL王者荣耀职业联赛夏季赛 总冠军 · 最佳阵容一阵中路"
		},
		{
			file: "champion-2026-challenger-v2.mp4",
			cover: "",
			title: "2026 挑战者杯 捧杯瞬间",
			note: "2026年王者荣耀挑战者杯 冠军"
		}
	],

	/* ---------- 直播唱的歌：音频放 assets/audio/ 下，歌名可自行改 ---------- */
	songs: [
		{ file: "song-01.mp3", title: "直播演唱 01" },
		{ file: "song-02.mp3", title: "直播演唱 02" },
		{ file: "song-03.mp3", title: "直播演唱 03" },
		{ file: "song-04.mp3", title: "直播演唱 04" },
		{ file: "song-05.mp3", title: "直播演唱 05" }
	],

	/* ---------- MVP 图片墙：把截图放 assets/images/mvp/ 下，在这里加文件名即可 ----------
	   后续加图：把新图片重命名为 mvp-69.jpg、mvp-70.jpg… 放进 mvp/ 目录，
	   然后把下面的 68 改成新的总数即可（或手动往数组里加文件名）。
	*/
	mvp: Array.from({ length: 68 }, (_, i) => `mvp-${String(i + 1).padStart(2, "0")}.jpg`),

	/* ---------- 24个国服最强：徽章墙 ---------- */
	national: {
		milestone: "国服最强中路 · 143段",
		// favorite 为本命英雄，会有特殊边框
		heroes: [
			{ name: "国服最强不知火舞", favorite: false }, { name: "国服最强上官婉儿", favorite: false },
			{ name: "国服最强西施",     favorite: false }, { name: "国服最强貂蝉",     favorite: false },
			{ name: "国服最强沈梦溪",   favorite: false }, { name: "国服最强诸葛亮",   favorite: true  },
			{ name: "国服最强嫦娥",     favorite: false }, { name: "国服最强弈星",     favorite: false },
			{ name: "国服最强王昭君",   favorite: false }, { name: "国服最强周瑜",     favorite: false },
			{ name: "国服最强墨子",     favorite: false }, { name: "国服最强姜子牙",   favorite: false },
			{ name: "国服最强妲己",     favorite: false }, { name: "国服最强小乔",     favorite: false },
			{ name: "国服最强干将莫邪", favorite: false }, { name: "国服最强金蝉",     favorite: false },
			{ name: "国服最强嬴政",     favorite: false }, { name: "国服最强女娲",     favorite: false },
			{ name: "国服最强安琪拉",   favorite: false }, { name: "国服最强海月",     favorite: false },
			{ name: "国服最强甄姬",     favorite: false }, { name: "国服最强杨玉环",   favorite: false },
			{ name: "国服最强大乔",     favorite: false }, { name: "国服最强中路",     favorite: false }
		]
	},

	/* ---------- 趣味问答：题库（你给Word后我替换/扩充）
	   answer 正确答案；distractors 干扰项池（同类但错误，系统随机抽3个）
	*/
	quiz: {
		perRound: 5,            // 每局随机抽几道题
		passRate: 0.6,          // 答对 60% 以上解锁彩蛋
		titles: ["再背背书吧", "见习召幻兽", "认证召幻兽", "资深召幻兽", "满级召幻兽"], // 按正确率给称号
		// 答对达标后随机抽取一个彩蛋（文案可改）
		eggs: [
			{ type: "rain",     emoji: "🍊", title: "橘子雨！",     text: "你是最懂紫幻的召幻兽，奖励你一大筐橘子！" },
			{ type: "rain",     emoji: "⭐", title: "星光雨",       text: "像紫幻的诸葛亮一样，在赛场上闪闪发光 ✨" },
			{ type: "cake",     emoji: "🎂", title: "生日蛋糕",     text: "提前给紫幻的生日蛋糕，由你亲手送上~" },
			{ type: "secret",   emoji: "🎮", title: "紫幻的小秘密", text: "他说：谢谢你们一直陪着我，我会继续加油的！" },
			{ type: "confetti", emoji: "🎉", title: "撒花庆祝",     text: "认证召幻兽达成！继续喜欢紫幻吧 🎊" }
		],
		questions: [
			{ q: "紫幻喜欢吃什么水果？", answer: "橘子", distractors: ["苹果", "香蕉", "葡萄", "草莓"] },
			{ q: "紫幻不喜欢吃什么？", answer: "抹茶和海鲜", distractors: ["巧克力和蛋糕", "牛肉和羊肉", "草莓和芒果"] },
			{ q: "紫幻的代表 emoji 是什么？", answer: "🍊", distractors: ["🐱", "⭐️", "🎮"] },
			{ q: "紫幻最喜欢的英雄是什么？", answer: "诸葛亮", distractors: ["貂蝉", "不知火舞", "王昭君"] },
			{ q: "紫幻玩小乔最常用的皮肤是什么？", answer: "线条小狗", distractors: ["万圣前夜", "纯白花嫁", "音你心动"] },
			{ q: "紫幻的生日是农历 11.16 还是阳历 11.16？", answer: "农历", distractors: ["阳历", "都是", "都不是"] },
			{ q: "紫幻的爱好是什么？", answer: "睡觉和看小说", distractors: ["打篮球和跑步", "画画和弹琴", "唱歌和跳舞"] },
			{ q: "紫幻在 26 年夏季赛 MVP 视频道具是什么？", answer: "扇子", distractors: ["花束", "奖杯", "麦克风"] },
			{ q: "紫幻是哪年登场的？", answer: "2022", distractors: ["2021", "2023", "2020"] },
			{ q: "哪个不是紫幻去打过决赛的城市？", answer: "长沙", distractors: ["南京", "北京", "厦门", "海口", "上海"] }
		]
	},

	/* ---------- 生日互动 ---------- */
	birthday: {
		candleCount: 1,
		afterTargetYear: true   // 目标日过后自动顺延到下一年11.16
	},

	/* 注：直播唱的歌 songs 配置在本文件上方（音频播放器用 {file,title} 结构） */

	/* ---------- 地图：打过比赛的城市（清单你提供） ----------
	   { city:"上海", venue:"场馆名", event:"赛事名", date:"日期", note:"一句话", photo:"" }
	*/
	/* ---------- 决赛地图：5座决赛城市 · 5次决赛（坐标用于手绘地图定位，可微调） ----------
	   result: champion 夺冠 / runner 亚军。改文案、加照片直接改这里。
	   每座城市的 events 已按时间排好，时间轴会自动按 sortKey 排序。
	   2023 南京夏决：紫幻代表广州TTG中单夺冠（生涯首冠）；
	   2025 北京年总：转会重庆狼队后第一次站上鸟巢，亚军；
	   2026 海口春决 / 上海挑杯 / 厦门夏决：现役重庆狼队。
	*/
	finalsMap: {
		subtitle: "橘子出差记 · 飞过的决赛城市",
		cities: [
			{
				name: "北京", en: "BEIJING", lon: 116.40, lat: 39.90,
				labelDx: 0, labelDy: -58, anchor: "end",
				events: [
					{
						sortKey: "2025-11-08", date: "2025.11.08",
						title: "2025 KPL 年度总决赛",
						venue: "国家体育场 · 鸟巢",
						vs: "成都AG超玩会", score: "2:4", result: "runner",
						fans: 62196,
						note: "败者组一穿四站上鸟巢，62196 人现场——移动电竞第一次走进这座国家级殿堂，他在中路打到了第六局。"
					}
				]
			},
			{
				name: "南京", en: "NANJING", lon: 118.78, lat: 32.06,
				labelDx: -14, labelDy: 0, anchor: "end",
				events: [
					{
						sortKey: "2023-09", date: "2023.09",
						title: "2023 KPL 夏季赛总决赛",
						venue: "南京奥体中心体育馆",
						vs: "重庆狼队", score: "4:2", result: "champion",
						team: "广州TTG", fans: 8200,
						note: "出道第二年第一次站上联赛决赛舞台——金陵城记住了这个年轻中单，紫幻生涯首冠。"
					}
				]
			},
			{
				name: "上海", en: "SHANGHAI", lon: 121.47, lat: 31.23,
				labelDx: 14, labelDy: 6, anchor: "start",
				events: [
					{
						sortKey: "2026-05-23", date: "2026.05.23",
						title: "2026 王者荣耀挑战者杯决赛",
						venue: "上海久事体育场 · 旗忠网球中心",
						vs: "成都AG超玩会", score: "5:3", result: "champion",
						team: "重庆狼队", fans: 12800,
						note: "1:3 绝境连扳四局！虎神杯抱回重庆，队史第十一冠——KPL 十年，决赛回到起点的上海，他赢了。"
					}
				]
			},
			{
				name: "厦门", en: "XIAMEN", lon: 118.09, lat: 24.48,
				labelDx: 14, labelDy: 10, anchor: "start",
				events: [
					{
						sortKey: "2026-09-12", date: "2026.09.12",
						title: "2026 KPL 夏季赛总决赛",
						venue: "厦门奥体中心 · 凤凰体育馆",
						vs: "", score: "", result: "runner",
						team: "重庆狼队", fans: 8000,
						note: "凤凰馆里的夏天结束了，但中单的故事还在继续。"
					}
				]
			},
			{
				name: "海口", en: "HAIKOU", lon: 110.32, lat: 20.03,
				labelDx: 0, labelDy: 52, anchor: "middle",
				events: [
					{
						sortKey: "2026-04-11", date: "2026.04.11",
						title: "2026 KPL 春季赛总决赛",
						venue: "海口五源河文化体育中心体育馆",
						vs: "KSG", score: "0:4", result: "runner",
						team: "重庆狼队", fans: 3500,
						note: "赛前他笑着放话“区区手下败将”——放过的狠话，都是下一次见面的伏笔。"
					}
				]
			}
		]
	},

	/* ---------- 合照相册（照片放 assets/images/gallery/ 后登记） ---------- */
	gallery: [
		// { cat:"队友合照", src:"gallery/xxx.jpg", caption:"" }
	],

	/* ---------- 祝福墙：预置便利贴（可改可删）+ LeanCloud云密钥 ---------- */
	wishes: {
		maxLength: 50,
		defaultName: "一只召幻兽",
		preset: [
			{ name: "召幻兽001", text: "紫幻生日快乐，新的一岁也要闪闪发光！", color: "var(--accent-yellow)" },
			{ name: "召幻兽002", text: "比赛加油，永远相信你的诸葛亮！", color: "var(--accent-green)" },
			{ name: "召幻兽003", text: "多吃橘子多睡觉，生日一定要吃燃面哦~", color: "var(--accent-pink)" }
		],
		badWords: [],   // 敏感词过滤（需要时加词，写入即生效）
		minIntervalMs: 8000, // 最短提交间隔（防刷）
		// 注册 LeanCloud 免费账号后，把 AppID / AppKey 填进来，留言即全站共享；留空则仅保存在本机
		leancloud: { appId: "", appKey: "", serverUrl: "" }
	}
};
