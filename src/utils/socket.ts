import { Socket, io } from 'socket.io-client'
import { API_URL } from './data'
import { ServerToClientEvents } from '../types'

export const socket: Socket<ServerToClientEvents> = io(API_URL)