import * as React from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { Input, Form, Button } from 'antd'

import styles from './article-form.module.scss'
import './antd-redefine.scss'

/* eslint-disable react/jsx-props-no-spreading */

export default function ArticleForm({ defaultValues, onSubmit, isLoading }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
  })

  const { fields, remove, append } = useFieldArray({
    control,
    name: 'article.tagList',
  })

  return (
    <div className={styles.container}>
      <Form className={styles.form} layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="article.title"
          rules={{ required: 'Title must not be empty' }}
          render={({ field }) => (
            <Form.Item
              className={styles.formItem}
              label="Title"
              validateStatus={errors.article?.title && 'error'}
              help={errors.article?.title?.message}
              required
            >
              <Input placeholder="Title" value={field} {...field} />
            </Form.Item>
          )}
        />
        <Controller
          control={control}
          name="article.description"
          rules={{ required: 'Description must not be empty' }}
          render={({ field }) => (
            <Form.Item
              className={styles.formItem}
              label="Description"
              required
              validateStatus={errors.article?.description && 'error'}
              help={errors.article?.description?.message}
            >
              <Input placeholder="description" value={field} {...field} />
            </Form.Item>
          )}
        />
        <Controller
          control={control}
          name="article.body"
          rules={{ required: 'Text must not be empty' }}
          render={({ field }) => (
            <Form.Item
              className={styles.formItem}
              label="Text"
              required
              validateStatus={errors.article?.body && 'error'}
              help={errors.article?.body?.message}
            >
              <Input.TextArea placeholder="Text" rows={8} value={field} {...field} />
            </Form.Item>
          )}
        />
        <ul className={styles.tagList}>
          <span className={styles.tagListLabel}>Tags</span>
          {fields.map((item, index) => (
            <li className={styles.tag} key={item.id}>
              <Controller
                control={control}
                name={`article.tagList[${index}]`}
                key={item.id}
                rules={{ required: 'Tag must not be empty' }}
                render={({ field }) => (
                  <Form.Item
                    className={styles.tagInput}
                    validateStatus={errors.article?.tagList?.[index] && 'error'}
                    help={errors.article?.tagList?.[index]?.message}
                  >
                    <Input placeholder="Tag" value={field} {...field} />
                  </Form.Item>
                )}
              />
              <Button className={styles.deleteButton} danger onClick={() => remove(index)}>
                Delete
              </Button>
              {index === fields.length - 1 ? (
                <Button className={styles.addButton} onClick={() => append(null)}>
                  Add tag
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
        {fields.length === 0 ? (
          <Button className={styles.addButton} onClick={() => append('')}>
            Add tag
          </Button>
        ) : null}
        <Button className={styles.submitButton} type="primary" htmlType="submit" loading={isLoading}>
          Submit
        </Button>
      </Form>
    </div>
  )
}
