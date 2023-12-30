import { useState } from "react";
import InputLabel from "./InputLabel";
import debounce from "lodash.debounce";
import { router, Link } from "@inertiajs/react";

const InputModal = ({ id }) => {
    const [data, setData] = useState({});
    const [loading, setIsLoading] = useState(false);

    const debouncedHandleChange = debounce((event) => {
        if (event.target.type === "file") {
            const filename = event.target.files[0];
            setData({
                ...data,
                image: filename,
            });
        } else {
            setData({
                ...data,
                [event.target.name]: event.target.value,
            });
        }
    }, 500);
    const handleChange = (event) => {
        debouncedHandleChange(event);
    };

    const handleSubmit = () => {
        try {
            setIsLoading(true);
            router.post("/", data);
        } catch (error) {
            console.log(
                "🚀 ~ file: InputModal.jsx:32 ~ handleSubmit ~ error:",
                error
            );
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <dialog id={id} className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Insert Product!</h3>
                <p className="py-4 px-4 space-y-10">
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        className="m-2 p-2 input input-bordered input-info w-full max-w-x"
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="price"
                        placeholder="price"
                        className="m-2 p-2 input input-bordered input-info w-full max-w-x"
                        onChange={handleChange}
                    />
                    <div className="space-y-2">
                        <InputLabel value="upload an image" />
                        <input
                            type="file"
                            name="image"
                            className="file-input w-full max-w-x"
                            onChange={handleChange}
                        />
                    </div>
                </p>
                <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                            ✕
                        </button>
                        <div className="space-x-2">
                            <button className="btn">Close</button>
                            <button
                                className="btn btn-primary"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </dialog>
    );
};
export default InputModal;
