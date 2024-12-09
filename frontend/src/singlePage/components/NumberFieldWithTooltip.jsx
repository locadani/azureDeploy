import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';

/*
this component is used because it creates an input textbox along with an icon that, when hovered, gives a brief explanation
*/
const NumberFieldWithTooltip = ({
  initialValue,
  onInitialValueChange,
  label,
  tooltip,
  amountOfDecimals,
}) => {
  const toVisualizeInitialValue = initialValue
    .toFixed(amountOfDecimals)
    .toString()
    .replace('.', ','); // replace for consistent visualization
  return (
    <TextField
      label={label}
      variant="outlined"
      size="small"
      defaultValue={toVisualizeInitialValue} // replace for consistent visualization
      onChange={(e) => onInitialValueChange(e.target.value)} // Pass the new value to the function
      InputProps={{
        endAdornment: (
          <InputAdornment position="end" style={{ marginRight: '-10px' }}>
            <Tooltip title={tooltip}>
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </InputAdornment>
        ),
        sx: {
          '& .MuiOutlinedInput-notchedOutline > legend': {
            fontSize: '1em !important', // makes the top border of the textbox adapt to the contained text
          },
        },
      }}
      InputLabelProps={{
        sx: (theme) => ({
          ...theme.typography.subtitle2,
          transform: 'translate(12px, -14px) scale(1)',
        }),
      }}
    />
  );
};

export default NumberFieldWithTooltip;
