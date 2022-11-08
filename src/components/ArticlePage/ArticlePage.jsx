import { Alert, Row, Spin } from 'antd'
import { useParams } from 'react-router-dom'

import Article from '../Article/Article'
import { useGetArticleQuery } from '../../api/apiSlice'

import styles from './article-page.module.scss'

export default function ArticlePage() {
  const { slug } = useParams()
  const { data, isSuccess, isLoading, isError, error } = useGetArticleQuery(slug, { refetchOnMountOrArgChange: true })
  let content

  if (isLoading) {
    content = (
      <Row className={styles.spinner} justify="center">
        <Spin text="Loading..." size="large" />
      </Row>
    )
  }

  if (isError) {
    let errorData
    if (data in error) {
      errorData = error.data
    } else {
      //  if has no 'data' property (502 error)
      errorData = error
    }
    content = (
      <Row justify="center">
        <Alert
          className={styles.error}
          message="Error"
          description={`Status: ${error?.status}. ${errorData?.errors?.message || error.error}`}
          type="error"
          showIcon
        />
      </Row>
    )
  }

  if (isSuccess) {
    const { article } = data
    content = <Article article={article} preview={false} />
  }

  return (
    <Row className={styles.articlePage} justify="center">
      {content}
    </Row>
  )
}
