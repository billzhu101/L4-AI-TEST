import { Upload, Modal, message, Input } from 'antd';
import { useDispatch, useSelector } from 'umi';
import { useState } from 'react';
import styles from './index.less';

export default () => {
  let [isEdit, setEdit] = useState(false);
  const dispatch = useDispatch();

  const { attachments, explain } = useSelector(
    (state) => state.intelligentCommand,
  );
  const showExplain = !!attachments.find((r) => r.status === 'done');
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

      if (file.status === 'done' && file?.response !== 'OK') {
        message.error('上传文件失败');
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
      if (file?.status === 'done' && file?.response === 'OK') {
        message.success('上传文件成功');
        dispatch({
          type: 'intelligentCommand/getFileExplain',
        });
      }
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
      <div className={styles.file}>Excel文件</div>
      <Upload {...props} fileList={attachments} onChange={(e) => onChanges(e)}>
        <div className={styles.link}>提交</div>
      </Upload>
      {showExplain ? (
        <>
          <div className={styles.explain}>文件说明</div>
          <div
            className={styles.submit}
            onClick={() => {
              if (isEdit) {
                dispatch({ type: 'intelligentCommand/editFileExplain' });
              }
              setEdit(!isEdit);
            }}
          >
            {!isEdit ? '编辑' : '提交'}
          </div>
          {isEdit ? (
            <Input.TextArea
              className={styles.text}
              placeholder="请输入文件说明"
              onChange={(e) => {
                dispatch({
                  type: 'intelligentCommand/overrideStateProps',
                  payload: {
                    explain: e.target.value,
                  },
                });
              }}
              value={explain}
            />
          ) : (
            <div className={styles.text}>{explain}</div>
          )}
        </>
      ) : null}
    </div>
  );
};
