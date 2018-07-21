import React from 'react'
import PropTypes from 'prop-types'
import {Radio} from 'antd'
import * as R from 'ramda'

import {RESUME_STATE_MAP} from 'constants/resume'

const StateSelect = props => (
  <Radio.Group value={props.value} onChange={props.onChange}>
    {R.values(
      R.mapObjIndexed(
        (text, key) => (
          <Radio.Button value={key} key={key}>
            {text}
          </Radio.Button>
        ),
        RESUME_STATE_MAP
      )
    )}
  </Radio.Group>
)

StateSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
}

export default StateSelect
