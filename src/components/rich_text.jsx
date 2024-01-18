//"use client"

import { useRef, useEffect } from "react";
import dynamic from 'next/dynamic';

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const EditText = ({ value = '', setValue }) => {
  const editor = useRef(null);

  useEffect(() => {
    if (editor.current) {
      // Acciones adicionales después de que el editor se ha cargado
    }
  }, [editor]);

  return (
    <>
      {typeof window !== 'undefined' && (
        <JoditEditor
          ref={editor}
          value={value}
          onBlur={(newContent) => setValue(newContent)}
          onChange={(newContent) => {}}
        />
      )}
    </>
  );
};

export default EditText;
