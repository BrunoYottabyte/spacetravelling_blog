import styles from './header.module.scss';
import commonStyles from '../../styles/common.module.scss';
import Link from 'next/link';


export default function Header() {
  return (
    <Link href={'/'}>
      <header className={`${styles.header} ${commonStyles.container}`}>
        <img src="/assets/logo.svg" alt="logo" className={styles.logo} />
      </header>
    </Link>
  )
}
