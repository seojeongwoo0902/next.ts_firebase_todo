import React from "react";
import Li from "./Li";
import { User } from "./Todo";

type UlProps = {
  users: User[];
  deleteUser: (id: string) => void;
  updateName: (
    id: string,
    changedName: string,
    age: number,
    index: number
  ) => void;
  increaseAge: (id: string, age: number, index: number) => void;
  decreaseAge: (id: string, age: number, index: number) => void;
};

const Ul = ({
  users,
  deleteUser,
  updateName,
  increaseAge,
  decreaseAge,
}: UlProps) => {
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
};

export default React.memo(Ul);
