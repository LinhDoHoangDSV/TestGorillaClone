import type React from 'react'

import { useEffect, useState, type FormEvent } from 'react'
import styles from '../../style/components/profile/profile.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import {
  setIsLoadingFalse,
  setIsLoadingTrue,
  setToasterAppear
} from '../../redux/slices/common.slice'
import { updateUserInformation, UserInformation } from '../../api/user.api'
import { setUserInformation } from '../../redux/slices/user.slice'

interface UserProfile {
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
}

const ProfilePage = () => {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user)
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    firstName: user.first_name || '',
    lastName: user.last_name || '',
    phoneNumber: user.phone_number || '',
    email: user.email || ''
  })
  const [formData, setFormData] = useState<UserProfile>({ ...profile })

  useEffect(() => {
    setProfile({
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phoneNumber: user.phone_number
    })
  }, [user])

  console.log(formData)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!formData.email.includes('@')) {
      dispatch(setToasterAppear({ message: 'email invalid', type: 'error' }))
      return
    }

    dispatch(setIsLoadingTrue())

    const userInformation: UserInformation = {
      email: formData.email,
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone_number: formData.phoneNumber
    }

    const result = await updateUserInformation(userInformation)

    if (result?.status > 299) {
      dispatch(
        setToasterAppear({
          message: "Error while updating user's information",
          type: 'error'
        })
      )
      return
    }

    const user = result?.data?.data

    dispatch(
      setUserInformation({
        email: user?.email,
        first_name: user?.first_name,
        last_name: user?.last_name,
        phone_number: user?.phone_number
      })
    )
    dispatch(
      setToasterAppear({
        message: 'Updating information successfully',
        type: 'success'
      })
    )
    setIsEditing(false)
    dispatch(setIsLoadingFalse())
  }

  const handleCancel = () => {
    setFormData({ ...profile })
    setIsEditing(false)
  }

  return (
    <div className={styles.profile}>
      <div className={styles.profile__container}>
        <div className={styles.profile__header}>
          <h1 className={styles.profile__title}>My Profile</h1>
          {!isEditing && (
            <button
              className={styles.profile__editButton}
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className={styles.profile__card}>
          {isEditing ? (
            <form className={styles.profile__form} onSubmit={handleSubmit}>
              <div className={styles.profile__formRow}>
                <div className={styles.profile__formGroup}>
                  <label className={styles.profile__label}>First Name</label>
                  <input
                    type='text'
                    name='firstName'
                    className={styles.profile__input}
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.profile__formGroup}>
                  <label className={styles.profile__label}>Last Name</label>
                  <input
                    type='text'
                    name='lastName'
                    className={styles.profile__input}
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.profile__formRow}>
                <div className={styles.profile__formGroup}>
                  <label className={styles.profile__label}>Email</label>
                  <input
                    type='email'
                    name='email'
                    className={styles.profile__input}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className={styles.profile__formGroup}>
                  <label className={styles.profile__label}>Phone Number</label>
                  <input
                    type='tel'
                    name='phoneNumber'
                    className={styles.profile__input}
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className={styles.profile__actions}>
                <button
                  type='button'
                  className={styles.profile__cancelButton}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button type='submit' className={styles.profile__saveButton}>
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className={styles.profile__details}>
              <div className={styles.profile__infoRow}>
                <div className={styles.profile__infoGroup}>
                  <h3 className={styles.profile__infoLabel}>First Name</h3>
                  <p className={styles.profile__infoValue}>
                    {profile.firstName}
                  </p>
                </div>
                <div className={styles.profile__infoGroup}>
                  <h3 className={styles.profile__infoLabel}>Last Name</h3>
                  <p className={styles.profile__infoValue}>
                    {profile.lastName}
                  </p>
                </div>
              </div>

              <div className={styles.profile__infoRow}>
                <div className={styles.profile__infoGroup}>
                  <h3 className={styles.profile__infoLabel}>Email</h3>
                  <p className={styles.profile__infoValue}>{profile.email}</p>
                </div>
                <div className={styles.profile__infoGroup}>
                  <h3 className={styles.profile__infoLabel}>Phone Number</h3>
                  <p className={styles.profile__infoValue}>
                    {profile.phoneNumber || '-'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
