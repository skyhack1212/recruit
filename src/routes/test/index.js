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

    if (window.MaiMai_Native) {
      window.MaiMai_Native.close_native(tips, flag)
    }
  }

  return (
    <div className={styles.main}>
      <div className={styles.content}>这里是要添加的内容</div>
      <div className={styles.buttons}>
        <button onClick={back1} className={styles.button}>
          其他按钮
        </button>
        <button onClick={back2} className={styles.button}>
          退出
        </button>
      </div>
    </div>
  )
}
