import dva from 'dva'
import createHistory from 'history/createBrowserHistory'
import createLoading from 'dva-loading'
import {message} from 'antd'
import routerM from 'routerM'

import models from 'models'
import {ERROR_MSG_DURATION} from 'constants'

import './index.less'

// 1. Initialize
const app = dva({
  history: createHistory(),
  onError(e) {
    if (Object.prototype.toString.call(e) === '[object Error]') {
      message.error(e.message, ERROR_MSG_DURATION)
    }
  },
})

// 2. Plugins
app.use(createLoading())

// 3. Model move to router
models.forEach(app.model)

// 4. Router
app.router(routerM)

// 5. Start
app.start('#root')
