import React from "react";

type Props = {
  newName: string;
  newAge: number;
  onChange: any; //ChangeEventHandler<HTMLInputElement>;
  createUser(): Promise<void>;
};

const CreateUser = ({ newName, newAge, createUser, onChange }: Props) => {
  return (
    <>
      <input
        name="name"
        className="button"
        placeholder="Name..."
        onChange={onChange}
        value={newName}
      />
      <input
        name="age"
        className="button"
        type="number"
        placeholder={"Age..."}
        onChange={onChange}
        value={newAge === 0 ? "Age..." : newAge}
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
