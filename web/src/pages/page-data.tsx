import Home from '.'
import Footer from '../components/footer'
import Header from '../components/header'
import { RouterType } from '../constant/common'
import Assessments from './assessments'
import AssessmentsNew from './assessments/new'
import Candidates from './candidates'
import Login from './login'

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
    element: <Assessments />,
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
    title: 'new-assessments',
    path: '/assessments/new',
    element: <AssessmentsNew />,
    header: false,
    footer: <Footer />
  },
  {
    title: 'login',
    path: '/login',
    element: <Login />,
    header: false,
    footer: false
  },
  {
    title: 'assessments',
    path: '/assessments',
    element: <Assessments />,
    header: false,
    footer: false
  }
]

export default pagesData
