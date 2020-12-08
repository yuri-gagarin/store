import chaiHTTP from "chai-http";
import { IAdministrator } from "../../../models/Administrator";

export const loginAdmins = async (chai: Chai.ChaiStatic, server: Express.Application, admins: IAdministrator[]): Promise<string[]> => {
  const tokensArr: string[] = [];
  chai.use(chaiHTTP)
  for (let i = 0; i < admins.length; i++) {
    await new Promise<boolean>((resolve, reject) => {
      chai.request(server)
        .post("/api/admins/login")
        .send({
          email: admins[i].email,
          password: "password"
        })
        .then((res) => {
          const token = res.body.jwtToken.token as string;
          tokensArr.push(token);
          resolve(true);
        })
        .catch((err) =>{
          reject(err);
        });
    });
    
  };
  return Promise.resolve(tokensArr);
};