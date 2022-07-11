import type { NextPage } from "next";
import {
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore";

import {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
} from "react";
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
};

export type LiProps = {
  user: User;
  users: User[];
  index: number;
  changedName: string;
  setChangedName: Dispatch<SetStateAction<string>>;
  setUsers: Dispatch<SetStateAction<User[]>>;
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

    //얘가 read다
    useEffect(() => {
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
      getUsers();
    }, []);
    return (
      <div className="App bigcase">
        <div className="formcase">
          <input
            className="button"
            placeholder="Name..."
            onChange={(e) => {
              setNewName(e.target.value);
            }}
          />
          <input
            className="button"
            type="number"
            placeholder="Age..."
            onChange={(e) => {
              setNewAge(parseInt(e.target.value));
            }}
          />
          <button className="button" onClick={createUser}>
            Create User
          </button>
          {users ? <Ul users={users} setUsers={setUsers} /> : null}
        </div>
      </div>
    );
  }

  return <Todo />;
};

export default Todo;
