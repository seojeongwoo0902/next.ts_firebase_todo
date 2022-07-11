import { useState } from "react";
import Li from "./Li";
import { UlProps, User } from "./Todo";



function Ul({users, setUsers}: UlProps) {
const [changedName, setChangedName] = useState<string>("");
  return (
    <ul>
    {users.map((user: User, index: number) => {
      return (
        <Li
          key={user.id + index}
          user={user}
          index={index}
          changedName={changedName}
          setChangedName={setChangedName}
          users={users}
          setUsers={setUsers}
        ></Li>
      );
    })}
  </ul>
  )
}

export default Ul