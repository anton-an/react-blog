import { Typography, Layout, Button, Row, Col, Avatar } from 'antd'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { useGetUserQuery } from '../../api/apiSlice'
import { resetLoggedUser, selectCurrentUser } from '../../store/userSlice'

import styles from './blog-header.module.scss'

export default function BlogHeader() {
  const { Title, Text } = Typography
  const { Header } = Layout
  const currentUser = useSelector(selectCurrentUser)
  const { data: userData, refetch } = useGetUserQuery('', { skip: !currentUser })
  useEffect(() => {
    if (currentUser) {
      refetch()
    }
  }, [currentUser, refetch])
  const dispatch = useDispatch()
  const login = (
    <>
      <Button type="text" href="/sign-in">
        Sign In
      </Button>
      <Button className={styles.signUpButton} href="/sign-up">
        Sign Up
      </Button>
    </>
  )

  const avatarPlaceholder = 'https://static.productionready.io/images/smiley-cyrus.jpg'
  const userInfo = (
    <>
      <Button className={styles.createButton} href="/new-article" size="small">
        Create article
      </Button>
      <Link className={styles.userLink} to="/profile">
        <Text className={styles.username}>{userData?.user.username}</Text>
        <Avatar className={styles.avatar} size="large" src={userData?.user.image || avatarPlaceholder} />
      </Link>
      <Button
        onClick={() => {
          dispatch(resetLoggedUser())
          localStorage.clear()
        }}
        size="large"
      >
        Log Out
      </Button>
    </>
  )
  return (
    <Header className={styles.header}>
      <Row justify="space-between" align="middle">
        <Title style={{ fontSize: 18, margin: 0 }}>
          <Link to="/">Realworld Blog</Link>
        </Title>
        <Col>{currentUser ? userInfo : login}</Col>
      </Row>
    </Header>
  )
}
