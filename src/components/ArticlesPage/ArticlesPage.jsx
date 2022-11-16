import { Row, Pagination, Spin } from 'antd'
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { useGetArticlesListQuery } from '../../api/apiSlice'
import getErrorMessage from '../../helpers/errorMessage'
import Article from '../Article'
import Error from '../Error'

import styles from './articles-page.module.scss'

export default function ArticlesPage() {
  const [offset, setOffset] = useState(0)
  const [pageSize] = useState(20)
  const navigate = useNavigate()
  const params = useParams()
  const { pathname } = useLocation()
  const { data, isSuccess, isLoading, isError, error } = useGetArticlesListQuery(offset, {
    refetchOnMountOrArgChange: true,
  })

  useEffect(() => {
    setOffset((params.page - 1) * pageSize)
  }, [params.page, pageSize])

  useEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    })
  }, [pathname])

  let totalArticles
  let content

  if (isLoading) {
    content = (
      <Row className={styles.spinner} justify="center" align="center">
        <Spin text="Loading..." size="large" />
      </Row>
    )
  } else if (isSuccess) {
    const { articles, articlesCount } = data
    content = articles.map((article) => <Article key={article.slug} article={article} preview />)
    totalArticles = articlesCount
  }

  if (isError) {
    content = <Error text={getErrorMessage(error)} />
  }

  return (
    <Row justify="center">
      <Row justify="center">{content}</Row>
      <Row className={styles.pagination} justify="center">
        <Pagination
          current={Number(params?.page)}
          total={totalArticles}
          pageSize={pageSize}
          hideOnSinglePage
          showSizeChanger={false}
          onChange={(page) => {
            navigate(`/articles/page/${page}`)
          }}
          size="small"
        />
      </Row>
    </Row>
  )
}
