module.exports = {
  async verify(token) {
  const axios = require('axios');
    if (!token) {
      throw `variable 'token' is missing`
    }

    let returned;
    const params = await new URLSearchParams();
    await params.append('response', token)
    await params.append('secret', process.env.HCAPTCHA_SECRET)
    await params.append('sitekey', 'd957bbd0-ca4d-41c2-bfa7-cbc2b72c0305')

    await axios.post(`https://hcaptcha.com/siteverify`, params)
      .then(function (data) {
        //console.log(data.data)
        returned = data.data.success
      })
      .catch(function (error) {
        console.log(error)
      }) 

      return returned;
  } 
}