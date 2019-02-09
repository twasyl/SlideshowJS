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

All slides must be a child of an element with the ID **slides** and be an element with the `slide` class:

```html
<html>
  <head>
    <script src="slideshow.js" type="text/javascript" charset="utf-8"></script>
  </head>
  <body>
    <div id="slides">
      <section class="slide">
        <h1>Slide 1</h1>
      </section>
      <section class="slide">
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

## Nested slides

It is possible to have nested slides:

```html
<div id="slides">
  <section class="slide">

    <section class="slide">
    </section>

    <section class="slide">
    </section>

  </section>

  <section class="slide">
  </section>
```

## Navigation

In order to display navigation elements when there are some nested slides, add an element with the `navigation` ID and containing two elements:

- a container having the `arrow-up` class
- a container having the `arrow-down` class

Then when instantiating the slideshow, define to use navigation :

```html
<script type="text/javascript" charset="utf-8">
  slideshow = Slideshow({ navigation : true });
</script>
```

### Full example

```html
<html>
  <head>
    <script src="slideshow.js" type="text/javascript" charset="utf-8"></script>
  </head>
  <body>
    <div id="slides">
      <section class="slide">
        <h1>Slide 1</h1>
      </section>
      <section class="slide">
        <h1>Slide 2</h1>
      </section>
    </div>
    <div id="navigation">
      <div class="arrow-up"></div>
      <div class="arrow-down"></div>
    </div>
    <script type="text/javascript" charset="utf-8">
      slideshow = Slideshow({ navigation : true });
    </script>
  </body>
</html>
```

## Printing

In order to enter a printing mode, simple add a query parameter `print=true` in the address:

```html
file:///Users/me/SlideshowJS/sample.html?print=true
```

