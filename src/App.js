import React, { useRef } from 'react';
import clamp from 'lodash-es/clamp'
import { useSprings, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import Styles from './App.module.scss';

const pages = [
  'https://images.pexels.com/photos/62689/pexels-photo-62689.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/296878/pexels-photo-296878.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/1509428/pexels-photo-1509428.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/351265/pexels-photo-351265.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/924675/pexels-photo-924675.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
]

function App() {
  const index = useRef(0)
  const [props, set] = useSprings(pages.length, i => ({ x: i * window.innerWidth, sc: 1, display: 'block' }))
  const bind = useDrag(({ down, delta: [xDelta], direction: [xDir], distance, cancel }) => {
    if (down && distance > window.innerWidth / 2)
      cancel((index.current = clamp(index.current + (xDir > 0 ? -1 : 1), 0, pages.length - 1)))
    set(i => {
      if (i < index.current - 1 || i > index.current + 1) return { display: 'none' }
      const x = (i - index.current) * window.innerWidth + (down ? xDelta : 0)
      const sc = down ? 1 - distance / window.innerWidth / 2 : 1
      return { x, sc, display: 'block' }
    })
  })

  const handlePrevious = () => {
    if (index.current > 0) {
      index.current = index.current - 1
      set(i => {
        return { x: (i - (index.current)) * window.innerWidth, sc: 1, display: 'block'}
      })
    }
  }

  const handleNextPage = () => {
    if (index.current >= 0 && index.current < pages.length -1 ) {
      index.current = index.current + 1
      set(i => {
        return { x: (i - (index.current)) * window.innerWidth, sc: 1, display: 'block'}
      })
    }
  }

  return (
    <div className={Styles.App}>
        <span className={Styles.previous} onClick={handlePrevious}>
          <img src="/arrow_back_ios-24px.svg" alt="previous" />
        </span>
        {
          props.map(({ x, display, sc }, i) => (
            <animated.div {...bind()} key={i} style={{ display, transform: x.interpolate(x => `translate3d(${x}px,0,0)`) }}>
              <animated.div style={{ transform: sc.interpolate(s => `scale(${s})`), backgroundImage: `url(${pages[i]})` }} />
            </animated.div>
          ))
        }
        <span className={Styles.next} onClick={handleNextPage}>
          <img src="/arrow_forward_ios-24px.svg" alt="next" />
        </span>
    </div>
  );
}

export default App;
