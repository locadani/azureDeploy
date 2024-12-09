import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  Modal,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import PlayPauseIcon from '@mui/icons-material/PlayCircleFilled';
import StopIcon from '@mui/icons-material/Stop';

import { ModalTitle } from '../components/ModalTitle';
import { PlayModalitySelector } from '../components/PlayModalitySelector';
import { SELECTANIMATIONMODALITY } from '../../text/textITA';

export const StartAnimationsModal = ({
  isLoopingOverScritture,
  selectedPlayModality,
  theme,
  startAnimations,
  stopAnimations,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [internalSelectedPlayModality, setInternalSelectedPlayModality] =
    useState(selectedPlayModality);

  function handleModalButtonClicked() {
    if (!isLoopingOverScritture) {
      setIsModalOpen(true);
    } else {
      stopAnimations();
    }
  }
  function handleCloseModal() {
    setIsModalOpen(false);
  }

  return (
    <div>
      <Tooltip
        title={
          isLoopingOverScritture
            ? 'Stop moving the circles'
            : 'Start moving the circles'
        }
      >
        <IconButton onClick={handleModalButtonClicked}>
          {isLoopingOverScritture ? <StopIcon /> : <PlayPauseIcon />}
        </IconButton>
      </Tooltip>
      {/* Modal for Setting Filters */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Stack direction="column" spacing={2} className="modalContent">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h6">{SELECTANIMATIONMODALITY}</Typography>
            <PlayModalitySelector
              selectedPlayModality={internalSelectedPlayModality}
              setSelectedPlayModality={setInternalSelectedPlayModality}
              theme={theme}
            />
          </Stack>
          <Button
            onClick={() => {
              handleCloseModal();
              startAnimations(internalSelectedPlayModality);
            }}
            variant="contained"
          >
            Start animations
          </Button>
        </Stack>
      </Modal>
    </div>
  );
};
