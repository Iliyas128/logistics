import Spinner from 'react-bootstrap/Spinner';
import styles from './FullScreenSpinner.module.scss';

function FullScreenSpinner() {
  return (
  <div className={styles.FullScreen}>
  <Spinner animation="border"/>
  </div>
)
}

export default FullScreenSpinner;