import { Suspense, useEffect, useRef, useState } from 'react'
import styles from '../../../style/pages/new-assessment.module.scss'
import Loading from '../../../components/loading'
import Header from '../../../components/assessments/new/header'
import Content from '../../../components/assessments/new/content'
import { QuestionsType } from '../../../constant/common'

const AssessmentsNew = () => {
  const [currentStep, setCurrentStep] = useState<number>(1)
  // const [testTitle, setTestTitle] = useState<string>('')
  const [questions, setQuestions] = useState<QuestionsType[]>([])
  const [title, setTitle] = useState<string>('Your new test')
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false)
  const [totalTime, setTotalTime] = useState<number>(10)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditingTitle && inputRef.current) inputRef.current.focus()
  }, [isEditingTitle])

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className={styles['assessments-new']}>
        <Header
          title={title}
          setTitle={setTitle}
          isEditingTitle={isEditingTitle}
          setIsEditingTitle={setIsEditingTitle}
          inputRef={inputRef}
        />
        <Content
          totalTime={totalTime}
          setTotalTime={setTotalTime}
          questions={questions}
          setQuestions={setQuestions}
          onNext={handleNext}
          onBack={handleBack}
        />
      </div>
    </Suspense>
  )
}

export default AssessmentsNew
