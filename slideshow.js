function Slide(domElement) {
	this.domElement = domElement;
	this.originalDisplay = this.domElement.style.display;

	this.getID = function() {
		var id = undefined;

		if(this.domElement !== undefined) {
			id = this.domElement.id;
		}

		return id;
	};

	this.hide = function() {
		if(this.isVisible()) {
			this.domElement.style.display = "none";
			this.domElement.style.opacity = 0;
		}
	};

	this.show = function() {
		if(this.isHidden()) {
			this.domElement.style.display = "block";
			setTimeout(() => this.domElement.style.opacity = 1);

			var event = new CustomEvent('slideShowing');
			this.domElement.dispatchEvent(event);
		}
	};

	this.isVisible = function() {
		return !this.isHidden();
	};

	this.isHidden = function() {
		return this.domElement.style.display === "none";
	};

	this.onShow = function(e) {
		this.domElement.addEventListener('slideShowing', e);
	};

	this.onHide = function(e) {
		this.domElement.addEventListener('slideHiding', e);	
	};
};

function Slideshow() {
	var Slideshow = {
		_this : this,

		slides : function() {
			return document.querySelectorAll("#slides>.slide");
		},

		currentSlideIndex : undefined,

		currentSlide : undefined,

		next : function() {
			var nextSlide = undefined;

			if(this.currentSlideIndex !== undefined) {

				if(this.currentSlideIndex < this.slides().length - 1) {
					nextSlide = this.currentSlideIndex + 1;
				}
			} else {
				nextSlide = 0;
			}

			nextSlide++;
			this.goToSlide(nextSlide);
		},

		previous : function() {
			var previousSlide = undefined;

			if(this.currentSlideIndex !== undefined) {

				if(this.currentSlideIndex > 0) {
					previousSlide = this.currentSlideIndex - 1;
				}
			} else {
				previousSlide = 0;
			}

			previousSlide++;
			this.goToSlide(previousSlide);
		},

		goToSlide : function(slideToDisplay) {
			var previouslyDisplayedSlide = undefined;
			var newlyDisplayedSlide = undefined;

			if(this.currentSlide !== undefined) {
				previouslyDisplayedSlide = this.currentSlide.getID();
			}

			var indexToDisplay = undefined;

			if(slideToDisplay !== undefined) {
				var allSlides = this.slides();

				if(isNaN(slideToDisplay) || slideToDisplay > allSlides.length) {
					var loop = true;
					var index = 0;
					

					while(loop && index < allSlides.length) {
						var slide = allSlides[index];

						if(slide && slide.id === slideToDisplay) {
							loop = false;
							indexToDisplay = index;
						}

						index++;
					}

				} else if(slideToDisplay <= allSlides.length) {
					indexToDisplay = slideToDisplay - 1;
				}

				if(indexToDisplay !== undefined) {
					if(this.currentSlide !== undefined) {
						this.currentSlide.hide();
					}
					
					this.currentSlideIndex = parseInt(indexToDisplay);
					this.currentSlide = new Slide(this.slides()[indexToDisplay]);
					this.currentSlide.show();
					newlyDisplayedSlide = this.currentSlide.getID();
					window.location.hash = "#slide=" + this.currentSlide.getID();
				}
			}

			if(previouslyDisplayedSlide !== newlyDisplayedSlide && newlyDisplayedSlide !== undefined) {
				// Fire change slide event
				var event = new CustomEvent('slidechangedevent', { 'detail' : {
					'currentSlide': this.currentSlide.getID()
				}});
				document.getElementById("slides").dispatchEvent(event);
			}
		},

		getCurrentSlideID : function() {
			var slideId = undefined;

			if(this.currentSlide !== undefined) {
				slideId = this.currentSlide.getID();
			}

			return slideId;
		},

		onSlideChanged : function(e) {
			document.getElementById("slides").addEventListener('slidechangedevent', e);
		},

		adjustSlideSize : function() {
			var slidesDiv = document.getElementById("slides");
			slidesDiv.style.height = "auto";
			slidesDiv.style.width = "auto";
      		slidesDiv.style.height = slidesDiv.getBoundingClientRect().height + 'px';
      		slidesDiv.style.width = slidesDiv.getBoundingClientRect().width + 'px';
		},

		enableSlidesAdjustement : function() {
			window.addEventListener("resize", this.adjustSlideSize);
		}
	};

	// Initialize key events
	document.addEventListener('keydown', function(e) {
		switch(e.keyCode) {
			case 37:
				Slideshow.previous();
				e.stopPropagation();
				e.preventDefault();
				break;
			case 39:
				Slideshow.next();
				e.stopPropagation();
				e.preventDefault();
				break;
		}
	});

	var printMode = window.location.search.match( /print=true/gi );

	// Populate slide IDs and put transition
	var allSlides = Slideshow.slides();
	for(var slideIndex = 0; slideIndex < allSlides.length; slideIndex++) {
		var slide = allSlides[slideIndex];

		if(slide.id === "") {
			var timestamp;
			
			do {
				timestamp = Date.now() + "";
			} while(document.getElementById(timestamp) !== null);
			

			slide.id = timestamp;
		}

		slide.style.transition = "opacity 500ms ease";

		if(!printMode) {
			new Slide(slide).hide();
		} else {
			slide.style.transform = "scale(1)";
		}
	}

	var slideParamName = "slide=";
	var hash = window.location.hash;
	var slideHashIndex = hash.indexOf(slideParamName);

	var initialSlide = 1;

	if(slideHashIndex !== -1) {
		var slideIndex = hash.substring(slideHashIndex + slideParamName.length);
		initialSlide = slideIndex;
	}

	if(!printMode) {
		Slideshow.enableSlidesAdjustement();
		Slideshow.goToSlide(initialSlide);
	}

	return Slideshow;
}