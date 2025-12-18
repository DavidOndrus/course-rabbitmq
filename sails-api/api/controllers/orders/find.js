const axios = require('axios');

module.exports = async function find(req, res) {
  const {data} = await axios.get('http://feathers-orders:8080/orders', {
    params: {
      ...req.query,
      '$sort[price]': 1,
      '$select': ['author', 'item', '_id']
    }
  });

  return res.json(data);
};
