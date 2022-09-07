import * as net from 'net';
import * as EventEmitter from 'events';
import TransRequest from "./TransRequest";
import HandleResponse from "./HandleResponse";

type Handler = (request: TransRequest, response: HandleResponse) => void;
//MyHttp类是服务端的核心，用于自定义实现http协议
class MyHttp extends EventEmitter{
  handler: Handler; //自定义类型，包括request和response两个属性
  request: TransRequest; //请求报文传输的包装类
  response: HandleResponse; //负责处理服务器发出的响应
  server: net.Server; //net.Server用于创建基于socket传输的服务
  socket: net.Socket; //net.Socket类是TCP套接字的抽象，同时也是一个EventEmitter

  constructor(handler: Handler) {
    super();
    this.handler = handler;
    this.createServer();
  }
  //这个函数用于创建一个TCP服务器实例
  private createServer(): void {
    this.server = net.createServer((socket) => {
      socket.on('data', (data: Buffer) => {
        //data为序列化后的请求报文
        const message = data.toString('utf-8');
        console.log("-------------客户端发送的请求报文为-------------")
        console.log(message)
        console.log("---------------------------------------------")
        //将字符串格式的请求报文传入TransRequest类的构造函数中
        //返回的是包含httpMessage属性的对象
        this.request = new TransRequest(message);
        this.response = new HandleResponse(socket)
        this.handler(this.request, this.response);
      });
      socket.on('error', error => {
        //按照注册的顺序同步调用为eventname注册的每个监听器
        this.emit('error', error)
      });
    });
  }
  //listen函数用于启动服务器，开始监听端口
  public listen(port: number, cb: any = () => { }): void {
    //这个函数是异步的，当服务器开始监听时，将发出“监听”事件。最后一个参数callback将添加为“监听”事件的监听器。
    this.server.listen(port, cb);
    this.server.on('error', error => this.emit('error', error));
  }
}
//创建服务器实例，其中传入handle为TransRequest类型的请求,和HandleResponse类型的响应
const createServer = (handler: Handler) => {
  return new MyHttp(handler)
}

export default {
  createServer
}