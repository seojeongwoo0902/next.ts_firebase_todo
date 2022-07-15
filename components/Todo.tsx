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

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useReducer,
} from "react";
import { db } from "../firebase-config";
import Ul from "./Ul";

import CreateUser from "./CreateUser";

//앱존재 데이터(useState) 기반으로 서버 데이터에 반영후, 가져올땐

export type User = {
  id: string;
  name: string;
  age: number;
};

const initialState = {
  inputs: {
    name: "",
    age: 0,
  },
};
function init(initialState: any) {
  return { inputs: initialState };
}

const usersCollectionRef = collection(db, "users");
function reducer(state: any, action: any) {
  switch (action.type) {
    case "CHANGE_INPUT":
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.name]: action.value,
        },
      };
    case "CREATE_USER":
      return {};
    case "reset":
      return init(action.payload);

    default:
      throw new Error("Not a type");
  }
}

type nameAndAge = {
  name: string;
  age: number;
};

type IncreaseDecreaseAge = {
  id: string;
  age: number;
  index: number;
};

type UpdatePropsType = {
  id: string;
  changedName: string;
  index: number;
  age: number;
};

export const UserDispatch = React.createContext<any | null>(null);

const Todo: NextPage = () => {
  function Todo() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [users, setUsers] = useState<User[]>([]); //users는 [{id:"",name:"",age:},{},...] 형태의 자료형.
    const { name, age }: nameAndAge = state.inputs;

    const countActiveUsers = (users: User[]) => {
      return users.length;
    };

    const onChange: any = useCallback((e: any) => {
      const { name, value } = e.target;
      //디스패치에 객체로 type, name, value를 보내준다
      dispatch({
        type: "CHANGE_INPUT",
        name,
        value,
      });
    }, []);

    const createUser = useCallback(async () => {
      const result = await addDoc(usersCollectionRef, {
        name: name,
        age: age,
      });
      //result==={converter:null, _key:,firestore:,id,...}등으로 이뤄진 객체
      const newUser = {
        id: result.id,
        name: name,
        age: Number(age),
      };

      await setUsers(users.concat(newUser));
    }, [name, age, users]);

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

    //update-increaseAge(선 서버 데이터 수정, 후 앱 존재 데이터에 수정)
    const increaseAge = useCallback(
      async ({ id, age, index }: IncreaseDecreaseAge) => {
        const userDoc = doc(db, "users", id);

        const newFields = { age: Number(age) + 1 };
        await updateDoc(userDoc, newFields); //doc 수정시 updateDoc(기존doc, 수정사항 적힌 객체 자료형)

        await onSnapshot(doc(db, "users", id), (doc) => {
          let getName = doc.data()?.name;
          const newUser = {
            id,
            name: getName,
            age: Number(age) + 1,
          };
          setUsers([
            ...users.slice(0, index),
            newUser,
            ...users.slice(index + 1, users.length),
          ]);
        });
      },
      [users]
    );

    //(선 서버 데이터 수정, 후 앱 존재 데이터에 수정)
    const decreaseAge = useCallback(
      async ({ id, age, index }: IncreaseDecreaseAge) => {
        const userDoc = doc(db, "users", id);
        let num = age > 0 ? age - 1 : 0;
        const newFields = { age: num };

        await updateDoc(userDoc, newFields); //doc 수정시 updateDoc(기존doc, 수정사항 적힌 객체 자료형)

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
      },
      [users]
    );

    //(선 서버 데이터 수정, 후 앱 존재 데이터에 수정)
    const updateName = useCallback(
      async ({ id, changedName, age, index }: UpdatePropsType) => {
        //changedName

        const userDoc = doc(db, "users", id);
        const newFields = { name: changedName };
        await updateDoc(userDoc, newFields);

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
      },
      [users]
    );

    //변수 = useMemo(()=>함수명(인자),[변하는 인자]) 이때 함수는 반환값이 무조건있어야한다.

    const filtering = useCallback((users: User[], id: string): User[] => {
      let result: any = [];
      users.map((user: User) => {
        if (user.id === id) {
          result = users.filter((e: User) => e !== user);
        }
      });
      return result;
    }, []);

    //(선 서버 데이터 수정, 후 앱 존재 데이터에 수정)
    const deleteUser = useCallback(
      async (id: string) => {
        const userDoc = doc(db, "users", id);

        await deleteDoc(userDoc);
        //const final = useMemo(()=>{filtering(users, id)},[users,id])

        const result = filtering(users, id);
        setUsers(() => result);
      },
      [users, filtering]
    );

    useEffect(() => {
      getUsers();
    }, []);
    const count = useMemo(() => countActiveUsers(users), [users]);
    return (
      <UserDispatch.Provider value={dispatch}>
        <div className="App bigcase">
          <div className="formcase">
            <div>
              <h4>총원 : {count}</h4>
            </div>
            <CreateUser
              name={name}
              age={age}
              onChange={onChange}
              createUser={createUser}
            ></CreateUser>
            {/* UL */}
            {users ? (
              <Ul
                users={users}
                deleteUser={(id) => deleteUser(id)}
                updateName={(id, changedName, age, index) =>
                  updateName({ id, changedName, age, index })
                }
                increaseAge={(id, age, index) =>
                  increaseAge({ id, age, index })
                }
                decreaseAge={(id, age, index) =>
                  decreaseAge({ id, age, index })
                }
              />
            ) : null}
          </div>
        </div>
      </UserDispatch.Provider>
    );
  }

  return <Todo />;
};

export default Todo;
