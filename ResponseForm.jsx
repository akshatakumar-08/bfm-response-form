import { useState } from 'react';
import axios from 'axios';

const ResponseForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    image: null,
    link: '',
    description: '',
    activeMembers: '',
    socials: [],
    category: '',
    news: [],
  });

  const [newSocialLink, setNewSocialLink] = useState('');
  const [newNewsItem, setNewNewsItem] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    console.log(`Handling change for ${name}:`, value); // Debugging statement
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value,
    });
  };

  const handleReset = () => {
    console.log('Resetting form data'); // Debugging statement
    setFormData({
      title: '',
      image: null,
      link: '',
      description: '',
      activeMembers: '',
      socials: [],
      category: '',
      news: [],
    });
    setNewSocialLink('');
    setNewNewsItem('');
    setErrorMessage('');
  };

  const handleAddSocialLink = () => {
    if (newSocialLink.trim() !== '') {
      console.log('Adding social link:', newSocialLink); // Debugging statement
      setFormData((prevState) => ({
        ...prevState,
        socials: [...prevState.socials, newSocialLink],
      }));
      setNewSocialLink('');
    } else {
      console.log('Social link is empty, not adding'); // Debugging statement
    }
  };

  const handleRemoveSocialLink = (index) => {
    console.log(`Removing social link at index ${index}`); // Debugging statement
    setFormData((prevState) => ({
      ...prevState,
      socials: prevState.socials.filter((_, i) => i !== index),
    }));
  };

  const handleAddNewsItem = () => {
    if (newNewsItem.trim() !== '') {
      console.log('Adding news item:', newNewsItem); // Debugging statement
      setFormData((prevState) => ({
        ...prevState,
        news: [...prevState.news, newNewsItem],
      }));
      setNewNewsItem('');
    } else {
      console.log('News item is empty, not adding'); // Debugging statement
    }
  };

  const handleRemoveNewsItem = (index) => {
    console.log(`Removing news item at index ${index}`); // Debugging statement
    setFormData((prevState) => ({
      ...prevState,
      news: prevState.news.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    console.log('Form data before submission:', formData); // Debugging statement

    const dataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'socials' || key === 'news') {
        console.log(`Appending ${key} as JSON string`); // Debugging statement
        dataToSend.append(key, JSON.stringify(formData[key]));
      } else if (key === 'image' && formData[key]) {
        console.log('Appending image file'); // Debugging statement
        dataToSend.append(key, formData[key]);
      } else {
        console.log(`Appending ${key}:`, formData[key]); // Debugging statement
        dataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post('https://bfm-backend.vercel.app/api/metaverses', dataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response from server:', response.data); // Debugging statement
      alert('Form submitted successfully!');
      handleReset();
    } catch (error) {
      console.error('Error occurred while submitting form:', error); // Debugging statement
      if (error.response) {
        console.error('Response data:', error.response.data); // Debugging statement
        console.error('Response status:', error.response.status); // Debugging statement
        console.error('Response headers:', error.response.headers); // Debugging statement
        setErrorMessage(`Error ${error.response.status}: ${error.response.data.message || 'Unknown error occurred'}`);
      } else if (error.request) {
        console.error('No response received:', error.request); // Debugging statement
        setErrorMessage('Error: No response received from the server. Please check your internet connection.');
      } else {
        console.error('Error setting up request:', error.message); // Debugging statement
        setErrorMessage(`Error: ${error.message}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 text-white p-8 rounded-md shadow-lg w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <label className="block mb-2 font-medium">Enter Metaverse Name</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="block w-full text-gray-300 rounded-md border border-gray-600 p-2 bg-gray-800"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Upload Image</label>
        <input
          type="file"
          name="image"
          onChange={handleChange}
          className="block w-full text-gray-300 rounded-md border border-gray-600 p-2 bg-gray-800"
          accept="image/*"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Metaverse Link</label>
        <input
          type="url"
          name="link"
          value={formData.link}
          onChange={handleChange}
          placeholder="Enter metaverse URL"
          className="block w-full text-gray-300 rounded-md border border-gray-600 p-2 bg-gray-800"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter a short description"
          className="block w-full text-gray-300 rounded-md border border-gray-600 p-2 bg-gray-800"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Active Members</label>
        <input
          type="number"
          name="activeMembers"
          value={formData.activeMembers}
          onChange={handleChange}
          placeholder="Enter count of active members"
          className="block w-full text-gray-300 rounded-md border border-gray-600 p-2 bg-gray-800"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Social Media Links</label>
        <div className="flex items-center mb-4">
          <input
            type="url"
            value={newSocialLink}
            onChange={(e) => setNewSocialLink(e.target.value)}
            placeholder="Enter a social media URL"
            className="block w-full text-gray-300 rounded-md border border-gray-600 p-2 bg-gray-800"
          />
          <button
            type="button"
            onClick={handleAddSocialLink}
            className="ml-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
          >
            Add
          </button>
        </div>
        <div className="space-y-2">
          {formData.socials.map((link, index) => (
            <div key={index} className="flex items-center justify-between">
              <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                {link}
              </a>
              <button
                type="button"
                onClick={() => handleRemoveSocialLink(index)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Category</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Enter category"
          className="block w-full text-gray-300 rounded-md border border-gray-600 p-2 bg-gray-800"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-medium">News Items</label>
        <div className="flex items-center mb-4">
          <input
            type="url"
            value={newNewsItem}
            onChange={(e) => setNewNewsItem(e.target.value)}
            placeholder="Enter a news item URL"
            className="block w-full text-gray-300 rounded-md border border-gray-600 p-2 bg-gray-800"
          />
          <button
            type="button"
            onClick={handleAddNewsItem}
            className="ml-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
          >
            Add
          </button>
        </div>
        <div className="space-y-2">
          {formData.news.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <a href={item} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                {item}
              </a>
              <button
                type="button"
                onClick={() => handleRemoveNewsItem(index)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 text-red-500 font-bold">
          {errorMessage}
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={handleReset}
          className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-md"
        >
          Reset
        </button>
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md"
        >
          Confirm and Save
        </button>
      </div>
    </form>
  );
};

export default ResponseForm;
