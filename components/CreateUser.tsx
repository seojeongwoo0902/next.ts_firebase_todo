import React, { useContext } from "react";
import { UserDispatch } from "./Todo";

type Props = {
  name: string;
  age: number;
  onChange: any; //ChangeEventHandler<HTMLInputElement>;
  createUser(): Promise<void>;
};

const CreateUser = ({ name, age, createUser }: Props) => {
  const dispatch = useContext(UserDispatch);
  return (
    <>
      <input
        name="name"
        className="button"
        placeholder="Name..."
        onChange={(e: any) => {
          const { name, value } = e.target;
          dispatch({ type: "CHANGE_INPUT", name, value });
        }}
        value={name}
      />
      <input
        name="age"
        className="button"
        type="number"
        placeholder="Age..."
        onChange={(e: any) => {
          const { name, value } = e.target;
          dispatch({ type: "CHANGE_INPUT", name, value });
        }}
        value={age === 0 ? "Age..." : age}
      />
      <button
        className="button"
        onClick={() => {
          createUser();
        }}
      >
        Create User
      </button>
    </>
  );
};

export default React.memo(CreateUser);
