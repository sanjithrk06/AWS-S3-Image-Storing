import React, { useEffect, useState } from 'react';

const Home = () => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch feeds from the server
  const fetchFeeds = async () => {
    try {
      const response = await fetch('http://localhost:4001/feed');
      if (!response.ok) {
        throw new Error('Failed to fetch feeds');
      }
      const data = await response.json();
      setFeeds(data.feeds);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete feed by ID
  const deleteFeed = async (id) => {
    try {
      const response = await fetch(`http://localhost:4001/feed/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete feed');
      }
      // Remove the deleted feed from the state
      setFeeds(feeds.filter(feed => feed._id !== id));
    } catch (error) {
      console.error('Error deleting feed:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  if (loading) {
    return (
      <div className='text-center py-10'>
        <p className='text-lg'>Loading feeds...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center py-10'>
        <p className='text-lg text-red-600'>Error: {error}</p>
      </div>
    );
  }

  if (feeds.length === 0) {
    return (
      <div className='text-center py-10'>
        <p className='text-lg'>No Feeds found......</p>
      </div>
    );
  }

  return (
    <div className='text-center py-10'>
      <h1 className='text-2xl mb-6'>All Feeds</h1>
      <div className='mx-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7'>
        {feeds.map(feed => (
          <div key={feed._id} className='border p-4 rounded-xl bg-slate-200 shadow-md'>
            <h2 className='text-xl font-bold'>{feed.name}</h2>
            <p>{feed.desc}</p>
            <img src={`${feed.imgName}`} alt={feed.name} className='w-full rounded-xl h-64 object-cover mt-2' />
            {/* Delete Button */}
            <button
              onClick={() => deleteFeed(feed._id)}
              className='mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700'
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;