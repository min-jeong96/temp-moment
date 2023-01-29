import { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export function AlertSnackbar(props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (props.alert.timestamp) {
      setOpen(true);
    }
  }, [props.alert.timestamp]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
      onClose={() => setOpen(false)} >
      <Alert onClose={() => setOpen(false)} severity={props.alert.severity} sx={{ width: '100%' }}>
        {props.alert.message}
      </Alert>
    </Snackbar>
  )
}