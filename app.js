function transfer2(hour,minute,second) {
	let str = "";
	if(hour % 10 === hour)
		str += "0"+hour;
	else
		str += hour;
	str += ":";
	if(minute % 10 === minute)
		str += "0"+minute;
	else
		str += minute;
	str += ":";
	if(second % 10 === second)
		str += "0"+second;
	else
		str += second;
	return str;
}

const ZERO = 0;

function enter(event) {
	if (event.keyCode === 13) {
		StartBefore.Countup()
	}
}

function space1(event) {
	if (event.keyCode === 32) {
		Counting.Pause();
	}
}

function space2(event) {
	if (event.keyCode === 32) {
		Paused.Resume();
	}
}

const StartBefore = {
	input_hour: 0,
	input_minute: 0,
	input_second: 0,
	dom_tree: document.getElementsByTagName('header').header.cloneNode(true), //复制dom,但是要重新绑定事件
	state: 'StartBefore',
	getTime: function() {
		let input_time = document.getElementsByTagName('input');
		StartBefore.input_hour = parseInt(input_time[0].value);
		StartBefore.input_minute = parseInt(input_time[1].value);
		StartBefore.input_second = parseInt(input_time[2].value);
		console.log(StartBefore.input_hour);
	},
	Countup: function() {
		document.removeEventListener('keydown',enter);
		StartBefore.getTime();
		Counting.state = 'Up';
		Counting.input_hour = StartBefore.input_hour;
		Counting.input_minute = StartBefore.input_minute;
		Counting.input_second = StartBefore.input_second;

		Counting.residual_hour = 0;
		Counting.residual_minute = 0;
		Counting.residual_second = 0;
		Counting.residual_ms = 0;
		Counting.Show();
	},
	Countdown: function () {
		document.removeEventListener('keydown',enter);
		StartBefore.getTime();
		Counting.state = 'Down';
		Counting.input_hour = StartBefore.input_hour;
		Counting.input_minute = StartBefore.input_minute;
		Counting.input_second = StartBefore.input_second;
		//待修改
		Counting.residual_hour = StartBefore.input_hour;
		Counting.residual_minute = StartBefore.input_minute;
		Counting.residual_second = StartBefore.input_second;
		Counting.residual_ms = 0;
		Counting.Show();
	},
	bindfunc: function () {
		document.getElementById('countup').onclick = StartBefore.Countup;
		document.getElementById('countdown').onclick = StartBefore.Countdown;
		document.addEventListener('keydown',enter);
	},
	getDom: function () {
		let header = document.getElementsByTagName('header').header; 
		StartBefore.dom_tree = header.cloneNode(true);
	},
	Show: function () {
		let header = document.getElementsByTagName('header').header;
		header.parentNode.replaceChild(StartBefore.dom_tree,header);
		StartBefore.bindfunc();
		let timer = document.getElementById('time');
		timer.innerText = "00:00:00";
	}
};

const Counting = {
	input_hour: 0,
	input_minute: 0,
	input_second: 0,
	residual_hour: 0,
	residual_minute: 0,
	residual_second: 0,
	residual_ms: 0,
	record_start: 0,
	setCounter: null,
	dom_tree: document.getElementsByTagName('header').header.cloneNode(false),
	state: null,
	CreateDom: function () {
		let hint = document.createElement('div');
		hint.id = 'hint';
		hint.innerText = 'Up'?"正在正计时 00:00:00":"正在倒计时 00:00:00";
		Counting.dom_tree.appendChild(hint);
		let resume = document.createElement('button');
		resume.id = 'pause';
		resume.innerText = "暂停计时器";
		Counting.dom_tree.appendChild(resume);
		let clear = document.createElement('button');
		clear.id = 'clear';
		clear.innerText = Counting.state === 'Up'?"清空正计时":"清空倒计时";
		Counting.dom_tree.appendChild(clear);
		let restart = document.createElement('button');
		restart.id = 'restart';
		restart.innerText = "重新再计时";
		Counting.dom_tree.appendChild(restart);
	},
	Pause: function () {
		clearTimeout(Counting.setCounter);
		document.removeEventListener('keydown',space1);
		let start = new Date();
		let end = start.getTime();
		let interval = end - Counting.record_start;
		if (Counting.state === "Up") {
			Counting.residual_ms += interval;
		} else {
			Counting.residual_ms -= interval;
		}
		Paused.input_hour = Counting.input_hour;
		Paused.input_minute = Counting.input_minute;
		Paused.input_second = Counting.input_second;
		Paused.residual_hour = Counting.residual_hour;
		Paused.residual_minute = Counting.residual_minute;
		Paused.residual_second = Counting.residual_second;
		Paused.residual_ms = Counting.residual_ms;
		Paused.Show();
	},
	ClearCounting: function () {
		document.removeEventListener('keydown',space1);
		clearTimeout(Counting.setCounter);
		StartBefore.input_hour = 0;
		StartBefore.input_minute = 0;
		StartBefore.input_second = 0;
		StartBefore.Show();
	},
	RestartCounting: function () {
		document.removeEventListener('keydown',space1);
		clearTimeout(Counting.setCounter);
		if (Counting.state === "Down") {
			Counting.residual_hour = Counting.input_hour;
			Counting.residual_minute = Counting.input_minute;
			Counting.residual_second = Counting.input_second;
			Counting.residual_ms = 0;
		} else {
			Counting.residual_hour = 0;
			Counting.residual_minute = 0;
			Counting.residual_second = 0;
			Counting.residual_ms = 0;
		}
		Counting.Show();
	},
	bindfunc: function () {
		console.log(Counting.input_minute);
		document.getElementById('pause').onclick = Counting.Pause;	
		document.getElementById('clear').onclick = Counting.ClearCounting;
		document.getElementById('restart').onclick = Counting.RestartCounting;
		document.addEventListener('keydown',space1);
	},
	checkEnd: function () {
		if (Counting.state === "Up") {
			if (Counting.residual_second === Counting.input_second && Counting.residual_minute === Counting.input_minute && Counting.residual_hour === Counting.input_hour) {
				Counted.input_hour = Counting.input_hour;
				Counted.input_minute = Counting.input_minute;
				Counted.input_second = Counting.input_second;
				Counted.Show();
				return true;
			}
		} else {
			if (Counting.residual_ms === ZERO && Counting.residual_second === ZERO && Counting.residual_minute === ZERO && Counting.residual_hour === ZERO) {
				Counted.input_hour = Counting.input_hour;
				Counted.input_minute = Counting.input_minute;
				Counted.input_second = Counting.input_second;
				Counted.Show();
				return true;
			}
		}
		return false;
	},
	Show: function () {
		let header = document.getElementsByTagName('header').header;
		header.parentNode.replaceChild(Counting.dom_tree,header);
		header = document.getElementsByTagName('header').header.childNodes;
		header[0].innerText = Counting.state === "Up"?"正在正计时 "+transfer2(Counting.input_hour,Counting.input_minute,Counting.input_second):"正在倒计时 "+transfer2(Counting.input_hour,Counting.input_minute,Counting.input_second);
		header[2].innerText = Counting.state === "Up"?"清空正计时":"清空倒计时";
		Counting.bindfunc();
		let timer = document.getElementById('time');
		let interval = 1000;
		if (Counting.state === 'Up') {
			//正计时
			timer.innerText = transfer2(Counting.residual_hour,Counting.residual_minute,Counting.residual_second);
			interval = interval - Counting.residual_ms; //间隔设置为ms
		}
		else
		{
			if(Counting.residual_ms === ZERO)
			{
				if(Counting.residual_second === ZERO)
				{
					if(Counting.residual_minute === ZERO)
					{
						Counting.residual_hour -= 1;
						Counting.residual_minute = 59;
						Counting.residual_second = 59;
						Counting.residual_ms = 999;
						timer.innerText = transfer2(Counting.residual_hour,59,59);
					}
					else
					{
						Counting.residual_minute -= 1;
						Counting.residual_second = 59;
						Counting.residual_ms = 999;
						timer.innerText = transfer2(Counting.residual_hour,Counting.residual_minute,59);
					}
				}
				else
				{
					Counting.residual_second -= 1;
					Counting.residual_ms = 999;
					timer.innerText = transfer2(Counting.residual_hour,Counting.residual_minute,Counting.residual_second);
				}
			}
			else
			{
				interval = Counting.residual_ms+1;
				timer.innerText = transfer2(Counting.residual_hour,Counting.residual_minute,Counting.residual_second);
			}
		}
		// while(1)
		// {
		// 	let start = new Date();
		// 	Counting.record_start = start.getTime();
		// 	setTimeout(countingInverse(Counting.state==="Up"?false:true,interval),interval);
		// }
		let start = new Date();
		Counting.record_start = start.getTime();
		Counting.setCounter = setTimeout(function() {countingInverse(Counting.state==="Up"?false:true,interval);},interval);
	}
};

function countingInverse(isInverse,interval) {
	if(isInverse)
	{
		if(Counting.residual_second === ZERO)
		{
			if(Counting.residual_minute === ZERO)
			{
				if(Counting.residual_hour === ZERO)
				{
					Counting.residual_ms = 0;
				}
				else
				{
					Counting.residual_hour -= 1;
					Counting.residual_minute = 59;
					Counting.residual_second = 59;
					Counting.residual_ms = 999;
				}
			}
			else
			{
				Counting.residual_minute -= 1;
				Counting.residual_second = 59;
				Counting.residual_ms = 999;
			}
		}
		else
		{
			Counting.residual_second -= 1;
			Counting.residual_ms = 999;
		}
	}
	else
	{
		if(Counting.residual_second === 59)
		{
			if(Counting.residual_minute === 59)
			{
				Counting.residual_second = 0;
				Counting.residual_minute = 0;
				Counting.residual_hour += 1;
				Counting.residual_ms = 0;
			}
			else
			{
				Counting.residual_second = 0;
				Counting.residual_minute += 1;
				Counting.residual_ms = 0;
			}
		}
		else
		{
			Counting.residual_second += 1;
			Counting.residual_ms = 0;
		}
	}
	let timer = document.getElementById('time');
	timer.innerText = transfer2(Counting.residual_hour,Counting.residual_minute,Counting.residual_second);
	if (!Counting.checkEnd()) {
		Counting.setCounter = setTimeout(function() {countingInverse(isInverse,1000);},1000);
	} else {
		clearTimeout(Counting.setCounter);
	}

}

const Paused = {
	input_hour: 0,
	input_minute: 0,
	input_second: 0,
	residual_hour: 0,
	residual_minute: 0,
	residual_second: 0,
	residual_ms: 0,
	dom_tree: document.getElementsByTagName('header').header.cloneNode(false),
	state: 'Paused',
	CreateDom: function () {
		let hint = document.createElement('div');
		hint.id = 'hint';
		hint.innerText = "正在倒计时 00:00:00";
		Paused.dom_tree.appendChild(hint);
		let resume = document.createElement('button');
		resume.id = 'resume';
		resume.innerText = "恢复计时器";
		Paused.dom_tree.appendChild(resume);
		let clear = document.createElement('button');
		clear.id = 'clear';
		clear.innerText = Counting.state === 'Up'?"清空正计时":"清空倒计时";
		Paused.dom_tree.appendChild(clear);
		let restart = document.createElement('button');
		restart.id = 'restart';
		restart.innerText = "重新再计时";
		Paused.dom_tree.appendChild(restart);
	},
	ClearCounting: function () {
		document.removeEventListener('keydown',space2);
		StartBefore.input_hour = 0;
		StartBefore.input_minute = 0;
		StartBefore.input_second = 0;
		StartBefore.Show();
	},
	Resume: function () {
		document.removeEventListener('keydown',space2);
		Counting.Show();//因为其余变量不变
	},
	RestartCounting: function () {
		document.removeEventListener('keydown',space2);
		Counting.residual_hour = Counting.input_hour;
		Counting.residual_minute = Counting.input_minute;
		Counting.residual_second = Counting.input_second;
		Counting.residual_ms = 0;
		Counting.Show();
	},
	bindfunc: function () {
		document.getElementById('resume').onclick = Paused.Resume;	
		document.getElementById('clear').onclick = Paused.ClearCounting;
		document.getElementById('restart').onclick = Paused.RestartCounting;
		document.addEventListener('keydown',space2);
	},
	Show: function () {
		let header = document.getElementsByTagName('header').header;
		header.parentNode.replaceChild(Paused.dom_tree,header);
		Paused.bindfunc();
		header = document.getElementsByTagName('header').header.childNodes;
		header[0].innerText = Counting.state === "Up"?"正在正计时 "+transfer2(Counting.input_hour,Counting.input_minute,Counting.input_second):"正在倒计时 "+transfer2(Counting.input_hour,Counting.input_minute,Counting.input_second);
		header[2].innerText = Counting.state === "Up"?"清空正计时":"清空倒计时";
		let timer = document.getElementById('time');
		timer.innerText = transfer2(Counting.residual_hour,Counting.residual_minute,Counting.residual_second);
	}
};

const Counted = {
	input_hour: 0,
	input_minute: 0,
	input_second: 0,
	dom_tree: document.getElementsByTagName('header').header.cloneNode(false),
	state: 'Counted',
	CreateDom: function () {
		let hint = document.createElement('div');
		hint.id = 'hint';
		hint.innerText = "倒计时 00:00:00 已结束";
		Counted.dom_tree.appendChild(hint);
		let clear = document.createElement('button');
		clear.id = 'clear';
		clear.innerText = Counting.state === 'Up'?"清空正计时":"清空倒计时";
		Counted.dom_tree.appendChild(clear);
		let restart = document.createElement('button');
		restart.id = 'restart';
		restart.innerText = "重新再计时";
		Counted.dom_tree.appendChild(restart);
	},
	ClearCounting: function () {
		StartBefore.input_hour = 0;
		StartBefore.input_minute = 0;
		StartBefore.input_second = 0;
		StartBefore.Show();
	},
	RestartCounting: function () {
		Counting.RestartCounting()
	},
	bindfunc: function () {
		document.getElementById('clear').onclick = Counted.ClearCounting;
		document.getElementById('restart').onclick = Counted.RestartCounting;
	},
	Show: function () {
		let header = document.getElementsByTagName('header').header;
		header.parentNode.replaceChild(Counted.dom_tree,header);
		Counted.bindfunc();
		header = document.getElementsByTagName('header').header.childNodes;
		header[0].innerText = Counting.state === "Up"?"正计时 "+transfer2(Counting.input_hour,Counting.input_minute,Counting.input_second)+" 已结束":"倒计时 "+transfer2(Counting.input_hour,Counting.input_minute,Counting.input_second)+" 已结束";
		header[1].innerText = Counting.state === "Up"?"清空正计时":"清空倒计时";
		let timer = document.getElementById('time');
		timer.innerText = transfer2(Counting.residual_hour,Counting.residual_minute,Counting.residual_second);
	}
};

StartBefore.Show();
Counting.CreateDom();
Paused.CreateDom();
Counted.CreateDom();