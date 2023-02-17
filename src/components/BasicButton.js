import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

export const BasicButton = styled(Button)({
  '&.Mui-disabled': {
    background: 'var(--sub-text)',
    color: 'var(--background)'
  },
});