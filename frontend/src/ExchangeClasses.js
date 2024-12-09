class BetweenVisualizationSettingAndAnimation {
  constructor(numRows, numCols, displayedAccountsInfo, scritture) {
    this.numRows = numRows; //int
    this.numCols = numCols; //int
    this.displayedAccountsInfo = displayedAccountsInfo; //Map
    this.scritture = scritture; // [ [ ], [ ], ...]
  }
}

class BetweenDataUploadAndVisualizationSetting {
  constructor(scritture, foundAccounts, spOrCE) {
    this.scritture = scritture; // [ [ ], [ ], ...] array of arrays
    this.foundAccounts = foundAccounts; // [ ] array of strings
    this.spOrCE = spOrCE; // Map(string, string)
  }
}

export {
  BetweenDataUploadAndVisualizationSetting,
  BetweenVisualizationSettingAndAnimation,
};
