import request from '@/utils/request';
import { urlencode } from '@/utils/urlencode';
export default class IntelligentCommand {
  // NLP
  static AI_NLP(fileName, question) {
    return request(
      `http://gpt-agent.zhgcloud.com/db/${fileName}/${question}`,
      // { method: 'POST', params },
    );
  }
}
