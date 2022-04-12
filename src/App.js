import React, { useState, useEffect } from "react";

import styles from "./App.module.scss";

const rgbToHex = (rgb) => {
  const toHex = (color) => {
    const hex = color.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  };

  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
};

const hexToRgb = (hex) => {
  const hexParts = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return hexParts
    ? {
        r: parseInt(hexParts[1], 16),
        g: parseInt(hexParts[2], 16),
        b: parseInt(hexParts[3], 16)
      }
    : null;
};

/* Color Variables */
const startColor = hexToRgb("#fd746d");
const endColor = hexToRgb("#ffbd97");
const numSteps = 100; // number of steps we want to increment towards the target color by
const stepValues = {
  r: endColor.r - startColor.r,
  g: endColor.g - startColor.g,
  b: endColor.b - startColor.b
};

/* Wavy Variables */
const numCurves = 15; // arbitrary number of desired curves
const curveStartX = 0; // curve path's beginning x value
const curveEndX = 300; // curve path's ending x value
const curveWidth = (curveEndX - curveStartX) / numCurves; // width of each complete curve
const curveSegmentXIncrement = curveWidth / 4.0; // width of each "part" of a curve
const curveLowY = 3; // bottom of the curve hits this y value
const curveHighY = -1; // top of the curve goes up to this y value

const App = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    setMouse({ x: event.x, y: event.y });
  };

  const [favColor, setFavColor] = useState(startColor);
  const [percentOffset, setPercentOffset] = useState(0); // how far we offset from the first color to the second color
  const [incrementBy, setIncrementBy] = useState(1); // keep track of whether we want to increment or decrement the percentOffset

  // Bounce back between the start and end colors
  const updateColor = () => {
    const newPercentOffsetRaw = percentOffset + incrementBy * (1 / numSteps); // get the percentOffset for this step
    const newPercentOffset = Math.round(newPercentOffsetRaw * 100) / 100; // get rounded value for convenience
    setPercentOffset(newPercentOffset);

    const newColor = {
      r: Math.round(startColor.r + stepValues.r * newPercentOffset),
      g: Math.round(startColor.g + stepValues.g * newPercentOffset),
      b: Math.round(startColor.b + stepValues.b * newPercentOffset)
    }; // get the color resulting from offsetting with the newPercentOffset

    if (newPercentOffset <= 0) {
      setIncrementBy(1); // if we've reached the first color, we want to start incrementing
      return startColor;
    }
    if (newPercentOffset >= 1) {
      setIncrementBy(-1); // if we've reached the second color, we want to start decrementing
      return endColor;
    }
    return newColor;
  };

  useEffect(() => {
    const id = setInterval(() => setFavColor(updateColor()), 400); // with every interval, update the fav color

    return () => {
      clearInterval(id);
    };
  }, [percentOffset]); // incrementBy needs to be a dependency so that we use its new value whenever it's updated

  return (
    <div className={styles.pageContainer} onMouseMove={() => handleMouseMove(event)}>
      <NameText mouse={mouse} favColor={favColor} />
      <div className={styles.descriptionContainer}>
        <div className={styles.links}>
          <WavyLink linkTo="https://dainryoo.github.io/resume.pdf" linkText="Resume" />
          <WavyLink linkTo="https://linkedin.com/in/dainryoo" linkText="Linkedin" openNewTab />
          <WavyLink linkTo="https://github.com/dainryoo" linkText="Github" openNewTab />
        </div>
        <div className={styles.descriptionText}>
          Hi, I'm Da-In! I am a software engineer focused on front-end development, currently working with React and
          Node.js for{" "}
          <span>
            <a href="https://developer.ibm.com/" target="_blank">
              IBM Developer
            </a>
          </span>
          .
        </div>
        <div className={styles.descriptionText}>
          I live in Austin, TX. My favorite restaurants here are Intero, Spread & Co, and Dai Due. I like baking and
          reading in my free time, and my favorite color is somewhere around <FavoriteColor favColor={favColor} />
        </div>
      </div>
    </div>
  );
};

// The Big Name text, animated based on mouse position and colored based on favColor
const NameText = ({ mouse, favColor }) => {
  const screenDimensions = document.getElementById("root")?.getBoundingClientRect();
  const mouseXDistancePercentage = (mouse.x * 1.0) / screenDimensions.width;

  const firstNameStart = { x: 68, y: 24 };
  const lastNameStart = { x: 53, y: 42 };
  const exclamStart = { x: 124, y: 68 };

  const firstNameEnd = { x: 68, y: 20 };
  const lastNameEnd = { x: 68, y: 42 };
  const exclamEnd = { x: 124, y: 42 };

  const firstNameOffset = {
    x: (firstNameEnd.x - firstNameStart.x) * mouseXDistancePercentage,
    y: (firstNameEnd.y - firstNameStart.y) * mouseXDistancePercentage
  };
  const lastNameOffset = {
    x: (lastNameEnd.x - lastNameStart.x) * mouseXDistancePercentage,
    y: (lastNameEnd.y - lastNameStart.y) * mouseXDistancePercentage
  };
  const exclamOffset = {
    x: (exclamEnd.x - exclamStart.x) * mouseXDistancePercentage,
    y: (exclamEnd.y - exclamStart.y) * mouseXDistancePercentage
  };

  const firstNameCurr = { x: firstNameStart.x + firstNameOffset.x, y: firstNameStart.y + firstNameOffset.y };
  const lastNameCurr = { x: lastNameStart.x + lastNameOffset.x, y: lastNameStart.y + lastNameOffset.y };
  const exclamCurr = { x: exclamStart.x + exclamOffset.x, y: exclamStart.y + exclamOffset.y };

  return (
    <div className={styles.nameText}>
      <svg className={styles.mobileTitle} viewBox="0 0 300 60">
        <text style={{ stroke: rgbToHex(favColor) }} y="50">
          Da-In Ryoo
        </text>
      </svg>
      <svg className={styles.desktopTitle} viewBox="0 0 200 50">
        <text style={{ stroke: rgbToHex(favColor) }} x={firstNameCurr.x} y={firstNameCurr.y}>
          Da-In
        </text>
        <text style={{ stroke: rgbToHex(favColor) }} x={lastNameCurr.x} y={lastNameCurr.y}>
          Ryoo
        </text>
        <text style={{ stroke: rgbToHex(favColor) }} x={exclamCurr.x} y={exclamCurr.y}>
          !
        </text>
      </svg>
    </div>
  );
};

// Special links with animated interactive wavy underlines
const WavyLink = ({ linkTo, linkText, openNewTab }) => {
  return (
    <a className={styles.link} href={linkTo} target={openNewTab ? "_blank" : ""}>
      <div className={styles.linkText}>{linkText}</div>
      <WavyUnderline />
    </a>
  );
};

// Animated wavy underline for WavyLink
const WavyUnderline = () => {
  const getCurvePath = () => {
    const curves = []; // store curve data points in array

    let currCurveNum = 1; // keep track of current curve we're drawing
    while (numCurves >= currCurveNum) {
      const currStartX = (currCurveNum - 1) * curveWidth + curveStartX;
      curves.push("Q");
      curves.push(
        `${currStartX + curveSegmentXIncrement * 1} ${curveHighY}, ${
          currStartX + curveSegmentXIncrement * 2
        } ${curveLowY}`
      );
      curves.push("T");
      curves.push(`${currStartX + curveSegmentXIncrement * 4} ${curveLowY}`);
      currCurveNum++;
    }
    return `M ${curveStartX} ${curveLowY} ${curves.join(" ")}`; // turn the array into an SVG path data string
  };

  return (
    <div className={styles.svgContainer}>
      <div className={styles.underlineContainer}>
        <svg className={styles.underline}>
          <path d={getCurvePath()}></path>
        </svg>
      </div>
    </div>
  );
};

// A block of text showing a little color block and its color hex code
const FavoriteColor = ({ favColor }) => {
  return (
    <div className={styles.colorHexText}>
      <span className={styles.colorSquare} style={{ backgroundColor: rgbToHex(favColor) }}></span>
      {rgbToHex(favColor)}.
    </div>
  );
};

export default App;
