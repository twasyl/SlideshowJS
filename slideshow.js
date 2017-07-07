/**
 * Represent a Slide object.
 */
function Slide(domElement) {
	this.domElement = domElement;

    /**
      * Get the ID of the silde. The ID is represented by the
      * ID attribute of the HTML element corresponding to the
      * slide. If the HTML element is undefined, undefined
      * will be returned by this function.
      */
	this.getID = function() {
		var id = undefined;

		if(this.domElement !== undefined) {
			id = this.domElement.id;
		}

		return id;
	};

	/**
	  * Hides the slide. If the slide is currently visible,
	  * then the style "display: none" and "opacity: 0" is
	  * set to the HTML element of the slide. Otherwise
	  * nothing is done on the slide.
	  */
	this.hide = function() {
		if(this.isVisible()) {
			this.domElement.style.display = "none";
			this.domElement.style.opacity = 0;
		}
	};

	/**
	  * Shows the slide. If the slide is currently hidden,
	  * then the style "display: block" and "opacity: 1" is
	  * set to the HTML element of the side. Otherwise
	  * nothing is done on the slide.
	  * If the slide is shown by this method, an event called
	  * "slideShowing" is raised.
	  */
	this.show = function() {
		if(this.isHidden()) {
			this.domElement.style.display = "block";
			setTimeout(() => this.domElement.style.opacity = 1);

			var event = new CustomEvent('slideShowing');
			this.domElement.dispatchEvent(event);
		}
	};

	/**
	  * Determine if the silde is currently visible.
	  */
	this.isVisible = function() {
		return !this.isHidden();
	};

	/**
	  * Determine if the slide is currently hidden by checking
	  * that it's display is equal to "none".
	  */
	this.isHidden = function() {
		return this.domElement.style.display === "none";
	};

	/**
	  * Allow to define an action performed when the slide
	  * is shown by listening to an event named "slideShowing".
	  * @param e 
	  *			 A function that will be called when the slide
	  *			 is shown.
	  */
	this.onShow = function(e) {
		this.domElement.addEventListener('slideShowing', e);
	};

	/**
	  * Allow to define an action performed when the slide
	  * is hidden by listening to an event named "slideHiding".
	  * @param e 
	  *			 A function that will be called when the slide
	  *			 is hiding.
	  */
	this.onHide = function(e) {
		this.domElement.addEventListener('slideHiding', e);	
	};
};

function Slideshow() {
	var Slideshow = {
		_this : this,

		slides : function() {
			return document.querySelectorAll("#slides>section.slide");
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
		Slideshow.goToSlide(initialSlide);
	} else {
		slide.style.transform = "scale(1)";
	}

	return Slideshow;
}