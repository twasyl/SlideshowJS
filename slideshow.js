// SlideshowJS 0.4
function Slide(domElement) {
	this.domElement = domElement;
	this.originalDisplay = this.domElement.style.display;
	this.nestedSlide = this.domElement.querySelector('.slide') || undefined;
	this.isNestedSlide = this.domElement.parentElement !== document.getElementById("slides");

	this.getID = function() {
		var id = undefined;
		
		if(this.domElement !== undefined) {
			id = this.domElement.id;
		}
		
		return id;
	};

	this.checkID = function() {
		if (!this.getID()) {
			var timestamp;
			
			do {
				timestamp = Date.now() + "";
			} while(document.getElementById(timestamp) !== null);
			
			this.domElement.id = timestamp;
		}
	};
	
	this.style = function(key, value) {
		this.domElement.style[key] = value;
	};

	this.parentSlide = function() {
		if (this.isNestedSlide) {
			return new Slide(this.domElement.parentElement);
		}
		return undefined;
	};

	this.previousSlide = function(siblingOnly) {
		var previousDomElement = this.domElement.previousElementSibling;

		if (previousDomElement) {
			return new Slide(previousDomElement);
		} else if (this.isNestedSlide && !siblingOnly) {
			var parentSlide = this.parentSlide();

			if (parentSlide) {
				return parentSlide.previousSlide();
			}
		}
		return undefined;
	}

	this.nextSlide = function(siblingOnly) {
		var nextDomElement = this.domElement.nextElementSibling;

		if (nextDomElement) {
			return new Slide(nextDomElement);
		} else if (this.isNestedSlide && !siblingOnly) {
			var parentSlide = this.parentSlide();

			if (parentSlide) {
				return parentSlide.nextSlide();
			}
		}

		return undefined;
	}

	this.hide = function() {
		if (this.isVisible()) {
			this.domElement.style.display = "none";
			this.domElement.style.opacity = 0;

			if (this.isNestedSlide) {
				this.parentSlide().hide();
			}
		}
	};

	this.show = function() {
		if (this.isHidden()) {
			this.domElement.style.display = "block";

			setTimeout(() => {
				this.domElement.style.opacity = 1;
				if (this.isNestedSlide) {
					this.parentSlide().show();
				}
			});

			var event = new CustomEvent('slideShowing', {
				detail: {
					slide: this
				}
			});
			this.domElement.dispatchEvent(event);
		}
	};

	this.isVisible = function() {
		return !this.isHidden();
	};
	
	this.isHidden = function() {
		if (this.isNestedSlide) {
			return this.parentSlide().isHidden();
		}

		return this.domElement.style.display === "none";
	};	

	this.hasNestedSlides = function() {
		return this.nestedSlide !== undefined;
	};

	this.firstNestedSlide = function() {
		if (this.hasNestedSlides()) {
			return new Slide(this.nestedSlide);
		}

		return undefined;
	}

	this.onShow = function(e) {
		this.domElement.addEventListener('slideShowing', e);
	};

	this.onHide = function(e) {
		this.domElement.addEventListener('slideHiding', e);	
	};
};

function Slideshow(config) {
	var Slideshow = {
		_this : this,

		slides : function() {
			var nodes = document.querySelectorAll("#slides>.slide");
			var slides = [];

			if (nodes) {
				for (var index = 0; index < nodes.length; index++) {
					slides.push(new Slide(nodes[index]));
				}
			}

			return slides;
		},

		firstSlide : function() {
			return this.slides()[0];
		},

		slideById : function(id) {
			return new Slide(document.querySelector(`#${id}`));
		},

		currentSlideIndex : undefined,
		currentNestedSlideIndex : undefined,
		currentSlide : undefined,

		next : function() {
			var nextSlide = undefined;

			if (this.currentSlide) {
				if (this.currentSlide.isNestedSlide) {
					nextSlide = this.currentSlide.parentSlide().nextSlide();
				} else {
					nextSlide = this.currentSlide.nextSlide();
				}
			} else {
				nextSlide = this.firstSlide();
			}

			this.goToSlide(nextSlide);
		},

		nextNestedSlide : function() {
			var nextSlide = undefined;

			if (this.currentSlide && this.currentSlide.isNestedSlide) {
				nextSlide = this.currentSlide.nextSlide();
				this.goToSlide(nextSlide);
			}
		},

		previous : function() {
			var previousSlide = undefined;

			if (this.currentSlide) {
				if (this.currentSlide.isNestedSlide) {
					previousSlide = this.currentSlide.parentSlide().previousSlide();
				} else {
					previousSlide = this.currentSlide.previousSlide();
				}
			} else {
				previousSlide = this.firstSlide();
			}

			this.goToSlide(previousSlide);
		},

		previousNestedSlide : function() {
			var previousSlide = undefined;

			if (this.currentSlide && this.currentSlide.isNestedSlide) {
				previousSlide = this.currentSlide.previousSlide();
				this.goToSlide(previousSlide);
			}
		},

		goToSlide : function(slideToDisplay) {
			if (slideToDisplay) {
				var previouslyDisplayedSlide = undefined;

				if (this.currentSlide) {
					previouslyDisplayedSlide = this.currentSlide;
				}

				this.currentSlide = slideToDisplay;
				
				if (this.currentSlide.hasNestedSlides()) {
					this.currentSlide = this.currentSlide.firstNestedSlide();
				}

				if (previouslyDisplayedSlide && previouslyDisplayedSlide.getID() !== this.currentSlide.getID()) {
					previouslyDisplayedSlide.hide();
					// Fire change slide event
					var event = new CustomEvent('slidechangedevent', { 'detail' : {
						'currentSlide': this.currentSlide.getID()
					}});
					document.getElementById("slides").dispatchEvent(event);
				}

				this.currentSlide.show();
				window.location.hash = "#slide=" + this.currentSlide.getID();
			}
		},

		getCurrentSlideID : function() {
			var slideId = undefined;

			if (this.currentSlide) {
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
		},

		updateNavigationDisplay : function(slide) {
			var navigation = document.getElementById("navigation");
			var arrowDown = navigation.querySelector('.arrow-down');
			var arrowUp = navigation.querySelector('.arrow-up');
			
			if (slide.isNestedSlide) {
				if (slide.nextSlide(true)) {
					arrowDown.style.display = 'block';
				} else {
					arrowDown.style.display = 'none';
				}
	
				if (slide.previousSlide(true)) {
					arrowUp.style.display = 'block';
				} else {
					arrowUp.style.display = 'none';
				}
			} else if (!slide.hasNestedSlides()) {
				arrowDown.style.display = 'none';
				arrowUp.style.display = 'none';
			}
		},

		start: function() {
			var printMode = window.location.search.match( /print=true/gi );
			var displayNavigation = config && config.navigation;

			// Put transition
			var allSlides = Slideshow.slides();
			allSlides.forEach(slide => {
				slide.style("transition", "opacity 500ms ease");

				if (!printMode) {
					slide.hide();

					if (displayNavigation) { 
						slide.onShow(event => Slideshow.updateNavigationDisplay(event.detail.slide));
						
						if (slide.hasNestedSlides()) {
							var nestedSlide = slide.firstNestedSlide();

							do {
								nestedSlide.onShow(event => Slideshow.updateNavigationDisplay(event.detail.slide));
								nestedSlide = nestedSlide.nextSlide(true);
							} while (nestedSlide);
						}
					}

				} else {
					slide.style("transform", "scale(1)");
				}
			});

			var slideParamName = "slide=";
			var hash = window.location.hash;
			var slideHashIndex = hash.indexOf(slideParamName);

			var initialSlide = Slideshow.firstSlide();

			if(slideHashIndex !== -1) {
				var slideIndex = hash.substring(slideHashIndex + slideParamName.length);
				initialSlide = Slideshow.slideById(slideIndex);
			}

			if(!printMode) {
				Slideshow.enableSlidesAdjustement();
				Slideshow.goToSlide(initialSlide);
			}
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
			case 38:
				Slideshow.previousNestedSlide();
				e.stopPropagation();
				e.preventDefault();
				break;
			case 39:
				Slideshow.next();
				e.stopPropagation();
				e.preventDefault();
				break;
			case 40:
				Slideshow.nextNestedSlide();
				e.stopPropagation();
				e.preventDefault();
				break;
		}
	});

	// Populate slide IDs
	Slideshow.slides().forEach(slide => slide.checkID());
	return Slideshow;
}