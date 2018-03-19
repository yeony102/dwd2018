(function() {

	var x1 = 0;
	var x2 = 0;
	var isMoving = false; 
	var selected = -1;

	var thumbnails = document.getElementById('thumbContainer');
	var firstBtn = document.getElementById('first');
	var prevBtn = document.getElementById('prev');
	var lastBtn = document.getElementById('last');
	var nextBtn = document.getElementById('next');


	function goToFirst(e) {

		if(firstBtn.dataset.avail) {

			thumbnails.classList.add("containerAnim");
			thumbnails.style.left = '0px';
			firstBtn.dataset.avail = "false";
			prevBtn.dataset.avail = "false";
			lastBtn.dataset.avail = "true";
			nextBtn.dataset.avail = "true";

		}

	}

	function goToLast(e) {
		
		if(lastBtn.dataset.avail) {
			
			var minL = parseInt(window.innerWidth) - (parseInt(thumbnails.style.width)+100);

			thumbnails.classList.add("containerAnim");
			thumbnails.style.left = minL + 'px';
			lastBtn.dataset.avail = "false";
			nextBtn.dataset.avail = "false";
			firstBtn.dataset.avail = "true";
			prevBtn.dataset.avail = "true";
		}
	}

	function goToPrev(e) {
		
		if(prevBtn.dataset.avail) {

			var step = parseInt(window.innerWidth) - 300;
			var tmbLeft = thumbnails.offsetLeft + step;

			if(tmbLeft >= 0) {
				tmbLeft = 0; 
				firstBtn.dataset.avail = "false";
				prevBtn.dataset.avail = "false";
			}

			thumbnails.classList.add("containerAnim");
			lastBtn.dataset.avail = "true";
			nextBtn.dataset.avail = "true";
			thumbnails.style.left = tmbLeft + 'px';

		}

	}

	function goToNext(e) {

		if(nextBtn.dataset.avail) {

			var step = parseInt(window.innerWidth) - 300;
			var tmbLeft = thumbnails.offsetLeft - step;
			var minL = parseInt(window.innerWidth) - (parseInt(thumbnails.style.width)+100);

			if(tmbLeft < minL) {
				tmbLeft = minL;
				lastBtn.dataset.avail = "false";
				nextBtn.dataset.avail = "false";
			}

			thumbnails.classList.add("containerAnim");
			firstBtn.dataset.avail = "true";
			prevBtn.dataset.avail = "true";
			thumbnails.style.left = tmbLeft + 'px';
		}
	}

	function moving(e) {

		e.preventDefault();

		x1 = x2 - e.clientX;

		if(x1 > 5 || x1 < -5) {
			isMoving = true;
			x2 = e.clientX;

			var tmbLeft = thumbnails.offsetLeft - x1;
			var tmbRight = thumbnails.offsetRight - x1;
			var minL = parseInt(window.innerWidth) - (parseInt(thumbnails.style.width)+100);
		
			//console.log("minL = " + minL);

			

			if(tmbLeft > 0) {
				tmbLeft = 0; 
				firstBtn.dataset.avail = "false";
				prevBtn.dataset.avail = "false";
			}	else if(tmbLeft < minL) {
				tmbLeft = minL;
				lastBtn.dataset.avail = "false";
				nextBtn.dataset.avail = "false";
			} else {
				firstBtn.dataset.avail = "true";
				prevBtn.dataset.avail = "true";
				lastBtn.dataset.avail = "true";
				nextBtn.dataset.avail = "true";
			}

			//else if(tmbRight < 0) tmbRight = 0;

			thumbnails.classList.remove("containerAnim");

			thumbnails.style.left = tmbLeft + 'px';
		} 
		
	}

	function moveEnd(e) {
		if(isMoving) {	// drag 
			document.removeEventListener('mousemove', moving, false);
			isMoving = false;

		} else {	// click

			if(e.target.parentNode.className == 'dummyImg') {

				if(selected >= 0) {
					var tmbs = e.target.parentNode.parentNode.childNodes;
					tmbs[selected].style.marginTop = '7px'; 
					if(selected != tmbs.length-1) {
						tmbs[selected].style.marginRight = '5px';
					} else {
						tmbs[selected].style.marginRight = '2px';
					}
					tmbs[selected].childNodes[0].style.border = '0px';
					infoWindows[selected].close();
				}

				selected = e.target.dataset.idx;

				e.target.parentNode.style.marginTop = '5px';
				e.target.parentNode.style.marginRight = '8px';
				e.target.style.border = '2px solid rgb(0, 255, 255)';

				
				infoWindows[selected].open(map, marker[selected]);
				document.removeEventListener('mousemove', moving, false);
				//console.log(e.target.dataset.idx);
				//console.log(e.target.style.zIndex);
				//e.target.style.zIndex = 10;
			}


		}
	}

/*	function clickThumbnail(e) {

		e.target.style.border = '10px solid rgb(0, 255, 255)';

		e.stopPropagation();
	}*/

	function moveStart(e) {
		x2 = e.clientX;
		document.addEventListener('mousemove', moving, false);
		document.addEventListener('mouseup', moveEnd, false);
		
	}

	thumbnails.addEventListener('mousedown', moveStart, false);
	firstBtn.addEventListener('click', goToFirst, false);
	lastBtn.addEventListener('click', goToLast, false);
	prevBtn.addEventListener('click', goToPrev,false);
	nextBtn.addEventListener('click', goToNext, false);

	//document.querySelectorAll('.dummyImg').addEventListener('click', clickThumbnail, false);
	//thumbnails.addEventListener('click', clickThumbnail, false);

})();