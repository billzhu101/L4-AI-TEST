import styles from './index.less';
import { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'umi';
import { Spin } from 'antd';
export default ({ onStart, onEnd }) => {
  const dispatch = useDispatch();
  const timerRef = useRef(null);
  const { status, chatList } = useSelector((state) => state.intelligentCommand);
  let [countdown, setCountDown] = useState(0);

  useEffect(() => {
    setCountDown(0);
    if (status === 'speakingStart') {
      timerRef.current = setInterval(() => {
        setCountDown(countdown++);
        if (countdown >= 60) {
          clearInterval(timerRef.current);
        }
      }, 1000);
    }
    return () => {
      clearInterval(timerRef.current);
    };
  }, [status]);

  const startQuestion = () => {
    dispatch({
      type: 'intelligentCommand/overrideStateProps',
      payload: { status: 'speakingStart' },
    });
    onStart();
  };

  const endQuestion = () => {
    onEnd();
  };

  return (
    <div className={styles.container}>
      <div className={styles.pi_container}>
        {chatList.map((item, index) => {
          return (
            <div key={index} className={styles.chat}>
              <div
                style={{
                  textAlign: item.type === 'question' ? 'left' : 'right',
                  color: item.type === 'question' ? 'green' : 'blue',
                }}
              >
                <div>{item.time}</div>
                <div className={styles.question_content}>{item.content}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {status === 'start' || status === 'success' || status === 'loading' ? (
          <div className={styles.button} onClick={() => startQuestion()}>
            点击开始语音提问
          </div>
        ) : (
          <div className={styles.button} onClick={() => endQuestion()}>
            点击完成提问
          </div>
        )}

        {status === 'start' ||
        status === 'loading' ||
        status === 'success' ? null : (
          <div className={styles.countdown}>
            录音中 00:{countdown < 10 ? `0${countdown}` : countdown} / 01:00
          </div>
        )}
      </div>
    </div>
  );
};
