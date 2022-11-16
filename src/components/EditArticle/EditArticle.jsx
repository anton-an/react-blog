import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { message, Spin, Row } from 'antd'
import { useSelector } from 'react-redux'

import { useEditArticleMutation, useGetArticleQuery } from '../../api/apiSlice'
import ArticleForm from '../ArticleForm'
import { selectCurrentUser } from '../../store/userSlice'
import Error from '../Error'
import getErrorMessage from '../../helpers/errorMessage'

import styles from './edit-article.module.scss'

export default function EditArticle() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { username: currentUsername } = useSelector(selectCurrentUser)
  const [editArticle, { isLoading, isSuccess, isError, error }] = useEditArticleMutation()
  const {
    data,
    isSuccess: isArticleLoaded,
    isError: isArticleError,
    isLoading: isArticleLoading,
    error: articleError,
  } = useGetArticleQuery(slug)

  useEffect(() => {
    if (isSuccess) {
      message.success('Article updated successfully!')
      navigate(`../articles/${slug}`, { replace: true })
    }
  }, [navigate, isSuccess, slug])

  let articleData

  if (data) {
    const { title, description, body, tagList, author } = data.article
    const { username: authorUsername } = author
    if (currentUsername !== authorUsername) {
      navigate(-1, { replace: true })
    }
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
