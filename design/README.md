# ARCS Corporate Design

Corporate design elements for all ARCS projects and tools.

## Installation

Use one of the following:

```bash
yarn add arcs-vr/arc-cd
npm install arcs-vr/arc-cd
```

## Usage

```scss
// import all
@import '~arc-cd';

// or separate files
@import '~arc-cd/src/variables';
@import '~arc-cd/src/typography';
@import '~arc-cd/src/fonts';
@import '~arc-cd/src/reset';
```

The "variables" module provides the following SCSS variables:

```scss
$theme-dark;
$theme-light;
$theme-primary;
$theme-secondary;

$font-heading;
$font-heading-style;
$font-heading-weight;

$font-paragraph;
$font-paragraph-style;
$font-paragraph-weight;
```

You can import the scss variables into JavaScript, as long as you use the webpack sass-loader:

```js

import ThemeColors from 'arc-cd/src/_variables.scss'

console.info(ThemeColors.dark)
console.info(ThemeColors.light)
console.info(ThemeColors.primary)
console.info(ThemeColors.secondary)

```

The "typography" module includes the following class:

```scss
.font-heading {
  // […] heading styles
}

.font-paragraph {
  // […] paragraph styles
}
```

It also provides the logo in two version:

- `images/arc-logo-large.jpg (500px &times; 500px)`
- `images/arc-logo-small.jpg (128px &times; 128px)`

For convenience also as html and vue templates:

- `template/arc-logo.html`
- `template/ArcLogo.vue`

## More

Look at the [`arcs-vr/arc-aframe-vue-template`](https://github.com/arcs-vr/arc-aframe-vue-template) for easier setup and at the
[`arcs-vr/arc-aframe-vue-demo`](https://github.com/arcs-vr/arc-aframe-vue-demo) for example usage.
