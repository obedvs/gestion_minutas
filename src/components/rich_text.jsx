//"use client"

// import { useRef, useEffect } from "react";
import dynamic from 'next/dynamic';

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const EditText = ({ value = '', setValue, read }) => {

  const config = 
		{
			readonly: read, // all options from https://xdsoft.net/jodit/docs/,
			activeButtonsInReadOnly: ['about']
		}

  return (
    <>
      {typeof window !== 'undefined' && (
        <JoditEditor
          value={value}
          onBlur={(newContent) => setValue(newContent)}
          onChange={(newContent) => {}}
	        config={config}
        />
      )}
    </>
  );
};

export default EditText;
