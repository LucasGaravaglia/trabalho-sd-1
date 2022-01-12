import { Socket } from "socket.io";

export interface User {
  name: string;
  socket: Socket;
}

interface OnlineUsers {
  name: string;
  socketId: string;
}

/**
 * Gerencia as conexões de socket io do chat.
 * @returns Objeto que gerencia o chat.
 */
export interface Chat {
  /**
   * Insere um novo usuário no chat, caso já não esteja conectado e seja um usuário válido.
   * @param name Nome do usuário.
   * @param socket Socket do usuário.
   */
  insert: (name: string, socket: Socket) => void;
  /**
   * Remove um usuário caso esteja registrado e seja válido.
   * @param socket Socket do usuário.
   */
  remove: (socket: Socket) => void;
  /**
   * Retorna uma lista de usuários registrados menos o usuário que solicitou a lista, caso exista.
   * @param socket Socket do usuário que emitiu o pedido da lista.
   * @returns Lista com todos os usuários conectados menos o emissor do pedido da lista, caso exista.
   */
  getUser: (socket: Socket) => User;
  /**
   * Retorna uma lista de usuários registrados menos o usuário que solicitou a lista, caso exista.
   * @param socket Socket do usuário que emitiu o pedido da lista.
   * @returns Lista com todos os usuários conectados menos o emissor do pedido da lista, caso exista.
   */
  getOnlineUsers: (socket?: Socket) => Array<OnlineUsers>;
  /**
   * Retorna um socket dado o seu id.
   * @param socketId Id do socket para procurar.
   * @returns Socket caso encontrado.
   */
  getSocket: (socketId: string) => Socket;

  /**
   * Verifica se um usuário é um usuário válido.
   * @param socket Socket do usuário.
   * @returns true caso seja um usuário válido ou false caso contrário.
   */
  verifyUser: (socket: Socket) => boolean;

  /**
   * Retorna o nome do usuário a partir do id
   * @param socketId Identificador do socket.
   * @returns Nome do usuário.
   */
  getUserName: (socketId: string) => User;
}

/**
 * Cria um novo usuário.
 * @param name Nome do usuário.
 * @param socket Socket do usuário.
 * @returns Novo usuário criado.
 */
export const User = (name: string, socket: Socket) => {
  return { name, socket };
};

/**
 * Gerencia as conexões de socket io do chat.
 * @returns Objeto que gerencia o chat.
 */
export const Chat = (): Chat => {
  let users: Array<User> = [];

  /**
   * Verifica se um usuário está conectado ao chat.
   * @param socket Socket do usuário para ser verificado.
   * @returns true caso esteja conectado ou false caso contrário.
   */
  const isConnected = (socket: Socket): boolean => {
    if (socket === null) return false;
    for (let i = 0; i < users.length; i++)
      if (users[i].socket.id == socket.id) return true;
    return false;
  };

  /**
   * Verifica se um usuário é um usuário válido.
   * @param socket Socket do usuário.
   * @returns true caso seja um usuário válido ou false caso contrário.
   */
  const verifyUser = (socket: Socket): boolean => {
    if (typeof socket === "undefined" || socket === null) {
      console.log("invalid socket");
      return false;
    }
    if (typeof socket.id === "undefined" || socket === null) {
      console.log("invalid socket, socket id is null");
      return false;
    }
    return true;
  };

  /**
   * Insere um novo usuário no chat, caso já não esteja conectado e seja um usuário válido.
   * @param name Nome do usuário.
   * @param socket Socket do usuário.
   */
  const insert = (name: string, socket: Socket): void => {
    if (isConnected(socket)) {
      console.log("user already registered");
    } else if (verifyUser(socket)) {
      users.push(User(name, socket));
      console.log("New user registered: " + name + ", socket: " + socket.id);
    }
  };

  /**
   * Retorna um usuário registrado.
   * @param socket Socket do usuário.
   * @returns Usuário caso seja encontrado ou exceção.
   */
  const getUser = (socket: Socket): User => {
    if (verifyUser(socket)) {
      for (let i = 0; i < users.length; i++)
        if (users[i].socket.id == socket.id) return users[i];
    }
    throw new Error("user not found");
  };

  /**
   * Remove um usuário caso esteja registrado e seja válido.
   * @param socket Socket do usuário.
   */
  const remove = (socket: Socket): void => {
    if (verifyUser(socket)) {
      try {
        for (let i = 0; i < users.length; i++) {
          if (users[i].socket.id === socket.id) {
            users.splice(i, 1);
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  /**
   * Retorna uma lista de usuários registrados menos o usuário que solicitou a lista, caso exista.
   * @param socket Socket do usuário que emitiu o pedido da lista.
   * @returns Lista com todos os usuários conectados menos o emissor do pedido da lista, caso exista.
   */
  const getOnlineUsers = (socket: Socket = null): Array<OnlineUsers> => {
    let connectedUsers: Array<OnlineUsers> = [];
    if (socket == null) {
      for (let i = 0; i < users.length; i++) {
        connectedUsers.push({
          name: users[i].name,
          socketId: users[i].socket.id,
        });
      }
    } else {
      for (let i = 0; i < users.length; i++) {
        if (users[i].socket.id != socket.id)
          connectedUsers.push({
            name: users[i].name,
            socketId: users[i].socket.id,
          });
      }
    }
    return connectedUsers;
  };

  /**
   * Retorna um socket dado o seu id.
   * @param socketId Id do socket para procurar.
   * @returns Socket caso encontrado.
   */
  const getSocket = (socketId: string): Socket => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].socket.id == socketId) return users[i].socket;
    }
    throw new Error("socket not found");
  };

  /**
   * Retorna o nome do usuário a partir do id
   * @param socketId Identificador do socket.
   * @returns Nome do usuário.
   */
  const getUserName = (socketId: string): User => {
    return users.find((c) => {
      c.socket.id == socketId;
    });
  };

  return {
    insert,
    remove,
    getUser,
    getOnlineUsers,
    getSocket,
    verifyUser,
    getUserName,
  };
};
