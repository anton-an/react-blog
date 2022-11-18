import 'antd/dist/antd.css'
import { Alert, Layout } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import BlogHeader from '../BlogHeader'
import ArticlesPage from '../ArticlesPage'
import Register from '../Register'
import ArticlePage from '../ArticlePage/ArticlePage'
import Login from '../Login'
import { selectCurrentUser } from '../../store/userSlice'
import { setOffline, selectIsOffline } from '../../store/appSlice'
import EditProfile from '../EditProfile/EditProfile'
import CreateArticle from '../CreateArticle'
import EditArticle from '../EditArticle'
import PageNotFound from '../PageNotFound'
import PrivateRoute from '../PrivateRoute/PrivateRoute'

import styles from './app.module.scss'

export default function App() {
  const user = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const isOffline = useSelector(selectIsOffline)
  useEffect(() => {
    window.addEventListener('offline', () => dispatch(setOffline(true)))
    window.addEventListener('online', () => dispatch(setOffline(false)))
  }, [dispatch])

  const { Content } = Layout
  const goLogin = <Navigate to="/sign-in" replace />

  return (
    <Layout style={{ minWidth: 540 }}>
      <BlogHeader className={styles.blogHeader} />
      <Content className={styles.content}>
        {isOffline ? (
          <Alert
            className={styles.error}
            banner
            message="Error"
            description="No internet! Check your connection"
            type="error"
            showIcon
          />
        ) : null}
        <Routes>
          <Route path="/" element={<Navigate to={`/articles/page/${1}`} replace />} />
          <Route path="/articles" element={<Navigate to={`/articles/page/${1}`} replace />} />
          <Route path="/articles/page/:page" element={<ArticlesPage />} />
          <Route path="/articles/:slug" element={<ArticlePage />} />
          <Route
            path="/articles/:slug/edit"
            element={user ? <PrivateRoute protectedComponent={<EditArticle />} /> : goLogin}
          />
          <Route path="/profile" element={user ? <EditProfile /> : goLogin} />
          <Route path="/sign-up" element={<Register />} />
          <Route path="/sign-in" element={<Login />} />
          <Route path="/new-article" element={user ? <CreateArticle /> : goLogin} />
          <Route path="/page-not-found" element={<PageNotFound />} />
          <Route path="*" element={<Navigate to="/page-not-found" replace />} />
        </Routes>
      </Content>
    </Layout>
  )
}
