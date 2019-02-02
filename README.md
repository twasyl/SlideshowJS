# Introduction

SlideshowJS is a _simple_, _vanilla_ library allowing to create a slide deck in HTML. The library does not have any dependencies and is meant to be used to create [SlideshowFX](https://github.com/twasyl/SlideshowFX) templates, but can also be used as a standalone framework.

# Usage

In order to use SlideshowJS, include the library in your HTML.

```html
<html>
  <head>
    <script src="slideshow.js" type="text/javascript" charset="utf-8"></script>
  </head>
</html>
```

Then, at the end of your body, add the following JS snippet:

```html
<html>
  <body>
    <script type="text/javascript" charset="utf-8">
		slideshow = Slideshow();
	</script>
  </body>
</html>
```

All slides must be a child of an element with the ID **slides** and be a `section`element:

```html
<html>
  <head>
    <script src="slideshow.js" type="text/javascript" charset="utf-8"></script>
  </head>
  <body>
    <div id="slides">
      <section>
        <h1>Slide 1</h1>
      </section>
      <section>
        <h1>Slide 2</h1>
      </section>
    </div>
    <script type="text/javascript" charset="utf-8">
		slideshow = Slideshow();
	</script>
  </body>
</html>
```

Then you can navigate through slides using the **left** and **right** arrows.

## Printing

In order to enter a printing mode, simple add a query parameter `print=true`in the address:

```html
file:///Users/me/SlideshowJS/sample.html?print=true
```

