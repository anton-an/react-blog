import { Alert, Row } from 'antd'

import styles from './error.module.scss'

export default function Error({ text }) {
  return (
    <Row justify="center">
      <Alert className={styles.error} message="Error" description={text} type="error" showIcon />
    </Row>
  )
}
