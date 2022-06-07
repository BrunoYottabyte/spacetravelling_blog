import styles from './header.module.scss';
import commonStyles from '../../styles/common.module.scss';


export default function Header() {
  return (
    <header className={`${styles.header} ${commonStyles.container}`}>
    <img src="/assets/logo.svg" alt="logo" className={styles.logo} />
    </header>
  )
}
