import {
    FormEvent,
    useState,
  } from "react";
import { LiProps, User } from './Todo'
import { db } from "../firebase-config";
import {
    updateDoc,
    doc,
    deleteDoc,
    onSnapshot,
  } from "firebase/firestore";

  
function Li({  user,
    index,
    changedName,
    setChangedName,
    setUsers,
    users,}: LiProps) {
        let [form, setForm] = useState(false);

        //**********************UPDATE sector********************************
      
        const increaseAge = async (id: string, age: number, index: number) => {
          const userDoc = doc(db, "users", id);
          const newFields = { age: age + 1 };
          await onSnapshot(doc(db, "users", id), (doc) => {
            let getName = doc.data()?.name;
            const newUser = {
              id,
              name: getName,
              age: age + 1,
            };
            setUsers([
              ...users.slice(0, index),
              newUser,
              ...users.slice(index + 1, users.length),
            ]);
          });
      
          await updateDoc(userDoc, newFields); //doc 수정시 updateDoc(기존doc, 수정사항 적힌 객체 자료형)
        };
      
        const decreaseAge = async (id: string, age: number, index: number) => {
          const userDoc = doc(db, "users", id);
          let num = age > 0 ? age - 1 : 0;
          const newFields = { age: num };
      
          await onSnapshot(doc(db, "users", id), (doc) => {
            let getName = doc.data()?.name;
            const newUser = {
              id,
              name: getName,
              age: num,
            };
      
            setUsers([
              ...users.slice(0, index),
              newUser,
              ...users.slice(index + 1, users.length),
            ]);
          });
      
          await updateDoc(userDoc, newFields); //doc 수정시 updateDoc(기존doc, 수정사항 적힌 객체 자료형)
        };
      
        const updateName = async (
          e: FormEvent<HTMLFormElement>,
          id: string,
          age: number,
          index: number
        ) => {
          //changedName
          e.preventDefault();
          alert(`변경된 이름: ${changedName}`);
          const userDoc = doc(db, "users", id);
      
          const newFields = { name: changedName };
      
          await onSnapshot(doc(db, "users", id), (doc) => {
            const newUser = {
              id,
              name: changedName,
              age: age,
            };
      
            setUsers([
              ...users.slice(0, index),
              newUser,
              ...users.slice(index + 1, users.length),
            ]);
          });
      
          await updateDoc(userDoc, newFields);
        };
      
        //**********************UPDATE sector********************************
      
        //delete
        const deleteUser = async (id: string) => {
          const userDoc = doc(db, "users", id);
          users.map((user: User) => {
            if (user.id === id) {
              setUsers(users.filter((e: User) => e !== user));
            }
          });
          await deleteDoc(userDoc);
        };
      
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
              >{`Edit Name & Age`}</button>
      
              {form ? (
                <form onSubmit={(e) => updateName(e, user.id, user.age, index)}>
                  <input
                    type="text"
                    onChange={(e) => {
                      setChangedName(e.target.value);
                    }}
                    placeholder={user.name}
                  />
                  <input
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

export default Li