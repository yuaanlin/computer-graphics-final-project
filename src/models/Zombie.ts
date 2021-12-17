import Static3DObject from "./Static3DObject";

class Zombie extends Static3DObject {

  constructor() {
    super("zombie", "zombie");
    this.scale = [.08, .08, .08]
  }

}

export default Zombie;