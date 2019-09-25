export default (_axios) => {
  function q(url, data, method = 'post', baseURL, withCredentials) {
    let config = {
      url,
      method
    }
    if (method === 'post') {
      config['data'] = data;
    } else if (method === 'get') {
      config['params'] = data;
    }
    if (baseURL) {
      config['baseURL'] = baseURL;
    }
    if (typeof(withCredentials) !== undefined) {
      config['withCredentials'] = withCredentials;
    }
    return _axios(config);
  }
  return {
    queryTransactionData(data) {
      return q('/Ajax/getCoinInfoNew', data, 'get', process.env.VUE_APP_PHP_Url, false);
    },
    queryOptionalData(data) {
      return q('/user/collect/getCollect', data, 'get');
    },
    addOptional(data) {
      return q('/user/collect/addCollect', data, 'post');
    },
    delOptional(data) {
      return q('/user/collect/delCollect', data, 'post');
    },
    topOptional(data) {
      return q('/user/collect/topCollect', data, 'post');
    }
  }
}