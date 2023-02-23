import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export function ProgressBackdrop(props) {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={props.isLoading} >
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}