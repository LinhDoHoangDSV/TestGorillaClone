'use client'

import { type FC, useState } from 'react'
import styles from '../../../style/components/new-assessments/create-question.module.scss'
import Button from '../../ui/button'

interface EssayQuestionDialogProps {
  // onSave: (question: any) => void
  onCancel: () => void
}

const EssayQuestionDialog: FC<EssayQuestionDialogProps> = ({
  // onSave,
  onCancel
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  // const [timeLimit, setTimeLimit] = useState(5)
  // const [wordLimit, setWordLimit] = useState(500)
  // const [evaluationCriteria, setEvaluationCriteria] = useState('')

  // const handleSave = () => {
  //   if (!title.trim()) {
  //     return
  //   }

  //   onSave({
  //     type: 'essay',
  //     title,
  //     description,
  //     timeLimit,
  //     wordLimit,
  //     evaluationCriteria
  //   })
  // }

  return (
    <div className={styles['question-dialog__overlay']}>
      <div className={styles['question-dialog']}>
        <div className={styles['question-dialog__header']}>
          <h2 className={styles['question-dialog__title']}>
            New Essay Question
          </h2>
          <button
            className={styles['question-dialog__close-button']}
            onClick={onCancel}
          >
            <svg
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className={styles['question-dialog__close-icon']}
            >
              <path
                d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
                fill='currentColor'
              />
            </svg>
          </button>
        </div>

        <div className={styles['question-dialog__content']}>
          <div className={styles['question-dialog__section']}>
            <h3 className={styles['question-dialog__section-title']}>
              Question
            </h3>
            <div className={styles['question-dialog__form-group']}>
              <label
                className={styles['question-dialog__label']}
                htmlFor='title'
              >
                Question title{' '}
                <span className={styles['question-dialog__required']}>*</span>
              </label>
              <input
                id='title'
                type='text'
                className={styles['question-dialog__input']}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Enter question title'
                required
              />
            </div>

            <div className={styles['question-dialog__form-group']}>
              <label
                className={styles['question-dialog__label']}
                htmlFor='description'
              >
                Question description
              </label>
              <textarea
                id='description'
                className={styles['question-dialog__textarea']}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Enter detailed instructions for the candidate'
                rows={4}
              />
            </div>
          </div>
        </div>

        <div className={styles['question-dialog__footer']}>
          <Button variant='secondary' onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant='primary'
            // onClick={handleSave}
            disabled={!title.trim()}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EssayQuestionDialog
