import classNames from 'classnames'
import { ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectRootNode, selectText, setText } from '../../modules'
import styles from './MarkdownView.module.scss'

export function MarkdownView() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <MarkdownEditor />
    </div>
  )
}

const textAreaClassName =
  'w-[55ch] h-full mx-auto outline-none text-xl leading-normal p-40 tracking-wide font-mono whitespace-pre-line resize-none'

function MarkdownEditor() {
  const root = useSelector(selectRootNode)
  const text = useSelector(selectText)
  const dispatch = useDispatch()

  if (!root) {
    return <span>Loading</span>
  }

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setText(e.currentTarget.value))
  }

  return (
    <textarea
      className={classNames(textAreaClassName, styles['TextArea'])}
      onChange={handleChange}
      value={text ?? ''}
    />
  )
}
