import { Typography, Form, Input, Button, message, Row } from 'antd'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { useLoginMutation } from '../../api/apiSlice'
import { selectCurrentUser, setLoggedUser } from '../../store/userSlice'

import styles from './login.module.scss'
import './antd-redefine.scss'

export default function Login() {
  const { Title, Text } = Typography
  const { Password } = Input
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const [form] = Form.useForm()

  const [login, { data: userData, isLoading, isError, isSuccess, error }] = useLoginMutation()

  useEffect(() => {
    if (currentUser) {
      navigate('/', { replace: true })
    }
  }, [currentUser, navigate])

  useEffect(() => {
    if (isSuccess) {
      localStorage.setItem('user', JSON.stringify(userData))
      dispatch(setLoggedUser({ user: userData }))
      message.success('Successfully signed in!')
      navigate(-1, { replace: true })
    }
    if (isError) {
      const { data } = error
      const errorKeys = Object.keys(data.errors)
      errorKeys.forEach((key) => {
        form.setFields([
          {
            name: ['user', 'email'],
            errors: [`${key} ${data.errors[key]}`],
          },
        ])
      })
    }
  }, [isSuccess, userData, dispatch, navigate, isError, error, form])

  const onFinish = (value) => {
    login(value)
  }

  const loginForm = (
    <Form
      form={form}
      name="login"
      layout="vertical"
      initialValues={{ user: { email: '', password: '' } }}
      onFinish={onFinish}
      scrollToFirstError
    >
      <Form.Item
        className={styles.form__input}
        name={['user', 'email']}
        label="E-mail"
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          {
            required: true,
            message: 'Please input your E-mail!',
          },
        ]}
      >
        <Input placeholder="Email address" />
      </Form.Item>

      <Form.Item
        className={styles.form__input}
        name={['user', 'password']}
        label="Password"
        rules={[
          {
            required: true,
            whitespace: true,
            message: 'Please enter your password!',
          },
        ]}
        hasFeedback
      >
        <Password placeholder="Password" />
      </Form.Item>
      <Form.Item className={styles.submitButton}>
        <Button type="primary" htmlType="submit" loading={isLoading} size="large" block>
          Login
        </Button>
      </Form.Item>
      <Text className={styles.suggestionText} type="secondary">
        Don&apos;t have an account? <a href="/sign-up">Sign Up</a>
      </Text>
    </Form>
  )

  return (
    <Row justify="center">
      <div className={styles.login}>
        <Title className={styles.title} level={3}>
          Sign In
        </Title>
        {loginForm}
      </div>
    </Row>
  )
}
