import { useState, useEffect } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import TextField from '@mui/material/TextField';
import { BasicButton } from './BasicButton.js';

export function AddTweetDialog(props) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (props.open) {
      setOpen(props.open);
    }
  }, [props.open]);

  return (
    <Dialog open={open} onClose={() => handleClose(false)}>
      <DialogTitle>트윗 추가</DialogTitle>
      <DialogContent>
        <DialogContentText>
          추가할 트윗의 URL을 입력해주세요.
        </DialogContentText>
        <TextField
          autoFocus
          id='tweet-url'
          label='추가할 트윗 url'
          variant='standard'
          value={url}
          type='text'
          onChange={(e) => setUrl(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <BasicButton onClick={() => handleClose(false)}>취소</BasicButton>
        <BasicButton onClick={() => handleClose(true)}>저장</BasicButton>
      </DialogActions>
    </Dialog>
  );

  function handleClose(save) {
    props.setDialog({
      open: false,
      data: save ? url : ''
    });
    setOpen(false);
    setUrl('');
  }
}