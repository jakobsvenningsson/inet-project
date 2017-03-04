export class User{
  name:string;
  id:number;
  email:string;

  constructor(email:string, name:string, id:number){
    this.email = email;
    this.name = name;
    this.id = id;
  }

}
