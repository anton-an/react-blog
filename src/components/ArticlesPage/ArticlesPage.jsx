import { Row, Pagination, Spin, Alert, Col } from 'antd'
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { useGetArticlesListQuery } from '../../api/apiSlice'
import Article from '../Article'

import styles from './articles-page.module.scss'
import './antd-redefine.scss'

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
    let errorData
    if ('data' in error) {
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

  return (
    <Row justify="center">
      <Col>
        {content}
        <Row className={styles.pagination} justify="center">
          <Pagination
            current={Number(params?.page)}
            total={totalArticles}
            pageSize={pageSize}
            showSizeChanger={false}
            onChange={(page) => {
              navigate(`/articles/page=${page}`)
            }}
            size="small"
          />
        </Row>
      </Col>
    </Row>
  )
}
