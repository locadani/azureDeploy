import React, { useState, useEffect, useRef } from 'react';
import { Stack, Typography } from '@mui/material';

import { AccountSettingsModal } from '../modals/AccountSettingsModal';

import { PROGRESSBARLOGIC, CustomLinearProgress } from './CustomLinearProgress';

import {
  INFORMATIONLOCATIONINSETTINGS,
  getInitialAccountValue,
  getProgressBarLogic,
  getProgressBarMaxValue,
  getSelectedBarColor,
  getSelectedAccountColor,
  getSelectedAccountBackgroundColor,
} from '../../helperFiles/accountsHelper';
import { formatValue } from '../../helperFiles/helperFunctions';
import {
  ZINDEX,
  VISUALIZATIONROUNDINGSELECTION,
  accountBackgroundOpacity,
} from '../../helperFiles/constants';

const SelectionsRenderer = ({
  displayedAccountsInfo,
  setDisplayedAccountsInfo,
  onElementClicked,
  selectedRounding,
  disabled,
}) => {
  const [progressBarValues, setProgressBarValues] = useState(new Map());

  function getMeasurementUnit(rounding) {
    var measurementUnit = '';
    if (rounding == VISUALIZATIONROUNDINGSELECTION.THOUSANDS)
      measurementUnit = 'k';
    else if (rounding == VISUALIZATIONROUNDINGSELECTION.MILLIONS)
      measurementUnit = 'mln';
    return measurementUnit;
  }

  function handleDeleteItem(key) {
    onElementClicked(key);
    setElementSettingsModalIsOpen(false);
  }

  function saveUpdates(key, value) {
    const newDisplayedAccountsInfo = new Map(displayedAccountsInfo);
    newDisplayedAccountsInfo.set(key, value);
    setDisplayedAccountsInfo(newDisplayedAccountsInfo);
    setElementSettingsModalIsOpen(false);
  }

  const measurementUnit = getMeasurementUnit(selectedRounding);
  const [elementSettingsModalIsOpen, setElementSettingsModalIsOpen] =
    useState(false);
  /* 
    this key contains a string. When it is not null, a modal opens and it allows to choose the settings for
    the account that is specified inside this key
    */
  const [settingsModalKey, setSettingsModalKey] = useState(null);

  const [isDragging, setIsDragging] = useState(false);
  const [internalPosition, setInternalPosition] = useState({ x: 0, y: 0 });
  const dragItem = useRef(null);
  const dragTimeout = useRef(null);

  // set values of each progress bar
  useEffect(() => {
    const progress = new Map();
    var maxValue = Number.MIN_SAFE_INTEGER;
    var progressValue;
    var mapValueTemp;
    const notVisibleLogicAccounts = Array.from(displayedAccountsInfo)
      .filter(
        ([key, value]) =>
          getProgressBarLogic(value) === PROGRESSBARLOGIC.NOTVISIBLE
      )
      .map(([key]) => key);

    const sumToMaxLogicAccounts = Array.from(displayedAccountsInfo)
      .filter(
        ([key, value]) =>
          getProgressBarLogic(value) === PROGRESSBARLOGIC.SUMTOMAX
      )
      .map(([key]) => key);

    // 1. set values for accounts that require a bar with sum of values
    for (const key of notVisibleLogicAccounts) {
      maxValue = Math.max(
        Math.abs(getInitialAccountValue(displayedAccountsInfo.get(key))),
        maxValue
      );
    }

    if (maxValue === 0) {
      for (const key of notVisibleLogicAccounts) {
        progress.set(key, 0);
      }
    } else {
      for (const key of notVisibleLogicAccounts) {
        progressValue =
          (getInitialAccountValue(displayedAccountsInfo.get(key)) / maxValue) *
          100;
        progress.set(key, progressValue);
      }
    }

    // 2. set values for accounts that requrire a bar with values respect to final value
    for (const key of sumToMaxLogicAccounts) {
      mapValueTemp = displayedAccountsInfo.get(key);
      progressValue =
        (getInitialAccountValue(mapValueTemp) /
          getProgressBarMaxValue(mapValueTemp)) *
        100;
      progressValue = Math.min(Math.abs(progressValue), 100);
      progress.set(key, progressValue);
    }

    setProgressBarValues(progress);
  }, [displayedAccountsInfo]); //modified by AnimationsHandler.jsx

  function handleMouseDown(e, position) {
    // Start a timer to detect a long press
    dragTimeout.current = setTimeout(() => {
      setIsDragging(true);
      dragItem.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
      setInternalPosition(position);
    }, 300); // 300ms for long press
  }

  const handleMouseMove = (e, account) => {
    if (!isDragging) return;

    // delays update
    if (!dragItem.current.timer) {
      dragItem.current.timer = setTimeout(() => {
        const newX = e.clientX - dragItem.current.x;
        const newY = e.clientY - dragItem.current.y;

        const newDisplayedAccountsInfo = new Map(displayedAccountsInfo);
        const newAccountValues = displayedAccountsInfo.get(account);
        newAccountValues[INFORMATIONLOCATIONINSETTINGS.POSITION] = {
          x: newX,
          y: newY,
        };
        newDisplayedAccountsInfo.set(account, newAccountValues);
        setDisplayedAccountsInfo(newDisplayedAccountsInfo);

        // Clear the timer
        dragItem.current.timer = null;
      }, 50); // Adjust the throttle interval (in ms) as needed
    }
  };

  const handleMouseUp = (account) => {
    if (dragTimeout.current) {
      clearTimeout(dragTimeout.current);
    }

    if (!isDragging) {
      // If it wasn't a drag, it's a click
      setSettingsModalKey(account);
      setElementSettingsModalIsOpen(true);
    }

    setIsDragging(false); // Reset dragging state
  };

  return (
    <>
      {[...displayedAccountsInfo.entries()].map(([account, value]) => {
        const amount = value[INFORMATIONLOCATIONINSETTINGS.AMOUNT];
        const progressBarLogic = getProgressBarLogic(value);
        const customLinearProgressValue = progressBarValues.get(account);
        const fontSize = value[INFORMATIONLOCATIONINSETTINGS.FONTSIZE];
        const accountColor = getSelectedAccountColor(value);
        const accountBackgroundColor = getSelectedAccountBackgroundColor(value);

        return (
          <Stack
            className="singleAccountRenderer"
            id={account}
            key={account}
            direction="row"
            spacing={1}
            style={{
              position: 'absolute',
              left: `${value[INFORMATIONLOCATIONINSETTINGS.POSITION].x}px`,
              top: `${value[INFORMATIONLOCATIONINSETTINGS.POSITION].y}px`,
              transform: 'translate(-50%, -50%)', // in this way the div is centered around the position specified
              color: accountColor,
              padding: '5px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '5px 15px  5px 15px',
              zIndex: ZINDEX.ACCOUNTSDIV,
              cursor: isDragging ? 'grabbing' : 'pointer',
              border: '2 px solid ' + accountBackgroundColor,
              backgroundColor:
                accountBackgroundColor + accountBackgroundOpacity,
              userSelect: isDragging ? 'none' : 'auto',
            }}
            onMouseDown={(e) => {
              if (!disabled)
                handleMouseDown(
                  e,
                  value[INFORMATIONLOCATIONINSETTINGS.POSITION]
                );
            }}
            onMouseMove={(e) => {
              if (!disabled) handleMouseMove(e, account);
            }}
            onMouseUp={() => {
              if (!disabled) handleMouseUp(account);
            }}
          >
            {/* Stack containing  account, progressbar and numbers */}
            <Stack
              className="accountProgressBarAndNumbers"
              direction={'column'}
              alignItems="center"
              spacing={1}
              sx={{
                minWidth: `${fontSize * 4}px`, // to make the rectangle not change size when the numbers grow in width
                margin: '0 !important',
              }}
            >
              <Typography
                className="accountName"
                component="p"
                sx={{
                  fontSize: `${fontSize}px`,
                  margin: '0px',
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                {account}
              </Typography>
              {progressBarLogic == PROGRESSBARLOGIC.SUMTOMAX && (
                <CustomLinearProgress
                  value={customLinearProgressValue}
                  color={getSelectedBarColor(
                    displayedAccountsInfo.get(account)
                  )}
                />
              )}

              <p
                className="accountValue"
                style={{
                  fontSize: `${fontSize}px`,
                  textAlign: 'right',
                }}
              >
                {formatValue(amount, selectedRounding) + measurementUnit}
              </p>
            </Stack>
            {/* show this if the logic is the one that shows the percentage of completion 
              compared to the max value that is specified by the user.
              it is also necessary to check that customlinearprogressvalue was set in this rendering*/}
            {progressBarLogic == PROGRESSBARLOGIC.SUMTOMAX &&
              customLinearProgressValue != null && (
                <p
                  style={{
                    fontSize: `${fontSize}px`,
                    minWidth: `${fontSize * 2.15}px`, //when 100% the width is always a little smaller than this
                    textAlign: 'right',
                  }}
                >
                  {customLinearProgressValue.toFixed(1) + '%'}
                </p>
              )}
          </Stack>
        );
      })}
      {elementSettingsModalIsOpen && (
        <AccountSettingsModal
          account={settingsModalKey}
          deleteAccount={handleDeleteItem}
          modalIsOpen={elementSettingsModalIsOpen}
          saveUpdates={saveUpdates}
          discardChanges={() => setElementSettingsModalIsOpen(false)}
          toDisplayData={displayedAccountsInfo.get(settingsModalKey)}
        />
      )}
    </>
  );
};

export default SelectionsRenderer;
