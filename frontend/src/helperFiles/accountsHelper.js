import { DEFAULTVALUES, kpmgGreen } from './constants';
import {
  INFORMATIONLOCATIONPROGRESSBAR,
  PROGRESSBARLOGIC,
} from '../singlePage/components/CustomLinearProgress';

// enum used to access the informations contained in each line of scrittura, without worrying about the indices, in case they change
export const INFORMATIONLOCATIONINSETTINGS = Object.freeze({
  POSITION: 0,
  AMOUNT: 1, // default is 0
  FONTSIZE: 2, // default is 16px
  PROGRESSBARLOGIC: 3, // contains array with
  BARCOLOR: 4,
  ACCOUNTCOLOR: 5,
  ACCOUNTBACKGROUNDCOLOR: 6,
  SPorCE: 7,
});

export function createNewEntry(
  xValue = 0,
  yValue = 0,
  amount = DEFAULTVALUES.INITIALAMOUNTOFACCOUNT,
  fontsize = DEFAULTVALUES.FONTSIZE,
  progressBarLogic = PROGRESSBARLOGIC.SUMTOMAX, //TODO: mettere logic
  maxProgressBarValue = DEFAULTVALUES.MAXAMOUNTOFACCOUNT,
  barColor = DEFAULTVALUES.LIGHTBLUE,
  accountColor = DEFAULTVALUES.WHITE,
  backgroundColor = kpmgGreen
) {
  return [
    { x: xValue, y: yValue },
    amount,
    fontsize,
    [progressBarLogic, maxProgressBarValue],
    barColor,
    accountColor,
    backgroundColor,
  ];
}

export function resetDisplayedAccountsInfo(displayedAccountsInfo) {
  const newDisplayedAccountsInfo = new Map(displayedAccountsInfo);
  for (const [key, value] of displayedAccountsInfo) {
    value[INFORMATIONLOCATIONINSETTINGS.AMOUNT] = 0;
    newDisplayedAccountsInfo.set(key, value);
  }
  return newDisplayedAccountsInfo;
}

// Getters
export function getAccountPosition(element) {
  return element[INFORMATIONLOCATIONINSETTINGS.POSITION];
}

export function getInitialAccountValue(element) {
  return element[INFORMATIONLOCATIONINSETTINGS.AMOUNT];
}

export function getMaxAccountValue(element) {
  return element[INFORMATIONLOCATIONINSETTINGS.PROGRESSBARLOGIC][
    INFORMATIONLOCATIONPROGRESSBAR.MAXVALUE
  ];
}

export function getProgressBarLogic(element) {
  const pbl = element[INFORMATIONLOCATIONINSETTINGS.PROGRESSBARLOGIC];
  const sl = pbl[INFORMATIONLOCATIONPROGRESSBAR.SELECTEDLOGIC];
  return sl;
}

export function getProgressBarMaxValue(element) {
  return element[INFORMATIONLOCATIONINSETTINGS.PROGRESSBARLOGIC][
    INFORMATIONLOCATIONPROGRESSBAR.MAXVALUE
  ];
}

export function getSelectedBarColor(element) {
  return element[INFORMATIONLOCATIONINSETTINGS.BARCOLOR];
}

export function getSelectedAccountColor(element) {
  return element[INFORMATIONLOCATIONINSETTINGS.ACCOUNTCOLOR];
}
getSelectedAccountBackgroundColor;

export function getSelectedAccountBackgroundColor(element) {
  return element[INFORMATIONLOCATIONINSETTINGS.ACCOUNTBACKGROUNDCOLOR];
}
export function getFontSize(element) {
  return element[INFORMATIONLOCATIONINSETTINGS.FONTSIZE];
}

export function getSPCEType(element) {
  return element[INFORMATIONLOCATIONINSETTINGS.SPorCE];
}
