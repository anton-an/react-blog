import { Alert, Row, Spin } from 'antd'
import { useParams, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

import Article from '../Article/Article'
import { useGetArticleQuery } from '../../api/apiSlice'

import styles from './article-page.module.scss'

export default function ArticlePage() {
  const { slug } = useParams()
  const { pathname } = useLocation()
  const { data, isSuccess, isLoading, isError } = useGetArticleQuery(slug, { refetchOnMountOrArgChange: true })
  let content

  useEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    })
  }, [pathname])

  if (isLoading) {
    content = (
      <Row className={styles.spinner} justify="center">
        <Spin text="Loading..." size="large" />
      </Row>
    )
  }

  if (isError) {
    content = (
      <Row justify="center">
        <Alert
          className={styles.error}
          message="Error"
          description="Something went wrong. Try again later."
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
