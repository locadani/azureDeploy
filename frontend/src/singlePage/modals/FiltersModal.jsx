import React, { useState } from 'react';
import {
  Box,
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
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { INFORMATIONLOCATIONINSCRITTURA } from '../../helperFiles/constants';
import { formatDateToStandard } from '../../helperFiles/helperFunctions';

import { ModalTitle } from '../components/ModalTitle';

// expects scritture as an array
export function generateFilters(groupedScritture) {
  const filtersMap = new Map();
  const availableSteps = new Set();
  // date will be compared as a string
  var minDate = '9999/99/99';
  var maxDate = '0000/00/00';
  var reversedDate;
  for (const scritture of groupedScritture) {
    for (const scrittura of scritture) {
      // handle steps
      availableSteps.add(scrittura[INFORMATIONLOCATIONINSCRITTURA.STEP]);

      // handle date

      reversedDate = formatDateToStandard(
        scrittura[INFORMATIONLOCATIONINSCRITTURA.DATE]
      );
      if (minDate > reversedDate) minDate = reversedDate;

      if (maxDate < reversedDate) maxDate = reversedDate;
    }
  }
  filtersMap.set(FILTERCATEGORIES.STEP, availableSteps);

  //dates are in the format yyyy-mm-dd
  filtersMap.set(FILTERCATEGORIES.DATES, [minDate, maxDate]);

  return filtersMap;
}

// filterOptionsMap and filters have the same structure
// they are maps containing FILTERCATEGORIES as keys
// filterOptionsMap contains the possible choices, filters contains what was selected.

// The filter variable reflects the change immediately, through the setFilters which is called immediately
export const FiltersModal = ({
  filterOptionsMap,
  filters,
  setFilters,
  disabled,
}) => {
  const minDate = filterOptionsMap.get(FILTERCATEGORIES.DATES)[
    INFORMATIONLOCATIONINDATEFILTER.INITIALDATE
  ];
  const maxDate = filterOptionsMap.get(FILTERCATEGORIES.DATES)[
    INFORMATIONLOCATIONINDATEFILTER.FINALDATE
  ];
  const [selectedInitialDate, setSelectedInitialDate] = useState(
    filters.get(FILTERCATEGORIES.DATES)?.[
      INFORMATIONLOCATIONINDATEFILTER.INITIALDATE
    ] ?? minDate
  );
  const [selectedFinalDate, setSelectedFinalDate] = useState(
    filters.get(FILTERCATEGORIES.DATES)?.[
      INFORMATIONLOCATIONINDATEFILTER.FINALDATE
    ] ?? maxDate
  );

  function handleCheckboxChange(value) {
    setFilters((prevFilters) => {
      const newFilters = new Map(prevFilters);
      const currentSet = newFilters.get(FILTERCATEGORIES.STEP) || new Set();
      if (currentSet.has(value)) {
        currentSet.delete(value);
      } else {
        currentSet.add(value);
      }
      newFilters.set(FILTERCATEGORIES.STEP, currentSet);
      return newFilters;
    });
  }
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  function handleDateChange(newDate, initialOrFinalDate) {
    // newDate is given like this YYYY-MM-DD
    const newFilters = new Map(filters);

    // here it should always find something with the get (|| should be useless)
    const currentDates = newFilters.get(FILTERCATEGORIES.DATES) || ['', ''];
    if (initialOrFinalDate === INFORMATIONLOCATIONINDATEFILTER.INITIALDATE) {
      currentDates[INFORMATIONLOCATIONINDATEFILTER.INITIALDATE] = newDate;
      setSelectedInitialDate(newDate);
    } else if (
      initialOrFinalDate === INFORMATIONLOCATIONINDATEFILTER.FINALDATE
    ) {
      currentDates[INFORMATIONLOCATIONINDATEFILTER.FINALDATE] = newDate;
      setSelectedFinalDate(newDate);
    }
    newFilters.set(FILTERCATEGORIES.DATES, currentDates);
    setFilters(newFilters);
  }

  return (
    <div>
      {/* New Filter Button */}
      <Tooltip title="Set Filters">
        <IconButton onClick={handleOpenModal} disabled={disabled}>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
      {/* Modal for Setting Filters */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Stack direction="column" spacing={2} className="modalContent">
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
          <ModalTitle title={'Imposta filtri'} />
          <div key={'step'}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                marginBottom: '0 !important',
              }}
            >
              Step da visualizzare:
            </Typography>
            <FormControl component="fieldset">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                }}
              >
                {Array.from(filterOptionsMap.get(FILTERCATEGORIES.STEP))
                  .sort()
                  .map((availableValue) => {
                    return (
                      <FormControlLabel
                        sx={{ marginRight: '0px' }}
                        key={availableValue}
                        control={
                          <Checkbox
                            checked={filters
                              .get(FILTERCATEGORIES.STEP)
                              .has(availableValue)}
                            onChange={() =>
                              handleCheckboxChange(availableValue)
                            }
                          />
                        }
                        label={availableValue}
                      />
                    );
                  })}
              </div>
            </FormControl>
          </div>
          <hr />
          <Box>
            <Typography variant="h6">
              Date da visualizzare (mm/dd/yyyy):
            </Typography>
            <Box
              sx={{
                maxWidth: '70%',
                width: '100%',
              }}
            >
              <TextField
                label="Start Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={selectedInitialDate}
                onChange={(event) =>
                  handleDateChange(
                    event.target.value,
                    INFORMATIONLOCATIONINDATEFILTER.INITIALDATE
                  )
                }
                fullWidth
                style={{ marginTop: '16px' }}
                inputProps={{
                  min: minDate,
                  max: maxDate,
                }}
              />
              <TextField
                label="End Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={selectedFinalDate}
                onChange={(event) =>
                  handleDateChange(
                    event.target.value,
                    INFORMATIONLOCATIONINDATEFILTER.FINALDATE
                  )
                }
                fullWidth
                style={{ marginTop: '16px' }}
                inputProps={{
                  min: minDate,
                  max: maxDate,
                }}
              />
            </Box>
          </Box>
        </Stack>
      </Modal>
    </div>
  );
};

export function matchesFilters(line, filters) {
  // check steps
  if (
    !filters
      .get(FILTERCATEGORIES.STEP)
      .has(line[INFORMATIONLOCATIONINSCRITTURA.STEP])
  ) {
    /*console.log(
      'skipped. its type is ',
      line[INFORMATIONLOCATIONINSCRITTURA.STEP]
    );*/
    return false;
  }

  const scritturaDate = formatDateToStandard(
    line[INFORMATIONLOCATIONINSCRITTURA.DATE]
  );
  //check dates
  if (
    filters.get(FILTERCATEGORIES.DATES)[
      INFORMATIONLOCATIONINDATEFILTER.INITIALDATE
    ] > scritturaDate ||
    filters.get(FILTERCATEGORIES.DATES)[
      INFORMATIONLOCATIONINDATEFILTER.FINALDATE
    ] < scritturaDate
  ) {
    // console.log('skipped: ', scritturaDate, ' out of range');
    return false;
  }

  return true;
}

export function getFilteredItems(scritture, filters) {
  const result = scritture
    .map((innerArray) =>
      innerArray.filter((scrittura) => matchesFilters(scrittura, filters))
    )
    .filter((innerArray) => innerArray.length > 0);
  return result;
}

const INFORMATIONLOCATIONINDATEFILTER = Object.freeze({
  INITIALDATE: 0,
  FINALDATE: 1,
});

const FILTERCATEGORIES = Object.freeze({
  STEP: 'steps',
  DATES: 'dates',
});
