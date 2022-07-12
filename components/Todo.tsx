import type { NextPage } from "next";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

import { Dispatch, SetStateAction, useState, useEffect, useMemo } from "react";
import { db } from "../firebase-config";
import Ul from "./Ul";

export type User = {
  id: string;
  name: string;
  age: number;
};

export type UlProps = {
  users: User[];
  setUsers: Dispatch<SetStateAction<User[]>>;
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

export type LiProps = {
  user: User;
  index: number;
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

const Todo: NextPage = () => {
  function Todo() {
    const [newName, setNewName] = useState<string>("");
    const [newAge, setNewAge] = useState<number>(0);
    const [users, setUsers] = useState<User[]>([]); //users는 [{id:"",name:"",age:},{},...] 형태의 자료형.

    const usersCollectionRef = collection(db, "users"); //users이름의 콜렉션(자료들을 모아놓은 자료구조)

    //create
    const createUser = async () => {
      const result = await addDoc(usersCollectionRef, {
        name: newName,
        age: newAge,
      }); //addDoc(저장할 콜렉션, 들어갈 자료형 기입)
      //result==={converter:null, _key:,firestore:,id,...}등으로 이뤄진 객체
      const newUser = {
        id: result.id,
        name: newName,
        age: newAge,
      };
      await setUsers((users) => [...users, newUser]); //비동기 함수를 사용하는 이유?
    };
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      //data.docs에는 doc들이 들어있다.
      data.docs.map((doc) => {
        let result = {
          id: doc.id,
          name: doc.data().name,
          age: doc.data().age,
        };
        setUsers((users) => [...users, result]);
      });
    };

    //**********************UPDATE sector********************************

    //유즈메모 써보자
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
      // setUsers([]);
      // await getUsers();
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
      // setUsers([]);
      // await getUsers();
    };

    const updateName = async (
      id: string,
      changedName: string,
      age: number,
      index: number
    ) => {
      //changedName
      // console.log(id);
      // console.log(changedName);
      // alert(`변경된 이름: ${changedName}`);
      const userDoc = doc(db, "users", id);

      const newFields = { name: changedName };

      // await onSnapshot(doc(db, "users", id), (doc) => {
      //   const newUser = {
      //     id,
      //     name: changedName,
      //     age: age,
      //   };

      //   setUsers([
      //     ...users.slice(0, index),
      //     newUser,
      //     ...users.slice(index + 1, users.length),
      //   ]);
      // });

      await updateDoc(userDoc, newFields);
      setUsers([]);
      await getUsers();
    };

    //변수 = useMemo(()=>함수명(인자),[변하는 인자]) 이때 함수는 반환값이 무조건있어야한다.

    const filtering = (users: User[], id: string): User[] => {
      let result: any = [];
      users.map((user: User) => {
        if (user.id === id) {
          result = users.filter((e: User) => e !== user);
        }
      });
      return result;
    };

    const deleteUser = async (id: string) => {
      const userDoc = doc(db, "users", id);

      //const final = useMemo(()=>{filtering(users, id)},[users,id])

      const result = filtering(users, id);
      console.log(result);
      await setUsers(result);

      await deleteDoc(userDoc);
      // setUsers([]);
      // await getUsers();
    };

    useEffect(() => {
      getUsers();
    }, []);

    const onReset = () => {
      setNewName("");
      setNewAge(0);
    };
    return (
      <div className="App bigcase">
        <div className="formcase">
          <input
            className="button"
            placeholder="Name..."
            onChange={(e) => {
              setNewName(e.target.value);
            }}
            value={newName}
          />
          <input
            className="button"
            type="number"
            placeholder={"Age..."}
            onChange={(e) => {
              setNewAge(parseInt(e.target.value));
            }}
            value={newAge === 0 ? "Age..." : newAge}
          />
          <button
            className="button"
            onClick={() => {
              createUser();
              onReset();
            }}
          >
            Create User
          </button>
          {users ? (
            <Ul
              users={users}
              setUsers={setUsers}
              deleteUser={(id) => deleteUser(id)}
              updateName={(id, changedName, age, index) =>
                updateName(id, changedName, age, index)
              }
              increaseAge={(id, age, index) => increaseAge(id, age, index)}
              decreaseAge={(id, age, index) => decreaseAge(id, age, index)}
            />
          ) : null}
        </div>
      </div>
    );
  }

  return <Todo />;
};

export default Todo;
