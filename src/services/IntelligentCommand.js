import request from '@/utils/request';
// import { urlencode } from '@/utils/urlencode';
export default class IntelligentCommand {
  static AI_NLP(fileName, question) {
    return request(`http://gpt-agent.zhgcloud.com/db/${fileName}/${question}`);
  }
  static getFileExplain(fileName) {
    return request(`http://gpt-agent.zhgcloud.com/desc/${fileName}`);
  }
  static editFileExplain(fileName, explain) {
    return request(
      `http://gpt-agent.zhgcloud.com/desc/${fileName}${
        explain ? `/${explain}` : ''
      }`,
      { method: 'POST' },
    );
  }
}
