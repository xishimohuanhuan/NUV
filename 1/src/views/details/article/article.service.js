export default function(_axios) {
  function q(url, data, method = 'post') {
    let config = {
      url,
      method
    };
    if (method === 'post') {
      config.data = data;
    } else {
      config.params = data;
    }
    return _axios(config);
  }
  return {
    queryNoticeList(data) {
      return q('version/api/article/getNoticeByPage', data, 'get');
    },
    queryNoticeDetail(data) {
      return q('version/api/article/getContentById', data, 'get');
    }
  }
}