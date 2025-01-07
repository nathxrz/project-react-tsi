export class User {
  public uid: string;
  public name: string;
  public phone: string;
  public email: string;
    public urlPhoto: string;
  public password: string;
  constructor(
    uid: string,
    name: string,
    phone: string,
    email: string,
    urlPhoto: string,
    password: string,
  ) {
    this.uid = uid;
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.urlPhoto = urlPhoto;
    this.password = password;
  }
}
