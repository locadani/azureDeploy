// TODO delete e lascia cartella nello stories
import React from 'react';
import { Modal, Box, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export function RCSelectionModalButton({
  availableOptions,
  onOptionChosen,
  open,
  setOpen,
}) {
  function openModal() { //opened from outside
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  const handleItemClick = (value) => {
    onOptionChosen(value);
    closeModal();
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={open}
      onClose={closeModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={closeModal}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography
          id="modal-title"
          variant="h6"
          component="h2"
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            marginTop: '0 !important',
          }}
        >
          Select the RTC account
        </Typography>
        {availableOptions.map((option) => (
          <Button
            key={option}
            variant="contained"
            color="secondary"
            onClick={() => handleItemClick(option)}
            sx={{ mt: 3 }}
          >
            {option}
          </Button>
        ))}
      </Box>
    </Modal>
  );
}
