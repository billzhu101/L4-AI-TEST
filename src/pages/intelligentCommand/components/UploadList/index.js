import { Upload, Button, Modal, message } from 'antd';
import { useDispatch, useSelector } from 'umi';
import styles from './index.less';
export default () => {
  const dispatch = useDispatch();
  const { attachments } = useSelector((state) => state.intelligentCommand);
  const onChanges = ({ file, fileList }) => {
    if (file?.response?.XCmdrCode !== undefined) {
      const list =
        file.status === 'done' && file.response?.XCmdrCode === 0 ? [file] : [];

      dispatch({
        type: 'intelligentCommand/overrideStateProps',
        payload: {
          attachments: list,
        },
      });
      if (file.status === 'done' && file.response.XCmdrCode !== 0) {
        message.error('上传附件失败');
      }
    } else {
      let list = [];
      if (fileList.length > 0) {
        list = !!file.status ? [file] : [];
      }
      dispatch({
        type: 'intelligentCommand/overrideStateProps',
        payload: {
          attachments: list,
        },
      });
    }
  };
  const props = {
    withCredentials: false,
    beforeUpload: (file) => {
      const fileType = ['xls', 'xlsx'];
      // 文件显示
      return new Promise((resolve, reject) => {
        const type = file.name
          .substr(file.name.lastIndexOf('.') + 1)
          .toLowerCase();
        if (fileType.indexOf(type) === -1) {
          Modal.warning({
            maskClosable: true,
            title: '文件须为xls、xlsx',
          });
          reject(file);
        } else {
          resolve(file);
        }
      });
    },
    action: `http://gpt-agent.zhgcloud.com/upload`,
  };
  return (
    <div className={styles.uploadList}>
      <Upload {...props} fileList={attachments} onChange={(e) => onChanges(e)}>
        <Button className={styles.button}>提交Excel文件</Button>
      </Upload>
    </div>
  );
};
