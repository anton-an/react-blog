import { Row, Typography, Form, Input, Button, Checkbox, message, Divider } from 'antd'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { setLoggedUser } from '../../store/userSlice'
import { useRegisterMutation } from '../../api/apiSlice'

import styles from './register.module.scss'
import './antd-redefine.scss'

export default function Register() {
  const { Title, Text } = Typography
  const { Password } = Input
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const [register, { data: userData, isError, isSuccess, isLoading, error }] = useRegisterMutation()

  useEffect(() => {
    if (isSuccess) {
      localStorage.setItem('user', JSON.stringify(userData))
      dispatch(setLoggedUser({ user: userData }))
      message.success('Successfully signed up!')
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
  }, [isSuccess, userData, navigate, error, form, dispatch, isError])

  const onFinish = ({ user }) => {
    register(user)
  }

  const registerForm = (
    <Form
      form={form}
      name="register"
      layout="vertical"
      initialValues={{ user: { username: '', email: '', password: '' }, confirm: '', agreement: '' }}
      onFinish={onFinish}
      scrollToFirstError
    >
      <Form.Item
        className={styles.form__input}
        name={['user', 'username']}
        label="Username"
        rules={[
          {
            min: 3,
            max: 20,
            message: 'Your username needs to be beetween 3 to 20 characters.',
          },
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input placeholder="Username" />
      </Form.Item>
      <Form.Item
        className={styles.form__input}
        name={['user', 'email']}
        label="Email address"
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
            message: 'Please input your password!',
          },
          {
            min: 6,
            message: 'Your password needs to be at least 6 characters.',
          },
          {
            max: 40,
            message: 'Your password needs to be no longer than 40 characters.',
          },
        ]}
        hasFeedback
      >
        <Password placeholder="Password" />
      </Form.Item>

      <Form.Item
        className={styles.form__input}
        name="confirm"
        label="Repeat Password"
        dependencies={['user', 'password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue(['user', 'password']) === value) {
                return Promise.resolve()
              }
              return Promise.reject(new Error('The two passwords that you entered do not match!'))
            },
          }),
        ]}
      >
        <Input.Password placeholder="Password" />
      </Form.Item>
      <Divider />
      <Form.Item
        className={styles.form__input}
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value ? Promise.resolve() : Promise.reject(new Error('You should accept agreement')),
          },
        ]}
      >
        <Checkbox>I agree to the processing of my personal information</Checkbox>
      </Form.Item>
      <Form.Item className={styles.submitButton}>
        <Button type="primary" htmlType="submit" loading={isLoading} block>
          Create
        </Button>
      </Form.Item>
      <Text className={styles.suggestionText} type="secondary">
        Already have an account? <a href="/sign-in">Sign In</a>
      </Text>
    </Form>
  )

  return (
    <Row justify="center">
      <div className={styles.register}>
        <Title className={styles.title} level={3}>
          Create new account
        </Title>
        {registerForm}
      </div>
    </Row>
  )
}
