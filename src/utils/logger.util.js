const fs = require('fs')
const now = () => {
  const today = new Date()
  let hour = today.getHours()
  let minute = today.getMinutes()
  let seconds = today.getSeconds()

  if (hour.toString().length === 1) { hour = '0' + hour }

  if (minute.toString().length === 1) { minute = '0' + minute }

  if (seconds.toString().length === 1) { seconds = '0' + seconds }

  const time = hour + ':' + minute + ':' + seconds
  const month = ((today.getMonth() + 1) < 10) ? `0${today.getMonth() + 1}` : `${today.getMonth() + 1}`
  const day = (today.getDate() < 10) ? `0${today.getDate()}` : `0${today.getDate()}`
  const timeStamp = {
    date: today.getFullYear() + '-' + month + '-' + day
  }

  timeStamp.time = timeStamp.date + ' ' + time

  return timeStamp
}

const logger = async(msg, type) => {
  const date = now()
  const flag = type || 'info'
  const file = `/logs/${date.date}.log`
  let text = ''
  if (fs.existsSync(file)) {
    text = `\n${date.time} ${flag}:${msg}`
  } else {
    text = `${date.time} ${flag}:${msg}`
  }
  if (!fs.existsSync('/logs')) fs.mkdirSync('/logs')
  fs.appendFileSync(file, text)
}

module.exports = logger
