import React, { useState } from 'react';

import {
  Box,
  Button,
  FormControlLabel,
  FormControl,
  IconButton,
  Modal,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import NumberFieldWithTooltip from '../components/NumberFieldWithTooltip';
import {
  INFORMATIONLOCATIONPROGRESSBAR,
  PROGRESSBARLOGIC,
} from '../components/CustomLinearProgress';
import DelayedColorPicker from '../components/DelayedColorPicker';

import { DEFAULTVALUES } from '../../helperFiles/constants';
import {
  INFORMATIONLOCATIONINSETTINGS,
  getProgressBarMaxValue,
  getSelectedBarColor,
  getSelectedAccountColor,
  getSelectedAccountBackgroundColor,
} from '../../helperFiles/accountsHelper';
import {
  getInitialAccountValue,
  getMaxAccountValue,
  getProgressBarLogic,
  getFontSize,
} from '../../helperFiles/accountsHelper';
import {
  DELETEACCOUNTTEXT,
  SAVEMODIFICATIONSTEXT,
  SELECTBARCOLORTEXT,
  SELECTACCOUNTCOLORTEXT,
  SHOWPROGRESSBARCHECKBOXTEXT,
  SELECTACCOUNTBACKGROUNDCOLORTEXT,
} from '../../text/textITA';
import { convertTextInputToFloat } from '../../helperFiles/helperFunctions';
import { ModalRedBlueButtons } from '../components/ModalRedBlueButtons';
import Checkbox from '@mui/material/Checkbox';
import { ModalTitle } from '../components/ModalTitle';

export function AccountSettingsModal({
  account,
  deleteAccount,
  modalIsOpen,
  saveUpdates,
  discardChanges,
  toDisplayData,
}) {
  const [tempSelectedBarColor, setTempSelectedBarColor] = useState(
    getSelectedBarColor(toDisplayData)
  );

  const [tempSelectedAccountColor, setTempSelectedAccountColor] = useState(
    getSelectedAccountColor(toDisplayData)
  );

  const [
    tempSelectedAccountBackgroundColor,
    setTempSelectedAccountBackgroundColor,
  ] = useState(getSelectedAccountBackgroundColor(toDisplayData));

  const [progressBarLogic, setProgressBarLogic] = useState(
    getProgressBarLogic(toDisplayData)
  );

  const [stringInitialAccountValue, setStringInitialAccountValue] = useState(
    getValueToPresentInTextField(TEXTFIELDSELECTOR.ACCOUNTVALUE)
  );
  const [stringMaxAccountValue, setMaxInitialAccountValue] = useState(
    getValueToPresentInTextField(TEXTFIELDSELECTOR.ACCOUNTMAXVALUE)
  );

  const [newFontSize, setNewFontSize] = useState(getFontSize(toDisplayData));

  function getValueToPresentInTextField(textFieldSelection) {
    if (textFieldSelection == TEXTFIELDSELECTOR.ACCOUNTVALUE)
      return getInitialAccountValue(toDisplayData);
    else if (textFieldSelection == TEXTFIELDSELECTOR.ACCOUNTMAXVALUE)
      return getProgressBarMaxValue(toDisplayData);
  }

  // this function returns the object containing all the options for the specific account
  // so here it is necessary to handle the values that the user has chosen
  function handleClose() {
    var logicInfo = [];
    logicInfo[INFORMATIONLOCATIONPROGRESSBAR.SELECTEDLOGIC] =
      parseInt(progressBarLogic);

    toDisplayData[INFORMATIONLOCATIONINSETTINGS.AMOUNT] =
      convertTextInputToFloat(stringInitialAccountValue) ||
      DEFAULTVALUES.INITIALAMOUNTOFACCOUNT;

    // saves the max account anyway so that the values is not lost in case it will be needed later
    var selectedMaxValue = convertTextInputToFloat(stringMaxAccountValue);
    if (!selectedMaxValue || selectedMaxValue == 0) {
      selectedMaxValue = DEFAULTVALUES.MAXAMOUNTOFACCOUNT;
    }
    logicInfo[INFORMATIONLOCATIONPROGRESSBAR.MAXVALUE] = selectedMaxValue;

    toDisplayData[INFORMATIONLOCATIONINSETTINGS.PROGRESSBARLOGIC] = logicInfo;
    toDisplayData[INFORMATIONLOCATIONINSETTINGS.BARCOLOR] =
      tempSelectedBarColor;
    toDisplayData[INFORMATIONLOCATIONINSETTINGS.ACCOUNTCOLOR] =
      tempSelectedAccountColor;
    toDisplayData[INFORMATIONLOCATIONINSETTINGS.ACCOUNTBACKGROUNDCOLOR] =
      tempSelectedAccountBackgroundColor;

    toDisplayData[INFORMATIONLOCATIONINSETTINGS.FONTSIZE] = newFontSize;

    saveUpdates(account, toDisplayData);
  }

  function handleSetInitialValue(newValue) {
    setStringInitialAccountValue(newValue);
  }

  function handleSetMaxValue(newValue) {
    setMaxInitialAccountValue(newValue);
  }

  function handleIncreaseValue() {
    setNewFontSize((prevFontSize) => {
      return prevFontSize + 1;
    });
  }

  function handleDecreaseValue() {
    setNewFontSize((prevFontSize) => {
      return prevFontSize - 1;
    });
  }

  const initialValue = getInitialAccountValue(toDisplayData);
  const maxBarValue = getMaxAccountValue(toDisplayData);

  // Function to handle the change of progress bar behaviour
  function handleProgressBarLogicChange(value) {
    setProgressBarLogic(parseInt(value));
  }

  return (
    <Modal
      open={modalIsOpen}
      onClose={discardChanges}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Stack direction="column" className="modalContent" spacing={2}>
        <IconButton
          aria-label="close"
          onClick={discardChanges}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
        <ModalTitle title={account} />
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h6">Font size:</Typography>
          <Stack direction="column" alignItems="center">
            <IconButton
              onClick={handleIncreaseValue}
              aria-label="Increase font size"
              style={{ padding: '0' }}
            >
              <ArrowDropUpIcon />
            </IconButton>
            <Typography variant="h6">{newFontSize}</Typography>
            <IconButton
              onClick={handleDecreaseValue}
              aria-label="Decrease font size"
              style={{ padding: '0' }}
            >
              <ArrowDropDownIcon />
            </IconButton>
          </Stack>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h6">{SELECTBARCOLORTEXT}</Typography>
          <DelayedColorPicker
            color={tempSelectedBarColor}
            onChange={setTempSelectedBarColor}
            type="color"
            style={{
              width: '50px',
              height: '50px',
              border: 'none',
              cursor: 'pointer',
            }}
          />
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h6">{SELECTACCOUNTCOLORTEXT}</Typography>
          <DelayedColorPicker
            color={tempSelectedAccountColor}
            onChange={setTempSelectedAccountColor}
            type="color"
            style={{
              width: '50px',
              height: '50px',
              border: 'none',
              cursor: 'pointer',
            }}
          />
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h6">
            {SELECTACCOUNTBACKGROUNDCOLORTEXT}
          </Typography>
          <DelayedColorPicker
            color={tempSelectedAccountBackgroundColor}
            onChange={setTempSelectedAccountBackgroundColor}
            type="color"
            style={{
              width: '50px',
              height: '50px',
              border: 'none',
              cursor: 'pointer',
            }}
          />
        </Stack>
        <Stack direction="column" spacing={2}>
          <FormControl component="fieldset">
            <Box display="flex" flexDirection="row" alignItems="center">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={progressBarLogic === PROGRESSBARLOGIC.SUMTOMAX}
                    onChange={(e) =>
                      handleProgressBarLogicChange(
                        e.target.checked
                          ? PROGRESSBARLOGIC.SUMTOMAX
                          : PROGRESSBARLOGIC.NOTVISIBLE
                      )
                    }
                    name="progressBarCheckbox"
                  />
                }
                label={
                  <Typography variant="subtitle1">
                    {SHOWPROGRESSBARCHECKBOXTEXT}
                  </Typography>
                }
              />
            </Box>
          </FormControl>

          <NumberFieldWithTooltip
            initialValue={initialValue}
            onInitialValueChange={handleSetInitialValue}
            label="Valore iniziale account"
            tooltip={
              "Inserire l'importo iniziale dell'account \"" + account + '"'
            }
            amountOfDecimals={2}
          />

          {progressBarLogic === PROGRESSBARLOGIC.SUMTOMAX && (
            <NumberFieldWithTooltip
              initialValue={maxBarValue}
              onInitialValueChange={handleSetMaxValue}
              label="Valore massimo account"
              tooltip={
                "Inserire l'importo massimo dell'account \"" + account + '"'
              }
              amountOfDecimals={2}
            />
          )}
        </Stack>

        <ModalRedBlueButtons
          redButtonLabel={DELETEACCOUNTTEXT}
          redButtonOnClickFunction={() => deleteAccount(account)}
          blueButtonLabel={SAVEMODIFICATIONSTEXT}
          blueButtonOnClickFunction={() => handleClose()}
        />
      </Stack>
    </Modal>
  );
}

const TEXTFIELDSELECTOR = Object.freeze({
  ACCOUNTVALUE: 0,
  ACCOUNTMAXVALUE: 1,
});
