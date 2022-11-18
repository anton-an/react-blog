import { Row, Spin } from 'antd'
import { useParams, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

import Article from '../Article/Article'
import { useGetArticleQuery } from '../../api/apiSlice'
import Error from '../Error'
import getErrorMessage from '../../helpers/errorMessage'

import styles from './article-page.module.scss'

export default function ArticlePage() {
  const { slug } = useParams()
  const { pathname } = useLocation()
  const { data, isSuccess, isLoading, isError, error } = useGetArticleQuery(slug)
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
        <Spin size="large" />
      </Row>
    )
  }

  if (isError) {
    content = <Error text={getErrorMessage(error)} />
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
