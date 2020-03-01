const ZERO = 0;
const ONE = 1;
const TWO = 2;
const TEN = 10;
const ENTER = 13;
const SPACE = 32;
const RANGE = 59;
const INTERVAL = 1000;
function transfer2Show (hour, minute, second) {
	let str = "";
	if (hour % TEN === hour)
		{str += "0" + hour;}
	else
		{str += hour;}
	str += ":";
	if (minute % TEN === minute)
		{str += "0" + minute;}
	else
		{str += minute;}
	str += ":";
	if (second % TEN === second)
		{str += "0" + second;}
	else
		{str += second;}
	return str;
}

function enter (event) {
	if (event.keyCode === ENTER) {
		StartBefore.Countup();
	}
}

function space1 (event) {
	if (event.keyCode === SPACE) {
		Counting.Pause();
	}
}

function space2 (event) {
	if (event.keyCode === SPACE) {
		Paused.Resume();
	}
}

const StartBefore = {
	inputHour: 0,
	inputMinute: 0,
	inputSecond: 0,
	domTree: document.getElementsByTagName('header').header.cloneNode(true), // 复制dom,但是要重新绑定事件
	state: 'StartBefore',
	getTime: function () {
		const INPUTTIME = document.getElementsByTagName('input');
		if (INPUTTIME[ZERO].value === "" || INPUTTIME[ONE].value === "" || INPUTTIME[TWO].value === "") {
			alert("Please input the complete information!");
			StartBefore.show();
			return false;
		}
		StartBefore.inputHour = parseInt(INPUTTIME[ZERO].value);
		StartBefore.inputMinute = parseInt(INPUTTIME[ONE].value);
		if (StartBefore.inputMinute > RANGE) {
			StartBefore.inputMinute = 59;
		}
		StartBefore.inputSecond = parseInt(INPUTTIME[TWO].value);
		if (StartBefore.inputSecond > RANGE) {
			StartBefore.inputSecond = 59;
		}
		return true;
	},
	Countup: function () {
		document.removeEventListener('keydown', enter);
		if (!StartBefore.getTime()) {
			return;
		}
		Counting.state = 'Up';
		Counting.inputHour = StartBefore.inputHour;
		Counting.inputMinute = StartBefore.inputMinute;
		Counting.inputSecond = StartBefore.inputSecond;

		Counting.residualHour = 0;
		Counting.residualMinute = 0;
		Counting.residualSecond = 0;
		Counting.residualMs = 0;
		Counting.Show();
	},
	Countdown: function () {
		document.removeEventListener('keydown', enter);
		StartBefore.getTime();
		if (!StartBefore.getTime()) {
			return;
		}
		Counting.state = 'Down';
		Counting.inputHour = StartBefore.inputHour;
		Counting.inputMinute = StartBefore.inputMinute;
		Counting.inputSecond = StartBefore.inputSecond;
		// 待修改
		Counting.residualHour = StartBefore.inputHour;
		Counting.residualMinute = StartBefore.inputMinute;
		Counting.residualSecond = StartBefore.inputSecond;
		Counting.residualMs = 0;
		Counting.Show();
	},
	bindfunc: function () {
		document.getElementById('countup').onclick = StartBefore.Countup;
		document.getElementById('countdown').onclick = StartBefore.Countdown;
		document.addEventListener('keydown', enter);
	},
	getDom: function () {
		const header = document.getElementsByTagName('header').header;
		StartBefore.domTree = header.cloneNode(true);
	},
	Show: function () {
		const header = document.getElementsByTagName('header').header;
		header.parentNode.replaceChild(StartBefore.domTree, header);
		StartBefore.bindfunc();
		const timer = document.getElementById('time');
		timer.innerText = "00:00:00";
	}
};

const Counting = {
	inputHour: 0,
	inputMinute: 0,
	inputSecond: 0,
	residualHour: 0,
	residualMinute: 0,
	residualSecond: 0,
	residualMs: 0,
	recordStart: 0,
	setCounter: null,
	domTree: document.getElementsByTagName('header').header.cloneNode(false),
	state: null,
	CreateDom: function () {
		const hint = document.createElement('div');
		hint.id = 'hint';
		hint.innerText = Counting.state === 'Up' ? "正在正计时 00:00:00" : "正在倒计时 00:00:00";
		Counting.domTree.appendChild(hint);
		const resume = document.createElement('button');
		resume.id = 'pause';
		resume.innerText = "暂停计时器";
		Counting.domTree.appendChild(resume);
		const clear = document.createElement('button');
		clear.id = 'clear';
		clear.innerText = Counting.state === 'Up' ? "清空正计时" : "清空倒计时";
		Counting.domTree.appendChild(clear);
		const restart = document.createElement('button');
		restart.id = 'restart';
		restart.innerText = "重新再计时";
		Counting.domTree.appendChild(restart);
	},
	Pause: function () {
		clearTimeout(Counting.setCounter);
		document.removeEventListener('keydown', space1);
		const start = new Date();
		const end = start.getTime();
		const interval = end - Counting.recordStart;
		if (Counting.state === "Up") {
			Counting.residualMs += interval;
		} else {
			Counting.residualMs -= interval;
		}
		Paused.inputHour = Counting.inputHour;
		Paused.inputMinute = Counting.inputMinute;
		Paused.inputSecond = Counting.inputSecond;
		Paused.residualHour = Counting.residualHour;
		Paused.residualMinute = Counting.residualMinute;
		Paused.residualSecond = Counting.residualSecond;
		Paused.residualMs = Counting.residualMs;
		Paused.Show();
	},
	ClearCounting: function () {
		document.removeEventListener('keydown', space1);
		clearTimeout(Counting.setCounter);
		StartBefore.inputHour = 0;
		StartBefore.inputMinute = 0;
		StartBefore.inputSecond = 0;
		StartBefore.Show();
	},
	RestartCounting: function () {
		document.removeEventListener('keydown', space1);
		clearTimeout(Counting.setCounter);
		if (Counting.state === "Down") {
			Counting.residualHour = Counting.inputHour;
			Counting.residualMinute = Counting.inputMinute;
			Counting.residualSecond = Counting.inputSecond;
			Counting.residualMs = 0;
		} else {
			Counting.residualHour = 0;
			Counting.residualMinute = 0;
			Counting.residualSecond = 0;
			Counting.residualMs = 0;
		}
		Counting.Show();
	},
	bindfunc: function () {
		document.getElementById('pause').onclick = Counting.Pause;
		document.getElementById('clear').onclick = Counting.ClearCounting;
		document.getElementById('restart').onclick = Counting.RestartCounting;
		document.addEventListener('keydown', space1);
	},
	checkEnd: function () {
		if (Counting.state === "Up") {
			if (Counting.residualSecond === Counting.inputSecond && Counting.residualMinute === Counting.inputMinute && Counting.residualHour === Counting.inputHour) {
				Counted.inputHour = Counting.inputHour;
				Counted.inputMinute = Counting.inputMinute;
				Counted.inputSecond = Counting.inputSecond;
				Counted.Show();
				return true;
			}
		} else {
			if (Counting.residualMs === ZERO && Counting.residualSecond === ZERO && Counting.residualMinute === ZERO && Counting.residualHour === ZERO) {
				Counted.inputHour = Counting.inputHour;
				Counted.inputMinute = Counting.inputMinute;
				Counted.inputSecond = Counting.inputSecond;
				Counted.Show();
				return true;
			}
		}
		return false;
	},
	Show: function () {
		let header = document.getElementsByTagName('header').header;
		header.parentNode.replaceChild(Counting.domTree, header);
		header = document.getElementsByTagName('header').header.childNodes;
		header[ZERO].innerText = Counting.state === "Up" ? "正在正计时 " + transfer2Show(Counting.inputHour, Counting.inputMinute, Counting.inputSecond) : "正在倒计时 " + transfer2Show(Counting.inputHour, Counting.inputMinute, Counting.inputSecond);
		header[TWO].innerText = Counting.state === "Up" ? "清空正计时" : "清空倒计时";
		Counting.bindfunc();
		const timer = document.getElementById('time');
		let interval = 1000;
		if (Counting.state === 'Up') {
			// 正计时
			timer.innerText = transfer2Show(Counting.residualHour, Counting.residualMinute, Counting.residualSecond);
			interval = interval - Counting.residualMs; // 间隔设置为ms
		}
		else
		{
			if (Counting.residualMs === ZERO)
			{
				if (Counting.residualSecond === ZERO)
				{
					if (Counting.residualMinute === ZERO)
					{
						Counting.residualHour -= 1;
						Counting.residualMinute = 59;
						Counting.residualSecond = 59;
						Counting.residualMs = 999;
						timer.innerText = transfer2Show(Counting.residualHour, RANGE, RANGE);
					}
					else
					{
						Counting.residualMinute -= 1;
						Counting.residualSecond = 59;
						Counting.residualMs = 999;
						timer.innerText = transfer2Show(Counting.residualHour, Counting.residualMinute, RANGE);
					}
				}
				else
				{
					Counting.residualSecond -= 1;
					Counting.residualMs = 999;
					timer.innerText = transfer2Show(Counting.residualHour, Counting.residualMinute, Counting.residualSecond);
				}
			}
			else
			{
				interval = Counting.residualMs + ONE;
				timer.innerText = transfer2Show(Counting.residualHour, Counting.residualMinute, Counting.residualSecond);
			}
		}
		// while(1)
		// {
		// 	let start = new Date();
		// 	Counting.recordStart = start.getTime();
		// 	setTimeout(countingInverse(Counting.state==="Up"?false:true,interval),interval);
		// }
		const start = new Date();
		Counting.recordStart = start.getTime();
		Counting.setCounter = setTimeout(function () {countingInverse(Counting.state === "Up" ? false : true);}, interval);
	}
};

function countingInverse (isInverse) {
	if (isInverse)
	{
		if (Counting.residualSecond === ZERO)
		{
			if (Counting.residualMinute === ZERO)
			{
				if (Counting.residualHour === ZERO)
				{
					Counting.residualMs = 0;
				}
				else
				{
					Counting.residualHour -= 1;
					Counting.residualMinute = 59;
					Counting.residualSecond = 59;
					Counting.residualMs = 999;
				}
			}
			else
			{
				Counting.residualMinute -= 1;
				Counting.residualSecond = 59;
				Counting.residualMs = 999;
			}
		}
		else
		{
			Counting.residualSecond -= 1;
			Counting.residualMs = 999;
		}
	}
	else
	{
		if (Counting.residualSecond === RANGE)
		{
			if (Counting.residualMinute === RANGE)
			{
				Counting.residualSecond = 0;
				Counting.residualMinute = 0;
				Counting.residualHour += 1;
				Counting.residualMs = 0;
			}
			else
			{
				Counting.residualSecond = 0;
				Counting.residualMinute += 1;
				Counting.residualMs = 0;
			}
		}
		else
		{
			Counting.residualSecond += 1;
			Counting.residualMs = 0;
		}
	}
	const timer = document.getElementById('time');
	timer.innerText = transfer2Show(Counting.residualHour, Counting.residualMinute, Counting.residualSecond);
	if (!Counting.checkEnd()) {
		Counting.setCounter = setTimeout(function () {countingInverse(isInverse);}, INTERVAL);
	} else {
		clearTimeout(Counting.setCounter);
	}

}

const Paused = {
	inputHour: 0,
	inputMinute: 0,
	inputSecond: 0,
	residualHour: 0,
	residualMinute: 0,
	residualSecond: 0,
	residualMs: 0,
	domTree: document.getElementsByTagName('header').header.cloneNode(false),
	state: 'Paused',
	CreateDom: function () {
		const hint = document.createElement('div');
		hint.id = 'hint';
		hint.innerText = "正在倒计时 00:00:00";
		Paused.domTree.appendChild(hint);
		const resume = document.createElement('button');
		resume.id = 'resume';
		resume.innerText = "恢复计时器";
		Paused.domTree.appendChild(resume);
		const clear = document.createElement('button');
		clear.id = 'clear';
		clear.innerText = Counting.state === 'Up' ? "清空正计时" : "清空倒计时";
		Paused.domTree.appendChild(clear);
		const restart = document.createElement('button');
		restart.id = 'restart';
		restart.innerText = "重新再计时";
		Paused.domTree.appendChild(restart);
	},
	ClearCounting: function () {
		document.removeEventListener('keydown', space2);
		StartBefore.inputHour = 0;
		StartBefore.inputMinute = 0;
		StartBefore.inputSecond = 0;
		StartBefore.Show();
	},
	Resume: function () {
		document.removeEventListener('keydown', space2);
		Counting.Show();// 因为其余变量不变
	},
	RestartCounting: function () {
		document.removeEventListener('keydown', space2);
		Counting.residualHour = Counting.inputHour;
		Counting.residualMinute = Counting.inputMinute;
		Counting.residualSecond = Counting.inputSecond;
		Counting.residualMs = 0;
		Counting.Show();
	},
	bindfunc: function () {
		document.getElementById('resume').onclick = Paused.Resume;
		document.getElementById('clear').onclick = Paused.ClearCounting;
		document.getElementById('restart').onclick = Paused.RestartCounting;
		document.addEventListener('keydown', space2);
	},
	Show: function () {
		let header = document.getElementsByTagName('header').header;
		header.parentNode.replaceChild(Paused.domTree, header);
		Paused.bindfunc();
		header = document.getElementsByTagName('header').header.childNodes;
		header[ZERO].innerText = Counting.state === "Up" ? "正在正计时 " + transfer2Show(Counting.inputHour, Counting.inputMinute, Counting.inputSecond) : "正在倒计时 " + transfer2Show(Counting.inputHour, Counting.inputMinute, Counting.inputSecond);
		header[TWO].innerText = Counting.state === "Up" ? "清空正计时" : "清空倒计时";
		const timer = document.getElementById('time');
		timer.innerText = transfer2Show(Counting.residualHour, Counting.residualMinute, Counting.residualSecond);
	}
};

const Counted = {
	inputHour: 0,
	inputMinute: 0,
	inputSecond: 0,
	domTree: document.getElementsByTagName('header').header.cloneNode(false),
	state: 'Counted',
	CreateDom: function () {
		const hint = document.createElement('div');
		hint.id = 'hint';
		hint.innerText = "倒计时 00:00:00 已结束";
		Counted.domTree.appendChild(hint);
		const clear = document.createElement('button');
		clear.id = 'clear';
		clear.innerText = Counting.state === 'Up' ? "清空正计时" : "清空倒计时";
		Counted.domTree.appendChild(clear);
		const restart = document.createElement('button');
		restart.id = 'restart';
		restart.innerText = "重新再计时";
		Counted.domTree.appendChild(restart);
	},
	ClearCounting: function () {
		StartBefore.inputHour = 0;
		StartBefore.inputMinute = 0;
		StartBefore.inputSecond = 0;
		StartBefore.Show();
	},
	RestartCounting: function () {
		Counting.RestartCounting();
	},
	bindfunc: function () {
		document.getElementById('clear').onclick = Counted.ClearCounting;
		document.getElementById('restart').onclick = Counted.RestartCounting;
	},
	Show: function () {
		let header = document.getElementsByTagName('header').header;
		header.parentNode.replaceChild(Counted.domTree, header);
		Counted.bindfunc();
		header = document.getElementsByTagName('header').header.childNodes;
		header[ZERO].innerText = Counting.state === "Up" ? "正计时 " + transfer2Show(Counting.inputHour, Counting.inputMinute, Counting.inputSecond) + " 已结束" : "倒计时 " + transfer2Show(Counting.inputHour, Counting.inputMinute, Counting.inputSecond) + " 已结束";
		header[ONE].innerText = Counting.state === "Up" ? "清空正计时" : "清空倒计时";
		const timer = document.getElementById('time');
		timer.innerText = transfer2Show(Counting.residualHour, Counting.residualMinute, Counting.residualSecond);
	}
};

StartBefore.Show();
Counting.CreateDom();
Paused.CreateDom();
Counted.CreateDom();
