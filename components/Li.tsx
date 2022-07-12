import { useState } from "react";
import { LiProps } from "./Todo";

function Li({
  user,
  index,
  updateName,
  deleteUser,
  increaseAge,
  decreaseAge,
}: LiProps) {
  let [form, setForm] = useState<boolean>(false);
  let [changedName, setChangedName] = useState<string>("");
  //**********************UPDATE sector********************************
  return (
    <li className="li" key={user.id}>
      {" "}
      <div>
        <span style={{ marginRight: "10px" }}>Name: {user.name}</span>
        <span>Age: {user.age}</span>
      </div>
      <button
        className="button"
        onClick={() => {
          increaseAge(user.id, user.age, index);
        }}
      >
        Increase Age
      </button>
      <button
        className="button"
        onClick={() => {
          decreaseAge(user.id, user.age, index);
        }}
      >
        Decrease Age
      </button>
      <button
        className="button"
        onClick={() => {
          deleteUser(user.id);
        }}
      >
        Delete User
      </button>
      <div>
        <button
          className="button"
          onClick={() => {
            setForm(form ? false : true);
          }}
        >{`Edit Name`}</button>

        {form ? (
          <form>
            <input
              type="text"
              onChange={(e) => {
                setChangedName(e.target.value);
              }}
              placeholder={user.name}
            />
            <input
              onClick={() => {
                updateName(user.id, changedName, user.age, index);
              }}
              className="inputtext"
              style={{ display: "hidden" }}
              type="submit"
              value="이름변경"
            />
          </form>
        ) : null}
      </div>
    </li>
  );
}

export default Li;
