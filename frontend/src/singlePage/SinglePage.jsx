import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  IconButton,
} from '@mui/material';
import AnimationsHandler from './animations/AnimationsHandler.jsx';
import BackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MoveIcon from '@mui/icons-material/ArrowForward';
import PlayPauseIcon from '@mui/icons-material/PlayCircleFilled';
import StopIcon from '@mui/icons-material/Stop';
import Tooltip from '@mui/material/Tooltip';

import {
  defaultNextScritturaDelay,
  defaultScritturaDuration,
  PLAYMODALITYSELECTION,
  SETTINGSLOCATION,
  VISUALIZATIONROUNDINGSELECTION,
} from '../helperFiles/constants.js';
import {
  FiltersModal,
  generateFilters,
  getFilteredItems,
} from './modals/FiltersModal.jsx';

import SelectionsRenderer from './components/SelectionsRenderer.jsx';
import { RCSelectionModalButton } from './components/RCSelectionModalButton';
import ClickableScreen from './components/ClickableScreen.jsx';

import {
  allAccountsAreDisplayed,
  getStandardPositionForAccount,
  getTimingSettings,
  modalSettingsArray,
} from '../helperFiles/helperFunctions.js';
import { DEFAULTVALUES, drawTrail, ZINDEX } from '../helperFiles/constants.js';
import { createNewEntry } from '../helperFiles/accountsHelper.js';
import { POSITIONEDACCOUNTSTEXT } from '../text/textITA.js';
import { GeneralSettingsModal } from './modals/GeneralSettingsModal.jsx';
import { PlayModalitySelector } from './components/PlayModalitySelector.jsx';
import { StartAnimationsModal } from './modals/StartAnimationsModal.jsx';

function SinglePage() {
  const theme = useTheme();

  const location = useLocation();
  const { state } = location;

  const prevPage = '/';
  const navigate = useNavigate();

  //
  const arrayDiScritture = state?.scritture; //getAvailableAccounts(arrayDiScritture);
  const foundAccounts = state?.foundAccounts;
  const spOrCE = state?.spOrCE;
  const [displayedAccountsInfo, setDisplayedAccountsInfo] = useState(new Map());

  // settings
  const [selectedBackgroundColor, setSelectedBackgroundColor] =
    useState('#000000');

  const [circleLifecycleDuration, setCircleLifecycleDuration] = useState(
    defaultScritturaDuration
  );

  const [delayBetweenScritture, setDelayBetweenScritture] = useState(
    defaultNextScritturaDelay
  );

  const [filters, setFilters] = useState(generateFilters(arrayDiScritture));
  const [selectedRounding, setSelectedRounding] = useState(
    VISUALIZATIONROUNDINGSELECTION.THOUSANDS
  );

  const [selectedPlayModality, setSelectedPlayModality] = useState(
    PLAYMODALITYSELECTION.CIRCLES
  );
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [selectAccountModalOpen, setSelectAccountModalOpen] = useState(false);

  const [userCanInteract, setUserCanInteract] = useState(true);

  //animation

  // modified by animationHandler according to whether there is at least a circle moving.
  // it is used here only to disable the elements
  const [animationsAreOver, setAnimationsAreOver] = useState(true);

  // this is set by the AnimationHandler and not here becuse it is changed when there are no more
  // scritture to render. So the AnimationHandler does everything to have a single modifier
  const [isLoopingOverScritture, setIsLoopingOverScritture] = useState(true);
  const [visualizedDate, setVisualizedDate] = useState();
  const animationComponentReference = useRef(null); // used to call functions in AnimationDiv

  const [conditionsSatisfied, setConditionsSatisfied] = useState(
    allAccountsAreDisplayed(foundAccounts, displayedAccountsInfo)
  );

  useEffect(() => {
    setConditionsSatisfied(
      allAccountsAreDisplayed(foundAccounts, displayedAccountsInfo)
    );
  }, [displayedAccountsInfo]);

  function addLarge() {
    var i = 0;
    const newDisplayedAccountsInfo = new Map();
    for (const account of foundAccounts) {
      const position = getStandardPositionForAccount(account);
      newDisplayedAccountsInfo.set(
        account,
        createNewEntry(position.x, position.y)
      );
      i++;
    }
    setDisplayedAccountsInfo(newDisplayedAccountsInfo);
  }

  const handlePageClick = (e) => {
    if (
      e.target.closest('.MuiAppBar-root') ||
      selectAccountModalOpen ||
      conditionsSatisfied
    )
      return;
    setSelectAccountModalOpen(true);
    setClickPosition({ x: e.clientX, y: e.clientY });
  };

  function handleAccountSelection(account) {
    const newDisplayedAccountsInfo = new Map(displayedAccountsInfo);
    const newAccountValues = createNewEntry(clickPosition.x, clickPosition.y);
    newDisplayedAccountsInfo.set(account, newAccountValues);
    setDisplayedAccountsInfo(newDisplayedAccountsInfo);
  }

  const onPrevClicked = () => {
    navigate(prevPage);
  };

  function deleteAccountFromSelected(account) {
    const newDisplayedAccountsInfo = new Map(displayedAccountsInfo);
    newDisplayedAccountsInfo.delete(account);
    setDisplayedAccountsInfo(newDisplayedAccountsInfo);
  }

  useEffect(() => {
    setUserCanInteract(animationsAreOver || drawTrail);
  }, [drawTrail, animationsAreOver]);

  function updateSettings(newSettings) {
    setSelectedBackgroundColor(newSettings[SETTINGSLOCATION.BACKGROUNDCOLOR]);
    setCircleLifecycleDuration(
      newSettings[SETTINGSLOCATION.CIRCLELIFECYCLEDURATION]
    );
    setDelayBetweenScritture(
      newSettings[SETTINGSLOCATION.DELAYBETWEENSCRITTURE]
    );
  }

  function startAnimations(playModality) {
    if (playModality != PLAYMODALITYSELECTION.VARIANTS) {
      // if provvisorio
      setSelectedPlayModality(playModality);
      setIsLoopingOverScritture(!isLoopingOverScritture);
      animationComponentReference.current.startScritturaAnimation();
    }
  }

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Navigation bar */}
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          padding: '5px 15px',
          backgroundColor: DEFAULTVALUES.CONTROLSBACKGROUNDCOLOR,
          color: 'black',
          borderRadius: '5px',
          boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.3)',
          zIndex: ZINDEX.NAVBAR,
        }}
      >
        <Tooltip title="Go back to the settings page">
          <IconButton
            variant="contained"
            color="secondary"
            onClick={onPrevClicked}
            disabled={!userCanInteract}
          >
            <BackIcon />
          </IconButton>
        </Tooltip>

        <GeneralSettingsModal
          settings={modalSettingsArray(
            selectedBackgroundColor,
            circleLifecycleDuration,
            delayBetweenScritture
          )}
          updateSettings={updateSettings}
          numberOfScritture={arrayDiScritture.length}
          displayedAccountsInfo={displayedAccountsInfo}
          setDisplayedAccountsInfo={setDisplayedAccountsInfo}
          disabled={!userCanInteract}
        />

        {!conditionsSatisfied && (
          <>
            <Stack
              className="positionedAccountsCounter"
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <Typography variant="h6">
                {POSITIONEDACCOUNTSTEXT + displayedAccountsInfo.size}/
                {foundAccounts.length}
              </Typography>
              <Button variant="outlined" onClick={addLarge} color="secondary">
                Precompiled for large file
              </Button>
            </Stack>
          </>
        )}

        <FiltersModal
          filterOptionsMap={generateFilters(arrayDiScritture)}
          filters={filters}
          setFilters={setFilters}
          disabled={!userCanInteract}
        />

        {/* Box that contains the rounding selection */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1, // Space between the label and the Select component
            borderBottom: '2px solid black',
          }}
        >
          <InputLabel
            sx={{
              lineHeight: 1,
              margin: 0,
              fontSize: '1.5rem',
              left: '5px',
            }}
          >
            €
          </InputLabel>
          <FormControl
            sx={{
              width: '85px',
            }}
          >
            <Select
              value={selectedRounding}
              disableUnderline
              onChange={(event) => {
                setSelectedRounding(event.target.value);
              }}
              variant="standard"
              sx={{
                margin: 0,
                padding: 0,
                fontSize: theme.typography.h6.fontSize,
                '& .MuiSelect-select': {
                  padding: '4px 8px',
                },
              }}
            >
              <MenuItem value={VISUALIZATIONROUNDINGSELECTION.UNITY}>
                Unità
              </MenuItem>
              <MenuItem value={VISUALIZATIONROUNDINGSELECTION.THOUSANDS}>
                Migliaia
              </MenuItem>
              <MenuItem value={VISUALIZATIONROUNDINGSELECTION.MILLIONS}>
                Milioni
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* provvisorio */}
        <p sx={{ fontSize: '10px' }}>||provvisorio: </p>
        <PlayModalitySelector
          selectedPlayModality={selectedPlayModality}
          setSelectedPlayModality={setSelectedPlayModality}
          theme={theme}
        />

        {conditionsSatisfied && (
          <>
            {/*
            // todo: quando clicchi reset non si resetta 
              <Tooltip title="Reset the animation and clear the date">
                <IconButton
                  color="primary"
                  onClick={() => {
                    setVisualizedDate(null);
                    animationComponentReference.current.resetAnimation();
                  }}
                >
                  <ResetIcon />
                </IconButton>
              </Tooltip>*/}
            <Tooltip title="Move to the next animation step">
              <IconButton
                onClick={() => {
                  animationComponentReference.current.startNextScritturaAnimation();
                }}
              >
                <MoveIcon />
              </IconButton>
            </Tooltip>

            <StartAnimationsModal
              isLoopingOverScritture={isLoopingOverScritture}
              selectedPlayModality={selectedPlayModality}
              theme={theme}
              startAnimations={startAnimations}
              stopAnimations={() =>
                animationComponentReference.current.startScritturaAnimation()
              }
            />
          </>
        )}
      </Stack>

      {visualizedDate && (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            padding: '5px 10px',
            color: 'white', // date and icon font color
            zIndex: ZINDEX.DATE,
          }}
        >
          <CalendarTodayIcon />
          <Typography
            sx={{
              fontSize: '28px',
            }}
          >
            {visualizedDate}
          </Typography>
        </Stack>
      )}

      {/* Background Div */}
      <ClickableScreen
        selectedBackgroundColor={selectedBackgroundColor}
        elementWasClicked={handlePageClick}
      />

      <RCSelectionModalButton
        open={selectAccountModalOpen}
        setOpen={setSelectAccountModalOpen}
        availableOptions={foundAccounts.filter(
          (element) =>
            !Array.from(displayedAccountsInfo.keys()).includes(element)
        )}
        onOptionChosen={handleAccountSelection}
      />

      <SelectionsRenderer
        displayedAccountsInfo={displayedAccountsInfo}
        setDisplayedAccountsInfo={setDisplayedAccountsInfo}
        onElementClicked={deleteAccountFromSelected}
        selectedRounding={selectedRounding}
        disabled={!userCanInteract}
        spOrCE={spOrCE}
      />

      {conditionsSatisfied && (
        <AnimationsHandler
          scritture={getFilteredItems(arrayDiScritture, filters)}
          displayedAccountsInfo={displayedAccountsInfo}
          timingSettings={getTimingSettings(
            circleLifecycleDuration,
            delayBetweenScritture
          )}
          setDisplayedAccountsInfo={setDisplayedAccountsInfo}
          setShouldLoopOverScrittureExternalCommand={setIsLoopingOverScritture}
          setAnimationsAreOver={setAnimationsAreOver}
          setVisualizedDate={setVisualizedDate}
          ref={animationComponentReference}
          playModality={selectedPlayModality}
        />
      )}
    </Box>
  );
}

export default SinglePage;
