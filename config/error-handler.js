const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error
  }

  switch (error.code) {
    case 'EACCES':
      console.error(' requires elevated privileges.')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(' is already in use.')
      process.exit(1)
      break
    default:
      throw error
  }
}

module.exports = errorHandler
