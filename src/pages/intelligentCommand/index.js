/* eslint-disable no-console */
import { useRef } from 'react';
import { useDispatch, useSelector } from 'umi';
import Dialog from './components/Dialog';
import Footer from './components/Footer';
import UploadList from './components/UploadList';
import styles from './index.less';
import CryptoJS from './utils/hmac-sha256';
import CryptoJSBase64 from './utils/enc-base64-min';
import { message } from 'antd';
const RecorderManager = require('./utils/dist/index.umd.js');
const recorder = new RecorderManager('../../some');
const APPID = 'da678c28';

export default () => {
  const dispatch = useDispatch();
  const { question, chatList, attachments } = useSelector(
    (state) => state.intelligentCommand,
  );
  const wsRef = useRef({});
  const timerRef = useRef();
  let resultText = '';
  let resultTextTemp = '';
  let countdownInterval;

  const toBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  recorder.onFrameRecorded = ({ isLastFrame, frameBuffer }) => {
    if (wsRef.current?.readyState === wsRef.current?.OPEN) {
      wsRef.current?.send(
        JSON.stringify({
          data: {
            status: isLastFrame ? 2 : 1,
            format: 'audio/L16;rate=16000',
            encoding: 'raw',
            audio: toBase64(frameBuffer),
          },
        }),
      );
      if (isLastFrame) {
        // wsRef.current?.send('{"end": true}');
      }
    }
  };
  recorder.onStop = () => {
    clearInterval(countdownInterval);
  };

  const getWebSocketUrl = () => {
    let url = 'wss://iat-api.xfyun.cn/v2/iat';
    var host = 'iat-api.xfyun.cn';
    var apiKey = 'ce80d6c16d97df05b2352a6a0303d485';
    var apiSecret = 'NGM4YjUzNjc4ZjY1ZGNiMjI4NWM0NTFm';
    var date = new Date().toGMTString();
    var algorithm = 'hmac-sha256';
    var headers = 'host date request-line';
    var signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/iat HTTP/1.1`;
    var signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret);
    var signature = CryptoJSBase64().enc.Base64.stringify(signatureSha);
    var authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
    var authorization = btoa(authorizationOrigin);
    url = `${url}?authorization=${authorization}&date=${date}&host=${host}`;
    return url;
  };

  const renderResult = (resultData) => {
    // 识别结束
    let jsonData = JSON.parse(resultData);
    if (jsonData.data && jsonData.data.result) {
      let data = jsonData.data.result;
      let str = '';
      let ws = data.ws;
      for (let i = 0; i < ws.length; i++) {
        str = str + ws[i].cw[0].w;
      }
      // 开启wpgs会有此字段(前提：在控制台开通动态修正功能)
      // 取值为 "apd"时表示该片结果是追加到前面的最终结果；取值为"rpl" 时表示替换前面的部分结果，替换范围为rg字段
      if (data.pgs) {
        if (data.pgs === 'apd') {
          // 将resultTextTemp同步给resultText
          resultText = resultTextTemp;
        }
        // 将结果存储在resultTextTemp中
        resultTextTemp = resultText + str;
      } else {
        resultText = resultText + str;
      }
      console.log(resultText);
      dispatch({
        type: 'intelligentCommand/overrideStateProps',
        payload: {
          question: resultText,
        },
      });
    }
    if (jsonData.code === 0 && jsonData.data.status === 2) {
      wsRef.current.close();
    }
    if (jsonData.code !== 0) {
      wsRef.current.close();
      console.error(jsonData);
    }
  };

  const connectWebSocket = () => {
    const websocketUrl = getWebSocketUrl();
    if ('WebSocket' in window) {
      wsRef.current = new WebSocket(websocketUrl);
    } else if ('MozWebSocket' in window) {
      wsRef.current = new MozWebSocket(websocketUrl);
    } else {
      alert('浏览器不支持WebSocket');
      return;
    }
    wsRef.current.onopen = () => {
      // 开始录音
      recorder.start({
        sampleRate: 16000,
        frameSize: 1280,
      });
      var params = {
        common: {
          app_id: APPID,
        },
        business: {
          language: 'zh_cn',
          domain: 'iat',
          accent: 'mandarin',
          vad_eos: 5000,
          dwa: 'wpgs',
        },
        data: {
          status: 0,
          format: 'audio/L16;rate=16000',
          encoding: 'raw',
        },
      };
      wsRef.current.send(JSON.stringify(params));
    };

    wsRef.current.onmessage = (e) => {
      renderResult(e.data);
    };
    wsRef.current.onerror = (e) => {
      console.error(e, 1);
      recorder.stop();
    };
    wsRef.current.onclose = (e) => {
      recorder.stop();
      console.error(e, 2);
    };
  };

  const onStart = (restart) => {
    dispatch({
      type: 'intelligentCommand/overrideStateProps',
      payload: {
        question: '',
      },
    });
    if (restart === 'restart') {
      dispatch({
        type: 'intelligentCommand/overrideStateProps',
        payload: { status: 'speakingStart', isBack: true, isAnswering: false },
      });
    } else {
      dispatch({
        type: 'intelligentCommand/overrideStateProps',
        payload: { status: 'speakingStart', isBack: false, isAnswering: false },
      });
    }
    connectWebSocket();
  };

  const onEnd = () => {
    recorder.stop();
    wsRef.current?.close();
    if (!question?.length) {
      dispatch({
        type: 'intelligentCommand/overrideStateProps',
        payload: {
          status: 'loading',
        },
      });
      return message.error('请录入问题');
    }
    if (!attachments?.length) {
      dispatch({
        type: 'intelligentCommand/overrideStateProps',
        payload: {
          status: 'loading',
        },
      });
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
        question,
        answerIdx: chatList.length - 1,
      },
    });
  };

  return (
    <div className={styles.content}>
      <Dialog onStart={onStart} onEnd={onEnd} />
      <Footer />
      <UploadList />
    </div>
  );
};
