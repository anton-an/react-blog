import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { message } from 'antd'

import { useEditArticleMutation } from '../../api/apiSlice'
import ArticleForm from '../ArticleForm'

export default function EditArticle() {
  const location = useLocation()
  const navigate = useNavigate()
  const [editArticle, { isLoading, isSuccess, isError, error }] = useEditArticleMutation()
  const { slug, title, description, body, tagList } = location.state
  useEffect(() => {
    if (isSuccess) {
      message.success('Article updated successfully!')
      navigate(`../articles/${slug}`, { replace: true })
    }
  }, [navigate, isSuccess, slug])

  const articleData = {
    article: {
      title,
      description,
      body,
      tagList,
    },
  }
  const onSubmit = (values) => {
    editArticle({ id: slug, data: values })
  }

  return (
    <ArticleForm
      defaultValues={articleData}
      isError={isError}
      error={error}
      isLoading={isLoading}
      onSubmit={onSubmit}
    />
  )
}
