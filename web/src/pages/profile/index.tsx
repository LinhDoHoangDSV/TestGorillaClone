import { lazy, Suspense } from 'react'
import Loading from '../../components/loading'

const ProfileComp = lazy(() => import('../../components/profile/profile'))

const Profile = () => {
  return (
    <Suspense fallback={<Loading />}>
      <ProfileComp />
    </Suspense>
  )
}

export default Profile
