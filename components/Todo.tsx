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

import {
  Dispatch,
  SetStateAction,
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

// const initialState = {
//   inputs: {
//     name: "",
//     age: 0,
//   },
// };

// function reducer(state: any, action: any) {
//   switch (action.type) {
//     case "CHANGE_INPUT":
//       return {
//         ...state,
//         inputs: {
//           ...state.inputs,
//           [action.name]: action.value,
//         },
//       };
//   }
//}

const Todo: NextPage = () => {
  function Todo() {
    //const [initialState, dispatch] = useReducer(reducer, 0);
    const [users, setUsers] = useState<User[]>([]); //users는 [{id:"",name:"",age:},{},...] 형태의 자료형.
    const [inputs, setInputs] = useState<{ name: string; age: number }>({
      name: "",
      age: 0,
    });

    const { name, age } = inputs;

    const onChange: any = useCallback(
      (e: any) => {
        const { name, value } = e.target;
        setInputs({
          ...inputs,
          [name]: value,
        });
      },
      [inputs]
    );

    // const { name, age } = initialState.inputs;

    // const onChange: any = useCallback((e: any) => {
    //   const { name, value } = e.target;
    //   dispatch({
    //     type: "CHANGE_INPUT",
    //     name,
    //     value,
    //   });
    // }, []);

    const usersCollectionRef = collection(db, "users"); //users이름의 콜렉션(자료들을 모아놓은 자료구조)

    const countActiveUsers = (users: User[]) => {
      return users.length;
    };

    //const count = countActiveUsers(users);
    const count = useMemo(() => countActiveUsers(users), [users]);

    const createUser = useCallback(async () => {
      const result = await addDoc(usersCollectionRef, {
        name: name,
        age: age,
      }); //addDoc(저장할 콜렉션, 들어갈 자료형 기입)
      //result==={converter:null, _key:,firestore:,id,...}등으로 이뤄진 객체
      const newUser = {
        id: result.id,
        name: name,
        age: age,
      };
      //await setUsers((users) => [...users, newUser]); //비동기 함수를 사용하는 이유?

      setInputs({
        name: "",
        age: 0,
      });
      await setUsers(users.concat(newUser));
    }, [name, age, users, usersCollectionRef]);

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
      async (id: string, age: number, index: number) => {
        const userDoc = doc(db, "users", id);
        const newFields = { age: age + 1 };
        await updateDoc(userDoc, newFields); //doc 수정시 updateDoc(기존doc, 수정사항 적힌 객체 자료형)

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
      },
      [users]
    );

    //(선 서버 데이터 수정, 후 앱 존재 데이터에 수정)
    const decreaseAge = useCallback(
      async (id: string, age: number, index: number) => {
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
      async (id: string, changedName: string, age: number, index: number) => {
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

    return (
      <div className="App bigcase">
        <div className="formcase">
          <div>
            <h4>총원 : {count}</h4>
          </div>
          <CreateUser
            newName={name}
            newAge={age}
            onChange={onChange}
            createUser={createUser}
          ></CreateUser>
          {/* UL */}
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
