module.exports = {
  verify(token) {
    const axios = require('axios');
    if (!token) {
      throw `variable 'token' is missing`
    }
   const params = new URLSearchParams();
   params.append('response', token)
   params.append('secret', process.env.HCAPTCHA_SECRET)
   params.append('sitekey', 'd957bbd0-ca4d-41c2-bfa7-cbc2b72c0305')

    axios.post(`https://hcaptcha.com/siteverify`, params)
      .then(function (data) {
        console.log(data.data)
      })
      .catch(function (error) {
        console.log(error)
      }) 

  } 
}