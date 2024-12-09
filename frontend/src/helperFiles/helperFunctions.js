import {
  dareDelay,
  circleDeletionDelay,
  INFORMATIONLOCATIONINSCRITTURA,
  VISUALIZATIONROUNDINGSELECTION,
  CONFIGURATIONFILEPATH,
  CONFIGURATIONFILENAME,
  DEFAULTVALUES,
  JSONFILEMAPKEYS,
} from './constants';

import { INFORMATIONLOCATIONINSETTINGS } from './accountsHelper';

export function getRC() {
  return [
    'Revenues',
    'Credits',
    'VAT',
    'Tickets',
    'Costs',
    'Invoices',
    'Taxes',
    'Accounts',
    'Debts',
    'ICO Credits',
  ];
}

function removewithfilter(arr) {
  let outputArray = arr.filter(function (v, i, self) {
    return i == self.indexOf(v);
  });

  return outputArray;
}

export function getAvailableAccounts(arrayDiScritture) {
  // expects an array of arrays
  var foundScritture = [];
  for (const scrittura of arrayDiScritture) {
    for (var i = 0; i < scrittura.length; i++) {
      foundScritture = foundScritture.concat(
        scrittura[i][INFORMATIONLOCATIONINSCRITTURA.ACCOUNT]
      );
    }
  }
  return removewithfilter(foundScritture);
}

export function get1DIndexFrom2D(rowIdx, colIdx, numCols) {
  return rowIdx * numCols + colIdx;
}

// this is used to give an id to every created cell, starting from cell-A-1
export function formatCellIdLabel(rowLabel, colLabel) {
  return 'cell-' + rowLabel + '-' + colLabel;
}

export function getCellLocation(cellIdx, numCols) {
  const rowIdx = Math.floor(cellIdx / numCols);
  const colIdx = cellIdx % numCols;
  return { rowIdx, colIdx };
}

export const getRowLabel = (index) => {
  // this function works by considering that the first row of the table has index 1
  // so if you give index == 0 the output is not consistent.
  // Just to not make issues arise, it gets the maximum between index and 1
  index = Math.max(index, 1);
  let label = '';
  while (index >= 0) {
    label = String.fromCharCode((index % 26) + 64) + label; // 64 is ASCII code for 'A'
    index = Math.floor(index / 26) - 1;
  }
  return label;
};

export function getCenterPoint(positions) {
  if (positions.length === 0) {
    throw new Error('Array of positions must not be empty');
  }

  let totalX = 0;
  let totalY = 0;

  for (let i = 0; i < positions.length; i++) {
    totalX += positions[i].x;
    totalY += positions[i].y;
  }

  const centerX = totalX / positions.length;
  const centerY = totalY / positions.length;

  return { x: centerX, y: centerY };
}

export function getDareAvereColor(foundString) {
  var myBackgroundColor = undefined;
  if (foundString !== undefined) {
    if (foundString == 'dare') {
      myBackgroundColor = 'red';
    } else if (foundString == 'avere') {
      myBackgroundColor = 'green';
    }
  }
  return myBackgroundColor;
}

function arrayAndMapContainSameValues(array, map) {
  if (array.length !== map.size) {
    return false;
  }

  const mapValues = new Set(map.values());

  for (let value of array) {
    if (!mapValues.has(value)) {
      return false;
    }
  }

  return true;
}

function arraysHaveSameElements(arr1, arr2) {
  // Check if arrays have the same length
  if (arr1.length !== arr2.length) return false;

  // Sort both arrays
  const sortedArr1 = [...arr1].sort();
  const sortedArr2 = [...arr2].sort();

  // Compare each element
  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) return false;
  }

  return true;
}

export function allAccountsAreDisplayed(foundRC, selectedRC) {
  return arraysHaveSameElements(foundRC, Array.from(selectedRC.keys()));
}

export function getKeyByLocationInTable(map, value) {
  for (let [key, val] of map) {
    if (val.locationInTable === value) {
      return key;
    }
  }
  return null;
}

// centerOfRCOfCurrentScrittura: this indicates where the circles should go to if dare, or where they come from if avere
// circleRC: indicates the location of the cell representing the RC of the specific circle
// lineDareAvere: indicates whether this line (circle) is dare or avere
// normalized amount: the amount is the money flow associated to the circle
//
// Returns:
// circleStartLocation:
// circleEndLocation:
// circleRadius:
// delay: indicates when the circle should start. If avere will have a delay, indicate in seconds
export function getCircleProperties(
  centerOfRCOfCurrentScrittura,
  circleRC,
  lineDareAvere,
  scritturaDuration
) {
  var circleStartLocation, circleEndLocation, delay, duration;
  duration = scritturaDuration / 2;
  delay = 0;
  if (lineDareAvere == 'd') {
    circleStartLocation = centerOfRCOfCurrentScrittura;
    circleEndLocation = circleRC;
    delay = duration;
  } else {
    circleEndLocation = centerOfRCOfCurrentScrittura;
    circleStartLocation = circleRC;
  }

  return {
    circleStartLocation,
    circleEndLocation,
    circleDelay: delay,
    circleDuration: duration,
  };
}

export function determineDareOrAvereFromAmount(amount) {
  if (amount > 0) {
    return 'd';
  }
  return 'a';
}

export function getInitialAccountValueInputTextId(account) {
  return 'cell-input-' + account;
}

export function getLocationInGrid(displayedAccountsInfo, account) {
  return displayedAccountsInfo.get(account)[
    INFORMATIONLOCATIONINSETTINGS.POSITION
  ];
}

export function extractAccounts(json) {
  const flattened = json.flatMap((innerArr) => innerArr);

  const valuesAtIndex2 = flattened
    .map((subArr) => subArr[INFORMATIONLOCATIONINSCRITTURA.ACCOUNT])
    .filter((value) => value !== undefined);

  const uniqueValues = [...new Set(valuesAtIndex2)];

  return uniqueValues;
}

export function getRGBColor(colorString) {
  return 'rgb(' + colorString + ')';
}

export function formatValue(value, roundingFormat) {
  var decimalsAfterComma = 2;
  if (roundingFormat == VISUALIZATIONROUNDINGSELECTION.MILLIONS)
    decimalsAfterComma = 1;
  value = parseFloat(value);
  value = value / roundingFormat;
  value = value.toFixed(decimalsAfterComma);
  let isNegative = value < 0;
  let absoluteValue = Math.abs(value);

  let formattedNumber = absoluteValue.toLocaleString('it-IT', {
    minimumFractionDigits: decimalsAfterComma,
    maximumFractionDigits: decimalsAfterComma,
  });

  if (isNegative) {
    return `(${formattedNumber})`;
  }

  return formattedNumber;
}

export function stringRepresentsNumber(str) {
  return /^[+-]?\d+([.,]\d+)?$/.test(str);
}

// from dd/mm/yyyy to yyyy-mm-dd
export function formatDateToStandard(toReverse) {
  const [day, month, year] = toReverse.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

// from yyyy-mm-dd to dd/mm/yyyy
export function formatDateToDDMMYYYY(value) {
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

export function getStandardPositionForAccount(account) {
  var x, y;
  switch (account) {
    case 'Ricavi':
      x = 112;
      y = 390;
      break;
    case 'IVA':
      x = 119;
      y = 576;
      break;
    case 'Altre Voci CE':
      x = 351;
      y = 642;
      break;
    case 'FT/NC da Emettere':
      x = 424;
      y = 268;
      break;
    case 'Clienti':
      x = 652;
      y = 390;
      break;
    case 'Banca':
      x = 1317;
      y = 390;
      break;
    case 'Fornitori':
      x = 1240;
      y = 191;
      break;
    case 'Transitori Ri.Ba.':
      x = 914;
      y = 528;
      break;
    case 'Altre Voci SP':
      x = 1196;
      y = 611;
      break;
    case 'Ricavi':
      x = 109;
      y = 375;
      break;
    case 'Factoring':
      x = 881;
      y = 166;
      break;
    case 'Altri Ricavi':
      x = 219;
      y = 126;
      break;
  }
  return { x, y };
}

export function saveMapToJson(map, backgroundColor) {
  const toSaveMap = new Map();
  toSaveMap.set(JSONFILEMAPKEYS.BACKGROUNDCOLOR, backgroundColor);
  toSaveMap.set(JSONFILEMAPKEYS.ACCOUNTENTRIES, map);

  // Check if the map is valid
  if (!(map instanceof Map)) {
    throw new Error('Input must be a Map');
  }

  const serializedMap = new Map(
    [...toSaveMap.entries()].map(([key, value]) => [
      key,
      value instanceof Map ? [...value.entries()] : value,
    ])
  );

  const obj = Object.fromEntries(serializedMap);
  const jsonContent = JSON.stringify(obj, null, 2);

  // Create a Blob with JSON content
  const blob = new Blob([jsonContent], { type: 'application/json' });

  // Create a link to download the Blob
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = CONFIGURATIONFILENAME;
  a.click();

  console.log('Map has been saved as a JSON file');
}

export function convertTextInputToFloat(inputValue) {
  // returns null if the conversion fails

  // constraint: non deve avere separatori delle migliaia
  // può avere punto o virgola come separatore decimali
  var newInitialValue = inputValue.toString();
  newInitialValue = parseFloat(newInitialValue.replace(',', '.'));

  return newInitialValue;
}

export function modalSettingsArray(
  backgroundColor,
  circleLifecycleDuration,
  delayBetweenScritture
) {
  // keep it consistent with SETTINGSLOCATION
  return [backgroundColor, circleLifecycleDuration, delayBetweenScritture];
}

export function getTimingSettings(
  circleLifecycleDuration,
  delayBetweenScritture
) {
  // keep it consistent with TIMINGSETTINGSLOCATION
  return [circleLifecycleDuration, delayBetweenScritture];
}
