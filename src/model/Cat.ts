export class Cat {
    public uid: string;
    public name: string;
    public gender: string;
    public breed: string;
    public routine: string;
    public behavior: string;
    public urlPhoto: string | undefined;
    constructor(
      uid: string,
      name: string,
      gender: string,
      breed: string,
      routine: string,
      behavior: string,
      urlPhoto: string,
    ) {
      this.uid = uid;
      this.name = name;
      this.gender = gender;
      this.breed = breed;
      this.routine = routine;
      this.behavior = behavior;
      this.urlPhoto = urlPhoto;
    }
  }