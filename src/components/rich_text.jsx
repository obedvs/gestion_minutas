import { useRef } from "react";
import JoditEditor from "jodit-react";

/**
 * @param {object} props - Props of the component
 * @param {string} props.value - Text to be show in the editor
 * @param {function} props.setValue - Function to set the value of the editor
 * @param {string} props.propName - Name of the property to be set in the object
 * @returns {JSX.Element}
 */
const EditText = ({ value = '', setValue }) => {

	const editor = useRef(null);

	return (
		<>
			<JoditEditor
				ref={editor}
				value={value}
				onBlur={(newContent) => setValue(newContent)}
				onChange={(newContent) => {}}
			/>
		</>
	);
};

export default EditText;
