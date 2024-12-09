export const dareDelay = 0.1; // percentage
export const circleDeletionDelay = 0.5; //percentage

export const defaultScritturaDuration = 2; //seconds
export const defaultNextScritturaDelay = 100; //milliseconds

export const minCircleRadius = 6;
export const maxCircleRadius = 30;

export const progressBarWidth = '120px';

const scrittura1Old = [
  [1, 'a', -5, 0.5, 'a'],
  [1, 'b', -5, 0.5, 'a'],
  [1, 'c', 10, 1, 'd'],
];
const scrittura2Old = [
  [1, 'a', -5, 0.25, 'a'],
  [1, 'd', -5, 0.25, 'a'],
  [1, 'b', -5, 0.5, 'a'],
  [1, 'a', 10, 0.5, 'd'],
  [1, 'b', 10, 0.5, 'd'],
];
const scrittura3Old = [
  [2, 'c', -10, 1, 'a'],
  [2, 'b', 10, 1, 'd'],
];

export const INFORMATIONLOCATIONINSCRITTURA = Object.freeze({
  DATE: 0,
  INDEX: 1,
  ACCOUNT: 3,
  AMOUNT: 4,
  STEP: 5,
  NORMALIZEDAMOUNT: 8,
  DAREAVERE: 2,
  COLOR: 7,
});

export const SETTINGSLOCATION = Object.freeze({
  BACKGROUNDCOLOR: 0,
  CIRCLELIFECYCLEDURATION: 1,
  DELAYBETWEENSCRITTURE: 2,
});
export const TIMINGSETTINGSLOCATION = Object.freeze({
  CIRCLELIFECYCLEDURATION: 0,
  DELAYBETWEENSCRITTURE: 1,
});

export const DEFAULTVALUES = Object.freeze({
  INITIALAMOUNTOFACCOUNT: 0,
  MAXAMOUNTOFACCOUNT: 1, // not zero because it will be in divisor in a division
  LIGHTBLUE: '#7EB6F3',
  GREY: '#AAAAAA',
  WHITE: '#FFFFFF',
  CONTROLSBACKGROUNDCOLOR: '#FFFFFF',
  FONTSIZE: 20,
});

export const ZINDEX = Object.freeze({
  NAVBAR: 1000,
  DATE: 1000,
  CLICKABLE: 10,
  CIRCLES: 5,
  ACCOUNTSDIV: 2,
  LINES: 1,
});

export const JSONFILEMAPKEYS = Object.freeze({
  BACKGROUNDCOLOR: 'backgroundColor',
  ACCOUNTENTRIES: 'accountEntries',
});

export const VISUALIZATIONROUNDINGSELECTION = Object.freeze({
  UNITY: 1,
  THOUSANDS: 1000,
  MILLIONS: 1000000,
});

export const SPorCELABEL = Object.freeze({
  SP: 'SP',
  CE: 'CE',
});

export const PLAYMODALITYSELECTION = Object.freeze({
  CIRCLES: 0,
  LINES: 1,
  VARIANTS: 2,
});

export const CONFIGURATIONFILEPATH = './';
export const CONFIGURATIONFILENAME = 'accountSettings.json';

export const drawTrail = false;
export const numberOfSegments = 50; // The number of circles for the trail
export const transparency = 0.1;
export const drawLine = true;

export const kpmgGreen = '#098E7E';
export const kpmgBlue = '#7213EA';
export const accountBackgroundOpacity = '80'; //means 0.5
