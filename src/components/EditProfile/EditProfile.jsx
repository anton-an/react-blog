import { Form, Typography, Input, Button, Row, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import removeEmpty from '../../helpers/removeEmpty'
import { selectCurrentUser, setLoggedUser } from '../../store/userSlice'
import { useUpdateUserMutation } from '../../api/apiSlice'

import styles from './edit-profile.module.scss'

export default function EditProfile() {
  const { Title } = Typography
  const { Password } = Input
  const currentUser = useSelector(selectCurrentUser)
  const [updateUser, { data: userData, isSuccess, isError, error }] = useUpdateUserMutation()
  const dispatch = useDispatch()

  let errorText
  const [form] = Form.useForm()
  useEffect(() => {
    if (isSuccess) {
      const { user } = userData
      localStorage.setItem('user', JSON.stringify(user))
      message.success('Profile sucsessfully updated!')
      dispatch(setLoggedUser(userData))
    }

    if (isError) {
      const { data } = error
      const errorKeys = Object.keys(data.errors)
      errorKeys.forEach((key) => {
        form.setFields([
          {
            name: ['user', `${key}`],
            errors: [`${key} ${data.errors[key]}`],
          },
        ])
      })
    }
  }, [isSuccess, isError, dispatch, error, form, userData])

  const onFinish = (value) => {
    updateUser(removeEmpty(value))
  }

  const editForm = (
    <Form
      form={form}
      initialValues={{
        user: {
          username: currentUser?.username,
          email: currentUser?.email,
          password: currentUser?.password,
          image: currentUser?.image,
        },
      }}
      name="register"
      layout="vertical"
      onFinish={onFinish}
      scrollToFirstError
    >
      <Form.Item
        className={styles.form__input}
        name={['user', 'username']}
        label="Username"
        preserve={false}
        rules={[
          {
            min: 3,
            max: 20,
            message: 'Your username needs to be beetween 3 to 20 characters.',
          },
        ]}
      >
        <Input placeholder="Username" autoComplete="false" />
      </Form.Item>
      <Form.Item
        className={styles.form__input}
        name={['user', 'email']}
        label="Email address"
        preserve={false}
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          {
            message: 'Please input your E-mail!',
          },
        ]}
      >
        <Input placeholder="Email address" autoComplete="false" />
      </Form.Item>

      <Form.Item
        className={styles.form__input}
        name={['user', 'password']}
        label="New password"
        rules={[
          {
            min: 6,
            message: 'Your password needs to be at least 6 characters.',
          },
          {
            max: 40,
            message: 'Your password needs to be no longer than 40 characters.',
          },
        ]}
      >
        <Password placeholder="New password" autoComplete="false" />
      </Form.Item>
      <Form.Item
        className={styles.form__input}
        name={['user', 'image']}
        label="Avatar image (URL)"
        preserve={false}
        rules={[{ type: 'url', message: 'Not valid avatar URL!' }]}
      >
        <Input placeholder="Avatar image" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" size="large" block>
          Save
        </Button>
      </Form.Item>
    </Form>
  )

  return (
    <Row justify="center">
      <div className={styles.editForm}>
        <Title className={styles.title} level={3}>
          Edit profile
        </Title>
        {isError ? errorText : null}
        {editForm}
      </div>
    </Row>
  )
}
