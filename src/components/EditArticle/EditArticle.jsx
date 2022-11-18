import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { message, Spin, Row } from 'antd'

import { useEditArticleMutation, useGetArticleQuery } from '../../api/apiSlice'
import ArticleForm from '../ArticleForm'
import Error from '../Error'
import getErrorMessage from '../../helpers/errorMessage'

import styles from './edit-article.module.scss'

export default function EditArticle() {
  const { slug } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const [editArticle, { isLoading, isSuccess, isError, error }] = useEditArticleMutation()
  const {
    data,
    isSuccess: isArticleLoaded,
    isError: isArticleError,
    isLoading: isArticleLoading,
    error: articleError,
  } = useGetArticleQuery(slug, { skip: !state })

  useEffect(() => {
    if (isSuccess) {
      message.success('Article updated successfully!')
      navigate(`../articles/${slug}`, { replace: true })
    }
  }, [navigate, isSuccess, slug])

  let articleData

  if (data) {
    const { title, description, body, tagList } = data.article
    articleData = {
      article: {
        title,
        description,
        body,
        tagList,
      },
    }
  }
  const onSubmit = (values) => {
    editArticle({ id: slug, data: values })
  }

  const spinner = (
    <Row className={styles.spinner} justify="center">
      <Spin size="large" />
    </Row>
  )

  return (
    <main>
      {isArticleLoading && spinner}
      {isArticleError && <Error text={getErrorMessage(articleError)} />}
      {isArticleLoaded && (
        <ArticleForm
          defaultValues={articleData}
          isError={isError}
          error={error}
          isLoading={isLoading}
          onSubmit={onSubmit}
        />
      )}
    </main>
  )
}
