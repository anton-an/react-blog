import { Button, message } from 'antd'
import { HeartFilled, HeartOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { useFavoritePostMutation, useUnfavoritePostMutation } from '../../api/apiSlice'
import { selectCurrentUser } from '../../store/userSlice'

import styles from './favorite.module.scss'

export default function Favorite({ slug, favoritesCount, favorited }) {
  const [favoritesCounter, setFavoritesCounter] = useState(favoritesCount)
  const [isFavorited, setIsFavorited] = useState(favorited)
  const currentUser = useSelector(selectCurrentUser)

  const [favorite, { error: isFavoriteError, isLoading: isFavoriteLoading }] = useFavoritePostMutation()
  const [unfavorite, { error: isUnfavoriteError, isLoading: isUnfavoriteLoading }] = useUnfavoritePostMutation()

  useEffect(() => {
    if (isFavoriteError) {
      message.error('Cannot favorite the post')
    }
    if (isUnfavoriteError) {
      message.error('Cannot unfavorite the post')
    }
  }, [isUnfavoriteError, isFavoriteError])

  return (
    <>
      <Button
        className={styles.favoriteButton}
        type="text"
        size="small"
        shape="circle"
        disabled={!currentUser}
        onClick={() => {
          if (!isUnfavoriteLoading && !isFavoriteLoading) {
            if (isFavorited) {
              setFavoritesCounter(favoritesCounter - 1)
              setIsFavorited(false)
              unfavorite(slug)
            }
            if (!isFavorited) {
              setFavoritesCounter(favoritesCounter + 1)
              setIsFavorited(true)
              favorite(slug)
            }
          }
        }}
      >
        {isFavorited ? <HeartFilled className={styles.favoriteFilled} /> : <HeartOutlined />}
      </Button>
      {favoritesCounter}
    </>
  )
}
