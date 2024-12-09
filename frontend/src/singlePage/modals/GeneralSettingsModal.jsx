import React, { useState } from 'react';
import {
  Alert,
  Box,
  IconButton,
  Modal,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
import UploadFileIcon from '@mui/icons-material/UploadFile';

import {
  modalSettingsArray,
  saveMapToJson,
} from '../../helperFiles/helperFunctions';

import {
  ANIMATIONDELAYTEXTBOXLABELTEXT,
  ANIMATIONDELAYTEXTBOXTOOLTIPTEXT,
  ANIMATIONDURATIONTEXTBOXLABELTEXT,
  ANIMATIONDURATIONTEXTBOXTOOLTIPTEXT,
  CANCELMODIFICATIONSTEXT,
  LOADSAVECONFIGURATIONTEXT,
  LOWANIMATIONDELAYWARNINGTEXT,
  SAVEMODIFICATIONSTEXT,
  SELECTBACKGROUNDCOLORTEXT,
} from '../../text/textITA';
import DelayedColorPicker from '../components/DelayedColorPicker';
import { ModalRedBlueButtons } from '../components/ModalRedBlueButtons';
import { JSONFILEMAPKEYS, SETTINGSLOCATION } from '../../helperFiles/constants';
import NumberFieldWithTooltip from '../components/NumberFieldWithTooltip';
import { ModalTitle } from '../components/ModalTitle';

export const GeneralSettingsModal = ({
  settings,
  updateSettings,
  numberOfScritture,
  displayedAccountsInfo,
  setDisplayedAccountsInfo,
  disabled,
}) => {
  const [tempSelectedBackgroundColor, setTempSelectedBackgroundColor] =
    useState(settings[SETTINGSLOCATION.BACKGROUNDCOLOR]);

  const [selectedCircleLifecycle, setSelectedCircleLifecycle] = useState(
    settings[SETTINGSLOCATION.CIRCLELIFECYCLEDURATION]
  );
  const [selectedDelayBetweenScritture, setSelectedDelayBetweenScritture] =
    useState(settings[SETTINGSLOCATION.DELAYBETWEENSCRITTURE]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  function saveChangesAndCloseModal() {
    updateSettings(
      modalSettingsArray(
        tempSelectedBackgroundColor,
        selectedCircleLifecycle,
        selectedDelayBetweenScritture
      )
    );
    handleCloseModal();
  }

  function handleAccountsConfigurationFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          if (typeof json === 'object' && json !== null) {
            // Convert the JSON object into a Map

            // TODO: gestisci il caso in cui una entry non è completa usando createNewEntry
            const newMap = new Map(
              Object.entries(json).map(([key, value]) => [
                key,
                Array.isArray(value) ? new Map(value) : value,
              ])
            );

            setDisplayedAccountsInfo(
              newMap.get(JSONFILEMAPKEYS.ACCOUNTENTRIES)
            );
            setTempSelectedBackgroundColor(
              newMap.get(JSONFILEMAPKEYS.BACKGROUNDCOLOR)
            );
          } else {
            console.error('Invalid JSON format: not an object.');
          }
        } catch (error) {
          console.error('Failed to parse JSON file:', error);
        }
      };
      reader.readAsText(file);
    }
  }

  return (
    <div>
      <Tooltip title="Settings">
        <IconButton onClick={handleOpenModal} disabled={disabled}>
          <SettingsIcon />
        </IconButton>
      </Tooltip>
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Stack direction={'column'} className="modalContent" spacing={4}>
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          <ModalTitle title={'Impostazioni'} />
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h6">{LOADSAVECONFIGURATIONTEXT}</Typography>
            <Tooltip title="Save your changes">
              <IconButton
                variant="contained"
                color="primary"
                onClick={() => {
                  saveMapToJson(
                    displayedAccountsInfo,
                    tempSelectedBackgroundColor
                  );
                }}
              >
                <SaveIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Load a JSON file">
              <IconButton color="primary" component="label">
                <UploadFileIcon />
                {/* Hidden input for file selection */}
                <input
                  type="file"
                  accept="application/json"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    handleAccountsConfigurationFileUpload(e);
                  }}
                />
              </IconButton>
            </Tooltip>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h6">{SELECTBACKGROUNDCOLORTEXT}</Typography>
            <DelayedColorPicker
              color={tempSelectedBackgroundColor}
              onChange={setTempSelectedBackgroundColor}
              type="color"
            />
          </Stack>
          <Box
            sx={{
              position: 'relative',
              border: '1px solid grey',
              borderRadius: 5,
              padding: 2,
              marginTop: 2,
              paddingTop: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                position: 'absolute',
                top: '-20px',
                left: 15,
                backgroundColor: 'white',
                paddingLeft: 0.5,
                paddingRight: 0.5,
              }}
            >
              Definizione tempi
            </Typography>
            <Stack
              spacing={2} // Add spacing between elements
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Stack
                spacing={2} // Add spacing between elements
                direction={{
                  xs: 'column',
                  sm: 'column',
                  md: 'row',
                  lg: 'row',
                  xl: 'row',
                }}
                sx={{ marginTop: 2, marginBottom: 1 }}
              >
                <NumberFieldWithTooltip
                  initialValue={selectedCircleLifecycle * 1000}
                  onInitialValueChange={(value) =>
                    setSelectedCircleLifecycle(parseFloat(value) / 1000)
                  }
                  label={ANIMATIONDURATIONTEXTBOXLABELTEXT}
                  tooltip={ANIMATIONDURATIONTEXTBOXTOOLTIPTEXT}
                  amountOfDecimals={0}
                />
                <NumberFieldWithTooltip
                  initialValue={selectedDelayBetweenScritture}
                  onInitialValueChange={(value) =>
                    setSelectedDelayBetweenScritture(parseFloat(value))
                  }
                  label={ANIMATIONDELAYTEXTBOXLABELTEXT}
                  tooltip={ANIMATIONDELAYTEXTBOXTOOLTIPTEXT}
                  amountOfDecimals={0}
                />
              </Stack>
              <Typography>
                Il video durerà approssimativamente{' '}
                {Math.ceil(
                  (numberOfScritture * selectedDelayBetweenScritture) /
                    1000 /
                    60
                )}{' '}
                minuti.
              </Typography>
              {selectedDelayBetweenScritture < 1000 && (
                <Alert
                  severity="warning"
                  sx={{
                    maxWidth: '500px', // Maximum width it can reach
                  }}
                >
                  {LOWANIMATIONDELAYWARNINGTEXT}
                </Alert>
              )}
            </Stack>
          </Box>

          <ModalRedBlueButtons
            redButtonLabel={CANCELMODIFICATIONSTEXT}
            redButtonOnClickFunction={() => handleCloseModal()}
            blueButtonLabel={SAVEMODIFICATIONSTEXT}
            blueButtonOnClickFunction={() => saveChangesAndCloseModal()}
          />
        </Stack>
      </Modal>
    </div>
  );
};
