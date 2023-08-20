/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import socketio from "socket.io-client";
import { LocalStorage } from "../utils";

const getSocket = () => {
  const token = LocalStorage.get("token"); // get jwt token from local storage or cookie

  return socketio(import.meta.env.VITE_SOCKET_URI, {
    withCredentials: true,
    auth: { token },
  });
};

const SocketContext = createContext<{
  socket: ReturnType<typeof socketio> | null;
}>({
  socket: null,
});

const useSocket = () => useContext(SocketContext);

const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<ReturnType<typeof socketio> | null>(
    null
  );

  useEffect(() => {
    setSocket(getSocket());
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, useSocket };
