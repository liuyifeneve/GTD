// JavaScript Document
window.onload = function(){
	localStorage.clear();	
	var taskcount=0;
	var editlock = false; //当处于编辑状态时该变量将阻止用户进行无关操作
	var fatherindex="默认分类/task1/";
	var oldtask = new String;
	var tasklistnum;
	var subclsnum;

	function init(){	
		datasave();
		for(var i=clslist.length-1; i>=0;i--){
			var temp = clslist[i];
			temp.loadcls();
		}
		$('#classify').childNodes[clslist.length].childNodes[2].className = "files2";
		var initcls = JSON.parse(localStorage.getItem('默认分类/task1'));
		loadtasklist.loadinit('默认分类',initcls);
		var initindex = '默认分类/task1/'+initcls.tasks[0];
		var inittask = JSON.parse(localStorage.getItem(initindex));
		loadtask(inittask);
	};

	addEvent($("#index"),"click",function(event){
		var temp= event.target||event.srcElement; 
		if(temp.className=="blockitem"){
			if(temp.parentNode.childNodes[2].className == "files2")
				temp.parentNode.childNodes[2].className="invisible";
			else
				temp.parentNode.childNodes[2].className="files2";
		};
		if(temp.className=="blocktask"){
			var pgfather = temp.parentNode.parentNode.parentNode.childNodes[1].innerHTML;
			var pfather = temp.innerHTML;
			var tempcls = JSON.parse(localStorage.getItem(pgfather+'/'+pfather));
			fatherindex = pgfather+'/'+pfather+'/';
			loadtasklist.clear();
			loadtasklist.loadinit(pgfather,tempcls);
		};
		if(temp.id=="allitems"){
			loadtasklist.clear();
			for(var i=0;i<clslist.length;i++){
				var tempcls = clslist[i];
				var tmpgfather = tempcls.gfather;
				for(var k=0; k<tempcls.cls.length;k++){
					var tmpfather  = tempcls.cls[k].name;
					var tempcls2 = JSON.parse(localStorage.getItem(tmpgfather+'/'+tmpfather));
					loadtasklist.loadinit(tmpgfather,tempcls2);
				}
			}
		};
		if(temp.className=="adbtn"){
			if(editlock == true){
				if(confirm("确定退出当前编辑？")){editlock = false}
				else return;
			}
			$('#newclsname').value='';
			var delenum = $('#newselect').childNodes.length;
			for (var i=0;i<delenum;i++){
				$('#newselect').remove($('#newselect').childNodes[0]);
			}
			var dftoption = document.createElement('option');
			dftoption.innerHTML='新建一个一级分类';
			dftoption.setAttribute('select','selected');
			$('#newselect').appendChild(dftoption);
			for (var i=0;i<clslist.length;i++){
				var newoption = document.createElement('option');
				newoption.innerHTML=clslist[i].gfather;
				$('#newselect').appendChild(newoption);
			}
			$('#popBox').className='popBox';
			$('#mask').className='mask';
			$('#loadtitle').innerHTML = '';
			$('#loadate').innerHTML = '';
			$('#loadtext').innerHTML = '';
			$('#textright').className = 'loadetaildone';
		}
	});

	addEvent($("#index"),"touchstart",function(event){
		if(editlock == true){return;}
		var temp= event.target||event.srcElement; 
		if(temp.className=="blocktask"){
			var pgfather = temp.parentNode.parentNode.parentNode.childNodes[1].innerHTML;
			var pfather = temp.innerHTML;
			var tempcls = JSON.parse(localStorage.getItem(pgfather+'/'+pfather));
			fatherindex = pgfather+'/'+pfather+'/';
			loadtasklist.clear();
			loadtasklist.loadinit(pgfather,tempcls);
			$('#container').style.left = '-100%';
		}
		if(temp.id=="allitems"){
			loadtasklist.clear();
			for(var i=0;i<clslist.length;i++){
				var tempcls = clslist[i];
				var tmpgfather = tempcls.gfather;
				for(var k=0; k<tempcls.cls.length;k++){
					var tmpfather  = tempcls.cls[k].name;
					var tempcls2 = JSON.parse(localStorage.getItem(tmpgfather+'/'+tmpfather));
					loadtasklist.loadinit(tmpgfather,tempcls2);
				}
			}
			$('#container').style.left = '-100%';
		}
	});

	addEvent($("#tasks"),"click",function(event){
		var temp= event.target||event.srcElement; 
		if(temp.nodeName=="LI"){
			if(editlock == true){
				if(confirm("确定退出当前编辑？")){editlock = false}
				else return;
			}
			var storageIndex = temp.childNodes[1].innerHTML+temp.innerHTML.split("<")[0];
			fatherindex = temp.childNodes[1].innerHTML;
			var temptask = JSON.parse(localStorage.getItem(storageIndex));
			loadtask(temptask);
		}
	});

	addEvent($("#tasks"),"touchstart",function(event){
		var temp= event.target||event.srcElement; 
		if(temp.nodeName=="LI"){
			if(editlock == true){
				return;
			}
			var storageIndex = temp.childNodes[1].innerHTML+temp.innerHTML.split("<")[0];
			fatherindex = temp.childNodes[1].innerHTML;
			var temptask = JSON.parse(localStorage.getItem(storageIndex));
			loadtask(temptask);
			$('#container').style.left = '-200%';
		}
	});

	addEvent($("#textright"),"click",function(event){
		var temp= event.target||event.srcElement; 
		if(temp.id=="edit"){
			$('#textright').className = 'editdetail';
			$('#edititle').value = $('#loadtitle').innerHTML;
			$('#editdate').value = $('#loadate').innerHTML;
			oldtask = $('#loadtitle').innerHTML;
			editlock = true;
			$('#edittext').innerHTML = $('#loadtext').innerHTML;
		};
		if(temp.id=="finish"){
			if(confirm("该任务已完成？")){
				var taskindex = fatherindex + $('#loadtitle').innerHTML;
				var temp = JSON.parse(localStorage.getItem(taskindex));
				temp.done = true;
				localStorage.setItem(taskindex, JSON.stringify(temp));

				var fathers = fatherindex.split('/');
				loadtasklist.clear();
				var fathercls = JSON.parse(localStorage.getItem(fathers[0]+'/'+fathers[1]));
				loadtasklist.loadinit(fathers[0],fathercls);
				loadtask(temp);
			}
		};
		if(temp.id=="save"){
			var Regdate = /^\d{4}-(0?\d|1[012])-(0?\d|[12]\d|3[01])$/;
			var Regtitle = /^[a-zA-Z0-9-_\u4e00-\u9fa5]+$/;
			var temp = new Object;

			if($('#edititle').value.length>20){
				alert('任务名称应小于20个字');
				return;
			}

			if(Regtitle.test($('#edititle').value)){
				temp.name = $('#edititle').value;
			}
			else{
				alert("含有非法字符哟！任务名称只能包含数字、字母、汉字、连字符及下划线!");
				return;
			}
			
			if(Regdate.test($('#editdate').value)){
				temp.date = $('#editdate').value;
			}
			else{
				alert('日期格式错误！');
				return;
			}
			if($('#edittext').value.length>500){
				alert('任务内容应小于500个字');
				return;
			}
			else temp.text = $('#edittext').value;

			temp.done = false;
			taskcount=0;
			//假如是新创建的任务，需要创建一个新的localStorage，再次将新创建的task加入到列表中
			localStorage.setItem(fatherindex + temp.name, JSON.stringify(temp));
			var tsklst = JSON.parse(localStorage.getItem(fatherindex.slice(0,-1)));
			if(oldtask[0] == '+'){
				tsklst.tasks.push(temp.name);
				localStorage.setItem(fatherindex.slice(0,-1), JSON.stringify(tsklst));
			}
			else if(temp.name!==oldtask){
				for(var i=0;i<tsklst.tasks.length;i++){
					if(tsklst.tasks[i]==oldtask){
						tsklst.tasks[i] = temp.name;
					}
				};
				localStorage.setItem(fatherindex.slice(0,-1), JSON.stringify(tsklst));
			};

			loadtasklist.clear();
			loadtasklist.loadinit(fatherindex.split('/')[0],tsklst);
			loadtask(temp);
			editlock = false;
		};
		if(temp.id=="cancel"){
			if(confirm("确定退出当前编辑？")){
				if(oldtask == '+'){
					$('#loadtitle').innerHTML = '';
					$('#loadate').innerHTML = '';
					$('#loadtext').innerHTML = '';
					$('#textright').className = 'loadetaildone';
				}
				else if(oldtask[0] == '+'){
					var taskindex = fatherindex + oldtask.slice(1);
					var temp = JSON.parse(localStorage.getItem(taskindex));
					loadtask(temp);
				}
				else{
					var taskindex = fatherindex + oldtask;
					var temp = JSON.parse(localStorage.getItem(taskindex));
					loadtask(temp);
				}
				editlock = false;
			}
		};
	});
	
	addEvent($("#middle"),"click",function(event){
		var temp= event.target||event.srcElement; 
		var allitems = $('#tasks').childNodes;
		if(temp.id=="alltask"){
			for(var i=0;i<allitems.length; i++){
				var subitem = allitems[i].childNodes;
				for(var j=0;j<subitem.length; j++){
					subitem[j].style.display = 'block';
				}
				allitems[i].style.display = 'block';
			}
		};
		if(temp.id=="done"){
			for(var i=0;i<allitems.length; i++){
				var subitem = allitems[i].childNodes;
				var ulcount=0;
				for(var j=1;j<subitem.length; j++){
					if(subitem[j].className == 'taskdone')
						subitem[j].style.display = 'block';
					else{
						subitem[j].style.display = 'none';
						ulcount = ulcount+1;
					}
				}
				if(ulcount == subitem.length-1) allitems[i].style.display = 'none';
				else allitems[i].style.display = 'block';
				
			}
		};
		if(temp.id=="doing"){
			for(var i=0;i<allitems.length; i++){
				var subitem = allitems[i].childNodes;
				var ulcount=0;
				for(var j=1;j<subitem.length; j++){
					if(subitem[j].className == 'taskundone')
						subitem[j].style.display = 'block';
					else{
						subitem[j].style.display = 'none';
						ulcount = ulcount+1;
					}
				}
				if(ulcount == subitem.length-1) allitems[i].style.display = 'none';
				else allitems[i].style.display = 'block';
			}
		};
		if(temp.className=="adbtn"){
			if(editlock == true){
				if(confirm("确定退出当前编辑？")){editlock = false}
				else return;
			}
			editlock = true;
			oldtask = '+'+$('#loadtitle').innerHTML;
			$('#textright').className = 'editdetail';
			$('#edititle').value='请输入任务名称';
			$('#editdate').value='请以YYYY-MM-DD格式输入时间';
			$('#edittext').value = '请在此输入详细内容';
		}
	});

	addEvent($("#middle"),"touchstart",function(event){
		var temp= event.target||event.srcElement; 
		if(temp.className=="adbtn"){
			if(editlock == true){
				return;
			}
			editlock = true;
			oldtask = '+'+$('#loadtitle').innerHTML;
			$('#textright').className = 'editdetail';
			$('#edititle').value='请输入任务名称';
			$('#editdate').value='请以YYYY-MM-DD格式输入时间';
			$('#edittext').value = '请在此输入详细内容';
			$('#container').style.left = '-200%';
		}
	});

	addEvent($("#popBox"),"click",function(event){
		var temp= event.target||event.srcElement; 
		if(temp.id=="newconfirm"){
			var name = $('#newclsname').value;
			var Regtitle = /^[a-zA-Z0-9-_\u4e00-\u9fa5]+$/;
			if(name == ''){
					alert('分类名称不能为空!');
					return;
				}
			else if(Regtitle.test(name)){
				if(confirm("保存新建分类？")){
					var clsindex = $('#newselect').selectedIndex;
					if(clsindex==0){
						var temp = new fileA(name);
						clslist.push(temp);
						temp.loadcls();	
					}
					else{
						var temp = new fileB(name);
						fatherindex = clslist[clsindex-1].gfather+'/'+name+'/';
						localStorage.setItem(clslist[clsindex-1].gfather+'/'+name, JSON.stringify(temp));
						clslist[clsindex-1].cls.push(temp);
						var tmpclslst = $('#classify').childNodes;
						for(var i=tmpclslst.length-1; i>0;i--){
							$('#classify').removeChild(tmpclslst[1]); 
						}
						for(var i=clslist.length-1; i>=0;i--){
							var temp2 = clslist[i];
							temp2.loadcls();
						}
						$('#classify').childNodes[1].childNodes[2].className = "files2";
						loadtasklist.clear();
						loadtasklist.loadinit($('#newselect').name,temp);
					}
				}
			}
			else{
				alert("含有非法字符哟！分类名称只能包含数字、字母、汉字、连字符及下划线!");
				return;
			}
			
			$('#popBox').className='invisible';
			$('#mask').className='invisible';
		};

		if(temp.id=="newcancel"){
			if(confirm("退出新建分类？")){
				$('#popBox').className='invisible';
				$('#mask').className='invisible';
				return;
			}
		};
	})

	addEvent($("#return2"),"touchstart",function(event){
		if(editlock == true){
			if(confirm("确定退出当前编辑？")){editlock = false}
			else return;
		}
		$('#container').style.left = '-100%';
	});

	addEvent($("#return1"),"touchstart",function(event){
		$('#container').style.left = '0%';
	});

	var loadtasklist = {
		loadinit:function(pgfather,subcls){
			for(var i=0;i<subcls.tasks.length;i++){
				var storageIndex = pgfather+'/'+subcls.name+'/'+subcls.tasks[i];
				var temp = JSON.parse(localStorage.getItem(storageIndex));
				var datelist = $('#tasks').childNodes;
				if(datelist.length==0){
					var newul = loadtasklist.newUL(temp,pgfather,subcls.name);
					$('#tasks').appendChild(newul);
				}
				else{
					for(var k=0;k<datelist.length;k++){
						var aDate2 = datelist[k].childNodes[0].innerHTML.split('-');
						var aDate = temp.date.split('-');
						var oDate1 = new Date(aDate[0],aDate[1],aDate[2]);
						var oDate2 = new Date(aDate2[0],aDate2[1],aDate2[2]);
						var datejudge = oDate1-oDate2;
						
						if( datejudge==0){
							var newli = loadtasklist.newLi(temp,pgfather,subcls.name);
							datelist[k].appendChild(newli);
							break;
						}
						else if(datejudge<0){
							newul = loadtasklist.newUL(temp,pgfather,subcls.name);
							$('#tasks').insertBefore(newul,datelist[k]);
							break;
						}
						else if(k==datelist.length-1){
							newul = loadtasklist.newUL(temp,pgfather,subcls.name);
							$('#tasks').appendChild(newul);
							break;
						}
					}
				}
			}
		},

		newUL:function(task,pgfather,pfather){
			var newul = document.createElement('ul');
			newul.className='listdate';
			var newspan = document.createElement('span');
			newspan.innerHTML = task.date;;
			newul.appendChild(newspan);
			var newli = loadtasklist.newLi(task,pgfather,pfather)
			newul.appendChild(newli);
			return newul;
		},
		newLi:function(task,pgfather,pfather){
			var newli = document.createElement('li');
			newli.innerHTML = task.name;
			var tmpflg = document.createElement('span');
			tmpflg.innerHTML = pgfather+'/'+pfather+'/';
			tmpflg.className = 'invisible';
			newli.appendChild(tmpflg);
			if(task.done==true)
				newli.className='taskdone';
			else
				newli.className='taskundone';
			return newli;
		},
		clear:function(){
			{
				var childs=$('#tasks').childNodes;    
				for(var i=childs.length-1;i>=0;i--){    
					$('#tasks').removeChild(childs[i]);    
				}
			}
		}
	}

	function loadtask(task){
		$('#loadtitle').innerHTML = task.name;
		$('#loadate').innerHTML = task.date;
		$('#loadtext').innerHTML = task.text;
		if(task.done==true)
			$('#textright').className = 'loadetaildone';
		else
			$('#textright').className = 'loadetail';
	}

	init();

}



