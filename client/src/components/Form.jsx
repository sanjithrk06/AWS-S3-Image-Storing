import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Form = () => {
  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    img: null,
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleFileChange = (e) => {
    console.log(e.target.files[0]);

    setFormData({
      ...formData,
      img: e.target.files[0],
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("desc", formData.desc);
    formDataToSend.append("img", formData.img); 

    try {
      const response = await axios.post("http://localhost:4001/feed", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Server Response:", response.data);
      navigate('/');
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  };

  return (
    <div className="py-5">
      <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
        <h1 className="pb-6 text-3xl text-center font-bold text-slate-800">Add Feed</h1>

        <div className="mb-5">
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}  // Bind to state
            onChange={handleInputChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-700 focus:ring-1 outline-none block w-full p-2.5"
            placeholder="Image Name"
            required
          />
        </div>

        <div className="mb-5">
          <label htmlFor="desc" className="block mb-2 text-sm font-medium text-gray-900">
            Description
          </label>
          <textarea
            id="desc"
            value={formData.desc}  // Bind to state
            onChange={handleInputChange}
            className="resize-none shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-700 focus:ring-1 outline-none block w-full p-2.5"
            placeholder="Image Description"
            required
          />
        </div>

        <div className="mb-5">
          <label htmlFor="img" className="block mb-2 text-sm font-medium text-gray-900">
            Upload file
          </label>
          <input
            type="file"
            id="img"
            onChange={handleFileChange}  // Handle file upload
            className="block w-full border border-gray-300 bg-slate-400 text-slate-100 shadow-sm rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none file:bg-gray-50 file:border-0 file:me-4 file:py-3 file:px-4"
            required
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="text-white bg-slate-950 hover:bg-slate-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
