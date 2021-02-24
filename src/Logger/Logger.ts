import * as winston from 'winston';

export const Logger = winston.createLogger({
  level: 'silly',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.printf((info) => {
      // @ts-ignore
      const splat = info[Object.getOwnPropertySymbols(info)[1]];
      const {timestamp, level, message} = info;
      return `[${timestamp}] ${level}: ${message}${splat ? ` ${JSON.stringify(splat)}` : ''}`;
    }),
  ),
  transports: [
    new winston.transports.Console(),
  ],
});