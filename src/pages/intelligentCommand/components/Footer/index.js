import { Button, Input, message } from 'antd';
import { useSelector, useDispatch } from 'umi';
import styles from './index.less';

export default () => {
  const dispatch = useDispatch();
  const { chatList, question, attachments, status } = useSelector(
    (state) => state.intelligentCommand,
  );

  const onPressEnter = () => {
    if (!question?.length) {
      return message.error('请输入问题');
    }
    if (!attachments?.length) {
      return message.error('请上传Excel文件');
    }
    chatList.push(
      {
        type: 'question',
        content: question,
        time: new Date().toLocaleString(),
      },
      {
        type: 'answer',
        content: '正在思考中...',
        time: new Date().toLocaleString(),
      },
    );
    dispatch({
      type: 'intelligentCommand/overrideStateProps',
      payload: {
        status: 'loading',
        chatList: chatList,
        question: '',
      },
    });
    dispatch({
      type: 'intelligentCommand/getAIAnswer',
      payload: {
        question: question,
        answerIdx: chatList.length - 1,
      },
    });
  };

  return (
    <div className={styles.footer}>
      <Input
        type="text"
        value={question}
        onChange={(e) => {
          dispatch({
            type: 'intelligentCommand/overrideStateProps',
            payload: {
              question: e.target.value,
            },
          });
        }}
        placeholder="请录入问题，并点击【发送】或回车"
        onPressEnter={onPressEnter}
      />
      <Button onClick={onPressEnter}>发送</Button>
    </div>
  );
};
