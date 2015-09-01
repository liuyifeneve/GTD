function fileA(name){
	this.gfather = name;
	this.cls=new Array();
	for(var i=1;i<arguments.length; i++){
		this.cls.push(arguments[i]);
		localStorage.setItem(name+'/'+arguments[i].name, JSON.stringify(this.cls[i-1]));
	}
	
}
fileA.prototype.loadcls = function(){
	var newclass = document.createElement('li');
	newclass.className="files1";
	var newdiv = document.createElement('div');
	newdiv.className = "fileicon";
	newclass.appendChild(newdiv);
	var newspan = document.createElement('span');
	newspan.className='blockitem';
	newclass.appendChild(newspan);
	newspan.innerHTML = this.gfather;

	var newul = document.createElement('ul');
	newul.className = "invisible";
	for(var i=0;i<this.cls.length; i++){
		var newli = document.createElement('li');
		newli.className = "file3";
		newdiv = document.createElement('div');
		newdiv.className="fileicon2";
		newli.appendChild(newdiv);
		newspan = document.createElement("span");
		newspan.innerHTML = this.cls[i].name;
		newspan.className="blocktask";
 		newli.appendChild(newspan);
		newul.appendChild(newli);
	}
	
	newclass.appendChild(newul);
	$('#classify').appendChild(newclass);
}

function fileB(name){
	this.name = name;
	this.tasks=new Array();
	for(var i=1;i<arguments.length; i++){
		this.tasks.push(arguments[i]);
	}
}

function datasave(){
	clslist = new Array(3);
	var temp1 = new fileB("task1","to-do-1","to-do-2","to-do-3","to-do-4","to-do-5")
	clslist[0] = new fileA("默认分类",temp1);
	temp1 = new fileB("task3","job1","job2","job3")
	temp2 = new fileB("task2","to-do-5")
	clslist[1] = new fileA("百度IFE项目",temp1,temp2);
	clslist[2] = new fileA("社团活动");

	var temp = new Object();
	temp.name = 'to-do-1';
	temp.date = '2014-04-28';
	temp.done = true;
	temp.text = '完成编码工作';
	
	localStorage.setItem('默认分类/task1/to-do-1', JSON.stringify(temp));
	
	temp.name = 'to-do-2';
	temp.date = '2014-04-28';
	temp.done = false;
	temp.text = '完成编码工作';
	localStorage.setItem('默认分类/task1/to-do-2', JSON.stringify(temp));
	
	temp.name = 'to-do-3';
	temp.date = '2014-05-03';
	temp.done = false;
	temp.text = '完成编码工作';
	localStorage.setItem('默认分类/task1/to-do-3', JSON.stringify(temp));
	
	temp.name = 'to-do-4';
	temp.date = '2014-05-17';
	temp.done = false;
	temp.text = '完成编码工作';
	localStorage.setItem('默认分类/task1/to-do-4', JSON.stringify(temp));
	
	temp.name = 'to-do-5';
	temp.date = '2013-05-27';
	temp.done = false;
	temp.text = '完成编码工作';
	localStorage.setItem('默认分类/task1/to-do-5', JSON.stringify(temp));
	
	temp.name = 'to-do-5';
	temp.date = '2014-03-21';
	temp.done = true;
	temp.text = '完成编码工作';
	localStorage.setItem('百度IFE项目/task2/to-do-5', JSON.stringify(temp));
	
	temp.name = 'job1';
	temp.date = '2014-05-28';
	temp.done = true;
	temp.text = '第一次完成编码工作';
	localStorage.setItem('百度IFE项目/task3/job1', JSON.stringify(temp));
	
	temp.name = 'job2';
	temp.date = '2014-05-03';
	temp.done = false;
	temp.text = '第二次完成编码工作';
	localStorage.setItem('百度IFE项目/task3/job2', JSON.stringify(temp));
	
	temp.name = 'job3';
	temp.date = '2014-04-17';
	temp.done = false;
	temp.text = '第三次完成编码工作';
	localStorage.setItem('百度IFE项目/task3/job3', JSON.stringify(temp));
}

/*
function fileB(){
	this.father = "task1";
}
fileB.prototype = new fileA("百度IFE项目");
var item = new fileB();
item.name="good";
item.data="900320";
*/


function addEvent(ele,event,fn){
	var ele = ele||document;
	if(ele.addEventListener){
		ele.addEventListener(event,fn,false);
	}
	else if(ele.attachEvent){
		ele.attachEvent('on'+event,fn);
	}
	else{
		ele['on'+event]=fn;
	}
}

function $(str){
	if(/^[a-z]{1,10}$/.test(str)){
		return document.getElementsByTagName(str); 
		}
	else{
		switch(str[0]){
		case "#":
			return document.getElementById(str.slice(1));
		case ".":
			return document.getElementsByClassName(str.slice(1));
		default: return;
		}
	}
}