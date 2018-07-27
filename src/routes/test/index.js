import React from 'react'
import styles from './index.less'

export default function() {
  const back1 = () => {
    window.history.back()
  }
  const back2 = (tips = '', flag = true) => {
    if (window.parent.MaiMai_Native) {
      window.parent.MaiMai_Native.close_native(tips, flag)
    }
  }
  const back3 = () => {
    window.close()
  }
  return (
    <div className={styles.main}>
      <div className={styles.content}>这里是要添加的内容</div>
      <div className={styles.buttons}>
        <button onClick={back1} className={styles.button}>
          退出1
        </button>
        <button onClick={back2} className={styles.button}>
          退出2
        </button>
        <button onClick={back3} className={styles.button}>
          退出3
        </button>
      </div>
    </div>
  )
}
