import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as xlsx from 'xlsx';
import { Button, Stack, Typography } from '@mui/material';

import { BetweenDataUploadAndVisualizationSetting } from './ExchangeClasses';
import CircularProgress from '@mui/material/CircularProgress';
import { FILEUPLOADFINISHED } from './text/textITA';

function ScrittureUploadPage() {
  const nextPage = '/singlePage';
  const navigate = useNavigate();
  const [sortedData, setSortedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [spOrCE, setSpOrCE] = useState(new Map());

  const numberOfDecimals = 2;

  function handleFileUpload(event) {
    const tempSpCe = new Map();
    const file = event.target.files[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = xlsx.read(data, { type: 'array' });
        // CONSTRAINTS: sheetname must be like this
        const sheetName = 'VIM DB Dettaglio per Data';
        const worksheet = workbook.Sheets[sheetName];

        if (worksheet) {
          // Convert sheet to JSON
          let data = xlsx.utils.sheet_to_json(worksheet, { raw: false });

          // CONSTRAINTS: importo
          // Round 'Importo' to 2 decimal places
          // - handle negative numbers represented in round brackets
          // - expects that the decimals are separated using a dot

          // here it also retrieves whether an account is SP or CE
          data = data.map((row) => {
            let importo = row['Importo'].replaceAll(',', '');
            if (
              // (number) is converted into -number
              typeof importo === 'string' &&
              importo.includes('(') &&
              importo.includes(')')
            ) {
              importo = -parseFloat(importo.replace(/[()]/g, ''));
            } else {
              importo = parseFloat(importo);
            }
            return {
              ...row,
              Importo: parseFloat(importo.toFixed(numberOfDecimals)), // round and convert
            };
          });

          function processGroup(group) {
            // group is a single scrittura

            // Consider all rows that have negative amount
            // because there might be more lines going to same account, so combine them into one
            // that has the sum of their amount as amount of the resulting row
            const negativeImporto = group.filter((row) => row['Importo'] < 0);
            const grouped = negativeImporto.reduce((acc, row) => {
              const key = JSON.stringify({ ...row, Importo: undefined });
              if (!acc[key]) {
                //accumulator for this key has not been defined?
                acc[key] = { ...row }; // save the row in the accumulator
              } else {
                // if this accumulator was already defined, just add the value
                acc[key]['Importo'] += row['Importo'];
              }
              return acc;
            }, {});

            const groupedArray = Object.values(grouped);

            // Since rows with positive amount are untouched, just concatenate them to the possibly modified negative rows
            const positiveImporto = group.filter((row) => row['Importo'] >= 0);
            const result = [...groupedArray, ...positiveImporto];
            return result;
          }

          // Group data by 'Key Num. Reg.'
          const groupedData = Object.values(
            data.reduce((acc, row) => {
              //group all the rows that have the same Key Num. Reg.
              const key = row['Key Num. Reg.'];
              if (!acc[key]) {
                acc[key] = [];
              }
              acc[key].push(row);

              return acc;
            }, {})
          ).flatMap((group) => {
            // combine rows with negative values, if needed
            return processGroup(group);
          });

          // Apply Min-Max normalization to 'Importo' column
          const minValue = Math.abs(
            Math.min(...groupedData.map((row) => row['Importo']))
          );
          const maxValue = Math.abs(
            Math.max(...groupedData.map((row) => row['Importo']))
          );

          const normalizer = Math.max(minValue, maxValue);

          // Add 'ImportoNormalizzato' column
          //and get spOrCE values (done here to loop through the rows one time less)
          groupedData.forEach((row) => {
            tempSpCe.set(row['R2C_Accounts'], row['SP_CE']);
            row['ImportoNormalizzato'] = row['Importo'] / normalizer;
          });

          setSpOrCE(tempSpCe);

          // Convert the processed data to a list of lists
          const groupedDataList = Object.values(
            groupedData.reduce((acc, row) => {
              // group the rows accodring to Key Num. Reg. value
              const key = row['Key Num. Reg.'];
              if (!acc[key]) {
                acc[key] = [];
              }
              acc[key].push(Object.values(row));
              return acc;
            }, {})
          );

          // Sort the data using a custom sort key function
          function sortKey(item) {
            // item is an array of arrays, subarrays have same first and second field,
            // which indicate a date and a label (Ricavi, Movimentazione Crediti, ...)

            // Extract the date and label from the first sub-array
            const dateStr = item[0][0];
            const label = item[0][1];

            // Convert dateStr to a Date object for proper sorting
            const [day, month, year] = dateStr
              .split('/')
              .map((part) => parseInt(part, 10));
            const dateObj = new Date(year, month - 1, day);

            return [dateObj, label];
          }

          const sorted = groupedDataList.sort((a, b) => {
            // key is composed in this way "dd/mm/yyyy - step"
            const [dateA, labelA] = sortKey(a);
            const [dateB, labelB] = sortKey(b);
            // so this sorts by first checking the date
            // if the dates are equal, then check the step and order them alphabetically

            if (dateA < dateB) return -1;
            if (dateA > dateB) return 1;
            if (labelA < labelB) return -1;
            if (labelA > labelB) return 1;
            return 0;
          });

          setSortedData(sorted);
          setIsLoading(false);
        } else {
          console.error('Sheet not found');
          setIsLoading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  const onNextClicked = () => {
    const exchangeInfo = new BetweenDataUploadAndVisualizationSetting(
      sortedData,
      Array.from(spOrCE.keys()), //found accounts
      spOrCE
    );
    navigate(nextPage, { state: exchangeInfo });
  };

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      spacing={4}
      sx={{
        padding: '20px',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        fontSize: '20px',
      }}
    >
      <Typography variant='h3'>Upload Your File</Typography>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        required
      />
      {isLoading && <CircularProgress />}
      {sortedData.length != 0 && (
        <>
          <br />
          {FILEUPLOADFINISHED}
        </>
      )}

      <Button
        variant="contained"
        color="secondary"
        disabled={sortedData.length == 0}
        onClick={onNextClicked}
      >
        Next
      </Button>
    </Stack>
  );
}

export default ScrittureUploadPage;
