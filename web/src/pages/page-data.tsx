import Home from '.'
import Footer from '../components/footer'
import Header from '../components/header'
import NotFound from '../components/not-found'
import { RouterType } from '../constant/common'
import Assessment from './assessments'
import TakeAssessment from './assessments/attendance'
import AssessmentGrade from './assessments/grade'
import AssessmentsNew from './assessments/new'
import AssessmentViewAndOwn from './assessments/view-and-own'
import LoginPage from './auth'
import Candidates from './candidates'
import Login from './login'
import Profile from './profile'

const pagesData: RouterType[] = [
  {
    title: 'home',
    path: '/',
    element: <Home />,
    header: <Header />,
    footer: <Footer />
  },
  {
    title: 'assessments',
    path: '/assessments',
    element: <Assessment />,
    header: <Header />,
    footer: <Footer />
  },
  {
    title: 'profile',
    path: '/profile',
    element: <Profile />,
    header: <Header />,
    footer: <Footer />
  },
  {
    title: 'candidates',
    path: '/candidates',
    element: <Candidates />,
    header: <Header />,
    footer: <Footer />
  },
  {
    title: 'grade-assessments',
    path: '/assessments/grade/:path',
    element: <AssessmentGrade />,
    header: <Header />,
    footer: <Footer />
  },
  {
    title: 'new-assessments',
    path: '/assessments/new',
    element: <AssessmentsNew />,
    header: false,
    footer: <Footer />
  },
  {
    title: 'login',
    path: '/login',
    element: <LoginPage />,
    header: false,
    footer: false
  },
  {
    title: 'assessments-attendance',
    path: '/assessments/attendance/:path',
    element: <TakeAssessment />,
    header: false,
    footer: false
  },
  {
    title: 'login',
    path: '/login',
    element: <Login />,
    header: false,
    footer: false
  },
  {
    title: 'assessments/edit',
    path: '/assessments/:path',
    element: <AssessmentViewAndOwn />,
    header: <Header />,
    footer: <Footer />
  },
  {
    title: 'assessments/view',
    path: '/assessments/view/:path',
    element: <AssessmentViewAndOwn />,
    header: <Header />,
    footer: <Footer />
  },
  {
    title: 'not-found',
    path: '*',
    element: <NotFound />,
    header: <Header />,
    footer: <Footer />
  }
]

export default pagesData
