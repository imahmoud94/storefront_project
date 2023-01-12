import e, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../lib/config';

const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
      if (authorizationHeader.split(' ')[0] == 'Bearer') {
        const token = authorizationHeader.split(' ')[1];
        const decoded = jwt.verify(token, config.tokenSecret as unknown as string);
        if (decoded) {
          next();
        } else {
          res.status(401).send('Unauthorized user');
        }
      } else {
        res.status(401).send('No bearer token');
      }
    } else {
      res.status(401).send('No authorization header');
    }
  } catch (error) {
    res.status(401);
    res.json(error);
  }
};

export default verifyAuthToken;
