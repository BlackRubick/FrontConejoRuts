export type User = {
    email: string;
    name: string;
}



export type ChatScreenRouteProp = {
    params: {
      user: User;
      chatId: string;   
      userEmail: string;
    };
};
