/**
 * Created by killian on 2015/6/3.
 */
(function () {
	document.onreadystatechange = function () {
		if ( document.readyState == 'complete' ) //当页面加载状态
		{
			var load = document.querySelector( '.loadingBox' );
			setTimeout( function () {
				load.classList.add( "done" );
				load.addEventListener( "webkitTransitionEnd", function () {
					load.style.display = 'none';
					document.querySelector( '.page1' ).classList.add( '.swiper-slide-active' );
					musicFun();
				} );
			}, 1000 );
		}
	};
	function musicFun() {
		var playBtn = document.querySelector( '.music-icon' );
		var musicobj = document.getElementById( 'bg_audio' );
		playBtn.onclick = function () {
			if ( musicobj.paused ) {
				playBtn.classList.add( 'play' );
				musicobj.play();
				//musicobj.pause();
			}
			else {
				playBtn.classList.remove( 'play' );
				//musicobj.play();
				musicobj.pause();
			}

		}

		document.addEventListener( 'WeixinJSBridgeReady', function () {
			musicobj.play();
		}, false );
	}

	var swiper = new Swiper( '.swiper-container', {direction : 'vertical',loop : true} );
	var width = document.body.clientHeight * 0.635, btns = document.querySelector( '.btns' );
	btns.style.width = width + 'px';
	var arrBtn = document.querySelectorAll( '.btns div' );

	for ( var i = 0; i < arrBtn.length; i++ ) {
		arrBtn[i].style.width = width / 3 + 'px';
	}

	var leftBtn = document.querySelector( '.leftBtn' ), middleBtn = document.querySelector( '.middleBtn' ), rightBtn = document.querySelector( '.rightBtn' );
	var leftCentent = document.querySelector( '.left-content' ), middleContent = document.querySelector( '.middle-content' ), rightContent = document.querySelector( '.right-content' );
	leftBtn.onclick = function () {
		leftCentent.style.display = 'block';
		middleContent.style.display = 'none';
		rightContent.style.display = 'none';
	}
	middleBtn.onclick = function () {
		leftCentent.style.display = 'none';
		middleContent.style.display = 'block';
		rightContent.style.display = 'none';
	}
	rightBtn.onclick = function () {
		leftCentent.style.display = 'none';
		middleContent.style.display = 'none';
		rightContent.style.display = 'block';
	}
}())
