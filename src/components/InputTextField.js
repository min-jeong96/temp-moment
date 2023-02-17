import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

export const InputTextField = styled(TextField)({
  margin: '16px 0 0',
  '& label': {
    color: 'var(--sub-text)'
  },
  '& label.Mui-focused': {
    color: 'var(--primary)',
  },
  '& label.Mui-error': {
    color: '#d32f2f',
  },
  '& .MuiOutlinedInput-root': { 
    color: 'var(--text)',
    '& fieldset': {
      borderColor: 'var(--sub-text)',
    },
  },
});