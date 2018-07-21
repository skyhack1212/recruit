/* eslint-disable max-statements */
/* eslint-disable complexity */
/* eslint-disable react/no-find-dom-node */
import {Component} from 'react'
import {findDOMNode} from 'react-dom'
import {subscribe} from 'subscribe-ui-event'

let isGlobalListenersRegistered = false
let lastUserEvent = 'pointer'

function handleClickEvents() {
  lastUserEvent = 'pointer'
}

function handleWheelEvents() {
  lastUserEvent = 'wheel'
}

function registerGlobalListeners() {
  if (!isGlobalListenersRegistered) {
    window.addEventListener('click', handleClickEvents)
    window.addEventListener('wheel', handleWheelEvents, {
      passive: true,
    })
    window.addEventListener('mousewheel', handleWheelEvents, {
      passive: true,
    })
    window.addEventListener('touchmove', handleWheelEvents, {
      passive: true,
    })
    isGlobalListenersRegistered = true
  }
}

class ScrollObserver extends Component {
  static defaultProps = {
    threshold: 1,
    useRAF: true,
    emitOnce: true,
  }

  state = {bottom: 0}

  componentDidMount() {
    this.node = findDOMNode(this)

    registerGlobalListeners()
    const {throttleRate, useRAF} = this.props
    const position = window.pageYOffset

    this.startPosition = position
    this.previousPosition = position

    this.subscription = subscribe('scroll', this.handleScroll, {
      throttleRate,
      useRAF,
    })
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  currentDirection = null
  lastEmitDirection = null
  startPosition = 0
  previousPosition = 0

  handleScroll = () => {
    const position = window.pageYOffset
    /**
     * safari 下（-webkit-overflow-scrolling: touch）
     * window.pageYOffset 有负值，屏蔽事件
     * */

    if (position < 0) {
      return
    }

    const direction = position < this.previousPosition ? 'up' : 'down'

    if (direction !== this.currentDirection) {
      this.currentDirection = direction
      this.startPosition = this.previousPosition
    }

    this.previousPosition = position

    const {
      threshold,
      emitOnce,
      onScrollUp,
      onScrollDown,
      onScrollToBottom,
      onScrollToTop,
    } = this.props

    if (Math.abs(this.startPosition - position) >= threshold) {
      const {bottom} = this.node.getBoundingClientRect()

      if (
        direction === 'down' &&
        this.state.bottom > window.innerHeight &&
        bottom <= window.innerHeight &&
        onScrollToBottom
      ) {
        onScrollToBottom()
      }

      if (
        direction === 'up' &&
        this.state.bottom < window.innerHeight &&
        bottom >= window.innerHeight &&
        onScrollToTop
      ) {
        onScrollToTop()
      }

      this.setState({bottom})

      if (
        lastUserEvent === 'wheel' &&
        (!emitOnce || this.lastEmitDirection !== direction)
      ) {
        if (direction === 'up') {
          if (onScrollUp) {
            onScrollUp()
          }
        }

        if (direction === 'down') {
          if (onScrollDown) {
            onScrollDown()
          }
        }
      }

      this.lastEmitDirection = direction
      this.startPosition = position
    }
  }

  render() {
    return this.props.children || null
  }
}

export default ScrollObserver
