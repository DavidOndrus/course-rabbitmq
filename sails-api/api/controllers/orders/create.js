const axios = require('axios');

module.exports = async function create(req, res) {
  const {data} = await axios.post('http://feathers-orders:8080/orders', req.body);
  return res.json(data);
};
