const { createLogger, format, transports } = require('winston');
const { GraylogTransport } = require('winston-graylog');

// สร้าง logger
const logger = createLogger({
  level: 'info', // ระดับของ log (info, error, warn, debug)
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    // ส่ง log ไปยัง Graylog
    new GraylogTransport({
      graylog: {
        servers: [{ host: 'graylog.example.com', port: 12201 }], // เปลี่ยนเป็นที่อยู่ของ Graylog server ของคุณ
        facility: 'Node.js App', // ชื่อแอปพลิเคชัน
      },
    }),
    // บันทึก log ลงไฟล์ (optional)
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

// ถ้าไม่ใช่ production ให้แสดง log ใน console ด้วย
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.simple(),
  }));
}

module.exports = logger;