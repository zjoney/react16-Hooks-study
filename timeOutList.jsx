




// import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [{ 'a': 1 }, { 'left': '00:00:03' }, { 'left': '00:00:04' }]
    };
  }
  suppleZero(num) {
    return num.toString().padStart(2, '0')
  }
  cutDownTimeArr(ts = 0) {
    let day = Math.floor((ts / 1000 / 3600) / 24)
    let hour = Math.floor((ts / 1000 / 3600) % 24)
    let minute = Math.floor((ts / 1000 / 60) % 60)
    let second = Math.floor(ts / 1000 % 60)
    let milliseconds = (Math.floor(ts % 1000)).toString().replace(/\d{1}$/, '')
    return [this.suppleZero(day), this.suppleZero(hour), this.suppleZero(minute), this.suppleZero(second), milliseconds]
  }
  funCutDownTime() {
    const { data } = this.state
    const step = 1000
    let timer = null
    let count = 0
    const temp = data.map(item => {
      const result = this.cutDownTimeArr(item.ts)
      if (item.ts - step >= 0) {
        count++
      }
      return {
        ...item,
        ts: (item.ts - step) < 0 ? 0 : (item.ts - step),
        left: `${result[1]}:${result[2]}:${result[3]}`,
      }
    })
    console.log('检测定时器是否结束', count)
    this.setState(() => ({
      data: temp
    }), () => {
      if (count === 0) {
        clearTimeout(timer)
        return
      }
      timer = setTimeout(() => {
        clearTimeout(timer)
        this.funCutDownTime()
      }, step)
    })
  }
  // 组件即将被挂在到页面的时候自动执行
  componentWillMount() {
    // ajax请求不放在这里的原因是，当代码运行在Native时会有兼容问题
    const { data } = this.state
    const temp = data.map(item => {
      let ts = 0
      if (item.left) {
        const arrDate = item.left.split(':')
        ts = (arrDate[0] * 1 * 60 * 60 + arrDate[1] * 1 * 60 + arrDate[2] * 1) * 1000
      }
      return {
        ...item,
        ts: ts
      }
    })
    this.setState(() => ({
      data: temp
    }), () => {
      this.funCutDownTime()
    })
  }
  // 组件被更新之前，它会自动被执行
  shouldComponentUpdate() {
    return true
  }
  render() {
    const { state: { data } } = this
    return (
      <div className="fin-container" >
        {/* {data.map((item, index) => (<li key={index}>{item.left}</li>))} */}
        {data.map((item, index) => {
          let ele = null
          if (item.left) {
            ele = <li key={index}>{item.left}</li>
          }
          return ele
        })}
      </div>
    );
  }
}
ReactDOM.render(<Index />, document.getElementById('page-content'));
