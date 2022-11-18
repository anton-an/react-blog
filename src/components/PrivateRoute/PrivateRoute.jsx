import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { useGetArticleQuery } from '../../api/apiSlice'
import { selectCurrentUser } from '../../store/userSlice'

export default function PrivateRoute({ protectedComponent }) {
  const { slug } = useParams()
  const { data } = useGetArticleQuery(slug)
  const navigate = useNavigate()
  const user = useSelector(selectCurrentUser)
  if (data) {
    const { author } = data.article
    if (author.username !== user.username) {
      navigate(-1, { replace: true })
    } else {
      return protectedComponent
    }
  }
}
