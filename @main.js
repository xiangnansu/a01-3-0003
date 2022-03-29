"use strict";

class ArtificialMentalRetardation
{
	#running;

	constructor()
	{
		if(!ArtificialMentalRetardation.instance)
		{
		}
		return ArtificialMentalRetardation.instance||(ArtificialMentalRetardation.instance=this);
	}
	async start(handCursor)
	{
		this.#running=true;
		while(this.#running)
		{
			let positionX=[312, 501, 681, 121][Utility.random(4)]*(1-Math.random()*1.5/10);
			PointerEvent.dispatchEvent("pointerdown", handCursor.centerPosition.x, 0);
			await Utility.waitForSeconds(0.25);
			while(this.#running)
			{
				PointerEvent.dispatchEvent("pointermove", Utility.lerp(handCursor.centerPosition.x, positionX, 0.1), 0);
				if(Math.abs(positionX-handCursor.centerPosition.x)<2)
				{
					PointerEvent.dispatchEvent("pointermove", positionX, 0);
					PointerEvent.dispatchEvent("pointerup", positionX, 0);
					await Utility.waitForSeconds(1.5);
					break;
				}
				await Utility.waitForSeconds(0.033);
			}
		}
	}
	stop()
	{
		this.#running=false;
	}
}
class Image
{
	static get EndScreen_lose()
	{
		return "none";
	}
	static get EndScreen_pointerout()
	{
		return "url(shapes/143.svg)";
	}
	static get EndScreen_pointerover()
	{
		return "url(shapes/145.svg)";
	}
	static get EndScreen_timeup()
	{
		return "url(shapes/122.svg)";
	}
	static get EndScreen_win()
	{
		return "none";
	}
	static get StartScreen_pointerout()
	{
		return "url(shapes/107.svg)";
	}
	static get StartScreen_pointerover()
	{
		return "url(shapes/108.svg)";
	}
}
class Sound
{
	static #background;
	static #exit;
	static #good;
	static #lose;
	static #pointerover;
	static #start;
	static #timeup;
	static #win;
	static #wrong;

	static constructor()
	{
		Sound.#background=new Audio("sounds/3_bgmusic05.wav.mp3");
		Sound.#exit=new Audio("sounds/84.mp3");
		Sound.#good=new Audio("sounds/18.mp3");
		Sound.#lose=null;
		Sound.#pointerover=new Audio("sounds/110.mp3");
		Sound.#start=new Audio("sounds/2_開始玩.mp3");
		Sound.#timeup=new Audio("sounds/4_win.mp3");
		Sound.#win=null;
		Sound.#wrong=new Audio("sounds/1_錯誤.mp3");
	}
	static get background()
	{
		return Sound.#background;
	}
	static get exit()
	{
		return Sound.#exit;
	}
	static get good()
	{
		return Sound.#good;
	}
	static get lose()
	{
		return Sound.#lose;
	}
	static get pointerover()
	{
		return Sound.#pointerover;
	}
	static get start()
	{
		return Sound.#start;
	}
	static get timeup()
	{
		return Sound.#timeup;
	}
	static get win()
	{
		return Sound.#win;
	}
	static get wrong()
	{
		return Sound.#wrong;
	}
}

class Bottle
{
	#bottle;
	#cap;
	#score;
	#state;
	#running=false;

	constructor(bottle, score)
	{
		this.#bottle=new Element(bottle);
		this.#cap=new Element(bottle.children[0]);
		this.#score=score;
		this.#state="open";
	}
	get state()
	{
		return this.#state;
	}
	get bottleRect()
	{
		return this.#bottle.rect;
	}
	get capRect()
	{
		if(this.#state==="open")
		{
			let tops=[-26.5, -25, -22.5, -21];
			this.#cap.style["top"]=tops[this.#score-1]+"px";
			let rect=this.#cap.rect;
			tops=[-39, -34, -31, -29];
			this.#cap.style["top"]=tops[this.#score-1]+"px";
			return rect;
		}
		return this.#cap.rect;
	}
	get score()
	{
		return this.#score;
	}
	#close(self)
	{
		if(self.#running)
		{
			self.#state="close";
			const tops=[-26.5, -25, -22.5, -21];
			self.#cap.style["top"]=tops[self.#score-1]+"px";
			self.#cap.style["background-image"]="url(shapes/140.svg)";
			setTimeout(self.#open, 1000, self);
		}
	}
	#open(self)
	{
		if(self.#running)
		{
			self.#state="open";
			const tops=[-39, -34, -31, -29];
			self.#cap.style["top"]=tops[self.#score-1]+"px";
			self.#cap.style["background-image"]="url(shapes/139.svg)";
			setTimeout(self.#close, (6-self.#score+Math.random())*1000, self);
		}
	}
	start()
	{
		this.#running=true;
		this.#open(this);
	}
	stop()
	{
		this.#running=false;
	}
}
class HandCursor extends Cursor
{
	constructor(pointerdown, pointermove, pointerup)
	{
		if(!HandCursor.instance)
		{
			super(document.querySelector(".hand-cursor"));
			this.visible=false;

			this.$pointerdown=(left, top) =>
			{
				this.element.top=475;
				pointerdown&&pointerdown(this.centerPosition.x, this.element.top);
			};
			this.$pointermove=(left, top) =>
			{
				this.element.top=475;
				pointermove&&pointermove(this.centerPosition.x, this.element.top);
			};
			this.$pointerup=(left, top) =>
			{
				this.element.top=475;
				pointerup&&pointerup(this.centerPosition.x, this.element.top);
			};
			this.$visible=(value) =>
			{
				this.element.top=475;
			}
		}
		return HandCursor.instance||(HandCursor.instance=this);
	}
	get centerPosition()
	{
		return {x: this.element.left+this.element.width/2, y: this.element.top+this.element.height/2};
	}
	set image(value)
	{
		this.element.image=value;
	}
}
class Marble
{
	#marble;
	#hitCallback
	#onGroundCallback;
	#throwing=false;
	#bottle;

	constructor(centerLeft, top, hitCallback, onGroundCallback)
	{
		const marble=document.querySelector(".marbles").appendChild(document.createElement("div"));
		marble.style["z-index"]=800;
		marble.style["width"]="86px";
		marble.style["height"]="86px";
		this.#marble=new Element(marble);
		this.#marble.left=centerLeft-this.#marble.width/2.0;
		this.#marble.top=top;
		const images=[5, 7, 9, 11];
		this.#marble.style["background-image"]=`url(shapes/${images[Utility.random(4)]}.svg)`;
		this.#hitCallback=hitCallback;
		this.#onGroundCallback=onGroundCallback;
	}
	get centerLeft()
	{
		return this.#marble.left+this.#marble.width/2.0;
	}
	set centerLeft(value)
	{
		if(this.#throwing===false)
		{
			this.#marble.left=value-this.#marble.width/2.0;
		}
	}
	get throwing()
	{
		return this.#throwing;
	}
	set bottle(value)
	{
		this.#bottle=value;
	}
	stop()
	{
		this.#throwing=false
	}
	throw()
	{
		this.#throwing=true;
		const delta=Utility.random(10);
		let groundTop=280+delta;
		let hitTestTop=Number.MAX_VALUE;
		let cx=0.0025;
		let cy=5;
		let scale=1;

		if(this.#bottle!==undefined)
		{
			groundTop=this.#bottle.bottleRect.bottom-22+delta;
			const capRect=this.#bottle.capRect;
			if((this.centerLeft>capRect.left)&&(this.centerLeft<capRect.right))
			{
				hitTestTop=this.#bottle.capRect.top;
			}
			cx-=Math.sqrt(groundTop-280)*0.00008;
		}

		const hInterval=setInterval(() =>
		{
			if(this.#throwing)
			{
				this.#marble.top-=cy;
				this.#marble.transform=`scale(${scale}, ${scale})`;
				cy-=0.035;
				scale-=cx;
				if(cy<0)
				{
					if(this.#bottle===undefined)
					{
						this.#marble.style["z-index"]=`${9+delta}`;
					}
					if(this.#marble.top>hitTestTop)
					{
						if(this.#bottle.state==="open")
						{
							let centerLeft=this.centerLeft;
							this.#marble.width=706;
							this.#marble.height=203;
							this.#marble.style["background-size"]="none";
							this.#marble.style["background-image"]="url(sprites/15.svg)";
							this.#marble.style["animation"]="marble-hit-effect 0.75s steps(11) infinite";
							this.#marble.transform="scale(0.25,0.25)";
							this.#marble.left=centerLeft-this.#marble.width/2.0;
							this.#marble.top=this.#bottle.bottleRect.top-this.#marble.height/2.0;
							setTimeout(() => this.#marble.visible=false, 0.75*1000);
							clearInterval(hInterval);
							this.#hitCallback&&this.#hitCallback(this.#bottle.score);
						}
						hitTestTop=Number.MAX_VALUE;
					}
					if(this.#marble.top>=groundTop)
					{
						Sound.wrong.play();
						clearInterval(hInterval);
						this.#onGroundCallback&&this.#onGroundCallback();
					}
				}
			}
			else
			{
				clearInterval(hInterval);
			}
		}, (Utility.isFirefox())? 0:0.033);
	}
}
class StarFlash
{
	static starFlash=document.querySelector(".star-flash");
	static scoreText=document.querySelector(".star-flash > .score-text");

	constructor(point)
	{
		StarFlash.scoreText.innerHTML=point;
		StarFlash.starFlash.style["display"]="block";
		setTimeout(() => StarFlash.starFlash.style["display"]="none", 0.5*1000);
	}
}

class Main
{
	artificialMentalRetardation;
	autoplay;
	bottles=new Array();
	endScreen;
	handCursor;
	marble=null;
	score;
	startScreen;
	starCursor;
	timer;

	constructor()
	{
		this.autoplayClick=this.autoplayClick.bind(this);
		this.gameover=this.gameover.bind(this);
		this.hit=this.hit.bind(this);
		this.mousedown=this.mousedown.bind(this);
		this.mousemove=this.mousemove.bind(this);
		this.mouseup=this.mouseup.bind(this);
		this.onGround=this.onGround.bind(this);
		this.restart=this.restart.bind(this);
		this.start=this.start.bind(this);
		this.timeup=this.timeup.bind(this);

		new BackgroundMusic();
		new ExitButton();
		new FullScreen();

		this.artificialMentalRetardation=new ArtificialMentalRetardation();
		this.autoplay=new AutoPlay(this.autoplayClick);
		for(let i=0; i<4; i++)
		{
			this.bottles.push(new Bottle(document.querySelector(".bottles > .bottle-"+(i+1)), i+1));
		}
		this.endScreen=new EndScreen(this.restart);
		this.handCursor=new HandCursor(this.mousedown, this.mousemove, this.mouseup);
		this.startScreen=new StartScreen(this.start);
		this.starCursor=new StarCursor();
		this.timer=new Timer(this.timeup);

		this.starCursor.visible=true;
	}
	autoplayClick(running)
	{
		if(running)
		{
			if(this.startScreen.visible)
			{
				this.startScreen.visible=false;
				this.start();
			}
			else if(this.endScreen.visible)
			{
				this.restart();
			}
			this.handCursor.enable=false;
			this.artificialMentalRetardation.start(this.handCursor)
		}
		else
		{
			this.artificialMentalRetardation.stop();
			this.handCursor.enable=true;
		}
	}
	gameover(result)
	{
		this.artificialMentalRetardation.stop();
		this.autoplay.reset();
		this.handCursor.enable=true;

		const marbles=document.querySelector(".marbles");
		for(let i=marbles.childElementCount-1; i>=0; i--)
		{
			marbles.removeChild(marbles.children[i]);
		}
		this.handCursor.visible=false;
		this.starCursor.visible=true;

		this.endScreen.score=this.score;
		this.endScreen.result=result;
		this.endScreen.visible=true;

		this.timer.stop();
		for(let i=0; i<this.bottles.length; i++)
		{
			this.bottles[i].stop();
		}
		this.marble&&this.marble.stop();
		this.marble=null;
	}
	hit(score)
	{
		this.marble=null;
		setTimeout(() =>
		{
			for(let i=0; i<3; i++)
			{
				setTimeout(() => Sound.good.play(), i*200);
			}
			new StarFlash(this.score+=score);
		}, 0*1000);
	}
	mousedown(centerLeft, top)
	{
		if(this.marble===null)
		{
			this.handCursor.image="url(shapes/131.svg)";
			this.marble=new Marble(centerLeft, top+6, this.hit, this.onGround);
		}
	}
	mousemove(centerLeft, top)
	{
		if(this.marble!==null)
		{
			this.marble.centerLeft=centerLeft;
		}
	}
	mouseup(centerLeft, top)
	{
		this.handCursor.image="url(shapes/130.svg)";
		if((this.marble!==null)&&(this.marble.throwing===false))
		{
			for(let i=0; i<this.bottles.length; i++)
			{
				const bottleRect=this.bottles[i].bottleRect;
				if((centerLeft>bottleRect.left)&&(centerLeft<bottleRect.right))
				{
					this.marble.bottle=this.bottles[i];
				}
			}
			this.marble.throw();
		}
	}
	restart()
	{
		this.endScreen.visible=false;
		this.start();
	}
	async start()
	{
		document.querySelector(".marbles").style["display"]="block";
		this.score=0;
		this.handCursor.visible=true;
		this.starCursor.visible=false;
		this.timer.start(60);
		for(let i=0; i<this.bottles.length; i++)
		{
			this.bottles[i].start();
		}
	}
	onGround()
	{
		this.marble=null;
	}
	timeup()
	{
		this.gameover("timeup");
	}
}

Sound.constructor();
new Main();