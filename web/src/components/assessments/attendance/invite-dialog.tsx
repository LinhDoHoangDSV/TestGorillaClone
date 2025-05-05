import { FC, useState } from 'react'
import styles from '../../../style/components/assessments/attendance/invite-dialog.module.scss'
import { useDispatch } from 'react-redux'
import {
  setIsLoadingFalse,
  setIsLoadingTrue,
  setToasterAppear
} from '../../../redux/slices/common.slice'
import { sendTestRequest } from '../../../api/test-assignment.api'
import { SendTestRequestDto } from '../../../constant/api'
import { InviteDialogProps } from '../../../constant/common'
import Button from '../../ui/button'

const InviteDialog: FC<InviteDialogProps> = ({ testId }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const dispatch = useDispatch()

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
    setEmail('')
  }

  const handleSubmit = async () => {
    if (!email || email.trim() === '' || !email.includes('@')) {
      dispatch(
        setToasterAppear({ message: 'email must not be blank', type: 'error' })
      )
      return
    }

    dispatch(setIsLoadingTrue())
    const request: SendTestRequestDto = {
      emails: email.trim(),
      test_id: testId
    }
    const result = await sendTestRequest(request)

    if (result?.status > 299) {
      dispatch(
        setToasterAppear({
          message: 'Error while sending requests',
          type: 'error'
        })
      )
    } else {
      dispatch(
        setToasterAppear({ message: 'Sending all requests', type: 'success' })
      )
    }
    dispatch(setIsLoadingFalse())
    handleClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    } else if (e.key === 'Escape') {
      handleClose()
    }
  }

  return (
    <div className={styles.invite}>
      <Button variant='primary' onClick={handleOpen}>
        Invite candidates
      </Button>

      {isOpen && (
        <div className={styles.invite__overlay}>
          <div className={styles.invite__dialog} onKeyDown={handleKeyDown}>
            <div className={styles.invite__content}>
              <h3 className={styles.invite__title}>Invite candidates</h3>

              <div className={styles.invite__input_wrapper}>
                <input
                  type='email'
                  className={styles.invite__input}
                  placeholder='Input emails'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
              </div>

              <div className={styles.invite__actions}>
                <Button onClick={handleClose} variant='secondary'>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  variant='primary'
                  disabled={!email.trim()}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InviteDialog
