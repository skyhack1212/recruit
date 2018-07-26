import React from 'react'
import {Icon} from 'antd'
import PropTypes from 'prop-types'
import defaultImgUrl from 'images/default.png'

import ScrollObserver from 'components/Common/ScrollObserver'

import styles from './list.less'

class List extends React.Component {
  static propTypes = {
    renderList: PropTypes.func.isRequired,
    loadMore: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    // renderSearch: PropTypes.func,
    renderBatchOperation: PropTypes.func,
    dataLength: PropTypes.number.isRequired,
    remain: PropTypes.number.isRequired,
    search: PropTypes.string.isRequired,
  }

  static defaultProps = {
    renderBatchOperation: () => null,
    // renderSearch: () => null,
  }

  // componentDidMount() {
  //   const {remain, loading, loadMore} = this.props
  //   const callback = () => {
  //     const {bottom} = this.container.getBoundingClientRect()
  //     const windowHeight = window.innerHeight
  //     if (remain && !loading && bottom && bottom < windowHeight) {
  //       loadMore()
  //     }
  //   }

  //   document
  //     .getElementById('content')
  //     .addEventListener('scroll', callback, false)
  // }

  renderEmpty = () => {
    return <div className={styles.centerTip}>没有搜索结果</div>
  }

  renderLoading = () => {
    return (
      <div className={styles.centerTip}>
        <Icon type="loading" /> 正在努力加载数据！
      </div>
    )
  }

  renderDefaultTip = () => {
    return (
      <div className={`${styles.centerTip} ${styles.defaultTip}`}>
        <img src={defaultImgUrl} alt="defaultImg" />请输入查询关键词!
      </div>
    )
  }

  renderMore = () => (
    <div
      className={`${styles.centerTip} ${styles.more}`}
      ref={dom => {
        this.container = dom
      }}
    >
      {this.props.remain ? (
        <span onClick={this.props.loadMore}>加载更多...</span>
      ) : (
        '没有更多数据'
      )}
    </div>
  )

  render() {
    const {
      loading,
      // renderSearch,
      renderList,
      renderBatchOperation,
      dataLength,
      search,
      loadMore,
      remain,
    } = this.props
    const target = document.getElementById('content')
    return (
      <ScrollObserver
        onScrollToBottom={remain ? loadMore : () => {}}
        target={target}
      >
        <div className={styles.content}>
          {
            // renderSearch ? renderSearch() : null
          }
          {dataLength > 0 && renderBatchOperation
            ? renderBatchOperation()
            : null}
          {dataLength > 0 ? renderList() : null}
          {loading ? this.renderLoading() : null}
          {!loading && search !== '' && dataLength > 0
            ? this.renderMore()
            : null}
          {!loading && dataLength === 0 && search !== ''
            ? this.renderEmpty()
            : null}
          {!loading && search === '' ? this.renderDefaultTip() : null}
        </div>
      </ScrollObserver>
    )
  }
}

export default List
