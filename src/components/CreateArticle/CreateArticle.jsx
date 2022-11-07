import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'

import { useCreateArticleMutation } from '../../api/apiSlice'
import ArticleForm from '../ArticleForm'

export default function CreateArticle() {
  const navigate = useNavigate()
  const [createArticle, { data, isLoading, isSuccess, isError, error }] = useCreateArticleMutation()
  useEffect(() => {
    if (isSuccess) {
      const { slug } = data.article
      message.success('Article created successfully!')
      navigate(`../articles/${slug}`, { replace: true })
    }
  }, [navigate, isSuccess, data])
  const defaultValues = {
    article: {
      title: '',
      description: '',
      body: '',
      tagList: [''],
    },
  }
  const onSubmit = (values) => {
    const { title, body, description, tagList } = values.article
    const filteredTags = tagList.filter((item) => item !== '')
    const articleData = { article: { title, body, description, tagList: filteredTags } }
    createArticle(articleData)
  }

  return (
    <ArticleForm
      defaultValues={defaultValues}
      isError={isError}
      error={error}
      isLoading={isLoading}
      onSubmit={onSubmit}
    />
  )
}
