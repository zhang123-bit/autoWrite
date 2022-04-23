const puppeteer = require("puppeteer")
const axios = require("axios")
const qs = require('qs')
const user = {
  username: "20175146",
  password: "19910715Mazibo"
}
/* let a=async()=>{
    axios.post('https://xxcapp.xidian.edu.cn/uc/wap/login/check',qs.stringify( {
        username: user.username,
        password:user.password
      }))
      .then(function (response) {
        console.log(response);
        
      })
      .catch(function (error) {
        console.log(error);
      });
} */
let sleep = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('0k')
    }, time)
  })
}
let b = async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],

    headless: false
  });
  const page = await browser.newPage()
  await page.evaluateOnNewDocument(() => {
    const newProto = navigator.__proto__;
    delete newProto.webdriver;
    navigator.__proto__ = newProto;
  });
  page.on('console', msg => {
    if (typeof msg === 'object') {
      // console.dir(msg)
    } else {
      //console.log(chalk.blue(msg))
    }
  })
  await page.evaluateOnNewDocument(function () {
    navigator.geolocation.getCurrentPosition = function (cb) {
      setTimeout(() => {
        cb({
          'coords': {
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            latitude: 34.129057,
            longitude: 108.835246,
            accuracy: 100,
            speed: null
          }
        })
      }, 1000)
    }
  });
  await page.goto('http://authserver.nwu.edu.cn/authserver/login?service=https%3A%2F%2Fapp.nwu.edu.cn%2Fa_nwu%2Fapi%2Fsso%2Fcas%3Fredirect%3Dhttps%253A%252F%252Fapp.nwu.edu.cn%252Fsite%252Fncov%252Fdailyup%26from%3Dwap')
  await page.click('input[type="text"]')
  await page.keyboard.type(user.username);
  await page.click('input[type="password"]')
  await page.keyboard.type(user.password);
  await sleep(3000)
  await page.click(".auth_login_btn")
  await page.waitForResponse('https://app.nwu.edu.cn/wap/log/save-log')
  await page.click('div[name="area"]>input')
  await sleep(4000)
  await page.click(".footers>a")
  await sleep(1000)
  try {


    await page.click(".wapcf-btn-ok")
    console.log('填报成功', new Date())
    await page.goto('https://push.gh.117503445.top:20000/push/text/v2?name=KaiAn&text=马子博SuccessfullyReported')


  } catch (error) {
    console.log('填报错误', new Date())
    await page.goto('https://push.gh.117503445.top:20000/push/text/v2?name=KaiAn&text=马子博,填报失败,六小时后重新填报')
  }

  browser.close()

}
b()

setInterval(() => {
  b()

}, 1000 * 60 * 60 * 6)