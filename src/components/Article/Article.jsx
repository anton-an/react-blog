import { HeartFilled, HeartOutlined } from '@ant-design/icons'
import { Card, Button, Row, Typography, Tag, Avatar, Col, Popconfirm, message } from 'antd'
import format from 'date-fns/format'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { truncate } from 'lodash'

import { useDeleteArticleMutation, useLikePostMutation, useUnlikePostMutation } from '../../api/apiSlice'
import { selectCurrentUser } from '../../store/userSlice'

import styles from './article.module.scss'

export default function Article({ article, preview }) {
  const { Text, Title, Paragraph } = Typography
  const { slug, createdAt, tagList, favorited, favoritesCount } = article
  const { username, image } = article.author
  const [isLiked, setIsLiked] = useState(favorited)
  const [favoritesCounter, setFavoritesCounter] = useState(favoritesCount)
  const [
    deleteArticle,
    { isLoading: isDeleteLoading, isSuccess: isDeleteSuccess, isError: isDeleteError, error: deleteError },
  ] = useDeleteArticleMutation()
  const [
    like,
    { data: likeData, error: isLikeError, isLoading: isLikeLoading, isSuccess: isLikeSuccess, reset: resetLike },
  ] = useLikePostMutation()
  const [
    unlike,
    {
      data: unlikeData,
      error: isUnlikeError,
      isLoading: isUnlikeLoading,
      isSuccess: isUnlikeSuccess,
      reset: resetUnlike,
    },
  ] = useUnlikePostMutation()
  useEffect(() => {
    if (isLikeSuccess) {
      setFavoritesCounter(likeData.article.favoritesCount)
      resetLike()
    }
    if (isUnlikeSuccess) {
      setFavoritesCounter(unlikeData.article.favoritesCount)
      resetUnlike()
    }
  }, [isLikeSuccess, isUnlikeSuccess, likeData, unlikeData, resetLike, resetUnlike])
  useEffect(() => {
    if (isLikeError) {
      message.error('Cannot favorite the post')
    }
    if (isUnlikeError) {
      message.error('Cannot unfavorite the post')
    }
  }, [isUnlikeError, isLikeError])
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
    <Row justify="center">
      <Col span={14} style={{ minWidth: 800 }}>
        <Card className={styles.article} bodyStyle={{ padding: 0 }}>
          <Row justify="space-between" align="center">
            <Col span={16}>
              <Row align="middle" style={{ marginBottom: 6 }}>
                <Button className={styles.article__link} type="link" style={{ padding: 0 }}>
                  {preview ? (
                    <Link to={`../articles/${slug}`}>{truncate(article.title, { length: 48 })}</Link>
                  ) : (
                    article.title
                  )}
                </Button>
                <Button
                  className={styles.likeButton}
                  type="text"
                  size="small"
                  shape="circle"
                  disabled={!currentUser}
                  onClick={() => {
                    if (!isUnlikeLoading && !isLikeLoading) {
                      setIsLiked(!isLiked)
                      if (!isLiked) {
                        setFavoritesCounter(favoritesCounter + 1)
                        like(slug)
                      }
                      if (isLiked) {
                        setFavoritesCounter(favoritesCounter - 1)
                        unlike(slug)
                      }
                    }
                  }}
                >
                  {isLiked ? <HeartFilled style={{ color: '#FF0707' }} /> : <HeartOutlined />}
                </Button>
                {favoritesCounter}
              </Row>
              <Row style={{ marginBottom: 6 }}>{tags}</Row>
              <Row style={!preview ? { marginTop: 16 } : null} justify="space-between">
                <Text type={preview ? 'primary' : 'secondary'}>{article.description}</Text>
              </Row>
            </Col>
            <Col>
              <Row>
                <Col className={styles.nameCol} style={{ marginRight: 16 }}>
                  <Title level={4} style={{ fontWeight: 300, margin: 0 }}>
                    {username}
                  </Title>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {format(new Date(createdAt), 'MMMM dd, y')}
                  </Text>
                  {currentUser?.username === username && !preview ? editButtons : null}
                </Col>
                <Col>
                  <Avatar size="large" src={image} />
                </Col>
              </Row>
            </Col>
          </Row>
          {!preview ? articleText : null}
        </Card>
      </Col>
    </Row>
  )
}
