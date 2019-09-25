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
    queryBanner(data) {
      return q('version/api/banner/getBanners', data, 'post');
    },
    queryArticleType(data) {
      return q('version/api/banner/getArticleType', data, 'post');
    },
    queryOptionalData(data) {
      return q('/user/collect/getCollect', data, 'get');
    },
    queryTransactionData(data) {
      return q('/Ajax/getCoinInfoNew', data, 'get', process.env.VUE_APP_PHP_Url, false);
    },
    queryGenerte(data) {
      return q('/ajax/generate_name', data, 'post',process.env.VUE_APP_PHP_Url,false);
    },
  }
}