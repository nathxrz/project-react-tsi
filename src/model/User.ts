export class User {
  public uid: string;
  public name: string;
  public phone: string;
  public email: string;
  //   public urlFoto: string;
  public password: string;
  constructor(
    uid: string,
    name: string,
    phone: string,
    email: string,
    // urlFoto: string,
    password: string,
  ) {
    this.uid = uid;
    this.name = name;
    this.phone = phone;
    this.email = email;
    // this.urlFoto = urlFoto;
    this.password = password;
  }
}
