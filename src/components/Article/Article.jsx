import { HeartFilled, HeartOutlined } from '@ant-design/icons'
import { Card, Button, Row, Typography, Tag, Avatar, Col, Popconfirm, message } from 'antd'
import format from 'date-fns/format'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

import { useDeleteArticleMutation, useFavoritePostMutation, useUnfavoritePostMutation } from '../../api/apiSlice'
import { selectCurrentUser } from '../../store/userSlice'

import styles from './article.module.scss'

export default function Article({ article, preview }) {
  const { Text, Paragraph } = Typography
  const { slug, createdAt, tagList, favorited, favoritesCount } = article
  const { username, image } = article.author
  const [isFavorited, setIsFavorited] = useState(favorited)
  const [favoritesCounter, setFavoritesCounter] = useState(favoritesCount)
  const [
    deleteArticle,
    { isLoading: isDeleteLoading, isSuccess: isDeleteSuccess, isError: isDeleteError, error: deleteError },
  ] = useDeleteArticleMutation()
  const [
    favorite,
    {
      data: favoriteData,
      error: isfavoriteError,
      isLoading: isfavoriteLoading,
      isSuccess: isfavoriteSuccess,
      reset: resetFavorite,
    },
  ] = useFavoritePostMutation()
  const [
    unfavorite,
    {
      data: unfavoriteData,
      error: isUnfavoriteError,
      isLoading: isUnfavoriteLoading,
      isSuccess: isUnfavoriteSuccess,
      reset: resetUnfavorite,
    },
  ] = useUnfavoritePostMutation()
  useEffect(() => {
    if (isfavoriteSuccess) {
      setFavoritesCounter(favoriteData.article.favoritesCount)
      message.success('Successfully favorited!')
      resetFavorite()
    }
    if (isUnfavoriteSuccess) {
      setFavoritesCounter(unfavoriteData.article.favoritesCount)
      message.success('Successfully unfavorited!')
      resetUnfavorite()
    }
  }, [isfavoriteSuccess, isUnfavoriteSuccess, favoriteData, unfavoriteData, resetFavorite, resetUnfavorite])
  useEffect(() => {
    if (isfavoriteError) {
      message.error('Cannot favorite the post')
    }
    if (isUnfavoriteError) {
      message.error('Cannot unfavorite the post')
    }
  }, [isUnfavoriteError, isfavoriteError])
  const currentUser = useSelector(selectCurrentUser)
  const navigate = useNavigate()
  const articleText = (
    <Row className={styles.text}>
      <Col sm={18}>
        <Paragraph>
          <ReactMarkdown>{article.body}</ReactMarkdown>
        </Paragraph>
      </Col>
    </Row>
  )

  useEffect(() => {
    if (isDeleteSuccess) {
      message.success('Article is deleted')
      navigate('/')
    }
    if (isDeleteError) {
      message.error(deleteError.text)
    }
  }, [isDeleteSuccess, isDeleteError, deleteError?.text, navigate])

  const confirm = () => {
    deleteArticle(slug)
  }

  const editButtons = (
    <Row className={styles.editButtons}>
      <Popconfirm title="Are you sure to delete this article?" onConfirm={confirm} okText="Yes" cancelText="No">
        <Button className={styles.deleteButton} danger loading={isDeleteLoading}>
          Delete
        </Button>
      </Popconfirm>
      <Button className={styles.editButton}>
        <Link to={`../articles/${slug}/edit`} state={article}>
          Edit
        </Link>
      </Button>
    </Row>
  )

  const tags =
    tagList.length !== 0 && tagList.map((tag, index) => <Tag key={`${slug}__tag${index + 1}`}>{tag || 'empty'}</Tag>)
  return (
    <Card className={styles.article}>
      <div className={styles.articleContent}>
        <section className={styles.articleSection}>
          <Row className={styles.heading} align="middle">
            <Button className={styles.link} type="link">
              {preview ? <Link to={`../articles/${slug}`}>{article.title}</Link> : article.title}
            </Button>
            <Button
              className={styles.favoriteButton}
              type="text"
              size="small"
              shape="circle"
              disabled={!currentUser}
              onClick={() => {
                if (!isUnfavoriteLoading && !isfavoriteLoading) {
                  setIsFavorited(!isFavorited)
                  if (!isFavorited) {
                    setFavoritesCounter(favoritesCounter + 1)
                    favorite(slug)
                  }
                  if (isFavorited) {
                    setFavoritesCounter(favoritesCounter - 1)
                    unfavorite(slug)
                  }
                }
              }}
            >
              {isFavorited ? <HeartFilled className={styles.favoriteFilled} /> : <HeartOutlined />}
            </Button>
            {favoritesCounter}
          </Row>
          <Row className={styles.tags}>{tags}</Row>
          <Text type={preview ? 'primary' : 'secondary'}>{article.description}</Text>
        </section>
        <section className={styles.authorSection}>
          <Row className={styles.author} justify="space-between">
            <Col>
              <h2 className={styles.authorName}>{username}</h2>
              <Text className={styles.date} type="secondary">
                {format(new Date(createdAt), 'MMMM dd, y')}
              </Text>
            </Col>
            <Avatar className={styles.avatar} size="large" src={image} />
          </Row>
          {currentUser?.username === username && !preview ? editButtons : null}
        </section>
      </div>
      {!preview ? articleText : null}
    </Card>
  )
}
