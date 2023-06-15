import IntelligentCommand from '@/services/IntelligentCommand';
import { message } from 'antd';
export default {
  namespace: 'intelligentCommand',
  state: {
    question: '',
    chatList: [
      // {
      //   type: 'question',
      //   content: 'A机械今天工作了多长时间',
      //   time: new Date().toLocaleString(),
      // },
      // {
      //   type: 'answer',
      //   content: '尊敬的指挥官用户您好，暂时没有查询到A机械的今日工时数据',
      //   time: new Date().toLocaleString(),
      // },
    ],
    status: 'start', // start、speakingStart、speaking、speakingEnd、end
    attachments: [],
  },
  reducers: {
    overrideStateProps(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    updateStateProps(state, { payload }) {
      const { name, value } = payload;
      return {
        ...state,
        ...{ [name]: { ...state[name], ...value } },
      };
    },
    saveProject(state, { payload }) {
      return { ...state, project: payload };
    },
  },
  effects: {
    *getAIAnswer({ payload }, { call, put, select }) {
      const { question, answerIdx } = payload;
      const { attachments, chatList } = yield select(
        (state) => state.intelligentCommand,
      );
      if (!question?.length) {
        return message.error('问题为空');
      }
      if (!attachments?.length) {
        return message.error('请上传Excel文件');
      }

      const fileName = attachments[0].name.split('.')[0];
      yield put({
        type: 'overrideStateProps',
        payload: { status: 'loading' },
      });
      const response = yield call(
        IntelligentCommand.AI_NLP,
        fileName,
        question,
      );
      if (!!response.sql) {
        message.success(response.XCmdrMsg || '请求成功');
        let answer = '';
        if (response.data?.length > 0) {
          answer += `一共找到了${response.data.length}条数据：`;
          response.data.forEach((ele, idx) => {
            answer += `【${idx + 1}】${ele};`;
          });
        } else {
          answer = '对不起，没有找到您想要的数据';
        }
        chatList[answerIdx].content = answer;
        yield put({
          type: 'overrideStateProps',
          payload: { chatList: chatList },
        });
      } else {
        message.error(response.XCmdrMsg || '请求失败');
      }
      yield put({
        type: 'overrideStateProps',
        payload: { question: '', status: 'success' },
      });
    },
  },
};
