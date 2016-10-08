$(function(){

	/*红桃:h  黑桃:s  梅花:c  方块:d
		封装函数,控制变量作用域
		制作扑克
	*/
	function makePoker(){
		var poker=[],
		colors=['h','s','c','d'],
		table=[];
		//判断直到页面加载52张扑克,循环次数不确定
		while(poker.length!==52){
			var n=Math.ceil(Math.random()*13)
			var h=colors[Math.floor(Math.random()*4)]
			var v={color:h,number:n}
			//如果页面中没有,则加到页面中;否则,将其变为true(用table记录)
			if(!table[n+h])
			//将v添加到poker数组中
			poker.push(v)
			table[n+h]=true;
		}
		//返回poker数组,提供给函数外使用
		return poker;
	}
		
		/*
			设置扑克
				1.金字塔共28张扑克
				2.共7行,每行依次递增
				3.添加一个div到scene中,并且给div添加一个类pai
		*/
		function setPoker(poker){
			var index=0;
			var dict={1:'A',2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,10:'T',11:'J',12:'Q',13:'K'}
			for(var i=0,poke;i<7;i++){
				for(var j=0;j<i+1;j++){
					poke=poker[index];
					index++;
					$('<div>')
						.attr('id',i+'_'+j)
						.attr('data-nmber',poke.number)
						.addClass('pai')
						.css('background-image','url(./image/'+dict[poke.number]+poke.color+'.png)')
						.appendTo('.scene')
						.delay(index*30)
						.animate({top:i*40,
								left:j*146+(6-i)*73,
								opacity:1
						})
				}
			}

			//循环下面放的24张扑克
			for(;index<poker.length;index++){
				v=poker[index];
				$('<div>')
						.attr('data-nmber',v.number)
						.addClass('pai left')
						.css('background-image','url(./image/'+dict[v.number]+v.color+'.png)')
						.appendTo('.scene')
						.delay(index*30)
						.animate({top:432,
								left:190,
								opacity:1
						})

			}
		}
		
		
		//调用函数
		setPoker(makePoker())

		/*将下面的牌依次放到右边  通过zIndex来调层级
			往右换牌,所有左边的元素加类
			放到右边之后把left类名去掉,加right类(通过类标识)
		*/
		$('.moveright').on('click',(function(){
			var zIndex=1;
			return function(){
				if($('.left').length===0){return;}				
				$('.left').last().
					css('z-index',zIndex++)
					.animate({left:640})
					.queue(function(){
						$(this)
						.removeClass('left')
						.addClass('right')
						.dequeue()
					})
			}
		})());
		
		/*将右边的牌以动画的方式放到左边
			选right,用动画的方式移回去
			看文档(了解被调用一次或多次)
			each函数：输出1.arguments  2.this指向(了解某个函数的回调函数)
					里面有个for循环 
					3.jquery中回调函数中的this,大部分情况下是指向集合中的一个DOM元素


			delay是一个简单的setTimeout

		*/
		$('.moveleft').on('click',(function(){
			var number=0;
			return function(){
						number++;
						if($('.left').length){
							return;
						}
						if(number>3){
							return;
						}
						$('.right').each(function(i){
							$(this)
							.css('z-index',0)
							.delay(i*30)
							.animate({left:190})
							.queue(function(){
									$(this)
									.removeClass('right')
									.addClass('left')
									.dequeue()
								})
							})
						}
		})());


		



		

		/*函数有一个功能
			后续添加的元素,用事件委托
			this是点击的DOM对象
			
			prev变量
		*/
		

		//对象上的数字
		function getNumber(el){
			return parseInt($(el).attr('data-nmber'))
		}
		/*	如果被压住,直接返回
			如果是13 直接消除  函数返回
			如果不是13  1)第一张 把这张存储	
						2)第二张 上次存储的和现在点的这个拿出来判断

			1.通过id去找i行数,j每一行中的第几个
			2.压着的两张牌  x+1 y不变和y+1
			3.用id或自定义属性,在元素身上记录一些有意义的信息
			4.必须整数parseInt
		*/
		function isCanClick(el){
			var x=parseInt($(el).attr('id').split('_')[0]);
			var y=parseInt($(el).attr('id').split('_')[1]);
			if($('#'+(x+1)+'_'+y).length||$('#'+(x+1)+'_'+(y+1)).length){
				return false;
			}else{
				return true;
			}
		}

	function format(second){
		var m=parseInt(second/60);
		var s=parseInt(second%60);
		s=(s < 10)?( '0' + s):s;
		m=(m<10)?('0'+m):m;
		var time=m + ":" + s;
		return time;
	}
			//计时
			var time=0;
			var score=0;
			var peidui=52;
			var prev=null;

			var js=setInterval(jishi,1000)	
			function jishi(){
				time++;
				$('.time').text('计时  '+format(time));
			}

			$('.scene').on('click','.pai',function(){
				//如果是上面的牌 且被压住 直接返回
				if($(this).attr('id')&&!isCanClick(this)){
					return;
				}

				var number=getNumber(this)

				//点到13
				if(number===13){
					$(this).animate({left:700,top:0})
					.queue(function(){
						$(this).detach().dequeue();
						score+=10;
						peidui--;
						$('.score').text('得分:'+score);
						$('.peidui').text('剩余:'+peidui);
					})
					return;
				}



				//开关  一开始关掉
				if(!prev){
					//点击谁,给谁添加样式
					prev=$(this);
					$(this).animate({top:'-=20'})
				}else{
					
					//第二个非13
					if(getNumber(prev)+getNumber(this)===13){
						prev.add(this)
							.animate({left:700,top:0})
							.queue(function(){
								$(this).detach().dequeue();
								score+=5;
								peidui--;
								$('.score').text('得分:'+score)
								$('.peidui').text('剩余:'+peidui);
							})
					}else{
						if($(this).attr('id')===$(prev).attr('id')){
							$(this).animate({top:'+=20'})
						}else{
							$(this).animate({top:'-=20'}).animate({top:'+=20'})
							prev.delay(400).animate({top:'+=20'})
						}
						
					}
					
					prev=null;
				}	
				
			})
		
		


	


		//重新发牌
		$('.newstart').on('click',function(){

			$('.pai').detach();
			$('.left').detach();
			$('.right').detach();
			setPoker(makePoker())
			score=0;
			peidui=52;
			$('.score').text('得分:'+score)
			$('.peidui').text('剩余:'+peidui);

			time=-1;
		})

		//清除浏览器默认操作

		$('.scene').on('mousedown',function(){
			return false;
		})

	
	
})