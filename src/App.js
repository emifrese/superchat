import "./App.css";
import { Fragment, useRef, useState } from "react";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyDZCcr41PQAVmDffzE3Rg1ZO0nIDLfeh94",
  authDomain: "superchat-react-9d3d3.firebaseapp.com",
  projectId: "superchat-react-9d3d3",
  storageBucket: "superchat-react-9d3d3.appspot.com",
  messagingSenderId: "1031147520183",
  appId: "1:1031147520183:web:be35d16ad549a6d0464d32",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  // // trying to make groups
  // const saveUserToFirestore = (user) => {
  //   const userRef = firestore.collection("user");
  //   userRef.doc(user.uid).set({
  //     uid: user.uid,
  //     displayName: user.displayName,
  //     photoURL: user.photoURL,
  //     email: user.email,
  //   });
  // };

  // if (user) {
  //   saveUserToFirestore(user);
  // }
  // //

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    // // Trying to make groups
    // return new Promise((resolve, reject) => {
    //   auth
    //     .signInWithPopup(provider)
    //     .then(function (result) {
    //       resolve(result.user);
    //     })
    //     .catch(function (error) {
    //       reject(error);
    //     });
    // });
    // //
    auth.signInWithPopup(provider);
  };

  return (
    <Fragment>
      <button className="sign-in" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
      <p>
        Do not violate the community guidelines or you will be banned for life!
      </p>
    </Fragment>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        Sign Out
      </button>
    )
  );
}

function ChatRoom() {
  const dummy = useRef();

  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");

    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Fragment>
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

        <div ref={dummy}></div>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />

        <button type="submit" disabled={!formValue}>
          ✈️
        </button>
      </form>
    </Fragment>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <div className={`message ${messageClass}`}>
      <img
        src={
          photoURL || "https://api.adorable.io/avatars/23/abott@adorable.png"
        }
        alt="Profile"
      />
      <p>{text}</p>
    </div>
  );
}

export default App;
