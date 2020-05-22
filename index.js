import React, { useEffect, useRef } from "react";
import useScript from "./useScript";

const firebaseui_src = lang =>
  `https://www.gstatic.com/firebasejs/ui/4.1.0/firebase-ui-auth__${lang}.js`;
const FIREBASEUI_CONTAINER_ID = "firebaseui_container";

function FirebaseUIAuth({ auth, config, lang, firebase }) {
  const [loaded, error] = useScript(firebaseui_src(lang));
  const container = useRef();

  useEffect(() => {
    window.firebase = firebase;
  }, []);
  useEffect(() => {
    if (!loaded) return;
    if (error) throw error;
    (async () => {
      const app = window.firebase.apps.find(
        ({ name }) => name.endsWith('-firebaseui-temp')
      );
      if (app) await app.delete();
      if (container.current) container.current.innerHTML = "";
      const firebaseUI = new window.firebaseui.auth.AuthUI(auth);
      firebaseUI.start(`#${FIREBASEUI_CONTAINER_ID}`, config);
    })();
  }, [auth, config, error, loaded]);

  return (
    <>
      <link
        type="text/css"
        rel="stylesheet"
        href="https://www.gstatic.com/firebasejs/ui/4.1.0/firebase-ui-auth.css"
      />
      <div ref={container} id={FIREBASEUI_CONTAINER_ID} />
    </>
  );
}

export default FirebaseUIAuth;
