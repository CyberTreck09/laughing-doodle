import User from '../models/user.model';
import { Request, RequestHandler, Response } from 'express';
import  {generateToken}  from '../utils/generateToken';

export const register: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  const user = await User.create({ name, email, password });
  res.status(201).json({ token: generateToken(user._id as string), user });
};

export const login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const user: any = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    res.status(401).json({ message: 'Invalid credentials' });
  }
  res.json({ token: generateToken(user._id), user });
};

export const getMe: RequestHandler = async (req: any, res: Response): Promise<void> => {
  res.json(req.user);
};
