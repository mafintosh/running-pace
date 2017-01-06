#!/usr/bin/env node

if (!process.argv[2]) {
  console.error('Usage: running-pace: [time/distance]')
  console.error()
  console.error('Examples:')
  console.error('  running-pace 5min/km')
  console.error('  running-pace 1h:42m:42s/21.1km')
  console.error('  running-pace 10min/mi')
  console.error()
  process.exit(1)
}

parse(process.argv.slice(2).join(' '))

function parse (fmt) {
  var parts = fmt.split('/').map(function (s) {
    return s.trim()
  })

  var s = parseTime(parts[0])
  var d = parseDistance(parts[1])

  console.log('km pace:     ', formatTime(s / d * 1000))
  console.log('mi pace:     ', formatTime(s / d * 1609.34))
  console.log('5 km:        ', formatTime(s / d * 5000))
  console.log('10 km:       ', formatTime(s / d * 10000))
  console.log('1/2 marathon:', formatTime(s / d * 21100))
  console.log('marathon:    ', formatTime(s / d * 42200))
}

function formatTime (s) {
  s = Math.floor(s)
  var mins = Math.floor(s / 60)
  if (mins >= 60) {
    var h = Math.floor(mins / 60)
    return pad(h) + ':' + formatTime(s - h * 3600)
  }
  return pad(mins) + ':' + pad(s - mins * 60)
}

function pad (n) {
  if (n < 10) return '0' + n
  return n
}

function guess (s) {
  return ['s', 'm', 'h'][s.split(':').length - 1] || 'h'
}

function parseTime (s) {
  var unit = (s.match(/[a-zA-Z]+/) || guess(s))[0]
  if (unit === 'min') unit = 'm'
  if (unit === 'hour') unit = 'h'
  if (unit === 't') unit = 'h'
  if (unit === 'sec') unit = 's'

  var parts = s.split(/:/).map(function (s) {
    return Number(s.match(/\d+/)[0])
  })

  var i = ['h', 'm', 's'].indexOf(unit.toLowerCase())

  if (i === 1) parts.unshift(0)
  if (i === 2) parts.unshift(0, 0)

  while (parts.length < 3) parts.push(0)

  return parts[0] * 3600 + parts[1] * 60 + parts[2]
}

function parseDistance (s) {
  var unit = (s.match(/[a-zA-Z]+/) || ['km'])[0]
  var n = parseFloat(s.replace(',', '.'))
  if (isNaN(n)) n = 1

  if (unit === 'm') {
    return n
  }

  if (unit === 'miles' || unit === 'mi') {
    return n * 1609.34
  }

  return n * 1000
}
