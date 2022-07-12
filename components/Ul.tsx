import { useState } from "react";
import Li from "./Li";
import { UlProps, User } from "./Todo";

function Ul({
  users,
  deleteUser,
  updateName,
  increaseAge,
  decreaseAge,
}: UlProps) {
  return (
    <ul>
      {users.map((user: User, index: number) => {
        return (
          <Li
            key={user.id + index}
            user={user}
            index={index}
            deleteUser={deleteUser}
            updateName={updateName}
            increaseAge={increaseAge}
            decreaseAge={decreaseAge}
          ></Li>
        );
      })}
    </ul>
  );
}

export default Ul;
